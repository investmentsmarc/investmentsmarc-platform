import "server-only";

export type NewsCategory =
  | "markets"
  | "earnings"
  | "tech"
  | "crypto"
  | "macro"
  | "trump";

export type MarketNewsArticle = {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  pubDate: string;
  imageUrl: string | null;
  category: NewsCategory;
  impact: "high" | "normal";
};

// Heurística simple para marcar "HIGH IMPACT": keywords que mueven mercados.
const HIGH_IMPACT_RE =
  /\b(breaking|crash|surge|plunge|plummet|soar|record|emergency|tariff|sanction|hike|cut|war|ban|bans|halt|outage|lawsuit|probe|recall|bankrupt|acquisition|merger|ipo|halted|suspended|miss|beats)\b/i;

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Timeouts (ms) — evitan que un publisher lento cuelgue todo el pipeline.
// Cloud Run cold-network + parallel DNS/TLS a news.google.com pasa fácil los 6s
// cuando el isolate recién arranca. Subimos umbrales — el endpoint tiene maxDuration 60s.
const TIMEOUT_RSS = 18_000;
const TIMEOUT_RESOLVE = 9_000;
const TIMEOUT_PUBLISHER = 7_000;
const TIMEOUT_IMAGE_HEAD = 4_000;

function fetchWithTimeout(
  url: string,
  init: RequestInit & { next?: { revalidate?: number } },
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  return fetch(url, { ...init, signal: ctrl.signal }).finally(() =>
    clearTimeout(timer),
  );
}

const RSS_QUERIES: Array<{ category: NewsCategory; url: string }> = [
  {
    category: "markets",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        '("stock market" OR "S&P 500" OR "Wall Street" OR "Federal Reserve") when:1d ' +
          "(site:bloomberg.com OR site:cnbc.com OR site:finance.yahoo.com OR site:reuters.com OR site:ft.com)",
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "earnings",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        '(earnings OR "quarterly results" OR guidance) when:1d ' +
          "(site:bloomberg.com OR site:cnbc.com OR site:finance.yahoo.com OR site:reuters.com)",
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "tech",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        '("NVIDIA" OR "Apple" OR "Microsoft" OR "AI" OR "chips" OR "semiconductor") when:1d ' +
          "(site:bloomberg.com OR site:cnbc.com OR site:reuters.com OR site:finance.yahoo.com)",
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "crypto",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        '(Bitcoin OR Ethereum OR "crypto market") when:1d ' +
          "(site:bloomberg.com OR site:cnbc.com OR site:reuters.com OR site:coindesk.com)",
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "macro",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        '(inflation OR "interest rates" OR CPI OR GDP OR "jobs report") when:1d ' +
          "(site:bloomberg.com OR site:cnbc.com OR site:reuters.com OR site:ft.com)",
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
  {
    category: "trump",
    url:
      "https://news.google.com/rss/search?" +
      "q=" +
      encodeURIComponent(
        'Trump (stocks OR markets OR tariff OR economy OR Fed OR inflation OR trade OR "Truth Social") when:1d',
      ) +
      "&hl=en-US&gl=US&ceid=US:en",
  },
];

// No filtro político — Trump es parte del feed.
const EXCLUDE_KEYWORDS: RegExp | null = null;

function extractTag(block: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = re.exec(block);
  if (!m) return "";
  return m[1].trim().replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
}

function htmlToPlainText(html: string): string {
  return decodeEntities(html)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseRss(xml: string, category: NewsCategory): MarketNewsArticle[] {
  const items: MarketNewsArticle[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/g;
  let match: RegExpExecArray | null;
  let idx = 0;
  while ((match = itemRe.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, "title");
    const link = extractTag(block, "link");
    const pubDate = extractTag(block, "pubDate");
    const descHtml = extractTag(block, "description");
    const sourceRaw = extractTag(block, "source");
    if (!title || !link) continue;

    const descDecoded = decodeEntities(descHtml);
    const imgMatch = /<img[^>]+src=["']([^"']+)["']/i.exec(descDecoded);
    const imageUrl = imgMatch ? imgMatch[1] : null;
    const description = htmlToPlainText(descHtml).slice(0, 260);

    let source = sourceRaw;
    if (!source) {
      try {
        source = new URL(link).hostname.replace(/^www\./, "");
      } catch {
        source = "noticia";
      }
    }

    const id = `${category}-${idx}-${link.length}-${Date.parse(pubDate) || 0}`;
    const decodedTitle = decodeEntities(title);
    const impact: MarketNewsArticle["impact"] =
      HIGH_IMPACT_RE.test(decodedTitle) || HIGH_IMPACT_RE.test(description)
        ? "high"
        : "normal";
    items.push({
      id,
      title: decodedTitle,
      description,
      source: decodeEntities(source),
      url: link,
      pubDate,
      imageUrl,
      category,
      impact,
    });
    idx += 1;
  }
  return items;
}

async function fetchQuery(
  category: NewsCategory,
  url: string,
): Promise<MarketNewsArticle[]> {
  const startedAt = Date.now();
  try {
    const res = await fetchWithTimeout(
      url,
      {
        next: { revalidate: 1800 },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; InvestmentsMarcBot/1.0; +https://investmentsmarc.com)",
          Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        },
      },
      TIMEOUT_RSS,
    );
    if (!res.ok) {
      console.warn(
        `[marketNews] RSS ${category} HTTP ${res.status} in ${Date.now() - startedAt}ms`,
      );
      return [];
    }
    const xml = await res.text();
    const items = parseRss(xml, category);
    console.info(
      `[marketNews] RSS ${category} ok — ${items.length} items in ${Date.now() - startedAt}ms`,
    );
    return items;
  } catch (err) {
    console.warn(
      `[marketNews] RSS ${category} failed in ${Date.now() - startedAt}ms:`,
      err instanceof Error ? `${err.name}: ${err.message}` : String(err),
    );
    return [];
  }
}

// ---------- Image enrichment via Google News URL resolve + og:image ----------

async function resolveGoogleNewsUrl(googleUrl: string): Promise<string | null> {
  const isGoogleNews = /^https?:\/\/(www\.)?news\.google\.com\/(rss\/)?articles\//.test(
    googleUrl,
  );
  if (!isGoogleNews) return null;
  const idMatch = googleUrl.match(/\/articles\/([^?/]+)/);
  if (!idMatch) return null;
  const articleId = idMatch[1];

  let ts: string | null = null;
  let sg: string | null = null;
  try {
    const res = await fetchWithTimeout(
      googleUrl,
      {
        headers: {
          "User-Agent": BROWSER_UA,
          "Accept-Language": "en-US,en;q=0.9",
          Accept: "text/html",
        },
        redirect: "follow",
        next: { revalidate: 3600 },
      },
      TIMEOUT_RESOLVE,
    );
    if (!res.ok) return null;
    const html = await res.text();
    ts = html.match(/data-n-a-ts="(\d+)"/)?.[1] ?? null;
    sg = html.match(/data-n-a-sg="([^"]+)"/)?.[1] ?? null;
  } catch {
    return null;
  }
  if (!ts || !sg) return null;

  const inner = JSON.stringify([
    "garturlreq",
    [
      ["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1],
      "X",
      "X",
      1,
      [1, 1, 1],
      1,
      1,
      null,
      0,
      0,
      null,
      0,
    ],
    articleId,
    Number(ts),
    sg,
  ]);
  const envelope = JSON.stringify([[["Fbv4je", inner, null, "generic"]]]);
  const form = new URLSearchParams();
  form.set("f.req", envelope);

  try {
    const res = await fetchWithTimeout(
      "https://news.google.com/_/DotsSplashUi/data/batchexecute",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          "User-Agent": BROWSER_UA,
        },
        body: form.toString(),
        next: { revalidate: 3600 },
      },
      TIMEOUT_RESOLVE,
    );
    if (!res.ok) return null;
    const text = await res.text();
    // Find the first http(s) URL that isn't Google's own
    const urls = text.match(/https?:\/\/[^"\\,\]\s]+/g) ?? [];
    for (const u of urls) {
      if (/\bgoogle\.com\b/.test(u)) continue;
      if (/gstatic|googleusercontent|googleapis/.test(u)) continue;
      return u;
    }
    return null;
  } catch {
    return null;
  }
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /<meta\s+[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i,
    /<meta\s+[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i,
    /<meta\s+[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i,
  ];
  for (const re of patterns) {
    const m = re.exec(html);
    if (m) return decodeEntities(m[1]);
  }
  return null;
}

// Googlebot UA bypasses consent/datacenter gates on Yahoo, Reuters, etc.,
// and gets us clean og:image from <head>. Used only for meta extraction.
const META_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    let done = false;
    const t = setTimeout(() => {
      if (!done) {
        done = true;
        resolve(null);
      }
    }, ms);
    p.then(
      (v) => {
        if (done) return;
        done = true;
        clearTimeout(t);
        resolve(v);
      },
      () => {
        if (done) return;
        done = true;
        clearTimeout(t);
        resolve(null);
      },
    );
  });
}

async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        headers: {
          "User-Agent": META_UA,
          "Accept-Language": "en-US,en;q=0.9",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
        next: { revalidate: 3600 },
      },
      TIMEOUT_PUBLISHER,
    );
    if (!res.ok) return null;
    const chunk = (await res.text()).slice(0, 80_000);
    return extractOgImage(chunk);
  } catch {
    return null;
  }
}

/**
 * Verify an image URL is actually reachable & an image. Drops Yahoo/Reuters
 * paywall redirects that look like images but 403 in the browser.
 */
async function validateImageUrl(url: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(
      url,
      {
        method: "GET",
        headers: {
          "User-Agent": META_UA,
          Accept: "image/*,*/*;q=0.8",
          Range: "bytes=0-512",
        },
        redirect: "follow",
      },
      TIMEOUT_IMAGE_HEAD,
    );
    if (!res.ok && res.status !== 206) return false;
    const ct = res.headers.get("content-type") ?? "";
    return ct.startsWith("image/");
  } catch {
    return false;
  }
}

/**
 * Enrich one article with a real, validated og:image.
 * Returns null if the article can't be given a working image — caller drops it.
 */
async function enrichArticle(
  a: MarketNewsArticle,
): Promise<MarketNewsArticle | null> {
  const resolved = (await withTimeout(resolveGoogleNewsUrl(a.url), 6000)) ?? a.url;

  // Existing image from RSS (rare) — validate it
  if (a.imageUrl) {
    const ok = await withTimeout(validateImageUrl(a.imageUrl), 4000);
    if (ok) return { ...a, url: resolved };
  }

  // Fetch og:image from the publisher page
  const og = await withTimeout(fetchOgImage(resolved), 7000);
  if (!og) return null;

  const ok = await withTimeout(validateImageUrl(og), 4000);
  if (!ok) return null;

  return { ...a, imageUrl: og, url: resolved };
}

// --------------------------------------------------------------------

export async function getMarketNews(limit = 9): Promise<MarketNewsArticle[]> {
  try {
    return await getMarketNewsUnsafe(limit);
  } catch (err) {
    console.error("[marketNews] getMarketNews crashed:", err);
    return [];
  }
}

async function getMarketNewsUnsafe(limit: number): Promise<MarketNewsArticle[]> {
  const perCategory = await Promise.all(
    RSS_QUERIES.map((q) =>
      fetchQuery(q.category, q.url).catch((e) => {
        console.error(`[marketNews] RSS ${q.category} failed:`, e);
        return [] as MarketNewsArticle[];
      }),
    ),
  );

  // Bucket per category, sort by date desc, filter out politics
  const buckets: Record<NewsCategory, MarketNewsArticle[]> = {
    markets: [],
    earnings: [],
    tech: [],
    crypto: [],
    macro: [],
    trump: [],
  };
  RSS_QUERIES.forEach((q, i) => {
    const items = EXCLUDE_KEYWORDS
      ? perCategory[i].filter(
          (a) =>
            !EXCLUDE_KEYWORDS.test(a.title) && !EXCLUDE_KEYWORDS.test(a.description),
        )
      : perCategory[i];
    buckets[q.category].push(...items);
  });
  (Object.keys(buckets) as NewsCategory[]).forEach((k) => {
    buckets[k].sort(
      (a, b) => (Date.parse(b.pubDate) || 0) - (Date.parse(a.pubDate) || 0),
    );
  });

  // Round-robin across categories — pick MORE candidates than we need because
  // some will be dropped when their image can't be extracted/validated.
  const candidateCount = limit * 3;
  const categoryOrder: NewsCategory[] = [
    "markets",
    "trump",
    "earnings",
    "tech",
    "markets",
    "macro",
    "trump",
    "earnings",
    "crypto",
    "tech",
    "markets",
    "trump",
    "earnings",
    "tech",
    "markets",
    "crypto",
    "macro",
    "markets",
  ];
  const picked: MarketNewsArticle[] = [];
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const cursor: Record<NewsCategory, number> = {
    markets: 0,
    earnings: 0,
    tech: 0,
    crypto: 0,
    macro: 0,
    trump: 0,
  };

  const normalizeTitle = (t: string) =>
    t.toLowerCase().replace(/\s*-\s*[^-]+$/, "").trim().slice(0, 60);

  const tryPick = (cat: NewsCategory) => {
    while (cursor[cat] < buckets[cat].length) {
      const art = buckets[cat][cursor[cat]];
      cursor[cat] += 1;
      const tKey = normalizeTitle(art.title);
      if (seenUrls.has(art.url) || seenTitles.has(tKey)) continue;
      seenUrls.add(art.url);
      seenTitles.add(tKey);
      picked.push(art);
      return true;
    }
    return false;
  };

  let orderIdx = 0;
  while (picked.length < candidateCount) {
    const cat = categoryOrder[orderIdx % categoryOrder.length];
    orderIdx += 1;
    const exhausted = (Object.keys(buckets) as NewsCategory[]).every(
      (k) => cursor[k] >= buckets[k].length,
    );
    if (exhausted) break;
    if (!tryPick(cat)) continue;
  }
  // Fill from any remaining (safety)
  if (picked.length < candidateCount) {
    for (const cat of Object.keys(buckets) as NewsCategory[]) {
      while (cursor[cat] < buckets[cat].length && picked.length < candidateCount) {
        tryPick(cat);
      }
    }
  }

  // Parallel enrichment. null means we couldn't get a working image → drop.
  const enriched = await Promise.all(picked.map(enrichArticle));
  const withImages = enriched.filter((a): a is MarketNewsArticle => a !== null);

  // If we came up short on validated images, relax the rule just for
  // the tail so the feed is never empty.
  if (withImages.length < limit) {
    for (const a of enriched.map((_v, i) => picked[i])) {
      if (withImages.length >= limit) break;
      // Important: `withImages` may contain the *resolved* publisher URL
      // while `picked` still has the original Google News URL. Comparing by URL
      // can miss duplicates and produce repeated `id`s → React key collisions.
      const has = withImages.some((w) => w.id === a.id);
      if (!has) withImages.push(a);
    }
  }

  return withImages.slice(0, limit);
}
