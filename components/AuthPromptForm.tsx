"use client";

import { useRouter } from "next/navigation";
import {
  createClient,
  isSupabaseConfigured,
} from "../lib/supabase/client";

type AuthPromptFormProps = {
  inputId: string;
  rows: number;
  formClassName: string;
  textareaClassName: string;
  buttonClassName: string;
};

export default function AuthPromptForm({
  inputId,
  rows,
  formClassName,
  textareaClassName,
  buttonClassName,
}: AuthPromptFormProps) {
  const router = useRouter();

  return (
    <form
      className={formClassName}
      onSubmit={async (event) => {
        event.preventDefault();
        const activity = new FormData(event.currentTarget)
          .get("activity")
          ?.toString()
          .trim();

        if (activity) {
          window.sessionStorage.setItem("linkpost_activity", activity);
          window.localStorage.setItem("linkpost_activity", activity);
        }

        if (isSupabaseConfigured()) {
          const supabase = createClient();
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            router.push("/dashboard");
            return;
          }
        }

        router.push("/auth");
      }}
    >
      <label className="sr-only" htmlFor={inputId}>
        Décris ton activité en une phrase
      </label>
      <textarea
        id={inputId}
        name="activity"
        rows={rows}
        placeholder="Décrivez votre activité ou votre idée en une phrase..."
        className={textareaClassName}
      />

      <button type="submit" className={buttonClassName}>
        Créer mon premier post
      </button>
    </form>
  );
}
