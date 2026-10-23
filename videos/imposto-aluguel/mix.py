# mix.py — junta trilha + efeitos (+ voz montada, se existir) com ducking e loudnorm → out/som.wav
import numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
OUT = Path(__file__).parent / 'out'
rd = lambda p: (lambda r: (r[0], r[1].astype(np.float64) / 32768))(wavfile.read(str(p)))
SR, M = rd(OUT / 'trilha.wav'); _, Sx = rd(OUT / 'efeitos.wav'); n = len(M)
V = np.zeros(n)
if (OUT / 'voz_montada.wav').exists():
    _, v = rd(OUT / 'voz_montada.wav'); v = v.mean(1) if v.ndim > 1 else v; V[:min(n, len(v))] = v[:n]
env = np.convolve(np.abs(V), np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'); env = np.minimum(1, env / 0.06)
dk = np.zeros(n); g = 0.0; att, rel = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.3 * SR))
for k in range(0, n, 64):
    e = env[k]; g = att * g + (1 - att) * e if e > g else rel * g + (1 - rel) * e; dk[k:k + 64] = g
mus_g = 0.55 if V.any() else 0.8
mix = np.stack([V, V], 1) * 1.0 + M * (mus_g * (1 - 0.55 * dk))[:, None] + Sx * (0.45 * (1 - 0.25 * dk))[:, None]
mix /= np.max(np.abs(mix)); wavfile.write(str(OUT / 'som_bruto.wav'), SR, (mix * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(OUT / 'som.wav')], check=True)
print('mix ok', 'com voz' if V.any() else 'sem voz')
