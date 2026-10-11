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
  "https://investmentsmarc.app.clientclub.net/communities/groups/marc-investments/home?invite=6ac970e94c8f8109c54f208b";

// FlowTitan se contrata en su propio sitio: el pago (Stripe) vive alli.
export const FLOWTITAN_URL = "https://flowtitan.investmentsmarc.com/";

// La consultoria no se compra directo: el formulario lleva a una llamada de 45
// minutos con Marc, y en ese formulario se elige si se quiere la consultoria.
export const BOOKING_URL = "https://go.investmentsmarc.com/booking";

// Precios publicos, en dolares. Una sola fuente para /precios y /programa:
// si cambian, cambian aqui y en ningun otro sitio.
export const PRECIOS = {
  consultoria: 3000,
  flowtitanMensual: 70,
  comunidadMensual: 50,
} as const;

/** 3000 -> "$3,000". */
export const formatUsd = (n: number) => `$${n.toLocaleString("en-US")}`;

export const NAV_ITEMS: NavItem[] = [
  { label: "Nosotros", href: "/about-us" },
  { label: "Calculadora", href: "/herramientas/investment-calculator" },
  { label: "Cursos", href: "/cursos" },
  { label: "Precios", href: "/precios" },
  { label: "Comunidad", href: COMUNIDAD_URL, isExternal: true },
  { label: "Testimonios", href: "/#testimonios" },
  { label: "FAQs", href: "/faqs" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Programa", href: "/programa" },
  { label: "Precios", href: "/precios" },
  { label: "Blog", href: "/blog" },
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
