import { redirect } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import { getCurrentProfile } from "@/features/auth/api/session";
import {
  getArtistForProfile,
  listStudioReleases,
} from "@/features/artist-studio/api/queries";
import { CreateReleaseForm } from "@/features/artist-studio/components/CreateReleaseForm";
import { StudioBench } from "@/features/artist-studio/components/StudioBench";
import { formatPrice } from "@/shared/lib/format";
import { sampleStudioDrafts } from "@/shared/data/sample";

export default async function StudioReleasesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in?next=/studio/releases");
  if (profile.role !== "artist") redirect("/my-attic");

  const artist = await getArtistForProfile(profile.id);
  if (!artist) redirect("/studio/profile");

  const releases = await listStudioReleases(artist.id);
  const shown =
    releases.length > 0
      ? releases.map((r) => ({ ...r, _demo: false as const }))
      : sampleStudioDrafts.map((r) => ({
          ...r,
          artist_id: artist.id,
          _demo: true as const,
        }));

  return (
    <AppShell mainClassName="landing-main">
      <div className="studio-page">
        <div className="studio-window-layout">
          <StudioBench artistSlug={artist.slug} active="pressing" />

          <div className="studio-bench-room">
            <header className="studio-bench-room__head">
              <p className="studio-window__kicker">Pressing</p>
              <h1 className="studio-window__title">Prepare a sleeve</h1>
            </header>

            <CreateReleaseForm artistId={artist.id} artistName={artist.name} />

            <ul className="studio-release-list">
              {shown.map((release) => (
                <li key={release.id} className="studio-release">
                  <div className="studio-release__art" aria-hidden />
                  <div>
                    <h2 className="studio-release__title">{release.title}</h2>
                    <p className="studio-release__meta">
                      from {formatPrice(release.min_price_cents, release.currency)}
                      {" · "}
                      {release.is_published ? "Shelved" : "Private"}
                    </p>
                  </div>
                  {"_demo" in release && release._demo ? (
                    <span className="studio-release__badge studio-release__badge--demo">
                      Sample
                    </span>
                  ) : (
                    <span className="studio-release__badge">
                      {release.is_published ? "Shelved" : "Private"}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
