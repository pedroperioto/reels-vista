"""Confere se a legenda cobre algum conteúdo: mede bordas atrás de cada legenda (sem ela). Uso: legendas.py <video> [limite]. Exige window.capBusy/capTimes no vídeo."""
import sys, json, io, base64
sys.path.insert(0, str(__import__('pathlib').Path(__file__).resolve().parent))
from PIL import Image, ImageDraw
from playwright.sync_api import sync_playwright
from common import ensure_server, video_dir, open_page, grab
vdir = video_dir(sys.argv[1]); ensure_server()
TH = float(sys.argv[2]) if len(sys.argv) > 2 else 0.02
with sync_playwright() as p:
    b, pg, errs = open_page(p, vdir)
    caps = pg.evaluate('window.capTimes()'); res = []
    for c in caps:
        for t in sorted({round(c['t0'] + 0.08, 2), c['t'], round(c['t1'] - 0.08, 2)}):
            r = pg.evaluate(f'window.capBusy({t})')
            if r: res.append(r)
    bad = [r for r in res if r['dens'] > TH]
    print(len(caps), 'legendas,', len(res), 'medições,', len(bad), 'acima de', TH)
    seen = set(); crops = []
    for r in bad:
        key = (r['sc'], r['text'])
        if key in seen: continue
        seen.add(key); print(f"{r['t']:7.2f} {r['sc']:<12} dens={r['dens']:.3f} y={r['y']}  {r['text']}")
        im = Image.open(io.BytesIO(grab(pg, r['t'], vdir))).convert('RGB'); x0, y0, w, h = r['box']
        crops.append(im.crop((0, max(0, y0 - 140), 1080, min(1920, y0 + h + 140))).resize((540, (min(1920, y0 + h + 140) - max(0, y0 - 140)) // 2)))
    b.close()
if crops:
    H = sum(c.height + 20 for c in crops); S = Image.new('RGB', (540, H), 'white'); y = 0
    for c in crops: S.paste(c, (0, y)); y += c.height + 20
    S.save(str(vdir / 'out' / 'capcheck.jpg'), quality=85); print('→ out/capcheck.jpg')
if errs: print('ERROS', errs[:5])
