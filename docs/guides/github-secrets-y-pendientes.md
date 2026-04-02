# GitHub Secrets y Pendientes de Integracion

## Secrets para desplegar ya a Firebase

Estos son los **secrets mínimos** que debes crear en:

`GitHub Repo -> Settings -> Secrets and variables -> Actions -> New repository secret`

### Obligatorios hoy

1. `FIREBASE_SERVICE_ACCOUNT_INVESTMENTS_MARC`
   Valor: el JSON completo del service account de Firebase.

2. `NEXT_PUBLIC_FIREBASE_API_KEY`
   Valor: el mismo de `.env.local`.

3. `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   Valor: `investments-marc.firebaseapp.com`

4. `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   Valor: `investments-marc.firebasestorage.app`

5. `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   Valor: `256378043383`

6. `NEXT_PUBLIC_FIREBASE_APP_ID`
   Valor: `1:256378043383:web:764c6c80acad62e1f88cf2`

7. `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`
   Valor: `G-TL8HZ70B3Y`

## No hace falta crear hoy

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  No hace falta en GitHub Secrets para el workflow actual porque está fijo en los workflows como `investments-marc`.

- `NEXT_PUBLIC_SITE_URL`
  Aún no se usa en los workflows actuales.

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CONVERTKIT_API_KEY`
- `CONVERTKIT_FORM_ID`
- `WHATSAPP_API_TOKEN`

Todo eso será necesario cuando cierres CMS, pagos, automatizaciones y marketing.

## Como sacar el service account

1. Entra a `Firebase Console -> Project settings -> Service accounts`
2. Click en `Generate new private key`
3. Descarga el JSON
4. Abre el archivo y copia **todo el contenido**
5. Pégalo como valor del secret `FIREBASE_SERVICE_ACCOUNT_INVESTMENTS_MARC`
6. Borra el JSON local si no lo vas a guardar en un lugar seguro

## Flujo de deploy esperado

- `push` a `main` o `master` -> dispara `.github/workflows/deploy-firebase.yml`
- `pull_request` -> dispara `.github/workflows/preview.yml`

Ambos workflows ya están apuntando a:

- Proyecto Firebase: `investments-marc`
- Hosting deploy action: `FirebaseExtended/action-hosting-deploy@v0`

## Pendientes de integracion

### 1. Firebase Hosting productivo

- Verificar que el proyecto esté en plan adecuado si vas a usar Functions.
- Conectar dominio custom `investmentsmarc.com` en Firebase Hosting.
- Actualizar `NEXT_PUBLIC_SITE_URL` a producción cuando cierres deploy real.

### 2. GitHub Actions

- Subir el service account real.
- Confirmar que la rama principal será `main` o `master`.
- Hacer un primer push para validar build + deploy.

### 3. Firestore / reglas

- Publicar `firestore.rules`.
- Publicar `firestore.indexes.json`.
- Verificar desde Firebase Console que los leads de `contacto`, `curso-gratis` y `webinar` entran correctamente.

### 4. Functions

- Ejecutar `npm install` dentro de `functions/`.
- Desplegar Functions cuando quieras activar automatizaciones reales.
- Completar la lógica real de:
  - `onLeadCapture`
  - `onWebinarRegister`
  - `stripeWebhook`

### 5. Sanity

- Crear proyecto Sanity.
- Configurar `NEXT_PUBLIC_SANITY_PROJECT_ID`.
- Configurar `SANITY_API_TOKEN`.
- Reemplazar el contenido semilla del blog por contenido real desde CMS.

### 6. Stripe

- Crear productos y `price_id`.
- Configurar `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
- Configurar `STRIPE_SECRET_KEY`.
- Configurar `STRIPE_WEBHOOK_SECRET`.
- Conectar checkout y enrollments reales.

### 7. Auth

- Activar Email/Password y Google en Firebase Auth.
- Implementar login real y guardas para dashboard / cursos.
- Conectar progreso, enrollments y permisos.

### 8. Email / automatizaciones

- Configurar ConvertKit o Kit.
- Definir automatización post lead para `curso-gratis` y `webinar`.
- Definir si WhatsApp API se usará de forma real o solo como canal manual.

### 9. Contenido / operación

- Sustituir textos seed por copy final.
- Subir imágenes reales de Marc / FlowTitan / OG image.
- Revisar legales con texto definitivo.

## Checklist corto para hacerlo al tiro

- Crear los 7 secrets obligatorios.
- Hacer `push` a `main`.
- Revisar Actions en GitHub.
- Revisar Firebase Hosting.
- Confirmar que el sitio publicado carga.

