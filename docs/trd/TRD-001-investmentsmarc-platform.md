# TRD-001 — Investments Marc Platform

> Technical Requirements Document
> Proyecto: Migración investmentsmarc.com (WordPress → Next.js + Firebase)
> Versión: 1.0 | Fecha: 2026-03-26
> Estado: APROBADO

---

## 1. Resumen Ejecutivo

Migrar `investmentsmarc.com` de WordPress + Blocksy (Hostinger) a **Next.js 16 + Firebase**, creando una plataforma unificada que combine sitio corporativo, blog, herramientas de trading, lead capture, plataforma de cursos custom y agentes de IA.

### 1.1 Objetivos de Negocio


| #     | Objetivo                                                               | Métrica de Éxito                                        |
| ----- | ---------------------------------------------------------------------- | ------------------------------------------------------- |
| OBJ-1 | Posicionar investmentsmarc.com como referente en trading institucional | Tráfico orgánico +50% en 6 meses post-migración         |
| OBJ-2 | Monetizar conocimiento via plataforma de cursos propia                 | Primera venta de curso dentro de 8 semanas              |
| OBJ-3 | Automatizar captura y nurturing de leads                               | 100% de leads en Firestore + notificación WhatsApp <30s |
| OBJ-4 | Eliminar dependencia de SaaS externos para cursos                      | $0 fee mensual de plataforma de cursos                  |
| OBJ-5 | Habilitar integraciones de IA y automatización social                  | Endpoints listos para agentes IA en semana 8+           |


### 1.2 Restricciones


| Restricción         | Detalle                                                                     |
| ------------------- | --------------------------------------------------------------------------- |
| Presupuesto hosting | $0-15/mes (Firebase free/Blaze tier)                                        |
| Continuidad visual  | Identidad dark/gold (`--mi-`*) debe ser idéntica al WordPress actual        |
| SEO                 | Cero pérdida de posiciones — 301 redirects obligatorios para todas las URLs |
| WhatsApp            | Canal principal de comunicación: +18329534918                               |
| Rollback            | Hostinger activo 30 días post-migración                                     |


---

## 2. Actores del Sistema


| Actor          | Descripción                                         | Autenticación                              |
| -------------- | --------------------------------------------------- | ------------------------------------------ |
| **Visitante**  | Usuario anónimo navegando el sitio                  | Ninguna                                    |
| **Lead**       | Visitante que registra email/datos en un formulario | Ninguna (datos en Firestore)               |
| **Estudiante** | Usuario autenticado con al menos 1 enrollment       | Firebase Auth (email/Google)               |
| **Admin**      | Marc (dueño del sitio)                              | Firebase Auth + Custom Claim `admin: true` |
| **Sistema**    | Cloud Functions, webhooks, cron jobs                | Service Account Firebase                   |


---

## 3. Requisitos Funcionales

### 3.1 RF — Sitio Público (Fases 1-2)


| ID     | Requisito                                                                                         | Prioridad | Fase | Spec                                             | Caso de Uso                                                  |
| ------ | ------------------------------------------------------------------------------------------------- | --------- | ---- | ------------------------------------------------ | ------------------------------------------------------------ |
| RF-001 | Layout global con TradingView ticker, header glassmorphic, footer, WhatsApp float y cookie banner | MUST      | 1    | [SPEC-001](../specs/SPEC-001-layout-global.md)   | [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)      |
| RF-002 | Homepage con hero section, blog preview (3 posts) y testimonios                                   | MUST      | 1    | [SPEC-002](../specs/SPEC-002-home-page.md)       | [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)      |
| RF-003 | Página About Us con bio, FlowTitan 3D cards y values grid                                         | MUST      | 1    | [SPEC-003](../specs/SPEC-003-about-page.md)      | [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)      |
| RF-004 | Hub de herramientas con 3 calculadoras funcionales (Position Size, Risk/Reward, Investment)       | MUST      | 1    | [SPEC-004](../specs/SPEC-004-calculadoras.md)    | [UC-002](../use-cases/UC-002-visitante-usa-calculadora.md)   |
| RF-005 | Página de contacto con redirect a WhatsApp                                                        | MUST      | 1    | [SPEC-001](../specs/SPEC-001-layout-global.md)   | [UC-010](../use-cases/UC-010-visitante-contacta-whatsapp.md) |
| RF-006 | Blog con Sanity CMS: archive grid, filtro de categorías, single post                              | MUST      | 2    | [SPEC-005](../specs/SPEC-005-blog-sanity.md)     | [UC-003](../use-cases/UC-003-visitante-lee-blog.md)          |
| RF-007 | 5 posts existentes migrados desde WordPress                                                       | MUST      | 2    | [SPEC-005](../specs/SPEC-005-blog-sanity.md)     | [UC-003](../use-cases/UC-003-visitante-lee-blog.md)          |
| RF-008 | Páginas legales: Política de Privacidad y Términos de Uso                                         | MUST      | 2    | [SPEC-006](../specs/SPEC-006-paginas-legales.md) | [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)      |
| RF-009 | FAQ con accordion interactivo                                                                     | MUST      | 2    | [SPEC-006](../specs/SPEC-006-paginas-legales.md) | [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)      |
| RF-010 | Página Links (Instagram link-in-bio)                                                              | SHOULD    | 2    | [SPEC-006](../specs/SPEC-006-paginas-legales.md) | —                                                            |
| RF-011 | Página WhatsApp funnel                                                                            | SHOULD    | 2    | [SPEC-006](../specs/SPEC-006-paginas-legales.md) | [UC-010](../use-cases/UC-010-visitante-contacta-whatsapp.md) |


### 3.2 RF — Lead Capture & Integraciones (Fase 3)


| ID     | Requisito                                                              | Prioridad | Fase | Spec                                             | Caso de Uso                                                 |
| ------ | ---------------------------------------------------------------------- | --------- | ---- | ------------------------------------------------ | ----------------------------------------------------------- |
| RF-012 | Formulario lead magnet `/curso-gratis/` que persiste en Firestore      | MUST      | 3    | [SPEC-007](../specs/SPEC-007-lead-capture.md)    | [UC-004](../use-cases/UC-004-lead-registro-curso-gratis.md) |
| RF-013 | Formulario webinar `/webinar/` con countdown al próximo sábado 8pm EST | MUST      | 3    | [SPEC-007](../specs/SPEC-007-lead-capture.md)    | [UC-005](../use-cases/UC-005-lead-registro-webinar.md)      |
| RF-014 | Cloud Function `onLeadCapture`: WhatsApp + ConvertKit al crear lead    | MUST      | 3    | [SPEC-010](../specs/SPEC-010-cloud-functions.md) | [UC-004](../use-cases/UC-004-lead-registro-curso-gratis.md) |
| RF-015 | Cloud Function `onWebinarRegister`: confirmación WhatsApp + email      | MUST      | 3    | [SPEC-010](../specs/SPEC-010-cloud-functions.md) | [UC-005](../use-cases/UC-005-lead-registro-webinar.md)      |
| RF-016 | 301 redirects para todas las URLs de WordPress                         | MUST      | 3    | [SPEC-008](../specs/SPEC-008-seo-redirects.md)   | —                                                           |
| RF-017 | Sitemap.xml generado automáticamente                                   | MUST      | 3    | [SPEC-008](../specs/SPEC-008-seo-redirects.md)   | —                                                           |
| RF-018 | Schema.org (FinancialService, Article, WebSite, FAQPage)               | MUST      | 3    | [SPEC-008](../specs/SPEC-008-seo-redirects.md)   | —                                                           |
| RF-019 | Deploy a Firebase Hosting + DNS cutover                                | MUST      | 3    | [SPEC-008](../specs/SPEC-008-seo-redirects.md)   | —                                                           |


### 3.3 RF — Plataforma de Cursos (Fase 4)


| ID     | Requisito                                                            | Prioridad | Fase | Spec                                               | Caso de Uso                                                     |
| ------ | -------------------------------------------------------------------- | --------- | ---- | -------------------------------------------------- | --------------------------------------------------------------- |
| RF-020 | Autenticación de estudiantes (email + Google login)                  | MUST      | 4    | [SPEC-009](../specs/SPEC-009-auth-sistema.md)      | [UC-006](../use-cases/UC-006-estudiante-registro-login.md)      |
| RF-021 | Catálogo de cursos en `/cursos/` con cards y filtros                 | MUST      | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)        |
| RF-022 | Landing de curso `/cursos/[slug]/` con descripción, temario y precio | MUST      | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)        |
| RF-023 | Compra de curso via Stripe Checkout                                  | MUST      | 4    | [SPEC-012](../specs/SPEC-012-stripe-pagos.md)      | [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)        |
| RF-024 | Stripe webhook `checkout.session.completed` → crear enrollment       | MUST      | 4    | [SPEC-012](../specs/SPEC-012-stripe-pagos.md)      | [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)        |
| RF-025 | Reproductor de video por lección (Mux o Cloudflare Stream)           | MUST      | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-008](../use-cases/UC-008-estudiante-cursa-leccion.md)       |
| RF-026 | Tracking de progreso por lección en Firestore                        | MUST      | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-008](../use-cases/UC-008-estudiante-cursa-leccion.md)       |
| RF-027 | Sistema de quizzes por lección                                       | SHOULD    | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-009](../use-cases/UC-009-estudiante-completa-quiz.md)       |
| RF-028 | Dashboard de progreso del estudiante                                 | MUST      | 4    | [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | [UC-008](../use-cases/UC-008-estudiante-cursa-leccion.md)       |
| RF-029 | Certificado PDF al completar curso (Cloud Function)                  | SHOULD    | 4    | [SPEC-010](../specs/SPEC-010-cloud-functions.md)   | [UC-011](../use-cases/UC-011-estudiante-obtiene-certificado.md) |
| RF-030 | Panel admin para gestionar cursos y lecciones                        | MUST      | 4    | [SPEC-013](../specs/SPEC-013-admin-panel.md)       | [UC-012](../use-cases/UC-012-admin-gestiona-cursos.md)          |


### 3.4 RF — AI & Automatización (Fase 5)


| ID     | Requisito                                  | Prioridad | Fase | Spec | Caso de Uso |
| ------ | ------------------------------------------ | --------- | ---- | ---- | ----------- |
| RF-031 | Endpoints Cloud Functions para agentes IA  | COULD     | 5    | —    | —           |
| RF-032 | Integración Postiz API (social scheduling) | COULD     | 5    | —    | —           |
| RF-033 | ManyChat webhook (DM automation Instagram) | COULD     | 5    | —    | —           |
| RF-034 | Dashboard analytics admin                  | COULD     | 5    | —    | —           |


---

## 4. Requisitos No Funcionales

### 4.1 Rendimiento


| ID      | Requisito                               | Métrica                                |
| ------- | --------------------------------------- | -------------------------------------- |
| RNF-001 | Lighthouse Performance score            | > 90 en todas las páginas              |
| RNF-002 | Time to First Byte (TTFB)               | < 200ms via Firebase CDN               |
| RNF-003 | Largest Contentful Paint (LCP)          | < 2.5s                                 |
| RNF-004 | Cumulative Layout Shift (CLS)           | < 0.1 (Inter via next/font = zero CLS) |
| RNF-005 | Notificación WhatsApp tras lead capture | < 30 segundos                          |


### 4.2 Seguridad


| ID      | Requisito                                                                       |
| ------- | ------------------------------------------------------------------------------- |
| RNF-006 | Firebase Security Rules: leads solo escritura pública, lectura admin            |
| RNF-007 | Enrollments solo creables via Cloud Function (Stripe webhook)                   |
| RNF-008 | Progress solo accesible por el usuario propietario                              |
| RNF-009 | Admin via Custom Claims, no por campo en documento                              |
| RNF-010 | Variables sensibles (API keys) solo en `.env.local` y Firebase Functions config |
| RNF-011 | HTTPS obligatorio (SSL auto de Firebase Hosting)                                |
| RNF-012 | Cookie banner GDPR compliant (accept/reject)                                    |


### 4.3 Escalabilidad


| ID      | Requisito                                           |
| ------- | --------------------------------------------------- |
| RNF-013 | Firestore escala automáticamente (sin intervención) |
| RNF-014 | Firebase Hosting CDN global (sin config adicional)  |
| RNF-015 | Cloud Functions v2 con auto-scaling                 |
| RNF-016 | Sanity.io free tier soporta 100K requests/mes       |


### 4.4 Compatibilidad


| ID      | Requisito                                                        |
| ------- | ---------------------------------------------------------------- |
| RNF-017 | Responsive obligatorio: breakpoints 768px y 1024px               |
| RNF-018 | Navegadores: Chrome, Firefox, Safari, Edge (últimas 2 versiones) |
| RNF-019 | Mobile-first: iOS Safari y Chrome Android                        |


### 4.5 SEO


| ID      | Requisito                                                 |
| ------- | --------------------------------------------------------- |
| RNF-020 | 301 redirects para todas las URLs WordPress existentes    |
| RNF-021 | `sitemap.xml` generado automáticamente                    |
| RNF-022 | Schema.org structured data en todas las páginas           |
| RNF-023 | Meta tags Open Graph dinámicos por página                 |
| RNF-024 | `lang="es"` en HTML                                       |
| RNF-025 | Monitoreo en Google Search Console 30 días post-migración |


### 4.6 Mantenibilidad


| ID      | Requisito                                                             |
| ------- | --------------------------------------------------------------------- |
| RNF-026 | TypeScript estricto — prohibido `any`                                 |
| RNF-027 | Server Components por defecto, Client solo con interactividad         |
| RNF-028 | Imports con alias `@/` — no rutas relativas largas                    |
| RNF-029 | Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:` |
| RNF-030 | CI/CD via GitHub Actions → Firebase Hosting                           |


---

## 5. Stack Tecnológico


| Capa          | Tecnología              | Versión   | Justificación                               |
| ------------- | ----------------------- | --------- | ------------------------------------------- |
| Framework     | Next.js (App Router)    | 16.2.1    | SSR/SSG, React 19, soporte Firebase nativo  |
| UI            | React                   | 19        | Ecosystem, Server Components                |
| Estilos       | Tailwind CSS            | 4         | Utilities + `@theme` con variables `--mi-`* |
| CMS           | Sanity.io               | Free tier | 100K req/mes, preview en vivo               |
| Hosting       | Firebase Hosting        | —         | CDN global, SSL auto, $0-15/mes             |
| Base de datos | Firestore               | —         | Leads, enrollments, progress                |
| Auth          | Firebase Auth           | —         | Email/Google, Custom Claims                 |
| Storage       | Firebase Storage        | —         | Imágenes, assets                            |
| Backend       | Cloud Functions v2      | —         | Webhooks, notificaciones                    |
| Pagos         | Stripe Checkout         | —         | 2.9% + $0.30/tx, sin fee mensual            |
| Email         | ConvertKit              | —         | Secuencias automatizadas                    |
| Fuente        | Inter                   | —         | `next/font/google`, zero CLS                |
| Iconos        | Font Awesome            | 6.5       | CDN, tree-shaking                           |
| Video         | Mux / Cloudflare Stream | —         | Evaluar en Fase 4                           |


---

## 6. Arquitectura de Datos (Firestore)


| Colección              | Fase | Descripción                                                 | Índices                            |
| ---------------------- | ---- | ----------------------------------------------------------- | ---------------------------------- |
| `leads`                | 3    | Registros de lead capture (curso-gratis, webinar, contacto) | `source` + `createdAt DESC`        |
| `courses`              | 4    | Catálogo de cursos                                          | `isActive` + `publishedAt DESC`    |
| `courses/{id}/lessons` | 4    | Lecciones por curso (subcolección)                          | `order ASC`                        |
| `enrollments`          | 4    | Matrículas de estudiantes                                   | `userId` + `enrolledAt DESC`       |
| `progress`             | 4    | Progreso por lección                                        | `userId` + `courseId` (compuesto)  |
| `quiz_results`         | 4    | Resultados de quizzes                                       | `userId` + `courseId` + `lessonId` |


---

## 7. Fases de Entrega


| Fase | Nombre                | Semanas | Estado       | Dependencias                   |
| ---- | --------------------- | ------- | ------------ | ------------------------------ |
| 0    | Setup Inicial         | 1       | ✅ COMPLETADA | —                              |
| 1    | Páginas Core          | 2-3     | 🔲 PENDIENTE | Fase 0                         |
| 2    | Contenido y Legal     | 3-4     | 🔲 PENDIENTE | Fase 1 (layout)                |
| 3    | Lead Capture & Launch | 4-5     | 🔲 PENDIENTE | Fase 2 (blog para preview)     |
| 4    | Plataforma de Cursos  | 5-8     | 🔲 PENDIENTE | Fase 3 (Firebase Hosting live) |
| 5    | AI & Automatización   | 8+      | 🔲 PENDIENTE | Fase 4 (plataforma estable)    |


---

## 8. Criterios de Aceptación Globales


| #     | Criterio                                                | Verificación        |
| ----- | ------------------------------------------------------- | ------------------- |
| CA-1  | Fidelidad visual: screenshots WP vs Next.js lado a lado | Manual              |
| CA-2  | Calculadoras: mismos inputs → mismos outputs            | Test automatizado   |
| CA-3  | Responsive: funcional en 768px y 1024px                 | Chrome DevTools     |
| CA-4  | Lighthouse > 90 en todas las páginas                    | CI check            |
| CA-5  | 301 redirects verificados con `curl -I`                 | Script automatizado |
| CA-6  | Schema.org validado con Google Rich Results Test        | Manual              |
| CA-7  | Lead form → Firestore → WhatsApp en <30s                | Test end-to-end     |
| CA-8  | Blog: 5 posts migrados, categorías filtradas            | Visual              |
| CA-9  | `firebase deploy` exitoso desde GitHub Actions          | CI/CD               |
| CA-10 | Zero TypeScript errors en `npm run build`               | CI check            |


---

## 9. Riesgos


| #   | Riesgo                                      | Probabilidad | Impacto | Mitigación                                     |
| --- | ------------------------------------------- | ------------ | ------- | ---------------------------------------------- |
| R-1 | Pérdida de posiciones SEO durante migración | Media        | Alto    | 301 redirects exhaustivos + Hostinger 30 días  |
| R-2 | WhatsApp API rate limits                    | Baja         | Medio   | Queue en Cloud Function con retry              |
| R-3 | Costos Firebase escalan con tráfico         | Baja         | Medio   | Monitoring + alertas de billing                |
| R-4 | Sanity free tier insuficiente               | Baja         | Bajo    | 100K req/mes amplio; upgrade plan si necesario |
| R-5 | Video hosting costoso (Mux)                 | Media        | Medio   | Evaluar Cloudflare Stream como alternativa     |


---

## 10. Trazabilidad

### Specs derivados de este TRD


| Spec                                               | Título                                    | Fases |
| -------------------------------------------------- | ----------------------------------------- | ----- |
| [SPEC-001](../specs/SPEC-001-layout-global.md)     | Layout Global y Navegación                | 1     |
| [SPEC-002](../specs/SPEC-002-home-page.md)         | Homepage                                  | 1     |
| [SPEC-003](../specs/SPEC-003-about-page.md)        | About Us                                  | 1     |
| [SPEC-004](../specs/SPEC-004-calculadoras.md)      | Calculadoras de Trading                   | 1     |
| [SPEC-005](../specs/SPEC-005-blog-sanity.md)       | Blog con Sanity CMS                       | 2     |
| [SPEC-006](../specs/SPEC-006-paginas-legales.md)   | Páginas de Contenido (Legal, FAQs, Links) | 2     |
| [SPEC-007](../specs/SPEC-007-lead-capture.md)      | Lead Capture (Curso Gratis + Webinar)     | 3     |
| [SPEC-008](../specs/SPEC-008-seo-redirects.md)     | SEO, Redirects y Deploy                   | 3     |
| [SPEC-009](../specs/SPEC-009-auth-sistema.md)      | Sistema de Autenticación                  | 4     |
| [SPEC-010](../specs/SPEC-010-cloud-functions.md)   | Cloud Functions                           | 3-4   |
| [SPEC-011](../specs/SPEC-011-plataforma-cursos.md) | Plataforma de Cursos                      | 4     |
| [SPEC-012](../specs/SPEC-012-stripe-pagos.md)      | Integración Stripe                        | 4     |
| [SPEC-013](../specs/SPEC-013-admin-panel.md)       | Panel de Administración                   | 4     |


### Casos de Uso derivados de este TRD


| UC                                                              | Título                                 | Actor Principal |
| --------------------------------------------------------------- | -------------------------------------- | --------------- |
| [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)         | Visitante navega el sitio              | Visitante       |
| [UC-002](../use-cases/UC-002-visitante-usa-calculadora.md)      | Visitante usa calculadora de trading   | Visitante       |
| [UC-003](../use-cases/UC-003-visitante-lee-blog.md)             | Visitante lee el blog                  | Visitante       |
| [UC-004](../use-cases/UC-004-lead-registro-curso-gratis.md)     | Lead se registra al curso gratis       | Lead            |
| [UC-005](../use-cases/UC-005-lead-registro-webinar.md)          | Lead se registra al webinar            | Lead            |
| [UC-006](../use-cases/UC-006-estudiante-registro-login.md)      | Estudiante se registra / inicia sesión | Estudiante      |
| [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)        | Estudiante compra un curso             | Estudiante      |
| [UC-008](../use-cases/UC-008-estudiante-cursa-leccion.md)       | Estudiante cursa una lección           | Estudiante      |
| [UC-009](../use-cases/UC-009-estudiante-completa-quiz.md)       | Estudiante completa un quiz            | Estudiante      |
| [UC-010](../use-cases/UC-010-visitante-contacta-whatsapp.md)    | Visitante contacta via WhatsApp        | Visitante       |
| [UC-011](../use-cases/UC-011-estudiante-obtiene-certificado.md) | Estudiante obtiene certificado         | Estudiante      |
| [UC-012](../use-cases/UC-012-admin-gestiona-cursos.md)          | Admin gestiona cursos y contenido      | Admin           |


