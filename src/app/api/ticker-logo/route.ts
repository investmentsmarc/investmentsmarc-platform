import { NextRequest, NextResponse } from "next/server";

import { TICKER_LOGO_UPSTREAM } from "@/lib/tickerLogoUrls";

/**
 * Proxy de logos del ticker: el navegador solo llama al origen propio.
 * Evita bloqueos DNS/red del cliente contra Clearbit (antes), TradingView o CoinGecko.
 */
export async function GET(req: NextRequest) {
  const symbol = req.nextUrl.searchParams.get("symbol");
  if (!symbol || !TICKER_LOGO_UPSTREAM[symbol]) {
    return new NextResponse(null, { status: 404 });
  }

  const upstream = TICKER_LOGO_UPSTREAM[symbol];

  try {
    const res = await fetch(upstream, {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (compatible; InvestmentsMarcLogo/1.0; +https://investmentsmarc.com)",
      },
      next: { revalidate: 86_400 },
    });

    if (!res.ok) {
      return new NextResponse(null, { status: 502 });
    }

    const buf = await res.arrayBuffer();
    const contentType =
      res.headers.get("content-type") ?? "application/octet-stream";

    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
