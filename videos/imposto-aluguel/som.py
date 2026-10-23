# som.py — trilha estilo lançamento SaaS a 120 BPM (28 compassos) + efeitos nas batidas da animação
# Gera out/trilha.wav e out/efeitos.wav (48 kHz, estéreo). A mistura com a voz fica em mix.py.
import numpy as np, glob
from pathlib import Path
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly, fftconvolve
HERE = Path(__file__).parent; OUT = HERE / 'out'; OUT.mkdir(exist_ok=True); LIB = HERE.parent.parent / 'lib' / 'sfx'
SR = 48000; BEAT = 0.5; BAR = 2.0; NB = 28; DUR = NB * BAR; N = int(SR * (DUR + 1.5))
rng = np.random.default_rng(5)
def tt(s): return np.arange(int(SR * s)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lp', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'hp', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
def nf(m): return 440 * 2 ** ((m - 69) / 12)
def put(buf, t, x, g=1.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    m = min(len(x), len(buf) - i)
    if m > 0: buf[i:i + m] += x[:m] * g
def load(p):
    sr, x = wavfile.read(p); x = x.astype(np.float64); x = x.mean(1) if x.ndim > 1 else x; x /= (np.max(np.abs(x)) + 1e-9)
    return resample_poly(x, 160, 147) if sr == 44100 else x
SEC = dict(abertura=(0, 2), problema=(2, 6), paradigma=(6, 10), quebra=(10, 14), f1=(14, 16.5), f2=(16.5, 19), f3=(19, 21.5), f4=(21.5, 24), cta=(24, 28))
S = {k: (a * BAR, b * BAR) for k, (a, b) in SEC.items()}
def A(sec, beats=0.0): return S[sec][0] + beats * BEAT

# ---------------- instrumentos ----------------
def kick():
    d = tt(0.45); f = 48 + 110 * np.exp(-d / 0.045); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d / 0.16)
    y[:int(0.004 * SR)] += rng.standard_normal(int(0.004 * SR)) * 0.5; return np.tanh(y * 1.6) * 0.9
def clap():
    d = tt(0.32); n = rng.standard_normal(len(d)); env = np.zeros(len(d))
    for k, o in enumerate((0, 0.011, 0.022)): i = int(o * SR); env[i:] += np.exp(-(d[:len(d) - i]) / (0.012 if k < 2 else 0.11))
    return bp(n * env, 900, 5200) * 0.8
def hat(open_=False):
    d = tt(0.22 if open_ else 0.06); return hp(rng.standard_normal(len(d)), 7000) * np.exp(-d / (0.07 if open_ else 0.015)) * 0.5
def pluck(f, s=0.45, bright=1.0):
    d = tt(s); y = np.zeros(len(d))
    for h, a in ((1, 1), (2, 0.45 * bright), (3, 0.22 * bright), (4, 0.12 * bright), (6, 0.05 * bright)): y += a * np.sin(2 * np.pi * f * h * d) * np.exp(-d * (5 + h * 3))
    y[:150] *= np.linspace(0, 1, 150); return y * 0.5
def pad(freqs, s):
    d = tt(s); y = np.zeros(len(d))
    for f in freqs:
        for det in (-0.12, 0.12): ph = 2 * np.pi * f * (1 + det / 100) * d; y += (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.5
    y = lp(y, 1800); a = int(0.25 * SR); env = np.ones(len(d)); env[:a] = np.linspace(0, 1, a); env[-a:] = np.linspace(1, 0, a); return y * env / len(freqs) * 0.6
def bass(f, s):
    d = tt(s); y = np.sin(2 * np.pi * f * d) + 0.3 * np.sin(2 * np.pi * 2 * f * d); env = np.minimum(1, d / 0.01) * np.exp(-d / 0.5); return np.tanh(y * env * 1.4) * 0.55
def riser(s):
    d = tt(s); f = np.geomspace(300, 5000, len(d)); n = rng.standard_normal(len(d)); y = np.zeros(len(d)); seg = 2048
    for i in range(0, len(d), seg): c = f[min(i, len(d) - 1)]; y[i:i + seg] = bp(n[i:i + seg], c * 0.7, min(c * 1.4, SR / 2 - 100))
    return y * np.linspace(0, 1, len(d)) ** 2 * 0.35
def impact():
    d = tt(1.6); sub = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-d / 0.08)) / SR) * np.exp(-d / 0.5)
    nz = lp(rng.standard_normal(len(d)), 2500) * np.exp(-d / 0.25) * 0.5; return np.tanh((sub + nz) * 1.5) * 0.8

# acordes (1 por compasso): Am9 · Fmaj7 · C(add9) · G6
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67]]
BS = [45, 41, 36, 43]

mus = np.zeros(N); drums = np.zeros(N)
K, CL, HC, HO = kick(), clap(), hat(), hat(True)
for b in range(NB):
    t0 = b * BAR; ch = CH[b % 4]; sec = next(k for k, (a, z) in S.items() if a <= t0 < z)
    full = sec in ('quebra', 'f1', 'f2', 'f3', 'f4', 'cta'); dark = sec in ('problema', 'paradigma')
    # pad sempre (filtrado na abertura)
    p = pad([nf(m) for m in ch[:4]], BAR + 0.3); put(mus, t0, lp(p, 900) if sec == 'abertura' else p, 0.55 if not dark else 0.4)
    # arpejo pluck em colcheias (16 por compasso? não: 8 colcheias)
    if sec != 'abertura' or b == 1:
        for i in range(8):
            m = ch[[0, 2, 4, 2, 1, 3, 4, 3][i]] + 12; put(mus, t0 + i * BEAT / 2, pluck(nf(m), 0.4, 1.2 if full else 0.6), 0.32 if full else 0.22)
    # baixo
    if sec not in ('abertura',):
        for i in range(4 if full else 2): put(mus, t0 + i * (BEAT if full else BAR / 2), bass(nf(BS[b % 4]), 0.45 if full else 0.9), 0.7)
    # bateria
    if sec == 'abertura' and b == 1:
        for i in range(4): put(drums, t0 + 2 * BEAT + i * BEAT / 4 * (1 if i < 3 else 1), K * (0.5 + i * 0.15), 0.6)
    if sec in ('problema', 'paradigma'):
        for i in range(4): put(drums, t0 + i * BEAT, K, 0.8 if i in (0, 2) else 0.0)
        for i in range(8): put(drums, t0 + i * BEAT / 2, HC, 0.25 if i % 2 else 0.12)
        if sec == 'paradigma': put(drums, t0 + BEAT, CL, 0.5); put(drums, t0 + 3 * BEAT, CL, 0.5)
    if full:
        last_cta = sec == 'cta' and b >= 26
        for i in range(4): put(drums, t0 + i * BEAT, K, 0.0 if last_cta and b == 27 and i > 1 else 0.95)
        put(drums, t0 + BEAT, CL, 0.65); put(drums, t0 + 3 * BEAT, CL, 0.65)
        for i in range(8): put(drums, t0 + i * BEAT / 2, HO if i % 2 else HC, 0.22 if i % 2 else 0.14)
# acorde final sustentado
put(mus, DUR - 2.0, pad([nf(m) for m in CH[0][:4]], 3.0), 0.6)

# ---------------- efeitos ----------------
sfx = np.zeros(N)
def pop(f=900, s=0.09): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(f, f * 0.55, len(d))) / SR) * np.exp(-d / 0.03)
def tick(f=2600): d = tt(0.03); y = bp(rng.standard_normal(len(d)), f * 0.7, f * 1.3) * np.exp(-d / 0.006); return y / (np.max(np.abs(y)) + 1e-9)
def click(): y = pop(1600, 0.06) * 0.5; a = tick(3800); y[:len(a)] += a * 0.8; return y
def chime(ok=True):
    x = np.zeros(int(SR * 1.2)); notes = (76, 83, 88) if ok else (64, 63)
    for k, m in enumerate(notes): p = pluck(nf(m), 1.0, 0.8); i = int(k * 0.09 * SR); x[i:i + len(p)] += p[:len(x) - i]
    return x * (1 if ok else 0.8)
def buzz(): d = tt(0.35); y = np.sign(np.sin(2 * np.pi * 110 * d)) * np.exp(-d / 0.12); return lp(y, 1500) * 0.5
def swoosh(i): return WS[i % len(WS)]
WS = [load(f) for f in sorted(glob.glob(str(LIB / 'wooshes' / '*.wav')))]
KEYS = [load(f) for f in sorted(glob.glob(str(LIB / 'keyboard' / '*.wav')))[:12]]
RC = load(LIB / 'reverse_cymbals.wav')

# transições entre seções: riser antes + impacto/whoosh na virada
for k, (a, z) in S.items():
    if a == 0: continue
    put(sfx, a - 0.05, swoosh(int(a)), 0.5)
    if k in ('problema', 'quebra', 'cta'): put(sfx, a, impact(), 0.75)
    else: put(sfx, a, pop(500, 0.12), 0.35)
put(sfx, S['quebra'][0] - len(RC) / SR, RC, 0.55); put(sfx, S['quebra'][0] - 3.0, riser(3.0), 0.5)
put(sfx, S['problema'][0] - 1.5, riser(1.5), 0.35); put(sfx, S['cta'][0] - 2.0, riser(2.0), 0.4)
# abertura
put(sfx, 0.0, pop(1200, 0.12), 0.5); put(sfx, A('abertura', 1), swoosh(1), 0.35); put(sfx, A('abertura', 2), click(), 0.4)
put(sfx, A('abertura', 3), pop(700), 0.55); put(sfx, A('abertura', 3) + 0.12, pop(820), 0.55)
put(sfx, A('abertura', 4), swoosh(3), 0.35); put(sfx, A('abertura', 6), chime(True), 0.35)
# problema: notificações
for i in range(4): put(sfx, A('problema', 1 + 2 * i), pop(1500, 0.08), 0.5); put(sfx, A('problema', 1 + 2 * i) + 0.06, pop(1900, 0.06), 0.35)
for i in range(8, 16): put(sfx, A('problema', i), tick(1800 + 300 * (i % 3)), 0.25)
put(sfx, A('problema', 14), buzz(), 0.35)
# paradigma: equação e casas ficando vermelhas
for i in range(3): put(sfx, A('paradigma', i) + (0.1 if i == 0 else 0), pop(700 + 150 * i), 0.45)
for i in range(6): put(sfx, A('paradigma', 4 + i), pop(420, 0.1), 0.45)
put(sfx, A('paradigma', 12), impact(), 0.45); put(sfx, A('paradigma', 13.5), click(), 0.5)
# quebra: linhas da regra
for b_ in (3, 5, 8): put(sfx, A('quebra', b_), swoosh(b_), 0.3); put(sfx, A('quebra', b_), pop(900), 0.3)
for b_ in (4, 7): put(sfx, A('quebra', b_), pop(1300, 0.08), 0.5)
put(sfx, A('quebra', 11), chime(True), 0.4)
# f1: digitação, clique, erro
for k, (t0, n, d) in enumerate(((A('f1', 1), 1, 0.15), (A('f1', 2), 10, 0.8))):
    for j in range(n): put(sfx, t0 + j * d / n, KEYS[(j + k) % len(KEYS)], 0.35)
put(sfx, A('f1', 6), click(), 0.6); put(sfx, A('f1', 6) + 0.25, buzz(), 0.45)
# f2: digitação, clique, sucesso
for k, (t0, n, d) in enumerate(((A('f2', 1), 1, 0.15), (A('f2', 2), 9, 0.6))):
    for j in range(n): put(sfx, t0 + j * d / n, KEYS[(j + 3 + k) % len(KEYS)], 0.35)
put(sfx, A('f2', 5), click(), 0.6); put(sfx, A('f2', 5) + 0.25, chime(True), 0.6)
# f3: barras subindo
for i in range(3): put(sfx, A('f3', 1 + i), swoosh(i + 2), 0.25); put(sfx, A('f3', 2 + i) + 0.3, pop(1000 + 200 * i), 0.4)
put(sfx, A('f3', 6), chime(True), 0.4)
# f4: checks
for i in range(3): put(sfx, A('f4', 1 + 2 * i) + 0.15, pop(1200 + 150 * i, 0.1), 0.5); put(sfx, A('f4', 1 + 2 * i) + 0.25, tick(3000), 0.3)
# cta: digitação "IMPOSTO", enviar, curtida, direct, cartão final
for j in range(7): put(sfx, A('cta', 3) + j * (3.5 * BEAT) / 7, KEYS[j % len(KEYS)], 0.4)
put(sfx, A('cta', 6.5), click(), 0.6); put(sfx, A('cta', 7), pop(1100), 0.5); put(sfx, A('cta', 8), pop(1600, 0.08), 0.45)
put(sfx, A('cta', 8.5), chime(True), 0.45); put(sfx, A('cta', 10), impact(), 0.55)

# ---------------- saída ----------------
def room(x, mix, dec=0.5):
    n = int(SR * dec * 2.5); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / dec); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum()); return x + fftconvolve(x, ir)[:len(x)] * mix
mus = room(hp(mus, 35), 0.25, 0.9); M = mus + drums * 0.9
n = int(SR * DUR); M = M[:n]; sfx = room(sfx, 0.12, 0.4)[:n]
fo = int(1.5 * SR); M[-fo:] *= np.linspace(1, 0, fo) ** 1.5
def st(x, d_ms=10): d = int(SR * d_ms / 1000); r = np.r_[np.zeros(d), x[:-d]]; return np.stack([x * 0.9 + r * 0.1, x * 0.75 + r * 0.25], 1)
Mo = st(M); Sx = np.stack([sfx, sfx], 1)
Mo /= np.max(np.abs(Mo)); Sx /= np.max(np.abs(Sx))
wavfile.write(str(OUT / 'trilha.wav'), SR, (Mo * 0.89 * 32767).astype(np.int16)); wavfile.write(str(OUT / 'efeitos.wav'), SR, (Sx * 0.89 * 32767).astype(np.int16))
print('ok', DUR)
