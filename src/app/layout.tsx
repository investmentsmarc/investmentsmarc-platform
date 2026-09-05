import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";

import { CookieBanner } from "@/components/global/CookieBanner";
import { Footer } from "@/components/global/Footer";
import { Header } from "@/components/global/Header";
import { MetaPixel } from "@/components/global/MetaPixel";
import { NewsPrefetcher } from "@/components/global/NewsPrefetcher";
import { TradingViewTicker } from "@/components/global/TradingViewTicker";
import { TelegramFloat } from "@/components/global/TelegramFloat";
import { WhatsAppFloat } from "@/components/global/WhatsAppFloat";
import { TradingShader } from "@/components/home/TradingShader";
import { RevealController } from "@/components/ui/RevealController";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-mi-body",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-mi-display",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://investmentsmarc.com"),
  title: {
    default: "Marc Investments — FlowTitan, formación y comunidad de trading",
    template: "%s | Marc Investments",
  },
  description:
    "Marc Investments desarrolla FlowTitan, la plataforma que sigue el flujo institucional de opciones en tiempo real, y forma a una comunidad hispanohablante de inversores.",
  keywords: ["trading", "inversiones", "bolsa", "forex", "análisis técnico", "smart money", "FlowTitan"],
  authors: [{ name: "Marc Investments LLC" }],
  creator: "Marc Investments LLC",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://investmentsmarc.com",
    siteName: "Marc Investments",
    title: "Marc Investments — FlowTitan, formación y comunidad de trading",
    description:
      "FlowTitan sigue el flujo institucional de opciones en tiempo real. Formación y comunidad de Marc Investments.",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marc Investments",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marc Investments — FlowTitan, formación y comunidad de trading",
    description: "FlowTitan sigue el flujo institucional de opciones en tiempo real.",
    images: ["/images/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  applicationName: "Marc Investments",
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
    <html
      lang="es"
      className={`${manrope.variable} ${fraunces.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col bg-mi-bg-primary text-mi-text-primary"
        suppressHydrationWarning
        cz-shortcut-listen="true"
      >
        <TradingShader variant="global" />
        <div className="mi-site-shell">
          <TradingViewTicker />
          <Header />
          <main className="mi-main">{children}</main>
          <Footer />
          <TelegramFloat />
          <WhatsAppFloat />
          <CookieBanner />
        </div>
        <RevealController />
        <NewsPrefetcher />
        <MetaPixel />
      </body>
    </html>
  );
}
