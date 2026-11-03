# build.py — gera index.html da prévia da abertura (0 a 18 s) a partir das palavras alinhadas
import json, re
from pathlib import Path
HERE = Path(__file__).parent
OFF = 4.2          # a narração entra depois da fala do Poderoso Chefão
DUR = 18.0
W = [[w, round(a + OFF, 3), round(b + OFF, 3)] for w, a, b in json.load(open(HERE.parent / 'voz' / 'palavras.json'))][:44]
S = lambda i: W[i][1]; E = lambda i: W[i][2]
M = {'troc': S(0), 'antes': E(11), 'da': S(12), 'perm': S(14), 'juro': S(18), 'quinze': S(24), 'ela': S(27), 'zona': S(35), 'fica': S(37), 'func': S(43)}
# legenda: grupos de até 3 palavras; "quinze por cento" vira 15%
units, i = [], 0
while i < len(W):
    if i == 24: units.append((24, 26, '15%')); i = 27; continue
    units.append((i, i, W[i][0])); i += 1
groups, g = [], []
for u in units:
    g.append(u); gap = (S(u[1] + 1) - E(u[1])) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.35: groups.append(g); g = []
if g: groups.append(g)
txt = open(HERE.parent / 'voz' / 'texto.txt').read().split()
fix = lambda j, w: txt[j].rstrip('…') if w == W[j][0] else w
CAP = [{'t0': 0.35, 'w': [['VOU', 0.4, 0.7], ['FAZER', 0.7, 1.0], ['UMA', 1.0, 1.2], ['OFERTA', 1.2, 1.8]]},
       {'t0': 1.9, 'w': [['QUE', 1.95, 2.15], ['ELE', 2.15, 2.4], ['NÃO', 2.4, 2.7], ['PODE', 2.7, 3.0], ['RECUSAR', 3.0, 3.8]]}]
CAP += [{'t0': S(g[0][0]), 'w': [[fix(u[0], u[2]) if u[0] == u[1] else u[2], S(u[0]), E(u[1])] for u in g]} for g in groups]
tpl = open(HERE / 'template.html').read().replace('@@DUR@@', str(DUR)).replace('@@M@@', json.dumps(M)).replace('@@CAP@@', json.dumps(CAP, ensure_ascii=False)).replace('@@OFF@@', str(OFF))
assert '@@' not in tpl
open(HERE / 'index.html', 'w').write(tpl)
json.dump(M, open(HERE / 'marcas.json', 'w'), indent=1)
print('ok', M)
