import type { MetadataRoute } from "next";

import { BLOG_POSTS, COURSE_SEEDS, LEGAL_CONTENT } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://investmentsmarc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about-us",
    "/blog",
    "/contacto",
    "/curso-gratis",
    "/webinar",
    "/calculadora",
    "/herramientas",
    "/herramientas/position-size-calculator",
    "/herramientas/risk-reward-calculator",
    "/herramientas/investment-calculator",
    "/faqs",
    "/links",
    "/whatsapp",
    "/cursos",
    "/programa",
    // "/dashboard" fuera a proposito: la pagina dice "en preparacion" y no tiene
    // contenido. Ofrecersela al buscador es mandar visitas a una pagina vacia.
  ];


  return [
    ...staticRoutes.map((path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...Object.keys(LEGAL_CONTENT).map((slug) => ({
      url: `${BASE_URL}/legal/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...COURSE_SEEDS.map((course) => ({
      url: `${BASE_URL}/cursos/${course.slug}`,
      lastModified: new Date(course.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    // El blog se encendio el 2026-09-05 con el primer informe de datos propios.
    // Sin estas URLs aqui, lo publicado no se ofrece al buscador y el informe
    // semanal —que existe para atraer enlaces— tarda semanas en descubrirse.
    ...BLOG_POSTS.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
