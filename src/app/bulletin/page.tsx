import { AppShell } from "@/shared/components/AppShell";
import { listBulletinPosts } from "@/features/catalogue/api/queries";
import { BulletinList } from "@/features/bulletin/components/BulletinList";

export default async function BulletinPage() {
  const posts = await listBulletinPosts();

  return (
    <AppShell>
      <section className="section">
        <p className="section__eyebrow">Bulletin board</p>
        <h1>What’s new</h1>
        <p className="section__lead">
          New artists, releases, and notes from the shop — more noticeboard than
          social feed.
        </p>
        <BulletinList posts={posts} />
      </section>
    </AppShell>
  );
}
