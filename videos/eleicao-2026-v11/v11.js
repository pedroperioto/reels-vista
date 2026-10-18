// ======================= v11 — "5 conselhos": sequência, cenas novas, legendas por zona =======================
// Reaproveita as animações da v9/v10 (main.js) e do v6 (old6.js) por "time-warp": cada palavra da fala nova
// é ligada à palavra equivalente da fala antiga, e a animação antiga é tocada no ritmo da fala nova.
const OLD = Object.fromEntries(SCENES.map(s => [s.name, s]));
const ASSETS2 = Promise.all([['urna', 'gancho-urna'], ['calc', 'gancho-calculadora'], ['aerea', 'm2-aerea-radial'], ['aperto', 'estoque-aperto-mao'], ['chaves', 'parcela-chaves-casa'],
  ['capacete', 'mapa-obra-capacete'], ['equipe', 'mapa-obra-equipe'], ['tijolo', 'mapa-tijolo']].map(([k, f]) => loadImg(k, `fotos-banco/${f}.jpg`)));

const TX = {
  gancho: 'A eleição vai fazer o imóvel despencar ou disparar? Tem gente esperando o resultado pra comprar. Será que vale a pena?',
  governos: 'Primeiro conselho: não tente adivinhar a eleição. ' + OLD.governos.text,
  entrevistas: 'Na Globo, Lula disse que o jeito de resolver o fiscal é fazer a economia crescer. Flávio disse que o maior ajuste é tirar o Lula, e promete cortar ao menos dez ministérios. Quem te convence mais?',
  mercado: 'Depois do primeiro turno, estrangeiros colocaram dezesseis bilhões na Bolsa em sete pregões. Mas os juros longos, que pesam no financiamento, voltaram a subir com o empate técnico.',
  virada: 'Mas enquanto todo mundo olha a política, pouca gente olha pra este gráfico.',
  m2: 'Segundo conselho: olhe o histórico. O metro quadrado em São Paulo subiu com Lula, Dilma, Temer, Bolsonaro e de novo com Lula. Em qualquer governo, quem comprou tijolo não ficou refém da eleição. No Tatuapé, lançamentos já passam de quinze mil o metro quadrado.',
  corrida: 'Terceiro: aluguel não é neutro. Em doze meses, subiu nove por cento, quase o dobro da inflação, e mais que o imóvel.',
  conta: OLD6.PLAN.conta[2],
  estoque: 'Quarto: com estoque alto, negocie. No médio e alto padrão, as vendas caíram dezoito por cento e o estoque levaria treze meses pra acabar.',
  parcela: 'Quinto: faça a conta da parcela. Ela cai, e no oitavo ano fica menor que o aluguel. E no fim, o patrimônio é seu. Mas só vale se couber no seu bolso.',
  mapa: 'Por último, olhe pra onde a cidade vai: o Eixo Platina já mistura moradia, trabalho e lazer, e o metrô está chegando à Anália Franco. Governo passa. O tijolo fica.',
  cta: 'Conhece alguém esperando a eleição? Manda pra ele. Curte se foi útil e comenta: você compraria antes ou depois da eleição?',
};
// src: 'new' = cena nova; 'v9' = main.js; 'o6' = old6.js · intro: nº de palavras do cartão de conselho · anchors: [nova, antiga] (P = fim do cartão)
const V11 = [
  { name: 'gancho', src: 'new', lead: 0.3, hold: 1.0 },
  { name: 'governos', src: 'v9', lead: 0.3, hold: 0.7, intro: 7 },
  { name: 'entrevistas', src: 'v9', lead: 0.3, hold: 0.9, tail: 'Quem' },
  { name: 'mercado', src: 'v9', lead: 0.3, hold: 1.7, anchors: [[0, ['w9', -0.02]], ['w0', ['w9', 0.06]], ['w4', 'w9'], ['w5', 'w10'], ['w6', 'w11'], ['w7', 'w12'], ['w8', ['w13', 0.2]], ['w9', 'w14'],
    ['w10', 'w15'], ['w11', 'w16'], ['w12', 'w17'], ['w13', 'w18'], ['w15', 'w19'], ['w16', 'w20'], ['w17', 'w21'], ['w18', 'w22'], ['w19', 'w23'], ['w20', ['w24', 0.4]],
    ['w21', 'w28'], ['w22', 'w29'], ['w23', 'w30'], ['w24', 'w31'], ['w25', 'w32'], ['w26', 'w33'], ['w27', 'w34'], ['e', 'e']] },
  { name: 'virada', src: 'new', lead: 0.35, hold: 0.5 },
  { name: 'm2', src: 'v9', lead: 0.35, hold: 0.8, anchors: [[0, 0.15], ['w5', ['w2', -0.2]], ['w7', 'w3'], ['w9', 'w4'], ['w10', ['w8', -0.2]], ['w11', 'w10'], ['w12', 'w11'], ['w13', 'w12'], ['w14', 'w14'],
    ['w15', 'w16'], ['w16', 'w18'], ['w17', 'w19'], ['w18', 'w20'], ['w19', 'w21'], ['w20', 'w22'], ['w21', 'w23'], [['w32', 0.3], ['w24', -0.08]], ['w33', 'w24'], ['w34', 'w26'], ['w35', 'w27'], ['w36', 'w28'],
    ['w37', 'w29'], ['w38', 'w30'], ['w39', 'w31'], ['w40', 'w32'], ['w41', 'w33'], ['w42', 'w34'], ['w43', 'w35'], ['e', 'e']] },
  { name: 'corrida', src: 'o6', lead: 0.3, hold: 0.7, intro: 5, anchors: [['P', 0.3], ['w5', 0.8], ['w9', 2.0], ['w11', 2.9], ['w12', 3.15], ['w16', 3.36], ['w17', 3.42], ['e', 'e']] },
  { name: 'conta', src: 'o6', lead: 0.45, hold: 0.6 },
  { name: 'estoque', src: 'o6', lead: 0.3, hold: 2.1, intro: 5 },
  { name: 'parcela', src: 'o6', lead: 0.3, hold: 1.0, intro: 6, tail: 'Mas' },
  { name: 'mapa', src: 'v9', lead: 0.3, hold: 1.7, intro: 8, anchors: [['P', 6.62], ['w9', 'w14'], ['w13', 'w19'], ['w14', 'w20'], ['w16', ['w22', 0.05]], ['J', ['w16', 0.32], 24.8],
    ['w19', 'w56'], ['w20', 'w57'], ['w21', 'w58'], ['w23', 'w60'], ['w24', 'w61'], ['w25', 'w62'], ['w26', 'w63'], ['w27', 'w64'], ['w29', 'w66'], ['e', 'e']] },
  { name: 'cta', src: 'new', lead: 0.4, hold: 3.8 },
];
function refT(r, wt, d, P) { if (Array.isArray(r)) return refT(r[0], wt, d, P) + r[1]; if (typeof r === 'number') return r; if (r === 'e') return d; if (r === 'P') return P; return wt[+r.slice(1)]; }
const nrm = (w) => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
function lcs(a, b) { const n = a.length, m = b.length, A = a.map(nrm), B = b.map(nrm), L = [...Array(n + 1)].map(() => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = []; let i = 0, j = 0; while (i < n && j < m) { if (A[i] === B[j]) { out.push([i, j]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; } return out; }
function pw(P, x, i0, i1) { if (!P.length) return x; if (P.length === 1) return P[0][i1] + x - P[0][i0];
  if (x <= P[0][i0]) return P[0][i1] + (x - P[0][i0]);
  for (let k = 1; k < P.length; k++) if (x <= P[k][i0]) { const f = (x - P[k - 1][i0]) / ((P[k][i0] - P[k - 1][i0]) || 1); return lerp(P[k - 1][i1], P[k][i1], f); }
  const n = P.length - 1; return P[n][i1] + (x - P[n][i0]); }
const SEQ = []; { let a = 0; V11.forEach(e => {
  const text = TX[e.name], { o, end } = wtimes(e.lead, text), d = Math.round((end + e.hold) * 10) / 10, P = e.intro ? o[e.intro] - 0.35 : 0;
  let old = null, pts = null, jump = null;
  if (e.src !== 'new') {
    old = e.src === 'o6' ? { d: OLD6.PLAN[e.name][0], wt: OLD6.wtimes(OLD6.PLAN[e.name][1], OLD6.PLAN[e.name][2]), text: OLD6.PLAN[e.name][2] } : OLD[e.name];
    if (e.anchors) { pts = []; e.anchors.forEach(p => { if (p[0] === 'J') { const tn = refT(p[1], o, d, P), from = pw(pts, tn, 0, 1); jump = { tn, to: p[2], from }; pts.push([tn - 1e-4, from], [tn, p[2]]); }
      else pts.push([refT(p[0], o, d, P), refT(p[1], old.wt, old.d, P)]); }); }
    else { const nw = text.split(' '), ow = old.text.split(' '), k0 = e.intro || 0, ti = e.tail ? nw.indexOf(e.tail, k0) : nw.length;
      pts = [[P, 0]]; lcs(nw.slice(k0, ti), ow).forEach(([i, j]) => pts.push([o[i + k0], old.wt[j]]));
      if (e.tail) { const hv = old.d - 0.6; pts.push([o[ti] - 0.25, hv], [d - 0.45, hv]); }
      pts.push([d, old.d]); }
    pts.sort((x, y) => x[0] - y[0]);
    const cl = []; pts.forEach(p => { if (!cl.length || (p[0] > cl[cl.length - 1][0] && (p[1] >= cl[cl.length - 1][1] || (jump && Math.abs(p[0] - jump.tn) < 1e-3)))) cl.push(p); }); pts = cl;
  }
  SEQ.push({ name: e.name, src: e.src, a, b: a + d, d, lead: e.lead, text, wt: o, P, intro: e.intro || 0, pts, old, jump }); a += d; }); }
DUR = Math.round(SEQ[SEQ.length - 1].b * 100) / 100;
const SQ = Object.fromEntries(SEQ.map(s => [s.name, s]));
const DARK = { mercado: 1, corrida: 1, conta: 1 };
const HOFF = { m2: 1, mapa: 1 };

// ---------- utilidades novas ----------
function imgCard(ctx, key, x, y, w, h, r, z = 1, fx = 0.5, fy = 0.5, sh = 0.18) {
  if (sh) soft(ctx, x, y, w, h, r, sh, 70, 28);
  const im = IMG[key]; let map = null; ctx.save(); ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip();
  if (im) { const s = Math.max(w / im.width, h / im.height) * z, iw = im.width * s, ih = im.height * s, dx = clamp(x + w / 2 - fx * iw, x + w - iw, x), dy = clamp(y + h / 2 - fy * ih, y + h - ih, y);
    ctx.drawImage(im, dx, dy, iw, ih); map = (px, py) => [dx + px * s, dy + py * s]; map.s = s; } else { ctx.fillStyle = '#E3E3E8'; ctx.fillRect(x, y, w, h); }
  ctx.restore(); return map; }
function slamT(ctx, s, x, y, font, col, k, size) { if (k <= 0) return; const sc = lerp(1.45, 1, easeOut(clamp(k * 1.7))); ctx.save(); ctx.globalAlpha *= clamp(k * 5); ctx.translate(x, y); ctx.scale(sc, sc);
  ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,255,255,0.9)'; ctx.lineWidth = size * 0.12; ctx.strokeText(s, 0, 0); ctx.fillStyle = col; ctx.fillText(s, 0, 0); ctx.restore(); }
function arrow(ctx, x, y, len, dir, col, a = 1, wd = 34) { if (a <= 0 || len <= 2) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.translate(x, y); if (dir < 0) ctx.scale(1, -1);
  shadowed(ctx, () => { ctx.beginPath(); ctx.moveTo(-wd / 2, 0); ctx.lineTo(wd / 2, 0); ctx.lineTo(wd / 2, -len + wd * 1.4); ctx.lineTo(wd * 1.4, -len + wd * 1.4); ctx.lineTo(0, -len); ctx.lineTo(-wd * 1.4, -len + wd * 1.4); ctx.lineTo(-wd / 2, -len + wd * 1.4); ctx.closePath(); ctx.fill(); }, 0.2, 16, 6); ctx.restore(); }
function label(ctx, s, y, col, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; ctx.font = F.mono(28); try { ctx.letterSpacing = '5px'; } catch (e) { } const w = ctx.measureText(s).width;
  ctx.fillStyle = col; ctx.fillRect(540 - w / 2 - 70, y - 11, 46, 3); ctx.fillRect(540 + w / 2 + 24, y - 11, 46, 3); ctx.textAlign = 'center'; ctx.fillText(s, 540, y); ctx.restore(); }
function xfadeWhip(ctx, k, A_, B_) { const e = easeInOut(clamp(k)), b = Math.sin(Math.PI * clamp(k)) * 10;
  if (e < 1) { ctx.save(); ctx.translate(-W * e, 0); if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`; A_(); ctx.restore(); }
  if (e > 0) { ctx.save(); ctx.translate(W * (1 - e), 0); if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`; B_(); ctx.restore(); } }

// ---------- cenas novas ----------
const NEW = {}, INTRO = {}, OVER = {};
// GANCHO: urna → fachada (despencar / disparar) → Rafael + cartas (a pergunta)
function urnaCard(ctx, u, w) { const z = lerp(1.0, 1.25, easeInOut(prog(u, 0, w[3]))); const m = imgCard(ctx, 'urna', 110, 600, 860, 700, 44, z, 0.36, 0.52);
  if (!m) return; const [x0, y0] = m(124, 228), [x1, y1] = m(428, 400); ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sc = (x1 - x0) / 300;
  T(ctx, '2º TURNO', cx, cy + 4 * sc, F.black(52 * sc), '#E9EEF5', 'center', prog(u, w[0] - 0.1, w[0] + 0.25), 52 * sc, 280 * sc); T(ctx, '25 · OUTUBRO', cx, cy + 46 * sc, F.mono(20 * sc), '#9DB0C8', 'center', prog(u, w[1], w[1] + 0.3), 20 * sc, 280 * sc, 2);
  ctx.restore();
  const [gx, gy] = m(586, 371), pu = prog(u, w[2], w[2] + 0.15) * (0.6 + 0.4 * Math.sin(u * 12)); if (pu > 0) { ctx.save(); ctx.globalAlpha = pu * 0.7; const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, 70 * m.s); g.addColorStop(0, 'rgba(120,255,140,0.9)'); g.addColorStop(1, 'rgba(120,255,140,0)'); ctx.fillStyle = g; ctx.fillRect(gx - 90 * m.s, gy - 90 * m.s, 180 * m.s, 180 * m.s); ctx.restore(); } }
function facadeCard(ctx, u, w) { const X = 110, Y = 600, Wc = 860, Hc = 700, tDn = w[6] - 0.2, tUp = w[7] - 0.05;
  const up = easeOut(prog(u, tUp, tUp + 0.5)), dn = easeIn(prog(u, tDn, tDn + 0.35)) * (1 - easeInOut(prog(u, tUp - 0.05, tUp + 0.25))), shake = (u > tDn + 0.3 && u < tDn + 0.7) ? Math.sin(u * 70) * 8 * (1 - prog(u, tDn + 0.3, tDn + 0.7)) : 0;
  soft(ctx, X, Y, Wc, Hc, 44, 0.16, 70, 28); ctx.save(); ctx.beginPath(); ctx.roundRect(X, Y, Wc, Hc, 44); ctx.clip();
  const sk = ctx.createLinearGradient(0, Y, 0, Y + Hc); sk.addColorStop(0, mixc(mixc('#BFD6EE', '#F2C4BE', dn), '#BDE8C8', up)); sk.addColorStop(1, '#F4F1EA'); ctx.fillStyle = sk; ctx.fillRect(X, Y, Wc, Hc);
  ctx.translate(shake, 0); const z = 1 + 0.07 * prog(u, w[3] - 0.2, w[9]); ctx.translate(540, 980); ctx.scale(z, z); ctx.translate(-540, -980);
  ctx.fillStyle = '#E9E1D2'; ctx.fillRect(230, Y + 50, 620, Hc); ctx.fillStyle = '#DCD1BD'; ctx.fillRect(230, Y + 50, 620, 22); ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.fillRect(810, Y + 50, 40, Hc);
  for (let r = 0; r < 6; r++) for (let c = 0; c < 4; c++) { const wx = 268 + c * 146, wy = Y + 104 + r * 118; ctx.fillStyle = '#9FB9D4'; ctx.fillRect(wx, wy, 100, 74); ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.fillRect(wx + 10, wy + 8, 20, 58); ctx.fillStyle = '#CFC3AD'; ctx.fillRect(wx - 10, wy + 74, 120, 9); }
  // placa VENDE-SE
  ctx.save(); ctx.translate(540, 860); ctx.rotate(0.025 * Math.sin(u * 3.2) + (dn > 0 ? 0.05 * Math.sin(u * 30) * (1 - dn) : 0)); ctx.strokeStyle = '#6B6B70'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-200, -60); ctx.lineTo(-170, 30); ctx.moveTo(200, -60); ctx.lineTo(170, 30); ctx.stroke();
  shadowed(ctx, () => { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(-280, 30, 560, 250, 16); ctx.fill(); }, 0.22, 26, 12); ctx.strokeStyle = '#D62828'; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-262, 48, 524, 214, 10); ctx.stroke();
  T(ctx, 'VENDE-SE', 0, 182, F.black(104), '#D62828', 'center', 1, 104, 480); T(ctx, 'APARTAMENTO', 0, 236, F.semi(30), '#3A3A3C', 'center', 1, 30, 400, 4); ctx.restore();
  // etiqueta de preço: despenca / dispara
  const ty = 1150 + 150 * dn - 330 * up, tx = 790, col = up > 0.05 ? GRN : dn > 0.05 ? '#D62828' : GOLDA;
  ctx.save(); ctx.translate(tx, ty); ctx.rotate(-0.25 + 0.5 * dn - 0.15 * up); shadowed(ctx, () => { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-70, -44); ctx.lineTo(90, -44); ctx.lineTo(130, 0); ctx.lineTo(90, 44); ctx.lineTo(-70, 44); ctx.closePath(); ctx.fill(); }, 0.25, 18, 8);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(96, 0, 10, 0, 6.283); ctx.fill(); T(ctx, 'PREÇO', 10, 13, F.black(38), '#fff', 'center', 1, 38); ctx.restore();
  arrow(ctx, 300, 1000, 260 * easeOut(clamp(dn * 1.3)), -1, '#D62828', dn); arrow(ctx, 300, 1230, 300 * easeOut(up), 1, GRN, up);
  ctx.restore(); if (up > 0.6) sparkle(ctx, tx, ty, u, tUp + 0.35, 0.8); }
NEW.gancho = (ctx, u, s) => { const w = s.wt, d = s.d; BGS.gancho(ctx);
  const tB = w[3] - 0.15, tD = w[9] - 0.32, ug = u - tD;
  const tN = w[9] - 0.05, tPull = w[11] - 0.1, tType = w[13], tSend = w[16] + 0.12, tOut = w[17] + 0.3;
  // ---- cartas + notificação (a pergunta do Rafael)
  if (u > tD - 0.05) {
    const dof = easeInOut(prog(u, tN - 0.1, tN + 0.5)) * (1 - easeInOut(prog(u, tOut, tOut + 0.6))), gone = easeIn(prog(u, d - 0.85, d - 0.25)), settle = 1 - easeInOut(prog(u, d - 1.0, d - 0.2));
    const kL = SPR(ug + 0.05, 2.2, 0.5), kR = SPR(ug - 0.08, 2.2, 0.5), push = 1 + 0.04 * prog(u, tD, d - 1) * settle - 0.08 * dof, fl = (p) => Math.sin(u * 1.6 + p) * 8 * settle;
    const cy = 1000 - 34 * dof, lx = 330 - gone * 760 - 20 * dof, rx = 750 + gone * 760 + 20 * dof, bl = dof * 8 + gone * 10;
    ctx.save(); ctx.translate(540, 1000); ctx.scale(push, push); ctx.translate(-540, -1000);
    candCard(ctx, 'lula', lx - (1 - clamp(kL)) * 220, cy + fl(0), -0.05 - (1 - clamp(kL)) * 0.3 + Math.sin(u * 1.1) * 0.01, lerp(1.25, 1, clamp(kL, 0, 1.1)), clamp(kL * 4) * (1 - gone * 0.6), (1 - clamp(kL)) * 16 + bl);
    const tf = w[19] - 0.15, kf = easeInOut(prog(u, tf, tf + 0.55)), fx_ = Math.cos(kf * Math.PI);
    if (kf >= 1) candCard(ctx, 'jair', rx + 90 * easeOut(prog(u, tf + 0.5, tf + 1.2)), cy + 20, 0.14, 0.92, 0.35 * (1 - gone), 10);
    candCard(ctx, kf < 0.5 ? 'jair' : 'flavio', rx + (1 - clamp(kR)) * 220, cy + fl(2) - Math.sin(kf * Math.PI) * 40, 0.05 + (1 - clamp(kR)) * 0.3 - Math.sin(u * 1.2) * 0.01, lerp(1.25, 1, clamp(kR, 0, 1.1)), clamp(kR * 4) * (1 - gone * 0.6), (1 - clamp(kR)) * 16 + bl, Math.max(0.02, Math.abs(fx_)));
    ctx.restore();
    xDot(ctx, 540, lerp(1000 + (cy + fl(1) - 1000) * push, 1000, 1 - settle), 62 * clamp(SPR(ug - 0.15, 2, 0.5), 0, 1.2) * lerp(push, 1, 1 - settle));
    const kp = prog(u, w[20] - 0.05, w[20] + 0.4); pop(ctx, kp, 540, 640, () => spill(ctx, '2º turno · 25 de outubro', 540, 640, F.semi(34), '#fff', NAVY, 76, 40, 1 - gone));
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
      const dragging = prog(u, tPull - 0.05, tPull + 0.5) > 0 && u < tPull + 0.55 ? 1 : 0;
      const tp = cursorPath(u, [[tPull - 0.45, 540, 560], [tPull - 0.05, 540, 560], [tPull + 0.55, 540, 680], [tSend - 0.35, 915, 852], [tSend + 0.25, 915, 852]]);
      touch(ctx, tp.x, tp.y, u, [tPull - 0.05, tSend], clamp((u - tPull + 0.45) * 5) * (1 - clamp((u - tSend - 0.25) * 4)), dragging);
    }
    head(ctx, u, 'Vai esperar', w[9], 'a eleição?', w[11], w[16] - 0.3);
    head(ctx, u, 'Será que', w[16], 'vale a pena?', w[18], d - 0.35);
  }
  // ---- montagem (por cima, sai num mergulho)
  if (u < tD + 0.3) { const kz = easeIn(prog(u, tD - 0.08, tD + 0.3)); ctx.save(); if (kz > 0) { ctx.globalAlpha = 1 - kz; zoomAt(ctx, kz, 540, 950, 1.8); }
    if (u > tD - 0.1) { BGS.gancho(ctx); }
    xfadeWhip(ctx, prog(u, tB - 0.12, tB + 0.16), () => urnaCard(ctx, u, w), () => facadeCard(ctx, u, w));
    head(ctx, u, 'A eleição vai fazer', w[0], 'o imóvel…', w[4], w[6] - 0.28);
    slamT(ctx, 'despencar', 540, 450, F.black(140), '#D62828', prog(u, w[6] - 0.12, w[6] + 0.4) * (1 - prog(u, w[7] - 0.2, w[7] - 0.05)), 140);
    slamT(ctx, 'ou disparar?', 540, 450, F.black(126), GRN, prog(u, w[7] - 0.1, w[7] + 0.4), 126);
    ctx.restore(); }
};
// VIRADA: o barulho da política × o gráfico que pouca gente olha
const HEADL = ['DEBATE NA TV', 'PESQUISA: EMPATE TÉCNICO', '2º TURNO · 25/10', 'BOLSA SOBE', 'DÓLAR CAI', 'JUROS FUTUROS SOBEM', 'NOVA PESQUISA', 'QUEM VAI GANHAR?', 'MERCADO NERVOSO', 'DEBATE NA GLOBO'];
function miniChart(ctx, x, y, w, h, k, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; soft(ctx, x, y, w, h, 34, 0.2, 50, 20);
  T(ctx, 'PREÇO DO M² · SÃO PAULO', x + 36, y + 56, F.mono(20), MUTE, 'left', 1, 20, w - 60, 2); const n = FIPE.length, bw = (w - 90) / n;
  FIPE.forEach(([yr, v], i) => { const kk = clamp(k * (n + 4) / n - i / n * 1.0), hh = (h - 130) * v / 13000 * easeOut(clamp(kk)); const g = yr < 2011 ? '#E7B3B0' : yr < 2016 ? '#E7B3B0' : yr < 2019 ? '#C9DCC2' : yr < 2023 ? '#B7C6EA' : '#E7B3B0';
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x + 45 + i * bw, y + h - 40 - hh, bw - 5, hh, [5, 5, 1, 1]); ctx.fill(); });
  ctx.restore(); }
NEW.virada = (ctx, u, s) => { const w = s.wt, d = s.d; OLD6.bgGold(ctx);
  const noise = 1 - easeInOut(prog(u, w[7] - 0.25, w[7] + 0.35)), r = rng(11);
  HEADL.forEach((h_, i) => { const row = i % 5, dir = row % 2 ? -1 : 1, sp = 120 + r() * 120, y = 640 + row * 150 + r() * 40, x0 = r() * 1400 - 200; let x = x0 + dir * sp * u; x = ((x + 400) % 1700 + 1700) % 1700 - 400;
    const dep = 0.55 + 0.45 * ((i * 7) % 5) / 4, a = noise * 0.9 * clamp(u * 3 - i * 0.12) * dep; if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const b = (1 - dep) * 8 + (1 - noise) * 14; if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`;
    ctx.font = F.semi(34 * dep + 6); const tw_ = ctx.measureText(h_).width; ctx.fillStyle = NAVY; ctx.beginPath(); ctx.roundRect(x - 26, y - 42 * dep, tw_ + 52, 64 * dep + 8, 14); ctx.fill(); ctx.fillStyle = '#F3DDA8'; ctx.textBaseline = 'middle'; ctx.fillText(h_, x, y - 6 * dep + 6); ctx.restore(); });
  const k1 = 1 - prog(u, w[7] - 0.25, w[7] + 0.05);
  if (k1 > 0) { ctx.save(); ctx.globalAlpha *= k1; aw(ctx, 'Enquanto todo mundo', 540, 360, F.it(96), NAVY, u, w[1], 96); aw(ctx, 'olha a POLÍTICA,', 540, 490, F.black(112), NAVY, u, w[4], 112, 'center', WD, 960); ctx.restore(); }
  aw(ctx, 'pouca gente olha', 540, 360, F.it(96), NAVY, u, w[7], 96); aw(ctx, 'ESTE GRÁFICO.', 540, 490, F.black(118), NAVY, u, w[11] - 0.05, 118, 'center', WD, 960);
  const kc = SPR(u - (w[8] - 0.1), 1.5, 0.6); if (kc > 0) { const sc = lerp(0.6, 1, clamp(kc, 0, 1.08)); ctx.save(); ctx.translate(540, 1130); ctx.scale(sc, sc); ctx.translate(-540, -1130); miniChart(ctx, 240, 900, 600, 460, prog(u, w[9], w[12] + 0.3), clamp(kc * 3)); ctx.restore(); }
  const ka = easeOut(prog(u, w[11] - 0.1, w[11] + 0.35)); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = NAVY; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(870, 620); ctx.quadraticCurveTo(960, 760, 860 - 20 * (1 - ka), 880); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(838, 852); ctx.lineTo(860, 884); ctx.lineTo(896, 866); ctx.stroke(); ctx.restore(); }
  sparkle(ctx, 540, 1130, u, w[12] - 0.1, 1.2);
};
// CTA: o post do vídeo → compartilhar → curtir/salvar/comentar → cartão final com Seguir
function heartP(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x, y + 16 * s); ctx.bezierCurveTo(x - 36 * s, y - 8 * s, x - 22 * s, y - 34 * s, x, y - 18 * s); ctx.bezierCurveTo(x + 22 * s, y - 34 * s, x + 36 * s, y - 8 * s, x, y + 16 * s); ctx.closePath(); }
function iconRow(ctx, x0, y, st, sc = 1, saveAt = 7.1) { // st: {like, save, sent, com}
  ctx.save(); ctx.lineWidth = 5 * sc; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; const gap = 104 * sc;
  // curtir
  const lk = st.like || 0, ls = 1 + 0.35 * Math.sin(Math.PI * clamp(lk * 1.6)) * (lk < 0.62 ? 1 : 0); ctx.save(); ctx.translate(x0, y); ctx.scale(ls * sc * 1.15, ls * sc * 1.15); heartP(ctx, 0, 0, 1);
  if (lk > 0.05) { ctx.fillStyle = '#FF3040'; ctx.fill(); } else { ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke(); } ctx.restore();
  // comentar
  ctx.save(); ctx.translate(x0 + gap, y); ctx.scale(sc, sc); ctx.strokeStyle = st.com ? IGB : INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(0, 0, 24, 0.75, 6.0); ctx.lineTo(-20, 22); ctx.closePath(); ctx.stroke(); ctx.restore();
  // compartilhar
  ctx.save(); ctx.translate(x0 + gap * 2, y); ctx.scale(sc, sc); ctx.strokeStyle = st.sent ? IGB : INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(-24, -20); ctx.lineTo(26, -22); ctx.lineTo(4, 24); ctx.lineTo(0, 0); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(26, -22); ctx.stroke(); ctx.restore();
  // salvar
  const sv = st.save || 0; ctx.save(); ctx.translate(x0 + gap * saveAt, y); ctx.scale(sc * (1 + 0.25 * Math.sin(Math.PI * clamp(sv * 1.8)) * (sv < 0.56 ? 1 : 0)), sc); ctx.beginPath(); ctx.moveTo(-18, -26); ctx.lineTo(18, -26); ctx.lineTo(18, 26); ctx.lineTo(0, 12); ctx.lineTo(-18, 26); ctx.closePath();
  if (sv > 0.05) { ctx.fillStyle = INK; ctx.fill(); } else { ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke(); } ctx.restore();
  ctx.restore(); }
function burst(ctx, x, y, u, t0, col = '#FF3040') { const k = (u - t0) / 0.7; if (k <= 0 || k >= 1) return; ctx.save(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + 0.3, r0 = 40 + 90 * easeOut(k), px = x + Math.cos(a) * r0, py = y + Math.sin(a) * r0;
    ctx.globalAlpha = 1 - k; ctx.fillStyle = i % 2 ? col : '#F3C969'; ctx.beginPath(); ctx.arc(px, py, 7 * (1 - k) + 2, 0, 6.283); ctx.fill(); } ctx.restore(); }
function postCard(ctx, u, X, Y, Wc, st) { soft(ctx, X, Y, Wc, 900, 40, 0.14, 60, 22);
  ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(X + 64, Y + 62, 32, 0, 6.283); ctx.fill(); flatPin(ctx, X + 64, Y + 80, 0.22, GOLD, NAVY); T(ctx, 'vistabroker.perioto', X + 112, Y + 74, F.semi(32), INK, 'left', 1, 32, 500);
  T(ctx, 'Reels', X + Wc - 40, Y + 74, F.med(26), MUTE, 'right', 1, 26);
  // mídia: o próprio vídeo (azul-marinho, tijolos do m²)
  const my = Y + 124, mh = 600; ctx.save(); ctx.beginPath(); ctx.rect(X, my, Wc, mh); ctx.clip(); const g = ctx.createLinearGradient(0, my, 0, my + mh); g.addColorStop(0, '#0B1F3A'); g.addColorStop(1, '#16335C'); ctx.fillStyle = g; ctx.fillRect(X, my, Wc, mh);
  const n = FIPE.length, bw = (Wc - 120) / n; FIPE.forEach(([yr, v], i) => { const hh = 280 * v / 13000, col = yr < 2016 ? '#C9776F' : yr < 2019 ? '#7FA37A' : yr < 2023 ? '#5E7FCB' : '#C9776F'; brickIso(ctx, X + 60 + i * bw, my + mh - 50, bw - 8, hh, 6, col, mixc(col, '#000000', 0.2), mixc(col, '#FFFFFF', 0.3), 0.85); });
  T(ctx, 'Governo passa,', X + Wc / 2, my + 150, F.semi(56), '#FFFFFF', 'center', 1, 56); T(ctx, 'o tijolo fica.', X + Wc / 2, my + 250, F.it(96), '#F3DDA8', 'center', 1, 96);
  ctx.restore(); iconRow(ctx, X + 70, Y + 790, st); }
NEW.cta = (ctx, u, s) => { const w = s.wt, d = s.d; BGS.cta(ctx);
  const tShare = w[5] - 0.05, tPick = w[6] + 0.05, tSend = w[7] + 0.1, tLike = w[8], tSave = w[11], tCom = w[13], tFinal = d - 3.3, tFollow = tFinal + 1.1;
  head(ctx, u, 'Conhece alguém', w[0], 'esperando a eleição?', w[2], w[5] - 0.3, 300, 104);
  head(ctx, u, 'Manda esse vídeo', w[5], 'pra ele.', w[6], w[8] - 0.3, 300, 112);
  head(ctx, u, 'Curte se foi útil', w[8], 'e comenta:', w[12], tFinal - 0.3, 300, 104);
  const outAll = easeInOut(prog(u, tFinal - 0.3, tFinal + 0.3));
  if (outAll < 1) { ctx.save(); ctx.globalAlpha *= 1 - outAll; ctx.translate(0, -outAll * 160);
    const kp = easeOut(prog(u, 0, 0.5)), X = 110, Y = lerp(640, 520, kp), st = { like: prog(u, tLike, tLike + 0.6), save: prog(u, tSave, tSave + 0.6), sent: u > tSend + 0.1, com: u > tCom };
    postCard(ctx, u, X, Y, 860, st); burst(ctx, X + 70, Y + 790, u, tLike + 0.05);
    // folha de compartilhar
    const ks = SPR(u - tShare - 0.1, 1.4, 0.7) * (1 - easeIn(prog(u, tSend + 0.35, tSend + 0.75))); let sy = 1950;
    if (ks > 0.001) { sy = lerp(1950, 1000, clamp(ks, 0, 1.05)); soft(ctx, 40, sy, 1000, 640, 52, 0.2, 70, -10); ctx.fillStyle = '#D9DADF'; ctx.beginPath(); ctx.roundRect(500, sy + 20, 80, 8, 4); ctx.fill();
      T(ctx, 'Enviar para', 540, sy + 92, F.semi(34), INK, 'center', 1, 34);
      const sel = u > tPick + 0.05; [['Rafael', 'R', '#C9D3E2'], ['Mãe', 'M', '#E3C7B5'], ['Família', 'F', '#C9D8C2'], ['Ana', 'A', '#D7C6E6']].forEach(([n, l, c], i) => { const x = 180 + i * 240, y = sy + 230;
        ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 66, 0, 6.283); ctx.fill(); T(ctx, l, x, y + 20, F.semi(54), '#fff', 'center', 1, 54); T(ctx, n, x, y + 110, F.med(28), INK, 'center', 1, 28);
        if (i === 0 && sel) { const k = clamp(SPR(u - tPick - 0.05, 2.5, 0.5), 0, 1.2); ctx.fillStyle = IGB; ctx.beginPath(); ctx.arc(x + 48, y + 48, 24 * k, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 38, y + 48); ctx.lineTo(x + 45, y + 55); ctx.lineTo(x + 59, y + 41); ctx.stroke(); } });
      const sent = u > tSend + 0.05; ctx.fillStyle = sel ? IGB : '#B9D9F5'; ctx.beginPath(); ctx.roundRect(90, sy + 420, 900, 100, 24); ctx.fill(); T(ctx, sent ? 'Enviado ✓' : 'Enviar', 540, sy + 486, F.semi(40), '#fff', 'center', 1, 40); }
    // folha de comentários: a resposta do Rafael + a pergunta
    const kc = SPR(u - tCom - 0.1, 1.4, 0.7); if (kc > 0.001) { const cy = lerp(1950, 860, clamp(kc, 0, 1.04)); soft(ctx, 40, cy, 1000, 1100, 52, 0.22, 70, -10); ctx.fillStyle = '#D9DADF'; ctx.beginPath(); ctx.roundRect(500, cy + 20, 80, 8, 4); ctx.fill();
      T(ctx, 'Comentários', 540, cy + 86, F.semi(34), INK, 'center', 1, 34); ctx.fillStyle = LINE; ctx.fillRect(40, cy + 118, 1000, 2);
      const kr = prog(u, tCom + 0.55, tCom + 0.9); if (kr > 0) { ctx.save(); ctx.globalAlpha *= kr; ctx.translate(0, (1 - easeOut(kr)) * 20); ctx.fillStyle = '#C9D3E2'; ctx.beginPath(); ctx.arc(120, cy + 186, 36, 0, 6.283); ctx.fill(); T(ctx, 'R', 120, cy + 200, F.semi(36), '#fff', 'center', 1, 36);
        T(ctx, 'rafael', 176, cy + 172, F.semi(28), INK, 'left', 1, 28); T(ctx, 'agora', 276, cy + 172, F.med(24), MUTE, 'left', 1, 24); T(ctx, 'Mudei de ideia. Vou comprar antes da', 176, cy + 214, F.med(31), INK, 'left', 1, 31, 800); T(ctx, 'eleição. Me ajuda?', 176, cy + 254, F.med(31), INK, 'left', 1, 31, 800); ctx.restore(); }
      const kq = prog(u, w[14] - 0.1, w[14] + 0.3); if (kq > 0) { ctx.save(); ctx.globalAlpha *= kq; ctx.fillStyle = '#F3EDE2'; ctx.beginPath(); ctx.roundRect(90, cy + 300, 900, 300, 30); ctx.fill();
        T(ctx, 'Você compraria', 540, cy + 370, F.semi(46), INK, 'center', 1, 46); T(ctx, 'antes ou depois da eleição?', 540, cy + 428, F.semi(46), INK, 'center', 1, 46, 840);
        [['ANTES', 330, w[16]], ['DEPOIS', 750, w[18]]].forEach(([l, x, t0]) => { const on = prog(u, t0 - 0.05, t0 + 0.2) * (1 - prog(u, t0 + 0.55, t0 + 0.8)), sc = 1 + 0.08 * on; ctx.save(); ctx.translate(x, cy + 520); ctx.scale(sc, sc);
          ctx.fillStyle = on > 0.5 ? NAVY : '#FFFFFF'; shadowed(ctx, () => { ctx.beginPath(); ctx.roundRect(-170, -46, 340, 92, 46); ctx.fill(); }, 0.12, 14, 6); T(ctx, l, 0, 14, F.black(40), on > 0.5 ? '#F3DDA8' : NAVY, 'center', 1, 40); ctx.restore(); });
        ctx.restore(); }
      ctx.fillStyle = '#F2F2F5'; ctx.beginPath(); ctx.roundRect(90, cy + 640, 900, 84, 42); ctx.fill(); T(ctx, 'Adicione um comentário…', 130, cy + 694, F.med(30), MUTE, 'left', 1, 30); }
    const tp = cursorPath(u, [[tShare - 0.45, X + 278, Y + 790], [tShare + 0.1, X + 278, Y + 790], [tPick - 0.2, 180, 1230], [tPick + 0.2, 180, 1230], [tSend - 0.25, 540, 1470], [tSend + 0.25, 540, 1470],
      [tLike - 0.3, X + 70, Y + 790], [tLike + 0.15, X + 70, Y + 790], [tSave - 0.3, X + 70 + 738, Y + 790], [tSave + 0.15, X + 808, Y + 790], [tCom - 0.3, X + 174, Y + 790], [tCom + 0.15, X + 174, Y + 790], [w[16] - 0.25, 330, 1380], [w[16] + 0.3, 330, 1380]]);
    touch(ctx, tp.x, tp.y, u, [tShare, tPick, tSend, tLike, tSave, tCom, w[16]], clamp((u - tShare + 0.45) * 5) * (1 - clamp((u - w[16] - 0.4) * 4)));
    ctx.restore(); }
  // cartão final
  const kf = easeOut(prog(u, tFinal, tFinal + 0.5)); if (kf > 0) { ctx.save(); ctx.globalAlpha *= kf; ctx.translate(0, (1 - kf) * 80);
    T(ctx, 'Me segue', 540, 330, F.semi(64), INK, 'center', 1, 64); T(ctx, 'pros próximos conselhos.', 540, 432, F.it(84), GOLDA, 'center', 1, 84, 960);
    iconRow(ctx, 306, 680, { like: 1, save: 1, sent: true, com: true }, 1.5, 3);
    [['curtir', 306], ['comentar', 462], ['compartilhar', 618], ['salvar', 774]].forEach(([l, x]) => T(ctx, l, x, 776, F.med(24), MUTE, 'center', 1, 24));
    T(ctx, '@vistabroker.perioto', 540, 940, F.black(62), INK, 'center', 1, 62, 900); T(ctx, 'Pedro Perioto · Corretor de imóveis · CRECI 258729', 540, 996, F.semi(30), MUTE, 'center', 1, 30, 900); T(ctx, 'Tatuapé · Anália Franco · Zona Leste', 540, 1040, F.med(28), MUTE, 'center', 1, 28);
    const fol = u > tFollow + 0.08, kb = clamp(SPR(u - tFollow - 0.05, 2, 0.5), 0, 1.1); ctx.save(); ctx.translate(540, 1140); const bs = fol ? lerp(0.92, 1, kb) : 1; ctx.scale(bs, bs);
    shadowed(ctx, () => { ctx.fillStyle = fol ? '#E9EAED' : IGB; ctx.beginPath(); ctx.roundRect(-230, -46, 460, 92, 46); ctx.fill(); }, 0.18, 20, 8); T(ctx, fol ? 'Seguindo ✓' : 'Seguir', 0, 12, F.semi(40), fol ? INK : '#fff', 'center', 1, 40); ctx.restore();
    touch(ctx, 560, 1145, u, [tFollow], clamp((u - tFollow + 0.4) * 5) * (1 - clamp((u - tFollow - 0.5) * 4)));
    const lg = IMG.vista; if (lg) { const sc = 1.2; ctx.drawImage(lg, 540 - lg.width * sc / 2, 1235, lg.width * sc, lg.height * sc); }
    T(ctx, 'Conteúdo informativo. Não é recomendação de investimento.', 540, 1480, F.med(24), MUTE, 'center', 1, 24, 900);
    ctx.restore(); }
};

// ---------- cartões de conselho (abertura de cada bloco) ----------
function coinFace(ctx, x, y, R, sx, face) { ctx.save(); ctx.translate(x, y); ctx.scale(Math.max(0.03, sx), 1);
  shadowed(ctx, () => { const g = ctx.createLinearGradient(-R, -R, R, R); g.addColorStop(0, '#F1D9A0'); g.addColorStop(0.5, '#C9A86A'); g.addColorStop(1, '#8E6E38'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, 6.283); ctx.fill(); }, 0.25, 30, 14);
  const r2 = R * 0.85; if (face === 'x' || face === '?') { ctx.fillStyle = NAVY; ctx.beginPath(); ctx.arc(0, 0, r2, 0, 6.283); ctx.fill();
    if (face === 'x') { ctx.strokeStyle = '#fff'; ctx.lineWidth = r2 * 0.14; ctx.lineCap = 'round'; const k = r2 * 0.36; ctx.beginPath(); ctx.moveTo(-k, -k); ctx.lineTo(k, k); ctx.moveTo(k, -k); ctx.lineTo(-k, k); ctx.stroke(); }
    else T(ctx, '?', 0, r2 * 0.42, F.black(r2 * 1.25), '#F3DDA8', 'center', 1, r2 * 1.25); }
  else { photo(ctx, face, -r2, -r2, 2 * r2, 2 * r2, r2, (FOC[face] || [0, 0, 1])[2]); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, r2, 0, 6.283); ctx.stroke(); }
  ctx.restore(); }
INTRO.governos = (ctx, u, s) => { const w = s.wt; BGS.governos(ctx);
  label(ctx, 'CONSELHO 1 DE 5', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Não tente adivinhar', 540, 350, F.semi(66), INK, u, w[2], 66); aw(ctx, 'a eleição.', 540, 462, F.it(112), GOLDA, u, w[5], 112, 'center', WD, 960);
  const tS = 0.25, tL = w[4] + 0.15, kk = prog(u, tS, tL), ph = 8 * Math.PI * easeOut(kk), R = lerp(62, 230, easeOut(prog(u, 0, 0.55))), idx = Math.floor((ph + Math.PI / 2) / Math.PI);
  const face = idx === 0 ? 'x' : idx >= 8 ? '?' : idx % 2 ? 'lula' : 'flavio', y = 1000 - 300 * Math.sin(Math.PI * kk), sx = Math.abs(Math.cos(ph));
  const sh = 1 - 0.5 * Math.sin(Math.PI * kk); ctx.save(); ctx.globalAlpha *= 0.25 * prog(u, 0.1, 0.4); ctx.fillStyle = '#0B1F3A'; ctx.filter = 'blur(14px)'; ctx.beginPath(); ctx.ellipse(540, 1265, 190 * sh, 30 * sh, 0, 0, 6.283); ctx.fill(); ctx.restore();
  coinFace(ctx, 540, y, R * (1 + 0.06 * Math.sin(Math.PI * kk)), sx, face);
  if (u > tL) sparkle(ctx, 540, 1000, u, tL, 1.4);
  T(ctx, 'cara ou coroa?', 540, 1360, F.it(54), NAVY, 'center', prog(u, w[2], w[2] + 0.3) * (1 - prog(u, tL - 0.1, tL + 0.2)), 54);
  T(ctx, 'ninguém sabe.', 540, 1360, F.it(54), NAVY, 'center', prog(u, tL + 0.1, tL + 0.4), 54); };
function alugaSign(ctx, u) { const th = 0.15 * Math.exp(-1.3 * u) * Math.sin(6 * u + 0.6) + 0.012 * Math.sin(u * 2.2);
  // janela
  shadowed(ctx, () => { ctx.fillStyle = '#E9EEF5'; ctx.beginPath(); ctx.roundRect(170, 590, 740, 820, 18); ctx.fill(); }, 0.35, 60, 24);
  const g = ctx.createLinearGradient(0, 610, 0, 1390); g.addColorStop(0, '#22406B'); g.addColorStop(1, '#0E2240'); ctx.fillStyle = g; ctx.fillRect(196, 616, 688, 768);
  ctx.save(); ctx.beginPath(); ctx.rect(196, 616, 688, 768); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(196, 1000); ctx.lineTo(560, 616); ctx.lineTo(700, 616); ctx.lineTo(196, 1150); ctx.closePath(); ctx.fill();
  const lg = ctx.createRadialGradient(540, 760, 20, 540, 900, 520); lg.addColorStop(0, 'rgba(255,214,120,0.30)'); lg.addColorStop(1, 'rgba(255,214,120,0)'); ctx.fillStyle = lg; ctx.fillRect(196, 616, 688, 768); ctx.restore();
  ctx.fillStyle = '#E9EEF5'; ctx.fillRect(530, 616, 20, 768); ctx.fillRect(196, 990, 688, 18);
  // placa pendurada
  ctx.save(); ctx.translate(540, 650); ctx.rotate(th); ctx.strokeStyle = '#B9C3D0'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-220, 170); ctx.moveTo(0, 0); ctx.lineTo(220, 170); ctx.stroke();
  ctx.fillStyle = '#B9C3D0'; ctx.beginPath(); ctx.arc(0, 0, 9, 0, 6.283); ctx.fill();
  shadowed(ctx, () => { ctx.fillStyle = '#F4C430'; ctx.beginPath(); ctx.roundRect(-290, 160, 580, 290, 18); ctx.fill(); }, 0.35, 30, 16); ctx.strokeStyle = '#1A1A1E'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-270, 180, 540, 250, 12); ctx.stroke();
  T(ctx, 'ALUGA-SE', 0, 330, F.black(112), '#1A1A1E', 'center', 1, 112, 500); T(ctx, 'APARTAMENTO', 0, 396, F.semi(30), '#1A1A1E', 'center', 1, 30, 400, 4); ctx.restore(); }
INTRO.corrida = (ctx, u, s) => { const w = s.wt; OLD6.bgDark(ctx, s.a + u, '#17355F');
  label(ctx, 'CONSELHO 3 DE 5', 250, '#E2C27F', prog(u, 0.1, 0.5)); aw(ctx, 'Aluguel', 540, 350, F.semi(66), '#F5F2EC', u, w[1], 66); aw(ctx, 'não é neutro.', 540, 462, F.it(112), '#E2C27F', u, w[2], 112, 'center', WD, 960);
  alugaSign(ctx, u); };
INTRO.estoque = (ctx, u, s) => { const w = s.wt; OLD6.bgLight(ctx);
  label(ctx, 'CONSELHO 4 DE 5', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Com estoque alto,', 540, 350, F.semi(66), INK, u, w[1], 66); aw(ctx, 'negocie.', 540, 462, F.it(118), GOLDA, u, w[4], 118, 'center', WD, 960);
  const m = imgCard(ctx, 'aperto', 110, 560, 860, 860, 44, lerp(1.02, 1.2, easeInOut(prog(u, 0, s.P + 0.4))), 0.5, 0.53); if (m) { const [hx, hy] = m(470, 720); sparkle(ctx, hx, hy, u, w[4] + 0.1, 1.1); } };
INTRO.parcela = (ctx, u, s) => { const w = s.wt; OLD6.bgLight(ctx);
  label(ctx, 'CONSELHO 5 DE 5', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Faça a conta', 540, 350, F.semi(66), INK, u, w[1], 66); aw(ctx, 'da parcela.', 540, 462, F.it(112), GOLDA, u, w[4], 112, 'center', WD, 960);
  const m = imgCard(ctx, 'calc', 110, 560, 860, 860, 44, lerp(1.0, 1.16, easeInOut(prog(u, 0, s.P + 0.4))), 0.5, 0.5); if (m) { const [x0, y0] = m(168, 648), [x1, y1] = m(574, 708);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); const hh = y1 - y0, on = Math.floor(u * 2.6) % 2 === 0; T(ctx, '= ?', x1 - 22, y1 - hh * 0.16, F.mono(hh * 0.86), 'rgba(28,32,24,0.85)', 'right', prog(u, w[3] - 0.1, w[3] + 0.2), hh * 0.86, 600);
      if (on && u > w[3]) { ctx.fillStyle = 'rgba(28,32,24,0.8)'; ctx.fillRect(x1 - 16, y0 + hh * 0.18, 6, hh * 0.64); } ctx.restore(); } };
INTRO.mapa = (ctx, u, s) => { const w = s.wt, P = s.P; base_(ctx, '#F5F5F7'); glow(ctx, 540, 1000, 900, 'rgba(184,149,90,0.12)');
  label(ctx, 'E POR ÚLTIMO', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Olhe pra onde', 540, 350, F.semi(66), INK, u, w[2], 66); aw(ctx, 'a cidade vai.', 540, 462, F.it(112), GOLDA, u, w[5], 112, 'center', WD, 960);
  const t1 = w[4] - 0.15, t2 = w[6] - 0.15;
  const A_ = () => imgCard(ctx, 'aerea', 110, 560, 860, 860, 44, lerp(1.0, 1.12, prog(u, 0, t1 + 0.2)), 0.5, 0.45), B_ = () => imgCard(ctx, 'capacete', 110, 560, 860, 860, 44, lerp(1.04, 1.14, prog(u, t1, P + 0.4)), 0.42, 0.6);
  if (u < t1 + 0.2) xfadeWhip(ctx, prog(u, t1 - 0.12, t1 + 0.16), A_, B_); else B_();
  const ke = SPR(u - t2, 1.6, 0.6); if (ke > 0) { ctx.save(); ctx.globalAlpha *= clamp(ke * 3); ctx.translate(640, 1000); ctx.rotate(0.06 - 0.02 * clamp(ke)); ctx.scale(lerp(0.8, 1, clamp(ke, 0, 1.05)), lerp(0.8, 1, clamp(ke, 0, 1.05)));
    ctx.fillStyle = '#fff'; shadowed(ctx, () => { ctx.beginPath(); ctx.roundRect(-250, -380, 500, 760, 26); ctx.fill(); }, 0.3, 40, 18); imgCard(ctx, 'equipe', -232, -362, 464, 724, 16, 1.02, 0.5, 0.5, 0); ctx.restore(); } };

// ---------- camadas por cima das cenas reaproveitadas ----------
OVER.entrevistas = (ctx, u, s) => { const nw = s.text.split(' '), ti = nw.indexOf('Quem'), t0 = s.wt[ti] - 0.15, k = prog(u, t0, t0 + 0.35) * (1 - easeIn(prog(u, s.d - 0.5, s.d - 0.25))); if (k <= 0) return;
  const Y = 1408; pop(ctx, k, 540, Y, () => { soft(ctx, 170, Y - 56, 740, 112, 56, 0.2, 40, 14); ctx.strokeStyle = IGB; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(255, Y, 24, 0.75, 6.0); ctx.lineTo(236, Y + 20); ctx.closePath(); ctx.stroke();
    T(ctx, 'Quem te convence mais?', 580, Y + 17, F.black(46), INK, 'center', 1, 46, 600); }); };
OVER.m2 = (ctx, u, s) => { const w = s.wt;
  head(ctx, u, 'Segundo conselho:', w[0], 'olhe o histórico.', w[2], w[11] - 0.3);
  head(ctx, u, 'subiu em todos', w[11], 'os governos.', w[13], w[22] - 0.3);
  head(ctx, u, 'Em qualquer governo,', w[22], 'quem comprou não ficou refém.', w[25], w[33] - 0.3, 330, 88);
  head(ctx, u, 'Na planta, no Tatuapé:', w[33], 'mais de R$ 15 mil/m²', w[39]);
  T(ctx, 'Preços nominais, sem descontar a inflação. Histórico não garante valorização futura.', 540, 1508, F.med(22), MUTE, 'center', prog(u, w[11], w[11] + 0.5), 22, 960); };
OVER.mapa = (ctx, u, s, uo) => { const w = s.old.wt, nw = s.wt, d = s.d, tE = w[13];
  const fo = easeIn(prog(uo, s.old.d - 0.45, s.old.d)); ctx.save(); ctx.globalAlpha *= 1 - fo;
  head(ctx, uo, 'Eixo Platina:', tE, 'morar, trabalhar, viver.', w[19], 10.6, 290, 100);
  head(ctx, uo, 'E o metrô', tL2, 'está chegando.', w[57], tEnd - 0.3, 290, 104);
  head(ctx, uo, 'Governo passa.', tEnd, 'O tijolo fica.', w[64], 99, 290, 124); ctx.restore();
  // o tijolo (foto) no fechamento
  const tB = nw[27] - 0.25, kb = easeOut(prog(u, tB, tB + 0.4)); if (kb <= 0) return;
  ctx.save(); ctx.globalAlpha *= kb; base_(ctx, '#F5F5F7'); glow(ctx, 540, 1000, 900, 'rgba(184,149,90,0.16)');
  zoomAt(ctx, 1 - kb, 540, 980, 1.25); const m = imgCard(ctx, 'tijolo', 110, 540, 860, 900, 44, lerp(1.14, 1.0, easeOut(prog(u, tB, d))), 0.5, 0.62);
  T(ctx, 'Governo passa.', 540, 290, F.semi(64), INK, 'center', 1, 64); T(ctx, 'O tijolo fica.', 540, 402, F.it(124), GOLDA, 'center', 1, 124, 960);
  if (m) { const [bx, by] = m(400, 860); sparkle(ctx, bx, by, u, nw[28] + 0.1, 1.3); } ctx.restore(); };
OVER.parcela = (ctx, u, s) => { const nw = s.text.split(' '), ti = nw.indexOf('Mas'), w = s.wt, t0 = w[ti] - 0.3, k = easeOut(prog(u, t0, t0 + 0.4)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k; OLD6.bgLight(ctx); zoomAt(ctx, 1 - k, 540, 980, 0.9);
  imgCard(ctx, 'chaves', 110, 560, 860, 860, 44, lerp(1.0, 1.1, prog(u, t0, s.d)), 0.5, 0.42);
  aw(ctx, 'Mas só vale', 540, 350, F.semi(66), INK, u, w[ti], 66); aw(ctx, 'se couber no seu bolso.', 540, 462, F.it(96), GOLDA, u, w[ti + 3], 96, 'center', WD, 960); ctx.restore(); };
const CHIP = { corrida: 'CONSELHO 3 · ALUGUEL NÃO É NEUTRO', conta: 'CONSELHO 3 · A CONTA DO ALUGUEL', estoque: 'CONSELHO 4 · NEGOCIE', parcela: 'CONSELHO 5 · FAÇA A CONTA' };
const SRC11 = { corrida: 'Fontes: FipeZAP (aluguel e venda, Brasil) · IBGE (IPCA) — 12 meses até set/2026', estoque: 'Fonte: Secovi-SP — médio e alto padrão: vendas 12 meses até jul/2026; estoque em ago/2026',
  conta: 'Simulação: R$ 800 mil, aluguel inicial de R$ 4.287 com reajuste de 6,22% a.a.', parcela: 'Simulação: R$ 800 mil, 20% de entrada, SAC 30 anos, TR + 11,49% a.a., valorização 5% a.a.' };

// ---------- composição ----------
function sceneAt(t) { let i = SEQ.findIndex(s => t < s.b); if (i < 0) i = SEQ.length - 1; return i; }
function drawScene(ctx, t, i) {
  const s = SEQ[i], u = t - s.a; DK = DARK[s.name] ? 1 : 0;
  if (s.src === 'new') { ctx.save(); NEW[s.name](ctx, u, s); ctx.restore(); return; }
  const P = s.P, draw = (uo) => { ctx.save(); if (BGS[s.name]) BGS[s.name](ctx); HEADOFF = HOFF[s.name] ? 1 : 0;
    if (s.src === 'o6') OLD6.SC[s.name](ctx, uo, s.old.d, t, s.old.wt); else if (s.name === 'mapa') drawMap(ctx, uo, s.old.d, s.old.wt); else SC[s.name](ctx, uo, s.old.d, s.old.wt); HEADOFF = 0; ctx.restore(); };
  if (!s.intro || u > P - 0.25) {
    const uo = clamp(pw(s.pts, u, 0, 1), 0, s.old.d - 1e-3), kin = s.intro ? easeOut(prog(u, P - 0.2, P + 0.45)) : 1;
    ctx.save(); if (kin < 1) zoomAt(ctx, 1 - kin, 540, 960, 0.86);
    if (s.jump && Math.abs(u - s.jump.tn) < 0.25) { const k = easeInOut(clamp((u - s.jump.tn + 0.25) / 0.5)); draw(u < s.jump.tn ? uo : pw(s.pts, s.jump.tn - 2e-4, 0, 1) + (u - s.jump.tn));
      ctx.save(); ctx.globalAlpha = k; draw(u < s.jump.tn ? s.jump.to + (u - s.jump.tn) : uo); ctx.restore(); }
    else draw(uo);
    if (s.src === 'o6') { const fg = DK ? '#A9B6CA' : '#5B6577'; if (CHIP[s.name]) T(ctx, CHIP[s.name], 80, 290, F.mono(24), DK ? '#E2C27F' : NAVY, 'left', prog(u, P + 0.1, P + 0.5), 24, 900, 2);
      if (SRC11[s.name]) T(ctx, SRC11[s.name], 540, 1478, F.med(23), fg, 'center', prog(u, P + 0.4, P + 0.8), 23, 940); }
    if (OVER[s.name]) OVER[s.name](ctx, u, s, uo);
    ctx.restore(); }
  if (s.intro && u < P + 0.45) { const ko = easeIn(prog(u, P - 0.2, P + 0.45)); ctx.save(); ctx.globalAlpha = 1 - ko; if (ko > 0) { zoomAt(ctx, ko, 540, 980, 1.55); if (ko > 0.05) ctx.filter = `blur(${(ko * 10).toFixed(1)}px)`; } INTRO[s.name](ctx, u, s); ctx.restore(); }
}
window.MAPPREV = (g) => { g.fillStyle = BG; g.fillRect(0, 0, W, H); };
const TR11 = { entrevistas: ['dot', 0.6], virada: ['dot', 0.55], m2: ['zoom', 0.6], corrida: ['whip', 0.45], conta: ['flash', 0.3], estoque: ['dot', 0.55], parcela: ['dot', 0.55], mapa: ['zoom', 0.6], cta: ['zoom', 0.6] };
const EX11 = { governos: () => ({ x: 290, y: 720 }), mercado: () => ({ x: 540, y: 1255 }), virada: () => ({ x: 540, y: 1130 }), m2: () => ({ x: 540, y: 960 }), corrida: () => OLD6.EXIT.corrida(), conta: (c) => OLD6.EXIT.conta(c),
  estoque: () => ({ x: 745, y: 1440 }), parcela: () => ({ x: 540, y: 990 }), mapa: () => ({ x: 540, y: 990 }) };
const expoK = (k) => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
const LAY = [0, 1].map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; });
function layer(i, t, L) { const g = L.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H); drawScene(g, t, i); return L; }
function blitAt(ctx, L, px, py, s, a, dx = 0, blur = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(px + dx, py); ctx.scale(s, s); ctx.translate(-px, -py);
  if (blur > 1) { ctx.globalAlpha = a * 0.5; ctx.drawImage(L, 0, 0); for (let k = 1; k <= 4; k++) { ctx.globalAlpha = a * 0.12; ctx.drawImage(L, -blur * k / 4, 0); ctx.drawImage(L, blur * k / 4, 0); } } else ctx.drawImage(L, 0, 0); ctx.restore(); }
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const i = sceneAt(t), s = SEQ[i], u = t - s.a, tr = i > 0 ? TR11[s.name] : null, p = tr ? clamp(u / tr[1]) : 1, kind = tr ? tr[0] : 'cut', pn = i > 0 ? SEQ[i - 1].name : null;
  const ex = () => (EX11[pn] || (() => ({ x: 540, y: 960 })))(ctx);
  if (p < 1 && kind === 'dot') { drawScene(ctx, t, i - 1); const e = ex(); ctx.save(); ctx.beginPath(); ctx.arc(e.x, e.y, lerp(22, 2300, easeIn(p) * 0.35 + easeInOut(p) * 0.65), 0, 6.283); ctx.clip(); drawScene(ctx, t, i); ctx.restore(); }
  else if (p < 1 && kind === 'zoom') { const e = ex(); blitAt(ctx, layer(i, t, LAY[0]), 540, 960, lerp(1.18, 1, expoK(p)), easeOut(prog(p, 0.25, 0.8))); blitAt(ctx, layer(i - 1, t, LAY[1]), e.x, e.y, 1 + 9 * easeIn(p), 1 - easeIn(prog(p, 0.35, 0.85))); }
  else if (p < 1 && kind === 'whip') { const e = easeInOut(p), v = Math.sin(Math.PI * p) * 40; blitAt(ctx, layer(i - 1, t, LAY[1]), 540, 960, 1, 1, -W * e, v); blitAt(ctx, layer(i, t, LAY[0]), 540, 960, 1, 1, W * (1 - e), v); }
  else drawScene(ctx, t, i);
  if (kind === 'flash' && p < 1) { ctx.fillStyle = `rgba(255,252,245,${0.9 * Math.pow(1 - p, 2)})`; ctx.fillRect(0, 0, W, H); }
  if (i + 1 < SEQ.length && (TR11[SEQ[i + 1].name] || [])[0] === 'flash' && SEQ[i + 1].a - t < 0.06) { ctx.fillStyle = `rgba(255,252,245,${0.9 * (1 - (SEQ[i + 1].a - t) / 0.06)})`; ctx.fillRect(0, 0, W, H); }
  captions(ctx, t, i);
}

// ---------- legenda dinâmica: 2–3 palavras, posição pela zona livre de cada momento ----------
const CAPZ = { gancho: (u, s) => { const w = s.wt, tD = w[9] - 0.32, tPull = w[11] - 0.1, tOut = w[17] + 0.3; return u > tD && u > tPull + 0.15 && u < tOut + 0.35 ? 1318 : 1550; }, governos: () => 1550, entrevistas: () => 1560, mercado: () => 1560, m2: () => 1580, corrida: () => 1560, conta: () => 1560, estoque: () => 1560, parcela: () => 1560, mapa: () => 1600 };
const CHUNKS = []; SEQ.forEach(s => { if (!CAPZ[s.name]) return; const ws = s.text.split(' '); let cur = [];
  ws.forEach((w, i) => { cur.push([w, s.a + s.wt[i]]); const brk = /[.?!:,]$/.test(w) || cur.length >= 3;
    if (brk || i === ws.length - 1) { CHUNKS.push({ ws: cur, t0: cur[0][1], last: s.b, sc: s.name, s }); cur = []; } }); });
CHUNKS.forEach((c, i) => { const n = CHUNKS[i + 1], lw = c.ws[c.ws.length - 1][1]; c.t1 = Math.min(n ? n.t0 - 0.02 : 1e9, lw + 0.7, c.last); });
function capBox(t) { const c = CHUNKS.find(c => t >= c.t0 - 0.05 && t < c.t1); if (!c) return null; const g = document.createElement('canvas').getContext('2d'); g.font = F.black(46);
  const tw_ = c.ws.reduce((a, [w]) => a + g.measureText(w).width, 0) + g.measureText(' ').width * (c.ws.length - 1), y = CAPZ[c.sc](t - c.s.a, c.s); return { c, y, x0: 540 - tw_ / 2 - 12, x1: 540 + tw_ / 2 + 12, y0: y - 36, y1: y + 30, text: c.ws.map(q => q[0]).join(' ') }; }
function captions(ctx, t, i) { if (window.NOCAP) return; const c = CHUNKS.find(c => t >= c.t0 - 0.05 && t < c.t1); if (!c) return;
  const dk = !!DARK[c.sc], y0 = CAPZ[c.sc](t - c.s.a, c.s);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.font = F.black(46); const sp = ctx.measureText(' ').width, ws = c.ws.map(([w]) => ctx.measureText(w).width), tw_ = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const k = clamp((t - c.t0 + 0.05) / 0.14); ctx.globalAlpha = k * (1 - clamp((t - c.t1 + 0.1) / 0.1)); let cur = -1; c.ws.forEach(([, a_], j) => { if (t >= a_ - 0.04) cur = j; });
  if (c.sc === 'mapa') { const g = ctx.createLinearGradient(0, y0 - 70, 0, y0 + 60); g.addColorStop(0, 'rgba(245,245,247,0)'); g.addColorStop(0.5, 'rgba(245,245,247,0.92)'); g.addColorStop(1, 'rgba(245,245,247,0)'); ctx.fillStyle = g; ctx.fillRect(0, y0 - 70, W, 130); }
  let x = 540 - tw_ / 2; const y = y0 + (1 - easeOut(k)) * 16; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  const halo = dk ? 'rgba(8,22,48,0.9)' : 'rgba(255,255,255,0.95)', on = dk ? '#FFFFFF' : INK, hi = dk ? '#E2C27F' : GOLDA, off = dk ? 'rgba(255,255,255,0.4)' : 'rgba(29,29,31,0.32)';
  c.ws.forEach(([w], j) => { const wk = j === cur ? 1 + 0.12 * Math.max(0, 1 - (t - c.ws[j][1]) / 0.25) : 1, num = /\d|mil|bilh|cento|quinze|dezesseis|dezoito|treze|oitocentos|seiscentos|nove|doze|oitavo/i.test(w);
    ctx.save(); ctx.translate(x + ws[j] / 2, y); ctx.scale(wk, wk); ctx.translate(-(x + ws[j] / 2), -y);
    ctx.strokeStyle = halo; ctx.lineWidth = 10; ctx.strokeText(w, x, y); ctx.fillStyle = j === cur ? hi : j < cur ? (num ? hi : on) : off; ctx.fillText(w, x, y); ctx.restore(); x += ws[j] + sp; });
  ctx.restore(); }
// verificação: densidade de bordas atrás da legenda (renderiza sem legenda e mede a área que ela ocuparia)
const CV2 = document.createElement('canvas'); CV2.width = W; CV2.height = H;
window.capBusy = (t) => { const b = capBox(t); if (!b) return null; window.NOCAP = 1; render(CV2, t); window.NOCAP = 0;
  const x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.floor(b.y0), w_ = Math.min(W, Math.ceil(b.x1)) - x0, h_ = Math.ceil(b.y1 - b.y0), D_ = CV2.getContext('2d').getImageData(x0, y0, w_, h_).data;
  const L = (i) => 0.3 * D_[i] + 0.59 * D_[i + 1] + 0.11 * D_[i + 2]; let n = 0; for (let y = 0; y < h_ - 1; y++) for (let x = 0; x < w_ - 1; x++) { const i = (y * w_ + x) * 4; if (Math.abs(L(i) - L(i + 4)) + Math.abs(L(i) - L(i + w_ * 4)) > 36) n++; }
  let m = 0, m2 = 0, N = 0; for (let i = 0; i < D_.length; i += 4) { const l = L(i); m += l; m2 += l * l; N++; } m /= N; const sd = Math.sqrt(Math.max(0, m2 / N - m * m));
  return { t, sc: b.c.sc, text: b.text, y: b.y, dens: Math.round(n / (w_ * h_) * 1000) / 1000, sd: Math.round(sd * 10) / 10, box: [x0, y0, w_, h_] }; };
window.capTimes = () => CHUNKS.map(c => ({ t: Math.round(((c.t0 + c.t1) / 2) * 100) / 100, t0: c.t0, t1: c.t1, sc: c.sc }));
window.TIMING = SEQ.map(s => { const r2 = (x) => Math.round(x * 100) / 100;
  if (s.src === 'new') return { cena: s.name, inicio: r2(s.a), fim: r2(s.b), fala: s.text, palavras: s.wt.map(x => r2(x + s.a)), antigas: s.wt.map(x => r2(x + s.a)), warp: [[0, 0], [r2(s.d), r2(s.d)]] };
  const lo = Math.min(...s.pts.map(p => p[1])) - 1e-6, hi = Math.max(...s.pts.map(p => p[1])) + 1e-6;
  return { cena: s.name, inicio: r2(s.a), fim: r2(s.b), fala: s.text, palavras: s.wt.map(x => r2(x + s.a)), antigas: s.old.wt.map(x => (x < lo || x > hi || (s.jump && x > s.jump.from && x < s.jump.to)) ? null : r2(pw(s.pts, x, 1, 0) + s.a)), warp: s.pts.map(p => p.map(r2)), intro: r2(s.P) }; });
const TIMING = window.TIMING;
