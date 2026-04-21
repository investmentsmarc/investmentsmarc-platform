import type { Metadata } from "next";
import Link from "next/link";

import { COURSE_SEEDS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Academia · Ruta del Inversor",
  description:
    "Cinco cursos. Un trader completo. De la mentalidad al flujo institucional — la ruta completa de la Academia Marc Investments.",
};

export default function CursosPage() {
  return (
    <section className="mi-section mi-courses-section">
      <div className="mi-container">
        <header className="mi-courses-head mi-reveal">
          <span className="mi-badge">Academia Marc Investments</span>
          <h1 className="mi-section-title">
            Ruta del <span className="mi-text-gradient">Inversor</span>
          </h1>
          <p className="mi-page-copy mi-courses-tagline">
            De la mentalidad al flujo institucional.
            <br />
            <b>5 cursos. Un trader completo.</b>
          </p>
          <div className="mi-courses-progress" aria-hidden="true">
            {COURSE_SEEDS.map((c) => (
              <span key={c.id} className="mi-courses-progress-step">
                <span className="mi-courses-progress-num">
                  {c.order.toString().padStart(2, "0")}
                </span>
              </span>
            ))}
          </div>
        </header>

        <ol className="mi-courses-path">
          {COURSE_SEEDS.map((course, idx) => (
            <li
              key={course.id}
              className={`mi-courses-card mi-reveal mi-reveal-scale mi-reveal-delay-${
                Math.min(idx + 1, 6)
              }`}
            >
              <div className="mi-courses-card-index">
                <span className="mi-courses-card-num">
                  {course.order.toString().padStart(2, "0")}
                </span>
                <span className="mi-courses-card-of">/ 05</span>
              </div>

              <div className="mi-courses-card-body">
                <span className="mi-courses-card-codename">
                  {course.codename}
                </span>
                <h2 className="mi-courses-card-title">{course.title}</h2>
                <p className="mi-courses-card-kicker">
                  <span className="mi-courses-card-pipe" aria-hidden="true" />
                  {course.kicker}
                </p>
                <p className="mi-courses-card-desc">{course.description}</p>

                <div className="mi-courses-card-foot">
                  <Link
                    href={`/cursos/${course.slug}`}
                    className="mi-btn-gold mi-courses-card-cta"
                  >
                    {course.price === 0
                      ? "Empezar gratis"
                      : `Ver curso · $${course.price}`}
                    <span className="mi-courses-card-arrow" aria-hidden="true">
                      →
                    </span>
                  </Link>
                  {course.price === 0 ? (
                    <span className="mi-courses-card-tag mi-courses-card-tag-free">
                      Ruta de entrada · Gratis
                    </span>
                  ) : (
                    <span className="mi-courses-card-tag">
                      Acceso de por vida
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>

        <footer className="mi-courses-foot mi-reveal mi-reveal-delay-4">
          <p>
            ¿No sabes por dónde empezar?{" "}
            <Link href="/contacto">Habla con el equipo</Link> y te armamos una ruta
            personalizada.
          </p>
        </footer>
      </div>
    </section>
  );
}
