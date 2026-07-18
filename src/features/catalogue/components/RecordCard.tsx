import Link from "next/link";
import type { AlbumWithArtist } from "@/shared/types/database";
import { albumTone } from "@/shared/data/sample";
import { formatPrice } from "@/shared/lib/format";

type RecordCardProps = {
  album: AlbumWithArtist;
  /** Hide artist line when already on that artist’s page */
  hideArtist?: boolean;
};

export function RecordCard({ album, hideArtist = false }: RecordCardProps) {
  const tone = albumTone(album.slug);
  const year = album.release_date
    ? new Date(album.release_date).getFullYear()
    : null;

  return (
    <Link
      href={`/albums/${album.slug}`}
      className="sleeve-card"
      title={`${album.title} — open album`}
    >
      <div
        className={`sleeve-card__art artist-card__portrait--${tone}`}
        aria-hidden
      />
      <div className="sleeve-card__body">
        <h3 className="sleeve-card__title">{album.title}</h3>
        <p className="sleeve-card__meta">
          {!hideArtist ? (
            <>
              {album.artist.name}
              {year ? ` · ${year}` : null}
            </>
          ) : year ? (
            year
          ) : (
            "Release"
          )}
        </p>
        <p className="sleeve-card__price">
          from {formatPrice(album.min_price_cents, album.currency)}
        </p>
      </div>
    </Link>
  );
}
