# Trilha + efeitos da prévia (10 s, 120 BPM) — reaproveita os instrumentos do som.py da v1
import numpy as np, glob, subprocess, importlib.util, sys
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; OUT = HERE / 'out'
# carrega só as funções do som.py da v1 (sem rodar a montagem)
full = (HERE.parent / 'imposto-aluguel' / 'som.py').read_text(); src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(HERE.parent / 'imposto-aluguel' / 'som.py')}; exec(src, ns); g = type('G', (), ns)
SR, BEAT, BAR, DUR = 48000, 0.5, 2.0, 10.0; N = int(SR * (DUR + 1))
put, tt, pad, pluck, bass, nf, lp, hp, riser, impact = ns['put'], ns['tt'], ns['pad'], ns['pluck'], ns['bass'], ns['nf'], ns['lp'], ns['hp'], ns['riser'], ns['impact']
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67], [57, 60, 64, 67, 71]]; BS = [45, 41, 36, 43, 45]
mus = np.zeros(N); dr = np.zeros(N)
for b in range(5):
    t0 = b * BAR; ch = CH[b]
    put(mus, t0, pad([nf(m) for m in ch[:4]], BAR + 0.3), 0.5)
    for i in range(8): put(mus, t0 + i * BEAT / 2, pluck(nf(ch[[0, 2, 4, 2, 1, 3, 4, 3][i]] + 12), 0.4, 1.1), 0.28 if b else 0.18)
    if b >= 1:
        for i in range(4): put(mus, t0 + i * BEAT, bass(nf(BS[b]), 0.45), 0.7)
    full = b in (1, 2, 3)
    for i in range(4):
        if b == 0 and i < 3: continue
        if b == 4 and i > 0: continue
        put(dr, t0 + i * BEAT, K, 0.95)
    if full:
        put(dr, t0 + BEAT, CL, 0.6); put(dr, t0 + 3 * BEAT, CL, 0.6)
        for i in range(8): put(dr, t0 + i * BEAT / 2, HO if i % 2 else HC, 0.2 if i % 2 else 0.13)
put(mus, 8.5, pad([nf(m) for m in CH[0][:4]], 2.0), 0.7)
sfx = np.zeros(N); pop, tick, click, chime = ns['pop'], ns['tick'], ns['click'], ns['chime']
WS = ns['WS']; KEYS = ns['KEYS']
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(np.random.default_rng(2).standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def blip(f): d = tt(0.14); return (np.sin(2 * np.pi * f * d) * np.exp(-d / 0.05) + 0.6 * np.sin(2 * np.pi * f * 1.5 * d) * np.exp(-(d - 0.06).clip(0) / 0.05) * (d > 0.06))
put(sfx, 0.05, WS[1], 0.45)                         # boleto sobe
put(sfx, 1.0, pop(900, 0.1), 0.4)                   # NOVO
put(sfx, 1.38 - 0.6, riser(0.6), 0.3); put(sfx, 1.5, thud(), 0.9); put(sfx, 1.5, impact(), 0.5)   # carimbo
put(sfx, 2.6, WS[3], 0.55); put(sfx, 2.6, riser(0.45), 0.35)   # mergulho
put(sfx, 3.85, pop(700), 0.5); put(sfx, 4.15, pop(820), 0.4); put(sfx, 4.45, pop(980), 0.5)  # IBS + CBS
put(sfx, 4.9, chime(True), 0.3)
put(sfx, 5.0, WS[0], 0.4)                           # celular sobe
for i in range(5): put(sfx, 5.5 + i * 0.5, blip(1200 + 120 * (i % 3)), 0.45)
put(sfx, 7.6, riser(0.9), 0.45); put(sfx, 8.5, impact(), 0.8); put(sfx, 9.0, pop(1100), 0.4)
M = hp(mus, 35) + dr * 0.9; n = int(SR * DUR); M = M[:n]; S = sfx[:n]
fo = int(0.4 * SR); M[-fo:] *= np.linspace(1, 0, fo); S[-fo:] *= np.linspace(1, 0, fo)
M /= np.max(np.abs(M)); S /= np.max(np.abs(S)); mix = M * 0.75 + S * 0.55; mix /= np.max(np.abs(mix))
st = np.stack([mix, np.r_[np.zeros(400), mix[:-400]] * 0.3 + mix * 0.7], 1)
wavfile.write(str(OUT / 'som_bruto.wav'), SR, (st * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(OUT / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(OUT / 'som.wav')], check=True); print('ok')
