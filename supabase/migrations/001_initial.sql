-- Attic schema — safe to re-run (idempotent)

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('listener', 'artist');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'listener',
  avatar_url text,
  bio text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  slug text not null unique,
  name text not null,
  intro text,
  genre text,
  curated_category text,
  photo_path text,
  featured_video_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.artists (id) on delete cascade,
  slug text not null unique,
  title text not null,
  intro text,
  cover_path text,
  featured_video_url text,
  min_price_cents integer not null check (min_price_cents >= 0),
  currency text not null default 'USD',
  release_date date,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracks (
  id uuid primary key default gen_random_uuid(),
  album_id uuid not null references public.albums (id) on delete cascade,
  title text not null,
  track_number integer not null check (track_number > 0),
  duration_seconds integer,
  preview_path text,
  audio_path text,
  min_price_cents integer,
  created_at timestamptz not null default now(),
  unique (album_id, track_number)
);

create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  album_id uuid not null references public.albums (id) on delete restrict,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD',
  created_at timestamptz not null default now(),
  unique (buyer_id, album_id)
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  is_public boolean not null default false,
  share_token text unique default encode(gen_random_bytes(12), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists (id) on delete cascade,
  track_id uuid not null references public.tracks (id) on delete cascade,
  position integer not null default 0,
  added_at timestamptz not null default now(),
  unique (playlist_id, track_id)
);

create table if not exists public.bulletin_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  kind text not null default 'update'
    check (kind in ('new_artist', 'new_release', 'trending', 'update', 'editorial')),
  href text,
  published_at timestamptz not null default now(),
  is_published boolean not null default true
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  chosen_role public.user_role;
begin
  chosen_role := coalesce(
    (new.raw_user_meta_data ->> 'role')::public.user_role,
    'listener'
  );

  insert into public.profiles (id, email, display_name, role, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    chosen_role,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  if chosen_role = 'artist' then
    insert into public.artists (profile_id, slug, name)
    values (
      new.id,
      lower(regexp_replace(coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)), '[^a-zA-Z0-9]+', '-', 'g'))
        || '-' || substr(new.id::text, 1, 8),
      coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1))
    )
    on conflict (profile_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists artists_updated_at on public.artists;
create trigger artists_updated_at before update on public.artists
  for each row execute function public.set_updated_at();

drop trigger if exists albums_updated_at on public.albums;
create trigger albums_updated_at before update on public.albums
  for each row execute function public.set_updated_at();

drop trigger if exists playlists_updated_at on public.playlists;
create trigger playlists_updated_at before update on public.playlists
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.artists enable row level security;
alter table public.albums enable row level security;
alter table public.tracks enable row level security;
alter table public.purchases enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.bulletin_posts enable row level security;

drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Published artists are public" on public.artists;
create policy "Published artists are public"
  on public.artists for select using (is_published = true or profile_id = auth.uid());

drop policy if exists "Artists manage own row" on public.artists;
create policy "Artists manage own row"
  on public.artists for update to authenticated
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

drop policy if exists "Published albums are public" on public.albums;
create policy "Published albums are public"
  on public.albums for select using (
    is_published = true
    or artist_id in (select id from public.artists where profile_id = auth.uid())
  );

drop policy if exists "Artists insert albums" on public.albums;
create policy "Artists insert albums"
  on public.albums for insert to authenticated
  with check (
    artist_id in (select id from public.artists where profile_id = auth.uid())
  );

drop policy if exists "Artists update albums" on public.albums;
create policy "Artists update albums"
  on public.albums for update to authenticated
  using (artist_id in (select id from public.artists where profile_id = auth.uid()))
  with check (artist_id in (select id from public.artists where profile_id = auth.uid()));

drop policy if exists "Tracks of visible albums are readable" on public.tracks;
create policy "Tracks of visible albums are readable"
  on public.tracks for select using (
    album_id in (select id from public.albums)
  );

drop policy if exists "Artists manage tracks" on public.tracks;
create policy "Artists manage tracks"
  on public.tracks for all to authenticated
  using (
    album_id in (
      select a.id from public.albums a
      join public.artists ar on ar.id = a.artist_id
      where ar.profile_id = auth.uid()
    )
  )
  with check (
    album_id in (
      select a.id from public.albums a
      join public.artists ar on ar.id = a.artist_id
      where ar.profile_id = auth.uid()
    )
  );

drop policy if exists "Buyers see own purchases" on public.purchases;
create policy "Buyers see own purchases"
  on public.purchases for select to authenticated
  using (buyer_id = auth.uid());

drop policy if exists "Buyers create purchases" on public.purchases;
create policy "Buyers create purchases"
  on public.purchases for insert to authenticated
  with check (buyer_id = auth.uid());

drop policy if exists "Owners manage playlists" on public.playlists;
create policy "Owners manage playlists"
  on public.playlists for all to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "Public playlists readable" on public.playlists;
create policy "Public playlists readable"
  on public.playlists for select using (is_public = true or owner_id = auth.uid());

drop policy if exists "Playlist tracks follow playlist access" on public.playlist_tracks;
create policy "Playlist tracks follow playlist access"
  on public.playlist_tracks for select using (
    playlist_id in (select id from public.playlists)
  );

drop policy if exists "Owners manage playlist tracks" on public.playlist_tracks;
create policy "Owners manage playlist tracks"
  on public.playlist_tracks for all to authenticated
  using (
    playlist_id in (select id from public.playlists where owner_id = auth.uid())
  )
  with check (
    playlist_id in (select id from public.playlists where owner_id = auth.uid())
  );

drop policy if exists "Published bulletin is public" on public.bulletin_posts;
create policy "Published bulletin is public"
  on public.bulletin_posts for select using (is_published = true);

insert into storage.buckets (id, name, public)
values
  ('cover-art', 'cover-art', true),
  ('artist-photos', 'artist-photos', true),
  ('audio-previews', 'audio-previews', true),
  ('audio-masters', 'audio-masters', false)
on conflict (id) do nothing;

drop policy if exists "Public read cover art" on storage.objects;
create policy "Public read cover art"
  on storage.objects for select using (bucket_id = 'cover-art');

drop policy if exists "Public read artist photos" on storage.objects;
create policy "Public read artist photos"
  on storage.objects for select using (bucket_id = 'artist-photos');

drop policy if exists "Public read audio previews" on storage.objects;
create policy "Public read audio previews"
  on storage.objects for select using (bucket_id = 'audio-previews');

drop policy if exists "Owners read masters" on storage.objects;
create policy "Owners read masters"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'audio-masters'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.purchases p
        join public.albums a on a.id = p.album_id
        where p.buyer_id = auth.uid()
          and a.id::text = (storage.foldername(name))[2]
      )
    )
  );

drop policy if exists "Artists upload media" on storage.objects;
create policy "Artists upload media"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('cover-art', 'artist-photos', 'audio-previews', 'audio-masters')
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "Artists update own media" on storage.objects;
create policy "Artists update own media"
  on storage.objects for update to authenticated
  using (auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "Artists delete own media" on storage.objects;
create policy "Artists delete own media"
  on storage.objects for delete to authenticated
  using (auth.uid()::text = (storage.foldername(name))[1]);
