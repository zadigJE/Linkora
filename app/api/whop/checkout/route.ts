import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../../lib/supabase/server";
import { getWhopPaymentLink } from "../../../../lib/whop/server";

const validPlans = new Set(["mensuel", "annuel"]);

function getSafeNext(plan: string) {
  return `/api/whop/checkout?plan=${encodeURIComponent(plan)}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get("plan") ?? "";

  if (!validPlans.has(plan)) {
    return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
  }

  if (!isServerSupabaseConfigured()) {
    const authUrl = new URL("/auth", requestUrl.origin);
    authUrl.searchParams.set("next", getSafeNext(plan));
    return NextResponse.redirect(authUrl);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const authUrl = new URL("/auth", requestUrl.origin);
    authUrl.searchParams.set("next", getSafeNext(plan));
    return NextResponse.redirect(authUrl);
  }

  const paymentLink = getWhopPaymentLink(plan);

  if (!paymentLink) {
    const pricingUrl = new URL("/pricing", requestUrl.origin);
    pricingUrl.searchParams.set("checkout", "missing");
    pricingUrl.searchParams.set("plan", plan);
    return NextResponse.redirect(pricingUrl);
  }

  return NextResponse.redirect(paymentLink);
}
