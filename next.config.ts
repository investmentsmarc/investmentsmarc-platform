import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Imágenes remotas (añadir dominios según se necesiten)
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "investmentsmarc.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // 301 Redirects desde URLs de WordPress
  async redirects() {
    return [
      // Calculadora antigua → nuevo hub de herramientas
      {
        source: "/calculadora",
        destination: "/herramientas",
        permanent: true,
      },
      {
        source: "/calculadora/",
        destination: "/herramientas",
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
      // Cursos (temporal, apunta a subdominio hasta Fase 4)
      // En Fase 4 se elimina este redirect cuando la plataforma esté lista
      // {
      //   source: "/cursos/:path*",
      //   destination: "https://cursos.investmentsmarc.com/:path*",
      //   permanent: false,
      // },
    ];
  },
};

export default nextConfig;
