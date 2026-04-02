import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { COURSE_SEEDS } from "@/lib/content";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return COURSE_SEEDS.map((course) => ({ slug: course.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = COURSE_SEEDS.find((item) => item.slug === slug);

  if (!course) {
    return {};
  }

  return {
    title: course.title,
    description: course.description,
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = COURSE_SEEDS.find((item) => item.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <Link href="/cursos" className="mi-back-link">
          ← Volver al catalogo
        </Link>
        <span className="mi-badge">{course.price === 0 ? "Ruta gratuita" : "Curso premium"}</span>
        <h1 className="mi-section-title">{course.title}</h1>
        <p className="mi-page-copy">{course.description}</p>

        <div className="mi-contact-points">
          <div className="mi-contact-point">
            <strong>Estado actual</strong>
            <span>
              Base de catálogo lista. La siguiente fase conectará Stripe, lecciones y progreso real.
            </span>
          </div>
          <div className="mi-contact-point">
            <strong>Tags</strong>
            <span>{course.tags.join(" · ")}</span>
          </div>
        </div>

        <div className="mi-inline-actions">
          <Link href={`/cursos/${course.slug}/lecciones/introduccion`} className="mi-btn-gold">
            Ver lección inicial
          </Link>
          <Link href="/contacto" className="mi-btn-outline">
            Hablar con el equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
