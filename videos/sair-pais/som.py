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
P(T['TA'] - 0.1, WS[2], 0.45); P(T['TA'], impact(), 0.25)
for i in range(6): P(T['TA'] + 0.1 + i * 0.12, flap(), 0.35)
P(M['pedindo'], dingdong(), 0.35)                                   # aviso de embarque
P(M['busca'] - 0.3, WS[0], 0.35)
for k in range(22): P(M['busca'] + 0.05 + k * max(0.6, M['mil7'] - M['busca'] - 0.2) / 22, KEYS[k % len(KEYS)], 0.35)
P(M['mil7'] - 0.6, rise(0.6), 0.3)
for k in range(10): P(M['mil7'] + k * 0.1, tick(2800), 0.25)
P(M['mil7'] + 1.1, thud(), 0.6)
P(T['AB'] - 0.3, WS[3], 0.5); P(M['turno1'] + 0.1, pop(900, 0.1), 0.4); P(M['indep'] - 0.1, pop(1100, 0.1), 0.4)
P(M['malas'], thud(), 0.45); P(M['malas'] - 0.3, WS[1], 0.4)
for i in range(3): P(M['malas'] + 0.8 + i * 0.2, pop(1300 - 100 * i, 0.07), 0.35)
P(T['BS'] - 0.45, riser(0.45), 0.3); P(T['BS'], impact(), 0.25)
P(T['BS'] + 0.05, slap(), 0.5)                                       # mala abre
P(M['apto'] + 0.4, thud(), 0.7); P(M['apto'] + 0.75, thud(), 0.5)  # o prédio não entra
P(M['naocabe'] - 0.15, balloon(1.5), 0.45); P(M['naocabe'] - 0.1, chime(True), 0.25)
P(T['SC'], WS[4], 0.45); P(M['segue'] + 0.55, click(), 0.7); P(M['segue'] + 0.6, pop(1200, 0.08), 0.45)
P(M['parte4'] - 0.3, pop(800, 0.1), 0.4); P(M['parte4'] + 0.1, pop(1000, 0.1), 0.4)
P(T['CD'] - 0.2, WS[2], 0.4)
P(M['mesma'] - 0.2, pop(900, 0.08), 0.35); P(M['mesma'], pop(1100, 0.08), 0.35)
P(M['correndo'] - 0.35, WS[3], 0.55); P(M['correndo'] - 0.25, steps(1.4), 0.6); P(M['correndo'] + 0.5, slap(), 0.4); P(M['correndo'] + 0.7, slap(), 0.35)
P(M['correndo'] + 1.08, WS[0], 0.4); P(M['bia1'] + 0.35, kaching(), 0.25)
P(T['DE'] - 0.2, WS[1], 0.45)
P(M['segunda'] - 0.1, drop(1.2), 0.35)
for k in range(12): P(M['segunda'] + k * 0.18, tick(2400), 0.2)
P(M['nove'] + 0.25, thud(), 0.7); P(M['nove'] + 0.3, buzz(), 0.3)
P(M['pagou'] - 0.1, rustle(0.4), 0.5); P(M['pagou'] + 0.35, pop(700, 0.08), 0.35); P(M['imposto'] - 0.6, pop(650, 0.08), 0.35); P(M['trocou'], pop(600, 0.08), 0.35)
P(M['menos'], thud(), 0.7); P(M['menos'] + 0.05, drop(0.6), 0.3)
P(T['EF'] - 0.2, WS[4], 0.45)
for k in range(9): P(M['seis'] - 0.1 + k * 0.1, tick(3000), 0.25)
P(M['seis'] + 0.8, pop(1000, 0.1), 0.4); P(M['tres'], kaching(), 0.35)
for i, d in enumerate((0, 0.18, 0.36)): P(M['mesmo'] + d + 0.3, slap(), 0.55)
P(M['quinze2'], thud(), 0.45); P(M['sobra'], chime(True), 0.35)
P(M['voltar'] - 0.15, WS[2], 0.45); P(M['voltar'] - 0.1, riser(1.6), 0.25); P(M['tala'], impact(), 0.35); P(M['tala'] + 0.3, pop(1200, 0.1), 0.4)
P(T['FG'] - 0.1, WS[3], 0.4); P(T['FG'] + 0.1, creak(1.0), 0.45); P(M['fechado'], lock(), 0.6)
for i in range(6): P(M['condo'] + i * max(0.3, (M['semrenda'] - M['condo']) / 6) + 0.3, slap(), 0.5)
P(M['semrenda'] - 0.1, buzz(), 0.35); P(M['semrenda'] + 0.3, thud(), 0.4)
P(T['GH'], WS[1], 0.4); P(M['vender'], chime(True), 0.3); P(M['correndo2'], buzz(), 0.35)
P(M['certo'] - 0.25, WS[0], 0.35); P(M['conta'] - 0.05, thud(), 0.6); P(M['conta'], kaching(), 0.3)
P(T['HI'], WS[4], 0.45)
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
bed(T['TA'], M['busca'] - 0.2, 'aeroporto'); bed(T['CD'], T['DE'], 'cidade'); bed(T['FG'], T['GH'], 'corredor')

# ---------- mixagem ----------
n = int(SR * DUR)
_, tr = wavfile.read(str(HERE / 'voz' / 'trilha.wav')); tr = tr.astype(np.float64) / 32767; Mu = np.zeros(n); Mu[:min(n, len(tr))] = tr[:n]
Mu /= np.max(np.abs(Mu)); S_ = sfx[:n] / np.max(np.abs(sfx[:n]))
sr, v = wavfile.read(str(HERE / 'voz' / 'bruto.wav')); v = v.astype(np.float64); v = v if v.ndim == 1 else v.mean(1); v /= np.max(np.abs(v))
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
for a, b, nm in [(T['TA'], T['AB'], 'busca'), (T['AB'], T['BS'], 'globo'), (T['SC'], T['CD'], 'segue'), (T['DE'], T['EF'], 'ana'), (T['EF'], T['FG'], 'bia'), (T['FG'], T['GH'], 'fechado'), (T['GH'], T['END'], 'final')]:
    i0, i1 = int(a * SR), int(b * SR); rv = np.sqrt(np.mean(V[i0:i1] ** 2)); rb = np.sqrt(np.mean((Mu[i0:i1] * 0.26 * duck[i0:i1] + S_[i0:i1] * 0.3) ** 2))
    print(f'{nm:8s} voz/fundo {20 * np.log10(rv / (rb + 1e-9)):5.1f} dB')
print('som ok ·', DUR, 's')
