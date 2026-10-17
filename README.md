# Reels Vista Broker

Motor dos vídeos animados do @vistabroker.perioto (1080×1920, estilo Apple claro, mapa 3D da Zona Leste).
Cada vídeo é uma pasta em `videos/`. O primeiro é `videos/eleicao-2026` (v6).

## Comandos (sempre da raiz do projeto)

| Comando | O que faz | Tempo aprox. |
|---|---|---|
| `./build.sh check eleicao-2026` | confere erros de código e gera `out/conferencia.jpg` com 3 quadros por cena | 15 s |
| `./build.sh frames eleicao-2026 mapa` | 5 quadros só da cena "mapa" (ou tempos: `95,98.5,101`) | 10 s |
| `./build.sh preview eleicao-2026` | prévia a 15 fps com som → `out/previa.mp4` | 3 a 10 min |
| `./build.sh final eleicao-2026 reels_v7` | versão final a 30 fps com som → `out/reels_v7.mp4` | 5 a 20 min |

`preview` e `final` também geram `out/narracao.txt` e `out/narracao.srt` (para a voz de IA) e a trilha em `out/som.wav`.

**Cache do mapa:** a primeira render salva a imagem 3D de cada quadro do mapa em `out/mapcache/`. Se você só mexer em
textos, cartões e números, a próxima render reaproveita o mapa (≈7× mais rápida nessa parte). Se mudar a fala da cena
do mapa, a câmera ou os prédios, o cache se renova sozinho.

## Como um vídeo é organizado (`videos/<nome>/`)

- `main.js` → **roteiro e animação**. No topo fica o `PLAN`: uma linha por cena com `[nome, respiro inicial, respiro final, 'fala']`.
  O tempo de cada cena sai da fala (2,5 palavras/s + pausa após ponto). As animações se prendem às palavras (`w[12]` = 13ª palavra da cena).
- `map3d.js` → maquete 3D (distritos, metrô, prédios `PREDIOS` com nome, posição, altura e construtora).
- `som.py` → trilha e efeitos, sincronizados às mesmas palavras.
- `fotos/` → fotos e logo. `distritos.json` / `transporte.json` → dados do mapa (Geosampa, Metrô).
- `out/` → tudo que é gerado (não vai para o Git).

## Fazer um vídeo novo

1. Copie a pasta: `cp -r videos/eleicao-2026 videos/novo-tema` (e apague `videos/novo-tema/out`).
2. Troque o `PLAN` e as cenas em `main.js`; ajuste `som.py` para os novos índices de palavras.
3. `./build.sh check novo-tema` até os quadros ficarem bons → `./build.sh final novo-tema`.

## Regras da casa (resumo — a skill "reels-vista-broker" tem a versão completa)

Fundo claro, navy `#0B1F3A` + dourado `#B8955A`, sombras suaves, safe zone do Instagram (texto entre y≈250 e 1500),
cores de partido ≤ 20% do quadro, fonte só no quadro que usa o dado, nada de número inventado, imparcial,
CTA "indique um amigo" + comentário + @ + logo Vista no fim.

## Requisitos

Python 3 com `playwright`, `numpy`, `scipy`, `Pillow`; Node 18+; `ffmpeg`. O Chromium do Playwright renderiza o 3D por software.
Biblioteca 3D (three.js r169) e fontes já estão em `lib/`.

## Créditos de áudio

Efeitos CC0: "Micro Pack – Organic Wooshes" e "BB_2HTC Samples Vol 4" (cc0sounds), teclado: Kenney (CC0). Trilha sintetizada no `som.py`.
