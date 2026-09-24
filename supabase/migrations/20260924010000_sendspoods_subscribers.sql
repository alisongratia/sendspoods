-- Applied to the Urban Exposed Supabase project on 2026-09-24.
-- sendspoods email list ("Spood Mail"), separate from Urban Exposed's subscribers table.
create table public.spood_subscribers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254)
);
create unique index spood_subscribers_email_key on public.spood_subscribers (lower(email));

comment on table public.spood_subscribers is 'sendspoods.com Spood Mail sign-ups. Insert-only for the public.';

alter table public.spood_subscribers enable row level security;

create policy "sendspoods: anyone can join spood mail"
  on public.spood_subscribers for insert to anon, authenticated
  with check (created_at > now() - interval '5 minutes');
