import type { NextConfig } from "next";

/**
 * En-têtes de sécurité appliqués à toutes les réponses.
 * - frame-ancestors 'none' : anti-clickjacking.
 * - object-src 'none' : pas de plugin navigateur.
 * - base-uri 'self' + form-action 'self' : pas de rebond de formulaire.
 * - upgrade-insecure-requests : force HTTPS.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  // Next inline les scripts de flight : 'unsafe-inline' est requis sur App Router.
  // 'strict-dynamic' avec un nonce est l'alternative, hors périmètre V1.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    // V1 n'utilise ni caméra, ni micro, ni géolocalisation.
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Les assets versionnés peuvent être mis en cache longuement.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;