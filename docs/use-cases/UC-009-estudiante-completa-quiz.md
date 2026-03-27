# UC-009 — Estudiante Completa un Quiz

> Actor Principal: Estudiante (autenticado + enrolled)
> Prioridad: SHOULD | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-027
> Specs: [SPEC-011](../specs/SPEC-011-plataforma-cursos.md)

---

## Descripción

Un estudiante completa el quiz al final de una lección para validar su comprensión del material.

## Precondiciones

- Estudiante en una lección que tiene quiz configurado
- Quiz con preguntas de selección múltiple y score mínimo definido

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Termina de ver el video de la lección | — |
| 2 | — | Muestra sección "Quiz" debajo del video |
| 3 | Ve pregunta 1 de 5 con 4 opciones | — |
| 4 | Selecciona una opción | — |
| 5 | Ve pregunta 2 de 5 | — |
| 6 | Responde todas las preguntas | — |
| 7 | Click "Enviar Respuestas" | — |
| 8 | — | Calcula score: 4/5 = 80% |
| 9 | — | `passingScore: 70` → APROBADO |
| 10 | — | Guarda en Firestore `quiz_results`: score=80, answers={...} |
| 11 | — | Marca lección como completada automáticamente (escribe a `progress`) |
| 12 | — | Muestra: "¡Aprobado! 80% — 4 de 5 correctas" |
| 13 | — | Muestra respuestas correctas e incorrectas con explicación |
| 14 | Click "Siguiente Lección →" | — |

## Flujo Alternativo — No Aprueba

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Responde todas las preguntas | — |
| 2 | — | Calcula: 2/5 = 40% < 70% (passing) |
| 3 | — | Guarda resultado en `quiz_results` |
| 4 | — | Muestra: "No aprobado — 40%. Necesitas al menos 70%." |
| 5 | — | Muestra respuestas correctas |
| 6 | — | CTA: "Reintentar Quiz" |
| 7 | Click "Reintentar" | — |
| 8 | — | Reinicia quiz con mismas preguntas (o shuffled) |

## Flujo Alternativo — Skip Quiz

| # | Actor | Sistema |
|---|-------|---------|
| 1 | No quiere hacer el quiz | — |
| 2 | Click "Marcar como Completada" (bypass quiz) | — |
| 3 | — | Marca lección completada SIN quiz result |
| 4 | — | Quiz queda disponible para hacerlo después |

## Postcondiciones

- Quiz result guardado en Firestore `quiz_results`
- Si aprobado: lección marcada como completada
- Si no aprobado: puede reintentar
- Respuestas correctas visibles post-submit

## Reglas de Negocio

- Preguntas de selección múltiple (4 opciones, 1 correcta)
- Score mínimo configurable por quiz (default 70%)
- Quiz es opcional: el estudiante puede marcar lección completada sin quiz
- Si aprueba: auto-complete de la lección
- Reintentos ilimitados
- Se guarda cada intento en `quiz_results` (historial)
