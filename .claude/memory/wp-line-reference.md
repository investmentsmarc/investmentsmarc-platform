---
type: reference
name: Referencia de líneas WordPress functions.php
description: Mapa de líneas del functions.php de WordPress para portar componentes a React
---

# WordPress → Next.js: Mapa de Líneas

**Fuente:** `/Users/yoan/Documents/Code/MINE/marcinvestments/wp-content/themes/blocksy-child/functions.php`
**Tamaño:** ~2,562 líneas

## Secciones por Línea

| Sección | Líneas | Componente Next.js | Prioridad |
|---------|--------|-------------------|-----------|
| Enqueue styles (Inter, Font Awesome) | 7-14 | `layout.tsx` | ✅ Hecho |
| TradingView Ticker widget | 15-45 | `<TradingViewTicker />` | Fase 1 |
| Hero & About Us sections | 47-194 | `<HeroSection />` `<AboutBio />` | Fase 1 |
| Global Theme Styles (CSS vars) | 258-270 | `globals.css` | ✅ Hecho |
| SEO Schema.org | 271-292 | `<JsonLd />` | Fase 1 |
| SEO Meta descriptions | 293-312 | `layout.tsx` metadata API | ✅ Hecho |
| Tools Hub layout | 313-466 | `app/herramientas/page.tsx` | Fase 1 |
| Position Size Calculator (`calcPS`) | 467-529 | `<PositionSizeCalc />` | Fase 1 |
| Risk/Reward Calculator (`calcRR`) | 530-566 | `<RiskRewardCalc />` | Fase 1 |
| Auto-create Pages (`mi_setup_pages`) | 567-616 | N/A (rutas en App Router) | N/A |
| Font Awesome CDN | 617-629 | `layout.tsx` head | ✅ Hecho |
| Investment Calculator (SPY/QQQ/VOO) | 503-729 | `<InvestmentCalc />` | Fase 1 |
| Blog section on homepage | 730-800 | `<LatestArticles />` | Fase 2 |
| Lead Form (curso-gratis) | 1247-1315 | `<LeadForm />` | Fase 3 |
| Webinar + Countdown | 1320-1432 | `<WebinarForm />` + `useCountdown` | Fase 3 |
| Testimonials | 1447-1488 | `<Testimonials />` | Fase 1 |
| Legal pages (Privacidad, Términos) | 1493-1693 | `app/legal/[slug]/page.tsx` | Fase 2 |
| FAQs Accordion | 1781-1818 | `<FAQAccordion />` | Fase 2 |
| Links page | 2187-2270 | `app/links/page.tsx` | Fase 2 |
| WhatsApp float button | 2364-2381 | `<WhatsAppFloat />` | Fase 1 |
| Cookie Banner | ~2400+ | `<CookieBanner />` | Fase 1 |

## JavaScript Inline a Portar

| Función WP | React equivalente | Notas |
|------------|-----------------|-------|
| `calcPS()` | `PositionSizeCalc` lógica interna | Mismos inputs/outputs |
| `calcRR()` | `RiskRewardCalc` lógica interna | Veredicto: Excelente/Bueno/Aceptable/Evitar |
| `nextWebinar()` + `update()` | `useCountdown` hook | Próximo sábado 8pm EST |
| `miAcceptCookies()` / `miRejectCookies()` | `useCookieConsent` hook | localStorage |
| `handleLeadForm(e)` | `LeadForm` onSubmit | localStorage → Firestore |
| `handleWebinarForm(e)` | `WebinarForm` onSubmit | localStorage → Firestore |
| `miSendContact(e)` | `ContactForm` onSubmit | → WhatsApp +18329534918 |
| FlowTitan card rotation JS | `useFlowTitanCarousel` hook | Rotación automática 3D |

## ETF Data (Investment Calculator)
Datos históricos hardcodeados en el JS original para: **SPY, QQQ, VOO**, y otros índices.
Al portar, mantener los mismos datos para que los outputs sean idénticos.
