"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { newDisplayToken } from "@/lib/tokens";
import { PLAN_SCREEN_LIMITS, type PlanTier } from "@/lib/types";

async function requireBusiness() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: business } = await supabase
    .from("businesses")
    .select("id, plan_tier")
    .eq("owner_user_id", user.id)
    .maybeSingle();
  if (!business) redirect("/dashboard");

  return { supabase, business };
}

export async function createLocation(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const address = String(formData.get("address") ?? "").trim() || null;

  const { supabase, business } = await requireBusiness();
  await supabase.from("locations").insert({ business_id: business.id, name, address });
  revalidatePath("/dashboard");
}

export async function createScreen(formData: FormData) {
  const locationId = String(formData.get("location_id") ?? "");
  const name = String(formData.get("name") ?? "").trim() || "Main display";
  if (!locationId) return;

  const { supabase, business } = await requireBusiness();

  // Plan limit enforcement (spec §11, Phase 5).
  const { count } = await supabase
    .from("screens")
    .select("id", { count: "exact", head: true })
    .eq("business_id", business.id);
  const limit = PLAN_SCREEN_LIMITS[(business.plan_tier as PlanTier) ?? "starter"];
  if ((count ?? 0) >= limit) {
    redirect(`/dashboard?error=screen_limit&limit=${limit}`);
  }

  await supabase.from("screens").insert({
    business_id: business.id,
    location_id: locationId,
    name,
    display_token: newDisplayToken(),
  });
  revalidatePath("/dashboard");
}

export async function resetToken(formData: FormData) {
  const screenId = String(formData.get("screen_id") ?? "");
  if (!screenId) return;
  const { supabase } = await requireBusiness();
  await supabase
    .from("screens")
    .update({ display_token: newDisplayToken(), status: "active" })
    .eq("id", screenId);
  revalidatePath("/dashboard");
}

export async function setScreenStatus(formData: FormData) {
  const screenId = String(formData.get("screen_id") ?? "");
  const next = String(formData.get("next_status") ?? "");
  if (!screenId || (next !== "active" && next !== "revoked")) return;
  const { supabase } = await requireBusiness();
  await supabase.from("screens").update({ status: next }).eq("id", screenId);
  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
