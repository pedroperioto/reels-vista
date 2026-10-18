// Cenas de venda do v6 (aluguel × imóvel, estoque, conta, parcela) — portadas num escopo isolado
// para não colidir com os utilitários do motor novo. Recebem (ctx, u, d, t, wt) na linha do tempo ORIGINAL do v6.
const OLD6 = (() => {
const RATE = 2.8, WD = 1 / RATE, PAUSE = 0.25;
function wtimes(lead, text) { const ws = text.split(' '), o = []; let t = lead; ws.forEach((w, i) => { o.push(t); t += WD; if (/[.?!]$/.test(w) && i < ws.length - 1) t += PAUSE; }); return o; }
const PLAN = {
  virada: [4.6, 0.6, 'Mas e o preço do imóvel depois da eleição?'],
  corrida: [5.0, 0.45, 'E o aluguel subiu mais rápido que o próprio imóvel.'],
  estoque: [11.0, 0.45, 'No médio e alto padrão, as vendas caíram dezoito por cento. Tem tanto imóvel parado que levaria treze meses pra vender tudo. Quem compra agora, negocia.'],
  conta: [8.1, 0.45, 'Num apê de oitocentos mil no Tatuapé, são seiscentos e oitenta e cinco mil de aluguel em dez anos.'],
  parcela: [8.9, 0.45, 'Financiando, a parcela cai. No oitavo ano, já fica menor que o aluguel. E no fim, o patrimônio é seu.'],
};
const NV = C.navy, SL = '#64718A', INK = '#081630';
F.it = (s) => `${s}px Instr`; F.mono = (s) => `${s}px Mono`;

// ---------- utilidades
const SPR = (x, f = 1.8, z = 0.45) => { if (x <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * om * x) * (Math.cos(wd * x) + z * om / wd * Math.sin(wd * x)); };
const expo = (k) => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
function dot(ctx, x, y, r, col = C.gold) { if (r <= 0.3) return; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function gdot(ctx, x, y, r) { if (r <= 0.3) return; const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, '#F3DDA8'); g.addColorStop(0.6, C.gold); g.addColorStop(1, '#A8864B'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); }
function path(u, x, y, segs) {
  for (const [t0, du, x1, y1, h = 0] of segs) { if (u < t0) break; const k = easeInOut(prog(u, t0, t0 + du));
    if (k < 1) return { x: lerp(x, x1, k), y: lerp(y, y1, k) - h * Math.sin(Math.PI * k), k }; x = x1; y = y1; }
  return { x, y, k: 1 };
}
function goldGrad(ctx, y, size) { const g = ctx.createLinearGradient(0, y - size * 0.85, 0, y + size * 0.1); g.addColorStop(0, '#F1D9A0'); g.addColorStop(0.55, C.gold); g.addColorStop(1, '#A9874C'); return g; }
// palavra a palavra, saindo do desfoque (estilo keynote)
function aw(ctx, s, x, y, font, col, u, t0, size, align = 'center', stag = WD, maxW = 0) {
  ctx.save(); ctx.font = font; const ws = s.split(' '), sp = ctx.measureText(' ').width, wid = ws.map(q => ctx.measureText(q).width), tot = wid.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const mw = maxW || (y > 980 ? 820 : 920); if (tot > mw) { const f = mw / tot; ctx.translate(x, y); ctx.scale(f, f); ctx.translate(-x, -y); }
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x; const fill = col === 'gold' ? goldGrad(ctx, y, size) : col;
  ws.forEach((q, i) => { const k = clamp((u - t0 - i * stag) / 0.5); if (k > 0) { const e = expo(k); ctx.save(); ctx.globalAlpha *= clamp(k * 2.2);
      const b = (1 - e) * 14; if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`; ctx.fillStyle = fill; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(q, cx, y + (1 - e) * size * 0.3); ctx.restore(); }
    cx += wid[i] + sp; });
  ctx.restore(); return tot;
}
function T(ctx, s, x, y, font, col, align = 'center', a = 1, trk = 0, size = 60, maxW = 940) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = font;
  const mw0 = ctx.measureText(s).width + (trk ? trk * s.length : 0); if (mw0 > maxW) { const f = maxW / mw0; ctx.translate(x, y); ctx.scale(f, f); ctx.translate(-x, -y); } ctx.fillStyle = col === 'gold' ? goldGrad(ctx, y, size) : col; ctx.textAlign = align; if (trk) { try { ctx.letterSpacing = trk + 'px'; } catch (e) { } } ctx.fillText(s, x, y); ctx.restore(); }
function blurIn(ctx, k, fn) { if (k <= 0) return; const e = expo(clamp(k)); ctx.save(); ctx.globalAlpha *= clamp(k * 2); const b = (1 - e) * 14; if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`; fn(e); ctx.restore(); }
function stroke(ctx, col, lw) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); }
function tw(ctx, s, font) { ctx.save(); ctx.font = font; const m = ctx.measureText(s).width; ctx.restore(); return m; }
function bgDark(ctx, t, hi = '#17355F') { ctx.fillStyle = INK; ctx.fillRect(-50, -50, W + 100, H + 100);
  const g = ctx.createRadialGradient(540 + Math.sin(t * 0.3) * 120, 620, 40, 540, 760, 1250); g.addColorStop(0, hi); g.addColorStop(1, 'rgba(8,22,48,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function bgLight(ctx) { ctx.fillStyle = C.cream; ctx.fillRect(-50, -50, W + 100, H + 100); const g = ctx.createRadialGradient(540, 700, 40, 540, 800, 1200); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, 'rgba(245,242,236,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function bgGold(ctx) { ctx.fillStyle = C.gold; ctx.fillRect(-50, -50, W + 100, H + 100); const g = ctx.createRadialGradient(540, 650, 40, 540, 760, 1200); g.addColorStop(0, '#E9CF96'); g.addColorStop(1, 'rgba(201,168,106,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function card(ctx, x, y, w, h, r, fill, sh = 0.35) { ctx.save(); ctx.shadowColor = `rgba(0,0,0,${sh})`; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.restore(); }
let pillB = function (ctx, s, x, y, font, fg, bgc, a = 1, h = 76) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = font; const w = ctx.measureText(s).width; ctx.beginPath(); ctx.roundRect(x - w / 2 - 40, y - h / 2, w + 80, h, h / 2); ctx.fillStyle = bgc; ctx.fill(); ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 3); ctx.restore(); }
function flatPin(ctx, x, y, s, col = C.gold, hole = NV) { if (s <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-14, -26, -46, -52, -46, -86); ctx.arc(0, -86, 46, Math.PI, 0); ctx.bezierCurveTo(46, -52, 14, -26, 0, 0);
  ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.arc(0, -86, 17, 0, 6.283); ctx.fillStyle = hole; ctx.fill(); ctx.restore(); }
function cursor(ctx, x, y, s, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 62); ctx.lineTo(16, 47); ctx.lineTo(28, 72); ctx.lineTo(40, 66); ctx.lineTo(28, 42); ctx.lineTo(48, 42); ctx.closePath();
  ctx.fillStyle = C.cream; ctx.fill(); ctx.strokeStyle = NV; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
function ring(ctx, x, y, u, col = C.gold, max = 160) { if (u <= 0 || u > 0.7) return; const k = u / 0.7; ctx.save(); ctx.globalAlpha *= 1 - k; ctx.beginPath(); ctx.arc(x, y, 20 + max * expo(k), 0, 6.283); stroke(ctx, col, 6 * (1 - k) + 1); ctx.restore(); }
// forma que muda: círculo → quadrado → casa
const HOUSE = [[-0.82, 0.86], [0.82, 0.86], [0.82, -0.12], [0, -0.96], [-0.82, -0.12]];
function rayPoly(a, poly) { const dx = Math.cos(a), dy = Math.sin(a); let best = 9;
  for (let i = 0; i < poly.length; i++) { const [x1, y1] = poly[i], [x2, y2] = poly[(i + 1) % poly.length], ex = x2 - x1, ey = y2 - y1, den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue; const s = (x1 * ey - y1 * ex) / den, r = (x1 * dy - y1 * dx) / den; if (s > 0 && r >= 0 && r <= 1) best = Math.min(best, s); } return best; }
function morph(ctx, cx, cy, R, m1, m2, rot, col) { if (R <= 0.5) return; ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.beginPath();
  for (let i = 0; i <= 96; i++) { const a = i / 96 * 6.2832, c = Math.cos(a), s = Math.sin(a), sq = Math.min(0.9 / Math.max(Math.abs(c), Math.abs(s)), 1.0);
    let r = lerp(1, sq, m1); r = lerp(r, rayPoly(a - rot, HOUSE), m2); const x = c * r * R, y = s * r * R; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
// gancho
const TG = { x: 540, y: 870, l: 355, r: 725, kr: 58 };
function toggle(ctx, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.beginPath(); ctx.roundRect(TG.x - 260, TG.y - 75, 520, 150, 75);
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fill(); ctx.strokeStyle = 'rgba(245,242,236,0.3)'; ctx.lineWidth = 4; ctx.stroke(); ctx.restore(); }
const HOOK_LINE = 'no seu bolso não muda', HOOK_Y = 1160, HOOK_FONT = F.it(110);
const hookDot = (ctx) => ({ x: 540 + Math.min(820, tw(ctx, HOOK_LINE, HOOK_FONT)) / 2 + 18, y: HOOK_Y - 12 });
const CONTA_LINE = 'Dinheiro que não volta', CONTA_Y = 1395, CONTA_FONT = F.black(70);
const contaDot = (ctx) => ({ x: 540 + Math.min(820, tw(ctx, CONTA_LINE, CONTA_FONT)) / 2 + 16, y: CONTA_Y - 10 });
// simulação (igual às versões anteriores)
const SIM = (() => { const Fi = 640000, n = 360, i = Math.pow(1.1149, 1 / 12) - 1, am = Fi / n; const parc = [], alug = [];
  for (let y = 0; y < 10; y++) { const saldo = Fi - am * y * 12; parc.push(am + saldo * i); alug.push(4287 * Math.pow(1.0622, y)); } return { parc, alug }; })();
const CH = { x0: 130, x1: 890, y0: 1190, y1: 770, vmin: 3500, vmax: 8000 };
const CX = (i) => CH.x0 + (CH.x1 - CH.x0) * i / 9, CY = (v) => CH.y0 - (CH.y0 - CH.y1) * (v - CH.vmin) / (CH.vmax - CH.vmin);
const CROSS = (() => { let ci = 0; while (ci < 8 && !(SIM.parc[ci] > SIM.alug[ci] && SIM.parc[ci + 1] <= SIM.alug[ci + 1])) ci++;
  const d0 = SIM.parc[ci] - SIM.alug[ci], d1 = SIM.parc[ci + 1] - SIM.alug[ci + 1], fc = d0 / (d0 - d1);
  return { ci, fc, x: lerp(CX(ci), CX(ci + 1), fc), y: CY(lerp(SIM.alug[ci], SIM.alug[ci + 1], fc)) }; })();
const RENT = [...Array(10)].map((_, i) => 4287 * 12 * Math.pow(1.0622, i));
// ícone de prédio (estoque)
function bldg(ctx, x, y, w, h, col, win, sold) { ctx.save(); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, [14, 14, 4, 4]); ctx.fill();
  ctx.fillStyle = win; for (let r = 0; r < Math.floor((h - 30) / 30); r++) for (let c = 0; c < 3; c++) { ctx.beginPath(); ctx.roundRect(x - w / 2 + 12 + c * (w - 24) / 3, y - h + 18 + r * 30, (w - 24) / 3 - 8, 16, 3); ctx.fill(); }
  if (sold > 0) { ctx.globalAlpha = clamp(sold * 2); ctx.fillStyle = 'rgba(245,242,236,0.75)'; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, [14, 14, 4, 4]); ctx.fill();
    const s = lerp(1.6, 1, expo(clamp(sold))); ctx.translate(x, y - h / 2); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-18, 2); ctx.lineTo(-4, 16); ctx.lineTo(20, -14); stroke(ctx, C.gold, 9); }
  ctx.restore(); }
// torre isométrica (mapa)
function tower(ctx, x, y, w, h, k, hi = false) { if (k <= 0) return; const hh = h * k, d = w * 0.45;
  ctx.save(); ctx.fillStyle = hi ? '#2C4C82' : '#1D3864'; ctx.fillRect(x - w / 2, y - hh, w, hh);
  ctx.fillStyle = hi ? '#1F3A68' : '#152B4F'; ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w / 2 + d, y - d * 0.5); ctx.lineTo(x + w / 2 + d, y - hh - d * 0.5); ctx.lineTo(x + w / 2, y - hh); ctx.closePath(); ctx.fill();
  ctx.fillStyle = hi ? '#4C6EA6' : '#2B4A7C'; ctx.beginPath(); ctx.moveTo(x - w / 2, y - hh); ctx.lineTo(x + w / 2, y - hh); ctx.lineTo(x + w / 2 + d, y - hh - d * 0.5); ctx.lineTo(x - w / 2 + d, y - hh - d * 0.5); ctx.closePath(); ctx.fill();
  ctx.fillStyle = hi ? 'rgba(242,214,150,0.9)' : 'rgba(226,199,143,0.55)'; for (let r = 0; r < Math.floor(hh / 16) - 1; r++) for (let c = 0; c < 2; c++) ctx.fillRect(x - w / 2 + 7 + c * (w / 2), y - hh + 10 + r * 16, w / 2 - 12, 6);
  ctx.restore(); }
// mapa do Eixo Platina (coordenadas ilustrativas)
const MAP = { x0: 60, x1: 1020, yL: (x) => 790 - 40 * (x - 60) / 960 };
const ST_X = { 'Belém': 170, 'Tatuapé': 400, 'Carrão': 790 };
const EIXO_PIN = { x: 560, y: 905 };
const TW = [[455, 80], [515, 110], [600, 200], [675, 125], [740, 95]];
const twBase = (x) => MAP.yL(x) + 128, TALL = { x: 600, top: twBase(600) - 200 };

// ---------- cenas
// etiqueta editorial (substitui o balão arredondado do v6)
pillB = function (ctx, s, x, y, font, fg, bgc, a = 1, h = 76) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = font; const w = ctx.measureText(s).width, x0 = x - (w + 22) / 2;
  const col = /^#f|cream|rgba\(2[45]/i.test(String(fg)) && bgc ? bgc : fg; ctx.fillStyle = C.gold; ctx.fillRect(x0, y - h * 0.26, 6, h * 0.52); ctx.fillStyle = bgc === NV ? NV : col; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(s, x0 + 22, y + 3); ctx.restore(); };
const SC = {
  virada(ctx, u, d, t, wt) {
    bgGold(ctx);
    const cx = 540, cy = 590;
    const R = lerp(22, 165, SPR(u, 1.4, 0.55)), m1 = easeInOut(prog(u, 0.45, 0.95)), rot = Math.PI / 2 * easeInOut(prog(u, 0.45, 1.15)), m2 = easeInOut(prog(u, 1.2, 1.7));
    const p = path(u, 540, 960, [[0.0, 0.5, cx, cy, 0]]);
    ctx.save(); ctx.shadowColor = 'rgba(80,55,20,0.35)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20; morph(ctx, p.x, p.y, R, m1, m2, m2 > 0 ? 0 : rot, NV); ctx.restore();
    const kd = SPR(u - wt[5], 2, 0.5); if (kd > 0 && m2 > 0.95) { const dh = 78 * clamp(kd); ctx.fillStyle = C.gold; ctx.beginPath(); ctx.roundRect(cx - 30, cy + R * 0.86 - dh, 60, dh, [30, 30, 0, 0]); ctx.fill(); }
    aw(ctx, 'Mas e o', 540, 940, F.it(110), NV, u, wt[0], 110);
    aw(ctx, 'PREÇO', 540, 1085, F.black(150), NV, u, wt[3] - 0.08, 150);
    aw(ctx, 'DO IMÓVEL', 540, 1220, F.black(150), NV, u, wt[4] - 0.08, 150);
    aw(ctx, 'depois da eleição?', 540, 1340, F.it(104), NV, u, wt[6], 104);
  },
  corrida(ctx, u, d, t, wt) {
    bgDark(ctx, t);
    T(ctx, 'FIPEZAP · 12 MESES ATÉ SET/2026 · BRASIL', 540, 380, F.mono(24), C.gold, 'center', easeOut(prog(u, 0.1, 0.4)), 2);
    aw(ctx, 'Aluguel', 540, 530, F.black(150), 'gold', u, wt[2] - 0.15, 150);
    aw(ctx, 'vs. imóvel', 540, 640, F.it(110), C.cream, u, wt[9] - 0.4, 110);
    const gI = easeOut(prog(u, 1.0, 2.8)), gA = easeIn(prog(u, 1.0, 2.8)) * 0.55 + easeOut(prog(u, 1.6, 3.2)) * 0.45, xs = (v) => 110 + v / 10 * 790;
    [['Preço do imóvel', 5.51, C.cream, 870, gI], ['Aluguel', 9.13, C.gold, 1110, gA]].forEach(([n, v, col, y, g]) => {
      T(ctx, n, 110, y - 84, F.semi(42), col, 'left', easeOut(prog(u, 0.7, 1.0)));
      ctx.beginPath(); ctx.moveTo(110, y); ctx.lineTo(900, y); stroke(ctx, 'rgba(245,242,236,0.12)', 12);
      const x = xs(v * g); if (g > 0) { ctx.beginPath(); ctx.moveTo(110, y); ctx.lineTo(x, y); stroke(ctx, col, 18); }
      if (col === C.gold) gdot(ctx, x, y, 28 * easeOut(prog(u, 0.7, 1.05))); else dot(ctx, x, y, 28 * easeOut(prog(u, 0.7, 1.05)), col);
      if (g > 0.02) T(ctx, '+' + (v * g).toFixed(2).replace('.', ',') + '%', Math.min(x, 820), y - 52, F.black(56), col, 'center'); });
    ring(ctx, xs(9.13), 1110, u - 3.2, C.gold, 140);
    if (u > 3.4) aw(ctx, 'O aluguel sobe mais rápido.', 540, 1330, F.black(66), C.cream, u, 3.4, 66, 'center', 0.07);
  },
  estoque(ctx, u, d, t, wt) {
    bgLight(ctx);
    // A) vendas: 100 → 82
    const outA = easeInOut(prog(u, 4.35, 4.75));
    ctx.save(); ctx.globalAlpha *= 1 - outA; ctx.translate(0, -outA * 60);
    aw(ctx, 'Médio e alto padrão em SP', 540, 400, F.black(66), NV, u, wt[0], 66);
    aw(ctx, 'vendas em 12 meses', 540, 490, F.it(92), NV, u, wt[5], 92);
    const t18 = wt[8] - 0.1, base = 1030, k1 = SPR(u - 0.9, 1.4, 0.55), k2 = SPR(u - 1.05, 1.4, 0.55), dropK = SPR(u - t18, 1.3, 0.5);
    const h1 = 420 * k1, h2 = 420 * k2 * lerp(1, 0.82, dropK);
    ctx.save(); ctx.shadowColor = 'rgba(11,31,58,0.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    ctx.fillStyle = 'rgba(11,31,58,0.28)'; ctx.beginPath(); ctx.roundRect(250, base - h1, 210, h1, [24, 24, 0, 0]); ctx.fill();
    ctx.fillStyle = NV; ctx.beginPath(); ctx.roundRect(620, base - h2, 210, h2, [24, 24, 0, 0]); ctx.fill(); ctx.restore();
    if (dropK > 0) { ctx.save(); ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(620, base - 420); ctx.lineTo(830, base - 420); stroke(ctx, 'rgba(11,31,58,0.4)', 3); ctx.restore(); }
    T(ctx, '12 MESES ANTES', 355, base + 46, F.mono(24), SL, 'center', clamp(k1 * 2), 2); T(ctx, 'ÚLTIMOS 12 MESES', 725, base + 46, F.mono(24), NV, 'center', clamp(k2 * 2), 2);
    T(ctx, '100', 355, base - h1 + 70, F.black(54), C.cream, 'center', clamp(k1 * 2)); T(ctx, String(Math.round(lerp(100, 82, clamp(dropK)))), 725, base - h2 + 70, F.black(54), C.cream, 'center', clamp(k2 * 2));
    if (u > t18 + 0.2) blurIn(ctx, prog(u, t18 + 0.2, t18 + 0.7), () => { T(ctx, '−18%', 540, 1225, F.black(190), 'gold', 'center', 1, 0, 190); });
    T(ctx, 'a cada 100 vendas, agora são 82', 540, 1310, F.it(52), NV, 'center', easeOut(prog(u, t18 + 0.6, t18 + 0.9)));
    ctx.restore();
    // B) estoque: 13 prédios = 13 meses pra vender tudo
    const tb = 4.55, inB = easeOut(prog(u, tb, tb + 0.4)), outB = easeInOut(prog(u, 8.45, 8.8));
    if (u > tb) { ctx.save(); ctx.globalAlpha *= inB * (1 - outB * 0.85);
      aw(ctx, 'Imóveis parados à venda', 540, 400, F.black(70), NV, u, wt[11] - 0.4, 70);
      const cnt0 = wt[15] - 0.85, cnt1 = wt[17] + 0.1, n = clamp(Math.floor((u - cnt0) / ((cnt1 - cnt0) / 13)) + 1, 0, 13);
      for (let i = 0; i < 13; i++) { const row = i < 7 ? 0 : 1, col = row ? i - 7 : i, x = (row ? 205 : 150) + col * 128, y = row ? 860 : 680, k = SPR(u - (tb + 0.1 + i * 0.04), 2, 0.5);
        if (k <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.scale(1, clamp(k, 0, 1.2)); bldg(ctx, 0, 0, 96, 150 + ((i * 37) % 50), NV, 'rgba(226,199,143,0.8)', u > cnt0 && i < n ? prog(u, cnt0 + i * (cnt1 - cnt0) / 13, cnt0 + i * (cnt1 - cnt0) / 13 + 0.25) : 0); ctx.restore(); }
      if (u > cnt0) { T(ctx, String(Math.max(1, n)), 400, 1090, F.black(200), 'gold', 'right', 1, 0, 200); T(ctx, n === 1 ? 'mês' : 'meses', 420, 1090, F.black(90), NV, 'left'); }
      blurIn(ctx, prog(u, wt[18], wt[18] + 0.5), () => T(ctx, 'pra vender tudo que já está à venda', 540, 1175, F.it(54), NV, 'center'));
      T(ctx, 'no ritmo atual de vendas', 540, 1230, F.mono(24), SL, 'center', easeOut(prog(u, wt[20], wt[20] + 0.3)), 2);
      ctx.restore(); }
    // C) quem compra agora, negocia
    if (u > wt[22] - 0.1) { aw(ctx, 'Quem compra agora,', 540, 1320, F.black(76), NV, u, wt[22], 76);
      aw(ctx, 'negocia.', 540, 1418, F.it(116), NV, u, wt[25] - 0.05, 116);
      const uw = tw(ctx, 'negocia.', F.it(116)) / 2 + 10, ku = easeInOut(prog(u, wt[25] + 0.35, wt[25] + 0.8));
      if (ku > 0) { ctx.beginPath(); ctx.moveTo(540 - uw, 1440); ctx.lineTo(540 - uw + 2 * uw * ku, 1440); stroke(ctx, C.gold, 8); } }
    // ponto: empurra a barra "agora" para baixo, depois pula de prédio em prédio
    let p;
    const top2 = 1030 - 420 * lerp(1, 0.82, clamp(SPR(u - t18, 1.3, 0.5))) - 40;
    if (u < 1.2) p = path(u, 110 + 9.13 / 10 * 790, 1110, [[0.0, 0.9, 725, 1030 - 420 - 40, 180]]);
    else if (u < 4.4) p = { x: 725, y: u < 1.5 ? lerp(1030 - 420 - 40, top2, 0) : top2 };
    else { const cnt0 = wt[15] - 0.85, cnt1 = wt[17] + 0.1, step = (cnt1 - cnt0) / 13, bx = (i) => i < 7 ? 150 + i * 128 : 205 + (i - 7) * 128, by = (i) => (i < 7 ? 680 : 860) - 150 - ((i * 37) % 50) - 40;
      if (u < cnt0) p = path(u, 725, top2, [[4.4, 0.6, bx(0), by(0), 160]]);
      else { const f = (u - cnt0) / step, i = clamp(Math.floor(f), 0, 12), fr = clamp(f - i), j = Math.min(12, i + 1);
        p = f < 12 ? { x: lerp(bx(i), bx(j), easeInOut(fr)), y: lerp(by(i), by(j), fr) - 50 * Math.sin(Math.PI * fr) } : { x: bx(12), y: by(12) };
        if (u > wt[25] + 0.1) { const uw = tw(ctx, 'negocia.', F.it(116)) / 2 + 10; p = path(u, bx(12), by(12), [[wt[25] + 0.1, 0.25, 540 - uw, 1440, 120], [wt[25] + 0.35, 0.45, 540 + uw, 1440, 0]]); } } }
    gdot(ctx, p.x, p.y, 22);
  },
  conta(ctx, u, d, t, wt) {
    bgDark(ctx, t, '#13294D');
    const kc = SPR(u - 0.1, 1.4, 0.6), gone = easeInOut(prog(u, 6.25, 6.85));
    ctx.save(); ctx.translate(0, (1 - kc) * 220); ctx.globalAlpha *= clamp(kc * 3) * (1 - 0.6 * gone);
    card(ctx, 80, 320, 920, 360, 34, 'rgba(255,255,255,0.07)', 0.4);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(80, 320, 920, 360, 34); ctx.stroke();
    T(ctx, 'SIMULAÇÃO · ALUGUEL', 130, 385, F.mono(26), C.gold, 'left', 1, 3);
    [['Apê no Tatuapé', 'R$ 800 mil', wt[3]], ['Aluguel inicial', 'R$ 4.287/mês', wt[6]], ['Reajuste ao ano', '6,22%', wt[7] + 0.3]].forEach(([a, b, tr], i) => {
      const y = 475 + i * 82; ctx.fillStyle = 'rgba(245,242,236,0.08)'; ctx.fillRect(130, y - 54, 820, 2);
      blurIn(ctx, prog(u, tr - 0.15, tr + 0.35), (e) => { T(ctx, a, 130, y, F.semi(38), 'rgba(245,242,236,0.7)', 'left'); T(ctx, b, 950 + (1 - e) * 30, y, F.black(46), C.cream, 'right'); }); });
    ctx.restore();
    const tr = wt[8] - 0.1, base = 1290, cx = (i) => 150 + i * 81; let cum = 0;
    RENT.forEach((r, i) => { const k = SPR(u - (tr + i * 0.22), 1.8, 0.5); if (k <= 0) return; cum += r * Math.min(1, k);
      const h = r / 88900 * 220 * k * (1 - gone), y = base - h + gone * 120; ctx.save(); ctx.globalAlpha *= 1 - gone; ctx.fillStyle = 'rgba(245,242,236,0.88)'; ctx.beginPath(); ctx.roundRect(cx(i) - 28, y, 56, h, [12, 12, 0, 0]); ctx.fill(); ctx.restore();
      T(ctx, String(i + 1), cx(i), base + 38, F.mono(22), C.mute, 'center', (1 - gone) * clamp(k * 2)); });
    T(ctx, 'ALUGUEL PAGO POR ANO →', 110, base + 76, F.mono(20), C.mute, 'left', clamp((u - tr) * 3) * (1 - gone), 2);
    if (u > tr) { const n = Math.round(cum / 1000); ctx.save(); ctx.globalAlpha *= 1 - 0.55 * gone; T(ctx, 'R$ ' + n + ' mil', 540, 870, F.black(170), 'gold', 'center', 1, 0, 170); ctx.restore();
      if (gone > 0) { ctx.beginPath(); ctx.moveTo(110, 815); ctx.lineTo(110 + 860 * gone, 815); stroke(ctx, C.cream, 10); } }
    aw(ctx, 'de aluguel em 10 anos', 540, 965, F.it(84), 'rgba(245,242,236,0.9)', u, wt[15], 84);
    if (u > 6.7) aw(ctx, CONTA_LINE, 540, CONTA_Y, CONTA_FONT, C.cream, u, 6.7, 70, 'center', 0.08);
    const colTop = (i) => base - RENT[i] / 88900 * 220 - 30;
    let p; if (u < tr) p = path(u, 540, 160, [[tr - 0.6, 0.5, cx(0), colTop(0) - 60, 0]]);
    else if (u < 6.25) { const fi = (u - tr) / 0.22, i = clamp(Math.floor(fi), 0, 9), f = clamp(fi - i), j = Math.min(9, i + 1), mov = fi < 9;
      p = { x: mov ? lerp(cx(i), cx(j), easeInOut(f)) : cx(9), y: (mov ? lerp(colTop(i), colTop(j), f) - 60 * Math.sin(Math.PI * f) : colTop(9)) }; }
    else { const cd = contaDot(ctx); p = path(u, cx(9), colTop(9), [[6.25, 0.35, cx(9), base + 20, 0], [6.95, 0.45, cd.x, cd.y, 160]]); }
    gdot(ctx, p.x, p.y, u > 7.35 ? 14 : 22);
  },
  parcela(ctx, u, d, t, wt) {
    bgLight(ctx);
    const outC = easeInOut(prog(u, 5.15, 5.6));
    ctx.save(); ctx.globalAlpha *= 1 - outC; ctx.translate(0, -outC * 50);
    aw(ctx, 'Financiando,', 100, 420, F.black(96), NV, u, wt[0], 96, 'left');
    aw(ctx, 'a parcela cai.', 100, 535, F.it(120), NV, u, wt[1], 120, 'left');
    T(ctx, '— parcela (financiando)', 130, 690, F.semi(32), NV, 'left', easeOut(prog(u, 0.3, 0.6))); T(ctx, '— aluguel', 690, 690, F.semi(32), SL, 'left', easeOut(prog(u, 0.3, 0.6)));
    ctx.strokeStyle = 'rgba(11,31,58,0.08)'; ctx.lineWidth = 2; for (let i = 0; i < 10; i++) { ctx.beginPath(); ctx.moveTo(CX(i), CH.y1 - 20); ctx.lineTo(CX(i), CH.y0); ctx.stroke(); }
    for (let i = 0; i < 10; i += 3) T(ctx, 'ano ' + (i + 1), CX(i), CH.y0 + 46, F.mono(24), SL, 'center');
    const dd = easeInOut(prog(u, 0.4, 3.0)) * 9, { ci, fc } = CROSS;
    if (dd > ci + fc) { ctx.save(); ctx.globalAlpha *= 0.35; ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(CROSS.x, CROSS.y); for (let i = ci + 1; i <= Math.floor(dd); i++) ctx.lineTo(CX(i), CY(SIM.alug[i])); for (let i = Math.floor(dd); i >= ci + 1; i--) ctx.lineTo(CX(i), CY(SIM.parc[i])); ctx.closePath(); ctx.fill(); ctx.restore(); }
    [[SIM.parc, NV], [SIM.alug, SL]].forEach(([arr, col]) => { ctx.beginPath(); const fi = Math.floor(dd), fr = dd - fi;
      for (let i = 0; i <= fi; i++) i ? ctx.lineTo(CX(i), CY(arr[i])) : ctx.moveTo(CX(i), CY(arr[i]));
      const lv = fi < 9 ? lerp(arr[fi], arr[fi + 1], fr) : arr[9], lx = fi < 9 ? lerp(CX(fi), CX(fi + 1), fr) : CX(9);
      if (fi < 9) ctx.lineTo(lx, CY(lv)); stroke(ctx, col, 10); dot(ctx, lx, CY(lv), 14, col);
      if (u > 0.5) T(ctx, 'R$ ' + (Math.round(lv / 10) * 10).toLocaleString('pt-BR'), lx - 24, CY(lv) + (col === NV ? 52 : -30), F.semi(32), col, 'right'); });
    if (u > wt[4]) pillB(ctx, 'no 8º ano, a parcela fica menor que o aluguel', 540, 1340, F.semi(36), C.cream, NV, easeOut(prog(u, wt[4], wt[4] + 0.35)), 80);
    ctx.restore();
    // patrimônio: o ponto vira a casa
    const cu = u - (0.4 + 2.6 * (ci + fc) / 9), cd = contaDot(ctx), HX = 540, HY = 905;
    if (u < 5.3) { const p = path(u, cd.x, cd.y, [[0.05, 0.7, CROSS.x, CROSS.y, 180]]);
      ctx.save(); ctx.globalAlpha *= 1 - outC;
      if (cu < 0) { if (p.k < 1) gdot(ctx, p.x, p.y, lerp(14, 22, p.k)); else { ctx.beginPath(); ctx.arc(p.x, p.y, 22, 0, 6.283); stroke(ctx, C.gold, 6); } }
      else { gdot(ctx, CROSS.x, CROSS.y, 22 * (1 + 0.35 * Math.sin(Math.PI * prog(cu, 0, 0.3)))); ring(ctx, CROSS.x, CROSS.y, cu, C.gold, 150); }
      ctx.restore(); }
    if (u >= 5.15) { const p = path(u, CROSS.x, CROSS.y, [[5.15, 0.5, HX, HY, 140]]), R = lerp(22, 175, SPR(u - 5.6, 1.4, 0.55)) * (u < 5.6 ? 0 : 1);
      if (u < 5.6) gdot(ctx, p.x, p.y, 22);
      else { const m1 = easeInOut(prog(u, 5.65, 6.0)), m2 = easeInOut(prog(u, 6.0, 6.4)); ctx.save(); ctx.shadowColor = 'rgba(120,90,30,0.35)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 18;
        const g = ctx.createLinearGradient(0, HY - R, 0, HY + R); g.addColorStop(0, '#E9CF96'); g.addColorStop(1, '#B08E52'); morph(ctx, HX, HY, R, m1, m2, 0, g); ctx.restore();
        const kd = SPR(u - 6.4, 2, 0.5); if (kd > 0) { ctx.fillStyle = C.cream; ctx.beginPath(); ctx.roundRect(HX - 32, HY + R * 0.86 - 84 * clamp(kd), 64, 84 * clamp(kd), [32, 32, 0, 0]); ctx.fill(); } }
      aw(ctx, 'E no fim,', 540, 470, F.it(110), NV, u, wt[13], 110);
      aw(ctx, 'o patrimônio', 540, 590, F.black(110), NV, u, wt[16], 110);
      aw(ctx, 'é seu.', 540, 1250, F.it(150), NV, u, wt[18], 150);
      if (u > 6.5) blurIn(ctx, prog(u, 6.5, 6.95), () => T(ctx, 'R$ 876 mil', HX, HY + 25, F.black(52), C.cream, 'center', 1, 0, 52, 260));
      blurIn(ctx, prog(u, wt[18] + 0.3, wt[18] + 0.8), () => { T(ctx, 'patrimônio em 10 anos · simulação', 540, 1335, F.mono(26), SL, 'center', 1, 1); }); }
  }
};
return { SC, PLAN, wtimes, contaDot, EXIT: { virada: () => ({ x: 540, y: 590 + 165 * 0.86 - 39 }), corrida: () => ({ x: 110 + 9.13 / 10 * 790, y: 1110 }), conta: (c) => contaDot(c), parcela: () => ({ x: 540, y: 905 }) } };
})();
