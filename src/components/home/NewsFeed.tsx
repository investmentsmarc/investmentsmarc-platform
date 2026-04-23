"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { MarketNewsArticle, NewsCategory } from "@/lib/marketNews";
import type {
  EarningsEvent,
  FearGreed,
  TopMover,
} from "@/lib/marketSignals";
import { NewsSidePanel } from "@/components/home/NewsSidePanel";

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

type FilterKey = "all" | NewsCategory | "breaking";

const CATEGORY_LABEL: Record<NewsCategory, string> = {
  markets: "Markets",
  earnings: "Earnings",
  tech: "Tech",
  crypto: "Crypto",
  macro: "Macro",
  trump: "Trump",
};

const FILTER_ORDER: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "Todo" },
  { key: "breaking", label: "Breaking" },
  { key: "trump", label: "Trump" },
  { key: "earnings", label: "Earnings" },
  { key: "macro", label: "Macro" },
  { key: "markets", label: "Markets" },
  { key: "tech", label: "Tech" },
  { key: "crypto", label: "Crypto" },
];

function timeAgo(iso: string): string {
  const ts = Date.parse(iso);
  if (!ts) return "";
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.round(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  return `${d}d`;
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

// ─────────────── Category-themed SVG placeholders ───────────────

function placeholderSvg(label: string, path: string): string {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="#181411"/><stop offset="1" stop-color="#0a0a0a"/></linearGradient>' +
    '<linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" stop-color="#f4d97a"/><stop offset="1" stop-color="#8a6d2b"/></linearGradient></defs>' +
    '<rect width="600" height="400" fill="url(#g)"/>' +
    '<g stroke="rgba(216,182,90,0.05)" stroke-width="1">' +
    '<path d="M0 100 H600 M0 200 H600 M0 300 H600"/>' +
    '<path d="M100 0 V400 M200 0 V400 M300 0 V400 M400 0 V400 M500 0 V400"/>' +
    "</g>" +
    `<path d="${path}" fill="none" stroke="url(#gold)" stroke-width="2.5" opacity="0.7"/>` +
    '<circle cx="560" cy="140" r="5" fill="#f4d97a"/>' +
    '<circle cx="560" cy="140" r="12" fill="rgba(244,217,122,0.22)"/>' +
    '<text x="32" y="60" font-family="Sora, sans-serif" font-weight="800" font-size="22" letter-spacing="4" fill="rgba(244,217,122,0.85)">' +
    label +
    "</text></svg>";
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const PLACEHOLDERS: Record<NewsCategory, string> = {
  markets: placeholderSvg("MARKETS", "M40 280 L120 230 L200 260 L290 200 L380 220 L470 170 L560 140"),
  earnings: placeholderSvg("EARNINGS", "M40 220 L120 180 L200 230 L290 140 L380 170 L470 110 L560 130"),
  tech: placeholderSvg("TECH", "M40 260 L140 220 L210 250 L300 170 L400 200 L510 150 L560 120"),
  crypto: placeholderSvg("CRYPTO", "M40 300 L120 180 L200 280 L290 160 L380 270 L470 150 L560 130"),
  macro: placeholderSvg("MACRO", "M40 240 L120 260 L200 210 L290 230 L380 190 L470 210 L560 180"),
  trump: placeholderSvg("TRUMP", "M40 200 L120 240 L200 180 L290 260 L380 160 L470 250 L560 170"),
};

function placeholderFor(cat: NewsCategory): string {
  return PLACEHOLDERS[cat] ?? PLACEHOLDERS.markets;
}

// ──────────────────────────────────────────────────────────────────

export function NewsFeed({
  articles,
  movers,
  earnings,
  fearGreed,
}: {
  articles: MarketNewsArticle[];
  movers: TopMover[];
  earnings: EarningsEvent[];
  fearGreed: FearGreed | null;
}) {
  const [active, setActive] = useState<MarketNewsArticle | null>(null);
  const [articleState, setArticleState] = useState<ArticleState>({ status: "idle" });
  const [filter, setFilter] = useState<FilterKey>("all");
  const abortRef = useRef<AbortController | null>(null);

  // Counts by filter for tab badges
  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: articles.length,
      breaking: 0,
      markets: 0,
      earnings: 0,
      tech: 0,
      crypto: 0,
      macro: 0,
      trump: 0,
    };
    for (const a of articles) {
      c[a.category] += 1;
      if (a.impact === "high") c.breaking += 1;
    }
    return c;
  }, [articles]);

  // Apply filter
  const visible = useMemo(() => {
    if (filter === "all") return articles;
    if (filter === "breaking") return articles.filter((a) => a.impact === "high");
    return articles.filter((a) => a.category === filter);
  }, [articles, filter]);

  const close = useCallback(() => {
    setActive(null);
    abortRef.current?.abort();
  }, []);

  // Body scroll lock + ESC
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

  // Fetch article on modal open
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

  return (
    <>
      <div className="mi-newsv2-root">
        {/* ─────────── FILTER TABS ─────────── */}
        <nav className="mi-newsv2-tabs" role="tablist" aria-label="Filtro de noticias">
          {FILTER_ORDER.map(({ key, label }) => {
            const isActive = filter === key;
            const count = counts[key];
            if (count === 0 && key !== "all") return null;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`mi-newsv2-tab${isActive ? " is-active" : ""}${
                  key === "breaking" ? " mi-newsv2-tab-breaking" : ""
                }`}
                onClick={() => setFilter(key)}
              >
                {label}
                <span className="mi-newsv2-tab-count">{count}</span>
              </button>
            );
          })}
        </nav>

        {/* ─────────── MAIN GRID: feed + side panel ─────────── */}
        <div className="mi-newsv2-grid">
          {/* Feed */}
          <div className="mi-newsv2-feed" key={filter /* remount on filter change for animation */}>
            {visible.length === 0 ? (
              <div className="mi-newsv2-feed-empty">
                Sin resultados para este filtro ahora mismo.
              </div>
            ) : (
              visible.map((a) => (
                <article
                  key={a.id}
                  className={`mi-newsv2-row mi-news-row-cat-${a.category}${
                    a.impact === "high" ? " is-impact" : ""
                  }`}
                >
                  <button
                    type="button"
                    className="mi-newsv2-row-btn"
                    onClick={() => setActive(a)}
                    aria-label={`Abrir: ${a.title}`}
                  >
                    <div className="mi-newsv2-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={a.imageUrl ?? placeholderFor(a.category)}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = placeholderFor(a.category);
                        }}
                      />
                    </div>
                    <div className="mi-newsv2-body">
                      <div className="mi-newsv2-meta">
                        <span
                          className={`mi-newsv2-cat mi-news-cat-${a.category}`}
                        >
                          {CATEGORY_LABEL[a.category]}
                        </span>
                        {a.impact === "high" ? (
                          <span className="mi-newsv2-impact" aria-label="Alto impacto">
                            <span className="mi-newsv2-impact-dot" />
                            BREAKING
                          </span>
                        ) : null}
                        <span className="mi-newsv2-src">{a.source}</span>
                        <span className="mi-newsv2-dot">·</span>
                        <span className="mi-newsv2-time" suppressHydrationWarning>
                          {timeAgo(a.pubDate)}
                        </span>
                      </div>
                      <h3 className="mi-newsv2-title">{a.title}</h3>
                      {a.description ? (
                        <p className="mi-newsv2-desc">{a.description}</p>
                      ) : null}
                    </div>
                    <span className="mi-newsv2-row-arrow" aria-hidden="true">
                      →
                    </span>
                  </button>
                </article>
              ))
            )}
          </div>

          {/* Side panel */}
          <NewsSidePanel
            movers={movers}
            earnings={earnings}
            fearGreed={fearGreed}
          />
        </div>
      </div>

      {/* ─────────── MODAL (portal) ─────────── */}
      {active && typeof document !== "undefined"
        ? createPortal(
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
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const el = e.currentTarget as HTMLImageElement;
                      if (active.imageUrl && el.src !== active.imageUrl) {
                        el.src = active.imageUrl;
                      } else {
                        el.src = placeholderFor(active.category);
                      }
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
                        No pudimos extraer el contenido completo.
                      </p>
                    </>
                  ) : null}

                  <div className="mi-news-modal-actions">
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
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
