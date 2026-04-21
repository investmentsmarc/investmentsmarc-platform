import { NewsFeed } from "@/components/home/NewsFeed";
import { getMarketNews } from "@/lib/marketNews";
import type { MarketNewsArticle } from "@/lib/marketNews";

/**
 * Request-time render. En Firebase App Hosting el build puede fallar silently
 * al prerender la home si la red tiene un hiccup — mejor re-rendear en cada
 * request y dejar que el `Cache-Control` downstream mitigue el costo.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function LatestArticles() {
  let articles: MarketNewsArticle[] = [];
  try {
    articles = await getMarketNews(9);
  } catch (err) {
    console.error("[LatestArticles] getMarketNews failed:", err);
  }

  return (
    <section className="mi-section mi-blog-section mi-home-band">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered">
          <div className="mi-home-section-copy mi-reveal">
            <span className="mi-badge">Market Pulse · Live</span>
            <h2 className="mi-section-title">
              Últimas <span className="mi-text-gradient">Noticias</span>
            </h2>
            <p className="mi-home-section-copy-sub">
              Bloomberg · CNBC · Yahoo Finance · Reuters — actualizado cada 30 minutos
            </p>
          </div>
        </div>

        <NewsFeed articles={articles} />
      </div>
    </section>
  );
}
