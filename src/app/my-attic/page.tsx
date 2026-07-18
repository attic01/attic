import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import { getCurrentProfile } from "@/features/auth/api/session";
import { listOwnedAlbums, listPlaylists } from "@/features/my-attic/api/queries";
import { RecordCard } from "@/features/catalogue/components/RecordCard";

function IconDisc({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" />
    </svg>
  );
}

function IconPeople({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3.5 18.5c.8-2.6 2.8-4 5.5-4s4.7 1.4 5.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16.5" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M15 14.5c1.7.3 3.1 1.3 3.8 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M8 7h11M8 12h11M8 17h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="4.5" cy="7" r="1.1" fill="currentColor" />
      <circle cx="4.5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="4.5" cy="17" r="1.1" fill="currentColor" />
    </svg>
  );
}

function IconScrap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4.5h7.2L18 8.3V19a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 19V6A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M14 4.6V8h3.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconShop({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 9.5 6 5.5h12l1.5 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M5 9.5h14v9A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-9Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M9 13.5v3M15 13.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconStudio({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 16.5V8.2l10-2.2v8.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="6.5" cy="16.5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16.5" cy="14.8" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default async function MyAtticPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in?next=/my-attic");

  const [albums, playlists] = await Promise.all([
    listOwnedAlbums(profile.id),
    listPlaylists(profile.id),
  ]);

  const firstName = profile.display_name?.split(" ")[0] ?? "friend";

  return (
    <AppShell showPlayer mainClassName="landing-main">
      <div className="my-attic">
        <header className="my-attic__top">
          <div>
            <h1 className="my-attic__title">My Attic</h1>
            <p className="my-attic__hello">{firstName}</p>
          </div>

          <div className="my-attic__tools">
            <Link
              href="/catalogue"
              className="my-attic__icon-btn"
              title="Find something to keep"
              aria-label="Find something to keep"
            >
              <IconShop className="my-attic__icon" />
              <span className="my-attic__tip">Shop</span>
            </Link>
            {profile.role === "artist" ? (
              <Link
                href="/studio"
                className="my-attic__icon-btn"
                title="Open your artist studio"
                aria-label="Open your artist studio"
              >
                <IconStudio className="my-attic__icon" />
                <span className="my-attic__tip">Studio</span>
              </Link>
            ) : null}
          </div>
        </header>

        <nav className="my-attic__rail" aria-label="Attic">
          <a
            href="#attic-records"
            className="my-attic__rail-item"
            aria-current="page"
            title={`${albums.length} records you own`}
            aria-label={`Records, ${albums.length}`}
          >
            <IconDisc className="my-attic__icon" />
            <span className="my-attic__count">{albums.length}</span>
            <span className="my-attic__tip">Records you own</span>
          </a>
          <span
            className="my-attic__rail-item my-attic__rail-item--soon"
            title="Artists you’ve kept — coming soon"
            aria-label="Artists, coming soon"
          >
            <IconPeople className="my-attic__icon" />
            <span className="my-attic__tip">Artists</span>
          </span>
          <a
            href="#attic-playlists"
            className="my-attic__rail-item"
            title={`${playlists.length} playlists`}
            aria-label={`Playlists, ${playlists.length}`}
          >
            <IconList className="my-attic__icon" />
            <span className="my-attic__count">{playlists.length}</span>
            <span className="my-attic__tip">Playlists</span>
          </a>
          <span
            className="my-attic__rail-item my-attic__rail-item--soon"
            title="Notes & scraps — coming soon"
            aria-label="Scraps, coming soon"
          >
            <IconScrap className="my-attic__icon" />
            <span className="my-attic__tip">Scraps</span>
          </span>
        </nav>

        <section id="attic-records" className="my-attic__room">
          {albums.length === 0 ? (
            <Link
              href="/catalogue"
              className="my-attic__void"
              title="Browse the shop"
              aria-label="Browse the shop — your shelf is empty"
            >
              <span className="my-attic__void-shelf" aria-hidden>
                <i />
                <i />
                <i />
              </span>
              <IconDisc className="my-attic__void-icon" />
              <span className="my-attic__tip my-attic__tip--center">
                Empty shelf — go find a record
              </span>
            </Link>
          ) : (
            <div className="my-attic__records grid grid--records">
              {albums.map((album) => (
                <RecordCard key={album.id} album={album} />
              ))}
            </div>
          )}
        </section>

        <section id="attic-playlists" className="my-attic__room my-attic__room--playlists">
          {playlists.length === 0 ? (
            <div
              className="my-attic__void my-attic__void--quiet"
              title="Playlists appear after you own music"
              aria-label="No playlists yet"
            >
              <IconList className="my-attic__void-icon" />
              <span className="my-attic__tip my-attic__tip--center">
                No playlists yet
              </span>
            </div>
          ) : (
            <ul className="my-attic__playlist-list">
              {playlists.map((playlist) => (
                <li key={playlist.id} className="my-attic__playlist">
                  <IconList className="my-attic__icon" />
                  <div>
                    <h2>{playlist.title}</h2>
                    {playlist.description ? <p>{playlist.description}</p> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppShell>
  );
}
