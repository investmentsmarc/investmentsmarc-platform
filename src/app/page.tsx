import type { Metadata } from "next";
import { Suspense } from "react";

import { JsonLd } from "@/components/global/JsonLd";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsSkeleton } from "@/components/home/NewsSkeleton";
import { TelegramCommunity } from "@/components/home/TelegramCommunity";
import { Testimonials } from "@/components/home/Testimonials";

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
      "Educacion, herramientas y analisis de mercado enfocados en trading institucional.",
    telephone: "+1-832-953-4918",
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
