# encurtar.py — comprime pausas longas da narração (>0,95 s viram 0,55 s) e remapeia os tempos das palavras.
import json, re, subprocess, numpy as np
from pathlib import Path
from scipy.io import wavfile
V = Path(__file__).parent
sr, x = wavfile.read(V / 'bruto.wav'); x = x.astype(np.float64)
out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(V / 'bruto.wav'), '-af', 'silencedetect=n=-35dB:d=0.25', '-f', 'null', '-'], capture_output=True, text=True).stderr
st = [float(a) for a in re.findall(r'silence_start: ([0-9.]+)', out)]; en = [float(a) for a in re.findall(r'silence_end: ([0-9.]+)', out)]
# junta silêncios separados por respiros curtos (< 0,08 s)
segs = []
for a, b in zip(st, en):
    if segs and a - segs[-1][1] < 0.08: segs[-1][1] = b
    else: segs.append([a, b])
KEEP = 0.55; cuts = [(a + KEEP / 2, b - KEEP / 2) for a, b in segs if b - a > 0.95 and a > 0.3]
def mapt(t):
    s = 0.0
    for a, b in cuts:
        if t >= b: s += b - a
        elif t > a: s += t - a
    return t - s
keep = []; last = 0
for a, b in cuts: keep.append(x[int(last * sr):int(a * sr)]); last = b
keep.append(x[int(last * sr):])
fade = int(0.01 * sr); y = keep[0]
for k in keep[1:]:
    r = np.linspace(0, 1, fade); y = np.concatenate([y[:-fade], y[-fade:] * (1 - r) + k[:fade] * r, k[fade:]])
wavfile.write(V / 'voz_curta.wav', sr, y.astype(np.int16))
W = json.load(open(V / 'palavras.json'))
json.dump([[w, round(mapt(a), 3), round(mapt(b), 3)] for w, a, b in W], open(V / 'palavras_curta.json', 'w'), ensure_ascii=False)
print('cortes:', [(round(a, 2), round(b - a, 2)) for a, b in cuts]); print('duração', round(len(x) / sr, 2), '→', round(len(y) / sr, 2))
