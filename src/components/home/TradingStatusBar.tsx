"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

export function TradingStatusBar() {
  const [clock, setClock] = useState("—");
  const [latency, setLatency] = useState(14);
  const [ticks, setTicks] = useState(8214);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} LOCAL`);
      setLatency(10 + Math.floor(Math.random() * 9));
      setTicks((prev) => prev + Math.floor(Math.random() * 8) + 1);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const ticksLabel = ticks.toLocaleString("en-US").replace(/,/g, " ");

  return (
    <div className="mi-trading-status">
      <div className="mi-trading-status-group">
        <span className="mi-trading-status-item">
          <span className="mi-trading-status-dot" />
          NY Session · Live
        </span>
        <span className="mi-trading-status-item">
          Latencia <b>{latency}</b> ms
        </span>
        <span className="mi-trading-status-item">
          Ticks <b>{ticksLabel}</b>
        </span>
      </div>
      <div className="mi-trading-status-group">
        <span className="mi-trading-status-item">
          FlowTitan Engine · <b>ACTIVE</b>
        </span>
        <span className="mi-trading-status-item">{clock}</span>
      </div>
    </div>
  );
}
