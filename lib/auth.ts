import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { ensurePersonalWorkspace } from "@/lib/workspace";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET as string,
  database: prismaAdapter(db, { provider: "postgresql" }),
  databaseHooks: {
    user: {
      create: {
        // Provisionne l'espace personnel à l'inscription (rôle OWNER).
        after: async (user) => {
          await ensurePersonalWorkspace(user.id, user.name);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    // V1 : pas d'infra email, donc pas de vérification ni de reset.
    // Les étendre dans emailVerification.sendVerificationEmail /
    // emailAndPassword.sendResetPassword quand l'envoi sera dispo.
    requireEmailVerification: false,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"]
});