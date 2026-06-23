"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BrandLogo from "./BrandLogo";
import DashboardGenerator from "./DashboardGenerator";
import { createClient } from "../lib/supabase/client";

type Generation = {
  id: string;
  activity: string;
  generated_post: string;
  created_at: string;
};

type DashboardAppProps = {
  initialProfile: {
    creditsRemaining: number;
    isPro: boolean;
  };
  initialGenerations: Generation[];
};

export default function DashboardApp({
  initialProfile,
  initialGenerations,
}: DashboardAppProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <div className="relative z-10 min-h-screen w-full lg:pl-72">
      <aside className="fixed inset-y-0 left-0 z-30 hidden h-screen w-72 flex-col border-r border-white/70 bg-white/[0.88] px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl lg:flex">
        <div>
          <a
            href="/"
            className="inline-flex"
            aria-label="Retour à l'accueil Linkaro"
          >
            <BrandLogo imageClassName="h-10 w-auto" />
          </a>
          <div className="mt-6 rounded-[1.25rem] bg-blue-50 px-4 py-3 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            {profile.isPro
              ? "Pro illimité"
              : `${profile.creditsRemaining} crédit${
                  profile.creditsRemaining > 1 ? "s" : ""
                } restant${profile.creditsRemaining > 1 ? "s" : ""}`}
          </div>
        </div>

        <nav className="mt-8 grid gap-2 text-sm font-extrabold">
          <a
            href="#generation"
            className="rounded-[1rem] px-4 py-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Génération de post
          </a>
          <a
            href="#historique"
            className="rounded-[1rem] px-4 py-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Historique
          </a>
        </nav>

        <button
          type="button"
          onClick={logout}
          className="mt-auto w-full rounded-full bg-linkpost-blue px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)] transition hover:bg-blue-500"
        >
          Déconnexion
        </button>
      </aside>

      <aside className="sticky top-0 z-30 border-b border-white/70 bg-white/[0.88] px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex"
            aria-label="Retour à l'accueil Linkaro"
          >
            <BrandLogo imageClassName="h-8 w-auto" />
          </a>
          <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            {profile.isPro
              ? "Pro illimité"
              : `${profile.creditsRemaining} crédit${
                  profile.creditsRemaining > 1 ? "s" : ""
                }`}
          </span>
        </div>
        <nav className="mt-4 grid grid-cols-2 gap-2 text-sm font-extrabold">
          <a
            href="#generation"
            className="rounded-full px-3 py-2.5 text-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Génération de post
          </a>
          <a
            href="#historique"
            className="rounded-full px-3 py-2.5 text-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Historique
          </a>
        </nav>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-full bg-linkpost-blue px-4 py-2.5 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)] transition hover:bg-blue-500"
        >
          Déconnexion
        </button>
      </aside>

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <DashboardGenerator
          initialCreditsRemaining={profile.creditsRemaining}
          initialIsPro={profile.isPro}
          initialGenerations={initialGenerations}
          onProfileChange={setProfile}
        />
      </main>
    </div>
  );
}
