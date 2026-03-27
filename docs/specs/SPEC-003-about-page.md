# SPEC-003 — About Us

> Fase: 1 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-003
> Casos de Uso: [UC-001](../use-cases/UC-001-visitante-navega-sitio.md)

---

## 1. Alcance

Página "About Us" (`/about-us/`). Presenta la marca, el fundador y el producto FlowTitan PRO.

## 2. Ruta

- **Archivo:** `src/app/about-us/page.tsx`
- **Tipo:** Server Component (con FlowTitanCards como Client)
- **Rendering:** SSG

## 3. Secciones

### 3.1 `<AboutBio />`

- **Ubicación:** `src/components/about/AboutBio.tsx`
- **Tipo:** Server Component
- **Referencia WP:** `functions.php` L95-194
- **Layout:**
  - Grid 2 columnas (50/50)
  - Columna izquierda: foto de Marc (circular o redondeada)
  - Columna derecha: texto bio + quote destacado
  - Badge: "Sobre Nosotros"
  - Título H1: "Marc — Tu Mentor en Trading Institucional"
  - Párrafos descriptivos con experiencia y filosofía
  - Quote en bloque: frase destacada con borde dorado izquierdo
- **Estilos:** `.mi-about-bio`, quote usa `border-left: 3px solid var(--mi-gold-light)`
- **Responsive:**
  - `<768px`: stack vertical (foto arriba, texto abajo)
  - `768-1024px`: grid 40/60

### 3.2 `<FlowTitanCards />`

- **Ubicación:** `src/components/about/FlowTitanCards.tsx`
- **Tipo:** Client Component (`'use client'`)
- **Hook:** `useFlowTitanCarousel`
- **Referencia WP:** `functions.php` L414-530
- **Comportamiento:**
  - 3 cards con efecto 3D (transform perspective + rotateY)
  - Rotación automática cada 5 segundos
  - Hover pausa rotación y aplica efecto 3D interactivo
  - Cards: FlowTitan Lite (gratis), FlowTitan PRO (pagado), FlowTitan Elite (próximamente)
  - Cada card: icono, título, features list, precio, CTA
- **Estilos:** `.mi-3d-card`, transiciones con `--mi-ease-spring`
- **Responsive:**
  - `<768px`: carousel swipeable (1 card visible)
  - `>768px`: 3 cards en fila con hover individual

### 3.3 `<ValuesGrid />`

- **Ubicación:** `src/components/about/ValuesGrid.tsx`
- **Tipo:** Server Component
- **Referencia WP:** `functions.php` L201-237
- **Comportamiento:**
  - Badge: "Nuestros Valores"
  - Grid de 4-6 value cards
  - Cada card: icono Font Awesome, título, descripción breve
  - Valores: Disciplina, Transparencia, Educación Continua, Gestión de Riesgo, etc.
- **Estilos:** `.mi-values-grid`, `.mi-value-card` con hover glow effect
- **Responsive:**
  - `<768px`: 1 columna
  - `768-1024px`: 2 columnas
  - `>1024px`: 3 columnas

## 4. SEO / Metadata

```typescript
export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: 'Conoce a Marc y la filosofía detrás de Investments Marc. Trading institucional, FlowTitan PRO y educación financiera.',
};
```

## 5. Hooks Requeridos

| Hook | Archivo | Uso |
|------|---------|-----|
| `useFlowTitanCarousel` | `src/hooks/useFlowTitanCarousel.ts` | Rotación automática + interacción 3D |

## 6. Criterios de Aceptación

- [ ] Bio: grid 2-col en desktop, stack en mobile
- [ ] FlowTitan cards: rotación automática 3D funcional
- [ ] FlowTitan cards: hover pausa rotación
- [ ] Values grid: responsive 1/2/3 columnas
- [ ] Fidelidad visual con WordPress original
- [ ] Responsive en 768px y 1024px
