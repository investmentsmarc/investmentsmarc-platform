import { NextResponse } from "next/server";

import { getMarketNews } from "@/lib/marketNews";

export async function GET() {
  const articles = await getMarketNews(12);
  return NextResponse.json(articles, {
    headers: { "Cache-Control": "s-maxage=1800, stale-while-revalidate=900" },
  });
}
