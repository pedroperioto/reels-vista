#!/bin/bash
# corta os planos da prévia em 1080x1920 30fps, com tratamento de cor de cinema
set -e
B=../../sair-pais-v2/brutos; R=../brutos
OFF=4.2
G="eq=contrast=1.08:saturation=0.85:brightness=-0.04,curves=preset=darker,vignette=PI/4.5"
# A: Poderoso Chefão — faixa 16:9 sobre fundo desfocado
ffmpeg -v error -y -ss 55.2 -t $OFF -i $R/rec1.mp4 -filter_complex "[0:v]crop=1640:1000:520:54,fps=30,split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=30:3,eq=brightness=-0.25[bg];[b]scale=1080:-2,scale=w='1080*(1+0.04*t/$OFF)':h=-2:eval=frame,crop=1080:658[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2-40,$G,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -crf 16 -preset fast seg/a.mp4
# B: chaves passando de mão (Pexels 7817154)
plano(){ # arquivo inicio dur saida zoom
ffmpeg -v error -y -ss $2 -t $3 -i "$1" -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,scale=w='1080*(1+$5*t/$3)':h=-2:eval=frame,crop=1080:1920,${6:-$G},format=yuv420p" -an -c:v libx264 -crf 16 -preset fast seg/$4.mp4; }
plano $B/2a177f3a-7817154-hd_1080_1920_25fps.mp4 1.0 3.55 b 0.06
plano $B/2228f157-pexels-media-17955817.mp4 1.0 2.0 c 0.10
plano $B/px_cidade.mp4 2.0 3.30 d 0.08
plano $B/c5afd1da-6016323-uhd_2160_3840_30fps.mp4 2.0 2.55 e 0.05 "eq=contrast=1.05:saturation=0.9:brightness=0.10:gamma=1.35,vignette=PI/5"
plano $B/4ebee7e4-4553290-uhd_2160_4096_25fps.mp4 1.0 2.40 f 0.07
printf "file seg/%s.mp4\n" a b c d e f > lista.txt
ffmpeg -v error -y -f concat -safe 0 -i lista.txt -c copy base.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 base.mp4
