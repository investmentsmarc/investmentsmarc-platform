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
        <span className="mi-badge">
          {course.acceso === "gratis" ? "Ruta gratuita" : "Programa privado"}
        </span>
        <h1 className="mi-section-title">{course.title}</h1>
        <p className="mi-page-copy">{course.description}</p>

        {/* 🚨 Aqui vivia una nota de desarrollo — "la siguiente fase conectara
            Stripe, lecciones y progreso real" — publicada en la web comercial,
            bajo cada curso. Se retiro el 2026-09-05. */}
        <div className="mi-contact-points">
          <div className="mi-contact-point">
            <strong>Nivel</strong>
            <span>{course.kicker}</span>
          </div>
          <div className="mi-contact-point">
            <strong>Temas</strong>
            <span>{course.tags.join(" · ")}</span>
          </div>
        </div>

        <div className="mi-inline-actions">
          {/* El gratuito tiene su propia captacion publica; los privados se
              piden por contacto, que es la unica via que hoy existe de verdad. */}
          <Link
            href={course.acceso === "gratis" ? "/curso-gratis" : "/contacto"}
            className="mi-btn-gold"
          >
            {course.acceso === "gratis" ? "Acceder al curso gratis" : "Solicitar acceso"}
          </Link>
          <Link href="/contacto" className="mi-btn-outline">
            Hablar con el equipo
          </Link>
        </div>
      </div>
    </section>
  );
}
