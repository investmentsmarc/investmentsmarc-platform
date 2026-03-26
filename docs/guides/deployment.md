# Deployment Guide

## Stack de Despliegue

| Entorno | Hosting | Trigger |
|---------|---------|---------|
| Producción | Firebase Hosting | Push a `main` via GitHub Actions |
| Staging | Firebase Hosting (canal preview) | Push a `develop` |

## Prerequisitos

1. Firebase CLI instalado: `npm install -g firebase-tools`
2. Autenticado: `firebase login`
3. Proyecto seleccionado: `firebase use investments-marc-prod`

## Deploy Manual (emergencia)

```bash
npm run build
firebase deploy --only hosting
```

## GitHub Actions (automatizado)

El workflow `.github/workflows/deploy-firebase.yml` se activa automáticamente con push a `main`.

**Secrets requeridos en GitHub:**
- `FIREBASE_SERVICE_ACCOUNT` — Service account JSON (no commitear)
- Variables de entorno de producción (ver `.env.local.example`)

## DNS Cutover (migración desde Hostinger)

1. Verificar que Firebase Hosting responde: `firebase hosting:channel:list`
2. En panel DNS de Hostinger: apuntar `A` record a Firebase IP
3. Verificar SSL automático de Firebase (24-48h para propagar)
4. Mantener Hostinger activo **30 días** como rollback
5. Monitorear Search Console (pérdida de tráfico indica problema con 301 redirects)

## Rollback

Si hay problema crítico en producción:
```bash
firebase hosting:rollback
```
O revertir el commit y re-hacer push a `main`.

## Subdominios

| Subdominio | Acción |
|------------|--------|
| `investmentsmarc.com` | Firebase Hosting (este repo) |
| `cursos.investmentsmarc.com` | Firebase (Fase 4) |
| `flowtitan.investmentsmarc.com` | VPS existente — NO tocar |
| `social.investmentsmarc.com` | VPS Postiz — deploy separado |

## Post-Deploy Checklist

- [ ] Homepage carga en <3s (Lighthouse)
- [ ] 301 redirects funcionando (`curl -I investmentsmarc.com/calculadora/`)
- [ ] Forms envían a Firestore (probar lead form)
- [ ] WhatsApp float visible y funciona
- [ ] Cookie banner aparece en primera visita
- [ ] Blog carga posts de Sanity
- [ ] Responsive en 768px y 1024px
