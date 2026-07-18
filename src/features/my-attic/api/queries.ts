import { sampleAlbums } from "@/shared/data/sample";
import { createClient } from "@/shared/lib/supabase/server";
import type { AlbumWithArtist, Playlist } from "@/shared/types/database";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
  );
}

export async function listOwnedAlbums(userId: string): Promise<AlbumWithArtist[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("album:albums(*, artist:artists!inner(id, slug, name))")
    .eq("buyer_id", userId);

  if (error || !data) {
    return [];
  }

  return data
    .map((row) => row.album as unknown as AlbumWithArtist)
    .filter(Boolean);
}

export async function listPlaylists(userId: string): Promise<Playlist[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("playlists")
    .select("*")
    .eq("owner_id", userId)
    .order("updated_at", { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function hasPurchasedAlbum(userId: string | undefined, albumId: string) {
  if (!userId || !hasSupabaseEnv()) return false;

  // Sample IDs won't be in DB
  if (albumId.startsWith("album-")) {
    return false;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("purchases")
    .select("id")
    .eq("buyer_id", userId)
    .eq("album_id", albumId)
    .maybeSingle();

  return Boolean(data);
}

/** Demo helper when browsing sample catalogue without purchases table. */
export function getSampleAlbumById(id: string) {
  return sampleAlbums.find((a) => a.id === id) ?? null;
}
