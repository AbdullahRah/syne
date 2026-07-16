// Hand-written row types mirroring supabase/migrations. Keep in sync with the
// schema (or generate with `supabase gen types typescript` later).

export type PlanTier = "starter" | "growth" | "multi";
export type ScreenStatus = "active" | "revoked";
export type MediaKind = "image" | "video" | "pdf_page";

export interface Business {
  id: string;
  owner_user_id: string;
  name: string;
  plan_tier: PlanTier;
  created_at: string;
}

export interface Location {
  id: string;
  business_id: string;
  name: string;
  address: string | null;
  created_at: string;
}

export interface Screen {
  id: string;
  business_id: string;
  location_id: string;
  name: string;
  display_token: string;
  status: ScreenStatus;
  content_version: number;
  last_pinged_at: string | null;
  created_at: string;
}

export interface Media {
  id: string;
  business_id: string;
  kind: MediaKind;
  storage_key: string;
  original_filename: string | null;
  duration_seconds: number | null;
  created_at: string;
}

export interface PlaylistItem {
  id: string;
  screen_id: string;
  media_id: string;
  position: number;
  display_seconds: number;
  created_at: string;
}

// Per-screen plan limits enforced at screen-creation time (spec §11, Phase 5).
export const PLAN_SCREEN_LIMITS: Record<PlanTier, number> = {
  starter: 3,
  growth: 10,
  multi: 30,
};
