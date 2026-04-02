import type { Metadata } from "next";
import Link from "next/link";

import { COURSE_SEEDS } from "@/lib/content";

type Params = {
  slug: string;
  id: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  return COURSE_SEEDS.flatMap((course) => [
    { slug: course.slug, id: "1" },
    { slug: course.slug, id: "2" },
    { slug: course.slug, id: "3" },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, id } = await params;

  return {
    title: `Leccion ${id} · ${slug}`,
    description: "Base inicial para la experiencia de lecciones y progreso del estudiante.",
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, id } = await params;

  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <Link href={`/cursos/${slug}`} className="mi-back-link">
          ← Volver al curso
        </Link>
        <span className="mi-badge">Leccion</span>
        <h1 className="mi-section-title">Leccion {id}</h1>
        <p className="mi-page-copy">
          Esta ruta deja preparada la navegación de la plataforma. Aquí se integrarán
          player, recursos, progreso y evaluaciones por lección.
        </p>
      </div>
    </section>
  );
}
