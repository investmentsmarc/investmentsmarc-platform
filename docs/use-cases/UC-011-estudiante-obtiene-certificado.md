# UC-011 — Estudiante Obtiene Certificado

> Actor Principal: Estudiante (autenticado + curso completado)
> Prioridad: SHOULD | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-029
> Specs: [SPEC-010](../specs/SPEC-010-cloud-functions.md)

---

## Descripción

Un estudiante que completó el 100% de las lecciones de un curso solicita y descarga su certificado de completación en PDF.

## Precondiciones

- Estudiante autenticado con Firebase Auth
- 100% de lecciones del curso marcadas como completadas en `progress`
- Cloud Function `generateCertificate` desplegada

## Flujo Principal

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Completa la última lección del curso | — |
| 2 | — | Muestra: "¡Felicidades! Completaste el curso." |
| 3 | — | CTA: "Obtener Certificado" |
| 4 | Click "Obtener Certificado" | — |
| 5 | — | Llama Cloud Function `generateCertificate({ userId, courseId })` |
| 6 | — | Function verifica: todas las lecciones completadas ✓ |
| 7 | — | Genera PDF con: logo, nombre, curso, fecha, firma |
| 8 | — | Sube PDF a Storage: `certificates/{userId}_{courseId}.pdf` |
| 9 | — | Retorna URL del certificado |
| 10 | — | Muestra: "Tu certificado está listo" + botón "Descargar PDF" |
| 11 | Click "Descargar PDF" | — |
| 12 | — | Descarga el PDF del certificado |

## Flujo Alternativo — Certificado Ya Generado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Vuelve a `/dashboard/` después de tiempo | — |
| 2 | Ve curso con 100% completado | — |
| 3 | Click "Descargar Certificado" | — |
| 4 | — | Verifica si ya existe en Storage: `certificates/{userId}_{courseId}.pdf` |
| 5 | — | Si existe: retorna URL directamente (no regenera) |
| 6 | — | Descarga el PDF |

## Flujo de Error — Curso Incompleto

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Intenta solicitar certificado con 90% completado | — |
| 2 | — | Function verifica: faltan lecciones |
| 3 | — | Retorna error: "Faltan 2 lecciones por completar" |
| 4 | — | Lista las lecciones faltantes con links |

## Contenido del Certificado PDF

```
┌──────────────────────────────────────────────┐
│                                              │
│          [Logo Investments Marc]             │
│                                              │
│         CERTIFICADO DE COMPLETACIÓN          │
│                                              │
│  Este certificado acredita que               │
│                                              │
│           CARLOS RUIZ                        │
│                                              │
│  ha completado satisfactoriamente el curso   │
│                                              │
│     "TRADING INSTITUCIONAL"                  │
│                                              │
│  Fecha de completación: 15 de abril, 2026   │
│                                              │
│           ___________________                │
│           Marc — Investments Marc            │
│                                              │
│  ID: cert_abc123def456                       │
│                                              │
└──────────────────────────────────────────────┘
```

## Postcondiciones

- PDF generado y almacenado en Firebase Storage
- URL del certificado accesible para el estudiante
- Certificado descargable desde el dashboard

## Reglas de Negocio

- Solo se genera certificado con 100% de lecciones completadas
- Certificado es idempotente: solicitar 2 veces no genera 2 PDFs
- Incluye ID único para verificación
- Formato: PDF A4 landscape
- Generado server-side via Cloud Function (no client-side)
