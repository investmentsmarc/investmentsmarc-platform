---
type: project
name: investmentsmarc-platform — contexto general
description: Estado actual del proyecto, decisiones tomadas y contexto para retomar trabajo
---

# Contexto del Proyecto

## ¿Qué es esto?
Plataforma web de Marc Investments LLC. Migración de WordPress a Next.js 16 + Firebase.

**Dominio:** investmentsmarc.com
**Objetivo:** Academia de trading + FlowTitan PRO como producto estrella + cursos propios

## Estado por Fase

| Fase | Descripción | Estado |
|------|-------------|--------|
| 0 | Setup: Next.js 16 + Tailwind 4 + Firebase + Design System | ✅ Completa |
| 1 | Layout global + páginas core (Home, About, Herramientas) | 🔲 Pendiente |
| 2 | Blog (Sanity) + Legal + FAQs + Links | 🔲 Pendiente |
| 3 | Lead capture + Cloud Functions + Deploy Firebase | 🔲 Pendiente |
| 4 | Plataforma de cursos custom (Auth + Stripe + Firestore) | 🔲 Pendiente |
| 5 | AI & Automatización (agentes + Postiz API) | 🔲 Pendiente |

## Repos Relacionados
- **Este repo:** `investmentsmarc/investmentsmarc-platform` (Next.js)
- **WordPress (referencia):** `/Users/yoan/Documents/Code/MINE/marcinvestments` (branch: `feat/migration`)
- **Postiz (social):** VPS separado, deploy via `deploy-postiz.yml`
- **FlowTitan PRO:** VPS existente, sin cambios previstos

## Decisiones Clave Ya Tomadas
- Cursos: sistema **custom en Firebase** (no Teachable/Thinkific)
- Video: **Mux o Cloudflare Stream** (evaluar en Fase 4)
- Blog: **Sanity.io** free tier (100K req/mes)
- Pagos: **Stripe Checkout** (sin fee mensual)
- Email: **ConvertKit** para secuencias automatizadas
- Deploy: **Firebase Hosting** + GitHub Actions

## Contacto / Integraciones Activas
- WhatsApp central: **+18329534918** (todos los forms lo usan)
- Postiz: `social.investmentsmarc.com` (Docker + Temporal, ya operativo)
- FlowTitan: `flowtitan.investmentsmarc.com` (VPS, sin cambios)
