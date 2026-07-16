import { loadDisplay } from "@/lib/display";
import { DisplayPlayer } from "./player";

// Always render fresh: signs short-lived media URLs and records a liveness ping.
export const dynamic = "force-dynamic";

export default async function DisplayPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const payload = await loadDisplay(token);

  if (payload.status === "not_found" || payload.status === "revoked") {
    return (
      <main className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white/70 select-none">
        <div className="text-center px-8">
          <div className="text-2xl font-medium mb-2">This display isn&apos;t configured</div>
          <p className="text-sm text-white/40">
            Ask the account owner to set up this screen in syneOps.
          </p>
        </div>
      </main>
    );
  }

  return <DisplayPlayer token={token} initial={payload} />;
}
