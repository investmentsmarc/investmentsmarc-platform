# UC-006 — Estudiante Se Registra / Inicia Sesión

> Actor Principal: Estudiante
> Prioridad: MUST | Fase: 4
> TRD: [TRD-001](../trd/TRD-001-investmentsmarc-platform.md) → RF-020
> Specs: [SPEC-009](../specs/SPEC-009-auth-sistema.md)

---

## Descripción

Un visitante crea una cuenta o inicia sesión para acceder a la plataforma de cursos.

## Precondiciones

- Firebase Auth configurado con email/password y Google provider
- Página `/login/` y `/registro/` disponibles

## Flujo Principal — Registro con Email

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/registro/` | Carga formulario de registro |
| 2 | Ingresa nombre: "Carlos Ruiz" | — |
| 3 | Ingresa email: "carlos@email.com" | — |
| 4 | Ingresa password: "SecurePass123" | — |
| 5 | Confirma password: "SecurePass123" | — |
| 6 | Click "Crear Cuenta" | — |
| 7 | — | Valida campos (email format, password min 8 chars, passwords match) |
| 8 | — | `createUserWithEmailAndPassword(email, password)` |
| 9 | — | `updateProfile({ displayName: 'Carlos Ruiz' })` |
| 10 | — | Redirect a `/cursos/` |

## Flujo Alternativo — Login con Email

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Navega a `/login/` | Carga formulario de login |
| 2 | Ingresa email y password | — |
| 3 | Click "Iniciar Sesión" | — |
| 4 | — | `signInWithEmailAndPassword(email, password)` |
| 5 | — | Redirect a `/cursos/` (o página de origen si venía de ruta protegida) |

## Flujo Alternativo — Login con Google

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Click "Continuar con Google" | — |
| 2 | — | Abre popup de Google OAuth |
| 3 | Selecciona cuenta de Google | — |
| 4 | — | `signInWithPopup(GoogleAuthProvider)` |
| 5 | — | Redirect a `/cursos/` |

## Flujo Alternativo — Olvidé Mi Contraseña

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Click "Olvidé mi contraseña" | — |
| 2 | — | Muestra campo de email |
| 3 | Ingresa email | — |
| 4 | Click "Enviar" | — |
| 5 | — | `sendPasswordResetEmail(email)` |
| 6 | — | Muestra: "Te enviamos un email para restablecer tu contraseña" |

## Flujo de Error — Credenciales Incorrectas

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Ingresa password incorrecta | — |
| 2 | — | Firebase error: `auth/wrong-password` |
| 3 | — | Muestra: "Contraseña incorrecta. ¿Olvidaste tu contraseña?" |

## Flujo de Error — Email Ya Registrado

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Intenta registrarse con email existente | — |
| 2 | — | Firebase error: `auth/email-already-in-use` |
| 3 | — | Muestra: "Este email ya tiene una cuenta. ¿Quieres iniciar sesión?" |

## Flujo Alternativo — Acceso a Ruta Protegida Sin Auth

| # | Actor | Sistema |
|---|-------|---------|
| 1 | Intenta acceder a `/cursos/trading/lecciones/` sin login | — |
| 2 | — | `<ProtectedRoute />` detecta no auth |
| 3 | — | Redirect a `/login/?redirect=/cursos/trading/lecciones/` |
| 4 | Se loguea exitosamente | — |
| 5 | — | Redirect a la URL original (`/cursos/trading/lecciones/`) |

## Postcondiciones

- Usuario autenticado con Firebase Auth
- `onAuthStateChanged` actualiza el contexto global
- displayName disponible para personalización
- Session persiste en refresh (Firebase default persistence)

## Reglas de Negocio

- Password mínimo 8 caracteres
- Errores de Firebase traducidos a español user-friendly
- Post-login redirect a página de origen o `/cursos/`
- Auth state persiste entre sesiones (no requiere re-login)
- No hay verificación de email obligatoria (simplificar UX)
