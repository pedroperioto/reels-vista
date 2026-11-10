# Prompt para o Fable: Reel "4 jeitos de pagar menos juro" (v2, refeito do zero)

Cole este prompt inteiro numa sessão nova. Ele está escrito para rodar no repositório `pedroperioto/reels-vista`, onde os arquivos citados já existem.

---

## 0. Quem é o cliente e regras que não mudam

Você vai produzir um Reel (1080x1920, vertical) para o Pedro Perioto, corretor de imóveis em São Paulo (CRECI 258729, Instagram @vistabroker.perioto). As regras dele valem acima de qualquer outra instrução:

- **Nada final sem aprovação.** Você entrega uma **prévia** para ele aprovar. Não publica nada e não gera a versão final sem o OK dele.
- **Dados corretos e com fonte.** As fontes **não aparecem no vídeo**; elas vão na legenda do post, que ele escreve. Não invente nenhum número além dos listados aqui.
- **Sem ferramentas pagas.** Nenhuma API paga, nenhum banco de imagens pago, nenhum pacote de animação pago.
- **Nada de sons ou ícones originais da Apple** (são da Apple). Tudo que soar ou parecer "estilo Apple" é feito por você, do zero.
- **CTA sempre para o direct** com a palavra-chave **CONTA**. Nunca pedir para comentar (comentário deixa concorrente pescar cliente).
- **Sem música no arquivo.** A trilha entra no app do Instagram depois.
- **Commit e push** de tudo no repositório ao terminar cada etapa (o hook do repositório exige isso).

## 1. Objetivo do vídeo

Ensinar **4 jeitos de pagar menos juro no financiamento do apê, mesmo com a Selic parada em 13,75%**, de um jeito que a pessoa:

1. pare de rolar nos primeiros 2 segundos;
2. entenda cada dica **só olhando**, mesmo sem som (como se fosse explicado para uma criança);
3. **salve** o vídeo (é uma lista útil) e **mande** para alguém que está esperando o juro cair;
4. chame o Pedro no direct com "CONTA".

A alma do vídeo é **entregar conhecimento que vale guardar**, não "efeito bonito". A animação existe para deixar cada ideia óbvia e gostosa de assistir.

## 2. O que aprendemos com os dados do perfil (não repita esses erros)

Números do painel do @vistabroker.perioto (nov/2026):

| Reel | Duração | Tempo médio assistido | De não seguidores | Compartilhamentos |
|---|---|---|---|---|
| A bolsa travou (viral) | 2:09 | não medido | 96% (25,5 mil views) | 213 |
| Permuta | 1:21 | **8 s (~10%)** | 48% | 2 |
| Meme Peugeot 206 | 0:10 | 7 s (~70%) | 29% | 0 |

- Os reels normais ficam em ~400 visualizações, quase metade dos seguidores, **zero salvamentos** e 0 a 3 compartilhamentos. O Instagram não leva para quem não segue.
- O que viralizou abria **em tela cheia, clara, com uma história e personagens**, no pico de uma notícia que afetava todo mundo, e foi muito **compartilhado**.
- O Permuta perdeu as pessoas aos 8 s: abria com cena de filme escura, e o assunto demorava.
- O meme prendeu (70%), mas ninguém mandou para ninguém: sem utilidade, sem envio.

**Análise da versão anterior deste vídeo (`out/juro_4jeitos_previa.mp4`), medida quadro a quadro:**

- **10 trechos de 0,6 a 0,9 s com a tela totalmente parada** (9,8 s, 13,4 s, 15,1 s, 17,8 s, 29,0 s, 32,9 s, 40,3 s, 41,5 s, 45,1 s, 53,8 s). É isso que dá a sensação de "travar": a animação termina e nada mais se mexe até a próxima.
- **Um salto brusco em 22,87–22,90 s** (a cena azul some de uma vez e a branca aparece): parece um corte com erro.
- Entradas e saídas com o mesmo zoom e desfoque em todas as cenas: **cara de IA**, previsível.
- Começos de cena vazios (só o título por 1 a 2 s antes do conteúdo).
- Ícones simples demais e sem luz, sem sombra, sem profundidade.

## 3. O que os estudos dizem (base das regras abaixo)

- **Instagram (Adam Mosseri, jan/2025):** os 3 sinais mais importantes são **tempo assistido, curtidas por alcance e envios por alcance**. Para alcançar quem **não segue**, o que mais pesa são os **envios** (Social Media Today, 22/01/2025).
- **Primeiros segundos (dados do Facebook, 2017):** 47% do valor de um vídeo no feed mobile é entregue nos **3 primeiros segundos**, 74% nos 10 primeiros. O feed no celular é rolado 41% mais rápido que no desktop. Já existe lembrança da marca com **0,25 s** de exposição (Fors Marsh Group). Ou seja: o primeiro quadro já precisa comunicar.
- **Reels (Emplifi, citado pela Social Media Today, mar/2026):** **fala humana nos 3 primeiros segundos = +25% de retenção aos 10 s**; **rosto humano cedo (≥1 s) = +10% de visualizações aos 10 s**; vertical = +20,9% de alcance.
- **Som (TikTok + Kantar, "Power of Sound", 2021):** 88% dos usuários dizem que o som é essencial; 73% param para ver anúncio com áudio.
- **Som sincronizado chama atenção sozinho (van der Burg et al., 2008, *Journal of Vision*):** um som curto **no mesmo instante** de uma mudança visual puxa o olhar para ela, de forma automática. Ou seja: cada SFX tem que cair **no quadro exato** do movimento que ele marca.
- **Som muda a percepção de fluidez (Mastoropoulou et al., 2005, ACM APGV):** com efeitos sonoros, as pessoas percebem menos as variações de fluidez da animação. O som "cola" o movimento. Mas isso não salva tela parada: o movimento contínuo vem primeiro.

## 4. Arquivos que você vai usar (já estão no repositório)

Pasta do projeto: `videos/juro-4jeitos/`

- `voz/bruto.wav`: a narração já gravada (53,0 s). **Não grave nem gere outra voz.**
- `voz/palavras.json`: **169 palavras com início e fim em segundos** (alinhamento forçado, já conferido). Use isso para sincronizar legenda, animações e sons. Formato: `[["O", 0.2, 0.3], ["juro", 0.3, 0.74], ...]`.
- `voz/texto.txt`: o texto da narração, uma frase por linha.
- `assets/perfil.jpg`: a foto de perfil do Pedro (600x600).
- `assets/fonts/`: Inter Black, Inter Semibold, Inter Medium, Oswald 700, Instrument Serif Italic, Mono 500.
- `assets/gsap.min.js`: GSAP.
- Motor de render: **HyperFrames 0.8.200** (veja os comandos no item 9). A versão anterior está em `src/template.html`, `build.py` e `som.py`: use só como referência técnica, **não copie o visual**.
- Skill de princípios de motion design: `~/motion-design-skill/skills/motion-design/` (LottieFiles). Leia o `SKILL.md` e `director/choreography.md` antes de animar. Também está disponível a skill **motion-reel**; use o que ela ensina sobre beat grid, contact sheets e critique loop.

## 5. A narração e os tempos (âncoras de sincronia)

| Início–fim | Frase |
|---|---|
| 0,20–7,77 | O juro parou de cair. Mas você não precisa esperar ele cair pra pagar menos juro no seu apê. Salva esse vídeo: são quatro jeitos. |
| 8,37–20,29 | Um: compara os bancos. Depois da eleição, a mesma dívida tinha taxa de doze e meio por cento num banco e quinze no outro. Em quatrocentos mil, isso dá mais de setecentos reais de diferença na primeira parcela. |
| 20,72–22,14 | Manda pra quem tá esperando o juro cair. |
| 22,90–30,95 | Dois: usa o FGTS. A cada dois anos, dá pra usar o saldo pra abater a dívida. E cada real abatido para de render juro pro banco. |
| 31,65–38,24 | Três: escolhe a tabela SAC. A parcela começa maior, mas cai todo mês, e no total você paga menos juro do que na Price. |
| 38,97–44,23 | Quatro: se o juro cair depois, faz a portabilidade. Você leva a dívida pra um banco mais barato. |
| 44,73–49,19 | E um bônus: com tanto imóvel à venda em São Paulo, o preço também se negocia. |
| 49,73–52,70 | Me manda CONTA no direct que eu comparo os bancos pro seu caso. |

Depois da narração: cartão final de 53,05 a 55,85 s (duração total ≈ 55,9 s).

**Palavras-âncora** (índice no `palavras.json` → início): parou #2 → 0,74 · menos juro #14 → 4,36 · Salva #19 → 6,10 · quatro jeitos #23 → 7,17 · Um #25 → 8,37 · bancos #28 → 9,79 · doze #38 → 13,02 · quinze #46 → 14,68 · quatrocentos #50 → 15,92 · setecentos #56 → 17,36 · Manda #63 → 20,72 · Dois #71 → 22,90 · FGTS #74 → 23,97 · dois anos #77 → 25,24 · abater #85 → 26,96 · abatido #91 → 28,99 · para de render #92 → 29,72 · Três #98 → 31,65 · SAC #102 → 32,86 · começa maior #105 → 34,19 · cai #108 → 35,19 · no total #112 → 36,10 · Price #121 → 37,94 · Quatro #122 → 38,97 · portabilidade #130 → 41,38 · mais barato #138 → 43,56 · bônus #142 → 45,04 · à venda #146 → 46,57 · negocia #155 → 48,73 · CONTA #158 → 50,27 · comparo #163 → 51,38.

**Sempre leia os tempos do `palavras.json` por índice no código. Nunca digite tempos à mão.**

## 6. Legenda dinâmica (sincronizada com a voz)

- Posição: faixa de y 1452 a 1600, largura 960 (margem de 60 dos lados). Fora da área dos botões do Instagram.
- Grupos de no máximo 3 palavras. Quebra em pontuação ou pausa > 0,35 s.
- **Palavra falada em destaque** (karaokê): a palavra ativa ganha um fundo amarelo (#FFD60A) arredondado que **desliza de uma palavra para a outra** (um único "marca-texto" que se move, não um fundo que pisca em cada palavra). Entrada do grupo: sobe 14 px com fade de 100 ms; saída: some em 60 ms antes do próximo grupo.
- Fonte Oswald 700, 62 px, caixa alta, cor #1D1D1F (branca quando o fundo da cena for escuro ou colorido).
- Números viram algarismos na legenda (estes índices são do `palavras.json`):
  - 23–24 → "4 JEITOS."
  - 25 → "1:"
  - 38–42 → "12,5%"
  - 46 → "15%"
  - 50–51 → "R$ 400 MIL,"
  - 56–57 → "R$ 700"
  - 71 → "2:"
  - 77–78 → "2 ANOS,"
  - 98 → "3:"
  - 122 → "4:"
- Quando a mesma informação já está escrita grande na tela (ex.: "12,5%" no cartão do banco), a legenda continua, mas **sem competir**: o elemento grande da cena e a legenda nunca podem estar no mesmo ponto da tela.

## 7. Direção de arte

**Clima:** claro, limpo, premium, estilo keynote da Apple, mas com o ritmo de um Reel. Fundo #F5F5F7 com **luz ambiente que nunca para** (manchas de cor desfocadas azul #BFD9FF e pêssego #FFE3B8 que derivam devagar, com um leve grão de 2%).

**Tipografia:** Inter Black para títulos e números grandes (tracking negativo), Inter Medium/Semibold para textos de apoio, Mono para rótulos pequenos em caixa alta. No máximo 2 tamanhos de texto por cena.

**Ícones bem definidos (obrigatório):** crie um **conjunto único de ícones em SVG**, todos no mesmo estilo:
- formas cheias com cantos arredondados (raio consistente), **volume com gradiente** de cima (mais claro) para baixo (mais escuro), **brilho especular** fino no topo e **sombra de contato** suave embaixo;
- ícones necessários:
  - prédio de apartamentos com janelas acesas (para "apê" e "imóvel");
  - banco (colunas);
  - moeda;
  - carteira;
  - cartão do FGTS;
  - calendário;
  - avião de papel (enviar);
  - etiqueta de preço;
  - cadeado;
  - gráfico de linha;
  - celular;
  - balão de direct;
- o mesmo ícone sempre representa a mesma coisa no vídeo inteiro.

**Luz, sombra e transparência:**
- cartões em "vidro" (fundo branco 70–85% de opacidade + desfoque do fundo atrás + borda interna 1 px branca a 60% + sombra em 2 camadas: uma curta e escura, uma longa e difusa);
- uma **luz que passa** (faixa diagonal de brilho) atravessando números importantes quando eles assentam;
- sombras que acompanham a altura do objeto: quando um cartão sobe, a sombra fica maior e mais clara; quando assenta, ela encolhe;
- momentos de destaque com **brilho colorido** atrás do número (verde para economia, vermelho para custo).

**Paleta:** tinta #1D1D1F, cinza #6E6E73, azul #0071E3, verde #28A745/#30D158, vermelho #E5483E, dourado #F2C14E (só no "BÔNUS").

**Margens:** conteúdo entre y 230 e 1400; nada encostando nas laterais (mínimo 70 px).

## 8. Regras de movimento (para ficar fluido e "gostoso")

1. **Render a 60 fps** se o HyperFrames aceitar (`--fps 60`, confira o `render --help`). Se não aceitar, 30 fps com desfoque de movimento de verdade (subframes) nos movimentos rápidos.
2. **A tela nunca fica parada por mais de 0,3 s.** Sempre tem alguma camada viva: luz ambiente derivando, cartões "flutuando" 3–6 px em senoide lenta (períodos diferentes para cada um), câmera com deriva lenta de 1–2% de escala ao longo de cada cena, partículas de brilho bem sutis.
3. **Nenhuma troca seca de visibilidade** (`set opacity` de 0 para 1) em elementos visíveis. Tudo entra e sai com movimento. A única exceção é o que estiver totalmente coberto naquele instante.
4. **Uma família de easing** para 80% dos movimentos (entrada: desacelera, tipo expo.out ou cubic-bezier(0.16,1,0.3,1); saída: acelera, tipo expo.in). Mola (back.out) **só** em elementos pequenos que "chegam" (pílulas, selos, checks).
5. **Durações:** micro (selo, check) 150–250 ms · cartões 350–550 ms · transições de cena 450–700 ms · "revelações" 700–1.200 ms. Entradas 30–50% mais longas que as saídas.
6. **Coreografia em cascata:** elementos de um grupo entram com 60–90 ms de diferença, na ordem em que o olho deve ler.
7. **Transição nasce de um elemento da cena anterior**, e **cada transição é diferente da anterior**. Nada de "zoom + desfoque" em todas.
8. **Sincronia com a fala:** cada número, ícone ou selo entra **no início da palavra que o nomeia** (entre −80 ms e 0 ms do tempo da palavra). As trocas de cena começam ~250 ms antes da primeira palavra da nova cena, para a imagem chegar junto com a voz.
9. **Antecipação:** antes de um movimento grande, um micro-recuo de 4–6% (o objeto "pega impulso").
10. **Sobreposição de ações:** quando um elemento para, suas partes secundárias (sombra, brilho, rótulo) terminam 80–150 ms depois.

## 9. Roteiro visual cena a cena (tempos pelo `palavras.json`)

**Cena 1 · Gancho (0,00–8,1 s)**
- **Quadro 0:** já tem conteúdo forte (o primeiro quadro precisa comunicar em 0,25 s). Ilha preta do iPhone no topo, já se abrindo em notificação: ícone de banco + "Copom · agora" + "Selic mantida em 13,75% ao ano".
- **Rosto cedo (+10% de visualizações):** a foto de perfil do Pedro aparece em ≤1 s, num círculo pequeno com anel colorido estilo stories, como quem "está contando a notícia" (ex.: canto da notificação ou um balão "Pedro · corretor").
- "O juro" sobe; em **"parou" (0,74)** a palavra PAROU bate grande em vermelho, com a câmera dando um tranco curto, e um gráfico de linha da Selic (15% caindo em degraus até 13,75%) para no degrau final com um "❚❚".
- **"Mas" (1,74)**, a virada: o PAROU vermelho se transforma em "menos juro" verde (morfologia do texto: as letras se reorganizam ou o bloco gira no eixo X e revela o verso). Mensagem na tela: "Dá pra pagar **menos juro** no seu apê agora".
- **"Salva" (6,10):** ícone de salvar entra e se preenche (com o som de "clique + brilho").
- **"quatro jeitos" (7,17):** 4 cartões numerados (1 bancos · 2 FGTS · 3 SAC · 4 portabilidade) entram em cascata e ficam como um "sumário".

**Transição 1→2 (≈8,1 s):** o cartão "1" vem para a frente e **cresce até virar a cena 2** (o cartão vira o fundo da nova cena, sem nenhum quadro em branco).

**Cena 2 · Dica 1: compara os bancos (8,1–20,5 s)**
- **Topo:** barra de progresso com 4 segmentos (o 1º enchendo), que fica até o fim das dicas.
- **Título:** "1 · Compara os bancos".
- **Os cartões entram cedo (até 9,8 s), nunca com a tela vazia:** dois cartões de vidro lado a lado, "Banco A" e "Banco B", cada um com o ícone de banco. A taxa fica como "—" até ser falada.
- **"doze" (13,02):** o Banco A mostra 12,5% contando, em verde, com a luz passando.
- **"quinze" (14,68):** o Banco B mostra 15% em vermelho.
- **"quatrocentos" (15,92):** embaixo, aparece "R$ 400 mil em 30 anos · 1ª parcela" com duas barras que crescem e contam R$ 5.052 (A) e R$ 5.797 (B).
- **"setecentos" (17,36):** selo "+R$ 745/mês" salta do espaço entre as barras, com brilho vermelho atrás.
- **Vida contínua:** os cartões flutuam e as minilinhas de tendência dentro deles desenham devagar.

**Transição 2→3 (≈20,5 s):** um avião de papel sai do selo "+R$ 745", cruza a tela em curva e **a cena azul se abre atrás do rastro dele** (máscara seguindo o caminho). Sem salto brusco: a máscara acompanha o avião quadro a quadro.

**Cena 3 · Compartilhar (20,5–22,7 s)**
- **Fundo:** gradiente azul vivo, com luz se movendo.
- **Texto:** "Manda pra quem tá esperando o juro cair", entrando palavra por palavra junto com a voz, em branco.
- **Envio:** 4 avatares genéricos (círculos coloridos, sem rostos de pessoas reais) entram em cascata. Em "cair" (21,93), um deles recebe o check de enviado.

**Transição 3→4 (≈22,7 s):** a cena azul **se fecha num círculo** que viaja até onde vai ficar o número "2" da nova cena e **vira o quadradinho do 2**. A máscara anda de forma contínua (nunca some de uma vez); revise o quadro 22,87–22,90, onde estava o salto.

**Cena 4 · Dica 2: usa o FGTS (22,7–31,4 s)**
- **"FGTS" (23,97):** a carteira com o cartão do FGTS entra.
- **"dois anos" (25,24):** um calendário vira as folhas até "a cada 2 anos".
- **"abater" (26,96):**
  - moedas saem da carteira e caem numa barra vermelha "Sua dívida";
  - a barra **encolhe** a cada moeda, com um som de moeda em cada uma;
  - o pedaço abatido vira verde e se solta.
- **"para de render" (29,72):** um contador "juro rendendo" que estava girando para, e o rótulo vira "esse pedaço parou de render ✓", com check verde.

**Transição 4→5 (≈31,4 s):** **corte casado**: a barra da dívida gira 90° e vira o eixo vertical do gráfico da cena 5.

**Cena 5 · Dica 3: tabela SAC (31,4–38,8 s)**
- **Gráfico:** "parcela ao longo de 30 anos (exemplo)".
- **Linha Price:** a linha cinza reta ("Price: fixa", R$ 3.927) desenha primeiro.
- **"começa maior" (34,19):** a linha azul SAC começa acima (R$ 4.907).
- **"cai" (35,19):** a linha azul desce até R$ 1.122 no mês 360, com uma bolinha correndo na ponta.
- **"no total" (36,10):** abaixo, duas barras de "juro total pago": SAC R$ 685 mil (azul) contra Price R$ 1,01 milhão (cinza).
- **"Price" (37,94):** a diferença (≈R$ 330 mil) acende em verde: "você economiza".
- Estes números vêm de simulação: R$ 400 mil, 12% ao ano, 360 meses. Confira no código com a fórmula antes de usar.

**Transição 5→6 (≈38,8 s):** a bolinha da ponta da linha SAC **vira o botão de um celular**, e a câmera "entra" pelo celular, que fica em pé no centro.

**Cena 6 · Dica 4: portabilidade (38,8–44,5 s)**
- **Celular:** um app de banco com o cartão "Banco caro · 15% a.a." em cima e, embaixo, um cartão apagado "Banco mais barato".
- **"portabilidade" (41,38):** a palavra PORTABILIDADE aparece no topo com a luz passando.
- **"leva a dívida" (42,53):** a pílula "dívida" se desprende do banco caro e **voa em arco** até o mais barato, deixando um rastro.
- **"mais barato" (43,56):** o cartão de baixo acende com borda verde, e o de cima esmaece.

**Transição 6→7 (≈44,5 s):** a tela do celular se expande e vira a grade de prédios da cena 7 (os ícones do app viram os prédios).

**Cena 7 · Bônus (44,5–49,5 s)**
- **"bônus" (45,04):** a pílula dourada BÔNUS entra com brilho.
- **"à venda" (46,57):** uma grade de 24 a 32 **ícones de prédio** (os mesmos do set) aparece em cascata aleatória; vários recebem uma plaquinha "à venda".
- **"preço" (47,81):** uma etiqueta de preço "preço pedido R$ 500 mil" entra.
- **"negocia" (48,73):** um controle deslizante move a proposta para a esquerda, e a etiqueta ganha "sua proposta". **Não invente percentual de desconto.**

**Transição 7→8 (≈49,5 s):** a ilha preta do iPhone volta no topo e **cresce até virar a conversa do direct**.

**Cena 8 · CTA (49,5–53,0 s)**
- **Direct:** cabeçalho com a foto do Pedro e "vistabroker.perioto".
- **"CONTA" (50,27):** a palavra é digitada no campo e enviada (balão roxo-azulado), com o som de envio.
- **"comparo" (51,38):** a resposta do Pedro aparece: "Bora comparar! Me passa o valor do imóvel e a sua renda 🏦".

**Cena 9 · Cartão final (53,05–55,85 s)**
- **Foto e textos:** foto com anel colorido, "vistabroker.perioto", "CORRETOR · CRECI 258729" e "Toda semana: o que a notícia muda no seu imóvel."
- **Botão:** "Seguir" é tocado e vira "Seguindo".

## 10. Design de som (efeitos próprios, sincronizados quadro a quadro)

Todos os sons são **sintetizados por você** (numpy/scipy), com nada baixado e nada da Apple. Referência de qualidade: sons de interface do iOS e do macOS, curtos, limpos, "de vidro".

**Biblioteca a criar** (cada som com 2 ou 3 variações de tom, para não repetir igual):
- **tick:** clique seco de interface, 20–30 ms, banda 2–7 kHz. Para números contando, no máximo um a cada 70 ms.
- **glass tap:** toque de vidro, seno com harmônico inarmônico (×2,76), ataque de 2 ms e cauda de 250 ms. Para cartões chegando.
- **pop:** varredura de 500 para 1.900 Hz em 90 ms. Para selos e pílulas.
- **whoosh:** ruído filtrado com o filtro acompanhando a velocidade do objeto, 250–600 ms. Para transições. O pico do whoosh cai **no quadro de maior velocidade** da transição, não no começo.
- **riser curto:** 300–500 ms subindo, antes de uma revelação importante (o "+R$ 745", o "R$ 330 mil", o PORTABILIDADE).
- **impact:** grave abafado, de 70 caindo para 38 Hz, com 400 ms. Só 3 vezes no vídeo (PAROU, +R$ 745, economia da SAC).
- **coin:** dois tons de metal (3,2 e 4,1 kHz), um por moeda.
- **notification:** duas notas subindo (Mi 6 e Si 6). Na notificação do Copom e no envio do CONTA.
- **toggle e check:** clique + pequeno tom. No check de "parou de render" e no envio do avião.

**Regras de mixagem:**
1. **Sincronia exata:** o ataque de cada som cai no **mesmo quadro** do evento visual (tolerância de ±1 quadro). Calcule pelo tempo da animação, nunca "de ouvido".
2. **A voz manda:** a narração fica em torno de −16 LUFS. Efeitos 8 a 12 dB abaixo da voz quando ela está falando, e um pouco mais altos nos intervalos sem fala. Faça um *ducking* leve (−3 dB nos efeitos) durante as palavras-âncora.
3. **Máximo de 2 efeitos simultâneos.** Se houver mais eventos juntos, mantenha o mais importante.
4. **Pan estéreo** acompanhando a posição do objeto na tela (o avião vai da esquerda para a direita, o som também). Exporte em estéreo.
5. **Espaço:** um reverb curto e sutil (sala pequena, 10–15% de mistura) só nos sons de vidro e notificação, para soarem "de produto".
6. **Mix final:** −14 LUFS integrado, pico máximo −1 dBTP.
7. **Sem música**, mas deixe espaço no grave (corte abaixo de 80 Hz nos efeitos, exceto o impact) para a trilha que o Pedro vai pôr no app.

## 11. Processo obrigatório

1. Leia este prompt, a skill de motion design (`SKILL.md` + `director/choreography.md`) e a skill motion-reel.
2. **Monte o "beat grid":** uma tabela com todas as palavras-âncora → evento visual → som → duração. Salve em `videos/juro-4jeitos/v2/beatgrid.md`.
3. Crie o projeto em `videos/juro-4jeitos/v2/`, com `index.html`/template, `build.py` lendo o `palavras.json` e `som.py`. Reaproveite `voz/` e `assets/`.
4. **Contact sheets:** tire snapshots a cada 1 s e em todos os pontos de transição (HyperFrames: `snapshot --at ...`), monte folhas de contato e **olhe**. Corrija cena vazia, texto cortado, sobreposição com a legenda e ícone incoerente.
5. **Teste de fluidez obrigatório** no vídeo renderizado (script em Python com ffmpeg, frames em 108x192 em tons de cinza):
   - **tela parada:** nenhum trecho com diferença média entre quadros < 0,15 por mais de 0,3 s;
   - **salto brusco:** nenhum quadro com diferença média > 12 que não seja uma transição planejada, e mesmo nessas, a diferença deve se espalhar por pelo menos 6 quadros.
   Rode, mostre os números e corrija até passar.
6. **Teste de som:** meça o LUFS integrado (ffmpeg `ebur128`) e confira que fica em −14 ±1. Liste os eventos sonoros com o tempo e o quadro do evento visual correspondente.
7. **Render:**
   ```bash
   export HYPERFRAMES_BROWSER_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell|head -1)
   env -u no_proxy -u NO_PROXY -u GLOBAL_AGENT_NO_PROXY npm_config_noproxy=localhost HYPERFRAMES_SKIP_SKILLS=1 npx -y hyperframes@0.8.200 render --format png-sequence --output out/ov .
   ```
   Depois junte os PNGs com o áudio no ffmpeg (libx264, crf 16, yuv420p, AAC 192k, `-movflags +faststart`). O render leva ~7 min a 30 fps; rode em segundo plano.
8. **Prévia para aprovação:** envie `out/juro_4jeitos_v2_previa.mp4` ao Pedro com 3 a 5 linhas dizendo o que mudou e o que ele deve conferir no celular. **Não faça a versão final sem o OK dele.**
9. Commit e push em cada etapa.

## 12. Checklist antes de enviar a prévia

- [ ] O 1º quadro já comunica o assunto (notificação + PAROU chegando).
- [ ] A foto do Pedro aparece em ≤1 s.
- [ ] Cada dica se entende **sem som** só pela imagem.
- [ ] Nenhuma cena começa vazia; o conteúdo chega junto com a voz.
- [ ] Nenhum trecho parado > 0,3 s; nenhum salto brusco (teste do item 11.5 aprovado).
- [ ] Todas as transições são diferentes entre si e nascem de um elemento da cena anterior.
- [ ] O mesmo conjunto de ícones é usado no vídeo inteiro, com luz, sombra e volume.
- [ ] A legenda acompanha a voz palavra por palavra e não fica atrás de nenhum elemento.
- [ ] Cada efeito sonoro cai no quadro do evento; mix em −14 LUFS; voz sempre clara.
- [ ] Números corretos: 13,75%; 12,5% e 15%; R$ 400 mil; R$ 5.052, R$ 5.797 e R$ 745; R$ 3.927, R$ 4.907 e R$ 1.122; R$ 685 mil e R$ 1,01 milhão; 2 anos. Nenhuma fonte escrita no vídeo.
- [ ] CTA para o direct com CONTA; nenhum pedido de comentário.
- [ ] Prévia enviada e aguardando aprovação.
