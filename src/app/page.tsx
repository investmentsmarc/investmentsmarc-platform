import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { JsonLd } from "@/components/global/JsonLd";
import { FlowTitanSection } from "@/components/home/FlowTitanSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsSkeleton } from "@/components/home/NewsSkeleton";
import { CanalWhatsApp } from "@/components/home/CanalWhatsApp";

const Testimonials = dynamic(
  () =>
    import("@/components/home/Testimonials").then((m) => ({
      default: m.Testimonials,
    })),
  {
    loading: () => (
      <section
        className="mi-section mi-home-band mi-tstm-placeholder"
        id="testimonios"
        aria-hidden="true"
      />
    ),
  },
);

export const metadata: Metadata = {
  title: "FlowTitan, de Marc Investments — trading institucional",
  description:
    "FlowTitan sigue en tiempo real el rastro del dinero institucional en opciones: barridos, bloques y exposición a gamma. Más la comunidad y la formación de Marc Investments.",
  alternates: { canonical: "https://investmentsmarc.com" },
};

// Identificadores estables para que los cuatro nodos se refieran entre si en vez
// de repetirse. Sin esto el buscador ve entidades sueltas y no aprende que
// FlowTitan y Marc Investments son la misma casa.
const ID_SITIO = "https://investmentsmarc.com/#sitio";
const ID_ORG = "https://investmentsmarc.com/#organizacion";
const ID_MARC = "https://investmentsmarc.com/#marcos-martinez";
const ID_FLOWTITAN = "https://flowtitan.investmentsmarc.com/#software";

// 🚨 `sameAs` afirma "este perfil ES esta entidad", asi que el reparto NO es
// cosmetico: poner instagram.com/marc_investments como perfil de la EMPRESA es
// falso, porque esa pagina se titula "Marcos Martinez (@marc_investments)".
// El reparto de abajo espeja el que el sitio del producto desplego el 2026-09-04
// y que su propio test fija (`presenciaBuscadores.test.ts`); una lista identica
// en los dos nodos, ademas, le quita al buscador la unica pista para separarlos.
// Telegram va en los dos: es el canal de la casa y lo lleva Marc.
//
// Los perfiles se verificaron el 2026-09-04 contra un usuario INVENTADO: un
// nombre que no existe devuelve HTTP 200 en Instagram, TikTok y Telegram, asi que
// responder no prueba nada. El criterio valido es que el titulo de la pagina
// nombre a la persona o a la marca. Telegram no se puede distinguir ni asi; lo
// confirmo Marc en persona.
const PERFILES_EMPRESA = [
  "https://www.youtube.com/@marcinvestments",
  "https://www.facebook.com/people/Marc-Investments/61574292711011/",
  "https://t.me/MarcInvestments",
];

const PERFILES_MARC = [
  "https://www.instagram.com/marc_investments/",
  "https://www.tiktok.com/@marc_investments",
  "https://www.linkedin.com/in/marc-mtnez",
  "https://t.me/MarcInvestments",
];

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": ID_SITIO,
    name: "Marc Investments",
    url: "https://investmentsmarc.com",
    inLanguage: "es",
    publisher: { "@id": ID_ORG },
    description:
      "FlowTitan, formación y comunidad de trading institucional de Marc Investments.",
  },
  {
    // Era `FinancialService`. Se cambio el 2026-09-04: el producto declara de
    // forma explicita que NO constituye asesoria de inversion, asi que declarar
    // la entidad como servicio financiero en datos legibles por maquina
    // contradecia sus propios descargos y afirmaba una categoria regulada.
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ID_ORG,
    name: "Marc Investments",
    legalName: "Marc Investments LLC",
    url: "https://investmentsmarc.com",
    logo: "https://investmentsmarc.com/images/logo.png",
    description:
      "Empresa de Marcos Martínez. Desarrolla FlowTitan y forma a una comunidad hispanohablante de inversores en el mercado de EE. UU.",
    telephone: "+1-832-953-4918",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Houston",
      addressRegion: "TX",
      addressCountry: "US",
    },
    founder: { "@id": ID_MARC },
    sameAs: PERFILES_EMPRESA,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": ID_MARC,
    name: "Marcos Martínez",
    alternateName: "Marc",
    jobTitle: "Fundador de Marc Investments LLC",
    worksFor: { "@id": ID_ORG },
    url: "https://investmentsmarc.com/about-us",
    sameAs: PERFILES_MARC,
  },
  {
    // El nodo que faltaba, y es el motivo por el que el buscador no relacionaba
    // el nombre con esta casa: el sitio ensenaba FlowTitan pero nunca lo
    // declaraba. Deliberadamente sin precio ni valoraciones: la pagina del
    // producto es la autoridad sobre su oferta y dos fuentes que se contradicen
    // son peor que una sola.
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": ID_FLOWTITAN,
    name: "FlowTitan",
    url: "https://flowtitan.investmentsmarc.com",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web, Android",
    description:
      "Plataforma de analítica que sigue en tiempo real el flujo institucional de opciones: barridos, bloques, posiciones de gran tamaño y exposición a gamma.",
    publisher: { "@id": ID_ORG },
    author: { "@id": ID_MARC },
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <HeroSection />
      <FlowTitanSection />
      <CanalWhatsApp />
      <Suspense fallback={<NewsSkeleton />}>
        <LatestArticles />
      </Suspense>
      <Testimonials />
    </>
  );
}
