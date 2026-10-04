import { NextResponse, type NextRequest } from "next/server";

/**
 * Vérification optimiste : redirige les visiteurs non authentifiés vers /login
 * avant le rendu. La source de vérité reste `requireUser()` côté serveur
 * (lib/session.ts) — ce proxy n'est qu'un garde d'entrée rapide.
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies.has("better-auth.session_token");
  if (!hasSessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};