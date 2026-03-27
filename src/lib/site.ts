import type { BlogPost, NavItem, Testimonial } from "@/types";

export const WHATSAPP_NUMBER = "18329534918";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about-us" },
  { label: "Herramientas", href: "/herramientas" },
  { label: "Blog", href: "/blog" },
  { label: "Cursos", href: "https://cursos.investmentsmarc.com", isExternal: true },
  { label: "Contacto", href: "/contacto" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Curso Gratis", href: "/curso-gratis" },
  { label: "Blog", href: "/blog" },
  { label: "Herramientas", href: "/herramientas" },
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
  { label: "WhatsApp", href: `${WHATSAPP_URL}?text=Hola%20Marc%2C%20quiero%20mas%20informacion`, isExternal: true },
];

export const MARKET_TICKERS = [
  "SPX 500",
  "Nasdaq 100",
  "BTC/USD",
  "ETH/USD",
  "NVDA",
  "TSLA",
  "AAPL",
];

export const HOME_PREVIEW_POSTS: BlogPost[] = [
  {
    _id: "post-1",
    slug: "las-siete-magnificas-en-2026",
    title: "Las Siete Magnificas en 2026: donde sigue el flujo institucional",
    excerpt:
      "Una lectura clara de momentum, liderazgo y riesgo para entender que nombres siguen absorbiendo liquidez.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-20",
    readingTime: 6,
  },
  {
    _id: "post-2",
    slug: "fed-2026-recortes-pausados",
    title: "La Fed en 2026: como cambia el mapa para traders e inversores",
    excerpt:
      "Contexto macro, implicaciones en indices y como traducir narrativa monetaria en ejecucion disciplinada.",
    category: "Analisis de Mercado",
    publishedAt: "2026-03-17",
    readingTime: 5,
  },
  {
    _id: "post-3",
    slug: "smart-money-concepts",
    title: "Smart Money Concepts: como leer la intencion del mercado",
    excerpt:
      "Una introduccion practica a estructuras, liquidez y zonas donde las instituciones muestran su huella.",
    category: "Trading Institucional",
    publishedAt: "2026-03-12",
    readingTime: 8,
  },
];

export const HOME_TESTIMONIALS: Testimonial[] = [
  {
    id: "testimonial-1",
    name: "Carlos M.",
    role: "Trader independiente",
    quote:
      "Lo que mas valoro es la claridad. Pase de operar por impulso a entender contexto, riesgo y ejecucion con una metodologia real.",
    rating: 5,
  },
  {
    id: "testimonial-2",
    name: "Daniela R.",
    role: "Estudiante de FlowTitan",
    quote:
      "El contenido combina estructura, disciplina y lectura institucional. Senti por primera vez que estaba construyendo criterio y no solo copiando entradas.",
    rating: 5,
  },
  {
    id: "testimonial-3",
    name: "Luis A.",
    role: "Inversor retail",
    quote:
      "Las herramientas y el enfoque de gestion de riesgo cambiaron mi forma de ver el mercado. Menos ruido, mejores decisiones.",
    rating: 5,
  },
];
