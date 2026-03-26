# Getting Started — Investments Marc Platform

Guía de onboarding para nuevos colaboradores del equipo.

## Requisitos Previos
- Node.js v20+ (el proyecto usa v24)
- Git
- Acceso al repositorio `investmentsmarc/investmentsmarc-platform`
- Acceso a Firebase Console (`investments-marc-prod`)
- Acceso a Sanity Studio (pedir al team lead)

## Instalación

```bash
git clone https://github.com/investmentsmarc/investmentsmarc-platform.git
cd investmentsmarc-platform
npm install
```

## Variables de Entorno

```bash
cp .env.local.example .env.local
```

Rellenar en `.env.local` con valores de Firebase Console + Stripe Dashboard.
Pedir al team lead los valores de producción. **Nunca commitear `.env.local`.**

## Desarrollo Local

```bash
npm run dev      # http://localhost:3000
npm run build    # verificar build antes de PR
npm run lint     # ESLint
```

## Estructura del Proyecto

```
src/
├── app/           # Rutas Next.js App Router (pages + API routes)
├── components/    # Componentes React organizados por dominio
│   ├── global/    # Header, Footer, TradingViewTicker, WhatsAppFloat
│   ├── ui/        # Primitivos: Badge, GoldButton, SectionTitle
│   ├── home/      # Secciones de la homepage
│   ├── about/     # About Us + FlowTitan cards
│   ├── calculators/ # 3 calculadoras de trading
│   ├── blog/      # Cards, archive, post hero
│   └── forms/     # Lead, Webinar, Contact forms
├── lib/           # Firebase client, Sanity client, Stripe
├── hooks/         # Custom hooks compartidos
├── types/         # TypeScript types globales
└── styles/        # design-system.css (efectos avanzados)
```

## Design System
Leer **obligatoriamente** antes de tocar CSS:
- `docs/design/design-system.md`
- `.claude/memory/design-tokens.md`

**Regla de oro:** NUNCA hardcodear colores. Siempre variables `--mi-*`.

## Flujo de Trabajo con IA (Claude Code)

El proyecto incluye comandos y agentes en `.claude/`:

```bash
# Crear un nuevo componente
/new-component NombreComponente carpeta

# Portar componente de WordPress
/port-wp NombreComponente

# Auditar design system
/design-audit src/components/ruta/Componente.tsx
```

**Agentes disponibles:**
- `ui-builder` — construir componentes UI
- `firebase-engineer` — operaciones Firebase
- `seo-content` — SEO y blog Sanity
- `code-reviewer` — revisión de código

## Convenciones de Código

### Commits (Conventional Commits)
```
feat: añade HeroSection al homepage
fix: corrige responsive del FlowTitanCards en 768px
refactor: extrae lógica de countdown a useCountdown hook
docs: actualiza firebase-schema con colección enrollments
style: ajusta padding de mi-section en mobile
```

### Naming
- Componentes: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils/lib: `camelCase.ts`
- Pages: `page.tsx` (convención Next.js)

### Branches
```
main        → producción
develop     → staging / integración
feat/xxx    → nueva funcionalidad
fix/xxx     → corrección de bugs
```

## Referencia de Fases
Ver `docs/phases/` para el detalle de cada fase de desarrollo.
El **PLAN-MAESTRO.md** en la raíz de Academy es la fuente de verdad.
