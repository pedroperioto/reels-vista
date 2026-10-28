# som.py — trilha (voz/trilha.wav) + efeitos presos às palavras + grito do filme + narração → assets/som.wav
# Rode build.py e trilha.py antes. A voz entra deslocada em T['OFF'] segundos (depois do grito do Tropa de Elite).
import json, numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; V1 = HERE.parent / 'imposto-aluguel' / 'som.py'
full = V1.read_text(); src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(V1)}; exec(src, ns)
put, tt, lp, hp, bp, riser, impact = [ns[k] for k in ('put', 'tt', 'lp', 'hp', 'bp', 'riser', 'impact')]
pop, tick, click, chime, buzz, WS, KEYS = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'buzz', 'WS', 'KEYS')]
J = json.load(open(HERE / 'voz' / 'tempos.json')); T, M = J['T'], J['M']
SR, DUR = 48000, T['DUR']; N = int(SR * (DUR + 2)); rg = np.random.default_rng(5)
sfx = np.zeros(N); P = lambda t, x, g: put(sfx, t, x, g)
def swish(s=0.5): d = tt(s); n = bp(rg.standard_normal(len(d)), 600, 3000); return n * np.sin(np.pi * d / s) ** 2 * 0.6
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def drop(s=0.6): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 160, len(d))) / SR) * np.exp(-d / (s / 2.5)) * 0.6
def rise(s=0.6): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(200, 1200, len(d))) / SR) * np.sin(np.pi * d / s) * 0.5
def slap(): d = tt(0.18); return hp(rg.standard_normal(len(d)), 900) * np.exp(-d / 0.025)
def flap(): d = tt(0.12); return bp(rg.standard_normal(len(d)), 1200, 5000) * np.exp(-d / 0.02) * 0.8   # placa de aeroporto virando
def dingdong(): d = tt(1.6); a = np.sin(2 * np.pi * 659.3 * d) * np.exp(-d / 0.5); b = np.sin(2 * np.pi * 523.3 * np.clip(d - 0.45, 0, None)) * np.exp(-np.clip(d - 0.45, 0, None) / 0.6) * (d > 0.45); return (a + b) * 0.4
def kaching(): d = tt(0.8); x = (np.sin(2 * np.pi * 2093 * d) + 0.6 * np.sin(2 * np.pi * 3136 * d)) * np.exp(-d / 0.25) * 0.5; x[:int(0.03 * SR)] += hp(rg.standard_normal(int(0.03 * SR)), 2000) * 0.5; return x
def rustle(s=0.25): d = tt(s); return bp(rg.standard_normal(len(d)), 1500, 7000) * np.exp(-d / 0.06) * 0.6
def creak(s=0.9): d = tt(s); f = 180 + 60 * np.sin(2 * np.pi * 3 * d); return bp(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (rg.standard_normal(len(d)) * 0.3 + 1), 300, 2500) * np.sin(np.pi * d / s) * 0.35
def lock(): d = tt(0.25); return hp(rg.standard_normal(len(d)), 2500) * np.exp(-d / 0.01) + np.sin(2 * np.pi * 1800 * d) * np.exp(-d / 0.03) * 0.5
def steps(s=1.3, rate=7.5):
    x = np.zeros(int(SR * s))
    for k in range(int(s * rate)): i = int(k / rate * SR); y = lp(rg.standard_normal(int(0.07 * SR)), 1200) * np.exp(-tt(0.07) / 0.015); x[i:i + len(y)] += y[:max(0, len(x) - i)]
    return x
def balloon(s=1.4):  # bolhas/esticadas de balão (sintético)
    x = np.zeros(int(SR * s))
    for k in range(18): i = int(rg.uniform(0, s - 0.2) * SR); d = tt(0.12); y = np.sin(2 * np.pi * np.cumsum(np.geomspace(rg.uniform(300, 600), rg.uniform(900, 1600), len(d))) / SR) * np.sin(np.pi * d / 0.12) * 0.3; x[i:i + len(y)] += y
    return x

# ---------- efeitos ----------
SH = json.load(open(HERE / 'voz' / 'planos.json'))
def cheer(s=1.4):
    d = tt(s); n = bp(rg.standard_normal(len(d)), 500, 3500); am = 0.6 + 0.4 * np.sin(2 * np.pi * 7 * d + rg.uniform(0, 6))
    return n * am * np.sin(np.pi * d / s) ** 1.5 * 0.7
# ---------- desenho de som das transições (cada tipo tem a sua assinatura) ----------
from scipy.io import wavfile as _wf
_sr, RC = _wf.read(str(HERE.parent.parent / 'lib' / 'sfx' / 'reverse_cymbals.wav')); RC = RC.astype(np.float64); RC = (RC if RC.ndim == 1 else RC.mean(1)); RC /= np.max(np.abs(RC))
if _sr != SR:
    import scipy.signal as _ss; RC = _ss.resample_poly(RC, SR, _sr)
def whoosh(s=0.32, f0=5200, f1=500):   # whip: ruído com filtro varrendo de agudo para grave + leve doppler
    d = tt(s); n = rg.standard_normal(len(d)); out = np.zeros(len(d)); seg = 256
    fc = np.geomspace(f0, f1, len(d) // seg + 1)
    for k in range(len(fc) - 1):
        a, b = k * seg, min(len(d), (k + 1) * seg); out[a:b] = bp(n[max(0, a - 512):b], fc[k] * 0.6, min(fc[k] * 1.6, 20000))[-(b - a):]
    env = np.sin(np.pi * np.clip(d / s, 0, 1)) ** 1.6; return out * env / (np.max(np.abs(out)) + 1e-9)
def airy(s=0.7):     # leak: sopro suave que cresce e some
    d = tt(s); n = lp(hp(rg.standard_normal(len(d)), 300), 4500); env = np.sin(np.pi * d / s) ** 2; return n * env / (np.max(np.abs(n)) + 1e-9) * 0.7
def shimmer(s=1.2):  # brilho agudo (acorde de sinos)
    d = tt(s); x = sum(np.sin(2 * np.pi * f * d) for f in (1568, 2093, 2637, 3136)) / 4; return x * np.exp(-d / 0.45) * np.minimum(1, d / 0.03)
def boom(s=1.2):     # sub grave de impacto
    d = tt(s); y = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-d / 0.06)) / SR) * np.exp(-d / 0.45); return np.tanh(y * 1.6)
def shutter():       # obturador de câmera
    x = np.zeros(int(0.12 * SR)); a = hp(rg.standard_normal(int(0.012 * SR)), 2000); x[:len(a)] += a; b = hp(rg.standard_normal(int(0.02 * SR)), 1500) * 0.7; i = int(0.06 * SR); x[i:i + len(b)] += b; return x
def stutter(n=5, g=0.045):   # glitch digital: rajadas cortadas e reduzidas
    x = np.zeros(int(SR * (n * g * 1.6 + 0.05)))
    for k in range(n):
        d = tt(g * (0.5 + 0.5 * (k % 2))); f = [880, 1320, 660, 1760, 990][k % 5]; y = np.sign(np.sin(2 * np.pi * f * d)) * 0.5 + bp(rg.standard_normal(len(d)), 2000, 8000) * 0.5
        y = np.round(y * 6) / 6; i = int(k * g * 1.5 * SR); x[i:i + len(y)] += y * (1 - k / n * 0.4)
    return x
def tapestop(s=0.55):  # "fita parando": a música desacelera até parar
    d = tt(s); f = 220 * (1 - d / s) ** 2 + 20; y = (np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5 + np.sin(2 * np.pi * np.cumsum(f * 0.5) / SR)); return lp(y, 1800) * (1 - d / s) * 0.6
def thump(): d = tt(0.25); return np.sin(2 * np.pi * np.cumsum(60 + 120 * np.exp(-d / 0.02)) / SR) * np.exp(-d / 0.08)
TRJ = json.load(open(HERE / 'voz' / 'transicoes.json'))
for k, (t, ty, du) in enumerate(TRJ):
    if ty in ('whipL', 'whipU'):
        P(t - 0.2, whoosh(0.34, 5200 if ty == 'whipL' else 3800, 500), 0.55); P(t - 0.14, WS[k % len(WS)], 0.3)
    elif ty == 'zoom':
        P(t - 0.42, rise(0.42), 0.3); P(t, impact(), 0.32); P(t, boom(0.8), 0.45)
    elif ty == 'flash':
        P(t - 0.03, shutter(), 0.6); P(t, impact(), 0.35); P(t, boom(1.0), 0.5)
    elif ty == 'glitch':
        P(t - 0.08, stutter(), 0.32); P(t, click(), 0.4)
    elif ty == 'leak':
        P(t - 0.35, airy(0.8), 0.5); P(t + 0.05, shimmer(1.4), 0.18)
    elif ty == 'black':
        P(t - len(RC) / SR, RC, 0.45); P(t, boom(1.4), 0.6)
    elif ty == 'cut':
        P(t, thump(), 0.5)
for t in (T['DE'], T['EF']): P(t - len(RC) / SR, RC, 0.4)          # prato reverso antes de cada capítulo
P(M['apto'] - 0.45, tapestop(0.5), 0.18)                              # a música "para" no "Mas o apartamento…"
P(M['pedindo'], dingdong(), 0.3)
for k in range(22): P(M['busca'] + 0.1 + k * max(0.6, M['mil7'] - M['busca'] - 0.35) / 22, KEYS[k % len(KEYS)], 0.35)
P(M['mil7'] - 0.6, rise(0.6), 0.3)
for k in range(10): P(M['mil7'] + k * 0.1, tick(2800), 0.25)
P(M['mil7'] + 1.0, thud(), 0.65); P(M['mil7'] + 1.0, buzz(), 0.25)
for k in range(8): P(M['turno1'] + 0.3 + k * 0.1, tick(2600), 0.2)
P(M['turno1'] + 1.1, pop(900, 0.1), 0.35)
P(M['indep'] - 0.05, pop(800, 0.1), 0.35); P(M['indep'] + 0.1, pop(1000, 0.1), 0.35)
P(M['apto'] + 0.05, rise(0.5), 0.2)
P(M['naocabe'] - 0.1, balloon(1.5), 0.45); P(M['naocabe'] - 0.05, chime(True), 0.25)
P(M['segue'] + 0.55, click(), 0.7); P(M['segue'] + 0.6, pop(1200, 0.08), 0.45); P(M['parte4'], pop(800, 0.1), 0.4)
P(M['duas'] + 0.6, pop(900, 0.08), 0.35); P(M['duas'] + 1.2, pop(1100, 0.08), 0.35)
P(M['correndo'] - 0.3, steps(1.4), 0.6)
for i in range(8): P(M['bia1'] + i * 0.08, pop(1400 - 60 * i, 0.05), 0.25)
P(M['disparou'] - 0.15, cheer(1.2), 0.4); P(M['disparou'], thud(), 0.45)
P(M['segunda'] - 0.1, drop(1.2), 0.35)
for k in range(12): P(M['segunda'] + 0.1 + k * 0.18, tick(2400), 0.2)
P(M['nove'] + 0.3, thud(), 0.7); P(M['nove'] + 0.05, buzz(), 0.3)
P(M['pagou'] - 0.05, rustle(0.4), 0.5); P(M['pagou'] + 0.35, pop(700, 0.08), 0.35); P(M['imposto'] - 0.6, pop(650, 0.08), 0.35); P(M['trocou'], pop(600, 0.08), 0.35)
P(M['menos'], thud(), 0.7); P(M['menos'] + 0.05, drop(0.6), 0.3)
P(T['EF'] + 0.5, pop(1000, 0.1), 0.35)
for k in range(9): P(M['seis'] - 0.1 + k * 0.1, tick(3000), 0.25)
P(M['seis'] + 0.8, pop(1000, 0.1), 0.4); P(M['tres'], kaching(), 0.35)
P(M['quinze2'], thud(), 0.45); P(M['sobra'] - 0.1, cheer(1.6), 0.45); P(M['sobra'] + 0.05, kaching(), 0.35)
P(M['voltar'] - 0.1, riser(1.6), 0.25); P(M['tala'], impact(), 0.35); P(M['tala'] + 0.2, pop(1200, 0.1), 0.4)
P(T['FG'] + 0.1, creak(1.0), 0.45); P(M['fechado'] + 0.05, lock(), 0.6)
for i in range(4): P(M['condo'] + 0.1 + i * 0.35, slap(), 0.55)
P(M['semrenda'] + 0.05, thud(), 0.5); P(M['semrenda'] - 0.05, buzz(), 0.3)
P(M['vender'] + 0.05, chime(True), 0.3); P(M['nunca'] - 0.1, buzz(), 0.35); P(M['correndo2'] - 0.1, steps(1.2), 0.45)
P(M['conta'] - 0.05, thud(), 0.6); P(M['conta'], kaching(), 0.3)
for k in range(5): P(M['comenta'] + 0.15 + k * 0.12, KEYS[k], 0.4)
P(M['comenta'] + 0.95, click(), 0.6); P(M['comenta'] + 1.1, pop(1300, 0.08), 0.4); P(M['simul'] - 0.2, chime(True), 0.35)
P(T['END'], impact(), 0.3); P(T['END'] + 0.1, chime(True), 0.3)
# ambiências
def bed(a, b, kind):
    i0, i1 = int(a * SR), int(b * SR); L = i1 - i0
    if L <= 0: return
    d = np.arange(L) / SR; env = np.minimum(1, np.minimum(d / 0.4, (L / SR - d) / 0.4))
    if kind == 'aeroporto': x = bp(rg.standard_normal(L), 200, 2500) * 0.4 + lp(rg.standard_normal(L), 150); g = 0.12
    elif kind == 'cidade':
        x = lp(np.cumsum(rg.standard_normal(L)) * 0.02, 400); x = x - np.mean(x)
        for k in range(int(L / SR / 2.5)): c = int(rg.uniform(0, L - SR)); seg = bp(rg.standard_normal(SR), 200, 900) * np.sin(np.linspace(0, np.pi, SR)) ** 2; x[c:c + SR] += seg * 0.4
        g = 0.18
    elif kind == 'corredor': x = lp(rg.standard_normal(L), 250) + np.sin(2 * np.pi * 50 * d) * 0.2; g = 0.1
    x = x / (np.max(np.abs(x)) + 1e-9); sfx[i0:i1] += x * env * g
bed(T['TA'], M['busca'] - 0.2, 'aeroporto'); bed(T['SC'], T['DE'], 'cidade'); bed(T['FG'], T['GH'], 'corredor')

# ---------- mixagem ----------
n = int(SR * DUR)
_, tr = wavfile.read(str(HERE / 'voz' / 'trilha.wav')); tr = tr.astype(np.float64) / 32767; Mu = np.zeros(n); Mu[:min(n, len(tr))] = tr[:n]
Mu /= np.max(np.abs(Mu)); S_ = sfx[:n] / np.max(np.abs(sfx[:n]))
sr, v = wavfile.read(str(HERE / 'voz' / 'voz_curta.wav')); v = v.astype(np.float64); v = v if v.ndim == 1 else v.mean(1); v /= np.max(np.abs(v))
V = np.zeros(n); o = int(T['OFF'] * SR); V[o:o + len(v)] = v[:max(0, n - o)]
sr, f = wavfile.read(str(HERE / 'voz' / 'tropa.wav')); f = f.astype(np.float64); f /= np.max(np.abs(f))
F = np.zeros(n); L = min(len(f), int(T['TA'] * SR)); fade = np.ones(L); fade[-int(0.08 * SR):] = np.linspace(1, 0, int(0.08 * SR)); F[:L] = f[:L] * fade
env = lp(np.abs(V), 8); env /= np.max(env) + 1e-9; duck = 1 - 0.5 * np.clip(env / 0.15, 0, 1)
mix = V * 1.0 + F * 0.95 + Mu * 0.26 * duck + S_ * 0.3
mix /= np.max(np.abs(mix))
st = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.2 + mix * 0.8], 1)
wavfile.write(str(HERE / 'voz' / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(HERE / 'voz' / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(HERE / 'assets' / 'som.wav')], check=True)
# conferência: voz × fundo por cena
for a, b, nm in [(T['TA'], T['AB'], 'busca'), (T['AB'], T['BS'], 'turnos'), (T['SC'], T['CD'], 'segue'), (T['DE'], T['EF'], 'ana'), (T['EF'], T['FG'], 'bia'), (T['FG'], T['GH'], 'fechado'), (T['GH'], T['END'], 'final')]:
    i0, i1 = int(a * SR), int(b * SR); rv = np.sqrt(np.mean(V[i0:i1] ** 2)); rb = np.sqrt(np.mean((Mu[i0:i1] * 0.26 * duck[i0:i1] + S_[i0:i1] * 0.3) ** 2))
    print(f'{nm:8s} voz/fundo {20 * np.log10(rv / (rb + 1e-9)):5.1f} dB')
print('som ok ·', DUR, 's')
