import Link from "next/link";

type StudioBenchProps = {
  artistSlug: string;
  active?: "window" | "face" | "pressing";
};

function IconFace({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="9" r="3.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M5.5 18.5c1.2-2.8 3.4-4.2 6.5-4.2s5.3 1.4 6.5 4.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconPressing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.25" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}

function IconListen({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.8 12s3.4-6 9.2-6 9.2 6 9.2 6-3.4 6-9.2 6-9.2-6-9.2-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconWindow({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function StudioBench({ artistSlug, active = "window" }: StudioBenchProps) {
  return (
    <aside className="studio-bench" aria-label="Bench">
      <p className="studio-bench__label">Bench</p>
      <div className="studio-bench__tools">
        <Link
          href="/studio"
          className={`studio-tool ${active === "window" ? "studio-tool--active" : ""}`}
          title="The window — how listeners see you"
          aria-label="Window"
          aria-current={active === "window" ? "page" : undefined}
        >
          <IconWindow className="studio-tool__icon" />
          <span className="studio-tool__tip">Window</span>
        </Link>
        <Link
          href="/studio/profile"
          className={`studio-tool ${active === "face" ? "studio-tool--active" : ""}`}
          title="Face — your name, intro, portrait"
          aria-label="Face"
          aria-current={active === "face" ? "page" : undefined}
        >
          <IconFace className="studio-tool__icon" />
          <span className="studio-tool__tip">Face</span>
        </Link>
        <Link
          href="/studio/releases"
          className={`studio-tool ${active === "pressing" ? "studio-tool--active" : ""}`}
          title="Pressing — sleeves, price, tracks"
          aria-label="Pressing"
          aria-current={active === "pressing" ? "page" : undefined}
        >
          <IconPressing className="studio-tool__icon" />
          <span className="studio-tool__tip">Pressing</span>
        </Link>
        <Link
          href={`/artists/${artistSlug}`}
          className="studio-tool studio-tool--ghost"
          title="Listen-through — open as a visitor"
          aria-label="Listen-through"
        >
          <IconListen className="studio-tool__icon" />
          <span className="studio-tool__tip">Listen-through</span>
        </Link>
      </div>
    </aside>
  );
}
