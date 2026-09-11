import type { Metadata } from "next";

import { FAQGrid } from "@/components/ui/FAQGrid";
import { FAQ_ITEMS } from "@/lib/content";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/faqs",
  titulo: "FAQs",
  descripcion: "Preguntas frecuentes sobre trading, herramientas y programas.",
});

export default function FaqsPage() {
  return (
    <section className="mi-section mi-faq-section">
      <div className="mi-container">
        <header className="mi-faq-head mi-reveal">
          <span className="mi-badge">FAQs</span>
          <h1 className="mi-section-title">
            Preguntas <span className="mi-text-gradient">frecuentes</span>
          </h1>
          <p className="mi-page-copy">
            Respuestas rápidas para entender el enfoque, las herramientas y el tipo de
            ayuda que ofrece Investments Marc.
          </p>
        </header>

        <FAQGrid items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
