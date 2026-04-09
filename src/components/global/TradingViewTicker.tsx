"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import type { TickerItem } from "@/types";

// Colores por tipo de activo — estilo TradingView
const TYPE_COLOR: Record<TickerItem["type"], string> = {
  index:  "#2962ff", // azul TradingView
  stock:  "#ff9800", // naranja
  crypto: "#f7c948", // dorado
};

function formatPrice(price: number, type: TickerItem["type"]): string {
  if (type === "crypto" && price < 100) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function TickerBadge({ item }: { item: TickerItem }) {
  const isUp = item.changePercent >= 0;
  const color = isUp ? "#26a69a" : "#ef5350";
  const sign  = isUp ? "+" : "";

  return (
    <span className="mi-tv-item">
      <span
        className="mi-tv-badge"
        style={{ background: TYPE_COLOR[item.type] }}
        aria-hidden="true"
      />
      <span className="mi-tv-label">{item.label}</span>
      <span className="mi-tv-price">{formatPrice(item.price, item.type)}</span>
      <span className="mi-tv-change" style={{ color }}>
        {sign}{item.change.toFixed(2)}&nbsp;
        <span className="mi-tv-pct">
          ({sign}{item.changePercent.toFixed(2)}%)
        </span>
      </span>
    </span>
  );
}

export function TradingViewTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);

  const load = useCallback(() => {
    startTransition(async () => {
      try {
        const res = await fetch("/api/market-ticker");
        if (!res.ok) return;
        const data: TickerItem[] = await res.json();
        if (Array.isArray(data) && data.length > 0) setItems(data);
      } catch {
        // mantener datos anteriores si falla la red
      }
    });
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <div className="mi-ticker" aria-label="Resumen de mercados">
      {items.length > 0 && (
        <div className="mi-tv-track-wrap">
          <div className="mi-tv-track">
            {/* duplicado para loop infinito sin salto */}
            {[...items, ...items].map((item, i) => (
              <TickerBadge key={`${item.symbol}-${i}`} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
