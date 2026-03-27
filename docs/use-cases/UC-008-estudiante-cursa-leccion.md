# UC-008 — Estudiante Cursa una Lección

> Actor Principal: Estudiante (autenticado + enrolled)
> Prioridad: MUST | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-025, RF-026, RF-028
> Specs: [SPEC-011](../specs/SPEC-011-plataforma-cursos.md)

---

## Descripción

Un estudiante con enrollment activo accede a una lección, ve el video, marca la lección como completada y navega a la siguiente.

## Precondiciones

- Estudiante autenticado con Firebase Auth
- Enrollment activo para el curso en Firestore
- Lecciones del curso configuradas con videoUrl

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/dashboard/` | Ve lista de cursos comprados con % de progreso |
| 2 | Click "Continuar" en "Trading Institucional" (45% completado) | — |
| 3 | — | Navega a `/cursos/trading-institucional/lecciones/` |
| 4 | — | Carga sidebar con lista de lecciones, checkmarks en completadas |
| 5 | — | Resalta la primera lección no completada |
| 6 | Click en "Lección 5: Gestión de Riesgo" | — |
| 7 | — | Navega a `/cursos/trading-institucional/lecciones/lesson-5/` |
| 8 | — | Carga video player con el video de la lección |
| 9 | Ve el video completo | — |
| 10 | Click "Marcar como Completada" | — |
| 11 | — | Escribe documento a Firestore `progress` |
| 12 | — | Checkmark aparece en sidebar para esta lección |
| 13 | — | Barra de progreso se actualiza (ej: 45% → 55%) |
| 14 | Click "Siguiente →" | — |
| 15 | — | Navega a Lección 6 |

## Flujo Alternativo — Descargar Recursos

| # | Actor | Sistema |
|---|-------|---------|
| 1 | En la página de la lección, ve sección "Recursos" | — |
| 2 | Click "Descargar PDF" | — |
| 3 | — | Descarga archivo de Firebase Storage |

## Flujo Alternativo — Navegar Entre Lecciones

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Está en Lección 5 | — |
| 2 | Click "← Anterior" | — |
| 3 | — | Navega a Lección 4 |
| 4 | Click en Lección 8 en sidebar | — |
| 5 | — | Navega directamente a Lección 8 |

## Flujo Alternativo — Curso 100% Completado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Marca la última lección como completada | — |
| 2 | — | Progreso: 100% |
| 3 | — | Muestra celebración: "¡Felicidades! Completaste el curso." |
| 4 | — | CTA: "Obtener Certificado" → dispara `generateCertificate` |

## Flujo de Error — Sin Enrollment

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Accede directamente a URL de lección sin enrollment | — |
| 2 | — | Verifica: no hay enrollment para este user + course |
| 3 | — | Redirect a `/cursos/trading-institucional/` (landing) |
| 4 | — | Muestra: "Necesitas comprar el curso para acceder a las lecciones" |

## Postcondiciones

- Progreso actualizado en Firestore `progress`
- Dashboard refleja nuevo % de completación
- Si curso completado: elegible para certificado

## Reglas de Negocio

- Solo estudiantes con enrollment pueden ver lecciones (excepto `isFree: true`)
- "Marcar como Completada" es acción explícita del usuario (no auto-detect)
- Progreso es idempotente: marcar 2 veces la misma lección no duplica en Firestore
- Navegación anterior/siguiente respeta el `order` de las lecciones
- Video no permite descarga (solo streaming)
