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
# efeitos de câmera por tipo de transição (a montagem já fez o slide/zoom/fade; aqui entra o desfoque de movimento e o glitch)
TRJ = json.load(open(HERE / 'voz' / 'transicoes.json'))
whips = []
for t, ty, du in TRJ:
    w = du / 2 + 0.03
    if ty == 'whipL': whips.append(f"dblur=angle=0:radius=110:enable='between(t,{t - w:.3f},{t + w:.3f})'")
    elif ty == 'whipU': whips.append(f"dblur=angle=90:radius=110:enable='between(t,{t - w:.3f},{t + w:.3f})'")
    elif ty == 'zoom': whips.append(f"gblur=sigma=14:enable='between(t,{t - 0.06:.3f},{t + 0.06:.3f})'")
    elif ty == 'glitch': whips.append(f"rgbashift=rh=-18:bh=18:gv=6:enable='between(t,{t - 0.12:.3f},{t + 0.12:.3f})'")
vf = (f"[0:v]{','.join(whips)},noise=alls=7:allf=t+u,format=rgba[bg];"
      f"[1:v]format=rgba[ov];[bg][ov]overlay=0:0:format=auto,format=yuv420p[v]")
cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', str(HERE / 'base.mp4'),
       '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-framerate', '30', '-start_number', str(start_num), '-i', pat,
       '-ss', str(a)] + (['-t', str(b - a)] if b else []) + ['-i', str(HERE / 'assets' / 'som.wav'),
       '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
       '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out]
subprocess.run(cmd, check=True); print('ok →', out)
