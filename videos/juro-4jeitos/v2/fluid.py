# fluid.py — teste de fluidez: quadros em 108x192 cinza; diferença média entre quadros seguidos.
# uso: python3 fluid.py <video.mp4 | pasta de quadros> <fps da análise>
import sys, subprocess, numpy as np, glob, os
src, fps = sys.argv[1], float(sys.argv[2])
if os.path.isdir(src): cmd = ['ffmpeg', '-v', 'error', '-framerate', str(fps), '-pattern_type', 'glob', '-i', src + '/f*.jpg', '-vf', 'scale=108:192:flags=area,format=gray', '-f', 'rawvideo', '-']
else: cmd = ['ffmpeg', '-v', 'error', '-i', src, '-vf', f'fps={fps},scale=108:192:flags=area,format=gray', '-f', 'rawvideo', '-']
raw = np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.uint8).reshape(-1, 192, 108).astype(np.float32)
d = np.abs(np.diff(raw, axis=0)).mean(axis=(1, 2)); n = len(d)
LIM, MIN = 0.15 * 30 / fps, 0.3   # limiar equivalente a 0,15 por quadro em 30 fps
still, i = [], 0
while i < n:
    if d[i] < LIM:
        j = i
        while j < n and d[j] < LIM: j += 1
        if (j - i) / fps > MIN: still.append((i / fps, (j - i) / fps))
        i = j
    else: i += 1
JL = 12 * 30 / fps; jumps = []
for i in np.where(d > JL)[0]:
    a = i
    while a > 0 and d[a - 1] > JL / 4: a -= 1
    b = i
    while b < n - 1 and d[b + 1] > JL / 4: b += 1
    jumps.append((i / fps, float(d[i]), (b - a + 1) / fps))
print(f'quadros {n+1} · fps {fps} · diff médio {d.mean():.2f} · mediana {np.median(d):.2f} · limiar parado {LIM:.3f}')
print('TRECHOS PARADOS (>0,3 s):', len(still)); [print(f'  {a:6.2f}s  dura {b:.2f}s') for a, b in still]
iso = [j for j in jumps if j[2] < 6 / 60]
print('PICOS acima do limite de salto:', len(jumps), '· isolados (espalhados por menos de 6 quadros de 60 fps):', len(iso)); [print(f'  {a:6.2f}s diff {v:.1f} espalhado por {w:.2f}s') for a, v, w in iso]
