# build.py — gera index.html (camada de grafismos) a partir da narração alinhada e da lista de planos
import json, re, importlib.util
from pathlib import Path
H = Path(__file__).parent
spec = importlib.util.spec_from_file_location('edl', H / 'edl.py'); E = importlib.util.module_from_spec(spec); spec.loader.exec_module(E)
G = E.G
KW = 'TROCA'                                  # palavra do direct
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
      'resolve': 'você resolve', 'ela': 'Ela costuma', 'metade': 'metade', 'mas': ('Mas sempre', 1), 'vale': 'vale tentar', 'chave': 'trocar a chave',
      'voce': 'você dá', 'depende': 'depende do', 'nao': 'não é só', 'tem': 'Tem avaliação', 'apart': 'com apartamento',
      'aval': 'avaliação', 'doc': 'documento', 'contr': 'contrato', 'eu': 'Eu faço', 'compra2': ('compra, venda', 1), 'venda': 'venda, permuta',
      'perm2': ('permuta e locação', 1), 'loc': 'locação', 'resid': 'residencial', 'come': 'comercial', 'me': 'Me manda', 'kw': 'manda ' + KW,
      'direct': 'no direct', 'emanda': 'E manda pra', 'amigo': 'aquele amigo'}
M = {}
for k, v in MK.items():
    i = find(*v) if isinstance(v, tuple) else find(v)
    M[k] = S(i + 1) if k == 'kw' else S(i)
P = json.load(open(H / 'voz' / 'planos.json')); C = P['cuts']
T = {k: P[k] for k in ('GAND0', 'GAND1', 'VEND', 'END0', 'END', 'OFF1')}
APPLE = C[16]; KEYS2 = C[17]                      # começo do trecho claro (estilo Apple) e volta das chaves
WHITE = [(APPLE, M['mas'] - 0.15)]                # legenda escura no fundo claro
HIDE = [(M['mas'] - 0.15, KEYS2)]                 # "Mas sempre vale tentar" já está escrito grande na tela
light = lambda t: any(a <= t < b for a, b in WHITE)
# legenda: até 3 palavras; números viram algarismos
MERGE = {}
def merge(ph, tx, occ=1): i = find(ph, occ); MERGE[i] = (i + len(ph.split()) - 1, tx)
for ph, tx, oc in [('quinze por cento,', '15%,', 1), ('quatrocentos mil,', 'R$ 400 MIL,', 1), ('cinco mil e oitocentos.', 'R$ 5.800.', 1),
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
# Poderoso Chefão (dublado): tempos do alinhamento + envelope de energia do recorte enviado
CAP = [{'t0': 0.38, 'w': [['VOU', 0.42, 0.73], ['FAZER', 0.74, 1.15], ['UMA', 1.15, 1.38]]},
       {'t0': 1.39, 'w': [['PROPOSTA', 1.41, 1.76], ['IRRECUSÁVEL', 1.76, 2.55]]}]
CAP += [{'t0': S(g[0][0]), 'w': [[u[2], S(u[0]), En(u[1])] for u in g]} for g in groups]
g0 = T['GAND0']
CAP += [{'t0': g0, 'w': [['VOCÊ', g0 + 0.03, g0 + 0.36], ['NÃO', g0 + 0.37, g0 + 0.58], ['VAI', g0 + 0.59, g0 + 1.1]]},
        {'t0': g0 + 1.8, 'w': [['PASSAR!', g0 + 1.85, g0 + 4.55]]}]   # o grito vai até 4,55 s no recorte
CAP = [g for g in CAP if not any(a <= g['t0'] < b for a, b in HIDE)]
CAP.sort(key=lambda g: g['t0'])
for gg in CAP: gg['l'] = 1 if light(gg['t0']) else 0
tpl = open(H / 'src' / 'template.html').read()
rep = {'@@M@@': json.dumps(M), '@@T@@': json.dumps(T), '@@C@@': json.dumps(C), '@@CAP@@': json.dumps(CAP, ensure_ascii=False), '@@DUR@@': str(T['END']), '@@KW@@': KW}
for k, v in rep.items(): tpl = tpl.replace(k, v)
left = re.findall(r'@@[^@\s]+@@', tpl); assert not left, left
open(H / 'index.html', 'w').write(tpl)
json.dump({'M': M, 'T': T, 'C': C}, open(H / 'voz' / 'tempos.json', 'w'), indent=1)
print('index ok · duração', T['END'])
