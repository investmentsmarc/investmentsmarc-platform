# Diseño de Colección Firestore

Diseña o revisa una colección de Firestore para el proyecto.

**Argumentos:** `$ARGUMENTS` — nombre de la colección o feature, ejemplo: `enrollments` o `lead-capture`

## Instrucciones

1. Identifica la colección en `docs/architecture/firebase-schema.md`

2. Si ya existe: revisa y sugiere mejoras (índices, reglas de seguridad, queries)

3. Si es nueva: diseña el schema con:
   - Estructura de documento con tipos TypeScript
   - Subcolecciones si aplica
   - Índices necesarios para queries frecuentes
   - Reglas de seguridad (`firestore.rules` snippets)
   - Límites de Firestore a considerar (tamaño doc, nesting)

4. Genera:
   - Tipo TypeScript → añadir a `src/types/index.ts`
   - Función de acceso en `src/lib/firestore.ts`
   - Reglas de seguridad para `firestore.rules`

5. Actualiza `docs/architecture/firebase-schema.md`

## Colecciones existentes en el proyecto
Ver `docs/architecture/firebase-schema.md` para el schema completo.

Colecciones planificadas:
- `leads` — captura de leads (curso-gratis, webinar)
- `webinar_registrations` — registros de webinars
- `courses` — catálogo de cursos (Fase 4)
- `lessons` — lecciones por curso (Fase 4)
- `enrollments` — matrículas (Fase 4)
- `progress` — progreso por lección (Fase 4)
- `quiz_results` — resultados de quizzes (Fase 4)
- `testimonials` — testimonios (también en Sanity)
