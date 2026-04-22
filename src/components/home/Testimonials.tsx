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
  "t-henry":
    "Antes entraba porque el precio subía. Hoy miro el tape y decido con más calma.",
  "t-yoan":
    "Las opciones ya no me paralizan: limito el riesgo y duermo sin drama.",
  "t-jessilie":
    "Si la idea sigue bien plantada, una caída ya no es el fin del mundo.",
  "t-pablo":
    "Vi el flujo como lo ves en clase y por fin encajó: hay lectura, no suerte.",
  "t-orlando":
    "Pasé de muchos trades por ansiedad a pocos con plan. Menos ruido en la cabeza.",
  "t-david":
    "Ya no solo pregunto si va a subir; miro quién mueve tamaño y dónde.",
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
            Leer los 12 testimonios completos
          </Link>
          <Link href="/curso-gratis" className="mi-btn-gold mi-home-section-cta">
            Empieza gratis
          </Link>
        </div>
      </div>
    </section>
  );
}
