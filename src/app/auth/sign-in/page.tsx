import { AppShell } from "@/shared/components/AppShell";
import { SignInForm } from "@/features/auth/components/SignInForm";

type SignInPageProps = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next } = await searchParams;

  return (
    <AppShell showPlayer={false} mainClassName="landing-main">
      <SignInForm nextPath={next || "/"} />
    </AppShell>
  );
}
