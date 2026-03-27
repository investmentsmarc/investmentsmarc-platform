# UC-012 — Admin Gestiona Cursos y Contenido

> Actor Principal: Admin (Marc)
> Prioridad: MUST | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-030
> Specs: [SPEC-013](../specs/SPEC-013-admin-panel.md)

---

## Descripción

Marc accede al panel de administración para gestionar cursos, lecciones, ver leads y monitorear métricas del negocio.

## Precondiciones

- Marc autenticado con Firebase Auth
- Custom Claim `admin: true` configurado en su cuenta
- Al menos 1 curso en Firestore

## Flujo Principal — Dashboard

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/admin/` | — |
| 2 | — | Verifica `admin: true` en Custom Claims |
| 3 | — | Carga dashboard con métricas |
| 4 | Ve: Total leads (mes), Enrollments (mes), Revenue, Leads por source | — |
| 5 | Ve: últimos 5 leads y últimos 5 enrollments | — |

## Flujo — Crear Curso

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/admin/cursos/` | Tabla de cursos existentes |
| 2 | Click "Nuevo Curso" | — |
| 3 | — | Navega a `/admin/cursos/nuevo/` |
| 4 | Llena campos: título, slug, descripción, precio, cover image, stripePriceId | — |
| 5 | Click "Guardar" | — |
| 6 | — | Valida campos required |
| 7 | — | Crea documento en Firestore `courses` |
| 8 | — | Redirect a `/admin/cursos/{id}/lecciones/` |

## Flujo — Agregar Lecciones

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Está en `/admin/cursos/{id}/lecciones/` | Lista vacía de lecciones |
| 2 | Click "Agregar Lección" | — |
| 3 | Llena: título, videoUrl (Mux/CF Stream), duración, order, isFree | — |
| 4 | Click "Guardar" | — |
| 5 | — | Crea documento en subcolección `courses/{id}/lessons` |
| 6 | — | Actualiza `totalLessons` y `totalDuration` en el curso (denormalized) |
| 7 | Repite para cada lección | — |
| 8 | Drag & drop para reordenar | — |
| 9 | — | Actualiza `order` de cada lección afectada |

## Flujo — Editar Curso

| # | Actor | Sistema |
|---|-------|---------|
| 1 | En tabla de cursos, click "Editar" | — |
| 2 | — | Navega a `/admin/cursos/{id}/editar/` con form pre-llenado |
| 3 | Modifica precio de $99 a $149 | — |
| 4 | Click "Guardar" | — |
| 5 | — | Actualiza documento en Firestore |
| 6 | — | Nota: cambiar precio NO afecta enrollments existentes |

## Flujo — Toggle Activo/Inactivo

| # | Actor | Sistema |
|---|-------|---------|
| 1 | En tabla de cursos, toggle "Activo" → "Inactivo" | — |
| 2 | — | Actualiza `isActive: false` en Firestore |
| 3 | — | Curso desaparece del catálogo público |
| 4 | — | Estudiantes con enrollment existente mantienen acceso |

## Flujo — Ver Leads

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/admin/leads/` | — |
| 2 | — | Tabla con todos los leads ordenados por fecha desc |
| 3 | Filtra por source: "webinar" | — |
| 4 | — | Tabla muestra solo leads de webinar |
| 5 | Click en un lead | — |
| 6 | — | Modal con detalle: nombre, email, WhatsApp, source, UTM, fecha, estado notificación |

## Flujo — Ver Enrollments

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/admin/enrollments/` | — |
| 2 | — | Tabla: estudiante, curso, fecha, monto, Stripe ID |
| 3 | Filtra por curso | — |
| 4 | — | Muestra solo enrollments de ese curso |

## Flujo de Error — No es Admin

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Un estudiante regular intenta acceder a `/admin/` | — |
| 2 | — | `<ProtectedRoute requireAdmin />` verifica Claims |
| 3 | — | No tiene `admin: true` |
| 4 | — | Redirect a `/cursos/` |

## Postcondiciones

- Curso creado/editado visible en el catálogo público (si activo)
- Lecciones accesibles para estudiantes con enrollment
- Leads y enrollments visibles con métricas actualizadas
- Datos denormalizados (`totalLessons`, `totalDuration`) consistentes

## Reglas de Negocio

- Solo usuarios con Custom Claim `admin: true` acceden al panel
- Desactivar curso no revoca acceso a estudiantes existentes
- Cambiar precio no afecta enrollments previos
- Cover image se sube a Firebase Storage
- `stripePriceId` debe existir en Stripe Dashboard antes de activar el curso
- Reordenar lecciones actualiza el campo `order` (batch write)
