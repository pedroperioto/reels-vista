# build.py — gera index.html (camada de grafismos) a partir da narração alinhada e da lista de planos
import json, re, importlib.util
from pathlib import Path
H = Path(__file__).parent
spec = importlib.util.spec_from_file_location('edl', H / 'edl.py'); E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
G = E.G
KW = 'TROCA'                                  # palavra do direct (vira PERMUTA quando chegar a narração nova)
W = json.load(open(H / 'voz' / 'palavras.json'))
TXT = open(H / 'voz' / 'texto.txt').read().split()
assert len(W) == len(TXT), (len(W), len(TXT))
norm = lambda s: re.sub(r'[^\wÀ-ÿ]', '', s).lower()
NW = [norm(w) for w in TXT]
def find(ph, occ=1):
    p = [norm(x) for x in ph.split()]; n = 0
    for i in range(len(NW) - len(p) + 1):
        if NW[i:i + len(p)] == p:
            n += 1
            if n == occ: return i
    raise KeyError(ph)
S = lambda i: G(W[i][1]); En = lambda i: G(W[i][2])
MK = {'troc': 'Trocar o seu', 'da': ('Dá.', 1), 'perm': ('Chama permuta', 1), 'juro': ('o juro da casa', 1), 'quinze': 'quinze por cento',
      'zona': 'Zona Leste', 'fica': 'Fica que eu', 'semp': 'Sem permuta', 'vender': ('vender pra comprar', 1), 'comprar': ('pra comprar.', 1),
      'vende1': 'Vende primeiro', 'ou': 'Ou compra', 'quem': 'quem compra o seu', 'banco': 'do banco', 'depois': 'Depois da eleição',
      'brad': 'Bradesco', 'itau': 'Itaú', 'sant': 'Santander', 'subiram': 'subiram', 'financ': 'Financiando', 'cinco': 'cinco mil',
      'comprador': 'O comprador', 'quase': 'quase vinte', 'result': 'Resultado', 'demora': 'demora pra vender', 'trava': 'trava',
      'agora': 'Agora pensa', 'carro': 'carro', 'entrada': 'de entrada', 'aperm': 'A permuta é isso', 'oseu': 'O seu apê vale',
      'q400': ('quatrocentos mil, o novo', 1), 'novo': 'o novo custa', 'q800': 'oitocentos. O seu', 'entra': 'O seu entra no',
      'resolve': 'você resolve', 'ela': 'Ela costuma', 'metade': 'metade', 'mas': ('Mas sempre', 1), 'chave': 'trocar a chave',
      'aval': 'avaliação', 'doc': 'documento', 'contr': 'contrato', 'eu': 'Eu faço', 'compra2': ('compra, venda', 1), 'venda': 'venda, permuta',
      'perm2': ('permuta e locação', 1), 'loc': 'locação', 'resid': 'residencial', 'come': 'comercial', 'me': 'Me manda', 'kw': 'manda ' + KW,
      'direct': 'no direct', 'emanda': 'E manda pra', 'amigo': 'aquele amigo'}
M = {}
for k, v in MK.items():
    i = find(*v) if isinstance(v, tuple) else find(v)
    M[k] = S(i + 1) if k == 'kw' else S(i)
P = json.load(open(H / 'voz' / 'planos.json')); C = P['cuts']
T = {k: P[k] for k in ('GAND0', 'GAND1', 'VEND', 'PIV0', 'PIV1', 'END', 'OFF1')}
WHITE = [(C[15], C[16]), (C[17], C[18])]          # trechos com fundo claro (estilo Apple)
light = lambda t: any(a <= t < b for a, b in WHITE)
# legenda: até 3 palavras; números viram algarismos
MERGE = {}
def merge(ph, tx, occ=1): i = find(ph, occ); MERGE[i] = (i + len(ph.split()) - 1, tx)
for ph, tx, oc in [('quinze por cento,', '15%', 1), ('quatrocentos mil,', 'R$ 400 MIL,', 1), ('cinco mil e oitocentos.', 'R$ 5.800.', 1),
                   ('quase vinte mil', 'QUASE R$ 20 MIL', 1), ('quatrocentos mil,', 'R$ 400 MIL,', 2), ('oitocentos.', 'R$ 800.', 2)]:
    merge(ph, tx, oc)
units, i = [], 0
while i < len(W):
    if i in MERGE: j, tx = MERGE[i]; units.append((i, j, tx)); i = j + 1
    else: units.append((i, i, TXT[i].replace('…', ''))); i += 1
groups, g = [], []
for u in units:
    g.append(u); gap = (W[u[1] + 1][1] - W[u[1]][2]) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.35: groups.append(g); g = []
if g: groups.append(g)
CAP = [{'t0': 0.25, 'w': [['VOU', 0.3, 0.6], ['FAZER', 0.6, 0.9], ['UMA', 0.9, 1.1], ['OFERTA', 1.1, 1.7]]},
       {'t0': 1.85, 'w': [['QUE', 1.9, 2.1], ['ELE', 2.1, 2.35], ['NÃO', 2.35, 2.6], ['PODE', 2.6, 2.85], ['RECUSAR', 2.85, 3.6]]}]
CAP += [{'t0': S(g[0][0]), 'w': [[u[2], S(u[0]), En(u[1])] for u in g]} for g in groups]
CAP += [{'t0': T['GAND0'] + 0.15, 'w': [['VOCÊ', T['GAND0'] + 0.2, T['GAND0'] + 0.7], ['NÃO', T['GAND0'] + 0.7, T['GAND0'] + 1.1], ['VAI', T['GAND0'] + 1.1, T['GAND0'] + 1.4], ['PASSAR!', T['GAND0'] + 1.4, T['GAND0'] + 2.3]]},
        {'t0': T['PIV0'] + 0.05, 'w': [['PIVOT!', T['PIV0'] + 0.1, T['PIV0'] + 0.7], ['PIVOT!', T['PIV0'] + 1.1, T['PIV0'] + 1.8]]}]
CAP.sort(key=lambda g: g['t0'])
for gg in CAP: gg['l'] = 1 if light(gg['t0']) else 0
tpl = open(H / 'src' / 'template.html').read()
rep = {'@@M@@': json.dumps(M), '@@T@@': json.dumps(T), '@@C@@': json.dumps(C), '@@CAP@@': json.dumps(CAP, ensure_ascii=False), '@@DUR@@': str(T['END']), '@@KW@@': KW}
for k, v in rep.items(): tpl = tpl.replace(k, v)
left = re.findall(r'@@[^@\s]+@@', tpl); assert not left, left
open(H / 'index.html', 'w').write(tpl)
json.dump({'M': M, 'T': T, 'C': C}, open(H / 'voz' / 'tempos.json', 'w'), indent=1)
print('index ok · duração', T['END'])
