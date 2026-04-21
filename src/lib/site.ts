import type { NavItem } from "@/types";

import { BLOG_POSTS, TESTIMONIALS } from "@/lib/content";

export const WHATSAPP_NUMBER = "18329534918";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const TELEGRAM_URL = "https://t.me/MarcInvestments";

export const NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "/about-us" },
  { label: "Calculadora", href: "/herramientas/investment-calculator" },
  { label: "Cursos", href: "/cursos" },
  { label: "Testimonios", href: "/#testimonios" },
  { label: "FAQs", href: "/faqs" },
  // { label: "Blog", href: "/blog" }, // oculto por ahora — se reactivará cuando el blog esté listo
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Curso Gratis", href: "/curso-gratis" },
  // { label: "Blog", href: "/blog" }, // oculto por ahora
  { label: "Herramientas", href: "/herramientas" },
  { label: "FAQs", href: "/faqs" },
  { label: "About Us", href: "/about-us" },
  { label: "Contacto", href: "/contacto" },
];

export const LEGAL_NAV: NavItem[] = [
  { label: "Politica de Privacidad", href: "/legal/privacidad" },
  { label: "Terminos de Uso", href: "/legal/terminos" },
];

export const SOCIAL_LINKS: NavItem[] = [
  { label: "Instagram", href: "https://instagram.com/investmentsmarc", isExternal: true },
  { label: "YouTube", href: "https://youtube.com/@investmentsmarc", isExternal: true },
  { label: "TikTok", href: "https://tiktok.com/@investmentsmarc", isExternal: true },
  { label: "Telegram", href: TELEGRAM_URL, isExternal: true },
  { label: "WhatsApp", href: `${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`, isExternal: true },
];

export const HOME_PREVIEW_POSTS = BLOG_POSTS.slice(0, 3);

export const HOME_TESTIMONIALS = TESTIMONIALS;
