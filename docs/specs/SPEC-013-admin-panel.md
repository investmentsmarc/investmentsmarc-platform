# SPEC-013 — Panel de Administración

> Fase: 4 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-030
> Casos de Uso: [UC-012](../use-cases/UC-012-admin-gestiona-cursos.md)

---

## 1. Alcance

Panel administrativo para que Marc gestione cursos, lecciones, leads y métricas del negocio.

## 2. Acceso

- **Ruta base:** `/admin/`
- **Protección:** `<ProtectedRoute requireAdmin={true} />`
- **Solo accesible por:** Usuarios con Custom Claim `admin: true`

## 3. Rutas del Admin

| Ruta | Descripción |
|------|-------------|
| `/admin/` | Dashboard principal (métricas) |
| `/admin/cursos/` | Lista de cursos (CRUD) |
| `/admin/cursos/nuevo/` | Crear curso |
| `/admin/cursos/[id]/editar/` | Editar curso |
| `/admin/cursos/[id]/lecciones/` | Gestionar lecciones del curso |
| `/admin/leads/` | Lista de leads capturados |
| `/admin/enrollments/` | Lista de matrículas |

## 4. Páginas

### 4.1 Dashboard (`/admin/`)

- **Métricas en cards:**
  - Total leads (este mes vs anterior)
  - Total enrollments (este mes)
  - Revenue total (Stripe)
  - Leads por source (pie chart o breakdown)
- **Listas rápidas:**
  - Últimos 5 leads
  - Últimos 5 enrollments
- **Fuentes de datos:** Queries agregados a Firestore

### 4.2 Gestión de Cursos (`/admin/cursos/`)

- **Lista:**
  - Tabla: título, precio, # lecciones, # enrolled, estado (activo/inactivo), acciones
  - Acciones: editar, toggle activo, ver lecciones
  - Botón: "Nuevo Curso"
- **Crear/Editar Curso:**
  - Form fields: title, slug (auto-gen), description, shortDescription, price, tags, coverImage (upload a Storage), stripePriceId, isActive
  - Guardar → Firestore `courses/{id}`
  - Validación: todos los campos required excepto tags

### 4.3 Gestión de Lecciones (`/admin/cursos/[id]/lecciones/`)

- **Lista:**
  - Tabla ordenable (drag & drop para reordenar)
  - Columnas: order, título, duración, isFree, acciones
  - Acciones: editar, eliminar, toggle isFree
- **Crear/Editar Lección:**
  - Form fields: title, description, videoUrl, duration (auto-detect si posible), order, isFree, resourcesUrl
  - Video: input de URL (Mux/Cloudflare Stream) — no upload directo por ahora
  - Guardar → Firestore `courses/{courseId}/lessons/{lessonId}`

### 4.4 Leads (`/admin/leads/`)

- **Lista:**
  - Tabla: nombre, email, whatsapp, source, fecha, estado notificación
  - Filtros: por source (curso-gratis, webinar, contacto), por fecha
  - Ordenar por fecha (más reciente primero)
  - Export CSV (opcional)
- **Detalle:** Click en lead abre modal con todos los datos

### 4.5 Enrollments (`/admin/enrollments/`)

- **Lista:**
  - Tabla: estudiante (email), curso, fecha, monto, Stripe session ID
  - Filtros: por curso, por fecha
  - Ordenar por fecha

## 5. Componentes UI del Admin

- Tabla reutilizable: `<AdminTable />`
- Form reutilizable: `<AdminForm />`
- Card de métrica: `<MetricCard />`
- Layout del admin: sidebar + content area
- Todos usan el design system `--mi-*` (consistente con el sitio público)

## 6. Firestore Queries

```typescript
// Ejemplo: métricas del dashboard
const leadsThisMonth = query(
  collection(db, 'leads'),
  where('createdAt', '>=', startOfMonth),
  orderBy('createdAt', 'desc')
);

const enrollmentsThisMonth = query(
  collection(db, 'enrollments'),
  where('enrolledAt', '>=', startOfMonth),
  orderBy('enrolledAt', 'desc')
);
```

## 7. Security Rules

```javascript
// Solo admin puede leer/escribir en admin
match /courses/{courseId} {
  allow read: if true;
  allow write: if request.auth.token.admin == true;

  match /lessons/{lessonId} {
    allow read: if true;
    allow write: if request.auth.token.admin == true;
  }
}

match /leads/{leadId} {
  allow create: if true;
  allow read, update, delete: if request.auth.token.admin == true;
}
```

## 8. Criterios de Aceptación

- [ ] Solo accesible con Custom Claim `admin: true`
- [ ] Dashboard muestra métricas correctas (leads, enrollments, revenue)
- [ ] CRUD de cursos funcional (crear, editar, toggle activo)
- [ ] CRUD de lecciones funcional con reordenamiento
- [ ] Lista de leads con filtros por source y fecha
- [ ] Lista de enrollments con filtros por curso
- [ ] Responsive básico (usable en tablet)
- [ ] Consistente con design system del sitio
