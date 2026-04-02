# GitHub Secrets Requeridos para Deploy en Firebase

**Repo**: `investmentsmarc/investmentsmarc-platform`  
**Workflow**: `.github/workflows/deploy-firebase.yml`  
**Última actualización**: 2026-04-02

## ✅ Checklist de Secretos

Ir a: **Settings → Secrets and variables → Actions**

### 1. FIREBASE_SERVICE_ACCOUNT_INVESTMENTS_MARC
- **Tipo**: Credenciales (JSON completo)
- **De dónde**: Firebase Console → Project Settings → Service Accounts → Generate Private Key
- **Valor esperado**: 
  ```json
  {
    "type": "service_account",
    "project_id": "investments-marc",
    "private_key_id": "...",
    "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-..@investments-marc.iam.gserviceaccount.com",
    "client_id": "...",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "..."
  }
  ```
- **Crítico**: Sí, sin esto el deploy falla
- **Seguridad**: Nunca commitear, solo en GitHub Secrets

### 2. NEXT_PUBLIC_FIREBASE_API_KEY
- **Tipo**: String (público, se expone en el cliente)
- **De dónde**: Firebase Console → Project Settings → General → Your apps → Web app
- **Campo**: apiKey
- **Valor esperado**: `AIzaSy...` (típicamente 39 caracteres)
- **Crítico**: Sí

### 3. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- **Tipo**: String (público)
- **Valor hardcodeado**: `investments-marc.firebaseapp.com`
- **Nota**: Ya está en `.env.local.example`, podría ser hardcoded en next.config.ts
- **Crítico**: Sí

### 4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- **Tipo**: String (público)
- **Valor hardcodeado**: `investments-marc.firebasestorage.app`
- **Nota**: Ya está en `.env.local.example`, podría ser hardcoded
- **Crítico**: Sí

### 5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- **Tipo**: String (público)
- **De dónde**: Firebase Console → Project Settings → General → Your apps → Web app
- **Campo**: messagingSenderId
- **Valor esperado**: `256378043383`
- **Crítico**: Sí

### 6. NEXT_PUBLIC_FIREBASE_APP_ID
- **Tipo**: String (público)
- **De dónde**: Firebase Console → Project Settings → General → Your apps → Web app
- **Campo**: appId
- **Valor esperado**: `1:256378043383:web:764c6c80acad62e1f88cf2`
- **Crítico**: Sí

### 7. NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
- **Tipo**: String (público)
- **De dónde**: Firebase Console → Project Settings → General → Your apps → Web app
- **Campo**: measurementId
- **Valor esperado**: `G-TL8HZ70B3Y`
- **Crítico**: No (solo para Google Analytics), pero recomendado

## 🚀 Validación Rápida

```bash
# Ver secretos configurados en GitHub (requiere CLI y autenticación)
gh secret list --repo investmentsmarc/investmentsmarc-platform

# O verificar manualmente en GitHub:
# 1. Ir a https://github.com/investmentsmarc/investmentsmarc-platform/settings/secrets/actions
# 2. Confirmar que todos los 7 secretos arriba aparecen en la lista
```

## 📋 Checklist Pre-Deploy

- [ ] FIREBASE_SERVICE_ACCOUNT_INVESTMENTS_MARC configurado
- [ ] NEXT_PUBLIC_FIREBASE_API_KEY configurado
- [ ] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN configurado (o usar hardcoded)
- [ ] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET configurado (o usar hardcoded)
- [ ] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID configurado
- [ ] NEXT_PUBLIC_FIREBASE_APP_ID configurado
- [ ] NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID configurado
- [ ] Hacer push a rama `test/deploy-check` para test-run del workflow

## 🔗 Referencias

- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [GitHub Actions: Using secrets](https://docs.github.com/en/actions/security-for-github-actions/security-guides/using-secrets-in-github-actions)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Status**: ⚠️ Requiere verificación manual en GitHub antes de ejecutar deploy-firebase.yml
