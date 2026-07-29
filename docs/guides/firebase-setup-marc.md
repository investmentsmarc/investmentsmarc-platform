# Setup de Firebase para Marc

Guía para instalar y configurar Firebase CLI en tu PC, y poder desplegar
cambios de `investmentsmarc-platform`.

## 0. Cómo funciona el despliegue aquí

Este proyecto **no** se despliega corriendo un comando de deploy manual todos
los días. Usa **Firebase App Hosting**, que está conectado directo al
repositorio de GitHub:

> Cada `git push` a la rama `main` dispara automáticamente un build y deploy
> en Firebase. No hace falta ejecutar nada más.

El backend ya desplegado es:

| Backend | URL |
|---------|-----|
| `investmentsmarc-platform` | https://investmentsmarc-platform--investments-marc.us-central1.hosted.app |

Instalar el Firebase CLI sirve para: desarrollar en local, ver logs, manejar
secrets, y — si hace falta — forzar un deploy manual sin pasar por GitHub.

## 1. Prerequisitos

- **Node.js v20 o superior** — descargar de [nodejs.org](https://nodejs.org)
- **Git** instalado
- Acceso al repositorio de GitHub del proyecto (pedir invitación a Yoan)
- **Acceso al proyecto Firebase `investments-marc`** — esto es indispensable
  y solo lo puede dar el dueño actual del proyecto:
  1. Yoan entra a [Firebase Console](https://console.firebase.google.com/project/investments-marc/settings/iam)
  2. Agrega el correo de Marc con rol **Editor** (o **Owner** si va a
     administrar el proyecto completo)
  3. Marc recibe la invitación por correo y la acepta

Sin este paso 3, el CLI se instala pero ningún comando de Firebase va a
funcionar (`Permission denied` al hacer `firebase use` o cualquier deploy).

## 2. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

Verificar instalación:

```bash
firebase --version
```

## 3. Iniciar sesión

```bash
firebase login
```

Esto abre el navegador — iniciar sesión con la **misma cuenta de Google**
que fue invitada como Editor/Owner en el paso 1.

## 4. Clonar el repo y configurar el proyecto

```bash
git clone https://github.com/investmentsmarc/investmentsmarc-platform.git
cd investmentsmarc-platform
npm install
firebase use investments-marc
```

`firebase use investments-marc` confirma que tu cuenta ya tiene acceso. Si
da error de permisos, revisar el paso 1 con Yoan.

## 5. Variables de entorno

Copiar el archivo `.env.local` que te compartió Yoan a la raíz del proyecto
(nunca se sube a GitHub, cada persona necesita el suyo en su máquina).

## 6. Correr el proyecto en local

```bash
npm run dev
```

Abre en http://localhost:3000

## 7. Desplegar a producción

### Forma normal (recomendada)
```bash
git push origin main
```
Firebase App Hosting toma el push y hace el build + deploy solo. Se puede
ver el progreso en [Firebase Console → App Hosting](https://console.firebase.google.com/project/investments-marc/apphosting).

### Forma manual (si hace falta forzar un deploy sin pasar por GitHub)
```bash
firebase apphosting:rollouts:create investmentsmarc-platform --git-branch main
```

### Rollback
Si algo sale mal en producción, desde Firebase Console → App Hosting →
Rollouts, se puede volver al rollout anterior con un clic.

## 8. Ver logs / secrets (opcional)

```bash
firebase apphosting:backends:list        # ver backends y URLs
firebase apphosting:secrets:access NEWS_REFRESH_SECRET   # ver un secret
```
