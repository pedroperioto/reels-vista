"""Troca o parágrafo do conselho 4 na voz. Uso: python3 trocar_trecho.py <novo_trecho.wav>
Parte de voz_base.wav/palavras_base.json, alinha o trecho novo (Echogarden/DTW) e grava voz.wav, palavras.json e tempos.js."""
import sys, json, subprocess, numpy as np, scipy.io.wavfile as w, re
NOVO = 'Quarto: com estoque alto, quem tem poder de negociar é você. Em São Paulo, os imóveis de médio e alto padrão venderam dezoito por cento menos em doze meses. No ritmo atual, levaria treze meses pra vender tudo o que está à venda. Há dois anos, eram sete meses.'
AL = '/home/claude/tools-align'
sr, base = w.read('voz_base.wav'); W = json.load(open('palavras_base.json'))
i0 = next(i for i, x in enumerate(W) if x[0].startswith('Quarto')); i1 = next(i for i in range(i0, len(W)) if W[i][0].startswith('sete') and W[i + 1][0].startswith('Quinto'))
c0 = (W[i0 - 1][2] + W[i0][1]) / 2; c1 = (W[i1][2] + W[i1 + 1][1]) / 2
# trecho novo: 24 kHz mono, sem silêncio nas pontas
subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', sys.argv[1], '-ac', '1', '-ar', str(sr), '-c:a', 'pcm_s16le', '/tmp/claude-0/novo.wav'], check=True)
_, nv = w.read('/tmp/claude-0/novo.wav'); x = nv.astype(float) / 32768; hop = sr // 100; n = len(x) // hop
db = 20 * np.log10(np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1)) + 1e-9); on = np.where(db > -40)[0]
a, b = max(0, on[0] - 8) * hop, min(len(nv), (on[-1] + 12) * hop); nv = nv[a:b]
pad0, pad1 = int((W[i0][1] - c0) * sr), int((c1 - W[i1][2]) * sr)
seg = np.concatenate([np.zeros(pad0, np.int16), nv, np.zeros(pad1, np.int16)])
w.write('/tmp/claude-0/novo_corte.wav', sr, nv); open('/tmp/claude-0/novo.txt', 'w').write(NOVO)
subprocess.run(['npx', 'echogarden', 'align', '/tmp/claude-0/novo_corte.wav', '/tmp/claude-0/novo.txt', '/tmp/claude-0/novo.json', '--language=pt-BR', '--engine=dtw'], cwd=AL, check=True, capture_output=True)
J = json.load(open('/tmp/claude-0/novo.json')); NW = []
def walk(e):
    if e.get('type') == 'word': NW.append([e['text'], e['startTime'], e['endTime']])
    for c in e.get('timeline', []) or []: walk(c)
for e in (J['timeline'] if isinstance(J, dict) else J): walk(e)
assert len(NW) == len(NOVO.split()), (len(NW), len(NOVO.split()))
off = c0 + pad0 / sr; NW = [[t, round(s + off, 3), round(e + off, 3)] for t, s, e in NW]
delta = len(seg) / sr - (c1 - c0)
out = np.concatenate([base[:int(c0 * sr)], seg, base[int(c1 * sr):]]); w.write('voz.wav', sr, out)
P = W[:i0] + NW + [[t, round(s + delta, 3), round(e + delta, 3)] for t, s, e in W[i1 + 1:]]
json.dump(P, open('palavras.json', 'w'), ensure_ascii=False)
dur = round(len(out) / sr, 2)
open('tempos.js', 'w', encoding='utf-8').write('// Tempos de cada palavra na voz (voz/voz.wav), por alinhamento forçado (Echogarden, DTW com eSpeak).\n// voz.wav = áudio do Pedro sem a instrução lida em voz alta + conselho 4 regravado.\nconst VOZ = { dur: %s, w: %s };\n' % (dur, json.dumps(P, ensure_ascii=False, separators=(',', ':'))))
print(f'trecho novo: {len(nv)/sr:.2f}s (antes {c1-c0:.2f}s) · voz total {dur}s')
