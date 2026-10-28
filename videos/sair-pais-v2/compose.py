# compose.py — junta imagens (base.mp4) + grafismos (out/ov/*.png com transparência) + grão de filme + whip nos cortes + som
# Uso: python3 compose.py [saida.mp4] [inicio fim]   (inicio/fim opcionais = só um trecho, para prévia)
import json, subprocess, sys, glob
from pathlib import Path
HERE = Path(__file__).parent
SH = json.load(open(HERE / 'voz' / 'planos.json'))
out = sys.argv[1] if len(sys.argv) > 1 else str(HERE / 'out' / 'parte3_cinema.mp4')
a, b = (float(sys.argv[2]), float(sys.argv[3])) if len(sys.argv) > 3 else (0.0, None)
pngs = sorted(glob.glob(str(HERE / 'out' / 'ov' / '*.png'))); assert pngs, 'renderize a camada de grafismos antes (out/ov)'
first = Path(pngs[0]).name; digits = len(''.join(c for c in first if c.isdigit())); prefix = first.split('0')[0]
pat = str(HERE / 'out' / 'ov' / f'{prefix}%0{digits}d.png'); start_num = int(''.join(c for c in first if c.isdigit()))
# whip (desfoque direcional) em cada corte: mais forte quando entra ou sai um filme
whips = []
for i, (t, k, mode) in enumerate(SH[1:], 1):
    film = mode in ('band', 'sq') or SH[i - 1][2] in ('band', 'sq')
    w, r = (0.08, 90) if film else (0.05, 45)
    whips.append(f"dblur=angle=0:radius={r}:enable='between(t,{t - w:.3f},{t + w:.3f})'")
vf = (f"[0:v]{','.join(whips)},noise=alls=7:allf=t+u,format=rgba[bg];"
      f"[1:v]format=rgba[ov];[bg][ov]overlay=0:0:format=auto,format=yuv420p[v]")
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', str(HERE / 'base.mp4'),
       '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-framerate', '30', '-start_number', str(start_num), '-i', pat,
       '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', str(HERE / 'assets' / 'som.wav'),
       '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out]
subprocess.run(cmd, check=True); print('ok →', out)
