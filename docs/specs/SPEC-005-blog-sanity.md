# SPEC-005 — Blog con Sanity CMS

> Fase: 2 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-006, RF-007
> Casos de Uso: [UC-003](../use-cases/UC-003-visitante-lee-blog.md)

---

## 1. Alcance

Sistema de blog completo con Sanity.io como CMS headless: archive, single post, categorías, y preview en homepage.

## 2. Sanity Studio

### 2.1 Schema `post`

```typescript
// sanity/schemas/post.ts
{
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', type: 'slug', options: { source: 'title' } },
    { name: 'excerpt', type: 'text', rows: 3 },
    { name: 'category', type: 'string', options: {
      list: ['Análisis de Mercado', 'Trading Institucional', 'Educación Financiera']
    }},
    { name: 'coverImage', type: 'image', options: { hotspot: true } },
    { name: 'body', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
    { name: 'publishedAt', type: 'datetime' },
    { name: 'isFeatured', type: 'boolean', initialValue: false },
  ]
}
```

### 2.2 Schema `testimonial`

```typescript
// sanity/schemas/testimonial.ts
{
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    { name: 'name', type: 'string' },
    { name: 'role', type: 'string' },
    { name: 'avatar', type: 'image' },
    { name: 'text', type: 'text' },
    { name: 'rating', type: 'number', validation: Rule => Rule.min(1).max(5) },
    { name: 'isActive', type: 'boolean', initialValue: true },
  ]
}
```

## 3. Sanity Client

- **Archivo:** `src/lib/sanity.ts`
- **Config:**
  - `projectId`: desde `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - `dataset`: `'production'`
  - `apiVersion`: `'2026-03-26'`
  - `useCdn`: `true` (producción), `false` (preview)

## 4. Rutas y Componentes

### 4.1 Blog Archive (`/blog/`)

- **Archivo:** `src/app/blog/page.tsx`
- **Tipo:** Server Component con ISR
- **Revalidation:** `revalidate: 3600` (1 hora)
- **GROQ Query:**
  ```groq
  *[_type == "post" && category in ["Análisis de Mercado", "Trading Institucional"]] | order(publishedAt desc) {
    title, slug, excerpt, category, coverImage, publishedAt
  }
  ```
- **Layout:**
  - Badge: "Blog"
  - Título H1: "Análisis & Insights de Mercado"
  - Filtro de categorías: tabs/pills (Todos, Análisis de Mercado, Trading Institucional)
  - Grid de `<BlogCard />` (3 columnas desktop, 1 mobile)
- **Importante:** Filtrar RSS imports — solo mostrar categorías propias

### 4.2 Blog Card

- **Ubicación:** `src/components/blog/BlogCard.tsx`
- **Tipo:** Server Component
- **Props:** `{ post: BlogPost }`
- **Layout:**
  - Cover image con aspect ratio 16:9
  - Categoría badge
  - Título (H3)
  - Excerpt (2 líneas max)
  - Fecha publicación
  - Hover: scale 1.02 + border glow
- **Estilos:** `.mi-blog-card`

### 4.3 Single Post (`/blog/[slug]/`)

- **Archivo:** `src/app/blog/[slug]/page.tsx`
- **Tipo:** Server Component
- **`generateStaticParams`:** Pre-genera los 5 posts migrados
- **GROQ Query:**
  ```groq
  *[_type == "post" && slug.current == $slug][0] {
    title, body, coverImage, category, publishedAt,
    "related": *[_type == "post" && category == ^.category && slug.current != $slug][0..2] {
      title, slug, coverImage, publishedAt
    }
  }
  ```
- **Layout:**
  - `<PostHero />`: cover image full width, título overlay, categoría, fecha
  - Body: Portable Text renderizado con componentes custom
  - Related posts al final (hasta 3)
- **Schema.org:** `Article` con author, datePublished, headline, image

### 4.4 Post Hero

- **Ubicación:** `src/components/blog/PostHero.tsx`
- **Tipo:** Server Component
- **Layout:**
  - Imagen cover full-width con overlay gradient oscuro
  - Categoría badge
  - H1 título del post
  - Fecha + tiempo de lectura estimado
- **Estilos:** `.mi-post-hero`

## 5. Posts a Migrar (5 existentes)

| # | Título | Categoría |
|---|--------|-----------|
| 1 | Las Siete Magníficas en 2026: El Crash del 17% | Análisis de Mercado |
| 2 | La Fed en 2026: Recortes Pausados, Inflación Resistente | Análisis de Mercado |
| 3 | Aranceles Trump 2026: La Guerra Comercial Escala | Análisis de Mercado |
| 4 | Geopolítica 2026: Paz en Ucrania, Tensión en Asia | Análisis de Mercado |
| 5 | Smart Money Concepts: Cómo los Institucionales Mueven los Mercados | Trading Institucional |

## 6. Criterios de Aceptación

- [ ] 5 posts migrados y visibles en `/blog/`
- [ ] Filtro de categorías funcional (no muestra RSS imports)
- [ ] Single post renderiza Portable Text correctamente
- [ ] Related posts aparecen al final del artículo
- [ ] Schema.org `Article` en cada post
- [ ] ISR revalida cada hora
- [ ] `<LatestArticles />` en homepage muestra 3 posts reales de Sanity
- [ ] Responsive: grid 3-col desktop, 1-col mobile
