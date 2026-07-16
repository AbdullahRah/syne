"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2, X } from "lucide-react";
import { MediaUploader } from "./media-uploader";
import { savePlaylist, deleteMedia } from "@/app/dashboard/content-actions";
import type { MediaKind } from "@/lib/types";

interface MediaLite {
  id: string;
  kind: MediaKind;
  original_filename: string | null;
}

interface PlaylistRow {
  media_id: string;
  display_seconds: number;
}

function label(m: MediaLite | undefined) {
  if (!m) return "(missing media)";
  return m.original_filename || `${m.kind} · ${m.id.slice(0, 8)}`;
}

function kindBadge(kind: MediaKind) {
  const text = kind === "pdf_page" ? "pdf" : kind;
  return (
    <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-foreground/10 text-muted-foreground">
      {text}
    </span>
  );
}

export function PlaylistBuilder({
  screenId,
  media,
  initialItems,
}: {
  screenId: string;
  media: MediaLite[];
  initialItems: PlaylistRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState<PlaylistRow[]>(initialItems);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaById = new Map(media.map((m) => [m.id, m]));
  const dirty =
    JSON.stringify(items) !== JSON.stringify(initialItems);

  function add(mediaId: string) {
    setItems((prev) => [...prev, { media_id: mediaId, display_seconds: 10 }]);
    setSaved(false);
  }
  function removeAt(i: number) {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    setSaved(false);
  }
  function move(i: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    setSaved(false);
  }
  function setDuration(i: number, seconds: number) {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, display_seconds: seconds } : it)),
    );
    setSaved(false);
  }
  function reorder(from: number, to: number) {
    if (from === to) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setSaved(false);
  }

  async function onSave() {
    setSaving(true);
    setError(null);
    const res = await savePlaylist(screenId, items);
    setSaving(false);
    if (res?.ok) {
      setSaved(true);
      router.refresh();
    } else {
      setError(res?.error || "Could not save.");
    }
  }

  async function onDeleteMedia(mediaId: string) {
    await deleteMedia(mediaId);
    setItems((prev) => prev.filter((it) => it.media_id !== mediaId));
    router.refresh();
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Media library */}
      <section className="rounded-lg border border-foreground/10">
        <div className="px-5 py-4 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="font-medium">Media library</h2>
          <MediaUploader />
        </div>
        <ul className="divide-y divide-foreground/5">
          {media.length === 0 && (
            <li className="px-5 py-6 text-sm text-muted-foreground">
              No media yet. Upload images, video, or a PDF to get started.
            </li>
          )}
          {media.map((m) => (
            <li key={m.id} className="px-5 py-3 flex items-center gap-3">
              {kindBadge(m.kind)}
              <span className="flex-1 truncate text-sm">{label(m)}</span>
              <button
                type="button"
                onClick={() => add(m.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Add to playlist"
                title="Add to playlist"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDeleteMedia(m.id)}
                className="text-muted-foreground hover:text-red-500 transition-colors"
                aria-label="Delete media"
                title="Delete permanently"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Playlist */}
      <section className="rounded-lg border border-foreground/10">
        <div className="px-5 py-4 border-b border-foreground/10 flex items-center justify-between">
          <h2 className="font-medium">Playlist</h2>
          <div className="flex items-center gap-3">
            {saved && !dirty && (
              <span className="text-xs text-green-600">Saved ✓</span>
            )}
            <button
              type="button"
              onClick={onSave}
              disabled={saving || !dirty}
              className="rounded-full bg-foreground text-background text-sm px-4 py-2 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save playlist"}
            </button>
          </div>
        </div>

        {error && <p className="px-5 pt-3 text-xs text-red-500">{error}</p>}

        <ul>
          {items.length === 0 && (
            <li className="px-5 py-6 text-sm text-muted-foreground">
              Empty. Add media from the library — the TV will loop items top to bottom.
            </li>
          )}
          {items.map((it, i) => {
            const m = mediaById.get(it.media_id);
            return (
              <li
                key={`${it.media_id}-${i}`}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null) reorder(dragIndex, i);
                  setDragIndex(null);
                }}
                className="px-5 py-3 flex items-center gap-3 border-t border-foreground/5 bg-background"
              >
                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab shrink-0" />
                <span className="w-5 text-xs text-muted-foreground shrink-0">{i + 1}</span>
                {m && kindBadge(m.kind)}
                <span className="flex-1 truncate text-sm">{label(m)}</span>

                <div className="flex items-center gap-1 shrink-0">
                  <input
                    type="number"
                    min={1}
                    value={it.display_seconds}
                    onChange={(e) => setDuration(i, Number(e.target.value))}
                    className="w-16 rounded border border-foreground/15 bg-transparent px-2 py-1 text-sm"
                    aria-label="Seconds on screen"
                  />
                  <span className="text-xs text-muted-foreground mr-1">s</span>
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={i === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    className="text-muted-foreground hover:text-foreground disabled:opacity-30"
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="text-muted-foreground hover:text-red-500"
                    aria-label="Remove from playlist"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
