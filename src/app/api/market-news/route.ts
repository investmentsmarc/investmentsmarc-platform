import { NextResponse } from "next/server";

import { getMarketNews } from "@/lib/marketNews";

/**
 * Force Node.js runtime (not Edge). The pipeline uses:
 *   - URLSearchParams with complex bodies (batchexecute)
 *   - string/Buffer-heavy regex work
 *   - ~20 parallel outbound fetches to external domains
 * These are all fine on Node, fragile on Edge.
 */
export const runtime = "nodejs";

/** Always render per-request. Avoids Firebase App Hosting building a stale
 *  empty feed if the network fetches hiccup during the prerender step. */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const articles = await getMarketNews(12);
    return NextResponse.json(articles, {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=900",
      },
    });
  } catch (err) {
    console.error("[market-news] pipeline failed:", err);
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store" },
      status: 200, // devuelve 200 vacío — la UI tiene estado "empty" gracioso
    });
  }
}
