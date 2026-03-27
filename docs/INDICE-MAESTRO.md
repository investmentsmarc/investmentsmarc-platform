# Índice Maestro — Trazabilidad TRD → Specs → Casos de Uso

> Investments Marc Platform
> Generado: 2026-03-26

---

## Estructura Documental

```
docs/
├── INDICE-MAESTRO.md              ← Este archivo
├── trd/
│   └── TRD-001-investmentsmarc-platform.md   (Technical Requirements Document)
├── specs/
│   ├── SPEC-001-layout-global.md
│   ├── SPEC-002-home-page.md
│   ├── SPEC-003-about-page.md
│   ├── SPEC-004-calculadoras.md
│   ├── SPEC-005-blog-sanity.md
│   ├── SPEC-006-paginas-legales.md
│   ├── SPEC-007-lead-capture.md
│   ├── SPEC-008-seo-redirects.md
│   ├── SPEC-009-auth-sistema.md
│   ├── SPEC-010-cloud-functions.md
│   ├── SPEC-011-plataforma-cursos.md
│   ├── SPEC-012-stripe-pagos.md
│   └── SPEC-013-admin-panel.md
└── use-cases/
    ├── UC-001-visitante-navega-sitio.md
    ├── UC-002-visitante-usa-calculadora.md
    ├── UC-003-visitante-lee-blog.md
    ├── UC-004-lead-registro-curso-gratis.md
    ├── UC-005-lead-registro-webinar.md
    ├── UC-006-estudiante-registro-login.md
    ├── UC-007-estudiante-compra-curso.md
    ├── UC-008-estudiante-cursa-leccion.md
    ├── UC-009-estudiante-completa-quiz.md
    ├── UC-010-visitante-contacta-whatsapp.md
    ├── UC-011-estudiante-obtiene-certificado.md
    └── UC-012-admin-gestiona-cursos.md
```

---

## Matriz de Trazabilidad: Requisitos → Specs → Casos de Uso

| Requisito (TRD) | Descripción | Spec | Caso de Uso | Fase |
|------------------|-------------|------|-------------|------|
| RF-001 | Layout global (ticker, header, footer, WhatsApp, cookie) | [SPEC-001](specs/SPEC-001-layout-global.md) | [UC-001](use-cases/UC-001-visitante-navega-sitio.md) | 1 |
| RF-002 | Homepage (hero, blog preview, testimonios) | [SPEC-002](specs/SPEC-002-home-page.md) | [UC-001](use-cases/UC-001-visitante-navega-sitio.md) | 1 |
| RF-003 | About Us (bio, FlowTitan, values) | [SPEC-003](specs/SPEC-003-about-page.md) | [UC-001](use-cases/UC-001-visitante-navega-sitio.md) | 1 |
| RF-004 | Calculadoras de trading (3) | [SPEC-004](specs/SPEC-004-calculadoras.md) | [UC-002](use-cases/UC-002-visitante-usa-calculadora.md) | 1 |
| RF-005 | Contacto → WhatsApp | [SPEC-001](specs/SPEC-001-layout-global.md) | [UC-010](use-cases/UC-010-visitante-contacta-whatsapp.md) | 1 |
| RF-006 | Blog con Sanity CMS | [SPEC-005](specs/SPEC-005-blog-sanity.md) | [UC-003](use-cases/UC-003-visitante-lee-blog.md) | 2 |
| RF-007 | Migrar 5 posts WordPress | [SPEC-005](specs/SPEC-005-blog-sanity.md) | [UC-003](use-cases/UC-003-visitante-lee-blog.md) | 2 |
| RF-008 | Páginas legales (Privacidad, Términos) | [SPEC-006](specs/SPEC-006-paginas-legales.md) | [UC-001](use-cases/UC-001-visitante-navega-sitio.md) | 2 |
| RF-009 | FAQ accordion | [SPEC-006](specs/SPEC-006-paginas-legales.md) | [UC-001](use-cases/UC-001-visitante-navega-sitio.md) | 2 |
| RF-010 | Links (Instagram link-in-bio) | [SPEC-006](specs/SPEC-006-paginas-legales.md) | — | 2 |
| RF-011 | WhatsApp funnel page | [SPEC-006](specs/SPEC-006-paginas-legales.md) | [UC-010](use-cases/UC-010-visitante-contacta-whatsapp.md) | 2 |
| RF-012 | Lead form `/curso-gratis/` → Firestore | [SPEC-007](specs/SPEC-007-lead-capture.md) | [UC-004](use-cases/UC-004-lead-registro-curso-gratis.md) | 3 |
| RF-013 | Webinar form con countdown | [SPEC-007](specs/SPEC-007-lead-capture.md) | [UC-005](use-cases/UC-005-lead-registro-webinar.md) | 3 |
| RF-014 | Cloud Function onLeadCapture | [SPEC-010](specs/SPEC-010-cloud-functions.md) | [UC-004](use-cases/UC-004-lead-registro-curso-gratis.md) | 3 |
| RF-015 | Cloud Function onWebinarRegister | [SPEC-010](specs/SPEC-010-cloud-functions.md) | [UC-005](use-cases/UC-005-lead-registro-webinar.md) | 3 |
| RF-016 | 301 redirects WordPress | [SPEC-008](specs/SPEC-008-seo-redirects.md) | — | 3 |
| RF-017 | Sitemap.xml automático | [SPEC-008](specs/SPEC-008-seo-redirects.md) | — | 3 |
| RF-018 | Schema.org structured data | [SPEC-008](specs/SPEC-008-seo-redirects.md) | — | 3 |
| RF-019 | Deploy Firebase + DNS cutover | [SPEC-008](specs/SPEC-008-seo-redirects.md) | — | 3 |
| RF-020 | Auth estudiantes (email + Google) | [SPEC-009](specs/SPEC-009-auth-sistema.md) | [UC-006](use-cases/UC-006-estudiante-registro-login.md) | 4 |
| RF-021 | Catálogo de cursos | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-007](use-cases/UC-007-estudiante-compra-curso.md) | 4 |
| RF-022 | Landing de curso | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-007](use-cases/UC-007-estudiante-compra-curso.md) | 4 |
| RF-023 | Compra via Stripe Checkout | [SPEC-012](specs/SPEC-012-stripe-pagos.md) | [UC-007](use-cases/UC-007-estudiante-compra-curso.md) | 4 |
| RF-024 | Stripe webhook → enrollment | [SPEC-012](specs/SPEC-012-stripe-pagos.md) | [UC-007](use-cases/UC-007-estudiante-compra-curso.md) | 4 |
| RF-025 | Video player por lección | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-008](use-cases/UC-008-estudiante-cursa-leccion.md) | 4 |
| RF-026 | Tracking de progreso | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-008](use-cases/UC-008-estudiante-cursa-leccion.md) | 4 |
| RF-027 | Quizzes por lección | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-009](use-cases/UC-009-estudiante-completa-quiz.md) | 4 |
| RF-028 | Dashboard de progreso | [SPEC-011](specs/SPEC-011-plataforma-cursos.md) | [UC-008](use-cases/UC-008-estudiante-cursa-leccion.md) | 4 |
| RF-029 | Certificado PDF | [SPEC-010](specs/SPEC-010-cloud-functions.md) | [UC-011](use-cases/UC-011-estudiante-obtiene-certificado.md) | 4 |
| RF-030 | Panel admin | [SPEC-013](specs/SPEC-013-admin-panel.md) | [UC-012](use-cases/UC-012-admin-gestiona-cursos.md) | 4 |
| RF-031 | Endpoints IA | — | — | 5 |
| RF-032 | Postiz API | — | — | 5 |
| RF-033 | ManyChat webhook | — | — | 5 |
| RF-034 | Dashboard analytics | — | — | 5 |

---

## Matriz por Fase

### Fase 0: Setup ✅ COMPLETADA
No genera Specs ni Use Cases (infraestructura base).

### Fase 1: Páginas Core
| Spec | Use Cases |
|------|-----------|
| [SPEC-001 Layout Global](specs/SPEC-001-layout-global.md) | UC-001, UC-010 |
| [SPEC-002 Homepage](specs/SPEC-002-home-page.md) | UC-001 |
| [SPEC-003 About Us](specs/SPEC-003-about-page.md) | UC-001 |
| [SPEC-004 Calculadoras](specs/SPEC-004-calculadoras.md) | UC-002 |

### Fase 2: Contenido y Legal
| Spec | Use Cases |
|------|-----------|
| [SPEC-005 Blog Sanity](specs/SPEC-005-blog-sanity.md) | UC-003 |
| [SPEC-006 Páginas Legales](specs/SPEC-006-paginas-legales.md) | UC-001, UC-010 |

### Fase 3: Lead Capture & Launch
| Spec | Use Cases |
|------|-----------|
| [SPEC-007 Lead Capture](specs/SPEC-007-lead-capture.md) | UC-004, UC-005 |
| [SPEC-008 SEO & Deploy](specs/SPEC-008-seo-redirects.md) | — |
| [SPEC-010 Cloud Functions](specs/SPEC-010-cloud-functions.md) | UC-004, UC-005 |

### Fase 4: Plataforma de Cursos
| Spec | Use Cases |
|------|-----------|
| [SPEC-009 Auth](specs/SPEC-009-auth-sistema.md) | UC-006 |
| [SPEC-010 Cloud Functions](specs/SPEC-010-cloud-functions.md) | UC-007, UC-011 |
| [SPEC-011 Plataforma Cursos](specs/SPEC-011-plataforma-cursos.md) | UC-007, UC-008, UC-009 |
| [SPEC-012 Stripe](specs/SPEC-012-stripe-pagos.md) | UC-007 |
| [SPEC-013 Admin Panel](specs/SPEC-013-admin-panel.md) | UC-012 |

### Fase 5: AI & Automatización
Pendiente de especificar en detalle.

---

## Matriz por Actor

| Actor | Casos de Uso |
|-------|-------------|
| **Visitante** | UC-001, UC-002, UC-003, UC-010 |
| **Lead** | UC-004, UC-005 |
| **Estudiante** | UC-006, UC-007, UC-008, UC-009, UC-011 |
| **Admin** | UC-012 |

---

## Resumen Cuantitativo

| Artefacto | Cantidad |
|-----------|----------|
| TRD | 1 |
| Requisitos Funcionales | 34 (RF-001 a RF-034) |
| Requisitos No Funcionales | 30 (RNF-001 a RNF-030) |
| Specs | 13 |
| Casos de Uso | 12 |
| Actores | 5 (Visitante, Lead, Estudiante, Admin, Sistema) |
| Fases | 6 (0-5) |
