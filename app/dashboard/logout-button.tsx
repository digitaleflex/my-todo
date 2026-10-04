"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui";

/** Déconnexion : invalide la session côté serveur puis redirige vers /login. */
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
    <Button variant="secondary" size="sm" onClick={onClick} disabled={pending}>
      {pending ? "Déconnexion…" : "Déconnexion"}
    </Button>
  );
}