import type { Metadata } from "next";
import Link from "next/link";

import { RiskRewardCalc } from "@/components/calculators/RiskRewardCalc";

export const metadata: Metadata = {
  title: "Risk Reward Calculator",
  description: "Calculadora de riesgo beneficio para evaluar operaciones.",
};

export default function RiskRewardCalculatorPage() {
  return (
    <section className="mi-section mi-page-shell">
      <div className="mi-container">
        <div className="mi-calculator-page-head">
          <Link href="/herramientas" className="mi-back-link">
            <span aria-hidden="true">←</span>
            <span>Herramientas</span>
          </Link>
        </div>
        <RiskRewardCalc />
      </div>
    </section>
  );
}
