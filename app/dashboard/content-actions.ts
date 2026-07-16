"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteObject } from "@/lib/r2";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return supabase;
}

async function bumpVersion(
  supabase: Awaited<ReturnType<typeof createClient>>,
  screenId: string,
) {
  const { data: s } = await supabase
    .from("screens")
    .select("content_version")
    .eq("id", screenId)
    .maybeSingle();
  if (s) {
    await supabase
      .from("screens")
      .update({ content_version: (s.content_version ?? 1) + 1 })
      .eq("id", screenId);
  }
}

export interface PlaylistInput {
  media_id: string;
  display_seconds: number;
}

/** Rewrite a screen's playlist in order and bump its content_version. */
export async function savePlaylist(screenId: string, items: PlaylistInput[]) {
  const supabase = await requireUser();

  // RLS: only returns the screen if the caller owns it.
  const { data: screen } = await supabase
    .from("screens")
    .select("id")
    .eq("id", screenId)
    .maybeSingle();
  if (!screen) return { ok: false, error: "Screen not found." };

  await supabase.from("playlist_items").delete().eq("screen_id", screenId);

  if (items.length > 0) {
    const rows = items.map((it, idx) => ({
      screen_id: screenId,
      media_id: it.media_id,
      position: idx,
      display_seconds: Math.max(1, Math.floor(it.display_seconds) || 10),
    }));
    const { error } = await supabase.from("playlist_items").insert(rows);
    if (error) return { ok: false, error: "Could not save playlist." };
  }

  await bumpVersion(supabase, screenId);
  revalidatePath(`/dashboard/screens/${screenId}`);
  return { ok: true };
}

/** Delete a media object from R2 + DB, and refresh any screens that used it. */
export async function deleteMedia(mediaId: string) {
  const supabase = await requireUser();

  const { data: media } = await supabase
    .from("media")
    .select("id, storage_key")
    .eq("id", mediaId)
    .maybeSingle();
  if (!media) return { ok: false };

  // Screens referencing this media need a version bump so their TVs refresh.
  const { data: refs } = await supabase
    .from("playlist_items")
    .select("screen_id")
    .eq("media_id", mediaId);

  // Deleting the media row cascades its playlist_items (FK on delete cascade).
  await supabase.from("media").delete().eq("id", mediaId);

  try {
    await deleteObject(media.storage_key); // DeleteObject is free on R2
  } catch {
    // object may not exist (failed upload); DB row is already gone
  }

  const screenIds = [...new Set((refs ?? []).map((r) => r.screen_id))];
  for (const sid of screenIds) await bumpVersion(supabase, sid);

  revalidatePath("/dashboard");
  return { ok: true };
}
