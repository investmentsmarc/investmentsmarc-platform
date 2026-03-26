# Firebase Schema — Investments Marc

**Proyecto:** `investments-marc-prod`

## Firestore Collections

### `leads` (Fase 3)
Captura de interés desde formularios de lead magnet y webinar.

```typescript
interface Lead {
  id: string;                           // auto-generated
  name: string;
  email: string;
  whatsapp?: string;
  source: 'curso-gratis' | 'webinar' | 'contacto';
  createdAt: Timestamp;
  notifiedWhatsApp: boolean;            // Cloud Function lo actualiza
  notifiedConvertKit: boolean;          // Cloud Function lo actualiza
  utmSource?: string;                   // tracking de origen
}
```

**Índices:** `source` + `createdAt DESC` (para panel admin)

---

### `courses` (Fase 4)
Catálogo de cursos disponibles.

```typescript
interface Course {
  id: string;
  slug: string;                         // URL-friendly
  title: string;
  description: string;
  price: number;
  currency: 'USD';
  coverImageUrl: string;
  tags: string[];
  publishedAt: Timestamp;
  isActive: boolean;
  stripePriceId: string;               // ID de Price en Stripe
}
```

**Subcolección:** `courses/{courseId}/lessons`

```typescript
interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;                    // Mux o Cloudflare Stream
  duration: number;                    // segundos
  order: number;
  isFree: boolean;
  resourcesUrl?: string;              // PDF, plantillas
}
```

---

### `enrollments` (Fase 4)
Matrículas de estudiantes. Se crea via Cloud Function al completar pago Stripe.

```typescript
interface Enrollment {
  id: string;
  userId: string;                      // Firebase Auth UID
  courseId: string;
  enrolledAt: Timestamp;
  stripeSessionId: string;
  stripePaymentIntentId: string;
  amount: number;
  currency: 'USD';
}
```

**Índices:** `userId` + `enrolledAt DESC`

---

### `progress` (Fase 4)
Progreso de lecciones completadas por estudiante.

```typescript
interface Progress {
  id: string;                          // {userId}_{courseId}_{lessonId}
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: Timestamp;
}
```

**Query frecuente:** `userId == x AND courseId == y` → índice compuesto necesario

---

### `quiz_results` (Fase 4)

```typescript
interface QuizResult {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  score: number;                       // 0-100
  answers: Record<string, string>;    // questionId → answer
  completedAt: Timestamp;
}
```

---

## Firebase Auth (Fase 4)

| Provider | Uso |
|----------|-----|
| Email/Password | Login de estudiantes |
| Google OAuth | Login rápido |
| Custom Claims | `admin: true` para panel admin |

---

## Firebase Storage

```
/images/
  FrontImage.jpg          ← Hero background
  og-image.jpg            ← Open Graph
  logo.png
  favicon.ico
  about/
    marc-photo.jpg
  courses/
    {courseId}/
      cover.jpg
      {lessonId}/
        resources.pdf
```

---

## Cloud Functions v2 (functions/src/)

| Función | Trigger | Descripción |
|---------|---------|-------------|
| `onLeadCapture` | Firestore `leads` onCreate | → WhatsApp +18329534918 + ConvertKit |
| `onWebinarRegister` | Firestore `leads` (source=webinar) | → WhatsApp + email confirmación |
| `stripeWebhook` | HTTP POST `/api/stripe/webhook` | `checkout.session.completed` → crea enrollment |
| `generateCertificate` | Callable | Genera PDF certificado por curso completado |
| `onEnrollment` | Firestore `enrollments` onCreate | → Email bienvenida + acceso curso |

---

## Reglas de Seguridad (firestore.rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Leads: cualquiera puede crear, solo admins leen
    match /leads/{leadId} {
      allow create: if true;
      allow read, update, delete: if request.auth.token.admin == true;
    }

    // Cursos: lectura pública, escritura solo admin
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;

      match /lessons/{lessonId} {
        allow read: if true;
        allow write: if request.auth.token.admin == true;
      }
    }

    // Enrollments: solo el usuario propietario
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if false; // solo via Cloud Function (Stripe webhook)
    }

    // Progress: solo el usuario propietario
    match /progress/{progressId} {
      allow read, write: if request.auth != null
        && resource.data.userId == request.auth.uid;
    }
  }
}
```
