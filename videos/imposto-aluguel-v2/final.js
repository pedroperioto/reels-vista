// final.js — "Imposto novo no aluguel: você passa na régua?" · versão final 9:16
// Tudo preso às palavras da narração (VOZ em voz/tempos.js): W(i) = início da palavra i, WE(i) = fim.
const RATE = 2.5, WD = 1 / RATE;
const INK = '#1D1D1F', MUTE = '#86868B', GOLDA = '#B8955A', NAVY = '#0B1F3A', LINE = '#E3E3E8', RD = '#D62828', GRN = '#2E9E5B';
const VW = VOZ.w, Wt = (i) => VW[i][1], WE = (i) => VW[i][2];
const DUR = Math.ceil((WE(VW.length - 1) + 2.6) * 10) / 10;
const IMG = {}; const ASSETS = new Promise(r => { const im = new Image(); im.onload = () => { IMG.vista = im; r(); }; im.onerror = () => r(); im.src = 'fotos/vista.png'; });

// texto com pontuação para a legenda (mesma ordem das 216 palavras)
const TXT = (`Você investe em imóvel pra alugar? Já ouviu que o imposto novo vai morder a sua renda? Calma. Pra maioria, NÃO vai. O IBS e a CBS são os impostos novos da reforma tributária. E, pra pessoa física, funcionam como a régua de um brinquedo de parque: só entra quem alcança a linha. A linha tem DUAS marcas: quatro imóveis alugados ou mais, E mais de duzentos e quarenta mil reais por ano, somando todos os aluguéis. Precisa passar nas DUAS. ` +
  `Dois imóveis, sessenta mil por ano? Não alcança. Cinco imóveis, mas duzentos mil por ano? Também não. Pra quem não alcança, NADA muda: só o Imposto de Renda, como sempre. Passou nas duas? Aí o dono do imóvel paga, a partir de dois mil e vinte e sete. Mas com desconto: SETENTA por cento a menos no imposto. E, no aluguel residencial, seiscentos reais de cada aluguel, por mês, ficam fora da conta. Dois avisos. A conta de dois mil e vinte e sete olha o que você recebeu em dois mil e vinte e seis. E, se você passa na régua e aluga por temporada, até noventa dias, os descontos não valem: entra a regra de hotel. Quer saber se você passa na régua? Comenta RÉGUA que eu faço a sua conta no direct.`).split(' ');
if (TXT.length !== VW.length) throw new Error('legenda: ' + TXT.length + ' palavras no texto, ' + VW.length + ' na voz');

// ---------- cenas (começam no meio da pausa antes da 1ª palavra) ----------
const SCN = [['renda', 0], ['morder', 6], ['calma', 17], ['ibs', 22], ['regua', 34], ['marcas', 53], ['exemplos', 81], ['paga', 111], ['avisos', 154], ['cta', 199]];
const TRANS = { morder: 'flash', calma: 'mask', ibs: 'push', regua: 'whip', marcas: 'zoom', exemplos: 'slide', paga: 'fade', avisos: 'glitch', cta: 'zoomout' };
const SC = SCN.map(([n, i], k) => ({ n, i, a: k === 0 ? 0 : (WE(i - 1) + Wt(i)) / 2 }));
SC.forEach((s, k) => s.b = k + 1 < SC.length ? SC[k + 1].a : DUR);
const S = Object.fromEntries(SC.map(s => [s.n, s]));
const TIMING = SC.map(s => ({ cena: s.n, inicio: +s.a.toFixed(2), fim: +s.b.toFixed(2) }));

// ---------- vídeos do Pexels (quadros em clips/<nome>/NNNN.jpg, 30 fps) ----------
const CLIPN = { predios: 90, chaves: 72, dinheiro: 78, calc: 78, mala: 102 };
const CLIPC = new Map(), CLIPWANT = new Set(); let CLIPON = 0;
function clipKey(name, ct) { const f = clamp(Math.round(ct * 30), 0, CLIPN[name] - 1) + 1; return `clips/${name}/${String(f).padStart(4, '0')}.jpg`; }
function clipDraw(ctx, name, ct, z = 1) { const k = clipKey(name, ct); CLIPWANT.add(k); const im = CLIPC.get(k);
  if (im) { ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.drawImage(im, -540, -960, W, H); ctx.restore(); } else { ctx.fillStyle = '#5A6475'; ctx.fillRect(0, 0, W, H); }
  CLIPON = Math.max(CLIPON, ctx.globalAlpha); }
const CLIPDRY = document.createElement('canvas'); CLIPDRY.width = W; CLIPDRY.height = H;
function loadClip(k) { return new Promise(res => { const im = new Image(); im.onload = () => { CLIPC.set(k, im); res(); }; im.onerror = () => res(); im.src = k; }); }
window.clipPrep = async (t) => { CLIPWANT.clear(); try { render(CLIPDRY, t); } catch (e) { }
  const need = [...CLIPWANT], pre = []; need.forEach(k => { const m = k.match(/clips\/(\w+)\/(\d+)\.jpg/); for (let j = 1; j <= 3; j++) pre.push(`clips/${m[1]}/${String(Math.min(CLIPN[m[1]], +m[2] + j)).padStart(4, '0')}.jpg`); });
  await Promise.all([...need, ...pre].filter(k => !CLIPC.has(k)).map(loadClip)); while (CLIPC.size > 50) CLIPC.delete(CLIPC.keys().next().value); };
// insere um vídeo entre t0 e t1 com entrada em zoom e saída rápida
function insert(ctx, t, name, t0, t1, label) {
  if (t < t0 - 0.02 || t > t1 + 0.12) return false; const k = clamp((t - t0) / 0.18), o = clamp((t - t1) / 0.12);
  ctx.save(); ctx.globalAlpha *= k * (1 - o); clipDraw(ctx, name, t - t0, lerp(1.18, 1.0, easeOut(clamp((t - t0) / 1.4))) + 0.02 * Math.sin((t - t0) * 2));
  const g = ctx.createLinearGradient(0, 0, 0, 700); g.addColorStop(0, 'rgba(6,16,32,0.55)'); g.addColorStop(1, 'rgba(6,16,32,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 700);
  if (label) T(ctx, label, 60, 1478, F.med(22), 'rgba(255,255,255,0.75)', 'left', 1, 22);
  ctx.restore(); return k >= 1 && o <= 0;
}

const fullClip = (t, t0, t1) => t >= t0 + 0.18 && t <= t1;
// ---------- utilidades ----------
const since = (t, i, d = 0) => t - Wt(i) - d;            // segundos desde o início da palavra i
const kOn = (t, i, d = 0.3, off = 0) => clamp((t - Wt(i) - off) / d);
function badge(ctx, x, y, ok, icon, k) { pop(ctx, k, x, y, () => { ctx.fillStyle = ok ? GRN : RD; ctx.beginPath(); ctx.arc(x, y, 34, 0, 6.283); ctx.fill();
  if (icon === 'casa') houseIcon(ctx, x - 6, y + 2, 0.9, '#FFFFFF'); else T(ctx, 'R$', x - 6, y + 10, F.black(24), '#FFFFFF', 'center', 1, 24);
  ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(x + 24, y - 22, 15, 0, 6.283); ctx.fill(); T(ctx, ok ? '✓' : '✕', x + 24, y - 14, F.black(22), ok ? GRN : RD, 'center', 1, 22); }); }
function checkbox(ctx, x, y, k, col = GRN) { ctx.save(); ctx.fillStyle = k > 0 ? col : '#FFFFFF'; ctx.strokeStyle = k > 0 ? col : '#C9CDD5'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 30, y - 30, 60, 60, 16); ctx.fill(); ctx.stroke();
  if (k > 0) { ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); const e = clamp(k * 1.6); ctx.moveTo(x - 14, y + 1); ctx.lineTo(x - 4, y + 12); if (e > 0.4) ctx.lineTo(lerp(x - 4, x + 16, (e - 0.4) / 0.6), lerp(y + 12, y - 12, (e - 0.4) / 0.6)); ctx.stroke(); }
  ctx.restore(); }
function bar(ctx, x, y, w, h, k, col, bg = '#EEF0F3') { ctx.save(); ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x, y, w, h, h / 2); ctx.fill(); if (k > 0) { ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x, y, Math.max(h, w * k), h, h / 2); ctx.fill(); } ctx.restore(); }
function suitcase(ctx, x, y, s, col = NAVY) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = col; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-34, -110, 68, 40, 14); ctx.stroke();
  ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-90, -80, 180, 160, 26); ctx.fill(); ctx.fillStyle = '#E2C27F'; ctx.fillRect(-50, -80, 14, 160); ctx.fillRect(36, -80, 14, 160); ctx.restore(); }
function bell(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#E2C27F'; ctx.beginPath(); ctx.arc(0, 10, 80, Math.PI, 0); ctx.fill(); ctx.fillStyle = NAVY; ctx.fillRect(-100, 10, 200, 22); ctx.beginPath(); ctx.arc(0, -78, 14, 0, 6.283); ctx.fill(); ctx.restore(); }
function calendar(ctx, x, y, s, year, flip = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); card(ctx, -130, -140, 260, 280, 30, '#FFFFFF', 0.14);
  ctx.fillStyle = RD; ctx.beginPath(); ctx.roundRect(-130, -140, 260, 80, [30, 30, 0, 0]); ctx.fill(); T(ctx, 'ANO', 0, -86, F.black(30), '#FFFFFF', 'center', 1, 30);
  ctx.save(); ctx.beginPath(); ctx.rect(-130, -60, 260, 200); ctx.clip(); const sy = Math.cos(Math.PI * clamp(flip)) ; ctx.translate(0, 40); ctx.scale(1, Math.abs(sy)); T(ctx, flip < 0.5 ? String(year) : String(year + 1), 0, 30, F.black(84), INK, 'center', 1, 84); ctx.restore(); ctx.restore(); }

// ---------- legenda karaokê presa à voz ----------
const CAPG = []; { let g = [];
  TXT.forEach((w, i) => { g.push(i); const end = /[.?!:,]$/.test(w) || g.length >= 3 || (i + 1 < VW.length && Wt(i + 1) - WE(i) > 0.35); if (end || i === TXT.length - 1) { CAPG.push(g); g = []; } }); }
function captions(ctx, t) {
  let gi = -1; CAPG.forEach((g, k) => { if (t >= Wt(g[0]) - 0.06) gi = k; }); if (gi < 0) return; const g = CAPG[gi], tEnd = WE(g[g.length - 1]) + 0.35;
  const nxt = CAPG[gi + 1]; if (t > (nxt ? Math.min(tEnd, Wt(nxt[0]) - 0.06) : tEnd)) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.font = F.black(50); const sp = ctx.measureText(' ').width + 6, wid = g.map(i => ctx.measureText(TXT[i]).width), tot = wid.reduce((a, b) => a + b, 0) + sp * (g.length - 1);
  const k = clamp((t - Wt(g[0]) + 0.06) / 0.12); let cur = -1; g.forEach((i, j) => { if (t >= Wt(i) - 0.04) cur = j; });
  const dk = CLIPON > 0.4, y = 1595 + (1 - easeOut(k)) * 14; ctx.globalAlpha = k;
  if (dk) { ctx.fillStyle = `rgba(6,16,32,${0.6 * Math.min(1, CLIPON)})`; ctx.beginPath(); ctx.roundRect(540 - tot / 2 - 32, y - 48, tot + 64, 96, 48); ctx.fill(); }
  let x = 540 - tot / 2; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  g.forEach((i, j) => { const w = TXT[i], wk = j === cur ? 1 + 0.14 * Math.max(0, 1 - (t - Wt(i)) / 0.25) : 1, caps = w === w.toUpperCase() && /[A-ZÃÉ]/.test(w);
    ctx.save(); ctx.translate(x + wid[j] / 2, y); ctx.scale(wk, wk); ctx.translate(-(x + wid[j] / 2), -y);
    if (!dk) { ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 12; ctx.strokeText(w, x, y); }
    ctx.fillStyle = j === cur || (caps && j < cur) ? (dk ? '#E2C27F' : GOLDA) : j < cur ? (dk ? '#FFFFFF' : INK) : (dk ? 'rgba(255,255,255,0.45)' : 'rgba(29,29,31,0.3)'); ctx.fillText(w, x, y); ctx.restore(); x += wid[j] + sp; });
  ctx.restore();
}
function fonte(ctx, s, a) { if (a > 0) T(ctx, s, 540, 1505, F.mono(22), MUTE, 'center', a, 22, 980); }

// ---------- CENAS ----------
const R = {}; // R[nome](ctx, t, s)

R.renda = (ctx, t) => {
  const c1 = Wt(3) + 0.1; // vídeo real dos prédios abre o gancho
  if (!fullClip(t, -1, c1)) rendaBase(ctx, t);
  if (insert(ctx, t, 'predios', -0.2, c1) || t < c1 + 0.1) A_kw(ctx, t, 'Você investe', 0.15, 'em imóvel…', Wt(2), true);
};
function rendaBase(ctx, t) {
  const t0 = Wt(3) + 0.12;
  kw(ctx, t, 'Você investe em imóvel', t0 - 0.6, 'pra alugar?', Wt(4), 99, 104);
  [[230, 0, 330], [540, 0.12, 430], [850, 0.24, 370]].forEach(([x, d, h]) => pop(ctx, t - t0 - d, x, 900, () => { building(ctx, x, 1060, 230, h); pill(ctx, 'ALUGADO', x, 1095, F.black(30), NAVY, '#E2C27F', 58, 24); }));
  for (let i = 0; i < 9; i++) { const c0 = Wt(5) + i * 0.09 - 0.1, k = clamp((t - c0) / 0.45); if (k <= 0 || k >= 1) continue; const sx = [230, 540, 850][i % 3]; coin(ctx, lerp(sx, 540, k), lerp(1100, 1290, easeIn(k)) - Math.sin(Math.PI * k) * 140, 40, 1 - clamp((k - 0.85) * 6)); }
  wallet(ctx, 540, 1300, 1.05 + 0.03 * Math.sin(t * 10) * clamp((t - Wt(5)) * 2));
};
// título sobre vídeo (branco)
function A_kw(ctx, t, l1, t1, l2, t2, dark) { aw(ctx, l1, 540, 380, F.semi(68), '#FFFFFF', t, t1, 68); if (l2) aw(ctx, l2, 540, 490, F.black(100), 'gold', t, t2, 100); }

R.morder = (ctx, t, s) => {
  const vEnd = Wt(12) - 0.05;
  if (!fullClip(t, s.a - 0.05, vEnd)) morderBase(ctx, t, vEnd);
  if (t < vEnd + 0.12) { insert(ctx, t, 'dinheiro', s.a - 0.05, vEnd); A_kw(ctx, t, 'Já ouviu que', Wt(6), 'o imposto novo…', Wt(9), true); }
};
function morderBase(ctx, t, vEnd) {
  const z = easeOut(clamp((t - vEnd) / 0.35)), bite = clamp((t - Wt(13) - 0.12) / 0.1), wob = bite > 0 ? Math.sin((t - Wt(13) - 0.12) * 30) * Math.exp(-(t - Wt(13) - 0.12) / 0.2) * 0.08 : 0;
  ctx.save(); ctx.globalAlpha = z; kw(ctx, t, 'O imposto novo', vEnd - 0.4, 'vai morder sua renda?', Wt(12), 99, 88);
  const s_ = lerp(0.3, 1, z) * (1 + 0.04 * Math.exp(-Math.max(0, t - Wt(16)) / 0.15) * (t > Wt(16) ? 1 : 0)); ctx.translate(540, 1010); ctx.rotate(wob); ctx.scale(s_, s_); ctx.drawImage(bittenCoin(bite), -380, -380); ctx.restore();
  if (bite > 0) { const R_ = rng(4), kk = t - Wt(13) - 0.12; if (kk < 1) for (let i = 0; i < 16; i++) { const a = -0.9 + R_() * 1.2, sp = 200 + R_() * 320; ctx.save(); ctx.globalAlpha = clamp(1 - kk); ctx.fillStyle = '#C9A86A'; ctx.beginPath(); ctx.arc(840 + Math.cos(a) * sp * kk, 830 - Math.sin(a) * sp * kk + 700 * kk * kk, 5 + R_() * 7, 0, 6.283); ctx.fill(); ctx.restore(); } }
};

R.calma = (ctx, t, s) => {
  pop(ctx, since(t, 17, -0.05), 540, 420, () => T(ctx, 'Calma.', 540, 450, F.it(170), 'gold', 'center', 1, 170));
  // "pra maioria": 12 casas, 11 ficam verdes
  for (let i = 0; i < 12; i++) { const cx = 255 + (i % 4) * 190, cy = 720 + Math.floor(i / 4) * 190, ap = since(t, 18, 0.03 * i);
    const g = i !== 11 ? kOn(t, 19, 0.25, 0.04 * i) : 0;
    pop(ctx, ap, cx, cy, () => { card(ctx, cx - 75, cy - 75, 150, 150, 30, g > 0.5 ? '#E7F6EC' : '#FFFFFF', 0.1); houseIcon(ctx, cx, cy + 4, 2.4, g > 0.5 ? GRN : (i === 11 ? NAVY : '#B9BCC4'));
      if (g > 0.5) { ctx.fillStyle = GRN; ctx.beginPath(); ctx.arc(cx + 52, cy - 52, 20, 0, 6.283); ctx.fill(); T(ctx, '✓', cx + 52, cy - 43, F.black(24), '#FFFFFF', 'center', 1, 24); } }); }
  const sk = clamp((t - Wt(20) + 0.08) / 0.12); if (sk > 0) stamp(ctx, 540, 1390, lerp(2.2, 0.95, easeIn(sk)), -0.08, 'PRA MAIORIA,', 'NÃO VAI.', GRN, clamp(sk * 3));
};

R.ibs = (ctx, t) => {
  kw(ctx, t, 'Os impostos novos', Wt(27), 'da reforma tributária', Wt(31), 99, 92);
  const tile = (s, x, i, full) => pop(ctx, since(t, i, -0.05), x, 860, () => { card(ctx, x - 190, 730, 380, 260, 44, NAVY, 0.3); T(ctx, s, x, 885, F.black(120), '#FFFFFF', 'center', 1, 120); T(ctx, full, x, 950, F.med(26), '#C9D2E3', 'center', 1, 26, 340); });
  tile('IBS', 300, 23, 'Imposto sobre Bens e Serviços'); tile('CBS', 780, 26, 'Contribuição sobre Bens e Serviços');
  pop(ctx, since(t, 24), 540, 860, () => T(ctx, '+', 540, 900, F.black(110), 'gold', 'center', 1, 110));
  fx(ctx, kOn(t, 29), 0, () => { card(ctx, 140, 1090, 800, 200, 36, '#FFFFFF', 0.1); T(ctx, 'Vão substituir PIS, Cofins, ICMS e ISS', 540, 1170, F.semi(36), INK, 'center', 1, 36, 740); T(ctx, 'e começam a valer de verdade em 2027', 540, 1230, F.med(32), MUTE, 'center', 1, 32, 740); });
};

// placa do brinquedo + régua (cena-herói)
function rideSign(ctx, t, x, y, s, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  // trilho de montanha-russa ao fundo com carrinho passando
  ctx.strokeStyle = '#C9CDD5'; ctx.lineWidth = 10; ctx.beginPath(); for (let i = 0; i <= 60; i++) { const xx = -420 + i * 14, yy = -250 + 70 * Math.sin(i * 0.22); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  const cp = ((t * 0.55) % 1), ci = cp * 60, cx = -420 + ci * 14, cy = -250 + 70 * Math.sin(ci * 0.22) - 26; ctx.fillStyle = RD; ctx.beginPath(); ctx.roundRect(cx - 40, cy - 22, 80, 40, 12); ctx.fill(); ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(cx - 22, cy + 20, 9, 0, 6.283); ctx.arc(cx + 22, cy + 20, 9, 0, 6.283); ctx.fill();
  // placa
  ctx.fillStyle = '#8A6A3A'; ctx.fillRect(-14, 0, 28, 380);
  card(ctx, -300, -150, 600, 260, 40, '#E2C27F', 0.2); ctx.strokeStyle = NAVY; ctx.lineWidth = 10; ctx.beginPath(); ctx.roundRect(-282, -132, 564, 224, 30); ctx.stroke();
  T(ctx, 'ALTURA MÍNIMA', 0, -60, F.black(56), NAVY, 'center', 1, 56, 520); T(ctx, 'para entrar no brinquedo', 0, 0, F.semi(34), NAVY, 'center', 1, 34, 520);
  ctx.fillStyle = RD; ctx.fillRect(-200, 46, 400, 10); ctx.restore(); }
R.regua = (ctx, t, s) => {
  kw(ctx, t, 'Funciona como', Wt(38), 'a régua do parque', Wt(41), 99, 96);
  const pf = 1 - clamp((t - Wt(43) + 0.25) / 0.25);
  if (pf > 0 && t > Wt(35) - 0.1) { ctx.save(); ctx.globalAlpha *= pf; pop(ctx, since(t, 35, -0.05), 540, 900, () => { card(ctx, 240, 700, 600, 420, 48, '#FFFFFF', 0.14);
    ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(540, 820, 62, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.roundRect(470, 890, 140, 110, [60, 60, 14, 14]); ctx.fill();
    T(ctx, 'Pessoa física', 540, 1060, F.black(52), INK, 'center', 1, 52); T(ctx, 'imóveis no seu CPF', 540, 1100, F.med(28), MUTE, 'center', 1, 28); }); ctx.restore(); }
  const rs = clamp(SPR(since(t, 43, -0.1), 1.4, 0.6), 0, 1.06);
  rideSign(ctx, t, 470, 900, rs * 0.95, clamp(rs * 4));
  ruler(ctx, 940, 640, 1420, clamp(since(t, 41) * 3));
  // "só entra quem alcança a linha": linha vermelha se desenha
  const lk = clamp((t - Wt(50)) / 0.6); if (lk > 0) { ctx.save(); ctx.setLineDash([24, 16]); ctx.strokeStyle = RD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(980, 700); ctx.lineTo(980 - 900 * easeOut(lk), 700); ctx.stroke(); ctx.restore();
    pop(ctx, since(t, 52), 140, 700, () => pill(ctx, 'LINHA', 140, 700, F.black(30), '#FFFFFF', RD, 56, 20)); }
  // criança tentando alcançar (pula)
  const kid = clamp(since(t, 47) / 0.5), jump = Math.max(0, Math.sin(Math.PI * clamp(since(t, 49) / 0.6))) * 90;
  if (kid > 0) { ctx.save(); ctx.translate(lerp(-100, 760, easeOut(kid)), 1420 - jump); ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(0, -230, 38, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.roundRect(-36, -185, 72, 120, 26); ctx.fill(); ctx.fillRect(-30, -75, 22, 75); ctx.fillRect(8, -75, 22, 75); ctx.restore(); }
};

R.marcas = (ctx, t) => {
  kw(ctx, t, 'A linha tem', Wt(53), 'DUAS marcas', Wt(56), 99, 110);
  // marca 1: imóveis
  const c1 = since(t, 54, -0.1), ok1 = kOn(t, 78, 0.3), ok2 = kOn(t, 80, 0.3);
  pop(ctx, c1, 540, 700, () => { card(ctx, 110, 580, 860, 270, 40, '#FFFFFF', ok1 > 0 ? 0.18 : 0.12); if (ok1 > 0) { ctx.strokeStyle = GRN; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(110, 580, 860, 270, 40); ctx.stroke(); }
    for (let i = 0; i < 4; i++) { const on = clamp((t - (Wt(58) + i * 0.18)) / 0.15); ctx.save(); const cx = 210 + i * 120, cy = 680; if (on > 0) { const s = 1 + 0.25 * Math.exp(-(t - Wt(58) - i * 0.18) / 0.12); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); } houseIcon(ctx, cx, cy, 2.6, on > 0 ? (i === 3 ? GOLDA : NAVY) : '#D5D8DE'); ctx.restore(); }
    T(ctx, '4+', 830, 712, F.black(96), GOLDA, 'center', kOn(t, 58), 96); T(ctx, 'imóveis alugados (4 ou mais)', 150, 800, F.semi(36), INK, 'left', 1, 36, 640); checkbox(ctx, 900, 790, ok1); });
  pop(ctx, since(t, 63, -0.05), 540, 905, () => { ctx.fillStyle = '#E2C27F'; ctx.beginPath(); ctx.arc(540, 905, 50, 0, 6.283); ctx.fill(); T(ctx, 'E', 540, 924, F.black(52), NAVY, 'center', 1, 52); });
  // marca 2: dinheiro somado
  pop(ctx, since(t, 64, -0.1), 540, 1080, () => { card(ctx, 110, 960, 860, 300, 40, '#FFFFFF', ok2 > 0 ? 0.18 : 0.12); if (ok2 > 0) { ctx.strokeStyle = GRN; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(110, 960, 860, 300, 40); ctx.stroke(); }
    const n = clamp((t - Wt(66)) / (WE(69) - Wt(66))); T(ctx, 'R$ ' + Math.round(240 * easeOut(n)) + ' mil', 150, 1080, F.black(84), NAVY, 'left', clamp(n * 4), 84, 560); T(ctx, 'por ano, somando todos os aluguéis', 150, 1140, F.semi(34), INK, 'left', 1, 34, 640);
    bar(ctx, 150, 1180, 620, 26, clamp((t - Wt(73)) / 1.0), GOLDA); checkbox(ctx, 900, 1110, ok2);
    for (let i = 0; i < 8; i++) { const c0 = Wt(73) + i * 0.12, k = clamp((t - c0) / 0.4); if (k > 0 && k < 1) coin(ctx, lerp(200 + (i % 4) * 150, 160 + 620 * (i + 1) / 8, k), lerp(980, 1190, easeIn(k)) - Math.sin(Math.PI * k) * 60, 22, 1 - clamp((k - 0.8) * 5)); } });
  const sk = clamp((t - Wt(80) + 0.05) / 0.12); if (sk > 0) stamp(ctx, 540, 1390, lerp(2.2, 0.85, easeIn(sk)), -0.06, 'AS DUAS', 'JUNTAS', RD, clamp(sk * 3));
  fonte(ctx, 'Fonte: LC 214/2025, art. 251 · Decreto 12.955/2026', kOn(t, 58) * (1 - clamp((t - Wt(79)) / 0.3)));
};

// régua compartilhada por exemplos e paga
const RX = 940, RTOP = 600, RBOT = 1400, LIM = 860;
function rulerScene(ctx, t, a = 1) { ruler(ctx, RX, RTOP, RBOT, a); ctx.save(); ctx.globalAlpha *= a; ctx.setLineDash([24, 16]); ctx.strokeStyle = RD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(RX + 40, LIM); ctx.lineTo(60, LIM); ctx.stroke(); ctx.restore();
  pill(ctx, 'LINHA: 4+ imóveis E R$ 240 mil+/ano', 480, 600, F.semi(28), '#FFFFFF', RD, 54, 22, a); }
function investor(ctx, x, n, h, label, t, tIn, tOut, jumpT, badges) {
  const kin = clamp((t - tIn) / 0.45), kout = clamp((t - tOut) / 0.35); if (kin <= 0 || kout >= 1) return;
  const xx = lerp(-260, x, easeOut(kin)) + 700 * easeIn(kout), jump = jumpT ? Math.max(0, Math.sin(Math.PI * clamp((t - jumpT) / 0.6))) * 110 : 0;
  ctx.save(); ctx.globalAlpha *= 1 - kout;
  const ws = n <= 2 ? [130, 120] : [110, 130, 150, 120, 100]; const tot = ws.reduce((a, b) => a + b, 0) + (ws.length - 1) * 8; let bx = xx - tot / 2;
  ws.forEach((w, i) => { building(ctx, bx + w / 2, RBOT - jump, w, h * (0.78 + 0.22 * ((i * 7) % 3) / 2), i % 2 ? '#2A4A7A' : NAVY); bx += w + 8; });
  T(ctx, label, xx, RBOT + 52, F.semi(32), INK, 'center', 1, 32, 700);
  if (badges) { badge(ctx, xx - 50, RBOT - h - 70 - jump, badges[0], 'casa', t - badges[2]); badge(ctx, xx + 50, RBOT - h - 70 - jump, badges[1], 'rs', t - badges[2] - 0.12); }
  ctx.restore(); }
R.exemplos = (ctx, t, s) => {
  const nada = clamp((t - Wt(102) + 0.1) / 0.3);
  ctx.save(); ctx.globalAlpha *= 1 - 0.85 * nada; rulerScene(ctx, t);
  investor(ctx, 440, 2, 260, '2 imóveis · R$ 60 mil/ano', t, s.a - 0.1, Wt(89) - 0.35, Wt(87), [false, false, Wt(87) + 0.3]);
  investor(ctx, 470, 5, 300, '5 imóveis · R$ 200 mil/ano', t, Wt(89) - 0.2, Wt(98), null, [true, false, Wt(96)]);
  pop(ctx, since(t, 87, 0.3), 440, 1000, () => pill(ctx, 'Não alcança', 440, 1000, F.black(36), '#FFFFFF', GRN, 72, 30));
  pop(ctx, since(t, 96), 470, 960, () => pill(ctx, 'Também não', 470, 960, F.black(36), '#FFFFFF', GRN, 72, 30));
  ctx.restore();
  if (nada > 0) { const sk = clamp((t - Wt(102) + 0.05) / 0.12); stamp(ctx, 540, 820, lerp(2.2, 1.05, easeIn(sk)), -0.06, 'NADA', 'MUDA', GRN, clamp(sk * 3));
    pop(ctx, since(t, 106, -0.05), 540, 1100, () => { card(ctx, 160, 1020, 760, 160, 40, '#FFFFFF', 0.12); T(ctx, 'Só o Imposto de Renda,', 540, 1090, F.black(44), INK, 'center', 1, 44, 700); T(ctx, 'como sempre', 540, 1140, F.semi(34), MUTE, 'center', 1, 34, 700); }); }
  fonte(ctx, 'Exemplos ilustrativos · regra: LC 214/2025', clamp((t - s.a) * 3) * (1 - nada));
};

R.paga = (ctx, t, s) => {
  const k0 = Wt(114) - 0.12, k1 = Wt(118) + 0.3, c0 = Wt(129) - 0.12, c1 = Wt(132) - 0.06;
  if (!fullClip(t, k0, k1) && !fullClip(t, c0, c1)) pagaBase(ctx, t, s);
  if (insert(ctx, t, 'chaves', k0, k1) || (t > k0 && t < k1 + 0.12)) A_kw(ctx, t, 'Aí o dono', Wt(115), 'do imóvel paga', Wt(118));
  if (insert(ctx, t, 'calc', c0, c1) || (t > c0 && t < c1 + 0.12)) A_kw(ctx, t, 'Mas com', Wt(129), 'desconto', Wt(131));
};
function pagaBase(ctx, t, s) {
  if (t < Wt(129)) { // investidor que passa da linha
    rulerScene(ctx, t);
    const grow = clamp((t - Wt(112)) / 0.6); investor(ctx, 470, 5, lerp(380, 640, easeOut(grow)), '5 imóveis · R$ 300 mil/ano', t, s.a - 0.15, 999, null, [true, true, Wt(113)]);
    pop(ctx, since(t, 119, 0.25), 470, 450, () => stamp(ctx, 470, 450, 0.8, -0.06, 'PAGA', 'a partir de 2027', RD));
    fonte(ctx, 'Exemplo ilustrativo · regra: LC 214/2025', 1);
    return;
  }
  // desconto de 70% e redutor de R$ 600
  kw(ctx, t, 'Desconto de', Wt(131), 'SETENTA por cento', Wt(132), 99, 96);
  pop(ctx, since(t, 132, -0.1), 540, 760, () => { card(ctx, 110, 590, 860, 360, 40, '#FFFFFF', 0.12); T(ctx, 'O IMPOSTO NO SEU ALUGUEL', 150, 660, F.mono(26), MUTE, 'left', 1, 26, 700, 2);
    const k = clamp((t - Wt(134)) / 0.6); bar(ctx, 150, 700, 780, 70, 1 - 0.7 * easeOut(k), k > 0 ? GOLDA : '#9AA3B2'); T(ctx, k > 0.9 ? 'paga 30% da alíquota cheia' : 'alíquota cheia', 150, 830, F.semi(36), INK, 'left', 1, 36, 760);
    const tg = since(t, 132, 0.15); if (tg > 0) { const sc = lerp(2, 1, easeIn(clamp(tg / 0.15))); ctx.save(); ctx.translate(780, 640); ctx.rotate(0.12); ctx.scale(sc, sc); card(ctx, -110, -50, 220, 100, 24, RD, 0.25); T(ctx, '−70%', 0, 22, F.black(64), '#FFFFFF', 'center', 1, 64); ctx.restore(); } });
  pop(ctx, since(t, 141, -0.05), 540, 1150, () => { card(ctx, 110, 1010, 860, 300, 40, '#FFFFFF', 0.12); T(ctx, 'ALUGUEL RESIDENCIAL · POR MÊS', 150, 1075, F.mono(26), MUTE, 'left', 1, 26, 700, 2);
    const k = clamp((t - Wt(143)) / 0.5); ctx.fillStyle = '#E8EBF0'; ctx.beginPath(); ctx.roundRect(150, 1110, 780, 80, 20); ctx.fill(); ctx.fillStyle = NAVY; ctx.beginPath(); ctx.roundRect(150 + 230 * easeOut(k), 1110, 780 - 230 * easeOut(k), 80, 20); ctx.fill();
    if (k > 0) { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = GRN; ctx.lineWidth = 4; ctx.strokeRect(150, 1110, 220 * easeOut(k), 80); ctx.restore(); T(ctx, 'R$ 600', 260, 1164, F.black(34), GRN, 'center', clamp(k * 3), 34); }
    T(ctx, 'R$ 600 de cada aluguel ficam fora da conta', 150, 1250, F.semi(34), INK, 'left', kOn(t, 150), 34, 780); });
  fonte(ctx, 'Fonte: LC 214/2025, arts. 260 e 261 · valor corrigido pelo IPCA', kOn(t, 132));
};

R.avisos = (ctx, t) => {
  const m0 = Wt(177) - 0.12, m1 = Wt(186) + 0.35;
  if (!fullClip(t, m0, m1)) avisosBase(ctx, t);
  if (insert(ctx, t, 'mala', m0, m1) || (t > m0 && t < m1 + 0.12)) A_kw(ctx, t, 'Aluga por', Wt(184), 'temporada?', Wt(186));
};
function avisosBase(ctx, t) {
  kw(ctx, t, '', 0, 'Dois avisos', Wt(154), 99, 110);
  const second = t > Wt(177);
  // aviso 1: calendário
  ctx.save(); ctx.globalAlpha *= second ? 0.35 : 1;
  pop(ctx, since(t, 155, -0.05), 540, 760, () => { card(ctx, 110, 560, 860, 480, 40, '#FFFFFF', 0.12); chipN(ctx, 180, 630, '1');
    calendar(ctx, 360, 820, 0.85, 2026, 0); T(ctx, '→', 540, 850, F.black(90), GOLDA, 'center', 1, 90); calendar(ctx, 720, 820, 0.85, 2026, clamp((t - Wt(164)) / 0.4));
    T(ctx, 'A conta de 2027 usa o que', 540, 985, F.semi(34), INK, 'center', kOn(t, 165), 34, 800); T(ctx, 'você recebeu em 2026', 540, 1025, F.black(36), RD, 'center', kOn(t, 171), 36, 800); });
  ctx.restore();
  // aviso 2: temporada (depois do vídeo da mala)
  if (second) pop(ctx, since(t, 186, 0.35), 540, 1250, () => { card(ctx, 110, 1080, 860, 380, 40, '#FFFFFF', 0.14); chipN(ctx, 180, 1150, '2');
    suitcase(ctx, 330, 1290, 0.85); T(ctx, 'até 90 dias', 330, 1430, F.black(32), NAVY, 'center', kOn(t, 187), 32);
    const nv = clamp((t - Wt(191)) / 0.35); [['−70%', 640, 1180], ['R$ 600', 820, 1180]].forEach(([s, x, y]) => { card(ctx, x - 80, y - 40, 160, 80, 20, '#F1F2F4', 0.05); T(ctx, s, x, y + 14, F.black(36), MUTE, 'center', 1, 36); if (nv > 0) { ctx.strokeStyle = RD; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(x - 80, y); ctx.lineTo(x - 80 + 160 * nv, y); ctx.stroke(); } });
    T(ctx, 'descontos não valem', 730, 1270, F.semi(32), RD, 'center', nv, 32);
    pop(ctx, since(t, 198, -0.1), 730, 1360, () => { bell(ctx, 640, 1370, 0.42); T(ctx, 'regra de hotel', 770, 1384, F.black(36), NAVY, 'center', 1, 36); }); });
  fonte(ctx, 'Fonte: LC 214/2025 (critério do ano anterior; locação até 90 dias = regras de hotelaria)', kOn(t, 156));
};
function chipN(ctx, x, y, n) { ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(x, y, 34, 0, 6.283); ctx.fill(); T(ctx, n, x, y + 14, F.black(40), '#E2C27F', 'center', 1, 40); }

R.cta = (ctx, t, s) => {
  const endT = WE(215) + 0.25, out = clamp((t - endT) / 0.35);
  ctx.save(); ctx.globalAlpha *= 1 - out;
  kw(ctx, t, 'Quer saber se você', Wt(199), 'passa na régua?', Wt(203), 99, 104);
  const c = clamp((t - Wt(199) - 0.25) / 0.4);
  fx(ctx, c, 0, () => { const y0 = 700; card(ctx, 90, y0, 900, 560, 44, '#FFFFFF', 0.14); T(ctx, 'Comentários', 540, y0 + 70, F.semi(32), INK, 'center', 1, 32); ctx.fillStyle = LINE; ctx.fillRect(90, y0 + 104, 900, 2);
    const posted = t > Wt(208); if (posted) pop(ctx, since(t, 208), 300, y0 + 200, () => { ctx.beginPath(); ctx.arc(180, y0 + 190, 40, 0, 6.283); ctx.fillStyle = '#2A4A7A'; ctx.fill(); T(ctx, 'você', 240, y0 + 175, F.semi(28), MUTE, 'left', 1, 28); T(ctx, 'RÉGUA', 240, y0 + 230, F.black(56), INK, 'left', 1, 56); });
    ctx.fillStyle = '#F2F3F5'; ctx.beginPath(); ctx.roundRect(130, y0 + 410, 700, 100, 50); ctx.fill();
    if (!posted) { const n = Math.floor(clamp((t - Wt(206)) / (WE(207) - Wt(206))) * 5); T(ctx, 'RÉGUA'.slice(0, n), 170, y0 + 480, F.black(50), INK, 'left', 1, 50); if (Math.floor(t * 4) % 2 === 0) { ctx.fillStyle = GOLDA; ctx.fillRect(170 + tw(ctx, 'RÉGUA'.slice(0, n), F.black(50)) + 4, y0 + 438, 4, 54); } }
    else T(ctx, 'Adicione um comentário…', 170, y0 + 475, F.med(32), '#A0A4AB', 'left', 1, 32);
    ctx.fillStyle = GOLDA; ctx.beginPath(); ctx.arc(900, y0 + 460, 50, 0, 6.283); ctx.fill(); ctx.save(); ctx.translate(900, y0 + 460); ctx.beginPath(); ctx.moveTo(-18, -16); ctx.lineTo(22, 0); ctx.lineTo(-18, 16); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore(); });
  const dm = clamp((t - Wt(213)) / 0.35); fx(ctx, dm, 0, () => { card(ctx, 140, 1300, 800, 130, 34, NAVY, 0.25); ctx.beginPath(); ctx.arc(215, 1365, 38, 0, 6.283); ctx.fillStyle = '#E2C27F'; ctx.fill(); T(ctx, '✓', 215, 1380, F.black(40), NAVY, 'center', 1, 40); T(ctx, 'Sua conta chega no direct', 280, 1358, F.semi(34), '#FFFFFF', 'left', 1, 34, 640); T(ctx, '@vistabroker.perioto', 280, 1402, F.med(26), '#E2C27F', 'left', 1, 26); }, -40);
  ctx.restore();
  // cartão final
  if (out > 0) pop(ctx, t - endT - 0.1, 540, 900, () => { T(ctx, 'Comenta', 540, 560, F.black(100), INK, 'center', 1, 100); pill(ctx, 'RÉGUA', 540, 690, F.black(84), '#FFFFFF', NAVY, 140, 60);
    T(ctx, 'que eu faço a sua conta', 540, 840, F.semi(46), MUTE, 'center', 1, 46); ctx.fillStyle = LINE; ctx.fillRect(240, 910, 600, 2);
    T(ctx, 'Pedro Perioto', 540, 1010, F.black(76), INK, 'center', 1, 76); T(ctx, 'Corretor de imóveis · CRECI 258729', 540, 1068, F.med(32), MUTE, 'center', 1, 32);
    pill(ctx, '@vistabroker.perioto', 540, 1160, F.semi(38), GOLDA, '#FFFFFF', 76, 36); if (IMG.vista) ctx.drawImage(IMG.vista, 405, 1240, 270, 140);
    T(ctx, 'Conteúdo informativo · consulte seu contador', 540, 1450, F.mono(22), MUTE, 'center', 1, 22); });
};

// ---------- transições ----------
// a cena já entra com o 1º elemento visível (adianta até 0,3 s depois da 1ª palavra durante a transição)
function drawScene(ctx, sc, t) { CLIPON_SC = 0; const tt = sc.i > 0 ? Math.max(t, Wt(sc.i) + 0.3) : t; R[sc.n](ctx, Math.min(tt, sc.b + 0.4), sc); }
let CLIPON_SC = 0;
function transition(ctx, prev, next, t) {
  const type = TRANS[next.n], a = next.a, d = { flash: 0.16, mask: 0.4, push: 0.32, whip: 0.3, zoom: 0.35, slide: 0.32, fade: 0.25, glitch: 0.24, zoomout: 0.36 }[type], k = clamp((t - (a - d / 2)) / d);
  if (k <= 0) { drawScene(ctx, prev, t); return; } if (k >= 1) { drawScene(ctx, next, t); return; }
  const e = easeInOut(k);
  const layer = (sc, fn) => { ctx.save(); fn(); drawScene(ctx, sc, t); ctx.restore(); };
  if (type === 'flash') { drawScene(ctx, k < 0.5 ? prev : next, t); ctx.fillStyle = `rgba(255,255,255,${0.9 * (1 - Math.abs(k - 0.5) * 2)})`; ctx.fillRect(0, 0, W, H); }
  else if (type === 'mask') { drawScene(ctx, prev, t); ctx.save(); ctx.beginPath(); ctx.arc(840, 820, 30 + 2300 * easeIn(k), 0, 6.283); ctx.clip(); sceneBg(ctx, 0); drawScene(ctx, next, t); ctx.restore(); }
  else if (type === 'push') { layer(prev, () => ctx.translate(0, -H * e)); layer(next, () => ctx.translate(0, H * (1 - e))); }
  else if (type === 'whip' || type === 'slide') { const b = type === 'whip' ? (1 - Math.abs(k - 0.5) * 2) * 26 : 0;
    layer(prev, () => { ctx.translate(-W * e, 0); if (b > 1) ctx.filter = `blur(${b.toFixed(1)}px)`; }); layer(next, () => { ctx.translate(W * (1 - e), 0); if (b > 1) ctx.filter = `blur(${b.toFixed(1)}px)`; }); }
  else if (type === 'zoom') { if (k < 0.5) layer(prev, () => { const s = 1 + 4 * easeIn(k * 2); ctx.translate(470, 900); ctx.scale(s, s); ctx.translate(-470, -900); ctx.globalAlpha = 1 - easeIn(k * 2) * 0.6; ctx.filter = `blur(${(k * 30).toFixed(1)}px)`; });
    else layer(next, () => { const s = lerp(0.7, 1, easeOut((k - 0.5) * 2)); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-540, -960); ctx.globalAlpha = (k - 0.5) * 2; }); }
  else if (type === 'fade') { drawScene(ctx, prev, t); ctx.save(); ctx.globalAlpha = e; sceneBg(ctx, 0); drawScene(ctx, next, t); ctx.restore(); }
  else if (type === 'glitch') { const src = document.createElement('canvas'); src.width = W; src.height = H; const g = src.getContext('2d'); sceneBg(g, 0); R[(k < 0.5 ? prev : next).n](g, t, k < 0.5 ? prev : next);
    const rr = rng(Math.floor(t * 60)); ctx.drawImage(src, 0, 0); for (let i = 0; i < 9; i++) { const y = rr() * H, h = 30 + rr() * 140, dx = (rr() - 0.5) * 180; ctx.drawImage(src, 0, y, W, h, dx, y, W, h); }
    ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = 0.35; ctx.fillStyle = '#FF2D55'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  else if (type === 'zoomout') { if (k < 0.5) layer(prev, () => { const s = lerp(1, 0.6, easeIn(k * 2)); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-540, -960); ctx.globalAlpha = 1 - k * 2; });
    else layer(next, () => { const s = lerp(1.25, 1, easeOut((k - 0.5) * 2)); ctx.translate(540, 960); ctx.scale(s, s); ctx.translate(-540, -960); ctx.globalAlpha = (k - 0.5) * 2; }); }
}

// "soco" de zoom nas palavras em MAIÚSCULAS e em momentos-chave
const PUNCH = [5, 13, 20, 23, 26, 41, 56, 58, 80, 88, 102, 119, 132, 143, 154, 198, 207].map(i => [Wt(i), /^[A-ZÃÉÍÓÚ]{2,}$/.test(TXT[i].replace(/[.?!:,]/g, '')) ? 0.05 : 0.03]);
function punchAt(t) { let z = 0; PUNCH.forEach(([a, s]) => { const k = t - a + 0.02; if (k > 0 && k < 0.8) z += s * (k < 0.06 ? k / 0.06 : Math.exp(-(k - 0.06) / 0.22)); }); return z; }
const SHAKE = [[Wt(13) + 0.12, 16], [Wt(20) - 0.02, 10], [Wt(80) - 0.02, 10], [Wt(102) - 0.02, 10], [Wt(119) + 0.25, 10]];

function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; CLIPON = 0;
  sceneBg(ctx, 0);
  let sx = 0, sy = 0; SHAKE.forEach(([a, m]) => { const k = t - a; if (k > 0 && k < 0.25) { const f = (1 - k / 0.25) * m; sx += Math.sin(t * 90) * f; sy += Math.cos(t * 77) * f; } });
  const z = 1 + punchAt(t); ctx.save(); ctx.translate(540 + sx, 960 + sy); ctx.scale(z, z); ctx.translate(-540, -960);
  let i = SC.findIndex(s => t >= s.a && t < s.b); if (i < 0) i = SC.length - 1;
  const cur = SC[i], nxt = SC[i + 1], prv = SC[i - 1];
  if (nxt && t > nxt.a - 0.3) transition(ctx, cur, nxt, t); else if (prv && t < cur.a + 0.3) transition(ctx, prv, cur, t); else drawScene(ctx, cur, t);
  ctx.restore();
  captions(ctx, t);
  const fin = 1 - clamp(t / 0.12), fout = clamp((t - (DUR - 0.4)) / 0.4); if (fin + fout > 0) { ctx.fillStyle = `rgba(245,245,247,${Math.max(fin, fout)})`; ctx.fillRect(0, 0, W, H); }
}
