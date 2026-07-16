import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { Button } from "@/components/ui/button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // First login: create the owner's business row (RLS: owner_user_id must be self).
  const { data: business } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) {
    const fallbackName = user.email?.split("@")[0] ?? "My business";
    await supabase
      .from("businesses")
      .insert({ owner_user_id: user.id, name: fallbackName });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-foreground/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="/dashboard" className="font-display text-xl tracking-tight">
            syneOps
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm" className="rounded-full">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  );
}
