import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CopyField } from "@/components/dashboard/copy-field";
import { createLocation, createScreen, resetToken, setScreenStatus } from "./actions";
import type { Location, Screen } from "@/lib/types";

export const dynamic = "force-dynamic";

function displayUrl(token: string) {
  const base = process.env.DISPLAY_BASE_URL || "";
  return `${base}/s/${token}`;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; limit?: string }>;
}) {
  const { error, limit } = await searchParams;
  const supabase = await createClient();

  const { data: locations } = await supabase
    .from("locations")
    .select("*")
    .order("created_at", { ascending: true });
  const { data: screens } = await supabase
    .from("screens")
    .select("*")
    .order("created_at", { ascending: true });

  const locs = (locations ?? []) as Location[];
  const scrs = (screens ?? []) as Screen[];
  const screensByLocation = (locId: string) =>
    scrs.filter((s) => s.location_id === locId);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-display tracking-tight">Screens</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create a location, add a screen, and point any TV at its display link.
          </p>
        </div>
      </div>

      {error === "screen_limit" && (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700">
          You&apos;ve reached your plan&apos;s screen limit ({limit}). Upgrade to add more.
        </div>
      )}

      {/* Create location */}
      <section className="rounded-lg border border-foreground/10 p-6">
        <h2 className="font-medium mb-4">Add a location</h2>
        <form action={createLocation} className="flex flex-col sm:flex-row gap-3">
          <Input name="name" placeholder="Location name (e.g. King St. Café)" required />
          <Input name="address" placeholder="Address (optional)" />
          <Button type="submit" className="rounded-full shrink-0">
            Add location
          </Button>
        </form>
      </section>

      {/* Locations + screens */}
      {locs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No locations yet. Add your first one above.
        </p>
      ) : (
        <div className="space-y-8">
          {locs.map((loc) => (
            <section key={loc.id} className="rounded-lg border border-foreground/10">
              <div className="px-6 py-4 border-b border-foreground/10">
                <h2 className="font-medium">{loc.name}</h2>
                {loc.address && (
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.address}</p>
                )}
              </div>

              <div className="p-6 space-y-4">
                {screensByLocation(loc.id).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No screens here yet.</p>
                ) : (
                  screensByLocation(loc.id).map((screen) => (
                    <div
                      key={screen.id}
                      className="rounded-md border border-foreground/10 p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{screen.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              screen.status === "active"
                                ? "bg-green-500/10 text-green-700"
                                : "bg-red-500/10 text-red-700"
                            }`}
                          >
                            {screen.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <form action={resetToken}>
                            <input type="hidden" name="screen_id" value={screen.id} />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs"
                            >
                              Reset link
                            </Button>
                          </form>
                          <form action={setScreenStatus}>
                            <input type="hidden" name="screen_id" value={screen.id} />
                            <input
                              type="hidden"
                              name="next_status"
                              value={screen.status === "active" ? "revoked" : "active"}
                            />
                            <Button
                              type="submit"
                              variant="outline"
                              size="sm"
                              className="rounded-full text-xs"
                            >
                              {screen.status === "active" ? "Revoke" : "Reactivate"}
                            </Button>
                          </form>
                        </div>
                      </div>
                      <CopyField value={displayUrl(screen.display_token)} />
                    </div>
                  ))
                )}

                {/* Add screen to this location */}
                <form action={createScreen} className="flex gap-3 pt-2">
                  <input type="hidden" name="location_id" value={loc.id} />
                  <Input name="name" placeholder="Screen name (e.g. Menu Board)" />
                  <Button
                    type="submit"
                    variant="outline"
                    className="rounded-full shrink-0"
                  >
                    Add screen
                  </Button>
                </form>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
