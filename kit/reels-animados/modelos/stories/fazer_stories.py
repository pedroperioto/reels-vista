# fazer_stories.py — transforma um vídeo HORIZONTAL de imóvel em stories VERTICAIS (1080×1920), em partes de até 60 s.
# Uso:  python3 fazer_stories.py config.json
# config.json (exemplo em config_exemplo.json): vídeo de entrada, textos fixos e as partes (início, fim, rótulo, destaques).
# Layout: vídeo desfocado de fundo + janela central 1000×880 + textos da marca em cima e destaques/CTA embaixo,
# tudo fora das faixas da interface dos stories (topo ~250 px e base ~300 px).
import json, subprocess, sys, urllib.parse
from pathlib import Path
from playwright.sync_api import sync_playwright
HERE = Path(__file__).parent.resolve(); C = json.load(open(sys.argv[1])); OUT = Path(C.get('saida', 'out')); OUT.mkdir(exist_ok=True)
VID = C['video']; n = len(C['partes'])
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
    for i, pt in enumerate(C['partes'], 1):
        q = {'k': C['kicker'], 't': C['titulo'], 's': C['subtitulo'], 'cta': C['cta'], 'p': f"{i}/{n} · {pt['rotulo']}", 'chips': '|'.join(pt['destaques'])}
        pg.goto('file://' + str(HERE / 'ov.html') + '?' + urllib.parse.urlencode(q)); pg.wait_for_timeout(500)
        pg.screenshot(path=str(OUT / f'ov{i}.png'), omit_background=True)
    b.close()
for i, pt in enumerate(C['partes'], 1):
    a, z = pt['inicio'], pt['fim']; d = round(z - a, 3); fo = round(d - 0.5, 3)
    assert d <= 60, f'parte {i} tem {d} s: stories aceitam até 60 s por parte'
    fc = (f"[0:v]split=2[a][b];[a]scale=-2:1920,crop=1080:1920,boxblur=30:4,eq=brightness=-0.05[bg];[b]scale=-2:880,crop=1000:880[fg];"
          f"[bg][fg]overlay=40:560[v1];[v1][1:v]overlay=0:0,fade=t=in:st=0:d=0.3,fade=t=out:st={fo}:d=0.5,format=yuv420p[v];"
          f"[0:a]afade=t=in:st=0:d=0.3,afade=t=out:st={fo}:d=0.5,loudnorm=I=-16:TP=-1.5[au]")
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(a), '-t', str(d), '-i', VID, '-loop', '1', '-t', str(d), '-i', str(OUT / f'ov{i}.png'),
                    '-filter_complex', fc, '-map', '[v]', '-map', '[au]', '-r', '30', '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
                    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', str(OUT / f'story_{i}.mp4')], check=True)
    print('story', i, d, 's')
