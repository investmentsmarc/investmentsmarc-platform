"use client";

import type {
  EarningsEvent,
  FearGreed,
  TopMover,
} from "@/lib/marketSignals";

type Props = {
  movers: TopMover[];
  earnings: EarningsEvent[];
  fearGreed: FearGreed | null;
};

function formatPrice(n: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function movingArrow(chg: number) {
  return chg > 0 ? "▲" : chg < 0 ? "▼" : "◆";
}

// Clasifica el score de Fear & Greed en 5 niveles
function fgLevel(n: number) {
  if (n >= 75) return { label: "Extreme Greed", tone: "greed-strong" };
  if (n >= 55) return { label: "Greed", tone: "greed" };
  if (n >= 45) return { label: "Neutral", tone: "neutral" };
  if (n >= 25) return { label: "Fear", tone: "fear" };
  return { label: "Extreme Fear", tone: "fear-strong" };
}

export function NewsSidePanel({ movers, earnings, fearGreed }: Props) {
  return (
    <aside className="mi-news-side" aria-label="Datos de mercado">
      {/* ─────────── FEAR & GREED ─────────── */}
      <section className="mi-side-card mi-side-fg">
        <header className="mi-side-head">
          <span className="mi-side-kicker">Market Sentiment</span>
          <span className="mi-side-source">CNN F&amp;G</span>
        </header>
        {fearGreed ? <FearGreedGauge fg={fearGreed} /> : <FearGreedSkeleton />}
      </section>

      {/* ─────────── TOP MOVERS ─────────── */}
      <section className="mi-side-card">
        <header className="mi-side-head">
          <span className="mi-side-kicker">Top Movers</span>
          <span className="mi-side-source">24h</span>
        </header>
        {movers.length === 0 ? (
          <p className="mi-side-empty">Datos temporalmente no disponibles.</p>
        ) : (
          <ul className="mi-movers">
            {movers.map((m) => {
              const up = m.changePercent >= 0;
              return (
                <li key={m.symbol} className="mi-mover">
                  <div className="mi-mover-sym">
                    <strong>{m.symbol.replace(/-USD$/, "")}</strong>
                    <span>{m.name}</span>
                  </div>
                  <div className="mi-mover-price">
                    <span className="mi-mover-px">${formatPrice(m.price)}</span>
                    <span
                      className={`mi-mover-chg ${up ? "is-up" : "is-dn"}`}
                    >
                      {movingArrow(m.changePercent)}{" "}
                      {up ? "+" : ""}
                      {m.changePercent.toFixed(2)}%
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ─────────── NEXT EARNINGS ─────────── */}
      <section className="mi-side-card">
        <header className="mi-side-head">
          <span className="mi-side-kicker">Next Earnings</span>
          <span className="mi-side-source">Upcoming</span>
        </header>
        {earnings.length === 0 ? (
          <p className="mi-side-empty">Sin reportes próximos.</p>
        ) : (
          <ul className="mi-earnings">
            {earnings.map((e) => (
              <li key={`${e.symbol}-${e.date}`} className="mi-earning">
                <div className="mi-earning-left">
                  <strong>{e.symbol}</strong>
                  <span className="mi-earning-name">{e.name}</span>
                </div>
                <div className="mi-earning-right">
                  <span className="mi-earning-days">
                    {e.daysUntil === 0
                      ? "HOY"
                      : e.daysUntil === 1
                      ? "Mañana"
                      : `en ${e.daysUntil}d`}
                  </span>
                  <span className="mi-earning-time">{e.time}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

// ─────────────────────────── Fear & Greed gauge ───────────────────────────

function FearGreedGauge({ fg }: { fg: FearGreed }) {
  const level = fgLevel(fg.now);
  // Arc: semicircle from 180° (left) to 360° (right), score 0..100 maps to angle
  const angle = (fg.now / 100) * 180 - 90; // -90 = left, +90 = right
  const needleLen = 58;
  const cx = 90;
  const cy = 82;
  const rad = (angle * Math.PI) / 180;
  const nx = cx + needleLen * Math.sin(rad);
  const ny = cy - needleLen * Math.cos(rad);

  return (
    <div className="mi-fg">
      <svg width="180" height="100" viewBox="0 0 180 100" aria-hidden="true">
        <defs>
          <linearGradient id="fg-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#c44" />
            <stop offset="0.4" stopColor="#c9a84c" />
            <stop offset="1" stopColor="#56c07a" />
          </linearGradient>
        </defs>
        {/* background arc */}
        <path
          d="M 20 82 A 70 70 0 0 1 160 82"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* colored arc */}
        <path
          d="M 20 82 A 70 70 0 0 1 160 82"
          fill="none"
          stroke="url(#fg-arc)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke="#f4d97a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r="4" fill="#f4d97a" />
      </svg>
      <div className="mi-fg-readout">
        <span className={`mi-fg-score mi-fg-${level.tone}`}>{fg.now}</span>
        <span className="mi-fg-label">{level.label}</span>
      </div>
      <ul className="mi-fg-history">
        <li>
          <span>Ayer</span>
          <b>{fg.previousClose}</b>
        </li>
        <li>
          <span>1 sem</span>
          <b>{fg.oneWeekAgo}</b>
        </li>
        <li>
          <span>1 mes</span>
          <b>{fg.oneMonthAgo}</b>
        </li>
      </ul>
    </div>
  );
}

function FearGreedSkeleton() {
  return (
    <div className="mi-fg mi-fg-skel">
      <div className="mi-fg-skel-arc" />
      <div className="mi-fg-skel-text" />
    </div>
  );
}
