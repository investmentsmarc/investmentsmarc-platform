# UC-004 — Lead Se Registra al Curso Gratis

> Actor Principal: Lead (visitante que proporciona datos)
> Prioridad: MUST | Fase: 3
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-012, RF-014
> Specs: [SPEC-007](../specs/SPEC-007-lead-capture.md), [SPEC-010](../specs/SPEC-010-cloud-functions.md)

---

## Descripción

Un visitante se registra para recibir el curso gratis de trading institucional, proporcionando sus datos de contacto. El sistema persiste los datos en Firestore y dispara notificaciones automáticas.

## Precondiciones

- El visitante está en `/curso-gratis/`
- Firestore y Cloud Functions desplegados
- ConvertKit y WhatsApp API configurados

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/curso-gratis/` | Carga página con descripción del curso + formulario |
| 2 | Ingresa nombre: "Juan Pérez" | — |
| 3 | Ingresa email: "juan@email.com" | — |
| 4 | (Opcional) Ingresa WhatsApp: "+1 555 123 4567" | — |
| 5 | Click "Registrarme Gratis" | — |
| 6 | — | Valida campos (client-side) |
| 7 | — | Muestra spinner en botón, inputs disabled |
| 8 | — | Escribe documento a Firestore `leads` con `source: 'curso-gratis'` |
| 9 | — | Muestra confirmación: "¡Registro exitoso! Revisa tu email." |
| 10 | — | **[Async]** Cloud Function `onLeadCapture` se dispara |
| 11 | — | **[Async]** WhatsApp a +18329534918: "Nuevo lead: Juan Pérez (juan@email.com) — curso-gratis" |
| 12 | — | **[Async]** ConvertKit: añade contacto con tag `curso-gratis` |
| 13 | — | **[Async]** Actualiza lead: `notifiedWhatsApp: true, notifiedConvertKit: true` |

## Flujo Alternativo — Con UTM Params

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Llega a `/curso-gratis/?utm_source=instagram&utm_campaign=stories` | — |
| 2 | Completa y envía el formulario | — |
| 3 | — | Guarda `utmSource: 'instagram'` en el documento de Firestore |

## Flujo de Error — Validación

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Deja email vacío, click submit | — |
| 2 | — | Muestra error inline: "Email es requerido" |
| 3 | Ingresa email inválido: "juan@" | — |
| 4 | — | Muestra error: "Ingresa un email válido" |
| 5 | Corrige el email | — |
| 6 | — | Error desaparece, permite submit |

## Flujo de Error — Fallo de Firestore

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Submit el formulario | — |
| 2 | — | Error al escribir a Firestore (red, permisos) |
| 3 | — | Muestra error: "Error al registrar. Intenta nuevamente." |
| 4 | — | Botón vuelve a estado normal (permite retry) |

## Flujo de Error — Cloud Function Falla

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Lead creado exitosamente en Firestore | — |
| 2 | — | Cloud Function `onLeadCapture` falla al enviar WhatsApp |
| 3 | — | Log de error en Cloud Logging |
| 4 | — | `notifiedWhatsApp: false` en el documento |
| 5 | — | El lead NO se pierde — datos seguros en Firestore |

## Postcondiciones

- Documento creado en Firestore `leads` con todos los datos
- Marc recibe notificación WhatsApp en <30 segundos
- Contacto añadido a ConvertKit con tag correcto
- El visitante ve confirmación en la página

## Reglas de Negocio

- Nombre y email son obligatorios; WhatsApp es opcional
- No hay validación de duplicados (mismo email puede registrarse múltiples veces)
- Cloud Functions son fire-and-forget: si fallan, el lead ya está en Firestore
- WhatsApp de notificación solo a Marc (+18329534918), no al lead
- UTM params se capturan automáticamente de la URL
