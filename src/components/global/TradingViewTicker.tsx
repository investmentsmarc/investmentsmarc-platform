"use client";

import { startTransition, useCallback, useEffect, useState } from "react";
import type { TickerItem } from "@/types";
import { TickerLogo } from "./TickerLogo";

function formatPrice(price: number, type: TickerItem["type"]): string {
  // Crypto de precio bajo → más decimales
  if (type === "crypto" && price < 10) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 4 });
  }
  // Índices y precios altos → sin decimales si >1000
  if (price >= 10_000) {
    return price.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  if (Math.abs(change) >= 100) {
    return `${sign}${change.toFixed(1)}`;
  }
  return `${sign}${change.toFixed(2)}`;
}

function TickerCard({ item }: { item: TickerItem }) {
  const isUp   = item.changePercent >= 0;
  const color  = isUp ? "#26a69a" : "#ef5350";
  const sign   = isUp ? "+" : "";

  return (
    <span className="mi-tv-item">
      <span className="mi-tv-logo">
        <TickerLogo symbol={item.symbol} size={18} />
      </span>
      <span className="mi-tv-label">{item.label}</span>
      <span className="mi-tv-price">{formatPrice(item.price, item.type)}</span>
      <span className="mi-tv-change" style={{ color }}>
        <span className="mi-tv-abs">{formatChange(item.change)}</span>
        <span className="mi-tv-pct">({sign}{Math.abs(item.changePercent).toFixed(2)}%)</span>
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

  if (items.length === 0) return <div className="mi-ticker" aria-label="Resumen de mercados" />;

  const doubled = [...items, ...items];

  return (
    <div className="mi-ticker" aria-label="Resumen de mercados">
      <div className="mi-tv-track-wrap">
        <div className="mi-tv-track">
          {doubled.map((item, i) => (
            <TickerCard key={`${item.symbol}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
