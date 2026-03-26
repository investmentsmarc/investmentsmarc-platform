---
type: reference
name: Registro de componentes construidos
description: Catálogo actualizable de componentes implementados, su ubicación y estado
---

# Component Registry

> Actualizar este archivo cada vez que se construye o modifica un componente significativo.

## Estado de Componentes

### Global (src/components/global/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| TradingViewTicker | `TradingViewTicker.tsx` | 🔲 Pendiente | Fase 1 — Client component, widget global fijo |
| Header | `Header.tsx` | 🔲 Pendiente | Fase 1 — Glassmorphic, `.mi-header-glass` |
| Footer | `Footer.tsx` | 🔲 Pendiente | Fase 1 — Links, redes sociales, legal |
| WhatsAppFloat | `WhatsAppFloat.tsx` | 🔲 Pendiente | Fase 1 — Botón flotante +18329534918 |
| CookieBanner | `CookieBanner.tsx` | 🔲 Pendiente | Fase 1 — Accept/reject con localStorage |
| NavMenu | `NavMenu.tsx` | 🔲 Pendiente | Fase 1 — Mobile responsive |

### UI Primitives (src/components/ui/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| Badge | `Badge.tsx` | 🔲 Pendiente | Usa `.mi-badge` |
| GoldButton | `GoldButton.tsx` | 🔲 Pendiente | Usa `.mi-btn-gold` + `.mi-btn-outline` |
| SectionTitle | `SectionTitle.tsx` | 🔲 Pendiente | Badge + título + subtítulo |
| RevealOnScroll | `RevealOnScroll.tsx` | 🔲 Pendiente | Wrapper con IntersectionObserver, `.mi-reveal` |
| JsonLd | `JsonLd.tsx` | 🔲 Pendiente | Schema.org structured data |

### Home (src/components/home/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| HeroSection | `HeroSection.tsx` | 🔲 Pendiente | Fase 1 — Server, bg image, texto derecha |
| LatestArticles | `LatestArticles.tsx` | 🔲 Pendiente | Fase 2 — Server, Sanity query |
| Testimonials | `Testimonials.tsx` | 🔲 Pendiente | Fase 1 — Server, grid de testimonios |

### About (src/components/about/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| AboutBio | `AboutBio.tsx` | 🔲 Pendiente | Fase 1 — Server, grid 2-col |
| FlowTitanCards | `FlowTitanCards.tsx` | 🔲 Pendiente | Fase 1 — Client, 3D card stack con JS rotation |
| ValuesGrid | `ValuesGrid.tsx` | 🔲 Pendiente | Fase 1 — Server, `.mi-values-grid` |

### Calculators (src/components/calculators/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| PositionSizeCalc | `PositionSizeCalc.tsx` | 🔲 Pendiente | Fase 1 — Client, porta `calcPS()` de WP L467 |
| RiskRewardCalc | `RiskRewardCalc.tsx` | 🔲 Pendiente | Fase 1 — Client, porta `calcRR()` de WP L530 |
| InvestmentCalc | `InvestmentCalc.tsx` | 🔲 Pendiente | Fase 1 — Client, ETFs SPY/QQQ/VOO + Canvas chart |

### Blog (src/components/blog/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| BlogCard | `BlogCard.tsx` | 🔲 Pendiente | Fase 2 — Server, `.mi-blog-card` |
| ArchiveGrid | `ArchiveGrid.tsx` | 🔲 Pendiente | Fase 2 — Server, Sanity data |
| PostHero | `PostHero.tsx` | 🔲 Pendiente | Fase 2 — Server, banner de post individual |

### Forms (src/components/forms/)
| Componente | Archivo | Estado | Notas |
|------------|---------|--------|-------|
| LeadForm | `LeadForm.tsx` | 🔲 Pendiente | Fase 3 — Client, localStorage → Firestore |
| WebinarForm | `WebinarForm.tsx` | 🔲 Pendiente | Fase 3 — Client, + countdown sábado 8pm EST |
| ContactForm | `ContactForm.tsx` | 🔲 Pendiente | Fase 1 — Client, → WhatsApp + Firestore |
| Countdown | `Countdown.tsx` | 🔲 Pendiente | Fase 3 — Client, `useCountdown` hook |

## Hooks (src/hooks/)
| Hook | Archivo | Estado | Uso |
|------|---------|--------|-----|
| useScrollReveal | `useScrollReveal.ts` | 🔲 Pendiente | IntersectionObserver para `.mi-reveal` |
| useCountdown | `useCountdown.ts` | 🔲 Pendiente | Countdown al próximo sábado 8pm EST |
| useCookieConsent | `useCookieConsent.ts` | 🔲 Pendiente | Estado del cookie banner |
| useFlowTitanCarousel | `useFlowTitanCarousel.ts` | 🔲 Pendiente | Rotación automática de cards 3D |
