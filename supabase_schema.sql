
-- 1. Profiles Table (延伸 auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  full_name text,
  role text default 'owner' check (role in ('owner', 'provider', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Providers Table (美容師專用資料)
create table public.providers (
  id uuid references public.profiles(id) not null primary key,
  bio text,
  years_experience integer,
  service_area text[], -- 服務區域 e.g. ['信義區', '大安區']
  rating numeric default 5.0,
  is_verified boolean default false,
  portfolio_images text[]
);

-- 3. Modify Bookings Table (關聯到 User)
alter table public.bookings add column user_id uuid references auth.users(id);
alter table public.bookings add column provider_id uuid references public.providers(id);
alter table public.bookings add column price integer;

-- 4. RLS Policies (安全性設定)
alter table public.profiles enable row level security;
alter table public.providers enable row level security;

-- Profiles: 讓用戶可以讀取公開資料，只能修改自己的資料
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Providers: 公開讀取
create policy "Providers are viewable by everyone" on public.providers for select using (true);
create policy "Providers can update own info" on public.providers for update using (auth.uid() = id);

-- Bookings: 只能看自己的訂單
create policy "Users can see own bookings" on public.bookings for select using (auth.uid() = user_id or auth.uid() = provider_id);
