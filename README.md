# Investments Marc — Platform

Plataforma editorial + educativa de trading institucional. Migración de
`investmentsmarc.com` (WordPress + Blocksy) a **Next.js 16 + Firebase**.

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript estricto |
| Estilos | Tailwind CSS 4 + variables `--mi-*` + `src/styles/design-system.css` |
| Tipografía | Sora (display) + Manrope (body) vía `next/font/google` |
| Datos de mercado | `yahoo-finance2` — ticker + terminal FlowTitan Mag-7 live |
| Noticias | Google News RSS → batchexecute resolver → Googlebot-UA extractor. [Doc](docs/architecture/news-pipeline.md). |
| Base de datos | Firestore (ver `docs/architecture/firebase-schema.md`) |
| Pagos | Stripe Checkout (fase 4) |
| Auth | Firebase Auth |
| Hosting | Firebase App Hosting |

## Experiencia visual

El sitio es un **trading floor**: fondo WebGL site-wide (nebulosa oro + grid
perspectiva + ghost OHLC chart de 64 velas con SMA-8) que atraviesa todas las
páginas, con el hero mostrando un terminal FlowTitan que cicla los Magnificent 7
del S&P 500 cada 9 s. Una sola atmósfera dorada continua desde el ticker superior
hasta el footer.

Scroll reveals vía `animation-timeline: view()` (CSS-nativo, sin observer JS, sin
race de hidratación bajo Suspense streaming).

## Páginas

- **`/`** — Hero shader + terminal Mag-7 live, News feed (spotlight rotativo +
  queue "En el wire" + modal con artículo completo extraído inline), Testimonios.
- **`/about-us`** — Bio de Marc, **FlowTitan PRO** (tour interactivo: stats +
  6 tabs con cross-fade de screenshots del producto), Valores Innegociables
  (cards con watermark numérico en gradiente oro).
- **`/cursos`** — Ruta del Inversor: 5 cursos numerados (Génesis, Cartografía,
  Rayos X, Arsenal, Oráculo) con progresión de $0 → $997.
- **`/faqs`** — Card grid (no accordion) con numeración 01–10 y sheen oro hover.
- **`/contacto`** — Formulario + 3 contact points + WhatsApp directo.
- **`/herramientas`** — Calculadoras (position size, risk/reward, investment).
- **`/curso-gratis`**, **`/webinar`** — lead capture.
- **FlowTitan PRO app** — redirecciona externo a `https://flowtitan.investmentsmarc.com`.

## Desarrollo

```bash
npm install
npm run dev           # http://localhost:3000
npm run build         # build prod
npm run lint          # ESLint
npx tsc --noEmit      # typecheck
```

## Documentación

- **Arquitectura**: [docs/architecture/overview.md](docs/architecture/overview.md)
- **News pipeline**: [docs/architecture/news-pipeline.md](docs/architecture/news-pipeline.md)
- **Firebase schema**: [docs/architecture/firebase-schema.md](docs/architecture/firebase-schema.md)
- **WhatsApp routing**: [docs/architecture/whatsapp-routing.md](docs/architecture/whatsapp-routing.md)
- **Fases del proyecto**: [docs/phases/](docs/phases/)
- **Plan maestro**: [docs/INDICE-MAESTRO.md](docs/INDICE-MAESTRO.md)
- **Setup Firebase**: [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
- **Deploy checklist**: [DEPLOY_CHECKLIST.md](DEPLOY_CHECKLIST.md)
- **Instrucciones para Claude Code**: [CLAUDE.md](CLAUDE.md)

## Contacto

WhatsApp central: **+1 (832) 953-4918** · `info@investmentsmarc.com`
