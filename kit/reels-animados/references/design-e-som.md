# Design e som

## Identidade (troque pelas cores do `marca.json`)
- **Claro (Apple):** fundo #F3F4F6/branco, navy #0B1F3A, dourado #B8955A/#E2C27F, Inter Black/Semi/Med + Instrument Serif.
- **Noite de dados:** fundo navy profundo, globo 3D, cartões com etiqueta mono (● TÓQUIO), fonte embaixo em mono,
  número gigante (Inter Black 190 px), amarelo #FFD24A como destaque, vermelho #E5484D para queda.
- **Ilustração:** personagens chapados originais, cenários simples (prédio, janelas, elevador, plantão de vendas).

## Áreas seguras (1080×1920)
- Texto entre y 168 e 1330 no Reels (legenda em ~1235). Stories: evitar topo 250 px e base ~300 px.
- Capa: o essencial dentro do recorte 4:5 da grade (y 285–1635).

## Legenda
- 1–3 palavras por vez, MAIÚSCULAS condensadas (Oswald 700, 72 px) ou Inter Black, palavra atual em amarelo/dourado
  com leve escala, já faladas em branco, futuras a 50%. Números em algarismos (merge no `build.py`).

## Transições com causa (nunca "fade porque sim")
- Câmera sobe do prédio para o céu → globo. Mergulho na janela → TV/urna. Placar encolhe num ponto de luz → vira rojão.
- Cortina fecha a tela e abre em outro lugar. Notificação do celular cresce e vira o painel. TV desliga (linha) → cena.
- A casinha do "financiamento" cresce e vira a portaria. O "+9%" do boleto toma a tela e vira o próximo painel.
- O corte fica no meio da pausa entre frases e a nova cena entra com a 1ª palavra da fala nova.
- Movimento: entradas `expo.out`/`back.out`, saídas mais curtas `power3.in`, blur-in de 0,13–0,25 s nas palavras.
  Princípios completos: skill `motion-design-principios`.

## Efeitos sonoros (som.py)
- Biblioteca: `instrumentos.py` (kick, clap, hat, pluck, pad, bass, riser, impact, pop, tick, click, chime, buzz) +
  `sfx/` CC0 (whooshes, teclado, prato reverso).
- Já prontos no modelo base: rojão (assobio + estouro + estalos + torcida), cortina (swish), contador (ticks), carimbo
  (thud + impact), celular vibrando, alarme, coração, elevador (zumbido, "plim", porta), papel do envelope, "ka-ching",
  pops em cada número, risers antes das viradas, ambiência de cidade/rua.
- Mix: voz na frente; música ~8–12 dB abaixo com ducking (0,5 quando há voz); efeitos ~10 dB abaixo da voz;
  loudnorm −14 LUFS. Medir com o trecho de checagem do `som.py` (voz × fundo por seção).

## Trilha (trilha.py)
- Original, sintetizada (sem direitos). O modelo tem "sombria slowed" (84 BPM, Fá menor, baixo pulsante com sidechain,
  pad, sinos, reverb): intro abafada → auge na tensão → médio → **corte seco de 1 s na virada** → final claro e aberto.
- Se o usuário pedir uma música famosa: explique o risco de silenciamento e ofereça uma original "no estilo".
