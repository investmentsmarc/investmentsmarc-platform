import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LEGAL_CONTENT } from "@/lib/content";

type LegalSlug = keyof typeof LEGAL_CONTENT;

function isLegalSlug(value: string): value is LegalSlug {
  return value in LEGAL_CONTENT;
}

export async function generateStaticParams(): Promise<Array<{ slug: LegalSlug }>> {
  return Object.keys(LEGAL_CONTENT).map((slug) => ({ slug: slug as LegalSlug }));
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
    title: LEGAL_CONTENT[slug].title,
    description: LEGAL_CONTENT[slug].intro,
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

  const page = LEGAL_CONTENT[slug];

  return (
    <section className="mi-section">
      <div className="mi-container mi-post-layout">
        <span className="mi-badge">Legal</span>
        <h1 className="mi-section-title">{page.title}</h1>
        <p className="mi-page-copy">{page.intro}</p>

        <div className="mi-legal-stack">
          {page.sections.map((section) => (
            <section key={section.heading} className="mi-legal-card">
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
