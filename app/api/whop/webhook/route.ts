import { NextResponse } from "next/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { createWhopClient } from "../../../../lib/whop/server";

export const runtime = "nodejs";

const activateEvents = new Set(["payment.succeeded", "membership.activated"]);
const deactivateEvents = new Set(["membership.deactivated"]);

type WebhookPayload = {
  type?: string;
  data?: unknown;
};

function getObjectValue(value: unknown, key: string) {
  if (!value || typeof value !== "object" || !(key in value)) {
    return null;
  }

  return (value as Record<string, unknown>)[key];
}

function getStringValue(value: unknown, key: string) {
  const nextValue = getObjectValue(value, key);
  return typeof nextValue === "string" ? nextValue : null;
}

function getWhopEmail(data: unknown) {
  const user = getObjectValue(data, "user");
  const userEmail = getStringValue(user, "email");

  if (userEmail) {
    return userEmail;
  }

  const member = getObjectValue(data, "member");
  const memberUser = getObjectValue(member, "user");
  return getStringValue(memberUser, "email");
}

async function updateProfileAccess(email: string, isPro: boolean) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({ is_pro: isPro })
    .ilike("email", normalizedEmail)
    .select("id");

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    console.warn("[Whop] Aucun profil Supabase trouvé pour cet email.");
  }
}

export async function POST(request: Request) {
  let webhookData: WebhookPayload;

  try {
    const requestBodyText = await request.text();
    const headers = Object.fromEntries(request.headers);
    webhookData = createWhopClient().webhooks.unwrap(requestBodyText, {
      headers,
    }) as WebhookPayload;
  } catch (error) {
    console.error("[Whop] Signature webhook invalide ou payload illisible.");
    return NextResponse.json({ error: "Invalid webhook" }, { status: 401 });
  }

  const eventType = webhookData.type;

  if (!eventType) {
    return NextResponse.json({ ok: true });
  }

  if (!activateEvents.has(eventType) && !deactivateEvents.has(eventType)) {
    return NextResponse.json({ ok: true });
  }

  const email = getWhopEmail(webhookData.data);

  if (!email) {
    console.warn(`[Whop] Email introuvable pour l'événement ${eventType}.`);
    return NextResponse.json({ ok: true });
  }

  try {
    await updateProfileAccess(email, activateEvents.has(eventType));
  } catch (error) {
    console.error("[Whop] Impossible de mettre à jour le profil Supabase.");
    return NextResponse.json(
      { error: "Unable to update profile" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
