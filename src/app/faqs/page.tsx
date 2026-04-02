import type { Metadata } from "next";

import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { FAQ_ITEMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Preguntas frecuentes sobre trading, herramientas y programas.",
};

export default function FaqsPage() {
  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <span className="mi-badge">FAQs</span>
        <h1 className="mi-section-title">Preguntas frecuentes</h1>
        <p className="mi-page-copy">
          Respuestas rápidas para entender el enfoque, las herramientas y el tipo de
          ayuda que ofrece Investments Marc.
        </p>
        <FAQAccordion items={FAQ_ITEMS} />
      </div>
    </section>
  );
}
