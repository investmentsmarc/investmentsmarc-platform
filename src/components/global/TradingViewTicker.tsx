"use client";

import { MARKET_TICKERS } from "@/lib/site";

const tickerItems = [...MARKET_TICKERS, ...MARKET_TICKERS];

export function TradingViewTicker() {
  return (
    <div className="mi-ticker" aria-label="Resumen de mercados">
      <div className="mi-ticker-track">
        {tickerItems.map((item, index) => (
          <span key={`${item}-${index}`} className="mi-ticker-item">
            <span className="mi-ticker-dot" aria-hidden="true" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
