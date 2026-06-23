import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../../lib/supabase/server";
import { logSupabaseError } from "../../../../lib/supabase/profiles";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthenticatedClient() {
  if (!isServerSupabaseConfigured()) {
    return {
      error: NextResponse.json(
        {
          error:
            "Configuration Supabase manquante. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env",
        },
        { status: 500 },
      ),
      supabase: null,
      userId: null,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Connecte-toi pour modifier tes générations." },
        { status: 401 },
      ),
      supabase: null,
      userId: null,
    };
  }

  return {
    error: null,
    supabase,
    userId: user.id,
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { error, supabase, userId } = await getAuthenticatedClient();

  if (error) {
    return error;
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide. Envoie un JSON avec generated_post." },
      { status: 400 },
    );
  }

  const generatedPost =
    body &&
    typeof body === "object" &&
    "generated_post" in body &&
    typeof body.generated_post === "string"
      ? body.generated_post.trim()
      : "";

  if (!generatedPost) {
    return NextResponse.json(
      { error: "Le post ne peut pas être vide." },
      { status: 400 },
    );
  }

  const { data: generation, error: updateError } = await supabase
    .from("generations")
    .update({ generated_post: generatedPost })
    .eq("id", id)
    .eq("user_id", userId)
    .select("id,activity,generated_post,created_at")
    .single();

  if (updateError || !generation) {
    logSupabaseError("generations.update", updateError);
    return NextResponse.json(
      { error: "Impossible de sauvegarder les modifications." },
      { status: 500 },
    );
  }

  return NextResponse.json({ generation });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const { error, supabase, userId } = await getAuthenticatedClient();

  if (error) {
    return error;
  }

  const { error: deleteError } = await supabase
    .from("generations")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (deleteError) {
    logSupabaseError("generations.delete", deleteError);
    return NextResponse.json(
      { error: "Impossible de supprimer cette génération." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
