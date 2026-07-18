import { sampleAlbums, sampleArtists, sampleBulletin } from "@/shared/data/sample";
import { createClient } from "@/shared/lib/supabase/server";
import type { AlbumWithArtist, Artist, BulletinPost } from "@/shared/types/database";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
  );
}

export async function listPublishedAlbums(): Promise<AlbumWithArtist[]> {
  if (!hasSupabaseEnv()) return sampleAlbums;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*, artist:artists!inner(id, slug, name)")
    .eq("is_published", true)
    .order("release_date", { ascending: false });

  if (error || !data) return sampleAlbums;
  return data as AlbumWithArtist[];
}

export async function getAlbumBySlug(slug: string) {
  const fromSample = () => {
    const album = sampleAlbums.find((a) => a.slug === slug);
    if (!album) return null;
    return { ...album, tracks: album.tracks };
  };

  if (!hasSupabaseEnv()) return fromSample();

  const supabase = await createClient();
  const { data: album } = await supabase
    .from("albums")
    .select("*, artist:artists!inner(id, slug, name)")
    .eq("slug", slug)
    .maybeSingle();

  if (!album) return fromSample();

  const { data: tracks } = await supabase
    .from("tracks")
    .select("*")
    .eq("album_id", album.id)
    .order("track_number", { ascending: true });

  return { ...(album as AlbumWithArtist), tracks: tracks ?? [] };
}

export async function listPublishedArtists(): Promise<Artist[]> {
  if (!hasSupabaseEnv()) return sampleArtists;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artists")
    .select("*")
    .eq("is_published", true)
    .order("name");

  if (error || !data) return sampleArtists;
  return data;
}

export async function getArtistBySlug(slug: string) {
  if (!hasSupabaseEnv()) {
    return sampleArtists.find((a) => a.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("artists")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  return data;
}

export async function listAlbumsForArtist(artistId: string) {
  const fromSample = () =>
    sampleAlbums.filter((a) => a.artist_id === artistId);

  // Mock artist ids always use sample catalogue
  if (artistId.startsWith("artist-") || !hasSupabaseEnv()) {
    return fromSample();
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("albums")
    .select("*, artist:artists!inner(id, slug, name)")
    .eq("artist_id", artistId)
    .eq("is_published", true)
    .order("release_date", { ascending: false });

  if (!data || data.length === 0) return fromSample();
  return data as AlbumWithArtist[];
}

export async function listBulletinPosts(): Promise<BulletinPost[]> {
  if (!hasSupabaseEnv()) return sampleBulletin;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("bulletin_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(20);

  if (error || !data) return sampleBulletin;
  return data;
}
