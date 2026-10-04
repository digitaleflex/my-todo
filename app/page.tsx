import Link from "next/link";

/**
 * Anneau de focus visible des liens d'appel à l'action.
 * `outline: none` n'est posé que dans la variante `focus-visible`, et toujours
 * remplacé par un anneau : la navigation clavier reste donc perceptible.
 */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh w-full flex-col justify-center overflow-hidden px-4 py-16 sm:px-6">
      {/* Halo décoratif : purement visuel, masqué aux technologies d'assistance. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-linear-to-b from-zinc-900/80 to-transparent"
      />

      <div className="mx-auto w-full max-w-3xl">
        <p className="text-xs font-medium tracking-[0.2em] text-zinc-400 uppercase sm:text-sm">
          MY TODO · SaaS
        </p>

        {/* `text-3xl` à 320px : les deux lignes tiennent sans retour à la ligne. */}
        <h1 className="mt-4 text-balance break-words text-3xl font-semibold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl lg:text-7xl">
          Planifie moins.
          <br />
          Exécute mieux.
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-base text-zinc-400 sm:text-lg">
          Une application de tâches simple, rapide et structurée pour piloter tes
          journées et tes semaines.
        </p>

        {/* Séparateur décoratif : aucune information à transmettre. */}
        <div aria-hidden="true" className="mt-10 h-px w-full bg-zinc-800" />

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/register"
            className={[
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-5 py-3",
              "font-medium text-black transition-colors motion-reduce:transition-none",
              "hover:bg-zinc-400 active:bg-zinc-500 sm:w-auto",
              focusRing,
            ].join(" ")}
          >
            Créer un compte
          </Link>
          <Link
            href="/login"
            className={[
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-zinc-700 px-5 py-3",
              "font-medium text-zinc-100 transition-colors motion-reduce:transition-none",
              "hover:border-zinc-500 hover:bg-zinc-900 active:bg-zinc-900 sm:w-auto",
              focusRing,
            ].join(" ")}
          >
            Se connecter
          </Link>
        </div>
      </div>
    </main>
  );
}