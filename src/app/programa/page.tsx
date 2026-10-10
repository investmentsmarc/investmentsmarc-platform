import type { Metadata } from "next";
import Link from "next/link";

import { COURSE_SEEDS, TESTIMONIALS } from "@/lib/content";
import { BOOKING_URL, PRECIOS, formatUsd } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consultoría Marc Investments · 60 días con Marc",
  description:
    "La consultoría privada de Marc Investments: 60 días, 7 sesiones uno a uno con Marc y seis módulos que van de la mentalidad al análisis del flujo institucional. $3,000, pago único.",
  alternates: { canonical: "/programa" },
};

// El curso gratuito es la puerta de entrada real: es lo unico que alguien puede
// empezar hoy sin hablar con nadie. Los otros cinco son el programa privado.
const GRATIS = COURSE_SEEDS.find((c) => c.acceso === "gratis");

// Tres de los diez, elegidos por perfil distinto: uno que venia de perder
// siguiendo senales, uno sin base financiera, uno que ya operaba.
// 🚨 Los ids se comprobaron contra TESTIMONIALS: "t-jorge" NO existe y habria
// dejado la seccion con dos voces en vez de tres, sin error ninguno.
const VOCES = ["t-ricardo", "t-mariela", "t-fernando"];
const TESTIMONIOS = TESTIMONIALS.filter((t) => VOCES.includes(t.id)).slice(0, 3);

// FlowTitan NO entra en la consultoria: es un producto aparte (ver /precios).
// La Mina entra solo los primeros 30 dias. Confirmado por Marc el 2026-10-09.
const INCLUYE = [
  {
    t: "Seis módulos en orden",
    d: "De la mentalidad al flujo institucional. Cada uno se apoya en el anterior; no es una biblioteca de vídeos sueltos donde eliges y te pierdes.",
  },
  {
    t: "7 sesiones privadas uno a uno",
    d: "Donde se resuelve lo que un vídeo no puede: tu operación concreta, tu cuenta, tu error de ayer.",
  },
  {
    t: "60 días de acompañamiento",
    d: "El tiempo para recorrer los seis módulos con las sesiones repartidas, no de golpe.",
  },
  {
    t: "La Mina gratis 30 días",
    d: "El primer mes en la comunidad privada: el live de los lunes y el Telegram donde me ves operar cada día.",
  },
];

const NO_ES_PARA = [
  "Quien busca señales para copiar sin entender por qué. Aquí se enseña a leer el mercado, no a copiar operaciones.",
  "Quien espera rentabilidad garantizada. No existe, y quien la prometa te está mintiendo.",
  "Quien quiere resultados sin dedicarle horas. El material es denso a propósito.",
  "Quien va a operar con dinero que necesita el mes que viene.",
];

const FAQ = [
  {
    q: "¿Necesito saber de bolsa para empezar?",
    a: "No. El primer módulo es de mentalidad y el segundo explica cómo funciona el mercado de Estados Unidos desde cero. Lo que sí hace falta es tiempo para estudiar.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: `${formatUsd(PRECIOS.consultoria)}, pago único, por 60 días: 7 sesiones privadas uno a uno, los seis módulos y La Mina gratis el primer mes. FlowTitan no está incluido; se contrata aparte. Antes de pagar nada tenemos una llamada de 45 minutos.`,
  },
  {
    q: "¿Puedo probar antes?",
    a: "Sí, y es lo que recomiendo. El primer módulo, Mentalidad de Tiburón, es gratuito y completo: siete lecciones, unas dos horas y media, con un entregable al final. Si ese no te aporta, el resto tampoco.",
  },
  {
    q: "¿Esto es asesoría de inversión?",
    a: "No. Es formación. Nada de lo que se enseña constituye asesoría de inversión, y operar en bolsa conlleva riesgo de pérdida total de lo invertido.",
  },
];

export default function ProgramaPage() {
  return (
    <>
      {/* ==== HERO ==== */}
      <section className="mi-section mi-prog-hero">
        <div className="mi-container">
          <span className="mi-badge">Consultoría · 60 días</span>
          <h1 className="mi-section-title mi-prog-title">
            Aprende a leer el mercado.<br />
            <span className="mi-text-gradient">No a seguir a nadie.</span>
          </h1>
          <p className="mi-prog-lead">
            El Método Marc Investments son seis módulos que van de la mentalidad
            operativa al análisis del flujo institucional. Al final no tienes una
            lista de acciones que comprar: tienes un criterio con el que decidir
            tú, y las herramientas para sostenerlo.
          </p>
          <p className="mi-precios-precio">
            <strong>{formatUsd(PRECIOS.consultoria)}</strong>
            <span>USD · pago único · 60 días · 7 sesiones uno a uno</span>
          </p>
          <div className="mi-prog-cta">
            <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="mi-btn-gold">
              Agendar llamada →
            </a>
            {GRATIS ? (
              <Link href="/curso-gratis" className="mi-btn-outline">
                Empezar por el módulo gratuito
              </Link>
            ) : null}
          </div>
          <p className="mi-prog-tiny">
            Primero llenas un formulario y tenemos una llamada de 45 minutos.
            Antes de eso, si quieres, haz el primer módulo: es gratuito.
          </p>
        </div>
      </section>

      {/* ==== A QUIÉN LE HABLA ==== */}
      <section className="mi-section">
        <div className="mi-container mi-prog-narrow">
          <h2 className="mi-section-title">El problema no es que te falte información</h2>
          <p className="mi-page-copy">
            Hay más análisis gratis del que puedes leer en una vida. Y aun así la
            mayoría entra tarde, sale con miedo y repite. No es falta de datos: es
            que nadie te enseñó a distinguir cuáles importan.
          </p>
          <p className="mi-page-copy">
            La diferencia entre quien opera con criterio y quien opera con
            corazonadas no está en la información que recibe, sino en el marco con
            el que la ordena. Eso es lo que se construye aquí, módulo a módulo, en
            un orden que no es casual.
          </p>
        </div>
      </section>

      {/* ==== LA RUTA ==== */}
      <section className="mi-section">
        <div className="mi-container">
          <span className="mi-badge">La ruta</span>
          <h2 className="mi-section-title">Seis módulos, en este orden</h2>
          <p className="mi-page-copy mi-prog-narrow">
            Cada uno se apoya en el anterior. Empezar por el flujo institucional
            sin haber pasado por la mentalidad es la forma más rápida de perder
            dinero con información buena.
          </p>

          <ol className="mi-prog-ruta">
            {COURSE_SEEDS.map((c, i) => (
              <li key={c.id} className="mi-prog-modulo">
                <span className="mi-prog-modulo-n">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <div className="mi-prog-modulo-body">
                  <h3 className="mi-prog-modulo-title">
                    {c.title}
                    {c.acceso === "gratis" ? (
                      <span className="mi-prog-free">Gratis</span>
                    ) : null}
                  </h3>
                  <p className="mi-prog-modulo-kicker">{c.kicker}</p>
                  <p className="mi-prog-modulo-desc">{c.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ==== QUÉ INCLUYE ==== */}
      <section className="mi-section">
        <div className="mi-container">
          <span className="mi-badge">Qué incluye</span>
          <h2 className="mi-section-title">Lo que entra con la consultoría</h2>
          <div className="mi-prog-incluye">
            {INCLUYE.map((x) => (
              <div key={x.t} className="mi-prog-item">
                <h3>{x.t}</h3>
                <p>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==== VOCES ==== */}
      {TESTIMONIOS.length ? (
        <section className="mi-section">
          <div className="mi-container">
            <span className="mi-badge">Quién ha pasado por aquí</span>
            <h2 className="mi-section-title">Tres de diez</h2>
            <div className="mi-prog-voces">
              {TESTIMONIOS.map((t) => (
                <figure key={t.id} className="mi-prog-voz">
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
            <p className="mi-prog-tiny">
              <Link href="/#testimonios">Los diez testimonios completos →</Link>
            </p>
          </div>
        </section>
      ) : null}

      {/* ==== PARA QUIÉN NO ES ==== */}
      <section className="mi-section">
        <div className="mi-container mi-prog-narrow">
          <span className="mi-badge">Honestidad</span>
          <h2 className="mi-section-title">Para quién no es</h2>
          <p className="mi-page-copy">
            Prefiero decírtelo antes de que pagues que después.
          </p>
          <ul className="mi-prog-no">
            {NO_ES_PARA.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ==== FAQ ==== */}
      <section className="mi-section">
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
        </div>
      </section>

      {/* ==== CIERRE ==== */}
      <section className="mi-section mi-prog-cierre">
        <div className="mi-container mi-prog-narrow">
          <h2 className="mi-section-title">Empieza por lo gratuito</h2>
          <p className="mi-page-copy">
            Haz el primer módulo, decide si mi forma de explicar te sirve, y
            entonces hablamos. Si quieres la consultoría, agenda la llamada y te
            digo si creo que es tu momento.
          </p>
          <div className="mi-prog-cta">
            <Link href="/curso-gratis" className="mi-btn-gold">
              Empezar el módulo gratuito →
            </Link>
            <a href={BOOKING_URL} target="_blank" rel="noreferrer noopener" className="mi-btn-outline">
              Agendar llamada
            </a>
          </div>
          <p className="mi-prog-legal">
            Marc Investments LLC imparte formación financiera. Nada de lo aquí
            publicado constituye asesoría de inversión. Operar en bolsa conlleva
            riesgo y puede acabar en la pérdida total de lo invertido.
          </p>
        </div>
      </section>
    </>
  );
}
