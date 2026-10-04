import { randomBytes } from "crypto";
import { db } from "@/lib/db";

function slugify(value: string): string {
  const base = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return base || "espace";
}

function randomSuffix(): string {
  return randomBytes(3).toString("hex");
}

/**
 * Crée l'espace personnel d'un utilisateur (rôle OWNER).
 * Idempotent : retourne le workspace existant si déjà provisionné.
 */
export async function ensurePersonalWorkspace(userId: string, userName: string | null) {
  const existing = await db.workspaceMember.findFirst({
    where: { userId },
    include: { workspace: true },
    orderBy: { createdAt: "asc" },
  });
  if (existing) {
    return { workspace: existing.workspace, membership: existing };
  }

  const displayName = userName?.trim() || "Mon espace";
  const name = `Espace de ${displayName}`;

  for (let attempt = 0; attempt < 3; attempt++) {
    const slug = `${slugify(displayName)}-${randomSuffix()}`;
    try {
      const workspace = await db.workspace.create({
        data: {
          name,
          slug,
          members: {
            create: { userId, role: "OWNER" },
          },
        },
        include: { members: { where: { userId } } },
      });
      return { workspace, membership: workspace.members[0] };
    } catch (error) {
      // Conflit de slug : nouvel essai avec un autre suffixe.
      if (
        attempt < 2 &&
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: string }).code === "P2002"
      ) {
        continue;
      }
      throw error;
    }
  }
  throw new Error("Impossible de provisionner le workspace.");
}

/**
 * Retourne true si l'utilisateur est membre du workspace, sinon false.
 * Point central anti-IDOR : toute requête Task doit passer par ici.
 */
export async function assertWorkspaceMember(workspaceId: string, userId: string) {
  const membership = await db.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  return membership;
}
