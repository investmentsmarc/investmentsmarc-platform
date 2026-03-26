# Scaffold: Nueva Página App Router

Crea una página Next.js siguiendo las convenciones del proyecto.

**Argumentos:** `$ARGUMENTS` — ejemplo: `blog` o `herramientas/position-size-calculator`

## Instrucciones

1. Identifica la ruta desde `$ARGUMENTS` — mapea a `src/app/{ruta}/page.tsx`

2. Crea la página con:
   - **Metadata export** usando `generateMetadata` o `export const metadata`
   - **Schema.org** relevante via `<JsonLd />` si aplica
   - Estructura semántica HTML correcta (`<main>`, `<section>`, `<article>`)
   - Server Component por defecto (no `'use client'` a menos que sea necesario)
   - Importa componentes de `src/components/{area}/`

3. Si la página tiene formulario o interactividad, crea también el componente Client en `src/components/forms/` o el área apropiada

4. Añade el 301 redirect correspondiente en `next.config.ts` si la URL reemplaza una URL de WordPress

5. Muestra la página creada y lista los componentes pendientes de implementar

## Metadata template
```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Título — Investments Marc',
  description: 'Descripción de la página',
  openGraph: {
    title: 'Título',
    description: 'Descripción',
    images: [{ url: '/images/og-image.jpg' }],
  },
};
```
