import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import {
  getAlbumBySlug,
  listAlbumsForArtist,
} from "@/features/catalogue/api/queries";
import { TrackList } from "@/features/albums/components/TrackList";
import { PurchaseButton } from "@/features/commerce/components/PurchaseButton";
import { getCurrentProfile } from "@/features/auth/api/session";
import { hasPurchasedAlbum } from "@/features/my-attic/api/queries";
import { formatDuration, formatPrice } from "@/shared/lib/format";
import { albumTone } from "@/shared/data/sample";
import { RecordCard } from "@/features/catalogue/components/RecordCard";

type AlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);
  if (!album) notFound();

  const profile = await getCurrentProfile();
  const owned = await hasPurchasedAlbum(profile?.id, album.id);
  const tone = albumTone(album.slug);
  const year = album.release_date
    ? new Date(album.release_date).getFullYear()
    : null;
  const totalSeconds = album.tracks.reduce(
    (sum, track) => sum + (track.duration_seconds ?? 0),
    0,
  );

  const moreFromArtist = (await listAlbumsForArtist(album.artist_id))
    .filter((a) => a.id !== album.id)
    .slice(0, 4);

  return (
    <AppShell mainClassName="landing-main">
      <div className="album-page">
        <nav className="album-crumb" aria-label="Breadcrumb">
          <Link href="/artists">Artists</Link>
          <span aria-hidden>/</span>
          <Link href={`/artists/${album.artist.slug}`}>{album.artist.name}</Link>
          <span aria-hidden>/</span>
          <span>{album.title}</span>
        </nav>

        <section className="album-page__hero">
          <div
            className={`album-page__cover artist-card__portrait--${tone}`}
            aria-hidden
          />
          <div className="album-page__info">
            <p className="album-page__kicker">Album</p>
            <h1 className="album-page__title">{album.title}</h1>
            <p className="album-page__artist">
              <Link href={`/artists/${album.artist.slug}`}>
                {album.artist.name}
              </Link>
              {year ? <span> · {year}</span> : null}
            </p>
            {album.intro ? (
              <p className="album-page__intro">{album.intro}</p>
            ) : null}

            <dl className="album-page__facts">
              <div>
                <dt>Tracks</dt>
                <dd>{album.tracks.length}</dd>
              </div>
              <div>
                <dt>Length</dt>
                <dd>{formatDuration(totalSeconds)}</dd>
              </div>
              <div>
                <dt>From</dt>
                <dd>{formatPrice(album.min_price_cents, album.currency)}</dd>
              </div>
            </dl>

            <div className="album-page__buy">
              <PurchaseButton
                album={album}
                isOwned={owned}
                isSignedIn={Boolean(profile)}
              />
              <p className="album-page__buy-note">
                Pay the floor — or more to support {album.artist.name}.
              </p>
            </div>
          </div>
        </section>

        <section className="album-page__tracks" aria-labelledby="track-heading">
          <div className="album-page__tracks-head">
            <h2 id="track-heading">Tracks</h2>
            <p>
              {owned
                ? "Yours — play from here or My Attic."
                : "Tap a title to preview."}
            </p>
          </div>
          <TrackList
            tracks={album.tracks}
            artistName={album.artist.name}
            canPlayFull={owned}
          />
        </section>

        {moreFromArtist.length > 0 ? (
          <section className="album-page__more" aria-labelledby="more-heading">
            <div className="album-page__tracks-head">
              <h2 id="more-heading">More from {album.artist.name}</h2>
              <Link href={`/artists/${album.artist.slug}`}>See all →</Link>
            </div>
            <div className="sleeve-grid sleeve-grid--compact">
              {moreFromArtist.map((item) => (
                <RecordCard key={item.id} album={item} hideArtist />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
