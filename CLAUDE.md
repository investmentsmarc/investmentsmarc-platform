# Investments Marc Platform — Claude Code Instructions

## Contexto del Proyecto
Migración de `investmentsmarc.com` de WordPress + Blocksy a **Next.js 16 + Firebase**.
Referencia WordPress: `/Users/yoan/Documents/Code/MINE/marcinvestments`
Plan completo: ver `docs/phases/` o `../PLAN-MAESTRO.md`

## Stack
- **Framework**: Next.js 16.2.1 (App Router, TypeScript estricto — no `any`)
- **Estilos**: Tailwind CSS 4 + variables `--mi-*` en `globals.css`
- **Base de datos**: Firestore (ver schema en `docs/architecture/firebase-schema.md`)
- **CMS**: Sanity.io (blog, testimonios)
- **Pagos**: Stripe Checkout
- **Auth**: Firebase Auth
- **Fuente**: Inter via `next/font/google`

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
├── global/     # Header, Footer, TradingViewTicker, WhatsAppFloat, CookieBanner
├── ui/         # Badge, GoldButton, SectionTitle, RevealOnScroll (primitivos reutilizables)
├── home/       # HeroSection, LatestArticles, Testimonials
├── about/      # AboutBio, FlowTitanCards, ValuesGrid
├── calculators/# PositionSizeCalc, RiskRewardCalc, InvestmentCalc
├── blog/       # BlogCard, ArchiveGrid, PostHero
└── forms/      # LeadForm, WebinarForm, ContactForm, Countdown
```

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
