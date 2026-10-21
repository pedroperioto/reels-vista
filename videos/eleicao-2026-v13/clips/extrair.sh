#!/usr/bin/env bash
# Extrai os trechos dos vídeos do Pedro em quadros 1080x1920 a 30 fps (JPEG) para o motor.
set -e; cd "$(dirname "$0")"; U=/mnt/user-data/uploads
seg() { mkdir -p "$1"; ffmpeg -loglevel error -y -ss "$3" -t "$4" -i "$U/$2" -an -vf "fps=30,scale=1080:1920:flags=lanczos,eq=saturation=0.95:contrast=1.02" -q:v 4 "$1/%04d.jpg"; echo "$1: $(ls $1 | wc -l) quadros"; }
seg hect_pan  20261009_135116.mp4 0.0 5.0 &
seg hect_walk 20261009_135116.mp4 7.4 5.2 &
seg hl_trem   20261016_123307.mp4 8.5 6.0 &
wait
seg hl_obras  20261016_123212.mp4 1.0 5.5 &
seg hl_arco   20261016_123212.mp4 18.5 5.0 &
seg hl_torre  20261016_123307.mp4 21.0 7.5 &
wait
