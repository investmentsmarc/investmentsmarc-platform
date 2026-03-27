# SPEC-001 — Layout Global y Navegación

> Fase: 1 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-001, RF-005
> Casos de Uso: [UC-001](../use-cases/UC-001-visitante-navega-sitio.md), [UC-010](../use-cases/UC-010-visitante-contacta-whatsapp.md)

---

## 1. Alcance

Componentes globales que se renderizan en todas las páginas del sitio via `src/app/layout.tsx`.

## 2. Componentes

### 2.1 `<TradingViewTicker />`

- **Ubicación:** `src/components/global/TradingViewTicker.tsx`
- **Tipo:** Client Component (`'use client'`)
- **Referencia WP:** `functions.php` L15-45
- **Comportamiento:**
  - Widget de TradingView fijo en el top de la página
  - Muestra tickers: SPY, QQQ, ES, NQ, DXY, BTC, EUR/USD
  - Scroll horizontal automático
  - Tema oscuro que coincide con `--mi-bg-primary`
  - `position: fixed; top: 0; z-index: 9999`
- **Props:** Ninguna (configuración hardcodeada)

### 2.2 `<Header />`

- **Ubicación:** `src/components/global/Header.tsx`
- **Tipo:** Client Component (scroll listener + mobile toggle)
- **Comportamiento:**
  - Glassmorphic sticky header (debajo del ticker)
  - Logo `investmentsmarc` (text o imagen)
  - Navegación desktop: Home, About, Herramientas, Blog, Cursos, Contacto
  - CTA: botón dorado "Curso Gratis" → `/curso-gratis/`
  - On scroll: reduce padding, aumenta backdrop-blur
  - Mobile: hamburger toggle → `<NavMenu />`
- **Estilos:** `.mi-header`, usa `backdrop-filter: blur()` + `--mi-bg-elevated` con opacidad
- **Breakpoints:**
  - `>1024px`: Nav horizontal completa
  - `768-1024px`: Nav reducida, CTA visible
  - `<768px`: Hamburger menu

### 2.3 `<NavMenu />`

- **Ubicación:** `src/components/global/NavMenu.tsx`
- **Tipo:** Client Component
- **Comportamiento:**
  - Menú overlay full-screen en mobile
  - Animación slide-in desde la derecha
  - Links: mismo que header desktop
  - Cierra al hacer click en un link o fuera del menú
- **Estilos:** `.mi-nav-overlay`, fondo `--mi-bg-primary` con opacidad 0.95

### 2.4 `<Footer />`

- **Ubicación:** `src/components/global/Footer.tsx`
- **Tipo:** Server Component
- **Comportamiento:**
  - Grid 3 columnas: Navegación, Legal, Redes Sociales
  - Links: Instagram, YouTube, WhatsApp, TikTok
  - Copyright: `© {year} Investments Marc. All rights reserved.`
  - Link a Política de Privacidad y Términos de Uso
- **Estilos:** `.mi-footer`, fondo `--mi-bg-secondary`

### 2.5 `<WhatsAppFloat />`

- **Ubicación:** `src/components/global/WhatsAppFloat.tsx`
- **Tipo:** Client Component
- **Referencia WP:** `functions.php` L2364-2381
- **Comportamiento:**
  - Botón flotante fijo en bottom-right
  - Icono WhatsApp con pulse animation
  - Click → abre `https://wa.me/18329534918`
  - `position: fixed; bottom: 24px; right: 24px; z-index: 9998`
  - Respeta cookie consent (no tracking, solo UI)
- **Estilos:** `.mi-whatsapp-float`, gradiente verde WhatsApp + `--mi-ease-spring`

### 2.6 `<CookieBanner />`

- **Ubicación:** `src/components/global/CookieBanner.tsx`
- **Tipo:** Client Component
- **Hook:** `useCookieConsent`
- **Comportamiento:**
  - Aparece en primera visita (no hay consent en localStorage)
  - Dos botones: "Aceptar" y "Rechazar"
  - Aceptar: `localStorage.setItem('cookie-consent', 'accepted')` → habilita Firebase Analytics
  - Rechazar: `localStorage.setItem('cookie-consent', 'rejected')` → no analytics
  - Desaparece después de la decisión, no reaparece
  - Animación slide-up desde bottom
- **Estilos:** `.mi-cookie-banner`, glassmorphic card en bottom

## 3. Layout Root (`src/app/layout.tsx`)

```
<html lang="es">
  <body className={inter.className}>
    <TradingViewTicker />
    <Header />
    <main style={{ paddingTop: 'calc(ticker-height + header-height)' }}>
      {children}
    </main>
    <Footer />
    <WhatsAppFloat />
    <CookieBanner />
  </body>
</html>
```

### Metadata global:
- `title`: template `%s | Investments Marc`
- `description`: Inversiones y trading profesional/institucional
- `openGraph`: imagen por defecto `/images/og-image.jpg`
- `icons`: favicon

## 4. Hooks Requeridos

| Hook | Archivo | Uso |
|------|---------|-----|
| `useCookieConsent` | `src/hooks/useCookieConsent.ts` | Estado del banner + decisión persistida |
| `useScrollReveal` | `src/hooks/useScrollReveal.ts` | IntersectionObserver para `.mi-reveal` |

## 5. Criterios de Aceptación

- [ ] Ticker visible y funcional con datos en tiempo real
- [ ] Header glassmorphic con transición on-scroll
- [ ] Navegación mobile funcional en <768px
- [ ] Footer con todos los links correctos
- [ ] WhatsApp float visible y abre wa.me correcto
- [ ] Cookie banner aparece una sola vez, persiste decisión
- [ ] Responsive correcto en 768px y 1024px
- [ ] Lighthouse > 90
