import Link from "next/link";

const NAV_LINKS = [
  { href: "/dashboard", label: "Aujourd'hui" },
  { href: "/dashboard/week", label: "Cette semaine" },
] as const;

export type SiteHeaderProps = {
  /**
   * Chemin courant fourni par la page appelante (ex. "/dashboard/week").
   * Ce composant est un Server Component : sans cette prop, aucun lien ne
   * peut être marqué actif (`aria-current="page"`).
   */
  currentPath?: string;
  /** Zone d'action à droite : bouton de déconnexion, info utilisateur, etc. */
  children?: React.ReactNode;
};

function isActive(currentPath: string | undefined, href: string): boolean {
  if (!currentPath) return false;
  return currentPath === href || currentPath.startsWith(`${href}/`);
}

/** En-tête collant : marque, navigation bureau et zone d'action. */
export function SiteHeader({ currentPath, children }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-5 py-3 md:px-10">
        <Link
          href="/dashboard"
          className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl text-sm font-semibold tracking-tight focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
        >
          <span aria-hidden className="inline-block size-2.5 rounded-full bg-white" />
          MY TODO
        </Link>

        <nav aria-label="Navigation principale" className="hidden min-w-0 md:flex md:items-center md:gap-1">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(currentPath, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none ${
                      active ? "bg-zinc-800 text-white" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </header>
  );
}
