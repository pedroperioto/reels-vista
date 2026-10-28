# trilha.py — trilha original (84 BPM, Fá menor), mesma da parte 2, com seções presas às cenas da parte 3.
# Arranjo preso às cenas: intro abafada → auge na tensão do mercado → médio no boleto → CORTE SECO no
# "Mas o metro quadrado…" → volta clara e aberta até o fim. Gera voz/trilha.wav (mono, 48 kHz).
import json, numpy as np
from pathlib import Path
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve
HERE = Path(__file__).parent
J = json.load(open(HERE / 'voz' / 'tempos.json')); T, M = J['T'], J['M']
SR = 48000; BPM = 84; BEAT = 60 / BPM; BAR = BEAT * 4; DUR = T['DUR']; N = int(SR * (DUR + 3)); rg = np.random.default_rng(13)
tt = lambda s: np.arange(int(SR * s)) / SR
lp = lambda x, f, o=2: sosfilt(butter(o, f, 'lp', fs=SR, output='sos'), x)
hp = lambda x, f, o=2: sosfilt(butter(o, f, 'hp', fs=SR, output='sos'), x)
bp = lambda x, a, b: sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
nf = lambda m: 440 * 2 ** ((m - 69) / 12)
def put(buf, t, x, g=1.0):
    i = int(t * SR)
    if i >= len(buf) or i + len(x) <= 0: return
    a = max(0, -i); x = x[a:]; i = max(0, i); n = min(len(x), len(buf) - i); buf[i:i + n] += x[:n] * g
def saw(f, d): ph = (f * d) % 1.0; return 2 * ph - 1

# ---------- instrumentos ----------
def kick(): d = tt(0.6); f = 38 + 85 * np.exp(-d / 0.045); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d / 0.28); c = hp(rg.standard_normal(len(d)), 2500) * np.exp(-d / 0.004) * 0.4; return np.tanh((y + c) * 1.8)
def snare(): d = tt(0.5); n = bp(rg.standard_normal(len(d)), 250, 6000) * np.exp(-d / 0.09); tone = np.sin(2 * np.pi * 175 * d) * np.exp(-d / 0.06); return (n * 0.8 + tone * 0.5)
def hat(o=False): d = tt(0.25 if o else 0.06); return hp(rg.standard_normal(len(d)), 7000) * np.exp(-d / (0.08 if o else 0.012))
def bassnote(m, s, cut):
    d = tt(s); f = nf(m); x = saw(f * 0.997, d) + saw(f * 1.004, d) + np.sin(2 * np.pi * f / 2 * d) * 1.2
    env = np.minimum(1, d / 0.005) * np.exp(-d / (s * 0.55)); return np.tanh(lp(x * env, cut, 2) * 1.6)
def padchord(ms, s, cut):
    d = tt(s); x = np.zeros(len(d))
    for m in ms:
        for det in (-0.006, 0, 0.007): x += saw(nf(m) * (1 + det), d + rg.uniform(0, 1))
    env = np.minimum(1, d / 0.9) * np.minimum(1, (s - d) / 0.8); return lp(x * env, cut, 2) / (3 * len(ms))
def bell(m, s=1.6):
    d = tt(s); f = nf(m); mod = np.sin(2 * np.pi * f * 3.5 * d) * 2.2 * np.exp(-d / 0.3); return np.sin(2 * np.pi * f * d + mod) * np.exp(-d / 0.55) * 0.5
def riser(s): d = tt(s); return bp(rg.standard_normal(len(d)), 400, 6000) * (d / s) ** 2 * 0.6

# ---------- seções (presas às cenas e à fala) ----------
CUT0, CUT1 = M['apto'] - 0.06, M['naocabe'] - 0.15     # silêncio cômico em "Mas o apartamento…" (volta com a casa voando)
def sec(t):
    if t < T['TA']: return 'fim'            # o grito do filme, sem música
    if t < CUT0: return 'auge'              # partidas, busca, globo
    if t < CUT1: return 'corte'
    if t < T['CD']: return 'aberto'         # casa voando, segue o perfil
    if t < T['DE']: return 'intro'          # o prédio à noite
    if t < T['EF']: return 'auge'           # Ana vendeu na pressa
    if t < T['FG']: return 'aberto'         # Bia alugou, volta pra casa
    if t < T['GH']: return 'intro'          # apê fechado
    if t < T['END'] + 0.5: return 'aberto'  # resumo e CTA
    return 'fim'
MIN = [[53, 56, 60], [49, 53, 56], [56, 60, 63], [51, 55, 58]]           # Fm · D♭ · A♭ · E♭
BASS = [[29, 29, 41, 29, 32, 29, 39, 29], [25, 25, 37, 25, 29, 25, 36, 25], [32, 32, 44, 32, 36, 32, 39, 32], [27, 27, 39, 27, 31, 27, 34, 27]]
OPEN = [[61, 65, 68, 72], [56, 60, 63, 67], [58, 63, 67, 70], [60, 65, 68, 72]]  # D♭maj7 · A♭ · E♭/G · Fm(add9) mais aberto
MOT = [72, 68, 65, 72, 73, 72, 68, 67]
drm = np.zeros(N); bas = np.zeros(N); pad = np.zeros(N); bel = np.zeros(N); kicks = []
nb = int(DUR / BAR) + 2
for b in range(nb):
    t0 = b * BAR; ch = b % 4
    s0 = sec(t0 + 0.01)
    if s0 not in ('corte', 'fim'):
        cut = {'intro': 700, 'auge': 1400, 'medio': 1100, 'aberto': 2400}[s0]
        put(pad, t0, padchord(OPEN[ch] if s0 == 'aberto' else MIN[ch], BAR + 0.6, cut), {'intro': 0.9, 'auge': 0.7, 'medio': 0.75, 'aberto': 0.85}[s0])
    for i in range(8):
        t = t0 + i * BEAT / 2; s = sec(t)
        if s in ('corte', 'fim'): continue
        if s != 'aberto':
            put(bas, t, bassnote(BASS[ch][i], BEAT / 2 * 0.95, {'intro': 260, 'auge': 900, 'medio': 600}[s]), {'intro': 0.55, 'auge': 0.9, 'medio': 0.75}[s])
        elif i % 2 == 0:
            put(bas, t, np.sin(2 * np.pi * nf(BASS[ch][0]) * tt(BEAT)) * np.exp(-tt(BEAT) / 0.4), 0.6)
        if i % 2 == 0 and s in ('auge', 'medio', 'aberto'):
            put(drm, t, kick(), 0.95 if s != 'aberto' else 0.6); kicks.append(t)
        if i in (2, 6) and s == 'auge': put(drm, t, snare(), 0.55)
        if s in ('auge', 'aberto'): put(drm, t + BEAT / 4, hat(i % 4 == 3), 0.16 if s == 'auge' else 0.1)
        if s == 'auge' and b % 2 == 1: put(bel, t, bell(MOT[i]), 0.35)
        if s == 'aberto' and i in (0, 3, 6): put(bel, t, bell(OPEN[ch][i % 4] + 12, 2.2), 0.28)
# risers antes das grandes viradas
put(drm, CUT0 - 1.2, riser(1.2), 0.3); put(drm, T['DE'] - 1.2, riser(1.2), 0.3)
# sidechain do bumbo no grave e no pad (respiração típica do gênero)
sc = np.ones(N)
for t in kicks:
    i = int(t * SR); L = int(0.32 * SR); env = 1 - 0.6 * np.exp(-np.arange(L) / SR / 0.09); sc[i:i + L] = np.minimum(sc[i:i + L], env[:max(0, min(L, N - i))])
# reverb (IR de ruído decaindo) para pad, sinos e caixa
ir = rg.standard_normal(int(2.2 * SR)) * np.exp(-np.arange(int(2.2 * SR)) / SR / 0.6); ir = lp(ir, 5000); ir /= np.sqrt(np.sum(ir ** 2))
wet = fftconvolve(pad * 0.6 + bel + drm * 0.15, ir)[:N]
mix = bas * sc * 0.9 + pad * sc * 0.8 + bel * 0.7 + drm + wet * 0.35
# corte seco na virada e fade no fim
i0, i1 = int(CUT0 * SR), int(CUT1 * SR)
# "fita parando": nos 0,5 s antes do corte a música desacelera até zerar (tape stop de verdade)
L = int(0.5 * SR); j = np.arange(L); pos = (i0 - L) + j - j ** 2 / (2 * L); src = mix.copy()
mix[i0 - L:i0] = np.interp(pos, np.arange(len(src)), src) * np.linspace(1, 0.2, L)
mix[i0:i1] = 0; mix[i0 - 480:i0] *= np.linspace(1, 0, 480)
mix[:int(T['TA'] * SR)] = 0
fo0 = int((T['END'] + 0.5) * SR); fo1 = int(DUR * SR); mix[fo0:fo1] *= np.linspace(1, 0, fo1 - fo0) ** 1.5; mix[fo1:] = 0
# abre espaço para a voz: corta subgrave inútil e afunda um pouco os médios onde a fala vive
mix = hp(mix, 32); mid = bp(mix, 900, 3500); mix = mix - mid * 0.45
mix /= np.max(np.abs(mix)) + 1e-9
wavfile.write(str(HERE / 'voz' / 'trilha.wav'), SR, (mix[:int(SR * DUR)] * 0.95 * 32767).astype(np.int16))
print('trilha ok ·', round(DUR, 2), 's · corte', round(CUT0, 2), '→', round(CUT1, 2))
