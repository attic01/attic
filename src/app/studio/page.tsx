import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import { getCurrentProfile } from "@/features/auth/api/session";
import {
  getArtistForProfile,
  listStudioReleases,
} from "@/features/artist-studio/api/queries";
import { StudioBench } from "@/features/artist-studio/components/StudioBench";
import { PublishWindowButton } from "@/features/artist-studio/components/PublishWindowButton";
import {
  artistTone,
  sampleArtists,
  sampleStudioDrafts,
} from "@/shared/data/sample";
import { formatPrice } from "@/shared/lib/format";

export default async function StudioHomePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in?next=/studio");
  if (profile.role !== "artist") redirect("/my-attic");

  const liveArtist = await getArtistForProfile(profile.id);
  const isDemo = !liveArtist;
  const artist =
    liveArtist ??
    ({
      ...sampleArtists[0],
      id: "demo-artist",
      profile_id: profile.id,
      name: profile.display_name ?? "Your project",
      slug: "your-page",
      is_published: false,
    } as const);

  const releases = liveArtist
    ? await listStudioReleases(liveArtist.id)
    : [];
  const shelf =
    releases.length > 0
      ? releases.slice(0, 4)
      : sampleStudioDrafts.map((r) => ({
          ...r,
          artist_id: artist.id,
        }));

  const tone = artistTone(artist.slug);
  const initial = artist.name.trim().charAt(0).toUpperCase() || "A";
  const keptCount = 0; // wire to purchases later

  return (
    <AppShell mainClassName="landing-main">
      <div className="studio-page">
        <div className="studio-window-layout">
          <StudioBench artistSlug={artist.slug} active="window" />

          <div className="studio-window">
            <header className="studio-window__head">
              <div>
                <p className="studio-window__kicker">The window</p>
                <h1 className="studio-window__title">How they see you</h1>
              </div>
              <PublishWindowButton
                artistId={artist.id}
                isPublished={artist.is_published}
                isDemo={isDemo}
              />
            </header>

            <article className="studio-window__pane">
              <div
                className={`studio-window__portrait artist-card__portrait--${tone}`}
                aria-hidden
              >
                <span>{initial}</span>
              </div>

              <div className="studio-window__copy">
                <p className="studio-window__status">
                  {artist.is_published ? "On the shelf" : "Still private"}
                </p>
                <h2 className="studio-window__name">{artist.name}</h2>
                <p className="studio-window__genre">
                  {artist.genre ?? "Set a genre on Face"}
                </p>
                {artist.curated_category ? (
                  <span className="artist-card__tag">{artist.curated_category}</span>
                ) : null}
                <p className="studio-window__intro">
                  {artist.intro ?? "Add a few lines on Face."}
                </p>
                <p className="studio-window__kept studio-window__kept--quiet">
                  {keptCount > 0
                    ? `Kept by ${keptCount} listeners`
                    : "No keepers yet — when someone buys, it shows here."}
                </p>
              </div>
            </article>

            <section className="studio-window__shelf" aria-label="Releases in the window">
              <div className="studio-window__shelf-head">
                <h3>On your shelf</h3>
                <Link href="/studio/releases" className="studio-window__shelf-link">
                  Pressing →
                </Link>
              </div>
              <ul className="studio-window__releases">
                {shelf.map((release) => (
                  <li key={release.id} className="studio-window__release">
                    <div className="studio-window__sleeve" aria-hidden />
                    <div>
                      <p className="studio-window__release-title">{release.title}</p>
                      <p className="studio-window__release-meta">
                        from {formatPrice(release.min_price_cents, release.currency)}
                        {" · "}
                        {release.is_published ? "Shelved" : "Private"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
