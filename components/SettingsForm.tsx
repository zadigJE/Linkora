"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "../lib/supabase/client";

type SettingsFormProps = {
  profile: {
    id: string;
    email: string | null;
    username: string | null;
    creditsRemaining: number;
    planLabel: string;
    createdAt: string;
  };
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function SettingsForm({ profile }: SettingsFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState(profile.username ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveUsername() {
    const nextUsername = username.trim();

    if (!nextUsername) {
      setMessage("Choisis un nom d'utilisateur.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          username: nextUsername,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) {
        const { error: metadataError } = await supabase.auth.updateUser({
          data: { name: nextUsername },
        });

        if (metadataError) {
          setMessage("Impossible de sauvegarder le nom d'utilisateur.");
          return;
        }
      }

      setUsername(nextUsername);
      setMessage("Paramêtres sauvegardés.");
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="relative z-10 mx-auto w-full max-w-[860px] py-12 sm:py-16">
      <div className="rounded-[2rem] bg-white/95 p-5 shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90 backdrop-blur sm:p-8 lg:p-10">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-linkpost-blue">
            Profil
          </p>
          <h1 className="mt-3 text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[44px]">
            Paramêtres du compte
          </h1>
        </div>

        <div className="mt-8 grid gap-5">
          <label className="block">
            <span className="text-sm font-extrabold text-slate-700">
              Nom d'utilisateur
            </span>
            <input
              type="text"
              value={username}
              onChange={(event) => {
                setUsername(event.target.value);
                setMessage("");
              }}
              className="mt-2 h-14 w-full rounded-2xl border border-slate-100 bg-slate-50/70 px-4 text-[15px] font-semibold text-slate-900 outline-none ring-1 ring-white transition focus:border-blue-200 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50/90 px-4 py-4 ring-1 ring-slate-100">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Email
              </p>
              <p className="mt-2 break-words text-sm font-extrabold text-slate-800">
                {profile.email ?? "Email indisponible"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50/90 px-4 py-4 ring-1 ring-slate-100">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Crédits restants
              </p>
              <p className="mt-2 text-sm font-extrabold text-slate-800">
                {profile.creditsRemaining}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50/90 px-4 py-4 ring-1 ring-slate-100">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Statut du plan
              </p>
              <p className="mt-2 text-sm font-extrabold text-slate-800">
                {profile.planLabel}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50/90 px-4 py-4 ring-1 ring-slate-100">
              <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                Création du compte
              </p>
              <p className="mt-2 text-sm font-extrabold text-slate-800">
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={saveUsername}
              disabled={isSaving}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-linkpost-blue px-6 text-[16px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px disabled:cursor-not-allowed disabled:bg-blue-400"
            >
              <Save size={18} strokeWidth={2.5} />
              {isSaving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            {message ? (
              <p className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
                {message}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
