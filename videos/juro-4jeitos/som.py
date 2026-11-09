# som.py — narração + efeitos próprios no estilo Apple (sintetizados aqui). Sem música (entra pelo app).
import json, numpy as np, subprocess, scipy.io.wavfile as wf, scipy.signal as ss
from pathlib import Path
H = Path(__file__).parent; SR = 48000
W = json.load(open(H / 'voz' / 'palavras.json')); T = json.load(open(H / 'voz' / 'tempos.json'))
t = lambda i: W[i][1]
DUR = T['END']; mix = np.zeros(int(SR * (DUR + 0.5)), np.float32); rng = np.random.default_rng(11)
def put(x, at, g=1.0):
    i = max(0, int(at * SR)); x = x[: max(0, len(mix) - i)]; mix[i:i + len(x)] += x * g
def env(n, a, d): tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt * d)
def glass(f=2400, g=0.2):
    n = int(0.35 * SR); tt = np.arange(n) / SR
    return ((np.sin(2*np.pi*f*tt) + 0.35*np.sin(2*np.pi*f*2.76*tt)) * env(n, 0.002, 14) * g).astype(np.float32)
def click(g=0.15):
    n = int(0.03 * SR); b, a = ss.butter(2, [2000/(SR/2), 7000/(SR/2)], 'band')
    return (ss.lfilter(b, a, rng.standard_normal(n)) * env(n, 0.0005, 260) * g * 3).astype(np.float32)
def swoosh(d=0.35, g=0.16, f0=600, f1=5000):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); k = 12; sg = n // k
    for j in range(k):
        f = f0 * (f1/f0) ** (j/(k-1)); b, a = ss.butter(2, [f*0.6/(SR/2), min(f*1.5, SR/2-200)/(SR/2)], 'band'); out[j*sg:(j+1)*sg] = ss.lfilter(b, a, x[j*sg:(j+1)*sg])
    return (out / (np.abs(out).max()+1e-9) * np.sin(np.linspace(0, np.pi, n))**2 * g).astype(np.float32)
def notif(g=0.2):
    a = glass(1318.5, g); b = glass(1975.5, g); out = np.zeros(len(a) + int(0.11*SR), np.float32); out[:len(a)] += a; out[int(0.11*SR):] += b; return out
def popb(g=0.25):
    n = int(0.09 * SR); tt = np.arange(n) / SR; f = 500 + 1400 * tt / 0.09
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.001, 45) * g).astype(np.float32)
def thud(g=0.5):
    n = int(0.5 * SR); tt = np.arange(n) / SR; f = 70 * np.exp(-tt*4) + 38
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.003, 7) * g).astype(np.float32)
def coin(g=0.18): return glass(3200, g) + np.pad(glass(4100, g*0.6), (0, 0))[:int(0.35*SR)]
v = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', str(H/'voz'/'bruto.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
put(v / (np.abs(v).max()+1e-9) * 0.95, 0)
C2, C3, C4, C5, C6, C7, C8 = t(25)-0.25, t(63)-0.2, t(71)-0.2, t(98)-0.25, t(122)-0.2, t(140)-0.2, t(156)-0.2
put(notif(0.18), 0.1); put(swoosh(0.3, 0.14), t(2) - 0.3); put(thud(0.7), t(2) - 0.05)
put(swoosh(0.3, 0.12), t(5) - 0.25); put(popb(0.3), t(19) - 0.1); put(glass(2600, 0.15), t(19) + 0.25)
for i in range(4): put(click(0.16), t(23) - 0.12 + i*0.07)
put(swoosh(0.5, 0.2, 300, 3000), C2 - 0.4); put(thud(0.35), C2 + 0.1)
put(glass(), C2 + 0.35); put(glass(2200), C2 + 0.5); put(glass(2000, 0.15), C2 + 0.7)
for k in range(6): put(click(0.12), t(38) - 0.1 + k*0.08)
for k in range(6): put(click(0.12), t(46) - 0.1 + k*0.08)
for k in range(10): put(click(0.1), t(50) + k*0.08)
put(popb(0.35), t(56) - 0.05); put(thud(0.35), t(56))
put(swoosh(0.55, 0.24, 400, 6000), C3 - 0.35); put(popb(0.25), t(65))
put(swoosh(0.4, 0.2, 5000, 500), C4 - 0.3)
put(glass(), t(74) - 0.2); put(glass(2200), t(76) - 0.15); put(popb(0.25), t(77))
for i in range(3): put(coin(), t(85) + 0.6 + i*0.1)
put(glass(2600, 0.15), t(87)); put(notif(0.15), t(92)); put(thud(0.3), t(94))
put(swoosh(0.4, 0.16, 300, 2500), C5 - 0.3); put(glass(), C5 + 0.15)
put(swoosh(1.5, 0.08, 2000, 800), t(104) - 0.1)
put(glass(2400, 0.16), t(115)); put(thud(0.3), t(116))
put(swoosh(0.35, 0.24, 800, 7000), C6 - 0.3); put(glass(), C6 + 0.2)
put(popb(0.3), t(131) - 0.1); put(swoosh(0.9, 0.12, 900, 2600), t(132)); put(notif(0.16), t(138)); put(thud(0.3), t(139))
put(swoosh(0.45, 0.22, 300, 4000), C7 - 0.35); put(popb(0.35), t(142) - 0.1)
for k in range(16): put(click(0.07), t(144) + k*0.05)
put(glass(), t(151) - 0.15); put(swoosh(0.8, 0.08, 1500, 700), t(153)); put(thud(0.3), t(155))
put(swoosh(0.4, 0.18), C8 - 0.3)
for k in range(5): put(click(0.14), t(158) - 0.25 + k*0.07)
put(notif(0.22), t(160)); put(glass(2000, 0.15), t(163))
put(swoosh(0.35, 0.15), T['END0'] - 0.2); put(popb(0.35), T['END0'] + 1.42)
mix = mix[:int(SR*DUR)]; mix /= max(1.0, np.abs(mix).max()/0.95)
wf.write(H/'assets'/'som.wav', SR, (mix*32767).astype(np.int16)); print('som ok', DUR)
