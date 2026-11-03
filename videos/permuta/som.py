# som.py — áudio completo (v2): falas dos filmes + narração (com espaço para o Gandalf) + efeitos. Sem música (entra pelo app).
# v2: sem o som de fita no "trava" (só uma batida seca), sem PIVOT, whoosh só nas trocas de cena, clique de cadeado e compartilhar.
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
def lock(g=0.5):  # clique metálico do cadeado: duas batidas curtas e brilhantes
    t = np.arange(int(0.14 * SR)) / SR; b, a = ss.butter(2, [2500 / (SR / 2), 9000 / (SR / 2)], 'band')
    n = ss.lfilter(b, a, rng.standard_normal(len(t))).astype(np.float32); n /= np.abs(n).max() + 1e-9
    k1 = n * np.exp(-t * 120); k2 = np.roll(n * np.exp(-t * 90), int(0.045 * SR)); k2[: int(0.045 * SR)] = 0
    return ((k1 * 0.6 + k2) * g + np.sin(2 * np.pi * 420 * t) * np.exp(-t * 40) * 0.25 * g).astype(np.float32)
def chime(g=0.3):  # brilho leve do "vale tentar"
    t = np.arange(int(0.9 * SR)) / SR
    return ((np.sin(2 * np.pi * 1318.5 * t) + 0.6 * np.sin(2 * np.pi * 1975.5 * np.maximum(t - 0.08, 0)) * (t > 0.08)) * np.exp(-t * 5) * g).astype(np.float32)
# falas dos filmes
put(fade(norm(load(H / 'brutos' / 'x_chefao.mp4', 0, C[1] + 0.05)), 0.01, 0.25), 0, 0.8)
put(fade(norm(load(H / 'brutos' / 'x_gandalf.mp4', 0, GAND)), 0.01, 0.25), T['GAND0'], 0.72)
# narração em duas partes (abre espaço para o Gandalf)
v = norm(load(H / 'voz' / 'bruto.wav'), 0.95); cut = int(SPLIT * SR)
put(fade(v[:cut].copy(), 0.005, 0.05), OFF1); put(fade(v[cut:].copy(), 0.05, 0.05), SPLIT + OFF1 + GAND)
# whoosh só onde muda de cena (não nos cortes dentro da mesma cena)
SAME = {5, 8, 14, 15}
for i, c in enumerate(C[1:-1], start=1):
    if i not in SAME: put(whoosh(0.4, 400, 4000, 0.2), c - 0.2)
put(whoosh(0.45, 300, 3500, 0.22), T['END0'] - 0.2)
# efeitos
put(boom(1.4, 0.45), 0.0)
chaves = fade(load(H / 'sfx' / 'chaves.mp3', 0.3, 1.2)); caixa = fade(load(H / 'sfx' / 'caixa.mp3', 0, 1.6)); buz = fade(load(H / 'sfx' / 'buzina.mp3'))
dig = fade(load(H / 'sfx' / 'digitacao.mp3', 0.5, 0.7))
put(boom(1.6, 0.75), M['perm'] - 0.02); put(thump(0.5), M['perm'] - 0.02)          # PERMUTA: um impacto só
put(thump(0.8), M['quinze'] - 0.03); put(boom(1.0, 0.4), M['quinze'] - 0.03)      # 15%: um impacto só
for k in ('vender', 'comprar'): put(pop(0.3), M[k])
put(pop(0.25), M['quem'] + 0.1); put(pop(0.25), M['depende'] - 0.15)
put(lock(0.55), M['banco'] + 0.24)
for k in ('brad', 'itau', 'sant'): put(tick(0.35), M[k])
put(thump(0.65), M['subiram'])
put(norm(caixa, 0.7), M['cinco'] + 0.4, 0.5)
put(thump(0.85), M['trava'] - 0.02)                                                 # trava: batida seca, sem fita
put(norm(buz, 0.6), M['carro'] - 0.05, 0.4)
put(pop(0.35), M['entrada'] - 0.05)
put(chaves, M['entra'] + 0.1, 0.35)
put(chime(0.28), M['vale'] + 0.05)
for k in ('aval', 'doc', 'contr'): put(pop(0.35), M[k] + 0.1)
put(chaves, M['chave'] - 0.1, 0.3)
for k in ('compra2', 'venda', 'perm2', 'loc', 'resid'): put(tick(0.25), M[k])
put(norm(dig, 0.5), M['kw'] - 0.1, 0.5); put(pop(0.4), M['direct'] + 0.45)
put(whoosh(0.35, 600, 3000, 0.16), M['emanda'] - 0.1); put(pop(0.35), M['amigo'] + 0.05)
put(pop(0.45), T['END0'] + 1.42)
mix = mix[: int(SR * DUR)]
mix /= max(1.0, np.abs(mix).max() / 0.95)
wf.write(H / 'assets' / 'som.wav', SR, (mix * 32767).astype(np.int16)); print('som ok', DUR)
