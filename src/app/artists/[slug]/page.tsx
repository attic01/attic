import { notFound } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/shared/components/AppShell";
import {
  getArtistBySlug,
  listAlbumsForArtist,
} from "@/features/catalogue/api/queries";
import { RecordCard } from "@/features/catalogue/components/RecordCard";
import { artistTone } from "@/shared/data/sample";

type ArtistPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = await params;
  const artist = await getArtistBySlug(slug);
  if (!artist) notFound();

  const albums = await listAlbumsForArtist(artist.id);
  const tone = artistTone(artist.slug);
  const initial = artist.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <AppShell mainClassName="landing-main">
      <div className="artist-page">
        <nav className="album-crumb" aria-label="Breadcrumb">
          <Link href="/artists">Artists</Link>
          <span aria-hidden>/</span>
          <span>{artist.name}</span>
        </nav>

        <section className="artist-page__hero">
          <div
            className={`artist-page__portrait artist-card__portrait--${tone}`}
            aria-hidden
          >
            <span>{initial}</span>
          </div>
          <div>
            <h1 className="artist-page__name">{artist.name}</h1>
            <div className="artist-page__meta">
              {artist.genre ? (
                <p className="artist-page__genre">{artist.genre}</p>
              ) : null}
              {artist.curated_category ? (
                <span className="artist-card__tag">{artist.curated_category}</span>
              ) : null}
            </div>
            {artist.intro ? (
              <p className="artist-page__intro">{artist.intro}</p>
            ) : null}
            <p className="artist-page__count">
              {albums.length} release{albums.length === 1 ? "" : "s"}
            </p>
          </div>
        </section>

        <section className="artist-page__shelf" aria-labelledby="artist-shelf">
          <h2 id="artist-shelf" className="artist-page__releases-title">
            On the shelf
          </h2>
          {albums.length === 0 ? (
            <p className="muted">Nothing on the shelf yet.</p>
          ) : (
            <div className="sleeve-grid">
              {albums.map((album) => (
                <RecordCard key={album.id} album={album} hideArtist />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
