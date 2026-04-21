import { NextResponse } from "next/server";
import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// Curated watchlist — Mag 7 + ETFs + crypto + key high-beta tickers
const STOCKS = [
  // Magnificent 7
  { symbol: "AAPL",  label: "Apple",     type: "stock" as const },
  { symbol: "MSFT",  label: "Microsoft", type: "stock" as const },
  { symbol: "NVDA",  label: "NVIDIA",    type: "stock" as const },
  { symbol: "GOOGL", label: "Alphabet",  type: "stock" as const },
  { symbol: "AMZN",  label: "Amazon",    type: "stock" as const },
  { symbol: "META",  label: "Meta",      type: "stock" as const },
  { symbol: "TSLA",  label: "Tesla",     type: "stock" as const },
  // ETFs & index proxies
  { symbol: "SPY",   label: "S&P 500",   type: "stock" as const },
  { symbol: "QQQ",   label: "Nasdaq 100", type: "stock" as const },
  { symbol: "^VIX",  label: "VIX",       type: "index" as const },
  // High-signal individual stocks
  { symbol: "PLTR",  label: "Palantir",  type: "stock" as const },
  { symbol: "UNH",   label: "UnitedHealth", type: "stock" as const },
  { symbol: "ASML",  label: "ASML",      type: "stock" as const },
];

const CRYPTO = [
  { symbol: "BTC-USD", label: "Bitcoin",  type: "crypto" as const },
  { symbol: "ETH-USD", label: "Ethereum", type: "crypto" as const },
];

export interface TickerItem {
  symbol:        string;
  label:         string;
  type:          "index" | "stock" | "crypto";
  price:         number;
  change:        number;
  changePercent: number;
}

async function quoteOne(
  meta: { symbol: string; label: string; type: "index" | "stock" | "crypto" },
): Promise<TickerItem | null> {
  try {
    const q = await yf.quote(meta.symbol);
    if (!q?.regularMarketPrice) return null;
    return {
      ...meta,
      price:         q.regularMarketPrice,
      change:        q.regularMarketChange        ?? 0,
      changePercent: q.regularMarketChangePercent ?? 0,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const [stocksResult, cryptoResult] = await Promise.allSettled([
    Promise.all(STOCKS.map(quoteOne)),
    Promise.all(CRYPTO.map(quoteOne)),
  ]);

  const stocks =
    stocksResult.status === "fulfilled"
      ? (stocksResult.value.filter(Boolean) as TickerItem[])
      : [];
  const crypto =
    cryptoResult.status === "fulfilled"
      ? (cryptoResult.value.filter(Boolean) as TickerItem[])
      : [];

  return NextResponse.json([...stocks, ...crypto], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" },
  });
}

