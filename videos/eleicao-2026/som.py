# Parte 1 (v2) — trilha séria (cordas/piano sintetizados, sem trap) + efeitos sincronizados com a animação
import subprocess, json, os, numpy as np
from pathlib import Path
HERE = Path(__file__).resolve().parent; LIB = HERE.parents[1] / 'lib' / 'sfx'; OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve
SR = 48000
TM = json.load(open(HERE / 'timing.json'))['timing']
S = {s['cena']: s for s in TM}; DUR = TM[-1]['fim']; N = int(SR * (DUR + 2))
def A(sc): return S[sc]['inicio']
def Wd(sc, i): return S[sc]['palavras'][i]
def D(sc): return S[sc]['fim'] - S[sc]['inicio']
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
    y = rng.standard_normal(int(SR * s)); out = np.zeros_like(y); fc = np.geomspace(f0, f1, len(y)); B = 1200
    for i in range(0, len(y), B): out[i:i + B] = bp(y[max(0, i - 2400):i + B], fc[i] * 0.8, fc[i] * 1.25)[-len(y[i:i + B]):]
    return out / np.max(np.abs(out)) * np.hanning(len(y))
def pop(f=900): f_ = np.geomspace(f, f * 0.55, int(SR * 0.09)); y = np.sin(2 * np.pi * np.cumsum(f_) / SR) * np.exp(-tt(0.09) / 0.03); return y
def tick(f=2600): y = bp(rng.standard_normal(int(SR * 0.025)), f * 0.7, f * 1.3) * np.exp(-tt(0.025) / 0.005); return y / np.max(np.abs(y))
def coin(): x = np.zeros(int(SR * 0.6)); a = pluck(2637, 0.5) * 0.6; b = pluck(3520, 0.4) * 0.3; x[:len(a)] += a; x[:len(b)] += b; return x
def click(): y = pop(1400) * 0.4; a = tick(3800) * 0.8; y[:len(a)] += a; return y
def sweep_tone(f0, f1, s): f = np.geomspace(f0, f1, int(SR * s)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.hanning(len(f))

mus = np.zeros(N); sfx = np.zeros(N)
# ---------------- TRILHA ----------------
HARM = [('gancho', [38, 50, 53, 57]), ('bolsonaro', [34, 46, 50, 53]), ('lula', [31, 43, 46, 50]), ('mercado', [41, 48, 53, 57]),
        ('m2', [38, 50, 53, 57]), ('mapa', [34, 46, 53, 58]), ('cta', [41, 48, 53, 57, 60])]
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
G = lambda i: Wd('gancho', i); dG = D('gancho')
put(sfx, 0.0, sw(3), 0.25); put(sfx, 0.02, thud(), 0.55); put(sfx, 0.12, thud(), 0.4); put(sfx, 0.15, pop(700), 0.3); put(sfx, 0.0, timp(60), 0.4)
put(sfx, G(5) - 0.25, ding(), 0.35)
put(sfx, G(9) - 0.1, sw(1), 0.22)
for j in range(12): put(sfx, G(11) + j * 0.11, key(j), 0.18)
put(sfx, G(15) + 0.1, sweep_tone(600, 1400, 0.25), 0.08); put(sfx, G(15) + 0.12, pop(1200), 0.25)
put(sfx, G(16) + 0.35, sw(4), 0.3)
put(sfx, G(20) - 0.32, sw(2), 0.4); put(sfx, G(20) + 0.25, timp(80, 0.8), 0.3)
put(sfx, G(23) - 0.08, pop(1100), 0.3); put(sfx, G(23), pluck(note(74)), 0.12)
put_end(sfx, S['gancho']['fim'], noise_sweep(500, 5000, 0.8), 0.18); put(sfx, S['gancho']['fim'] - 0.05, timp(62), 0.45)
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
m0 = A('mapa'); P_ = lambda i: Wd('mapa', i) - m0
put(sfx, m0, noise_sweep(3000, 600, 0.9), 0.15); put(sfx, m0 + 0.6, pluck(note(69)), 0.12); put(sfx, m0 + 0.7, pluck(note(76)), 0.1)
put(sfx, m0 + 1.2, sw(1), 0.35); put(sfx, m0 + 1.8, sweep_tone(400, 900, 1.3), 0.04)
for i in range(3): put(sfx, m0 + 2.6 + i * 0.2, tick(1800 + i * 250), 0.12)
put(sfx, m0 + 2.6, sw(5), 0.2); put(sfx, m0 + 3.6, coin(), 0.08)
put(sfx, m0 + P_(13) - 0.2, sw(2), 0.3); put(sfx, m0 + P_(14), noise_sweep(2500, 8000, 0.6), 0.06)
for i, tb in enumerate([7.4, 7.9, 8.3, 8.7, 9.1]): put(sfx, m0 + tb, sweep_tone(180 + i * 30, 420 + i * 40, 0.7), 0.05); put(sfx, m0 + tb + 0.5, thud(), 0.18); put(sfx, m0 + tb + 0.35, pop(900 + i * 60), 0.16); put(sfx, m0 + tb + 0.35, pluck(note([69, 71, 72, 74, 76][i])), 0.08)
for i, k in enumerate((19, 20, 22)): put(sfx, m0 + P_(k), pop(1000 + i * 100), 0.24)
put(sfx, m0 + 10.6, sw(3), 0.25); put(sfx, m0 + 11.4, pluck(note(79)), 0.1)
tU = P_(29) - 0.15; put(sfx, m0 + tU - 0.2, sw(4), 0.3); put(sfx, m0 + tU + 0.3, timp(58), 0.45); put(sfx, m0 + tU + 0.35, bell(784, 1.4, 0.6) * 0.5, 0.25)
for j in range(6): put(sfx, m0 + tU + 0.6 + j * 0.3, tick(2200 + j * 150), 0.1)
for i, k in enumerate((38, 39, 40, 42)): put(sfx, m0 + P_(k) - 0.05, pop(900 + i * 80), 0.24)
T3 = P_(38)
for j in range(8): tr = T3 + j * 0.62; put(sfx, m0 + tr, sweep_tone(200, 480, 0.5), 0.04); put(sfx, m0 + tr + 0.35, pluck(note([69, 71, 72, 74, 76, 77, 79, 81][j])), 0.07); put(sfx, m0 + tr + 0.4, thud(), 0.12)
for i, k in enumerate((47, 48, 51)): put(sfx, m0 + P_(k) - 0.1, pop(1100 + i * 120), 0.28); put(sfx, m0 + P_(k), pluck(note([76, 79, 84][i])), 0.12)
put(sfx, m0 + P_(54) - 0.3, sw(1), 0.3); put(sfx, m0 + P_(54) + 0.2, sweep_tone(300, 700, 1.4), 0.05); put(sfx, m0 + P_(60), ding(), 0.28)
put(sfx, m0 + P_(62) - 0.2, sw(2), 0.3); put(sfx, m0 + P_(62) + 0.1, timp(62), 0.45); put(sfx, m0 + P_(65), thud(), 0.5); put(sfx, m0 + P_(65) + 0.05, bell(659, 1.6, 0.7) * 0.5, 0.25)
put_end(sfx, S['mapa']['fim'], noise_sweep(600, 6000, 0.6), 0.16)
C_ = lambda i: Wd('cta', i); c0 = A('cta'); dC = D('cta'); tChat = C_(11) + 0.25; tReply = tChat + 0.55; tMine = tReply + 0.85; tFinal = dC - 2.9
put(sfx, c0, sw(5), 0.22)
put(sfx, c0 + C_(1) - c0, click(), 0.3); put(sfx, C_(1) + 0.05, sweep_tone(700, 1500, 0.2), 0.06)
put(sfx, C_(3), sw(0), 0.22); put(sfx, C_(8), click(), 0.35); put(sfx, C_(10) + 0.1, click(), 0.35); put(sfx, C_(10) + 0.15, sweep_tone(600, 1600, 0.25), 0.08)
put(sfx, c0 + tChat - c0 - 0.1, sw(1), 0.2); put(sfx, tReply, ding(), 0.3); put(sfx, tMine, sweep_tone(700, 1500, 0.2), 0.07); put(sfx, tMine + 0.05, pop(1200), 0.22)
put(sfx, c0 + tFinal, sw(2), 0.25); put(sfx, c0 + tFinal + 1.0, click(), 0.35); put(sfx, c0 + tFinal + 1.08, pluck(note(79)), 0.15); put(sfx, c0 + tFinal + 1.2, pluck(note(84)), 0.12)

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
mix = M * 0.42 + Sx * 0.62; mix /= np.max(np.abs(mix)); wavfile.write(str(OUT / 'som.wav'), SR, (mix * 0.89 * 32767).astype(np.int16)); print('ok', DUR)
