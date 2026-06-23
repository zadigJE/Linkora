import { Whop } from "@whop/sdk";

export function isWhopConfigured() {
  return Boolean(process.env.WHOP_API_KEY && process.env.WHOP_WEBHOOK_SECRET);
}

export function createWhopClient() {
  const apiKey = process.env.WHOP_API_KEY;
  const webhookSecret = process.env.WHOP_WEBHOOK_SECRET;

  if (!apiKey || !webhookSecret) {
    throw new Error(
      "Configuration Whop manquante. Ajoutez WHOP_API_KEY et WHOP_WEBHOOK_SECRET dans .env.",
    );
  }

  return new Whop({
    apiKey,
    webhookKey: webhookSecret,
  });
}

export function getWhopPaymentLink(plan: string | null) {
  if (plan === "mensuel") {
    return (
      process.env.WHOP_PAYMENT_LINK_MENSUEL?.trim() ||
      process.env.NEXT_PUBLIC_WHOP_PAYMENT_LINK_MENSUEL?.trim() ||
      ""
    );
  }

  if (plan === "annuel") {
    return (
      process.env.WHOP_PAYMENT_LINK_ANNUEL?.trim() ||
      process.env.NEXT_PUBLIC_WHOP_PAYMENT_LINK_ANNUEL?.trim() ||
      ""
    );
  }

  return "";
}
