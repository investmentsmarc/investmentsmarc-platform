import type { Metadata } from "next";

import { WHATSAPP_OPTIONS } from "@/lib/content";
import { WHATSAPP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "WhatsApp",
  description: "Elige la forma de contacto por WhatsApp que mejor encaja con tu necesidad.",
};

export default function WhatsAppPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <span className="mi-badge">WhatsApp</span>
        <h1 className="mi-section-title">Conversemos por el canal adecuado</h1>
        <p className="mi-page-copy">
          Selecciona el motivo de tu consulta para que la conversación empiece con el
          contexto correcto. El canal sigue siendo educativo y no constituye asesoría financiera.
        </p>

        <div className="mi-whatsapp-options">
          {WHATSAPP_OPTIONS.map((option) => (
            <a
              key={option.title}
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(option.message)}`}
              target="_blank"
              rel="noreferrer"
              className="mi-tool-card"
            >
              <div className="mi-tool-icon">WA</div>
              <h2>{option.title}</h2>
              <p>{option.description}</p>
              <span className="mi-btn-gold mi-btn-sm">Abrir WhatsApp</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
