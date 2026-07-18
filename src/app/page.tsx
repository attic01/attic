import Link from "next/link";
import { AppShell } from "@/shared/components/AppShell";

const TILES = ["a", "b", "c", "d", "e", "f", "g", "h", "i"] as const;

function WaveMark() {
  return (
    <svg
      className="landing-wave"
      viewBox="0 0 44 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 6.5C4.5 2.5 7.5 2.5 11 6.5S17.5 10.5 21 6.5 27.5 2.5 31 6.5 37.5 10.5 43 6.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LandingPage() {
  const stripTiles = [...TILES, ...TILES];

  return (
    <AppShell showPlayer={false} mainClassName="landing-main">
      <div className="landing">
        <section className="landing-hero" aria-labelledby="landing-brand">
          <h1 id="landing-brand" className="landing-hero__mark">
            <span className="landing-hero__wordmark">Attic</span>
            <span className="landing-hero__records">Records</span>
          </h1>
          <p className="landing-hero__tagline">
            A record shop for music worth keeping.
          </p>
          <p className="landing-hero__copy">
            Independent releases, chosen by hand. Bought once, kept forever, in
            a quiet corner of the internet that belongs to you.
          </p>
          <div className="landing-hero__actions">
            <Link href="/catalogue" className="landing-cta">
              Enter the shop
              <span className="landing-cta__arrow" aria-hidden>
                ↗
              </span>
            </Link>
            <Link href="/bulletin" className="landing-cta landing-cta--ghost">
              Read the bulletin
            </Link>
          </div>
        </section>

        <section className="landing-strip" aria-label="Attic imagery">
          <div className="landing-strip__track">
            {stripTiles.map((tile, index) => (
              <div
                key={`${tile}-${index}`}
                className={`landing-tile landing-tile--${tile}`}
                aria-hidden
              />
            ))}
          </div>
        </section>

        <section className="landing-values">
          <div className="landing__inner landing-values__grid">
            <article className="landing-value">
              <h2>Chosen, not fed</h2>
              <WaveMark />
              <p>
                No algorithm decides what you hear. Every record in the shop was
                picked, played front to back, and vouched for by a person.
              </p>
            </article>
            <article className="landing-value">
              <h2>Owned, not rented</h2>
              <WaveMark />
              <p>
                When you buy a record it goes into My Attic and stays there.
                Hi-fi files, yours to keep, no subscription meter running.
              </p>
            </article>
            <article className="landing-value">
              <h2>Passed hand to hand</h2>
              <WaveMark />
              <p>
                Playlists you can hand to a friend like a burned CD. Music
                travels on trust here, not on trends.
              </p>
            </article>
          </div>
        </section>

        <section className="landing-how">
          <div className="landing__inner">
            <h2 className="landing-how__title">How the Attic works</h2>
            <WaveMark />
            <p className="landing-how__lead">
              Three steps, no fine print worth hiding.
            </p>

            <div className="landing-how__steps">
              <article className="landing-step">
                <span className="landing-step__num">1</span>
                <div>
                  <h3>Find a record</h3>
                  <p>
                    Browse the shelves, open an album, preview a track or two —
                    like flipping sleeves in a quiet shop.
                  </p>
                </div>
              </article>
              <article className="landing-step">
                <span className="landing-step__num">2</span>
                <div>
                  <h3>Pay the artist</h3>
                  <p>
                    Every release has a floor price. Pay that, or give more if
                    the music moved you.
                  </p>
                </div>
              </article>
              <article className="landing-step">
                <span className="landing-step__num">3</span>
                <div>
                  <h3>Keep it forever</h3>
                  <p>
                    It lands in My Attic — your collection to revisit, playlist,
                    and download in high quality.
                  </p>
                </div>
              </article>
            </div>

            <Link href="/catalogue" className="landing-how__cta">
              Start digging
              <span className="landing-how__cta-icon" aria-hidden>
                ↗
              </span>
            </Link>
          </div>
        </section>

        <footer className="landing-footer">
          <p className="landing-footer__brand">
            Attic
            <span>Records</span>
          </p>
          <p className="landing-footer__note">
            A prototype. The artists are fictional (for now), the payments are
            pretend, the idea is serious.
          </p>
          <p className="landing-footer__credit">
            Curated by Brian · est. 2026, Seoul
          </p>
        </footer>
      </div>
    </AppShell>
  );
}
