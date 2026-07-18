"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/shared/lib/supabase/client";

type PublishWindowButtonProps = {
  artistId: string;
  isPublished: boolean;
  isDemo?: boolean;
};

export function PublishWindowButton({
  artistId,
  isPublished,
  isDemo = false,
}: PublishWindowButtonProps) {
  const router = useRouter();
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function toggle() {
    if (isDemo || artistId === "demo-artist") {
      setPublished((p) => !p);
      setMessage(
        !published
          ? "Preview: would go in the window."
          : "Preview: would come down from the window.",
      );
      return;
    }

    setLoading(true);
    setMessage(null);
    const next = !published;
    const supabase = createClient();
    const { error } = await supabase
      .from("artists")
      .update({ is_published: next })
      .eq("id", artistId);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setPublished(next);
    setMessage(next ? "In the window." : "Taken down.");
    router.refresh();
  }

  return (
    <div className="studio-publish">
      <button
        type="button"
        className={`studio-publish__btn ${published ? "studio-publish__btn--down" : ""}`}
        onClick={toggle}
        disabled={loading}
      >
        {loading
          ? "…"
          : published
            ? "Take down from the window"
            : "Put in the window"}
      </button>
      {message ? <p className="studio-publish__msg">{message}</p> : null}
    </div>
  );
}
