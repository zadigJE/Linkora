import { NextResponse } from "next/server";
import { getWhopPaymentLink } from "../../../../lib/whop/server";

const validPlans = new Set(["mensuel", "annuel"]);

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get("plan") ?? "";

  if (!validPlans.has(plan)) {
    return NextResponse.redirect(new URL("/pricing", requestUrl.origin));
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
