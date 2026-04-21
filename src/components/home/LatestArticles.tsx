import { NewsFeed } from "@/components/home/NewsFeed";
import { getMarketNews } from "@/lib/marketNews";

export const revalidate = 1800; // 30-min ISR

export async function LatestArticles() {
  const articles = await getMarketNews(9);

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
