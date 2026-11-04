import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/global/JsonLd";
import { BLOG_POSTS } from "@/lib/content";
import { paginaMetadata } from "@/lib/seo";

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

  return paginaMetadata({
    ruta: `/blog/${post.slug}`,
    titulo: post.title,
    descripcion: post.excerpt,
  });
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

  // Fechas y autor REALES, no inventados: `publishedAt` ya vive en el post y el
  // byline visible de abajo dice lo mismo. Sin esto, un sistema de IA tenía que
  // adivinar la fecha parseando el texto de la tarjeta del índice.
  //
  // `dateModified` se omite a propósito: no hay registro de edición que citar, y
  // ponerle la fecha de publicación sería afirmar una revisión que no ocurrió.
  //
  // 🚨 Los nodos Person y Organization se REPITEN aquí en vez de referenciarse
  // por `@id` a la home. Es deliberado: un `@id` solo se resuelve si el
  // consumidor ya cargó la página donde está definido, y un artículo lo normal
  // es que se lea suelto — un resultado de búsqueda directo o una cita de un
  // motor de IA. Con la referencia colgando, ese lector no encuentra autor ni
  // editor por ningún lado. Los `@id` son los mismos de la home, así que quien
  // sí recorra el sitio entero ve una sola entidad, no dos.
  const articuloSchema = [
    {
      "@type": "BlogPosting",
      "@id": `https://investmentsmarc.com/blog/${post.slug}#articulo`,
      mainEntityOfPage: `https://investmentsmarc.com/blog/${post.slug}`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.publishedAt,
      inLanguage: "es",
      articleSection: post.category,
      author: { "@id": "https://investmentsmarc.com/#marcos-martinez" },
      publisher: { "@id": "https://investmentsmarc.com/#organizacion" },
    },
    {
      "@type": "Person",
      "@id": "https://investmentsmarc.com/#marcos-martinez",
      name: "Marcos Martínez",
      alternateName: "Marc",
      jobTitle: "Fundador de Marc Investments LLC",
      url: "https://investmentsmarc.com/about-us",
    },
    {
      "@type": "Organization",
      "@id": "https://investmentsmarc.com/#organizacion",
      name: "Marc Investments",
      legalName: "Marc Investments LLC",
      url: "https://investmentsmarc.com",
      logo: "https://investmentsmarc.com/images/logo.png",
    },
  ];

  return (
    <article className="mi-section">
      <JsonLd data={articuloSchema} />
      <div className="mi-container mi-post-layout">
        <Link href="/blog" className="mi-back-link">
          ← Volver al Blog
        </Link>
        <span className="mi-badge">{post.category}</span>
        <h1 className="mi-section-title">{post.title}</h1>
        <p className="mi-page-copy">{post.excerpt}</p>
        <div className="mi-post-meta">
          {/* El byline faltaba por completo: ni el lector ni un sistema de IA
              podían saber quién firma el análisis. Enlaza a la bio para que la
              persona detrás del texto sea verificable en un clic. */}
          <span>
            Por <Link href="/about-us">Marcos Martínez</Link>
          </span>
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
