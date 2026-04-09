import { NextResponse } from "next/server";

// Símbolos de índices principales — se ordenan por volatilidad (mayor % cambio absoluto primero)
const INDICES: TickerSymbolConfig[] = [
  { symbol: "OANDA:SPX500USD", label: "S&P 500",    type: "index" },
  { symbol: "OANDA:NAS100USD", label: "Nasdaq 100",  type: "index" },
  { symbol: "OANDA:US30USD",   label: "Dow Jones",   type: "index" },
  { symbol: "OANDA:UK100GBP",  label: "FTSE 100",    type: "index" },
];

// Símbolos fijos — siempre al final, en este orden
const FIXED: TickerSymbolConfig[] = [
  { symbol: "COIN",             label: "Coinbase", type: "stock"  },
  { symbol: "BINANCE:BNBUSDT",  label: "BNB",      type: "crypto" },
];

interface TickerSymbolConfig {
  symbol: string;
  label:  string;
  type:   "index" | "stock" | "crypto";
}

export interface TickerItem extends TickerSymbolConfig {
  price:         number;
  change:        number;
  changePercent: number;
}

interface FinnhubQuote {
  c:  number; // current price
  d:  number; // change
  dp: number; // change percent
  h:  number; // high
  l:  number; // low
  o:  number; // open
  pc: number; // prev close
}

async function fetchQuote(symbol: string): Promise<FinnhubQuote | null> {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${key}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;

    const data: FinnhubQuote = await res.json();
    // Finnhub devuelve c=0 para símbolos no disponibles
    if (!data || data.c === 0) return null;

    return data;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!process.env.FINNHUB_API_KEY) {
    return NextResponse.json(
      { error: "FINNHUB_API_KEY no configurada" },
      { status: 500 }
    );
  }

  const allSymbols = [...INDICES, ...FIXED];

  const settled = await Promise.allSettled(
    allSymbols.map(async (item): Promise<TickerItem | null> => {
      const quote = await fetchQuote(item.symbol);
      if (!quote) return null;
      return {
        ...item,
        price:         quote.c,
        change:        quote.d,
        changePercent: quote.dp,
      };
    })
  );

  const data: TickerItem[] = settled
    .filter(
      (r): r is PromiseFulfilledResult<TickerItem> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value);

  // Índices: ordenar por % cambio absoluto (más volátil primero)
  const indices = data
    .filter((d) => d.type === "index")
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));

  const fixed = data.filter((d) => d.type !== "index");

  return NextResponse.json([...indices, ...fixed], {
    headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=30" },
  });
}
