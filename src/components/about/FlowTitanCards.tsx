"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { FLOWTITAN_FEATURES, FLOWTITAN_SCREENS } from "@/lib/content";

const FLOWTITAN_SCREEN_IMAGES = [
  "/images/flowtitan-1.png",
  "/images/flowtitan-2.png",
  "/images/flowtitan-3.png",
  "/images/flowtitan-4.png",
  "/images/flowtitan-5.png",
  "/images/flowtitan-6.png",
] as const;

const STATS = [
  { value: "$150K+", label: "Umbral whale" },
  { value: "15",     label: "Capas confluencia" },
  { value: "~35s",   label: "Análisis forense" },
  { value: "16",     label: "Herramientas AI" },
];

const AUTO_ADVANCE_MS = 7000;

export function FlowTitanCards() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setActiveIdx((i) => (i + 1) % FLOWTITAN_FEATURES.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  const active = FLOWTITAN_FEATURES[activeIdx];
  const activeScreenLabel = FLOWTITAN_SCREENS[activeIdx] ?? "Dashboard";
  const activeImage =
    FLOWTITAN_SCREEN_IMAGES[activeIdx] ?? FLOWTITAN_SCREEN_IMAGES[0];
  const activeNum = (activeIdx + 1).toString().padStart(2, "0");
  const totalNum = FLOWTITAN_FEATURES.length.toString().padStart(2, "0");

  return (
    <section className="mi-section mi-ft-section mi-ftx">
      <div className="mi-container">
        {/* ==== HEADER ZONE ==== */}
        <header className="mi-ftx-head mi-reveal">
          <span className="mi-badge">Herramienta insignia</span>
          <h2 className="mi-section-title">
            FlowTitan <span className="mi-text-gradient">PRO</span>
          </h2>
          <p className="mi-ftx-lead">
            La capa premium para traders que operan como instituciones: flujo
            real, estructura de opciones y contexto de mercado unificados en
            una sola interfaz —{" "}
            <span className="mi-ftx-lead-accent">sin ruido retail</span>.
          </p>

          <ul className="mi-ftx-stats" aria-label="Datos clave">
            {STATS.map((s, i) => (
              <li
                key={s.label}
                className={`mi-ftx-stat mi-reveal mi-reveal-delay-${Math.min(i + 1, 4)}`}
              >
                <span className="mi-ftx-stat-value">{s.value}</span>
                <span className="mi-ftx-stat-label">{s.label}</span>
              </li>
            ))}
          </ul>
        </header>

        {/* ==== INTERACTIVE TOUR ==== */}
        <div
          ref={stageRef}
          className="mi-ftx-tour"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* LEFT: active screenshot in terminal frame */}
          <div className="mi-ftx-stage">
            <div className="mi-ftx-frame" aria-live="polite">
              <div className="mi-ftx-frame-bar">
                <span className="mi-ftx-frame-dots">
                  <i /><i /><i className="live" />
                </span>
                <span className="mi-ftx-frame-path">
                  flowtitan · <b>{activeScreenLabel.toLowerCase().replace(/\s+/g, "-")}</b>
                </span>
                <span className="mi-ftx-frame-counter">
                  {activeNum} / {totalNum}
                </span>
              </div>

              <div className="mi-ftx-frame-screen">
                {FLOWTITAN_SCREEN_IMAGES.map((src, i) => (
                  <Image
                    key={src}
                    src={src}
                    alt={`${FLOWTITAN_SCREENS[i] ?? `Pantalla ${i + 1}`} de FlowTitan PRO`}
                    fill
                    priority={i === 0}
                    sizes="(max-width: 1024px) 100vw, 720px"
                    className={`mi-ftx-screen-img${i === activeIdx ? " is-active" : ""}`}
                  />
                ))}
                <div className="mi-ftx-screen-glow" aria-hidden="true" />
                <div className="mi-ftx-screen-scrim" aria-hidden="true" />

                <div
                  className="mi-ftx-screen-label"
                  key={`label-${activeIdx}`} /* re-mount triggers CSS animation */
                >
                  <span className="mi-ftx-screen-label-kicker">
                    {active.kicker}
                  </span>
                  <strong className="mi-ftx-screen-label-title">
                    {active.title}
                  </strong>
                </div>
              </div>

              {/* progress bars */}
              <div className="mi-ftx-progress" role="tablist">
                {FLOWTITAN_FEATURES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIdx}
                    aria-label={`Feature ${i + 1}`}
                    className={`mi-ftx-progress-bar${i === activeIdx ? " is-active" : ""}`}
                    onClick={() => setActiveIdx(i)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: feature tab list */}
          <ul className="mi-ftx-tabs" role="tablist" aria-label="Features FlowTitan PRO">
            {FLOWTITAN_FEATURES.map((f, i) => (
              <li
                key={f.title}
                className={`mi-ftx-tab${i === activeIdx ? " is-active" : ""}`}
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === activeIdx}
                  onClick={() => setActiveIdx(i)}
                >
                  <span className="mi-ftx-tab-num">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <div className="mi-ftx-tab-body">
                    <strong className="mi-ftx-tab-title">{f.title}</strong>
                    <span className="mi-ftx-tab-kicker">{f.kicker}</span>
                    <p className="mi-ftx-tab-desc">{f.description}</p>
                  </div>
                  <span className="mi-ftx-tab-arrow" aria-hidden="true">
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* ==== CTA STRIP ==== */}
        <div className="mi-ftx-cta mi-reveal mi-reveal-delay-3">
          <div className="mi-ftx-cta-copy">
            <span className="mi-ftx-cta-kicker">Listo para escalar</span>
            <p className="mi-ftx-cta-line">
              Opera como el{" "}
              <span className="mi-ftx-cta-mark">smart money</span>, no contra él.
            </p>
          </div>
          <a
            href="https://flowtitan.investmentsmarc.com"
            target="_blank"
            rel="noreferrer noopener"
            className="mi-btn-gold mi-ftx-cta-btn"
          >
            Accede a FlowTitan PRO →
          </a>
        </div>
      </div>
    </section>
  );
}
