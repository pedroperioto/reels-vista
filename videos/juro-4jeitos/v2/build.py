# build.py (v2) — fonte única de tempos: lê voz/palavras.json, gera index.html, events.json (para o som) e beatgrid.md
import json, re, shutil
from pathlib import Path
H = Path(__file__).parent; P = H.parent
W = json.load(open(P / 'voz' / 'palavras.json')); TXT = open(P / 'voz' / 'texto.txt').read().split()
assert len(W) == len(TXT) == 169
t = lambda i: W[i][1]
END0 = round(W[-1][2] + 0.35, 2); DUR = round(END0 + 2.8, 2)
C = dict(C2=t(25) - 0.30, C3=t(63) - 0.25, C4=t(71) - 0.25, C5=t(98) - 0.28, C6=t(122) - 0.25, C7=t(140) - 0.25, C8=t(156) - 0.25, END0=END0, DUR=DUR)

# conferência dos números (R$ 400 mil, 360 meses)
def sac1(pv, aa, n=360): i = (1 + aa) ** (1 / 12) - 1; return pv / n + pv * i
def sacN(pv, aa, n=360): i = (1 + aa) ** (1 / 12) - 1; return pv / n * (1 + i)
def price(pv, aa, n=360): i = (1 + aa) ** (1 / 12) - 1; return pv * i / (1 - (1 + i) ** -n)
def jsac(pv, aa, n=360): i = (1 + aa) ** (1 / 12) - 1; return pv * i * (n + 1) / 2
NUM = dict(pA=round(sac1(4e5, .1249)), pB=round(sac1(4e5, .15)), sac1=round(sac1(4e5, .12)), sacN=round(sacN(4e5, .12)), price=round(price(4e5, .12)),
           jsac=round(jsac(4e5, .12)), jprice=round(price(4e5, .12) * 360 - 4e5))
NUM['dif'] = NUM['pB'] - NUM['pA']; NUM['eco'] = NUM['jprice'] - NUM['jsac']
print(NUM)
assert (NUM['pA'], NUM['pB'], NUM['dif']) == (5054, 5797, 743), NUM
assert (NUM['price'], NUM['sac1'], NUM['sacN']) == (3927, 4907, 1122), NUM
assert round(NUM['jsac'] / 1e3) == 685 and round(NUM['jprice'] / 1e4) == 101 and round(NUM['eco'] / 1e3) == 328, NUM

# EVENTOS: nome, tempo, o que acontece na tela, som (tipo, pan -1..1, ganho, variação)
EV = [
 ('notif', 0.06, 'Ilha abre em notificação do Copom com a foto do Pedro', 'notif', 0, .8, 0),
 ('parou', t(2), 'PAROU bate em vermelho; gráfico da Selic trava no degrau; tranco de câmera', 'impact', 0, 1, 0),
 ('pausa', t(4), 'Botão de pausa pulsa no fim da linha', 'tick', .3, .7, 1),
 ('flip', t(5) - 0.10, 'Bloco gira no eixo X: "Mas você não precisa"', 'whoosh', 0, .7, 0),
 ('esperar', t(9), 'Linha pontilhada de espera cresce com "?"', 'pop', .4, .6, 1),
 ('roll', t(12) - 0.12, 'Rola para "Dá pra pagar menos juro"; prédio e medidor entram', 'whoosh', 0, .7, 1),
 ('menos', t(14), '"menos juro" verde com luz passando; medidor de juro encolhe', 'glass', .2, .9, 2),
 ('ape', t(18), 'Janelas do prédio acendem', 'ticks5', -.4, .6, 0),
 ('salva', t(19), 'Ícone de salvar preenche', 'toggle', .5, .9, 0),
 ('quatro', t(23) - 0.05, '4 cartões do sumário em cascata', 'glass4', 0, .8, 0),
 ('C2', C['C2'], 'Cartão 1 cresce e vira a cena 2', 'whoosh', -.3, .9, 2),
 ('um', t(25), 'Título "1 · Compara os bancos"', 'pop', -.5, .6, 0),
 ('bancos', t(26) - 0.25, 'Cartões Banco A e Banco B entram', 'glass2', 0, .7, 0),
 ('eleicao', t(29), 'Etiqueta "depois da eleição"', 'tick', -.4, .6, 0),
 ('mesma', t(33), 'Ficha "mesma dívida" aparece e se divide para os dois bancos', 'pop', 0, .7, 1),
 ('doze', t(38), 'Banco A conta até 12,5% (verde) com luz', 'count', -.5, .7, 0),
 ('quinze', t(46), 'Banco B conta até 15% (vermelho)', 'count', .5, .7, 1),
 ('quatrocentos', t(50), 'Painel "R$ 400 mil em 30 anos": barras crescem e contam', 'countlong', 0, .6, 0),
 ('setecentos', t(56), 'Selo "+R$ 743" salta com brilho vermelho; tranco', 'riserimpact', .3, 1, 0),
 ('primeira', t(61), 'Sublinha "1ª parcela"', 'tick', -.3, .6, 2),
 ('C3', C['C3'], 'Avião de papel sai do selo; azul abre no rastro', 'whooshpan', 0, 1, 0),
 ('avatares', t(64), 'Contatos entram em cascata', 'pops4', 0, .5, 0),
 ('cair', t(70), 'Avião chega; check de enviado', 'check', .2, .9, 0),
 ('C4', C['C4'], 'Azul fecha em círculo até virar o "2"', 'whooshrev', -.6, .9, 1),
 ('dois', C['C4'] + 0.6, 'Círculo vira o quadradinho do 2', 'pop', -.7, .7, 2),
 ('fgts', t(74), 'Cartão do FGTS sobe da carteira', 'glass', -.5, .8, 0),
 ('anos', t(77), 'Calendário vira de 1 para 2', 'flipcal', .5, .8, 0),
 ('cada2', t(78) + 0.05, 'Pílula "a cada 2 anos"', 'pop', .5, .6, 0),
 ('moeda0', t(85), 'Moeda 1 cai na barra da dívida; pedaço vira verde', 'coin', .6, .9, 0),
 ('moeda1', t(85) + 0.29, 'Moeda 2', 'coin', .45, .9, 1),
 ('moeda2', t(85) + 0.58, 'Moeda 3', 'coin', .3, .9, 0),
 ('moeda3', t(85) + 0.87, 'Moeda 4', 'coin', .15, .9, 1),
 ('abatido', t(91), 'Pedaço verde se solta da dívida', 'glass', .4, .7, 1),
 ('para', t(92), 'Cadeado fecha: "parou de render juro"', 'check', .3, 1, 1),
 ('C5', C['C5'], 'Barra da dívida gira 90° e vira o eixo do gráfico', 'whoosh', -.4, .9, 1),
 ('tres', t(98), 'Título "3 · Tabela SAC"', 'pop', -.5, .6, 1),
 ('pricel', t(99), 'Linha cinza da Price desenha reta', 'slide', 0, .5, 0),
 ('maior', t(105), 'Ponto azul da SAC nasce acima', 'pop', -.6, .7, 2),
 ('cai', t(108), 'Linha azul desce até R$ 1.122', 'slidedown', 0, .8, 0),
 ('total', t(112), 'Painel "juro total pago": barras crescem', 'countlong', 0, .6, 1),
 ('economiza', t(121), 'Selo "você economiza ≈ R$ 328 mil" acende em verde', 'riserimpact', .3, 1, 1),
 ('C6', C['C6'], 'Bolinha da linha vira o celular', 'whoosh', .4, .9, 0),
 ('quatro4', t(122), 'Chip "4"', 'pop', -.6, .6, 0),
 ('secair', t(126), 'Minigráfico no celular cai', 'slidedown', 0, .5, 1),
 ('porta', t(130), 'PORTABILIDADE com luz passando', 'riserglass', 0, .9, 0),
 ('leva', t(132), 'Pílula "sua dívida" voa em arco para o banco mais barato', 'whooshpan', 0, .7, 1),
 ('barato', t(138), 'Banco mais barato acende em verde', 'check', 0, 1, 0),
 ('C7', C['C7'], 'Tela do celular abre e vira a grade de prédios', 'whoosh', 0, .9, 2),
 ('bonus', t(142), 'Pílula dourada BÔNUS', 'popglass', -.5, .9, 0),
 ('venda', t(146), 'Plaquinhas "à venda" pipocam', 'ticks8', 0, .6, 0),
 ('preco', t(152), 'Etiqueta de preço entra', 'glass', -.3, .8, 1),
 ('negocia', t(155), 'Controle desliza: "sua proposta"', 'slidepop', .2, .8, 0),
 ('C8', C['C8'], 'Ilha cresce e vira a conversa do direct', 'whoosh', 0, .9, 1),
 ('conta', t(158), 'CONTA é digitado', 'keys5', .2, .8, 0),
 ('envia', t(160), 'Mensagem enviada (balão sobe)', 'notif', .4, .9, 1),
 ('comparo', t(163), 'Resposta do Pedro aparece', 'popglass', -.4, .8, 1),
 ('END0', END0, 'Foto do Pedro cresce: cartão final', 'whoosh', 0, .8, 0),
 ('seguir', END0 + 1.5, 'Botão Seguir vira Seguindo', 'toggle', 0, 1, 1),
]
E = {n: round(tt, 3) for n, tt, *_ in EV}
json.dump({'C': C, 'EV': [[n, round(tt, 3), s, p, g, v] for n, tt, d, s, p, g, v in EV]}, open(H / 'events.json', 'w'), indent=0)
with open(H / 'beatgrid.md', 'w') as f:
    f.write('# Beat grid — 4 jeitos de pagar menos juro (v2)\n\nGerado pelo `build.py` a partir de `voz/palavras.json`. Quadro = tempo × 60.\n\n| Tempo (s) | Quadro | Evento | O que acontece na tela | Som (pan) |\n|---|---|---|---|---|\n')
    for n, tt, d, s, p, g, v in sorted(EV, key=lambda e: e[1]): f.write(f'| {tt:.2f} | {round(tt*60)} | {n} | {d} | {s} ({p:+.1f}) |\n')

# legenda: números por extenso viram algarismos
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
for k, v in {'@@W@@': json.dumps([a for _, a, b in W]), '@@CAP@@': json.dumps(CAP, ensure_ascii=False), '@@C@@': json.dumps(C), '@@E@@': json.dumps(E), '@@NUM@@': json.dumps(NUM), '@@DUR@@': str(DUR)}.items(): tpl = tpl.replace(k, v)
assert not re.findall(r'@@[A-Z0-9]+@@', tpl)
open(H / 'index.html', 'w').write(tpl)
if not (H / 'assets').exists(): shutil.copytree(P / 'assets', H / 'assets', ignore=shutil.ignore_patterns('som.wav'))
for f in ('hyperframes.json', 'package.json'): shutil.copy(P / f, H / f)
json.dump({'id': 'juro-4jeitos-v2', 'name': 'juro-4jeitos-v2', 'createdAt': '2026-11-09T22:00:00.000Z'}, open(H / 'meta.json', 'w'))
print('index ok', DUR, len(CAP), 'grupos de legenda')
