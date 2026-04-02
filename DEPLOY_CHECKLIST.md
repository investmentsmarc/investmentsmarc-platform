# 🚀 DEPLOY CHECKLIST — investmentsmarc-platform

## Estado actual
- ✅ Rama: `feat/initial-structure`
- ✅ Commits listos: 2 cambios (redirect calculadora + documentación)
- ✅ Secrets en GitHub: ✅ Configurados (user: yoan)
- ✅ Workflow: `.github/workflows/deploy-firebase.yml` (listo)

---

## 📋 PASOS PARA DEPLOY A PRODUCCIÓN

### PASO 1: Push de rama actual
```bash
git push origin feat/initial-structure
```

✅ Esto actualiza la rama en GitHub (NO dispara deploy aún)

---

### PASO 2: Crear PR (opcional pero recomendado)
```bash
# Opción A: Vía CLI
gh pr create --title "feat: prepare for production deploy" \
  --body "- Fix calculadora routing (301 redirect)
- Add deployment validation guides
- Whitelist GitHub secrets
- Ready for production"

# Opción B: Vía GitHub UI
# https://github.com/investmentsmarc/investmentsmarc-platform/pulls
# New pull request → feat/initial-structure → main
```

✅ Esto abre una PR y el workflow `preview.yml` corre (preview deployment)

---

### PASO 3: Mergear a `main`
```bash
# Opción A: Vía CLI
git checkout main
git pull origin main
git merge feat/initial-structure
git push origin main

# Opción B: Vía GitHub UI
# En la PR → "Merge pull request" → Confirm merge
```

✅ **ESTO DISPARA EL WORKFLOW `deploy-firebase.yml`**

---

## 🔍 VERIFICAR DEPLOYMENT

### En tiempo real (GitHub Actions)
1. Ir a: https://github.com/investmentsmarc/investmentsmarc-platform/actions
2. Ver workflow "Deploy Firebase" corriendo
3. Esperar ~3-5 minutos para que complete

### En Firebase Console
1. Ir a: https://console.firebase.google.com/project/investments-marc/hosting
2. Ver sección "Deployment history"
3. El deployment más reciente debe estar "Deployed" con timestamp reciente

### En vivo
1. Abrir: https://investmentsmarc.web.app
2. Validar:
   - [ ] Página `/` carga
   - [ ] Header: logo, nav items visibles
   - [ ] Click "Calculadora" → navega a `/herramientas/investment-calculator`
   - [ ] Header sticky: logo se redimensiona al scroll
   - [ ] WhatsApp float visible
   - [ ] `/herramientas`, `/blog`, `/faqs` funcionan

---

## 📊 RESUMEN DE CAMBIOS EN DEPLOY

```
2 commits preparados:
  - fix: resolve calculadora routing and prepare for production deploy
  - docs: add deployment validation guides

5 archivos modificados:
  - next.config.ts (redirect /calculadora)
  - src/app/globals.css (header sticky improvements)
  - src/components/global/WhatsAppFloat.tsx (icon fix)
  - src/app/herramientas/page.tsx (routing fix)
  - src/lib/site.ts (routing fix)

1 archivo eliminado:
  - src/app/calculadora/page.tsx (ruta duplicada)

3 documentos creados:
  - docs/guides/github-secrets-required.md
  - docs/guides/test-run-workflow.md
  - docs/architecture/whatsapp-routing.md
```

---

## ⏱️ TIMELINE ESTIMADO

| Paso | Tiempo | Acción |
|------|--------|--------|
| 1. Push | 30s | Tu máquina |
| 2. PR (opcional) | 1min | GitHub UI |
| 3. Merge a main | 30s | Tu máquina o GitHub |
| 4. Workflow runs | 3-5min | GitHub Actions (automático) |
| **5. Validar live** | 2-5min | Tu navegador |
| **Total** | **7-12min** | ✅ Deploy completo |

---

## 🎯 COMANDOS LISTOS PARA COPIAR/PEGAR

### Opción rápida (sin PR)
```bash
# En tu terminal, desde la carpeta del proyecto:
git push origin feat/initial-structure
git checkout main
git pull origin main
git merge feat/initial-structure
git push origin main

# Esperar 3-5 min, luego:
# Abrir https://investmentsmarc.web.app
```

### Opción con PR (recomendada para auditar cambios)
```bash
git push origin feat/initial-structure
gh pr create --title "feat: production-ready site" \
  --body "- Ready for production deploy
- All 4 bloqueants resolved
- Secrets configured in GitHub"

# Review en GitHub UI, mergear desde PR
```

---

## ✅ POST-DEPLOY CHECKLIST

Una vez que el sitio está live en `investmentsmarc.web.app`:

- [ ] Home page (`/`) funciona
- [ ] Herramientas (`/herramientas`) visible
- [ ] Calculadora (`/herramientas/investment-calculator`) funciona
- [ ] Redirect (`/calculadora` → `/herramientas/investment-calculator`) funciona
- [ ] Header sticky responsive
- [ ] WhatsApp float visible y clickeable
- [ ] Blog (`/blog`), FAQs (`/faqs`), Contacto (`/contacto`) accesibles
- [ ] Responsive en mobile (simular en DevTools)

---

## 🆘 SI ALGO FALLA

### Error en GitHub Actions
1. Ir a: https://github.com/investmentsmarc/investmentsmarc-platform/actions
2. Click en el workflow fallido
3. Revisar logs (típicamente al final está el error)
4. Causas comunes:
   - ❌ Secreto mal configurado → revisar en Settings
   - ❌ Build error → `npm run build` localmente para debuggear
   - ❌ Firebase auth error → verificar service account JSON

### Sitio live pero con problemas
1. Firebase Console → Hosting → Deployment history
2. Click en "Promote" en un deployment anterior para revertir
3. O hacer fix local, push a `main`, redeploy automático

---

**Status**: 🟢 READY FOR DEPLOY  
**Next**: `git push origin feat/initial-structure` ← tú lo haces desde tu máquina  
**Then**: mergear a `main` para disparar el workflow
