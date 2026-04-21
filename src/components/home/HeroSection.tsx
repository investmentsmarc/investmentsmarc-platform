import Image from "next/image";
import Link from "next/link";

import { FlowTitanTerminal } from "@/components/home/FlowTitanTerminal";

export function HeroSection() {
  return (
    <section className="mi-hero mi-hero-trading">
      <div className="mi-hero-trading-inner">
        <div className="mi-hero-trading-grid">
          <div className="mi-hero-trading-copy">
            <span className="mi-badge mi-badge-pulse">Trading Floor · Sesión NY activa</span>

            <h1 className="mi-hero-trading-title">
              <span className="mi-hero-trading-line">El poder de las</span>
              <span className="mi-hero-trading-line">
                <span className="mi-text-gradient mi-text-gradient-glow">Instituciones</span>
              </span>
              <span className="mi-hero-trading-line mi-hero-trading-stroke">en tus manos.</span>
            </h1>

            <p className="mi-hero-trading-lede">
              Hacer trading sin aprender es como navegar sin brújula: puedes moverte, pero difícilmente
              llegarás lejos. Descubre <b>FlowTitan</b> — la metodología que sigue el rastro del dinero
              institucional en tiempo real.
            </p>

            <Image
              src="/images/marc-signature.png"
              alt="Firma de Marcos Martínez"
              width={420}
              height={174}
              className="mi-hero-trading-signature"
            />

            <div className="mi-hero-trading-actions">
              <Link href="/curso-gratis" className="mi-btn-gold mi-hero-trading-primary">
                Ver curso gratuito →
              </Link>
              <a
                href="https://flowtitan.investmentsmarc.com"
                target="_blank"
                rel="noreferrer noopener"
                className="mi-btn-ghost mi-hero-trading-secondary"
              >
                FlowTitan PRO
              </a>
            </div>
          </div>

          <FlowTitanTerminal />
        </div>
      </div>
    </section>
  );
}
