# Mix com faixa externa (no lugar da trilha própria): narração + efeitos em GV, faixa em GM, fade-out no fim
# uso: python3 som_faixa.py <faixa.wav 48k estéreo> <saida.mp4> [GV] [GM] [inicio_na_faixa_s]
import numpy as np, subprocess, sys
from scipy.io import wavfile
from pathlib import Path
OUT = Path(__file__).parent / 'out'; FX, NM = sys.argv[1], sys.argv[2]
GV = float(sys.argv[3]) if len(sys.argv) > 3 else 0.56; GM = float(sys.argv[4]) if len(sys.argv) > 4 else 0.40; OFF = float(sys.argv[5]) if len(sys.argv) > 5 else 0
rd = lambda p: (lambda r: (r[0], r[1].astype(np.float64) / 32768))(wavfile.read(str(p)))
SR, V = rd(OUT / 'voz_montada.wav'); _, Sx = rd(OUT / 'efeitos.wav'); sr2, M = rd(FX); assert sr2 == SR
n = min(len(V), len(Sx)); V, Sx = V[:n], Sx[:n]; M = M[int(OFF * SR):]
if M.ndim == 1: M = np.stack([M, M], 1)
while len(M) < n: M = np.concatenate([M, M])  # (não usado se a faixa for longa)
M = M[:n].copy(); M /= np.max(np.abs(M)) / 0.89
fi, fo = int(0.3 * SR), int(2.5 * SR); M[:fi] *= np.linspace(0, 1, fi)[:, None]; M[-fo:] *= (np.linspace(1, 0, fo) ** 1.5)[:, None]
mix = (np.stack([V, V], 1) + Sx * 0.42) * GV + M * GM
pk = np.max(np.abs(mix)); mix /= max(pk, 1.0) / 0.89
wavfile.write(str(OUT / 'som_faixa.wav'), SR, (mix * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'reels_v13b.mp4'), '-i', str(OUT / 'som_faixa.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', str(OUT / NM)], check=True)
print('ok', NM, round(pk, 3))
