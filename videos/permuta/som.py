# som.py — áudio completo: falas dos filmes + narração (com espaço para o Gandalf) + efeitos. Sem música (entra pelo app).
import json, numpy as np, subprocess, scipy.io.wavfile as wf, scipy.signal as ss
from pathlib import Path
H = Path(__file__).parent; SR = 48000
TP = json.load(open(H / 'voz' / 'tempos.json')); M, T, C = TP['M'], TP['T'], TP['C']
P = json.load(open(H / 'voz' / 'planos.json'))
DUR = T['END']; OFF1, GAND, SPLIT = P['OFF1'], P['GAND'], P['SPLIT']
def load(path, ss_=None, t=None):
    cmd = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss_)] if ss_ is not None else []) + (['-t', str(t)] if t else []) + ['-i', str(path), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).copy()
mix = np.zeros(int(SR * (DUR + 0.5)), np.float32)
def put(x, t, g=1.0):
    i = int(t * SR); x = x[: max(0, len(mix) - i)]; mix[i:i + len(x)] += x * g
def fade(x, a=0.02, b=0.08):
    n1, n2 = int(a * SR), int(b * SR); x[:n1] *= np.linspace(0, 1, n1); x[-n2:] *= np.linspace(1, 0, n2); return x
def norm(x, peak=0.9): return x * (peak / (np.abs(x).max() + 1e-9))
rng = np.random.default_rng(3)
def whoosh(d=0.45, f0=300, f1=3500, g=0.3):
    n = int(d * SR); noise = rng.standard_normal(n).astype(np.float32); out = np.zeros(n, np.float32); k = 16; sg = n // k
    for j in range(k):
        f = f0 * (f1 / f0) ** (j / (k - 1)); b, a = ss.butter(2, [f * 0.6 / (SR / 2), min(f * 1.6, SR / 2 - 100) / (SR / 2)], 'band')
        out[j * sg:(j + 1) * sg] = ss.lfilter(b, a, noise[j * sg:(j + 1) * sg])
    return out * np.sin(np.linspace(0, np.pi, n)) ** 2 * g / (np.abs(out).max() + 1e-9)
def boom(d=1.2, g=0.8):
    t = np.arange(int(d * SR)) / SR; f = 55 * np.exp(-t * 2.5) + 30
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 3.2) * g).astype(np.float32)
def thump(g=0.8):
    t = np.arange(int(0.35 * SR)) / SR; return (np.sin(2 * np.pi * 70 * t) * np.exp(-t * 14) * g + rng.standard_normal(len(t)) * np.exp(-t * 60) * 0.25 * g).astype(np.float32)
def tick(g=0.3):
    t = np.arange(int(0.06 * SR)) / SR; return (np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 90) * g).astype(np.float32)
def pop(g=0.35):
    t = np.arange(int(0.12 * SR)) / SR; f = 900 + 900 * t / 0.12; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 35) * g).astype(np.float32)
def down(d=0.9, g=0.45):  # "trava": tom caindo, como fita parando
    t = np.arange(int(d * SR)) / SR; f = 420 * (1 - t / d) ** 2 + 40
    return (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 * np.exp(-t * 1.5) * g).astype(np.float32)
# falas dos filmes
put(fade(norm(load(H / 'brutos' / 'n_chefao.mp4', 6.6, OFF1)), 0.01, 0.2), 0, 0.8)
put(fade(norm(load(H / 'brutos' / 'n_v72.mp4', 2.5, GAND)), 0.01, 0.25), T['GAND0'], 0.85)
put(fade(norm(load(H / 'brutos' / 'n_v102.mp4', 7.9, T['PIV1'] - T['PIV0'])), 0.01, 0.2), T['PIV0'], 0.85)
# narração em duas partes (abre espaço para o Gandalf)
v = norm(load(H / 'voz' / 'bruto.wav'), 0.95); cut = int(SPLIT * SR)
put(fade(v[:cut].copy(), 0.005, 0.05), OFF1); put(fade(v[cut:].copy(), 0.05, 0.05), SPLIT + OFF1 + GAND)
# efeitos
put(boom(1.4, 0.5), 0.0)
for c in C[1:-1]: put(whoosh(0.4, 400, 4000, 0.22), c - 0.2)
chaves = fade(load(H / 'sfx' / 'chaves.mp3', 0.3, 1.2)); caixa = fade(load(H / 'sfx' / 'caixa.mp3', 0, 1.6)); buz = fade(load(H / 'sfx' / 'buzina.mp3'))
dig = fade(load(H / 'sfx' / 'digitacao.mp3', 0.5, 0.7))
put(boom(1.6, 0.8), M['perm'] - 0.02); put(thump(0.55), M['perm'] - 0.02)
put(thump(0.85), M['quinze'] - 0.03); put(boom(1.0, 0.45), M['quinze'] - 0.03)
for k in ('vender', 'comprar'): put(pop(0.3), M[k])
put(thump(0.6), M['banco'] - 0.05)
for k in ('brad', 'itau', 'sant'): put(tick(0.35), M[k])
put(thump(0.7), M['subiram'])
put(norm(caixa, 0.7), M['cinco'] + 0.4, 0.5)
put(down(0.9, 0.35), M['trava'] - 0.05); put(thump(0.6), M['trava'] - 0.05)
put(norm(buz, 0.6), M['carro'] - 0.05, 0.45)
put(chaves, M['entra'] + 0.1, 0.35)
for k in ('aval', 'doc', 'contr'): put(pop(0.35), M[k] + 0.1)
put(chaves, M['chave'] - 0.1, 0.3)
for k in ('compra2', 'venda', 'perm2', 'loc', 'resid'): put(tick(0.25), M[k])
put(norm(dig, 0.5), M['kw'] - 0.1, 0.5); put(pop(0.4), M['direct'] + 0.45)
put(pop(0.4), T['PIV1'] + 1.35)
mix = mix[: int(SR * DUR)]
mix /= max(1.0, np.abs(mix).max() / 0.95)
wf.write(H / 'assets' / 'som.wav', SR, (mix * 32767).astype(np.int16)); print('som ok', DUR)
