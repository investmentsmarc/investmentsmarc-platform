import type { Metadata } from "next";

import { LatestArticles } from "@/components/home/LatestArticles";
import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

export const metadata: Metadata = {
  title: "Blog",
  description: "Analisis de mercado y trading institucional.",
};

export default function BlogPage() {
  return (
    <>
      <PagePlaceholder
        badge="Blog"
        title="El archivo editorial completo llega en la siguiente fase."
        description="Por ahora dejamos visible el tono del contenido y la direccion del proyecto mientras conectamos Sanity y preservamos los posts ya definidos en el plan maestro."
      />
      <LatestArticles />
    </>
  );
}
