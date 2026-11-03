# capa.py — renderiza as capas (1080x1920) e monta a prévia de como ficam no perfil (recorte 3:4)
# Uso: python3 capa.py [print_do_perfil.jpg]   (o print é opcional; sem ele só sai a comparação lado a lado)
import sys, asyncio
from pathlib import Path
from PIL import Image, ImageDraw
from playwright.async_api import async_playwright
H = Path(__file__).parent
NOMES = ['capa_a', 'capa_b', 'capa_c']
async def render():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        for n in NOMES:
            await pg.goto((H / f'{n}.html').as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(400)
            await pg.screenshot(path=str(H / f'{n}.png')); Image.open(H / f'{n}.png').convert('RGB').save(H / f'{n}.jpg', quality=94)
        await b.close()
asyncio.run(render())
crop = lambda f: Image.open(H / f'{f}.jpg').crop((0, 240, 1080, 1680))     # o que o grid mostra
# lado a lado
S = Image.new('RGB', (560 * len(NOMES) - 20, 720), 'white')
for i, n in enumerate(NOMES): S.paste(crop(n).resize((540, 720)), (i * 560, 0))
S.save(H / 'previa_lado_a_lado.jpg', quality=88)
# no perfil: fileira fixada + a nova capa no 1º lugar, empurrando as outras
if len(sys.argv) > 1:
    g = Image.open(sys.argv[1]).convert('RGB'); X = [(0, 250), (252, 501), (503, 752)]; R1, R2 = (74, 407), (409, 742)
    tile = lambda c, r: g.crop((X[c][0], r[0], X[c][1], r[1])).resize((250, 333))
    for n in NOMES:
        M = Image.new('RGB', (754, 1003), (13, 17, 23)); d = ImageDraw.Draw(M)
        for c in range(3): M.paste(tile(c, R1), (X[c][0], 0))                            # fixados
        M.paste(crop(n).resize((250, 333)), (0, 335)); M.paste(tile(0, R2), (252, 335)); M.paste(tile(1, R2), (503, 335))   # nova + 2 seguintes
        M.paste(tile(2, R2), (0, 670))                                                    # "Imposto" desce
        for c in (1, 2): d.rectangle([X[c][0], 670, X[c][1], 1003], fill=(30, 34, 40))    # resto do grid
        M.save(H / f'perfil_{n}.jpg', quality=90)
print('ok')
