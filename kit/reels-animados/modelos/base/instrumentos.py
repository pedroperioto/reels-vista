# instrumentos.py — biblioteca de sons sintetizados + efeitos CC0, usada por som.py (base e claro-imposto).
# Instrumentos: kick, clap, hat, pluck, pad, bass, riser, impact. Efeitos: pop, tick, click, chime, buzz, WS (whooshes), KEYS (teclado), RC (prato reverso).
import numpy as np, glob
from pathlib import Path
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, resample_poly, fftconvolve
HERE = Path(__file__).parent; LIB = HERE / 'sfx'   # efeitos CC0 (cc0sounds, Kenney)
SR = 48000
rng = np.random.default_rng(5)
def tt(s): return np.arange(int(SR * s)) / SR
def lp(x, f, o=2): return sosfilt(butter(o, f, 'lp', fs=SR, output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, 'hp', fs=SR, output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a, b], 'bp', fs=SR, output='sos'), x)
def nf(m): return 440 * 2 ** ((m - 69) / 12)
def put(buf, t, x, g=1.0):
    i = int(t * SR)
    if i < 0: x = x[-i:]; i = 0
    m = min(len(x), len(buf) - i)
    if m > 0: buf[i:i + m] += x[:m] * g
def load(p):
    sr, x = wavfile.read(p); x = x.astype(np.float64); x = x.mean(1) if x.ndim > 1 else x; x /= (np.max(np.abs(x)) + 1e-9)
    return resample_poly(x, 160, 147) if sr == 44100 else x

# ---------------- instrumentos ----------------
def kick():
    d = tt(0.45); f = 48 + 110 * np.exp(-d / 0.045); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-d / 0.16)
    y[:int(0.004 * SR)] += rng.standard_normal(int(0.004 * SR)) * 0.5; return np.tanh(y * 1.6) * 0.9
def clap():
    d = tt(0.32); n = rng.standard_normal(len(d)); env = np.zeros(len(d))
    for k, o in enumerate((0, 0.011, 0.022)): i = int(o * SR); env[i:] += np.exp(-(d[:len(d) - i]) / (0.012 if k < 2 else 0.11))
    return bp(n * env, 900, 5200) * 0.8
def hat(open_=False):
    d = tt(0.22 if open_ else 0.06); return hp(rng.standard_normal(len(d)), 7000) * np.exp(-d / (0.07 if open_ else 0.015)) * 0.5
def pluck(f, s=0.45, bright=1.0):
    d = tt(s); y = np.zeros(len(d))
    for h, a in ((1, 1), (2, 0.45 * bright), (3, 0.22 * bright), (4, 0.12 * bright), (6, 0.05 * bright)): y += a * np.sin(2 * np.pi * f * h * d) * np.exp(-d * (5 + h * 3))
    y[:150] *= np.linspace(0, 1, 150); return y * 0.5
def pad(freqs, s):
    d = tt(s); y = np.zeros(len(d))
    for f in freqs:
        for det in (-0.12, 0.12): ph = 2 * np.pi * f * (1 + det / 100) * d; y += (2 * ((ph / (2 * np.pi)) % 1) - 1) * 0.5
    y = lp(y, 1800); a = int(0.25 * SR); env = np.ones(len(d)); env[:a] = np.linspace(0, 1, a); env[-a:] = np.linspace(1, 0, a); return y * env / len(freqs) * 0.6
def bass(f, s):
    d = tt(s); y = np.sin(2 * np.pi * f * d) + 0.3 * np.sin(2 * np.pi * 2 * f * d); env = np.minimum(1, d / 0.01) * np.exp(-d / 0.5); return np.tanh(y * env * 1.4) * 0.55
def riser(s):
    d = tt(s); f = np.geomspace(300, 5000, len(d)); n = rng.standard_normal(len(d)); y = np.zeros(len(d)); seg = 2048
    for i in range(0, len(d), seg): c = f[min(i, len(d) - 1)]; y[i:i + seg] = bp(n[i:i + seg], c * 0.7, min(c * 1.4, SR / 2 - 100))
    return y * np.linspace(0, 1, len(d)) ** 2 * 0.35
def impact():
    d = tt(1.6); sub = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-d / 0.08)) / SR) * np.exp(-d / 0.5)
    nz = lp(rng.standard_normal(len(d)), 2500) * np.exp(-d / 0.25) * 0.5; return np.tanh((sub + nz) * 1.5) * 0.8


# ---------------- efeitos ----------------

def pop(f=900, s=0.09): d = tt(s); return np.sin(2 * np.pi * np.cumsum(np.geomspace(f, f * 0.55, len(d))) / SR) * np.exp(-d / 0.03)
def tick(f=2600): d = tt(0.03); y = bp(rng.standard_normal(len(d)), f * 0.7, f * 1.3) * np.exp(-d / 0.006); return y / (np.max(np.abs(y)) + 1e-9)
def click(): y = pop(1600, 0.06) * 0.5; a = tick(3800); y[:len(a)] += a * 0.8; return y
def chime(ok=True):
    x = np.zeros(int(SR * 1.2)); notes = (76, 83, 88) if ok else (64, 63)
    for k, m in enumerate(notes): p = pluck(nf(m), 1.0, 0.8); i = int(k * 0.09 * SR); x[i:i + len(p)] += p[:len(x) - i]
    return x * (1 if ok else 0.8)
def buzz(): d = tt(0.35); y = np.sign(np.sin(2 * np.pi * 110 * d)) * np.exp(-d / 0.12); return lp(y, 1500) * 0.5
def swoosh(i): return WS[i % len(WS)]
WS = [load(f) for f in sorted(glob.glob(str(LIB / 'wooshes' / '*.wav')))]
KEYS = [load(f) for f in sorted(glob.glob(str(LIB / 'keyboard' / '*.wav')))[:12]]
RC = load(LIB / 'reverse_cymbals.wav')

