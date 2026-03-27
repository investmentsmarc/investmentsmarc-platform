import Link from "next/link";

import { FOOTER_NAV, LEGAL_NAV, SOCIAL_LINKS } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mi-footer">
      <div className="mi-container mi-footer-grid">
        <div>
          <p className="mi-badge">Investments Marc</p>
          <h2 className="mi-footer-title">Trading e inversion con criterio institucional.</h2>
          <p className="mi-footer-copy">
            Educacion, herramientas y contexto para traders que quieren operar con
            disciplina, estructura y gestion de riesgo real.
          </p>
        </div>

        <div>
          <h3 className="mi-footer-heading">Navegacion</h3>
          <ul className="mi-footer-list">
            {FOOTER_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="mi-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mi-footer-heading">Legal y redes</h3>
          <ul className="mi-footer-list">
            {LEGAL_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="mi-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
            {SOCIAL_LINKS.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="mi-footer-link" target="_blank" rel="noreferrer">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mi-container mi-footer-bottom">
        <p>© {year} Investments Marc. All rights reserved.</p>
      </div>
    </footer>
  );
}
