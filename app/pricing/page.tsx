import type { Metadata } from "next";
import { ArrowLeft, Check, ChevronDown, Sparkles } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import PricingOfferSelector from "../../components/PricingOfferSelector";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Pricing - Linkora.tech",
  description: "Offre Fondateur Linkora.",
};

const benefits = [
  "Des posts LinkedIn structurés pour attirer des prospects.",
  "Un générateur pensé pour l'acquisition, pas seulement la visibilité.",
  "Un tarif fondateur conservé à vie pour les 50 premiers utilisateurs.",
];

const faqs = [
  {
    question: "Que comprend l'offre fondateur ?",
    answer:
      "Elle donne accès à Linkora Premium au tarif fondateur, avec un prix conservé à vie pour les 50 premiers utilisateurs.",
  },
  {
    question: "Puis-je choisir entre mensuel et annuel ?",
    answer:
      "Oui. Vous pouvez choisir l'offre mensuelle à 39€/mois ou l'offre annuelle recommandée à 349€/an.",
  },
  {
    question: "Le tarif est-il vraiment bloqué à vie ?",
    answer:
      "Oui. Les 50 premiers utilisateurs conserveront ce tarif à vie.",
  },
  {
    question: "Linkora est-il adapté à mon activité ?",
    answer:
      "Linkora est conçu pour les indépendants, consultants, agences, coachs et entreprises qui veulent créer des posts LinkedIn orientés prospects.",
  },
];

export default async function PricingPage() {
  let isAuthenticated = false;

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    isAuthenticated = Boolean(user);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24rem] right-[-12rem] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),rgba(255,255,255,0)_68%)] blur-2xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1120px] items-center justify-between rounded-full border border-white/70 bg-white/[0.84] px-5 py-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl">
        <a href="/" className="inline-flex" aria-label="Linkora accueil">
          <BrandLogo imageClassName="h-8 w-auto sm:h-9" />
        </a>
        <a
          href={isAuthenticated ? "/dashboard" : "/auth?next=/pricing"}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          {isAuthenticated ? "Retour dashboard" : "Se connecter"}
        </a>
      </header>

      <section className="relative z-10 mx-auto w-full max-w-[1120px] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2.5 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            <Sparkles size={17} strokeWidth={2.5} />
            🔥 Offre Fondateur — 50 premiers utilisateurs uniquement
          </div>
          <h1 className="mt-7 text-[38px] font-extrabold leading-tight text-slate-950 sm:text-[52px] lg:text-[60px]">
            Choisissez votre offre fondateur
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[17px] font-medium leading-8 text-slate-600 sm:text-[19px]">
            Les 50 premiers utilisateurs conserveront ce tarif à vie.
          </p>
        </div>

        <PricingOfferSelector />
      </section>

      <section className="relative z-10 mx-auto w-full max-w-[1120px] py-16 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-linkpost-blue">
              Pourquoi Linkora ?
            </p>
            <h2 className="mt-4 text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[44px]">
              Créez des posts LinkedIn plus orientés prospects.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => (
              <article
                key={benefit}
                className="rounded-[1.5rem] bg-white/92 p-5 shadow-[0_14px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-100"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-50 text-linkpost-blue ring-1 ring-blue-100">
                  <Check size={17} strokeWidth={2.7} />
                </span>
                <p className="mt-4 text-[15px] font-bold leading-7 text-slate-600">
                  {benefit}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-3xl py-16 sm:py-20">
        <div className="text-center">
          <h2 className="text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[44px]">
            FAQ
          </h2>
          <p className="mt-4 text-[17px] font-medium leading-8 text-slate-600">
            Les réponses aux questions les plus fréquentes.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-[1.5rem] bg-white/94 px-6 py-5 shadow-[0_14px_45px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 open:shadow-[0_22px_60px_rgba(59,130,246,0.12)]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-[17px] font-extrabold text-slate-950 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <ChevronDown
                  className="shrink-0 text-slate-400 transition group-open:rotate-180 group-open:text-linkpost-blue"
                  size={22}
                  strokeWidth={2.4}
                />
              </summary>
              <p className="mt-4 text-[15px] font-medium leading-7 text-slate-600">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
