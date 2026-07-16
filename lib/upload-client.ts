// Browser-side upload helpers. Requests a presigned URL from our API (which
// enforces the R2 free-tier guardrails), then PUTs the bytes straight to R2.
// PDFs are rasterized to per-page JPEGs in the browser via pdf.js — no server
// native deps, and conversion cost stays off our functions.

interface UploadUrlResponse {
  uploadUrl: string;
  mediaId: string;
  key: string;
}

async function getUploadUrl(params: {
  filename: string;
  contentType: string;
  bytes: number;
  kind: "image" | "video" | "pdf_page";
}): Promise<UploadUrlResponse> {
  const res = await fetch("/api/media/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    // Surfaces guardrail messages ("Storage limit reached", etc.) to the user.
    throw new Error(body.error || `Upload rejected (${res.status})`);
  }
  return res.json();
}

async function putToR2(uploadUrl: string, blob: Blob, contentType: string) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });
  if (!res.ok) throw new Error(`Storage upload failed (${res.status})`);
}

async function uploadBlob(
  blob: Blob,
  opts: { filename: string; contentType: string; kind: "image" | "video" | "pdf_page" },
) {
  const { uploadUrl } = await getUploadUrl({
    filename: opts.filename,
    contentType: opts.contentType,
    bytes: blob.size,
    kind: opts.kind,
  });
  await putToR2(uploadUrl, blob, opts.contentType);
}

/** Render each PDF page to a JPEG blob in the browser. */
async function renderPdfToJpegs(file: File, scale = 2): Promise<Blob[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjs: any = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

  const data = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data }).promise;
  const blobs: Blob[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(viewport.width);
    canvas.height = Math.ceil(viewport.height);
    const canvasContext = canvas.getContext("2d")!;
    await page.render({ canvasContext, viewport }).promise;

    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Canvas export failed"))),
        "image/jpeg",
        0.85,
      ),
    );
    blobs.push(blob);
  }
  return blobs;
}

/**
 * Upload one file. Images/videos go straight to R2; PDFs are split into page
 * images first. `onProgress` reports human-readable status.
 */
export async function uploadMedia(
  file: File,
  onProgress?: (msg: string) => void,
): Promise<void> {
  const type = file.type;

  if (type === "application/pdf") {
    onProgress?.("Converting PDF…");
    const pages = await renderPdfToJpegs(file);
    for (let i = 0; i < pages.length; i++) {
      onProgress?.(`Uploading page ${i + 1} of ${pages.length}…`);
      await uploadBlob(pages[i], {
        filename: `${file.name} — p${i + 1}`,
        contentType: "image/jpeg",
        kind: "pdf_page",
      });
    }
    return;
  }

  if (type.startsWith("video/")) {
    onProgress?.("Uploading video…");
    await uploadBlob(file, { filename: file.name, contentType: type, kind: "video" });
    return;
  }

  if (type.startsWith("image/")) {
    onProgress?.("Uploading image…");
    await uploadBlob(file, { filename: file.name, contentType: type, kind: "image" });
    return;
  }

  throw new Error(`Unsupported file type: ${type || "unknown"}`);
}
