"""Gera out/narracao.txt e out/narracao.srt a partir do timing.json."""
import sys, json, re
from common import video_dir
vdir = video_dir(sys.argv[1]); out = vdir / 'out'; out.mkdir(exist_ok=True)
T = json.load(open(vdir / 'timing.json'))['timing']
def ts(t): m, s = divmod(t, 60); h, m = divmod(int(m), 60); return f'{h:02d}:{m:02d}:{int(s):02d},{int(round((s - int(s)) * 1000)):03d}'
cues, txt = [], []
for sc in T:
    ws, pt = sc['fala'].split(' '), sc['palavras']; fe = sc.get('fins'); txt.append(f"[{sc['inicio']:.1f}s – {sc['fim']:.1f}s] {sc['cena'].upper()}\n{sc['fala']}\n")
    cur, st = [], None
    for i, (w, t) in enumerate(zip(ws, pt)):
        st = t if st is None else st; cur.append(w)
        if re.search(r'[.?!:]$', w) or (w.endswith(',') and len(cur) >= 7) or i == len(ws) - 1:
            cues.append((st, (fe[i] + 0.15) if fe else pt[i] + 0.4, ' '.join(cur))); cur, st = [], None
open(out / 'narracao.srt', 'w').write('\n'.join(f'{i + 1}\n{ts(a)} --> {ts(b)}\n{c}\n' for i, (a, b, c) in enumerate(cues)))
hdr = 'NARRAÇÃO — tempos medidos na voz gravada' if T and T[0].get('fins') else 'NARRAÇÃO — ritmo: 2,5 palavras/s, pausa curta após ponto'
open(out / 'narracao.txt', 'w').write(hdr + '\n\n' + '\n'.join(txt))
print(f'narração: {len(cues)} legendas → out/narracao.txt, out/narracao.srt')
