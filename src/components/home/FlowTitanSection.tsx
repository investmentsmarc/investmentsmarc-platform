import Link from "next/link";

import { FLOWTITAN_FEATURES } from "@/lib/content";

// Server Component a proposito: es texto y enlaces, no hay interactividad. Lo que
// el buscador necesita de esta seccion —un `h2` que diga FlowTitan, parrafos y un
// enlace— tiene que estar en el HTML servido, no montarse en el cliente.
//
// Reusa `FLOWTITAN_FEATURES` de `content.ts`, que ya alimenta la pagina Nosotros.
// Duplicar la copy aqui garantizaria que las dos versiones divergieran.
const DESTACADAS = FLOWTITAN_FEATURES.slice(0, 4);

export function FlowTitanSection() {
  return (
    <section className="mi-section mi-home-band" id="flowtitan">
      <div className="mi-container">
        <header className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <div className="mi-home-section-copy">
            <span className="mi-badge">Plataforma</span>
            <h2 className="mi-section-title">
              <span className="mi-text-gradient">FlowTitan</span>
            </h2>
            <p className="mi-home-section-copy-sub">
              Sigue en tiempo real el rastro del dinero institucional en opciones — y te
              explica qué significa
            </p>
          </div>
        </header>

        <div className="mi-ftsec-grid mi-reveal">
          {DESTACADAS.map((feature) => (
            <article key={feature.title} className="mi-ftsec-card">
              <span className="mi-ftsec-kicker">{feature.kicker}</span>
              <h3 className="mi-ftsec-title">{feature.title}</h3>
              <p className="mi-ftsec-copy">{feature.description}</p>
            </article>
          ))}
        </div>

        <div className="mi-ftsec-actions mi-reveal">
          <a
            href="https://flowtitan.investmentsmarc.com"
            target="_blank"
            rel="noreferrer noopener"
            className="mi-btn-gold"
          >
            Entrar en FlowTitan →
          </a>
          <Link href="/about-us#flowtitan" className="mi-btn-ghost">
            Ver todo lo que hace
          </Link>
        </div>

        <p className="mi-ftsec-legal">
          FlowTitan ofrece analítica de datos de mercado con fines informativos y
          educativos. No constituye asesoría de inversión ni una recomendación de compra
          o venta.
        </p>
      </div>
    </section>
  );
}
