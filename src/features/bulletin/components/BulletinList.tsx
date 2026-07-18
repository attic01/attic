import Link from "next/link";
import type { BulletinPost } from "@/shared/types/database";

type BulletinListProps = {
  posts: BulletinPost[];
};

export function BulletinList({ posts }: BulletinListProps) {
  return (
    <div className="bulletin-list">
      {posts.map((post) => {
        const content = (
          <>
            <p className="bulletin-item__date">
              {new Date(post.published_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              · {post.kind.replace("_", " ")}
            </p>
            <h3 className="bulletin-item__title">{post.title}</h3>
            <p className="bulletin-item__body">{post.body}</p>
          </>
        );

        if (post.href) {
          return (
            <Link key={post.id} href={post.href} className="bulletin-item">
              {content}
            </Link>
          );
        }

        return (
          <article key={post.id} className="bulletin-item">
            {content}
          </article>
        );
      })}
    </div>
  );
}
