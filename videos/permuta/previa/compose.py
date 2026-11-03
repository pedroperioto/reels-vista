# compose.py — base.mp4 (imagens) + out/ov/*.png (grafismos) + grão + som → out/previa_abertura.mp4
import glob, subprocess
from pathlib import Path
H = Path(__file__).parent
pngs = sorted(glob.glob(str(H / 'out' / 'ov' / '*.png'))); assert pngs
first = Path(pngs[0]).name; digits = len(''.join(c for c in first if c.isdigit())); prefix = first.split('0')[0]
pat = str(H / 'out' / 'ov' / f'{prefix}%0{digits}d.png'); start = int(''.join(c for c in first if c.isdigit()))
vf = ("[0:v]noise=alls=7:allf=t+u,format=rgba[bg];[1:v]format=rgba[ov];"
      "[bg][ov]overlay=0:0:format=auto,format=yuv420p[v]")
out = H / 'out' / 'previa_abertura.mp4'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(H / 'base.mp4'), '-framerate', '30', '-start_number', str(start), '-i', pat,
                '-i', str(H / 'som.wav'), '-filter_complex', vf, '-map', '[v]', '-map', '2:a', '-c:v', 'libx264', '-crf', '19',
                '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', str(out)], check=True)
print('ok →', out)
