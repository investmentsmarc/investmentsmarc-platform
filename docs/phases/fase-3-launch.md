# Fase 3 — Lead Capture, Integraciones y Launch

**Estado:** 🔲 PENDIENTE
**Semanas estimadas:** 4-5

## Objetivo
Formularios conectados a Firestore, Cloud Functions activas, y deploy a producción.

## Entregables

### Lead Capture
- [ ] `<LeadForm />` — `/curso-gratis/` → escribe a Firestore `leads` (source: 'curso-gratis')
- [ ] `<WebinarForm />` — `/webinar/` → Firestore `leads` (source: 'webinar')
- [ ] `useCountdown` hook — cuenta regresiva al próximo sábado 8pm EST
- [ ] Migrar de `localStorage` a Firestore (eliminar la dependencia de localStorage)

### Cloud Functions (functions/src/)
- [ ] `onLeadCapture.ts` — trigger Firestore onCreate `leads`:
  - Envía WhatsApp a +18329534918 con datos del lead
  - Añade a ConvertKit (API key en env vars)
  - Actualiza `notifiedWhatsApp: true` y `notifiedConvertKit: true`
- [ ] `onWebinarRegister.ts` — trigger para leads source='webinar':
  - WhatsApp de confirmación al usuario
  - Email de confirmación
- [ ] Configurar `firebase.json` para deploy de Functions

### SEO y Redirects Completos
- [ ] Auditar todas las URLs de WordPress y añadir 301s en `next.config.ts`
- [ ] `next-sitemap` configurado y generando `sitemap.xml`
- [ ] Schema.org `WebSite` en homepage
- [ ] Schema.org `FinancialService` en homepage
- [ ] Verificar en Google Search Console

### Firebase Hosting Setup
- [ ] `firebase.json` con rewrites para Next.js
- [ ] `.github/workflows/deploy-firebase.yml` — CI/CD automático a `main`
- [ ] Preview channels para PRs (staging automático)

### DNS Cutover
- [ ] Deploy a Firebase Hosting
- [ ] Apuntar DNS de `investmentsmarc.com` a Firebase
- [ ] Verificar SSL automático
- [ ] Mantener Hostinger activo 30 días (rollback)

## Criterios de Aceptación
- [ ] Lead form escribe a Firestore y trigger Cloud Function
- [ ] WhatsApp recibe notificación en <30s después de submit
- [ ] Todos los 301 redirects verificados con `curl -I`
- [ ] `sitemap.xml` accesible en `/sitemap.xml`
- [ ] Firebase deploy exitoso, DNS propagado
- [ ] Lighthouse score > 90 en todas las páginas core
