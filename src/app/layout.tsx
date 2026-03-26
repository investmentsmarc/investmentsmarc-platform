import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--mi-font",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://investmentsmarc.com"),
  title: {
    default: "Investments Marc — Trading e Inversiones Profesionales",
    template: "%s | Investments Marc",
  },
  description:
    "Aprende trading institucional, gestión de riesgo y análisis de mercados con Marc. FlowTitan PRO, cursos y herramientas para inversores serios.",
  keywords: ["trading", "inversiones", "bolsa", "forex", "análisis técnico", "smart money", "FlowTitan"],
  authors: [{ name: "Marc Investments LLC" }],
  creator: "Marc Investments LLC",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://investmentsmarc.com",
    siteName: "Investments Marc",
    title: "Investments Marc — Trading e Inversiones Profesionales",
    description:
      "Aprende trading institucional, gestión de riesgo y análisis de mercados con Marc.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Investments Marc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Investments Marc — Trading e Inversiones Profesionales",
    description: "Aprende trading institucional, gestión de riesgo y análisis de mercados.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} h-full`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-mi-bg-primary text-mi-text-primary">
        {children}
      </body>
    </html>
  );
}
