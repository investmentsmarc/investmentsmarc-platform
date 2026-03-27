# SPEC-012 — Integración Stripe

> Fase: 4 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-023, RF-024
> Casos de Uso: [UC-007](../use-cases/UC-007-estudiante-compra-curso.md)

---

## 1. Alcance

Integración de Stripe Checkout para la compra de cursos. Flujo completo: creación de sesión, pago, webhook y provisión de acceso.

## 2. Flujo de Pago

```
1. Estudiante → Click "Comprar Curso" en /cursos/[slug]/
2. Client → POST /api/stripe/checkout con { courseId, userId }
3. API Route → Stripe.checkout.sessions.create()
4. Stripe → Redirect a Checkout hosted page
5. Estudiante → Completa pago en Stripe
6. Stripe → POST webhook a /api/stripe/webhook
7. Cloud Function → Verifica firma, crea enrollment en Firestore
8. Cloud Function onEnrollment → Email bienvenida
9. Stripe → Redirect success a /cursos/[slug]/lecciones/?success=true
```

## 3. API Routes (Next.js)

### 3.1 POST `/api/stripe/checkout`

- **Archivo:** `src/app/api/stripe/checkout/route.ts`
- **Auth:** Requiere usuario autenticado (verificar Firebase ID token)
- **Body:**
  ```typescript
  { courseId: string }
  ```
- **Lógica:**
  1. Verificar que el usuario no tiene enrollment existente para este curso
  2. Obtener curso de Firestore → `stripePriceId`
  3. Crear Stripe Checkout Session:
     ```typescript
     const session = await stripe.checkout.sessions.create({
       mode: 'payment',
       payment_method_types: ['card'],
       line_items: [{
         price: course.stripePriceId,
         quantity: 1,
       }],
       metadata: {
         userId: uid,
         courseId: courseId,
       },
       success_url: `${origin}/cursos/${course.slug}/lecciones/?success=true`,
       cancel_url: `${origin}/cursos/${course.slug}/?cancelled=true`,
       customer_email: user.email,
     });
     ```
  4. Retornar `{ sessionId: session.id, url: session.url }`
- **Errores:**
  - 401: No autenticado
  - 400: Curso no existe o ya enrolled
  - 500: Error de Stripe

### 3.2 POST `/api/stripe/webhook`

- **Archivo:** `src/app/api/stripe/webhook/route.ts`
- **Auth:** Verificación de firma Stripe (no Firebase Auth)
- **Lógica:**
  1. Leer raw body (importante: no parsear JSON antes de verificar)
  2. `stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)`
  3. Switch por `event.type`:
     - `checkout.session.completed`: delegar a Cloud Function `stripeWebhook`
  4. Retornar `200 OK`
- **Config Next.js:** Desactivar body parser para esta ruta:
  ```typescript
  export const config = { api: { bodyParser: false } };
  ```

## 4. Stripe Dashboard Setup

### 4.1 Products y Prices

Cada curso tiene un Product en Stripe con un Price asociado:

| Curso | Stripe Product | Price | Monto |
|-------|---------------|-------|-------|
| FlowTitan PRO Course | `prod_xxx` | `price_xxx` | $99 USD (one-time) |
| Trading Institucional | `prod_yyy` | `price_yyy` | $149 USD (one-time) |

### 4.2 Webhook Endpoint

- **URL:** `https://investmentsmarc.com/api/stripe/webhook`
- **Eventos:** `checkout.session.completed`
- **Signing Secret:** guardar en `STRIPE_WEBHOOK_SECRET`

## 5. Stripe Client SDK

```typescript
// src/lib/stripe.ts
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});
```

Para el client-side redirect:
```typescript
// Redirect directo a session.url (no necesita @stripe/stripe-js)
window.location.href = session.url;
```

## 6. Seguridad

| Aspecto | Implementación |
|---------|---------------|
| API Key | Solo en server-side (`STRIPE_SECRET_KEY` en env) |
| Webhook signature | Verificación obligatoria con `STRIPE_WEBHOOK_SECRET` |
| Idempotency | Verificar enrollment existente antes de crear |
| PCI compliance | Stripe Checkout hosted = PCI scope reducido (SAQ A) |
| Metadata | userId y courseId en session metadata para tracing |

## 7. Testing

- **Modo test:** Usar `sk_test_*` keys durante desarrollo
- **Cards de prueba:**
  - `4242 4242 4242 4242` → Pago exitoso
  - `4000 0000 0000 0002` → Declined
- **Webhook local:** `stripe listen --forward-to localhost:3000/api/stripe/webhook`

## 8. Criterios de Aceptación

- [ ] Click "Comprar" → redirect a Stripe Checkout
- [ ] Pago exitoso → enrollment creado en Firestore
- [ ] Pago exitoso → redirect a lecciones con `?success=true`
- [ ] Pago cancelado → redirect a landing con `?cancelled=true`
- [ ] Webhook verifica firma correctamente
- [ ] Doble pago del mismo curso → rechazado (enrollment ya existe)
- [ ] Testing con cards de prueba: success y decline
- [ ] Email de bienvenida enviado tras enrollment
