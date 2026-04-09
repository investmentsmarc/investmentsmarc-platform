import Image from "next/image";
import Link from "next/link";

import { LEGAL_NAV, SOCIAL_LINKS, WHATSAPP_URL } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  const navigationLinks = [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/about-us" },
    { label: "Blog", href: "/blog" },
    { label: "Herramientas", href: "/herramientas" },
    { label: "FAQs", href: "/faqs" },
  ];
  const educationLinks = [
    { label: "Curso Gratis", href: "/curso-gratis" },
    { label: "Plataforma de Cursos", href: "/cursos" },
    { label: "FlowTitan PRO", href: "/about-us" },
    { label: "Webinar", href: "/webinar" },
  ];
  const contactLinks = [
    { label: "Formulario", href: "/contacto", isExternal: false },
    { label: "WhatsApp", href: `${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`, isExternal: true },
    { label: "info@investmentsmarc.com", href: "mailto:info@investmentsmarc.com", isExternal: true },
  ];
  const socialIcons = SOCIAL_LINKS.filter((item) =>
    ["Instagram", "YouTube", "WhatsApp"].includes(item.label),
  );
  const socialLabels: Record<string, string> = {
    Instagram: "IG",
    YouTube: "YT",
    WhatsApp: "WA",
  };

  return (
    <footer className="mi-footer">
      <div className="mi-container mi-footer-grid">
        <div className="mi-footer-brand-block">
          <div className="mi-footer-logo-shell">
            <Image
              src="/images/logo.png"
              alt="Investments Marc"
              width={936}
              height={252}
              className="mi-footer-logo"
            />
          </div>
          <h2 className="mi-footer-title">Plataforma de educacion en trading institucional, analisis de mercado y herramientas profesionales.</h2>
          <p className="mi-footer-copy">
            Plataforma de educacion en trading institucional, analisis de mercado y
            herramientas profesionales.
          </p>
          <div className="mi-footer-socials">
            {socialIcons.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="mi-footer-social"
                target="_blank"
                rel="noreferrer"
                aria-label={item.label}
              >
                {socialLabels[item.label] ?? item.label.slice(0, 2).toUpperCase()}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mi-footer-heading">Navegacion</h3>
          <ul className="mi-footer-list">
            {navigationLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="mi-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mi-footer-heading">Educacion</h3>
          <ul className="mi-footer-list">
            {educationLinks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="mi-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mi-footer-heading">Legal y contacto</h3>
          <ul className="mi-footer-list">
            {contactLinks.map((item) => (
              <li key={item.label}>
                {item.isExternal ? (
                  <a href={item.href} className="mi-footer-link" target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href} className="mi-footer-link">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <h3 className="mi-footer-heading mi-footer-heading-legal">Legal</h3>
          <ul className="mi-footer-list">
            {LEGAL_NAV.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="mi-footer-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mi-container mi-footer-disclaimer">
        <p>
          Disclaimer: Investments Marc no es un asesor financiero registrado. Todo el
          contenido es estrictamente educativo e informativo. No constituye asesoria de
          inversiones ni recomendacion de trading. Los resultados pasados no garantizan
          resultados futuros. Opera unicamente con capital que puedas permitirte perder.
        </p>
      </div>

      <div className="mi-container mi-footer-bottom">
        <p>© {year} Investments Marc LLC. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
