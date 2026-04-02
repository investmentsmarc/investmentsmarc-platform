import type { Metadata } from "next";

import { BlogCard } from "@/components/blog/BlogCard";
import { BLOG_POSTS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "Analisis de mercado y trading institucional.",
};

export default function BlogPage() {
  return (
    <section className="mi-section">
      <div className="mi-container">
        <div className="mi-tools-hero">
          <span className="mi-badge">Blog</span>
          <h1 className="mi-section-title">
            Analisis de <span className="mi-text-gradient">Mercado</span>
          </h1>
          <p className="mi-page-copy mi-tools-copy">
            Archivo editorial inicial preparado para evolucionar hacia Sanity sin
            perder el tono ni la estructura del sitio.
          </p>
        </div>

        <div className="mi-blog-grid">
          {BLOG_POSTS.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
