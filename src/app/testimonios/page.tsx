import type { Metadata } from "next";
import Link from "next/link";

import { TESTIMONIALS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Testimonios",
  description:
    "Historias de estudiantes que dejaron de perseguir el precio y empezaron a leer el flujo institucional.",
};

export default function TestimoniosPage() {
  return (
    <section className="mi-section mi-tstm-archive mi-home-band">
      <div className="mi-container">
        <header className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <span className="mi-badge">10 historias</span>
          <h1 className="mi-section-title">
            Así cambió su forma de{" "}
            <span className="mi-text-gradient">leer el mercado</span>
          </h1>
          <p className="mi-home-section-copy-sub">
            Estudiantes de tape reading, opciones avanzadas, smart money y gestión de
            riesgo. Diez voces, un mismo patrón: llegaron con una pérdida, encontraron
            una herramienta que les cambió la lente y hoy operan con tesis y resultado.
          </p>
        </header>

        <ul className="mi-tstm-archive-grid">
          {TESTIMONIALS.map((t, i) => (
            <li key={t.id} className="mi-tstm-archive-card">
              <span className="mi-tstm-archive-num" aria-hidden="true">
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <div
                className="mi-tstm-stars"
                aria-label={`${t.rating ?? 5} de 5 estrellas`}
              >
                {"★".repeat(t.rating ?? 5)}
              </div>
              <blockquote className="mi-tstm-archive-quote">“{t.quote}”</blockquote>
              <footer className="mi-tstm-byline">
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </footer>
            </li>
          ))}
        </ul>

        <div className="mi-tstm-footer">
          <Link href="/curso-gratis" className="mi-btn-gold mi-home-section-cta">
            Empieza tu transformación
          </Link>
        </div>
      </div>
    </section>
  );
}
