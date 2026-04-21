"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { MarketNewsArticle, NewsCategory } from "@/lib/marketNews";

type ExtractedArticle = {
  title: string | null;
  html: string;
  imageUrl: string | null;
  byline: string | null;
  siteName: string | null;
  sourceUrl: string;
};

type ArticleState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: ExtractedArticle }
  | { status: "error"; message: string };

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  markets: "Markets",
  earnings: "Earnings",
  tech: "Tech",
  crypto: "Crypto",
  macro: "Macro",
};

function timeAgo(iso: string): string {
  const ts = Date.parse(iso);
  if (!ts) return "";
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.round(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.round(h / 24);
  return `hace ${d} d`;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

const PLACEHOLDERS: Record<NewsCategory, string> = {
  markets: placeholderSvg("MARKETS", "M40 280 L120 230 L200 260 L290 200 L380 220 L470 170 L560 140"),
  earnings: placeholderSvg(
    "EARNINGS",
    "M40 220 L120 180 L200 230 L290 140 L380 170 L470 110 L560 130",
  ),
  tech: placeholderSvg(
    "TECH",
    "M40 260 L140 220 L210 250 L300 170 L400 200 L510 150 L560 120",
  ),
  crypto: placeholderSvg(
    "CRYPTO",
    "M40 300 L120 180 L200 280 L290 160 L380 270 L470 150 L560 130",
  ),
  macro: placeholderSvg(
    "MACRO",
    "M40 240 L120 260 L200 210 L290 230 L380 190 L470 210 L560 180",
  ),
};

function placeholderSvg(label: string, path: string): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#181411"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>' +
    '<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#f4d97a"/><stop offset="1" stop-color="#8a6d2b"/></linearGradient></defs>' +
    '<rect width="600" height="400" fill="url(#g)"/>' +
    // subtle grid
    '<g stroke="rgba(216,182,90,0.05)" stroke-width="1">' +
    '<path d="M0 100 H600 M0 200 H600 M0 300 H600"/>' +
    '<path d="M100 0 V400 M200 0 V400 M300 0 V400 M400 0 V400 M500 0 V400"/>' +
    "</g>" +
    // price path
    `<path d="${path}" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity="0.7"/>` +
    // end dot
    '<circle cx="560" cy="140" r="5" fill="#f4d97a"/>' +
    '<circle cx="560" cy="140" r="12" fill="rgba(244,217,122,0.22)"/>' +
    // brand
    '<text x="32" y="360" font-family="Sora, sans-serif" font-weight="700" font-size="11" letter-spacing="4" fill="rgba(216,182,90,0.6)">INVESTMENTS MARC</text>' +
    // category label
    `<text x="32" y="60" font-family="Sora, sans-serif" font-weight="800" font-size="22" letter-spacing="4" fill="rgba(244,217,122,0.85)">${label}</text>` +
    "</svg>";
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

function placeholderFor(cat: NewsCategory): string {
  return PLACEHOLDERS[cat] ?? PLACEHOLDERS.markets;
}

export function NewsFeed({ articles }: { articles: MarketNewsArticle[] }) {
  const [active, setActive] = useState<MarketNewsArticle | null>(null);
  const [articleState, setArticleState] = useState<ArticleState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  // Spotlight hero auto-rotates through first N articles
  const SPOTLIGHT_COUNT = Math.min(4, articles.length);
  const spotlight = articles.slice(0, SPOTLIGHT_COUNT);
  const rest = articles.slice(SPOTLIGHT_COUNT);

  const [heroIdx, setHeroIdx] = useState(0);
  const [heroSwapping, setHeroSwapping] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || spotlight.length < 2) return;
    const id = window.setInterval(() => {
      setHeroSwapping(true);
      window.setTimeout(() => {
        setHeroIdx((i) => (i + 1) % spotlight.length);
        setHeroSwapping(false);
      }, 520); // duración del fade-out — matchea @keyframes mi-news-hero-out
    }, 8000);
    return () => window.clearInterval(id);
  }, [paused, spotlight.length]);

  const jumpToHero = (i: number) => {
    if (i === heroIdx) return;
    setHeroSwapping(true);
    window.setTimeout(() => {
      setHeroIdx(i);
      setHeroSwapping(false);
    }, 520);
  };

  const close = useCallback(() => {
    setActive(null);
    abortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  useEffect(() => {
    if (!active) {
      setArticleState({ status: "idle" });
      return;
    }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setArticleState({ status: "loading" });

    fetch(`/api/market-news/article?url=${encodeURIComponent(active.url)}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return (await r.json()) as ExtractedArticle;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        if (!data.html) throw new Error("No content");
        setArticleState({ status: "ready", data });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setArticleState({
          status: "error",
          message: err instanceof Error ? err.message : "unknown",
        });
      });

    return () => controller.abort();
  }, [active]);

  if (articles.length === 0) {
    return (
      <div className="mi-news-empty">
        El feed está tomando un momento. Volverá con noticias en breve.
      </div>
    );
  }

  const hero = spotlight[heroIdx];

  return (
    <>
      <div className="mi-news-stage">
        {/* === SPOTLIGHT HERO === */}
        <article
          className={`mi-news-hero${heroSwapping ? " is-swapping" : ""}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            key={heroIdx}
            type="button"
            className="mi-news-hero-surface"
            onClick={() => setActive(hero)}
            aria-label={`Abrir: ${hero.title}`}
          >
            <div className="mi-news-hero-media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.imageUrl ?? placeholderFor(hero.category)}
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = placeholderFor(hero.category);
                }}
              />
              <div className="mi-news-hero-scrim" />
              <div className="mi-news-hero-glow" aria-hidden="true" />
            </div>
            <div className="mi-news-hero-content">
              <div className="mi-news-hero-top">
                <span className={`mi-news-card-cat mi-news-cat-${hero.category}`}>
                  {CATEGORY_LABEL[hero.category]}
                </span>
                <span className="mi-news-hero-live" aria-hidden="true">
                  <span className="mi-news-hero-live-dot" /> LIVE FEED
                </span>
              </div>
              <h3 className="mi-news-hero-title">{hero.title}</h3>
              {hero.description ? (
                <p className="mi-news-hero-desc">{hero.description}</p>
              ) : null}
              <div className="mi-news-hero-meta">
                <span className="mi-news-hero-src">{hero.source}</span>
                <span className="mi-news-card-dot">·</span>
                <span>{timeAgo(hero.pubDate)}</span>
                <span className="mi-news-hero-arrow">Leer en página →</span>
              </div>
            </div>
          </button>

          {/* pager bars */}
          <div
            className="mi-news-hero-pager"
            role="tablist"
            aria-label="Spotlight noticias"
          >
            {spotlight.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === heroIdx}
                aria-label={`Noticia destacada ${i + 1}`}
                className={`mi-news-hero-pager-bar${
                  i === heroIdx ? " is-active" : ""
                }`}
                onClick={() => jumpToHero(i)}
              />
            ))}
          </div>
        </article>

        {/* === FEED QUEUE (remaining articles, compact rows) === */}
        {rest.length > 0 ? (
          <aside className="mi-news-queue" aria-label="Más noticias">
            <div className="mi-news-queue-head">
              <span className="mi-news-queue-ticker" aria-hidden="true">
                <span />
              </span>
              <span>En el wire</span>
            </div>
            <ul className="mi-news-queue-list">
              {rest.slice(0, 5).map((a, idx) => (
                <li
                  key={a.id}
                  className={`mi-news-queue-item mi-reveal mi-reveal-delay-${
                    Math.min(idx + 1, 6)
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActive(a)}
                    aria-label={`Abrir: ${a.title}`}
                  >
                    <div className="mi-news-queue-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.imageUrl ?? placeholderFor(a.category)}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = placeholderFor(a.category);
                        }}
                      />
                    </div>
                    <div className="mi-news-queue-body">
                      <div className="mi-news-queue-meta">
                        <span
                          className={`mi-news-queue-cat mi-news-cat-${a.category}`}
                        >
                          {CATEGORY_LABEL[a.category]}
                        </span>
                        <span className="mi-news-card-dot">·</span>
                        <span>{a.source}</span>
                        <span className="mi-news-card-dot">·</span>
                        <span>{timeAgo(a.pubDate)}</span>
                      </div>
                      <h4 className="mi-news-queue-title">{a.title}</h4>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </div>

      {/* === MODAL === */}
      {active ? (
        <div
          className="mi-news-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <article className="mi-news-modal">
            <button
              type="button"
              className="mi-news-modal-close"
              aria-label="Cerrar"
              onClick={close}
            >
              ×
            </button>

            <div className="mi-news-modal-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  articleState.status === "ready" && articleState.data.imageUrl
                    ? articleState.data.imageUrl
                    : active.imageUrl ?? placeholderFor(active.category)
                }
                alt=""
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = placeholderFor(active.category);
                }}
              />
              <span className={`mi-news-card-cat mi-news-cat-${active.category}`}>
                {CATEGORY_LABEL[active.category]}
              </span>
            </div>

            <div className="mi-news-modal-body">
              <div className="mi-news-modal-meta">
                <span className="mi-news-modal-src">
                  {articleState.status === "ready" && articleState.data.siteName
                    ? articleState.data.siteName
                    : active.source}
                </span>
                <span className="mi-news-card-dot">·</span>
                <span>{timeAgo(active.pubDate)}</span>
                {articleState.status === "ready" && articleState.data.sourceUrl ? (
                  <>
                    <span className="mi-news-card-dot">·</span>
                    <span className="mi-news-modal-domain">
                      {domainOf(articleState.data.sourceUrl)}
                    </span>
                  </>
                ) : null}
              </div>
              <h2 className="mi-news-modal-title">
                {articleState.status === "ready" && articleState.data.title
                  ? articleState.data.title
                  : active.title}
              </h2>

              {articleState.status === "loading" ? (
                <div className="mi-news-modal-loading" role="status" aria-live="polite">
                  <div className="mi-news-modal-spinner" aria-hidden="true" />
                  <span>Cargando artículo…</span>
                </div>
              ) : null}

              {articleState.status === "ready" ? (
                <div
                  className="mi-news-article"
                  dangerouslySetInnerHTML={{ __html: articleState.data.html }}
                />
              ) : null}

              {articleState.status === "error" ? (
                <>
                  {active.description ? (
                    <p className="mi-news-modal-desc">{active.description}</p>
                  ) : null}
                  <p className="mi-news-modal-fallback">
                    No pudimos extraer el contenido completo. Puedes abrir la noticia en
                    la fuente original.
                  </p>
                </>
              ) : null}

              <div className="mi-news-modal-actions">
                <a
                  href={
                    articleState.status === "ready" && articleState.data.sourceUrl
                      ? articleState.data.sourceUrl
                      : active.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="mi-btn-gold mi-news-modal-primary"
                >
                  Abrir en la fuente →
                </a>
                <button
                  type="button"
                  className="mi-btn-ghost mi-news-modal-secondary"
                  onClick={close}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </>
  );
}
