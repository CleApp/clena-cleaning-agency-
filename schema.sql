-- Run this in Supabase > SQL Editor
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200),
  phone text not null check (char_length(phone) between 7 and 40),
  service text,
  estimate numeric,
  preferred_date date,
  note text check (char_length(note) <= 1000),
  status text not null default 'new' check (status in ('new','confirmed','done','cancelled'))
);

alter table bookings enable row level security;

-- Customers (anonymous) can only create bookings, never read them
create policy "public can book" on bookings for insert to anon
  with check (status = 'new');

-- Signed-in staff can read and update
create policy "staff can read"   on bookings for select to authenticated using (true);
create policy "staff can update" on bookings for update to authenticated using (true) with check (true);

-- Live updates for the dashboard
alter publication supabase_realtime add table bookings;
