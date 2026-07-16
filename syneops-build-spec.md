# syneOps — Digital Signage Build Spec & Implementation Plan

**Product:** Multi-tenant digital signage SaaS. Businesses upload images, video, and PDFs; content plays on an in-store TV via a private, per-screen URL; management happens from any phone or laptop.

**Build target:** Claude Code, working directly in this spec. Each phase below is scoped to be handed to Claude Code as a standalone task with clear acceptance criteria.

---

## 1. Scope

**MVP must ship with:**
- Multi-tenant auth (business owner signs up, owns locations + screens)
- Upload & manage images, video, PDF (PDF auto-converted to slide images)
- Playlist builder (order + per-item duration)
- One unguessable, revocable display URL per screen
- TV client that renders the playlist full-screen and self-updates without a reboot
- Dashboard usable from a phone browser, no app install
- Strict tenant isolation enforced at the database layer

**Explicitly deferred to Phase 2/3** (do not build into MVP, do not let scope creep in):
- Day-parting/scheduling engine
- Usage analytics
- Team roles / multi-user per business
- Stripe billing automation (MVP can be manually invoiced while you validate)
- Weather/news widgets, emergency broadcast override

This mirrors the Planq lesson: ship the narrow thing that works before layering on verticals.

---

## 2. Tech stack (chosen to stay free as long as possible)

| Layer | Choice | Why |
|---|---|---|
| Frontend + API | Next.js (App Router), TypeScript | Already your stack, deploys natively on Vercel |
| Hosting | Vercel **Pro** ($20/mo) | Hobby tier's ToS bars commercial/paid use — don't build a paid product on it, Vercel does enforce this |
| Auth + DB | Supabase (free tier to start) | Postgres + Auth + Row Level Security built in |
| Media storage | Cloudflare R2 | 10GB free storage, **no egress fees ever** — the single biggest cost saver for a video-heavy product |
| Realtime refresh | Plain HTTP polling (no websockets) | See §6 — avoids Supabase Realtime's concurrent-connection ceiling and keeps always-on TVs cheap |
| PDF→image conversion | `pdf-lib` / `pdfium` in a Vercel serverless function | No third-party conversion API cost |
| Billing (Phase 2) | Stripe | Already connected in your tools; no monthly fee, per-transaction only |
| Domain | `syneautonomous.cloud` subdomain (`display.syneautonomous.cloud`) | Already owned |

### Realistic monthly cost floor
| Item | Cost |
|---|---|
| Vercel Pro (required once you charge money) | $20/mo |
| Supabase | $0 until you outgrow free tier (500MB DB / 5GB egress) — then $25/mo |
| Cloudflare R2 | $0 up to 10GB stored + 10M reads/month |
| Stripe | 2.9% + $0.30 per transaction, no base fee |
| Domain | ~$1.25/mo amortized |
| **Total to start** | **~$21/mo**, scaling to ~$45–50/mo once Supabase Pro kicks in |

Be upfront with yourself: **$0/mo isn't achievable once you're legally charging customers**, because that requires leaving Vercel Hobby. $20–25/mo is the realistic floor, and your $29 Starter plan covers it from client #1.

---

## 3. Architecture overview

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Dashboard   │◄────►│  Next.js API      │◄────►│  Supabase         │
│  (phone/     │      │  routes (Vercel)  │      │  Postgres + Auth   │
│  laptop)     │      │                   │      │  + RLS policies    │
└─────────────┘      └───────┬──────────┘      └─────────────────┘
                              │
                              ▼
                     ┌──────────────────┐
                     │  Cloudflare R2     │
                     │  (private bucket,  │
                     │  signed URLs)      │
                     └──────────────────┘
                              ▲
                              │ signed media URLs
┌─────────────┐      ┌───────┴──────────┐
│  TV kiosk    │◄────►│  /s/[token] route  │
│  browser     │ poll │  (public, token-   │
│  (Fire TV /  │ 20s  │  scoped, read-only)│
│  Android box)│      └──────────────────┘
└─────────────┘
```

---

## 4. Data model

```sql
-- businesses: one row per client account
create table businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users not null,
  name text not null,
  plan_tier text not null default 'starter', -- starter | growth | multi
  created_at timestamptz default now()
);

-- locations: physical sites under a business
create table locations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) not null,
  name text not null,
  address text,
  created_at timestamptz default now()
);

-- screens: one per physical TV, holds the display token
create table screens (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) not null,
  location_id uuid references locations(id) not null,
  name text not null default 'Main display',
  display_token text unique not null, -- random 24+ char, generated at insert
  status text not null default 'active', -- active | revoked
  content_version bigint not null default 1, -- bumped on any playlist/media change
  last_pinged_at timestamptz,
  created_at timestamptz default now()
);
create index on screens (display_token);

-- media: uploaded assets, always scoped to a business
create table media (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) not null,
  kind text not null, -- image | video | pdf_page
  storage_key text not null, -- R2 object key, private
  original_filename text,
  duration_seconds int, -- for video; null defers to playlist item default
  created_at timestamptz default now()
);

-- playlist_items: ordered content per screen
create table playlist_items (
  id uuid primary key default gen_random_uuid(),
  screen_id uuid references screens(id) not null,
  media_id uuid references media(id) not null,
  position int not null,
  display_seconds int not null default 10,
  created_at timestamptz default now()
);
```

**Row Level Security — enforced, not optional:**

```sql
alter table businesses enable row level security;
alter table locations enable row level security;
alter table screens enable row level security;
alter table media enable row level security;
alter table playlist_items enable row level security;

-- Dashboard access: owner can only touch their own business's rows
create policy "owner full access" on businesses
  for all using (owner_user_id = auth.uid());

create policy "owner locations" on locations
  for all using (business_id in (select id from businesses where owner_user_id = auth.uid()));

-- repeat the same business_id-scoped pattern for screens, media, playlist_items
```

The public `/s/[token]` route uses the **Supabase service role key server-side only**, inside the Next.js route handler — never exposed to the browser. That route looks up exactly one `screens` row by `display_token`, then joins to that screen's `playlist_items` and `media`. It never runs as an authenticated user, and it never has a code path that lists more than one screen. This is the enforcement boundary discussed earlier — the token is the credential, and the query shape itself makes cross-tenant leakage structurally impossible, not just unlikely.

---

## 5. Token & URL provisioning

- Generate with `nanoid(24)` or `crypto.randomUUID()` at screen creation — never sequential, never derived from business name.
- URL shape: `https://display.syneautonomous.cloud/s/{token}`
- **Revocation:** dashboard "Reset display link" button sets `status='revoked'` on the old token and inserts a fresh one on the same screen row. Old URL immediately 404s.
- **One token per screen, never per business** — losing one TV's link never exposes a client's other locations.
- The `/s/[token]` route checks `status='active'` before returning anything.

---

## 6. Live update mechanism (polling, not websockets)

Supabase Realtime's free tier caps concurrent connections (200), and TVs are always-on — every screen you deploy would permanently occupy one of those slots. Polling avoids that ceiling entirely and is simpler to debug on flaky in-store wifi.

**Design:**
- TV client (a plain browser tab in kiosk mode) loads `/s/[token]`, which server-renders the current playlist + a `content_version` number.
- Client-side JS polls a lightweight endpoint every 20–30 seconds: `GET /api/s/[token]/version` → returns `{ content_version }`.
- If the returned version differs from what's loaded, the client re-fetches the full playlist and swaps content — no reboot, no manual refresh.
- Any dashboard action that changes a screen's playlist increments that screen's `content_version` in the same transaction.

This keeps every TV's ongoing cost to one small JSON request every 20–30 seconds — trivial against Vercel Pro's function allowance even at dozens of screens.

---

## 7. Media pipeline

1. Dashboard requests a signed **upload** URL from R2 (via API route) scoped to `business_id/media_id`.
2. Browser uploads directly to R2 (never through your server — saves function time/bandwidth).
3. If the file is a PDF: a serverless function converts each page to a JPEG/PNG (using `pdfium`), uploads each page as its own `media` row of kind `pdf_page`, in order.
4. Playback: the `/s/[token]` route generates **short-lived signed GET URLs** (e.g., 1-hour expiry) for whatever media that screen's playlist references — never a public bucket URL. The TV client refreshes these whenever it re-polls.

---

## 8. TV client behavior

- A single static page at `/s/[token]`, designed for a Fire TV Stick / Android box running **Fully Kiosk Browser** pointed at that URL.
- Full-screen, no chrome, no scrollbars, auto-loops the playlist.
- On network loss: keep showing the last successfully loaded playlist (cache in memory) rather than going blank — don't let a wifi blip black out someone's TV.
- On `status='revoked'` or token not found: friendly full-screen "This display isn't configured" message, not a raw 404.

---

## 9. Repo structure

```
/app
  /(dashboard)
    /login
    /locations
    /screens/[id]
    /media
  /s/[token]/page.tsx          -- public TV display route
  /api
    /s/[token]/version/route.ts
    /media/upload-url/route.ts
    /media/convert-pdf/route.ts
    /screens/[id]/reset-token/route.ts
/lib
  /supabase (server + client clients)
  /r2 (signed URL helpers)
  /pdf (conversion helper)
/components
  (syneOps design system components — reuse the existing UI kit + brand tokens in this repo)
```

---

## 10. Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-only, never shipped to client
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
DISPLAY_BASE_URL=https://display.syneautonomous.cloud
```

---

## 11. Phased build plan for Claude Code

Hand these phases to Claude Code one at a time. Each has a clear "done" state so you can test before moving on.

### Phase 0 — Scaffold
- Next.js App Router + TypeScript project, syneOps design tokens wired in (font imports, color variables from the existing brand kit in this repo)
- Supabase project created, schema from §4 migrated, RLS policies from §4 applied
- R2 bucket created, private, CORS configured for direct browser upload
- **Done when:** `npm run dev` runs, Supabase client connects, a test row can be inserted and RLS blocks a second test user from reading it.

### Phase 1 — Auth & business setup
- Supabase Auth email/password (or magic link) sign-up/login
- On first login, create a `businesses` row owned by that user
- Dashboard shell: list locations, create a location
- **Done when:** two separate test accounts can each create a business and neither can see the other's data (manually verify via the dashboard, not just trust RLS).

### Phase 2 — Screens & token provisioning
- Create screen under a location → generates `display_token` per §5
- Dashboard shows the full display URL with a copy button
- "Reset display link" action implemented
- **Done when:** visiting `/s/{token}` for a fresh screen renders an empty-playlist state; resetting the token immediately breaks the old URL.

### Phase 3 — Media upload & playlist builder
- Signed upload flow to R2 (§7, step 1–2)
- Image and video upload working end-to-end
- PDF upload triggers page-conversion function, stores each page as `media`
- Drag-to-reorder playlist UI, per-item duration field
- Saving playlist bumps `content_version` on that screen
- **Done when:** uploading a PDF produces the right number of page-images in order, and the playlist can be reordered and saved.

### Phase 4 — TV display client
- `/s/[token]` renders playlist full-screen, advances automatically per `display_seconds`
- Polling logic from §6 implemented, swaps content on version change without reload
- Offline-hold behavior (keep last good content on fetch failure)
- Revoked/missing token shows the friendly fallback screen
- **Done when:** you can load the URL on an actual Fire TV Stick, change the playlist from your phone, and watch it update within 30 seconds with no manual refresh.

### Phase 5 — Manual billing pass (pre-Stripe)
- Plan tier stored on `businesses.plan_tier`, enforced as a simple limit (e.g., screens count vs tier) in the screen-creation API route
- No Stripe integration yet — invoice manually while validating with your first few clients
- **Done when:** creating a 4th screen on a Starter-tier business is blocked with a clear upgrade message.

### Phase 6 — Stripe billing (once you have 2–3 paying clients)
- Stripe Checkout for the three tiers from the proposal ($29/$59/$99)
- Webhook updates `businesses.plan_tier` on successful subscription
- **Done when:** a test subscription flows through Checkout and updates the tier without manual intervention.

### Phase 7 — Polish for first real deployment
- Kiosk setup doc (Fully Kiosk Browser config, autostart, screen timeout disabled)
- Dashboard mobile responsiveness pass
- Error states audited (expired signed URL mid-playback, empty playlist, revoked token)

---

## 12. Pre-launch QA checklist

- [ ] Two test businesses, verify zero cross-visibility in dashboard and in `/s/[token]` responses
- [ ] Token reset immediately invalidates the old URL
- [ ] Signed media URLs expire and regenerate correctly on TV re-poll
- [ ] TV client survives a wifi drop without going blank
- [ ] PDF with 10+ pages converts and orders correctly
- [ ] Playlist reorder persists and reflects on TV within one poll cycle
- [ ] No API route ever returns more than one screen's data for a given token

---

*This spec assumes the isolation model discussed for the signage product — random per-screen tokens, business_id scoping enforced via RLS, and signed short-lived media URLs. Keep that boundary intact through every phase; it's the difference between a real multi-tenant SaaS and a liability.*
