import type { Metadata } from "next";

import { Countdown } from "@/components/forms/Countdown";
import { WebinarForm } from "@/components/forms/WebinarForm";
import { WEBINAR_BENEFITS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Webinar",
  description: "Reserva tu lugar para la sesión en vivo sobre Smart Money y ejecución.",
};

export default function WebinarPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-contact-grid">
        <div className="mi-contact-intro">
          <span className="mi-badge">Plazas limitadas</span>
          <h1 className="mi-section-title">
            Como generar ingresos con <span className="mi-text-gradient">Smart Money</span>
          </h1>
          <p className="mi-page-copy">
            Webinar diseñado para traders que necesitan más estructura, mejores filtros
            y un marco operativo que sobreviva a distintos contextos de mercado.
          </p>
          <Countdown />
          <div className="mi-contact-points">
            {WEBINAR_BENEFITS.map((benefit) => (
              <div key={benefit} className="mi-contact-point">
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mi-contact-card">
          <WebinarForm />
        </div>
      </div>
    </section>
  );
}
