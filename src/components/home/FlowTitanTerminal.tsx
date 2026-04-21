"use client";

import { useEffect, useRef, useState } from "react";

import { TradingStatusBar } from "@/components/home/TradingStatusBar";

type LogRow = { id: number; t: string; sym: string; msg: string; val: string };

type Ticker = {
  symbol: string;
  name: string;
  base: number;
  range: [number, number];
  drift: number;
  spreadBps: number; // typical spread in basis points
  volRange: [number, number]; // volume millions
};

// S&P 500 — Magnificent 7 (mayor capitalización)
const TICKERS: Ticker[] = [
  { symbol: "AAPL",  name: "Apple Inc.",      base: 262.4,  range: [240, 285],  drift: 0.45, spreadBps: 1.2, volRange: [38, 75]  },
  { symbol: "MSFT",  name: "Microsoft",       base: 430.8,  range: [400, 460],  drift: 0.85, spreadBps: 1.4, volRange: [18, 42]  },
  { symbol: "NVDA",  name: "NVIDIA Corp.",    base: 146.2,  range: [130, 165],  drift: 0.40, spreadBps: 2.2, volRange: [190, 320] },
  { symbol: "GOOGL", name: "Alphabet Inc.",   base: 195.6,  range: [180, 215],  drift: 0.38, spreadBps: 1.6, volRange: [22, 52]  },
  { symbol: "AMZN",  name: "Amazon.com",      base: 231.5,  range: [215, 250],  drift: 0.48, spreadBps: 1.8, volRange: [34, 68]  },
  { symbol: "META",  name: "Meta Platforms",  base: 624.9,  range: [590, 660],  drift: 1.15, spreadBps: 1.5, volRange: [14, 32]  },
  { symbol: "TSLA",  name: "Tesla Inc.",      base: 382.4,  range: [340, 420],  drift: 1.40, spreadBps: 2.4, volRange: [72, 140] },
];

const LOG_TEMPLATES: Array<(sym: string, px: number) => { msg: string; meta: string; val: string }> = [
  (_, p) => ({ msg: "Buy order filled",    meta: "0.35 lots", val: p.toFixed(2) }),
  (_, p) => ({ msg: "Sell stop hit",        meta: "0.20 lots", val: p.toFixed(2) }),
  (_, _p) => ({ msg: "Liquidity sweep",      meta: "above HOD", val: "—" }),
  (_, _p) => ({ msg: "FVG mitigation",       meta: "H1 imbalance", val: "—" }),
  (_, p) => ({ msg: "Order block tap",      meta: "bullish M15", val: p.toFixed(2) }),
  (_, _p) => ({ msg: "Breaker confirmed",    meta: "bearish structure", val: "—" }),
  (_, _p) => ({ msg: "Institutional flow",   meta: "accumulation", val: "—" }),
  (_, _p) => ({ msg: "Kill zone · London",   meta: "entry armed", val: "—" }),
  (_, p) => ({ msg: "Market order routed",  meta: "NYSE ARCA",    val: p.toFixed(2) }),
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatPrice(p: number) {
  return p
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(",", " ");
}

function buildSeries(base: number): number[] {
  return Array.from({ length: 80 }, (_, i) => {
    const macro = Math.sin(i * 0.14) * (base * 0.012);
    const micro = Math.sin(i * 0.41) * (base * 0.006);
    const noise = (Math.random() - 0.5) * (base * 0.005);
    return base + macro + micro + noise;
  });
}

function randVol(range: [number, number]) {
  return range[0] + Math.random() * (range[1] - range[0]);
}

export function FlowTitanTerminal() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);

  const active = TICKERS[activeIdx];

  // Mutable refs — avoid re-renders on tick
  const priceRef = useRef(active.base);
  const seriesRef = useRef<number[]>(buildSeries(active.base));
  const baselineRef = useRef(active.base); // for % chg
  const sparkRef = useRef<HTMLCanvasElement | null>(null);

  const [priceLabel, setPriceLabel] = useState(formatPrice(active.base));
  const [flash, setFlash] = useState(false);
  const [chg, setChg] = useState(0);
  const [metrics, setMetrics] = useState({
    spread: 0.18,
    vol: 42.1,
    volat: 14.4,
    rsi: 54.3,
  });
  const [log, setLog] = useState<LogRow[]>([]);
  const logCounterRef = useRef(0);

  // === TICKER CYCLE: every 9s swap to next Mag-7 with enter/exit animation ===
  useEffect(() => {
    const id = window.setInterval(() => {
      setIsSwapping(true);
      window.setTimeout(() => {
        setActiveIdx((i) => (i + 1) % TICKERS.length);
      }, 360);
    }, 10000);
    return () => window.clearInterval(id);
  }, []);

  // When active ticker changes, reset price/series/metrics and finish the swap animation
  useEffect(() => {
    priceRef.current = active.base;
    baselineRef.current = active.base;
    seriesRef.current = buildSeries(active.base);
    setPriceLabel(formatPrice(active.base));
    setChg(0);
    setMetrics({
      spread: (active.base * active.spreadBps) / 10000,
      vol: randVol(active.volRange),
      volat: 8 + Math.random() * 14,
      rsi: 38 + Math.random() * 32,
    });
    const doneId = window.setTimeout(() => setIsSwapping(false), 40);
    return () => window.clearTimeout(doneId);
  }, [active]);

  // === PRICE TICK + SPARKLINE DRAW ===
  useEffect(() => {
    const cvs = sparkRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const rect = cvs.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      cvs.width = w * dpr;
      cvs.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const series = seriesRef.current;
      if (series.length === 0) return;
      const min = Math.min(...series);
      const max = Math.max(...series);
      const rng = Math.max(0.001, max - min);
      const pad = 6;
      const sx = (i: number) => (i / (series.length - 1)) * w;
      const sy = (v: number) => pad + (1 - (v - min) / rng) * (h - pad * 2);

      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const yy = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(w, yy);
        ctx.stroke();
      }

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, "rgba(216,182,90,0.24)");
      grad.addColorStop(1, "rgba(216,182,90,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(0, h);
      series.forEach((v, i) => ctx.lineTo(sx(i), sy(v)));
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      ctx.shadowColor = "rgba(244,217,122,0.55)";
      ctx.shadowBlur = 10;
      ctx.strokeStyle = "#f4d97a";
      ctx.lineWidth = 1.6;
      ctx.lineJoin = "round";
      ctx.beginPath();
      series.forEach((v, i) =>
        i === 0 ? ctx.moveTo(sx(i), sy(v)) : ctx.lineTo(sx(i), sy(v)),
      );
      ctx.stroke();
      ctx.shadowBlur = 0;

      const lx = sx(series.length - 1);
      const ly = sy(series[series.length - 1]);
      ctx.fillStyle = "#f4d97a";
      ctx.beginPath();
      ctx.arc(lx, ly, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(244,217,122,0.25)";
      ctx.beginPath();
      ctx.arc(lx, ly, 8, 0, Math.PI * 2);
      ctx.fill();
    };

    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(cvs);

    const intId = window.setInterval(() => {
      const drift = (Math.random() - 0.48) * active.drift;
      const nextPrice = Math.max(
        active.range[0],
        Math.min(active.range[1], priceRef.current + drift),
      );
      priceRef.current = nextPrice;
      const s = seriesRef.current;
      s.push(nextPrice);
      if (s.length > 80) s.shift();
      setPriceLabel(formatPrice(nextPrice));
      setChg(((nextPrice - baselineRef.current) / baselineRef.current) * 100);
      setFlash(true);
      window.setTimeout(() => setFlash(false), 180);
      draw();
    }, 620);

    return () => {
      ro.disconnect();
      window.clearInterval(intId);
    };
  }, [active]);

  // === METRIC FLUCTUATION ===
  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics({
        spread: (active.base * active.spreadBps) / 10000 + (Math.random() - 0.5) * 0.02,
        vol: randVol(active.volRange),
        volat: 8 + Math.random() * 14,
        rsi: 38 + Math.random() * 32,
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, [active]);

  // === ROLLING LOG (biased toward the active ticker) ===
  useEffect(() => {
    const push = () => {
      const now = new Date();
      const stamp = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
      const usesActive = Math.random() < 0.7;
      const sym = usesActive
        ? active.symbol
        : TICKERS[Math.floor(Math.random() * TICKERS.length)].symbol;
      const template = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
      const built = template(sym, priceRef.current);
      logCounterRef.current += 1;
      const id = logCounterRef.current;
      const row: LogRow = {
        id,
        t: stamp,
        sym,
        msg: `${built.msg} · ${built.meta}`,
        val: built.val,
      };
      setLog((prev) => [row, ...prev].slice(0, 7));
    };
    push();
    const id = window.setInterval(push, 2100);
    return () => window.clearInterval(id);
  }, [active]);

  const chgClass = chg >= 0 ? "mi-ft-chg" : "mi-ft-chg mi-ft-chg-dn";
  const volUnit = active.volRange[1] > 100 ? "M" : "M";
  const volPct = Math.min(100, (metrics.vol / active.volRange[1]) * 100);

  return (
    <aside className="mi-flowtitan" aria-label="FlowTitan live engine">
      <header className="mi-ft-head">
        <div className="mi-ft-title">
          <b>FLOWTITAN</b> · LIVE ENGINE · S&amp;P 500 · MAG 7
        </div>
        <div className="mi-ft-dots">
          <span />
          <span />
          <span className="is-live" />
        </div>
      </header>

      <div className={`mi-ft-deck${isSwapping ? " is-swapping" : ""}`}>
        <div className="mi-ft-price-row">
          <div className="mi-ft-sym-wrap">
            <span className="mi-ft-sym">{active.symbol}</span>
            <span className="mi-ft-sym-name">{active.name}</span>
          </div>
          <span className={`mi-ft-price${flash ? " is-flash" : ""}`}>
            ${priceLabel}
          </span>
          <span className={chgClass}>
            {chg >= 0 ? "+" : ""}
            {chg.toFixed(2)}%
          </span>
        </div>

        <canvas ref={sparkRef} className="mi-ft-spark" />

        <div className="mi-ft-metrics">
          <div className="mi-ft-metric">
            <label>Spread</label>
            <div className="mi-ft-metric-val">${metrics.spread.toFixed(2)}</div>
          </div>
          <div className="mi-ft-metric">
            <label>Volumen</label>
            <div className="mi-ft-metric-val mi-ft-gold">
              {metrics.vol.toFixed(1)}
              {volUnit}
            </div>
            <div className="mi-ft-bar">
              <i style={{ width: `${volPct}%` }} />
            </div>
          </div>
          <div className="mi-ft-metric">
            <label>Volatilidad</label>
            <div className="mi-ft-metric-val">{metrics.volat.toFixed(1)}</div>
            <div className="mi-ft-bar">
              <i style={{ width: `${Math.min(100, metrics.volat * 5)}%` }} />
            </div>
          </div>
          <div className="mi-ft-metric">
            <label>RSI 14</label>
            <div className="mi-ft-metric-val mi-ft-gold">{metrics.rsi.toFixed(1)}</div>
            <div className="mi-ft-bar">
              <i style={{ width: `${Math.min(100, metrics.rsi)}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="mi-ft-pager" role="tablist" aria-label="Ticker activo">
        {TICKERS.map((t, i) => (
          <button
            key={t.symbol}
            type="button"
            role="tab"
            aria-selected={i === activeIdx}
            aria-label={t.symbol}
            className={`mi-ft-pager-dot${i === activeIdx ? " is-active" : ""}`}
            onClick={() => {
              if (i === activeIdx) return;
              setIsSwapping(true);
              window.setTimeout(() => setActiveIdx(i), 360);
            }}
          />
        ))}
      </div>

      <div className="mi-ft-log">
        {log.map((row) => (
          <div key={row.id} className="mi-ft-log-row">
            <span className="mi-ft-log-t">{row.t}</span>
            <span className="mi-ft-log-s">{row.sym}</span>
            <span className="mi-ft-log-m">{row.msg}</span>
            <span className="mi-ft-log-v">{row.val}</span>
          </div>
        ))}
      </div>

      <TradingStatusBar />
    </aside>
  );
}
