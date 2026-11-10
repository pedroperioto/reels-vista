# som.py (v2) — narração + efeitos próprios (sintetizados aqui, nada baixado, nada da Apple). Estéreo, sem música.
# Lê events.json (mesmos tempos da animação) → assets/som.wav em −14 LUFS / −1 dBTP.
import json, subprocess, re, numpy as np, scipy.io.wavfile as wf, scipy.signal as ss
from pathlib import Path
H = Path(__file__).parent; P = H.parent; SR = 48000
J = json.load(open(H / 'events.json')); C = J['C']; DUR = C['DUR']
N = int(SR * (DUR + 1)); fx = np.zeros((N, 2), np.float32); dry = np.zeros((N, 2), np.float32); rng = np.random.default_rng(11)
def env(n, a, d): tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt * d)
def bp(x, lo, hi): b, a = ss.butter(2, [lo / (SR / 2), min(hi, SR / 2 - 300) / (SR / 2)], 'band'); return ss.lfilter(b, a, x)
def put(x, at, g=1.0, pan=0.0, wet=False, pan2=None):
    i = max(0, int(round(at * SR))); x = np.asarray(x, np.float32)[: max(0, N - i)]; n = len(x)
    pp = np.full(n, pan) if pan2 is None else np.linspace(pan, pan2, n); th = (pp + 1) * np.pi / 4
    st = np.stack([x * np.cos(th), x * np.sin(th)], 1) * g * 1.414
    (fx if wet else dry)[i:i + n] += st
PIT = [1.0, 1.122, 0.891]
def tick(v=0, g=1): n = int(.028 * SR); return bp(rng.standard_normal(n), 2200 * PIT[v % 3], 7000) * env(n, .0004, 240) * .5 * g
def glass(v=0, f=2100, d=13): n = int(.34 * SR); tt = np.arange(n) / SR; f *= PIT[v % 3]; return (np.sin(2 * np.pi * f * tt) + .32 * np.sin(2 * np.pi * f * 2.76 * tt) + .12 * np.sin(2 * np.pi * f * 5.4 * tt)) * env(n, .002, d) * .2
def pop(v=0): n = int(.1 * SR); tt = np.arange(n) / SR; f = (480 + 1450 * tt / .1) * PIT[v % 3]; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, 42) * .26
def whoosh(d=.5, peak=.5, lo=500, hi=5200, rev=False):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); k = 16; sg = n // k
    for j in range(k):
        q = j / (k - 1); q = 1 - q if rev else q; f = lo * (hi / lo) ** (np.sin(np.pi * min(1, q / (2 * peak)) / 1) if q < peak else 1 - .5 * (q - peak) / (1 - peak))
        out[j * sg:(j + 1) * sg] = bp(x[j * sg:(j + 1) * sg], f * .6, f * 1.6)
    tt = np.linspace(0, 1, n); e = np.where(tt < peak, (tt / peak) ** 2, ((1 - tt) / (1 - peak)) ** 1.5); return out / (np.abs(out).max() + 1e-9) * e * .2
def riser(d=.42): n = int(d * SR); tt = np.arange(n) / SR; f = 500 * (2400 / 500) ** (tt / d); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + bp(rng.standard_normal(n), 3000, 9000) * .4) * (tt / d) ** 2.2 * .16
def impact(): n = int(.45 * SR); tt = np.arange(n) / SR; f = 70 * np.exp(-tt * 5) + 38; return (np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .003, 8) + bp(rng.standard_normal(n), 200, 1800) * env(n, .001, 60) * .25) * .85
def coin(v=0): n = int(.3 * SR); tt = np.arange(n) / SR; a, b = (3200, 4100) if v % 2 == 0 else (3450, 4420); return (np.sin(2 * np.pi * a * tt) + .8 * np.sin(2 * np.pi * b * tt)) * env(n, .001, 17) * .13 + np.pad(tick(v, .6), (0, n - int(.028 * SR)))
def notif(v=0): a = glass(0, 1318.5 * (1 if v == 0 else 1.189), 11); b = glass(0, 1975.5 * (1 if v == 0 else 1.189), 11); o = np.zeros(len(a) + int(.11 * SR)); o[:len(a)] += a; o[int(.11 * SR):] += b; return o
def slide(d=.9, f0=900, f1=900): n = int(d * SR); tt = np.arange(n) / SR; f = f0 * (f1 / f0) ** (tt / d); return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .35 + bp(rng.standard_normal(n), 1500, 5000) * .5) * np.sin(np.pi * tt / d) ** 1.5 * .1
def check(v=0): return np.concatenate([tick(v, 1.1), np.zeros(int(.035 * SR)), glass(v, 2640, 16) * .9])
def toggle(v=0): return np.concatenate([tick(v, 1.2), np.zeros(int(.045 * SR)), glass(v, 1760, 15) * .8])
log = []
for name, at, kind, pan, g, v in J['EV']:
    L = lambda what: log.append((at, name, what))
    if kind == 'notif': put(notif(v), at, g, pan, True); L('notification')
    elif kind == 'impact': put(whoosh(.3, .9, 300, 3000), at - .3, .7, 0); put(impact(), at, g, 0); L('whoosh curto + impact')
    elif kind == 'riserimpact': put(riser(.42), at - .42, .9, pan); put(impact(), at, g * .9, 0); put(pop(v), at + .01, .8, pan); L('riser + impact + pop')
    elif kind == 'riserglass': put(riser(.4), at - .4, .8, pan); put(glass(v, 2640), at, g, pan, True); L('riser + glass')
    elif kind == 'tick': put(tick(v, 1.2), at, g, pan); L('tick')
    elif kind == 'pop': put(pop(v), at, g, pan); L('pop')
    elif kind == 'glass': put(glass(v), at, g, pan, True); L('glass tap')
    elif kind == 'popglass': put(pop(v), at, g, pan); put(glass(v, 2640), at + .06, g * .8, pan, True); L('pop + glass')
    elif kind == 'toggle': put(toggle(v), at, g, pan, True); L('toggle')
    elif kind == 'check': put(check(v), at, g, pan, True); L('check')
    elif kind == 'coin': put(coin(v), at, g, pan, True); L('coin')
    elif kind == 'whoosh': d = .62; put(whoosh(d, .5), at + .3 - d / 2, g, pan, False, -pan); L('whoosh (pico no meio da transição)')
    elif kind == 'whooshpan': d = .8; put(whoosh(d, .45, 600, 6000), at, g, -.8, False, .8); L('whoosh esq→dir')
    elif kind == 'whooshrev': d = .62; put(whoosh(d, .55, 400, 4200, True), at, g, .5, False, -.7); L('whoosh fechando')
    elif kind == 'ticks5': [put(tick(k, 1), at - .04 + k * .09, g, pan + k * .1) for k in range(5)]; put(glass(1, 1568), at, g * .8, pan, True); L('5 ticks + glass grave')
    elif kind == 'ticks8': [put(tick(k, 1), at - .04 + k * .075, g, -.7 + k * .2) for k in range(10)]; L('ticks em cascata')
    elif kind == 'glass4': [put(glass(0, 1568 * [1, 1.189, 1.335, 1.498][k], 15), at + k * .085, g, [-.5, .5, -.5, .5][k], True) for k in range(4)]; L('4 glass em escala')
    elif kind == 'glass2': put(glass(0, 1760), at + .12, g, -.5, True); put(glass(0, 2093), at + .21, g, .5, True); L('2 glass')
    elif kind == 'pops4': [put(pop(k), at - .05 + k * .1, g, -.6 + k * .4) for k in range(4)]; L('4 pops')
    elif kind == 'count': [put(tick(k, .9), at - .05 + k * .075, g, pan) for k in range(6)]; put(glass(v, 2349 if v == 0 else 1760), at + .45, .9, pan, True); L('contagem (ticks) + glass')
    elif kind == 'countlong': [put(tick(k, .8), at + .05 + .95 * (k / 11) ** .6, g, -.3 + k * .05) for k in range(11)]; put(glass(v, 1760), at - .1, .6, 0, True); L('glass + ticks desacelerando')
    elif kind == 'flipcal': put(whoosh(.16, .5, 900, 4000), at - .06, .9, pan); put(tick(0, 1.4), at + .1, g, pan); put(glass(0, 1568), at + .1, .5, pan, True); L('virada de folha')
    elif kind == 'slide': put(slide(1.0, 700, 760), at - .05, g, -.6, False, .6); L('traço deslizando')
    elif kind == 'slidedown': put(slide(.95, 1500, 520), at - .03, g, -.5, False, .5); put(tick(1), at + .92, .7, .5); L('descida + tick')
    elif kind == 'slidepop': put(slide(.55, 1200, 700), at - .05, g, .6, False, 0); put(pop(1), at + .2, .8, .3); L('deslize + pop')
    elif kind == 'keys5': [put(tick(k, 1.3), at + k * .065, g, pan) for k in range(5)]; L('5 teclas')
    else: raise SystemExit('som desconhecido ' + kind)
# reverb curto (sala pequena) só nos sons de vidro/notificação
ir = rng.standard_normal((int(.28 * SR), 2)) * np.exp(-np.arange(int(.28 * SR)) / SR * 22)[:, None]; ir[:int(.006 * SR)] = 0
wet = np.stack([ss.fftconvolve(fx[:, c], ir[:, c])[:N] for c in (0, 1)], 1); wet *= .13 * np.abs(fx).max() / (np.abs(wet).max() + 1e-9) * 3
sfx = dry + fx + wet
# passa-altas 80 Hz nos efeitos (o impact já foi somado antes: preserva-se com um passa-baixas paralelo)
b, a = ss.butter(2, 80 / (SR / 2), 'high'); hp = ss.lfilter(b, a, sfx, axis=0)
imp = np.zeros((N, 2), np.float32)
for name, at, kind, pan, g, v in J['EV']:
    if kind in ('impact', 'riserimpact'): x = impact() * g * .9; i = int(at * SR); imp[i:i + len(x)] += np.stack([x, x], 1)
b2, a2 = ss.butter(2, 90 / (SR / 2), 'low'); sfx = hp + ss.lfilter(b2, a2, imp, axis=0) * .8
# voz + ducking leve dos efeitos enquanto ela fala
v = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', str(P / 'voz' / 'bruto.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
v = v / (np.abs(v).max() + 1e-9) * .9; vv = np.zeros(N, np.float32); vv[:len(v)] = v[:N]
e = np.sqrt(ss.lfilter(*ss.butter(1, 8 / (SR / 2)), vv ** 2).clip(0)); duck = 1 - .32 * np.clip(e / (e.max() * .25), 0, 1)
SFXG = float(__import__('os').environ.get('SFXG', '0.5'))
mix = np.stack([vv, vv], 1) + sfx * duck[:, None] * SFXG
mix = mix[:int(SR * DUR)]
def lufs(x):
    wf.write('/tmp/_m.wav', SR, (np.clip(x, -1, 1) * 32767).astype(np.int16))
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', '/tmp/_m.wav', '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', o)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', o)[-1])
for _ in range(3):
    I, _p = lufs(mix); mix = mix * 10 ** ((-14 - I) / 20); mix = np.tanh(mix / .89 * 1.0) * .89 if np.abs(mix).max() > .89 else mix   # limitador suave em −1 dB
I, pk = lufs(mix); Iv, _ = lufs(np.stack([vv, vv], 1)[:int(SR * DUR)] * (np.abs(mix).max() / max(1e-9, np.abs(mix).max())))
wf.write(H / 'assets' / 'som.wav', SR, (mix * 32767).astype(np.int16))
print(f'som ok · {DUR}s · integrado {I:.1f} LUFS · pico real {pk:.1f} dBTP · {len(log)} eventos')
with open(H / 'som_eventos.md', 'w') as f:
    f.write(f'# Eventos sonoros (v2)\n\nMix: {I:.1f} LUFS integrado, pico real {pk:.1f} dBTP. O ataque de cada som cai no quadro do evento visual (60 fps).\n\n| Tempo (s) | Quadro | Evento | Som |\n|---|---|---|---|\n')
    for at, name, what in sorted(log): f.write(f'| {at:.3f} | {round(at*60)} | {name} | {what} |\n')
