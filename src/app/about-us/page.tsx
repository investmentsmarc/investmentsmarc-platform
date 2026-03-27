import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "About Us",
  description: "Historia, enfoque y filosofia de Investments Marc.",
};

export default function AboutUsPage() {
  return (
    <PagePlaceholder
      badge="About Us"
      title="Estamos construyendo la experiencia completa de About Us."
      description="La siguiente entrega de Fase 1 incorporara la bio de Marc, el bloque FlowTitan y la grilla de valores con la misma identidad visual del sitio principal."
      ctaHref="/curso-gratis"
      ctaLabel="Ver Curso Gratis"
    />
  );
}
