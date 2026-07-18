export type UserRole = "listener" | "artist";

export type Profile = {
  id: string;
  email: string | null;
  display_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Artist = {
  id: string;
  profile_id: string;
  slug: string;
  name: string;
  intro: string | null;
  genre: string | null;
  curated_category: string | null;
  photo_path: string | null;
  featured_video_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Album = {
  id: string;
  artist_id: string;
  slug: string;
  title: string;
  intro: string | null;
  cover_path: string | null;
  featured_video_url: string | null;
  min_price_cents: number;
  currency: string;
  release_date: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type Track = {
  id: string;
  album_id: string;
  title: string;
  track_number: number;
  duration_seconds: number | null;
  preview_path: string | null;
  audio_path: string | null;
  min_price_cents: number | null;
  created_at: string;
};

export type Purchase = {
  id: string;
  buyer_id: string;
  album_id: string;
  amount_cents: number;
  currency: string;
  created_at: string;
};

export type Playlist = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  is_public: boolean;
  share_token: string | null;
  created_at: string;
  updated_at: string;
};

export type BulletinPost = {
  id: string;
  title: string;
  body: string;
  kind: "new_artist" | "new_release" | "trending" | "update" | "editorial";
  href: string | null;
  published_at: string;
  is_published: boolean;
};

export type AlbumWithArtist = Album & {
  artist: Pick<Artist, "id" | "slug" | "name">;
};

export type AlbumDetail = AlbumWithArtist & {
  tracks: Track[];
};
