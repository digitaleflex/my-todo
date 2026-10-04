"use client";

import { useEffect } from "react";
import { AccessDeniedError } from "@/lib/errors";
import { Button } from "@/components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Seul le digest est journalisé : le message brut peut contenir un détail technique.
  useEffect(() => {
    console.error(
      "[dashboard] erreur de rendu",
      error instanceof AccessDeniedError ? error.message : error.digest ?? "digest inconnu",
    );
  }, [error]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold">Le dashboard est indisponible</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {error instanceof AccessDeniedError
            ? "Cette page n’est pas accessible."
            : "Une erreur est survenue, réessaie."}
        </p>
        <Button onClick={reset} className="mt-6">
          Réessayer
        </Button>
      </div>
    </main>
  );
}