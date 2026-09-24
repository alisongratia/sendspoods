-- Applied to the Urban Exposed Supabase project on 2026-09-24.
-- Optional sender name so each sender can have a collection page (collection.html?by=<handle>).
alter table public.spood_submissions
  add column sender_handle text check (sender_handle ~ '^[a-z0-9_]{2,24}$');
create index spood_submissions_sender on public.spood_submissions (sender_handle) where status = 'approved';
