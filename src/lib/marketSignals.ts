import "server-only";

import YahooFinance from "yahoo-finance2";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ---------- types ----------

export type FearGreed = {
  now: number;
  classification: string;
  previousClose: number;
  oneWeekAgo: number;
  oneMonthAgo: number;
};

export type TopMover = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

export type EarningsEvent = {
  symbol: string;
  name: string;
  date: string;
  daysUntil: number;
  time: "BMO" | "AMC" | "DMH";
};

// ---------- CNN Fear & Greed ----------

const CNN_FG_URL =
  "https://production.dataviz.cnn.io/index/fearandgreed/graphdata";

export async function getFearGreed(): Promise<FearGreed | null> {
  try {
    const res = await fetch(CNN_FG_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 900 }, // 15 min
    });
    if (!res.ok) return null;
    const data = await res.json();
    const fg = data?.fear_and_greed;
    if (!fg || typeof fg.score !== "number") return null;
    return {
      now: Math.round(fg.score),
      classification: fg.rating ?? "Neutral",
      previousClose: Math.round(fg.previous_close ?? fg.score),
      oneWeekAgo: Math.round(fg.previous_1_week ?? fg.score),
      oneMonthAgo: Math.round(fg.previous_1_month ?? fg.score),
    };
  } catch {
    return null;
  }
}

// ---------- Top Movers ----------

const MOVER_WATCHLIST = [
  { symbol: "AAPL",  name: "Apple" },
  { symbol: "MSFT",  name: "Microsoft" },
  { symbol: "NVDA",  name: "NVIDIA" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN",  name: "Amazon" },
  { symbol: "META",  name: "Meta" },
  { symbol: "TSLA",  name: "Tesla" },
  { symbol: "SPY",   name: "S&P 500" },
  { symbol: "QQQ",   name: "Nasdaq 100" },
  { symbol: "PLTR",  name: "Palantir" },
  { symbol: "UNH",   name: "UnitedHealth" },
  { symbol: "ASML",  name: "ASML" },
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
];

export async function getTopMovers(limit = 5): Promise<TopMover[]> {
  try {
    const quotes = await Promise.all(
      MOVER_WATCHLIST.map(async (m) => {
        try {
          const q = await yf.quote(m.symbol);
          if (!q || q.regularMarketPrice == null) return null;
          return {
            symbol: m.symbol,
            name: m.name,
            price: q.regularMarketPrice,
            change: q.regularMarketChange ?? 0,
            changePercent: q.regularMarketChangePercent ?? 0,
          } satisfies TopMover;
        } catch {
          return null;
        }
      }),
    );
    return quotes
      .filter((x): x is TopMover => x !== null)
      .sort(
        (a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent),
      )
      .slice(0, limit);
  } catch {
    return [];
  }
}

// ---------- Earnings calendar (seeded — actualizar trimestralmente) ----------

const EARNINGS_SCHEDULE: Array<Omit<EarningsEvent, "daysUntil">> = [
  { symbol: "TSLA",  name: "Tesla",            date: "2026-04-22", time: "AMC" },
  { symbol: "GOOGL", name: "Alphabet",         date: "2026-04-29", time: "AMC" },
  { symbol: "MSFT",  name: "Microsoft",        date: "2026-04-30", time: "AMC" },
  { symbol: "META",  name: "Meta Platforms",   date: "2026-04-30", time: "AMC" },
  { symbol: "AAPL",  name: "Apple",            date: "2026-05-01", time: "AMC" },
  { symbol: "AMZN",  name: "Amazon",           date: "2026-05-01", time: "AMC" },
  { symbol: "PLTR",  name: "Palantir",         date: "2026-05-05", time: "AMC" },
  { symbol: "UNH",   name: "UnitedHealth",     date: "2026-05-14", time: "BMO" },
  { symbol: "NVDA",  name: "NVIDIA",           date: "2026-05-28", time: "AMC" },
  { symbol: "ASML",  name: "ASML Holding",     date: "2026-07-16", time: "BMO" },
];

export function getUpcomingEarnings(limit = 4): EarningsEvent[] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return EARNINGS_SCHEDULE.map((e) => {
    const d = new Date(`${e.date}T00:00:00Z`);
    const daysUntil = Math.round(
      (d.getTime() - today.getTime()) / 86_400_000,
    );
    return { ...e, daysUntil };
  })
    .filter((e) => e.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, limit);
}
