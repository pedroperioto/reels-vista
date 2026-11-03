# compose.py — base.mp4 + grafismos (out/ov) + grão + som → out/<nome>.mp4
# Uso: python3 compose.py [nome] [crf]
import glob, subprocess, sys
from pathlib import Path
H = Path(__file__).parent
name = sys.argv[1] if len(sys.argv) > 1 else 'permuta_previa'; crf = sys.argv[2] if len(sys.argv) > 2 else '20'
pngs = sorted(glob.glob(str(H / 'out' / 'ov' / '*.png'))); assert pngs, 'renderize os grafismos antes (out/ov)'
first = Path(pngs[0]).name; digits = len(''.join(c for c in first if c.isdigit())); prefix = first.split('0')[0]
pat = str(H / 'out' / 'ov' / f'{prefix}%0{digits}d.png'); start = int(''.join(c for c in first if c.isdigit()))
vf = "[0:v]noise=alls=6:allf=t+u,format=rgba[bg];[1:v]format=rgba[ov];[bg][ov]overlay=0:0:format=auto,format=yuv420p[v]"
out = H / 'out' / f'{name}.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(H / 'base.mp4'), '-framerate', '30', '-start_number', str(start), '-i', pat,
                '-i', str(H / 'assets' / 'som.wav'), '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', crf,
                '-preset', 'medium', '-maxrate', '9M', '-bufsize', '18M', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
                '-movflags', '+faststart', '-shortest', str(out)], check=True)
print('ok →', out)
