import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import BrandLogo from "../../components/BrandLogo";
import SettingsForm from "../../components/SettingsForm";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../lib/supabase/server";
import { getOrCreateProfile, getPlanLabel } from "../../lib/supabase/profiles";

export const metadata: Metadata = {
  title: "Paramètres - LinkPost.tech",
  description: "Gérez votre profil LinkPost.",
};

function MissingSupabaseConfig() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <div className="rounded-[2rem] bg-white/95 p-8 text-center shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Configuration Supabase manquante
          </h1>
          <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
            Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
            dans .env, puis relancez le serveur.
          </p>
        </div>
      </section>
    </main>
  );
}

function ProfileSetupError({ message }: { message: string }) {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <div className="rounded-[2rem] bg-white/95 p-8 text-center shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Profil LinkPost indisponible
          </h1>
          <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
            {message}
          </p>
        </div>
      </section>
    </main>
  );
}

export default async function SettingsPage() {
  if (!isServerSupabaseConfigured()) {
    return <MissingSupabaseConfig />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth?next=/settings");
  }

  const profileResult = await getOrCreateProfile(supabase, user);

  if (profileResult.error || !profileResult.profile) {
    return (
      <ProfileSetupError
        message={profileResult.error ?? "Profil introuvable."}
      />
    );
  }

  const profile = profileResult.profile;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24rem] right-[-12rem] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),rgba(255,255,255,0)_68%)] blur-2xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-[860px] items-center justify-between rounded-full border border-white/70 bg-white/[0.84] px-5 py-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl">
        <a
          href="/"
          className="inline-flex"
          aria-label="Retour à l'accueil Linkaro"
        >
          <BrandLogo imageClassName="h-8 w-auto sm:h-9" />
        </a>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          Dashboard
        </a>
      </header>

      <SettingsForm
        profile={{
          id: profile.id,
          email: profile.email,
          username:
            profile.username ??
            (typeof user.user_metadata?.name === "string"
              ? user.user_metadata.name
              : null),
          creditsRemaining: profile.credits_remaining,
          planLabel: getPlanLabel(profile),
          createdAt: profile.created_at,
        }}
      />
    </main>
  );
}
