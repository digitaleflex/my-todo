"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validators/auth";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace("/dashboard");
    }
  }, [session, sessionPending, router]);

  async function onSubmit(formData: FormData) {
    setError(null);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }
    setPending(true);
    const { error } = await authClient.signIn.email(
      {
        email: parsed.data.email,
        password: parsed.data.password,
        callbackURL: "/dashboard",
      },
      {
        onSuccess: () => router.replace("/dashboard"),
      }
    );
    setPending(false);
    if (error) {
      setError(error.message ?? "Connexion impossible");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-semibold">Connexion</h1>
        <p className="mt-2 text-zinc-400">Heureux de te revoir.</p>
        <form action={onSubmit} className="mt-8 space-y-4">
          <input name="email" type="email" placeholder="Email" autoComplete="email" required className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          <input name="password" type="password" placeholder="Mot de passe" autoComplete="current-password" required className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3" />
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
          <button disabled={pending} className="w-full rounded-xl bg-white text-black p-3 font-medium disabled:opacity-60">
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <Link href="/register" className="mt-5 block text-sm text-zinc-400">Créer un compte</Link>
      </div>
    </main>
  );
}
