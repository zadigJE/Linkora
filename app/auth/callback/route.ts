import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../lib/supabase/server";
import { getOrCreateProfile } from "../../../lib/supabase/profiles";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const dashboardUrl = new URL("/dashboard", requestUrl.origin);
  const authUrl = new URL("/auth", requestUrl.origin);

  console.log("[Auth Callback] code present", Boolean(code));

  if (!isServerSupabaseConfigured()) {
    console.log("[Auth Callback] Supabase config missing");
    console.log("[Auth Callback] redirect final", authUrl.pathname);
    return NextResponse.redirect(authUrl);
  }

  if (!code) {
    console.log("[Auth Callback] OAuth code absent");
    console.log("[Auth Callback] redirect final", authUrl.pathname);
    return NextResponse.redirect(authUrl);
  }

  const supabase = await createClient();
  const { data: sessionData, error: exchangeError } =
    await supabase.auth.exchangeCodeForSession(code);

  console.log("[Auth Callback] exchangeCodeForSession error", {
    message: exchangeError?.message ?? null,
  });

  if (exchangeError) {
    console.log("[Auth Callback] redirect final", authUrl.pathname);
    return NextResponse.redirect(authUrl);
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const authenticatedUser = user ?? sessionData.user;

  console.log("[Auth Callback] user fetched", {
    hasUser: Boolean(user),
    hasSessionUser: Boolean(sessionData.user),
    error: userError?.message ?? null,
  });

  if (!authenticatedUser) {
    console.log("[Auth Callback] redirect final", authUrl.pathname);
    return NextResponse.redirect(authUrl);
  }

  const profileResult = await getOrCreateProfile(supabase, authenticatedUser);

  if (profileResult.error) {
    console.log("[Auth Callback] profile setup error", profileResult.error);
  }

  console.log("[Auth Callback] redirect final", dashboardUrl.pathname);
  return NextResponse.redirect(dashboardUrl);
}
