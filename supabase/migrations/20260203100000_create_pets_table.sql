create table public.pets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  breed text,
  age int,
  weight numeric,
  notes text,
  created_at timestamp with time zone default now()
);

alter table public.pets enable row level security;

create policy "Users can view own pets"
  on public.pets for select
  using (auth.uid() = user_id);

create policy "Users can insert own pets"
  on public.pets for insert
  with check (auth.uid() = user_id);

create policy "Users can update own pets"
  on public.pets for update
  using (auth.uid() = user_id);

create policy "Users can delete own pets"
  on public.pets for delete
  using (auth.uid() = user_id);
