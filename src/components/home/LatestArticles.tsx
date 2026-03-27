import Link from "next/link";

import { HOME_PREVIEW_POSTS } from "@/lib/site";

export function LatestArticles() {
  return (
    <section className="mi-section mi-blog-section">
      <div className="mi-container">
        <div className="mi-home-section-head">
          <div>
            <span className="mi-badge">Blog</span>
            <h2 className="mi-section-title">Ultimos analisis</h2>
          </div>
          <Link href="/blog" className="mi-btn-outline">
            Ver Todos
          </Link>
        </div>

        <div className="mi-blog-grid">
          {HOME_PREVIEW_POSTS.map((post) => (
            <article key={post._id} className="mi-blog-card">
              <div className="mi-blog-card-image">
                <div className="mi-blog-card-placeholder">{post.category.slice(0, 2)}</div>
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
                <Link href="/blog" className="mi-blog-card-read">
                  Leer analisis
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
