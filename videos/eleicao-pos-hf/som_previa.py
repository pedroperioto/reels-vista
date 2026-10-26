# som_previa.py — trilha + efeitos da prévia de 15 s (pós-eleição) → assets/som_previa.wav
import numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; V1 = HERE.parent / 'imposto-aluguel' / 'som.py'
full = V1.read_text(); src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(V1)}; exec(src, ns)
put, tt, pad, pluck, bass, nf, lp, hp, bp, riser, impact = [ns[k] for k in ('put', 'tt', 'pad', 'pluck', 'bass', 'nf', 'lp', 'hp', 'bp', 'riser', 'impact')]
pop, tick, click, chime, buzz, WS = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'buzz', 'WS')]
SR, BEAT, BAR, DUR = 48000, 0.5, 2.0, 15.0; N = int(SR * (DUR + 2)); rg = np.random.default_rng(3)
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)

# trilha noturna com tensão: Dm · B♭ · F · A (120 BPM), entra o beat depois do placar
CH = [[50, 57, 62, 65, 69], [46, 53, 58, 62, 65], [41, 48, 53, 57, 60], [45, 52, 57, 61, 64]]; BS = [38, 34, 41, 33]
mus = np.zeros(N); dr = np.zeros(N)
for b in range(8):
    t0 = b * BAR; ch = CH[b % 4]
    put(mus, t0, pad([nf(m + 12) for m in ch[:4]], BAR + 0.3), 0.6)
    for i in range(8): put(mus, t0 + i * BEAT / 2, pluck(nf(ch[[0, 2, 4, 2, 1, 3, 4, 3][i]] + 12), 0.35, 0.9), 0.16 if t0 < 3.6 else 0.22)
    for i in range(4):
        tb = t0 + i * BEAT
        if tb >= 3.6: put(mus, tb, bass(nf(BS[b % 4]), 0.45), 0.6); put(dr, tb, K, 0.8)
        if tb >= 3.6 and i in (1, 3): put(dr, tb, CL, 0.4)
        for h in range(2): put(dr, tb + h * BEAT / 2, HO if h else HC, 0.12 if h else 0.08)

sfx = np.zeros(N)
def crackle(s=0.7):
    x = np.zeros(int(SR * s))
    for k in range(40):
        i = int(rg.uniform(0, s - 0.03) * SR); y = tick(rg.uniform(1800, 5000)); x[i:i + len(y)] += y * rg.uniform(0.2, 0.7)
    return x * np.exp(-np.arange(len(x)) / SR / (s / 2))
def boom(): d = tt(0.6); n = lp(rg.standard_normal(len(d)), 900) * np.exp(-d / 0.12); y = np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-d / 0.05)) / SR) * np.exp(-d / 0.2); return np.tanh((n * 1.5 + y) * 1.5)
def whistle(s=0.35): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 2600, len(d))) / SR) * (1 - d / s) * 0.4
def swish(s=0.5): d = tt(s); n = bp(rg.standard_normal(len(d)), 600, 3000); return n * np.sin(np.pi * d / s) ** 2 * 0.6
def tvoff(): d = tt(0.35); return np.sin(2 * np.pi * np.cumsum(np.geomspace(1400, 90, len(d))) / SR) * np.exp(-d / 0.12) * 0.6
def ding(): d = tt(1.4); return (np.sin(2 * np.pi * 1318.5 * d) * 0.5 + np.sin(2 * np.pi * 2637 * d) * 0.15) * np.exp(-d / 0.5)
def door(s=0.55): d = tt(s); return lp(rg.standard_normal(len(d)), 500) * np.sin(np.pi * d / s) * 0.8
def slap(): d = tt(0.18); return hp(rg.standard_normal(len(d)), 900) * np.exp(-d / 0.025)

put(sfx, 0.05, riser(2.4), 0.2); put(sfx, 0.15, pop(700, 0.1), 0.3)
put(sfx, 2.35, pop(1100, 0.08), 0.4); put(sfx, 2.95, pop(900, 0.08), 0.4)
put(sfx, 3.25, WS[2], 0.55); put(sfx, 3.62, impact(), 0.35)
for k in range(9): put(sfx, 4.45 + k * 0.1, tick(2800), 0.3)
for k in range(9): put(sfx, 5.25 + k * 0.1, tick(2400), 0.3)
put(sfx, 6.15, WS[0], 0.4)
for i in range(3): t0 = 6.6 + i * 0.32; put(sfx, t0 - 0.25, whistle(0.25), 0.4); put(sfx, t0, boom(), 0.55); put(sfx, t0 + 0.05, crackle(0.7), 0.4)
put(sfx, 7.65, swish(0.55), 0.6)
put(sfx, 8.25, swish(0.45), 0.7); put(sfx, 8.8, swish(0.5), 0.6)
put(sfx, 9.0, click(), 0.5); put(sfx, 9.05, riser(1.0), 0.3); put(sfx, 10.0, impact(), 0.5)
put(sfx, 10.22, pop(900, 0.1), 0.5); put(sfx, 10.92, pop(1100, 0.1), 0.5)
put(sfx, 11.5, tvoff(), 0.7)
for k in range(9): put(sfx, 11.85 + k * 0.1, tick(3200), 0.25)
put(sfx, 12.75, ding(), 0.5); put(sfx, 12.8, door(0.55), 0.6)
put(sfx, 13.5, WS[4], 0.45); put(sfx, 13.95, slap(), 0.7); put(sfx, 14.1, slap(), 0.7); put(sfx, 14.15, impact(), 0.45)

n = int(SR * DUR); M = (hp(mus, 35) + dr * 0.9)[:n]; S = sfx[:n]
M /= np.max(np.abs(M)); S /= np.max(np.abs(S))
fo = int(0.6 * SR); M[-fo:] *= np.linspace(1, 0, fo); S[-fo:] *= np.linspace(1, 0.3, fo)
mix = M * 0.55 + S * 0.6; mix /= np.max(np.abs(mix))
st = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.2 + mix * 0.8], 1)
(HERE / 'voz').mkdir(exist_ok=True)
wavfile.write(str(HERE / 'voz' / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(HERE / 'voz' / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(HERE / 'assets' / 'som_previa.wav')], check=True)
print('ok')
