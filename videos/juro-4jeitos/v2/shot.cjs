// shot.cjs — tira quadros do index.html direto no Chromium (folhas de contato e teste de fluidez)
// uso: node shot.cjs <saida> <escala> t1,t2,...   |   node shot.cjs <saida> <escala> seq <fps> [ini] [fim]
const { chromium } = require('/opt/npm-tools/node_modules/playwright'); const fs = require('fs'), path = require('path');
(async () => { const [out, sc, mode, a, b, c] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const br = await chromium.launch(); const pg = await br.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: +sc });
pg.on('pageerror', e => console.log('ERRO', e.message)); pg.on('console', m => m.type() === 'error' && console.log('console', m.text()));
await pg.goto('file://' + path.resolve('index.html')); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(300);
const dur = await pg.evaluate(() => window.__timelines.main.duration());
const ts = mode === 'seq' ? Array.from({ length: Math.floor(((+c || dur) - (+b || 0)) * +a) }, (_, i) => (+b || 0) + i / +a) : mode.split(',').map(Number);
let i = 0; for (const t of ts) { await pg.evaluate(t => { window.__timelines.main.seek(t); }, t);
  if (mode === 'seq') await pg.screenshot({ path: `${out}/f${String(i).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 80 });
  else await pg.screenshot({ path: `${out}/at-${t.toFixed(2).padStart(6, '0')}.png` }); i++; }
await br.close(); console.log('ok', ts.length, 'dur', dur); })();
