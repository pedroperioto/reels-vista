# build.py — gera index.html a partir de src/template.html e da narração alinhada (voz/palavras.json)
# Sem áudio ainda? `python3 build.py --fake` cria tempos estimados (para montar e conferir as cenas).
import json, re, sys
from pathlib import Path
HERE = Path(__file__).parent
TXT = open(HERE / 'voz' / 'texto.txt').read().split()
PJ = HERE / 'voz' / 'palavras.json'
if '--fake' in sys.argv or not PJ.exists():
    t, W = 0.4, []
    for w in TXT:
        d = 0.08 + 0.042 * len(w); W.append([w, round(t, 3), round(t + d, 3)]); t += d + 0.03
        if w.endswith(('.', '?', '!')): t += 0.32
        elif w.endswith((',', ':')): t += 0.12
    json.dump(W, open(HERE / 'voz' / 'palavras_fake.json', 'w')); FAKE = True
else:
    W = json.load(open(PJ)); FAKE = False
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
# marcadores (frase → índice da 1ª palavra)
MK = {k: find(*v) if isinstance(v, tuple) else find(v) for k, v in {
  'paises': 'DOIS países', 'janela': 'Na janela', 'rafa': ('o Rafa', 1), 'celia': ('a Dona Célia', 1), 'sai': 'Sai o resultado', 'lula': 'Lula, cinquenta',
  'flavio': ('Flávio, quarenta'), 'virada': 'Uma VIRADA', 'turno': 'no primeiro turno', 'rojao': 'O Rafa solta', 'cortina': 'fecha a cortina',
  'noite': 'Na mesma noite', 'toquio': 'Em Tóquio', 'catorze': 'catorze', 'ny': 'Em Nova York', 'vinte5': 'VINTE E CINCO', 'abertura': 'antes da abertura',
  'segunda': 'Segunda de manhã', 'celulares': 'Os celulares', 'travou': 'TRAVOU', 'circuit': 'Circuit', 'pandemia': 'pandemia', 'ibov': 'O Ibovespa', 'dezesseis': 'dezesseis',
  'bb': 'O Banco do Brasil', 'trinta': 'trinta e um', 'dolar': 'E o dólar bateu', 'sessenta': 'cinco e sessenta', 'eladiz': 'Ela diz', 'avisei': 'eu avisei', 'elediz': 'Ele diz', 'primdia': 'primeiro dia',
  'analistas': 'Pros analistas', 'medo': 'medo das contas', 'quando': 'E quando', 'juros': 'os juros longos', 'doisp': 'quase DOIS pontos', 'pesam': 'São esses juros', 'financ': 'financiamento.',
  'porta': 'A porta abre', 'envel': 'dois envelopes', 'boleto': 'O boleto', 'proprie': 'Porque o proprietário', 'votou': 'votou.',
  'alug': ('O aluguel subiu', 1), 'dobro': 'O DOBRO', 'sp': ('Em São Paulo', 1), 'imovel': 'O imóvel, três', 'correndo': 'está correndo',
  'simul0': 'Com juros', 'simular': 'simular antes', 'm2': 'Mas o metro', 'todos': 'TODOS os governos', 'passa': 'Governo passa', 'tijolo': 'O tijolo fica',
  'sabe': 'E sabe', 'fila': 'Na fila', 'plantao': 'plantão de vendas', 'voce': 'E você?', 'time': 'Time treze', 'compra': 'compra ou espera', 'comenta': 'Comenta aqui'}.items()}
M = {k: round(S(i), 3) for k, i in MK.items()}
C = {'AB': cut(MK['janela']), 'BC': cut(MK['sai']), 'CD': cut(MK['rojao']), 'DE': cut(MK['noite']), 'EF': cut(MK['segunda']), 'FF2': cut(MK['travou']), 'F2G': cut(MK['eladiz']),
     'GH': cut(MK['analistas']), 'HI': cut(MK['porta']), 'IJ': cut(MK['alug']), 'JK': cut(MK['simul0']), 'KL': cut(MK['m2']), 'LM': cut(MK['sabe']), 'MN': cut(MK['voce'])}
END = round(E(len(W) - 1) + 0.4, 3); DUR = round(END + 3.6, 2)
T = dict(C); T.update(END=END, DUR=DUR)
# legenda: grupos de até 3 palavras; números por extenso viram algarismos
MERGE = {}
def merge(phrase, txt): MERGE[find(phrase)] = (find(phrase) + len(phrase.split()) - 1, txt)
for ph, tx in [('time treze.', 'TIME 13.'), ('time vinte e dois.', 'TIME 22.'), ('cinquenta e um vírgula oito.', '51,8%.'), ('quarenta e oito vírgula dois.', '48,2%.'),
               ('catorze por cento.', '14%.'), ('VINTE E CINCO por cento', '25%'), ('dezesseis por cento.', '16%.'), ('trinta e um.', '31%.'), ('cinco e sessenta.', 'R$ 5,60.'),
               ('nove por cento', '9%'), ('aluguel subiu seis.', 'aluguel subiu 6%.'), ('três e meio.', '3,5%.'), ('Time treze ou vinte e dois?', 'Time 13 ou 22?')]:
    merge(ph, tx)
units, i = [], 0
while i < len(W):
    if i in MERGE: j, tx = MERGE[i]; units.append((i, j, tx)); i = j + 1
    else: units.append((i, i, TXT[i])); i += 1
groups, g = [], []
for u in units:
    g.append(u); gap = (S(u[1] + 1) - E(u[1])) if u[1] + 1 < len(W) else 9
    if re.search(r'[.?!:,]$', u[2]) or len(g) >= 3 or gap > 0.35: groups.append(g); g = []
if g: groups.append(g)
CAP = [{'t0': S(g[0][0]), 'w': [[u[2], S(u[0]), E(u[1])] for u in g]} for g in groups]
tpl = open(HERE / 'src' / 'template.html').read()
MARCA = json.load(open(HERE / 'marca.json'))   # dados da marca: cartão final, @ e logo
for k in ('nome', 'cargo', 'arroba', 'logo'): tpl = tpl.replace('@@MARCA_' + k.upper() + '@@', MARCA[k])
for k, v in T.items(): tpl = tpl.replace('@@' + k + '@@', str(v))
tpl = tpl.replace('@@M@@', json.dumps(M)).replace('@@CAP@@', json.dumps(CAP, ensure_ascii=False)).replace('@@CUTS@@', json.dumps(C))
tpl = re.sub(r'@@D:(\w+),(\w+)@@', lambda m: str(round(T[m.group(2)] - (0 if m.group(1) == '0' else T[m.group(1)]), 3)), tpl)
left = re.findall(r'@@[^@\s]+@@', tpl); assert not left, left
open(HERE / 'index.html', 'w').write(tpl)
json.dump({'T': T, 'M': M, 'fake': FAKE}, open(HERE / 'voz' / 'tempos.json', 'w'), indent=1)
print('index.html ok ·', 'TEMPOS ESTIMADOS' if FAKE else 'narração real', '· duração', DUR, 's')
