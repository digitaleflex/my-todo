import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { ensurePersonalWorkspace } from "@/lib/workspace";

const baseURL = process.env.BETTER_AUTH_URL || "http://localhost:3000";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET as string,
  baseURL,
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
  // Session courte, renouvellement quotidien : une session volée expire vite.
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 15,
  },
  rateLimit: {
    enabled: true,
    // "database" car le runtime serverless (Vercel) réinitialise la mémoire
    // à chaque instance : sans base, la limite est contournable.
    storage: "database",
    window: 60,
    max: 60,
    customRules: {
      // Endpoints sensibles : fenêtre courte, few tentatives.
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 3 },
      "/request-password-reset": { window: 300, max: 3 },
    },
  },
  advanced: {
    // Garde la vérification CSRF activée (aucun disableCSRFCheck).
    useSecureCookies: baseURL.startsWith("https://"),
    defaultCookieAttributes: {
      sameSite: "lax",
    },
    // Vercel transmet l'IP client via x-forwarded-for / x-real-ip.
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for", "x-real-ip"],
    },
  },
  trustedOrigins: [baseURL],
});