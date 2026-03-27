# SPEC-007 — Lead Capture (Curso Gratis + Webinar)

> Fase: 3 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-012, RF-013
> Casos de Uso: [UC-004](../use-cases/UC-004-lead-registro-curso-gratis.md), [UC-005](../use-cases/UC-005-lead-registro-webinar.md)

---

## 1. Alcance

Formularios de captura de leads que persisten en Firestore y disparan notificaciones automáticas via Cloud Functions.

## 2. Migración clave

**WordPress actual:** Formularios usan `localStorage` + redirect a WhatsApp.
**Nuevo:** Firestore como fuente de verdad + Cloud Functions para notificaciones.

## 3. Firestore Collection `leads`

```typescript
interface Lead {
  id: string;                           // auto-generated
  name: string;
  email: string;
  whatsapp?: string;
  source: 'curso-gratis' | 'webinar' | 'contacto';
  createdAt: Timestamp;
  notifiedWhatsApp: boolean;            // Cloud Function actualiza
  notifiedConvertKit: boolean;          // Cloud Function actualiza
  utmSource?: string;                   // tracking de origen
}
```

**Security Rules:** `allow create: if true` (cualquiera puede crear) / `allow read: if admin`

## 4. Páginas y Componentes

### 4.1 Curso Gratis (`/curso-gratis/`)

- **Archivo:** `src/app/curso-gratis/page.tsx`
- **Componente:** `<LeadForm />`
- **Ubicación:** `src/components/forms/LeadForm.tsx`
- **Tipo:** Client Component
- **Layout de página:**
  - Badge: "Curso Gratis"
  - H1: "Aprende Trading Institucional — Gratis"
  - Descripción del curso (bullet points de lo que incluye)
  - Formulario lateral (o debajo en mobile)
  - Social proof: "Ya se han registrado +500 traders"
- **Campos del form:**
  - Nombre completo — `text`, required
  - Email — `email`, required, validación formato
  - WhatsApp (opcional) — `tel`, placeholder "+1 (000) 000-0000"
- **Flujo on submit:**
  1. Validar campos (client-side)
  2. Escribir a Firestore `leads` con `source: 'curso-gratis'`
  3. Mostrar estado de carga (spinner en botón)
  4. On success: mostrar mensaje de confirmación + redirect suave
  5. On error: mostrar error inline, permitir retry
- **Post-submit:** Cloud Function `onLeadCapture` se activa automáticamente (ver SPEC-010)

### 4.2 Webinar (`/webinar/`)

- **Archivo:** `src/app/webinar/page.tsx`
- **Componentes:** `<WebinarForm />` + `<Countdown />`
- **Tipo:** Client Components

#### `<Countdown />`
- **Ubicación:** `src/components/forms/Countdown.tsx`
- **Hook:** `useCountdown`
- **Lógica:**
  ```typescript
  function getNextWebinar(): Date {
    // Próximo sábado 8:00 PM EST
    const now = new Date();
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + (6 - now.getDay()) % 7);
    saturday.setHours(20, 0, 0, 0); // 8 PM EST
    if (saturday <= now) saturday.setDate(saturday.getDate() + 7);
    return saturday;
  }
  ```
- **Display:** Días : Horas : Minutos : Segundos (animación de flip o fade)
- **Estilos:** Cajas individuales con fondo `--mi-bg-elevated`, números en `--mi-gold-light`

#### `<WebinarForm />`
- **Ubicación:** `src/components/forms/WebinarForm.tsx`
- **Campos:**
  - Nombre completo — `text`, required
  - Email — `email`, required
  - WhatsApp — `tel`, required (para enviar reminder)
- **Flujo on submit:**
  1. Validar campos
  2. Escribir a Firestore `leads` con `source: 'webinar'`
  3. Confirmación: "¡Registrado! Te enviaremos un recordatorio por WhatsApp"
- **Post-submit:** Cloud Function `onWebinarRegister` envía confirmación

### 4.3 Contacto (`/contacto/`)

- **Componente:** `<ContactForm />`
- **Ubicación:** `src/components/forms/ContactForm.tsx`
- **Tipo:** Client Component
- **Campos:**
  - Nombre — `text`, required
  - Email — `email`, required
  - Mensaje — `textarea`, required
- **Flujo on submit:**
  1. Escribir a Firestore `leads` con `source: 'contacto'`
  2. Abrir WhatsApp con mensaje pre-llenado:
     `https://wa.me/18329534918?text=Hola Marc, soy {nombre}. {mensaje}`
  3. Confirmación visual

## 5. Estilos de Formularios

- Forms usan `.mi-form` (glassmorphic card)
- Inputs: `.mi-input` — borde `--mi-border`, focus `--mi-gold-light`
- Botón submit: `.mi-btn-gold`
- Error state: borde rojo + mensaje debajo del input
- Success state: checkmark animado + mensaje verde
- Loading state: spinner en botón, inputs disabled

## 6. UTM Tracking

Todos los formularios capturan UTM params de la URL:
```typescript
const utmSource = new URLSearchParams(window.location.search).get('utm_source');
```
Se guarda en el documento de Firestore para análisis posterior.

## 7. Criterios de Aceptación

- [ ] Lead form: escribe a Firestore con todos los campos + source correcto
- [ ] Webinar form: countdown muestra tiempo correcto al próximo sábado 8pm EST
- [ ] Contacto: abre WhatsApp con mensaje pre-llenado
- [ ] Validación client-side funcional (email format, campos required)
- [ ] Estados: loading, success, error visualmente claros
- [ ] UTM params capturados cuando están presentes
- [ ] Cloud Functions se disparan al crear lead (verificar en Firebase Console)
- [ ] Responsive en 768px y 1024px
