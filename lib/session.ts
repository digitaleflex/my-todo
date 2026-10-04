import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ensurePersonalWorkspace } from "@/lib/workspace";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user ?? null;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Workspace courant garanti : crée l'espace personnel à la volée
 * si l'utilisateur n'en a pas (auto-réparation, ex. comptes pré-#4).
 */
export async function requireWorkspace() {
  const user = await requireUser();
  return ensurePersonalWorkspace(user.id, user.name);
}
