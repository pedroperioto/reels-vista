# Versão para usar com música do Instagram nos primeiros 90 s:
# a trilha própria fica muda até T0 e entra em fade até T1 (voz e efeitos intactos).
import numpy as np, subprocess, sys
from scipy.io import wavfile
from pathlib import Path
OUT = Path(__file__).parent / 'out'; T0, T1 = float(sys.argv[1]) if len(sys.argv) > 1 else 87.5, float(sys.argv[2]) if len(sys.argv) > 2 else 90.5
rd = lambda p: (lambda r: (r[0], r[1].astype(np.float64) / 32768))(wavfile.read(str(OUT / p)))
SR, V = rd('voz_montada.wav'); _, M = rd('trilha.wav'); _, Sx = rd('efeitos.wav')
n = min(len(V), len(M), len(Sx)); V, M, Sx = V[:n], M[:n], Sx[:n]
env = np.convolve(np.abs(V), np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'); env = np.minimum(1, env / 0.08)
dk = np.zeros_like(env); g = 0.0; att, rel = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.35 * SR))
for k in range(0, n, 64):
    e_ = env[k]; g = att * g + (1 - att) * e_ if e_ > g else rel * g + (1 - rel) * e_; dk[k:k + 64] = g
t = np.arange(n) / SR; mask = np.clip((t - T0) / (T1 - T0), 0, 1) ** 1.5
mix = np.stack([V, V], 1) + M * (0.30 * (1 - 0.6 * dk) * mask)[:, None] + Sx * (0.42 * (1 - 0.3 * dk))[:, None]
mix /= np.max(np.abs(mix)); wavfile.write(str(OUT / 'som_les_bruto.wav'), SR, (mix * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'som_les_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(OUT / 'som_les.wav')], check=True)
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'reels_v13b.mp4'), '-i', str(OUT / 'som_les.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', str(OUT / 'reels_v13b_les.mp4')], check=True)
print('ok', n / SR)
