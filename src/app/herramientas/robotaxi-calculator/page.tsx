import type { Metadata } from "next";
import Link from "next/link";

import { RobotaxiFleetCalc } from "@/components/calculators/RobotaxiFleetCalc";

export const metadata: Metadata = {
  title: "Robotaxi Fleet Calculator",
  description:
    "Calcula el flujo de caja real de un Tesla Robotaxi o Cybercab: enganche, crédito, tarifa por milla, comisión de Tesla o Uber, costos operativos y reinversión en flota.",
  openGraph: {
    title: "Robotaxi Fleet Calculator — Investments Marc",
    description:
      "El sistema de cálculo de los videos de robotaxi con cada supuesto a la vista y con fuentes oficiales.",
  },
};

export default function RobotaxiCalculatorPage() {
  return (
    <section className="mi-section mi-page-shell">
      <div className="mi-container">
        <div className="mi-calculator-page-head">
          <Link href="/herramientas" className="mi-back-link">
            <span aria-hidden="true">←</span>
            <span>Herramientas</span>
          </Link>
        </div>
        <RobotaxiFleetCalc />
      </div>
    </section>
  );
}
