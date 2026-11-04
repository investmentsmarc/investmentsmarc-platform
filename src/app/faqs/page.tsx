import type { Metadata } from "next";

import { JsonLd } from "@/components/global/JsonLd";
import { FAQGrid } from "@/components/ui/FAQGrid";
import { FAQ_ITEMS } from "@/lib/content";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/faqs",
  titulo: "FAQs",
  descripcion: "Preguntas frecuentes sobre trading, herramientas y programas.",
});

// Se construye desde `FAQ_ITEMS`, la MISMA fuente que renderiza `FAQGrid`, no
// desde una copia. Un FAQPage cuyas respuestas no coinciden con las que el
// visitante lee es contenido oculto, y eso penaliza; atarlo al mismo array hace
// que no puedan divergir.
//
// Esto NO produce un resultado enriquecido en Google: la compañía retiró el
// FAQ rich result para la mayoría de los sitios. El beneficio es que un motor
// de IA extraiga los pares pregunta/respuesta literales en vez de parafrasear.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://investmentsmarc.com/faqs#faq",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

export default function FaqsPage() {
  return (
    <section className="mi-section mi-faq-section">
      <JsonLd data={faqSchema} />
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
