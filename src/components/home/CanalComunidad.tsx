"use client";

import { useEffect, useState } from "react";

import { COMUNIDAD_URL, TELEGRAM_URL } from "@/lib/site";

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

export function CanalComunidad() {
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
              en Telegram
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
                <strong className="mi-canal-handle">@MarcInvestments</strong>
                <span className="mi-canal-sub">
                  Canal oficial · Comunidad privada
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
              href={TELEGRAM_URL}
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
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.67 6.88-1.57 7.4c-.12.53-.44.66-.89.41l-2.46-1.81-1.19 1.14c-.13.13-.24.24-.49.24l.17-2.5 4.58-4.14c.2-.18-.04-.28-.31-.1l-5.67 3.57-2.44-.76c-.53-.17-.54-.53.11-.78l9.53-3.67c.44-.16.83.11.67.7Z" />
              </svg>
              Entrar al canal →
            </a>
            {/* Telegram es el canal de avisos; la comunidad es donde estan los
                cursos y la conversacion. Son dos sitios distintos y conviene
                que se vean como dos, no como uno con dos nombres. */}
            <a
              href={COMUNIDAD_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mi-btn-outline mi-canal-cta-alt"
            >
              Ver la comunidad →
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
