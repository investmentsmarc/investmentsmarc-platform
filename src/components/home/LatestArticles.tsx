import { NewsFeed } from "@/components/home/NewsFeed";
import { getMarketNews } from "@/lib/marketNews";
import type { MarketNewsArticle } from "@/lib/marketNews";
import {
  getFearGreed,
  getTopMovers,
  getUpcomingEarnings,
  type EarningsEvent,
  type FearGreed,
  type TopMover,
} from "@/lib/marketSignals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function LatestArticles() {
  let articles: MarketNewsArticle[] = [];
  let movers: TopMover[] = [];
  let fearGreed: FearGreed | null = null;
  let earnings: EarningsEvent[] = [];

  try {
    const [news, mov, fg] = await Promise.all([
      getMarketNews(12).catch((e) => {
        console.error("[LatestArticles] news failed:", e);
        return [] as MarketNewsArticle[];
      }),
      getTopMovers(5).catch(() => [] as TopMover[]),
      getFearGreed().catch(() => null),
    ]);
    articles = news;
    movers = mov;
    fearGreed = fg;
    earnings = getUpcomingEarnings(4);
  } catch (err) {
    console.error("[LatestArticles] fan-out failed:", err);
  }

  return (
    <section className="mi-section mi-blog-section mi-home-band">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered mi-reveal">
          <span className="mi-badge">Market Pulse · Live</span>
          <h2 className="mi-section-title">
            Market <span className="mi-text-gradient">Intelligence</span>
          </h2>
          <p className="mi-home-section-copy-sub">
            Flash, earnings, Fed, macro y tickers — actualizado cada 30 min.
          </p>
        </div>

        <NewsFeed
          articles={articles}
          movers={movers}
          earnings={earnings}
          fearGreed={fearGreed}
        />
      </div>
    </section>
  );
}
