# SPEC-010 — Cloud Functions

> Fases: 3, 4 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-014, RF-015, RF-024, RF-029
> Casos de Uso: [UC-004](../use-cases/UC-004-lead-registro-curso-gratis.md), [UC-005](../use-cases/UC-005-lead-registro-webinar.md), [UC-007](../use-cases/UC-007-estudiante-compra-curso.md), [UC-011](../use-cases/UC-011-estudiante-obtiene-certificado.md)

---

## 1. Alcance

Cloud Functions v2 que manejan side-effects: notificaciones WhatsApp, emails, webhooks de Stripe y generación de certificados.

## 2. Ubicación

```
functions/
├── src/
│   ├── index.ts                    # Export de todas las functions
│   ├── onLeadCapture.ts           # Fase 3
│   ├── onWebinarRegister.ts       # Fase 3
│   ├── stripeWebhook.ts           # Fase 4
│   ├── onEnrollment.ts            # Fase 4
│   ├── generateCertificate.ts     # Fase 4
│   └── agents/                    # Fase 5
├── package.json
└── tsconfig.json
```

## 3. Functions — Fase 3

### 3.1 `onLeadCapture`

- **Trigger:** Firestore `onCreate` en `leads`
- **Runtime:** Node.js 20
- **Comportamiento:**
  1. Lee datos del nuevo documento `leads/{leadId}`
  2. Envía notificación WhatsApp a +18329534918:
     - Mensaje: "Nuevo lead: {name} ({email}) — Source: {source}"
     - Via WhatsApp Business API o servicio como Twilio
  3. Añade contacto a ConvertKit:
     - POST a ConvertKit API con email + nombre
     - Tag según source: `curso-gratis`, `webinar`, `contacto`
  4. Actualiza documento: `{ notifiedWhatsApp: true, notifiedConvertKit: true }`
- **Error handling:**
  - Si WhatsApp falla: log error, marcar `notifiedWhatsApp: false`, no reintentar automáticamente
  - Si ConvertKit falla: log error, marcar `notifiedConvertKit: false`
  - La función no falla (no throw) — los fallos parciales se marcan en el documento
- **Config (env vars):**
  - `WHATSAPP_API_KEY`
  - `WHATSAPP_PHONE_ID`
  - `CONVERTKIT_API_KEY`
  - `CONVERTKIT_FORM_ID`

### 3.2 `onWebinarRegister`

- **Trigger:** Firestore `onCreate` en `leads` con filtro `source == 'webinar'`
- **Comportamiento:**
  1. Lee datos del lead
  2. Envía WhatsApp de confirmación al usuario (si proporcionó WhatsApp):
     - "¡Registrado para el webinar del {fecha}! Te esperamos el sábado a las 8pm EST."
  3. Envía email de confirmación via ConvertKit:
     - Template: confirmación de webinar con fecha y link de acceso
  4. Notifica a Marc via WhatsApp (delegado a `onLeadCapture`)
- **Nota:** Esta function se ejecuta ADEMÁS de `onLeadCapture` (ambas se disparan en `onCreate`)

## 4. Functions — Fase 4

### 4.1 `stripeWebhook`

- **Trigger:** HTTP POST (`onRequest`)
- **Endpoint:** `/api/stripe/webhook` (Next.js API Route proxies a Cloud Function)
- **Comportamiento:**
  1. Verifica firma del webhook con `stripe.webhooks.constructEvent()`
  2. Maneja evento `checkout.session.completed`:
     a. Extrae `metadata.userId` y `metadata.courseId` de la session
     b. Crea documento en `enrollments`:
        ```typescript
        {
          userId: session.metadata.userId,
          courseId: session.metadata.courseId,
          enrolledAt: Timestamp.now(),
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
          amount: session.amount_total / 100,
          currency: 'USD',
        }
        ```
     c. Log de la transacción
  3. Responde `200 OK` a Stripe
- **Error handling:**
  - Firma inválida → `400 Bad Request`
  - Error procesando → `500` (Stripe reintenta automáticamente)
- **Config:**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`

### 4.2 `onEnrollment`

- **Trigger:** Firestore `onCreate` en `enrollments`
- **Comportamiento:**
  1. Lee el enrollment + datos del curso y del usuario
  2. Envía email de bienvenida via ConvertKit:
     - "¡Bienvenido a {courseName}! Ya puedes acceder a tus lecciones."
     - Link directo a la primera lección
  3. Envía WhatsApp de confirmación al usuario (si tiene WhatsApp registrado)

### 4.3 `generateCertificate`

- **Trigger:** Callable function (`onCall`)
- **Parámetros:** `{ userId: string, courseId: string }`
- **Comportamiento:**
  1. Verifica que el usuario completó todas las lecciones del curso:
     - Query: `progress` donde `userId == x AND courseId == y`
     - Compara count con total de lecciones del curso
  2. Si completo:
     a. Genera PDF con PDFKit o similar:
        - Logo Investments Marc
        - "Certificado de Completación"
        - Nombre del estudiante
        - Nombre del curso
        - Fecha de completación
        - Firma digital de Marc
     b. Sube PDF a Firebase Storage: `certificates/{userId}_{courseId}.pdf`
     c. Retorna URL del certificado
  3. Si incompleto: retorna error con lecciones faltantes
- **Seguridad:** Solo el usuario propietario puede solicitar su certificado

## 5. Logging y Monitoring

- Todas las functions usan `logger` de `firebase-functions/v2`:
  ```typescript
  import { logger } from 'firebase-functions/v2';
  logger.info('Lead captured', { leadId, source });
  logger.error('WhatsApp notification failed', { error });
  ```
- Alertas configurables en Firebase Console para errores recurrentes

## 6. Testing Local

- Firebase Emulators: `firebase emulators:start --only functions,firestore`
- Shell: `firebase functions:shell` para testing manual

## 7. Criterios de Aceptación

- [ ] `onLeadCapture`: notificación WhatsApp recibida en <30s
- [ ] `onLeadCapture`: contacto aparece en ConvertKit con tag correcto
- [ ] `onWebinarRegister`: usuario recibe confirmación por WhatsApp
- [ ] `stripeWebhook`: enrollment creado en Firestore tras pago exitoso
- [ ] `stripeWebhook`: firma inválida retorna 400
- [ ] `onEnrollment`: email de bienvenida enviado
- [ ] `generateCertificate`: PDF generado con datos correctos
- [ ] `generateCertificate`: rechaza si curso no completado
- [ ] Todas las functions deployadas y visibles en Firebase Console
- [ ] Logs visibles en Cloud Logging
