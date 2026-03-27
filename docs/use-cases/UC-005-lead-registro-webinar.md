# UC-005 — Lead Se Registra al Webinar

> Actor Principal: Lead (visitante que proporciona datos)
> Prioridad: MUST | Fase: 3
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-013, RF-015
> Specs: [SPEC-007](../specs/SPEC-007-lead-capture.md), [SPEC-010](../specs/SPEC-010-cloud-functions.md)

---

## Descripción

Un visitante se registra para el próximo webinar semanal (sábados 8pm EST), proporcionando sus datos. El sistema persiste en Firestore, notifica a Marc y envía confirmación al lead.

## Precondiciones

- El visitante está en `/webinar/`
- Countdown mostrando tiempo al próximo sábado 8pm EST
- Cloud Functions configuradas para webinar

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/webinar/` | Carga página con countdown + descripción + formulario |
| 2 | Ve countdown: "3 días 14:22:05" | Countdown se actualiza en tiempo real cada segundo |
| 3 | Ingresa nombre: "María López" | — |
| 4 | Ingresa email: "maria@email.com" | — |
| 5 | Ingresa WhatsApp: "+1 555 987 6543" (requerido) | — |
| 6 | Click "Reservar Mi Lugar" | — |
| 7 | — | Valida campos (client-side) |
| 8 | — | Spinner en botón |
| 9 | — | Escribe a Firestore `leads` con `source: 'webinar'` |
| 10 | — | Muestra confirmación: "¡Registrado! Te enviaremos un recordatorio por WhatsApp." |
| 11 | — | **[Async]** `onLeadCapture` → WhatsApp a Marc + ConvertKit |
| 12 | — | **[Async]** `onWebinarRegister` → WhatsApp al lead: "¡Registrado para el webinar del sábado 8pm EST!" |
| 13 | — | **[Async]** `onWebinarRegister` → Email confirmación con fecha y detalles |

## Flujo Alternativo — Webinar es Hoy

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/webinar/` en sábado a las 6pm EST | — |
| 2 | — | Countdown: "2:00:00" (2 horas) |
| 3 | — | Mensaje adicional: "¡El webinar es HOY a las 8pm EST!" |

## Flujo Alternativo — Webinar en Curso

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/webinar/` en sábado a las 8:30pm EST | — |
| 2 | — | Countdown apunta al PRÓXIMO sábado |
| 3 | — | Mensaje: "El webinar de esta semana ya comenzó. Regístrate para el próximo." |

## Postcondiciones

- Lead creado en Firestore con `source: 'webinar'`
- Marc recibe WhatsApp de notificación
- El lead recibe WhatsApp de confirmación (si proporcionó número)
- El lead recibe email de confirmación via ConvertKit
- Contacto añadido a ConvertKit con tag `webinar`

## Reglas de Negocio

- Webinar: cada sábado a las 8:00 PM EST
- WhatsApp es **obligatorio** para registro de webinar (a diferencia de curso-gratis)
- El countdown calcula automáticamente el próximo sábado futuro
- Si es sábado y ya pasaron las 8pm: countdown apunta al siguiente sábado
- Dos Cloud Functions se disparan: `onLeadCapture` + `onWebinarRegister`
