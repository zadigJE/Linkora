import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import AuthAccessForm from "../../components/AuthAccessForm";
import BrandLogo from "../../components/BrandLogo";
import {
  createClient,
  isServerSupabaseConfigured,
} from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Connexion - Linkora.tech",
  description: "Connectez-vous ou créez votre compte Linkora gratuitement.",
};

function getSafeNextPath(nextPath: string | string[] | undefined) {
  const value = Array.isArray(nextPath) ? nextPath[0] : nextPath;
  return value?.startsWith("/") ? value : "/dashboard";
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const nextPath = getSafeNextPath((await searchParams)?.next);

  if (isServerSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      redirect(nextPath);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(219,234,254,0.86)_0%,rgba(239,246,255,0.96)_42%,rgba(255,255,255,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-17rem] h-[660px] w-[1040px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.34),rgba(191,219,254,0.20)_48%,rgba(255,255,255,0)_72%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-24rem] right-[-12rem] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.18),rgba(255,255,255,0)_68%)] blur-2xl" />

      <header className="relative z-10 mx-auto flex w-full max-w-[1120px] items-center justify-between rounded-full border border-white/70 bg-white/[0.84] px-5 py-3.5 shadow-[0_18px_60px_rgba(15,23,42,0.10)] ring-1 ring-white/70 backdrop-blur-xl">
        <a
          href="/"
          className="inline-flex"
          aria-label="Retour à l'accueil Linkora"
        >
          <BrandLogo imageClassName="h-8 w-auto sm:h-9" />
        </a>
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          <ArrowLeft size={17} strokeWidth={2.4} />
          Retour accueil
        </a>
      </header>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-[1120px] items-center justify-center py-12 lg:py-16">
        <div className="w-full max-w-[500px] rounded-[2rem] bg-white/95 p-6 text-center shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90 backdrop-blur sm:p-8">
          <h1 className="text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[42px]">
            Connecte-toi à Linkora
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-[16px] font-semibold leading-7 text-slate-500">
            Crée ton premier post LinkedIn en 30 secondes.
          </p>

          <AuthAccessForm />
        </div>
      </section>
    </main>
  );
}
