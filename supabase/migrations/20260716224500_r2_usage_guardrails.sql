-- R2 free-tier guardrails. We must never cross Cloudflare R2's free limits:
--   Storage        10 GB/month     ($0.015/GB-month overage)
--   Class A ops     1,000,000/mo   ($4.50/million overage)  -- writes/uploads/lists
--   Class B ops    10,000,000/mo   ($0.36/million overage)  -- reads (GET/HEAD)
-- Storage + Class A are enforced server-side (see lib/limits.ts). Class B ops
-- happen directly between the TV browser and R2 and can't be counted here;
-- the display design minimizes them (re-fetch only on content change).

-- Byte size per stored object → lets us sum total storage.
alter table media add column if not exists bytes bigint not null default 0;

-- Global monthly Class A counter. Service-role only (no RLS policies granted).
create table if not exists r2_usage (
  period text primary key,          -- 'YYYY-MM' (UTC)
  class_a bigint not null default 0,
  updated_at timestamptz default now()
);
alter table r2_usage enable row level security;

-- Atomic Class A increment.
create or replace function increment_r2_class_a(p_period text, p_n int)
returns void
language sql
security definer
as $$
  insert into r2_usage (period, class_a, updated_at)
  values (p_period, p_n, now())
  on conflict (period) do update
    set class_a = r2_usage.class_a + p_n, updated_at = now();
$$;

-- Current total bytes stored across all businesses.
create or replace function total_media_bytes()
returns bigint
language sql
security definer
stable
as $$
  select coalesce(sum(bytes), 0)::bigint from media;
$$;
