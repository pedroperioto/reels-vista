# som.py — trilha (120 BPM) + efeitos presos às palavras + narração → assets/som.wav
# Tempos vêm de voz/palavras.json e voz/tempos.json (gerado por build.py), então rode build.py antes.
import json, numpy as np, subprocess
from pathlib import Path
from scipy.io import wavfile
HERE = Path(__file__).parent; V1 = HERE.parent / 'imposto-aluguel' / 'som.py'
full = V1.read_text(); src = full.split('# acordes')[0] + '\nsfx = None\n' + full.split('# ---------------- efeitos ----------------')[1].split('# transições')[0]
ns = {'__file__': str(V1)}; exec(src, ns)
put, tt, pad, pluck, bass, nf, lp, hp, riser, impact = [ns[k] for k in ('put', 'tt', 'pad', 'pluck', 'bass', 'nf', 'lp', 'hp', 'riser', 'impact')]
pop, tick, click, chime, buzz, WS, KEYS, RC = [ns[k] for k in ('pop', 'tick', 'click', 'chime', 'buzz', 'WS', 'KEYS', 'RC')]

W = json.load(open(HERE / 'voz' / 'palavras.json')); T = json.load(open(HERE / 'voz' / 'tempos.json'))
S = lambda i: W[i][1]; E = lambda i: W[i][2]
SR, BEAT, BAR, DUR = 48000, 0.5, 2.0, T['DUR']; N = int(SR * (DUR + 2)); rg = np.random.default_rng(7)
K, CL, HC, HO = ns['kick'](), ns['clap'](), ns['hat'](), ns['hat'](True)

# ---------- trilha: Am9 · Fmaj7 · C(add9) · G6, com seções que seguem as cenas ----------
CH = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 67], [48, 55, 60, 62, 64], [55, 59, 62, 64, 67]]; BS = [45, 41, 36, 43]
def sec(t):
    if t < T['BC'] - 0.05: return 'full'          # gancho + 2027
    if t < T['CD'] - 0.05: return 'calm'          # "mas calma"
    if t < T['EF'] - 0.05: return 'build'         # luz 1 e luz 2
    if t < T['ENDV']: return 'full'               # duas luzes, exemplos, desconto, CTA
    return 'out'
mus = np.zeros(N); dr = np.zeros(N)
for b in range(int(DUR / BAR) + 1):
    t0 = b * BAR; ch = CH[b % 4]
    for i in range(4):  # pad por compasso, mas o resto decide batida a batida (cortes não caem no compasso)
        tb = t0 + i * BEAT; s = sec(tb)
        if i == 0: put(mus, t0, pad([nf(m) for m in ch[:4]], BAR + 0.3), 0.7 if s in ('calm', 'out') else 0.55)
        arp = [0, 2, 4, 2, 1, 3, 4, 3]
        for h in range(2):
            j = i * 2 + h; g = {'full': 0.24, 'build': 0.2, 'calm': 0.1, 'out': 0.12}[s]
            put(mus, tb + h * BEAT / 2, pluck(nf(ch[arp[j]] + 12), 0.4, 1.0 if s != 'calm' else 0.5), g)
        if s in ('full', 'build'): put(mus, tb, bass(nf(BS[b % 4]), 0.45), 0.6); put(dr, tb, K, 0.85)
        if s == 'full' and i in (1, 3): put(dr, tb, CL, 0.45)
        if s in ('full', 'build'):
            for h in range(2): put(dr, tb + h * BEAT / 2, HO if h else HC, (0.15 if h else 0.1) * (1 if s == 'full' else 0.8))

# ---------- efeitos presos às palavras ----------
sfx = np.zeros(N)
def thud(): d = tt(0.5); y = np.sin(2 * np.pi * np.cumsum(70 + 90 * np.exp(-d / 0.03)) / SR) * np.exp(-d / 0.12); n = lp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.04); return np.tanh((y + n * 0.8) * 2)
def bulb_on(): d = tt(0.9); return (np.sin(2 * np.pi * 880 * d) * 0.4 + np.sin(2 * np.pi * 1320 * d) * 0.25) * np.exp(-d / 0.35) + hp(rg.standard_normal(len(d)), 3000) * np.exp(-d / 0.02) * 0.4
def coin(k): d = tt(0.35); f = 2100 + 180 * (k % 3); return (np.sin(2 * np.pi * f * d) + 0.5 * np.sin(2 * np.pi * f * 2.76 * d)) * np.exp(-d / 0.08) * 0.6
def stamp(): x = thud() * 0.9; i = impact()[:len(x)]; x[:len(i)] += i * 0.5; return x
def drop(s=0.6): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(900, 160, len(d))) / SR) * np.exp(-d / (s / 2.5)) * 0.6
def neon(): d = tt(0.6); y = np.sign(np.sin(2 * np.pi * 120 * d)) * (0.6 + 0.4 * (np.sin(2 * np.pi * 23 * d) > 0)) * np.exp(-d / 0.25); return lp(y, 2200) * 0.5

put(sfx, 0.0, WS[5 % len(WS)], 0.35); put(sfx, 0.05, pop(700, 0.1), 0.35)                       # pergunta aparece
put(sfx, S(3), pop(1100, 0.08), 0.25)                                                           # "Então…"
put(sfx, S(11) - 0.15, pop(900, 0.1), 0.45)                                                     # pílula do ano
for k in range(4): put(sfx, S(11) - 0.1 + k * (S(18) - S(11)) / 3.3, tick(2600 + 300 * (k % 2)), 0.5)  # 2023→2026
put(sfx, S(18), thud(), 0.55)                                                                   # sublinha 2026
put(sfx, T['AB'] - 0.4, WS[2], 0.5)                                                             # pílula vira chão
put(sfx, S(21) - 0.05, WS[0], 0.4); put(sfx, S(21) + 0.5, thud(), 0.6)                          # 2027 cai
put(sfx, S(33) - 0.15, WS[4], 0.45)                                                             # calendários deslizam
put(sfx, S(35), riser(0.4), 0.22)                                                               # seta desenha
put(sfx, S(39), chime(True), 0.22)                                                              # brilho em 2026
for k in range(6): put(sfx, S(40) + k * 0.08 + 0.3, coin(k), 0.35)                              # moedas caem
put(sfx, T['BC'] - 0.55, RC[-int(0.5 * SR):], 0.3); put(sfx, T['BC'] - 0.1, WS[1], 0.45)        # inundação navy
put(sfx, S(42), pop(420, 0.15), 0.4); put(sfx, S(43), pop(380, 0.15), 0.4)                      # "Mas calma."
put(sfx, S(44), pop(800, 0.08), 0.25)
put(sfx, S(48) + 0.35, drop(), 0.4); put(sfx, S(50) + 0.35, drop(), 0.4)                        # lâmpadas descem
put(sfx, T['CD'] - 0.35, riser(0.35), 0.3); put(sfx, T['CD'] - 0.15, WS[3], 0.55)               # zoom pela lâmpada
put(sfx, S(52), impact(), 0.25)                                                                 # LUZ 1
for k in range(4): put(sfx, S(58) + k * (S(60) - S(58)) / 3, pop(700 + 160 * k, 0.08), 0.45)   # casas 1-4
put(sfx, S(60) + 0.1, bulb_on(), 0.75)                                                          # luz 1 acende
put(sfx, T['DE'] - 0.25, WS[6 % len(WS)], 0.5)                                                  # vira para luz 2
put(sfx, S(64), impact(), 0.2)
n_t = int((E(73) - S(70)) / 0.07)
for k in range(n_t): put(sfx, S(70) + k * 0.07 * (1 + k / n_t * 0.6), tick(3000 + 200 * (k % 3)), 0.35)  # contador R$
put(sfx, E(73), coin(1), 0.45)
put(sfx, S(78), pop(1200, 0.08), 0.35)                                                          # chip "somando"
put(sfx, S(79) + 0.15, bulb_on(), 0.75)                                                         # luz 2 acende
put(sfx, T['EF'] - 0.1, WS[1], 0.35)
put(sfx, S(86), bulb_on(), 0.6); put(sfx, S(86) + 0.18, bulb_on(), 0.6)                         # as DUAS
put(sfx, S(87) + 0.1, neon(), 0.6); put(sfx, S(87) + 0.1, impact(), 0.3)                        # placa IMPOSTO liga
put(sfx, T['FG'] - 0.3, WS[2], 0.5)                                                             # sobe para os exemplos
put(sfx, S(91) - 0.02, stamp(), 0.65)                                                           # NÃO PAGA
put(sfx, S(93) - 0.2, WS[0], 0.3)
put(sfx, S(94) + 0.1, bulb_on(), 0.6)                                                           # 5 imóveis acende
put(sfx, S(98) + 0.1, buzz(), 0.35)                                                             # luz 2 falha
put(sfx, S(99) - 0.02, stamp(), 0.65)                                                           # TAMBÉM NÃO
put(sfx, T['GH'] - 0.25, WS[4], 0.5)
put(sfx, S(108) - 0.05, stamp(), 0.6); put(sfx, S(108) + 0.15, drop(0.7), 0.4)                  # −70% e barra encolhe
put(sfx, S(110), chime(True), 0.25)
put(sfx, T['HI'] - 0.1, WS[3], 0.45)                                                            # calculadora
put(sfx, S(118) - 0.25, pop(900, 0.1), 0.4)                                                     # cartão de comentários
for k in range(5): put(sfx, S(119) + k * max(0.3, E(119) - S(119)) / 5, KEYS[k % len(KEYS)], 0.5)  # digita CONTA
put(sfx, E(119) + 0.08, click(), 0.6); put(sfx, E(119) + 0.15, pop(1500, 0.08), 0.4)            # envia
put(sfx, S(123) - 0.1, chime(True), 0.4)                                                        # chega no direct
put(sfx, T['ENDV'] - 0.25, WS[5 % len(WS)], 0.4); put(sfx, T['ENDV'], impact(), 0.3)            # cartão final

# ---------- mixagem: voz na frente, música abaixa quando ela fala ----------
sr, v = wavfile.read(str(HERE / 'voz' / 'bruto.wav')); v = v.astype(np.float64); v = v if v.ndim == 1 else v.mean(1)
assert sr == SR; v /= np.max(np.abs(v)); V = np.zeros(N); V[:len(v)] = v
env = lp(np.abs(V), 8); env /= np.max(env); duck = 1 - 0.5 * np.clip(env / 0.15, 0, 1)
n = int(SR * DUR); M = (hp(mus, 35) + dr * 0.9)[:n]; Sx = sfx[:n]; V = V[:n]; duck = duck[:n]
M /= np.max(np.abs(M)); Sx /= np.max(np.abs(Sx))
fo = int(1.6 * SR); M[-fo:] *= np.linspace(1, 0, fo) ** 1.5; fi = int(0.3 * SR); Sx[-fi:] *= np.linspace(1, 0, fi)
mix = V * 1.0 + M * 0.2 * duck + Sx * 0.32
mix /= np.max(np.abs(mix))
stx = np.stack([mix, np.r_[np.zeros(300), mix[:-300]] * 0.2 + mix * 0.8], 1)
wavfile.write(str(HERE / 'voz' / 'som_bruto.wav'), SR, (stx * 0.89 * 32767).astype(np.int16))
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(HERE / 'voz' / 'som_bruto.wav'), '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', str(SR), str(HERE / 'assets' / 'som.wav')], check=True)
print('som ok ·', DUR, 's')
