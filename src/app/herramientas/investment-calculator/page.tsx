import type { Metadata } from "next";
import Link from "next/link";

import { InvestmentCalc } from "@/components/calculators/InvestmentCalc";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/herramientas/investment-calculator",
  titulo: "Calculadora de Inversion Compuesta",
  descripcion:
    "Calculadora avanzada de inversión compuesta con aportes, ETFs, dividendos y DRIP.",
});

export default function InvestmentCalculatorPage() {
  return (
    <section className="mi-section mi-page-shell">
      <div className="mi-container">
        <div className="mi-calculator-page-head">
          <Link href="/herramientas" className="mi-back-link">
            <span aria-hidden="true">←</span>
            <span>Herramientas</span>
          </Link>
        </div>
        <InvestmentCalc />
      </div>
    </section>
  );
}
