"use client";

import { createClient } from "@/shared/lib/supabase/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  }

  return (
    <button type="button" className="btn btn--ghost btn--sm" onClick={signOut}>
      Sign out
    </button>
  );
}
