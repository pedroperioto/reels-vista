# build.py — gera index.html a partir de src/template.html e da narração alinhada (voz/palavras.json)
# A narração entra depois da cena do Tropa de Elite: todos os tempos da voz são deslocados em OFF segundos.
import json, re, sys
from pathlib import Path
HERE = Path(__file__).parent
OFF = 1.0                                   # a voz começa aqui (o grito do filme ocupa 0 → ~1,3 s)
TXT = open(HERE / 'voz' / 'texto.txt').read().split()
W = [[w, round(a + OFF, 3), round(b + OFF, 3)] for w, a, b in json.load(open(HERE / 'voz' / 'palavras.json'))]
assert len(W) == len(TXT), (len(W), len(TXT))
norm = lambda s: re.sub(r'[^\wÀ-ÿ]', '', s).lower()
NW = [norm(w) for w in TXT]
def find(phrase, occ=1):
    p = [norm(x) for x in phrase.split()]; n = 0
    for i in range(len(NW) - len(p) + 1):
        if NW[i:i + len(p)] == p:
            n += 1
            if n == occ: return i
    raise KeyError(phrase)
S = lambda i: W[i][1]; E = lambda i: W[i][2]
def cut(i): return round((E(i - 1) + S(i)) / 2, 3) if i else 0.0
MK = {k: find(*v) if isinstance(v, tuple) else find(v) for k, v in {
  'desde': 'Desde domingo', 'pedindo': 'pedindo pra sair', 'busca': ('A busca por', 1), 'mil7': 'mil e setecentos', 'turno1': 'Depois do primeiro turno',
  'subido': 'tinha subido', 'indep': 'Independente', 'malas': 'tem gente fazendo', 'apto': 'Mas o apartamento', 'naocabe': 'não cabe',
  'segue': 'Segue o perfil', 'semana': 'toda semana', 'parte4': 'E a parte quatro', 'parcela': 'parcela do financiamento',
  'duas': 'Duas vizinhas', 'mesma': 'na mesma semana', 'ana': 'A Ana vendeu correndo', 'correndo': ('correndo.', 1), 'bia1': 'A Bia fez',
  'ana2': 'A Ana vendeu na', 'disparou': 'disparou', 'segunda': 'Só na segunda', 'nove': 'nove mil dólares', 'pagou': 'Ela pagou',
  'imposto': 'de imposto', 'trocou': 'e trocou', 'menos': 'menos dólar', 'bia2': 'A Bia alugou', 'sp': 'Em São Paulo', 'seis': 'quase seis',
  'tres': 'Uns três mil', 'mesmo': 'Mesmo pagando', 'quinze2': ('quinze por cento', 2), 'sobra': 'sobra renda', 'voltar': 'E se a Bia',
  'tala': 'O apê tá lá', 'terceiro': 'Tem um terceiro', 'pior': 'o pior', 'fechado': 'deixar fechado', 'condo': 'Condomínio e',
  'semrenda': 'sem renda nenhuma', 'vender': 'Vender pode', 'correndo2': 'Vender correndo', 'nunca': 'quase nunca', 'certo': 'Não tem certo',
  'conta': 'Tem a conta', 'comenta': 'Comenta conta', 'simul': 'simulação'}.items()}
M = {k: round(S(i), 3) for k, i in MK.items()}
C = {'TA': round(OFF + 0.3, 3), 'AB': cut(MK['turno1']), 'BS': cut(MK['apto']), 'SC': cut(MK['segue']), 'CD': cut(MK['duas']),
     'DE': cut(MK['ana2']), 'EF': cut(MK['bia2']), 'FG': cut(MK['terceiro']), 'GH': cut(MK['vender']), 'HI': cut(MK['comenta'])}
END = round(E(len(W) - 1) + 0.5, 3); DUR = round(END + 3.4, 2)
T = dict(C); T.update(END=END, DUR=DUR, OFF=OFF)
MERGE = {}
def merge(phrase, txt, occ=1): i = find(phrase, occ); MERGE[i] = (i + len(phrase.split()) - 1, txt)
for ph, tx, oc in [('mil e setecentos por cento.', '1.700%.', 1), ('primeiro turno,', '1º TURNO,', 1), ('parte quatro', 'PARTE 4', 1),
                   ('seiscentos mil reais', 'R$ 600 MIL', 1), ('nove mil dólares.', 'US$ 9 MIL.', 1), ('quinze por cento', '15%', 1),
                   ('seis e meio por cento', '6,5%', 1), ('três mil e duzentos reais', 'R$ 3.200', 1), ('quinze por cento', '15%', 2), ('IPTU', 'IPTU', 1)]:
    merge(ph, tx, oc)
units, i = [], 0
while i < len(W):
    if i in MERGE: j, tx = MERGE[i]; units.append((i, j, tx)); i = j + 1
    else: units.append((i, i, TXT[i].replace('"', ''))); i += 1
groups, g = [], []
for u in units:
    g.append(u); gap = (S(u[1] + 1) - E(u[1])) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.35: groups.append(g); g = []
if g: groups.append(g)
CAP = [{'t0': 0.12, 'w': [['PEDE', 0.15, 0.4], ['PRA', 0.4, 0.6], ['SAIR!', 0.6, 1.05]]}]   # o grito do filme (legenda para quem vê sem som)
CAP += [{'t0': S(g[0][0]), 'w': [[u[2], S(u[0]), E(u[1])] for u in g]} for g in groups]
tpl = open(HERE / 'src' / 'template.html').read()
for k, v in T.items(): tpl = tpl.replace('@@' + k + '@@', str(v))
tpl = tpl.replace('@@M@@', json.dumps(M)).replace('@@CAP@@', json.dumps(CAP, ensure_ascii=False)).replace('@@CUTS@@', json.dumps(C))
def dd(m):
    a, b = m.group(1), m.group(2)
    va = 0 if a == '0' else (T[a] if a in T else M[a]); vb = T[b] if b in T else M[b]
    return str(round(vb - va, 3))
tpl = re.sub(r'@@D:(\w+),(\w+)@@', dd, tpl)
tpl = re.sub(r'@@M:(\w+)([+-][0-9.]+)?@@', lambda m: str(round(M[m.group(1)] + float(m.group(2) or 0), 3)), tpl)
left = re.findall(r'@@[^@\s]+@@', tpl); assert not left, left
open(HERE / 'index.html', 'w').write(tpl)
json.dump({'T': T, 'M': M}, open(HERE / 'voz' / 'tempos.json', 'w'), indent=1)
print('index.html ok · duração', DUR, 's'); print({k: v for k, v in T.items()})
