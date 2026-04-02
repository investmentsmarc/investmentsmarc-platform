import type { Metadata } from "next";

import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Curso Gratis",
  description: "Lead magnet inicial para introducir Smart Money y trading institucional.",
};

export default function CursoGratisPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-contact-grid">
        <div className="mi-contact-intro">
          <span className="mi-badge">Curso 100% Gratuito</span>
          <h1 className="mi-section-title">
            Aprende a invertir como las <span className="mi-text-gradient">instituciones</span>
          </h1>
          <p className="mi-page-copy">
            Entra a Smart Money Basics y construye una base clara de estructura,
            liquidez, sesgo y gestión de riesgo para operar con más criterio.
          </p>
          <div className="mi-contact-points">
            <div className="mi-contact-point">
              <strong>Incluye</strong>
              <span>Lecciones introductorias, framework base y siguientes pasos sugeridos.</span>
            </div>
            <div className="mi-contact-point">
              <strong>Ideal para</strong>
              <span>Traders en transición que quieren dejar atrás entradas impulsivas.</span>
            </div>
            <div className="mi-contact-point">
              <strong>Meta</strong>
              <span>Dar estructura a tu aprendizaje antes de pasar a herramientas avanzadas.</span>
            </div>
          </div>
        </div>
        <div className="mi-contact-card">
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
