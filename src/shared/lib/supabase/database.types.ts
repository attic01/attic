export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          display_name: string | null;
          role: "listener" | "artist";
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          display_name?: string | null;
          role?: "listener" | "artist";
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          display_name?: string | null;
          role?: "listener" | "artist";
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      artists: {
        Row: {
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
        Insert: {
          id?: string;
          profile_id: string;
          slug: string;
          name: string;
          intro?: string | null;
          genre?: string | null;
          curated_category?: string | null;
          photo_path?: string | null;
          featured_video_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          slug?: string;
          name?: string;
          intro?: string | null;
          genre?: string | null;
          curated_category?: string | null;
          photo_path?: string | null;
          featured_video_url?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      albums: {
        Row: {
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
        Insert: {
          id?: string;
          artist_id: string;
          slug: string;
          title: string;
          intro?: string | null;
          cover_path?: string | null;
          featured_video_url?: string | null;
          min_price_cents: number;
          currency?: string;
          release_date?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          artist_id?: string;
          slug?: string;
          title?: string;
          intro?: string | null;
          cover_path?: string | null;
          featured_video_url?: string | null;
          min_price_cents?: number;
          currency?: string;
          release_date?: string | null;
          is_published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      tracks: {
        Row: {
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
        Insert: {
          id?: string;
          album_id: string;
          title: string;
          track_number: number;
          duration_seconds?: number | null;
          preview_path?: string | null;
          audio_path?: string | null;
          min_price_cents?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          album_id?: string;
          title?: string;
          track_number?: number;
          duration_seconds?: number | null;
          preview_path?: string | null;
          audio_path?: string | null;
          min_price_cents?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          buyer_id: string;
          album_id: string;
          amount_cents: number;
          currency: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          album_id: string;
          amount_cents: number;
          currency?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          album_id?: string;
          amount_cents?: number;
          currency?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      playlists: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string | null;
          is_public: boolean;
          share_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description?: string | null;
          is_public?: boolean;
          share_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string | null;
          is_public?: boolean;
          share_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      playlist_tracks: {
        Row: {
          id: string;
          playlist_id: string;
          track_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          track_id: string;
          position?: number;
          added_at?: string;
        };
        Update: {
          id?: string;
          playlist_id?: string;
          track_id?: string;
          position?: number;
          added_at?: string;
        };
        Relationships: [];
      };
      bulletin_posts: {
        Row: {
          id: string;
          title: string;
          body: string;
          kind: "new_artist" | "new_release" | "trending" | "update" | "editorial";
          href: string | null;
          published_at: string;
          is_published: boolean;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          kind?: "new_artist" | "new_release" | "trending" | "update" | "editorial";
          href?: string | null;
          published_at?: string;
          is_published?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          kind?: "new_artist" | "new_release" | "trending" | "update" | "editorial";
          href?: string | null;
          published_at?: string;
          is_published?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "listener" | "artist";
    };
    CompositeTypes: Record<string, never>;
  };
};
