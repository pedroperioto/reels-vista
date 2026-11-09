# build.py — gera index.html (vídeo inteiro em animação, estilo Apple claro) a partir da narração alinhada
import json, re
from pathlib import Path
H = Path(__file__).parent
W = json.load(open(H / 'voz' / 'palavras.json'))
TXT = open(H / 'voz' / 'texto.txt').read().split()
assert len(W) == len(TXT), (len(W), len(TXT))
VEND = W[-1][2]; END0 = round(VEND + 0.35, 2); END = round(END0 + 2.8, 2)
# números por extenso viram algarismos na legenda
MERGE = {23: (24, '4 JEITOS.'), 25: (25, '1:'), 38: (42, '12,5%'), 46: (46, '15%'), 50: (51, 'R$ 400 MIL,'), 56: (57, 'R$ 700'), 71: (71, '2:'), 77: (78, '2 ANOS,'), 98: (98, '3:'), 122: (122, '4:')}
units, i = [], 0
while i < len(W):
    if i in MERGE: j, tx = MERGE[i]; units.append((i, j, tx)); i = j + 1
    else: units.append((i, i, TXT[i])); i += 1
groups, g = [], []
for u in units:
    g.append(u); gap = (W[u[1] + 1][1] - W[u[1]][2]) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.35: groups.append(g); g = []
if g: groups.append(g)
CAP = [{'t0': W[g[0][0]][1], 'w': [[u[2], W[u[0]][1], W[u[1]][2]] for u in g]} for g in groups]
tpl = open(H / 'src' / 'template.html').read()
for k, v in {'@@W@@': json.dumps([[a, b] for _, a, b in W]), '@@CAP@@': json.dumps(CAP, ensure_ascii=False), '@@DUR@@': str(END), '@@END0@@': str(END0)}.items():
    tpl = tpl.replace(k, v)
assert not re.findall(r'@@[A-Z0-9]+@@', tpl)
open(H / 'index.html', 'w').write(tpl)
json.dump({'END0': END0, 'END': END}, open(H / 'voz' / 'tempos.json', 'w'))
print('index ok', END)
