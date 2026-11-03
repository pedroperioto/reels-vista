# som.py — áudio da prévia: fala do Poderoso Chefão + narração + efeitos (sem música: ela entra pelo app)
import json, numpy as np, subprocess, scipy.io.wavfile as wf
from pathlib import Path
H = Path(__file__).parent; SR = 48000; DUR = 18.0; OFF = 4.2
M = json.load(open(H / 'marcas.json'))
def load(path, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + (['-t', str(t)] if t else []) + ['-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()
mix = np.zeros(int(SR * DUR), np.float32)
def put(x, t, g=1.0):
    i = int(t * SR); x = x[: max(0, len(mix) - i)]; mix[i:i + len(x)] += x * g
def fade(x, a=0.02, b=0.08):
    n1, n2 = int(a * SR), int(b * SR); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x
rng = np.random.default_rng(3)
def whoosh(d=0.5, f0=300, f1=3000, g=0.5):
    n = int(d * SR); noise = rng.standard_normal(n).astype(np.float32); out = np.zeros(n, np.float32)
    # varredura de passa-faixa simples por blocos
    import scipy.signal as ss
    k = 16; seg = n // k
    for j in range(k):
        f = f0 * (f1 / f0) ** (j / (k - 1)); b, a = ss.butter(2, [f * 0.6 / (SR / 2), min(f * 1.6, SR / 2 - 100) / (SR / 2)], 'band')
        out[j * seg:(j + 1) * seg] = ss.lfilter(b, a, noise[j * seg:(j + 1) * seg])
    env = np.sin(np.linspace(0, np.pi, n)) ** 2; return out * env * g / (np.abs(out).max() + 1e-9)
def boom(d=1.2, g=0.9):
    t = np.arange(int(d * SR)) / SR; f = 55 * np.exp(-t * 2.5) + 30
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) * g).astype(np.float32)
def thump(g=0.8):
    t = np.arange(int(0.35 * SR)) / SR; return (np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) * g + rng.standard_normal(len(t)) * np.exp(-t * 60) * 0.25 * g).astype(np.float32)
# fala do filme
gf = fade(load(H.parent / 'brutos' / 'rec1.mp4', 55.2, OFF), 0.01, 0.25); put(gf / (np.abs(gf).max() + 1e-9), 0, 0.85)
# narração
v = load(H.parent / 'voz' / 'bruto.wav'); put(v / (np.abs(v).max() + 1e-9), OFF, 0.95)
# efeitos
put(boom(1.4, 0.55), 0.0)                                   # impacto no 1º quadro, com a pergunta
put(whoosh(0.45, 400, 4000, 0.35), OFF - 0.25)              # corte para as chaves
ch = fade(load(H.parent / 'sfx' / 'chaves.mp3', 0.3, 1.2)); put(ch, M['troc'] + 0.1, 0.35)
put(whoosh(0.4, 300, 3000, 0.3), M['da'] - 0.25)
put(boom(1.6, 0.85), M['perm'] - 0.02); put(thump(0.6), M['perm'] - 0.02)
put(thump(0.9), M['quinze'] - 0.03); put(boom(1.0, 0.5), M['quinze'] - 0.03)
put(whoosh(0.5, 500, 5000, 0.3), M['fica'] - 0.3)
mix /= max(1.0, np.abs(mix).max() / 0.95)
wf.write(H / 'som.wav', SR, (mix * 32767).astype(np.int16)); print('som ok')
