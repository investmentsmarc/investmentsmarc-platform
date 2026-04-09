import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// Índices fijos — siempre presentes, ordenados por volatilidad
const INDICES = [
  { symbol: "^GSPC",  label: "S&P 500",      type: "index" as const },
  { symbol: "^NDX",   label: "Nasdaq 100",    type: "index" as const },
  { symbol: "^DJI",   label: "Dow Jones",     type: "index" as const },
  { symbol: "^RUT",   label: "Russell 2000",  type: "index" as const },
];

// Crypto fija — expandida, ordenada por volatilidad
const CRYPTO = [
  { symbol: "BTC-USD", label: "Bitcoin",  type: "crypto" as const },
  { symbol: "ETH-USD", label: "Ethereum", type: "crypto" as const },
  { symbol: "SOL-USD", label: "Solana",   type: "crypto" as const },
  { symbol: "BNB-USD", label: "BNB",      type: "crypto" as const },
];

export interface TickerItem {
  symbol:        string;
  label:         string;
  type:          "index" | "stock" | "crypto";
  price:         number;
  change:        number;
  changePercent: number;
}

/** Limpia el nombre de la empresa: quita sufijos legales y trunca */
function cleanName(raw: string | undefined | null, symbol: string): string {
  if (!raw) return symbol;
  return raw
    .replace(/,?\s*(Inc\.|Corp\.|Ltd\.|LLC\.?|Holdings?|Group|PLC\.?|Co\.).*$/i, "")
    .trim()
    .slice(0, 14);
}

export async function GET() {
  const [indicesResult, gainersResult, losersResult, cryptoResult] =
    await Promise.allSettled([
      // 1. Cotizaciones de índices
      Promise.all(
        INDICES.map((idx) =>
          yf
            .quote(idx.symbol)
            .then((q): TickerItem | null =>
              q?.regularMarketPrice != null
                ? {
                    ...idx,
                    price:         q.regularMarketPrice,
                    change:        q.regularMarketChange        ?? 0,
                    changePercent: q.regularMarketChangePercent ?? 0,
                  }
                : null
            )
            .catch(() => null)
        )
      ),
      // 2. Top gainers del día (dinámico)
      yf.screener({ scrIds: "day_gainers", count: 6 }),
      // 3. Top losers del día (dinámico)
      yf.screener({ scrIds: "day_losers",  count: 6 }),
      // 4. Cotizaciones de crypto
      Promise.all(
        CRYPTO.map((c) =>
          yf
            .quote(c.symbol)
            .then((q): TickerItem | null =>
              q?.regularMarketPrice != null
                ? {
                    ...c,
                    price:         q.regularMarketPrice,
                    change:        q.regularMarketChange        ?? 0,
                    changePercent: q.regularMarketChangePercent ?? 0,
                  }
                : null
            )
            .catch(() => null)
        )
      ),
    ]);

  // --- Índices ---
  const indices = (
    indicesResult.status === "fulfilled"
      ? (indicesResult.value.filter(Boolean) as TickerItem[])
      : []
  ).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  // --- Stocks dinámicos: merge gainers + losers, deduplicar, top 5 por volatilidad ---
  const gainers =
    gainersResult.status === "fulfilled" ? gainersResult.value.quotes ?? [] : [];
  const losers =
    losersResult.status === "fulfilled" ? losersResult.value.quotes ?? [] : [];

  const seen = new Set<string>();
  const stockItems: TickerItem[] = [];

  for (const q of [...gainers, ...losers]) {
    if (!q.symbol || seen.has(q.symbol) || q.regularMarketPrice == null) continue;
    seen.add(q.symbol);
    stockItems.push({
      symbol:        q.symbol,
      label:         cleanName((q as { shortName?: string }).shortName, q.symbol),
      type:          "stock",
      price:         q.regularMarketPrice,
      change:        (q as { regularMarketChange?: number }).regularMarketChange ?? 0,
      changePercent: (q as { regularMarketChangePercent?: number }).regularMarketChangePercent ?? 0,
    });
  }

  const topStocks = stockItems
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5);

  // --- Crypto ---
  const crypto = (
    cryptoResult.status === "fulfilled"
      ? (cryptoResult.value.filter(Boolean) as TickerItem[])
      : []
  ).sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  return NextResponse.json([...indices, ...topStocks, ...crypto], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" },
  });
}
