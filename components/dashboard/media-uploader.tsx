"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { uploadMedia } from "@/lib/upload-client";

export function MediaUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = ""; // allow re-selecting the same file
    if (files.length === 0) return;

    setBusy(true);
    setError(null);
    try {
      for (const file of files) {
        setStatus(`${file.name}…`);
        await uploadMedia(file, (m) => setStatus(`${file.name}: ${m}`));
      }
      setStatus("Uploaded ✓");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      setTimeout(() => setStatus(null), 2000);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm hover:bg-foreground/5 disabled:opacity-50 transition-colors"
      >
        <Upload className="w-4 h-4" />
        {busy ? "Uploading…" : "Upload media"}
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        onChange={onFiles}
        hidden
      />
      <p className="text-xs text-muted-foreground">
        Images, video, or PDF. PDFs become one slide per page.
      </p>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
