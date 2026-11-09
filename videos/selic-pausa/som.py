# som.py — narração + efeitos próprios no estilo Apple (sintetizados aqui; nenhum som original da Apple). Sem música (entra pelo app).
import json, numpy as np, subprocess, scipy.io.wavfile as wf, scipy.signal as ss
from pathlib import Path
H = Path(__file__).parent; SR = 48000
W = json.load(open(H / 'voz' / 'palavras.json')); T = json.load(open(H / 'voz' / 'tempos.json'))
t = lambda i: W[i][1]
DUR = T['END']; mix = np.zeros(int(SR * (DUR + 0.5)), np.float32); rng = np.random.default_rng(7)
def put(x, at, g=1.0):
    i = max(0, int(at * SR)); x = x[: max(0, len(mix) - i)]; mix[i:i + len(x)] += x * g
def env(n, a, d): tt = np.arange(n) / SR; return np.minimum(1, tt / a) * np.exp(-tt * d)
def glass(f=2400, g=0.22):   # toque de vidro: senoide brilhante com harmônico, cauda curta
    n = int(0.35 * SR); tt = np.arange(n) / SR
    return ((np.sin(2*np.pi*f*tt) + 0.35*np.sin(2*np.pi*f*2.76*tt)) * env(n, 0.002, 14) * g).astype(np.float32)
def click(g=0.18):            # clique seco de tecla
    n = int(0.03 * SR); b, a = ss.butter(2, [2000/(SR/2), 7000/(SR/2)], 'band')
    return (ss.lfilter(b, a, rng.standard_normal(n)) * env(n, 0.0005, 260) * g * 3).astype(np.float32)
def swoosh(d=0.35, g=0.16):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); k = 12; sg = n // k
    for j in range(k):
        f = 600 * (5000/600) ** (j/(k-1)); b, a = ss.butter(2, [f*0.6/(SR/2), min(f*1.5, SR/2-200)/(SR/2)], 'band'); out[j*sg:(j+1)*sg] = ss.lfilter(b, a, x[j*sg:(j+1)*sg])
    return (out / (np.abs(out).max()+1e-9) * np.sin(np.linspace(0, np.pi, n))**2 * g).astype(np.float32)
def notif(g=0.2):             # duas notas suaves subindo
    a = glass(1318.5, g); b = glass(1975.5, g); out = np.zeros(len(a) + int(0.11*SR), np.float32); out[:len(a)] += a; out[int(0.11*SR):] += b; return out
def popb(g=0.25):
    n = int(0.09 * SR); tt = np.arange(n) / SR; f = 500 + 1400 * tt / 0.09
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.001, 45) * g).astype(np.float32)
def thud(g=0.6):              # batida grave abafada
    n = int(0.5 * SR); tt = np.arange(n) / SR; f = 70 * np.exp(-tt*4) + 38
    return (np.sin(2*np.pi*np.cumsum(f)/SR) * env(n, 0.003, 7) * g).astype(np.float32)
def toggle(g=0.2): return np.concatenate([click(g), np.zeros(int(0.04*SR), np.float32), glass(1800, g*0.6)])
v = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', str(H/'voz'/'bruto.wav'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32).copy()
put(v / (np.abs(v).max()+1e-9) * 0.95, 0)
CUT = [t(18)-0.15, t(38)-0.15, t(45)-0.15, t(70)-0.15, t(80)-0.15, t(99)-0.15, t(113)-0.15, t(135)-0.15, T['END0']]
for c in CUT: put(swoosh(), c - 0.15)
put(notif(0.18), 0.12); put(thud(0.7), t(3) - 0.1); put(glass(2000, 0.15), t(8))
for i in range(6): put(click(0.16), CUT[0] + 0.2 + i*0.33)
put(thud(0.45), t(22)); put(glass(2200), t(33))
put(toggle(), t(43)); put(toggle(), t(44) + 0.35)
put(glass(), CUT[2] + 0.05)
for k in range(10): put(click(0.12), t(48) - 0.1 + k*0.07)
for k in range(12): put(click(0.12), t(66) - 0.1 + k*0.075)
put(glass(2600, 0.2), t(66) + 0.3)
put(popb(0.3), CUT[3] + 0.05)
put(glass(), CUT[4] + 0.05); put(glass(2600, 0.18), t(87))
for k in range(10): put(click(0.12), t(95) - 0.1 + k*0.08)
put(glass(2600, 0.18), t(97))
for k in range(30): put(click(0.08), t(104) - 0.2 + 3.0 * (k/30) ** 0.6)
put(thud(0.5), t(111) - 0.05); put(glass(1600, 0.2), t(111))
put(glass(), t(117)); put(swoosh(0.3, 0.2), t(124)); put(glass(2600), t(129)); put(popb(0.3), t(134))
put(popb(0.3), t(135) + 0.1)
for k in range(5): put(click(0.14), t(141) - 0.2 + k*0.08)
put(notif(0.22), t(143) + 0.2)
put(popb(0.35), T['END0'] + 1.42)
mix = mix[:int(SR*DUR)]; mix /= max(1.0, np.abs(mix).max()/0.95)
wf.write(H/'assets'/'som.wav', SR, (mix*32767).astype(np.int16)); print('som ok', DUR)
