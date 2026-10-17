const NV = '#0B1F3A', INKT = '#1C1C1E', GR = '#8A8F98', GOLD = '#C9A86A', RED = '#E5484D', SLT = '#9AA3B2';
F.it = (s) => `${s}px Instr`; F.mono = (s) => `${s}px Mono`;
// ---------- utilidades
const SPR = (x, f = 1.8, z = 0.5) => { if (x <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * om * x) * (Math.cos(wd * x) + z * om / wd * Math.sin(wd * x)); };
const expo = (k) => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
const ein = (u, a, b) => easeInOut(prog(u, a, b));
function hex(c) { const n = parseInt(c.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mixc(a, b, k) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; }
function gold(ctx, y, s) { const g = ctx.createLinearGradient(0, y - s * 0.85, 0, y + s * 0.1); g.addColorStop(0, '#E9CC8C'); g.addColorStop(0.55, '#C9A86A'); g.addColorStop(1, '#9C7A40'); return g; }
function T(ctx, s, x, y, font, col, align = 'center', a = 1, size = 60, maxW = 900, trk = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = font;
  const w = ctx.measureText(s).width; if (w > maxW) { const f = maxW / w; ctx.translate(x, y); ctx.scale(f, f); ctx.translate(-x, -y); }
  ctx.fillStyle = col === 'gold' ? gold(ctx, y, size) : col; ctx.textAlign = align; ctx.textBaseline = 'alphabetic'; if (trk) { try { ctx.letterSpacing = trk + 'px'; } catch (e) { } } ctx.fillText(s, x, y); ctx.restore(); }
function tw(ctx, s, font) { ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; ctx.restore(); return w; }
// palavras saindo do desfoque
function aw(ctx, s, x, y, font, col, u, t0, size, align = 'center', stag = WD, maxW = 900) { if (u < t0) return;
  ctx.save(); ctx.font = font; const ws = s.split(' '), sp = ctx.measureText(' ').width, wid = ws.map(q => ctx.measureText(q).width), tot = wid.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  if (tot > maxW) { const f = maxW / tot; ctx.translate(x, y); ctx.scale(f, f); ctx.translate(-x, -y); }
  let cx = align === 'center' ? x - tot / 2 : align === 'right' ? x - tot : x; const fill = col === 'gold' ? gold(ctx, y, size) : col;
  ws.forEach((q, i) => { const k = clamp((u - t0 - i * stag) / 0.45); if (k > 0) { const e = expo(k); ctx.save(); ctx.globalAlpha *= clamp(k * 2.2); const b = (1 - e) * 12; if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`;
      ctx.fillStyle = fill; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(q, cx, y + (1 - e) * size * 0.28); ctx.restore(); } cx += wid[i] + sp; });
  ctx.restore(); }
// bloco que entra/sai com desfoque (k: 0..1 entrada, o: 0..1 saída)
function fx(ctx, k, o, fn, dy = 30) { if (k <= 0 || o >= 1) return; const e = expo(clamp(k)), b = (1 - e) * 14 + o * 16; ctx.save(); ctx.globalAlpha *= clamp(k * 2) * (1 - o); if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`; ctx.translate(0, (1 - e) * dy - o * dy * 0.6); fn(e); ctx.restore(); }
function pop(ctx, k, x, y, fn) { if (k <= 0) return; const s = lerp(0.86, 1, clamp(SPR(k, 1.8, 0.55), 0, 1.15)); ctx.save(); ctx.globalAlpha *= clamp(k * 5); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }
// palavra-chave do topo: 2 linhas
function kw(ctx, u, l1, t1, l2, t2, tout = 99, s2 = 100) { const o = prog(u, tout, tout + 0.35); if (o >= 1) return; ctx.save(); ctx.globalAlpha *= 1 - o; if (o > 0) ctx.filter = `blur(${(o * 14).toFixed(1)}px)`;
  if (l1) aw(ctx, l1, 540, 365, F.semi(64), INKT, u, t1, 64); if (l2) aw(ctx, l2, 540, 472, F.black(s2), 'gold', u, t2, s2, 'center', WD, 940); ctx.restore(); }
// fundo
let SKIP = null; // 'bg+in' | 'bg+out' durante transições
function sceneBg(ctx, dark = 0) { if (SKIP) return; ctx.fillStyle = mixc('#E9EAED', '#0E1A2E', dark); ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(540, 820, 60, 540, 900, 1250); g.addColorStop(0, dark > 0.5 ? 'rgba(30,55,95,0.9)' : `rgba(248,248,250,${1 - dark})`); g.addColorStop(1, 'rgba(233,234,237,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function card(ctx, x, y, w, h, r, fill = '#FFFFFF', sh = 0.13, blur = 70, oy = 26) { ctx.save(); ctx.shadowColor = `rgba(16,24,40,${sh})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = oy; ctx.fillStyle = fill; ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.restore(); }
// card herói: some durante a transição (o compositor desenha o morph no lugar)
function hero(ctx, R, role) { if (SKIP && (SKIP === role || role === 'both')) return; card(ctx, R.x, R.y, R.w, R.h, R.r, R.fill || '#FFFFFF', R.fill === NV ? 0.3 : 0.13); }
function pill(ctx, s, x, y, font, fg, bgc, h = 64, pad = 34, a = 1) { if (a <= 0) return 0; ctx.save(); ctx.globalAlpha *= a; ctx.font = font; const w = ctx.measureText(s).width + pad * 2; ctx.fillStyle = bgc; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2); ctx.fill(); ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 2); ctx.restore(); return w; }
function cursor(ctx, x, y, s = 1, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.scale(s, s); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 62); ctx.lineTo(16, 47); ctx.lineTo(28, 72); ctx.lineTo(40, 66); ctx.lineTo(28, 42); ctx.lineTo(48, 42); ctx.closePath(); ctx.fillStyle = '#111'; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore(); }
function ripple(ctx, x, y, u) { if (u < 0 || u > 0.5) return; const k = u / 0.5; ctx.save(); ctx.globalAlpha = (1 - k) * 0.6; ctx.strokeStyle = 'rgba(11,31,58,0.5)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, 20 + 50 * expo(k), 0, 6.283); ctx.stroke(); ctx.restore(); }
function cursorPath(u, pts) { // pts: [t, x, y] ; movimento suave entre pontos
  if (u <= pts[0][0]) return { x: pts[0][1], y: pts[0][2] }; for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const k = easeInOut(prog(u, pts[i - 1][0], pts[i][0])); return { x: lerp(pts[i - 1][1], pts[i][1], k), y: lerp(pts[i - 1][2], pts[i][2], k) }; }
  const l = pts[pts.length - 1]; return { x: l[1], y: l[2] }; }
function clickScale(u, taps) { let s = 1; taps.forEach(tp => { s -= 0.16 * Math.exp(-Math.pow((u - tp) * 14, 2)); }); return s; }
function houseIcon(ctx, x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-20, 2); ctx.lineTo(0, -18); ctx.lineTo(20, 2); ctx.lineTo(15, 2); ctx.lineTo(15, 18); ctx.lineTo(4, 18); ctx.lineTo(4, 7); ctx.lineTo(-4, 7); ctx.lineTo(-4, 18); ctx.lineTo(-15, 18); ctx.lineTo(-15, 2); ctx.closePath(); ctx.fill(); ctx.restore(); }
function flatPin(ctx, x, y, s, col, hole) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(-14, -26, -46, -52, -46, -86); ctx.arc(0, -86, 46, Math.PI, 0); ctx.bezierCurveTo(46, -52, 14, -26, 0, 0); ctx.fillStyle = col; ctx.fill(); ctx.beginPath(); ctx.arc(0, -86, 17, 0, 6.283); ctx.fillStyle = hole; ctx.fill(); ctx.restore(); }
function gdot(ctx, x, y, r) { if (r <= 0.3) return; ctx.save(); ctx.shadowColor = 'rgba(201,168,106,0.7)'; ctx.shadowBlur = r; const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r); g.addColorStop(0, '#F3DDA8'); g.addColorStop(1, '#B08C4E'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.restore(); }
function avatar(ctx, kind, x, y, r, letter) { ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.clip();
  const bgc = kind === 'lula' ? '#D9483E' : kind === 'flavio' ? '#2A3D63' : kind === 'pedro' ? NV : kind; ctx.fillStyle = bgc; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  if (kind === 'lula' || kind === 'flavio') { const s = r / 60; ctx.translate(x, y + 18 * s); ctx.scale(s, s); ctx.fillStyle = '#D2A283'; ctx.beginPath(); ctx.arc(0, 0, 34, 0, 6.283); ctx.fill();
    if (kind === 'lula') { ctx.fillStyle = '#E8E4DC'; ctx.beginPath(); ctx.ellipse(0, -6, 36, 32, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#DCCFB6'; ctx.beginPath(); ctx.ellipse(0, -30, 54, 12, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#F4EEDF'; ctx.beginPath(); ctx.roundRect(-28, -62, 56, 34, [18, 18, 6, 6]); ctx.fill(); ctx.fillStyle = '#2A2A30'; ctx.fillRect(-28, -38, 56, 8); }
    else { ctx.fillStyle = '#3A2C22'; ctx.beginPath(); ctx.ellipse(0, -12, 37, 28, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#1F9A52'; ctx.beginPath(); ctx.ellipse(0, 52, 56, 24, 0, 0, 6.283); ctx.fill(); ctx.fillStyle = '#F5C730'; ctx.beginPath(); ctx.moveTo(0, 36); ctx.lineTo(26, 52); ctx.lineTo(0, 68); ctx.lineTo(-26, 52); ctx.fill(); } }
  else if (kind === 'pedro') flatPin(ctx, x, y + r * 0.42, r / 140, GOLD, NV);
  else if (kind === 'anon') { ctx.fillStyle = '#C3C8D1'; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.fillStyle = '#E9EBEF'; ctx.beginPath(); ctx.arc(x, y - r * 0.15, r * 0.36, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.ellipse(x, y + r * 0.75, r * 0.65, r * 0.5, 0, 0, 6.283); ctx.fill(); }
  else if (letter) T(ctx, letter, x, y + r * 0.3, F.semi(r * 0.8), '#fff', 'center', 1, r);
  ctx.restore(); }
function bubble(ctx, s, x, y, out, font = F.semi(40), k = 1) { if (k <= 0) return { w: 0, h: 0 }; ctx.save(); ctx.font = font; const lines = s.split('\n'), w = Math.max(...lines.map(l => ctx.measureText(l).width)) + 64, h = lines.length * 54 + 36, bx = out ? x - w : x;
  const sc = lerp(0.6, 1, clamp(SPR(k, 2.2, 0.55), 0, 1.1)), ox = out ? x : x, oy = y + h; ctx.translate(ox, oy); ctx.scale(sc, sc); ctx.translate(-ox, -oy); ctx.globalAlpha *= clamp(k * 6);
  ctx.fillStyle = out ? NV : '#E5E5EA'; ctx.beginPath(); ctx.roundRect(bx, y, w, h, 38); ctx.fill();
  ctx.beginPath(); if (out) { ctx.moveTo(x - 20, y + h - 30); ctx.quadraticCurveTo(x + 4, y + h + 2, x + 14, y + h); ctx.quadraticCurveTo(x - 6, y + h - 4, x - 30, y + h - 12); } else { ctx.moveTo(x + 20, y + h - 30); ctx.quadraticCurveTo(x - 4, y + h + 2, x - 14, y + h); ctx.quadraticCurveTo(x + 6, y + h - 4, x + 30, y + h - 12); } ctx.fill();
  ctx.fillStyle = out ? '#FFFFFF' : INKT; ctx.textBaseline = 'alphabetic'; lines.forEach((l, i) => ctx.fillText(l, bx + 32, y + 62 + i * 54)); ctx.restore(); return { w, h }; }
function typing(ctx, x, y, out, u, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const bx = out ? x - 140 : x; ctx.fillStyle = out ? NV : '#E5E5EA'; ctx.beginPath(); ctx.roundRect(bx, y, 140, 80, 40); ctx.fill();
  for (let i = 0; i < 3; i++) { ctx.globalAlpha = a * (0.35 + 0.65 * Math.max(0, Math.sin(u * 9 - i * 0.9))); ctx.fillStyle = out ? '#fff' : '#8E8E93'; ctx.beginPath(); ctx.arc(bx + 42 + i * 28, y + 40, 9, 0, 6.283); ctx.fill(); } ctx.restore(); }
const fmt = (v) => Math.round(v).toLocaleString('pt-BR');
const R_ = (x, y, w, h, r, fill) => ({ x, y, w, h, r, fill });
