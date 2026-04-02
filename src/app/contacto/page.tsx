import type { Metadata } from "next";

import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Escribenos y registra tu interes para cursos, herramientas y mentoring.",
};

export default function ContactoPage() {
  return (
    <section className="mi-section">
      <div className="mi-container">
        <ContactForm />
      </div>
    </section>
  );
}
