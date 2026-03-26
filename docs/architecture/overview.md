# Arquitectura del Sistema — Investments Marc Platform

## Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                        │
│  Next.js 16 React 19 · Tailwind 4 · Inter font             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼────────────────────────────────────┐
│              Firebase Hosting (CDN Global)                   │
│         investmentsmarc.com · SSL automático                │
└──────┬──────────────────┬─────────────────┬─────────────────┘
       │                  │                 │
┌──────▼──────┐  ┌────────▼──────┐  ┌──────▼──────────────┐
│  Firestore  │  │  Firebase     │  │   Cloud Functions   │
│  (Database) │  │  Auth         │  │   v2 (Backend)      │
│             │  │  Email/Google │  │   - Lead capture    │
│  leads      │  └───────────────┘  │   - Stripe webhook  │
│  courses    │                     │   - WhatsApp notif  │
│  enrollments│  ┌───────────────┐  │   - ConvertKit      │
│  progress   │  │  Firebase     │  └──────┬──────────────┘
└─────────────┘  │  Storage      │         │
                 │  (Images)     │  ┌──────▼──────────────┐
                 └───────────────┘  │   Stripe Checkout   │
                                    │   (Pagos cursos)    │
┌───────────────────────────────────└─────────────────────┘
│
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│  │  Sanity.io   │  │  ConvertKit  │  │  TradingView     │
│  │  (Blog CMS)  │  │  (Email mkt) │  │  (Ticker widget) │
│  └──────────────┘  └──────────────┘  └──────────────────┘
└─────────────────────────────────────────────────────────────
```

## Flujos Principales

### 1. Visita al Homepage
```
Browser → Firebase CDN → Next.js SSG page → [Sanity API para blog preview]
```
La homepage es estática (SSG), los posts del blog se revalidan cada hora (ISR).

### 2. Lead Capture (Curso Gratis / Webinar)
```
Usuario llena form → Client Component → Firestore `leads` collection
→ Cloud Function onLeadCapture triggers →
  → WhatsApp API (+18329534918)
  → ConvertKit API (añadir a lista)
```

### 3. Compra de Curso (Fase 4)
```
Usuario → /cursos/{slug} → "Comprar" button
→ API Route /api/stripe/checkout → Stripe Checkout Session
→ Stripe hosted page → pago
→ Stripe Webhook → Cloud Function stripeWebhook
→ Crear enrollment en Firestore
→ Email bienvenida vía ConvertKit
→ Redirect a /cursos/{slug}/lecciones/
```

### 4. Ver Lección (Fase 4)
```
Usuario autenticado → /cursos/{slug}/lecciones/{id}
→ Firebase Auth check (enrollment válido)
→ Mux/Cloudflare Stream video player
→ Al completar → Progress update en Firestore
→ Si todas completadas → Cloud Function generateCertificate
```

## Decisiones de Arquitectura
Ver `docs/architecture/adr/` para el historial completo de ADRs.

| # | Decisión | Elegido | Alternativas descartadas |
|---|----------|---------|--------------------------|
| 001 | Framework web | Next.js 16 | Remix, Astro, Nuxt |
| 002 | Base de datos | Firestore | PlanetScale, Supabase |
| 003 | CMS Blog | Sanity.io | Contentful, MDX files |
| 004 | Plataforma cursos | Custom Firebase | Teachable, Thinkific |
| 005 | Video hosting | Mux (evaluar) | YouTube unlisted, Vimeo |
| 006 | Pagos | Stripe Checkout | PayPal, Paddle |
| 007 | Email marketing | ConvertKit | Mailchimp, Resend |
