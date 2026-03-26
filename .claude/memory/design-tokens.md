---
type: reference
name: Design tokens --mi-* — referencia rápida
description: Todas las variables CSS del design system con ejemplos de uso en Tailwind y CSS
---

# Design Tokens — Investments Marc

> Regla de oro: NUNCA hardcodear colores. Siempre usar estas variables.

## Backgrounds
| Variable | Valor | Tailwind utility | Uso |
|----------|-------|-----------------|-----|
| `--mi-bg-primary` | `#0a0a0a` | `bg-mi-bg-primary` | Fondo base de la app |
| `--mi-bg-secondary` | `#111111` | `bg-mi-bg-secondary` | Cards, sidebars |
| `--mi-bg-tertiary` | `#171717` | `bg-mi-bg-tertiary` | Inputs, hover states |
| `--mi-bg-elevated` | `#1a1a1a` | `bg-mi-bg-elevated` | Modals, dropdowns |

## Gold (color de marca)
| Variable | Valor | Uso |
|----------|-------|-----|
| `--mi-gold` / `--mi-gold-light` | `#C9A84C` | Texto accent, iconos, badges |
| `--mi-gold-dark` | `#A68A3E` | Hover de gold, decoraciones |
| `--mi-gold-gradient` | `linear-gradient(135deg, #C9A84C 0%, #A68A3E 100%)` | CTAs, títulos hero |
| `--mi-glow-gold` | `rgba(201, 168, 76, 0.12)` | Box shadows con efecto glow |

## Texto
| Variable | Opacidad | Tailwind | Uso |
|----------|----------|---------|-----|
| `--mi-text-primary` | 92% blanco | `text-mi-text-primary` | Títulos, texto principal |
| `--mi-text-secondary` | 55% blanco | `text-mi-text-secondary` | Párrafos, descripciones |
| `--mi-text-tertiary` | 35% blanco | `text-mi-text-tertiary` | Placeholders, metadata |

## Bordes
| Variable | Valor | Uso |
|----------|-------|-----|
| `--mi-border` | `rgba(255,255,255, 0.08)` | Bordes default de cards |
| `--mi-border-strong` | `rgba(255,255,255, 0.14)` | Bordes hover, separadores |

## Sombras (neutral, sin gold tint)
| Variable | Uso |
|----------|-----|
| `--mi-shadow-sm` | Elevación mínima |
| `--mi-shadow-md` | Cards en reposo |
| `--mi-shadow-lg` | Cards en hover |
| `--mi-shadow-xl` | Modals, imágenes hero |

## Motion
| Variable | Valor | Uso |
|----------|-------|-----|
| `--mi-ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Transiciones generales |
| `--mi-ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Animaciones con rebote |
| `--mi-duration` | `0.6s` | Duración base |

## Clases CSS Predefinidas (globals.css)
```
Primitivos:      .mi-section  .mi-container  .mi-section-title  .mi-text-gradient
Badges:          .mi-badge
Botones:         .mi-btn-gold  .mi-btn-outline  .mi-cta-btn
Cards:           .mi-value-card  .mi-blog-card  .mi-ft-card
Layout sections: .mi-about-grid  .mi-values-grid  .mi-blog-grid  .mi-ft-grid
Animación:       .mi-reveal  .mi-reveal-delay-{1,2,3}  .mi-visible
```

## Clases Avanzadas (design-system.css)
```
Glass:           .mi-glass  .mi-glass-strong  .mi-header-glass
Glow:            .mi-glow  .mi-glow-hover  .mi-border-glow
Gradients:       .mi-gradient-border  .mi-bg-radial-gold  .mi-bg-radial-subtle
Cards:           .mi-card-elevated  .mi-testimonial-card  .mi-stat-card
Forms:           .mi-input  .mi-label
Decorativo:      .mi-divider  .mi-divider-gold  .mi-scroll-indicator
```

## Breakpoints Responsive
```css
@media (max-width: 1024px) { /* tablet */ }
@media (max-width: 768px)  { /* mobile */ }
```
