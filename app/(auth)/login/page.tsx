"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { loginSchema } from "@/lib/validators/auth";

/** Champs du formulaire de connexion susceptibles de porter une erreur de validation Zod. */
type LoginField = "email" | "password";

/** Identifiant unique du message d'erreur annoncé (à ne pas réutiliser ailleurs). */
const ERROR_ID = "login-error";

/**
 * Anneau de focus visible partagé par tous les éléments interactifs.
 * `outline: none` n'est posé que dans la variante `focus-visible`, et toujours
 * remplacé par un anneau : la navigation clavier reste donc perceptible.
 */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950";

/**
 * Classes communes aux champs de formulaire.
 * @param invalid - Le champ est-il marqué `aria-invalid="true"` ?
 * @returns Les utilitaires Tailwind à fusionner avec celles du champ.
 */
function fieldClasses(invalid: boolean): string {
  return [
    // Cible tactile >= 44px, largeur fluide, `text-base` pour éviter le zoom iOS.
    "min-h-11 w-full rounded-xl border bg-zinc-950 px-3 py-2.5 text-base text-zinc-100",
    "placeholder:text-zinc-400",
    // Contraste >= 4.5:1 sur fond zinc-950.
    invalid ? "border-red-400" : "border-zinc-800",
    focusRing,
  ].join(" ");
}

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  /** Champ à pointer via `aria-invalid`/`aria-describedby`, ou `form` pour une erreur globale. */
  const [errorField, setErrorField] = useState<LoginField | "form" | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!sessionPending && session) {
      router.replace("/dashboard");
    }
  }, [session, sessionPending, router]);

  async function onSubmit(formData: FormData) {
    setError(null);
    setErrorField(null);
    const parsed = loginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      // La première issue de Zod détermine le champ à marquer comme invalide.
      const [path] = parsed.error.issues[0]?.path ?? [];
      setErrorField(path === "email" || path === "password" ? path : "form");
      setError(parsed.error.issues[0]?.message ?? "Champs invalides");
      return;
    }
    setPending(true);
    const { error: signInError } = await authClient.signIn.email(
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
    if (signInError) {
      // Échec d'authentification : message global, rattaché au bouton d'envoi.
      setErrorField("form");
      setError(signInError.message ?? "Connexion impossible");
    }
  }

  const emailInvalid = errorField === "email";
  const passwordInvalid = errorField === "password";

  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          Connexion
        </h1>
        <p className="mt-2 text-base text-zinc-400">Heureux de te revoir.</p>

        {/*
          `noValidate` centralise la remontée d'erreurs dans Zod : chaque message
          est ainsi annoncé via `role="alert"` et relié au champ concerné.
        */}
        <form action={onSubmit} noValidate className="mt-8 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-zinc-400"
            >
              Email
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              placeholder="toi@exemple.com"
              aria-invalid={emailInvalid}
              aria-describedby={emailInvalid ? ERROR_ID : undefined}
              className={fieldClasses(emailInvalid)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-x-4">
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-zinc-400"
              >
                Mot de passe
              </label>
              {/*
                Flux volontairement non implémenté : l'entrée reste focusable
                et annoncée comme désactivée, sans jamais être activable.
              */}
              <span
                role="link"
                aria-disabled="true"
                aria-describedby="login-forgot-note"
                tabIndex={0}
                title="Disponible quand l'envoi d'e-mail sera activé"
                className={[
                  "inline-flex min-h-11 cursor-not-allowed items-center text-sm text-zinc-500",
                  "underline decoration-dotted underline-offset-4",
                  focusRing,
                ].join(" ")}
              >
                Mot de passe oublié ?
              </span>
              <span id="login-forgot-note" className="sr-only">
                Disponible quand l&apos;envoi d&apos;e-mail sera activé
              </span>
            </div>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              aria-invalid={passwordInvalid}
              aria-describedby={passwordInvalid ? ERROR_ID : undefined}
              className={fieldClasses(passwordInvalid)}
            />
          </div>

          {error && (
            <p
              id={ERROR_ID}
              role="alert"
              className="rounded-xl border border-red-400/40 bg-zinc-950 px-3 py-2.5 text-sm text-red-400"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            aria-describedby={errorField === "form" && error ? ERROR_ID : undefined}
            className={[
              "inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-5 py-3",
              "font-medium text-black transition-colors motion-reduce:transition-none",
              "hover:bg-zinc-400 active:bg-zinc-500",
              "disabled:cursor-not-allowed disabled:opacity-60",
              focusRing,
            ].join(" ")}
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <Link
          href="/register"
          className={[
            "mt-4 inline-flex min-h-11 items-center text-sm text-zinc-400",
            "underline decoration-zinc-500 underline-offset-4 hover:text-white",
            focusRing,
          ].join(" ")}
        >
          Créer un compte
        </Link>
      </div>
    </main>
  );
}