"use client";

import { ArrowLeft } from "lucide-react";
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
    plan: "free" | "founder" | "pro";
    email: string | null;
    username: string | null;
  };
  initialGenerations: Generation[];
};

export default function DashboardApp({
  initialProfile,
  initialGenerations,
}: DashboardAppProps) {
  const router = useRouter();
  const [profile, setProfile] = useState(initialProfile);
  const profileName = profile.username?.trim() || profile.email || "Utilisateur";
  const profileInitial = profileName.charAt(0).toUpperCase();

  function handleProfileChange(nextProfile: {
    creditsRemaining: number;
    isPro: boolean;
  }) {
    setProfile((currentProfile) => ({
      ...currentProfile,
      ...nextProfile,
    }));
  }

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
          <div className="flex items-center justify-between gap-3">
            <a
              href="/?landing=1"
              className="inline-flex"
              aria-label="Retour à l'accueil Linkora"
            >
              <BrandLogo imageClassName="h-10 w-auto" />
            </a>
            <a
              href="/?landing=1"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Retour à la première page"
              title="Retour à la première page"
            >
              <ArrowLeft size={20} strokeWidth={2.4} />
            </a>
          </div>
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
          <a
            href="/settings"
            className="rounded-[1rem] px-4 py-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Profil / Paramêtres
          </a>
          <a
            href="/pricing"
            className="rounded-[1rem] px-4 py-3 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Upgrade
          </a>
        </nav>

        <div className="mt-auto flex items-center justify-between gap-3 rounded-[1.25rem] bg-blue-50 px-4 py-3 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
          <span>
            {profile.isPro
              ? "Pro illimité"
              : `${profile.creditsRemaining} crédit${
                  profile.creditsRemaining > 1 ? "s" : ""
                } restant${profile.creditsRemaining > 1 ? "s" : ""}`}
          </span>
          <a
            href="/pricing"
            className="shrink-0 text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-linkpost-blue hover:decoration-linkpost-blue"
          >
            Upgrade
          </a>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-[1.25rem] bg-white/80 px-4 py-3 ring-1 ring-slate-100">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            {profileInitial}
          </span>
          <div className="min-w-0">
            {profile.username ? (
              <p className="truncate text-sm font-extrabold text-slate-950">
                {profile.username}
              </p>
            ) : null}
            <p className="truncate text-xs font-bold text-slate-500">
              {profile.email ?? "Email indisponible"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="mt-3 w-full rounded-full bg-linkpost-blue px-4 py-3 text-sm font-extrabold text-white shadow-[0_12px_28px_rgba(59,130,246,0.24)] transition hover:bg-blue-500"
        >
          Déconnexion
        </button>
      </aside>

      <aside className="sticky top-0 z-30 border-b border-white/70 bg-white/[0.88] px-4 py-4 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <a
            href="/?landing=1"
            className="inline-flex"
            aria-label="Retour à l'accueil Linkora"
          >
            <BrandLogo imageClassName="h-8 w-auto" />
          </a>
          <div className="flex items-center gap-2">
            <a
              href="/?landing=1"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              aria-label="Retour à la première page"
              title="Retour à la première page"
            >
              <ArrowLeft size={19} strokeWidth={2.4} />
            </a>
            <span className="rounded-full bg-blue-50 px-3 py-2 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
              {profile.isPro
                ? "Pro illimité"
                : `${profile.creditsRemaining} crédit${
                    profile.creditsRemaining > 1 ? "s" : ""
                  }`}
            </span>
          </div>
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
          <a
            href="/settings"
            className="rounded-full px-3 py-2.5 text-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Paramêtres
          </a>
          <a
            href="/pricing"
            className="rounded-full px-3 py-2.5 text-center text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Upgrade
          </a>
        </nav>
        <div className="mt-3 flex items-center justify-between gap-3 rounded-full bg-blue-50 px-3 py-2 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
          <span>
            {profile.isPro
              ? "Pro illimité"
              : `${profile.creditsRemaining} crédit${
                  profile.creditsRemaining > 1 ? "s" : ""
                } restant${profile.creditsRemaining > 1 ? "s" : ""}`}
          </span>
          <a
            href="/pricing"
            className="shrink-0 text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-linkpost-blue hover:decoration-linkpost-blue"
          >
            Upgrade
          </a>
        </div>
        <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2.5 ring-1 ring-slate-100">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            {profileInitial}
          </span>
          <div className="min-w-0">
            {profile.username ? (
              <p className="truncate text-sm font-extrabold text-slate-950">
                {profile.username}
              </p>
            ) : null}
            <p className="truncate text-xs font-bold text-slate-500">
              {profile.email ?? "Email indisponible"}
            </p>
          </div>
        </div>
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
          onProfileChange={handleProfileChange}
        />
      </main>
    </div>
  );
}
