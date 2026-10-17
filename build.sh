#!/usr/bin/env bash
# Pipeline dos Reels da Vista Broker. Rode da raiz do projeto.
#   ./build.sh check   <video>            erros de código + quadros de conferência (3 por cena)
#   ./build.sh frames  <video> <t1,t2|cena>  quadros específicos (segundos ou nome da cena)
#   ./build.sh preview <video>            prévia rápida: 15 fps, com som  → out/previa.mp4
#   ./build.sh final   <video> [nome]     versão final: 30 fps, com som   → out/<nome>.mp4
# <video> é o nome da pasta em videos/ (ex.: eleicao-2026). PROCS=3 muda o nº de processos de render.
set -euo pipefail
cd "$(dirname "$0")"
CMD=${1:-}; VID=${2:-}; [ -z "$CMD" ] || [ -z "$VID" ] && { sed -n '2,8p' "$0"; exit 1; }
DIR=videos/$VID; OUT=$DIR/out; mkdir -p "$OUT"
PROCS=${PROCS:-$(nproc)}
step() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }

step "conferindo o código"
for f in "$DIR"/*.js; do node --check "$f" || { echo "✗ erro de sintaxe em $f (linha indicada acima)"; exit 1; }; done; echo "ok"
step "tempos das cenas"; python3 tools/timing.py "$VID"

case "$CMD" in
  check)  step "quadros de conferência"; python3 tools/snap.py "$VID" ;;
  frames) step "quadros"; python3 tools/snap.py "$VID" "${3:?informe tempos ou cena}" ;;
  preview|final)
    FPS=30; NAME=${3:-$VID}; [ "$CMD" = preview ] && { FPS=15; NAME=previa; }
    step "narração (TXT + SRT)"; python3 tools/narracao.py "$VID"
    step "trilha e efeitos"; (cd "$DIR" && python3 som.py)
    step "render ($FPS fps, $PROCS processos)"; python3 tools/render.py "$VID" "$FPS" "$PROCS" "$OUT/mudo.mp4"
    step "juntando som"
    ffmpeg -loglevel error -y -i "$OUT/mudo.mp4" -i "$OUT/som.wav" -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/$NAME.mp4"
    echo "pronto → $OUT/$NAME.mp4 ($(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$NAME.mp4" | cut -d. -f1)s)" ;;
  *) sed -n '2,8p' "$0"; exit 1 ;;
esac
