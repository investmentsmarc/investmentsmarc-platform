import { NextResponse } from "next/server";

type ExtractedArticle = {
  title: string | null;
  html: string;
  imageUrl: string | null;
  byline: string | null;
  siteName: string | null;
  sourceUrl: string;
};

/**
 * Minimal Markdown → HTML converter.
 * Escapes raw HTML first so any <script> etc. in the input is neutralized.
 */
function markdownToHtml(md: string): string {
  // 1. escape raw HTML
  let html = md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // 2. fenced code blocks ``` ... ```
  html = html.replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code.trim()}</code></pre>`);

  // 3. images  ![alt](src)   — do before links
  html = html.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_, alt, src) => `<img src="${src}" alt="${alt}" loading="lazy" />`,
  );

  // 4. links  [text](href)
  html = html.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (_, text, href) =>
      `<a href="${href}" target="_blank" rel="noreferrer noopener">${text}</a>`,
  );

  // 5. headings
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // 6. blockquotes
  html = html.replace(/^>\s?(.+)$/gm, "<blockquote>$1</blockquote>");

  // 7. bold & italic
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\b_([^_]+)_\b/g, "<em>$1</em>");
  html = html.replace(/(^|[\s(])\*([^*]+)\*/g, "$1<em>$2</em>");

  // 8. unordered lists (simple: group consecutive "- " or "* " lines)
  html = html.replace(/(?:^[-*]\s+.+(?:\n|$))+/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((line) => line.replace(/^[-*]\s+/, "").trim())
      .filter(Boolean)
      .map((it) => `<li>${it}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // 9. split into paragraphs by double newlines
  const blocks = html
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) => {
      if (/^<(h[1-6]|ul|ol|img|blockquote|pre|figure|p)\b/i.test(b)) return b;
      return `<p>${b.replace(/\n/g, "<br/>")}</p>`;
    });

  return blocks.join("\n");
}

function extractField(md: string, key: string): string | null {
  const re = new RegExp(`^${key}:\\s*(.+)$`, "mi");
  const m = re.exec(md);
  return m ? m[1].trim() : null;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/**
 * Resolve a Google News article URL (rss/articles/<token>?oc=5) to the
 * original publisher URL by calling Google's internal batchexecute endpoint.
 * Returns null if the URL isn't a Google News URL or resolution fails.
 */
async function resolveGoogleNewsUrl(googleUrl: string): Promise<string | null> {
  const isGoogleNews = /^https?:\/\/(www\.)?news\.google\.com\/(rss\/)?articles\//.test(
    googleUrl,
  );
  if (!isGoogleNews) return null;

  const idMatch = googleUrl.match(/\/articles\/([^?/]+)/);
  if (!idMatch) return null;
  const articleId = idMatch[1];

  // Step 1: fetch the Google News article page to harvest ts + sg signatures
  let ts: string | null = null;
  let sg: string | null = null;
  try {
    const pageRes = await fetch(googleUrl, {
      headers: {
        "User-Agent": BROWSER_UA,
        "Accept-Language": "en-US,en;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      next: { revalidate: 3600 },
    });
    if (!pageRes.ok) return null;
    const html = await pageRes.text();
    const tsMatch = html.match(/data-n-a-ts="(\d+)"/);
    const sgMatch = html.match(/data-n-a-sg="([^"]+)"/);
    ts = tsMatch ? tsMatch[1] : null;
    sg = sgMatch ? sgMatch[1] : null;
  } catch {
    return null;
  }
  if (!ts || !sg) return null;

  // Step 2: POST to batchexecute with the signed payload
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

  let apiText: string;
  try {
    const apiRes = await fetch(
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
    );
    if (!apiRes.ok) return null;
    apiText = await apiRes.text();
  } catch {
    return null;
  }

  // Pick the first non-Google URL in the response
  const urls = apiText.match(/https?:\/\/[^"\\,\]\s]+/g) ?? [];
  for (const u of urls) {
    if (/\bgoogle\.com\b/.test(u)) continue;
    if (/gstatic|googleusercontent|googleapis/.test(u)) continue;
    return u;
  }
  return null;
}

function decodeEntitiesLocal(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&([a-zA-Z]+);/g, (m) => m); // leave named entities we don't handle
}

function metaContent(html: string, property: string): string | null {
  // matches <meta property="og:xxx" content="..."> OR name="..."
  const re = new RegExp(
    `<meta\\s+(?:[^>]*\\b)?(?:property|name)=["']${property}["'][^>]*\\bcontent=["']([^"']+)["']`,
    "i",
  );
  const m = re.exec(html);
  if (m) return decodeEntitiesLocal(m[1]);
  // also try the reverse attribute order
  const re2 = new RegExp(
    `<meta\\s+[^>]*\\bcontent=["']([^"']+)["'][^>]*(?:property|name)=["']${property}["']`,
    "i",
  );
  const m2 = re2.exec(html);
  return m2 ? decodeEntitiesLocal(m2[1]) : null;
}

function stripNoise(html: string): string {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript\b[\s\S]*?<\/noscript>/gi, "")
    .replace(/<form\b[\s\S]*?<\/form>/gi, "")
    .replace(/<aside\b[\s\S]*?<\/aside>/gi, "")
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, "")
    .replace(/<nav\b[\s\S]*?<\/nav>/gi, "")
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, "")
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, "")
    .replace(/<button\b[\s\S]*?<\/button>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
}

function extractArticleBody(html: string): string {
  // Prefer <article>, fall back to <main>, fall back to full body
  const articleMatch = /<article\b[^>]*>([\s\S]*?)<\/article>/i.exec(html);
  if (articleMatch && articleMatch[1].length > 400) return articleMatch[1];
  const mainMatch = /<main\b[^>]*>([\s\S]*?)<\/main>/i.exec(html);
  if (mainMatch && mainMatch[1].length > 400) return mainMatch[1];
  return html;
}

/**
 * Extract a clean article from raw HTML: keep paragraphs (>40 chars),
 * mid-article headings, and inline images. Everything else is dropped.
 */
function buildArticleHtml(rawHtml: string): { html: string; words: number } {
  const cleaned = stripNoise(rawHtml);
  const body = extractArticleBody(cleaned);

  const blocks: string[] = [];
  const seen = new Set<string>();
  const re = /<(p|h[1-6]|blockquote|figure|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m: RegExpExecArray | null;
  let words = 0;

  while ((m = re.exec(body)) !== null) {
    const tag = m[1].toLowerCase();
    const innerRaw = m[2];

    // Keep images inside figures
    if (tag === "figure") {
      const imgMatch = /<img\b[^>]*\bsrc=["']([^"']+)["']/i.exec(innerRaw);
      if (!imgMatch) continue;
      const src = imgMatch[1];
      if (src.startsWith("data:") || /sprite|icon|logo|pixel|1x1|avatar/i.test(src))
        continue;
      const altMatch = /\balt=["']([^"']*)["']/i.exec(imgMatch[0]);
      const alt = altMatch ? decodeEntitiesLocal(altMatch[1]) : "";
      const capMatch = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i.exec(innerRaw);
      const caption = capMatch
        ? decodeEntitiesLocal(capMatch[1].replace(/<[^>]+>/g, "").trim())
        : "";
      const figId = `fig:${src}`;
      if (seen.has(figId)) continue;
      seen.add(figId);
      blocks.push(
        `<figure><img src="${src}" alt="${alt}" loading="lazy" />${
          caption ? `<figcaption>${caption}</figcaption>` : ""
        }</figure>`,
      );
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      // keep list with its <li> items, strip attrs
      const itemRe = /<li\b[^>]*>([\s\S]*?)<\/li>/gi;
      const items: string[] = [];
      let lm: RegExpExecArray | null;
      while ((lm = itemRe.exec(innerRaw)) !== null) {
        const itemText = decodeEntitiesLocal(
          lm[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
        );
        if (itemText.length > 3) items.push(`<li>${itemText}</li>`);
      }
      if (items.length > 0) blocks.push(`<${tag}>${items.join("")}</${tag}>`);
      continue;
    }

    // p / h* / blockquote
    // Preserve inline <a>, <strong>, <em> links
    let inner = innerRaw
      // keep anchors but sanitize
      .replace(
        /<a\b[^>]*\bhref=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
        (_all, href, text) => {
          const safeText = text.replace(/<[^>]+>/g, "").trim();
          if (!/^https?:\/\//i.test(href)) return safeText;
          return `<a href="${href}" target="_blank" rel="noreferrer noopener">${safeText}</a>`;
        },
      )
      .replace(/<(strong|b)\b[^>]*>([\s\S]*?)<\/\1>/gi, "<strong>$2</strong>")
      .replace(/<(em|i)\b[^>]*>([\s\S]*?)<\/\1>/gi, "<em>$2</em>")
      .replace(/<br\s*\/?>/gi, " ")
      // now strip any other tags
      .replace(/<(?!\/?(a|strong|em)\b)[^>]+>/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    inner = decodeEntitiesLocal(inner);

    if (!inner) continue;

    const textOnly = inner.replace(/<[^>]+>/g, "");
    const dedupKey = `${tag}:${textOnly.slice(0, 80)}`;
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    if (tag === "p" && textOnly.length < 40) continue;
    if (/^h[1-6]$/.test(tag) && textOnly.length < 8) continue;
    if (tag === "blockquote" && textOnly.length < 20) continue;

    words += textOnly.split(/\s+/).length;
    blocks.push(`<${tag}>${inner}</${tag}>`);

    if (blocks.length > 120 || words > 2500) break;
  }

  return { html: blocks.join("\n"), words };
}

// Googlebot UA bypasses consent/datacenter walls on Yahoo, Reuters, etc.
const GOOGLEBOT_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

async function fetchDirect(url: string): Promise<ExtractedArticle | null> {
  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": GOOGLEBOT_UA,
        "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      redirect: "follow",
      next: { revalidate: 3600 },
    });
  } catch {
    return null;
  }
  if (!res.ok) return null;

  // follow-through: if the server redirected, use the final URL
  const finalUrl = res.url || url;
  const html = await res.text();

  const title =
    metaContent(html, "og:title") ??
    metaContent(html, "twitter:title") ??
    (() => {
      const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
      return m ? decodeEntitiesLocal(m[1]).trim() : null;
    })();
  const imageUrl =
    metaContent(html, "og:image") ?? metaContent(html, "twitter:image");
  const byline =
    metaContent(html, "author") ??
    metaContent(html, "article:author") ??
    metaContent(html, "twitter:creator");
  const siteName = metaContent(html, "og:site_name");

  const { html: articleHtml, words } = buildArticleHtml(html);
  if (!articleHtml || words < 60) return null;

  return {
    title,
    html: articleHtml,
    imageUrl,
    byline,
    siteName,
    sourceUrl: finalUrl,
  };
}

// Jina AI Reader fallback — kept as a thin safety net in case our own extractor
// can't parse a page (e.g. heavy SPA). Jina frequently blocks finance domains
// with 451 though, so fetchDirect is preferred.
async function fetchViaJina(url: string): Promise<ExtractedArticle | null> {
  try {
    const res = await fetch(`https://r.jina.ai/${url}`, {
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "text/plain",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const raw = await res.text();
    if (raw.startsWith("{") && raw.includes("SecurityCompromiseError")) return null;
    const title = extractField(raw, "Title");
    const siteName = extractField(raw, "Site");
    const byline = extractField(raw, "Author");
    const image = extractField(raw, "Image");
    const urlSrc = extractField(raw, "URL Source");
    const idx = raw.indexOf("Markdown Content:");
    let md = idx >= 0 ? raw.slice(idx + "Markdown Content:".length).trim() : raw;
    md = md.replace(/\n\n---+\n[\s\S]*$/, "").trim();
    if (md.length > 60_000) md = md.slice(0, 60_000);
    const html = markdownToHtml(md);
    if (!html || html.length < 80) return null;
    return {
      title: title ?? null,
      html,
      imageUrl: image ?? null,
      byline: byline ?? null,
      siteName: siteName ?? null,
      sourceUrl: urlSrc ?? url,
    };
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    new URL(target); // validate
  } catch {
    return NextResponse.json({ error: "Invalid url" }, { status: 400 });
  }

  try {
    const resolved = (await resolveGoogleNewsUrl(target)) ?? target;

    // Prefer our own extractor (fetchDirect). Jina is a secondary fallback
    // but often blocks high-traffic finance domains with 451.
    const article =
      (await fetchDirect(resolved)) ?? (await fetchViaJina(resolved));

    if (!article) {
      return NextResponse.json(
        { error: "Could not extract", sourceUrl: resolved },
        { status: 502 },
      );
    }
    return NextResponse.json(
      { ...article, sourceUrl: article.sourceUrl || resolved },
      {
        headers: {
          "Cache-Control": "s-maxage=3600, stale-while-revalidate=1800",
        },
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: msg, sourceUrl: target }, { status: 500 });
  }
}
