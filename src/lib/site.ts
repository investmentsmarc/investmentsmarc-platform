import type { NavItem } from "@/types";

import { BLOG_POSTS, TESTIMONIALS } from "@/lib/content";

export const WHATSAPP_NUMBER = "18329534918";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
export const TELEGRAM_URL = "https://t.me/MarcInvestments";

// La comunidad de miembros, donde viven los cursos y la conversacion. Lleva un
// token de invitacion a proposito: es lo que la hace publica.
//
// 🚨 Sin el token, el portal EXIGE sesion — medido el 2026-09-05 con un
// navegador sin cookies, /courses redirige a /login. Con el token, el mismo
// navegador aterriza en la pagina de la comunidad y puede registrarse. Si
// alguna vez se acorta o se "limpia" esta URL quitandole el `?invite=`, deja
// de servir para captar a nadie.
export const COMUNIDAD_URL =
  "https://investmentsmarc.app.clientclub.net/communities/groups/marc-investments/home?invite=6a9c794c5d4d3f596eec50bd";

export const NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "/about-us" },
  { label: "Calculadora", href: "/herramientas/investment-calculator" },
  { label: "Cursos", href: "/cursos" },
  { label: "Comunidad", href: COMUNIDAD_URL, isExternal: true },
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
  { label: "Política de Privacidad", href: "/legal/privacidad" },
  { label: "Términos de Uso", href: "/legal/terminos" },
];

// Handles confirmados por Marc. El anterior, @investmentsmarc, no era el suyo:
// en YouTube devolvía 404 y en Instagram apuntaba a una cuenta distinta.
export const SOCIAL_LINKS: NavItem[] = [
  { label: "Instagram", href: "https://www.instagram.com/marc_investments/", isExternal: true },
  { label: "YouTube", href: "https://www.youtube.com/@marcinvestments", isExternal: true },
  { label: "TikTok", href: "https://www.tiktok.com/@marc_investments", isExternal: true },
  { label: "Facebook", href: "https://www.facebook.com/people/Marc-Investments/61574292711011/", isExternal: true },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/marc-mtnez/", isExternal: true },
  { label: "Telegram", href: TELEGRAM_URL, isExternal: true },
  { label: "WhatsApp", href: `${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`, isExternal: true },
];

export const HOME_PREVIEW_POSTS = BLOG_POSTS.slice(0, 3);

export const HOME_TESTIMONIALS = TESTIMONIALS;
