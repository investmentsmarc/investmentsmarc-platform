import Link from "next/link";

import { PRECIOS, formatUsd } from "@/lib/site";

// Sustituye al bloque "Sintoniza el Wire", que vendia un canal publico de
// Telegram con mensajes simulados ("Cerrado @ +7.2%", "Marc esta
// escribiendo..."). Retirado el 2026-10-10 por decision de Marc: el Telegram es
// privado, solo se entra desde La Mina y el enlace lo pasa el a cada miembro.
// Aqui se vende la comunidad, no el canal, y sin mensajes inventados.
const INCLUYE = [
  {
    t: "Live todos los lunes",
    d: "A las 6:00 PM, hora central de EE.UU., analizo el mercado en directo con todos los miembros.",
  },
  {
    t: "Me ves operar cada día",
    d: "Explico mis criterios de entrada, dónde nos estamos posicionando y dónde está la ventaja según FlowTitan.",
  },
  {
    t: "Formación de FlowTitan",
    d: "Los vídeos para aprender a usar la plataforma paso a paso.",
  },
];

export function LaMinaSection() {
  return (
    <section className="mi-section mi-home-band">
      <div className="mi-container">
        <header className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <div className="mi-home-section-copy">
            <span className="mi-badge">Comunidad privada</span>
            <h2 className="mi-section-title">
              La <span className="mi-text-gradient">Mina</span>
            </h2>
            <p className="mi-home-section-copy-sub">
              La comunidad de Marc Investments: donde estoy con los miembros
              cada semana, analizando el mercado y operando en vivo.
            </p>
          </div>
        </header>

        <div className="mi-prog-incluye mi-lamina-grid mi-reveal">
          {INCLUYE.map((x) => (
            <div key={x.t} className="mi-prog-item">
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </div>
          ))}
        </div>

        <div className="mi-prog-cta mi-lamina-cta mi-reveal">
          <Link href="/precios#la-mina" className="mi-btn-gold">
            Unirme a La Mina · {formatUsd(PRECIOS.comunidadMensual)}/mes →
          </Link>
        </div>
      </div>
    </section>
  );
}
