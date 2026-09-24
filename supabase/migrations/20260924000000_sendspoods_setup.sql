-- Applied to the Urban Exposed Supabase project (uupdhdyxlppntfxmmwct) on 2026-09-24.
-- Everything is prefixed spood_ / bucket "spoods" and is independent of Urban Exposed's
-- own tables and buckets. Kept here as a record of what the live site relies on.

create table public.spood_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 60),
  species text not null default 'Mystery spood' check (char_length(species) between 1 and 80),
  where_found text not null default 'somewhere glorious' check (char_length(where_found) between 1 and 140),
  vibes text[] not null default '{}' check (cardinality(vibes) <= 5),
  filter_tags text not null default 'all' check (char_length(filter_tags) <= 40),
  photo_path text not null check (photo_path ~ '^uploads/[0-9a-f-]{36}\.(jpg|png|webp|gif)$'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  boops integer not null default 0 check (boops >= 0),
  featured_story text check (char_length(featured_story) <= 400)
);

comment on table public.spood_submissions is
  'sendspoods.com submissions. Change status to approved to show a spood on the site.';

alter table public.spood_submissions enable row level security;

create policy "sendspoods: anyone can submit a spood"
  on public.spood_submissions for insert to anon, authenticated
  with check (
    status = 'pending'
    and boops = 0
    and featured_story is null
    and created_at > now() - interval '5 minutes'
  );

create policy "sendspoods: anyone can see approved spoods"
  on public.spood_submissions for select to anon, authenticated
  using (status = 'approved');

-- One row per boop, used for rate limiting and "boops today". No direct access.
create table public.spood_boops (
  id bigint generated always as identity primary key,
  submission_id uuid not null references public.spood_submissions(id) on delete cascade,
  voter text not null,
  created_at timestamptz not null default now()
);
create index spood_boops_lookup on public.spood_boops (submission_id, voter, created_at);
create index spood_boops_recent on public.spood_boops (created_at);
alter table public.spood_boops enable row level security;

-- Boop an approved spood. At most 30 boops per spood per visitor per day.
create function public.spood_boop(p_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_voter text;
  v_recent integer;
  v_boops integer;
begin
  v_voter := md5(coalesce(
    nullif(trim(split_part(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ',', 1)), ''),
    'unknown'));

  select boops into v_boops from spood_submissions where id = p_id and status = 'approved';
  if not found then
    raise exception 'spood not found';
  end if;

  select count(*) into v_recent from spood_boops
   where submission_id = p_id and voter = v_voter and created_at > now() - interval '1 day';
  if v_recent >= 30 then
    return v_boops;
  end if;

  insert into spood_boops (submission_id, voter) values (p_id, v_voter);
  update spood_submissions set boops = boops + 1 where id = p_id returning boops into v_boops;
  return v_boops;
end;
$$;

-- Spood of the Day: most boops in the last 24 hours, then most boops overall.
create function public.spood_of_the_day()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select s.id
    from spood_submissions s
    left join spood_boops b on b.submission_id = s.id and b.created_at > now() - interval '1 day'
   where s.status = 'approved'
   group by s.id, s.boops, s.created_at
   order by count(b.id) desc, s.boops desc, s.created_at desc
   limit 1
$$;

revoke all on function public.spood_boop(uuid) from public;
revoke all on function public.spood_of_the_day() from public;
grant execute on function public.spood_boop(uuid) to anon, authenticated;
grant execute on function public.spood_of_the_day() to anon, authenticated;

-- Photos: private bucket; anyone may upload into uploads/, only approved photos can be viewed.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('spoods', 'spoods', false, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

create policy "sendspoods: anyone can upload a spood photo"
  on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'spoods' and (storage.foldername(name))[1] = 'uploads');

create policy "sendspoods: approved spood photos are viewable"
  on storage.objects for select to anon, authenticated
  using (
    bucket_id = 'spoods'
    and exists (
      select 1 from public.spood_submissions s
       where s.photo_path = storage.objects.name and s.status = 'approved'
    )
  );
