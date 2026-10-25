// previa3.js — prévia 3 (10 s): gancho para investidor + metáfora da régua do parque + transições encaixadas
// 120 BPM (batida 0,5 s). Cenas: renda (0–1,6) · mordida (1,6–3) · dois números (3–5) · régua (5–9,2) · pergunta (9,2–10)
const RATE = 2.5, WD = 1 / RATE;
const INK = '#1D1D1F', MUTE = '#86868B', GOLDA = '#B8955A', NAVY = '#0B1F3A', LINE = '#E3E3E8', RD = '#D62828', GRN = '#2E9E5B';
const DUR = 10, BEAT = 0.5;
const TIMING = [{ cena: 'renda', inicio: 0, fim: 1.6 }, { cena: 'mordida', inicio: 1.6, fim: 3 }, { cena: 'numeros', inicio: 3, fim: 5 }, { cena: 'regua', inicio: 5, fim: 9.2 }, { cena: 'pergunta', inicio: 9.2, fim: 10 }];
const IMG = {}; const ASSETS = Promise.resolve();

// legenda planejada (texto que será narrado)
const CAP = [[0.15, 'Você investe em imóvel'], [0.95, 'pra alugar?'], [1.65, 'O imposto novo'], [2.2, 'pode morder sua renda.'], [3.1, 'Ou não.'], [3.65, 'Depende de DOIS números.'], [5.25, 'Pensa numa régua'], [5.95, 'de parque:'], [6.45, 'só entra quem é alto.'], [9.2, 'Você passa?']];
const CAPW = []; CAP.forEach(([t0, s], i) => { const ws = s.split(' '), t1 = i + 1 < CAP.length ? Math.min(CAP[i + 1][0], t0 + ws.length * 0.3 + 0.2) : t0 + 0.7; ws.forEach((w, j) => CAPW.push({ g: i, w, a: t0 + j * (t1 - t0 - 0.08) / ws.length })); });
function captions(ctx, t) {
  let g = -1; CAP.forEach(([t0], i) => { if (t >= t0 - 0.05) g = i; }); if (g < 0) return;
  const end = g + 1 < CAP.length ? CAP[g + 1][0] - 0.05 : DUR; if (t > end || (g === 8 && t > 8.9)) return;
  const ws = CAPW.filter(c => c.g === g); ctx.save(); ctx.font = F.black(50); const sp = ctx.measureText(' ').width + 8, wid = ws.map(c => ctx.measureText(c.w).width), tot = wid.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const k = clamp((t - CAP[g][0] + 0.05) / 0.14); let cur = -1; ws.forEach((c, j) => { if (t >= c.a - 0.04) cur = j; });
  let x = 540 - tot / 2; const y = 1600 + (1 - easeOut(k)) * 16; ctx.globalAlpha = k; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ws.forEach((c, j) => { const wk = j === cur ? 1 + 0.14 * Math.max(0, 1 - (t - c.a) / 0.25) : 1, caps = c.w === c.w.toUpperCase() && /[A-Z]/.test(c.w);
    ctx.save(); ctx.translate(x + wid[j] / 2, y); ctx.scale(wk, wk); ctx.translate(-(x + wid[j] / 2), -y);
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 12; ctx.strokeText(c.w, x, y); ctx.fillStyle = j === cur || (caps && j < cur) ? GOLDA : j < cur ? INK : 'rgba(29,29,31,0.3)'; ctx.fillText(c.w, x, y); ctx.restore(); x += wid[j] + sp; });
  ctx.restore();
}

// ---------- peças ----------
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

// ---------- render ----------
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  sceneBg(ctx, 0);
  let punch = 0; [[0.95, 0.04], [2.3, 0.07], [3.6, 0.04], [4.1, 0.04], [6.6, 0.03], [8.0, 0.05], [9.2, 0.06]].forEach(([a, z]) => { const k = t - a; if (k > 0 && k < 0.8) punch += z * (k < 0.06 ? k / 0.06 : Math.exp(-(k - 0.06) / 0.2)); });
  const sh = t > 2.3 && t < 2.55 ? (1 - (t - 2.3) / 0.25) * 16 : 0;
  ctx.save(); ctx.translate(540 + Math.sin(t * 90) * sh, 960 + Math.cos(t * 70) * sh); ctx.scale(1 + punch, 1 + punch); ctx.translate(-540, -960);

  // ---------- 1. RENDA: 3 imóveis alugados pingando moedas na carteira (0–1,6) ----------
  // ---------- 2. MORDIDA: a câmera mergulha na moeda (corte por forma) e o imposto morde (1,6–3) ----------
  if (t < 3.15) {
    const z = easeInOut(clamp((t - 1.35) / 0.4)); // zoom da carteira para a moeda grande
    ctx.save();
    if (z < 1) {
      ctx.globalAlpha = 1 - z; ctx.translate(540, 1290); ctx.scale(1 + 3 * z, 1 + 3 * z); ctx.translate(-540, -1290);
      kw(ctx, t, 'Você investe em imóvel', 0.12, 'pra alugar?', 0.9, 99, 104);
      [[230, 0.1, 330], [540, 0.6, 430], [850, 1.1, 370]].forEach(([x, t0, h], i) => pop(ctx, t - t0, x, 900, () => {
        building(ctx, x, 1060, 230, h); pill(ctx, 'ALUGADO', x, 1095, F.black(30), NAVY, '#E2C27F', 58, 24); }));
      for (let i = 0; i < 9; i++) { const t0 = 0.35 + i * 0.13, k = clamp((t - t0) / 0.5); if (k <= 0 || k >= 1) continue; const sx = [230, 540, 850][i % 3]; coin(ctx, lerp(sx, 540, k), lerp(1100, 1290, easeIn(k)) - Math.sin(Math.PI * k) * 140, 40, 1 - clamp((k - 0.85) * 6)); }
      wallet(ctx, 540, 1300, 1.05 + 0.04 * Math.sin(t * 9) * clamp((t - 0.5) * 2));
    }
    ctx.restore();
    if (z > 0) {
      const u = t - 1.6, o = clamp((t - 2.85) / 0.3), bite = clamp((u - 0.7) / 0.12), wob = bite > 0 ? Math.sin((u - 0.7) * 30) * Math.exp(-(u - 0.7) / 0.18) * 0.08 : 0;
      ctx.save(); ctx.globalAlpha = z;
      kw(ctx, u, 'O imposto novo', 0.05, 'pode morder sua renda', 0.6, 99, 88);
      const s = lerp(0.25, 1, easeOut(z)); ctx.translate(540, 1010); ctx.rotate(wob); ctx.scale(s * (1 + o * 6), s * (1 + o * 6)); ctx.drawImage(bittenCoin(bite), -380, -380); ctx.restore();
      if (bite > 0 && u < 1.6) { const R = rng(4), kk = u - 0.7; for (let i = 0; i < 14; i++) { const a = -0.9 + R() * 1.2, sp = 200 + R() * 300; ctx.save(); ctx.globalAlpha = clamp(1 - kk / 0.8); ctx.fillStyle = '#C9A86A'; ctx.beginPath(); ctx.arc(840 + Math.cos(a) * sp * kk, 830 - Math.sin(a) * sp * kk + 600 * kk * kk, 5 + R() * 7, 0, 6.283); ctx.fill(); ctx.restore(); } }
    }
  }
  // ---------- 3. DOIS NÚMEROS: a mordida vira a máscara que revela a cena (3–5) ----------
  if (t >= 2.85 && t < 5.35) {
    const u = t - 3, m = easeIn(clamp((t - 2.85) / 0.35)), o = clamp((t - 5.0) / 0.3);
    ctx.save(); ctx.beginPath(); ctx.arc(540 + 300 * (1 - m), 830 + 180 * m, 40 + 2100 * m, 0, 6.283); ctx.clip(); sceneBg(ctx, 0);
    ctx.translate(-700 * easeIn(o), 0); if (o > 0) ctx.filter = `blur(${(o * 20).toFixed(1)}px)`;
    kw(ctx, u, 'Ou não.', 0.05, 'Depende de 2 números', 0.6, 99, 92);
    const tile = (x, t0, big, small) => pop(ctx, u - t0, x, 900, () => { card(ctx, x - 200, 760, 400, 300, 44, '#FFFFFF', 0.14); T(ctx, big, x, 900, F.black(96), NAVY, 'center', 1, 96, 360); T(ctx, small, x, 975, F.semi(32), MUTE, 'center', 1, 32, 360); });
    tile(300, 0.6, 'Mais de 3', 'imóveis alugados'); tile(780, 1.1, 'R$ 240 mil', 'por ano em aluguel');
    pop(ctx, u - 0.85, 540, 910, () => { ctx.fillStyle = '#E2C27F'; ctx.beginPath(); ctx.arc(540, 910, 44, 0, 6.283); ctx.fill(); T(ctx, 'E', 540, 926, F.black(44), NAVY, 'center', 1, 44); });
    fx(ctx, clamp((u - 1.4) / 0.3), 0, () => T(ctx, 'ou mais de R$ 288 mil por ano, com qualquer nº de imóveis', 540, 1150, F.med(32), MUTE, 'center', 1, 32, 900));
    fx(ctx, clamp((u - 1.4) / 0.3), 0, () => T(ctx, 'Fonte: Lei Complementar 214/2025', 540, 1478, F.mono(22), MUTE, 'center', 1, 22));
    ctx.restore();
  }
  // ---------- 4. RÉGUA DO PARQUE (whip da direita, 5–9,2) ----------
  if (t >= 5.0) {
    const u = t - 5.2, inK = easeOut(clamp((t - 5.0) / 0.35)), o = clamp((t - 9.0) / 0.3);
    ctx.save(); ctx.translate(700 * (1 - inK), 0); if (inK < 0.9) ctx.filter = `blur(${((1 - inK) * 20).toFixed(1)}px)`; ctx.globalAlpha = inK * (1 - o * 0.9);
    kw(ctx, u, 'Pensa numa régua de parque:', 0.05, 'só entra quem é alto', 1.25, 99, 88);
    const RX = 920, TOP = 600, BOT = 1400, LIM = 900;
    ruler(ctx, RX, TOP, BOT);
    // placa do brinquedo
    pop(ctx, u - 0.3, 460, 640, () => { card(ctx, 130, 555, 660, 180, 30, NAVY, 0.25); T(ctx, 'PARA PAGAR O IMPOSTO NOVO', 460, 615, F.black(36), '#E2C27F', 'center', 1, 36, 600); T(ctx, 'alcance a linha: + de 3 imóveis', 460, 662, F.semi(30), '#FFFFFF', 'center', 1, 30, 600); T(ctx, 'e + de R$ 240 mil por ano', 460, 704, F.semi(30), '#FFFFFF', 'center', 1, 30, 600); });
    // linha limite tracejada
    const lk = clamp((u - 0.6) / 0.4); if (lk > 0) { ctx.save(); ctx.setLineDash([24, 16]); ctx.strokeStyle = RD; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(RX + 40, LIM); ctx.lineTo(RX + 40 - 820 * easeOut(lk), LIM); ctx.stroke(); ctx.restore();
      fx(ctx, lk, 0, () => pill(ctx, 'LINHA', 105, LIM, F.black(24), '#FFFFFF', RD, 46, 16)); }
    // personagem 1: 2 imóveis (baixinho) — chega, estica, não alcança
    const c1 = clamp((u - 0.9) / 0.5), x1 = lerp(-200, 420, easeOut(c1)), jump = u > 1.6 && u < 2.3 ? Math.sin(Math.PI * (u - 1.6) / 0.7) * 120 : 0, out1 = clamp((u - 2.6) / 0.4);
    if (c1 > 0) { ctx.save(); ctx.translate(-560 * easeIn(out1), 0); ctx.globalAlpha *= 1 - out1;
      building(ctx, x1 - 70, BOT - jump, 130, 240); building(ctx, x1 + 70, BOT - jump, 130, 200, '#2A4A7A');
      T(ctx, '2 imóveis · R$ 60 mil/ano', x1, BOT + 50, F.semi(30), INK, 'center', 1, 30);
      pop(ctx, u - 2.1, x1, BOT - 380, () => pill(ctx, 'Não alcança: não paga ✓', x1, BOT - 380, F.black(32), '#FFFFFF', GRN, 70, 30)); ctx.restore(); }
    // personagem 2: 5 imóveis (alto) — alcança a linha
    const c2 = clamp((u - 2.7) / 0.5), x2 = lerp(-260, 470, easeOut(c2));
    if (c2 > 0) { const grow = easeOut(clamp((u - 3.0) / 0.5)), h2 = lerp(300, 580, grow);
      building(ctx, x2 - 120, BOT, 120, h2 * 0.8, '#2A4A7A'); building(ctx, x2, BOT, 150, h2); building(ctx, x2 + 125, BOT, 110, h2 * 0.7, '#2A4A7A');
      T(ctx, '5 imóveis · R$ 300 mil/ano', x2, BOT + 50, F.semi(30), INK, 'center', 1, 30);
      pop(ctx, u - 2.85, x2, BOT - h2 - 60, () => pill(ctx, 'Passou da linha: paga', x2, BOT - h2 - 60 + 0, F.black(32), '#FFFFFF', RD, 70, 30)); }
    fx(ctx, clamp((u - 0.6) / 0.3), 0, () => T(ctx, 'Exemplos ilustrativos · regra: LC 214/2025', 540, 1505, F.mono(22), MUTE, 'center', 1, 22));
    ctx.restore();
  }
  // ---------- 5. PERGUNTA (9,2–10) ----------
  if (t >= 9.05) { const u = t - 9.2; pop(ctx, u + 0.05, 540, 960, () => { T(ctx, 'E você,', 540, 860, F.semi(72), INK, 'center', 1, 72); T(ctx, 'passa na régua?', 540, 1010, F.it(150), 'gold', 'center', 1, 150, 980); }); }
  ctx.restore();
  captions(ctx, t);
  const fin = 1 - clamp(t / 0.12), fout = clamp((t - (DUR - 0.3)) / 0.3); if (fin + fout > 0) { ctx.fillStyle = `rgba(245,245,247,${Math.max(fin, fout)})`; ctx.fillRect(0, 0, W, H); }
}
