"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.replace("/login"),
      },
    });
    setPending(false);
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-medium disabled:opacity-60"
    >
      {pending ? "Déconnexion…" : "Se déconnecter"}
    </button>
  );
}
