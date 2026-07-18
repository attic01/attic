"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";
import type { Artist } from "@/shared/types/database";
import { artistTone } from "@/shared/data/sample";

type ArtistProfileFormProps = {
  artist: Artist;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ArtistProfileForm({ artist }: ArtistProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(artist.name);
  const [intro, setIntro] = useState(
    artist.intro ??
      "A few lines about your sound, your room, and what you hope people keep.",
  );
  const [genre, setGenre] = useState(artist.genre ?? "Indie");
  const [category, setCategory] = useState(
    artist.curated_category ?? "New in the shop",
  );
  const [published, setPublished] = useState(artist.is_published);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const tone = artistTone(artist.slug || name || "artist");
  const initial = (name.trim().charAt(0) || "A").toUpperCase();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("artists")
      .update({
        name,
        slug: slugify(name) || artist.slug,
        intro,
        genre,
        curated_category: category,
        is_published: published,
      })
      .eq("id", artist.id);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Saved.");
    router.refresh();
  }

  return (
    <div className="studio-split">
      <form className="studio-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="artist-name">Name</label>
          <input
            id="artist-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="How you appear in the shop"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="artist-intro">Intro</label>
          <textarea
            id="artist-intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            placeholder="A short note for visitors"
            rows={4}
          />
        </div>
        <div className="studio-form__row">
          <div className="field">
            <label htmlFor="artist-genre">Genre</label>
            <input
              id="artist-genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Folk, ambient…"
            />
          </div>
          <div className="field">
            <label htmlFor="artist-category">Shelf</label>
            <input
              id="artist-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Brian’s picks"
            />
          </div>
        </div>
        <label className="studio-check">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Put face in the window
        </label>
        <button type="submit" className="studio-submit" disabled={loading}>
          {loading ? "Saving…" : "Keep"}
        </button>
        {message ? <p className="studio-form__msg">{message}</p> : null}
      </form>

      <aside className="studio-preview" aria-label="Public page preview">
        <p className="studio-preview__label">In the window</p>
        <div className={`studio-preview__hero artist-card__portrait--${tone}`}>
          <span aria-hidden>{initial}</span>
        </div>
        <h3 className="studio-preview__name">{name || "Your name"}</h3>
        <p className="studio-preview__genre">{genre || "Genre"}</p>
        {category ? <span className="artist-card__tag">{category}</span> : null}
        <p className="studio-preview__intro">
          {intro || "Your introduction appears here."}
        </p>
        <p className="studio-preview__status">
          {published ? "On the shelf" : "Private"}
        </p>
      </aside>
    </div>
  );
}
