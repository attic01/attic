import type {
  AlbumWithArtist,
  Artist,
  BulletinPost,
  Track,
} from "@/shared/types/database";

/** Visual tone for dummy portraits / sleeves */
export type ArtistTone = "ember" | "tide" | "moss" | "dusk" | "clay" | "ink";

export function artistTone(slug: string): ArtistTone {
  const tones: ArtistTone[] = ["ember", "tide", "moss", "dusk", "clay", "ink"];
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash + slug.charCodeAt(i) * (i + 1)) % tones.length;
  }
  return tones[hash];
}

export function albumTone(slug: string): ArtistTone {
  return artistTone(`album-${slug}`);
}

function tracks(
  albumId: string,
  items: { title: string; duration_seconds: number }[],
): Track[] {
  return items.map((item, index) => ({
    id: `${albumId}-t${index + 1}`,
    album_id: albumId,
    title: item.title,
    track_number: index + 1,
    duration_seconds: item.duration_seconds,
    preview_path: null,
    audio_path: null,
    min_price_cents: null,
    created_at: "2026-01-01T00:00:00Z",
  }));
}

export const sampleArtists: Artist[] = [
  {
    id: "artist-mira",
    profile_id: "profile-mira",
    slug: "mira-han",
    name: "Mira Han",
    intro:
      "Quiet songs for late rooms — piano, tape hiss, voice close to the mic.",
    genre: "Indie / Ambient",
    curated_category: "New in the shop",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  },
  {
    id: "artist-jun",
    profile_id: "profile-jun",
    slug: "jun-park",
    name: "Jun Park",
    intro:
      "Broken-beat sketches and dusty samples from Seoul basement nights.",
    genre: "Electronic / Hip-hop",
    curated_category: "Brian’s picks",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-01-02T00:00:00Z",
    updated_at: "2026-01-02T00:00:00Z",
  },
  {
    id: "artist-lumen",
    profile_id: "profile-lumen",
    slug: "lumen-choir",
    name: "Lumen Choir",
    intro: "Long-form pieces that feel like walking home after rain.",
    genre: "Experimental",
    curated_category: "Listening room",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-01-03T00:00:00Z",
    updated_at: "2026-01-03T00:00:00Z",
  },
  {
    id: "artist-sora",
    profile_id: "profile-sora",
    slug: "sora-lee",
    name: "Sora Lee",
    intro: "Guitar and field recordings — kitchens, buses, open windows.",
    genre: "Folk",
    curated_category: "Handwritten",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-02-01T00:00:00Z",
    updated_at: "2026-02-01T00:00:00Z",
  },
  {
    id: "artist-nero",
    profile_id: "profile-nero",
    slug: "nero-kim",
    name: "Nero Kim",
    intro: "Analog synths, slow builds, midnight basslines.",
    genre: "Synth / Leftfield",
    curated_category: "After dark",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-02-14T00:00:00Z",
    updated_at: "2026-02-14T00:00:00Z",
  },
  {
    id: "artist-hana",
    profile_id: "profile-hana",
    slug: "hana-yoon",
    name: "Hana Yoon",
    intro: "Jazz-leaning songs with room mics and soft brass.",
    genre: "Jazz / Soul",
    curated_category: "Sunday listening",
    photo_path: null,
    featured_video_url: null,
    is_published: true,
    created_at: "2026-03-01T00:00:00Z",
    updated_at: "2026-03-01T00:00:00Z",
  },
];

type SampleAlbum = AlbumWithArtist & { tracks: Track[] };

function album( partial: Omit<SampleAlbum, "tracks" | "created_at" | "updated_at" | "is_published" | "cover_path" | "featured_video_url" | "currency"> & {
  tracks: { title: string; duration_seconds: number }[];
  currency?: string;
  is_published?: boolean;
}): SampleAlbum {
  return {
    cover_path: null,
    featured_video_url: null,
    currency: partial.currency ?? "USD",
    is_published: partial.is_published ?? true,
    created_at: `${partial.release_date ?? "2026-01-01"}T00:00:00Z`,
    updated_at: `${partial.release_date ?? "2026-01-01"}T00:00:00Z`,
    ...partial,
    tracks: tracks(partial.id, partial.tracks),
  };
}

export const sampleAlbums: SampleAlbum[] = [
  // Mira Han — 3 albums
  album({
    id: "album-soft-hours",
    artist_id: "artist-mira",
    slug: "soft-hours",
    title: "Soft Hours",
    intro: "Eight pieces from one winter week. Meant to be kept, not skimmed.",
    min_price_cents: 900,
    release_date: "2026-03-12",
    artist: { id: "artist-mira", slug: "mira-han", name: "Mira Han" },
    tracks: [
      { title: "Window Light", duration_seconds: 214 },
      { title: "Second Cup", duration_seconds: 188 },
      { title: "Soft Hours", duration_seconds: 256 },
      { title: "Hallway", duration_seconds: 201 },
      { title: "Late Bus", duration_seconds: 233 },
      { title: "Paper Crane", duration_seconds: 190 },
      { title: "Warm Static", duration_seconds: 248 },
      { title: "Leave the Lamp", duration_seconds: 272 },
    ],
  }),
  album({
    id: "album-thin-rain",
    artist_id: "artist-mira",
    slug: "thin-rain",
    title: "Thin Rain",
    intro: "A shorter set — piano close, city far away.",
    min_price_cents: 700,
    release_date: "2025-11-02",
    artist: { id: "artist-mira", slug: "mira-han", name: "Mira Han" },
    tracks: [
      { title: "Glass", duration_seconds: 176 },
      { title: "Thin Rain", duration_seconds: 229 },
      { title: "Coat Hook", duration_seconds: 198 },
      { title: "After You Left", duration_seconds: 251 },
    ],
  }),
  album({
    id: "album-letter-unsent",
    artist_id: "artist-mira",
    slug: "letter-unsent",
    title: "Letter Unsent",
    intro: "Voice and keys. Written once, never mailed.",
    min_price_cents: 800,
    release_date: "2025-06-18",
    artist: { id: "artist-mira", slug: "mira-han", name: "Mira Han" },
    tracks: [
      { title: "Draft One", duration_seconds: 205 },
      { title: "Margin", duration_seconds: 183 },
      { title: "Unsent", duration_seconds: 267 },
      { title: "PS", duration_seconds: 142 },
      { title: "Fold", duration_seconds: 221 },
    ],
  }),

  // Jun Park — 3 albums
  album({
    id: "album-night-market",
    artist_id: "artist-jun",
    slug: "night-market",
    title: "Night Market",
    intro: "Percussion for walking with nowhere urgent to be.",
    min_price_cents: 1200,
    release_date: "2026-04-02",
    artist: { id: "artist-jun", slug: "jun-park", name: "Jun Park" },
    tracks: [
      { title: "Stall 7", duration_seconds: 201 },
      { title: "Steam", duration_seconds: 173 },
      { title: "Lantern Row", duration_seconds: 224 },
      { title: "Plastic Bag", duration_seconds: 189 },
      { title: "Closing Bell", duration_seconds: 242 },
    ],
  }),
  album({
    id: "album-basement-tape",
    artist_id: "artist-jun",
    slug: "basement-tape",
    title: "Basement Tape",
    intro: "Dusty loops, half-broken drum machine, 2am.",
    min_price_cents: 900,
    release_date: "2025-09-14",
    artist: { id: "artist-jun", slug: "jun-park", name: "Jun Park" },
    tracks: [
      { title: "Boot", duration_seconds: 156 },
      { title: "Concrete Hum", duration_seconds: 208 },
      { title: "Low Ceiling", duration_seconds: 194 },
      { title: "Exit Sign", duration_seconds: 231 },
    ],
  }),
  album({
    id: "album-red-line",
    artist_id: "artist-jun",
    slug: "red-line",
    title: "Red Line",
    intro: "Subway samples and patient kicks.",
    min_price_cents: 1000,
    release_date: "2025-02-28",
    artist: { id: "artist-jun", slug: "jun-park", name: "Jun Park" },
    tracks: [
      { title: "Platform", duration_seconds: 188 },
      { title: "Between Stops", duration_seconds: 215 },
      { title: "Red Line", duration_seconds: 246 },
      { title: "Last Car", duration_seconds: 199 },
      { title: "Above Ground", duration_seconds: 227 },
      { title: "Home Gate", duration_seconds: 181 },
    ],
  }),

  // Lumen Choir — 2 albums
  album({
    id: "album-afterglow",
    artist_id: "artist-lumen",
    slug: "afterglow-suite",
    title: "Afterglow Suite",
    intro: "A long suite — patient, warm, slightly strange.",
    min_price_cents: 1500,
    release_date: "2026-05-18",
    artist: { id: "artist-lumen", slug: "lumen-choir", name: "Lumen Choir" },
    tracks: [
      { title: "Movement I", duration_seconds: 412 },
      { title: "Movement II", duration_seconds: 388 },
      { title: "Movement III", duration_seconds: 456 },
    ],
  }),
  album({
    id: "album-vesper",
    artist_id: "artist-lumen",
    slug: "vesper",
    title: "Vesper",
    intro: "Evening pieces for small rooms and open windows.",
    min_price_cents: 1100,
    release_date: "2025-12-01",
    artist: { id: "artist-lumen", slug: "lumen-choir", name: "Lumen Choir" },
    tracks: [
      { title: "Dusk Choir", duration_seconds: 298 },
      { title: "Candle", duration_seconds: 264 },
      { title: "Vesper", duration_seconds: 341 },
      { title: "Quiet Amen", duration_seconds: 219 },
    ],
  }),

  // Sora Lee — 2 albums
  album({
    id: "album-kitchen-windows",
    artist_id: "artist-sora",
    slug: "kitchen-windows",
    title: "Kitchen Windows",
    intro: "Songs recorded between meals and open panes.",
    min_price_cents: 800,
    release_date: "2026-06-01",
    artist: { id: "artist-sora", slug: "sora-lee", name: "Sora Lee" },
    tracks: [
      { title: "Blue Kettle", duration_seconds: 196 },
      { title: "Soap Dish", duration_seconds: 174 },
      { title: "Open Pane", duration_seconds: 221 },
      { title: "Neighbor’s Radio", duration_seconds: 203 },
      { title: "Leftovers", duration_seconds: 188 },
      { title: "Lights Off", duration_seconds: 235 },
    ],
  }),
  album({
    id: "album-bus-notes",
    artist_id: "artist-sora",
    slug: "bus-notes",
    title: "Bus Notes",
    intro: "Field recordings and guitar from city routes.",
    min_price_cents: 750,
    release_date: "2025-08-22",
    artist: { id: "artist-sora", slug: "sora-lee", name: "Sora Lee" },
    tracks: [
      { title: "Transfer", duration_seconds: 167 },
      { title: "Seat 14", duration_seconds: 192 },
      { title: "Rain on Glass", duration_seconds: 210 },
      { title: "Last Stop", duration_seconds: 248 },
    ],
  }),

  // Nero Kim — 2 albums
  album({
    id: "album-signal-fade",
    artist_id: "artist-nero",
    slug: "signal-fade",
    title: "Signal Fade",
    intro: "Midnight sequences with room for silence.",
    min_price_cents: 1100,
    release_date: "2026-06-20",
    artist: { id: "artist-nero", slug: "nero-kim", name: "Nero Kim" },
    tracks: [
      { title: "Carrier", duration_seconds: 304 },
      { title: "Static Bloom", duration_seconds: 278 },
      { title: "Signal Fade", duration_seconds: 356 },
      { title: "Off Air", duration_seconds: 241 },
    ],
  }),
  album({
    id: "album-voltage-prayer",
    artist_id: "artist-nero",
    slug: "voltage-prayer",
    title: "Voltage Prayer",
    intro: "Slow builds, analog warmth, low light.",
    min_price_cents: 1000,
    release_date: "2025-10-09",
    artist: { id: "artist-nero", slug: "nero-kim", name: "Nero Kim" },
    tracks: [
      { title: "Warm Up", duration_seconds: 189 },
      { title: "Circuit", duration_seconds: 266 },
      { title: "Voltage Prayer", duration_seconds: 312 },
      { title: "Ground", duration_seconds: 254 },
      { title: "Sleep Mode", duration_seconds: 291 },
    ],
  }),

  // Hana Yoon — 2 albums
  album({
    id: "album-brass-morning",
    artist_id: "artist-hana",
    slug: "brass-morning",
    title: "Brass Morning",
    intro: "Soft brass and voice for early hours.",
    min_price_cents: 1000,
    release_date: "2026-07-04",
    artist: { id: "artist-hana", slug: "hana-yoon", name: "Hana Yoon" },
    tracks: [
      { title: "First Light", duration_seconds: 241 },
      { title: "Muted Horn", duration_seconds: 218 },
      { title: "Coffee Steam", duration_seconds: 195 },
      { title: "Brass Morning", duration_seconds: 267 },
      { title: "Sunday Shoes", duration_seconds: 223 },
    ],
  }),
  album({
    id: "album-blue-booth",
    artist_id: "artist-hana",
    slug: "blue-booth",
    title: "Blue Booth",
    intro: "Live-feeling takes with room mic bleed.",
    min_price_cents: 950,
    release_date: "2025-04-11",
    artist: { id: "artist-hana", slug: "hana-yoon", name: "Hana Yoon" },
    tracks: [
      { title: "Curtain", duration_seconds: 186 },
      { title: "Blue Booth", duration_seconds: 254 },
      { title: "Soft Clap", duration_seconds: 201 },
      { title: "Two Chairs", duration_seconds: 239 },
    ],
  }),
];

export const sampleStudioDrafts: AlbumWithArtist[] = [
  {
    id: "draft-demo-1",
    artist_id: "demo",
    slug: "demo-first-pressing",
    title: "First Pressing",
    intro: "A draft sleeve — set the floor price, then add tracks.",
    cover_path: null,
    featured_video_url: null,
    min_price_cents: 900,
    currency: "USD",
    release_date: null,
    is_published: false,
    created_at: "2026-07-01T00:00:00Z",
    updated_at: "2026-07-01T00:00:00Z",
    artist: { id: "demo", slug: "you", name: "You" },
  },
  {
    id: "draft-demo-2",
    artist_id: "demo",
    slug: "demo-late-session",
    title: "Late Session",
    intro: "Unpublished demo for how your catalogue will look.",
    cover_path: null,
    featured_video_url: null,
    min_price_cents: 1200,
    currency: "USD",
    release_date: null,
    is_published: false,
    created_at: "2026-07-08T00:00:00Z",
    updated_at: "2026-07-08T00:00:00Z",
    artist: { id: "demo", slug: "you", name: "You" },
  },
];

export const sampleBulletin: BulletinPost[] = [
  {
    id: "b1",
    title: "Mira Han joins the shop",
    body: "Soft Hours is now on the shelf.",
    kind: "new_artist",
    href: "/albums/soft-hours",
    published_at: "2026-06-01T00:00:00Z",
    is_published: true,
  },
  {
    id: "b2",
    title: "New release: Night Market",
    body: "Jun Park — dusty samples, patient drums.",
    kind: "new_release",
    href: "/albums/night-market",
    published_at: "2026-06-10T00:00:00Z",
    is_published: true,
  },
  {
    id: "b3",
    title: "Listening note from Brian",
    body: "Sit with Afterglow Suite front to back.",
    kind: "editorial",
    href: "/albums/afterglow-suite",
    published_at: "2026-07-01T00:00:00Z",
    is_published: true,
  },
];
