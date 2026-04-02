# Firebase Console Setup — Habilitar APIs y Servicios

**Proyecto**: investments-marc  
**URL Console**: https://console.firebase.google.com/project/investments-marc

---

## 1️⃣ HABILITAR FIRESTORE DATABASE

1. Ve a: **Firebase Console** → **Firestore Database**
2. Click en **"Create database"**
3. Selecciona:
   - **Ubicación**: `us-central1` (mismo que functions)
   - **Modo**: `Production mode` (rules están en `firestore.rules`)
4. Click **"Create"**
5. Espera ~2-3 minutos a que se cree

✅ **Firestore habilitado**

---

## 2️⃣ HABILITAR CLOUD STORAGE

1. Ve a: **Firebase Console** → **Storage**
2. Click en **"Get started"**
3. Selecciona:
   - **Ubicación**: `us-central1`
   - **Reglas**: `Production mode` (rules están en `storage.rules`)
4. Click **"Done"**
5. Espera ~1-2 minutos

✅ **Cloud Storage habilitado**

---

## 3️⃣ HABILITAR CLOUD FUNCTIONS

1. Ve a: **Firebase Console** → **Functions**
2. Click en **"Get started"**
3. Selecciona:
   - **Ubicación**: `us-central1` (mismo que antes)
4. Click **"Next"** → **"Deploy"**
5. Espera a que se complete (~5 min)

⚠️ **Nota**: Si pide crédito, necesita account de pago activo

✅ **Cloud Functions habilitado**

---

## 4️⃣ VERIFICAR QUE TODO ESTÁ ACTIVO

En Firebase Console, debería ver:

```
✅ Firestore Database — Active
✅ Cloud Storage — Active  
✅ Cloud Functions — Active
✅ Cloud Hosting — Active (ya estaba)
```

---

## 🚀 DESPUÉS: Deploy completo

Una vez que hayas habilitado todo en Firebase Console, vuelve a la terminal y:

```bash
git push origin main
```

El workflow deployará:
1. ✅ Next.js frontend (hosting)
2. ✅ Firestore rules y indexes
3. ✅ Storage rules
4. ✅ Cloud Functions

---

## ⏱️ Timeline

| Paso | Tiempo |
|------|--------|
| Firestore | 2-3 min |
| Storage | 1-2 min |
| Functions | 5 min |
| **Total** | **8-10 min** |

---

**Estado**: Esperando que habilites servicios en Firebase Console
