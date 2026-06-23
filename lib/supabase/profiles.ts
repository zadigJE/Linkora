import type { User } from "@supabase/supabase-js";
import type { createClient } from "./server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type LinkPostProfile = {
  id: string;
  email: string | null;
  credits_remaining: number;
  is_pro: boolean;
};

type ProfileResult =
  | {
      profile: LinkPostProfile;
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

export async function getOrCreateProfile(
  supabase: SupabaseServerClient,
  user: User,
): Promise<ProfileResult> {
  const profileColumns = "id,email,credits_remaining,is_pro";

  const { data: existingProfile, error: readError } = await supabase
    .from("profiles")
    .select(profileColumns)
    .eq("id", user.id)
    .maybeSingle<LinkPostProfile>();

  if (readError) {
    logSupabaseError("profiles.select", readError);
    return {
      profile: null,
      error: "Impossible de lire ton profil LinkPost.",
    };
  }

  if (existingProfile) {
    return {
      profile: existingProfile,
      error: null,
    };
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email,
    credits_remaining: 3,
    is_pro: false,
  });

  if (insertError) {
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
    .single<LinkPostProfile>();

  if (rereadError) {
    logSupabaseError("profiles.select_after_insert", rereadError);
    return {
      profile: null,
      error: "Profil introuvable, création automatique impossible.",
    };
  }

  return {
    profile: createdProfile,
    error: null,
  };
}
