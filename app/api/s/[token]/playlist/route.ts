import { loadDisplay } from "@/lib/display";

export const dynamic = "force-dynamic";

/**
 * Full playlist with fresh signed media URLs. The TV client fetches this only
 * when content_version changes (not on every poll), keeping R2 reads minimal.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const payload = await loadDisplay(token);
  return Response.json(payload);
}
