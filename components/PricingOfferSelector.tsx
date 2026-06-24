"use client";

import { Check } from "lucide-react";
import { useState } from "react";

type BillingPeriod = "annuel" | "mensuel";

const features = [
  "Génération de posts LinkedIn orientés prospects",
  "Storytelling",
  "Autorité / Expertise",
  "Opinion / Prise de position",
  "Étude de cas",
  "Reformulation de posts existants",
  "Historique des générations",
  "Copie en un clic",
  "Génération optimisée pour l'acquisition",
  "Nouvelles fonctionnalités ajoutées en priorité",
  "Tarif fondateur conservé à vie",
];

const offers = {
  mensuel: {
    name: "Mensuel",
    badge: "Offre fondateur",
    oldPrice: "99€/mois",
    price: "39€/mois",
    note: "Offre fondateur limitée aux 50 premiers utilisateurs.",
    checkoutHref: "/api/whop/checkout?plan=mensuel",
  },
  annuel: {
    name: "Annuel",
    badge: "🔥 Meilleure offre",
    oldPrice: "65€/mois",
    price: "29€/mois",
    note: "Revient à 349€/an",
    checkoutHref: "/api/whop/checkout?plan=annuel",
  },
} satisfies Record<
  BillingPeriod,
  {
    name: string;
    badge: string;
    oldPrice: string;
    price: string;
    note: string;
    checkoutHref: string;
  }
>;

export default function PricingOfferSelector() {
  const [billingPeriod, setBillingPeriod] =
    useState<BillingPeriod>("annuel");
  const offer = offers[billingPeriod];
  const isAnnual = billingPeriod === "annuel";

  return (
    <div className="mt-12">
      <div className="mx-auto grid max-w-sm grid-cols-2 rounded-full bg-slate-50/80 p-1 text-sm font-extrabold text-slate-500 ring-1 ring-slate-200/70">
        <button
          type="button"
          onClick={() => setBillingPeriod("mensuel")}
          className={`rounded-full px-4 py-3 transition ${
            billingPeriod === "mensuel"
              ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              : "hover:text-slate-950"
          }`}
        >
          Mensuel
        </button>
        <button
          type="button"
          onClick={() => setBillingPeriod("annuel")}
          className={`rounded-full px-4 py-3 transition ${
            isAnnual
              ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              : "hover:text-slate-950"
          }`}
        >
          Annuel
        </button>
      </div>

      <article
        className={`mx-auto mt-6 flex max-w-2xl flex-col rounded-[2rem] bg-white/95 p-7 text-left shadow-[0_22px_70px_rgba(15,23,42,0.09)] ring-1 backdrop-blur sm:p-8 ${
          isAnnual ? "ring-blue-100" : "ring-slate-100"
        }`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-linkpost-blue ring-1 ring-blue-100">
              {offer.badge}
            </p>
            <h2 className="mt-4 text-2xl font-extrabold text-slate-950">
              {offer.name}
            </h2>
          </div>
          {isAnnual ? (
            <p className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-extrabold text-linkpost-blue ring-1 ring-blue-100">
              ⭐ Recommandée
            </p>
          ) : null}
        </div>

        <div className="mt-7">
          <p className="text-lg font-extrabold text-slate-400 line-through">
            {offer.oldPrice}
          </p>
          <p className="mt-2 text-[44px] font-extrabold leading-none text-slate-950 sm:text-[52px]">
            {offer.price}
          </p>
          <p className="mt-3 text-[15px] font-extrabold text-slate-500">
            {offer.note}
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-3 text-[15px] font-extrabold leading-6 text-slate-700"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-50 text-linkpost-blue ring-1 ring-blue-100">
                <Check size={16} strokeWidth={2.7} />
              </span>
              {feature}
            </li>
          ))}
        </ul>

        <a
          href={offer.checkoutHref}
          className="mt-8 inline-flex h-14 w-full items-center justify-center rounded-2xl bg-linkpost-blue px-6 text-[16px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px"
        >
          Commencer maintenant
        </a>
      </article>
    </div>
  );
}
