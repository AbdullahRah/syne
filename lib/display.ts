import { createAdminClient } from "@/lib/supabase/server";
import { signDownloadUrl } from "@/lib/r2";
import type { MediaKind } from "@/lib/types";

/**
 * Server-only loader for the public TV display route. Looks up EXACTLY ONE
 * screen by its display_token via the service-role client, then joins to that
 * screen's playlist. There is deliberately no code path here that lists more
 * than one screen — the query shape makes cross-tenant leakage impossible.
 */

export interface DisplayItem {
  id: string;
  kind: MediaKind;
  url: string; // short-lived signed R2 URL
  displaySeconds: number;
}

export interface DisplayPayload {
  status: "active" | "revoked" | "not_found";
  screenName: string | null;
  contentVersion: number;
  items: DisplayItem[];
}

export async function loadDisplay(token: string): Promise<DisplayPayload> {
  const admin = createAdminClient();

  const { data: screen } = await admin
    .from("screens")
    .select("id, name, status, content_version")
    .eq("display_token", token)
    .maybeSingle();

  if (!screen) {
    return { status: "not_found", screenName: null, contentVersion: 0, items: [] };
  }
  if (screen.status !== "active") {
    return {
      status: "revoked",
      screenName: screen.name,
      contentVersion: screen.content_version,
      items: [],
    };
  }

  const { data: rows } = await admin
    .from("playlist_items")
    .select("id, display_seconds, position, media:media_id ( kind, storage_key )")
    .eq("screen_id", screen.id)
    .order("position", { ascending: true });

  const items: DisplayItem[] = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rows ?? []).map(async (row: any) => ({
      id: row.id,
      kind: row.media.kind as MediaKind,
      displaySeconds: row.display_seconds,
      url: await signDownloadUrl(row.media.storage_key),
    })),
  );

  // Best-effort liveness ping; never block rendering on it.
  admin
    .from("screens")
    .update({ last_pinged_at: new Date().toISOString() })
    .eq("id", screen.id)
    .then(() => {}, () => {});

  return {
    status: "active",
    screenName: screen.name,
    contentVersion: screen.content_version,
    items,
  };
}
