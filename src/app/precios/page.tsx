import type { Metadata } from "next";
import Link from "next/link";

import { BOOKING_URL, COMUNIDAD_URL, FLOWTITAN_URL, PRECIOS, formatUsd } from "@/lib/site";
import type { PlanPrecio } from "@/types";

export const metadata: Metadata = {
  title: "Precios · Consultoría, FlowTitan y La Mina",
  description:
    "Lo que cuesta cada producto de Marc Investments: la consultoría de 60 días con Marc, FlowTitan y La Mina, la comunidad privada. Cada uno se contrata por separado.",
  alternates: { canonical: "/precios" },
};

// FlowTitan va en el centro y destacado: es el producto estrella y es aparte de
// todo lo demas. Cada plan se contrata por separado; que ninguno parezca
// requisito de otro es la razon de que esta pagina exista.
const PLANES: PlanPrecio[] = [
  {
    id: "la-mina",
    nombre: "La Mina",
    kicker: "Comunidad privada de Marc Investments",
    precio: PRECIOS.comunidadMensual,
    periodo: "al mes",
    resumen:
      "Donde estoy con los miembros todas las semanas: analizando el mercado, operando en vivo y respondiendo.",
    incluye: [
      "Live todos los lunes a las 6:00 PM, hora central de EE.UU., donde analizo el mercado con todos los miembros.",
      "Canal privado de la comunidad: me ves operar en vivo cada día y explico mis criterios de entrada, dónde nos estamos posicionando y dónde está la ventaja según FlowTitan.",
      "Los vídeos de formación de FlowTitan, para aprender a usar la plataforma paso a paso.",
    ],
    cta: { label: "Unirme a La Mina →", href: COMUNIDAD_URL },
    nota: "Pago mensual. El enlace te lleva directo al pago.",
  },
  {
    id: "flowtitan",
    nombre: "FlowTitan",
    kicker: "Flujo institucional de opciones en tiempo real",
    precio: PRECIOS.flowtitanMensual,
    periodo: "al mes",
    resumen:
      "La plataforma con la que leo el mercado cada día. Ve dónde se posiciona el dinero institucional antes de que se mueva el precio.",
    paraQuien:
      "Le saca todo el partido quien ya opera con base avanzada en opciones y acciones, o quien es miembro de La Mina y me ve usarla en vivo cada día.",
    incluye: [
      "Detector de ballenas: posiciones institucionales de $150K o más, en tiempo real.",
      "GEX: exposición a gamma y los niveles donde se concentra la cobertura de los market makers.",
      "Flujo inusual de opciones y tape scanner.",
      "Reportes de confluencia, watchlist y alertas.",
    ],
    cta: { label: "Contratar FlowTitan →", href: FLOWTITAN_URL },
    nota: "Pago mensual. Producto independiente: no necesitas nada más para contratarlo.",
    destacado: true,
  },
  {
    id: "consultoria",
    nombre: "Consultoría con Marc",
    kicker: "Programa privado de 60 días",
    precio: PRECIOS.consultoria,
    periodo: "pago único",
    resumen:
      "De cero a inversionista profesional en 60 días, uno a uno conmigo: el criterio para invertir con responsabilidad y construir patrimonio para ti y tu familia.",
    incluye: [
      "7 sesiones privadas uno a uno conmigo.",
      "6 módulos de aprendizaje, de la mentalidad al análisis institucional.",
      "60 días de acompañamiento.",
      "Los primeros 30 días de La Mina incluidos.",
    ],
    cta: { label: "Agendar llamada →", href: BOOKING_URL },
    nota: "Primero llenas un formulario y tenemos una llamada de 45 minutos. Ahí decides si entras.",
  },
];

const FAQ = [
  {
    q: "¿Tengo que ser miembro de La Mina para contratar FlowTitan?",
    a: "No. FlowTitan es un producto independiente y se contrata por separado. Dicho esto, quien más partido le saca es quien ya tiene base avanzada en opciones, o quien está en La Mina y me ve operar con ella cada día.",
  },
  {
    q: "¿A qué hora es el live de los lunes?",
    a: "A las 6:00 PM, hora central de Estados Unidos (la de Houston). Si vives fuera, revisa la equivalencia con tu país: cuando Estados Unidos cambia el horario, la diferencia con muchos países de Latinoamérica cambia una hora.",
  },
  {
    q: "¿Cómo funciona la consultoría?",
    a: "Llenas el formulario de reserva y tenemos una llamada de 45 minutos. En el formulario eliges si te interesa la consultoría. Cuesta $3,000 por 60 días, con 7 sesiones privadas uno a uno, 6 módulos de aprendizaje y los primeros 30 días de La Mina incluidos. FlowTitan no está incluido: se contrata aparte.",
  },
  {
    q: "¿Esto es asesoría de inversión?",
    a: "No. Es formación y herramientas de análisis. Nada de lo que se comparte constituye asesoría de inversión, y operar en bolsa conlleva riesgo de pérdida total de lo invertido.",
  },
];

export default function PreciosPage() {
  return (
    <>
      <section className="mi-section mi-prog-hero">
        <div className="mi-container">
          <span className="mi-badge">Precios</span>
          <h1 className="mi-section-title mi-prog-title">
            Tres formas de trabajar conmigo.<br />
            <span className="mi-text-gradient">Precios claros.</span>
          </h1>
          <p className="mi-prog-lead">
            Lo que cuesta cada cosa y lo que incluye. Cada una se contrata por
            separado: elige la que te sirva hoy.
          </p>
        </div>
      </section>

      <section className="mi-section">
        <div className="mi-container">
          <div className="mi-precios-grid">
            {PLANES.map((p) => (
              <article
                key={p.id}
                id={p.id}
                className={`mi-precios-card${p.destacado ? " is-destacado" : ""}`}
              >
                {p.destacado ? (
                  <span className="mi-precios-sello">Producto estrella</span>
                ) : null}
                <header>
                  <p className="mi-precios-kicker">{p.kicker}</p>
                  <h2 className="mi-precios-nombre">{p.nombre}</h2>
                  <p className="mi-precios-precio">
                    <strong>{formatUsd(p.precio)}</strong>
                    <span>USD · {p.periodo}</span>
                  </p>
                  <p className="mi-precios-resumen">{p.resumen}</p>
                  {p.paraQuien ? (
                    <p className="mi-precios-paraquien">{p.paraQuien}</p>
                  ) : null}
                </header>
                <ul className="mi-precios-incluye">
                  {p.incluye.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <div className="mi-precios-pie">
                  <a
                    href={p.cta.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={p.destacado ? "mi-btn-gold" : "mi-btn-outline"}
                  >
                    {p.cta.label}
                  </a>
                  <p className="mi-prog-tiny">{p.nota}</p>
                  {p.id === "consultoria" ? (
                    <p className="mi-prog-tiny">
                      <Link href="/programa">Ver los 6 módulos →</Link>
                    </p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mi-section mi-prog-cierre">
        <div className="mi-container mi-prog-narrow">
          <h2 className="mi-section-title">Preguntas</h2>
          <dl className="mi-prog-faq">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt>{f.q}</dt>
                <dd>{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mi-prog-legal">
            Marc Investments LLC imparte formación financiera y ofrece herramientas
            de análisis. Nada de lo aquí publicado constituye asesoría de
            inversión. Operar en bolsa conlleva riesgo y puede acabar en la
            pérdida total de lo invertido.
          </p>
        </div>
      </section>
    </>
  );
}
