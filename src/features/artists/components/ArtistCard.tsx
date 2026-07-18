import Link from "next/link";
import type { Artist } from "@/shared/types/database";
import { artistTone } from "@/shared/data/sample";

type ArtistCardProps = {
  artist: Artist;
};

export function ArtistCard({ artist }: ArtistCardProps) {
  const tone = artistTone(artist.slug);
  const initial = artist.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="artist-card"
      title={artist.intro ?? artist.name}
    >
      <div className={`artist-card__portrait artist-card__portrait--${tone}`}>
        <span className="artist-card__initial" aria-hidden>
          {initial}
        </span>
      </div>
      <div className="artist-card__body">
        <h3 className="artist-card__name">{artist.name}</h3>
        <p className="artist-card__genre">{artist.genre ?? "Independent"}</p>
        {artist.curated_category ? (
          <span className="artist-card__tag">{artist.curated_category}</span>
        ) : null}
      </div>
    </Link>
  );
}
