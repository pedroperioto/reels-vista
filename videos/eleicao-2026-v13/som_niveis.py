# Mix com níveis fixos pedidos pelo Pedro: narração + efeitos em GV, trilha própria em GM (vídeo inteiro, sem ducking)
import numpy as np, subprocess, sys
from scipy.io import wavfile
from pathlib import Path
OUT = Path(__file__).parent / 'out'; GV = float(sys.argv[1]) if len(sys.argv) > 1 else 0.56; GM = float(sys.argv[2]) if len(sys.argv) > 2 else 0.40
rd = lambda p: (lambda r: (r[0], r[1].astype(np.float64) / 32768))(wavfile.read(str(OUT / p)))
SR, V = rd('voz_montada.wav'); _, M = rd('trilha.wav'); _, Sx = rd('efeitos.wav')
n = min(len(V), len(M), len(Sx)); V, M, Sx = V[:n], M[:n], Sx[:n]
mix = (np.stack([V, V], 1) + Sx * 0.42) * GV + M * GM
pk = np.max(np.abs(mix)); mix /= max(pk, 1.0) / 0.89
wavfile.write(str(OUT / 'som_niveis.wav'), SR, (mix * 32767).astype(np.int16))
nm = f'reels_v13b_v{int(GV*100)}_m{int(GM*100)}.mp4'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'reels_v13b.mp4'), '-i', str(OUT / 'som_niveis.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-shortest', str(OUT / nm)], check=True)
print('ok', nm, 'pico', round(pk, 3))
