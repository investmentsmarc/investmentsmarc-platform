import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/contacto",
  titulo: "Contacto",
  descripcion: "Escribenos y registra tu interes para cursos, herramientas y mentoring.",
});

export default function ContactoPage() {
  return (
    <section className="mi-section">
      <div className="mi-container">
        <ContactForm />
      </div>
    </section>
  );
}
