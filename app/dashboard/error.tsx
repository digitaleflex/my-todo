"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold">Le dashboard est indisponible</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {error.message === "Accès refusé"
            ? "Tu n'as pas accès à cet espace."
            : "Une erreur est survenue, réessaie."}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded-xl bg-white px-5 py-3 text-black font-medium"
        >
          Réessayer
        </button>
      </div>
    </main>
  );
}
