"use client";

import { useEffect, useState } from "react";

import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/lib/site";

type Msg = {
  id: number;
  time: string;     // 22:34
  badge?: "PIN" | "ALERT" | "FLOW";
  tag?: string;     // $NVDA, etc.
  text: string;
};

const MESSAGES: Msg[] = [
  {
    id: 1,
    time: "22:34",
    badge: "PIN",
    tag: "NVDA",
    text: "🐋 Whale sweep $4.2M detectado. Bull call spreads 950/990 Jun. Agresivo — el flujo viene de dark pool.",
  },
  {
    id: 2,
    time: "22:18",
    badge: "FLOW",
    tag: "MSFT",
    text: "Cerrado @ +7.2%. El tamaño que entró en el open ya salió. Tomamos ganancias aquí.",
  },
  {
    id: 3,
    time: "21:52",
    badge: "ALERT",
    text: "⚡ Kill zone NY abre en 8 min. Watchlist del día: $SPY $QQQ $TSLA $META. Revisen niveles pre-mercado.",
  },
  {
    id: 4,
    time: "20:41",
    tag: "GEX",
    text: "Flip point SPX en 5,820. Debajo es imán bajista, arriba respiro. La jornada depende de ahí.",
  },
];

const BENEFITS = [
  "Alertas de whale flow en tiempo real",
  "Kill zones y setups antes del NY open",
  "Análisis macro dentro del día",
  "Acceso directo al equipo y a Marc",
];

export function CanalWhatsApp() {
  const [isTyping, setIsTyping] = useState(true);

  // 🚨 Aqui vivia un contador de miembros que arrancaba en 12.847 y se
  // autoincrementaba cada 4,2 s "para dar sensacion de comunidad viva". Era un
  // numero inventado presentado como un hecho, en la web de un negocio
  // financiero. Se retiro el 2026-09-05. Si hay una cifra real, vuelve aqui —
  // pero medida, no simulada.
  useEffect(() => {
    const id = window.setInterval(() => {
      // marcador de posicion: sin efecto, se conserva el ciclo del "escribiendo"
    }, 4200);
    return () => window.clearInterval(id);
  }, []);

  // El "Marc está escribiendo..." parpadea — mostrar/ocultar cada ~7s para realismo
  useEffect(() => {
    const id = window.setInterval(() => {
      setIsTyping((prev) => !prev);
    }, 7000);
    return () => window.clearInterval(id);
  }, []);

  // El numero se muestra formateado para que se lea como un telefono, y el
  // enlace lleva el saludo prellenado: quien pulsa llega con el mensaje escrito.
  const telefonoLegible = `+1 ${WHATSAPP_NUMBER.slice(1, 4)} ${WHATSAPP_NUMBER.slice(4, 7)} ${WHATSAPP_NUMBER.slice(7)}`;
  const enlaceWhatsApp = `${WHATSAPP_URL}?text=${encodeURIComponent("Hola Marc, vengo de la web y quiero entrar a la comunidad.")}`;

  return (
    <section className="mi-section mi-canal-section mi-home-band">
      <div className="mi-container">
        <header className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <div className="mi-home-section-copy">
            <span className="mi-badge">Comunidad privada</span>
            <h2 className="mi-section-title">
              Sintoniza el{" "}
              <span className="mi-text-gradient">Wire</span>
            </h2>
            <p className="mi-home-section-copy-sub">
              Alertas, análisis y whale sweeps cuando los ves por primera vez — directo
              a tu WhatsApp
            </p>
          </div>
        </header>

        <div className="mi-canal-stage">
          {/* === LEFT: live dispatch terminal === */}
          <article className="mi-canal-channel mi-reveal mi-reveal-scale">
            <header className="mi-canal-head">
              <div className="mi-canal-avatar" aria-hidden="true">
                <span>M</span>
              </div>
              <div className="mi-canal-head-meta">
                <strong className="mi-canal-handle">{telefonoLegible}</strong>
                <span className="mi-canal-sub">
                  WhatsApp Business · Comunidad privada
                </span>
              </div>
              <span className="mi-canal-live" aria-hidden="true">
                <span className="mi-canal-live-dot" />
                LIVE
              </span>
            </header>

            <div className="mi-canal-messages">
              {MESSAGES.map((m) => (
                <article
                  key={m.id}
                  className={`mi-canal-msg${
                    m.badge === "PIN" ? " is-pinned" : ""
                  }`}
                >
                  {m.badge ? (
                    <span
                      className={`mi-canal-msg-badge mi-canal-badge-${m.badge.toLowerCase()}`}
                    >
                      {m.badge === "PIN" ? "📌 " : ""}
                      {m.badge}
                    </span>
                  ) : null}
                  <div className="mi-canal-msg-body">
                    {m.tag ? <span className="mi-canal-msg-tag">${m.tag}</span> : null}
                    <p>{m.text}</p>
                  </div>
                  <span className="mi-canal-msg-time">{m.time}</span>
                </article>
              ))}

              <div
                className="mi-canal-typing"
                aria-live="polite"
                data-visible={isTyping ? "true" : "false"}
              >
                <span className="mi-canal-typing-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <em>Marc está escribiendo…</em>
              </div>
            </div>

            <footer className="mi-canal-foot">
              <span className="mi-canal-foot-meta">
                <span className="mi-canal-foot-dot" />
                Última transmisión hace 4 min
              </span>
              <span className="mi-canal-foot-signal" aria-hidden="true">
                ·  ·  ·
              </span>
            </footer>
          </article>

          {/* === RIGHT: benefits + CTA === */}
          <aside className="mi-canal-pitch mi-reveal mi-reveal-right">
            <span className="mi-canal-kicker">Gratis · Sin spam</span>
            <h3 className="mi-canal-pitch-title">
              Solo <span className="mi-text-gradient">señal institucional</span>.
              Cero ruido.
            </h3>
            <p className="mi-canal-pitch-desc">
              La cinta del smart money en tu bolsillo: lo que captura la mesa
              institucional de FlowTitan, se envía al canal segundos después.
            </p>

            <ul className="mi-canal-benefits">
              {BENEFITS.map((b, i) => (
                <li key={b}>
                  <span className="mi-canal-benefit-num">
                    0{i + 1}
                  </span>
                  <span className="mi-canal-benefit-text">{b}</span>
                </li>
              ))}
            </ul>

            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noreferrer noopener"
              className="mi-btn-gold mi-canal-cta"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.470 0 1.45 1.06 2.86 1.21 3.05.15.2 2.09 3.2 5.07 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35Z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.25-8.23a8.23 8.23 0 0 1 0 16.46Z"/>
              </svg>
              Escríbeme por WhatsApp →
            </a>
            <p className="mi-canal-tiny">
              Escribes, y te contesta Marc. No es un bot.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
