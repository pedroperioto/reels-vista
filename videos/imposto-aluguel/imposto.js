// imposto.js — "Imposto novo no aluguel" · lançamento estilo SaaS · 9:16 · 120 BPM · 28 compassos (56 s)
// Tudo é função de t (render determinístico). Batida = 0,5 s; compasso = 2 s.
const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4, NBARS = 28;
const DUR = NBARS * BAR;
const bt = (n) => n * BEAT;

// paleta (dark navy + dourado da marca)
const K = {
  bg0: '#050D1A', bg1: '#0B1F3A', card: '#0F2546', card2: '#14305A', line: 'rgba(255,255,255,0.09)',
  ink: '#F4F6FA', mute: '#8D9BB3', dim: '#5D6B85', gold: '#E2C27F', gold2: '#B8955A',
  green: '#3DDC97', red: '#FF5D63', violet: '#8C7CF0'
};
const FN = {
  black: (s) => `${s}px InterBlack`, semi: (s) => `${s}px InterSemi`, med: (s) => `${s}px InterMed`,
  it: (s) => `italic ${s}px Instr`, mono: (s) => `${s}px Mono`
};

// seções em compassos
const SEC = [
  ['abertura', 0, 2], ['problema', 2, 6], ['paradigma', 6, 10], ['quebra', 10, 14],
  ['f1', 14, 16.5], ['f2', 16.5, 19], ['f3', 19, 21.5], ['f4', 21.5, 24], ['cta', 24, 28]
].map(([n, a, b]) => ({ n, a: a * BAR, b: b * BAR }));
const SQ = Object.fromEntries(SEC.map(s => [s.n, s]));
const TIMING = SEC.map(s => ({ cena: s.n, inicio: s.a, fim: s.b }));

// ---------- recursos ----------
const IMG = {};
const ASSETS = Promise.all([['vista', 'fotos/vista.png']].map(([k, src]) => new Promise(r => { const im = new Image(); im.onload = () => { IMG[k] = im; r(); }; im.onerror = () => r(); im.src = src; })));

// ---------- utilitários de desenho ----------
const ease = { out: easeOut, io: easeInOut, back };
function A(ctx, a, fn) { if (a <= 0.001) return; ctx.save(); ctx.globalAlpha *= clamp(a); fn(); ctx.restore(); }
function T(ctx, s, x, y, font, color, align = 'left', a = 1, ls = 0) { txt(ctx, s, x, y, font, color, align, a, ls); }
function tw(ctx, s, font) { ctx.save(); ctx.font = font; const w = ctx.measureText(s).width; ctx.restore(); return w; }
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
// cartão "vidro" com borda fina e sombra
function card(ctx, x, y, w, h, r = 36, fill = K.card, stroke = K.line, sh = 0.45) {
  ctx.save(); ctx.shadowColor = `rgba(0,0,0,${sh})`; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  rr(ctx, x, y, w, h, r); const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, fill); g.addColorStop(1, shade(fill, -10));
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x + 0.5, y + 0.5, w - 1, h - 1, r); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke();
  // brilho na borda de cima
  const g2 = ctx.createLinearGradient(x, y, x + w, y); g2.addColorStop(0, 'rgba(255,255,255,0)'); g2.addColorStop(0.5, 'rgba(255,255,255,0.18)'); g2.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.beginPath(); ctx.moveTo(x + r, y + 1); ctx.lineTo(x + w - r, y + 1); ctx.strokeStyle = g2; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
}
function shade(hex, p) { const n = parseInt(hex.slice(1), 16); const f = (c) => clamp(Math.round(c + p * 2.55), 0, 255); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; }
// pílula de rótulo
function chip(ctx, s, cx, cy, font, fg, bg, stroke = null, padX = 30, h = 64) {
  ctx.save(); ctx.font = font; const w = ctx.measureText(s).width + padX * 2;
  rr(ctx, cx - w / 2, cy - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, cx, cy + 2); ctx.restore(); return w;
}
// entrada "pop" (escala com back) a partir do instante t0
function pop(t, t0, d = 0.35) { const k = clamp((t - t0) / d); return { k, s: k <= 0 ? 0 : back(k), a: clamp(k * 3) }; }
function inUp(t, t0, d = 0.4, dist = 60) { const k = easeOut(clamp((t - t0) / d)); return { a: k, y: (1 - k) * dist }; }
function scaleAt(ctx, x, y, s, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }
// ícones
function icHouse(ctx, x, y, s, color, fill = null) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath();
  ctx.moveTo(-30, -2); ctx.lineTo(0, -30); ctx.lineTo(30, -2); ctx.lineTo(30, 30); ctx.lineTo(-30, 30); ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = color; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(-9, 10, 18, 20, 3); ctx.strokeStyle = color; ctx.stroke(); ctx.restore();
}
function icCheck(ctx, x, y, r, color, k = 1, bg = null) {
  ctx.save(); ctx.translate(x, y);
  if (bg) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = bg; ctx.fill(); }
  ctx.beginPath(); const p = [[-0.42, 0.02], [-0.12, 0.32], [0.45, -0.3]];
  ctx.moveTo(p[0][0] * r, p[0][1] * r);
  const L1 = 1, kk = clamp(k * 2);
  if (kk < 0.5) { const q = kk / 0.5; ctx.lineTo(lerp(p[0][0], p[1][0], q) * r, lerp(p[0][1], p[1][1], q) * r); }
  else { ctx.lineTo(p[1][0] * r, p[1][1] * r); const q = (kk - 0.5) / 0.5; ctx.lineTo(lerp(p[1][0], p[2][0], q) * r, lerp(p[1][1], p[2][1], q) * r); }
  ctx.strokeStyle = color; ctx.lineWidth = r * 0.18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
}
function icX(ctx, x, y, r, color, bg = null) {
  ctx.save(); ctx.translate(x, y); if (bg) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fillStyle = bg; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-r * 0.32, -r * 0.32); ctx.lineTo(r * 0.32, r * 0.32); ctx.moveTo(r * 0.32, -r * 0.32); ctx.lineTo(-r * 0.32, r * 0.32);
  ctx.strokeStyle = color; ctx.lineWidth = r * 0.17; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore();
}
// cursor de mouse (seta), com "clique" (k)
function cursor(ctx, x, y, click = 0, a = 1) {
  A(ctx, a, () => {
    if (click > 0 && click < 1) { ctx.beginPath(); ctx.arc(x + 4, y + 4, 20 + 50 * easeOut(click), 0, 6.283); ctx.strokeStyle = `rgba(226,194,127,${0.8 * (1 - click)})`; ctx.lineWidth = 4; ctx.stroke(); }
    const s = 1 - 0.12 * Math.sin(Math.PI * clamp(click)); ctx.save(); ctx.translate(x, y); ctx.scale(s * 1.5, s * 1.5);
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 34); ctx.lineTo(9, 26); ctx.lineTo(15, 40); ctx.lineTo(21, 37); ctx.lineTo(15, 24); ctx.lineTo(27, 24); ctx.closePath();
    ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 4; ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowBlur = 0;
    ctx.strokeStyle = '#0B1F3A'; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  });
}
// texto digitado (n caracteres visíveis) com barra piscando
function typed(ctx, s, x, y, font, color, k, caret = true, t = 0) {
  const n = Math.floor(clamp(k) * s.length + 1e-6), shown = s.slice(0, n); T(ctx, shown, x, y, font, color);
  if (caret && k < 1.2) { const w = tw(ctx, shown, font); if (Math.floor(t * 4) % 2 === 0 || k < 1) { ctx.fillStyle = K.gold; ctx.fillRect(x + w + 4, y - 44, 4, 54); } }
}
// rótulo de fonte (só em telas com dado)
function fonte(ctx, s, a = 1) { T(ctx, s, 540, 1478, FN.mono(22), 'rgba(141,155,179,0.9)', 'center', a); }

// ---------- fundo ----------
let DOTS = null;
function background(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, K.bg0); g.addColorStop(0.55, '#081831'); g.addColorStop(1, K.bg0);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // orbes de luz lentas
  const orb = (x, y, r, c, a) => { const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, c.replace('A', a)); rg.addColorStop(1, c.replace('A', 0)); ctx.fillStyle = rg; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); };
  orb(540 + 260 * Math.sin(t * 0.21), 620 + 120 * Math.cos(t * 0.17), 760, 'rgba(46,92,170,A)', 0.32);
  orb(540 - 300 * Math.cos(t * 0.15), 1380 + 140 * Math.sin(t * 0.19), 700, 'rgba(226,194,127,A)', 0.10);
  // grade de pontos com pulso na batida
  const pulse = Math.exp(-((t % BEAT) / 0.12)) * (Math.floor(t / BEAT) % 4 === 0 ? 1 : 0.45);
  if (!DOTS) { DOTS = document.createElement('canvas'); DOTS.width = W; DOTS.height = H; const d = DOTS.getContext('2d'); d.fillStyle = '#fff'; for (let y = 30; y < H; y += 60) for (let x = 30; x < W; x += 60) { d.beginPath(); d.arc(x, y, 2, 0, 6.283); d.fill(); } }
  ctx.save(); ctx.globalAlpha = 0.05 + 0.05 * pulse; ctx.drawImage(DOTS, 0, 0); ctx.restore();
}

// ---------- cenas (u = tempo local em segundos) ----------
const SC = {};

SC.abertura = (ctx, u, t) => {
  // b0: ponto dourado · b1: anel · b2: chip · b3: IBS + CBS · b4-5: título · b6: 2027 · b7: brilho
  const p0 = pop(u, 0, 0.3), ring = clamp((u - bt(1)) / 0.6);
  A(ctx, p0.a * (1 - clamp((u - bt(2)) / 0.3)), () => { ctx.beginPath(); ctx.arc(540, 820, 14 * p0.s, 0, 6.283); ctx.fillStyle = K.gold; ctx.fill(); });
  if (ring > 0) A(ctx, 1 - ring, () => { ctx.beginPath(); ctx.arc(540, 820, 30 + 520 * easeOut(ring), 0, 6.283); ctx.strokeStyle = K.gold; ctx.lineWidth = 3; ctx.stroke(); });
  const c1 = inUp(u, bt(2), 0.35, 30); A(ctx, c1.a, () => chip(ctx, 'REFORMA TRIBUTÁRIA', 540, 560 + c1.y, FN.mono(30), K.gold, 'rgba(226,194,127,0.10)', 'rgba(226,194,127,0.45)', 34, 68));
  const pI = pop(u, bt(3), 0.35), pC = pop(u, bt(3) + 0.12, 0.35), pP = pop(u, bt(3) + 0.06, 0.3);
  const tile = (s, x, p) => A(ctx, p.a, () => scaleAt(ctx, x, 800, p.s, () => { card(ctx, x - 150, 700, 300, 200, 40, K.card2, 'rgba(226,194,127,0.35)'); T(ctx, s, x, 840, FN.black(104), K.ink, 'center'); }));
  tile('IBS', 330, pI); tile('CBS', 750, pC); A(ctx, pP.a, () => T(ctx, '+', 540, 838, FN.black(90), K.gold, 'center'));
  const h1 = clamp((u - bt(4)) / 0.4), h2 = clamp((u - bt(5)) / 0.4);
  reveal(ctx, 'Imposto novo', 540, 1110, FN.black(118), K.ink, h1, 'center', 118);
  reveal(ctx, 'no seu aluguel.', 540, 1240, FN.it(124), K.gold, h2, 'center', 124);
  const b = pop(u, bt(6), 0.35); A(ctx, b.a, () => scaleAt(ctx, 540, 1360, b.s, () => chip(ctx, 'A PARTIR DE 2027', 540, 1360, FN.semi(34), K.bg0, K.gold, null, 36, 76)));
  // brilho atravessando o título
  const sw = clamp((u - bt(7)) / 0.45); if (sw > 0 && sw < 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const x = -300 + 1700 * sw; const g = ctx.createLinearGradient(x - 160, 0, x + 160, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.16)'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(0, 1000, W, 300); ctx.restore(); }
};

const BOATOS = ['Reforma tributária: o aluguel vai subir?', 'Proprietário vai pagar imposto novo', 'O inquilino é quem vai pagar a conta', 'Ainda vale a pena ter imóvel alugado?'];
SC.problema = (ctx, u, t) => {
  const h = inUp(u, 0, 0.4, 40);
  A(ctx, h.a, () => { T(ctx, 'O QUE VOCÊ ESTÁ OUVINDO', 540, 330 + h.y, FN.mono(28), K.mute, 'center', 1, 3); T(ctx, 'Todo aluguel vai', 540, 440 + h.y, FN.black(84), K.ink, 'center'); T(ctx, 'ficar mais caro?', 540, 540 + h.y, FN.it(92), K.red, 'center'); });
  // notificações empilhando (uma a cada 2 batidas), comprimem no compasso 3
  const comp = easeInOut(clamp((u - bt(8)) / 0.5));
  BOATOS.forEach((s, i) => {
    const t0 = bt(1 + 2 * i), p = inUp(u, t0, 0.38, 120); if (p.a <= 0) return;
    const y0 = 640 + i * 168, y1 = 640 + i * 22, y = lerp(y0, y1, comp) + p.y, sc = lerp(1, 0.92 - 0.02 * (3 - i), comp);
    const shake = (u > bt(14) && u < bt(16)) ? Math.sin(u * 70 + i) * 6 * clamp((u - bt(14)) / 0.3) : 0;
    A(ctx, p.a * lerp(1, i === 3 ? 1 : 0.55, comp), () => scaleAt(ctx, 540, y + 70, sc, () => {
      card(ctx, 110 + shake, y, 860, 140, 32, '#112848');
      ctx.beginPath(); ctx.arc(190 + shake, y + 70, 34, 0, 6.283); ctx.fillStyle = '#1C3A66'; ctx.fill();
      T(ctx, '!', 190 + shake, y + 86, FN.black(44), K.red, 'center');
      T(ctx, s, 250 + shake, y + 62, FN.semi(34), K.ink); T(ctx, 'agora · nas redes', 250 + shake, y + 108, FN.med(26), K.mute);
      ctx.beginPath(); ctx.arc(920 + shake, y + 44, 9, 0, 6.283); ctx.fillStyle = K.red; ctx.fill();
    }));
  });
  // compassos 3-4: cartão "valor do aluguel" com número em dúvida
  const m = inUp(u, bt(8) + 0.1, 0.45, 80);
  A(ctx, m.a, () => {
    card(ctx, 150, 920 + m.y, 780, 420, 44, K.card2, 'rgba(255,93,99,0.35)');
    T(ctx, 'SEU ALUGUEL EM 2027', 540, 1010 + m.y, FN.mono(28), K.mute, 'center', 1, 3);
    const n = Math.floor(u / BEAT), q = '#$%&?'.split(''), glitch = u < bt(15) ? `R$ ${q[n % 5]}.${q[(n + 2) % 5]}${q[(n + 3) % 5]}${q[(n + 1) % 5]}` : 'R$ ????';
    T(ctx, glitch, 540, 1170 + m.y, FN.black(130), K.ink, 'center');
    const up = Math.exp(-((u % BEAT) / 0.15)); ctx.save(); ctx.translate(800, 1120 + m.y - 14 * up); ctx.beginPath(); ctx.moveTo(0, -40); ctx.lineTo(30, 0); ctx.lineTo(10, 0); ctx.lineTo(10, 36); ctx.lineTo(-10, 36); ctx.lineTo(-10, 0); ctx.lineTo(-30, 0); ctx.closePath(); ctx.fillStyle = K.red; ctx.fill(); ctx.restore();
    chip(ctx, 'mais caro?', 540, 1265 + m.y, FN.semi(32), K.red, 'rgba(255,93,99,0.12)', 'rgba(255,93,99,0.4)');
  });
};

SC.paradigma = (ctx, u, t) => {
  const lab = inUp(u, 0, 0.35, 30); A(ctx, lab.a, () => T(ctx, 'A LÓGICA QUE TODO MUNDO REPETE', 540, 330 + lab.y, FN.mono(28), K.mute, 'center', 1, 3));
  // equação: [Imposto novo] = [Todo proprietário paga]
  const e1 = pop(u, bt(0) + 0.1), e2 = pop(u, bt(1)), e3 = pop(u, bt(2));
  const crack = clamp((u - bt(14)) / 0.25);
  A(ctx, e1.a, () => scaleAt(ctx, 540, 470, e1.s, () => chip(ctx, 'Imposto novo', 540, 470, FN.semi(48), K.ink, K.card2, K.line, 44, 100)));
  A(ctx, e2.a, () => scaleAt(ctx, 540, 590, e2.s, () => {
    T(ctx, '=', 540, 622, FN.black(110), K.gold, 'center');
    if (crack > 0) { ctx.save(); ctx.strokeStyle = K.bg0; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(520, 545); ctx.lineTo(548, 588); ctx.lineTo(530, 600); ctx.lineTo(560, 640); ctx.globalAlpha = crack; ctx.stroke(); ctx.restore(); }
  }));
  A(ctx, e3.a, () => scaleAt(ctx, 540, 720, e3.s, () => chip(ctx, 'Todo proprietário paga', 540, 720, FN.semi(48), '#fff', 'rgba(255,93,99,0.85)', null, 44, 100)));
  // grade 4x3 de casas ficando vermelhas, 2 por batida a partir da batida 4
  for (let i = 0; i < 12; i++) {
    const cx = 255 + (i % 4) * 190, cy = 930 + Math.floor(i / 4) * 190, ap = pop(u, bt(3) + i * 0.04, 0.3);
    const on = clamp((u - (bt(4) + Math.floor(i / 2) * BEAT)) / 0.2), hit = Math.exp(-Math.max(0, u - (bt(4) + Math.floor(i / 2) * BEAT)) / 0.15) * (on > 0 ? 1 : 0);
    A(ctx, ap.a * (1 - 0.6 * crack), () => scaleAt(ctx, cx, cy, ap.s * (1 + 0.15 * hit), () => {
      card(ctx, cx - 75, cy - 75, 150, 150, 30, on > 0.5 ? '#3A1A2A' : K.card, on > 0.5 ? 'rgba(255,93,99,0.5)' : K.line, 0.3);
      icHouse(ctx, cx, cy - 4, 1.25, on > 0.5 ? K.red : K.mute);
      if (on > 0.5) T(ctx, '−R$', cx + 44, cy - 40, FN.semi(22), K.red, 'center');
    }));
  }
  // cursor vai até o "=" e "Será?" bate
  const cu = clamp((u - bt(11)) / 0.9), cx = lerp(900, 572, easeInOut(cu)), cy = lerp(1500, 616, easeInOut(cu));
  cursor(ctx, cx, cy, clamp((u - bt(13.5)) / 0.4), clamp((u - bt(11)) / 0.2) * (1 - clamp((u - bt(15)) / 0.3)));
  const s = pop(u, bt(12), 0.4); A(ctx, s.a, () => scaleAt(ctx, 540, 1550, s.s, () => T(ctx, 'Será?', 540, 1570, FN.it(150), K.gold, 'center')));
};

SC.quebra = (ctx, u, t) => {
  const fl = Math.exp(-u / 0.12); if (fl > 0.02) A(ctx, fl * 0.85, () => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H); });
  const h = pop(u, 0.02, 0.35);
  A(ctx, h.a, () => scaleAt(ctx, 540, 380, h.s, () => { T(ctx, 'Não é', 540, 380, FN.black(110), K.ink, 'center'); T(ctx, 'bem assim.', 540, 500, FN.it(120), K.gold, 'center'); }));
  // janela "Regra para pessoa física"
  const wnd = inUp(u, bt(2), 0.45, 100);
  A(ctx, wnd.a, () => {
    const y0 = 600 + wnd.y; card(ctx, 90, y0, 900, 830, 44, K.card);
    [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(140 + i * 34, y0 + 46, 10, 0, 6.283); ctx.fillStyle = ['#FF5F57', '#FEBC2E', '#28C840'][i]; ctx.fill(); });
    T(ctx, 'Quem paga IBS/CBS no aluguel', 540, y0 + 56, FN.semi(30), K.mute, 'center');
    ctx.fillStyle = K.line; ctx.fillRect(90, y0 + 92, 900, 2);
    T(ctx, 'PESSOA FÍSICA SÓ PAGA SE:', 150, y0 + 160, FN.mono(26), K.gold, 'left', 1, 2);
    const row = (t0, y, icon, l1, l2) => { const r = inUp(u, t0, 0.35, 40); A(ctx, r.a, () => {
      card(ctx, 140, y + r.y, 800, 150, 28, K.card2, K.line, 0.25);
      ctx.beginPath(); ctx.arc(225, y + 75 + r.y, 46, 0, 6.283); ctx.fillStyle = 'rgba(226,194,127,0.14)'; ctx.fill(); icon(225, y + 75 + r.y);
      T(ctx, l1, 300, y + 70 + r.y, FN.black(50), K.ink); T(ctx, l2, 300, y + 116 + r.y, FN.med(28), K.mute); }); };
    const dollar = (x, y) => T(ctx, 'R$', x, y + 14, FN.black(34), K.gold, 'center');
    row(bt(3), y0 + 200, (x, y) => icHouse(ctx, x, y, 0.8, K.gold), 'Mais de 3 imóveis', 'alugados no seu nome');
    const e = pop(u, bt(4), 0.3); A(ctx, e.a, () => scaleAt(ctx, 540, y0 + 375, e.s, () => chip(ctx, 'E', 540, y0 + 375, FN.black(32), K.bg0, K.gold, null, 26, 56)));
    row(bt(5), y0 + 400, dollar, 'Mais de R$ 240 mil', 'por ano em aluguéis');
    const o = pop(u, bt(7), 0.3); A(ctx, o.a, () => { ctx.fillStyle = K.line; ctx.fillRect(160, y0 + 600, 280, 2); ctx.fillRect(640, y0 + 600, 280, 2); scaleAt(ctx, 540, y0 + 600, o.s, () => chip(ctx, 'OU', 540, y0 + 600, FN.black(32), K.gold, 'rgba(226,194,127,0.12)', 'rgba(226,194,127,0.5)', 26, 56)); });
    row(bt(8), y0 + 640, dollar, 'Mais de R$ 288 mil', 'no ano, com qualquer nº de imóveis');
  });
  const r = inUp(u, bt(11), 0.4, 30); A(ctx, r.a, () => { T(ctx, 'Abaixo disso: nada de IBS/CBS.', 540, 1500 + r.y, FN.semi(40), K.green, 'center'); });
  fonte(ctx, 'Fonte: Lei Complementar 214/2025 · limites corrigidos pelo IPCA', clamp((u - bt(4)) / 0.4) * (1 - r.a));
};

// simulador compartilhado por f1 e f2
function simulador(ctx, u, y0, d) {
  // d: { tit, imv, rec, kImv, kRec, click, res, resK, ok }
  card(ctx, 90, y0, 900, 900, 48, K.card);
  [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(140 + i * 34, y0 + 46, 10, 0, 6.283); ctx.fillStyle = ['#FF5F57', '#FEBC2E', '#28C840'][i]; ctx.fill(); });
  T(ctx, 'Simulador IBS/CBS · aluguel', 540, y0 + 56, FN.semi(30), K.mute, 'center'); ctx.fillStyle = K.line; ctx.fillRect(90, y0 + 92, 900, 2);
  const field = (y, label, val, k, active) => {
    T(ctx, label, 150, y, FN.semi(30), K.mute);
    rr(ctx, 140, y + 24, 800, 110, 24); ctx.fillStyle = '#0A1B34'; ctx.fill(); ctx.strokeStyle = active ? K.gold : K.line; ctx.lineWidth = active ? 3 : 2; ctx.stroke();
    typed(ctx, val, 180, y + 100, FN.black(56), K.ink, k, active, u);
  };
  field(y0 + 170, 'Imóveis alugados no seu nome', d.imv, d.kImv, d.kImv > 0 && d.kRec <= 0);
  field(y0 + 350, 'Quanto recebe de aluguel por ano', d.rec, d.kRec, d.kRec > 0 && d.click <= 0);
  // botão
  const press = d.click > 0 && d.click < 1 ? 1 - 0.06 * Math.sin(Math.PI * d.click) : 1;
  scaleAt(ctx, 540, y0 + 600, press, () => { rr(ctx, 140, y0 + 545, 800, 110, 55); ctx.fillStyle = K.gold; ctx.fill(); T(ctx, 'Calcular', 540, y0 + 615, FN.black(44), K.bg0, 'center'); });
  // resultado
  const r = pop(u, d.resT, 0.4);
  A(ctx, r.a, () => scaleAt(ctx, 540, y0 + 770, r.s, () => {
    const col = d.ok ? K.green : K.red; rr(ctx, 140, y0 + 700, 800, 150, 32); ctx.fillStyle = d.ok ? 'rgba(61,220,151,0.12)' : 'rgba(255,93,99,0.12)'; ctx.fill(); ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
    if (d.ok) icCheck(ctx, 225, y0 + 775, 46, K.bg0, clamp((u - d.resT) / 0.4), col); else icX(ctx, 225, y0 + 775, 46, K.bg0, col);
    T(ctx, d.res, 300, y0 + 768, FN.black(48), col); T(ctx, d.res2, 300, y0 + 816, FN.med(28), K.mute);
  }));
}
function featHead(ctx, u, n, tit) {
  const a = inUp(u, 0, 0.35, 30);
  A(ctx, a.a, () => { T(ctx, n, 540, 300 + a.y, FN.mono(28), K.gold, 'center', 1, 4); T(ctx, tit, 540, 410 + a.y, FN.black(92), K.ink, 'center'); });
}
SC.f1 = (ctx, u, t) => {
  featHead(ctx, u, '01 — QUEM PAGA', 'Quem paga');
  const w = inUp(u, 0.05, 0.4, 80);
  A(ctx, w.a, () => simulador(ctx, u, 500 + w.y, {
    imv: '5', kImv: clamp((u - bt(1)) / 0.15), rec: 'R$ 300.000', kRec: clamp((u - bt(2)) / 0.8), click: clamp((u - bt(6)) / 0.3),
    resT: bt(6) + 0.25, ok: false, res: 'Paga IBS/CBS', res2: 'a partir de 2027 · com nota fiscal'
  }));
  // cursor indo até o botão
  const cu = clamp((u - bt(4.5)) / 0.7); cursor(ctx, lerp(880, 600, easeInOut(cu)), lerp(1400, 1110, easeInOut(cu)), clamp((u - bt(6)) / 0.4), clamp((u - bt(4.5)) / 0.2) * (1 - clamp((u - bt(8.5)) / 0.3)));
  fonte(ctx, 'Exemplo ilustrativo · regra: LC 214/2025', clamp((u - bt(6)) / 0.4));
};
SC.f2 = (ctx, u, t) => {
  featHead(ctx, u, '02 — QUEM NÃO PAGA', 'Quem não paga');
  simulador(ctx, u, 500, {
    imv: '2', kImv: clamp((u - bt(1)) / 0.15), rec: 'R$ 60.000', kRec: clamp((u - bt(2)) / 0.6), click: clamp((u - bt(5)) / 0.3),
    resT: bt(5) + 0.25, ok: true, res: 'Não paga. Nada muda.', res2: 'segue só no Imposto de Renda'
  });
  cursor(ctx, 610, 1120, clamp((u - bt(5)) / 0.4), clamp((u - bt(3.5)) / 0.2) * (1 - clamp((u - bt(7)) / 0.3)));
  // confete dourado/verde no resultado
  const ck = u - (bt(5) + 0.25);
  if (ck > 0 && ck < 1.6) { const R = rng(11); for (let i = 0; i < 46; i++) { const ang = R() * 6.283, sp = 300 + R() * 520, x = 540 + Math.cos(ang) * sp * ck, y = 1270 + Math.sin(ang) * sp * ck + 500 * ck * ck; A(ctx, 1 - ck / 1.6, () => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang + ck * 6); ctx.fillStyle = i % 2 ? K.gold : K.green; ctx.fillRect(-7, -3, 14, 6); ctx.restore(); }); } }
  fonte(ctx, 'Exemplo ilustrativo · regra: LC 214/2025', clamp((u - bt(5)) / 0.4));
};
SC.f3 = (ctx, u, t) => {
  featHead(ctx, u, '03 — OS DESCONTOS', 'Os descontos');
  const w = inUp(u, 0.05, 0.4, 80);
  A(ctx, w.a, () => {
    const y0 = 500 + w.y; card(ctx, 90, y0, 900, 760, 48, K.card);
    T(ctx, 'QUANTO DA ALÍQUOTA CHEIA VOCÊ PAGA', 540, y0 + 80, FN.mono(26), K.mute, 'center', 1, 2);
    const bars = [['Alíquota cheia', 1, K.dim, ''], ['Aluguel +90 dias', 0.3, K.gold, '−70%'], ['Temporada (Airbnb)', 0.6, K.violet, '−40%']];
    bars.forEach(([lab, v, col, tag], i) => {
      const x = 200 + i * 270, base = y0 + 610, hmax = 400, k = easeOut(clamp((u - bt(1 + i)) / 0.5)), hh = hmax * v * k;
      rr(ctx, x, base - hmax, 140, hmax, 20); ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      if (hh > 1) { rr(ctx, x, base - hh, 140, hh, 20); const g = ctx.createLinearGradient(0, base - hh, 0, base); g.addColorStop(0, col); g.addColorStop(1, shade(col.length === 7 ? col : '#5D6B85', -25)); ctx.fillStyle = g; ctx.fill(); }
      T(ctx, Math.round(v * 100 * k) + '%', x + 70, base - hh - 22, FN.black(44), K.ink, 'center', clamp(k * 3));
      T(ctx, lab, x + 70, base + 56, FN.semi(26), K.mute, 'center');
      if (tag) { const p = pop(u, bt(2 + i) + 0.3, 0.3); A(ctx, p.a, () => scaleAt(ctx, x + 70, base - hmax - 30, p.s, () => chip(ctx, tag, x + 70, base - hmax - 30, FN.black(32), K.bg0, col, null, 20, 56))); }
    });
  });
  const c = pop(u, bt(6), 0.4);
  A(ctx, c.a, () => scaleAt(ctx, 540, 1360, c.s, () => { card(ctx, 140, 1300, 800, 120, 60, '#16365F', 'rgba(61,220,151,0.5)', 0.3); T(ctx, '+ R$ 600 por imóvel/mês', 540, 1360, FN.black(44), K.green, 'center'); T(ctx, 'descontados da base no aluguel residencial', 540, 1402, FN.med(24), K.mute, 'center'); }));
  fonte(ctx, 'Fontes: LC 214/2025 · Seu Dinheiro (26/02/2026)', clamp((u - bt(1)) / 0.4));
};
SC.f4 = (ctx, u, t) => {
  featHead(ctx, u, '04 — O QUE NÃO MUDA', 'O que não muda');
  const items = [['Imposto de Renda', 'continua igual: o imposto novo não substitui o IR'], ['Abaixo do limite?', 'você segue só no CPF, sem nota fiscal'], ['CNPJ', 'só para quem se enquadra, a partir de 2027']];
  items.forEach(([a, b], i) => {
    const p = inUp(u, bt(1 + 2 * i), 0.4, 70), y = 560 + i * 270 + p.y;
    A(ctx, p.a, () => { card(ctx, 110, y, 860, 220, 40, K.card); icCheck(ctx, 220, y + 110, 56, K.bg0, clamp((u - bt(1 + 2 * i) - 0.15) / 0.4), K.green); T(ctx, a, 310, y + 100, FN.black(52), K.ink); T(ctx, b, 310, y + 150, FN.med(27), K.mute); });
  });
  fonte(ctx, 'Fontes: Fenacon (22/07/2026) · Seu Dinheiro', clamp((u - bt(1)) / 0.4));
};
SC.cta = (ctx, u, t) => {
  const h = pop(u, 0.02, 0.4);
  A(ctx, h.a * (1 - clamp((u - bt(10)) / 0.35)), () => scaleAt(ctx, 540, 420, h.s, () => { T(ctx, 'Você se', 540, 400, FN.black(110), K.ink, 'center'); T(ctx, 'enquadra?', 540, 520, FN.it(124), K.gold, 'center'); }));
  // compositor de comentário
  const c = inUp(u, bt(2), 0.4, 80), out = clamp((u - bt(10)) / 0.35);
  A(ctx, c.a * (1 - out), () => {
    const y0 = 700 + c.y; card(ctx, 90, y0, 900, 520, 44, K.card);
    T(ctx, 'Comentários', 540, y0 + 70, FN.semi(32), K.ink, 'center'); ctx.fillStyle = K.line; ctx.fillRect(90, y0 + 104, 900, 2);
    const posted = u > bt(7);
    if (posted) { const p = pop(u, bt(7), 0.35); A(ctx, p.a, () => scaleAt(ctx, 300, y0 + 200, p.s, () => {
      ctx.beginPath(); ctx.arc(180, y0 + 190, 40, 0, 6.283); ctx.fillStyle = '#2A4A7A'; ctx.fill(); T(ctx, 'você', 240, y0 + 175, FN.semi(28), K.mute); T(ctx, 'IMPOSTO', 240, y0 + 228, FN.black(52), K.ink);
      const hk = pop(u, bt(8), 0.3); A(ctx, hk.a, () => scaleAt(ctx, 900, y0 + 200, hk.s, () => { ctx.save(); ctx.translate(900, y0 + 200); ctx.scale(1.6, 1.6); ctx.beginPath(); ctx.moveTo(0, 8); ctx.bezierCurveTo(-18, -6, -12, -20, 0, -10); ctx.bezierCurveTo(12, -20, 18, -6, 0, 8); ctx.fillStyle = K.red; ctx.fill(); ctx.restore(); }));
    })); }
    // campo de digitação
    rr(ctx, 130, y0 + 380, 700, 100, 50); ctx.fillStyle = '#0A1B34'; ctx.fill(); ctx.strokeStyle = posted ? K.line : K.gold; ctx.lineWidth = 2; ctx.stroke();
    if (!posted) typed(ctx, 'IMPOSTO', 170, y0 + 450, FN.black(48), K.ink, clamp((u - bt(3)) / (bt(3.5))), true, u);
    else T(ctx, 'Adicione um comentário…', 170, y0 + 445, FN.med(32), K.dim);
    const sp = u > bt(6.5) && u < bt(7.2) ? 0.9 : 1; scaleAt(ctx, 900, y0 + 430, sp, () => { ctx.beginPath(); ctx.arc(900, y0 + 430, 50, 0, 6.283); ctx.fillStyle = K.gold; ctx.fill(); ctx.save(); ctx.translate(900, y0 + 430); ctx.beginPath(); ctx.moveTo(-18, -16); ctx.lineTo(22, 0); ctx.lineTo(-18, 16); ctx.lineTo(-10, 0); ctx.closePath(); ctx.fillStyle = K.bg0; ctx.fill(); ctx.restore(); });
    cursor(ctx, lerp(760, 905, easeInOut(clamp((u - bt(5)) / 0.6))), lerp(1350, y0 + 440, easeInOut(clamp((u - bt(5)) / 0.6))), clamp((u - bt(6.5)) / 0.4), clamp((u - bt(5)) / 0.2) * (1 - clamp((u - bt(8)) / 0.3)));
  });
  // notificação de direct
  const dm = inUp(u, bt(8.5), 0.4, -60);
  A(ctx, dm.a * (1 - out), () => { card(ctx, 140, 1270 + dm.y, 800, 130, 34, '#16365F', 'rgba(226,194,127,0.4)', 0.3); ctx.beginPath(); ctx.arc(215, 1335 + dm.y, 38, 0, 6.283); ctx.fillStyle = K.gold; ctx.fill(); icCheck(ctx, 215, 1335 + dm.y, 30, K.bg0, 1); T(ctx, 'Resumo enviado no direct', 280, 1328 + dm.y, FN.semi(34), K.ink); T(ctx, '@vistabroker.perioto', 280, 1372 + dm.y, FN.med(26), K.gold); });
  // cartão final
  const e = pop(u, bt(10) + 0.1, 0.45);
  A(ctx, e.a, () => scaleAt(ctx, 540, 900, e.s, () => {
    T(ctx, 'Comenta', 540, 520, FN.black(96), K.ink, 'center'); chip(ctx, 'IMPOSTO', 540, 640, FN.black(80), K.bg0, K.gold, null, 50, 130);
    T(ctx, 'que eu te mando o resumo', 540, 790, FN.semi(46), K.mute, 'center');
    ctx.fillStyle = K.line; ctx.fillRect(240, 880, 600, 2);
    T(ctx, 'Pedro Perioto', 540, 990, FN.black(76), K.ink, 'center'); T(ctx, 'Corretor de imóveis · CRECI 258729', 540, 1050, FN.med(32), K.mute, 'center');
    chip(ctx, '@vistabroker.perioto', 540, 1140, FN.semi(36), K.gold, 'rgba(226,194,127,0.1)', 'rgba(226,194,127,0.5)', 36, 76);
    if (IMG.vista) { rr(ctx, 400, 1220, 280, 150, 28); ctx.fillStyle = '#fff'; ctx.fill(); ctx.drawImage(IMG.vista, 425, 1235, 230, 119); }
  }));
  fonte(ctx, 'Fontes: LC 214/2025 · Fenacon · Seu Dinheiro · ConJur (21/10/2026)', clamp((u - bt(11)) / 0.4));
};

// ---------- transições entre seções ----------
function sectionAt(t) { for (const s of SEC) if (t >= s.a && t < s.b) return s; return SEC[SEC.length - 1]; }
function drawSection(ctx, s, t) { const u = t - s.a; SC[s.n](ctx, u, t); }

// ---------- legendas (preenchidas quando a narração chegar: voz/tempos.js) ----------
function captions(ctx, t) {
  if (!window.VOZ || !VOZ.w) return;
  const w = VOZ.w; let i = w.findIndex(x => t >= x[1] - 0.05 && t < x[2] + 0.25); if (i < 0) return;
  const g0 = i - (i % 3), grp = w.slice(g0, g0 + 3).filter(x => x[1] - 0.05 <= t); if (!grp.length) return;
  ctx.save(); ctx.font = FN.black(58); const s = grp.map(x => x[0]).join(' '), wd = ctx.measureText(s).width;
  rr(ctx, 540 - wd / 2 - 34, 1600, wd + 68, 96, 48); ctx.fillStyle = 'rgba(5,13,26,0.72)'; ctx.fill();
  let x = 540 - wd / 2; grp.forEach((g, j) => { const ww = ctx.measureText(g[0] + ' ').width; T(ctx, g[0], x, 1667, FN.black(58), j === grp.length - 1 ? K.gold : K.ink); x += ww; });
  ctx.restore();
}

// ---------- render ----------
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  background(ctx, t);
  // soco de câmera no 1º tempo de cada compasso
  const kb = (t % BAR), punch = 0.012 * Math.exp(-kb / 0.18);
  const s = sectionAt(t), prev = SEC[SEC.indexOf(s) - 1], into = t - s.a;
  ctx.save(); scaleAt(ctx, 540, 960, 1 + punch, () => {
    if (prev && into < 0.28) {
      // transição: a seção anterior sobe e some, a nova entra de baixo (whip vertical)
      const k = easeInOut(into / 0.28);
      ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(0, -260 * k); drawSection(ctx, prev, prev.b - 0.001); ctx.restore();
      ctx.save(); ctx.globalAlpha = k; ctx.translate(0, 260 * (1 - k)); drawSection(ctx, s, t); ctx.restore();
      // linha dourada atravessando
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = `rgba(226,194,127,${0.5 * (1 - Math.abs(k - 0.5) * 2)})`; ctx.fillRect(0, lerp(1800, 120, k), W, 6); ctx.restore();
    } else drawSection(ctx, s, t);
  }); ctx.restore();
  captions(ctx, t);
  // fade de entrada/saída
  const fin = 1 - clamp(t / 0.25), fout = clamp((t - (DUR - 0.5)) / 0.5);
  if (fin + fout > 0) { ctx.fillStyle = `rgba(0,0,0,${Math.max(fin, fout)})`; ctx.fillRect(0, 0, W, H); }
  grain(ctx, 0.05);
}
