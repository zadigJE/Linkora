import type { User } from "@supabase/supabase-js";
import type { createClient } from "./server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type LinkoraPlan = "free" | "founder" | "pro";

export type LinkoraProfile = {
  id: string;
  email: string | null;
  username: string | null;
  credits_remaining: number;
  is_pro: boolean;
  plan: LinkoraPlan;
  created_at: string;
  updated_at: string | null;
};

type LegacyLinkoraProfile = {
  id: string;
  email: string | null;
  credits_remaining: number;
  is_pro: boolean;
  created_at: string;
};

type ProfileResult =
  | {
      profile: LinkoraProfile;
      error: null;
    }
  | {
      profile: null;
      error: string;
    };

type SupabaseErrorLike = {
  message?: string;
  details?: string;
  code?: string;
};

export const profileColumns =
  "id,email,username,credits_remaining,is_pro,plan,created_at,updated_at";

const legacyProfileColumns = "id,email,credits_remaining,is_pro,created_at";

export function logSupabaseError(
  context: string,
  error: SupabaseErrorLike | null | undefined,
) {
  if (!error) {
    return;
  }

  console.error(`[Supabase] ${context}`, {
    message: error.message,
    details: error.details,
    code: error.code,
  });
}

export function normalizePlan(plan: string | null | undefined): LinkoraPlan {
  if (plan === "founder" || plan === "pro") {
    return plan;
  }

  return "free";
}

export function getPlanLabel(profile: Pick<LinkoraProfile, "is_pro" | "plan">) {
  if (profile.plan === "pro") {
    return "Pro";
  }

  if (profile.plan === "founder" || profile.is_pro) {
    return "Fondateur";
  }

  return "Gratuit";
}

function getDefaultUsername(user: User) {
  const metadataName = user.user_metadata?.name;

  if (typeof metadataName === "string" && metadataName.trim()) {
    return metadataName.trim();
  }

  return user.email?.split("@")[0] ?? "";
}

function isMissingColumnError(error: SupabaseErrorLike | null | undefined) {
  return (
    error?.code === "42703" ||
    error?.message?.toLowerCase().includes("column") ||
    false
  );
}

function normalizeLegacyProfile(
  profile: LegacyLinkoraProfile,
): LinkoraProfile {
  return normalizeProfile({
    ...profile,
    username: null,
    plan: profile.is_pro ? "founder" : "free",
    updated_at: null,
  });
}

function normalizeProfile(profile: LinkoraProfile): LinkoraProfile {
  const plan = normalizePlan(profile.plan);

  return {
    ...profile,
    plan: profile.is_pro && plan === "free" ? "founder" : plan,
  };
}

async function normalizeFreeCredits(
  supabase: SupabaseServerClient,
  profile: LinkoraProfile,
) {
  if (profile.is_pro || profile.credits_remaining <= 0) {
    return normalizeProfile(profile);
  }

  const { count, error: countError } = await supabase
    .from("generations")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);

  if (countError) {
    logSupabaseError("generations.count_for_credit_normalization", countError);
  }

  const nextCredits =
    count && count > 0 ? 0 : Math.min(profile.credits_remaining, 1);

  if (nextCredits === profile.credits_remaining) {
    return normalizeProfile(profile);
  }

  const { data: updatedProfile, error: updateError } = await supabase
    .from("profiles")
    .update({
      credits_remaining: nextCredits,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.id)
    .select(profileColumns)
    .single<LinkoraProfile>();

  if (!updateError && updatedProfile) {
    return normalizeProfile(updatedProfile);
  }

  logSupabaseError("profiles.normalize_free_credits", updateError);

  return normalizeProfile({
    ...profile,
    credits_remaining: nextCredits,
  });
}

export async function getOrCreateProfile(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ProfileResult> {
  let { data: existingProfile, error: readError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle<LinkoraProfile>();

  if (readError) {
    if (isMissingColumnError(readError)) {
      const { data: legacyProfile, error: legacyReadError } = await supabase
        .from("profiles")
        .select(legacyProfileColumns)
        .eq("id", user.id)
        .maybeSingle<LegacyLinkoraProfile>();

      if (!legacyReadError && legacyProfile) {
        return {
          profile: normalizeLegacyProfile(legacyProfile),
          error: null,
        };
      }

      if (!legacyReadError) {
        existingProfile = null;
        readError = null;
      } else {
        readError = legacyReadError;
      }
    }
  }

  if (readError) {
    logSupabaseError("profiles.select", readError);
    return {
      profile: null,
      error: "Impossible de lire ton profil Linkora.",
    };
  }

  if (existingProfile) {
    const nextPlan =
      existingProfile.is_pro && normalizePlan(existingProfile.plan) === "free"
        ? "founder"
        : normalizePlan(existingProfile.plan);

    const shouldBackfill =
      existingProfile.email !== user.email ||
      !existingProfile.username ||
      existingProfile.plan !== nextPlan;

    if (shouldBackfill) {
    const { data: updatedProfile, error: updateError } = await supabase
        .from("profiles")
        .update({
          email: user.email,
          username: existingProfile.username || getDefaultUsername(user),
          plan: nextPlan,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select(profileColumns)
        .single<LinkoraProfile>();

      if (!updateError && updatedProfile) {
        return {
          profile: await normalizeFreeCredits(supabase, updatedProfile),
          error: null,
        };
      }

      logSupabaseError("profiles.backfill", updateError);
    }

    return {
      profile: await normalizeFreeCredits(supabase, existingProfile),
      error: null,
    };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    username: getDefaultUsername(user),
    credits_remaining: 1,
    is_pro: false,
    plan: "free",
    updated_at: new Date().toISOString(),
  });

  if (insertError) {
    if (isMissingColumnError(insertError)) {
      const { error: legacyInsertError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          credits_remaining: 1,
          is_pro: false,
        });

      if (!legacyInsertError) {
        const { data: legacyProfile, error: legacyRereadError } = await supabase
          .from("profiles")
          .select(legacyProfileColumns)
          .eq("id", user.id)
          .single<LegacyLinkoraProfile>();

        if (!legacyRereadError && legacyProfile) {
          return {
            profile: normalizeLegacyProfile(legacyProfile),
            error: null,
          };
        }

        logSupabaseError("profiles.legacy_select_after_insert", legacyRereadError);
      } else {
        logSupabaseError("profiles.legacy_insert", legacyInsertError);
      }
    }

    logSupabaseError("profiles.insert", insertError);
    return {
      profile: null,
      error: "Profil introuvable, création automatique impossible.",
    };
  }

  const { data: createdProfile, error: rereadError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .single<LinkoraProfile>();

  if (rereadError) {
    logSupabaseError("profiles.select_after_insert", rereadError);
    return {
      profile: null,
      error: "Profil introuvable, création automatique impossible.",
    };
  }

  return {
    profile: normalizeProfile(createdProfile),
    error: null,
  };
}
