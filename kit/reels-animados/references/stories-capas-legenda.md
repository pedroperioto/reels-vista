# Stories, capas e legenda do post

## Stories a partir de vídeo horizontal de imóvel (`modelos/stories/`)
1. Leia o anúncio do imóvel (link do usuário) e anote só o que está escrito lá: área, suítes, vagas, banheiros,
   diferenciais, bairro. Preço: pergunte antes de colocar (alto padrão costuma funcionar melhor sem preço).
2. Ache os cortes por ambiente: `ffmpeg -i in.mp4 -vf "select='gt(scene,0.25)',showinfo" -an -f null -` + folha de
   contato a cada 2 s. Corte o final em preto/marca d'água do editor (`blackdetect`).
3. Partes de até 60 s, por ambiente (social, varanda/cozinha, íntima, suítes). Preencha `config_exemplo.json` e rode
   `python3 fazer_stories.py config.json`.
4. Diga ao usuário onde pôr o adesivo de link (faixa escura abaixo do CTA) e a ordem de postagem.

## Capa do Reels
- 1080×1920 em HTML → PNG com Playwright; o essencial no recorte 4:5 (y 285–1635). Confira o recorte antes de enviar.
- Série: mantenha elementos da capa anterior (fotos, cartão "time A × time B"), mas mude o clima para não ficar idêntica.
  O pedido que funcionou na parte 2: preto e branco com só o essencial em cor (amarelo/vermelho), peças do vídeo
  (selo, globo, faixa de cadeado, personagens) e título curto e forte. Modelo: `modelos/capas/capa_pb.html`.
- Capa com foto: um quadro do vídeo escurecido + título grande (`modelos/capas/capa_foto_claro.html`).

## Legenda do post (modelo)
```
<gancho em 1 linha, igual ao do vídeo> 🏢

<contexto com os 2–3 números principais e datas>

<o que não mudou / o que importa para o seu bolso, em 2 bullets com emoji>

<assinatura da marca>. <dica prática>.

<pergunta de comentário (time A ou B? palavra-chave)> 👇

<nome · cargo · registro>

Fontes: <lista>. <datas; "números de mercado são máximas do dia" se for o caso>. Personagens fictícios. Conteúdo informativo.

#<5 hashtags: tema, mercado, cidade/bairro>
```
- Primeira linha antes do "mais" (~125 caracteres) é o gancho.
- Junto, mande 1 sugestão de resposta padrão para os comentários/direct que puxe para o serviço.

## Duração no Instagram
- Biblioteca de música do Instagram só cobre 90 s: em vídeo maior, a trilha vai embutida (por isso trilha original).
