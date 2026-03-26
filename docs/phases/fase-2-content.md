# Fase 2 — Contenido y Legal

**Estado:** 🔲 PENDIENTE
**Semanas estimadas:** 3-4

## Objetivo
Blog operativo via Sanity, páginas legales y de contenido secundario.

## Entregables

### Blog (Sanity.io)
- [ ] Configurar Sanity Studio en `/sanity/`
- [ ] Schema de `post`: title, slug, excerpt, category, coverImage, body (Portable Text), publishedAt
- [ ] Migrar los 5 posts del WordPress original
- [ ] `app/blog/page.tsx` — archive grid con filtro de categorías (Análisis de Mercado + Trading Institucional)
- [ ] `app/blog/[slug]/page.tsx` — single post con `<PostHero />`
- [ ] `<BlogCard />` — usa `.mi-blog-card`
- [ ] `<ArchiveGrid />` — grid responsive
- [ ] `<PostHero />` — banner del post individual
- [ ] ISR (Incremental Static Regeneration): revalidar cada hora
- [ ] Schema.org `Article` en posts

### Legal
- [ ] `app/legal/privacidad/page.tsx` — Política de Privacidad
- [ ] `app/legal/terminos/page.tsx` — Términos de Uso
- [ ] Redirect 301: `/politica-de-privacidad` → `/legal/privacidad`
- [ ] Redirect 301: `/terminos-de-uso` → `/legal/terminos`

### FAQs (`/faqs/`)
- [ ] `<FAQAccordion />` — porta WP L1781-1818
- [ ] Schema.org `FAQPage`

### Links (`/links/`)
- [ ] Página Instagram link-in-bio (porta WP L2187-2270)

### WhatsApp (`/whatsapp/`)
- [ ] Página funnel de WhatsApp

### `<LatestArticles />` (completar Fase 1 placeholder)
- [ ] Query real a Sanity con las categorías correctas
- [ ] 3 posts más recientes en homepage

## Criterios de Aceptación
- [ ] 5 posts migrados y visibles en `/blog/`
- [ ] Filtro de categorías funciona (no muestra RSS imports)
- [ ] Páginas legales accesibles y con redirects 301
- [ ] FAQs accordion funciona en mobile
- [ ] Schema.org validado con Google Rich Results Test
