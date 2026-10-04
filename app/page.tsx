import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-3xl">
        <p className="text-sm text-zinc-500 mb-4">MY TODO · SaaS</p>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
          Planifie moins.<br />Exécute mieux.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Une application de tâches simple, rapide et structurée pour piloter tes journées et tes semaines.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/register" className="rounded-xl bg-white text-black px-5 py-3 font-medium">Créer un compte</Link>
          <Link href="/login" className="rounded-xl border border-zinc-700 px-5 py-3 font-medium">Se connecter</Link>
        </div>
      </div>
    </main>
  );
}