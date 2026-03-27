# UC-007 — Estudiante Compra un Curso

> Actor Principal: Estudiante (autenticado)
> Prioridad: MUST | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-021, RF-022, RF-023, RF-024
> Specs: [SPEC-011](../specs/SPEC-011-plataforma-cursos.md), [SPEC-012](../specs/SPEC-012-stripe-pagos.md)

---

## Descripción

Un estudiante autenticado navega el catálogo de cursos, selecciona uno, lo compra via Stripe Checkout y obtiene acceso inmediato a las lecciones.

## Precondiciones

- Estudiante autenticado (Firebase Auth)
- Al menos 1 curso activo en Firestore con `stripePriceId` configurado
- Stripe configurado con Products y Prices
- Webhook endpoint registrado en Stripe Dashboard

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/cursos/` | Carga catálogo con grid de CourseCards |
| 2 | Ve cards: cover, título, precio, # lecciones | — |
| 3 | Click "Ver Curso" en "Trading Institucional" | — |
| 4 | — | Navega a `/cursos/trading-institucional/` |
| 5 | Ve landing: descripción, temario, precio $149, CTA "Comprar" | — |
| 6 | Ve temario: lecciones con 🔓 lock y 1 con "Vista Previa" | — |
| 7 | Click "Comprar Curso — $149" | — |
| 8 | — | POST `/api/stripe/checkout` con `{ courseId }` |
| 9 | — | Verifica: usuario no tiene enrollment previo para este curso |
| 10 | — | Crea Stripe Checkout Session con metadata `{ userId, courseId }` |
| 11 | — | Redirect a Stripe Checkout hosted page |
| 12 | Ingresa datos de tarjeta en Stripe | — |
| 13 | Click "Pagar $149" | — |
| 14 | — | Stripe procesa el pago |
| 15 | — | Stripe envía webhook `checkout.session.completed` |
| 16 | — | Cloud Function `stripeWebhook` verifica firma |
| 17 | — | Crea documento en Firestore `enrollments` |
| 18 | — | Cloud Function `onEnrollment` envía email bienvenida |
| 19 | — | Stripe redirect a `/cursos/trading-institucional/lecciones/?success=true` |
| 20 | Ve mensaje: "¡Compra exitosa! Ya puedes acceder al curso." | — |
| 21 | Ve lista de lecciones desbloqueadas | — |

## Flujo Alternativo — Preview Gratis

| # | Actor | Sistema |
|---|-------|---------|
| 1 | En landing del curso, click en lección con "Vista Previa" | — |
| 2 | — | Navega a la lección sin verificar enrollment |
| 3 | Ve el video completo de la lección gratuita | — |
| 4 | CTA al final: "¿Te gustó? Compra el curso completo" | — |

## Flujo Alternativo — Pago Cancelado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | En Stripe Checkout, click "← Volver" | — |
| 2 | — | Stripe redirect a `/cursos/trading-institucional/?cancelled=true` |
| 3 | — | Muestra mensaje: "No se realizó el pago. Puedes intentar nuevamente." |
| 4 | — | No se crea enrollment |

## Flujo de Error — Ya Comprado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Click "Comprar" en un curso que ya compró | — |
| 2 | — | POST `/api/stripe/checkout` |
| 3 | — | Detecta enrollment existente |
| 4 | — | Retorna error 400: "Ya tienes acceso a este curso" |
| 5 | — | Muestra mensaje + link a "Ir a mis lecciones" |

## Flujo de Error — No Autenticado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Click "Comprar" sin estar logueado | — |
| 2 | — | Redirect a `/login/?redirect=/cursos/trading-institucional/` |
| 3 | Se loguea | — |
| 4 | — | Redirect de vuelta a la landing del curso |

## Postcondiciones

- Pago procesado en Stripe (registrado en Stripe Dashboard)
- Enrollment creado en Firestore con `stripeSessionId` y `amount`
- Estudiante tiene acceso a todas las lecciones del curso
- Email de bienvenida enviado con link al curso
- Marc puede ver la venta en `/admin/enrollments/`

## Reglas de Negocio

- Solo pagos únicos (one-time), no suscripciones
- Un enrollment por usuario por curso (no duplicados)
- Stripe Checkout hosted: PCI compliance simplificada
- Metadata en session para trazabilidad completa
- Lecciones `isFree: true` accesibles sin enrollment
