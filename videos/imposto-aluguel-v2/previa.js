// previa.js — prévia (10 s) da v2 "Imposto novo no aluguel" no estilo do vídeo da eleição
// 120 BPM: batida = 0,5 s. Gancho (0–3 s) · Reforma (3–5 s) · Grupo da família (5–8,5 s) · "Será?" (8,5–10 s)
const RATE = 2.5, WD = 1 / RATE;
const INK = '#1D1D1F', MUTE = '#86868B', GOLDA = '#B8955A', NAVY = '#0B1F3A', LINE = '#E3E3E8';
const DUR = 10, BEAT = 0.5;
const TIMING = [{ cena: 'gancho', inicio: 0, fim: 3 }, { cena: 'reforma', inicio: 3, fim: 5 }, { cena: 'familia', inicio: 5, fim: 8.5 }, { cena: 'sera', inicio: 8.5, fim: 10 }];
const IMG = {}; const ASSETS = Promise.resolve();

// legenda planejada (sem voz na prévia): palavras com tempo
const CAP = [[0.30, 'Tem imposto NOVO'], [1.35, 'chegando no aluguel.'], [3.00, 'A reforma tributária'], [3.85, 'criou o IBS'], [4.45, 'e a CBS.'], [5.15, 'E já tem gente'], [5.85, 'dizendo que TODO'], [6.60, 'aluguel vai ficar'], [7.30, 'mais caro.'], [8.55, 'Será?']];
const CAPW = []; CAP.forEach(([t0, s], i) => { const ws = s.split(' '), t1 = i + 1 < CAP.length ? Math.min(CAP[i + 1][0], t0 + ws.length * 0.33 + 0.25) : t0 + 0.8; ws.forEach((w, j) => CAPW.push({ g: i, w, a: t0 + j * (t1 - t0 - 0.1) / ws.length })); });
function captions(ctx, t) {
  let g = -1; CAP.forEach(([t0], i) => { if (t >= t0 - 0.05) g = i; }); if (g < 0) return;
  const end = g + 1 < CAP.length ? CAP[g + 1][0] - 0.05 : DUR; if (t > end || (g === 1 && t > 2.75) || (g === 8 && t > 8.3)) return;
  const ws = CAPW.filter(c => c.g === g); ctx.save(); ctx.font = F.black(50); const sp = ctx.measureText(' ').width + 8, wid = ws.map(c => ctx.measureText(c.w).width), tot = wid.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const k = clamp((t - CAP[g][0] + 0.05) / 0.14); let cur = -1; ws.forEach((c, j) => { if (t >= c.a - 0.04) cur = j; });
  let x = 540 - tot / 2; const y = 1590 + (1 - easeOut(k)) * 16; ctx.globalAlpha = k; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ws.forEach((c, j) => { const wk = j === cur ? 1 + 0.14 * Math.max(0, 1 - (t - c.a) / 0.25) : 1, caps = c.w === c.w.toUpperCase() && /[A-Z]/.test(c.w);
    ctx.save(); ctx.translate(x + wid[j] / 2, y); ctx.scale(wk, wk); ctx.translate(-(x + wid[j] / 2), -y);
    ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 12; ctx.strokeText(c.w, x, y); ctx.fillStyle = j === cur || (caps && j < cur) ? GOLDA : j < cur ? INK : 'rgba(29,29,31,0.3)'; ctx.fillText(c.w, x, y); ctx.restore(); x += wid[j] + sp; });
  ctx.restore();
}

// ---------- peças ----------
function boleto(ctx, x, y, rot, s) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  card(ctx, -380, -270, 760, 540, 34, '#FFFFFF', 0.16, 80, 30);
  ctx.fillStyle = NAVY; ctx.beginPath(); ctx.roundRect(-380, -270, 760, 96, [34, 34, 0, 0]); ctx.fill();
  T(ctx, 'BOLETO · ALUGUEL', -340, -208, F.mono(30), '#FFFFFF', 'left', 1, 30, 600, 3); houseIcon(ctx, 320, -222, 1.4, '#E2C27F');
  T(ctx, 'Vencimento', -340, -110, F.med(28), MUTE, 'left', 1, 28); T(ctx, '05/11/2026', -340, -66, F.semi(40), INK, 'left', 1, 40);
  T(ctx, 'Valor', 340, -110, F.med(28), MUTE, 'right', 1, 28); T(ctx, 'R$ ?.???,??', 340, -60, F.black(52), INK, 'right', 1, 52);
  ctx.fillStyle = LINE; ctx.fillRect(-340, -20, 680, 2);
  T(ctx, 'Locatário: você', -340, 34, F.med(30), INK, 'left', 1, 30); T(ctx, 'Imóvel: apto · Tatuapé', -340, 80, F.med(30), INK, 'left', 1, 30);
  const R = rng(3); let bx = -340; ctx.fillStyle = INK; while (bx < 340) { const w = 2 + Math.floor(R() * 4) * 2; ctx.fillRect(bx, 130, w, 96); bx += w + 3 + Math.floor(R() * 3) * 2; }
  ctx.restore();
}
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
function chipTile(ctx, s, x, y, k) { pop(ctx, k, x, y, () => { card(ctx, x - 150, y - 100, 300, 200, 40, NAVY, 0.3); T(ctx, s, x, y + 38, F.black(104), '#FFFFFF', 'center', 1, 104); }); }
function phone(ctx, x, y, w, h, fn) {
  card(ctx, x, y, w, h, 70, '#FFFFFF', 0.2, 90, 34); ctx.save(); ctx.beginPath(); ctx.roundRect(x + 16, y + 16, w - 32, h - 32, 56); ctx.clip();
  ctx.fillStyle = '#F2F2F5'; ctx.fillRect(x, y, w, h); fn(); ctx.restore();
  ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(x + w / 2 - 70, y + 30, 140, 36, 18); ctx.fill();
}
const MSGS = [['Tia Cida', 'Viu? Vão taxar o aluguel!!'], ['Primo Léo', 'Vai subir TUDO'], ['Tio Zé', 'Vende o apê enquanto dá'], ['Tia Cida', 'Quem paga é o inquilino'], ['Vó', 'Meu Deus…']];

// ---------- render ----------
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none';
  sceneBg(ctx, 0);
  // tremor do carimbo e soco nas palavras-chave
  const sh = t > 1.5 && t < 1.75 ? (1 - (t - 1.5) / 0.25) * 14 : 0, shx = Math.sin(t * 90) * sh, shy = Math.cos(t * 77) * sh;
  let punch = 0; [[1.0, 0.05], [1.5, 0.06], [3.5, 0.03], [4.5, 0.03], [5.9, 0.03], [8.55, 0.06]].forEach(([a, z]) => { const k = t - a; if (k > 0 && k < 0.8) punch += z * (k < 0.06 ? k / 0.06 : Math.exp(-(k - 0.06) / 0.2)); });
  // zoom de transição gancho → reforma (mergulho no carimbo)
  const zin = clamp((t - 2.7) / 0.32), zk = easeIn(zin);
  ctx.save(); ctx.translate(540 + shx, 960 + shy); ctx.scale(1 + punch, 1 + punch); ctx.translate(-540, -960);

  if (t < 3.05) { // ---------- GANCHO ----------
    ctx.save(); if (zin > 0) { ctx.translate(540, 1000); ctx.scale(1 + 5 * zk, 1 + 5 * zk); ctx.translate(-540, -1000); ctx.globalAlpha = 1 - clamp((zin - 0.5) * 2); if (zk > 0.05) ctx.filter = `blur(${(zk * 18).toFixed(1)}px)`; }
    const ent = SPR(t - 0.05, 1.6, 0.6), by = lerp(1700, 1010, clamp(ent, 0, 1.08)), rot = lerp(0.18, -0.05, clamp(ent, 0, 1));
    kw(ctx, t, 'Tem imposto', 0.25, 'NOVO no aluguel', 0.95, 99, 104);
    boleto(ctx, 540, by, rot, 1);
    const sk = clamp((t - 1.38) / 0.14); if (sk > 0) { const s = lerp(2.4, 1, easeIn(sk)); stamp(ctx, 560, 1040, s, -0.16, '+ IMPOSTO', 'NOVO?', '#D62828', clamp(sk * 3)); }
    if (t > 1.5 && t < 2.3) { const k = (t - 1.5) / 0.8, R = rng(21); for (let i = 0; i < 26; i++) { const a = R() * 6.283, d = 260 + R() * 260; ctx.save(); ctx.globalAlpha = (1 - k) * 0.5; ctx.fillStyle = '#C9C2B4'; ctx.beginPath(); ctx.arc(560 + Math.cos(a) * d * (0.6 + easeOut(k)), 1040 + Math.sin(a) * d * 0.5 * (0.6 + easeOut(k)), 4 + R() * 6, 0, 6.283); ctx.fill(); ctx.restore(); } }
    ctx.restore();
  }
  if (t >= 2.95 && t < 5.3) { // ---------- REFORMA: IBS + CBS ----------
    const u = t - 3, o = clamp((t - 5.0) / 0.3), a = clamp((t - 2.95) / 0.12);
    ctx.save(); ctx.globalAlpha = a * (1 - o); if (o > 0) { ctx.filter = `blur(${(o * 14).toFixed(1)}px)`; ctx.translate(540, 900); ctx.scale(1 - 0.25 * o, 1 - 0.25 * o); ctx.translate(-540, -900); }
    kw(ctx, u, 'A reforma tributária', 0.05, 'criou dois impostos', 0.55, 99, 96);
    chipTile(ctx, 'IBS', 320, 860, u - 0.85); chipTile(ctx, 'CBS', 760, 860, u - 1.45); pop(ctx, u - 1.15, 540, 860, () => T(ctx, '+', 540, 895, F.black(110), 'gold', 'center', 1, 110));
    fx(ctx, clamp((u - 1.0) / 0.3), 0, () => { T(ctx, 'IBS = Imposto sobre Bens e Serviços', 540, 1080, F.med(34), MUTE, 'center', 1, 34); T(ctx, 'CBS = Contribuição sobre Bens e Serviços', 540, 1132, F.med(34), MUTE, 'center', 1, 34); });
    pop(ctx, u - 1.9, 540, 1270, () => pill(ctx, 'valem para aluguel a partir de 2027', 540, 1270, F.semi(36), '#FFFFFF', NAVY, 80, 40));
    ctx.restore();
  }
  if (t >= 5.0) { // ---------- GRUPO DA FAMÍLIA ----------
    const u = t - 5, o = clamp((t - 8.45) / 0.3), ent = clamp(SPR(u, 1.4, 0.62), 0, 1.06);
    ctx.save(); ctx.globalAlpha = (1 - o * 0.85); if (o > 0) { ctx.filter = `blur(${(o * 16).toFixed(1)}px)`; }
    kw(ctx, u, 'E já tem gente dizendo:', 0.1, 'TODO aluguel vai subir', 0.85, 99, 92);
    const py = lerp(1900, 560, ent);
    phone(ctx, 190, py, 700, 930, () => {
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(190, py, 700, 170); ctx.fillStyle = LINE; ctx.fillRect(190, py + 170, 700, 2);
      ctx.beginPath(); ctx.arc(290, py + 115, 38, 0, 6.283); ctx.fillStyle = NAVY; ctx.fill(); houseIcon(ctx, 290, py + 117, 1.25, '#E2C27F');
      T(ctx, 'Família', 345, py + 108, F.semi(36), INK, 'left', 1, 36); T(ctx, 'Tia Cida, Léo, Zé, Vó…', 345, py + 146, F.med(24), MUTE, 'left', 1, 24);
      MSGS.forEach(([who, s], i) => { const k = clamp((u - 0.5 - i * 0.5) / 0.3); if (k <= 0) return; const yy = py + 210 + i * 140 - Math.max(0, (Math.min(u, 3.4) - 0.5 - 3 * 0.5) / 0.5) * 0;
        ctx.save(); ctx.globalAlpha *= clamp(k * 4); const s_ = lerp(0.7, 1, clamp(SPR(k * 0.6, 2, 0.5), 0, 1.1)); ctx.translate(240, yy + 60); ctx.scale(s_, s_); ctx.translate(-240, -(yy + 60));
        ctx.font = F.semi(34); const w = ctx.measureText(s).width + 60; card(ctx, 230, yy, Math.max(w, 260), 116, 30, '#FFFFFF', 0.06, 20, 6);
        T(ctx, who, 258, yy + 40, F.semi(24), ['#D9483E', '#2F5BD3', '#2E9E5B', '#D9483E', '#C98A1B'][i], 'left', 1, 24); T(ctx, s, 258, yy + 90, F.semi(34), INK, 'left', 1, 34, 560); ctx.restore(); });
      if (u > 0.3 && u < 3.0) typing(ctx, 230, py + 210 + Math.min(4, Math.floor((u - 0.3) / 0.5) + 0) * 140 + 140, false, u, 0);
    });
    // contador de mensagens não lidas
    const n = Math.min(99, Math.floor(Math.max(0, u - 0.5) * 34)); if (u > 0.5) pop(ctx, u - 0.5, 850, py + 30, () => { ctx.fillStyle = '#E5484D'; ctx.beginPath(); ctx.arc(850, py + 30, 46, 0, 6.283); ctx.fill(); T(ctx, n >= 99 ? '99+' : String(n), 850, py + 44, F.black(36), '#FFFFFF', 'center', 1, 36); });
    ctx.restore();
  }
  if (t >= 8.45) { // ---------- SERÁ? ----------
    const u = t - 8.5; pop(ctx, u + 0.05, 540, 960, () => { T(ctx, 'Será?', 540, 1010, F.it(230), 'gold', 'center', 1, 230); });
    fx(ctx, clamp((u - 0.5) / 0.3), 0, () => pill(ctx, 'não é bem assim', 540, 1160, F.semi(40), '#FFFFFF', NAVY, 84, 44));
  }
  ctx.restore();
  captions(ctx, t);
  const fin = 1 - clamp(t / 0.15), fout = clamp((t - (DUR - 0.35)) / 0.35); if (fin + fout > 0) { ctx.fillStyle = `rgba(245,245,247,${Math.max(fin, fout)})`; ctx.fillRect(0, 0, W, H); }
}
