import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../lib/supabase/server";
import { getOrCreateProfile } from "../../../lib/supabase/profiles";

function getSafeNextPath(nextPath: string | null) {
  return nextPath?.startsWith("/") ? nextPath : "/dashboard";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getSafeNextPath(requestUrl.searchParams.get("next"));

  if (!isServerSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/auth", requestUrl.origin));
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await getOrCreateProfile(supabase, user);
    }
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
