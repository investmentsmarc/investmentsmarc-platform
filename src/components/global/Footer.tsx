import Image from "next/image";
import Link from "next/link";

import { SocialIcon } from "@/components/global/SocialIcon";
import { LEGAL_NAV, SOCIAL_LINKS, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

type SocialName = "Instagram" | "YouTube" | "WhatsApp" | "TikTok" | "Telegram";

export function Footer() {
  const year = new Date().getFullYear();
  const navigationLinks = [
    { label: "Inicio", href: "/" },
    { label: "Nosotros", href: "/about-us" },
    // { label: "Blog", href: "/blog" }, // oculto por ahora
    { label: "Herramientas", href: "/herramientas" },
    { label: "FAQs", href: "/faqs" },
  ];
  const educationLinks: Array<{ label: string; href: string; isExternal?: boolean }> = [
    { label: "Curso Gratis", href: "/curso-gratis" },
    { label: "Plataforma de Cursos", href: "/cursos" },
    { label: "FlowTitan PRO", href: "https://flowtitan.investmentsmarc.com", isExternal: true },
    { label: "Webinar", href: "/webinar" },
  ];
  const contactLinks = [
    { label: "Formulario", href: "/contacto", isExternal: false },
    { label: "WhatsApp", href: `${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`, isExternal: true },
    { label: "Telegram", href: TELEGRAM_URL, isExternal: true },
    { label: "info@investmentsmarc.com", href: "mailto:info@investmentsmarc.com", isExternal: true },
  ];
  const socialIcons = SOCIAL_LINKS.filter((item) =>
    ["Instagram", "YouTube", "Telegram", "WhatsApp"].includes(item.label),
  );

  return (
    <footer className="mi-footer mi-reveal">
      <div className="mi-container mi-footer-grid">
        <div className="mi-footer-brand-block mi-reveal">
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
                <SocialIcon name={item.label as SocialName} size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mi-reveal mi-reveal-delay-1">
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

        <div className="mi-reveal mi-reveal-delay-2">
          <h3 className="mi-footer-heading">Educacion</h3>
          <ul className="mi-footer-list">
            {educationLinks.map((item) => (
              <li key={item.label}>
                {item.isExternal ? (
                  <a
                    href={item.href}
                    className="mi-footer-link"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
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
        </div>

        <div className="mi-reveal mi-reveal-delay-3">
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
