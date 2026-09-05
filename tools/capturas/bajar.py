# -*- coding: utf-8 -*-
"""Baja los fotogramas del VPS por SFTP.

No pasan por la salida del comando a proposito: son megabytes de binario y
volcarlos por stdout llenaria el contexto sin aportar nada. Reutiliza la
conexion de `vps.py`, que ya autentica por clave; aqui no hay credencial.
"""
import os
import sys

RAIZ = os.path.dirname(os.path.abspath(__file__))
REPO = r"D:\Personal\Desarrollo\FlowTitan (ThetaData)\.claude\worktrees\optimistic-chaum-a95095"
sys.path.insert(0, os.path.join(REPO, "scripts"))

import vps  # noqa: E402  (necesita el sys.path de arriba)

REMOTO = "/tmp/clips"
LOCAL = os.path.join(RAIZ, "clips")


def main() -> int:
    cliente = vps.get_ssh_client()
    try:
        sftp = cliente.open_sftp()
        try:
            try:
                clips = sorted(sftp.listdir(REMOTO))
            except IOError:
                print("no existe %s en el VPS" % REMOTO)
                return 1

            total_bytes = 0
            for clip in clips:
                rdir = REMOTO + "/" + clip
                try:
                    ficheros = sorted(sftp.listdir(rdir))
                except IOError:
                    continue  # no es un directorio
                ldir = os.path.join(LOCAL, clip)
                os.makedirs(ldir, exist_ok=True)
                n = 0
                for f in ficheros:
                    destino = os.path.join(ldir, f)
                    sftp.get(rdir + "/" + f, destino)
                    total_bytes += os.path.getsize(destino)
                    n += 1
                print("%-16s %4d ficheros" % (clip, n))
            print("total %.1f MB en %s" % (total_bytes / 1048576.0, LOCAL))
            return 0
        finally:
            sftp.close()
    finally:
        cliente.close()


if __name__ == "__main__":
    raise SystemExit(main())
