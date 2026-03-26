# Design System — Investments Marc

**Tema:** Dark Fintech · Oro institucional
**Versión portada desde:** blocksy-child/style.css v7.0.0

## Filosofía

El design system de Investments Marc transmite **confianza institucional**.
- Fondos muy oscuros (casi negro) → seriedad, profesionalismo
- Gold refinado (no amarillo) → valor, exclusividad
- Tipografía apretada con letter-spacing negativo → densidad informacional
- Bordes sutiles y neutros → limpieza, sin ruido visual
- Shadows **nunca con tint dorado** → elegancia sobria

## Tokens de Color

```css
/* Backgrounds — oscalada de más oscuro a más claro */
--mi-bg-primary:   #0a0a0a  /* Base de la app */
--mi-bg-secondary: #111111  /* Cards, paneles */
--mi-bg-tertiary:  #171717  /* Inputs, hover */
--mi-bg-elevated:  #1a1a1a  /* Modals, dropdowns */

/* Gold — la identidad de marca */
--mi-gold-light:   #C9A84C  /* Gold principal */
--mi-gold-dark:    #A68A3E  /* Gold hover/decorativo */
--mi-gold-gradient: linear-gradient(135deg, #C9A84C 0%, #A68A3E 100%)

/* Texto — jerarquía por opacidad */
--mi-text-primary:   rgba(255, 255, 255, 0.92)  /* Títulos */
--mi-text-secondary: rgba(255, 255, 255, 0.55)  /* Párrafos */
--mi-text-tertiary:  rgba(255, 255, 255, 0.35)  /* Metadata */

/* Bordes — neutros */
--mi-border:        rgba(255, 255, 255, 0.08)   /* Default */
--mi-border-strong: rgba(255, 255, 255, 0.14)   /* Hover */
```

## Tipografía

**Fuente:** Inter (Google Fonts via `next/font/google`)
- Pesos usados: 400, 500, 600, 700
- `letter-spacing: -0.011em` en body (tipografía más apretada)
- Títulos: `letter-spacing: -0.03em`, `font-weight: 600`
- `font-feature-settings: 'cv11', 'ss01'` — variantes más limpias

## Escala Tipográfica

| Elemento | Tamaño | Peso |
|----------|--------|------|
| Section title | `clamp(2.2rem, 4vw, 3.25rem)` | 600 |
| Hero phrase | `clamp(2rem, 4vw, 3.2rem)` | 600 |
| Card title | `1.15-1.5rem` | 600 |
| Body | `1rem` | 400 |
| Small / meta | `0.75-0.85rem` | 400-500 |
| Badge / label | `0.7rem` | 500 |

## Espaciado

- Section padding: `120px 6%` (desktop) → `60px 6%` (mobile)
- Container max-width: `1120px` con `padding: 0 32px`
- Cards: `padding: 40px`
- Grid gap: `30-80px` dependiendo del contexto

## Componentes Base

### Badge
```tsx
<span className="mi-badge">Trading Institucional</span>
```
Gold border, texto gold, fondo gold muy tenue.

### Gold Button
```tsx
<button className="mi-btn-gold">Empezar ahora</button>
<button className="mi-btn-outline">Saber más</button>
```

### Card
```tsx
<div className="mi-value-card">contenido</div>    // valores/features
<div className="mi-blog-card">contenido</div>      // posts del blog
<div className="mi-card-elevated">contenido</div>  // elevación mejorada
```

## Efectos Especiales (design-system.css)

| Clase | Efecto |
|-------|--------|
| `.mi-glass` | Glassmorphism: blur 20px, bg rgba(17,17,17,0.7) |
| `.mi-glass-strong` | Glassmorphism fuerte para header |
| `.mi-glow` | Box-shadow dorado suave |
| `.mi-glow-hover` | Glow al hacer hover |
| `.mi-border-glow` | Border gold al focus/hover |
| `.mi-gradient-border` | Borde con degradado gold via pseudo-element |
| `.mi-noise::after` | Overlay de textura grain |
| `.mi-bg-radial-gold` | Radial gradient dorado sutil en el fondo |

## Animaciones

| Clase / Keyframe | Uso |
|-----------------|-----|
| `.mi-reveal` + `.mi-visible` | Scroll reveal (fade + translateY) |
| `.mi-animate-fade-up` | Entrada de elementos |
| `.mi-animate-pulse-gold` | Pulse dorado (WhatsApp float) |
| `@keyframes mi-ticker-scroll` | TradingView ticker continuo |

## Responsive

Solo 2 breakpoints, igual que el tema WordPress original:
- `@media (max-width: 1024px)` — tablet
- `@media (max-width: 768px)` — mobile

**Grids que colapsan:** `mi-about-grid`, `mi-ft-grid` → 1 columna en ≤1024px
**Sección padding:** 120px → 60px en ≤768px
