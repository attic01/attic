import { createClient } from "@/shared/lib/supabase/server";
import type { Album, Artist } from "@/shared/types/database";

function hasSupabaseEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project"),
  );
}

export async function getArtistForProfile(profileId: string): Promise<Artist | null> {
  if (!hasSupabaseEnv()) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("artists")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  return data;
}

export async function listStudioReleases(artistId: string): Promise<Album[]> {
  if (!hasSupabaseEnv()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .eq("artist_id", artistId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data;
}
