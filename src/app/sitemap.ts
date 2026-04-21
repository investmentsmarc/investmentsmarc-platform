import type { MetadataRoute } from "next";

import { BLOG_POSTS, COURSE_SEEDS, LEGAL_CONTENT } from "@/lib/content";

export const dynamic = "force-static";

const BASE_URL = "https://investmentsmarc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about-us",
    // "/blog", // oculto por ahora
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
    "/dashboard",
  ];

  // Blog hidden for now — `BLOG_POSTS` is intentionally unused here.
  void BLOG_POSTS;

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
  ];
}
