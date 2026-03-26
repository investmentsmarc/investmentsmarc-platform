# ADR 001 — Next.js 16 + Firebase como stack principal

**Fecha:** 2026-03-26
**Estado:** Aceptado

## Contexto
El sitio actual corre en WordPress + Blocksy en Hostinger. Necesitamos un stack que permita:
- Plataforma de cursos propia (sin fee mensual de SaaS)
- Integración de agentes de IA
- Automatización de redes sociales
- Mejor performance y SEO que WordPress

## Decisión
Migrar a **Next.js 16 (App Router) + Firebase** (Hosting + Firestore + Auth + Functions).

## Razones

**Next.js 16:**
- SSR/SSG nativos → mejor SEO que SPA pura
- App Router con Server Components → menos JS en cliente
- `next/image`, `next/font` → Core Web Vitals optimizados out of the box
- React 19 con Server Actions para formularios
- Ecosistema enorme, soporte a largo plazo

**Firebase:**
- Costo: $0-15/mes vs $8-15/mes Hostinger actual
- Firestore: real-time, escalable, sin gestión de servidor
- Auth: email/Google login sin infraestructura
- Cloud Functions v2: backend serverless para webhooks
- Firebase Hosting: CDN global, SSL automático
- Todo en un mismo ecosistema → menos complejidad operacional

## Alternativas Descartadas
- **Supabase + Vercel:** Más complejo, dos vendedores, menos integración Auth-DB
- **Remix + PlanetScale:** Más verbose para este caso de uso
- **Astro:** No suficiente soporte para interactividad (calculadoras, cursos)

## Consecuencias
- Firebase vendor lock-in (aceptable dado el costo y simplicidad)
- Cloud Functions necesita Node.js — no multi-lenguaje
- Firestore tiene límites de nesting (max 100 subcolecciones, docs de 1MB)
