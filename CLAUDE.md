# Investments Marc Platform — Claude Code Instructions

## Contexto del Proyecto
Migración de `investmentsmarc.com` de WordPress + Blocksy a **Next.js 16 + Firebase**.
Referencia WordPress: `/Users/yoan/Documents/Code/MINE/marcinvestments`
Plan completo: ver `docs/phases/` o `../PLAN-MAESTRO.md`

## Stack
- **Framework**: Next.js 16.2.1 (App Router, TypeScript estricto — no `any`)
- **Estilos**: Tailwind CSS 4 + variables `--mi-*` en `globals.css`, efectos avanzados en `src/styles/design-system.css`
- **Base de datos**: Firestore (ver schema en `docs/architecture/firebase-schema.md`)
- **CMS**: Sanity.io (blog, testimonios)
- **Pagos**: Stripe Checkout
- **Auth**: Firebase Auth
- **Fuentes**: **Manrope** (body) + **Sora** (display) via `next/font/google` — `--font-mi-body` / `--font-mi-display`
- **Market data**: Yahoo Finance via `yahoo-finance2` (ticker + FlowTitan terminal)
- **News aggregator**: Google News RSS → batchexecute URL resolver → Googlebot-UA extractor (ver `docs/architecture/news-pipeline.md`)

## Reglas Absolutas (nunca romper)

### CSS / Design System
- **SIEMPRE** usar variables `--mi-*` — nunca hardcodear colores
- **SIEMPRE** usar prefijo `mi-` para clases custom de componentes
- Tailwind utilities para layout; CSS custom para efectos (glass, glow, 3D)
- Responsive obligatorio: **768px** y **1024px** (los únicos breakpoints)
- Efectos complejos van en `src/styles/design-system.css`, no en `globals.css`

### React / Next.js
- **Server Components** por defecto — `'use client'` solo cuando hay interactividad
- No `any` en TypeScript — tipos en `src/types/index.ts`
- Imports con alias `@/` — nunca rutas relativas largas (`../../`)
- No crear helpers para operaciones de una sola vez

### Firebase / Backend
- **Firestore** para datos transaccionales (leads, enrollments, progress)
- **Cloud Functions** para side-effects (email, WhatsApp, webhooks Stripe)
- **Sanity** para contenido editorial (blog, testimonios, FAQs)
- WhatsApp central: +18329534918

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`
- Nunca commitear `.env.local` — usar `.env.local.example` como referencia

## Estructura de Componentes
```
src/components/
├── global/     # Header, Footer, TradingViewTicker, WhatsAppFloat (gold chat-bubble),
│               # CookieBanner, SocialIcon (Instagram/YouTube/WhatsApp/TikTok SVG)
├── ui/         # FAQAccordion, FAQGrid, RevealController (CSS-timeline driven),
│               # PagePlaceholder
├── home/       # HeroSection (shader + terminal), TradingShader (WebGL + 2D FX,
│               # variant: "hero" | "global"), FlowTitanTerminal (Mag7 cycle),
│               # TradingStatusBar, LatestArticles (server — fetches via
│               # @/lib/marketNews), NewsFeed (spotlight hero + queue + modal),
│               # NewsSkeleton (shimmer while Suspense pending), Testimonials
├── about/      # AboutBio (justified text), FlowTitanCards (interactive terminal
│               # tour — stats + 6 tabs + cross-fade screenshots), ValuesGrid
│               # (watermark numbers + darken-on-hover)
├── calculators/# PositionSizeCalc, RiskRewardCalc, InvestmentCalc
├── blog/       # BlogCard, ArchiveGrid, PostHero (blog hidden from nav — the
│               # UI is live news, not MDX posts — kept for future re-enable)
└── forms/      # LeadForm, WebinarForm, ContactForm, Countdown
```

## Home Experience
El home es un **trading floor**: shader WebGL site-wide (`TradingShader variant="global"`
montado en `layout.tsx`) detrás de todo el contenido, con el hero mostrando una
terminal FlowTitan en vivo que cicla los Magnificent 7 del S&P 500 cada 9s. Una sola
atmósfera dorada continua atraviesa hero → noticias → testimonios → footer.

- **Shader global**: fragment WebGL con FBM noise oro + grid perspectiva + halo cursor +
  ghost OHLC chart (64 velas + SMA-8) y 2D overlay de flow lines + mesh de liquidez +
  scan beam + particles. Respeta `prefers-reduced-motion`.
- **Scroll reveal**: CSS-driven vía `animation-timeline: view()` con `@supports`. Sin
  mutación DOM → sin race de hidratación bajo Suspense streaming. `RevealController`
  solo setea `html.js-ready` para gate SSR/no-JS vs JS.

## News Pipeline
`LatestArticles` es server component con ISR 30 min. Pipeline completo documentado
en [docs/architecture/news-pipeline.md](docs/architecture/news-pipeline.md):

1. **RSS fetch** — 5 queries Google News paralelas (markets, earnings, tech, crypto,
   macro) desde Bloomberg/CNBC/Yahoo/Reuters/FT/CoinDesk. Filtro anti-política en título
   y descripción. Round-robin intercalado para variedad.
2. **URL resolve** — los links de Google News vienen ofuscados (`CBMi...` tokens). Se
   fetch-ea la página HTML para extraer `data-n-a-ts` + `data-n-a-sg` y se POSTea a
   `news.google.com/_/DotsSplashUi/data/batchexecute` con el signature → URL real.
3. **Image enrichment** — cada artículo: fetch de la URL resuelta con **User-Agent
   Googlebot** (bypass de consent walls de Yahoo/Reuters), extrae `og:image` o
   `twitter:image`. Valida que responde 200 + `Content-Type: image/*` via HEAD parcial.
   Si no cumple: artículo descartado; hay 3× buffer de candidatos para reemplazar.
4. **Modal inline** — click en card → `/api/market-news/article?url=...` resuelve el
   redirect + extractor propio (regex readability — keep `<p>/<h*>/<ul>/<figure>`,
   strip scripts/styles/nav/footer). Fallback a `r.jina.ai` si extractor falla.

## FlowTitan PRO CTA
Todos los enlaces "FlowTitan PRO" redirigen a
`https://flowtitan.investmentsmarc.com` en nueva pestaña (3 puntos: Hero ghost button,
About-us CTA, Footer Educación).

## Portado desde WordPress
Todos los componentes tienen referencia de línea en `docs/architecture/wp-reference.md`.
Fuente: `/Users/yoan/Documents/Code/MINE/marcinvestments/wp-content/themes/blocksy-child/functions.php`

## Comandos Disponibles
Ver `.claude/commands/` para slash commands del proyecto:
- `/new-component` — scaffold de componente con design system
- `/new-page` — scaffold de página App Router
- `/port-wp` — portar componente PHP → React
- `/design-audit` — auditoría de design system en un archivo
- `/firebase-schema` — diseño de colección Firestore
