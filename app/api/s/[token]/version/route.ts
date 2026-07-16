import { createAdminClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Lightweight poll endpoint. The TV client hits this every ~25s; it touches
 * Supabase only (never R2), so it's effectively free to run on every screen.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const admin = createAdminClient();

  const { data } = await admin
    .from("screens")
    .select("content_version, status")
    .eq("display_token", token)
    .maybeSingle();

  if (!data) {
    return Response.json({ content_version: null, status: "not_found" });
  }
  return Response.json({
    content_version: data.status === "active" ? data.content_version : null,
    status: data.status,
  });
}
