import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/shared/lib/supabase/server";
import type { UserRole } from "@/shared/types/database";

function parseRole(value: string | null | undefined): UserRole | null {
  if (value === "listener" || value === "artist") return value;
  return null;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const roleFromQuery = parseRole(searchParams.get("role"));

  const cookieStore = await cookies();
  const roleFromCookie = parseRole(cookieStore.get("attic_intended_role")?.value);
  const intendedRole = roleFromQuery ?? roleFromCookie ?? "listener";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        const currentRole = (profile as { role?: UserRole } | null)?.role;

        if (currentRole && currentRole !== intendedRole) {
          await supabase
            .from("profiles")
            .update({ role: intendedRole })
            .eq("id", user.id);
        }

        if (intendedRole === "artist") {
          const { data: existing } = await supabase
            .from("artists")
            .select("id")
            .eq("profile_id", user.id)
            .maybeSingle();

          if (!existing) {
            const name =
              (user.user_metadata?.full_name as string | undefined) ||
              (user.user_metadata?.name as string | undefined) ||
              user.email?.split("@")[0] ||
              "Artist";
            const slug =
              name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "") +
              "-" +
              user.id.slice(0, 8);

            await supabase.from("artists").insert({
              profile_id: user.id,
              name,
              slug,
            });
          }
        }

        const response = NextResponse.redirect(
          `${origin}${
            next !== "/"
              ? next
              : intendedRole === "artist"
                ? "/studio"
                : "/my-attic"
          }`,
        );
        response.cookies.set("attic_intended_role", "", { maxAge: 0, path: "/" });
        return response;
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth`);
}
