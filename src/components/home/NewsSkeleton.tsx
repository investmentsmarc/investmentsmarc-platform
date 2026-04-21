export function NewsSkeleton() {
  return (
    <section className="mi-section mi-blog-section mi-home-band">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered">
          <div className="mi-home-section-copy">
            <span className="mi-badge">Market Pulse · Live</span>
            <h2 className="mi-section-title">
              Últimas <span className="mi-text-gradient">Noticias</span>
            </h2>
            <p className="mi-home-section-copy-sub">
              Sintonizando con las mesas de trading…
            </p>
          </div>
        </div>

        <div className="mi-news-stage" aria-hidden="true">
          <div className="mi-news-hero mi-news-skel">
            <div className="mi-news-skel-media" />
            <div className="mi-news-skel-content">
              <div className="mi-news-skel-line mi-news-skel-line-s" />
              <div className="mi-news-skel-line mi-news-skel-line-xl" />
              <div className="mi-news-skel-line mi-news-skel-line-xl" />
              <div className="mi-news-skel-line mi-news-skel-line-m" />
            </div>
          </div>
          <aside className="mi-news-queue">
            <div className="mi-news-queue-head">
              <span className="mi-news-queue-ticker"><span /></span>
              <span>En el wire</span>
            </div>
            <ul className="mi-news-queue-list">
              {[0, 1, 2, 3, 4].map((i) => (
                <li key={i} className="mi-news-queue-item">
                  <div className="mi-news-queue-skel">
                    <div className="mi-news-skel-thumb" />
                    <div className="mi-news-skel-rows">
                      <div className="mi-news-skel-line mi-news-skel-line-xs" />
                      <div className="mi-news-skel-line mi-news-skel-line-l" />
                      <div className="mi-news-skel-line mi-news-skel-line-m" />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
