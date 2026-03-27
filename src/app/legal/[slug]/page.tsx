import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PagePlaceholder } from "@/components/ui/PagePlaceholder";

const legalPages = {
  privacidad: {
    title: "Politica de Privacidad",
    description:
      "Version placeholder de la politica mientras migramos el contenido legal definitivo.",
  },
  terminos: {
    title: "Terminos de Uso",
    description:
      "Version placeholder de los terminos mientras migramos el contenido legal definitivo.",
  },
} as const;

type LegalSlug = keyof typeof legalPages;

function isLegalSlug(value: string): value is LegalSlug {
  return value in legalPages;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!isLegalSlug(slug)) {
    return {};
  }

  return {
    title: legalPages[slug].title,
    description: legalPages[slug].description,
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isLegalSlug(slug)) {
    notFound();
  }

  const page = legalPages[slug];

  return (
    <PagePlaceholder
      badge="Legal"
      title={page.title}
      description={`${page.description} El siguiente bloque de trabajo incorporara el texto completo y estructurado desde la documentacion del proyecto.`}
    />
  );
}
