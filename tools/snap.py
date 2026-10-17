"""Quadros de conferência. Uso: snap.py <video> [t1,t2,... | cena]  (sem tempos: 3 quadros por cena)."""
import sys, json, io
from PIL import Image
from playwright.sync_api import sync_playwright
from common import ensure_server, video_dir, open_page, grab
vdir = video_dir(sys.argv[1]); out = vdir / 'out'; out.mkdir(exist_ok=True)
T = json.load(open(vdir / 'timing.json'))['timing']; arg = sys.argv[2] if len(sys.argv) > 2 else ''
names = {c['cena']: c for c in T}
if arg and arg.split(',')[0] in names:
    ts = []
    for n in arg.split(','): c = names[n]; d = c['fim'] - c['inicio']; ts += [round(c['inicio'] + d * f, 2) for f in (0.08, 0.3, 0.5, 0.7, 0.92)]
elif arg: ts = [float(x) for x in arg.split(',')]
else: ts = [round(c['inicio'] + (c['fim'] - c['inicio']) * f, 2) for c in T for f in (0.2, 0.55, 0.9)]
ensure_server()
with sync_playwright() as p:
    b, pg, errs = open_page(p, vdir); ims = [Image.open(io.BytesIO(grab(pg, t, vdir))).convert('RGB') for t in ts]; b.close()
cols = min(len(ims), 6); rows = (len(ims) + cols - 1) // cols; S = Image.new('RGB', (cols * 360, rows * 660), 'white')
from PIL import ImageDraw
d = ImageDraw.Draw(S)
for i, (im, t) in enumerate(zip(ims, ts)):
    x, y = (i % cols) * 360, (i // cols) * 660; S.paste(im.resize((360, 640)), (x, y)); d.text((x + 6, y + 642), f'{t:.1f}s', fill='black')
S.save(out / 'conferencia.jpg', quality=85); print('quadros →', out / 'conferencia.jpg')
if errs: print('ERROS NA PÁGINA:\n  ' + '\n  '.join(errs[:10])); sys.exit(1)
