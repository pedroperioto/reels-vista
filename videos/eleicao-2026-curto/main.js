// CORTE CURTO (v8) — reaproveita as animações da versão completa com uma narração mais enxuta — estilo Apple claro, fotos reais, sombras, dados até 15/10/2026.
const RATE = 2.5, WD = 1 / RATE, PAUSE = 0.35;
const PLAN = [
  ['gancho', 0.3, 0.6, 'Lula contra Bolsonaro, de novo. E tem gente me dizendo que vai esperar a eleição pra comprar. Agora é o Flávio, mas a briga é a mesma.'],
  ['bolsonaro', 0.4, 0.7, 'No governo Bolsonaro, com a pandemia, a inflação passou de dez por cento, e os juros foram de dois a treze e setenta e cinco. Mas a dívida terminou em setenta e dois por cento do PIB. Quem vota no Flávio aposta em repetir essa receita.'],
  ['lula', 0.4, 0.7, 'No governo Lula, os juros foram a dez e meio e depois a quinze, o maior em quase vinte anos. E a dívida subiu de setenta e dois para oitenta e três por cento do PIB.'],
  ['mercado', 1.4, 0.9, 'Depois do primeiro turno, a Bolsa bateu recorde, e estrangeiros colocaram quinze bilhões de reais em seis pregões. Os juros longos, que pesam no crédito imobiliário, caíram. Mas voltaram a subir com o empate técnico nas pesquisas do segundo turno.'],
  ['m2', 0.4, 1.2, 'Já o metro quadrado em São Paulo não oscila assim: subiu com Lula, com Dilma, com Temer, com Bolsonaro e de novo com Lula. E no Tatuapé, lançamentos já passam de quinze mil o metro quadrado.'],
  ['mapa', 1.2, 1.8, 'Enquanto o país discute quem vai governar, a Zona Leste está sendo construída. No Eixo Platina, a Porte junta moradia, trabalho e lazer ao lado do metrô, com o Urman, o maior complexo multiúso em obras da cidade. Diálogo, Cyrela, Tegra e Eztec também não param: são lançamentos, obras e prédios prontos pra morar. E o metrô está chegando à Anália Franco. Governo passa. O tijolo fica.'],
  ['cta', 0.4, 2.6, 'Conhece alguém esperando a eleição pra comprar? Manda esse vídeo pra ele. E comenta aqui: você compraria antes ou depois da eleição?'],
];
function wtimes(lead, text) { const ws = text.split(' '), o = []; let t = lead; ws.forEach((w, i) => { o.push(t); t += WD; if (/[.?!:]$/.test(w) && i < ws.length - 1) t += PAUSE; }); return { o, end: t }; }
const SCENES = []; { let a = 0; PLAN.forEach(([name, lead, hold, text]) => { const { o, end } = wtimes(lead, text); const d = Math.round((end + hold) * 10) / 10; SCENES.push({ name, a, b: a + d, d, lead, text, wt: o }); a += d; }); }
let DUR = Math.round(SCENES[SCENES.length - 1].b * 100) / 100;
// ---------- v8: narração curta + "time warp" ----------
// Cada cena nova toca a coreografia da cena original (SCENES), acelerada ou com trechos pulados.
// pts: pares [tempo novo, tempo original]; 'wN' = N-ésima palavra, 'e' = fim da cena, número = segundos, [ref, desloc].
const OLD = Object.fromEntries(SCENES.map(s => [s.name, s]));
const V8 = [
  ['gancho', 0.3, 0.5, 'Vai esperar a eleição pra comprar imóvel? Olha o que aconteceu com o metro quadrado em cada governo.',
    [[0, 1.0], ['w0', ['w5', -0.15]], ['w3', 'w9'], ['w6', 'w15'], ['w7', 'w17'], ['w17', 'w26'], ['e', 'e']]],
  ['bolsonaro', 0.3, 0.4, 'Com Bolsonaro, veio a pandemia e os juros foram de dois a treze e setenta e cinco.',
    [[0, ['w13', 0.1]], ['w6', ['w14', 0.1]], ['w10', 'w18'], ['w12', 'w20'], ['w16', 'w24'], ['e', ['w24', 0.4]]]],
  ['lula', 0.3, 0.5, 'Com Lula, foram a quinze, o maior em quase vinte anos. E a dívida chegou a oitenta e três por cento do PIB.',
    [[0, 0], ['w1', 'w2'], ['w4', 'w13'], ['w10', 'w19'], ['w11', 'w20'], ['w13', 'w22'], ['w16', 'w29'], ['w22', 'w35'], ['e', 'e']]],
  ['mercado', 0.8, 0.8, 'Depois do primeiro turno, a Bolsa bateu recorde e estrangeiros trouxeram quinze bilhões em seis pregões. Os juros longos caíram, mas voltaram a subir com o empate técnico nas pesquisas.',
    [[0, 0], ['w0', 'w0'], ['w5', 'w5'], ['w9', 'w9'], ['w12', 'w12'], ['w15', 'w17'], ['w16', 'w18'], ['w17', 'w19'], ['w19', 'w26'], ['w20', 'w27'], ['w23', 'w30'], ['w24', 'w31'], ['w26', 'w33'], ['w29', 'w39'], ['e', 'e']]],
  ['m2', 0.3, 1.0, 'Mas o metro quadrado em São Paulo não oscila assim: subiu com Lula, Dilma, Temer, Bolsonaro e de novo com Lula. No Tatuapé, lançamentos já passam de quinze mil o metro quadrado.',
    [[0, 0], ['w0', 'w0'], ['w9', 'w9'], ['w10', 'w10'], ['w12', 'w12'], ['w13', 'w14'], ['w14', 'w16'], ['w15', 'w18'], ['w20', 'w23'], ['w22', 'w26'], ['w27', 'w31'], ['w31', 'w34'], ['e', 'e']]],
  ['mapa', 0.6, 1.6, 'Enquanto isso, a Zona Leste não para. No Eixo Platina, a Porte ergue o Urman, o maior multiúso em obras da cidade. Diálogo, Cyrela, Tegra e Eztec também: são quatorze empreendimentos só neste mapa. E o metrô está chegando à Anália Franco. Governo passa. O tijolo fica.',
    [[0, 0], ['w0', 'w0'], ['w6', 'w12'], ['w7', 'w13'], ['w8', 'w14'], ['w14', 'w29'], ['w21', 'w37'], ['w22', 'w38'], ['w23', 'w39'], ['w24', 'w40'], ['w26', 'w42'], ['w27', 'w45'], ['w29', 'w47'], ['w31', 'w48'], ['w33', 'w51'], ['w34', 'w54'], ['w36', 'w56'], ['w40', 'w60'], ['w42', 'w62'], ['w44', 'w64'], ['w46', 'w66'], ['e', 'e']]],
  ['cta', 0.4, 2.6, 'Conhece alguém esperando a eleição pra comprar? Manda esse vídeo pra ele. E comenta aqui: você compraria antes ou depois da eleição?', [[0, 0], ['e', 'e']]],
];
function refT(r, wt, d) { if (Array.isArray(r)) return refT(r[0], wt, d) + r[1]; if (typeof r === 'number') return r; if (r === 'e') return d; return wt[+r.slice(1)]; }
const SEQ = []; { let a = 0; V8.forEach(([name, lead, hold, text, P]) => { const { o, end } = wtimes(lead, text); const d = Math.round((end + hold) * 10) / 10, old = OLD[name];
  const pts = P.map(([n, q]) => [refT(n, o, d), refT(q, old.wt, old.d)]); SEQ.push({ name, a, b: a + d, d, lead, text, wt: o, pts, old }); a += d; }); }
DUR = Math.round(SEQ[SEQ.length - 1].b * 100) / 100;
function pw(P, x, i0, i1) { if (x <= P[0][i0]) return P[0][i1] + (x - P[0][i0]) * ((P[1][i1] - P[0][i1]) / ((P[1][i0] - P[0][i0]) || 1));
  for (let k = 1; k < P.length; k++) if (x <= P[k][i0]) { const f = (x - P[k - 1][i0]) / ((P[k][i0] - P[k - 1][i0]) || 1); return lerp(P[k - 1][i1], P[k][i1], f); }
  const n = P.length - 1; return P[n][i1] + (x - P[n][i0]); }
const warp = (s, u) => pw(s.pts, u, 0, 1), unwarp = (s, uo) => pw(s.pts, uo, 1, 0);
const BG = '#F5F5F7', INK = '#1D1D1F', MUTE = '#86868B', GOLDA = '#B8955A', NAVY = '#0B1F3A', REDp = '#D4373F', BLUp = '#2F5BD3', LINE = '#E3E3E8', GRN = '#2E9E5B', IGB = '#0095F6', AMB = '#C98A1B';

// ---------- imagens ----------
const IMG = {};
function loadImg(key, src) { return new Promise(r => { const i = new Image(); i.onload = () => { IMG[key] = i; r(); }; i.onerror = () => r(); i.src = src; }); }
const ASSETS = Promise.all(['lula', 'jair', 'flavio', 'dilma', 'temer', 'b3', 'brasil'].map(k => loadImg(k, `fotos/${k}.jpg`)).concat([loadImg('vista', 'fotos/vista.png')]));
const PEOPLE = { lula: ['Lula', 'PT · 13', REDp], jair: ['Bolsonaro', 'PL · 22', BLUp], flavio: ['Flávio Bolsonaro', 'PL · 22', BLUp] };
const FOC = { lula: [0.57, 0.5, 1.5], jair: [0.53, 0.27, 1.8], flavio: [0.52, 0.62, 1.5], dilma: [0.48, 0.38, 1.4], temer: [0.53, 0.3, 2.1], b3: [0.5, 0.45, 1], brasil: [0.5, 0.5, 1] };

// ---------- primitivas (com sombra dupla: ambiente + contato) ----------
function soft(ctx, x, y, w, h, r, sh = 0.12, blur = 70, oy = 28, fill = '#fff') { ctx.save(); ctx.fillStyle = fill;
  ctx.shadowColor = `rgba(16,24,40,${sh})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill();
  ctx.shadowColor = `rgba(16,24,40,${sh * 0.7})`; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fill(); ctx.restore(); }
function shadowed(ctx, fn, sh = 0.16, blur = 22, oy = 10) { ctx.save(); ctx.shadowColor = `rgba(16,24,40,${sh})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; fn(); ctx.restore(); }
function photo(ctx, key, x, y, w, h, r, zoom = 1) {
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); const im = IMG[key];
  if (im) { const [fx_, fy_] = FOC[key] || [0.5, 0.4]; const s = Math.max(w / im.width, h / im.height) * zoom, iw = im.width * s, ih = im.height * s;
    const dx = clamp(x + w / 2 - fx_ * iw, x + w - iw, x), dy = clamp(y + h / 2 - fy_ * ih, y + h - ih, y); ctx.drawImage(im, dx, dy, iw, ih); }
  else { ctx.fillStyle = '#E3E3E8'; ctx.fillRect(x, y, w, h); }
  ctx.restore();
}
function avatarP(ctx, key, x, y, r, sh = true) { if (sh) shadowed(ctx, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r + 3, 0, 6.283); ctx.fill(); }, 0.16, r * 0.5, r * 0.18); photo(ctx, key, x - r, y - r, 2 * r, 2 * r, r, (FOC[key] || [0, 0, 1])[2]); }
function candCard(ctx, key, cx, cy, rot, s = 1, a = 1, blur = 0, flipX = 1) {
  if (a <= 0.01) return; const [name, party, dot] = PEOPLE[key]; const w = 400, h = 540;
  ctx.save(); ctx.globalAlpha *= a; if (blur > 0.5) ctx.filter = `blur(${blur.toFixed(1)}px)`; ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s * flipX, s);
  soft(ctx, -w / 2, -h / 2, w, h, 44, 0.16, 80, 36);
  photo(ctx, key, -w / 2 + 14, -h / 2 + 14, w - 28, h - 150, 32, 1.12);
  T(ctx, name, -w / 2 + 36, h / 2 - 66, F.black(52), INK, 'left', 1, 52, w - 70);
  ctx.fillStyle = dot; ctx.beginPath(); ctx.arc(-w / 2 + 44, h / 2 - 32, 9, 0, 6.283); ctx.fill(); T(ctx, party, -w / 2 + 64, h / 2 - 23, F.mono(26), MUTE, 'left', 1, 26, 300, 1);
  if (flipX < 0.98) { ctx.fillStyle = `rgba(0,0,0,${(1 - Math.abs(flipX)) * 0.18})`; ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 44); ctx.fill(); }
  ctx.restore();
}
function xDot(ctx, x, y, r, a = 1) { if (r <= 1 || a <= 0) return; ctx.save(); ctx.globalAlpha *= a; shadowed(ctx, () => { ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }, 0.25, 30, 12);
  ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.12; ctx.lineCap = 'round'; const k = r * 0.32; ctx.beginPath(); ctx.moveTo(x - k, y - k); ctx.lineTo(x + k, y + k); ctx.moveTo(x + k, y - k); ctx.lineTo(x - k, y + k); ctx.stroke(); ctx.restore(); }
function head(ctx, u, l1, t1, l2, t2, tout = 99, y = 330, s2 = 112) { const o = prog(u, tout, tout + 0.35); if (o >= 1) return; ctx.save(); ctx.globalAlpha *= 1 - o; if (o > 0) ctx.filter = `blur(${(o * 14).toFixed(1)}px)`;
  if (l1) aw(ctx, l1, 540, y, F.semi(64), INK, u, t1, 64, 'center', 0.12, 940); if (l2) aw(ctx, l2, 540, y + 112, F.it(s2), GOLDA, u, t2, s2, 'center', 0.12, 960); ctx.restore(); }
function fonte(ctx, s, a, y = 1452) { if (a <= 0) return; T(ctx, s, 540, y, F.med(27), MUTE, 'center', a, 27, 900); }
function chip(ctx, key, title, period, x, y, a = 1, flip = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(1, Math.max(0.01, flip)); ctx.font = F.semi(38); const w = ctx.measureText(title).width + 330;
  soft(ctx, -w / 2, -48, w, 96, 48, 0.12, 40, 14); avatarP(ctx, key, -w / 2 + 52, 0, 36, false); T(ctx, title, -w / 2 + 104, 4, F.semi(38), INK, 'left', 1, 38, 600); T(ctx, period, w / 2 - 30, 4, F.mono(26), MUTE, 'right', 1, 26, 200); ctx.restore(); }
function spill(ctx, s, x, y, font, fg, bg, h = 64, pad = 34, a = 1) { if (a <= 0) return; shadowed(ctx, () => pill(ctx, s, x, y, font, fg, bg, h, pad, a), 0.18, 18, 8); }
const rr = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k), r: lerp(a.r, b.r, k) });
const CARD = { x: 110, y: 600, w: 860, h: 780, r: 44 };
function zoomAt(ctx, k, cx, cy, s) { const z = lerp(1, s, k); ctx.translate(cx, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
// toque de dedo (substitui a setinha): círculo que afunda e solta onda
function touch(ctx, x, y, u, taps = [], a = 1, drag = 0) { if (a <= 0) return; let press = 0; taps.forEach(tp => { press = Math.max(press, Math.exp(-Math.pow((u - tp) * 7, 2))); }); press = Math.max(press, drag);
  ctx.save(); ctx.globalAlpha *= a; taps.forEach(tp => { const k = (u - tp) / 0.5; if (k > 0 && k < 1) { ctx.strokeStyle = `rgba(29,29,31,${0.35 * (1 - k)})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 34 + 46 * easeOut(k), 0, 6.283); ctx.stroke(); } });
  shadowed(ctx, () => { ctx.fillStyle = `rgba(255,255,255,${0.75})`; ctx.beginPath(); ctx.arc(x, y, 34 - 6 * press, 0, 6.283); ctx.fill(); }, 0.28, 20, 6);
  ctx.fillStyle = `rgba(29,29,31,${0.18 + 0.25 * press})`; ctx.beginPath(); ctx.arc(x, y, 34 - 6 * press, 0, 6.283); ctx.fill(); ctx.restore(); }
function notif(ctx, x, y, w, name, msg, when = 'agora', a = 1, s = 1, initial = 'R', extra = 0) { if (a <= 0) return; const h = 190 + extra; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  soft(ctx, -w / 2, -95, w, h, 44, 0.18, 60, 24, 'rgba(255,255,255,0.98)');
  ctx.fillStyle = '#C9D3E2'; ctx.beginPath(); ctx.arc(-w / 2 + 78, -6, 44, 0, 6.283); ctx.fill(); T(ctx, initial, -w / 2 + 78, 10, F.semi(42), '#fff', 'center', 1, 42);
  ctx.fillStyle = GRN; ctx.beginPath(); ctx.roundRect(-w / 2 + 102, 16, 34, 34, 9); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-w / 2 + 119, 31, 10, 8, 0, 0, 6.283); ctx.fill();
  T(ctx, name, -w / 2 + 150, -38, F.semi(36), INK, 'left', 1, 36, w - 300); T(ctx, when, w / 2 - 36, -38, F.med(28), MUTE, 'right', 1, 28);
  msg.split('\n').forEach((l, i) => T(ctx, l, -w / 2 + 150, 8 + i * 42, F.med(32), '#3A3A3C', 'left', 1, 32, w - 190));
  ctx.restore(); }
function brickIso(ctx, x, y, w, h, d, cF, cS, cT, a = 1) { if (a <= 0 || h <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  ctx.save(); ctx.fillStyle = 'rgba(16,24,40,0.10)'; ctx.filter = 'blur(6px)'; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x + w + d + 16, y - d * 0.4); ctx.lineTo(x + w + d + 22, y + 6); ctx.lineTo(x + 6, y + 8); ctx.fill(); ctx.restore();
  ctx.fillStyle = cF; ctx.fillRect(x, y - h, w, h);
  ctx.fillStyle = cS; ctx.beginPath(); ctx.moveTo(x + w, y - h); ctx.lineTo(x + w + d, y - h - d * 0.6); ctx.lineTo(x + w + d, y - d * 0.6); ctx.lineTo(x + w, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = cT; ctx.beginPath(); ctx.moveTo(x, y - h); ctx.lineTo(x + d, y - h - d * 0.6); ctx.lineTo(x + w + d, y - h - d * 0.6); ctx.lineTo(x + w, y - h); ctx.closePath(); ctx.fill(); ctx.restore(); }
const KEYS = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
function keyboard(ctx, y, hot = '') { ctx.save(); ctx.fillStyle = '#D3D6DC'; ctx.fillRect(0, y, W, 560); const kw = 92, kh = 112;
  KEYS.forEach((row, r) => { const x0 = (W - row.length * (kw + 12)) / 2; [...row].forEach((c, i) => { const x = x0 + i * (kw + 12), yy = y + 30 + r * (kh + 22), on = c === hot;
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowOffsetY = 2; ctx.fillStyle = on ? '#AEB4BE' : '#FFFFFF'; ctx.beginPath(); ctx.roundRect(x, yy, kw, kh, 14); ctx.fill(); ctx.restore(); T(ctx, c, x + kw / 2, yy + 74, F.med(46), INK, 'center', 1, 46); }); });
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(260, y + 30 + 3 * (kh + 22), 560, kh, 14); ctx.fill(); T(ctx, 'espaço', 540, y + 30 + 3 * (kh + 22) + 72, F.med(36), MUTE, 'center', 1, 36); ctx.restore(); }

// ---------- dados (até 15/10/2026) ----------
const SELIC = [[2019.0, 6.5], [2019.55, 6.5], [2019.56, 6.0], [2019.72, 5.5], [2019.83, 5.0], [2019.95, 4.5], [2020.1, 4.25], [2020.22, 3.75], [2020.37, 3.0], [2020.47, 2.25], [2020.6, 2.0], [2021.22, 2.75], [2021.37, 3.5], [2021.46, 4.25], [2021.6, 5.25], [2021.72, 6.25], [2021.82, 7.75], [2021.95, 9.25], [2022.1, 10.75], [2022.22, 11.75], [2022.35, 12.75], [2022.46, 13.25], [2022.6, 13.75],
  [2023.6, 13.75], [2023.61, 13.25], [2023.72, 12.75], [2023.85, 12.25], [2023.95, 11.75], [2024.08, 11.25], [2024.22, 10.75], [2024.37, 10.5], [2024.7, 10.75], [2024.85, 11.25], [2024.95, 12.25], [2025.08, 13.25], [2025.22, 14.25], [2025.37, 14.75], [2025.47, 15.0],
  [2026.21, 15.0], [2026.22, 14.75], [2026.35, 14.5], [2026.46, 14.25], [2026.6, 14.0], [2026.71, 13.75], [2026.79, 13.75]];
const FIPE = [[2008, 3053], [2009, 3712], [2010, 4602], [2011, 5843], [2012, 6765], [2013, 7706], [2014, 8272], [2015, 8479], [2016, 8513], [2017, 8633], [2018, 8787], [2019, 8986], [2020, 9326], [2021, 9711], [2022, 10202], [2023, 10681], [2024, 11381], [2025, 11900], [2026.75, 12206]];
const FLOW = [['5/10', 10.06], ['6/10', 1.09], ['7/10', -0.63], ['8/10', 1.65], ['9/10', 1.03], ['13/10', 2.08]];
const DI35 = [['2/10', 14.13], ['5/10', 12.79], ['6/10', 12.73], ['7/10', 12.78], ['8/10', 12.60], ['9/10', 12.35], ['13/10', 12.57], ['14/10', 12.61]];
const BOARD = [['IBOV', '206.912 pts', '+7,70%', 1], ['MGLU3', 'Magazine Luiza', '+24,18%', 1], ['BPAC11', 'BTG Pactual', '+22,52%', 1], ['BBDC4', 'Bradesco', '+13,57%', 1], ['PETR4', 'Petrobras', '+8,19%', 1], ['DÓLAR', 'R$ 5,00', '−4,12%', 0], ['DI JAN/35', '12,80% a.a.', '−1,33 p.p.', 0]];
const SX = (yr) => 175 + (yr - 2019) / (2026.8 - 2019) * 730, SY = (v) => 1215 - v / 16 * 470;
function polyUntil(pts, X, Y, xEnd) { const out = []; for (let i = 0; i < pts.length; i++) { if (pts[i][0] <= xEnd) out.push([X(pts[i][0]), Y(pts[i][1])]); else { if (i > 0) { const [a0, b0] = pts[i - 1], [a1, b1] = pts[i]; const f = (xEnd - a0) / (a1 - a0); out.push([X(xEnd), Y(lerp(b0, b1, f))]); } break; } } return out; }
function stroke(ctx, P, col, w) { if (P.length < 2) return; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.shadowColor = 'rgba(16,24,40,0.18)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 6; ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
function valAt(pts, x) { for (let i = 1; i < pts.length; i++) if (x <= pts[i][0]) { const f = (x - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return lerp(pts[i - 1][1], pts[i][1], f); } return pts[pts.length - 1][1]; }
function dotLbl(ctx, x, y, s, k, pos = 'up', big = 38, sub = '') { if (k <= 0) return; const e = clamp(SPR(k, 2, 0.5), 0, 1.2); shadowed(ctx, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 13 * e, 0, 6.283); ctx.fill(); }, 0.2, 10, 4); ctx.save(); ctx.strokeStyle = GOLDA; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 13 * e, 0, 6.283); ctx.stroke(); ctx.restore();
  const dy = pos === 'down' ? 58 : -30, a = clamp(k * 3); T(ctx, s, x, y + dy, F.black(big), INK, 'center', a, big); if (sub) T(ctx, sub, x, y + dy + (pos === 'down' ? 30 : -big - 4), F.mono(20), MUTE, 'center', a, 20); }
function selicChart(ctx, u, xEnd, labels, avatars = 1) {
  ctx.fillStyle = 'rgba(47,91,211,0.06)'; ctx.fillRect(SX(2019), 680, SX(2023) - SX(2019), 540); ctx.fillStyle = 'rgba(212,55,63,0.06)'; ctx.fillRect(SX(2023), 680, SX(2026.8) - SX(2023), 540);
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; [0, 5, 10, 15].forEach(v => { ctx.beginPath(); ctx.moveTo(SX(2019), SY(v)); ctx.lineTo(SX(2026.8), SY(v)); ctx.stroke(); T(ctx, v + '%', SX(2019) - 12, SY(v) + 9, F.mono(22), MUTE, 'right', 1, 22); });
  stroke(ctx, polyUntil(SELIC, SX, SY, xEnd), INK, 7);
  if (xEnd > 2019.01 && xEnd < 2026.78) { const y = SY(valAt(SELIC, xEnd)); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(SX(xEnd), y, 9, 0, 6.283); ctx.fill(); }
  labels.forEach(([yr, v, s, k, pos, sub]) => dotLbl(ctx, SX(yr), SY(v), s, k, pos, 34, sub));
  if (avatars > 0) { ctx.save(); ctx.globalAlpha *= avatars; avatarP(ctx, 'jair', SX(2021), 1290, 36); avatarP(ctx, 'lula', SX(2024.9), 1290, 36);
    T(ctx, 'Bolsonaro · 2019–2022', SX(2021), 1358, F.semi(22), INK, 'center', 1, 22); T(ctx, 'Lula · 2023–2026', SX(2024.9), 1358, F.semi(22), INK, 'center', 1, 22); ctx.restore(); }
  T(ctx, 'TAXA SELIC (% AO ANO)', 170, 652, F.mono(22), MUTE, 'left', 1, 22, 500, 2);
}
function debtBars(ctx, u, bars, title = 'DÍVIDA BRUTA DO GOVERNO · % DO PIB') {
  T(ctx, title, 170, 690, F.mono(24), MUTE, 'left', 1, 24, 740, 2);
  ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(170, 1230); ctx.lineTo(910, 1230); ctx.stroke();
  bars.forEach(([lbl, v, x, t0, col, sub]) => { const k = clamp(SPR(u - t0, 1.6, 0.6), 0, 1.1); if (k <= 0) return; const h = v / 90 * 470 * k;
    shadowed(ctx, () => { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - 95, 1230 - h, 190, h, [22, 22, 6, 6]); ctx.fill(); }, 0.18, 24, 10);
    T(ctx, v.toFixed(1).replace('.', ',') + '%', x, 1230 - h - 26, F.black(54), INK, 'center', clamp(k * 3), 54); T(ctx, lbl, x, 1280, F.mono(26), MUTE, 'center', clamp(k * 3), 26); if (sub) T(ctx, sub, x, 1318, F.semi(22), INK, 'center', clamp(k * 3), 22); });
}
// painel de cotações (estilo letreiro da B3) com dígitos girando
function ledBoard(ctx, x, y, w, h, u, t0) {
  shadowed(ctx, () => { ctx.fillStyle = '#0A1220'; ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.fill(); }, 0.3, 60, 24);
  ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, 36); ctx.clip();
  ctx.fillStyle = 'rgba(255,255,255,0.035)'; for (let yy = y; yy < y + h; yy += 8) for (let xx = x; xx < x + w; xx += 8) ctx.fillRect(xx, yy, 3, 3);
  T(ctx, 'B3 · PREGÃO DE 5/10/2026 · DIA SEGUINTE AO 1º TURNO', x + 40, y + 62, F.mono(24), '#8FA3BF', 'left', 1, 24, w - 80, 1);
  const rh = (h - 110) / BOARD.length;
  BOARD.forEach(([tk, sub, ch, up], i) => { const ry = y + 100 + i * rh, k = prog(u, t0 + i * 0.22, t0 + i * 0.22 + 0.5); if (k <= 0) return;
    ctx.save(); ctx.globalAlpha *= clamp(k * 3); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(x + 30, ry + rh - 2, w - 60, 2);
    T(ctx, tk, x + 40, ry + rh * 0.62, F.mono(34), '#E9EEF5', 'left', 1, 34, 260); T(ctx, sub, x + 290, ry + rh * 0.62, F.med(26), '#8FA3BF', 'left', 1, 26, 300);
    // dígitos girando até assentar
    let s = ch; if (k < 1) s = [...ch].map((c, j) => /\d/.test(c) ? String((Math.floor(u * 30) * 7 + j * 3 + i) % 10) : c).join('');
    const col = up ? '#3BD47A' : '#FF6161'; T(ctx, (up ? '▲ ' : '▼ ') + s, x + w - 40, ry + rh * 0.62, F.mono(36), col, 'right', 1, 36, 300); ctx.restore(); });
  ctx.restore();
}

// ---------- cenas ----------
const SC = {
  gancho(ctx, u, d, w) {
    const tN = w[5] - 0.25, tPull = w[9] - 0.1, tType = w[11], tSend = w[15] + 0.1, tOut = w[16] + 0.35;
    // foco: quando a mensagem chega, os cartões recuam e desfocam (profundidade); depois voltam
    const dof = easeInOut(prog(u, tN - 0.1, tN + 0.5)) * (1 - easeInOut(prog(u, tOut, tOut + 0.6)));
    head(ctx, u, 'Lula × Bolsonaro', w[0], 'de novo.', w[3], w[5] - 0.3);
    head(ctx, u, 'Vai esperar', w[5] + 0.2, 'a eleição?', w[12], w[17] - 0.35);
    head(ctx, u, 'Agora é o Flávio', w[17], 'a briga é a mesma.', w[21], d - 0.5);
    const gone = easeIn(prog(u, d - 0.75, d - 0.2));
    const kL = SPR(u + 0.12, 2.2, 0.5), kR = SPR(u - 0.05, 2.2, 0.5);
    const push = 1 + 0.05 * prog(u, 0, d) - 0.08 * dof, fl = (p) => Math.sin(u * 1.6 + p) * 8;
    const cy = 1000 + 40 * dof, lx = 330 - gone * 700 - 20 * dof, rx = 750 + gone * 700 + 20 * dof, bl = dof * 8 + gone * 12;
    ctx.save(); ctx.translate(540, 1000); ctx.scale(push, push); ctx.translate(-540, -1000);
    candCard(ctx, 'lula', lx - (1 - clamp(kL)) * 200, cy + fl(0), -0.05 - (1 - clamp(kL)) * 0.3 + Math.sin(u * 1.1) * 0.01, lerp(1.25, 1, clamp(kL, 0, 1.1)), clamp(kL * 4), (1 - clamp(kL)) * 16 + bl);
    const tf = w[20] - 0.3, kf = easeInOut(prog(u, tf, tf + 0.55)), fx_ = Math.cos(kf * Math.PI);
    if (kf >= 1) candCard(ctx, 'jair', rx + 90 * easeOut(prog(u, tf + 0.5, tf + 1.2)), cy + 20, 0.14, 0.92, 0.35 * (1 - gone), 10);
    candCard(ctx, kf < 0.5 ? 'jair' : 'flavio', rx + (1 - clamp(kR)) * 200, cy + fl(2) - Math.sin(kf * Math.PI) * 40, 0.05 + (1 - clamp(kR)) * 0.3 - Math.sin(u * 1.2) * 0.01, lerp(1.25, 1, clamp(kR, 0, 1.1)), clamp(kR * 4), (1 - clamp(kR)) * 16 + bl, Math.max(0.02, Math.abs(fx_)));
    const grow = easeInOut(prog(u, d - 0.75, d));
    if (grow <= 0) xDot(ctx, 540, cy + fl(1), 62 * clamp(SPR(u - 0.15, 2, 0.5), 0, 1.2));
    ctx.restore();
    if (grow > 0) { const R = rr({ x: 478, y: 938, w: 124, h: 124, r: 62 }, CARD, grow); ctx.save(); ctx.shadowColor = 'rgba(16,24,40,0.12)'; ctx.shadowBlur = 70; ctx.shadowOffsetY = 28; ctx.fillStyle = mixc(NAVY, '#FFFFFF', clamp(grow * 1.6)); ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, R.r); ctx.fill(); ctx.restore(); }
    const kp = prog(u, w[23] - 0.1, w[23] + 0.4); pop(ctx, kp, 540, 640, () => spill(ctx, '2º turno · 25 de outubro', 540, 640, F.semi(34), '#fff', NAVY, 76, 40, 1 - gone));
    // notificação → arrasta pra baixo → digita "Tem certeza?" → envia → sobe
    const kn = SPR(u - tN, 1.4, 0.65); if (kn > 0 && u < tOut + 0.6) {
      const pull = easeInOut(prog(u, tPull, tPull + 0.55)), out = easeIn(prog(u, tOut, tOut + 0.45)), kbd = easeOut(prog(u, tPull + 0.25, tPull + 0.75)) * (1 - easeIn(prog(u, tOut - 0.1, tOut + 0.3)));
      if (dof > 0) { ctx.save(); ctx.globalAlpha *= 0.18 * dof; ctx.fillStyle = '#0B1F3A'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
      const ny = lerp(-160, 560, clamp(kn, 0, 1.06)) + pull * 120 - out * 1100;
      const txt = 'Tem certeza?', nch = Math.floor(clamp((u - tType) / 0.11, 0, txt.length)), typed = txt.slice(0, nch), sent = u > tSend;
      notif(ctx, 540, ny, 940, 'Rafael', 'Pedro, vou esperar a eleição pra comprar\no apê. Vai que muda tudo...', 'agora', 1, 1 + 0.02 * Math.sin(prog(u, tN, tN + 0.5) * Math.PI), 'R', pull * 150);
      if (pull > 0.05) { ctx.save(); ctx.globalAlpha *= clamp(pull * 2); const fy = ny + 130;
        if (!sent) { ctx.fillStyle = '#F2F2F5'; ctx.beginPath(); ctx.roundRect(110, fy, 760, 84, 42); ctx.fill(); T(ctx, typed || 'Responder…', 150, fy + 54, F.med(34), typed ? INK : MUTE, 'left', 1, 34, 680);
          if (typed && Math.floor(u * 3) % 2 === 0) { ctx.font = F.med(34); ctx.fillStyle = IGB; ctx.fillRect(150 + ctx.measureText(typed).width + 4, fy + 22, 4, 44); }
          ctx.fillStyle = nch >= txt.length ? IGB : '#B9C3D0'; ctx.beginPath(); ctx.arc(915, fy + 42, 38, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(915, fy + 60); ctx.lineTo(915, fy + 24); ctx.moveTo(900, fy + 38); ctx.lineTo(915, fy + 24); ctx.lineTo(930, fy + 38); ctx.stroke(); }
        else { const ks = clamp(SPR(u - tSend, 2, 0.6), 0, 1.1); ctx.save(); ctx.translate(900, fy + 42); ctx.scale(ks, ks); ctx.font = F.med(34); const bw = ctx.measureText(txt).width + 60; ctx.fillStyle = IGB; ctx.beginPath(); ctx.roundRect(-bw, -38, bw, 76, 38); ctx.fill(); T(ctx, txt, -bw / 2, 12, F.med(34), '#fff', 'center', 1, 34); ctx.restore(); }
        ctx.restore(); }
      if (kbd > 0) keyboard(ctx, lerp(1920, 1360, kbd), nch > 0 && nch < txt.length ? txt[nch].toLowerCase() : '');
      // dedo: toca na notificação e arrasta pra baixo; depois toca em enviar
      const dragging = prog(u, tPull - 0.05, tPull + 0.5) > 0 && u < tPull + 0.55 ? 1 : 0;
      const tp = cursorPath(u, [[tPull - 0.45, 540, 560], [tPull - 0.05, 540, 560], [tPull + 0.55, 540, 680], [tSend - 0.35, 915, 852], [tSend + 0.25, 915, 852]]);
      const ta = clamp((u - tPull + 0.45) * 5) * (1 - clamp((u - tSend - 0.25) * 4));
      touch(ctx, tp.x, tp.y, u, [tPull - 0.05, tSend], ta, dragging);
    }
  },
  bolsonaro(ctx, u, d, w) {
    const tDebt = w[25] - 0.1, tFl = w[37] - 0.1;
    chip(ctx, 'jair', 'Governo Bolsonaro', '2019–2022', 540, 290, prog(u, 0, 0.3), 1 - (u > d - 0.3 ? Math.sin(prog(u, d - 0.3, d) * Math.PI / 2) : 0));
    head(ctx, u, null, 0, 'com a pandemia,', w[3], w[7] - 0.3, 290, 96);
    head(ctx, u, null, 0, 'inflação acima de 10%', w[7], w[13] - 0.3, 290, 96);
    head(ctx, u, null, 0, 'juros: de 2% a 13,75%', w[13], tDebt - 0.3, 290, 96);
    head(ctx, u, null, 0, 'dívida final: 72% do PIB', tDebt, tFl - 0.3, 290, 92);
    head(ctx, u, null, 0, 'e agora, o filho.', tFl + 0.1, 99, 290, 96);
    const outCard = easeInOut(prog(u, tFl - 0.2, tFl + 0.35));
    if (outCard < 1) { ctx.save(); ctx.globalAlpha *= 1 - outCard; zoomAt(ctx, outCard, 540, 990, 0.85);
      const flip = easeInOut(prog(u, tDebt - 0.2, tDebt + 0.35)), sx = Math.abs(Math.cos(flip * Math.PI));
      ctx.save(); ctx.translate(540, 990); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-540, -990);
      soft(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
      if (flip < 0.5) {
        const tz = w[10] - 0.2, kz = easeInOut(prog(u, tz, tz + 0.5)) * (1 - easeInOut(prog(u, w[13] - 0.5, w[13]))), outA = prog(u, w[13] - 0.2, w[13] + 0.2);
        if (outA < 1) { ctx.save(); ctx.beginPath(); ctx.roundRect(CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip(); ctx.globalAlpha *= (1 - outA) * prog(u, 0, 0.3);
          T(ctx, 'IPCA · INFLAÇÃO NO ANO', 170, 690, F.mono(24), MUTE, 'left', 1 - kz, 24, 600, 2); zoomAt(ctx, kz, 545, 1090, 1.18);
          [['2019', 4.31], ['2020', 4.52], ['2021', 10.06], ['2022', 5.79]].forEach(([y, v], i) => { const k = SPR(u - (w[1] + i * 0.15), 1.8, 0.6); if (k <= 0) return; const yy = 790 + i * 150, hi = i === 2;
            ctx.save(); ctx.globalAlpha *= clamp(k * 3) * (hi ? 1 : 1 - 0.75 * kz); if (!hi && kz > 0.05) ctx.filter = `blur(${(kz * 6).toFixed(1)}px)`;
            T(ctx, y, 170, yy + 14, F.semi(40), INK, 'left', 1, 40); ctx.fillStyle = '#EEEEF2'; ctx.beginPath(); ctx.roundRect(300, yy - 22, 480, 44, 22); ctx.fill();
            shadowed(ctx, () => { ctx.fillStyle = hi ? GOLDA : '#C7C7CE'; ctx.beginPath(); ctx.roundRect(300, yy - 22, 480 * v / 11 * clamp(k, 0, 1), 44, 22); ctx.fill(); }, hi ? 0.25 : 0.1, 14, 6);
            T(ctx, v.toFixed(2).replace('.', ',') + '%', 910, yy + 14, F.black(hi ? 44 : 38), INK, 'right', 1, 44); ctx.restore(); });
          ctx.restore(); }
        const inB = prog(u, w[13] - 0.1, w[13] + 0.25); if (inB > 0) { ctx.save(); ctx.globalAlpha *= inB;
          const xEnd = u < w[18] ? lerp(2019, 2020.6, easeInOut(prog(u, w[13] + 0.1, w[18]))) : lerp(2020.6, 2022.6, easeInOut(prog(u, w[19], w[22])));
          const LB = [[2019.0, 6.5, '6,5%', prog(u, w[13] + 0.1, w[13] + 0.5), 'up', 'jan/19'], [2020.6, 2.0, '2%', prog(u, w[18] - 0.1, w[18] + 0.3), 'down', 'ago/20'], [2022.6, 13.75, '13,75%', prog(u, w[21], w[21] + 0.4), 'up', 'ago/22']];
          selicChart(ctx, u, xEnd, LB, prog(u, w[14], w[14] + 0.5)); ctx.restore(); }
      } else debtBars(ctx, u, [['dez/2022', 71.7, 540, tDebt + 0.2, NAVY, 'fim do governo Bolsonaro']]);
      ctx.restore(); ctx.restore();
      const fA = flip => 0; fonte(ctx, u < w[13] ? 'Fonte: IBGE · IPCA' : u < tDebt ? 'Fonte: Banco Central · meta da taxa Selic' : 'Fonte: Banco Central · dívida bruta do governo geral', (1 - outCard) * prog(u, w[1], w[1] + 0.4));
    }
    // ligação com o Flávio: a foto do pai se transforma na do filho (anel girando)
    const kF = easeOut(prog(u, tFl, tFl + 0.5)); if (kF > 0) {
      const morph = easeInOut(prog(u, tFl + 0.6, tFl + 1.6)), cx = 540, cy = 960, R = 190 * clamp(SPR(u - tFl, 1.4, 0.6), 0, 1.08);
      ctx.save(); ctx.globalAlpha *= kF;
      // anel azul (cor do PL) que gira durante a troca
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-Math.PI / 2 + morph * Math.PI * 2); ctx.strokeStyle = BLUp; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, 0, R + 22, 0, Math.PI * 2 * Math.max(0.02, prog(u, tFl, tFl + 1.6))); ctx.stroke(); ctx.restore();
      avatarP(ctx, 'jair', cx, cy, R); if (morph > 0) { ctx.save(); ctx.globalAlpha *= morph; avatarP(ctx, 'flavio', cx, cy, R, false); ctx.restore(); }
      const n1 = 1 - morph; T(ctx, 'Jair Bolsonaro · 2019–2022', cx, cy + R + 90, F.semi(40), INK, 'center', n1 * prog(u, tFl + 0.2, tFl + 0.5), 40); T(ctx, 'Flávio Bolsonaro · 2027?', cx, cy + R + 90, F.semi(40), INK, 'center', morph, 40);
      const kc = prog(u, w[43] - 0.1, w[43] + 0.4); if (kc > 0) pop(ctx, kc, cx, cy + R + 170, () => spill(ctx, 'repetir a receita do pai?', cx, cy + R + 170, F.it(44), '#fff', BLUp, 80, 40));
      ctx.restore(); }
  },
  lula(ctx, u, d, w) {
    chip(ctx, 'lula', 'Governo Lula', '2023–2026', 540, 290, 1, u < 0.3 ? Math.sin(prog(u, 0, 0.3) * Math.PI / 2) : 1);
    head(ctx, u, null, 0, 'juros: 10,5% → 15%', w[3], w[20] - 0.3, 290, 96);
    head(ctx, u, null, 0, 'dívida: 72% → 83% do PIB', w[21], 99, 290, 88);
    const kin = easeOut(prog(u, 0, 0.45)); ctx.save(); ctx.globalAlpha *= kin; zoomAt(ctx, 1 - kin, 540, 990, 0.9);
    const flip = easeInOut(prog(u, w[20] - 0.2, w[20] + 0.4)), sx = Math.abs(Math.cos(flip * Math.PI));
    ctx.save(); ctx.translate(540, 990); ctx.scale(Math.max(0.02, sx), 1 - 0.04 * Math.sin(flip * Math.PI)); ctx.translate(-540, -990);
    soft(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
    if (flip < 0.5) {
      const kz = easeInOut(prog(u, w[14] - 0.2, w[14] + 0.4)) * (1 - easeInOut(prog(u, w[18] - 0.1, w[18] + 0.3)));
      ctx.save(); ctx.beginPath(); ctx.roundRect(CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip(); zoomAt(ctx, kz, SX(2025.47), SY(15), 1.35);
      let xEnd = 2022.6; if (u > w[3]) xEnd = lerp(2022.6, 2024.37, easeInOut(prog(u, w[3], w[7]))); if (u > w[10]) xEnd = lerp(2024.37, 2025.47, easeInOut(prog(u, w[10], w[13]))); if (u > w[16]) xEnd = lerp(2025.47, 2026.79, easeInOut(prog(u, w[16], w[18] + 0.2)));
      const LB = [[2019.0, 6.5, '6,5%', 1, 'up', 'jan/19'], [2020.6, 2.0, '2%', 1, 'down', 'ago/20'], [2022.6, 13.75, '13,75%', 1, 'up', 'ago/22'], [2024.37, 10.5, '10,5%', prog(u, w[7], w[8] + 0.2), 'down', 'mai/24'], [2025.47, 15, '15%', prog(u, w[13] - 0.1, w[13] + 0.3), 'up', 'jun/25'], [2026.79, 13.75, '13,75%', prog(u, w[18], w[18] + 0.4), 'down', 'hoje']];
      selicChart(ctx, u, xEnd, LB);
      const kp = prog(u, w[15], w[15] + 0.35); if (kp > 0) pop(ctx, kp, SX(2025.47) - 170, SY(15) - 70, () => spill(ctx, 'maior desde 2006', SX(2025.47) - 170, SY(15) - 70, F.semi(26), '#fff', NAVY, 54, 24));
      ctx.restore(); fonte(ctx, 'Fonte: Banco Central · meta da taxa Selic (até 15/10/2026)', 1 - prog(u, w[20] - 0.3, w[20]));
    } else {
      debtBars(ctx, u, [['dez/2022', 71.7, 330, w[24] - 0.1, '#C7C7CE', 'herdada'], ['ago/2026', 82.9, 750, w[29] - 0.1, INK, 'governo Lula']]);
      const kb = prog(u, w[32] - 0.1, w[32] + 0.4); if (kb > 0) { const y1 = 1230 - 71.7 / 90 * 470, y2 = 1230 - 82.9 / 90 * 470; ctx.save(); ctx.globalAlpha *= kb; ctx.strokeStyle = GOLDA; ctx.lineWidth = 5; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(425, y1); ctx.lineTo(655, y1); ctx.moveTo(655, y2); ctx.lineTo(560, y2); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
        pop(ctx, kb, 540, (y1 + y2) / 2, () => spill(ctx, '+11,2 pontos do PIB', 540, (y1 + y2) / 2, F.black(24), '#fff', GOLDA, 54, 20)); }
      fonte(ctx, 'Fonte: Banco Central · dívida bruta do governo geral', prog(u, w[21], w[21] + 0.4));
    }
    ctx.restore(); ctx.restore();
  },
  mercado(ctx, u, d, w) {
    const tBoard = w[4] - 0.3, tFlow = w[9] - 0.2, tFlip = w[19], tDef = w[21] - 0.1, tPoll = w[31];
    const kc = prog(u, 0, 0.35); pop(ctx, kc, 540, 290, () => spill(ctx, '1º turno · 4 de outubro', 540, 290, F.semi(36), '#fff', NAVY, 84, 40));
    head(ctx, u, null, 0, 'Bolsa em recorde', w[5], tFlow - 0.2, 290, 100);
    head(ctx, u, null, 0, 'R$ 15 bi de fora', w[10], tFlip - 0.2, 290, 100);
    head(ctx, u, null, 0, 'juros longos caíram…', tFlip + 0.2, w[27] - 0.3, 290, 96);
    head(ctx, u, null, 0, '…e voltaram a subir.', w[27], 99, 290, 96);
    // A) foto da B3
    const kPh = 1 - easeInOut(prog(u, tBoard, tBoard + 0.6));
    if (kPh > 0) { ctx.save(); ctx.globalAlpha *= kPh * prog(u, 0, 0.3); soft(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r, 0.16); photo(ctx, 'b3', CARD.x, CARD.y, CARD.w, CARD.h, CARD.r, 1.05 + 0.12 * prog(u, 0, tBoard + 0.6));
      const g = ctx.createLinearGradient(0, CARD.y + 400, 0, CARD.y + CARD.h); g.addColorStop(0, 'rgba(6,14,28,0)'); g.addColorStop(1, 'rgba(6,14,28,0.8)'); ctx.save(); ctx.beginPath(); ctx.roundRect(CARD.x, CARD.y, CARD.w, CARD.h, CARD.r); ctx.clip(); ctx.fillStyle = g; ctx.fillRect(CARD.x, CARD.y, CARD.w, CARD.h); ctx.restore();
      T(ctx, 'B3 · Bolsa de Valores', CARD.x + 44, CARD.y + CARD.h - 50, F.semi(38), '#fff', 'left', 1, 38); ctx.restore(); }
    // B) painel de cotações → encolhe para uma faixa no topo
    const kB = easeInOut(prog(u, tBoard, tBoard + 0.6)), shrink = easeInOut(prog(u, tFlow, tFlow + 0.6));
    if (kB > 0 && u < tFlip + 0.3) { ctx.save(); ctx.globalAlpha *= kB * (1 - prog(u, tFlip - 0.2, tFlip + 0.2));
      if (shrink < 1) { ctx.save(); ctx.globalAlpha *= 1 - shrink; zoomAt(ctx, shrink, 540, 600, 0.6); ledBoard(ctx, CARD.x, CARD.y, CARD.w, CARD.h, u, tBoard + 0.2); ctx.restore(); }
      if (shrink > 0) { ctx.save(); ctx.globalAlpha *= shrink; shadowed(ctx, () => { ctx.fillStyle = '#0A1220'; ctx.beginPath(); ctx.roundRect(CARD.x, 560, CARD.w, 96, 28); ctx.fill(); }, 0.25, 30, 12);
        T(ctx, 'IBOV', CARD.x + 36, 620, F.mono(32), '#E9EEF5', 'left', 1, 32); T(ctx, 'recorde: 206.912 pts', CARD.x + 170, 620, F.med(26), '#8FA3BF', 'left', 1, 26); T(ctx, '▲ +7,70%', CARD.x + CARD.w - 36, 620, F.mono(34), '#3BD47A', 'right', 1, 34); ctx.restore(); }
      ctx.restore(); }
    // C) estrangeiros: barras diárias grandes + total acumulado → gira e vira o gráfico de juros
    const kFl = easeOut(prog(u, tFlow + 0.2, tFlow + 0.7)), flip = easeInOut(prog(u, tFlip, tFlip + 0.45)), sx = Math.abs(Math.cos(flip * Math.PI));
    if (kFl > 0 && flip < 0.5) { ctx.save(); ctx.globalAlpha *= kFl; ctx.translate(540, 1030); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-540, -1030); ctx.translate(0, (1 - kFl) * 60);
      const C = { x: 110, y: 690, w: 860, h: 690 }; soft(ctx, C.x, C.y, C.w, C.h, 40);
      T(ctx, 'ESTRANGEIROS NA BOLSA · SALDO POR DIA', 160, 750, F.mono(24), MUTE, 'left', 1, 24, 760, 2);
      const t0 = tFlow + 0.6, t1 = w[12] + 0.1, nd = clamp((u - t0) / (t1 - t0) * FLOW.length, 0, FLOW.length); let acc = 0; FLOW.forEach(([, v], i) => { acc += v * clamp(nd - i); });
      const base = 1240, bw = 96, gap = 128, x0 = 170;
      ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(930, base); ctx.stroke();
      FLOW.forEach(([lbl, v], i) => { const k = clamp(nd - i); if (k <= 0) return; const x = x0 + i * gap, hh = Math.abs(v) / 10.06 * 250 * easeOut(k), up = v >= 0;
        shadowed(ctx, () => { ctx.fillStyle = up ? (i === 0 ? GOLDA : '#D6C29C') : '#E58E92'; ctx.beginPath(); if (up) ctx.roundRect(x, base - hh, bw, Math.max(2, hh), [14, 14, 4, 4]); else ctx.roundRect(x, base, bw, Math.max(2, hh), [4, 4, 14, 14]); ctx.fill(); }, 0.16, 16, 8);
        T(ctx, (up ? '+' : '−') + Math.abs(v).toFixed(2).replace('.', ','), x + bw / 2, up ? base - hh - 16 : base + hh + 34, F.black(30), up ? INK : REDp, 'center', clamp(k * 3), 30);
        T(ctx, lbl.replace('/10', '/out'), x + bw / 2, base + (up ? 44 : hh + 70), F.semi(26), MUTE, 'center', clamp(k * 3), 26); });
      // moedas entrando
      for (let i = 0; i < 16; i++) { const tt0 = t0 + i * 0.16, k = prog(u, tt0, tt0 + 0.7); if (k <= 0 || k >= 1 || i / 16 > nd / FLOW.length + 0.1) continue; const e = easeIn(k); const tx = x0 + Math.min(5, Math.floor(i / 16 * 6)) * gap + bw / 2; gdot(ctx, lerp(980, tx, e), lerp(640, base - 60, e), 12 * (1 - e * 0.3)); }
      // total
      const fin = prog(u, t1, t1 + 0.4); ctx.save(); ctx.globalAlpha *= clamp(nd * 3);
      T(ctx, 'R$ ' + acc.toFixed(2).replace('.', ',') + ' bi', 930, 850, F.black(72 + 10 * fin), INK, 'right', 1, 80, 560);
      T(ctx, fin > 0 ? 'total em 6 pregões · 5 a 13 de outubro' : 'acumulado', 930, 897, F.semi(fin > 0 ? 30 : 26), fin > 0 ? INK : MUTE, 'right', 1, 30, 600);
      if (fin > 0) { ctx.fillStyle = GOLDA; ctx.fillRect(930 - 420 * easeOut(fin), 912, 420 * easeOut(fin), 6); } ctx.restore();
      ctx.restore(); }
    // D) verso: juro longo dia a dia, com definição e motivo da alta
    if (flip >= 0.5) { ctx.save(); ctx.translate(540, 990); ctx.scale(Math.max(0.02, sx), 1); ctx.translate(-540, -990);
      soft(ctx, CARD.x, CARD.y, CARD.w, CARD.h, CARD.r);
      T(ctx, 'JURO FUTURO · DI JAN/2035 (% AO ANO)', 170, 690, F.mono(24), MUTE, 'left', 1, 24, 740, 2);
      const X = (i) => 210 + i * (680 / (DI35.length - 1)), Y = (v) => 1080 - (v - 12) / 2.4 * 300;
      ctx.strokeStyle = LINE; ctx.lineWidth = 2; [12, 13, 14].forEach(v => { ctx.beginPath(); ctx.moveTo(190, Y(v)); ctx.lineTo(910, Y(v)); ctx.stroke(); T(ctx, v + '%', 180, Y(v) + 8, F.mono(20), MUTE, 'right', 1, 20); });
      const xT = (X(0) + X(1)) / 2; ctx.save(); ctx.strokeStyle = GOLDA; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(xT, 760); ctx.lineTo(xT, 1100); ctx.stroke(); ctx.restore(); spill(ctx, '1º turno · 4/10', xT + 40, 745, F.semi(22), '#fff', GOLDA, 40, 16);
      const kd1 = easeInOut(prog(u, tFlip + 0.4, w[26] + 0.3)), kd2 = easeInOut(prog(u, tPoll, w[39] + 0.2)); const nP = 1 + kd1 * 5 + kd2 * 2; const P = [];
      for (let i = 0; i < Math.floor(nP); i++) P.push([X(i), Y(DI35[i][1])]); if (nP % 1 > 0.001 && Math.floor(nP) < DI35.length) { const i = Math.floor(nP), f = nP % 1; P.push([lerp(X(i - 1), X(i), f), lerp(Y(DI35[i - 1][1]), Y(DI35[i][1]), f)]); }
      if (P.length > 1) { ctx.save(); const g = ctx.createLinearGradient(0, 760, 0, 1100); g.addColorStop(0, 'rgba(184,149,90,0.22)'); g.addColorStop(1, 'rgba(184,149,90,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(P[0][0], 1100); P.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(P[P.length - 1][0], 1100); ctx.fill(); ctx.restore(); }
      stroke(ctx, P, INK, 6); P.forEach(([x, y], i) => { if (i < Math.floor(nP)) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 8, 0, 6.283); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); } });
      DI35.forEach(([lbl], i) => T(ctx, lbl, X(i), 1132, F.mono(19), MUTE, 'center', 1, 19));
      T(ctx, '14,13%', X(0) + 18, Y(14.13) + 48, F.black(34), INK, 'left', 1, 34);
      if (nP > 5.9) T(ctx, '12,35%', X(5), Y(12.35) + 48, F.black(32), INK, 'center', prog(nP, 5.9, 6.2), 32);
      const kq = prog(u, tPoll - 0.1, tPoll + 0.4); if (kq > 0) { const xq = (X(5) + X(6)) / 2; ctx.save(); ctx.globalAlpha *= kq; ctx.strokeStyle = REDp; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(xq, 820); ctx.lineTo(xq, 1100); ctx.stroke(); ctx.restore(); }
      if (nP >= DI35.length - 0.05) T(ctx, '12,61%', X(7), Y(12.61) - 24, F.black(32), INK, 'center', 1, 32);
      // caixa inferior: primeiro a definição, depois o motivo da alta
      const kDef = prog(u, tDef, tDef + 0.4) * (1 - prog(u, tPoll - 0.3, tPoll)), kWhy = prog(u, tPoll, tPoll + 0.4);
      if (kDef > 0) { ctx.save(); ctx.globalAlpha *= kDef; ctx.fillStyle = '#F3EDE2'; ctx.beginPath(); ctx.roundRect(150, 1170, 780, 170, 30); ctx.fill();
        T(ctx, 'Juro longo = quanto o mercado cobra', 540, 1222, F.semi(32), INK, 'center', 1, 32, 740); T(ctx, 'para emprestar por vários anos.', 540, 1262, F.semi(32), INK, 'center', 1, 32, 740); T(ctx, 'Ele pesa no custo do financiamento.', 540, 1310, F.semi(32), GOLDA, 'center', 1, 32, 740); ctx.restore(); }
      if (kWhy > 0) { ctx.save(); ctx.globalAlpha *= kWhy; ctx.fillStyle = '#FBE9EA'; ctx.beginPath(); ctx.roundRect(150, 1170, 780, 170, 30); ctx.fill(); ctx.fillStyle = REDp; ctx.beginPath(); ctx.roundRect(150, 1170, 12, 170, [30, 0, 0, 30]); ctx.fill();
        T(ctx, 'POR QUE VOLTOU A SUBIR?', 540, 1214, F.mono(22), REDp, 'center', 1, 22, 740, 2); T(ctx, 'Quaest (14/10): empate técnico no 2º turno,', 540, 1258, F.semi(30), INK, 'center', 1, 30, 740); T(ctx, 'Flávio 46% × Lula 44%.', 540, 1296, F.semi(30), INK, 'center', 1, 30, 740); T(ctx, 'Também pesaram: fim da escala 6x1 no Senado e inflação esperada maior.', 540, 1330, F.med(22), MUTE, 'center', prog(u, tPoll + 0.8, tPoll + 1.2), 22, 740); ctx.restore(); }
      ctx.restore(); }
    if (u < w[19]) sparkle(ctx, 770, 835, u, w[12] + 0.3, 1);
    fonte(ctx, u < tFlow ? 'Fonte: B3 · fechamento de 5/10/2026 (via CNN Brasil)' : u < tFlip ? 'Fonte: B3 · saldo diário de estrangeiros (último dado: 13/10/2026)' : 'Fontes: B3 / CNN Brasil (ajustes até 14/10) · Quaest, 14/10/2026', prog(u, tBoard, tBoard + 0.4));
  },
  m2(ctx, u, d, w) {
    head(ctx, u, 'O m² em São Paulo', w[0], 'não oscila assim:', w[7], w[10] - 0.2);
    head(ctx, u, 'subiu em todos', w[10], 'os governos.', w[12], w[24] - 0.3);
    head(ctx, u, 'Na planta, no Tatuapé:', w[24], 'mais de R$ 15 mil/m²', w[30]);
    const kt = SPR(u - (w[2] - 0.2), 1.6, 0.55), spread = easeInOut(prog(u, w[8], w[10]));
    const kCard = prog(u, w[8] - 0.3, w[8] + 0.2); if (kCard > 0) { ctx.save(); ctx.globalAlpha *= kCard; soft(ctx, CARD.x, CARD.y, CARD.w, CARD.h + 40, CARD.r); ctx.restore(); }
    const kw_ = prog(u, 0, 0.3) * (1 - prog(u, w[8] - 0.2, w[8] + 0.2)); if (kw_ > 0) { const P = []; for (let i = 0; i <= 80; i++) { const f = i / 80; P.push([150 + f * 780, 1000 + Math.sin(f * 29 + u * 8) * 70 + Math.sin(f * 11 - u * 6) * 50]); } ctx.save(); ctx.globalAlpha *= 0.3 * kw_; stroke(ctx, P, INK, 5); ctx.restore(); }
    const N = FIPE.length, cw = 26, gap = 32.5, x0 = 160, base = 1130, d3 = 12, Hm = 420, VMAX = 19000; const hOf = (v) => Hm * v / VMAX;
    if (spread < 1 && kt > 0) { const s = lerp(1, 0.16, spread), cx = lerp(540, x0 + cw / 2, spread), cy = lerp(lerp(-300, 1000, clamp(kt, 0, 1.1)), base - hOf(3053), spread);
      ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); const L = 240;
      ctx.save(); ctx.fillStyle = 'rgba(16,24,40,0.18)'; ctx.filter = 'blur(18px)'; ctx.beginPath(); ctx.ellipse(10, 70, L * 0.95, L * 0.32, 0, 0, 6.283); ctx.fill(); ctx.restore();
      ctx.fillStyle = '#E9DCC3'; ctx.beginPath(); ctx.moveTo(0, -L * 0.5); ctx.lineTo(L, 0); ctx.lineTo(0, L * 0.5); ctx.lineTo(-L, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#CDB78F'; ctx.beginPath(); ctx.moveTo(-L, 0); ctx.lineTo(0, L * 0.5); ctx.lineTo(0, L * 0.5 + 30); ctx.lineTo(-L, 30); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#B79E72'; ctx.beginPath(); ctx.moveTo(L, 0); ctx.lineTo(0, L * 0.5); ctx.lineTo(0, L * 0.5 + 30); ctx.lineTo(L, 30); ctx.closePath(); ctx.fill();
      T(ctx, '1 m²', 0, 22, F.black(84), NAVY, 'center', 1 - spread * 2, 84); ctx.restore();
      const kp = prog(u, w[4], w[4] + 0.4) * (1 - spread * 2); if (kp > 0) T(ctx, 'R$ 3.053 em 2008', 540, 1260, F.semi(40), INK, 'center', kp, 40); }
    if (spread > 0) { const grow = prog(u, w[9], w[12]);
      // governos: cor de cada período (tons suaves) + foto + variação do m²
      const GOV = [['lula', 'Lula', 2008, 2010, '+51%', '#E7B3B0', w[12]], ['dilma', 'Dilma', 2011, 2015, '+84%', '#E7B3B0', w[14]], ['temer', 'Temer', 2016, 2018, '+4%', '#C9DCC2', w[16]], ['jair', 'Bolsonaro', 2019, 2022, '+16%', '#B7C6EA', w[18]], ['lula', 'Lula', 2023, 2026.75, '+20%', '#E7B3B0', w[23]]];
      const govOf = (yr) => GOV.find(g => yr >= g[2] && yr <= g[3] + 0.99);
      ctx.strokeStyle = LINE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(150, base); ctx.lineTo(940, base); ctx.stroke();
      T(ctx, 'PREÇO DO M² · SÃO PAULO', 170, 690, F.mono(24), MUTE, 'left', spread, 24, 700, 2);
      FIPE.forEach(([yr, v], i) => { const k = clamp(SPR(grow * (N + 2) - i - 0.2, 1.2, 0.6), 0, 1.06); if (k <= 0 && i > 0) return; const h = hOf(v) * (i === 0 ? 1 : k), x = x0 + i * gap, g = govOf(Math.floor(yr)), on = g && u > g[6];
        brickIso(ctx, x, base, cw, h, d3, on ? g[5] : '#D9C4A0', on ? mixc(g[5], '#000000', 0.15) : '#BFA77C', on ? mixc(g[5], '#FFFFFF', 0.35) : '#EADBC0'); });
      if (grow > 0 && u < w[12]) { const li = Math.min(N - 1, Math.floor(grow * (N + 1))); T(ctx, 'R$ ' + fmt(FIPE[li][1]) + '/m²', clamp(x0 + li * gap, 300, 680), base - hOf(FIPE[li][1]) - 34, F.black(40), INK, 'center', 1, 40); }
      T(ctx, '2008', x0, base + 34, F.mono(20), MUTE, 'left', spread, 20); T(ctx, 'set/2026', x0 + (N - 1) * gap + cw, base + 34, F.mono(20), MUTE, 'right', spread, 20);
      GOV.forEach(([p, nm, a, b, pct, col, t0], i) => { const k = prog(u, t0 - 0.1, t0 + 0.3); if (k <= 0) return; const xa = x0 + (a - 2008) * gap, xb = x0 + (Math.min(b, 2026) - 2008) * gap + cw, xc = (xa + xb) / 2;
        ctx.save(); ctx.globalAlpha *= k; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(xa, base + 52, xb - xa, 8, 4); ctx.fill(); ctx.restore();
        pop(ctx, k, xc, base + 112, () => { avatarP(ctx, p, xc, base + 112, 42); T(ctx, nm, xc, base + 186, F.semi(24), INK, 'center', 1, 24, 150); T(ctx, pct, xc, base + 226, F.black(34), mixc(col, '#000000', 0.35), 'center', 1, 34, 150); }); });
      const kN = prog(u, w[23] + 0.3, w[23] + 0.7); if (kN > 0) T(ctx, 'variação do m² em cada período · 2008 a set/2026', 540, 740, F.semi(24), MUTE, 'center', kN * (1 - prog(u, w[24], w[24] + 0.3)), 24);
      const xs = x0 + N * gap + 22, kS = prog(u, w[24], w[24] + 0.4);
      if (kS > 0) { ctx.save(); ctx.globalAlpha *= kS; ctx.strokeStyle = GOLDA; ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.moveTo(xs - 12, base); ctx.lineTo(xs - 12, base - Hm - 10); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); T(ctx, 'na planta', xs + 30, base + 34, F.mono(20), GOLDA, 'center', kS, 20);
        T(ctx, 'média SP: R$ 12.206', 470, base - hOf(12206) - 60, F.semi(26), INK, 'center', kS, 26); }
      const k15 = clamp(SPR(u - w[31] + 0.2, 1.3, 0.6), 0, 1.06); if (k15 > 0) { const h = hOf(15000) * k15; brickIso(ctx, xs, base, 44, h, d3, '#2A3A57', '#1B2840', '#4A5E82'); T(ctx, 'R$ 15 mil', xs + 26, base - h - 30, F.black(30), INK, 'center', clamp(k15 * 3), 30); T(ctx, 'Tatuapé', xs + 26, base - h - 66, F.semi(22), MUTE, 'center', clamp(k15 * 3), 22); }
      sparkle(ctx, xs + 26, base - hOf(15000) - 50, u, w[31] + 0.35, 0.85);
      const kTr = prog(u, w[32], w[34] + 0.3); if (kTr > 0) { const x = xs + 26, y0 = base - hOf(15000) - 100, y1 = y0 - 120 * easeOut(kTr); ctx.save(); ctx.strokeStyle = NAVY; ctx.lineWidth = 5; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = NAVY; ctx.beginPath(); ctx.moveTo(x, y1 - 22); ctx.lineTo(x - 16, y1 + 4); ctx.lineTo(x + 16, y1 + 4); ctx.fill(); ctx.restore(); T(ctx, 'tendência', x - 30, y1 + 10, F.semi(22), NAVY, 'right', kTr, 22); }
      fonte(ctx, 'FipeZAP: preço médio anunciado, São Paulo (dez/2008 a set/2026) · na planta: tabelas de lançamentos out/2026 (Vista Broker)', spread, 1470);
    }
  },
  cta(ctx, u, d, w) {
    head(ctx, u, 'Conhece alguém', w[0], 'esperando a eleição?', w[2], w[7] - 0.3, 300, 104);
    head(ctx, u, 'Manda esse vídeo', w[7], 'pra ele.', w[9], w[12] - 0.3, 300, 112);
    const tPlane = w[1], tSheet = w[3], tPick = w[8], tSend = w[10] + 0.1, tChat = w[11] + 0.25, tReply = tChat + 0.55, tMine = tReply + 0.85, tFinal = d - 2.9;
    const outAll = easeInOut(prog(u, tFinal - 0.3, tFinal + 0.3));
    if (outAll < 1) { ctx.save(); ctx.globalAlpha *= 1 - outAll; ctx.translate(0, -outAll * 160);
      const kp = easeOut(prog(u, 0, 0.45)), chatK = easeInOut(prog(u, tChat - 0.2, tChat + 0.3));
      if (chatK < 1) { ctx.save(); ctx.globalAlpha *= 1 - chatK; const py = lerp(700, 560, kp);
        soft(ctx, 110, py, 860, 820, 40, 0.14); ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(170, py + 60, 30, 0, 6.283); ctx.fill(); flatPin(ctx, 170, py + 78, 0.2, GOLD, NAVY);
        T(ctx, 'vistabroker.perioto', 220, py + 70, F.semi(30), INK, 'left', 1, 30); photo(ctx, 'brasil', 110, py + 120, 860, 560, 0, 1.15);
        ctx.save(); ctx.fillStyle = 'rgba(6,14,28,0.35)'; ctx.fillRect(110, py + 120, 860, 560); ctx.restore(); T(ctx, 'Governo passa,', 540, py + 380, F.semi(56), '#fff', 'center', 1, 56); T(ctx, 'o tijolo fica.', 540, py + 470, F.it(90), '#F3DDA8', 'center', 1, 90);
        const iy = py + 740; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(165, iy + 14); ctx.bezierCurveTo(130, iy - 14, 150, iy - 34, 165, iy - 14); ctx.bezierCurveTo(180, iy - 34, 200, iy - 14, 165, iy + 14); ctx.stroke();
        ctx.beginPath(); ctx.arc(250, iy - 6, 20, 0.6, 6.0); ctx.lineTo(236, iy + 18); ctx.closePath(); ctx.stroke();
        const ps = 1 + 0.25 * Math.exp(-Math.pow((u - tPlane) * 8, 2)); ctx.save(); ctx.translate(330, iy - 4); ctx.scale(ps, ps); ctx.strokeStyle = u > tPlane ? IGB : INK; ctx.beginPath(); ctx.moveTo(-22, -16); ctx.lineTo(24, -20); ctx.lineTo(4, 22); ctx.lineTo(0, 0); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(24, -20); ctx.stroke(); ctx.restore();
        ctx.restore(); }
      const ks = SPR(u - tSheet, 1.4, 0.7) * (1 - chatK); let sy = 1950;
      if (ks > 0 && chatK < 1) { sy = lerp(1950, 900, clamp(ks, 0, 1.05));
        ctx.save(); ctx.globalAlpha *= 1 - chatK; soft(ctx, 40, sy, 1000, 640, 52, 0.2, 70, -10); ctx.fillStyle = '#D9DADF'; ctx.beginPath(); ctx.roundRect(500, sy + 20, 80, 8, 4); ctx.fill();
        ctx.fillStyle = '#EFEFF2'; ctx.beginPath(); ctx.roundRect(90, sy + 60, 900, 70, 20); ctx.fill(); T(ctx, 'Pesquisar', 140, sy + 106, F.med(30), MUTE, 'left', 1, 30);
        const sel = u > tPick + 0.05; [['Rafael', 'R', '#C9D3E2'], ['Mãe', 'M', '#E3C7B5'], ['Família', 'F', '#C9D8C2'], ['Ana', 'A', '#D7C6E6']].forEach(([n, l, c], i) => { const x = 180 + i * 240, y = sy + 250;
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 70, 0, 6.283); ctx.fill(); T(ctx, l, x, y + 20, F.semi(56), '#fff', 'center', 1, 56); T(ctx, n, x, y + 112, F.med(28), INK, 'center', 1, 28);
          if (i === 0 && sel) { const k = clamp(SPR(u - tPick - 0.05, 2.5, 0.5), 0, 1.2); ctx.fillStyle = IGB; ctx.beginPath(); ctx.arc(x + 50, y + 50, 24 * k, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 40, y + 50); ctx.lineTo(x + 47, y + 57); ctx.lineTo(x + 61, y + 43); ctx.stroke(); } });
        const sent = u > tSend + 0.08; ctx.fillStyle = sel ? IGB : '#B9D9F5'; ctx.beginPath(); ctx.roundRect(90, sy + 460, 900, 100, 24); ctx.fill(); T(ctx, sent ? 'Enviado ✓' : 'Enviar', 540, sy + 526, F.semi(40), '#fff', 'center', 1, 40); ctx.restore(); }
      const tp = cursorPath(u, [[tPlane - 0.4, 330, 1296], [tPlane + 0.2, 330, 1296], [tPick - 0.25, 180, sy + 250], [tPick + 0.2, 180, sy + 250], [tSend - 0.25, 540, sy + 510], [tSend + 0.2, 540, sy + 510]]);
      touch(ctx, tp.x, tp.y, u, [tPlane, tPick, tSend], clamp((u - tPlane + 0.4) * 5) * (1 - clamp((u - tSend - 0.2) * 4)));
      if (chatK > 0) { ctx.save(); ctx.globalAlpha *= chatK; ctx.translate(0, (1 - chatK) * 80);
        soft(ctx, 80, 520, 920, 900, 48, 0.14); ctx.fillStyle = '#C9D3E2'; ctx.beginPath(); ctx.arc(160, 600, 40, 0, 6.283); ctx.fill(); T(ctx, 'R', 160, 616, F.semi(40), '#fff', 'center', 1, 40); T(ctx, 'Rafael', 220, 614, F.semi(36), INK, 'left', 1, 36);
        ctx.fillStyle = LINE; ctx.fillRect(80, 660, 920, 2);
        ctx.save(); ctx.beginPath(); ctx.roundRect(560, 690, 380, 300, 28); ctx.clip(); photo(ctx, 'brasil', 560, 690, 380, 300, 0, 1.2); ctx.fillStyle = 'rgba(6,14,28,0.4)'; ctx.fillRect(560, 690, 380, 300); T(ctx, 'o tijolo fica.', 750, 860, F.it(48), '#F3DDA8', 'center', 1, 48); ctx.restore();
        const bub = (txt, y, left, t0) => { const k = clamp(SPR(u - t0, 2, 0.6), 0, 1.08); if (k <= 0) return; ctx.font = F.med(32); const lines = txt.split('\n'); const bw = Math.max(...lines.map(l => ctx.measureText(l).width)) + 56, bh = lines.length * 44 + 30;
          const x = left ? 120 : 960 - bw; ctx.save(); ctx.translate(left ? x : x + bw, y); ctx.scale(k, k); ctx.translate(left ? -x : -(x + bw), -y); shadowed(ctx, () => { ctx.fillStyle = left ? '#EFEFF2' : IGB; ctx.beginPath(); ctx.roundRect(x, y, bw, bh, 32); ctx.fill(); }, 0.1, 14, 6);
          lines.forEach((l, i) => T(ctx, l, x + 28, y + 52 + i * 44, F.med(32), left ? INK : '#fff', 'left', 1, 32, 800)); ctx.restore(); };
        if (u > tReply - 0.45 && u < tReply) { ctx.fillStyle = '#EFEFF2'; ctx.beginPath(); ctx.roundRect(120, 1020, 130, 70, 35); ctx.fill(); for (let j = 0; j < 3; j++) { ctx.fillStyle = `rgba(80,80,90,${0.4 + 0.5 * Math.max(0, Math.sin(u * 10 - j))})`; ctx.beginPath(); ctx.arc(160 + j * 26, 1055, 8, 0, 6.283); ctx.fill(); } }
        bub('Mudei de ideia. Vou comprar\nantes da eleição. Me ajuda?', 1020, true, tReply);
        bub('Bora! E me segue pra não\nperder os próximos conteúdos.', 1180, false, tMine);
        ctx.restore(); }
      ctx.restore(); }
    const kf = easeOut(prog(u, tFinal, tFinal + 0.5)); if (kf > 0) { ctx.save(); ctx.globalAlpha *= kf; ctx.translate(0, (1 - kf) * 80);
      T(ctx, 'Indique um amigo', 540, 330, F.semi(64), INK, 'center', 1, 64); T(ctx, 'que está esperando a eleição.', 540, 430, F.it(84), GOLDA, 'center', 1, 84, 960);
      soft(ctx, 110, 560, 860, 300, 44, 0.10, 50, 18); T(ctx, 'Comenta aqui:', 540, 650, F.semi(40), INK, 'center', 1, 40); T(ctx, 'você compraria antes', 540, 730, F.it(64), INK, 'center', 1, 64); T(ctx, 'ou depois da eleição?', 540, 805, F.it(64), INK, 'center', 1, 64);
      T(ctx, '@vistabroker.perioto', 540, 990, F.black(62), INK, 'center', 1, 62, 900); T(ctx, 'Pedro Perioto · Corretor de imóveis · CRECI 258729', 540, 1046, F.semi(30), MUTE, 'center', 1, 30, 900); T(ctx, 'Tatuapé · Anália Franco · Zona Leste', 540, 1090, F.med(28), MUTE, 'center', 1, 28);
      const tf = tFinal + 1.0, fol = u > tf + 0.08, kb = clamp(SPR(u - tf - 0.05, 2, 0.5), 0, 1.1); ctx.save(); ctx.translate(540, 1180); const bs = fol ? lerp(0.92, 1, kb) : 1; ctx.scale(bs, bs);
      shadowed(ctx, () => { ctx.fillStyle = fol ? '#E9EAED' : IGB; ctx.beginPath(); ctx.roundRect(-230, -46, 460, 92, 46); ctx.fill(); }, 0.18, 20, 8); T(ctx, fol ? 'Seguindo ✓' : 'Seguir', 0, 12, F.semi(40), fol ? INK : '#fff', 'center', 1, 40); ctx.restore();
      touch(ctx, 560, 1185, u, [tf], clamp((u - tf + 0.4) * 5) * (1 - clamp((u - tf - 0.5) * 4)));
      const lg = IMG.vista; if (lg) { const s = 1.35; ctx.drawImage(lg, 540 - lg.width * s / 2, 1300, lg.width * s, lg.height * s); }
      ctx.restore(); }
  },
};

// ---------- mapa (3D, maquete) ----------
let MAP = null, PREV5 = null;
const MW = SCENES.find(s => s.name === 'mapa').wt;
// ordem de PREDIOS: 0 Geon, 1 Crona, 2 Almagah, 3 Metria, 4 Platina, 5 Urman, 6 Alameda, 7 Linea, 8 Praça, 9 Auge, 10 Villaggio, 11 Hectare, 12 Universo, 13 East Blue
const PORTE_TAG = [[4, 'Platina 220', 'Pronto', '172 m · 46 andares · aptos 35 a 70 m²', 7.4], [0, 'Geon 652', 'Entregue', 'entregue em 2019', 7.9], [1, 'Crona 665', 'Entregue', 'torre corporativa · 2022', 8.3], [2, 'Almagah 227', 'Em obras', 'no Eixo Platina', 8.7], [3, 'Metria 624', 'Em obras', 'studios de 29 m²', 9.1]];
const ROWS = [[6, 'Alameda Tatuapé', 'dialogo', 'Lançamento', '83 a 147 m² · entrega jun/2028'], [9, 'Auge Resort', 'dialogo', 'Lançamento', 'Tatuapé'], [11, 'Living Hectare', 'living', 'Em obras', '76 a 122 m² · Anália Franco'],
  [7, 'Linea Home Resort', 'dialogo', 'Pronto', 'studios de 24 a 31 m² · metrô Carrão'], [8, 'Praça Tatuapé', 'dialogo', 'Pronto', 'a 200 m do metrô'], [10, 'Living Villaggio', 'living', 'Pronto', '100 a 157 m²'], [12, 'Universo Tatuapé', 'tegra', 'Entregue', '38 a 69 m²'], [13, 'East Blue', 'eztec', 'Pronto', '105 e 140 m²']];
const T3 = MW[38], ROW_DT = 0.62, ROW_LIFE = 2.9; ROWS.forEach((r, i) => { r.t = T3 + i * ROW_DT; });
const BT = Array(14).fill(99); PORTE_TAG.forEach(p => { BT[p[0]] = p[4]; }); BT[5] = MW[29] - 0.15; ROWS.forEach(r => { BT[r[0]] = r.t - 0.1; });
const tL2 = MW[54], tEnd = MW[62];
const MAPTM = { city: 0, zl: 0.6, zoom: 1.3, lines: 1.8, bairros: 99, pin: 99, eixo: MW[14] - 0.2, eixoOff: T3, l2: tL2 - 0.2, l2hi: MW[60] - 0.2, bldT: BT,
  cam: [[5.6, 2.9, 1.0, 26, 56, -8], [MW[13], 2.9, 1.2, 25, 55, -9], [MW[14] + 0.9, 2.95, 1.55, 9.5, 42, -14], [12.2, 2.85, 1.6, 9, 40, -24], [MW[29], 1.85, 1.35, 8.5, 38, -18], [T3 - 0.3, 1.9, 1.3, 9, 36, -8],
    [T3 + 1.0, 3.5, 0.75, 16, 48, -14], [tL2 - 0.3, 3.6, 0.7, 17, 50, -30], [tL2 + 1.0, 4.05, -1.0, 10.5, 44, -22], [tEnd - 0.4, 4.0, -1.0, 11, 44, -16], [tEnd + 1.0, 3.3, 0.6, 20, 54, -24], [40, 3.3, 0.6, 22, 56, -32]] };
const BRAND = { porte: ['Porte', GOLDA], dialogo: ['Diálogo', NAVY], living: ['Cyrela · Living', '#6E7A90'], tegra: ['Tegra', '#2C7A7B'], eztec: ['Eztec', '#8A5A44'] };
const STC = { 'Pronto': GRN, 'Entregue': GRN, 'Em obras': AMB, 'Lançamento': IGB };
function bgFill(ctx) { ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H); }
function tag(o, s, x, y, a, opt = {}) { if (a <= 0) return; const { fg = '#1D1D1F', bg = 'rgba(255,255,255,0.96)', size = 30, dot = null, font = 'InterSemi' } = opt;
  o.save(); o.globalAlpha *= a; const sc = 0.85 + 0.15 * easeOut(clamp(a)); o.translate(x, y); o.scale(sc, sc); o.font = `${size}px ${font}`; const w = o.measureText(s).width + (dot ? 64 : 44), h = size * 1.9;
  o.shadowColor = 'rgba(16,24,40,0.16)'; o.shadowBlur = 24; o.shadowOffsetY = 8; o.fillStyle = bg; o.beginPath(); o.roundRect(-w / 2, -h / 2, w, h, h / 2); o.fill(); o.shadowColor = 'transparent';
  if (dot) { o.fillStyle = dot; o.beginPath(); o.arc(-w / 2 + 30, 0, 9, 0, 6.283); o.fill(); } o.fillStyle = fg; o.textAlign = 'center'; o.textBaseline = 'middle'; o.fillText(s, dot ? 10 : 0, 2); o.restore(); }
const winA = (u, a, b, f = 0.3) => prog(u, a, a + f) * (1 - prog(u, b, b + f));
function stPill(ctx, st, xr, y, a = 1) { ctx.font = F.semi(20); const pw = ctx.measureText(st).width + 28; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = STC[st]; ctx.beginPath(); ctx.roundRect(xr - pw, y - 17, pw, 34, 17); ctx.fill(); ctx.restore(); T(ctx, st, xr - pw / 2, y + 7, F.semi(20), '#fff', 'center', a, 20); return pw; }
// etiqueta lateral com linha-guia até o prédio
function sideTag(ctx, x, y, w, left, name, st, det, col, bx, by, a) { if (a <= 0) return; const h = 92; ctx.save(); ctx.globalAlpha *= a; const ex = left ? x + w : x;
  ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ex, y + h / 2); ctx.lineTo(bx, by); ctx.stroke(); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(bx, by, 6, 0, 6.283); ctx.fill();
  soft(ctx, x, y, w, h, 24, 0.14, 30, 10); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, y, 9, h, [24, 0, 0, 24]); ctx.fill();
  T(ctx, name, x + 28, y + 40, F.semi(30), INK, 'left', 1, 30, w - 150); stPill(ctx, st, x + w - 16, y + 30); T(ctx, det, x + 28, y + 74, F.med(21), MUTE, 'left', 1, 21, w - 44); ctx.restore(); }
function band(ctx, y0, y1, a, up = false) { if (a <= 0) return; const g = ctx.createLinearGradient(0, y0, 0, y1); g.addColorStop(up ? 1 : 0, `rgba(245,245,247,${0.94 * a})`); g.addColorStop(up ? 0 : 1, 'rgba(245,245,247,0)'); ctx.fillStyle = g; ctx.fillRect(0, Math.min(y0, y1), W, Math.abs(y1 - y0)); }
function drawMap(ctx, u, d, w) {
  if (!PREV5) { PREV5 = document.createElement('canvas'); PREV5.width = W; PREV5.height = H; const g = PREV5.getContext('2d'); bgFill(g); const s5 = SCENES[4]; SC.m2(g, s5.d - 0.01, s5.d, s5.wt); }
  const tE = w[13], tU = w[29] - 0.15, tLanc = w[47], tObr = w[48], tPr = w[51];
  // destaque dourado nos prédios
  let focus = [];
  if (u > 7.2 && u < tU) focus = PORTE_TAG.filter(p => u > p[4] + 0.2).map(p => p[0]);
  else if (u >= tU && u < T3) focus = [5];
  else if (u >= T3 && u < tLanc) focus = ROWS.filter(r => u > r.t && u < r.t + ROW_LIFE).map(r => r[0]);
  else if (u >= tLanc && u < tObr) focus = [6, 9]; else if (u >= tObr && u < tPr - 0.3) focus = [2, 3, 5, 11]; else if (u >= tPr - 0.3 && u < tL2) focus = [0, 1, 4, 7, 8, 10, 12, 13];
  else if (u >= tEnd) focus = [...Array(14).keys()];
  const fo = easeIn(prog(u, d - 0.45, d)), fi = easeInOut(prog(u, 0, 0.7));
  const r = MAP.render(u, focus), L = r.labels;
  ctx.save(); if (fo > 0) { ctx.globalAlpha = 1 - fo; ctx.filter = `blur(${(fo * 16).toFixed(1)}px)`; zoomAt(ctx, fo, 540, 900, 1.5); } ctx.drawImage(r.canvas, 0, 0);
  // ---- fase 1: cidade → Zona Leste
  tag(ctx, 'São Paulo', L.sp[0], L.sp[1], winA(u, 0.4, 1.3), { size: 34 });
  tag(ctx, 'Zona Leste', L.zl[0], L.zl[1], winA(u, 0.8, tE - 0.4), { fg: '#fff', bg: GOLDA, size: 34 });
  tag(ctx, 'Linha 3 · Vermelha', L.l3[0], L.l3[1], winA(u, 2.6, tE - 0.4), { dot: '#E03A3E', size: 26 });
  tag(ctx, 'Marginal Tietê', L.rio[0], L.rio[1], winA(u, 2.8, tE - 0.4), { dot: '#8DBCE8', size: 26 });
  tag(ctx, 'Linha 15 · Prata', L.l15[0], L.l15[1], winA(u, 3.0, tE - 0.4), { dot: '#8E98A6', size: 26 });
  // ---- fase 2: Eixo Platina
  tag(ctx, 'Eixo Platina · 1,4 km', L.eixoC[0], L.eixoC[1] + 70, winA(u, w[14], 10.6), { fg: '#fff', bg: GOLDA, size: 26 });
  const slots = { 4: [40, 620, true], 0: [650, 530, false], 1: [650, 632, false], 2: [650, 734, false], 3: [650, 836, false] };
  PORTE_TAG.forEach(([i, nm, st, det, t0], j) => { const [px, py] = L.predios[i].slice(2), [sx, sy, left] = slots[i]; const a = easeOut(prog(u, t0 + 0.3, t0 + 0.7)) * (1 - prog(u, 12.3 + j * 0.18, 12.9 + j * 0.18));
    sideTag(ctx, sx, sy, 390, left, nm, st, det, GOLDA, px, py - 4, a); });
  // Urman: etiqueta curta sobre o prédio
  // ---- fase 3: outras construtoras (lista calma, some aos poucos)
  ROWS.forEach(([i, nm, k, st], j) => { const a = winA(u, ROWS[j].t + 0.3, ROWS[j].t + ROW_LIFE, 0.4); if (a <= 0) return; const [px, py] = L.predios[i].slice(2);
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = BRAND[k][1]; shadowed(ctx, () => { ctx.beginPath(); ctx.arc(px, py - 10, 11, 0, 6.283); ctx.fill(); }, 0.2, 8, 3); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); });
  // ---- fase 4: metrô chegando
  const st = L.l2st.find(s => s[0] === 'ANÁLIA FRANCO'); if (st) tag(ctx, 'Anália Franco', st[1], st[2] - 50, winA(u, w[60] - 0.2, tEnd), { dot: GRN, size: 28 });
  ['ORFANATO', 'SANTA CLARA', 'VILA FORMOSA'].forEach((n, j) => { const s = L.l2st.find(q => q[0] === n); if (s) tag(ctx, n[0] + n.slice(1).toLowerCase(), s[1], s[2] - 40, winA(u, tL2 + 0.6 + j * 0.2, tEnd) * 0.9, { size: 20 }); });
  ctx.restore();
  // a cena anterior se dissolve por cima no começo
  if (fi < 1) { ctx.save(); ctx.globalAlpha = 1 - fi; ctx.filter = `blur(${(fi * 24).toFixed(1)}px)`; zoomAt(ctx, fi, 540, 960, 1.15); ctx.drawImage(PREV5, 0, 0); ctx.restore(); }
  ctx.save(); ctx.globalAlpha *= 1 - fo;
  band(ctx, 140, 600, prog(u, 0.9, 1.4)); band(ctx, 1080, 1560, prog(u, 2.3, 2.8), true);
  // ---------- títulos ----------
  head(ctx, u, 'Enquanto o país discute,', w[0], 'a Zona Leste constrói.', w[7], tE - 0.35, 290, 100);
  head(ctx, u, 'Eixo Platina:', tE, 'morar, trabalhar, viver.', w[19], 10.6, 290, 100);
  head(ctx, u, 'Urman', w[29], 'o maior multiúso em obras*', w[31], T3 - 0.3, 290, 92);
  head(ctx, u, null, 0, 'também não param.', w[43], tLanc - 0.3, 290, 96);
  head(ctx, u, 'E o metrô', tL2, 'está chegando.', w[57], tEnd - 0.3, 290, 104);
  head(ctx, u, 'Governo passa.', tEnd, 'O tijolo fica.', w[64], 99, 290, 124);
  sparkle(ctx, 540, 392, u, w[64] + 0.3, 1.35);
  // por que a Porte aposta aqui (topo)
  const kW = 0 * winA(u, 10.6, tU + 1.2, 0.4); /* oculto no corte curto: passaria rápido demais */ if (kW > 0) { ctx.save(); ctx.globalAlpha *= kW; ctx.translate(0, (1 - easeOut(clamp(kW))) * -30); soft(ctx, 90, 200, 900, 300, 36, 0.14, 50, 18);
    T(ctx, 'POR QUE A PORTE APOSTA AQUI', 140, 258, F.mono(22), GOLDA, 'left', 1, 22, 800, 2);
    T(ctx, 'Só 2 dos 1.597 prédios corporativos', 140, 316, F.semi(34), INK, 'left', 1, 34, 800); T(ctx, 'de SP ficam na Zona Leste. Os dois são dela.', 140, 358, F.semi(34), INK, 'left', 1, 34, 800);
    T(ctx, 'E o morador da ZL gasta, em média,', 140, 414, F.med(30), INK, 'left', prog(u, 11.4, 11.8), 30, 800); T(ctx, '3h44 por dia se deslocando.', 140, 452, F.black(32), GOLDA, 'left', prog(u, 11.4, 11.8), 32, 800); ctx.restore(); }
  // chips das construtoras, no ritmo da fala
  [['Diálogo', NAVY, w[38]], ['Cyrela', '#6E7A90', w[39]], ['Tegra', '#2C7A7B', w[40]], ['Eztec', '#8A5A44', w[42]]].forEach(([s, c, t0], j) => { const k = prog(u, t0 - 0.1, t0 + 0.3) * (1 - prog(u, tLanc - 0.3, tLanc)); if (k > 0) pop(ctx, k, 180 + j * 240, 300, () => spill(ctx, s, 180 + j * 240, 300, F.semi(36), '#fff', c, 72, 30)); });
  // contador de densidade
  const nUp = BT.filter(t => u > t + 0.2).length, kC = prog(u, T3, T3 + 0.4) * (1 - prog(u, tL2 - 0.3, tL2));
  if (kC > 0) { ctx.save(); ctx.globalAlpha *= kC; spill(ctx, `${nUp} empreendimentos no mapa`, 540, 520, F.semi(30), INK, '#fff', 64, 30); ctx.restore(); }
  // lançamentos / obras / prontos
  [[2, 'lançamentos', IGB, tLanc], [4, 'em obras', AMB, tObr], [8, 'prontos', GRN, tPr]].forEach(([n, s, c, t0], j) => { const k = prog(u, t0 - 0.1, t0 + 0.3) * (1 - prog(u, tL2 - 0.3, tL2)); if (k <= 0) return; const x = 220 + j * 320;
    pop(ctx, k, x, 330, () => { soft(ctx, x - 140, 220, 280, 200, 32, 0.14, 40, 14); ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(x - 140, 220, 280, 10, [32, 32, 0, 0]); ctx.fill(); T(ctx, String(n), x, 340, F.black(100), c, 'center', 1, 100); T(ctx, s, x, 392, F.semi(30), INK, 'center', 1, 30); }); });
  // ---------- painéis inferiores ----------
  // Zona Leste em números
  const kZ = winA(u, 2.6, tE - 0.2, 0.4); if (kZ > 0) { ctx.save(); ctx.globalAlpha *= kZ; ctx.translate(0, (1 - easeOut(clamp(kZ))) * 40); soft(ctx, 90, 1150, 900, 270, 36, 0.14, 50, 18);
    T(ctx, 'ZONA LESTE EM NÚMEROS', 140, 1206, F.mono(22), MUTE, 'left', 1, 22, 800, 2);
    T(ctx, '4,3 mi', 140, 1300, F.black(76), INK, 'left', 1, 76); T(ctx, 'de moradores', 140, 1346, F.semi(28), MUTE, 'left', 1, 28);
    const k2 = prog(u, 3.6, 4.0); T(ctx, 'R$ 10,4 bi', 560, 1300, F.black(76), GOLDA, 'left', k2, 76); T(ctx, 'em lançamentos em 2023 (+21%)', 560, 1346, F.semi(28), MUTE, 'left', k2, 28, 420);
    T(ctx, 'Fontes: Porte Construtora · Valor Econômico/Hiperdados', 140, 1392, F.med(20), MUTE, 'left', 1, 20, 800); ctx.restore(); }
  // Eixo Platina: o conceito
  const kE = winA(u, w[14], tU - 0.1, 0.4); if (kE > 0) { ctx.save(); ctx.globalAlpha *= kE; ctx.translate(0, (1 - easeOut(clamp(kE))) * 40); soft(ctx, 90, 1180, 900, 250, 36, 0.14, 50, 18); ctx.fillStyle = GOLDA; ctx.beginPath(); ctx.roundRect(90, 1180, 12, 250, [36, 0, 0, 36]); ctx.fill();
    T(ctx, 'EIXO PLATINA · PORTE CONSTRUTORA', 140, 1236, F.mono(22), GOLDA, 'left', 1, 22, 800, 2);
    T(ctx, '1,4 km entre os metrôs Tatuapé e Carrão', 140, 1288, F.semi(36), INK, 'left', 1, 36, 820);
    [['moradia', w[19]], ['trabalho', w[20]], ['lazer', w[22]]].forEach(([s, t0], j) => { const k = prog(u, t0 - 0.1, t0 + 0.3); if (k > 0) pop(ctx, k, 215 + j * 250, 1370, () => spill(ctx, s, 215 + j * 250, 1370, F.semi(32), '#fff', GOLDA, 64, 36)); if (j < 2) T(ctx, '+', 340 + j * 250, 1382, F.black(36), GOLDA, 'center', prog(u, t0 + 0.2, t0 + 0.4), 36); });
    ctx.restore(); }
  // Urman em números
  const kU = winA(u, tU + 0.2, T3 + 0.1, 0.4); if (kU > 0) { ctx.save(); ctx.globalAlpha *= kU; ctx.translate(0, (1 - easeOut(clamp(kU))) * 40); soft(ctx, 90, 1050, 900, 400, 36, 0.14, 50, 18); ctx.fillStyle = GOLDA; ctx.beginPath(); ctx.roundRect(90, 1050, 12, 400, [36, 0, 0, 36]); ctx.fill();
    T(ctx, 'URMAN SÃO PAULO · PORTE', 140, 1104, F.mono(22), GOLDA, 'left', 1, 22, 600, 2); stPill(ctx, 'Em obras', 950, 1096);
    T(ctx, '153,7 mil m² construídos', 140, 1166, F.black(50), INK, 'left', 1, 50, 820);
    [['1.560+', 'lugares no teatro'], ['287', 'suítes de hotel'], ['11', 'salas de cinema'], ['78', 'lojas no mall'], ['3.000 m²', 'de praça'], ['84–147 m²', 'apartamentos']].forEach(([n, s], j) => { const k = prog(u, tU + 0.6 + j * 0.3, tU + 0.9 + j * 0.3); if (k <= 0) return; const x = 140 + (j % 3) * 285, y = 1240 + Math.floor(j / 3) * 92;
      ctx.save(); ctx.globalAlpha *= k; ctx.translate(0, (1 - easeOut(k)) * 16); T(ctx, n, x, y, F.black(40), INK, 'left', 1, 40, 270); T(ctx, s, x, y + 34, F.med(23), MUTE, 'left', 1, 23, 270); ctx.restore(); });
    T(ctx, '*maior complexo multiúso em obras da cidade, segundo a Porte', 140, 1424, F.med(21), GOLDA, 'left', prog(u, w[31], w[31] + 0.4), 21, 820); ctx.restore(); }
  // lista das outras construtoras
  let stack = 0; for (let j = ROWS.length - 1; j >= 0; j--) { const [, nm, k, st, det] = ROWS[j], t0 = ROWS[j].t, a = winA(u, t0 + 0.3, t0 + ROW_LIFE, 0.4); if (a <= 0) { stack += easeOut(prog(u, t0 + 0.3, t0 + 0.7)) * (u < t0 + ROW_LIFE ? 1 : 1 - prog(u, t0 + ROW_LIFE, t0 + ROW_LIFE + 0.4)); continue; }
    const y = 1360 - stack * 98; stack += easeOut(prog(u, t0 + 0.3, t0 + 0.7)) * (1 - prog(u, t0 + ROW_LIFE, t0 + ROW_LIFE + 0.4));
    ctx.save(); ctx.globalAlpha *= a; ctx.translate(lerp(60, 0, easeOut(clamp(a))), 0); soft(ctx, 90, y, 900, 84, 26, 0.13, 30, 10); ctx.fillStyle = BRAND[k][1]; ctx.beginPath(); ctx.roundRect(90, y, 10, 84, [26, 0, 0, 26]); ctx.fill();
    T(ctx, nm, 128, y + 38, F.semi(32), INK, 'left', 1, 32, 520); T(ctx, BRAND[k][0] + ' · ' + det, 128, y + 70, F.med(22), MUTE, 'left', 1, 22, 640); stPill(ctx, st, 966, y + 42); ctx.restore(); }
  // Linha 2
  const kM = winA(u, tL2 + 0.6, tEnd + 0.1, 0.4); if (kM > 0) { ctx.save(); ctx.globalAlpha *= kM; ctx.translate(0, (1 - easeOut(clamp(kM))) * 40); soft(ctx, 90, 1150, 900, 280, 36, 0.14, 50, 18); ctx.fillStyle = GRN; ctx.beginPath(); ctx.roundRect(90, 1150, 12, 280, [36, 0, 0, 36]); ctx.fill();
    T(ctx, 'LINHA 2 – VERDE · EXPANSÃO', 140, 1206, F.mono(22), GRN, 'left', 1, 22, 800, 2);
    T(ctx, 'Estação Anália Franco:', 140, 1270, F.semi(36), INK, 'left', 1, 36); T(ctx, '71% concluída', 540, 1270, F.black(44), GRN, 'left', prog(u, w[60], w[60] + 0.3), 44);
    T(ctx, '1ª fase (até Vila Formosa) prevista para o fim de 2027', 140, 1322, F.med(28), INK, 'left', prog(u, w[60] + 0.3, w[60] + 0.6), 28, 820);
    T(ctx, 'Fonte: Metrô de SP via Lei de Acesso à Informação (mar/2026)', 140, 1394, F.med(20), MUTE, 'left', 1, 20, 820); ctx.restore(); }
  // fechamento: legenda com as construtoras
  const kl = prog(u, w[64], w[64] + 0.5); if (kl > 0) { ctx.save(); ctx.globalAlpha *= kl; T(ctx, '14 empreendimentos · 5 construtoras · metrô a caminho', 540, 1250, F.semi(30), INK, 'center', 1, 30);
    [['porte', 'Porte · 6'], ['dialogo', 'Diálogo · 4'], ['living', 'Cyrela · 2']].forEach(([k, s], j) => { const kk = prog(u, w[64] + j * 0.12, w[64] + 0.4 + j * 0.12); pop(ctx, kk, 230 + j * 310, 1330, () => spill(ctx, s, 230 + j * 310, 1330, F.semi(26), '#fff', BRAND[k][1], 56, 24)); });
    [['tegra', 'Tegra · 1'], ['eztec', 'Eztec · 1']].forEach(([k, s], j) => { const kk = prog(u, w[64] + 0.36 + j * 0.12, w[64] + 0.76 + j * 0.12); pop(ctx, kk, 385 + j * 310, 1404, () => spill(ctx, s, 385 + j * 310, 1404, F.semi(26), '#fff', BRAND[k][1], 56, 24)); }); ctx.restore(); }
  ctx.restore();
  fonte(ctx, u < T3 ? 'Mapa: Geosampa e Metrô · empreendimentos: site da Porte (out/2026) · alturas fora de escala' : u < tL2 ? 'Empreendimentos: sites da Diálogo, Cyrela/Living, Tegra e Eztec (out/2026) · alturas fora de escala' : 'Mapa: Geosampa e Metrô · alturas fora de escala', prog(u, 1.5, 2.0) * (1 - fo), 1474);
}
// ---------- acabamento v7: faíscas discretas e cortes com passagem de velocidade ----------
// faíscas douradas + anel fino que se expande a partir do destaque (só nos 3 momentos-chave)
function sparkle(ctx, x, y, u, t0, s = 1) {
  const k = (u - t0) / 0.95; if (k <= 0 || k >= 1) return; ctx.save();
  const kr = clamp(k / 0.7); if (kr < 1) { ctx.globalAlpha = 0.5 * (1 - kr); ctx.strokeStyle = '#C9A86A'; ctx.lineWidth = 3 * s * (1 - kr) + 0.5; ctx.beginPath(); ctx.ellipse(x, y, (30 + 170 * easeOut(kr)) * s, (22 + 110 * easeOut(kr)) * s, 0, 0, 6.283); ctx.stroke(); }
  for (let i = 0; i < 11; i++) { const a = i * 2.39996 + 0.7, r0 = (0.55 + 0.45 * ((i * 37) % 11) / 11) * 150 * s, d = 0.12 + 0.05 * (i % 4), kk = clamp((k - d * 0.4) / (1 - d * 0.4)); if (kk <= 0) continue;
    const e = easeOut(kk), px = x + Math.cos(a) * r0 * e, py = y + Math.sin(a) * r0 * 0.7 * e - 14 * kk, sz = (5 + (i % 3) * 3) * s * (1 - kk) * Math.min(1, kk * 6);
    if (sz <= 0.3) continue; ctx.globalAlpha = 0.95 * (1 - kk * kk); ctx.fillStyle = i % 3 === 0 ? '#FFFFFF' : '#D9B979'; ctx.shadowColor = 'rgba(184,149,90,0.55)'; ctx.shadowBlur = 8 * s;
    ctx.beginPath(); ctx.moveTo(px, py - sz * 2); ctx.quadraticCurveTo(px, py, px + sz * 2, py); ctx.quadraticCurveTo(px, py, px, py + sz * 2); ctx.quadraticCurveTo(px, py, px - sz * 2, py); ctx.quadraticCurveTo(px, py, px, py - sz * 2); ctx.fill(); }
  ctx.restore(); }
// cortes "velocity handoff": a cena que sai acelera para cima e a próxima entra já em movimento, desacelerando
const WHIP = { bolsonaro: 1, lula: 1, mercado: 1 }, W_OUT = 0.55, W_IN = 0.5, D_OUT = 420, D_IN = 380;
function sceneAt(t) { let i = SEQ.findIndex(s => t < s.b); if (i < 0) i = SEQ.length - 1; return i; }
function drawScene(ctx, t, i) {
  const s = SEQ[i], u = t - s.a; let dy = 0, sc = 1;
  if (WHIP[s.name] && u > s.d - W_OUT) { const k = (u - (s.d - W_OUT)) / W_OUT; dy = -D_OUT * k * k * k; sc = 1 - 0.03 * k * k; }
  if (i > 0 && WHIP[SEQ[i - 1].name] && u < W_IN) { const k = 1 - u / W_IN; dy = D_IN * k * k * k; sc = 1 + 0.025 * k * k; }
  const uo = clamp(warp(s, u), 0, s.old.d - 1e-3);
  ctx.save(); if (dy || sc !== 1) { ctx.translate(540, 960 + dy); ctx.scale(sc, sc); ctx.translate(-540, -960); }
  if (s.name === 'mapa') drawMap(ctx, uo, s.old.d, s.old.wt); else SC[s.name](ctx, uo, s.old.d, s.old.wt); ctx.restore(); }
function inWhip(t) { const i = sceneAt(t), s = SEQ[i], u = t - s.a; return (WHIP[s.name] && u > s.d - W_OUT) || (i > 0 && WHIP[SEQ[i - 1].name] && u < W_IN); }
let MB = null, SUB = null;
// legendas na tela (quem assiste sem som): blocos curtos, palavra falada em dourado
const CHUNKS = []; SEQ.forEach(s => { if (s.name === 'cta') return; const ws = s.text.split(' '); let cur = [];
  ws.forEach((w, i) => { cur.push([w, s.a + s.wt[i]]); const brk = /[.?!:]$/.test(w) || (/,$/.test(w) && cur.length >= 3) || cur.length >= 5;
    if (brk || i === ws.length - 1) { CHUNKS.push({ ws: cur, t0: cur[0][1] }); cur = []; } });
  CHUNKS[CHUNKS.length - 1].last = s.b; });
CHUNKS.forEach((c, i) => { const n = CHUNKS[i + 1]; const lastW = c.ws[c.ws.length - 1][1]; c.t1 = Math.min(n ? n.t0 - 0.02 : 1e9, lastW + 0.75, c.last || 1e9); });
function captions(ctx, t) { if (window.NOCAP) return;
  const c = CHUNKS.find(c => t >= c.t0 - 0.06 && t < c.t1); if (!c) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.font = F.semi(44);
  const sp = ctx.measureText(' ').width, ws = c.ws.map(([w]) => ctx.measureText(w).width), tw = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const k = clamp((t - c.t0 + 0.06) / 0.14), sc = 0.92 + 0.08 * easeOut(k), y = 1528, h = 76, pw_ = tw + 56;
  ctx.translate(540, y); ctx.scale(sc, sc); ctx.globalAlpha = Math.min(1, k * 1.5) * (1 - clamp((t - c.t1 + 0.1) / 0.1));
  ctx.shadowColor = 'rgba(11,31,58,0.28)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8; ctx.fillStyle = 'rgba(11,31,58,0.94)'; ctx.beginPath(); ctx.roundRect(-pw_ / 2, -h / 2, pw_, h, h / 2); ctx.fill(); ctx.shadowColor = 'transparent';
  let x = -tw / 2; let cur = -1; c.ws.forEach(([, wt_], j) => { if (t >= wt_ - 0.04) cur = j; });
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  c.ws.forEach(([w], j) => { ctx.fillStyle = j === cur ? '#E2C27F' : j < cur ? '#FFFFFF' : 'rgba(255,255,255,0.42)'; ctx.fillText(w, x, 3); x += ws[j] + sp; });
  ctx.restore(); }
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; bgFill(ctx);
  const i = sceneAt(t);
  if (!inWhip(t)) { drawScene(ctx, t, i); captions(ctx, t); return; }
  // motion blur: 6 amostras em meio quadro (obturador 180°), sem atravessar o corte
  if (!MB) { MB = document.createElement('canvas'); MB.width = W; MB.height = H; SUB = document.createElement('canvas'); SUB.width = W; SUB.height = H; }
  const m = MB.getContext('2d'), g = SUB.getContext('2d'), N = 6, s = SEQ[i];
  for (let j = 0; j < N; j++) { const tj = clamp(t + (j / (N - 1) - 0.5) / 60, s.a, s.b - 1e-4);
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; bgFill(g); drawScene(g, tj, i);
    m.globalAlpha = 1 / (j + 1); m.drawImage(SUB, 0, 0); }
  m.globalAlpha = 1; ctx.drawImage(MB, 0, 0); captions(ctx, t);
}
window.TIMING = SEQ.map(s => { const lo = s.pts[0][1] - 1e-6, hi = s.pts[s.pts.length - 1][1] + 1e-6, r2 = (x) => Math.round(x * 100) / 100;
  return { cena: s.name, inicio: r2(s.a), fim: r2(s.b), fala: s.text, palavras: s.wt.map(x => r2(x + s.a)), antigas: s.old.wt.map(x => (x < lo || x > hi) ? null : r2(unwarp(s, x) + s.a)), warp: s.pts.map(p => p.map(r2)) }; });
function setMap(m) { MAP = m; }
