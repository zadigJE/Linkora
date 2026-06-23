import { NextResponse } from "next/server";

export function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const plan = requestUrl.searchParams.get("plan");
  const status = requestUrl.searchParams.get("status");

  if (status === "error") {
    const pricingUrl = new URL("/pricing", requestUrl.origin);

    if (plan) {
      pricingUrl.searchParams.set("plan", plan);
    }

    pricingUrl.searchParams.set("payment", "error");
    return NextResponse.redirect(pricingUrl);
  }

  const dashboardUrl = new URL("/dashboard", requestUrl.origin);
  dashboardUrl.searchParams.set("payment", "success");

  if (plan) {
    dashboardUrl.searchParams.set("plan", plan);
  }

  return NextResponse.redirect(dashboardUrl);
}
