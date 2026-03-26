# Fase 1 — Páginas Core

**Estado:** 🔲 PENDIENTE
**Semanas estimadas:** 2-3

## Objetivo
Layout global operativo y páginas principales con fidelidad visual al WordPress original.

## Entregables

### Layout Global (`src/app/layout.tsx` + componentes `global/`)
- [ ] `<TradingViewTicker />` — widget fijo en top de página (portar WP L15-45)
- [ ] `<Header />` — glassmorphic sticky, logo, navegación, CTA
- [ ] `<NavMenu />` — responsive hamburger en mobile
- [ ] `<Footer />` — links, redes sociales, legal links
- [ ] `<WhatsAppFloat />` — botón flotante +18329534918, pulse animation
- [ ] `<CookieBanner />` — accept/reject, localStorage, GDPR

### UI Primitives (`src/components/ui/`)
- [ ] `<Badge />` — usa `.mi-badge`
- [ ] `<GoldButton />` — `.mi-btn-gold` + `.mi-btn-outline` variants
- [ ] `<SectionTitle />` — badge + h2 + subtítulo opcionales
- [ ] `<RevealOnScroll />` — wrapper con IntersectionObserver + `.mi-reveal`
- [ ] `<JsonLd />` — Schema.org structured data (server component)

### Homepage (`/`)
- [ ] `<HeroSection />` — bg image, texto derecha, gradient overlays (portar WP L47-194)
- [ ] Blog preview — `<LatestArticles />` (3 posts de Sanity, placeholder por ahora)
- [ ] `<Testimonials />` — grid de testimonios

### About Us (`/about-us/`)
- [ ] `<AboutBio />` — grid 2-col, foto + texto + quote (portar WP L95-194)
- [ ] `<FlowTitanCards />` — 3D card stack con rotación automática (portar WP L414-530)
- [ ] `<ValuesGrid />` — `.mi-values-grid` (portar WP L201-237)

### Herramientas (`/herramientas/` + subpáginas)
- [ ] Hub de herramientas — cards con links a cada calculadora
- [ ] `<PositionSizeCalc />` — porta `calcPS()` de WP L467-529
- [ ] `<RiskRewardCalc />` — porta `calcRR()` de WP L530-566
- [ ] `<InvestmentCalc />` — porta Investment Calculator WP L503-729 (ETFs SPY/QQQ/VOO)

### Contacto (`/contacto/`)
- [ ] `<ContactForm />` — → WhatsApp +18329534918 (igual que WP)

### Hooks necesarios
- [ ] `useScrollReveal` — IntersectionObserver para `.mi-reveal`
- [ ] `useCookieConsent` — estado del banner
- [ ] `useFlowTitanCarousel` — rotación automática 3D cards

## Criterios de Aceptación
- [ ] Fidelidad visual: screenshots WP vs Next.js lado a lado
- [ ] Calculadoras: mismos inputs → mismos outputs que WordPress
- [ ] Responsive funcionando en 768px y 1024px
- [ ] Lighthouse performance > 90
- [ ] Sin violaciones del design system (`/design-audit`)
