# Guía de Configuración Completa — Investments Marc Platform

> Documento paso a paso para montar cada servicio, ambiente y secreto del proyecto.
> Seguir en orden: cada sección depende de la anterior.

---

## Índice

1. [GitHub — Organización y Repos](#1-github--organización-y-repos)
2. [Firebase — Proyecto y Servicios](#2-firebase--proyecto-y-servicios)
3. [Variables de Entorno — Estrategia por Ambiente](#3-variables-de-entorno--estrategia-por-ambiente)
4. [Sanity.io — CMS del Blog](#4-sanityio--cms-del-blog)
5. [Stripe — Pagos de Cursos](#5-stripe--pagos-de-cursos)
6. [ConvertKit — Email Marketing](#6-convertkit--email-marketing)
7. [GitHub Actions — CI/CD y Secrets](#7-github-actions--cicd-y-secrets)
8. [DNS y Dominios](#8-dns-y-dominios)
9. [Herramientas de Desarrollo Local](#9-herramientas-de-desarrollo-local)
10. [Checklist Final por Ambiente](#10-checklist-final-por-ambiente)

---

## 1. GitHub — Organización y Repos

### 1.1 Crear la Organización

1. Ir a https://github.com/organizations/plan
2. Crear organización: **`investmentsmarc`**
3. Plan: **Free** (suficiente — Actions minutes gratis para repos públicos, 2000 min/mes para privados)
4. Añadir miembros del equipo con rol **Member**
5. El owner será la cuenta principal de Marc

### 1.2 Configurar la Organización

```
Settings → Member privileges:
  - Base permissions: Read (los miembros solo leen por defecto)
  - Fork policy: No forking (mantener código dentro de la org)

Settings → Actions → General:
  - Actions permissions: Allow all actions
  - Workflow permissions: Read and write
```

### 1.3 Repos a Crear

| Repo | Visibilidad | Descripción |
|------|------------|-------------|
| `investmentsmarc-platform` | **Private** | Plataforma web Next.js + Firebase (este repo) |
| `investmentsmarc-wp` | **Private** | WordPress original (referencia para migración) |

### 1.4 Configurar el Repo `investmentsmarc-platform`

```
Settings → General:
  - Default branch: main
  - Allow merge commits: ✅
  - Allow squash merging: ✅ (preferido para PRs)
  - Allow rebase merging: ❌ (desactivar para mantener historial limpio)
  - Automatically delete head branches: ✅

Settings → Branches → Add rule (branch: main):
  - Require pull request before merging: ✅
  - Required approvals: 1
  - Require status checks: ✅ (añadir "build" cuando exista el workflow)
  - Require branches to be up to date: ✅
```

### 1.5 Conectar el Repo Local

Una vez creado el repo en GitHub, el owner ejecuta:

```bash
cd investmentsmarc-platform
git remote add origin git@github.com:investmentsmarc/investmentsmarc-platform.git
git branch -M main
git push -u origin main
```

> **NOTA:** No haré push yo — el owner conectará el remote cuando esté listo y me dará la URL.

---

## 2. Firebase — Proyecto y Servicios

### 2.1 Crear el Proyecto Firebase

1. Ir a https://console.firebase.google.com/
2. **Add project** → nombre: `investments-marc-prod`
3. Enable Google Analytics: **Sí** → seleccionar cuenta Google Analytics existente o crear una
4. Esperar a que se cree (~30 segundos)

### 2.2 Registrar la Web App

1. En la consola del proyecto → **Project Overview** → ícono `</>` (Web)
2. Nombre de la app: `investmentsmarc-web`
3. **Marcar** "Also set up Firebase Hosting": ✅
4. Click **Register app**
5. Aparecerá el bloque `firebaseConfig` — **copiar estos valores**, son las variables `NEXT_PUBLIC_FIREBASE_*`

```javascript
// Esto lo verás en la consola — copiar cada valor a .env.local
const firebaseConfig = {
  apiKey: "AIza...",                    // → NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "investments-marc-prod.firebaseapp.com",  // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  projectId: "investments-marc-prod",   // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
  storageBucket: "investments-marc-prod.firebasestorage.app",  // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456789",       // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789:web:abc123",      // → NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX"         // → NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
```

### 2.3 Activar Firestore

1. Firebase Console → **Build** → **Firestore Database**
2. Click **Create database**
3. Location: `us-east1` (cercano al público objetivo)
4. Security rules: **Start in test mode** (cambiaremos después)
5. Esperar a que se provisione (~1 minuto)

**Después de crear:** ir a Rules y reemplazar con las reglas de `docs/architecture/firebase-schema.md`:
```
Rules → editar → pegar reglas → Publish
```

### 2.4 Activar Firebase Auth

1. Firebase Console → **Build** → **Authentication**
2. Click **Get started**
3. Tab **Sign-in method** → activar:
   - **Email/Password**: ✅ Enable → Save
   - **Google**: ✅ Enable → seleccionar email de soporte → Save
4. Tab **Settings** → Authorized domains:
   - Verificar que `investmentsmarc.com` esté (se añade automático con Hosting)
   - Añadir `localhost` si no está

### 2.5 Activar Firebase Storage

1. Firebase Console → **Build** → **Storage**
2. Click **Get started**
3. Security rules: **Start in test mode**
4. Location: misma que Firestore (`us-east1`)
5. Crear carpetas base después:
   ```
   /images/
   /courses/
   ```

### 2.6 Activar Cloud Functions

> ⚠️ **Requiere plan Blaze (pay-as-you-go)**. No tiene costo fijo, solo pagas por uso.

1. Firebase Console → **Upgrade** → seleccionar plan **Blaze**
2. Configurar alerta de presupuesto: **$25/mes** (recibirás email si se acerca)
3. Firebase Console → **Build** → **Functions**
4. Esperar provisionamiento (~2 minutos)

**Configurar el emulador local para desarrollo:**
```bash
firebase init functions
# → TypeScript
# → ESLint: Sí
# → Install dependencies: Sí
```

### 2.7 Activar Firebase Hosting

1. Firebase Console → **Build** → **Hosting**
2. Click **Get started**
3. El wizard pide instalar CLI — si no lo tienes:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
4. Inicializar en el proyecto:
   ```bash
   firebase init hosting
   # → Public directory: out (o .next para SSR)
   # → Single-page app: No
   # → GitHub Actions: Sí (configurar después)
   ```

### 2.8 Generar Service Account para CI/CD

1. Firebase Console → ⚙️ **Project settings** → **Service accounts**
2. Click **Generate new private key**
3. Se descarga un JSON → **este JSON va como secret en GitHub** (`FIREBASE_SERVICE_ACCOUNT`)
4. **NUNCA commitear este archivo** — borrarlo del disco después de subirlo a GitHub Secrets

### 2.9 Firebase CLI — Resumen de Comandos Útiles

```bash
firebase login                        # Autenticarse
firebase use investments-marc-prod    # Seleccionar proyecto
firebase serve                        # Servidor local
firebase emulators:start              # Emuladores (Firestore, Auth, Functions)
firebase deploy --only hosting        # Deploy solo Hosting
firebase deploy --only functions      # Deploy solo Functions
firebase deploy --only firestore:rules  # Deploy solo reglas Firestore
firebase hosting:channel:deploy staging # Deploy a canal preview
firebase hosting:rollback             # Rollback de emergencia
```

---

## 3. Variables de Entorno — Estrategia por Ambiente

### 3.1 Filosofía

```
.env.local.example  → Referencia (SE commitea, valores vacíos)
.env.local          → Desarrollo local (NO se commitea, en .gitignore)
GitHub Secrets      → Producción y staging (en la config del repo)
```

**Nunca** existirán archivos `.env.production` ni `.env.staging` en el repo.
Los valores de producción **solo viven en GitHub Secrets** y se inyectan durante el build en GitHub Actions.

### 3.2 Variables del Proyecto

#### Variables Públicas (prefijo `NEXT_PUBLIC_`)
Expuestas al browser — no deben contener secretos.

| Variable | Dev (`.env.local`) | Prod (GitHub Secret) | Descripción |
|----------|-------------------|---------------------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Valor de Firebase Console | Mismo valor | API key del proyecto Firebase |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `investments-marc-prod.firebaseapp.com` | Mismo | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `investments-marc-prod` | Mismo | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `investments-marc-prod.firebasestorage.app` | Mismo | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Valor de consola | Mismo | Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Valor de consola | Mismo | App ID |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Mismo | Google Analytics |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Valor de Sanity | Mismo | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | `production` | Sanity dataset |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` | **Diferente** por ambiente |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://investmentsmarc.com` | URL base del sitio |

#### Variables Privadas (server-only)
Solo accesibles en server components, API routes y Cloud Functions.

| Variable | Dev (`.env.local`) | Prod (GitHub Secret) | Descripción |
|----------|-------------------|---------------------|-------------|
| `SANITY_API_TOKEN` | Token de Sanity Studio | Token de producción | API write token |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` | **Diferente** por ambiente |
| `STRIPE_WEBHOOK_SECRET` | `whsec_test_...` | `whsec_live_...` | **Diferente** por ambiente |
| `CONVERTKIT_API_KEY` | API key de ConvertKit | Mismo | Email marketing |
| `CONVERTKIT_FORM_ID` | Form ID | Mismo | ID del formulario |
| `FIREBASE_SERVICE_ACCOUNT` | No necesario local | JSON completo | Service account (solo CI/CD) |
| `WHATSAPP_API_TOKEN` | Token de WhatsApp Business API | Token producción | Notificaciones WhatsApp |

### 3.3 Archivo `.env.local` para Desarrollo

Cada desarrollador crea su propio `.env.local` copiando `.env.local.example`:

```bash
cp .env.local.example .env.local
# Rellenar con valores reales
```

> **Importante:** `.env.local` está en `.gitignore`. Si un nuevo dev se une al equipo,
> el team lead le comparte los valores de dev por canal seguro (nunca por Slack/email público).

### 3.4 Subir Secrets a GitHub

```
Repo → Settings → Secrets and variables → Actions → New repository secret
```

Secrets necesarios para el CI/CD:

| Secret Name | Valor | Cuándo se necesita |
|-------------|-------|-------------------|
| `FIREBASE_SERVICE_ACCOUNT` | JSON del service account (paso 2.8) | Deploy a Firebase |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API key | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Build de Next.js |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Measurement ID | Build de Next.js |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID | Build de Next.js |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Build de Next.js |
| `NEXT_PUBLIC_SITE_URL` | `https://investmentsmarc.com` | Build de Next.js |
| `SANITY_API_TOKEN` | Token Sanity | ISR revalidation |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Cloud Functions |
| `STRIPE_WEBHOOK_SECRET` | `whsec_live_...` | Cloud Functions |
| `CONVERTKIT_API_KEY` | API key | Cloud Functions |
| `CONVERTKIT_FORM_ID` | Form ID | Cloud Functions |

### 3.5 Variables en GitHub Actions (no-secret)

Para valores que no son secretos pero varían por ambiente, usar **Variables** (no Secrets):

```
Repo → Settings → Secrets and variables → Actions → Variables tab
```

| Variable Name | Valor |
|---------------|-------|
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `WHATSAPP_NUMBER` | `18329534918` |
| `NODE_ENV` | `production` |

---

## 4. Sanity.io — CMS del Blog

### 4.1 Crear el Proyecto

1. Ir a https://www.sanity.io/get-started
2. Signup con GitHub (cuenta de la organización)
3. **Create new project** → nombre: `investments-marc-blog`
4. Dataset: `production`
5. Plan: **Free** (100K API requests/mes, 500K assets, 10GB bandwidth)

### 4.2 Obtener Credenciales

1. Sanity Dashboard → **API** tab
2. Copiar:
   - **Project ID** → `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - **Dataset** → `production` (ya lo sabemos)
3. **Tokens** → Add API Token:
   - Nombre: `nextjs-server`
   - Permissions: **Editor** (read + write)
   - Copiar token → `SANITY_API_TOKEN`

### 4.3 Configurar CORS Origins

1. Sanity Dashboard → **API** → **CORS origins**
2. Añadir:
   - `http://localhost:3000` (Allow credentials: ✅)
   - `https://investmentsmarc.com` (Allow credentials: ✅)

### 4.4 Instalar Sanity en el Proyecto

```bash
# Desde la raíz del proyecto
npm install @sanity/client @sanity/image-url next-sanity

# Si quieres Sanity Studio embebido:
npm install sanity @sanity/vision
```

### 4.5 Schemas a Crear (Fase 2)

Archivos en `sanity/schemas/`:

```
sanity/
├── sanity.config.ts       ← Configuración principal
├── sanity.cli.ts          ← CLI config
└── schemas/
    ├── post.ts            ← Blog posts
    ├── category.ts        ← Categorías del blog
    ├── author.ts          ← Autores
    └── testimonial.ts     ← Testimonios (opcional, alternativa a Firestore)
```

**Categorías a crear en Sanity Studio:**
- Análisis de Mercado
- Trading Institucional
- Educación
- Herramientas

### 4.6 Sanity Client en Next.js

Archivo a crear: `src/lib/sanity.ts`

```typescript
import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2026-03-26',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,  // solo server-side
});
```

---

## 5. Stripe — Pagos de Cursos

> Necesario en **Fase 4**. Se puede configurar antes para tener el entorno listo.

### 5.1 Crear Cuenta Stripe

1. Ir a https://dashboard.stripe.com/register
2. Registrarse con email del negocio
3. Completar verificación de identidad (para cobrar en vivo)
4. País de la cuenta: **Estados Unidos** (para cobrar en USD)

### 5.2 Obtener API Keys

1. Stripe Dashboard → **Developers** → **API keys**
2. Copiar:
   - **Publishable key** (`pk_test_...` / `pk_live_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (`sk_test_...` / `sk_live_...`) → `STRIPE_SECRET_KEY`

> **⚠️ IMPORTANTE:** En desarrollo usar keys de **Test mode** (toggle en el dashboard).
> En producción usar keys de **Live mode**. Son diferentes.

### 5.3 Configurar Webhook

1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint**:
   - URL: `https://investmentsmarc.com/api/stripe/webhook` (producción)
   - Events: seleccionar:
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
3. Copiar **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET`

### 5.4 Webhook para Desarrollo Local

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Escuchar webhooks localmente (redirige a localhost)
stripe listen --forward-to localhost:3000/api/stripe/webhook
# → Te da un whsec_test_... temporal — usar como STRIPE_WEBHOOK_SECRET en .env.local
```

### 5.5 Productos a Crear en Stripe (Fase 4)

Por cada curso:
1. Stripe Dashboard → **Products** → **Add product**
2. Nombre: `[Nombre del Curso]`
3. Pricing: One-time payment, precio en USD
4. Copiar **Price ID** (`price_...`) → guardar en Firestore `courses/{id}.stripePriceId`

---

## 6. ConvertKit — Email Marketing

### 6.1 Crear Cuenta

1. Ir a https://convertkit.com/ (ahora se llama **Kit**)
2. Plan **Free** hasta 10,000 suscriptores
3. Registrarse con email del negocio

### 6.2 Obtener API Key

1. Kit Dashboard → **Settings** → **Advanced** → **API**
2. Copiar **API Key** → `CONVERTKIT_API_KEY`

### 6.3 Crear Formularios/Secuencias

1. **Forms** → Create form:
   - Nombre: `Curso Gratis Lead Magnet`
   - Copiar **Form ID** → `CONVERTKIT_FORM_ID`
2. **Sequences** → Create sequence:
   - `Bienvenida Curso Gratis` (5 emails automáticos)
   - `Pre-Webinar` (3 emails antes del webinar)
   - `Post-Webinar` (seguimiento)

### 6.4 Integración (Cloud Function)

La Cloud Function `onLeadCapture` llama a la API de ConvertKit:
```
POST https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
Body: { api_key, email, first_name, fields: { source } }
```

---

## 7. GitHub Actions — CI/CD y Secrets

### 7.1 Workflow de Deploy a Firebase

Crear archivo `.github/workflows/deploy-firebase.yml`:

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_SITE_URL: https://investmentsmarc.com

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: investments-marc-prod
```

### 7.2 Workflow de Preview (PRs)

Crear archivo `.github/workflows/preview.yml`:

```yaml
name: Deploy Preview
on: pull_request

jobs:
  preview:
    if: github.event.pull_request.head.repo.full_name == github.repository
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Build Next.js
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET }}
          NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID }}
          NEXT_PUBLIC_FIREBASE_APP_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_APP_ID }}
          NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: ${{ secrets.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID }}
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ secrets.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: production
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
          NEXT_PUBLIC_SITE_URL: https://investmentsmarc.com

      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          projectId: investments-marc-prod
          # Sin channelId → crea canal preview automáticamente
```

### 7.3 Resumen de Secrets a Configurar

```
Repo → Settings → Secrets and variables → Actions → Secrets tab
```

Total: **17 secrets** para producción completa (Fases 1-4).
Para arrancar solo Fase 1 se necesitan **9** (los de Firebase + Sanity).

| # | Secret | Necesario desde |
|---|--------|----------------|
| 1 | `FIREBASE_SERVICE_ACCOUNT` | Fase 1 |
| 2 | `NEXT_PUBLIC_FIREBASE_API_KEY` | Fase 1 |
| 3 | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Fase 1 |
| 4 | `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Fase 1 |
| 5 | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Fase 1 |
| 6 | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Fase 1 |
| 7 | `NEXT_PUBLIC_FIREBASE_APP_ID` | Fase 1 |
| 8 | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Fase 1 |
| 9 | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Fase 2 |
| 10 | `SANITY_API_TOKEN` | Fase 2 |
| 11 | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Fase 4 |
| 12 | `STRIPE_SECRET_KEY` | Fase 4 |
| 13 | `STRIPE_WEBHOOK_SECRET` | Fase 4 |
| 14 | `CONVERTKIT_API_KEY` | Fase 3 |
| 15 | `CONVERTKIT_FORM_ID` | Fase 3 |
| 16 | `WHATSAPP_API_TOKEN` | Fase 3 |
| 17 | `NEXT_PUBLIC_SITE_URL` | Fase 3 |

---

## 8. DNS y Dominios

### 8.1 Estado Actual

| Dominio | Registrar | Hosting actual |
|---------|-----------|---------------|
| `investmentsmarc.com` | Hostinger | Hostinger (WordPress) |
| `cursos.investmentsmarc.com` | Hostinger | Subdominio externo |
| `flowtitan.investmentsmarc.com` | Hostinger | VPS propio |
| `social.investmentsmarc.com` | Hostinger | VPS Postiz |

### 8.2 Migración DNS (Fase 3)

**Opción A — Mantener DNS en Hostinger, apuntar a Firebase:**

1. Firebase Console → Hosting → **Custom domain** → añadir `investmentsmarc.com`
2. Firebase te da 2 registros DNS (tipo `A` o `TXT` para verificación)
3. En panel DNS de Hostinger:
   - Borrar `A` record actual que apunta al hosting WordPress
   - Añadir los `A` records que Firebase proporciona
   - Mantener los demás registros (flowtitan, social) sin cambios
4. Esperar propagación DNS (1-48 horas)
5. Firebase genera SSL automáticamente una vez verificado

**Opción B — Migrar DNS a Cloudflare (recomendado a futuro):**

1. Crear cuenta en Cloudflare (gratis)
2. Añadir dominio `investmentsmarc.com`
3. En Hostinger: cambiar nameservers a los de Cloudflare
4. En Cloudflare: configurar registros DNS:
   - `investmentsmarc.com` → Firebase Hosting IPs
   - `flowtitan` → VPS IP actual
   - `social` → VPS Postiz IP actual
5. Beneficio: CDN extra, DDoS protection, analytics de tráfico

### 8.3 Periodo de Transición (30 días)

```
Semana 1: Deploy a Firebase + DNS cutover
Semana 2-4: Monitorear Search Console, tráfico, errores 404
Semana 4+: Si todo OK → cancelar hosting WordPress en Hostinger
           Si hay problema → revertir DNS a Hostinger (WordPress sigue vivo)
```

> **NUNCA** cancelar Hostinger antes de completar los 30 días de monitoreo.

---

## 9. Herramientas de Desarrollo Local

### 9.1 Software Requerido

| Herramienta | Versión | Instalación | Para qué |
|-------------|---------|-------------|----------|
| Node.js | v20+ (proyecto usa v24) | `brew install node` o nvm | Runtime |
| npm | v10+ | Viene con Node.js | Packages |
| Git | v2.40+ | `brew install git` | Control de versiones |
| Firebase CLI | latest | `npm install -g firebase-tools` | Deploy + emuladores |
| Stripe CLI | latest | `brew install stripe/stripe-cli/stripe` | Webhooks locales |
| Java JDK | v11+ | `brew install openjdk@11` | Firebase Emulators |

### 9.2 Extensiones VSCode Recomendadas

```json
// .vscode/extensions.json (crear si se quiere compartir)
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dsznajder.es7-react-js-snippets",
    "firebase.vscode-firebase",
    "sanity-io.vscode-sanity"
  ]
}
```

### 9.3 Firebase Emulators (desarrollo sin cloud)

```bash
# Iniciar emuladores de Firestore, Auth, Functions, Hosting
firebase emulators:start

# Endpoints locales:
# Firestore:  http://localhost:8080
# Auth:       http://localhost:9099
# Functions:  http://localhost:5001
# Hosting:    http://localhost:5000
# Emulator UI: http://localhost:4000
```

Para usar emuladores en Next.js dev, añadir a `src/lib/firebase.ts`:
```typescript
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

### 9.4 Scripts de Desarrollo

```bash
npm run dev           # Next.js en http://localhost:3000
npm run build         # Build de producción (verificar antes de PR)
npm run lint          # ESLint
firebase emulators:start  # Emuladores Firebase
stripe listen --forward-to localhost:3000/api/stripe/webhook  # Stripe webhooks
```

---

## 10. Checklist Final por Ambiente

### Desarrollo Local (cada dev)

- [ ] Node.js v20+ instalado
- [ ] Repo clonado: `git clone git@github.com:investmentsmarc/investmentsmarc-platform.git`
- [ ] Dependencies: `npm install`
- [ ] `.env.local` creado con valores reales (copiar de `.env.local.example`)
- [ ] `npm run dev` arranca sin errores en `http://localhost:3000`
- [ ] `npm run build` completa sin errores TypeScript
- [ ] Firebase CLI instalado y autenticado (`firebase login`)
- [ ] Firebase emuladores funcionan (`firebase emulators:start`)

### Staging (automático vía PR)

- [ ] Workflow `preview.yml` configurado
- [ ] Todos los GitHub Secrets subidos
- [ ] PR genera link de preview en Firebase Hosting
- [ ] Review por al menos 1 aprobador antes de merge

### Producción (automático vía push a main)

- [ ] Workflow `deploy-firebase.yml` configurado
- [ ] Todos los 17 GitHub Secrets subidos
- [ ] Branch protection en `main` activada
- [ ] Firebase Hosting conectado al dominio `investmentsmarc.com`
- [ ] SSL activo y verificado
- [ ] 301 redirects de WordPress funcionando
- [ ] Search Console verificado y monitoreando
- [ ] Alerta de presupuesto Firebase configurada ($25/mes)

---

## Orden de Ejecución Recomendado

```
1. ✋ Owner: Crear org en GitHub + repo privado + branch protection
2. ✋ Owner: Crear proyecto Firebase (2.1 → 2.8)
3. ✋ Owner: Compartir .env.local values al equipo por canal seguro
4. ✋ Owner: Subir GitHub Secrets (3.4)
5. 🤖 Equipo: Clonar repo, crear .env.local, verificar dev local (10)
6. 🤖 Equipo: Comenzar Fase 1 (layout global + páginas core)
7. ✋ Owner: Crear proyecto Sanity (antes de Fase 2)
8. ✋ Owner: Crear cuenta Stripe (antes de Fase 4)
9. ✋ Owner: DNS cutover a Firebase (Fase 3)
```

✋ = Acción del owner/team lead
🤖 = Acción del equipo de desarrollo
