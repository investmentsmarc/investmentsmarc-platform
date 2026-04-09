import type { Metadata } from "next";
import { Manrope, Sora } from "next/font/google";

import { CookieBanner } from "@/components/global/CookieBanner";
import { Footer } from "@/components/global/Footer";
import { Header } from "@/components/global/Header";
import { TradingViewTicker } from "@/components/global/TradingViewTicker";
import { WhatsAppFloat } from "@/components/global/WhatsAppFloat";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-mi-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-mi-display",
  display: "swap",
  weight: ["500", "600", "700", "800"],
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
        url: "/images/og-image.png",
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
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  applicationName: "Investments Marc",
  icons: {
    icon: [
      { url: "/favicon.ico",  sizes: "any" },
      { url: "/icon.png",     type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${manrope.variable} ${sora.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-mi-bg-primary text-mi-text-primary">
        <div className="mi-site-shell">
          <TradingViewTicker />
          <Header />
          <main className="mi-main">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <CookieBanner />
        </div>
      </body>
    </html>
  );
}
