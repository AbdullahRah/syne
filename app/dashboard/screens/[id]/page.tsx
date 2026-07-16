import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CopyField } from "@/components/dashboard/copy-field";
import { PlaylistBuilder } from "@/components/dashboard/playlist-builder";
import type { Media, Screen } from "@/lib/types";

export const dynamic = "force-dynamic";

function displayUrl(token: string) {
  const base = process.env.DISPLAY_BASE_URL || "";
  return `${base}/s/${token}`;
}

export default async function ScreenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // RLS: returns the screen only if the caller owns it.
  const { data: screen } = await supabase
    .from("screens")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!screen) notFound();
  const s = screen as Screen;

  const { data: mediaRows } = await supabase
    .from("media")
    .select("id, kind, original_filename")
    .order("created_at", { ascending: false });

  const { data: playlistRows } = await supabase
    .from("playlist_items")
    .select("media_id, display_seconds, position")
    .eq("screen_id", id)
    .order("position", { ascending: true });

  const media = (mediaRows ?? []) as Pick<
    Media,
    "id" | "kind" | "original_filename"
  >[];
  const initialItems = (playlistRows ?? []).map((r) => ({
    media_id: r.media_id,
    display_seconds: r.display_seconds,
  }));

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          All screens
        </a>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-display tracking-tight">{s.name}</h1>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              s.status === "active"
                ? "bg-green-500/10 text-green-700"
                : "bg-red-500/10 text-red-700"
            }`}
          >
            {s.status}
          </span>
        </div>
        <div className="mt-3 max-w-xl">
          <CopyField value={displayUrl(s.display_token)} />
        </div>
      </div>

      <PlaylistBuilder screenId={s.id} media={media} initialItems={initialItems} />
    </div>
  );
}
