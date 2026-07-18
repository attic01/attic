"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";

type CreateReleaseFormProps = {
  artistId: string;
  artistName?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPreviewPrice(value: string) {
  const n = Number.parseFloat(value || "0");
  if (Number.isNaN(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function CreateReleaseForm({
  artistId,
  artistName = "You",
}: CreateReleaseFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("First Pressing");
  const [intro, setIntro] = useState(
    "A short note for the sleeve — why this record belongs on someone’s shelf.",
  );
  const [minPrice, setMinPrice] = useState("9.00");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const cents = Math.round(Number.parseFloat(minPrice || "0") * 100);
    const supabase = createClient();

    const { error } = await supabase.from("albums").insert({
      artist_id: artistId,
      title,
      slug: `${slugify(title)}-${Date.now().toString(36).slice(-4)}`,
      intro,
      min_price_cents: cents,
      is_published: false,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Draft created.");
    router.refresh();
  }

  return (
    <div className="studio-split">
      <form className="studio-form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="release-title">Title</label>
          <input
            id="release-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Album title"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="release-intro">Sleeve note</label>
          <textarea
            id="release-intro"
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            rows={3}
          />
        </div>
        <div className="field">
          <label htmlFor="release-price">Floor price (USD)</label>
          <input
            id="release-price"
            type="number"
            min="0"
            step="0.01"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="studio-submit" disabled={loading}>
          {loading ? "…" : "Press a draft"}
        </button>
        {message ? <p className="studio-form__msg">{message}</p> : null}
      </form>

      <aside className="studio-preview" aria-label="Album page preview">
        <p className="studio-preview__label">Sleeve</p>
        <div className="studio-preview__cover" aria-hidden />
        <h3 className="studio-preview__name">{title || "Untitled"}</h3>
        <p className="studio-preview__genre">{artistName}</p>
        <p className="studio-preview__intro">
          {intro || "Sleeve note appears here."}
        </p>
        <p className="studio-preview__price">
          from {formatPreviewPrice(minPrice)}
        </p>
        <span className="studio-preview__status">Private draft</span>
      </aside>
    </div>
  );
}
