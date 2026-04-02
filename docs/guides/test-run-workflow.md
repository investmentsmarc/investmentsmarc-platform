# Test-Run del Workflow de Deploy

**Objetivo**: Validar que el workflow `.github/workflows/deploy-firebase.yml` funciona antes de hacer deploy a producción.  
**Duración estimada**: 5-10 minutos  
**Status**: ⚠️ Acción manual requerida

---

## 📋 Prerequisitos

1. **Credenciales GitHub**: Acceso con SSH key o GitHub CLI autenticado
2. **Secretos configurados**: Todos los 7 secretos en GitHub (ver `docs/guides/github-secrets-required.md`)
3. **Rama test creada**: Crear rama `test/deploy-check`

---

## 🚀 Pasos para Test-Run

### Paso 1: Crear rama de test
```bash
git checkout -b test/deploy-check
```

### Paso 2: Push a rama test
```bash
git push -u origin test/deploy-check
```

La rama `test/deploy-check` NO triggerará el workflow automático (solo `main` y `master` lo hacen, ver líneas 5-7 de `deploy-firebase.yml`).

**Opción A: Forzar manualmente el workflow en GitHub UI**
1. Ir a: https://github.com/investmentsmarc/investmentsmarc-platform/actions
2. Seleccionar workflow: "Deploy Firebase"
3. Click en "Run workflow" → rama `test/deploy-check` → "Run workflow"

**Opción B: Hacer merge a rama de prerelease (si existe)**
- Si no tienes `main`/`master` protegida, puedes:
  ```bash
  git push origin test/deploy-check:staging
  ```
  Y el workflow corre en `staging` (requiere editar `deploy-firebase.yml` para incluir `staging` en `branches`)

---

## 📊 Validar la ejecución

### En GitHub Actions UI
1. Ir a: https://github.com/investmentsmarc/investmentsmarc-platform/actions/workflows/deploy-firebase.yml
2. Buscar el run desde rama `test/deploy-check`
3. Confirmar estos pasos completaron exitosamente:
   ```
   ✅ Checkout
   ✅ Setup Node.js 20
   ✅ Install dependencies (npm ci)
   ✅ Build app (npm run build)
   ✅ Deploy to Firebase (FirebaseExtended/action-hosting-deploy)
   ```

### En Firebase Console (Preview Channel)
Si todo pasó:
1. Ir a: https://console.firebase.google.com/project/investments-marc/hosting
2. Ver sección "Preview channels"
3. Debería aparecer un deployment con:
   - **Status**: "Deployed"
   - **URL**: `https://<branch-name>--<project-id>.web.app` (ej: `https://test-deploy-check--investments-marc.web.app`)
   - **Time**: hace poco

### Acceso al preview
```
https://test-deploy-check--investments-marc.web.app
```

Validar:
- [ ] Página `/` carga correctamente
- [ ] Header: logo, nav items, botón Curso Gratis visible
- [ ] Click en "Calculadora" navega a `/herramientas/investment-calculator`
- [ ] Hacer scroll: header cambia de tamaño (sticky behavior)
- [ ] Botón WhatsApp float visible en esquina inferior derecha
- [ ] `/herramientas` visible y funcional
- [ ] `/blog`, `/faqs`, `/contacto` accesibles

---

## ❌ Troubleshooting

### Error: "Build failed"
**Causa más probable**: TypeScript/linting errors  
**Solución**:
```bash
npm run build
npm run lint
# Revisar errores y corregir localmente
git add . && git commit -m "fix: resolve build errors"
git push
```

### Error: "Deploy failed — authentication"
**Causa**: Secreto `FIREBASE_SERVICE_ACCOUNT_INVESTMENTS_MARC` inválido o mal configurado  
**Solución**:
1. Ir a: GitHub Repo → Settings → Secrets and variables → Actions
2. Verificar que el secreto exista y sea JSON válido
3. Ir a Firebase Console → Project Settings → Service Accounts → Generate new private key
4. Copiar JSON completo y actualizar el secret en GitHub
5. Reintentarworkflow

### Error: "Firebase project not found"
**Causa**: `projectId` incorrecto en workflow o credenciales  
**Solución**:
1. Verificar que `projectId: investments-marc` en `deploy-firebase.yml` línea 40 sea correcto
2. Verificar que el service account pertenezca al proyecto `investments-marc`

### Preview URL no carga
**Causa**: Deploy completo pero sitio sin contenido  
**Solución**:
1. Revisar que `.next/` se generó: `npm run build` localmente
2. Verificar que `firebase.json` apunta a la carpeta correcta: `"source": "."`
3. Revisar que `public/` y `.next/standalone/` existen

---

## ✅ Después del Test-Run Exitoso

1. **Eliminar rama test**:
   ```bash
   git branch -d test/deploy-check
   git push origin --delete test/deploy-check
   ```

2. **Mergear cambios a `main`**:
   ```bash
   git checkout main
   git merge feat/initial-structure
   git push origin main
   ```

3. **El workflow deploy-firebase.yml se ejecutará automáticamente** en `main`, deployando a **Firebase Hosting live** (no preview).

4. **Validar producción**:
   - Esperar 2-3 minutos
   - Ir a: https://investmentsmarc.web.app (o dominio custom si está configurado)
   - Hacer pruebas finales

---

## 📌 Notas importantes

- **Preview channels expire**: Firebase auto-limpia previewsantiguos (típicamente 7 días)
- **Live deployment**: Solo ocurre en push a `main` o `master`, no en ramas test
- **Secrets en preview**: Los secretos se inyectan igual en preview que en live, así que credenciales de Firebase son "reales"
- **Rollback**: Si algo falla en live, ir a Firebase Console → Hosting → Deployment history → click en anterior → "Promote" para revertir

---

**Última actualización**: 2026-04-02  
**Status**: 🟡 Acción manual en GitHub requerida
