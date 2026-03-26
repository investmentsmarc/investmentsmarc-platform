# Fase 0 — Setup Inicial

**Estado:** ✅ COMPLETADA (2026-03-26)
**Commit:** `427082f`

## Objetivo
Tener el proyecto base funcionando con el design system portado y la estructura lista para desarrollar.

## Entregables Completados

### Stack
- [x] Next.js 16.2.1 + React 19 + TypeScript estricto
- [x] Tailwind CSS 4 con `@theme inline` → utilities `bg-mi-primary`, `text-mi-gold`
- [x] Inter font via `next/font/google` (zero CLS)
- [x] Firebase SDK instalado, `src/lib/firebase.ts` con init lazy
- [x] Font Awesome 6.5 via CDN (head del layout)

### Design System
- [x] `src/app/globals.css` — todas las variables `--mi-*` portadas de WordPress
- [x] `src/styles/design-system.css` — glassmorphism, noise, glow, gradient borders, cards, forms, animaciones

### Estructura
- [x] `src/app/` con todas las rutas de Fases 1-4 creadas (directorios)
- [x] `src/components/{global,ui,home,about,calculators,blog,forms}`
- [x] `src/types/index.ts` — tipos: BlogPost, Course, Lesson, Enrollment, LeadFormData, Testimonial
- [x] `src/lib/firebase.ts`
- [x] `functions/src/agents/`
- [x] `sanity/`, `public/images/`

### Config
- [x] `next.config.ts` — remotePatterns + redirects 301 base
- [x] `CLAUDE.md` — instrucciones para Claude Code
- [x] `.claude/` — comandos, agentes, memoria persistida
- [x] `docs/` — arquitectura, design, guías, fases
- [x] `.env.local.example` — todas las variables documentadas
- [x] Git inicializado, primer commit limpio

### Build
- [x] `npm run build` — ✅ sin errores TypeScript
