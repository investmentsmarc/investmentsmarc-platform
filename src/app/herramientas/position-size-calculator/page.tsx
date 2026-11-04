import type { Metadata } from "next";
import Link from "next/link";

import { PositionSizeCalc } from "@/components/calculators/PositionSizeCalc";
import { paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  ruta: "/herramientas/position-size-calculator",
  titulo: "Position Size Calculator",
  descripcion: "Calcula el tamaño de tu posición según riesgo, capital y stop loss.",
});

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
