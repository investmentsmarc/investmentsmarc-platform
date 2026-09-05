# -*- coding: utf-8 -*-
"""Monta los fotogramas en MP4, respetando el tiempo real de cada uno.

El screencast solo emite cuando la pantalla cambia, asi que los fotogramas NO
estan repartidos de forma regular: hay rafagas durante una transicion y huecos
largos mientras nada se mueve. Encodear a una tasa fija aceleraria las pausas y
convertiria un clic tranquilo en un parpadeo. Por eso cada fotograma lleva su
duracion real y se usa el demuxer `concat`, que la respeta.
"""
import json
import os
import subprocess
import sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
CLIPS = os.path.join(RAIZ, "clips")
DESTINO = r"C:\imsite\public\video"

ANCHO_SALIDA = 1280
CRF = "30"
MIN_DUR = 0.04          # 25 fps de tope: por debajo, ffmpeg descarta
MAX_DUR = 1.60          # una pausa larga no debe congelar el clip


def montar(clip: str) -> bool:
    d = os.path.join(CLIPS, clip)
    tj = os.path.join(d, "tiempos.json")
    if not os.path.isfile(tj):
        print("%-16s sin tiempos.json" % clip)
        return False
    tiempos = json.load(open(tj))
    fotos = sorted(f for f in os.listdir(d) if f.endswith(".jpg"))
    if len(fotos) < 6:
        print("%-16s solo %d fotogramas, no da para un clip" % (clip, len(fotos)))
        return False
    n = min(len(fotos), len(tiempos))

    lista = os.path.join(d, "lista.txt")
    with open(lista, "w", encoding="utf-8") as fh:
        for i in range(n):
            if i < n - 1:
                dur = (tiempos[i + 1] - tiempos[i]) / 1000.0
            else:
                dur = 0.6
            dur = max(MIN_DUR, min(MAX_DUR, dur))
            fh.write("file '%s'\n" % fotos[i].replace("'", "'\\''"))
            fh.write("duration %.3f\n" % dur)
        # el demuxer concat ignora la duracion del ultimo si no se repite
        fh.write("file '%s'\n" % fotos[n - 1])

    os.makedirs(DESTINO, exist_ok=True)
    mp4 = os.path.join(DESTINO, "ft-%s.mp4" % clip)
    cmd = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-f", "concat", "-safe", "0", "-i", "lista.txt",
        "-vf", "scale=%d:-2:flags=lanczos,format=yuv420p" % ANCHO_SALIDA,
        "-r", "25", "-c:v", "libx264", "-preset", "slow", "-crf", CRF,
        "-movflags", "+faststart", "-an", mp4,
    ]
    r = subprocess.run(cmd, cwd=d, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode != 0:
        print("%-16s ffmpeg fallo: %s" % (clip, (r.stderr or "")[:160]))
        return False

    # Poster: un fotograma avanzado, ya con la interaccion hecha, para que el
    # video no arranque en una pantalla a medio cargar cuando no autoreproduce.
    poster = os.path.join(DESTINO, "ft-%s.jpg" % clip)
    src = os.path.join(d, fotos[int(n * 0.75)])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src,
                    "-vf", "scale=%d:-2:flags=lanczos" % ANCHO_SALIDA,
                    "-q:v", "4", poster], capture_output=True)

    dur_total = tiempos[n - 1] / 1000.0
    print("%-16s %3d fotogramas · %.1fs · mp4 %.0f KB · poster %.0f KB" % (
        clip, n, dur_total,
        os.path.getsize(mp4) / 1024.0,
        os.path.getsize(poster) / 1024.0 if os.path.isfile(poster) else 0))
    return True


def main() -> int:
    if not os.path.isdir(CLIPS):
        print("no hay %s — baja los fotogramas primero" % CLIPS)
        return 1
    ok = 0
    for clip in sorted(os.listdir(CLIPS)):
        if os.path.isdir(os.path.join(CLIPS, clip)) and montar(clip):
            ok += 1
    print("montados %d clips en %s" % (ok, DESTINO))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
