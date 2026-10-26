# som_final.py — trilha 120 BPM + efeitos presos às palavras da narração + voz, com ducking → out/som.wav
import numpy as np, json, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; OUT = HERE / 'out'; OUT.mkdir(exist_ok=True)
full = (HERE.parent / 'imposto-aluguel' / 'som.py').read_text()
src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(HERE.parent / 'imposto-aluguel' / 'som.py')}; exec(src, ns)
put, tt, pad, pluck, bass, nf, lp, hp, bp, riser, impact = [ns[k] for k in ('put', 'tt', 'pad', 'pluck', 'bass', 'nf', 'lp', 'hp', 'bp', 'riser', 'impact')]
pop, tick, click, chime, buzz, WS, KEYS, RC = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'buzz', 'WS', 'KEYS', 'RC')]
SR = 48000; BEAT = 0.5; BAR = 2.0
VW = json.load(open(HERE / 'voz' / 'palavras.json')); Wt = lambda i: VW[i][1]; WE = lambda i: VW[i][2]
import math; DUR = math.ceil((WE(len(VW) - 1) + 2.6) * 10) / 10; N = int(SR * (DUR + 1))
SCN = [('renda', 0), ('morder', 6), ('calma', 17), ('ibs', 22), ('regua', 34), ('marcas', 53), ('exemplos', 81), ('paga', 111), ('avisos', 154), ('cta', 199)]
A = {n: (0 if k == 0 else (WE(i - 1) + Wt(i)) / 2) for k, (n, i) in enumerate(SCN)}
rg = np.random.default_rng(3)
# ---------- trilha ----------
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67]]; BS = [45, 41, 36, 43]
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)
mus = np.zeros(N); dr = np.zeros(N)
def energy(t):  # 0 intro/pausa · 1 médio · 2 cheio
    if t < A['morder'] - 0.5: return 1
    if A['calma'] <= t < A['ibs']: return 0
    if A['avisos'] <= t < A['cta']: return 1
    if t >= DUR - 2.0: return 0
    return 2
for b in range(int(DUR / BAR) + 1):
    t0 = b * BAR; ch = CH[b % 4]; e = energy(t0 + 0.1)
    put(mus, t0, pad([nf(m) for m in ch[:4]], BAR + 0.3), 0.5 if e else 0.65)
    for i in range(8): put(mus, t0 + i * BEAT / 2, pluck(nf(ch[[0, 2, 4, 2, 1, 3, 4, 3][i]] + 12), 0.4, 1.1 if e == 2 else 0.6), 0.26 if e == 2 else 0.18 if e else 0.1)
    if e >= 1:
        for i in range(4 if e == 2 else 2): put(mus, t0 + i * (BEAT if e == 2 else BAR / 2), bass(nf(BS[b % 4]), 0.45 if e == 2 else 0.9), 0.65)
        for i in range(4): put(dr, t0 + i * BEAT, K, 0.9 if (e == 2 or i in (0, 2)) else 0)
        for i in range(8): put(dr, t0 + i * BEAT / 2, HO if i % 2 else HC, (0.18 if i % 2 else 0.12) * (1 if e == 2 else 0.6))
        if e == 2: put(dr, t0 + BEAT, CL, 0.55); put(dr, t0 + 3 * BEAT, CL, 0.55)
put(mus, DUR - 2.2, pad([nf(m) for m in CH[0][:4]], 3.0), 0.7)
# ---------- efeitos ----------
sfx = np.zeros(N)
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def crunch():
    d = tt(0.4); n = rg.standard_normal(len(d)); env = np.zeros(len(d))
    for k in range(6): i = int((0.01 + k * 0.045) * SR); env[i:] += np.exp(-(d[:len(d) - i]) / 0.018) * (1 - k * 0.12)
    return hp(n * env, 1100)
def boing(): d = tt(0.45); f = 220 + 170 * np.sin(2 * np.pi * 9 * d) * np.exp(-d / 0.15); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d / 0.2) * 0.7
def ding(): d = tt(1.6); return sum(np.sin(2 * np.pi * 1320 * r * d) * a * np.exp(-d / (0.6 / (1 + k))) for k, (r, a) in enumerate(((1, 1), (2.76, 0.4), (5.4, 0.2)))) * 0.6
def jingle():
    x = np.zeros(int(SR * 0.6))
    for k in range(7): y = tick(3500 + 900 * (k % 3)) * 0.6; i = int(k * 0.06 * SR); x[i:i + len(y)] += y[:len(x) - i]
    return x
def glitch(): d = tt(0.25); y = np.sign(np.sin(2 * np.pi * 60 * d)) * rg.standard_normal(len(d)) * 0.6; return bp(y, 400, 6000) * (np.arange(len(d)) % 2400 < 1600)
def sweep_down(): d = tt(0.6); f = np.geomspace(900, 160, len(d)); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d / 0.35) * 0.5
def scratch(): d = tt(0.35); return bp(rg.standard_normal(len(d)), 1500, 5000) * np.exp(-d / 0.12) * 0.8
def w(i): return WS[i % len(WS)]
# transições
for k, (n, i) in enumerate(SCN[1:], 1):
    a = A[n]; put(sfx, a - 0.2, w(k), 0.55)
    if n in ('calma',): put(sfx, a - 0.3, RC[-int(0.6 * SR):], 0.3)
    if n == 'avisos': put(sfx, a - 0.08, glitch(), 0.5)
    if n in ('regua', 'marcas', 'cta'): put(sfx, a - 0.6, riser(0.6), 0.25)
put(sfx, 0.0, w(5), 0.4)
# 1. renda
t0 = Wt(3) + 0.12
for j in range(3): put(sfx, t0 + 0.12 * j, pop(600 + 150 * j), 0.5)
for j in range(9): put(sfx, Wt(5) - 0.1 + j * 0.09 + 0.42, tick(3000 + 250 * (j % 3)), 0.28)
# 2. morder
put(sfx, Wt(12) - 0.1, w(2), 0.45); put(sfx, Wt(13) + 0.12, crunch(), 1.0); put(sfx, Wt(13) + 0.12, thud(), 0.5); put(sfx, Wt(16), thud(), 0.3)
# 3. calma
put(sfx, Wt(17), chime(True), 0.3)
for j in range(12): put(sfx, Wt(18) + 0.03 * j, pop(900 + 40 * j, 0.06), 0.18)
for j in range(11): put(sfx, Wt(19) + 0.04 * j, tick(2600), 0.18)
put(sfx, Wt(20) - 0.02, thud(), 0.9); put(sfx, Wt(20), impact(), 0.4)
# 4. ibs
put(sfx, Wt(23) - 0.05, pop(700), 0.55); put(sfx, Wt(24), pop(1300, 0.08), 0.4); put(sfx, Wt(26) - 0.05, pop(820), 0.55); put(sfx, Wt(29), pop(1000), 0.35)
# 5. régua
put(sfx, Wt(41), tick(2000), 0.4); put(sfx, Wt(43) - 0.1, pop(500, 0.14), 0.55)
for j in range(4): put(sfx, Wt(47) + 0.12 * j, tick(1500), 0.25)
put(sfx, Wt(49), boing(), 0.55); put(sfx, Wt(50), riser(0.6), 0.2); put(sfx, Wt(52), pop(1100), 0.45)
# 6. marcas
put(sfx, Wt(57) - 0.15, pop(800), 0.45)
for j in range(4): put(sfx, Wt(58) + 0.18 * j, pop(900 + 120 * j, 0.08), 0.5)
put(sfx, Wt(63) - 0.05, pop(1300, 0.08), 0.5); put(sfx, Wt(64) - 0.1, pop(700), 0.4)
for j in range(10): put(sfx, Wt(66) + j * (WE(69) - Wt(66)) / 10, tick(3200), 0.2)
for j in range(8): put(sfx, Wt(73) + j * 0.12 + 0.35, tick(2800 + 200 * (j % 3)), 0.25)
put(sfx, Wt(78), click(), 0.5); put(sfx, Wt(80) - 0.02, thud(), 0.9); put(sfx, Wt(80), impact(), 0.4)
# 7. exemplos
put(sfx, Wt(87), boing(), 0.6); put(sfx, Wt(87) + 0.3, pop(500, 0.12), 0.5); put(sfx, Wt(89) - 0.3, w(1), 0.4); put(sfx, Wt(96), pop(500, 0.12), 0.5)
put(sfx, Wt(102) - 0.02, thud(), 0.9); put(sfx, Wt(102) + 0.1, chime(True), 0.5); put(sfx, Wt(106), pop(1000), 0.4)
# 8. paga
put(sfx, Wt(112), riser(0.6), 0.35); put(sfx, Wt(113), pop(900), 0.45); put(sfx, Wt(113) + 0.12, pop(1100), 0.45)
put(sfx, Wt(114) - 0.12, jingle(), 0.6); put(sfx, Wt(119) + 0.25, thud(), 0.9); put(sfx, Wt(119) + 0.3, buzz(), 0.3); put(sfx, Wt(123), pop(1200), 0.4)
for j in range(6): put(sfx, Wt(129) - 0.1 + j * 0.16, KEYS[j % len(KEYS)], 0.4)
put(sfx, Wt(132) + 0.15, thud(), 0.8); put(sfx, Wt(134), sweep_down(), 0.5); put(sfx, Wt(141) - 0.05, pop(800), 0.4); put(sfx, Wt(143), chime(True), 0.4)
# 9. avisos
put(sfx, Wt(155) - 0.05, pop(800), 0.45); put(sfx, Wt(164), w(4), 0.4); put(sfx, Wt(171), pop(1200), 0.4)
put(sfx, Wt(187), pop(900), 0.4); put(sfx, Wt(191), scratch(), 0.6); put(sfx, Wt(193), scratch(), 0.5); put(sfx, Wt(198) - 0.1, ding(), 0.6)
# 10. cta
for j in range(5): put(sfx, Wt(206) + j * (WE(207) - Wt(206)) / 5, KEYS[(j + 3) % len(KEYS)], 0.45)
put(sfx, Wt(208), click(), 0.55); put(sfx, Wt(208) + 0.05, pop(1100), 0.45); put(sfx, Wt(213), chime(True), 0.45); put(sfx, WE(215) + 0.3, impact(), 0.45)
# ---------- mistura ----------
n = int(SR * DUR); M = hp(mus, 35) + dr * 0.9; M = M[:n]; S = sfx[:n]
fo = int(1.2 * SR); M[-fo:] *= np.linspace(1, 0, fo) ** 1.5
sr, v = wavfile.read(str(HERE / 'voz' / 'voz.wav')); v = v.astype(np.float64) / 32768; V = np.zeros(n); V[:min(n, len(v))] = v[:n]
env = np.convolve(np.abs(V), np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'); env = np.minimum(1, env / 0.06)
dk = np.zeros(n); g = 0.0; att, rel = np.exp(-1 / (0.03 * SR)), np.exp(-1 / (0.3 * SR))
for k in range(0, n, 64):
    e = env[k]; g = att * g + (1 - att) * e if e > g else rel * g + (1 - rel) * e; dk[k:k + 64] = g
M /= np.max(np.abs(M)); S /= np.max(np.abs(S)); V /= np.max(np.abs(V))
mix = V * 1.0 + M * 0.42 * (1 - 0.6 * dk) + S * 0.5 * (1 - 0.25 * dk)
st = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.25 + mix * 0.75], 1); st /= np.max(np.abs(st))
wavfile.write(str(OUT / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(OUT / 'som.wav')], check=True)
print('ok', DUR)
