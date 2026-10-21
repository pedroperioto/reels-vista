# Parte 1 (v2) — trilha séria (cordas/piano sintetizados, sem trap) + efeitos sincronizados com a animação
import subprocess, json, os, numpy as np
from pathlib import Path
HERE = Path(__file__).resolve().parent; LIB = HERE.parents[1] / 'lib' / 'sfx'; OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000
TM = json.load(open(HERE / 'timing.json'))['timing']
S = {s['cena']: s for s in TM}; DUR = TM[-1]['fim']; N = int(SR * (DUR + 2))
def A(sc): return S[sc]['inicio'] if sc in S else float('nan')
def Wd(sc, i):
    # índice de palavra da fala ORIGINAL da cena → tempo na v10 (NaN se a cena/trecho não existe)
    if sc not in S: return float('nan')
    v = S[sc]['antigas'][i] if i < len(S[sc]['antigas']) else None; return float('nan') if v is None else v
def U(sc, x):
    if sc not in S: return float('nan')
    P = S[sc]['warp']
    for k in range(1, len(P)):
        if P[k - 1][1] <= x <= P[k][1] and P[k][0] - P[k - 1][0] < 5 and (P[k][1] - P[k - 1][1]) < 20 * (P[k][0] - P[k - 1][0]) + 0.5:
            f = (x - P[k - 1][1]) / ((P[k][1] - P[k - 1][1]) or 1); return A(sc) + P[k - 1][0] + f * (P[k][0] - P[k - 1][0])
    return float('nan')
def Wn(sc, i): return S[sc]['palavras'][i] if sc in S else float('nan')
def D(sc): return (S[sc]['fim'] - S[sc]['inicio']) if sc in S else float('nan')
WO = str(LIB / 'wooshes') + '/'; K = str(LIB) + '/'
REVC = str(LIB / 'reverse_cymbals.wav')
SW = [WO + f for f in ('Swish 2.wav', 'Gentle Swish.wav', 'Swish 3.wav', 'Classic Swish 3.wav', 'Swish 6.wav', 'Swish 4.wav', 'Swish 1.wav')]
rng = np.random.default_rng(5); cache = {}
def load(p):
    if p not in cache:
        raw = subprocess.run(['ffmpeg', '-loglevel', 'error', '-i', p, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
        x = np.frombuffer(raw, np.float32).astype(np.float64); cache[p] = x / (np.max(np.abs(x)) + 1e-9)
    return cache[p]
def put(buf, t, x, g=1.0):
    if t != t: return
    x = load(x) if isinstance(x, str) else x; i = int(max(0, t) * SR); n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
def put_end(buf, t_end, x, g=1.0): x = load(x) if isinstance(x, str) else x; put(buf, t_end - len(x) / SR, x, g)
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lp', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'hp', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
def tt(s): return np.arange(int(SR * s)) / SR
def note(m): return 440 * 2 ** ((m - 69) / 12)
def saw(f, s, det=(-6, 0, 6)):
    t = tt(s); y = 0
    for c in det: ff = f * 2 ** (c / 1200); y = y + 2 * ((t * ff + rng.random()) % 1) - 1
    return y / len(det)
def adsr(n, a, d, sl, r):
    e = np.ones(n) * sl; ia, idd, ir = int(a * SR), int(d * SR), int(r * SR); e[:ia] = np.linspace(0, 1, ia); e[ia:ia + idd] = np.linspace(1, sl, len(e[ia:ia + idd])); e[n - ir:] *= np.linspace(1, 0, ir); return e
def piano(f, s=2.2):  # piano elétrico macio
    t = tt(s); y = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d) for r, a, d in ((1, 1, 1.1), (2, 0.35, 0.5), (3, 0.12, 0.25), (4.01, 0.06, 0.12)))
    y[:240] *= np.linspace(0, 1, 240); return y
def pluck(f, s=1.0): y = sum(np.sin(2 * np.pi * f * r * tt(s)) * a * np.exp(-tt(s) / d) for r, a, d in ((1, 1, 0.45), (4, 0.25, 0.08), (10, 0.06, 0.03))); y[:120] *= np.linspace(0, 1, 120); return y
def bell(f, s=1.2, d=0.45): return sum(np.sin(2 * np.pi * f * r * tt(s)) * np.exp(-tt(s) / (d / (1 + k * 0.6))) * a for k, (r, a) in enumerate(((1, 1), (2.76, 0.45), (5.4, 0.25), (8.93, 0.12))))
def timp(f=72, s=1.2):
    f_ = np.geomspace(f * 1.5, f, int(SR * s)); y = np.sin(2 * np.pi * np.cumsum(f_) / SR) * np.exp(-tt(s) / 0.35)
    nz = lp(rng.standard_normal(int(SR * 0.06)), 1500) * np.exp(-tt(0.06) / 0.015); y[:len(nz)] += nz * 0.4; return y / np.max(np.abs(y))
def thud(): return timp(58, 0.5) * 0.8 + lp(rng.standard_normal(int(SR * 0.5)), 300) * np.exp(-tt(0.5) / 0.04) * 0.4
def noise_sweep(f0, f1, s):
    if not s == s or s <= 0: return np.zeros(1)
    y = rng.standard_normal(int(SR * s)); out = np.zeros_like(y); fc = np.geomspace(f0, f1, len(y)); B = 1200
    for i in range(0, len(y), B): out[i:i + B] = bp(y[max(0, i - 2400):i + B], fc[i] * 0.8, fc[i] * 1.25)[-len(y[i:i + B]):]
    return out / np.max(np.abs(out)) * np.hanning(len(y))
def pop(f=900): f_ = np.geomspace(f, f * 0.55, int(SR * 0.09)); y = np.sin(2 * np.pi * np.cumsum(f_) / SR) * np.exp(-tt(0.09) / 0.03); return y
def tick(f=2600): y = bp(rng.standard_normal(int(SR * 0.025)), f * 0.7, f * 1.3) * np.exp(-tt(0.025) / 0.005); return y / np.max(np.abs(y))
def coin(): x = np.zeros(int(SR * 0.6)); a = pluck(2637, 0.5) * 0.6; b = pluck(3520, 0.4) * 0.3; x[:len(a)] += a; x[:len(b)] += b; return x
def click(): y = pop(1400) * 0.4; a = tick(3800) * 0.8; y[:len(a)] += a; return y
def sweep_tone(f0, f1, s):
    if not s == s or s <= 0: return np.zeros(1)
    f = np.geomspace(f0, f1, int(SR * s)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(len(f))

mus = np.zeros(N); sfx = np.zeros(N)
# ---------------- TRILHA ----------------
HARM = [('gancho', [38, 50, 53, 57]), ('bolsonaro', [34, 46, 50, 53]), ('lula', [31, 43, 46, 50]), ('entrevistas', [36, 48, 52, 55]), ('mercado', [41, 48, 53, 57]),
        ('m2', [38, 50, 53, 57]), ('mapa', [34, 46, 53, 58]), ('cta', [41, 48, 53, 57, 60])]
HARM = [h for h in HARM if h[0] in S] + [(n, v) for n, v in (('governos', [34, 46, 50, 53]), ('virada', [41, 53, 57, 60]), ('corrida', [36, 48, 52, 55]), ('estoque', [38, 50, 53, 57]), ('conta', [33, 45, 48, 52]), ('parcela', [38, 50, 55, 57])) if n in S]
HARM.sort(key=lambda h: A(h[0]))
for i, (sc, notes) in enumerate(HARM):
    t0 = A(sc); t1 = S[sc]['fim'] + 0.4; s = t1 - t0
    y = sum(saw(note(m), s) for m in notes[1:]) / (len(notes) - 1); y = lp(y, 900 if sc not in ('mercado', 'cta') else 1300)
    put(mus, t0, y * adsr(len(y), 0.35 if i else 1.2, 0.1, 1, 0.4) * 0.22)
    b_ = np.sin(2 * np.pi * note(notes[0]) * tt(s)) + 0.3 * np.sin(2 * np.pi * note(notes[0] + 12) * tt(s)); put(mus, t0, b_ * adsr(len(b_), 0.2, 0.1, 1, 0.4) * 0.16)
    if sc in ('bolsonaro', 'lula', 'mercado', 'm2'):
        step = 60 / 92 / 2; t = t0 + 0.2; k = 0
        while t < t1 - 0.4:
            m = notes[0] + 12; y2 = lp(saw(note(m), 0.22, (-8, 8)), 700) * adsr(int(SR * 0.22), 0.005, 0.1, 0.3, 0.06); put(mus, t, y2 * (0.11 if k % 2 else 0.15)); t += step; k += 1
    for j, m in enumerate(notes[2:]): put(mus, t0 + 0.05 + j * 0.16, piano(note(m + 12)) * 0.10)

# ---------------- EFEITOS ----------------
def sw(i): return SW[i % len(SW)]
def ding(): x = np.zeros(int(SR * 0.9)); a_ = pluck(1568, 0.6) * 0.7; b2 = pluck(2093, 0.7) * 0.6; x[:len(a_)] += a_; i = int(0.1 * SR); x[i:i + len(b2)] += b2[:len(x) - i]; return x
def alert(): x = np.zeros(int(SR * 0.7)); a_ = pluck(880, 0.4) * 0.7; b2 = pluck(660, 0.5) * 0.7; x[:len(a_)] += a_; i = int(0.14 * SR); x[i:i + len(b2)] += b2[:len(x) - i]; return x
def key(j): return K + 'keyboard/keypress-%03d.wav' % (1 + (j * 7) % 32)
G = lambda i: Wn('gancho', i); g0 = A('gancho'); dG = D('gancho')
def beep(f, s_): return np.sin(2 * np.pi * f * tt(s_)) * adsr(int(SR * s_), 0.005, 0.02, 0.8, 0.02)
put(sfx, 0.0, sw(3), 0.2); put(sfx, 0.02, thud(), 0.45); put(sfx, 0.0, timp(60), 0.3)
put(sfx, G(5) - 0.1, ding(), 0.3)  # notificação do Rafael
put(sfx, G(9) - 0.3, sw(1), 0.35)  # chicote para o gráfico
put(sfx, G(9) + 0.1, pop(900), 0.2); put(sfx, G(14) - 0.1, tick(2400), 0.12); put(sfx, G(14) - 0.05, sweep_tone(300, 600, 0.6), 0.05)
put(sfx, G(16) - 0.1, sweep_tone(300, 1200, 0.7), 0.06); put(sfx, G(16) + 0.55, pluck(note(79)), 0.12)
put(sfx, G(20) - 0.05, thud(), 0.45); put(sfx, G(20) - 0.05, timp(56, 0.9), 0.35); put(sfx, G(20) + 0.05, bell(988, 1.2, 0.5) * 0.6, 0.18)
B = lambda i: Wd('bolsonaro', i); b0 = A('bolsonaro')
put(sfx, b0 + 0.05, pop(800), 0.3)
for i in range(4): put(sfx, B(1) + i * 0.15 + 0.05, tick(2200 + i * 200), 0.12)
put(sfx, B(10) - 0.25, sw(1), 0.3); put(sfx, B(10) + 0.3, timp(70, 0.9), 0.35)
put(sfx, B(13) - 0.15, sw(3), 0.25); put(sfx, B(13) + 0.1, pluck(note(69)), 0.14)
put(sfx, B(13) + 0.1, sweep_tone(500, 260, B(18) - B(13)), 0.05); put(sfx, B(18), pluck(note(62)), 0.16)
put(sfx, B(19), sweep_tone(260, 700, B(22) - B(19)), 0.05); put(sfx, B(21), pluck(note(74)), 0.18)
put(sfx, B(25) - 0.3, sw(2), 0.35); put(sfx, B(25) + 0.3, thud(), 0.3); put(sfx, B(30), pluck(note(67)), 0.12)
tFl = B(37) - 0.1
put(sfx, tFl - 0.2, sw(4), 0.3); put(sfx, tFl + 0.05, pop(800), 0.25); put(sfx, tFl + 0.6, sweep_tone(300, 900, 1.0), 0.06); put(sfx, tFl + 1.6, bell(988, 1.2, 0.5) * 0.6, 0.22)
put(sfx, B(43) - 0.05, pop(1100), 0.28); put(sfx, B(43), pluck(note(72)), 0.13)
Lw = lambda i: Wd('lula', i)
put(sfx, A('lula'), sw(5), 0.25)
put(sfx, Lw(3), sweep_tone(600, 420, Lw(7) - Lw(3)), 0.04); put(sfx, Lw(7), pluck(note(67)), 0.15)
put(sfx, Lw(10), sweep_tone(420, 700, Lw(13) - Lw(10)), 0.05); put(sfx, Lw(13), timp(66), 0.5); put(sfx, Lw(13), pluck(note(76)), 0.15)
put(sfx, Lw(14) - 0.2, sw(1), 0.22); put(sfx, Lw(15), pop(1000), 0.28); put(sfx, Lw(18), pluck(note(71)), 0.14)
put(sfx, Lw(20) - 0.25, sw(2), 0.4)
for t in (Lw(24), Lw(29)): put(sfx, t, thud(), 0.3)
put(sfx, Lw(32), pop(1200), 0.3); put(sfx, Lw(32) + 0.05, pluck(note(81)), 0.12)
M_ = lambda i: Wd('mercado', i); m_0 = A('mercado'); tBoard = M_(4) - 0.3; tFlow = M_(9) - 0.2; tFlip = M_(19); tPoll = M_(31)
for j in range(3): put(sfx, m_0 + 0.05 + j * 0.3, bell(1046, 1.8, 0.8) * 0.6, 0.33 - j * 0.04)
put(sfx, tBoard, sw(0), 0.25)
for i in range(7):
    for j in range(8): put(sfx, tBoard + 0.2 + i * 0.22 + j * 0.06, tick(2600 + j * 120), 0.035)
    put(sfx, tBoard + 0.2 + i * 0.22 + 0.5, pluck(note([76, 79, 81, 83, 84, 72, 69][i])), 0.08)
put(sfx, tFlow, sw(5), 0.25)
t0 = tFlow + 0.6; t1 = M_(12) + 0.1; sp = (t1 - t0) / 6
for i in range(16): put(sfx, t0 + i * 0.16 + 0.6, coin(), 0.04)
for i, m in enumerate([67, 69, 64, 71, 72, 74]): put(sfx, t0 + i * sp + 0.05, pluck(note(m)), 0.13 if i != 2 else 0.07); put(sfx, t0 + i * sp, pop(800 + i * 70), 0.15)
put(sfx, t1, timp(70, 0.9), 0.35); put(sfx, t1 + 0.05, bell(1318, 1.4, 0.6) * 0.6, 0.22)
put(sfx, tFlip - 0.2, noise_sweep(400, 5000, 0.5), 0.16); put(sfx, tFlip + 0.25, timp(64, 0.8), 0.3)
put(sfx, tFlip + 0.4, sweep_tone(900, 300, M_(26) - tFlip), 0.05); put(sfx, M_(26) + 0.2, timp(56), 0.35)
put(sfx, M_(21) - 0.1, pop(900), 0.25); put(sfx, M_(21) - 0.05, sw(1), 0.15)
put(sfx, tPoll - 0.1, alert(), 0.3); put(sfx, tPoll, sweep_tone(300, 600, M_(39) - tPoll + 0.2), 0.05)
Q = lambda i: Wd('m2', i)
put(sfx, Q(2) - 0.2, noise_sweep(4000, 300, 0.5), 0.15); put(sfx, Q(2) + 0.15, thud(), 0.55); put(sfx, Q(2) + 0.15, timp(60), 0.35)
put(sfx, Q(8) - 0.1, sw(1), 0.3)
scale = [62, 64, 65, 67, 69, 70, 72, 74, 76, 77, 79, 81, 82, 84, 86, 88, 89, 91, 93]
for i in range(19): put(sfx, Q(9) + (i + 0.25) / 21 * (Q(12) - Q(9)), pluck(note(scale[i] - 12)), 0.06)
for i, k in enumerate((12, 14, 16, 18, 23)): put(sfx, Q(k) - 0.05, pop(900 + i * 90), 0.26); put(sfx, Q(k), pluck(note([74, 77, 76, 79, 81][i])), 0.12)
put(sfx, Q(24) - 0.2, sweep_tone(200, 500, 0.5), 0.06); put(sfx, Q(24) + 0.15, sw(0), 0.2)
put(sfx, Q(31) - 0.2, timp(64), 0.4); put(sfx, Q(31) - 0.1, thud(), 0.3)
put(sfx, Q(32), sweep_tone(300, 900, 0.8), 0.06); put(sfx, Q(33) + 0.4, pluck(note(86)), 0.12)
m0 = A('mapa'); Um = lambda x: U('mapa', x); Pm = lambda i: Wd('mapa', i)
put(sfx, m0, noise_sweep(3000, 600, 0.9), 0.15); put(sfx, Um(0.6), pluck(note(69)), 0.12); put(sfx, Um(0.7), pluck(note(76)), 0.1)
put(sfx, Um(1.2), sw(1), 0.35); put(sfx, Um(1.8), sweep_tone(400, 900, 1.0), 0.04)
put(sfx, Um(2.6), sw(5), 0.2); put(sfx, Um(3.6), coin(), 0.08)
put(sfx, Pm(13) - 0.2, sw(2), 0.3); put(sfx, Pm(14), noise_sweep(2500, 8000, 0.6), 0.06)
for i, tb in enumerate([7.4, 7.9, 8.3, 8.7, 9.1]): put(sfx, Um(tb) + 0.25, pop(900 + i * 60), 0.16); put(sfx, Um(tb) + 0.25, pluck(note([69, 71, 72, 74, 76][i])), 0.08); put(sfx, Um(tb) + 0.35, thud(), 0.14)
put(sfx, Um(10.6), sw(3), 0.2)
tU = Pm(29) - 0.15; put(sfx, tU - 0.2, sw(4), 0.3); put(sfx, tU + 0.3, timp(58), 0.45); put(sfx, tU + 0.35, bell(784, 1.4, 0.6) * 0.5, 0.25)
put(sfx, Pm(54) - 0.3, sw(1), 0.3); put(sfx, Pm(54) + 0.2, sweep_tone(300, 700, 1.4), 0.05); put(sfx, Pm(60), ding(), 0.28)
put(sfx, Pm(62) - 0.2, sw(2), 0.3); put(sfx, Pm(62) + 0.1, timp(62), 0.45); put(sfx, Pm(65), thud(), 0.5); put(sfx, Pm(65) + 0.05, bell(659, 1.6, 0.7) * 0.5, 0.25)
put_end(sfx, S['mapa']['fim'], noise_sweep(600, 6000, 0.6), 0.16)
Cw = lambda i: Wn('cta', i); c0 = A('cta'); dC = D('cta'); tFinal = c0 + dC - 3.3; tFollow = tFinal + 1.1
put(sfx, Cw(4) - 0.15, pop(900), 0.26); put(sfx, Cw(4) - 0.1, pluck(note(72)), 0.12)
put(sfx, Cw(7) - 0.12, thud(), 0.3); put(sfx, Cw(7) - 0.1, pop(1200), 0.22); put(sfx, Cw(7) + 0.05, pop(800), 0.2)
put(sfx, Cw(15) - 0.1, sweep_tone(400, 1200, 0.5), 0.06); put(sfx, Cw(15) + 0.3, bell(1568, 0.9, 0.3) * 0.6, 0.16)
put(sfx, Cw(19) - 0.25, sw(1), 0.25); put(sfx, Cw(19) + 0.3, ding(), 0.18)
for k_ in (20, 23): put(sfx, Cw(k_) - 0.05, click(), 0.3); put(sfx, Cw(k_), pluck(note(79 if k_ == 20 else 84)), 0.1)
for j in range(3): put(sfx, Cw(26) + j * 0.12, key(j), 0.16)
put(sfx, Cw(26) + 0.85, click(), 0.3); put(sfx, Cw(30) + 0.2, click(), 0.35); put(sfx, Cw(30) + 0.25, sweep_tone(600, 1600, 0.25), 0.08)
put(sfx, tFinal, sw(2), 0.25); put(sfx, tFollow, click(), 0.35); put(sfx, tFollow + 0.08, pluck(note(79)), 0.15); put(sfx, tFollow + 0.2, pluck(note(84)), 0.12)

# ---- v7: whoosh nos cortes com passagem de velocidade + brilho sonoro nas faíscas
for j, sc in enumerate(()):
    b = S[sc]['fim']; put_end(sfx, b + 0.06, noise_sweep(350, 6500, 0.6), 0.2); put(sfx, b - 0.02, sw(j + 1), 0.16)
def shimmer():
    x = np.zeros(int(SR * 1.2))
    for k, (f, d) in enumerate(((2637, 0.0), (3136, 0.07), (3951, 0.14), (5274, 0.2))):
        y = bell(f, 0.9, 0.22) * (0.5 - k * 0.08); i = int(d * SR); x[i:i + len(y)] += y[:len(x) - i]
    return x
for sc, w_, dt in (('mercado', 12, 0.3), ('m2', 31, 0.35), ('mapa', 64, 0.3)): put(sfx, Wd(sc, w_) + dt, shimmer(), 0.14)

# ---- v9: entrevistas (avatares, citações e cortina para o mercado)
E_ = lambda i: Wd('entrevistas', i); e0 = A('entrevistas')
put(sfx, e0 + 0.1, tick(2400), 0.12); put(sfx, e0 + 0.15, pluck(note(72)), 0.1)
for k, n in ((4, 69), (19, 74)): put(sfx, E_(k) - 0.15, pop(900), 0.26); put(sfx, E_(k) - 0.1, pluck(note(n)), 0.12)
for k in (7, 13, 22, 26): put(sfx, E_(k), tick(3000), 0.06)
put(sfx, E_(18) + 0.1, pluck(note(76)), 0.08); put(sfx, E_(31), pluck(note(79)), 0.1); put(sfx, E_(19) - 0.4, pop(1300), 0.18)
put_end(sfx, S['entrevistas']['fim'] + 0.08, noise_sweep(300, 5000, 0.6), 0.2); put(sfx, S['entrevistas']['fim'] + 0.02, timp(60, 0.9), 0.32)

# ---- v10: governos, cenas de venda do v6 e transições
Gv = lambda i: Wd('governos', i)
put(sfx, Gv(0) - 0.3, pop(850), 0.26); put(sfx, Gv(0) - 0.25, pluck(note(67)), 0.12)
put(sfx, Gv(6), sweep_tone(500, 300, 0.4), 0.05); put(sfx, Gv(8), sweep_tone(300, 900, Gv(12) - Gv(8) + 0.1), 0.05); put(sfx, Gv(12) + 0.1, pluck(note(74)), 0.14)
put(sfx, Gv(13) - 0.3, pop(950), 0.26); put(sfx, Gv(13) - 0.25, pluck(note(69)), 0.12); put(sfx, Gv(17), timp(66), 0.4); put(sfx, Gv(17) + 0.05, pluck(note(79)), 0.12)
for j in range(10): put(sfx, Gv(20) + j * 0.12, tick(2200 + j * 90), 0.08)
put(sfx, Gv(24) + 0.2, pluck(note(76)), 0.12); put(sfx, Gv(32) - 0.4, sw(4), 0.32); put(sfx, Gv(32) + 0.2, pop(1100), 0.24); put(sfx, Gv(35), pluck(note(72)), 0.13)
Vr = lambda i: Wn('virada', i); v0 = A('virada')
for j in range(6): put(sfx, v0 + 0.2 + j * 0.45, noise_sweep(800 + j * 200, 3000, 0.4), 0.035)
put(sfx, Vr(6) - 0.25, sweep_tone(900, 200, 0.5), 0.08); put(sfx, Vr(6) + 0.1, thud(), 0.35); put(sfx, Vr(8) - 0.05, pop(900), 0.25)
for j in range(8): put(sfx, Vr(8) + j * (Vr(11) - Vr(8) + 0.3) / 8, pluck(note(62 + [0, 2, 4, 5, 7, 9, 11, 12][j])), 0.06)
put(sfx, Vr(10) - 0.1, sw(0), 0.2); put(sfx, Vr(11), bell(1318, 1.4, 0.6) * 0.6, 0.2)
c_0 = A('corrida')
put(sfx, c_0 + 0.1, pluck(note(43), 1.2), 0.15); put(sfx, c_0 + 0.12, tick(1500), 0.1)
put(sfx, U('corrida', 0.8), sweep_tone(250, 800, 2.0), 0.05); put(sfx, U('corrida', 1.0), pop(1000), 0.2); put(sfx, U('corrida', 2.95), pop(800), 0.2); put(sfx, U('corrida', 3.2), ding(), 0.3); put(sfx, U('corrida', 3.3), pluck(note(79)), 0.12)
Es = lambda i: Wd('estoque', i)
put(sfx, Es(0), pop(900), 0.2); put(sfx, Es(8), timp(56), 0.45); put(sfx, Es(8) + 0.3, thud(), 0.3)
for j in range(13): put(sfx, U('estoque', 4.65 + j * 0.04) + j * 0.03, tick(1800 + j * 80), 0.07)
o_ = lambda i: Wd('estoque', i)
for j in range(13): put(sfx, o_(15) - 0.85 + j * (o_(17) + 0.95 - o_(15)) / 13, pluck(note(60 + (j * 2) % 24)), 0.05)
put(sfx, Es(22), pluck(note(72)), 0.12); put(sfx, Es(25), bell(988, 1.2, 0.5) * 0.6, 0.22)
Ct = lambda i: Wn('conta', i)
for j in range(10): put(sfx, Wd('conta', 8) - 0.1 + j * 0.22 * (D('conta') / 8.1), coin(), 0.06)  # moedas: uma por ano de aluguel
put(sfx, Ct(18), timp(58), 0.45); put(sfx, U('conta', 6.25), sweep_tone(900, 250, 0.6), 0.06); put(sfx, U('conta', 6.7), thud(), 0.45)
fc_ = S['conta']['fala'].split(' '); put(sfx, Ct(fc_.index('Financiar')) - 0.15, pop(800), 0.25); put(sfx, Ct(fc_.index('Financiar')) + 0.6, pluck(note(72)), 0.1)
Pc = lambda i: Wd('parcela', i)
put(sfx, Pc(0), sw(1), 0.2); put(sfx, A('parcela') + 0.4, sweep_tone(700, 350, 2.6), 0.04); put(sfx, Pc(4), ding(), 0.3)
put(sfx, U('parcela', 5.6), pop(800), 0.25); put(sfx, U('parcela', 6.4), thud(), 0.35); put(sfx, Pc(18), bell(784, 1.6, 0.7) * 0.6, 0.28); put(sfx, Pc(18) + 0.05, timp(62), 0.35)
# transições entre cenas (ponto, zoom, chicote, flash)
TRK = {'governos': 'whip', 'entrevistas': 'dot', 'mercado': 'slide', 'virada': 'flash', 'm2': 'zoom', 'corrida': 'whip', 'conta': 'flash', 'estoque': 'slide', 'parcela': 'dot', 'mapa': 'zoom', 'cta': 'slide'}
# ---- v11: moeda (conselho 1), cartões de conselho, pergunta, chaves, cortes do mapa
a_g = A('governos'); Wg = lambda i: Wn('governos', i); tLg = Wg(6) + 0.15 - a_g
put(sfx, a_g + 0.2, sweep_tone(400, 1200, 0.35), 0.06); put(sfx, a_g + 0.25, bell(2637, 0.5, 0.15) * 0.5, 0.12)
for n in range(8): kk = 1 - (1 - (n + 0.5) / 8) ** (1 / 3); put(sfx, a_g + 0.25 + kk * (tLg - 0.25), bell(2400 + n * 90, 0.35, 0.08) * 0.5, 0.07)
put(sfx, a_g + tLg, thud(), 0.4); put(sfx, a_g + tLg + 0.02, bell(988, 1.2, 0.5) * 0.6, 0.2)
for k_ in (8, 10, 13): put(sfx, Wg(k_) - 0.05, pop(1000 + k_ * 30), 0.22)
put(sfx, Wg(17) - 0.1, thud(), 0.5); put(sfx, Wg(17) - 0.08, timp(52, 0.8), 0.35); put(sfx, Wg(17) - 0.12, noise_sweep(5000, 600, 0.25), 0.12)
put(sfx, Wg(47) - 0.15, pop(850), 0.22); put(sfx, Wg(54), pluck(note(76)), 0.13)
for sc in ('governos', 'corrida', 'estoque', 'parcela', 'mapa'):
    if sc in S: P_ = S[sc]['intro']; put_end(sfx, A(sc) + P_ + 0.15, noise_sweep(3000, 500, 0.5), 0.13); put(sfx, A(sc) + P_ + 0.1, thud(), 0.22)
fe = S['entrevistas']['fala'].split(' '); put(sfx, Wn('entrevistas', fe.index('Quem')) - 0.15, pop(1000), 0.28); put(sfx, Wn('entrevistas', fe.index('Quem')) - 0.1, pluck(note(76)), 0.12)
We = lambda i: Wn('estoque', i); put(sfx, We(8) - 0.05, pop(800), 0.22); put(sfx, We(8) + 0.1, bell(1175, 1.0, 0.4) * 0.5, 0.15)
Wp = lambda i: Wn('parcela', i)
for j in range(3): put(sfx, Wp(1) + j * 0.14, click(), 0.18)
put(sfx, Wp(3), beep(1500, 0.08), 0.06)
fp = S['parcela']['fala'].split(' '); tE_ = Wn('parcela', fp.index('E')) - 0.3; put(sfx, tE_, sw(1), 0.3); put(sfx, tE_ + 0.1, noise_sweep(3000, 500, 0.5), 0.1)
put(sfx, Wn('parcela', fp.index('Mas')) - 0.05, pluck(note(67)), 0.12); put(sfx, Wn('parcela', fp.index('patrimônio')), bell(784, 1.4, 0.6) * 0.5, 0.18)
Wm = lambda i: Wn('mapa', i)
fm_ = S['mapa']['fala'].split(' '); put(sfx, Wm(fm_.index('Governo')) - 0.35, sw(4), 0.3); put(sfx, Wm(fm_.index('Governo')) - 0.3, noise_sweep(600, 5000, 0.5), 0.1)
fq_ = S['m2']['fala'].split(' '); put(sfx, Wn('m2', fq_.index('No')) - 0.35, sw(5), 0.3)
fm = S['mapa']['fala'].split(' ')
for k_, w_ in enumerate(('catorze', 'lançamentos,', 'obras', 'prontos.')): t_ = Wm(fm.index(w_)); put(sfx, t_ - 0.05, pop(850 + k_ * 90), 0.24); put(sfx, t_, pluck(note([72, 74, 76, 79][k_])), 0.1)
put(sfx, Wm(fm.index('Em')) - 0.35, sw(2), 0.25)
fs = S['estoque']['fala'].split(' '); put(sfx, Wn('estoque', fs.index('Há')), pluck(note(67)), 0.12)
for tc in (Wm(2) - 0.15, Wm(4) - 0.15): put(sfx, tc - 0.08, sw(3), 0.25); put(sfx, tc + 0.05, thud(), 0.25)
iT = S['mapa']['fala'].split(' ').index('tijolo'); put(sfx, Wm(iT - 1) - 0.25, thud(), 0.45); put(sfx, Wm(iT - 1) - 0.2, noise_sweep(4000, 600, 0.4), 0.12)
for j, (sc, k) in enumerate(TRK.items()):
    if sc not in S: continue
    b = A(sc)
    if k == 'zoom': put_end(sfx, b + 0.35, noise_sweep(400, 7000, 0.7), 0.2); put(sfx, b + 0.3, thud(), 0.25)
    elif k == 'dot': put(sfx, b - 0.05, pop(700), 0.22); put(sfx, b + 0.05, sweep_tone(300, 1200, 0.5), 0.05)
    elif k == 'whip': put(sfx, b - 0.05, sw(j), 0.38)
    elif k == 'slide': put(sfx, b - 0.1, sw(j + 2), 0.3); put(sfx, b + 0.35, thud(), 0.2)
    elif k == 'flash': put(sfx, b - 0.04, bell(1568, 0.9, 0.3) * 0.6, 0.2); put(sfx, b, noise_sweep(6000, 1500, 0.35), 0.15)


# ---- v12: quadro "depois do debate" (letreiro split-flap)
fmk = S['mercado']['fala'].split(' '); tiD = len(fmk) - 1 - fmk[::-1].index('Depois'); Wk = lambda i: Wn('mercado', i)
put(sfx, Wk(tiD) - 0.3, sw(2), 0.3); put(sfx, Wk(tiD) - 0.1, thud(), 0.3)
for t0, n in ((Wk(tiD + 4) - 0.15, 7), (Wk(tiD + 8) - 0.15, 9), (Wk(tiD + 6), 11), (Wk(tiD + 6) + 0.25, 11)):
    for j in range(n): put(sfx, t0 + j * 0.05 + 0.1, tick(3200 + (j % 3) * 300), 0.05)
# ---------------- mixagem ----------------
def room(x, mix, dec=0.6):
    n = int(SR * dec * 2.5); ir = rng.standard_normal(n) * np.exp(-np.arange(n) / SR / dec); ir = lp(ir, 5000); ir /= np.sqrt((ir ** 2).sum()); return x + fftconvolve(x, ir)[:len(x)] * mix
mus = room(hp(mus, 30), 0.3, 1.0); sfx = room(hp(sfx, 40), 0.12, 0.4)
n = int(SR * DUR); mus, sfx = mus[:n], sfx[:n]
fo = int(1.2 * SR); mus[-fo:] *= np.linspace(1, 0, fo) ** 1.5
def st(x, d_ms=12): d = int(SR * d_ms / 1000); r = np.r_[np.zeros(d), x[:-d]]; return np.stack([x * 0.92 + r * 0.08, x * 0.75 + r * 0.25], 1)
M = st(mus); Sx = np.stack([sfx, sfx], 1)
M /= np.max(np.abs(M)); Sx /= np.max(np.abs(Sx))
wavfile.write(str(OUT / 'trilha.wav'), SR, (M * 0.89 * 32767).astype(np.int16)); wavfile.write(str(OUT / 'efeitos.wav'), SR, (Sx * 0.89 * 32767).astype(np.int16))
# ---- v13: voz gravada, cortada nos mesmos pontos das cenas (silêncio extra no fim das cenas que pedem tempo)
from scipy.signal import resample_poly
vsr, vx = wavfile.read(str(HERE / 'voz' / 'voz.wav')); vx = vx.astype(np.float64) / 32768
if vx.ndim > 1: vx = vx.mean(1)
vx = resample_poly(vx, SR, vsr); V = np.zeros(n)
for sc in TM:
    c0, c1 = sc['voz']; a0 = int(c0 * SR); seg = vx[a0:int(c1 * SR)].copy(); f = min(int(0.008 * SR), len(seg) // 2)
    if f > 0: seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    i = int(sc['inicio'] * SR); m_ = min(len(seg), n - i); V[i:i + m_] += seg[:m_]
V /= np.max(np.abs(V)) + 1e-9; wavfile.write(str(OUT / 'voz_montada.wav'), SR, (V * 0.89 * 32767).astype(np.int16))
# ducking: a trilha baixa quando a voz fala
env = np.convolve(np.abs(V), np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'); env = np.minimum(1, env / 0.08)
dk = np.zeros_like(env); g = 0.0; att, rel = np.exp(-1 / (0.04 * SR)), np.exp(-1 / (0.35 * SR))
for k in range(0, len(env), 64):
    e_ = env[k]; g = att * g + (1 - att) * e_ if e_ > g else rel * g + (1 - rel) * e_; dk[k:k + 64] = g
mix = np.stack([V, V], 1) * 1.0 + M * (0.30 * (1 - 0.6 * dk))[:, None] + Sx * (0.42 * (1 - 0.3 * dk))[:, None]
mix /= np.max(np.abs(mix)); wavfile.write(str(OUT / 'som_bruto.wav'), SR, (mix * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(OUT / 'som.wav')], check=True); print('ok', DUR)
