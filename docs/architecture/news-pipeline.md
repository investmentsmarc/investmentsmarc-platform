# News Pipeline — Market Pulse on the Home

Arquitectura del feed de noticias que alimenta la sección "Últimas Noticias" en la
home. Agrega fuentes premium (Bloomberg, CNBC, Yahoo Finance, Reuters, FT, CoinDesk)
en tiempo casi real, extrae el artículo completo y lo muestra inline en un modal —
el usuario nunca navega fuera del sitio.

## Visión general

```
┌────────────────────────────┐
│  LatestArticles (server)   │  ISR revalidate = 1800s (30 min)
│  await getMarketNews(9)    │
└────────────┬───────────────┘
             │
┌────────────▼─────────────────────────────────────────────────┐
│            src/lib/marketNews.ts (server-only)               │
│                                                              │
│  1. RSS fetch paralelo (5 categorías)                        │
│     → Google News RSS con dominio whitelisted                │
│  2. Round-robin + dedup (URL + título normalizado)           │
│  3. Filtro EXCLUDE_KEYWORDS (política)                       │
│  4. Enrich con og:image                                      │
│     ├─ resolveGoogleNewsUrl (batchexecute)                   │
│     ├─ fetchOgImage (Googlebot UA)                           │
│     └─ validateImageUrl (HEAD Range: 0-512, Content-Type)    │
│  5. Descarta artículos sin imagen válida                     │
│  6. Devuelve top N con URLs ya resueltas                     │
└────────────┬─────────────────────────────────────────────────┘
             │
┌────────────▼───────────────┐
│  NewsFeed (client)         │  Spotlight + queue layout
│  - Auto-rotate 8s           │
│  - Click → modal           │
│  - CSS keyframe animations │
└────────────┬───────────────┘
             │ (al abrir modal)
┌────────────▼────────────────────────────────────────────────┐
│     /api/market-news/article?url=...                        │
│                                                             │
│  1. resolveGoogleNewsUrl (si aún es Google URL)             │
│  2. fetchDirect (Googlebot UA)                              │
│     └─ buildArticleHtml (regex readability)                 │
│        Keep: <p> (>40 chars), <h1-6>, <ul/ol>, <blockquote>,│
│              <figure><img>. Inline: <a href>, <strong>, <em>│
│        Strip: scripts, styles, nav, footer, aside, iframes  │
│  3. Fallback: fetchViaJina (r.jina.ai) si lo anterior falla │
└─────────────────────────────────────────────────────────────┘
```

## 1 · RSS aggregation

**Fuente**: Google News RSS. 5 queries paralelas con filtros de dominio:

| Categoría | Keywords | Dominios |
|-----------|----------|----------|
| `markets`  | "stock market", "S&P 500", "Wall Street", "Federal Reserve" | bloomberg, cnbc, finance.yahoo, reuters, ft |
| `earnings` | earnings, "quarterly results", guidance | bloomberg, cnbc, finance.yahoo, reuters |
| `tech`     | NVIDIA, Apple, Microsoft, AI, chips, semiconductor | bloomberg, cnbc, reuters, finance.yahoo |
| `crypto`   | Bitcoin, Ethereum, "crypto market" | bloomberg, cnbc, reuters, coindesk |
| `macro`    | inflation, "interest rates", CPI, GDP, "jobs report" | bloomberg, cnbc, reuters, ft |

Todas con `when:1d` (últimas 24h).

**Round-robin** para variedad: en lugar de llenar 9 slots con artículos de una sola
categoría, `getMarketNews` alterna `[markets, earnings, tech, markets, macro, ...]`.

**Dedup por título normalizado** — Google News repite el mismo hecho en varios
outlets. Cada título se normaliza (quita sufijo ` - Fuente`, primeros 60 chars) y
se usa como clave de dedup.

**Filtro anti-política** (`EXCLUDE_KEYWORDS`): regex que descarta artículos con
`trump | truth social | maga | biden | harris | gop | democrat | republican` en
título o descripción. El feed es sobre mercados, no sobre política.

## 2 · Resolve de URLs ofuscadas

Google News entrega URLs tipo `https://news.google.com/rss/articles/CBMi<base64>?oc=5`.
El contenido del token es un ProtoBuf firmado; base64-decode por sí solo no da el URL
original. Hay dos pasos:

### 2a. Harvest de tokens

Fetch del URL de Google News con **Googlebot UA** devuelve HTML que contiene:

```html
<c-wiz data-n-a-id="<article_id>"
       data-n-a-ts="<timestamp>"
       data-n-a-sg="<signature>">
```

Regex-extract los 3 valores.

### 2b. Call a batchexecute

POST `https://news.google.com/_/DotsSplashUi/data/batchexecute` con cuerpo:

```
f.req=[[["Fbv4je", "[\"garturlreq\",[[\"X\",\"X\",...,\"US:en\",...],\"X\",\"X\",1,[1,1,1],1,1,null,0,0,null,0],\"<id>\",<ts>,\"<sg>\"]", null, "generic"]]]
```

La respuesta contiene el URL del publisher dentro del payload:

```
[[["wrb.fr","Fbv4je","[\"garturlres\",\"https://finance.yahoo.com/...\",1]",...]]]
```

Regex `/https?:\/\/[^"\\,\]\s]+/g` + filter descarta Google URLs → primer URL no-Google = URL real.

## 3 · Image enrichment

Google News RSS dejó de incluir imágenes en 2024. Por eso para cada artículo:

1. Resolver al URL del publisher (paso 2).
2. GET del URL con `User-Agent: Googlebot` — esto **bypasa consent walls** que
   Yahoo, Reuters, etc. muestran a usuarios con IP de datacenter.
3. Regex `og:image` / `twitter:image` en los primeros 80KB.
4. **HEAD Range: 0-512** al URL de imagen — valida `status 200|206` + `Content-Type: image/*`.
   Descarta imágenes que son realmente HTML de paywall.

Los artículos sin imagen validada son **descartados**. El feed pide `candidateCount = limit × 3`
para tener suficiente buffer.

## 4 · Article extraction (modal)

Cuando el usuario hace click en una card, el modal se abre en estado `loading` y
hace fetch a `/api/market-news/article?url=<encoded>`:

1. **`resolveGoogleNewsUrl`** — idempotente, si el URL ya es del publisher devuelve `null` rápido.
2. **`fetchDirect`** — GET con Googlebot UA, lee HTML.
   - Extrae `og:title`, `og:image`, `og:site_name`, `article:author`.
   - Encuentra `<article>` o `<main>` (si ocupa >400 chars), fallback al body.
   - `buildArticleHtml`: regex extractor que:
     - Elimina `<script>`, `<style>`, `<noscript>`, `<form>`, `<aside>`, `<footer>`,
       `<nav>`, `<iframe>`, `<svg>`, `<button>`, `<!-- comments -->`.
     - Captura `<p>/<h1-6>/<blockquote>/<figure>/<ul>/<ol>` en orden.
     - Dentro de cada párrafo: preserva `<a href>` (con `target="_blank" rel="noreferrer noopener"`),
       `<strong>`, `<em>`. Strip del resto.
     - Dedup por clave `tag:primeros-80-chars`.
     - Cap 120 bloques / 2500 palabras.
     - Descarta párrafos < 40 chars, headings < 8 chars.
3. **Fallback `fetchViaJina`** — `r.jina.ai/<url>`. Jina bloquea dominios abusados
   con 451 (`SecurityCompromiseError`) así que se revisa primero si la respuesta es
   un error JSON antes de parsear. Es solo red de seguridad.

El cliente renderiza el HTML devuelto con `dangerouslySetInnerHTML` dentro de `.mi-news-article`.
Es seguro porque el extractor solo produce tags whitelisted y los anchors llevan
`rel="noreferrer noopener"`.

## 5 · Cache

- **RSS (`fetchQuery`)**: `next.revalidate = 1800` (30 min) por query.
- **Google News page fetch** (harvest tokens): `revalidate = 3600` (1h).
- **batchexecute**: `revalidate = 3600`.
- **og:image fetch**: `revalidate = 3600`.
- **`/api/market-news`**: `Cache-Control: s-maxage=1800, stale-while-revalidate=900`.
- **`/api/market-news/article`**: `s-maxage=3600, stale-while-revalidate=1800`.

## 6 · Fallbacks

- RSS query falla → la categoría devuelve lista vacía; round-robin continúa.
- Google resolve falla → se usa el URL de Google sin resolver (imagen no se
  conseguirá pero el artículo sigue en el feed).
- og:image falla → artículo descartado, siguiente candidato toma su lugar.
- `validateImageUrl` rechaza → idem.
- Artículo específico falla extracción en modal → modal muestra descripción del
  RSS + botón "Abrir en la fuente" (external tab).
- Imagen remota 404 en browser → `onError` del `<img>` cambia a SVG placeholder
  categorizado (`placeholderFor(a.category)` — 5 variantes con diferentes gráficas
  oro + etiqueta de categoría).

## 7 · Layout

- **Spotlight hero** (izq, 1.4fr) — card grande con imagen full-bleed, scrim oscuro,
  glow dorado, badge "LIVE FEED" pulsante, título Sora, descripción, meta. Auto-rotate
  cada 8s entre los primeros 4 artículos. Fade out + fade in dramático via CSS
  animations (`mi-news-hero-in` / `mi-news-hero-out`, 0.65s / 0.5s). Pausa on-hover.
  Pager bars inferiores permiten salto manual.
- **Live queue** (der, 1fr) — lista "En el wire" con thumbnail cuadrado + título + source + time.
- **Modal** — overlay con backdrop-filter blur. Título + meta + contenido extraído +
  botones "Abrir en la fuente" (external) / "Cerrar".

Mobile: ambas columnas en vertical.

## 8 · Archivos

| Archivo | Responsabilidad |
|---------|----------------|
| [src/lib/marketNews.ts](../../src/lib/marketNews.ts) | RSS fetch, parse, round-robin, image enrichment. Export `getMarketNews()`. |
| [src/app/api/market-news/route.ts](../../src/app/api/market-news/route.ts) | HTTP endpoint wrapper de `getMarketNews(12)`. |
| [src/app/api/market-news/article/route.ts](../../src/app/api/market-news/article/route.ts) | Resolve + extract + Jina fallback. |
| [src/components/home/LatestArticles.tsx](../../src/components/home/LatestArticles.tsx) | Server component entry. |
| [src/components/home/NewsFeed.tsx](../../src/components/home/NewsFeed.tsx) | Client UI — spotlight + queue + modal. |
| [src/components/home/NewsSkeleton.tsx](../../src/components/home/NewsSkeleton.tsx) | Shimmer loader (Suspense fallback). |
