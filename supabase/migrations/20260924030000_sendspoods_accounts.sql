-- Applied to the Urban Exposed Supabase project on 2026-09-24.
-- sendspoods accounts: one unique spood-sender name per signed-in person.
create table public.spood_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  handle text not null check (handle ~ '^[a-z0-9_]{2,24}$'),
  created_at timestamptz not null default now()
);
create unique index spood_profiles_handle_key on public.spood_profiles (handle);
alter table public.spood_profiles enable row level security;

create policy "sendspoods: sender names are public"
  on public.spood_profiles for select to anon, authenticated using (true);
create policy "sendspoods: claim your own sender name"
  on public.spood_profiles for insert to authenticated
  with check (id = (select auth.uid()) and created_at > now() - interval '5 minutes');

alter table public.spood_submissions add column user_id uuid references auth.users (id) on delete set null;
create index spood_submissions_user on public.spood_submissions (user_id);

drop policy "sendspoods: anyone can submit a spood" on public.spood_submissions;
create policy "sendspoods: anyone can submit a spood"
  on public.spood_submissions for insert to anon, authenticated
  with check (
    status = 'pending'
    and boops = 0
    and featured_story is null
    and created_at > now() - interval '5 minutes'
    and (
      (user_id is null and sender_handle is null)
      or (
        user_id = (select auth.uid())
        and sender_handle = (select p.handle from public.spood_profiles p where p.id = (select auth.uid()))
      )
    )
  );

create policy "sendspoods: senders see their own spoods"
  on public.spood_submissions for select to authenticated
  using (user_id = (select auth.uid()));

create policy "sendspoods: senders see their own spood photos"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'spoods'
    and exists (
      select 1 from public.spood_submissions s
       where s.photo_path = storage.objects.name and s.user_id = (select auth.uid())
    )
  );
