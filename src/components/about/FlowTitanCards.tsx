"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { FLOWTITAN_FEATURES, FLOWTITAN_SCREENS } from "@/lib/content";

// Capturas tomadas del sistema en produccion el 2026-09-05, no maquetas.
// 🚨 Son CINCO, no seis: la sexta iba a ser TITAN y salio con una conversacion
// real de Marc —su portafolio y una correccion de error— asi que no se publica.
// Hace falta capturarla con una sesion sin historial.
// Cuatro de las cinco son clips cortos grabados del sistema real, con clics de
// verdad: se abre un vencimiento, se cambia un filtro, se alterna una vista. El
// PNG hace de poster, asi que quien no reproduce video —o pidio menos
// animacion— sigue viendo exactamente lo que veia antes.
const PANTALLAS = [
  { src: "/images/ft-dashboard.png",     video: null },
  { src: "/images/ft-tape-scanner.png",  video: "/video/ft-tape-scanner.mp4" },
  { src: "/images/ft-option-chain.png",  video: "/video/ft-option-chain.mp4" },
  { src: "/images/ft-gex.png",           video: "/video/ft-gex.mp4" },
  { src: "/images/ft-advance-chart.png", video: "/video/ft-advance-chart.mp4" },
] as const;

// 🚨 Las features son SEIS y las capturas CINCO, asi que emparejarlas por indice
// mostraba la pantalla equivocada: la tarjeta "Confluence Engine" salia junto a la
// Option Chain. Aqui cada feature declara que pantalla la ilustra. Se repite una
// captura cuando dos features viven en la misma pantalla — eso es cierto y se ve
// bien; lo que no puede pasar es que la imagen contradiga al texto.
//   0 Whales & Dark Pool   -> el tape, que es donde se ven
//   1 GEX Engine           -> el perfil de gamma
//   2 Confluence 15 capas  -> la cadena, una de sus capas de entrada
//   3 TITAN AI             -> el dashboard, desde donde se invoca
//   4 Tape Scanner         -> el tape
//   5 Contexto en vivo     -> el chart
const PANTALLA_DE_FEATURE = [1, 3, 2, 0, 1, 4] as const;

const STATS = [
  { value: "$150K+", label: "Umbral whale" },
  { value: "15",     label: "Capas confluencia" },
  { value: "~35s",   label: "Análisis forense" },
  { value: "46",     label: "Herramientas AI" },
];

// Subido de 7 s: los clips duran entre 7,5 y 11,8 s y con la cadencia anterior
// se cortaban antes de llegar al clic que justifican.
const AUTO_ADVANCE_MS = 10000;

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
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const marco = useRef<HTMLDivElement | null>(null);
  const [enPantalla, setEnPantalla] = useState(true);
  const pantallaIdx = PANTALLA_DE_FEATURE[activeIdx] ?? 0;
  const activeScreenLabel = FLOWTITAN_SCREENS[pantallaIdx] ?? "Dashboard";

  // Solo se mueve el clip visible: cuatro videos a la vez calientan el portatil
  // de quien lee la pagina. Y si el sistema pide menos animacion, ninguno
  // arranca — el poster ya cuenta lo mismo.
  useEffect(() => {
    const marcoEl = marco.current;
    // Sin observador se queda en visible, que es el valor inicial: mejor un clip
    // reproduciendo de mas que un marco congelado.
    if (!marcoEl || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entradas) => setEnPantalla(entradas[0]?.isIntersecting ?? false),
      { threshold: 0.25 },
    );
    obs.observe(marcoEl);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    videos.current.forEach((v, i) => {
      if (v && i !== pantallaIdx) v.pause();
    });

    const reducido =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const activo = videos.current[pantallaIdx];
    if (!activo || reducido || !enPantalla) return;

    // 🚨 Chrome rechaza reproducir un video que considera invisible y devuelve
    // "AbortError: video-only background media was paused to save power". Los
    // clips se apilan y el activo entra con una transicion de opacidad de 0,7 s,
    // asi que durante ese rato sigue contando como invisible: pedir play al
    // vuelo —o incluso dos fotogramas despues, ya probado— falla en silencio,
    // porque el .catch() se traga el error. Hay que esperar a que la transicion
    // termine, y reintentar por si el navegador aun no lo daba por visible.
    let cancelado = false;
    const temporizadores: number[] = [];
    const arrancar = () => {
      if (cancelado || !activo.paused) return;
      activo.currentTime = 0;
      void activo.play().catch(() => {});
    };
    const alTerminar = () => arrancar();
    activo.addEventListener("transitionend", alTerminar);
    temporizadores.push(window.setTimeout(arrancar, 780));
    temporizadores.push(window.setTimeout(arrancar, 1500));
    return () => {
      cancelado = true;
      activo.removeEventListener("transitionend", alTerminar);
      temporizadores.forEach(window.clearTimeout);
    };
  }, [pantallaIdx, enPantalla]);

  const activeNum = (activeIdx + 1).toString().padStart(2, "0");
  const totalNum = FLOWTITAN_FEATURES.length.toString().padStart(2, "0");

  return (
    // El `id` existe porque la seccion FlowTitan de la portada enlaza aqui
    // (`/about-us#flowtitan`). Sin el, ese enlace aterriza arriba del todo.
    <section className="mi-section mi-ft-section mi-ftx" id="flowtitan">
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

              <div className="mi-ftx-frame-screen" ref={marco}>
                {PANTALLAS.map((p, i) => {
                  const clase = `mi-ftx-screen-img${i === pantallaIdx ? " is-active" : ""}`;
                  const nombre = `${FLOWTITAN_SCREENS[i] ?? `Pantalla ${i + 1}`} de FlowTitan PRO`;
                  return p.video ? (
                    <video
                      key={p.video}
                      ref={(el) => {
                        videos.current[i] = el;
                      }}
                      className={clase}
                      poster={p.src}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label={nombre}
                    >
                      <source src={p.video} type="video/mp4" />
                    </video>
                  ) : (
                    <Image
                      key={p.src}
                      src={p.src}
                      alt={nombre}
                      fill
                      priority={i === 0}
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className={clase}
                    />
                  );
                })}
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
