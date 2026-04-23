import { NewsFeed } from "@/components/home/NewsFeed";
import { getMarketNews } from "@/lib/marketNews";
import type { MarketNewsArticle } from "@/lib/marketNews";
import { readMarketNewsCache } from "@/lib/marketNewsCache";
import {
  getFearGreed,
  getTopMovers,
  getUpcomingEarnings,
  type EarningsEvent,
  type FearGreed,
  type TopMover,
} from "@/lib/marketSignals";

// Servimos desde ISR corto — la fuente real de verdad está en Firestore y
// se refresca por la Cloud Function programada cada 30 min.
export const revalidate = 60;
export const runtime = "nodejs";

// Si el último refresh tiene más que esto, intentamos live como refuerzo
// aunque aún renderizamos el cache (lo que sirve a usuarios nunca falla).
const STALE_THRESHOLD_MS = 90 * 60_000; // 90 min

async function liveFallback(): Promise<{
  articles: MarketNewsArticle[];
  movers: TopMover[];
  fearGreed: FearGreed | null;
  earnings: EarningsEvent[];
}> {
  const [articles, movers, fearGreed] = await Promise.all([
    getMarketNews(12).catch(() => [] as MarketNewsArticle[]),
    getTopMovers(5).catch(() => [] as TopMover[]),
    getFearGreed().catch(() => null),
  ]);
  return { articles, movers, fearGreed, earnings: getUpcomingEarnings(4) };
}

export async function LatestArticles() {
  let articles: MarketNewsArticle[] = [];
  let movers: TopMover[] = [];
  let fearGreed: FearGreed | null = null;
  let earnings: EarningsEvent[] = getUpcomingEarnings(4);

  const cached = await readMarketNewsCache();

  if (cached && cached.articles.length > 0) {
    articles = cached.articles;
    movers = cached.movers;
    fearGreed = cached.fearGreed;
    earnings = cached.earnings.length > 0 ? cached.earnings : earnings;
    const stale = Date.now() - cached.updatedAt > STALE_THRESHOLD_MS;
    if (stale) {
      console.warn(
        `[LatestArticles] cache stale (${Math.round(
          (Date.now() - cached.updatedAt) / 60_000,
        )} min) — sirviendo igual, refresh debe correr pronto`,
      );
    }
  } else {
    // Primer deploy / Firestore vacío / cache falló: live como último recurso.
    console.warn("[LatestArticles] cache vacío — live fallback");
    const live = await liveFallback();
    articles = live.articles;
    movers = live.movers;
    fearGreed = live.fearGreed;
    earnings = live.earnings;
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
