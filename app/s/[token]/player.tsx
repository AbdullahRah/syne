"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DisplayPayload, DisplayItem } from "@/lib/display";

const POLL_MS = 25_000;

export function DisplayPlayer({
  token,
  initial,
}: {
  token: string;
  initial: DisplayPayload;
}) {
  const [items, setItems] = useState<DisplayItem[]>(initial.items);
  const [index, setIndex] = useState(0);
  const versionRef = useRef(initial.contentVersion);

  // ── Advance through the playlist ────────────────────────────────
  useEffect(() => {
    if (items.length === 0) return;
    const current = items[index % items.length];
    const ms = Math.max(1, current.displaySeconds) * 1000;
    const t = setTimeout(() => setIndex((i) => i + 1), ms);
    return () => clearTimeout(t);
  }, [index, items]);

  // ── Poll for content changes; swap without reload ───────────────
  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/s/${token}/playlist`, { cache: "no-store" });
      if (!res.ok) return; // offline-hold: keep last good content
      const next: DisplayPayload = await res.json();
      if (next.status !== "active") {
        // Revoked/deleted mid-session — reload to show the fallback screen.
        window.location.reload();
        return;
      }
      versionRef.current = next.contentVersion;
      setItems(next.items);
      setIndex(0);
    } catch {
      // Network blip: hold the current content rather than going blank.
    }
  }, [token]);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/s/${token}/version`, { cache: "no-store" });
        if (!res.ok) return; // offline-hold
        const { content_version, status } = await res.json();
        if (status !== "active") {
          // Screen was revoked/removed — reload to show the fallback.
          window.location.reload();
          return;
        }
        if (typeof content_version === "number" && content_version !== versionRef.current) {
          await refresh();
        }
      } catch {
        // ignore; try again next tick
      }
    }, POLL_MS);
    return () => clearInterval(poll);
  }, [token, refresh]);

  if (items.length === 0) {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white/60 select-none">
        <div className="text-xl font-medium">
          {initial.screenName ?? "Display"} is ready
        </div>
        <p className="text-sm text-white/40 mt-2">
          Add content to this screen&apos;s playlist to get started.
        </p>
      </main>
    );
  }

  const current = items[index % items.length];

  return (
    <main className="fixed inset-0 bg-black overflow-hidden select-none">
      {current.kind === "video" ? (
        <video
          key={current.id}
          src={current.url}
          className="w-full h-full object-contain"
          autoPlay
          muted
          playsInline
          onEnded={() => setIndex((i) => i + 1)}
        />
      ) : (
        // image and pdf_page both render as full-screen images
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={current.id}
          src={current.url}
          alt=""
          className="w-full h-full object-contain"
        />
      )}
    </main>
  );
}
