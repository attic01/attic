import Link from "next/link";
import type { Profile } from "@/shared/types/database";
import { SignOutButton } from "@/features/auth/components/SignOutButton";

type SiteHeaderProps = {
  profile: Profile | null;
  pathname?: string;
};

type NavLink = {
  href: string;
  label: string;
  match?: "exact" | "prefix";
};

/** Shared shop experience for everyone */
const sharedLinks: NavLink[] = [
  { href: "/catalogue", label: "Shop", match: "prefix" },
  { href: "/artists", label: "Artists", match: "prefix" },
  { href: "/bulletin", label: "Bulletin", match: "exact" },
  { href: "/my-attic", label: "My Attic", match: "prefix" },
];

/** Extra for artists — workshop next to the shop */
const artistExtraLinks: NavLink[] = [
  { href: "/studio", label: "Studio", match: "prefix" },
];

function isCurrent(pathname: string, link: NavLink) {
  if (link.match === "prefix") {
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }
  return pathname === link.href;
}

export function SiteHeader({ profile, pathname = "" }: SiteHeaderProps) {
  const isArtist = profile?.role === "artist";
  const links = isArtist
    ? [...artistExtraLinks, ...sharedLinks]
    : sharedLinks;

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand">
          Attic
          <span>records</span>
        </Link>

        <nav className="nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(pathname, link) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions">
          {profile ? (
            <>
              <span
                className={`role-chip ${isArtist ? "role-chip--artist" : ""}`}
                title={
                  isArtist
                    ? "Artist account — Studio is your workshop"
                    : "Listener account — My Attic holds what you keep"
                }
              >
                {isArtist ? "Artist" : "Listener"}
                {profile.display_name ? ` · ${profile.display_name}` : ""}
              </span>
              <SignOutButton />
            </>
          ) : (
            <Link href="/auth/sign-in" className="btn btn--sm btn--primary">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
