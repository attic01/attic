import { headers } from "next/headers";
import { getCurrentProfile } from "@/features/auth/api/session";
import { SiteHeader } from "@/shared/components/SiteHeader";
import { PlayerProvider } from "@/features/player/PlayerContext";
import { PlayerBar } from "@/features/player/components/PlayerBar";

export async function AppShell({
  children,
  showPlayer = true,
  mainClassName = "page",
}: {
  children: React.ReactNode;
  showPlayer?: boolean;
  mainClassName?: string;
}) {
  const profile = await getCurrentProfile();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";

  return (
    <PlayerProvider>
      <div className={`app-shell ${showPlayer ? "" : "app-shell--no-player"}`}>
        <SiteHeader profile={profile} pathname={pathname} />
        <main className={mainClassName}>{children}</main>
        {showPlayer ? <PlayerBar /> : null}
      </div>
    </PlayerProvider>
  );
}
