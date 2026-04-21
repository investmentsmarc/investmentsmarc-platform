import Link from "next/link";

import { BlogCard } from "@/components/blog/BlogCard";
import { HOME_PREVIEW_POSTS } from "@/lib/site";

export function LatestArticles() {
  return (
    <section className="mi-section mi-blog-section mi-home-band">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered">
          <div className="mi-home-section-copy mi-reveal">
            <span className="mi-badge">Analisis & Educacion</span>
            <h2 className="mi-section-title">
              Ultimos <span className="mi-text-gradient">Articulos</span>
            </h2>
          </div>
        </div>

        <div className="mi-blog-grid">
          {HOME_PREVIEW_POSTS.map((post, idx) => (
            <div
              key={post._id}
              className={`mi-reveal mi-reveal-scale mi-reveal-delay-${Math.min(idx + 1, 6)}`}
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>

        <div className="mi-home-section-footer mi-reveal mi-reveal-delay-2">
          <Link href="/blog" className="mi-btn-outline mi-home-section-cta">
            Ver Todos
          </Link>
        </div>
      </div>
    </section>
  );
}
