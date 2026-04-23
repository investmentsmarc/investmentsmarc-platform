"use client";

import Link from "next/link";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { HOME_TESTIMONIALS } from "@/lib/site";

const ROTATION_MS = 6_500;

/** Voces cortas para la home; /testimonios conserva las citas completas. */
const HOME_TEASER: Record<string, string> = {
  "t-ricardo":
    "Llegué con 18k perdidos siguiendo señales de Telegram. La primera sesión leí un dark pool print y el mercado dejó de ser ruido. Llevo 9 meses verde.",
  "t-daniela":
    "Había pagado cursos de 3k que solo enseñaban a dibujar rayitas. Con GEX entendí cómo los market makers mueven el precio. Pasé de 42k a 58k en cinco meses.",
  "t-andres":
    "14k perdidos apostando cada earnings. El tape reading —order flow, sweeps, bloques— me dio data real. Mi mejor mes fue +11%, el peor −2%.",
  "t-mariela":
    "8 mil dólares y cero idea de finanzas. Marc me enseñó a leer un 10-K y vender covered calls. Mi cuenta pasó de 8k a 14k con tres posiciones que entiendo.",
  "t-fernando":
    "Enseño economía y aun así no leía el tape. Aprender GEX y posicionamiento de opciones destapó un spread en Meta que funcionó tal cual lo planeamos.",
  "t-luis":
    "Compraba lo que decía la tele. Aprender a ver dark pools y unusual options antes de la noticia me subió la cuenta un 38% en 10 meses.",
  "t-camila":
    "Diploma en finanzas y perdí 40% en seis meses. El tape reading me mostró cómo se construye una posición institucional. Llevo cuatro meses positiva.",
  "t-patricio":
    "Mi problema no era analizar, era gestionar. Hoy cada trade va con plan escrito y strikes con gamma. La cuenta creció 24% en seis meses.",
  "t-yolanda":
    "Turnos de 12 horas, sin pantallas. Swing largo y covered calls mensuales me generaron $4,200 en primas el año pasado. Ingreso extra real.",
  "t-jose":
    "Entraba por corazonadas. Cruzar flujo de opciones, dark pool print y técnico me mostró que esto se lee, no se adivina. Ahora entro por tesis.",
};

const ROTATOR_IDS = Object.keys(HOME_TEASER);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    startTransition(() => setReduced(mq.matches));
    const fn = () => startTransition(() => setReduced(mq.matches));
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  return reduced;
}

export function Testimonials() {
  const reducedMotion = usePrefersReducedMotion();
  const items = ROTATOR_IDS.map((id) => {
    const t = HOME_TESTIMONIALS.find((x) => x.id === id)!;
    return {
      ...t,
      teaser: HOME_TEASER[id] ?? t.quote.slice(0, 140),
    };
  });

  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setIdx((i) => (i + 1) % ROTATOR_IDS.length);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    const start = () => {
      stop();
      if (paused || (typeof document !== "undefined" && document.hidden)) return;
      timerRef.current = setInterval(tick, ROTATION_MS);
    };

    start();

    const onVis = () => {
      stop();
      if (!document.hidden) start();
    };

    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [reducedMotion, paused, tick]);

  const active = items[idx] ?? items[0];
  const tapeFragments = items.map((t) => {
    const first = t.name.split(/\s+/)[0] ?? t.name;
    return `${first} — ${t.teaser}`;
  });

  return (
    <section className="mi-section mi-tstm-section mi-home-band" id="testimonios">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <span className="mi-badge">Testimonios</span>
          <h2 className="mi-section-title">
            Gente real, <span className="mi-text-gradient">cambios reales</span>
          </h2>
          <p className="mi-home-section-copy-sub mi-tstm-intro">
            Un vistazo breve aquí; las historias largas están en la página de
            testimonios.
          </p>
        </div>
      </div>

      {!reducedMotion ? (
        <div className="mi-tstm-tape-outer" aria-hidden="true">
          <div className="mi-tstm-tape-mask">
            <div className="mi-tstm-tape-track">
              <div className="mi-tstm-tape-inner">
                {tapeFragments.map((frag, i) => (
                  <span key={`a-${i}`} className="mi-tstm-tape-chip">
                    {frag}
                  </span>
                ))}
              </div>
              <div className="mi-tstm-tape-inner" aria-hidden="true">
                {tapeFragments.map((frag, i) => (
                  <span key={`b-${i}`} className="mi-tstm-tape-chip">
                    {frag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mi-container">
        {reducedMotion ? (
          <ul className="mi-tstm-static-grid mi-reveal">
            {items.slice(0, 3).map((t) => (
              <li key={t.id} className="mi-tstm-static-card">
                <p className="mi-tstm-teaser">{t.teaser}</p>
                <footer className="mi-tstm-byline-compact">
                  <strong>{t.name}</strong>
                  {t.role ? <span>{t.role}</span> : null}
                </footer>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="mi-tstm-rotator mi-reveal"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <blockquote className="mi-tstm-quote-block" key={active.id}>
              <p className="mi-tstm-teaser">{active.teaser}</p>
              <footer className="mi-tstm-byline-compact">
                <strong>{active.name}</strong>
                {active.role ? <span>{active.role}</span> : null}
              </footer>
            </blockquote>

            <nav className="mi-tstm-dots" aria-label="Elegir testimonio">
              {items.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  className={`mi-tstm-dot${i === idx ? " is-active" : ""}`}
                  aria-current={i === idx ? "true" : undefined}
                  aria-label={`${t.name}: ${t.teaser.slice(0, 72)}`}
                  onClick={() => setIdx(i)}
                />
              ))}
            </nav>
          </div>
        )}
      </div>

      <div className="mi-container">
        <div className="mi-tstm-footer mi-reveal">
          <Link href="/testimonios" className="mi-btn-ghost mi-tstm-more">
            Leer los 10 testimonios completos
          </Link>
          <Link href="/curso-gratis" className="mi-btn-gold mi-home-section-cta">
            Empieza gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
