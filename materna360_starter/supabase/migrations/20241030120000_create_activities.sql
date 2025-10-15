create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  emoji text not null,
  short_desc text not null,
  tags text[] default '{}',
  duration_min integer default 10,
  zero_material boolean default false,
  indoor boolean default true,
  age_min integer default 0,
  age_max integer default 6,
  created_at timestamptz default now(),
  constraint activities_title_unique unique (title)
);

alter table public.activities enable row level security;

create policy if not exists "Allow anon read activities" on public.activities
  for select
  to anon
  using (true);

create policy if not exists "Allow service role full access" on public.activities
  for all
  to service_role
  using (true)
  with check (true);
