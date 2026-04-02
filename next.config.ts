import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },

  // Imágenes: deshabilitar optimization para evitar Cloud Functions
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "investmentsmarc.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  // 301 Redirects desde URLs de WordPress
  async redirects() {
    return [
      // Calculadora antigua → calculadora de inversión compuesta
      {
        source: "/calculadora",
        destination: "/herramientas/investment-calculator",
        permanent: true,
      },
      {
        source: "/calculadora/",
        destination: "/herramientas/investment-calculator",
        permanent: true,
      },
      {
        source: "/nosotros",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/herramientas/risk-reward-calculator/",
        destination: "/herramientas/risk-reward-calculator",
        permanent: true,
      },
      {
        source: "/herramientas/investment-calculator/",
        destination: "/herramientas/investment-calculator",
        permanent: true,
      },
      // Políticas legales (slugs WordPress)
      {
        source: "/politica-de-privacidad",
        destination: "/legal/privacidad",
        permanent: true,
      },
      {
        source: "/terminos-de-uso",
        destination: "/legal/terminos",
        permanent: true,
      },
      {
        source: "/curso",
        destination: "/curso-gratis",
        permanent: true,
      },
      {
        source: "/preguntas-frecuentes",
        destination: "/faqs",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
