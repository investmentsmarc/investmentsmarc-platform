# UC-010 — Visitante Contacta via WhatsApp

> Actor Principal: Visitante (anónimo)
> Prioridad: MUST | Fases: 1, 2
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-005, RF-011
> Specs: [SPEC-001](../specs/SPEC-001-layout-global.md), [SPEC-006](../specs/SPEC-006-paginas-legales.md)

---

## Descripción

Un visitante contacta a Marc via WhatsApp usando el botón flotante, la página de contacto, o la página de WhatsApp funnel.

## Precondiciones

- WhatsApp float visible en todas las páginas
- Número: +18329534918

## Flujo Principal — WhatsApp Float

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Ve botón flotante de WhatsApp (bottom-right) | Botón con pulse animation |
| 2 | Click en el botón | — |
| 3 | — | Abre `https://wa.me/18329534918` en nueva pestaña |
| 4 | Envía mensaje a Marc por WhatsApp | — |

## Flujo Alternativo — Página de Contacto

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/contacto/` | Carga formulario de contacto |
| 2 | Ingresa nombre: "Ana García" | — |
| 3 | Ingresa email: "ana@email.com" | — |
| 4 | Ingresa mensaje: "Me interesa FlowTitan PRO" | — |
| 5 | Click "Enviar" | — |
| 6 | — | Escribe a Firestore `leads` con `source: 'contacto'` |
| 7 | — | Abre WhatsApp con mensaje pre-llenado: |
| 8 | — | `https://wa.me/18329534918?text=Hola Marc, soy Ana García. Me interesa FlowTitan PRO` |
| 9 | — | `onLeadCapture` Cloud Function notifica a Marc |

## Flujo Alternativo — Página WhatsApp Funnel

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/whatsapp/` | Carga página promocional del canal |
| 2 | Lee sobre el valor del canal de WhatsApp | — |
| 3 | Click "Únete al Canal" | — |
| 4 | — | Abre `https://wa.me/18329534918` |

## Postcondiciones

- Si usó formulario de contacto: lead guardado en Firestore
- WhatsApp abierto con conversación directa a Marc
- Marc puede responder directamente

## Reglas de Negocio

- WhatsApp es el canal principal de comunicación
- Número fijo: +18329534918 (nunca cambiar sin actualizar todos los puntos de contacto)
- WhatsApp float visible en TODAS las páginas
- Formulario de contacto hace dual: Firestore + WhatsApp redirect
- Mensaje pre-llenado incluye nombre y mensaje del formulario
