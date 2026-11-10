# capa.py — renderiza as 3 capas (1080x1920) e a prévia do recorte do perfil (3:4, y 240–1680)
import asyncio
from pathlib import Path
from PIL import Image
from playwright.async_api import async_playwright
H = Path(__file__).parent; NOMES = ['capa_a', 'capa_b', 'capa_c']
async def render():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width': 1080, 'height': 1920})
        for n in NOMES:
            await pg.goto((H / f'{n}.html').as_uri()); await pg.evaluate('document.fonts.ready'); await pg.wait_for_timeout(400)
            await pg.screenshot(path=str(H / f'{n}.png')); Image.open(H / f'{n}.png').convert('RGB').save(H / f'{n}.jpg', quality=94); (H / f'{n}.png').unlink()
        await b.close()
asyncio.run(render())
S = Image.new('RGB', (560 * 3 - 20, 720), 'white')
for i, n in enumerate(NOMES): S.paste(Image.open(H / f'{n}.jpg').crop((0, 240, 1080, 1680)).resize((540, 720)), (i * 560, 0))
S.save(H / 'previa_lado_a_lado.jpg', quality=88); print('ok')
