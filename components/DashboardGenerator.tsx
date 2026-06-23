"use client";

import {
  Check,
  Copy,
  Eye,
  Loader2,
  Lock,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DashboardGeneratorProps = {
  initialCreditsRemaining: number;
  initialIsPro: boolean;
  initialGenerations: Generation[];
  onProfileChange: (profile: {
    creditsRemaining: number;
    isPro: boolean;
  }) => void;
};

type Generation = {
  id: string;
  activity: string;
  generated_post: string;
  created_at: string;
};

function LockedResult() {
  return (
    <article className="mx-auto mt-8 flex min-h-[320px] max-w-3xl items-center justify-center rounded-[1.75rem] bg-slate-50/80 p-5 text-center shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)] sm:p-7">
      <div className="mx-auto max-w-xl">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-blue-50 text-linkpost-blue ring-1 ring-blue-100">
          <Lock size={24} strokeWidth={2.6} />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-slate-950">
          🔒 Plus de générations gratuites disponibles
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[16px] font-medium leading-8 text-slate-600">
          Vous avez utilisé vos 3 générations gratuites. Passez à Linkaro
          Premium pour continuer à générer des posts LinkedIn qui attirent des
          prospects.
        </p>
        <a
          href="/pricing"
          className="mt-6 inline-flex h-14 items-center justify-center rounded-2xl bg-linkpost-blue px-6 text-[16px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px"
        >
          🚀 Voir les offres
        </a>
      </div>
    </article>
  );
}

export default function DashboardGenerator({
  initialCreditsRemaining,
  initialIsPro,
  initialGenerations,
  onProfileChange,
}: DashboardGeneratorProps) {
  const [activity, setActivity] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState("");
  const [hasLockedResult, setHasLockedResult] = useState(false);
  const [currentGenerationId, setCurrentGenerationId] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [selectedGeneration, setSelectedGeneration] =
    useState<Generation | null>(null);
  const [copiedGenerationId, setCopiedGenerationId] = useState("");
  const [creditsRemaining, setCreditsRemaining] = useState(
    initialCreditsRemaining,
  );
  const [isPro, setIsPro] = useState(initialIsPro);
  const [generations, setGenerations] = useState(initialGenerations);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedActivity =
      window.sessionStorage.getItem("linkpost_activity") ??
      window.localStorage.getItem("linkpost_activity") ??
      "";

    setActivity(savedActivity);
  }, []);

  async function generatePost() {
    const trimmedActivity = activity.trim();

    if (!isPro && creditsRemaining <= 0) {
      setError("");
      setResult("");
      setHasLockedResult(true);
      setCurrentGenerationId("");
      setSaveMessage("");
      return;
    }

    if (!trimmedActivity) {
      setError("Décris ton activité avant de générer ton post.");
      setResult("");
      setHasLockedResult(false);
      textareaRef.current?.focus();
      return;
    }

    window.sessionStorage.setItem("linkpost_activity", trimmedActivity);
    window.localStorage.setItem("linkpost_activity", trimmedActivity);
    setCopied(false);
    setError("");
    setIsGenerating(true);
    setResult("");
    setHasLockedResult(false);
    setCurrentGenerationId("");
    setSaveMessage("");

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity: trimmedActivity }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          response.status === 402 &&
          typeof data.creditsRemaining === "number" &&
          data.creditsRemaining <= 0
        ) {
          setCreditsRemaining(0);
          setIsPro(false);
          onProfileChange({
            creditsRemaining: 0,
            isPro: false,
          });
          setHasLockedResult(true);
          return;
        }

        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Impossible de générer le post pour le moment.",
        );
      }

      if (typeof data.post !== "string" || !data.post.trim()) {
        throw new Error("La génération IA n'a pas retourné de contenu.");
      }

      const generatedPost = data.post.trim();
      setResult(generatedPost);

      const nextCredits =
        typeof data.creditsRemaining === "number"
          ? data.creditsRemaining
          : creditsRemaining;
      const nextIsPro =
        typeof data.isPro === "boolean" ? data.isPro : isPro;

      setCreditsRemaining(nextCredits);
      setIsPro(nextIsPro);
      onProfileChange({
        creditsRemaining: nextCredits,
        isPro: nextIsPro,
      });

      if (data.generation) {
        setCurrentGenerationId(data.generation.id);
        setGenerations((currentGenerations) => [
          data.generation,
          ...currentGenerations,
        ].slice(0, 5));
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Impossible de générer le post pour le moment.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function copyPost() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  async function savePostChanges() {
    if (!currentGenerationId || !result.trim()) {
      return;
    }

    setSaveMessage("");

    const response = await fetch(`/api/generations/${currentGenerationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ generated_post: result }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "Impossible de sauvegarder les modifications.",
      );
      return;
    }

    if (data.generation) {
      setGenerations((currentGenerations) =>
        currentGenerations.map((generation) =>
          generation.id === data.generation.id ? data.generation : generation,
        ),
      );
    }

    setSaveMessage("Modifications sauvegardées");
    window.setTimeout(() => setSaveMessage(""), 2200);
  }

  async function copyGeneration(generation: Generation) {
    await navigator.clipboard.writeText(generation.generated_post);
    setCopiedGenerationId(generation.id);
    window.setTimeout(() => setCopiedGenerationId(""), 1800);
  }

  function reuseGeneration(generation: Generation) {
    setActivity(generation.activity);
    window.sessionStorage.setItem("linkpost_activity", generation.activity);
    window.localStorage.setItem("linkpost_activity", generation.activity);
    textareaRef.current?.focus();
  }

  async function deleteGeneration(generation: Generation) {
    const confirmed = window.confirm(
      "Supprimer cette génération de ton historique ?",
    );

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/generations/${generation.id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "Impossible de supprimer cette génération.",
      );
      return;
    }

    setGenerations((currentGenerations) =>
      currentGenerations.filter((item) => item.id !== generation.id),
    );

    if (currentGenerationId === generation.id) {
      setCurrentGenerationId("");
      setResult("");
      setHasLockedResult(false);
    }

    if (selectedGeneration?.id === generation.id) {
      setSelectedGeneration(null);
    }
  }

  function formatGenerationDate(date: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] space-y-6">
        <section id="generation" className="scroll-mt-6 rounded-[2rem] bg-white/95 p-5 shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90 backdrop-blur sm:p-8 lg:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2.5 text-sm font-extrabold text-linkpost-blue ring-1 ring-blue-100">
            <Sparkles size={17} strokeWidth={2.5} />
            Générateur LinkedIn
          </div>
          <h1 className="mt-6 text-[34px] font-extrabold leading-tight text-slate-950 sm:text-[44px]">
            Crée ton premier post LinkedIn
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] font-medium leading-8 text-slate-600 sm:text-[18px]">
            Décris ton activité, ton offre ou ton audience. LinkPost génère un
            post optimisé pour attirer des prospects.
          </p>
        </div>

        <div className="mt-8 max-w-3xl">
          <label className="sr-only" htmlFor="dashboard-activity">
            Décris ton activité, ton offre ou ton audience
          </label>
          <textarea
            ref={textareaRef}
            id="dashboard-activity"
            value={activity}
            onChange={(event) => setActivity(event.target.value)}
            rows={5}
            placeholder="Exemple : J’aide les e-commerçants à augmenter leur ROAS avec Meta Ads…"
            className="min-h-[180px] w-full resize-none rounded-[2rem] border border-white/80 bg-white px-6 py-6 text-[18px] font-medium leading-8 text-slate-900 shadow-[0_22px_70px_rgba(37,99,235,0.14),0_10px_30px_rgba(15,23,42,0.07)] outline-none ring-1 ring-slate-100 transition placeholder:text-slate-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-100 sm:px-8"
          />

          <button
            type="button"
            onClick={generatePost}
            disabled={isGenerating}
            className="mt-5 inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-linkpost-blue px-6 text-[16px] font-extrabold text-white shadow-button transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-200 active:translate-y-px disabled:cursor-not-allowed disabled:bg-blue-400 sm:h-16 sm:text-[18px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="animate-spin" size={21} strokeWidth={2.5} />
                Génération en cours…
              </>
            ) : (
              "Générer le post"
            )}
          </button>

          {error ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600 ring-1 ring-red-100">
              {error}
            </p>
          ) : null}
        </div>

        {result ? (
          <article className="mt-8 max-w-3xl rounded-[1.75rem] bg-slate-50/80 p-5 text-left shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)] sm:p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-linkpost-blue">
                  Post généré
                </p>
                <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                  Première version prête
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copyPost}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                >
                  {copied ? <Check size={17} /> : <Copy size={17} />}
                  {copied ? "Copié" : "Copier"}
                </button>
                <button
                  type="button"
                  onClick={generatePost}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                >
                  <RefreshCw size={17} />
                  Régénérer
                </button>
                <button
                  type="button"
                  onClick={savePostChanges}
                  disabled={!currentGenerationId}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                >
                  <Save size={17} />
                  Sauvegarder les modifications
                </button>
              </div>
            </div>
            <textarea
              value={result}
              onChange={(event) => {
                setResult(event.target.value);
                setSaveMessage("");
              }}
              rows={12}
              className="mt-6 min-h-[320px] w-full resize-y rounded-[1.35rem] border border-slate-100 bg-white px-5 py-5 text-[16px] font-medium leading-8 text-slate-700 shadow-[0_8px_28px_rgba(15,23,42,0.06)] outline-none transition focus:border-blue-200 focus:ring-4 focus:ring-blue-100"
            />
            {saveMessage ? (
              <p className="mt-3 text-sm font-extrabold text-emerald-600">
                {saveMessage}
              </p>
            ) : null}
          </article>
        ) : hasLockedResult ? (
          <LockedResult />
        ) : null}

        </section>

        <section id="historique" className="scroll-mt-6 rounded-[2rem] bg-white/95 p-5 text-left shadow-[0_30px_100px_rgba(37,99,235,0.18),0_16px_50px_rgba(15,23,42,0.10)] ring-1 ring-white/90 backdrop-blur sm:p-8 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-linkpost-blue">
                Historique
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-950">
                5 dernières générations
              </h2>
            </div>
          </div>

          {generations.length > 0 ? (
            <div className="mt-5 space-y-3">
              {generations.map((generation) => (
                <article
                  key={generation.id}
                  className="rounded-2xl bg-slate-50/90 p-4 ring-1 ring-slate-100"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                        {formatGenerationDate(generation.created_at)}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                        {generation.generated_post}
                      </p>
                      <p className="mt-2 text-xs font-extrabold text-slate-400">
                        {generation.generated_post.length} caractères
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => copyGeneration(generation)}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                      >
                        {copiedGenerationId === generation.id ? (
                          <Check size={15} />
                        ) : (
                          <Copy size={15} />
                        )}
                        Copier
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedGeneration(generation)}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                      >
                        <Eye size={15} />
                        Ouvrir
                      </button>
                      <button
                        type="button"
                        onClick={() => reuseGeneration(generation)}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:text-linkpost-blue"
                      >
                        <RefreshCw size={15} />
                        Réutiliser
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteGeneration(generation)}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3 text-xs font-extrabold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)] ring-1 ring-slate-100 transition hover:text-red-600"
                      >
                        <Trash2 size={15} />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-slate-50/90 px-4 py-4 text-sm font-bold text-slate-500 ring-1 ring-slate-100">
              Tes générations apparaîtront ici après ton premier post.
            </p>
          )}
        </section>
      </div>

      {selectedGeneration ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[86vh] w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_rgba(15,23,42,0.22)] ring-1 ring-white/90">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-linkpost-blue">
                  Post complet
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                  {formatGenerationDate(selectedGeneration.created_at)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGeneration(null)}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Fermer la modal"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-6 py-5">
              <p className="whitespace-pre-line text-[16px] font-medium leading-8 text-slate-700">
                {selectedGeneration.generated_post}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
