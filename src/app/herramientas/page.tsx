import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Herramientas",
  description: "Hub de calculadoras y herramientas para traders e inversores.",
};

const toolCards = [
  {
    href: "/herramientas/position-size-calculator",
    title: "Position Size Calculator",
    description:
      "Calcula el tamano exacto de tu posicion segun capital, riesgo y stop loss.",
    icon: "PS",
  },
  {
    href: "/herramientas/risk-reward-calculator",
    title: "Risk / Reward Calculator",
    description: "Evalua si una operacion compensa el riesgo antes de ejecutarla.",
    icon: "RR",
  },
  {
    href: "/herramientas/investment-calculator",
    title: "Investment Calculator",
    description:
      "Simula crecimiento de capital con aportes periodicos y retorno esperado.",
    icon: "INV",
    featured: true,
  },
];

export default function HerramientasPage() {
  return (
    <section className="mi-section mi-page-shell">
      <div className="mi-container">
        <div className="mi-tools-hero mi-page-hero-block">
          <span className="mi-badge">Arsenal del Trader</span>
          <h1 className="mi-section-title">
            Herramientas <span className="mi-text-gradient">Profesionales</span>
          </h1>
          <p className="mi-page-copy mi-tools-copy">
            Calculadoras y utilidades pensadas para tomar decisiones con criterio,
            precision y gestion de riesgo. Todo dentro del mismo lenguaje visual de la marca.
          </p>
        </div>

        <div className="mi-tools-grid mi-tools-grid-featured">
          {toolCards.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`mi-tool-card ${tool.featured ? "mi-tool-card-featured" : ""}`}
            >
              {tool.featured ? <span className="mi-tool-badge-new">PRO</span> : null}
              <div className="mi-tool-icon">{tool.icon}</div>
              <h2>{tool.title}</h2>
              <p>{tool.description}</p>
              <span className="mi-btn-gold mi-btn-sm">Usar Herramienta</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
