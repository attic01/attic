import { AppShell } from "@/shared/components/AppShell";
import { listPublishedAlbums } from "@/features/catalogue/api/queries";
import { RecordCard } from "@/features/catalogue/components/RecordCard";

export default async function CataloguePage() {
  const albums = await listPublishedAlbums();

  return (
    <AppShell>
      <section className="section">
        <p className="section__eyebrow">Record catalogue</p>
        <h1>The shop</h1>
        <p className="section__lead">
          Browse like a real record store — by taste, not by algorithm. Every
          release has a minimum price; you can always pay more to support the
          artist.
        </p>
        <div className="grid grid--records">
          {albums.map((album) => (
            <RecordCard key={album.id} album={album} />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
