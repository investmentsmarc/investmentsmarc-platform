# SPEC-002 — Homepage

> Fase: 1 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-002
> Casos de Uso: [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)

---

## 1. Alcance

Página principal del sitio (`/`). Compuesta por 3 secciones: Hero, Blog Preview y Testimonios.

## 2. Ruta

- **Archivo:** `src/app/page.tsx`
- **Tipo:** Server Component (con islands client donde sea necesario)
- **Rendering:** SSG (Static Site Generation) con ISR para blog preview

## 3. Secciones

### 3.1 `<HeroSection />`

- **Ubicación:** `src/components/home/HeroSection.tsx`
- **Tipo:** Server Component
- **Referencia WP:** `functions.php` L47-194
- **Layout:**
  - Full viewport height (100vh menos ticker + header)
  - Background: imagen `FrontImage.jpg` con gradient overlay oscuro
  - Contenido alineado a la derecha (2/3 del ancho)
  - Badge: "Trading Profesional & Institucional"
  - Título H1: "Tu Camino Hacia el Trading Institucional"
  - Subtítulo: descripción del value proposition
  - CTA primario: botón dorado "Empieza Gratis" → `/curso-gratis/`
  - CTA secundario: botón outline "Conoce Más" → `/about-us/`
- **Estilos:**
  - `.mi-hero` con overlay gradient de izquierda a derecha
  - Badge usa `.mi-badge`
  - Botones usan `.mi-btn-gold` y `.mi-btn-outline`
- **Responsive:**
  - `<768px`: texto centrado, full width, CTAs apilados

### 3.2 `<LatestArticles />`

- **Ubicación:** `src/components/home/LatestArticles.tsx`
- **Tipo:** Server Component (fetch de Sanity en servidor)
- **Comportamiento:**
  - Título de sección: badge "Blog" + H2 "Últimos Análisis"
  - Grid de 3 `<BlogCard />` con los posts más recientes
  - Solo categorías propias (excluir RSS imports)
  - Botón "Ver Todos" → `/blog/`
  - **Fase 1:** Placeholder con datos estáticos
  - **Fase 2:** Query real a Sanity API
- **Data source:** Sanity GROQ query con filtro `category in ['Análisis de Mercado', 'Trading Institucional']`
- **ISR:** `revalidate: 3600` (1 hora)

### 3.3 `<Testimonials />`

- **Ubicación:** `src/components/home/Testimonials.tsx`
- **Tipo:** Server Component
- **Comportamiento:**
  - Título de sección: badge "Testimonios" + H2 "Lo Que Dicen Nuestros Estudiantes"
  - Grid de testimonios (3 columnas desktop, 1 mobile)
  - Cada testimonial card: avatar, nombre, rol, texto, rating (estrellas)
  - Datos hardcodeados inicialmente, migrar a Sanity en Fase 2
- **Estilos:** `.mi-testimonial-card` con glassmorphism border

## 4. SEO / Metadata

```typescript
export const metadata: Metadata = {
  title: 'Investments Marc — Trading Profesional & Institucional',
  description: 'Tu camino hacia el trading institucional. Cursos, herramientas y análisis de mercado para traders serios.',
  openGraph: {
    title: 'Investments Marc',
    description: 'Trading Profesional & Institucional',
    images: ['/images/og-image.jpg'],
    type: 'website',
  },
};
```

### Schema.org (via `<JsonLd />`)
- `WebSite`: nombre, URL, search action
- `FinancialService`: nombre, dirección, contacto, servicios

## 5. Criterios de Aceptación

- [ ] Hero: imagen de fondo visible, overlay correcto, CTAs funcionales
- [ ] Hero: responsive — texto centrado en mobile, lado derecho en desktop
- [ ] Blog preview: 3 cards visibles (placeholder en Fase 1)
- [ ] Testimonios: grid responsive, cards con glassmorphism
- [ ] Schema.org WebSite + FinancialService presentes en `<head>`
- [ ] Screenshot comparativo con WordPress muestra fidelidad visual
