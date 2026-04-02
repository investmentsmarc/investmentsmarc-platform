import type { Metadata } from "next";
import Link from "next/link";

import { InvestmentCalc } from "@/components/calculators/InvestmentCalc";

export const metadata: Metadata = {
  title: "Calculadora de Inversion Compuesta",
  description:
    "Calculadora avanzada de inversion compuesta con aportes, ETFs, dividendos y DRIP.",
};

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
