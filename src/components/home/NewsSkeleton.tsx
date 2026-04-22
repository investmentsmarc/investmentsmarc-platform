/**
 * Placeholder de carga alineado con NewsFeed v2 + NewsSidePanel
 * (tabs, grid feed + columna 320px).
 */
export function NewsSkeleton() {
  const tabs = ["Todo", "Breaking", "Trump", "Earnings", "Macro", "Markets", "Tech", "Crypto"];

  return (
    <section className="mi-section mi-blog-section mi-home-band">
      <div className="mi-container">
        <div className="mi-home-section-head mi-home-section-head-centered">
          <span className="mi-badge">Market Pulse · Live</span>
          <h2 className="mi-section-title">
            Market <span className="mi-text-gradient">Intelligence</span>
          </h2>
          <p className="mi-home-section-copy-sub">
            Flash, earnings, Fed, macro y tickers — actualizado cada 30 min.
          </p>
        </div>

        <div
          className="mi-newsv2-root mi-newsv2-root-skel"
          aria-busy="true"
          aria-live="polite"
          aria-label="Cargando feed de noticias"
        >
          {/* Replica la estructura real de tabs para que el layout sea idéntico */}
          <nav
            className="mi-newsv2-tabs mi-newsv2-tabs-skel"
            role="tablist"
            aria-label="Filtro de noticias"
          >
            {tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={i === 0}
                className={`mi-newsv2-tab${i === 0 ? " is-active" : ""}`}
                tabIndex={-1}
              >
                <span className="mi-newsv2-tab-label-skel">{t}</span>
                <span className="mi-newsv2-tab-count mi-newsv2-tab-count-skel" aria-hidden="true">
                  <span className="mi-skel-dot" />
                </span>
              </button>
            ))}
          </nav>

          <div className="mi-newsv2-grid">
            <div className="mi-newsv2-feed mi-newsv2-feed-skel">
              {Array.from({ length: 6 }).map((_, i) => (
                <article key={i} className="mi-newsv2-row mi-newsv2-row-skel" aria-hidden="true">
                  <button type="button" className="mi-newsv2-row-btn" tabIndex={-1}>
                    <div className="mi-newsv2-thumb">
                      <span className="mi-newsv2-skel-thumb" />
                    </div>
                    <div className="mi-newsv2-body">
                      <div className="mi-newsv2-meta">
                        <span className="mi-newsv2-cat mi-newsv2-cat-skel" />
                        <span className="mi-newsv2-src mi-newsv2-src-skel" />
                        <span className="mi-newsv2-dot">·</span>
                        <span className="mi-newsv2-time mi-newsv2-time-skel" />
                      </div>
                      <h3 className="mi-newsv2-title mi-newsv2-title-skel">
                        <span className="mi-skel-line mi-skel-line--w96" />
                        <span className="mi-skel-line mi-skel-line--w72" />
                      </h3>
                      <p className="mi-newsv2-desc mi-newsv2-desc-skel">
                        <span className="mi-skel-line mi-skel-line--w58" />
                      </p>
                    </div>
                    <span className="mi-newsv2-row-arrow" aria-hidden="true">
                      <span className="mi-newsv2-skel-chev" />
                    </span>
                  </button>
                </article>
              ))}
            </div>

            <aside className="mi-news-side mi-news-side-skel" aria-hidden="true">
              <section className="mi-side-card">
                <header className="mi-side-head">
                  <span className="mi-skel-bar mi-skel-bar--kicker" />
                  <span className="mi-skel-bar mi-skel-bar--src" />
                </header>
                <div className="mi-fg-skel-block">
                  <div className="mi-fg-skel-arc" />
                  <div className="mi-fg-skel-readout">
                    <span className="mi-skel-bar mi-skel-bar--score" />
                    <span className="mi-skel-bar mi-skel-bar--label" />
                  </div>
                  <div className="mi-fg-skel-hist">
                    <span /><span /><span />
                  </div>
                </div>
              </section>

              <section className="mi-side-card">
                <header className="mi-side-head">
                  <span className="mi-skel-bar mi-skel-bar--kicker" />
                  <span className="mi-skel-bar mi-skel-bar--src" />
                </header>
                <ul className="mi-side-list-skel">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <li key={i}>
                      <span className="mi-skel-bar mi-skel-bar--mover-l" />
                      <span className="mi-skel-bar mi-skel-bar--mover-r" />
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mi-side-card">
                <header className="mi-side-head">
                  <span className="mi-skel-bar mi-skel-bar--kicker" />
                  <span className="mi-skel-bar mi-skel-bar--src" />
                </header>
                <ul className="mi-side-list-skel">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <span className="mi-skel-bar mi-skel-bar--earn-l" />
                      <span className="mi-skel-bar mi-skel-bar--earn-r" />
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
