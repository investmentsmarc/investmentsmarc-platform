import Link from "next/link";

import type { BlogPost } from "@/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="mi-blog-card">
      <Link href={`/blog/${post.slug}`} className="mi-blog-card-link">
        <div className="mi-blog-card-image">
          <div className="mi-blog-card-placeholder">
            <span>{post.category.slice(0, 2)}</span>
          </div>
        </div>
        <div className="mi-blog-card-body">
          <p className="mi-blog-card-cat">{post.category}</p>
          <p className="mi-blog-card-date">
            {new Date(post.publishedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {" · "}
            {post.readingTime} min
          </p>
          <h3 className="mi-blog-card-title">{post.title}</h3>
          <p className="mi-blog-card-excerpt">{post.excerpt}</p>
          <span className="mi-blog-card-read">Leer analisis</span>
        </div>
      </Link>
    </article>
  );
}
