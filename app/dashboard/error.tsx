"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Le digest est journalisé côté serveur ; jamais le message brut en production.
  useEffect(() => {
    console.error("Erreur dashboard", error.digest ?? "digest inconnu");
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold">Le dashboard est indisponible</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {error.message === "Accès refusé"
            ? "Tu n’as pas accès à cet espace."
            : "Une erreur est survenue, réessaie."}
        </p>
        <Button onClick={reset} className="mt-6">
          Réessayer
        </Button>
      </div>
    </main>
  );
}