import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { signUploadUrl } from "@/lib/r2";
import { checkUploadAllowed, recordClassA } from "@/lib/limits";
import type { MediaKind } from "@/lib/types";

const ALLOWED_KINDS: MediaKind[] = ["image", "video", "pdf_page"];

/**
 * Issues a presigned R2 upload URL — but only after the free-tier guardrails
 * pass. This is the single choke point for R2 writes, so storage and Class A
 * limits are enforced here before any object can be created.
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const filename: string | undefined = body?.filename;
  const contentType: string | undefined = body?.contentType;
  const bytes = Number(body?.bytes);
  const kind: MediaKind = ALLOWED_KINDS.includes(body?.kind) ? body.kind : "image";

  if (!contentType || !Number.isFinite(bytes) || bytes <= 0) {
    return Response.json(
      { error: "contentType and a positive bytes value are required." },
      { status: 400 },
    );
  }

  // RLS-scoped: the user can only see their own business.
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) {
    return Response.json({ error: "No business found for this account." }, { status: 400 });
  }

  // ── Free-tier guardrail ─────────────────────────────────────────
  const check = await checkUploadAllowed(bytes);
  if (!check.ok) {
    return Response.json({ error: check.reason, code: "R2_LIMIT" }, { status: 413 });
  }

  const mediaId = randomUUID();
  const key = `${business.id}/${mediaId}`;

  // Record the media row up front (with bytes) so storage accounting stays
  // accurate. NOTE: if the browser upload later fails, this row is an orphan
  // that still counts toward storage — a Phase 3 "confirm upload" step should
  // reconcile these (or a periodic sweep of rows with no R2 object).
  const { error: insertError } = await supabase.from("media").insert({
    id: mediaId,
    business_id: business.id,
    kind,
    storage_key: key,
    original_filename: filename ?? null,
    bytes,
  });
  if (insertError) {
    return Response.json({ error: "Could not record media." }, { status: 500 });
  }

  const uploadUrl = await signUploadUrl(key, contentType);
  await recordClassA(1); // the browser's PUT is one Class A op

  return Response.json({ uploadUrl, mediaId, key });
}
