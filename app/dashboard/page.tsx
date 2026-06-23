import type { Metadata } from "next";
import { redirect } from "next/navigation";
import DashboardApp from "../../components/DashboardApp";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../lib/supabase/server";
import { getOrCreateProfile } from "../../lib/supabase/profiles";

export const metadata: Metadata = {
  title: "Dashboard - LinkPost.tech",
  description: "Générez votre premier post LinkedIn avec LinkPost.",
};

function MissingSupabaseConfig() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24rem] right-[-12rem] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),rgba(255,255,255,0)_68%)] blur-2xl" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <div className="rounded-[2rem] bg-white/95 p-8 text-center shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90">
          <h1 className="text-3xl font-extrabold text-slate-950">
            Configuration Supabase manquante
          </h1>
          <p className="mt-4 text-sm font-bold leading-7 text-slate-500">
            Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY
            dans .env.local, puis relancez le serveur.
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
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />

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

export default async function DashboardPage() {
  if (!isServerSupabaseConfigured()) {
    return <MissingSupabaseConfig />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const profileResult = await getOrCreateProfile(supabase, user);

  if (profileResult.error) {
    return <ProfileSetupError message={profileResult.error} />;
  }

  if (!profileResult.profile) {
    return (
      <ProfileSetupError message="Profil introuvable, création automatique impossible." />
    );
  }

  const profile = profileResult.profile;

  const { data: generations } = await supabase
    .from("generations")
    .select("id,activity,generated_post,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24rem] right-[-12rem] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),rgba(255,255,255,0)_68%)] blur-2xl" />

      <DashboardApp
        initialProfile={{
          creditsRemaining: profile?.credits_remaining ?? 3,
          isPro: profile?.is_pro ?? false,
        }}
        initialGenerations={generations ?? []}
      />
    </main>
  );
}
