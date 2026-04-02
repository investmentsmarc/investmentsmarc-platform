import type { Metadata } from "next";
import Link from "next/link";

import { LINK_PAGE_ITEMS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Links",
  description: "Link-in-bio con accesos clave al ecosistema de Investments Marc.",
};

export default function LinksPage() {
  return (
    <section className="mi-section mi-links-page">
      <div className="mi-links-card">
        <div className="mi-links-avatar">IM</div>
        <div className="mi-links-name">Marc Investments</div>
        <div className="mi-links-handle">@investmentsmarc</div>
        <p className="mi-links-bio">
          Trading institucional, Smart Money y analisis de mercado. Aprende a operar
          con mas contexto y mejor gestion de riesgo.
        </p>

        <div className="mi-links-list">
          {LINK_PAGE_ITEMS.map((item) => {
            const className = `mi-link-item ${item.highlighted ? "mi-link-item--featured" : ""}`;
            const isInternal = item.href.startsWith("/");

            if (isInternal) {
              return (
                <Link key={item.label} href={item.href} className={className}>
                  <span className="mi-link-item-label">{item.label}</span>
                  <span className="mi-link-item-copy">{item.description}</span>
                </Link>
              );
            }

            return (
              <a key={item.label} href={item.href} className={className} target="_blank" rel="noreferrer">
                <span className="mi-link-item-label">{item.label}</span>
                <span className="mi-link-item-copy">{item.description}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
