"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  createClient,
  isSupabaseConfigured,
} from "../lib/supabase/client";

export default function LandingSessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return;
    }

    const supabase = createClient();
    let isMounted = true;

    async function redirectAuthenticatedUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (isMounted && user) {
        router.replace("/dashboard");
        router.refresh();
      }
    }

    redirectAuthenticatedUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        router.replace("/dashboard");
        router.refresh();
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return null;
}
