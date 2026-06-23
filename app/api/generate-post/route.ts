import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../lib/supabase/server";
import {
  getOrCreateProfile,
  logSupabaseError,
} from "../../../lib/supabase/profiles";

const LINKEDIN_PROMPT = `Tu es un expert LinkedIn B2B.
À partir de l'activité de l'utilisateur, génère un post LinkedIn en français qui attire des prospects qualifiés.

Le post doit :
- commencer par un hook fort
- être clair et naturel
- ne pas sonner trop IA
- cibler un problème client
- apporter de la valeur
- finir avec un CTA simple
- rester entre 900 et 1300 caractères
- utiliser des sauts de ligne courts
- ne pas utiliser trop d'emojis`;

function extractText(response: unknown): string {
  if (
    response &&
    typeof response === "object" &&
    "output_text" in response &&
    typeof response.output_text === "string"
  ) {
    return response.output_text.trim();
  }

  if (
    !response ||
    typeof response !== "object" ||
    !("output" in response) ||
    !Array.isArray(response.output)
  ) {
    return "";
  }

  const chunks: string[] = [];

  for (const item of response.output) {
    if (
      !item ||
      typeof item !== "object" ||
      !("content" in item) ||
      !Array.isArray(item.content)
    ) {
      continue;
    }

    for (const content of item.content) {
      if (!content || typeof content !== "object") {
        continue;
      }

      if ("text" in content && typeof content.text === "string") {
        chunks.push(content.text);
      }
    }
  }

  return chunks.join("\n").trim();
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide. Envoie un JSON avec activity." },
      { status: 400 },
    );
  }

  const activity =
    body &&
    typeof body === "object" &&
    "activity" in body &&
    typeof body.activity === "string"
      ? body.activity.trim()
      : "";

  if (!activity) {
    return NextResponse.json(
      { error: "Décris ton activité avant de générer ton post." },
      { status: 400 },
    );
  }

  if (!isServerSupabaseConfigured()) {
    return NextResponse.json(
      {
        error:
          "Configuration Supabase manquante. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env",
      },
      { status: 500 },
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Connecte-toi pour générer un post LinkedIn." },
      { status: 401 },
    );
  }

  const profileResult = await getOrCreateProfile(supabase, user);

  if (profileResult.error) {
    return NextResponse.json({ error: profileResult.error }, { status: 500 });
  }

  if (!profileResult.profile) {
    return NextResponse.json(
      { error: "Profil introuvable, création automatique impossible." },
      { status: 500 },
    );
  }

  const profile = profileResult.profile;

  if (!profile.is_pro && profile.credits_remaining <= 0) {
    return NextResponse.json(
      {
        error: "Crédits épuisés. Passe à LinkPost Pro pour continuer.",
        creditsRemaining: 0,
        isPro: false,
      },
      { status: 402 },
    );
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Configuration IA manquante. Ajoutez OPENAI_API_KEY dans .env",
      },
      { status: 500 },
    );
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL?.trim() || "gpt-5.5",
        reasoning: { effort: "low" },
        instructions: LINKEDIN_PROMPT,
        input: `Activité utilisateur :\n${activity}`,
        max_output_tokens: 700,
        text: {
          verbosity: "medium",
        },
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      const message =
        data &&
        typeof data === "object" &&
        "error" in data &&
        data.error &&
        typeof data.error === "object" &&
        "message" in data.error &&
        typeof data.error.message === "string"
          ? data.error.message
          : "Impossible de générer le post pour le moment.";

      return NextResponse.json({ error: message }, { status: 502 });
    }

    const post = extractText(data);

    if (!post) {
      return NextResponse.json(
        { error: "La génération IA n'a pas retourné de contenu." },
        { status: 502 },
      );
    }

    const { data: generation, error: generationError } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        activity,
        generated_post: post,
      })
      .select("id,activity,generated_post,created_at")
      .single();

    if (generationError || !generation) {
      logSupabaseError("generations.insert", generationError);
      return NextResponse.json(
        { error: "Le post a été généré, mais l'historique n'a pas pu être sauvegardé." },
        { status: 500 },
      );
    }

    if (profile.is_pro) {
      return NextResponse.json({
        post,
        creditsRemaining: profile.credits_remaining,
        isPro: true,
        generation,
      });
    }

    const nextCredits = Math.max(0, profile.credits_remaining - 1);
    const { data: updatedProfile, error: updateProfileError } = await supabase
      .from("profiles")
      .update({ credits_remaining: nextCredits })
      .eq("id", user.id)
      .select("credits_remaining,is_pro")
      .single();

    if (updateProfileError || !updatedProfile) {
      logSupabaseError("profiles.update_credits", updateProfileError);
      return NextResponse.json(
        { error: "Le post a été généré, mais les crédits n'ont pas pu être mis à jour." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      post,
      creditsRemaining: updatedProfile.credits_remaining,
      isPro: updatedProfile.is_pro,
      generation,
    });
  } catch {
    return NextResponse.json(
      { error: "Impossible de contacter le service IA pour le moment." },
      { status: 502 },
    );
  }
}
