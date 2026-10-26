---
name: reels-animados
description: Use para criar Reels e stories animados 9:16 sobre um tema, com roteiro checado, narração do Google AI Studio, cenas e efeitos presos às palavras, capa e legenda do post.
---

# Reels animados com narração (HyperFrames)

Fluxo completo que gera vídeos 1080×1920 como os do @vistabroker.perioto: roteiro com gancho e dados com fonte,
narração gravada pelo usuário no Google AI Studio, animação em HTML/GSAP renderizada pelo HyperFrames, legenda
palavra a palavra, trilha original e efeitos sincronizados, capa e legenda do post. Tudo de graça (sem ferramenta paga).

Pastas desta skill (`SKILL_DIR` = pasta deste arquivo):
- `modelos/base/` — modelo completo "história + painéis de dados" (noite navy, globo 3D, personagens). Exemplo: pós-eleição.
- `modelos/claro-imposto/` — modelo claro (estilo Apple, navy + dourado, clipes do Pexels). Exemplo: imposto do aluguel.
- `modelos/stories/` — transforma vídeo horizontal de imóvel em stories verticais. `modelos/capas/` — capas.
- `scripts/alinhar.py` — prende cada palavra da narração ao seu tempo.
- `references/` — leia o arquivo de cada etapa quando chegar nela (lista abaixo).

## Regras que valem sempre

1. **Confirme antes de criar.** Mostre o roteiro e a proposta de cenas e espere o "ok". Depois, uma prévia curta (~15 s)
   e outro "ok" antes da versão completa. Pergunte só o que muda o resultado.
2. **Nunca invente dado.** Todo número vem de fonte confiável pesquisada na hora (órgão oficial, CNN, Forbes, InfoMoney,
   Bloomberg Línea, FipeZap, IBGE, BCB…), com data. A fonte aparece **só** nas telas de dado. Dado de mercado do dia:
   use "chegou a" e mostre o horário. Se errar, conte ao usuário e corrija.
3. **Imparcial em política.** Os dois lados com o mesmo tratamento. Não desenhar nem criar personagem que lembre político
   real (caricatura, roupa/cabelo/traço característico). Use símbolos (números de urna, cores, placar) e personagens
   originais (eleitores fictícios). Fotos reais de imprensa podem entrar na capa, iguais para os dois lados.
4. **Fácil como para uma criança.** Uma ideia por cena, frase curta, termo técnico explicado, número em algarismo na tela.
5. **Marca do usuário.** Leia `marca.json` do projeto (nome, cargo/registro, @, logo, cores, região). Se estiver com os
   valores de exemplo, pergunte uma vez e preencha. Fecho padrão: cartão final + "Conteúdo informativo".
6. **Sem ferramenta paga.** Narração no Google AI Studio (grátis, o usuário grava e manda o WAV), clipes do Pexels
   (o usuário baixa e manda), trilha e efeitos sintetizados no código (sem música comercial embutida: o Instagram pode
   silenciar o vídeo inteiro).

## Etapas

**1. Pauta e pesquisa** → `references/roteiro-e-dados.md`. Pesquise o tema e o que está performando (posts de portais e
perfis grandes: curtidas/comentários). Proponha o gancho para o público-alvo e o ângulo que liga ao negócio do usuário.

**2. Roteiro + narração** → `references/narracao-ai-studio.md`. Entregue o texto no formato do AI Studio (bloco de estilo +
texto com `<short pause>`, `<long pause>`, `<chuckle>`, MAIÚSCULAS para ênfase, números por extenso) e as instruções de
gravação. Junto, a lista de cenas (o que aparece na tela em cada frase).

**3. Prévia** → copie um modelo para uma pasta nova do projeto e adapte (veja "Adaptar um modelo"). Com `build.py --fake`
(tempos estimados) dá para montar e mostrar a prévia antes de a narração chegar.

**4. Narração chegou** → salve como `voz/bruto_original.wav`, escreva `voz/texto.txt` (só as palavras, sem marcações) e rode
`python3 SKILL_DIR/scripts/alinhar.py <projeto>`. Depois `build.py`, `trilha.py`, `som.py`, lint, snapshots
(`references/hyperframes.md`). Mande os quadros de conferência, então renderize.

**5. Entrega** → vídeo final + capa (`references/stories-capas-legenda.md`) + legenda do post pronta para colar + dica de
como responder os comentários. Para imóvel em vídeo horizontal: `modelos/stories/`.

## Adaptar um modelo

- `src/template.html` é o vídeo. Cada cena é um `<div class="scene clip" data-start="@@CORTE@@">`; os tempos vêm de tokens
  `@@...@@` que o `build.py` preenche a partir da narração. No script, `M.nome` = início da palavra-marco, `C.XY` = corte entre
  cenas (meio da pausa entre frases). Toda animação usa `M`/`C`, nunca segundos fixos — assim tudo acompanha a voz.
- `build.py`: no dicionário de marcadores, cada nome aponta para uma frase do roteiro (`'toquio': 'Em Tóquio'`). Ao mudar o
  roteiro, troque os marcadores e os cortes. `MERGE` junta números falados ("cinquenta e um vírgula oito") num só item da
  legenda ("51,8%").
- `trilha.py` usa o marcador da virada (`M["m2"]` no exemplo) para o corte seco: renomeie junto.
- `som.py`: efeitos presos aos mesmos marcadores (`P(M['catorze'], thud(), 0.6)`) + ambiências por cena + mixagem com
  "ducking" (a música abaixa quando a voz fala). `trilha.py`: trilha original com seções por cena e corte seco na virada.
- Personagens (`assets/personagens.js`): `rafa(id)`/`celia(id)` são exemplos; crie personagens próprios no mesmo padrão
  (braços `.armL/.armR/.armsX`, bocas `.m-*`, sobrancelhas `.b-*`, `.eyes`).
- Globo (`assets/globo.js`): `Globo(svg, {cx, cy, r}).draw({lon, lat, k, pins, arcs})`, redesenhado no `onUpdate` do timeline.
  Para a cidade não ficar embaixo da legenda, centralize ~16° ao sul dela.

## Referências

| Arquivo | Quando ler |
|---|---|
| `references/roteiro-e-dados.md` | pauta, gancho, estrutura, checagem de dados, fontes, temas políticos |
| `references/narracao-ai-studio.md` | texto e instruções para o usuário gravar a voz |
| `references/hyperframes.md` | comandos, variáveis de ambiente, erros comuns, render, troca de áudio |
| `references/design-e-som.md` | identidade, legendas, transições com causa, efeitos sonoros, trilha |
| `references/stories-capas-legenda.md` | stories verticais, capa da grade, legenda do post, comentários |
