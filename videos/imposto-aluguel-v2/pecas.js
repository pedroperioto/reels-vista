// pecas.js — peças desenhadas (prédio, moeda, carteira, régua, carimbo) usadas pela prévia 3 e pela versão final
function building(ctx, x, y, w, h, col = NAVY) { // x,y = base central
  ctx.save(); ctx.shadowColor = 'rgba(16,24,40,0.18)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - w / 2, y - h, w, h, 14); ctx.fill(); ctx.restore();
  const cols = Math.max(2, Math.round(w / 46)), rows = Math.max(2, Math.round(h / 52)), cw = (w - 28) / cols, rh = (h - 40) / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { ctx.fillStyle = (r * 7 + c * 3) % 5 === 0 ? '#E2C27F' : 'rgba(255,255,255,0.22)'; ctx.fillRect(x - w / 2 + 14 + c * cw + 5, y - h + 18 + r * rh + 6, cw - 10, rh - 14); }
}
function coin(ctx, x, y, r, a = 1, shadow = true) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.35, r * 0.1, x, y, r); g.addColorStop(0, '#F6E2AE'); g.addColorStop(0.6, '#D7B56F'); g.addColorStop(1, '#A9843F');
  ctx.shadowColor = shadow ? 'rgba(120,90,30,0.35)' : 'transparent'; ctx.shadowBlur = r * 0.4; ctx.shadowOffsetY = r * 0.12; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.shadowColor = 'transparent';
  ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineWidth = r * 0.06; ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, 6.283); ctx.stroke();
  T(ctx, 'R$', x, y + r * 0.22, F.black(r * 0.62), '#7A5A22', 'center', 0.9, r * 0.62); ctx.restore();
}
// moeda grande com mordida (offscreen para recortar só a moeda)
const BIGC = document.createElement('canvas'); BIGC.width = 760; BIGC.height = 760;
function bittenCoin(k) { const g = BIGC.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, 760, 760); coin(g, 380, 380, 330, 1, false);
  if (k > 0) { g.globalCompositeOperation = 'destination-out'; const cx = 380 + 300, cy = 380 - 200, R = 190 * easeOut(clamp(k)); for (let i = -3; i <= 3; i++) { const a = -2.35 + i * 0.32; g.beginPath(); g.arc(cx + Math.cos(a) * R * 0.95, cy - Math.sin(a) * R * 0.95, R * 0.24, 0, 6.283); g.fill(); } g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.fill(); g.globalCompositeOperation = 'source-over'; }
  return BIGC; }
function wallet(ctx, x, y, s, open = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); card(ctx, -190, -110, 380, 220, 40, NAVY, 0.3);
  ctx.fillStyle = '#16335C'; ctx.beginPath(); ctx.roundRect(60, -40, 150, 80, 30); ctx.fill(); ctx.fillStyle = '#E2C27F'; ctx.beginPath(); ctx.arc(110, 0, 14, 0, 6.283); ctx.fill();
  T(ctx, 'sua renda de aluguel', -170, 150, F.semi(30), MUTE, 'left', 1, 30); ctx.restore(); }
function ruler(ctx, x, top, bot, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
  card(ctx, x - 40, top, 80, bot - top, 20, '#FFFFFF', 0.12, 40, 14);
  for (let y = bot - 20, i = 0; y > top + 20; y -= 25, i++) { ctx.fillStyle = i % 4 === 0 ? INK : '#B9BCC4'; ctx.fillRect(x - 40, y, i % 4 === 0 ? 46 : 26, i % 4 === 0 ? 4 : 2); }
  ctx.restore(); }
let STAMPC = {};
function stampCanvas(txt1, txt2, col) {
  const key = txt1 + '|' + txt2 + '|' + col; if (STAMPC[key]) return STAMPC[key];
  const c = document.createElement('canvas'); c.width = 680; c.height = 240; const g = c.getContext('2d'); g.translate(340, 120);
  g.fillStyle = 'rgba(255,255,255,0.82)'; g.beginPath(); g.roundRect(-330, -110, 660, 220, 26); g.fill();
  g.strokeStyle = col; g.lineWidth = 13; g.beginPath(); g.roundRect(-310, -92, 620, 184, 18); g.stroke();
  T(g, txt1, 0, txt2 ? -6 : 34, F.black(txt2 ? 76 : 100), col, 'center', 1, 100, 560); if (txt2) T(g, txt2, 0, 66, F.black(56), col, 'center', 1, 56, 560);
  const R = rng(9); g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 70; i++) { g.beginPath(); g.arc(-300 + R() * 600, -90 + R() * 180, 1 + R() * 5, 0, 6.283); g.fill(); }
  return STAMPC[key] = c;
}
function stamp(ctx, x, y, s, rot, txt1, txt2, col = '#D62828', a = 1) {
  if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.drawImage(stampCanvas(txt1, txt2, col), -340, -120); ctx.restore();
}
