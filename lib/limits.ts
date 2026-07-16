import { createAdminClient } from "@/lib/supabase/server";

/**
 * R2 free-tier guardrails. Keeps usage strictly under Cloudflare R2's free
 * limits so the account never crosses into billing during validation.
 *
 * Enforced here (server-side): total STORAGE and monthly CLASS A ops (uploads).
 * NOT enforceable here: CLASS B ops (reads) — the TV browser fetches media
 * directly from R2, bypassing our server, so they can't be counted. The display
 * is designed to minimize them (media is re-fetched only when content changes,
 * never on every poll). Set a budget alert in the Cloudflare R2 dashboard as a
 * backstop for reads.
 */

const GB = 1024 ** 3;
const MB = 1024 ** 2;

export const R2_FREE = {
  storageBytes: 10 * GB,
  classAOps: 1_000_000,
  classBOps: 10_000_000,
} as const;

// Safety margins — deliberately under the free ceiling. Override via env once
// you're ready to pay for overage (e.g. to honor larger paid plan tiers).
export const R2_GUARD = {
  maxTotalStorageBytes: Number(process.env.R2_MAX_TOTAL_BYTES ?? 9 * GB),
  maxFileBytes: Number(process.env.R2_MAX_FILE_BYTES ?? 200 * MB),
  maxClassAPerMonth: Number(process.env.R2_MAX_CLASS_A ?? 900_000),
} as const;

function currentPeriod(): string {
  return new Date().toISOString().slice(0, 7); // 'YYYY-MM' UTC
}

export interface UploadCheck {
  ok: boolean;
  reason?: string;
}

/**
 * Gate an upload before we sign a URL. Checks per-file size, the global storage
 * ceiling, and the monthly Class A budget.
 */
export async function checkUploadAllowed(fileBytes: number): Promise<UploadCheck> {
  if (!Number.isFinite(fileBytes) || fileBytes <= 0) {
    return { ok: false, reason: "Invalid file size." };
  }
  if (fileBytes > R2_GUARD.maxFileBytes) {
    return {
      ok: false,
      reason: `File exceeds the ${Math.round(R2_GUARD.maxFileBytes / MB)} MB per-file limit.`,
    };
  }

  const admin = createAdminClient();

  const { data: stored } = await admin.rpc("total_media_bytes");
  const usedBytes = Number(stored ?? 0);
  if (usedBytes + fileBytes > R2_GUARD.maxTotalStorageBytes) {
    return {
      ok: false,
      reason:
        "Storage limit reached. Delete unused media (or raise the limit) before uploading more.",
    };
  }

  const { data: usage } = await admin
    .from("r2_usage")
    .select("class_a")
    .eq("period", currentPeriod())
    .maybeSingle();
  const classA = Number(usage?.class_a ?? 0);
  if (classA + 1 > R2_GUARD.maxClassAPerMonth) {
    return {
      ok: false,
      reason: "Monthly upload limit reached. Try again next month or raise the limit.",
    };
  }

  return { ok: true };
}

/** Record Class A operations (uploads/lists) against the monthly budget. */
export async function recordClassA(n = 1): Promise<void> {
  const admin = createAdminClient();
  await admin.rpc("increment_r2_class_a", { p_period: currentPeriod(), p_n: n });
}

/** Total bytes currently stored in R2, across all businesses. */
export async function getStoredBytes(): Promise<number> {
  const admin = createAdminClient();
  const { data } = await admin.rpc("total_media_bytes");
  return Number(data ?? 0);
}
