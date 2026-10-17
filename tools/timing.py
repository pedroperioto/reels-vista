"""Lê o tempo de cada cena direto do main.js e grava timing.json. Para se houver erro de JavaScript."""
import sys, json
from playwright.sync_api import sync_playwright
from common import ensure_server, video_dir, open_page
vdir = video_dir(sys.argv[1]); ensure_server()
with sync_playwright() as p:
    b, pg, errs = open_page(p, vdir)
    T = pg.evaluate('window.TIMING_'); dur = pg.evaluate('window.DUR'); b.close()
if errs: raise SystemExit('ERROS NA PÁGINA:\n  ' + '\n  '.join(errs[:10]))
json.dump({'timing': T}, open(vdir / 'timing.json', 'w'), ensure_ascii=False, indent=1)
m, s = divmod(dur, 60)
print(f'duração: {int(m)}:{s:04.1f}')
for c in T: print(f"  {c['cena']:<12} {c['inicio']:6.1f}s → {c['fim']:6.1f}s")
