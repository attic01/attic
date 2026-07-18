import { AppShell } from "@/shared/components/AppShell";
import { listPublishedArtists } from "@/features/catalogue/api/queries";
import { ArtistCard } from "@/features/artists/components/ArtistCard";

export default async function ArtistsPage() {
  const artists = await listPublishedArtists();

  return (
    <AppShell mainClassName="landing-main">
      <div className="artists-page">
        <header className="artists-page__head">
          <h1 className="artists-page__title">Artists</h1>
          <p className="artists-page__count">{artists.length} on the shelf</p>
        </header>

        <div className="artists-grid">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
