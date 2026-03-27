# UC-001 — Visitante Navega el Sitio

> Actor Principal: Visitante (anónimo)
> Prioridad: MUST | Fases: 1, 2
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-001, RF-002, RF-003, RF-008, RF-009
> Specs: [SPEC-001](../specs/SPEC-001-layout-global.md), [SPEC-002](../specs/SPEC-002-home-page.md), [SPEC-003](../specs/SPEC-003-about-page.md), [SPEC-006](../specs/SPEC-006-paginas-legales.md)

---

## Descripción

Un visitante accede a `investmentsmarc.com` por primera vez y navega las páginas principales del sitio para conocer la marca, los servicios y el contenido disponible.

## Precondiciones

- El sitio está desplegado y accesible en `investmentsmarc.com`
- El visitante tiene conexión a internet y un navegador moderno

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Accede a `investmentsmarc.com` | — |
| 2 | — | Carga página con TradingView ticker, header glassmorphic, y cookie banner |
| 3 | Decide aceptar o rechazar cookies | Guarda preferencia en localStorage, oculta banner |
| 4 | Ve el hero section con CTAs | — |
| 5 | Hace scroll | Secciones aparecen con animación reveal (IntersectionObserver) |
| 6 | Ve preview de blog (3 artículos) | — |
| 7 | Ve sección de testimonios | — |
| 8 | Navega a "About Us" via header | Carga `/about-us/` con bio, FlowTitan cards, values grid |
| 9 | Navega a "Herramientas" via header | Carga `/herramientas/` con hub de 3 calculadoras |
| 10 | Navega a "FAQs" via footer | Carga `/faqs/` con accordion interactivo |
| 11 | Navega a "Política de Privacidad" via footer | Carga `/legal/privacidad/` |

## Flujos Alternativos

### FA-1: Visitante llega a URL antigua de WordPress
| # | Actor | Sistema |
|---|-------|---------|
| 1 | Accede a `/politica-de-privacidad/` | — |
| 2 | — | 301 redirect a `/legal/privacidad/` |
| 3 | — | Carga página legal correcta |

### FA-2: Visitante en mobile (<768px)
| # | Actor | Sistema |
|---|-------|---------|
| 1 | Toca hamburger menu | — |
| 2 | — | Overlay nav se desliza desde la derecha |
| 3 | Selecciona una opción | — |
| 4 | — | Navega a la página, cierra overlay |

### FA-3: Visitante rechaza cookies
| # | Actor | Sistema |
|---|-------|---------|
| 1 | Click "Rechazar" en cookie banner | — |
| 2 | — | `localStorage: cookie-consent = rejected` |
| 3 | — | Firebase Analytics NO se inicializa |
| 4 | — | Banner desaparece permanentemente |

## Postcondiciones

- El visitante ha explorado el sitio y tiene una impresión de la marca
- La preferencia de cookies está almacenada en localStorage
- Si aceptó cookies: Firebase Analytics registra la visita

## Reglas de Negocio

- Cookie banner solo aparece si no hay decisión previa en localStorage
- TradingView ticker siempre visible en todas las páginas
- WhatsApp float siempre visible (bottom-right)
- Responsive obligatorio en 768px y 1024px
- `lang="es"` en el HTML
