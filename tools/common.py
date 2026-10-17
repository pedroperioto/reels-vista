"""Funções compartilhadas: servidor local, abrir a página do vídeo no Chromium headless."""
import os, sys, socket, subprocess, time, base64
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
PORT = int(os.environ.get('PORT', '8766'))
ARGS = ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader']
IGNORE = ('GL Driver Message', 'GPU stall')

def ensure_server():
    s = socket.socket()
    try:
        s.connect(('127.0.0.1', PORT)); return
    except OSError:
        pass
    finally:
        s.close()
    subprocess.Popen([sys.executable, '-m', 'http.server', str(PORT)], cwd=ROOT, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)
    for _ in range(50):
        time.sleep(0.1)
        try:
            socket.create_connection(('127.0.0.1', PORT)).close(); return
        except OSError:
            pass
    raise SystemExit('servidor local não subiu')

def video_dir(arg):
    p = Path(arg)
    if not p.is_absolute(): p = (Path.cwd() / p) if (Path.cwd() / p).exists() else ROOT / 'videos' / arg
    if not (p / 'index.html').exists(): raise SystemExit(f'vídeo não encontrado: {arg}')
    return p.resolve()

def open_page(pw, vdir):
    b = pw.chromium.launch(args=ARGS); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: m.type == 'error' and not m.text.startswith(IGNORE) and 'status of 404' not in m.text and errs.append(m.text))
    pg.on('requestfailed', lambda r: errs.append('falhou ao carregar ' + r.url))
    pg.on('response', lambda r: r.status >= 400 and '/mapcache/' not in r.url and errs.append(f'{r.status} {r.url}'))
    rel = vdir.relative_to(ROOT).as_posix()
    pg.goto(f'http://localhost:{PORT}/{rel}/index.html')
    try:
        pg.wait_for_function('window.ready', timeout=180000)
    except Exception:
        raise SystemExit('a página não ficou pronta. Erros: ' + ' | '.join(errs[:5]))
    return b, pg, errs

import hashlib, json as _json
_PREFIX = {}
def map_prefix(pg, vdir):
    """Assinatura do mapa: muda se map3d.js, os dados do mapa ou os tempos/câmera (MAPTM) mudarem."""
    h = hashlib.sha1()
    for f in sorted(vdir.glob('*.json')) + [vdir / 'map3d.js']:
        if f.exists() and f.name != 'timing.json': h.update(f.read_bytes())
    h.update(pg.evaluate("JSON.stringify(typeof MAPTM !== 'undefined' ? MAPTM : null)").encode())
    return h.hexdigest()[:12]

def grab(pg, t, vdir=None):
    if vdir is None or not pg.evaluate('!!window.frameCached'):
        return base64.b64decode(pg.evaluate(f'window.frame({t})').split(',')[1])
    if id(pg) not in _PREFIX: _PREFIX[id(pg)] = map_prefix(pg, vdir)
    r = pg.evaluate('([t, p]) => window.frameCached(t, p)', [t, _PREFIX[id(pg)]])
    if 'miss' in r:
        d = vdir / 'out' / 'mapcache'; d.mkdir(parents=True, exist_ok=True); m = r['miss']
        (d / (m['name'] + '.json')).write_text(_json.dumps(m['labels']))
        tmp = d / (m['name'] + '.tmp'); tmp.write_bytes(base64.b64decode(m['jpg'].split(',')[1])); tmp.rename(d / (m['name'] + '.jpg'))
    return base64.b64decode(r['frame'].split(',')[1])
