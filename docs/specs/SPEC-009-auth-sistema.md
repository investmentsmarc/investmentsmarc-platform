# SPEC-009 — Sistema de Autenticación

> Fase: 4 | Prioridad: MUST
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-020
> Casos de Uso: [UC-006](../use-cases/UC-006-estudiante-registro-login.md)

---

## 1. Alcance

Sistema de autenticación basado en Firebase Auth para estudiantes y admin, con protección de rutas y roles.

## 2. Providers

| Provider | Uso | Configuración |
|----------|-----|---------------|
| Email/Password | Login principal de estudiantes | Firebase Console → Authentication → Sign-in method |
| Google OAuth | Login rápido / social | Requiere Google Cloud Console OAuth credentials |

## 3. Roles

| Rol | Implementación | Permisos |
|-----|---------------|----------|
| Estudiante | Firebase Auth user (default) | Ver cursos comprados, progreso, perfil |
| Admin | Custom Claim `admin: true` | Todo lo anterior + CRUD cursos, ver leads, dashboard |

### 3.1 Asignar Admin (una sola vez, via Firebase Admin SDK)

```typescript
// Script de setup (run once)
import { getAuth } from 'firebase-admin/auth';
await getAuth().setCustomUserClaims(MARC_UID, { admin: true });
```

## 4. Componentes

### 4.1 `<AuthProvider />`

- **Ubicación:** `src/components/global/AuthProvider.tsx`
- **Tipo:** Client Component (Context Provider)
- **Comportamiento:**
  - Wraps `{children}` en React Context
  - `onAuthStateChanged` listener → actualiza estado
  - Expone: `user`, `loading`, `signIn`, `signUp`, `signOut`, `isAdmin`
  - `isAdmin` se obtiene de `user.getIdTokenResult().claims.admin`

### 4.2 `<LoginForm />`

- **Ubicación:** `src/components/forms/LoginForm.tsx`
- **Tipo:** Client Component
- **Campos:**
  - Email — `email`, required
  - Password — `password`, required, min 8 chars
- **Acciones:**
  - "Iniciar Sesión" → `signInWithEmailAndPassword`
  - "Registrarse" → toggle a `<SignUpForm />`
  - "Continuar con Google" → `signInWithPopup(GoogleAuthProvider)`
  - "Olvidé mi contraseña" → `sendPasswordResetEmail`
- **Estados:** loading, error (mensaje Firebase traducido a español), success (redirect)

### 4.3 `<SignUpForm />`

- **Ubicación:** `src/components/forms/SignUpForm.tsx`
- **Tipo:** Client Component
- **Campos:**
  - Nombre completo — `text`, required
  - Email — `email`, required
  - Password — `password`, required, min 8 chars
  - Confirmar Password — `password`, must match
- **Flujo:**
  1. `createUserWithEmailAndPassword`
  2. `updateProfile({ displayName })`
  3. Redirect a `/cursos/` o a la página de origen

### 4.4 `<ProtectedRoute />`

- **Ubicación:** `src/components/global/ProtectedRoute.tsx`
- **Tipo:** Client Component
- **Props:** `{ children, requireAdmin?: boolean }`
- **Comportamiento:**
  - Si `loading` → spinner
  - Si no autenticado → redirect a `/login/`
  - Si `requireAdmin` y no es admin → redirect a `/cursos/`
  - Si autenticado → render `{children}`

## 5. Rutas

| Ruta | Protección | Rol |
|------|-----------|-----|
| `/login/` | Pública (redirect si ya logueado) | — |
| `/registro/` | Pública | — |
| `/cursos/` | Pública (catálogo) | — |
| `/cursos/[slug]/` | Pública (landing) | — |
| `/cursos/[slug]/lecciones/` | Protegida | Estudiante con enrollment |
| `/dashboard/` | Protegida | Estudiante |
| `/admin/` | Protegida | Admin |

## 6. Firebase Client Config

```typescript
// src/lib/firebase.ts
import { getAuth, connectAuthEmulator } from 'firebase/auth';

const auth = getAuth(app);
if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}
export { auth };
```

## 7. Criterios de Aceptación

- [ ] Login con email/password funcional
- [ ] Login con Google funcional
- [ ] Registro crea usuario y redirige correctamente
- [ ] "Olvidé mi contraseña" envía email de reset
- [ ] Rutas protegidas redirigen a login si no autenticado
- [ ] Admin Custom Claim funciona para panel admin
- [ ] Auth state persiste en refresh (Firebase persistence)
- [ ] Errores de Firebase traducidos a mensajes user-friendly en español
