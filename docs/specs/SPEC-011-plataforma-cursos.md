# SPEC-011 — Plataforma de Cursos

> Fase: 4 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-021, RF-022, RF-025, RF-026, RF-027, RF-028
> Casos de Uso: [UC-007](../use-cases/UC-007-estudiante-compra-curso.md), [UC-008](../use-cases/UC-008-estudiante-cursa-leccion.md), [UC-009](../use-cases/UC-009-estudiante-completa-quiz.md)

---

## 1. Alcance

Plataforma de cursos custom integrada en el sitio principal, con catálogo, compra via Stripe, reproductor de video, tracking de progreso, quizzes y certificados.

## 2. Modelo de Datos (Firestore)

### `courses`
```typescript
interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;       // Texto largo para landing
  shortDescription: string;  // Para cards del catálogo
  price: number;
  currency: 'USD';
  coverImageUrl: string;
  tags: string[];             // ['trading', 'institucional', 'principiante']
  publishedAt: Timestamp;
  isActive: boolean;
  stripePriceId: string;
  totalLessons: number;       // Denormalized count
  totalDuration: number;      // Segundos totales (denormalized)
}
```

### `courses/{id}/lessons` (subcolección)
```typescript
interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl: string;           // Mux o Cloudflare Stream playback URL
  duration: number;           // Segundos
  order: number;              // Para ordenar
  isFree: boolean;            // Preview gratis
  resourcesUrl?: string;      // PDF, plantillas descargables
}
```

### `progress`
```typescript
interface Progress {
  id: string;                 // {userId}_{courseId}_{lessonId}
  userId: string;
  courseId: string;
  lessonId: string;
  completedAt: Timestamp;
}
```

### `quiz_results`
```typescript
interface QuizResult {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  score: number;              // 0-100
  answers: Record<string, string>;
  completedAt: Timestamp;
}
```

## 3. Rutas

| Ruta | Tipo | Protección | Descripción |
|------|------|-----------|-------------|
| `/cursos/` | Server + ISR | Pública | Catálogo de cursos |
| `/cursos/[slug]/` | Server + ISR | Pública | Landing de curso |
| `/cursos/[slug]/lecciones/` | Client | Auth + Enrollment | Lista de lecciones |
| `/cursos/[slug]/lecciones/[id]/` | Client | Auth + Enrollment | Reproductor de lección |
| `/dashboard/` | Client | Auth | Dashboard del estudiante |

## 4. Páginas y Componentes

### 4.1 Catálogo (`/cursos/`)

- **Archivo:** `src/app/cursos/page.tsx`
- **Tipo:** Server Component con ISR
- **Query Firestore:** `courses` donde `isActive == true`, order by `publishedAt desc`
- **Layout:**
  - Badge: "Cursos"
  - H1: "Aprende Trading Institucional"
  - Subtítulo con value proposition
  - Grid de `<CourseCard />`
- **CourseCard:**
  - Cover image
  - Tags (badges)
  - Título
  - Short description
  - Precio (formateado: "$99 USD")
  - Total lecciones + duración total
  - CTA: "Ver Curso →"

### 4.2 Landing de Curso (`/cursos/[slug]/`)

- **Archivo:** `src/app/cursos/[slug]/page.tsx`
- **Tipo:** Server Component
- **Layout:**
  - Hero: cover image + título + precio
  - Descripción completa (rich text)
  - Temario: lista de lecciones con título, duración, icono lock/unlock
  - Lecciones gratuitas marcadas como "Vista Previa"
  - Social proof: número de estudiantes enrollados
  - CTA fijo: "Comprar Curso — $XX" → inicia Stripe Checkout
  - Sección FAQ específica del curso
- **Schema.org:** `Course` con name, description, provider, offers

### 4.3 Lista de Lecciones (`/cursos/[slug]/lecciones/`)

- **Protección:** `<ProtectedRoute />` + verificar enrollment
- **Layout:**
  - Sidebar: lista de lecciones con checkmarks de completadas
  - Progreso: barra de progreso (X de Y completadas)
  - Click en lección → navega a `/cursos/[slug]/lecciones/[id]/`
  - Lecciones completadas con checkmark verde
  - Lección actual destacada

### 4.4 Reproductor de Lección (`/cursos/[slug]/lecciones/[id]/`)

- **Protección:** Auth + Enrollment (o `isFree == true`)
- **Layout:**
  - Video player (Mux o Cloudflare Stream)
  - Título de la lección
  - Descripción / notas
  - Recursos descargables (si hay)
  - Botón "Marcar como Completada" → escribe a `progress`
  - Navegación: "← Anterior" / "Siguiente →"
  - Quiz inline (si la lección tiene quiz)
- **Video Player:**
  - Responsive (16:9)
  - Controles: play/pause, volumen, fullscreen, velocidad
  - Resume from last position (opcional, via localStorage)
  - No permite descargar el video

### 4.5 Dashboard del Estudiante (`/dashboard/`)

- **Protección:** `<ProtectedRoute />`
- **Layout:**
  - Header: "Hola, {displayName}"
  - Grid de cursos comprados:
    - Cover image
    - Título
    - Barra de progreso (% completado)
    - CTA: "Continuar" → última lección no completada
  - Si no tiene cursos: CTA "Explorar Cursos" → `/cursos/`

## 5. Quizzes

### 5.1 Formato

```typescript
interface Quiz {
  lessonId: string;
  questions: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctOptionId: string;
  }[];
  passingScore: number;  // e.g., 70
}
```

### 5.2 Comportamiento

- Aparece después del video de la lección
- Preguntas de selección múltiple (4 opciones)
- Submit → calcula score → guarda en `quiz_results`
- Score ≥ passingScore → marca lección como completada automáticamente
- Score < passingScore → puede reintentar
- Muestra respuestas correctas después de submit

### 5.3 Almacenamiento

- Quizzes stored como JSON dentro del documento de la lección o como subcolección
- Decisión: subcolección `courses/{id}/lessons/{id}/quiz` para flexibilidad

## 6. Video Hosting

### Opción A: Mux
- **Pro:** Player optimizado, analytics, adaptive streaming
- **Contra:** $0.007/min de video almacenado + $0.007/min de streaming
- **Estimado:** $5-20/mes para 50-200 videos cortos

### Opción B: Cloudflare Stream
- **Pro:** $1/1000 min almacenado + $1/1000 min visto, CDN global
- **Contra:** Player más básico
- **Estimado:** $5-15/mes

**Decisión:** Evaluar ambos en Fase 4. Iniciar con Mux por mejor DX.

## 7. Criterios de Aceptación

- [ ] Catálogo muestra cursos activos con cards correctas
- [ ] Landing de curso muestra temario con lecciones y precios
- [ ] Lecciones gratuitas visibles sin auth
- [ ] Lecciones pagas requieren auth + enrollment
- [ ] Video player funcional y responsive
- [ ] "Marcar como Completada" actualiza progreso en Firestore
- [ ] Dashboard muestra % de progreso correcto
- [ ] Quiz funcional: submit, scoring, retry
- [ ] Navegación entre lecciones (anterior/siguiente)
- [ ] Schema.org `Course` en landing de curso
- [ ] Responsive en 768px y 1024px
