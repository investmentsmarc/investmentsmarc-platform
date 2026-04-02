import type { Metadata } from "next";
import Link from "next/link";

import { COURSE_SEEDS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Catálogo inicial de programas y rutas de aprendizaje.",
};

export default function CursosPage() {
  return (
    <section className="mi-section">
      <div className="mi-container">
        <div className="mi-tools-hero">
          <span className="mi-badge">Plataforma</span>
          <h1 className="mi-section-title">
            Catalogo de <span className="mi-text-gradient">Cursos</span>
          </h1>
          <p className="mi-page-copy mi-tools-copy">
            Base inicial del catálogo para preparar la Fase 4 con autenticación,
            pagos y progreso del estudiante.
          </p>
        </div>

        <div className="mi-tools-grid">
          {COURSE_SEEDS.map((course) => (
            <Link key={course.id} href={`/cursos/${course.slug}`} className="mi-tool-card">
              <div className="mi-tool-icon">CR</div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <span className="mi-btn-gold mi-btn-sm">
                {course.price === 0 ? "Ver ruta" : `Ver curso · $${course.price}`}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
