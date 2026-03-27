# SPEC-008 — SEO, Redirects y Deploy

> Fase: 3 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-016, RF-017, RF-018, RF-019
> Casos de Uso: — (requisitos transversales)

---

## 1. Alcance

Estrategia SEO completa para migración sin pérdida de posiciones: redirects, structured data, sitemap, y deploy a producción.

## 2. 301 Redirects

### 2.1 Configuración en `next.config.ts`

```typescript
async redirects() {
  return [
    // Páginas legales
    { source: '/politica-de-privacidad', destination: '/legal/privacidad', permanent: true },
    { source: '/politica-de-privacidad/', destination: '/legal/privacidad', permanent: true },
    { source: '/terminos-de-uso', destination: '/legal/terminos', permanent: true },
    { source: '/terminos-de-uso/', destination: '/legal/terminos', permanent: true },

    // Herramientas (slug viejo)
    { source: '/calculadora', destination: '/herramientas', permanent: true },
    { source: '/calculadora/', destination: '/herramientas', permanent: true },

    // WhatsApp directo
    { source: '/whatsapp-redirect', destination: 'https://wa.me/18329534918', permanent: true },

    // Blog slugs preservados (misma estructura /blog/slug)
    // No necesitan redirect si se mantiene la misma URL

    // Catch-all para rutas WP estándar
    { source: '/wp-admin/:path*', destination: '/', permanent: true },
    { source: '/wp-content/:path*', destination: '/', permanent: true },
    { source: '/wp-login.php', destination: '/', permanent: true },
  ];
}
```

### 2.2 URLs a Verificar Post-Migración

| URL WordPress | URL Next.js | Tipo |
|---------------|------------|------|
| `/` | `/` | Misma |
| `/about-us/` | `/about-us/` | Misma |
| `/herramientas/` | `/herramientas/` | Misma |
| `/herramientas/position-size-calculator/` | `/herramientas/position-size-calculator/` | Misma |
| `/herramientas/risk-reward-calculator/` | `/herramientas/risk-reward-calculator/` | Misma |
| `/herramientas/investment-calculator/` | `/herramientas/investment-calculator/` | Misma |
| `/calculadora/` | `/herramientas/` | 301 |
| `/blog/` | `/blog/` | Misma |
| `/blog/{slug}/` | `/blog/{slug}/` | Misma |
| `/curso-gratis/` | `/curso-gratis/` | Misma |
| `/webinar/` | `/webinar/` | Misma |
| `/contacto/` | `/contacto/` | Misma |
| `/faqs/` | `/faqs/` | Misma |
| `/links/` | `/links/` | Misma |
| `/politica-de-privacidad/` | `/legal/privacidad/` | 301 |
| `/terminos-de-uso/` | `/legal/terminos/` | 301 |
| `/cursos/` | `/cursos/` | Misma (Fase 4) |
| `/testimonios/` | `/testimonios/` | Misma |

## 3. Schema.org Structured Data

### 3.1 Componente `<JsonLd />`

- **Ubicación:** `src/components/ui/JsonLd.tsx`
- **Tipo:** Server Component
- **Props:** `{ data: Record<string, unknown> }`
- **Renderiza:** `<script type="application/ld+json">`

### 3.2 Schemas por Página

| Página | Schema | Datos |
|--------|--------|-------|
| Homepage | `WebSite` | name, url, potentialAction (SearchAction) |
| Homepage | `FinancialService` | name, url, description, areaServed, serviceType |
| Blog post | `Article` | headline, datePublished, author, image, publisher |
| FAQs | `FAQPage` | mainEntity: array de Question/Answer |
| Cursos (Fase 4) | `Course` | name, description, provider, offers |

### 3.3 Meta Tags Dinámicos

Cada página define `metadata` via Next.js Metadata API:

```typescript
export const metadata: Metadata = {
  title: 'Título | Investments Marc',
  description: 'Descripción SEO de la página',
  openGraph: {
    title: 'Título',
    description: 'Descripción',
    images: ['/images/og-image.jpg'],
    locale: 'es_ES',
    type: 'website', // o 'article' para blog posts
  },
  twitter: {
    card: 'summary_large_image',
  },
};
```

## 4. Sitemap

- **Paquete:** `next-sitemap`
- **Config:** `next-sitemap.config.js`
- **Generación:** Automática en build
- **URLs incluidas:** Todas las páginas estáticas + blog posts dinámicos
- **Frecuencia:** Blog posts `changefreq: weekly`, páginas estáticas `monthly`
- **Prioridad:** Homepage 1.0, blog 0.8, herramientas 0.7, legal 0.3

## 5. Deploy a Firebase Hosting

### 5.1 `firebase.json`

```json
{
  "hosting": {
    "source": ".",
    "frameworks": {
      "name": "next"
    },
    "cleanUrls": true,
    "trailingSlash": false
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs20"
  }
}
```

### 5.2 GitHub Actions CI/CD

- **Archivo:** `.github/workflows/deploy-firebase.yml`
- **Trigger:** Push a `main`
- **Steps:**
  1. Checkout code
  2. Setup Node.js 20
  3. Install dependencies
  4. Run `npm run build`
  5. Run `npm run lint`
  6. Deploy to Firebase Hosting via `firebase-tools`
- **Preview:** PRs get preview channel URL

### 5.3 DNS Cutover

1. Deploy exitoso a Firebase Hosting
2. Apuntar DNS de `investmentsmarc.com` a Firebase (`firebase hosting:channel:deploy live`)
3. Verificar SSL automático (Firebase provisiona Let's Encrypt)
4. Mantener Hostinger activo 30 días como rollback
5. Monitorear Search Console por 30 días
6. Verificar todos los 301 con script: `curl -I {url}` para cada URL

## 6. `robots.txt`

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://investmentsmarc.com/sitemap.xml
```

## 7. Criterios de Aceptación

- [ ] Todos los 301 redirects verificados con `curl -I`
- [ ] `sitemap.xml` accesible y contiene todas las URLs
- [ ] Schema.org validado con Google Rich Results Test para cada tipo
- [ ] Meta OG tags correctos (verificar con og:image debugger)
- [ ] `robots.txt` accesible y correcto
- [ ] `lang="es"` en `<html>`
- [ ] Firebase deploy exitoso desde GitHub Actions
- [ ] DNS propagado y SSL activo
- [ ] Hostinger activo como rollback
- [ ] Lighthouse SEO > 95
