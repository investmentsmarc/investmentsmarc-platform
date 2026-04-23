import { NextResponse } from "next/server";

import { getMarketNews } from "@/lib/marketNews";
import { writeMarketNewsCache } from "@/lib/marketNewsCache";
import {
  getFearGreed,
  getTopMovers,
  getUpcomingEarnings,
} from "@/lib/marketSignals";

// La ruta hace scraping pesado + escribe Firestore — nunca cachear.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60; // segundos en App Hosting / Cloud Run

function unauthorized() {
  return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
}

async function handle(): Promise<NextResponse> {
  const secret = process.env.NEWS_REFRESH_SECRET;
  if (!secret) {
    console.error("[refresh-news] NEWS_REFRESH_SECRET no configurado");
    return NextResponse.json(
      { ok: false, error: "server-misconfigured" },
      { status: 500 },
    );
  }

  const startedAt = Date.now();
  const [articles, movers, fearGreed] = await Promise.all([
    getMarketNews(12).catch((e) => {
      console.error("[refresh-news] news failed:", e);
      return [];
    }),
    getTopMovers(5).catch(() => []),
    getFearGreed().catch(() => null),
  ]);
  const earnings = getUpcomingEarnings(4);

  if (articles.length === 0) {
    return NextResponse.json(
      { ok: false, error: "no-articles", durationMs: Date.now() - startedAt },
      { status: 502 },
    );
  }

  await writeMarketNewsCache({ articles, movers, earnings, fearGreed });

  return NextResponse.json({
    ok: true,
    counts: { articles: articles.length, movers: movers.length, earnings: earnings.length },
    durationMs: Date.now() - startedAt,
  });
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.NEWS_REFRESH_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization") ?? "";
  if (auth === `Bearer ${secret}`) return true;
  // Cloud Scheduler / GET manual con header x-refresh-secret
  const headerSecret = request.headers.get("x-refresh-secret");
  return headerSecret === secret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return handle();
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();
  return handle();
}
