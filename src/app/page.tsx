import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";

import { JsonLd } from "@/components/global/JsonLd";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsSkeleton } from "@/components/home/NewsSkeleton";
import { TelegramCommunity } from "@/components/home/TelegramCommunity";

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
  title: "Investments Marc — Trading Profesional & Institucional",
  description:
    "Tu camino hacia el trading institucional. Cursos, herramientas y analisis de mercado para traders serios.",
};

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Investments Marc",
    url: "https://investmentsmarc.com",
    description: "Trading profesional e institucional para traders e inversores serios.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    name: "Investments Marc",
    url: "https://investmentsmarc.com",
    description:
      "Educación, herramientas y análisis de mercado enfocados en trading institucional.",
    telephone: "+1-832-953-4918",
    // Sin sameAs, Google no tiene forma de saber que estos perfiles son de la
    // misma entidad que el sitio. Cada URL verificada con HTTP 200; el handle
    // @investmentsmarc que se enlazaba antes no es de Marc y en YouTube era 404.
    sameAs: [
      "https://www.instagram.com/marc_investments/",
      "https://www.youtube.com/@marcinvestments",
      "https://www.tiktok.com/@marc_investments",
      "https://www.facebook.com/profile.php?id=61574292711011",
      "https://t.me/MarcInvestments",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={homeSchema} />
      <HeroSection />
      <TelegramCommunity />
      <Suspense fallback={<NewsSkeleton />}>
        <LatestArticles />
      </Suspense>
      <Testimonials />
    </>
  );
}
