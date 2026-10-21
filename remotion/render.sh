#!/usr/bin/env bash
# uso: ./render.sh <Composicao> <saida.mp4>   (ex.: ./render.sh Teste out/teste.mp4)
# Instalar pacotes neste ambiente exige contornar o NO_PROXY do npm:
#   env -u no_proxy -u NO_PROXY -u GLOBAL_AGENT_NO_PROXY npm_config_noproxy=localhost npm install ...
cd "$(dirname "$0")"
npx remotion render src/index.jsx "${1:?composicao}" "${2:?saida}" \
  --browser-executable=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
  --chrome-mode=chrome-for-testing --gl=swangle --log=warn
