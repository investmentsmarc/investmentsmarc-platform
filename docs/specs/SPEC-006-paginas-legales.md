# SPEC-006 — Páginas de Contenido (Legal, FAQs, Links, WhatsApp)

> Fase: 2 | Prioridad: MUST (Legal, FAQs) / SHOULD (Links, WhatsApp)
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-008, RF-009, RF-010, RF-011
> Casos de Uso: [UC-001](../use-cases/UC-001-visitante-navega-sitio.md), [UC-010](../use-cases/UC-010-visitante-contacta-whatsapp.md)

---

## 1. Alcance

Páginas de contenido estático: legal, FAQs, links de redes sociales y funnel de WhatsApp.

## 2. Páginas Legales

### 2.1 Política de Privacidad

- **Ruta:** `/legal/privacidad/`
- **Archivo:** `src/app/legal/privacidad/page.tsx`
- **Tipo:** Server Component (SSG)
- **Contenido:** Portar contenido textual de WordPress (L1493-1600 aprox.)
- **Redirect 301:** `/politica-de-privacidad/` → `/legal/privacidad/`
- **Layout:** Texto largo con headings, listas, secciones
- **Estilos:** `.mi-legal-content` — prose styling con `--mi-text-primary`

### 2.2 Términos de Uso

- **Ruta:** `/legal/terminos/`
- **Archivo:** `src/app/legal/terminos/page.tsx`
- **Tipo:** Server Component (SSG)
- **Contenido:** Portar de WordPress (L1600-1693 aprox.)
- **Redirect 301:** `/terminos-de-uso/` → `/legal/terminos/`
- **Layout:** Mismo estilo que Privacidad

## 3. FAQs

### 3.1 `<FAQAccordion />`

- **Ruta:** `/faqs/`
- **Archivo:** `src/app/faqs/page.tsx` + `src/components/forms/FAQAccordion.tsx`
- **Tipo:** Client Component (toggle interactivo)
- **Referencia WP:** `functions.php` L1781-1818
- **Comportamiento:**
  - Lista de preguntas frecuentes
  - Click en pregunta → expande/colapsa respuesta
  - Solo 1 abierta a la vez (accordion)
  - Animación de altura con `--mi-ease-out`
  - Icono chevron rota al abrir
- **Datos:** Array estático en el componente (portar de WP)
- **Schema.org:** `FAQPage` con todas las Q&A
- **Estilos:** `.mi-faq-item`, `.mi-faq-question`, `.mi-faq-answer`

### 3.2 Preguntas a Incluir (migrar de WP)

1. ¿Qué es Investments Marc?
2. ¿Qué es FlowTitan PRO?
3. ¿Necesito experiencia previa en trading?
4. ¿Cómo funciona el curso gratis?
5. ¿Cuánto cuesta FlowTitan PRO?
6. ¿Ofrecen señales de trading?
7. ¿Cómo contacto soporte?
8. ¿En qué mercados operan?

## 4. Links (Instagram Link-in-Bio)

- **Ruta:** `/links/`
- **Archivo:** `src/app/links/page.tsx`
- **Tipo:** Server Component
- **Referencia WP:** `functions.php` L2187-2270
- **Layout:**
  - Diseño tipo Linktree pero custom
  - Avatar/logo en top
  - Lista vertical de botones/links:
    - Curso Gratis → `/curso-gratis/`
    - Webinar → `/webinar/`
    - FlowTitan PRO → externo
    - YouTube → externo
    - WhatsApp → `wa.me/18329534918`
    - TikTok → externo
  - Fondo con branding dark/gold
- **Estilos:** `.mi-links-page`, botones con `.mi-link-button`

## 5. WhatsApp Funnel

- **Ruta:** `/whatsapp/`
- **Archivo:** `src/app/whatsapp/page.tsx`
- **Tipo:** Server Component
- **Comportamiento:**
  - Página promocional del canal de WhatsApp
  - Descripción del valor del canal
  - CTA grande: "Únete al Canal" → `wa.me/18329534918`
  - Testimonios de miembros del canal
- **Estilos:** Usa componentes del design system

## 6. Criterios de Aceptación

- [ ] Páginas legales accesibles y con contenido completo
- [ ] Redirects 301 funcionando: `/politica-de-privacidad/` y `/terminos-de-uso/`
- [ ] FAQ accordion: abre/cierra correctamente, solo 1 a la vez
- [ ] FAQ: Schema.org `FAQPage` presente
- [ ] Links page: todos los links funcionales, diseño tipo Linktree
- [ ] WhatsApp page: CTA abre wa.me correcto
- [ ] Responsive en 768px y 1024px
