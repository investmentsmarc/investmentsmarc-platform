# UC-003 — Visitante Lee el Blog

> Actor Principal: Visitante (anónimo)
> Prioridad: MUST | Fase: 2
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-006, RF-007
> Specs: [SPEC-005](../specs/SPEC-005-blog-sanity.md)

---

## Descripción

Un visitante navega el blog, filtra por categoría y lee un artículo completo.

## Precondiciones

- Al menos 5 posts migrados desde WordPress y publicados en Sanity
- Sanity configurado con schema `post` y categorías

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/blog/` | Carga archive grid con todos los posts ordenados por fecha desc |
| 2 | Ve grid de BlogCards (cover, categoría, título, excerpt, fecha) | — |
| 3 | Filtra por "Trading Institucional" | Grid muestra solo posts de esa categoría |
| 4 | Click en un BlogCard | — |
| 5 | — | Navega a `/blog/{slug}/`, carga PostHero + body |
| 6 | Lee el artículo completo | — |
| 7 | Ve "Artículos Relacionados" al final | — |
| 8 | Click en artículo relacionado | — |
| 9 | — | Navega a `/blog/{otro-slug}/` |

## Flujo Alternativo — Desde Homepage

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Está en `/` (homepage) | Ve sección "Últimos Análisis" con 3 BlogCards |
| 2 | Click en un BlogCard | — |
| 3 | — | Navega a `/blog/{slug}/` |
| 4 | Click "Ver Todos" | — |
| 5 | — | Navega a `/blog/` |

## Flujo Alternativo — Categoría "Todos"

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Está en `/blog/` con filtro "Trading Institucional" | — |
| 2 | Click en "Todos" | — |
| 3 | — | Muestra todos los posts de categorías propias |
| 4 | — | **Nunca** muestra posts de RSS imports |

## Postcondiciones

- El visitante leyó un artículo completo
- ISR: contenido puede estar cacheado hasta 1 hora
- Schema.org `Article` presente en el HTML del post

## Reglas de Negocio

- Solo mostrar categorías propias: "Análisis de Mercado" y "Trading Institucional"
- RSS imports ocultos (categorías de RSS no aparecen en filtros ni en grid)
- Blog preview en homepage: exactamente 3 posts más recientes
- Artículos relacionados: misma categoría, máximo 3
- ISR con revalidación cada hora
