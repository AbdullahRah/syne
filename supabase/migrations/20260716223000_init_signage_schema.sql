-- syneOps digital signage — initial schema + RLS
-- See syneops-build-spec.md §4. Tenant isolation is enforced here, not optional.

-- ─────────────────────────────────────────────────────────────
-- Tables
-- ─────────────────────────────────────────────────────────────

-- businesses: one row per client account
create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users not null,
  name text not null,
  plan_tier text not null default 'starter', -- starter | growth | multi
  created_at timestamptz default now()
);

-- locations: physical sites under a business
create table if not exists locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  address text,
  created_at timestamptz default now()
);

-- screens: one per physical TV, holds the display token
create table if not exists screens (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  location_id uuid references locations(id) on delete cascade not null,
  name text not null default 'Main display',
  display_token text unique not null,   -- random 24+ char, generated at insert
  status text not null default 'active', -- active | revoked
  content_version bigint not null default 1, -- bumped on any playlist/media change
  last_pinged_at timestamptz,
  created_at timestamptz default now()
);
create index if not exists screens_display_token_idx on screens (display_token);

-- media: uploaded assets, always scoped to a business
create table if not exists media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  kind text not null,          -- image | video | pdf_page
  storage_key text not null,   -- R2 object key, private
  original_filename text,
  duration_seconds int,        -- for video; null defers to playlist item default
  created_at timestamptz default now()
);

-- playlist_items: ordered content per screen
create table if not exists playlist_items (
  id uuid primary key default gen_random_uuid(),
  screen_id uuid references screens(id) on delete cascade not null,
  media_id uuid references media(id) on delete cascade not null,
  position int not null,
  display_seconds int not null default 10,
  created_at timestamptz default now()
);
create index if not exists playlist_items_screen_id_idx on playlist_items (screen_id);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security — enforced, not optional
-- ─────────────────────────────────────────────────────────────

alter table businesses     enable row level security;
alter table locations      enable row level security;
alter table screens        enable row level security;
alter table media          enable row level security;
alter table playlist_items enable row level security;

-- Owner can only touch their own business's rows.
create policy "owner full access" on businesses
  for all
  using (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

create policy "owner locations" on locations
  for all
  using (business_id in (select id from businesses where owner_user_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_user_id = auth.uid()));

create policy "owner screens" on screens
  for all
  using (business_id in (select id from businesses where owner_user_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_user_id = auth.uid()));

create policy "owner media" on media
  for all
  using (business_id in (select id from businesses where owner_user_id = auth.uid()))
  with check (business_id in (select id from businesses where owner_user_id = auth.uid()));

create policy "owner playlist_items" on playlist_items
  for all
  using (
    screen_id in (
      select s.id from screens s
      join businesses b on b.id = s.business_id
      where b.owner_user_id = auth.uid()
    )
  )
  with check (
    screen_id in (
      select s.id from screens s
      join businesses b on b.id = s.business_id
      where b.owner_user_id = auth.uid()
    )
  );

-- NOTE: the public /s/[token] TV route reads through the service_role key
-- server-side only, looking up exactly one screen by display_token. It never
-- runs as an authenticated user and never lists more than one screen — the
-- query shape itself makes cross-tenant leakage structurally impossible.
