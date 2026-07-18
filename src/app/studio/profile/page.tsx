import { redirect } from "next/navigation";
import { AppShell } from "@/shared/components/AppShell";
import { getCurrentProfile } from "@/features/auth/api/session";
import { getArtistForProfile } from "@/features/artist-studio/api/queries";
import { ArtistProfileForm } from "@/features/artist-studio/components/ArtistProfileForm";
import { StudioBench } from "@/features/artist-studio/components/StudioBench";
import { sampleArtists } from "@/shared/data/sample";

export default async function StudioProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/sign-in?next=/studio/profile");
  if (profile.role !== "artist") redirect("/my-attic");

  let artist = await getArtistForProfile(profile.id);

  if (!artist) {
    artist = {
      ...sampleArtists[0],
      id: "demo-artist",
      profile_id: profile.id,
      name: profile.display_name ?? sampleArtists[0].name,
      slug: "your-page",
      is_published: false,
    };
  }

  return (
    <AppShell mainClassName="landing-main">
      <div className="studio-page">
        <div className="studio-window-layout">
          <StudioBench artistSlug={artist.slug} active="face" />

          <div className="studio-bench-room">
            <header className="studio-bench-room__head">
              <p className="studio-window__kicker">Face</p>
              <h1 className="studio-window__title">Who they meet</h1>
            </header>
            <ArtistProfileForm artist={artist} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
