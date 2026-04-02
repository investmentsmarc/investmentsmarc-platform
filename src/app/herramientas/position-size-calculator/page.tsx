import type { Metadata } from "next";
import Link from "next/link";

import { PositionSizeCalc } from "@/components/calculators/PositionSizeCalc";

export const metadata: Metadata = {
  title: "Position Size Calculator",
  description: "Calcula el tamano de tu posicion segun riesgo, capital y stop loss.",
};

export default function PositionSizeCalculatorPage() {
  return (
    <section className="mi-section mi-page-shell">
      <div className="mi-container">
        <div className="mi-calculator-page-head">
          <Link href="/herramientas" className="mi-back-link">
            <span aria-hidden="true">←</span>
            <span>Herramientas</span>
          </Link>
        </div>
        <PositionSizeCalc />
      </div>
    </section>
  );
}
