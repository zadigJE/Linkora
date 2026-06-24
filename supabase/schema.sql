create extension if not exists "pgcrypto";

grant usage on schema public to anon, authenticated;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text,
  credits_remaining integer not null default 1,
  is_pro boolean not null default false,
  plan text not null default 'free',
  updated_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now()
);

alter table public.profiles
add column if not exists username text;

alter table public.profiles
add column if not exists plan text not null default 'free';

alter table public.profiles
add column if not exists updated_at timestamp with time zone not null default now();

alter table public.profiles
alter column credits_remaining set default 1;

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity text not null,
  generated_post text not null,
  created_at timestamp with time zone not null default now()
);

alter table public.profiles enable row level security;
alter table public.generations enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.generations to authenticated;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can read own generations" on public.generations;
create policy "Users can read own generations"
on public.generations
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can create own generations" on public.generations;
create policy "Users can create own generations"
on public.generations
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own generations" on public.generations;
create policy "Users can update own generations"
on public.generations
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own generations" on public.generations;
create policy "Users can delete own generations"
on public.generations
for delete
to authenticated
using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, username, credits_remaining, is_pro, plan)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    1,
    false,
    'free'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.set_profile_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profile_updated_at on public.profiles;
create trigger set_profile_updated_at
before update on public.profiles
for each row execute function public.set_profile_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
