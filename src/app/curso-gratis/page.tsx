import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Curso Gratis",
  description: "Lead magnet inicial para introducir Smart Money y trading institucional.",
};

export default function CursoGratisPage() {
  return (
    <PagePlaceholder
      badge="Curso Gratis"
      title="Landing de captacion en construccion."
      description="Esta ruta ya queda activa para el CTA principal. En la siguiente iteracion construire el formulario real y la escritura en Firestore segun la Fase 3 del plan."
      ctaHref="/contacto"
      ctaLabel="Pedir informacion"
    />
  );
}
