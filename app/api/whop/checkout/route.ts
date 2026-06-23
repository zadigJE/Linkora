import { NextResponse } from "next/server";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../../../lib/supabase/server";
import { getOrCreateProfile } from "../../../../lib/supabase/profiles";
import { getWhopPaymentLink } from "../../../../lib/whop/server";

const validPlans = new Set(["mensuel", "annuel"]);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get("plan") ?? "";

  if (!validPlans.has(plan)) {
    return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
  }

  if (!isServerSupabaseConfigured()) {
    return NextResponse.redirect(
      new URL("/auth?next=/pricing", requestUrl.origin),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const authUrl = new URL("/auth", requestUrl.origin);
    authUrl.searchParams.set(
      "next",
      `/api/whop/checkout?plan=${encodeURIComponent(plan)}`,
    );
    return NextResponse.redirect(authUrl);
  }

  await getOrCreateProfile(supabase, user);

  const paymentLink = getWhopPaymentLink(plan);

  if (!paymentLink) {
    const pricingUrl = new URL("/pricing", requestUrl.origin);
    pricingUrl.searchParams.set("checkout", "missing");
    pricingUrl.searchParams.set("plan", plan);
    return NextResponse.redirect(pricingUrl);
  }

  const paymentUrl = new URL(paymentLink);

  if (user.email) {
    paymentUrl.searchParams.set("email", user.email);
  }

  paymentUrl.searchParams.set("user_id", user.id);
  paymentUrl.searchParams.set("plan", plan);

  return NextResponse.redirect(paymentUrl);
}
