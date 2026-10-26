# som.py — trilha (120 BPM) + efeitos presos às palavras + narração → assets/som.wav
# Rode build.py antes (gera voz/tempos.json). Sem voz/bruto.wav, sai só trilha + efeitos (para conferência).
import json, numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent
import sys; sys.path.insert(0, str(HERE)); import instrumentos; ns = vars(instrumentos)   # biblioteca de sons (instrumentos.py)
put, tt, pad, pluck, bass, nf, lp, hp, bp, riser, impact = [ns[k] for k in ('put', 'tt', 'pad', 'pluck', 'bass', 'nf', 'lp', 'hp', 'bp', 'riser', 'impact')]
pop, tick, click, chime, buzz, WS, KEYS = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'buzz', 'WS', 'KEYS')]
J = json.load(open(HERE / 'voz' / 'tempos.json')); T, M = J['T'], J['M']
SR, BEAT, BAR, DUR = 48000, 0.5, 2.0, T['DUR']; N = int(SR * (DUR + 2)); rg = np.random.default_rng(5)
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)

# ---------- trilha: noite tensa (Dm · B♭ · F · A); seções seguem as cenas ----------
CH = [[50, 57, 62, 65, 69], [46, 53, 58, 62, 65], [41, 48, 53, 57, 60], [45, 52, 57, 61, 64]]; BS = [38, 34, 41, 33]
def sec(t):
    if t < T['BC']: return 'intro'          # prédio, janelas
    if t < T['EF']: return 'mid'            # resultado, rojão, mundo
    if t < T['GH']: return 'full'           # circuit breaker
    if t < T['HI']: return 'mid'            # por quê
    if t < T['IJ']: return 'drop'           # boleto
    if t < T['LM']: return 'full'           # aluguel, simule, m²
    if t < T['END']: return 'mid'           # plantão, CTA
    return 'out'
mus = np.zeros(N); dr = np.zeros(N)
for b in range(int(DUR / BAR) + 1):
    t0 = b * BAR; ch = CH[b % 4]
    for i in range(4):
        tb = t0 + i * BEAT; s = sec(tb)
        if i == 0: put(mus, t0, pad([nf(m + 12) for m in ch[:4]], BAR + 0.3), 0.7 if s in ('intro', 'drop', 'out') else 0.55)
        for h in range(2):
            j = i * 2 + h; g = {'intro': 0.14, 'mid': 0.2, 'full': 0.24, 'drop': 0.1, 'out': 0.12}[s]
            put(mus, tb + h * BEAT / 2, pluck(nf(ch[[0, 2, 4, 2, 1, 3, 4, 3][j]] + 12), 0.35, 0.9), g)
        if s in ('mid', 'full'): put(mus, tb, bass(nf(BS[b % 4]), 0.45), 0.6); put(dr, tb, K, 0.8)
        if s == 'full' and i in (1, 3): put(dr, tb, CL, 0.42)
        if s in ('mid', 'full', 'intro'):
            for h in range(2): put(dr, tb + h * BEAT / 2, HO if h else HC, (0.12 if h else 0.08) * (0.6 if s == 'intro' else 1))

# ---------- efeitos ----------
sfx = np.zeros(N)
def crackle(s=0.7):
    x = np.zeros(int(SR * s))
    for k in range(40): i = int(rg.uniform(0, s - 0.03) * SR); y = tick(rg.uniform(1800, 5000)); x[i:i + len(y)] += y * rg.uniform(0.2, 0.7)
    return x * np.exp(-np.arange(len(x)) / SR / (s / 2))
def boom(): d = tt(0.6); n = lp(rg.standard_normal(len(d)), 900) * np.exp(-d / 0.12); y = np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-d / 0.05)) / SR) * np.exp(-d / 0.2); return np.tanh((n * 1.5 + y) * 1.5)
def whistle(s=0.3): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 2600, len(d))) / SR) * (1 - d / s) * 0.4
def swish(s=0.5): d = tt(s); n = bp(rg.standard_normal(len(d)), 600, 3000); return n * np.sin(np.pi * d / s) ** 2 * 0.6
def ding(): d = tt(1.4); return (np.sin(2 * np.pi * 1318.5 * d) * 0.5 + np.sin(2 * np.pi * 2637 * d) * 0.15) * np.exp(-d / 0.5)
def door(s=0.55): d = tt(s); return lp(rg.standard_normal(len(d)), 500) * np.sin(np.pi * d / s) * 0.8
def slap(): d = tt(0.18); return hp(rg.standard_normal(len(d)), 900) * np.exp(-d / 0.025)
def vib(s=0.45): d = tt(s); return np.sin(2 * np.pi * 160 * d) * (np.sin(2 * np.pi * 18 * d) > 0) * np.exp(-d / 0.3) * 0.7
def alarm(): d = tt(0.9); return np.sign(np.sin(2 * np.pi * (660 + 220 * (np.sin(2 * np.pi * 4 * d) > 0)) * d)) * np.exp(-d / 0.5) * 0.25
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def drop(s=0.6): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 160, len(d))) / SR) * np.exp(-d / (s / 2.5)) * 0.6
def rise(s=0.6): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(200, 1200, len(d))) / SR) * np.sin(np.pi * d / s) * 0.5

C = T
P = lambda t, x, g: put(sfx, t, x, g)
P(0.05, riser(max(1.0, M['paises'] - 0.1)), 0.18); P(M['paises'], thud(), 0.6); P(M['paises'] - 0.15, swish(0.4), 0.4)
P(M['rafa'], pop(1100, 0.08), 0.4); P(M['celia'], pop(900, 0.08), 0.4)
P(C['BC'] - 0.45, WS[2], 0.5); P(C['BC'], impact(), 0.35)
for k in range(9): P(M['lula'] + k * 0.1, tick(2800), 0.28)
P(M['lula'] + 0.9, pop(800, 0.1), 0.4); P(M['flavio'], pop(1000, 0.08), 0.35); P(M['virada'], WS[0], 0.35)
P(C['CD'] - 0.45, riser(0.45), 0.3); P(C['CD'], impact(), 0.3)
for i in range(3): t0 = M['rojao'] + 0.12 + i * 0.3; P(t0 - 0.22, whistle(0.22), 0.4); P(t0, boom(), 0.5); P(t0 + 0.05, crackle(0.7), 0.4)
P(M['cortina'], swish(0.55), 0.6); P(C['DE'] - 0.35, swish(0.45), 0.7); P(C['DE'] + 0.1, swish(0.5), 0.6)
P(M['toquio'] - 0.5, WS[4], 0.45); P(M['catorze'], thud(), 0.6); P(M['catorze'] + 0.05, drop(0.5), 0.35)
P(M['ny'] - 0.3, WS[1], 0.45); P(M['vinte5'], thud(), 0.7); P(M['vinte5'] + 0.05, drop(0.7), 0.4); P(M['vinte5'] + 0.25, impact(), 0.35)
P(C['EF'] - 0.7, riser(0.65), 0.3); P(C['EF'], ding(), 0.4)
P(M['celulares'], vib(), 0.6); P(M['celulares'] + 0.12, vib(), 0.6); P(M['celulares'] + 0.1, pop(1500, 0.06), 0.4)
P(C['FF2'] - 0.3, WS[3], 0.5); P(C['FF2'], alarm(), 0.5); P(C['FF2'] + 0.3, impact(), 0.5)
P(M['pandemia'], thud(), 0.5); P(M['ibov'], drop(0.6), 0.45); P(M['bb'], drop(0.6), 0.45); P(M['dolar'], rise(0.6), 0.4)
P(C['F2G'] - 0.3, WS[0], 0.45); P(M['avisei'] - 0.05, pop(900, 0.1), 0.5); P(M['primdia'] - 0.25, pop(1100, 0.1), 0.5)
P(C['GH'] - 0.25, WS[4], 0.5); P(M['medo'], pop(700, 0.1), 0.35); P(M['juros'], rise(0.5), 0.3); P(M['doisp'] + 0.2, thud(), 0.6); P(M['pesam'], pop(900, 0.1), 0.4)
P(C['HI'] - 0.35, WS[2], 0.5); P(M['porta'] - 0.1, ding(), 0.45); P(M['porta'], door(0.6), 0.6)
P(M['envel'], WS[1], 0.4); P(M['envel'] + 0.4, slap(), 0.7); P(M['envel'] + 0.55, slap(), 0.7); P(M['boleto'] + 0.15, impact(), 0.5); P(M['boleto'] + 0.15, thud(), 0.5)
P(C['IJ'] - 0.35, riser(0.35), 0.3); P(C['IJ'], impact(), 0.35)
P(M['alug'] + 0.3, rise(0.8), 0.25); P(M['dobro'] + 0.1, thud(), 0.6); P(M['sp'] - 0.3, WS[3], 0.4)
for k in range(8): P(M['sp'] + k * 0.3, tick(2200 + 200 * (k % 2)), 0.25)
P(M['correndo'] + 0.8, chime(True), 0.35)
P(C['JK'], WS[0], 0.45); P(M['simul0'] + 0.3, rise(0.8), 0.3); P(M['simular'], click(), 0.6); P(M['simular'] + 0.05, chime(True), 0.3)
P(C['KL'] - 0.3, WS[2], 0.45)
for k in range(19): P(M['m2'] + 0.2 + k * max(1.8, M['todos'] + 0.8 - M['m2'] - 0.2) / 19, pop(500 + 40 * k, 0.07), 0.3)
P(M['passa'], WS[4], 0.5); P(M['tijolo'], thud(), 0.6); P(M['tijolo'] + 0.1, chime(True), 0.35)
P(C['LM'], WS[1], 0.4); P(M['plantao'], pop(900, 0.1), 0.35)
P(C['MN'], WS[3], 0.55); P(C['MN'] + 0.05, impact(), 0.4); P(M['time'], pop(800, 0.1), 0.45); P(M['time'] + 0.35, pop(1000, 0.1), 0.45); P(M['time'] + 0.6, thud(), 0.5)
P(M['compra'] - 0.2, WS[0], 0.4); P(M['comenta'], click(), 0.6); P(M['comenta'] + 0.05, chime(True), 0.35)
P(T['END'], impact(), 0.3); P(T['END'] + 0.1, chime(True), 0.3)

# ---------- camadas extras: ambiências e foley ----------
def bed(a, b, kind):
    i0, i1 = int(a * SR), int(b * SR); L = i1 - i0
    if L <= 0: return
    d = np.arange(L) / SR; env = np.minimum(1, np.minimum(d / 0.4, (L / SR - d) / 0.4))
    if kind == 'cidade':   # noite da cidade: rumor grave + carros distantes
        x = lp(np.cumsum(rg.standard_normal(L)) * 0.02, 400); x = x - np.mean(x)
        for k in range(int(L / SR / 2.5)): c = int(rg.uniform(0, L - SR)); seg = bp(rg.standard_normal(SR), 200, 900) * np.sin(np.linspace(0, np.pi, SR)) ** 2; x[c:c + SR] += seg * 0.4
        g = 0.18
    elif kind == 'elevador':  # zumbido do motor
        x = (np.sin(2 * np.pi * 60 * d) * 0.6 + np.sin(2 * np.pi * 120 * d) * 0.3 + lp(rg.standard_normal(L), 300) * 0.3); g = 0.12
    elif kind == 'coracao':   # tensão no painel da B3
        x = np.zeros(L)
        for k in range(int(L / SR / 0.75)):
            for off, a2 in ((0, 1), (0.16, 0.7)):
                j = int((k * 0.75 + off) * SR); y = np.sin(2 * np.pi * 55 * np.arange(int(0.18 * SR)) / SR) * np.exp(-np.arange(int(0.18 * SR)) / SR / 0.05) * a2
                x[j:j + len(y)] += y[:max(0, L - j)]
        g = 0.5
    elif kind == 'rua':       # dia de rua no plantão
        x = bp(rg.standard_normal(L), 300, 2500) * 0.3; g = 0.1
    x = x / (np.max(np.abs(x)) + 1e-9); sfx[i0:i1] += x * env * g
def cheer(s=1.4):  # torcida ao longe
    d = tt(s); n = bp(rg.standard_normal(len(d)), 500, 3500); am = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * d + rg.uniform(0, 6))
    return n * am * np.sin(np.pi * d / s) ** 1.5 * 0.7
def rustle(s=0.25): d = tt(s); return bp(rg.standard_normal(len(d)), 1500, 7000) * np.exp(-d / 0.06) * 0.6
def kaching(): d = tt(0.8); x = (np.sin(2 * np.pi * 2093 * d) + 0.6 * np.sin(2 * np.pi * 3136 * d)) * np.exp(-d / 0.25) * 0.5; x[:int(0.03 * SR)] += hp(rg.standard_normal(int(0.03 * SR)), 2000) * 0.5; return x
bed(0, T['BC'], 'cidade'); bed(T['CD'], T['DE'] + 0.3, 'cidade')
bed(T['EF'], T['FF2'], 'elevador'); bed(T['F2G'], T['GH'], 'elevador'); bed(T['HI'], T['IJ'], 'elevador')
bed(T['FF2'], T['F2G'], 'coracao'); bed(T['LM'], T['MN'], 'rua')
P(M['rojao'] + 0.1, cheer(1.6), 0.5)
P(M['envel'] + 0.38, rustle(), 0.6); P(M['envel'] + 0.53, rustle(), 0.6); P(M['boleto'] - 0.05, kaching(), 0.35)
for k in range(6): P(M['simul0'] + 0.3 + k * 0.13, tick(3200), 0.3)
P(M['m2'] + 0.2, riser(max(1.8, M['todos'] + 0.8 - M['m2'] - 0.2)), 0.25)
P(M['time'], cheer(1.0), 0.35); P(M['time'] + 0.35, cheer(1.0), 0.35)
for k, key in enumerate(['lula', 'catorze', 'vinte5', 'ibov', 'bb', 'dolar', 'doisp', 'dobro']): P(M[key] - 0.03, pop(1300 - 40 * k, 0.05), 0.25)

# ---------- mixagem ----------
n = int(SR * DUR); M_ = (hp(mus, 35) + dr * 0.9)[:n]; S_ = sfx[:n]
TR = HERE / 'voz' / 'trilha.wav'   # trilha original "sombria slowed" (trilha.py) substitui a trilha antiga
if TR.exists():
    _, tr = wavfile.read(str(TR)); tr = tr.astype(np.float64) / 32767; M_ = np.zeros(n); M_[:min(n, len(tr))] = tr[:n]
M_ /= np.max(np.abs(M_)); S_ /= np.max(np.abs(S_))
if not TR.exists():
    fo = int(2.0 * SR); M_[-fo:] *= np.linspace(1, 0, fo) ** 1.5
vp = HERE / 'voz' / 'bruto.wav'
if vp.exists():
    sr, v = wavfile.read(str(vp)); v = v.astype(np.float64); v = v if v.ndim == 1 else v.mean(1)
    if sr != SR:
        import scipy.signal as ss; v = ss.resample_poly(v, SR, sr)
    v /= np.max(np.abs(v)); V = np.zeros(n); V[:min(n, len(v))] = v[:n]
    env = lp(np.abs(V), 8); env /= np.max(env) + 1e-9; duck = 1 - 0.5 * np.clip(env / 0.15, 0, 1)
    mix = V * 1.0 + M_ * (0.26 if TR.exists() else 0.2) * duck + S_ * 0.3
else:
    mix = M_ * 0.55 + S_ * 0.6
mix /= np.max(np.abs(mix))
st = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.2 + mix * 0.8], 1)
wavfile.write(str(HERE / 'voz' / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(HERE / 'voz' / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(HERE / 'assets' / 'som.wav')], check=True)
print('som ok ·', DUR, 's ·', 'com voz' if vp.exists() else 'SEM voz')
