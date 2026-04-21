"use client";

import { useEffect, useRef, useState } from "react";

type LogRow = { id: number; t: string; sym: string; msg: string; val: string };

const BASE_PRICE = 2624.0;

const LOG_SOURCES: Array<{
  sym: string;
  build: (price: number) => { msg: string; meta: string; val: string };
}> = [
  { sym: "XAUUSD", build: (p) => ({ msg: "Buy order filled", meta: "0.35 lots", val: p.toFixed(2) }) },
  { sym: "XAUUSD", build: (p) => ({ msg: "Sell stop hit", meta: "0.20 lots", val: p.toFixed(2) }) },
  { sym: "NQ",     build: () => ({ msg: "Liquidity sweep", meta: "above HOD", val: "20 498" }) },
  { sym: "ES",     build: () => ({ msg: "FVG mitigation", meta: "H1 imbalance", val: "5 823" }) },
  { sym: "BTCUSD", build: () => ({ msg: "Short triggered", meta: "0.08 BTC", val: "101 240" }) },
  { sym: "EURUSD", build: () => ({ msg: "Order block tap", meta: "bullish M15", val: "1.0617" }) },
  { sym: "DXY",    build: () => ({ msg: "Breaker confirmed", meta: "bearish", val: "104.76" }) },
  { sym: "XAUUSD", build: () => ({ msg: "Institutional flow", meta: "accumulation", val: "2 645.1" }) },
  { sym: "USDJPY", build: () => ({ msg: "Kill zone · London", meta: "entry armed", val: "154.12" }) },
];

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function formatPrice(p: number) {
  return p
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(",", " ");
}

export function FlowTitanTerminal() {
  const priceRef = useRef(2647.32);
  const seriesRef = useRef<number[]>(
    Array.from(
      { length: 80 },
      (_, i) => BASE_PRICE + Math.sin(i * 0.15) * 6 + Math.sin(i * 0.41) * 3 + Math.random() * 2,
    ),
  );
  const sparkRef = useRef<HTMLCanvasElement | null>(null);
  const priceElRef = useRef<HTMLSpanElement | null>(null);

  const [priceLabel, setPriceLabel] = useState(formatPrice(2647.32));
  const [flash, setFlash] = useState(false);
  const [chg, setChg] = useState(0.82);
  const [metrics, setMetrics] = useState({
    spread: 0.18,
    vol: 1.24,
    volat: 12.4,
    rsi: 58.3,
  });
  const [log, setLog] = useState<LogRow[]>([]);
  const logCounterRef = useRef(0);

  // Draw sparkline
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
      const rng = Math.max(0.01, max - min);
      const pad = 6;
      const sx = (i: number) => (i / (series.length - 1)) * w;
      const sy = (v: number) => pad + (1 - (v - min) / rng) * (h - pad * 2);

      // gridlines
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < 4; i++) {
        const yy = (h / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, yy);
        ctx.lineTo(w, yy);
        ctx.stroke();
      }

      // area
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

      // line
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

      // last dot
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
      const drift = (Math.random() - 0.48) * 1.8;
      const nextPrice = Math.max(2580, Math.min(2720, priceRef.current + drift));
      priceRef.current = nextPrice;
      const s = seriesRef.current;
      s.push(nextPrice);
      if (s.length > 80) s.shift();
      setPriceLabel(formatPrice(nextPrice));
      setChg(((nextPrice - BASE_PRICE) / BASE_PRICE) * 100);
      setFlash(true);
      window.setTimeout(() => setFlash(false), 180);
      draw();
    }, 620);

    return () => {
      ro.disconnect();
      window.clearInterval(intId);
    };
  }, []);

  // Metric fluctuation
  useEffect(() => {
    const id = window.setInterval(() => {
      setMetrics({
        spread: 0.1 + Math.random() * 0.25,
        vol: 0.9 + Math.random() * 0.7,
        volat: 10 + Math.random() * 8,
        rsi: 40 + Math.random() * 30,
      });
    }, 1400);
    return () => window.clearInterval(id);
  }, []);

  // Rolling log
  useEffect(() => {
    const push = () => {
      const now = new Date();
      const stamp = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;
      const src = LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)];
      const built = src.build(priceRef.current);
      logCounterRef.current += 1;
      const id = logCounterRef.current;
      const row: LogRow = {
        id,
        t: stamp,
        sym: src.sym,
        msg: `${built.msg} · ${built.meta}`,
        val: built.val,
      };
      setLog((prev) => [row, ...prev].slice(0, 7));
    };

    for (let i = 0; i < 5; i++) push();
    const id = window.setInterval(push, 2100);
    return () => window.clearInterval(id);
  }, []);

  const chgClass = chg >= 0 ? "mi-ft-chg" : "mi-ft-chg mi-ft-chg-dn";

  return (
    <aside className="mi-flowtitan" aria-label="FlowTitan live engine">
      <header className="mi-ft-head">
        <div className="mi-ft-title">
          <b>FLOWTITAN</b> · LIVE ENGINE
        </div>
        <div className="mi-ft-dots">
          <span />
          <span />
          <span className="is-live" />
        </div>
      </header>

      <div className="mi-ft-price-row">
        <span className="mi-ft-sym">XAU / USD</span>
        <span
          ref={priceElRef}
          className={`mi-ft-price${flash ? " is-flash" : ""}`}
        >
          {priceLabel}
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
          <div className="mi-ft-metric-val">{metrics.spread.toFixed(2)}</div>
        </div>
        <div className="mi-ft-metric">
          <label>Volumen</label>
          <div className="mi-ft-metric-val mi-ft-gold">{metrics.vol.toFixed(2)}M</div>
          <div className="mi-ft-bar">
            <i style={{ width: `${Math.min(100, metrics.vol * 58)}%` }} />
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
    </aside>
  );
}
