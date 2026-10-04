import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Connexion</h1>
        <p className="mt-2 text-zinc-400">L’authentification sera branchée sur Better Auth.</p>
        <form className="mt-8 space-y-4">
          <input name="email" type="email" placeholder="Email" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <input name="password" type="password" placeholder="Mot de passe" className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <button className="w-full rounded-xl bg-white text-black p-3 font-medium">Se connecter</button>
        </form>
        <Link href="/register" className="mt-5 block text-sm text-zinc-400">Créer un compte</Link>
      </div>
    </main>
  );
}