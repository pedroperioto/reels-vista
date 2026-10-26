# trilha + efeitos da prévia HyperFrames (15 s, 120 BPM) → assets/som.wav
import numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; V1 = HERE.parent / 'imposto-aluguel' / 'som.py'
full = V1.read_text(); src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(V1)}; exec(src, ns)
put, tt, pad, pluck, bass, nf, lp, hp, bp, riser, impact = [ns[k] for k in ('put', 'tt', 'pad', 'pluck', 'bass', 'nf', 'lp', 'hp', 'bp', 'riser', 'impact')]
pop, tick, click, chime, WS, KEYS, RC = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'WS', 'KEYS', 'RC')]
SR, BEAT, BAR, DUR = 48000, 0.5, 2.0, 15.0; N = int(SR * (DUR + 1)); rg = np.random.default_rng(1)
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67]]; BS = [45, 41, 36, 43]
mus = np.zeros(N); dr = np.zeros(N)
for b in range(8):
    t0 = b * BAR; ch = CH[b % 4]; calm = 8.6 <= t0 + 0.1 < 12.2
    put(mus, t0, pad([nf(m) for m in ch[:4]], BAR + 0.3), 0.55 if not calm else 0.7)
    for i in range(8): put(mus, t0 + i * BEAT / 2, pluck(nf(ch[[0, 2, 4, 2, 1, 3, 4, 3][i]] + 12), 0.4, 1.0 if not calm else 0.5), 0.24 if not calm else 0.12)
    if not calm:
        for i in range(4): put(mus, t0 + i * BEAT, bass(nf(BS[b % 4]), 0.45), 0.6); put(dr, t0 + i * BEAT, K, 0.85 if b else (0.85 if i >= 2 else 0))
        if b: put(dr, t0 + BEAT, CL, 0.5); put(dr, t0 + 3 * BEAT, CL, 0.5)
        for i in range(8): put(dr, t0 + i * BEAT / 2, HO if i % 2 else HC, 0.16 if i % 2 else 0.1)
sfx = np.zeros(N)
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def roll(): x = np.zeros(int(SR * 0.7))
for i in range(6): pass
def clickroll():
    x = np.zeros(int(SR * 0.65))
    for k in range(6): y = tick(2400 + 300 * (k % 2)); i = int(k * 0.1 * SR); x[i:i + len(y)] += y[:len(x) - i]
    return x
def bulb_on(): d = tt(0.9); return (np.sin(2 * np.pi * 880 * d) * 0.4 + np.sin(2 * np.pi * 1320 * d) * 0.25) * np.exp(-d / 0.35) + hp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.02) * 0.4
put(sfx, 0.0, WS[5 % len(WS)], 0.4); put(sfx, 0.02, pop(700, 0.1), 0.4)
put(sfx, 1.2, pop(1100, 0.08), 0.3); put(sfx, 1.95, thud(), 0.6); put(sfx, 2.0, clickroll(), 0.45); put(sfx, 2.7, pop(1300, 0.08), 0.4)
put(sfx, 3.0, riser(0.4), 0.3); put(sfx, 3.3, WS[2], 0.6)
put(sfx, 3.8, WS[0], 0.4); put(sfx, 4.35, thud(), 0.6)
put(sfx, 6.05, WS[4], 0.5); put(sfx, 6.6, riser(0.45), 0.25)
for i in range(6): put(sfx, 7.3 + i * 0.09 + 0.3, tick(3000 + 200 * (i % 3)), 0.4)
put(sfx, 8.45, RC[-int(0.5 * SR):], 0.35); put(sfx, 8.55, WS[1], 0.4)
put(sfx, 9.0, chime(True), 0.3)
put(sfx, 11.0, pop(400, 0.15), 0.5); put(sfx, 11.15, pop(380, 0.15), 0.5)
put(sfx, 11.9, riser(0.35), 0.3); put(sfx, 12.2, WS[3], 0.6)
for i in range(4): put(sfx, 13.1 + i * 0.2, pop(800 + 150 * i, 0.08), 0.5)
put(sfx, 13.85, bulb_on(), 0.8); put(sfx, 13.85, impact(), 0.3)
n = int(SR * DUR); M = hp(mus, 35) + dr * 0.9; M = M[:n]; S = sfx[:n]
fo = int(0.5 * SR); M[-fo:] *= np.linspace(1, 0, fo); S[-fo:] *= np.linspace(1, 0, fo)
M /= np.max(np.abs(M)); S /= np.max(np.abs(S)); mix = M * 0.7 + S * 0.55; mix /= np.max(np.abs(mix))
st = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.25 + mix * 0.75], 1)
wavfile.write(str(HERE / 'assets' / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(HERE / 'assets' / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(HERE / 'assets' / 'som.wav')], check=True); print('ok')
