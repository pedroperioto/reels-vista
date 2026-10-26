#!/bin/sh
# extrai os trechos usados (quadros 1080x1920, 30 fps) para clips/<nome>/NNNN.jpg
cd "$(dirname "$0")/.."
x() { mkdir -p clips/$1; rm -f clips/$1/*.jpg; ffmpeg -loglevel error -y -ss $3 -t $4 -i midia/$2 -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,eq=saturation=0.92:contrast=1.03" -q:v 3 clips/$1/%04d.jpg; echo "$1: $(ls clips/$1 | wc -l) quadros"; }
x predios 1_predios.mp4 1.5 3
x chaves 2_chaves.mp4 0.6 2.4
x dinheiro 3_dinheiro.mp4 2.5 2.6
x calc 5_calculadora.mp4 0.8 2.6
x mala 6_mala.mp4 1.5 3.4
