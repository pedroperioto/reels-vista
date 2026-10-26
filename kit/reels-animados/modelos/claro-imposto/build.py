# build.py — gera index.html (HyperFrames) a partir da narração alinhada (voz/palavras.json)
# Uso: python3 build.py   → index.html com todos os tempos presos às palavras
import json, math, re
from pathlib import Path
HERE = Path(__file__).parent
W = json.load(open(HERE / 'voz' / 'palavras.json'))
TXT = open(HERE / 'voz' / 'texto.txt').read().split()
assert len(TXT) == len(W)
S = lambda i: W[i][1]; E = lambda i: W[i][2]
mid = lambda i: round((E(i - 1) + S(i)) / 2, 3)
C = dict(AB=mid(19), BC=mid(42), CD=mid(52), DE=mid(64), EF=mid(80), FG=mid(88), GH=mid(101), HI=mid(111))
ENDV = round(E(len(W) - 1) + 0.25, 3); DUR = round(ENDV + 3.4, 2)
T = dict(C); T.update(ENDV=ENDV, DUR=DUR,
  dinA=round(S(66) - 0.1, 3), dinB=round(S(79) + 0.15, 3),
  chA=round(C['FG'] - 0.05, 3), chB=round(S(91) - 0.12, 3),
  caA=round(C['HI'] - 0.05, 3), caB=round(S(118) - 0.08, 3))
def dur(a, b): return round(b - a, 3)

# legenda: grupos de até 3 palavras, quebrando na pontuação; números por extenso viram algarismos
MERGE = {(13, 18): '2026.', (21, 26): '2027', (70, 73): 'R$ 240 mil', (89, 89): '2', (94, 94): '5,', (97, 98): 'R$ 200 mil?', (108, 110): '70%.'}
units = []; i = 0
while i < len(W):
    m = next(((a, b, s) for (a, b), s in MERGE.items() if a == i), None)
    if m: units.append((m[0], m[1], m[2])); i = m[1] + 1
    else: units.append((i, i, TXT[i])); i += 1
groups = []; g = []
for u in units:
    g.append(u)
    gap = (S(u[1] + 1) - E(u[1])) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.3: groups.append(g); g = []
if g: groups.append(g)
CAP = [{'t0': S(g[0][0]), 'w': [[u[2], S(u[0]), E(u[1])] for u in g]} for g in groups]

tpl = open(HERE / 'src' / 'template.html').read()
MARCA = json.load(open(HERE / 'marca.json'))   # dados da marca: cartão final, @ e logo
for k in ('nome', 'cargo', 'arroba', 'logo'): tpl = tpl.replace('@@MARCA_' + k.upper() + '@@', MARCA[k])
for k, v in T.items(): tpl = tpl.replace('@@' + k + '@@', str(v))
tpl = tpl.replace('@@WORDS@@', json.dumps([[w[1], w[2]] for w in W])).replace('@@CAP@@', json.dumps(CAP, ensure_ascii=False))
tpl = re.sub(r'@@D:(\w+),(\w+)@@', lambda m: str(dur(T[m.group(1)] if m.group(1) in T else float(m.group(1)), T[m.group(2)])), tpl)
left = re.findall(r'@@[^@]+@@', tpl)
assert not left, left
open(HERE / 'index.html', 'w').write(tpl)
json.dump(T, open(HERE / 'voz' / 'tempos.json', 'w'), indent=1)
print('index.html ok · duração', DUR, 's · cortes', C)
