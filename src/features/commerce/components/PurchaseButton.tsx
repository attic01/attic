"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";
import { formatPrice } from "@/shared/lib/format";
import type { AlbumWithArtist } from "@/shared/types/database";

type PurchaseButtonProps = {
  album: AlbumWithArtist;
  isOwned: boolean;
  isSignedIn: boolean;
};

export function PurchaseButton({
  album,
  isOwned,
  isSignedIn,
}: PurchaseButtonProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(album.min_price_cents);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (isOwned) {
    return (
      <Linkish href="/my-attic" label="In your Attic — listen now" />
    );
  }

  if (!isSignedIn) {
    return (
      <Linkish
        href={`/auth/sign-in?next=/albums/${album.slug}`}
        label="Sign in to purchase"
      />
    );
  }

  async function purchase() {
    if (amount < album.min_price_cents) {
      setMessage(`Minimum is ${formatPrice(album.min_price_cents, album.currency)}.`);
      return;
    }

    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/auth/sign-in?next=/albums/${album.slug}`);
      return;
    }

    const { error } = await supabase.from("purchases").insert({
      buyer_id: user.id,
      album_id: album.id,
      amount_cents: amount,
      currency: album.currency,
    });

    setLoading(false);

    if (error) {
      // Sample / offline fallback when DB not configured
      if (
        error.message.includes("Failed to fetch") ||
        album.id.startsWith("album-")
      ) {
        const key = `attic-purchases:${user.id}`;
        const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
        if (!existing.includes(album.id)) {
          localStorage.setItem(key, JSON.stringify([...existing, album.id]));
        }
        setMessage("Added to My Attic (local until Supabase is connected).");
        router.refresh();
        return;
      }
      setMessage(error.message);
      return;
    }

    setMessage("Purchased — it’s in My Attic.");
    router.push("/my-attic");
    router.refresh();
  }

  return (
    <div className="stack-sm">
      <div className="field">
        <label htmlFor="pay-amount">
          Pay what you want (min {formatPrice(album.min_price_cents, album.currency)})
        </label>
        <input
          id="pay-amount"
          type="number"
          min={album.min_price_cents / 100}
          step="0.01"
          value={(amount / 100).toFixed(2)}
          onChange={(e) =>
            setAmount(Math.round(Number.parseFloat(e.target.value || "0") * 100))
          }
        />
      </div>
      <button
        type="button"
        className="btn btn--accent"
        onClick={purchase}
        disabled={loading}
      >
        {loading
          ? "Purchasing…"
          : `Purchase for ${formatPrice(amount, album.currency)}`}
      </button>
      {message ? <p className="muted">{message}</p> : null}
    </div>
  );
}

function Linkish({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="btn btn--primary">
      {label}
    </a>
  );
}
