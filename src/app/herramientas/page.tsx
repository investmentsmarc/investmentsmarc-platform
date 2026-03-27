import type { Metadata } from "next";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Hub de calculadoras y herramientas para traders e inversores.",
};

export default function HerramientasPage() {
  return (
    <PagePlaceholder
      badge="Herramientas"
      title="El hub de calculadoras sera la siguiente pieza funcional."
      description="Aqui viviran Position Size, Risk/Reward e Investment Calculator portadas desde WordPress a componentes React con el mismo criterio visual y matematica consistente."
      ctaHref="/contacto"
      ctaLabel="Hablar con Marc"
    />
  );
}
