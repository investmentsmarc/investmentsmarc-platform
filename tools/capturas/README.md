# Capturas y clips de FlowTitan

Cómo se generan los `public/video/ft-*.mp4` y los `public/images/ft-*.png` que
salen en la sección FlowTitan PRO de `/about-us`. No son maquetas: son el sistema
real, con clics reales.

## Por qué corre en el VPS y no aquí

El sistema exige sesión y las credenciales viven en `backend/.env` **del VPS**.
El grabador las lee de ahí y nunca pasan por una línea de comando. Un navegador
local tendría que autenticarse, y eso significa manejar una contraseña.

## Los tres pasos

```bash
# 1. grabar (en el VPS, ~3 min) — deja los fotogramas en /tmp/clips
base64 -w0 tools/capturas/grabar.js   # -> pegar en el vps.py run de abajo
python "<repo-flowtitan>/scripts/vps.py" run "echo '<b64>' | base64 -d > /tmp/grabar.js && setsid nohup node /tmp/grabar.js < /dev/null > /tmp/grabar.out 2>&1 &"

# 2. bajar los fotogramas por SFTP (no pasan por stdout: son ~55 MB)
python tools/capturas/bajar.py

# 3. montar los MP4 y dejarlos en public/video/
python tools/capturas/montar.py
```

`bajar.py` reutiliza la conexión de `scripts/vps.py` del repo de FlowTitan; hay
que ajustar la constante `REPO` si el checkout está en otro sitio.

## Trampas ya pagadas

**`page.screenshot()` da 2,4 fps.** Cada llamada fuerza un round-trip de
renderizado (~400 ms en este VPS). El grabador usa `Page.startScreencast` de CDP,
que empuja el fotograma cuando el compositor ya pintó: **12 fps**, y además solo
emite cuando algo cambia. Por eso cada fotograma guarda su marca de tiempo y el
montaje reconstruye su duración real — encodear a tasa fija aceleraría las pausas.

**`page.screencast()` de Puppeteer no sirve aquí**: necesita ffmpeg y el VPS no
lo tiene. El montaje se hace en local, donde sí está.

**Las coordenadas son de un viewport de 1600×1000 exacto.** Salen de una pasada
de reconocimiento. Si se cambia el viewport, los clics caen en el vacío y el clip
queda estático sin que nada avise.

**Chrome no reproduce un vídeo que considera invisible.** Devuelve
`AbortError: video-only background media was paused to save power`. Los clips se
apilan con una transición de opacidad de 0,7 s, así que el que entra sigue
contando como invisible durante ese rato: pedir `play()` al vuelo, o dos
fotogramas después, falla en silencio. `FlowTitanCards.tsx` espera al
`transitionend` y reintenta.

**Grabar fuera de horario de mercado arruina el material.** La toma del
2026-09-05 fue un sábado y salió con el banner *"El mercado está cerrado (…) No
es una señal live"* y una insignia de **certeza BAJA** sobre el GEX — es decir,
anunciando el motor de gamma con un cartel que dice que el dato no es real.
Grabar entre semana, 9:30–16:00 ET.

**La cuenta de captura es la de Marc.** Cualquier pantalla puede mostrar datos
suyos. El grabador aborta el clip si detecta el portafolio o una conversación, y
por eso **TITAN no se captura**: su historial persiste incluso abriendo sesión
nueva. Para publicarla hace falta una cuenta sin historial.
