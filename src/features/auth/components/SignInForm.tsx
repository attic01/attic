"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import type { UserRole } from "@/shared/types/database";

type SignInFormProps = {
  nextPath?: string;
};

const ROLE_COOKIE = "attic_intended_role";

export function SignInForm({ nextPath = "/" }: SignInFormProps) {
  const [role, setRole] = useState<UserRole>("listener");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function signInWithGoogle() {
    setLoading(true);
    setError(null);

    document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=600; samesite=lax`;
    window.sessionStorage.setItem(ROLE_COOKIE, role);

    const supabase = createClient();
    const origin = window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}&role=${role}`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <section className="auth-stage" aria-labelledby="auth-title">
      <div className="auth-stage__glow" aria-hidden />
      <div className="auth-stage__grain" aria-hidden />

      <div className="auth-layout">
        <aside className="auth-aside">
          <div className="auth-vinyl" aria-hidden>
            <span className="auth-vinyl__ring" />
            <span className="auth-vinyl__ring auth-vinyl__ring--mid" />
            <span className="auth-vinyl__label">A</span>
          </div>
          <p className="auth-aside__kicker">A quiet door</p>
          <blockquote className="auth-aside__quote">
            Music worth keeping doesn’t ask you to hurry.
            It asks you to stay.
          </blockquote>
          <p className="auth-aside__note">
            Curated shelves. Direct support. A collection that is yours.
          </p>
        </aside>

        <div className="auth-card">
          <p className="auth-card__eyebrow">Enter Attic</p>
          <h1 id="auth-title" className="auth-card__title">
            Welcome in
          </h1>
          <p className="auth-card__lead">
            One Google account — no new password. First, tell us which side of
            the counter you’re standing on.
          </p>

          <div className="auth-roles" role="group" aria-label="How you belong here">
            <button
              type="button"
              className="auth-role"
              aria-pressed={role === "listener"}
              onClick={() => setRole("listener")}
            >
              <span className="auth-role__meta">
                <span className="auth-role__index">01</span>
                <span className="auth-role__label">Listener</span>
              </span>
              <strong className="auth-role__title">I collect</strong>
              <span className="auth-role__copy">
                Discover what Brian shelves, buy a release, keep it in My Attic,
                and build playlists like burned CDs for friends.
              </span>
            </button>

            <button
              type="button"
              className="auth-role"
              aria-pressed={role === "artist"}
              onClick={() => setRole("artist")}
            >
              <span className="auth-role__meta">
                <span className="auth-role__index">02</span>
                <span className="auth-role__label">Artist</span>
              </span>
              <strong className="auth-role__title">I share</strong>
              <span className="auth-role__copy">
                Shape your page, present releases, set a floor price, and meet
                listeners who pay to keep your work — not rent it.
              </span>
            </button>
          </div>

          <p className="auth-card__choice" aria-live="polite">
            Continuing as{" "}
            <em>{role === "listener" ? "a listener" : "an artist"}</em>
          </p>

          {error ? <p className="auth-card__error">{error}</p> : null}

          <button
            type="button"
            className="auth-submit"
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <span className="auth-submit__google" aria-hidden>
              G
            </span>
            {loading ? "Opening the door…" : "Continue with Google"}
          </button>

          <p className="auth-card__fine">
            By continuing you enter a prototype shop — payments are pretend for
            now; the idea of ownership is not.{" "}
            <Link href="/">Back to the front</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
