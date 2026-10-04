import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Créer un compte</h1>
        <p className="mt-2 text-zinc-400">Ton espace personnel sera créé après inscription.</p>
        <form className="mt-8 space-y-4">
          <input name="name" placeholder="Nom" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <input name="password" type="password" placeholder="Mot de passe" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <button className="w-full rounded-xl bg-white text-black p-3 font-medium">Créer mon compte</button>
        </form>
        <Link href="/login" className="mt-5 block text-sm text-zinc-400">J’ai déjà un compte</Link>
      </div>
    </main>
  );
}