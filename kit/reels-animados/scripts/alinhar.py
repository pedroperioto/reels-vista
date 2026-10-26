# alinhar.py — prende cada palavra do roteiro ao tempo exato em que é falada na narração.
# Uso:  python3 alinhar.py <pasta-do-projeto>
# Lê <projeto>/voz/bruto_original.wav (o WAV do Google AI Studio) e <projeto>/voz/texto.txt (o roteiro SEM as
# marcações <short pause>, só as palavras). Gera voz/bruto.wav (48 kHz, cabeçalho corrigido) e voz/palavras.json.
# Depois rode build.py e som.py do projeto.
import json, re, subprocess, sys, tempfile
from pathlib import Path
P = Path(sys.argv[1]).resolve(); V = P / 'voz'
src = V / 'bruto_original.wav'
assert src.exists(), 'coloque o WAV da narração em voz/bruto_original.wav'
# 1) o WAV do AI Studio às vezes vem com cabeçalho inválido: regrava em 48 kHz mono 16 bits
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-ar', '48000', '-ac', '1', '-c:a', 'pcm_s16le', str(V / 'bruto.wav')], check=True)
tmp = Path(tempfile.mkdtemp()); w16 = tmp / 'v16.wav'
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(src), '-ar', '16000', '-ac', '1', str(w16)], check=True)
# 2) alinhamento forçado (Echogarden, motor DTW, pt-BR). Instale uma vez: npm i -g echogarden
env = 'env -u no_proxy -u NO_PROXY -u GLOBAL_AGENT_NO_PROXY npm_config_noproxy=localhost'
subprocess.run(f'{env} npx -y echogarden align "{w16}" "{V / "texto.txt"}" "{V / "al.json"}" --language=pt-BR --engine=dtw', shell=True, check=True)
d = json.load(open(V / 'al.json')); W = []
def walk(n):
    if isinstance(n, dict):
        if n.get('type') == 'word': W.append([n['text'], round(n['startTime'], 3), round(n['endTime'], 3)]); return
        for c in n.get('timeline', []) or []: walk(c)
    elif isinstance(n, list):
        for c in n: walk(c)
walk(d)
txt = open(V / 'texto.txt').read().split()
norm = lambda s: re.sub(r'[^\wÀ-ÿ]', '', s).lower()
assert len(W) == len(txt), f'alinhador achou {len(W)} palavras e o texto tem {len(txt)}: confira se o texto.txt é exatamente o que foi narrado'
bad = [(i, a[0], b) for i, (a, b) in enumerate(zip(W, txt)) if norm(a[0]) != norm(b)]
assert not bad, f'palavras diferentes: {bad[:5]}'
json.dump([[t, a[1], a[2]] for t, a in zip(txt, W)], open(V / 'palavras.json', 'w'), ensure_ascii=False)
# 3) conferência: o fim de cada frase deve cair perto de uma pausa real do áudio
out = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(V / 'bruto.wav'), '-af', 'silencedetect=n=-38dB:d=0.3', '-f', 'null', '-'], capture_output=True, text=True).stderr
sil = [float(x) for x in re.findall(r'silence_start: ([0-9.]+)', out)]
errs = sorted([(round(W[i][2] - min(sil, key=lambda s: abs(s - W[i][2])), 2), w) for i, w in enumerate(txt) if w[-1] in '.?!:' and sil], key=lambda x: -abs(x[0]))
print('palavras alinhadas:', len(W), '· fala termina em', W[-1][2], 's')
print('maiores desvios fim-de-frase × pausa (normal até ~0,4 s; risadas/<chuckle> podem dar mais):', errs[:6])
