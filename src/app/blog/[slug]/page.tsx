import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOG_POSTS } from "@/lib/content";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((item) => item.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mi-section">
      <div className="mi-container mi-post-layout">
        <Link href="/blog" className="mi-back-link">
          ← Volver al Blog
        </Link>
        <span className="mi-badge">{post.category}</span>
        <h1 className="mi-section-title">{post.title}</h1>
        <p className="mi-page-copy">{post.excerpt}</p>
        <div className="mi-post-meta">
          <span>
            {new Date(post.publishedAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span>{post.readingTime} min de lectura</span>
        </div>

        <div className="mi-post-body">
          {(post.body as string[] | undefined)?.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
