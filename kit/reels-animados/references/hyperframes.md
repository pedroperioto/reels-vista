# HyperFrames: comandos e armadilhas

HyperFrames (HeyGen) = vídeo feito de HTML + GSAP, renderizado quadro a quadro em Chromium. Versão testada: 0.8.200.

## Preparar o ambiente (uma vez por sessão)
```bash
export HYPERFRAMES_BROWSER_PATH=$(ls -d /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell | head -1)
HFX="env -u no_proxy -u NO_PROXY -u GLOBAL_AGENT_NO_PROXY npm_config_noproxy=localhost HYPERFRAMES_SKIP_SKILLS=1 npx -y hyperframes@0.8.200"
$HFX telemetry disable
```
- Sem `HYPERFRAMES_BROWSER_PATH` o download do Chrome falha (ENOTFOUND). O `env -u …` resolve o proxy do npm.
- Se não existir `/opt/pw-browsers`: `pip install playwright --break-system-packages && python3 -m playwright install chromium` e aponte
  `HYPERFRAMES_BROWSER_PATH` para o `headless_shell`/`chrome` instalado em `~/.cache/ms-playwright/`. Também precisa de `ffmpeg`,
  `python3` com `numpy`/`scipy`/`Pillow` (instale com pip se faltar) e `node`.
- CDNs (jsdelivr etc.) podem estar bloqueados: GSAP, d3 e fontes ficam em `assets/` (já incluídos nos modelos).
- Para baixar pacotes npm (fontes @fontsource, d3, world-atlas): `npm pack <pacote>` com o mesmo `env -u …`.

## Ciclo
```bash
python3 build.py [--fake]          # gera index.html (tempos da narração ou estimados)
python3 trilha.py && python3 som.py  # trilha + efeitos + voz → assets/som.wav
$HFX lint                           # 0 erros; avisos nested_structure_needs_subcomposition são aceitáveis
$HFX check --json                   # layout, contraste, texto que sai da tela
$HFX snapshot --at 3.8,12.5,30      # PNG + contact-sheet em .hyperframes/artifacts/snapshots/<id>/
$HFX render --quality looks --output out/final.mp4   # ~0,45 s por quadro em 2 CPUs (2 min de vídeo ≈ 28 min)
```
- Renders longos: rode em background e avise o usuário do tempo.
- **Trocar só o áudio** (música nova, mix diferente) não precisa renderizar de novo:
  `ffmpeg -i out/final.mp4 -i assets/som.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out/final2.mp4`

## Regras do formato (aprendidas no erro)
- Um único `index.html` raiz com `data-composition-id`; outros HTML (template, prévias) ficam em `src/`.
- Todo elemento com tempo: `class="clip"`, `data-start`, `data-duration`. Vídeo: filho direto, `muted`, e só anime
  **opacidade** nele (nada de transform).
- Um timeline pausado em `window.__timelines['main']`. Só lógica determinística (sem `Math.random`; use LCG com semente).
- Não anime `letterSpacing` (erro gsap_non_transform_motion); use scale/blur. Prefira `fromTo`.
- Overlay de tela cheia que entra depois do 0 s precisa começar com `opacity:0` no HTML.
- Não misture `transform` em CSS com tween de x/xPercent no mesmo elemento: use `gsap.set` no script.
- Texto/contadores desenhados por código: `tl.eventCallback('onUpdate', …)` redesenha a cada quadro (seek-safe).
- Rótulos que trocam por `tl.call` + `fromTo`: use `immediateRender:false`, senão somem ao pular no tempo.
- Legenda: grupos de até 3 palavras, `display:flex; column-gap:34px` (o `scale` da palavra atual come o espaço).
- Câmera dentro de SVG: anime o atributo `viewBox` (fica nítido); não escale DOM com CSS.

## Clipes do Pexels
- O usuário baixa e manda (a rede da sessão bloqueia Pexels/YouTube). Converta para 1080×1920, 30 fps, sem som:
  `ffmpeg -ss <início> -t <dur> -i in.mp4 -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -an -c:v libx264 -crf 18 -g 15 assets/video/nome.mp4`
- O clipe precisa durar pelo menos o tempo da cena. Avise se aparecer algo fora do tema (ex.: notas de dólar).
