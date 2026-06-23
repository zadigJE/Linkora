"use client";

import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createClient,
  isSupabaseConfigured,
} from "../lib/supabase/client";

export default function AuthAccessForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleEmailAuth(formData: FormData) {
    setMessage("");

    if (!isSupabaseConfigured()) {
      setMessage(
        "Configuration Supabase manquante. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
      );
      return;
    }

    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setMessage("Renseigne ton email et ton mot de passe.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const response =
        mode === "signup"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (response.error) {
        setMessage(response.error.message);
        return;
      }

      if (mode === "signup" && !response.data.session) {
        setMessage(
          "Compte créé. Vérifie tes emails pour confirmer ton inscription, puis connecte-toi.",
        );
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  async function signInWithGoogle() {
    setMessage("");

    if (!isSupabaseConfigured()) {
      setMessage(
        "Configuration Supabase manquante. Ajoutez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans .env.local",
      );
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <div className="mt-8 flex rounded-full bg-slate-50 p-1 text-sm font-extrabold text-slate-500 ring-1 ring-slate-100">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-full px-4 py-3 transition ${
            mode === "login"
              ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              : "hover:text-slate-950"
          }`}
        >
          Connexion
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full px-4 py-3 transition ${
            mode === "signup"
              ? "bg-white text-slate-950 shadow-[0_8px_20px_rgba(15,23,42,0.06)]"
              : "hover:text-slate-950"
          }`}
        >
          Inscription
        </button>
      </div>

      <form
        className="mt-5 space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          handleEmailAuth(new FormData(event.currentTarget));
        }}
      >
        <label className="block text-left">
          <span className="sr-only">Email</span>
          <span className="flex h-14 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 ring-1 ring-white transition focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
            <Mail className="shrink-0 text-slate-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            />
          </span>
        </label>

        <label className="block text-left">
          <span className="sr-only">Mot de passe</span>
          <span className="flex h-14 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 ring-1 ring-white transition focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
            <Lock className="shrink-0 text-slate-400" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              className="h-full min-w-0 flex-1 bg-transparent text-[15px] font-semibold text-slate-900 outline-none placeholder:text-slate-400"
            />
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="h-14 w-full rounded-2xl bg-linkpost-blue px-6 text-[16px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px"
        >
          {isLoading
            ? "Connexion en cours..."
            : mode === "signup"
              ? "Créer mon compte"
              : "Continuer"}
        </button>
      </form>

      <button
        type="button"
        onClick={signInWithGoogle}
        className="mt-4 h-14 w-full rounded-2xl border border-slate-200 bg-white px-6 text-[15px] font-extrabold text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-blue-100 hover:text-slate-950 hover:shadow-[0_18px_42px_rgba(37,99,235,0.10)]"
      >
        Continuer avec Google
      </button>

      {message ? (
        <p className="mt-4 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
          {message}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => setMode(mode === "signup" ? "login" : "signup")}
        className="mt-6 inline-flex text-sm font-extrabold text-linkpost-blue transition hover:text-blue-500"
      >
        {mode === "signup"
          ? "Déjà un compte ? Se connecter"
          : "Pas encore de compte ? Inscription gratuite"}
      </button>
    </>
  );
}
