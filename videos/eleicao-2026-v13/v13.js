// ======================= v13 — "5 conselhos" sincronizado com a voz real (Google AI Studio) =======================
// Reaproveita as animações da v9/v10 (main.js) e do v6 (old6.js) por "time-warp" (palavra nova ↔ palavra antiga).
// Diferença da v12: os tempos das palavras vêm da voz gravada (voz/tempos.js). Cada cena começa no meio da pausa
// antes da sua 1ª palavra; se a animação precisa de mais tempo, entra silêncio extra no fim da cena
// (o som.py monta a voz com os mesmos cortes, então voz, legenda e animação ficam no mesmo relógio).
const OLD = Object.fromEntries(SCENES.map(s => [s.name, s]));
const ASSETS2 = Promise.all([['urna', 'gancho-urna'], ['calc', 'gancho-calculadora'], ['aerea', 'm2-aerea-radial'], ['aperto', 'estoque-aperto-mao'], ['chaves', 'parcela-chaves-casa'],
  ['capacete', 'mapa-obra-capacete'], ['equipe', 'mapa-obra-equipe'], ['tijolo', 'mapa-tijolo']].map(([k, f]) => loadImg(k, `fotos-banco/${f}.jpg`)));

const TX = {
  gancho: 'Tem gente esperando a eleição passar pra comprar imóvel. Só que esperar também tem preço: o aluguel subiu quase o dobro da inflação.',
  governos: 'Primeiro conselho: não tente adivinhar a eleição. Quem diz que sabe o que vem depois dela está chutando. ' + OLD.governos.text.replace(' Quem vota no Flávio aposta na receita do pai.', ' Com os dois, os juros chegaram a dois dígitos.'),
  entrevistas: 'No debate da Band, Lula disse que foi o único presidente com superávit nos oito anos de governo. Flávio disse que o governo atual deixa uma dívida de onze trilhões. A checagem confirma as duas. Quem te convence mais?',
  mercado: 'Depois do primeiro turno, estrangeiros colocaram dezesseis bilhões na Bolsa. Mas os juros longos, que pesam no financiamento, voltaram a subir após a pesquisa de empate técnico. Depois do debate, o dólar caiu e a Bolsa oscilou.',
  virada: 'Enquanto todo mundo briga por política, quase ninguém olha pra este gráfico.',
  m2: 'Segundo conselho: olhe o histórico. O preço médio do metro quadrado em São Paulo, sem descontar a inflação, subiu com Lula, Dilma, Temer, Bolsonaro e de novo com Lula. Em qualquer governo, quem comprou tijolo não ficou refém da eleição. No Tatuapé, lançamentos já passam de quinze mil o metro quadrado.',
  corrida: 'Terceiro: aluguel não é neutro. Em doze meses, subiu nove por cento, quase o dobro da inflação, e mais que o imóvel.',
  conta: 'Numa simulação para um apê de oitocentos mil no Tatuapé, o aluguel soma seiscentos e oitenta e cinco mil em dez anos. Financiar também tem custo, por isso vale comparar.',
  estoque: 'Quarto: com estoque alto, quem tem poder de negociar é você. Em São Paulo, os imóveis de médio e alto padrão venderam dezoito por cento menos em doze meses. No ritmo atual, levaria treze meses pra vender tudo o que está à venda. Há dois anos, eram sete meses.',
  parcela: 'Quinto: faça a conta da parcela. Na simulação, ela cai e, no oitavo ano, fica menor que o aluguel. E no fim, o patrimônio é seu. Mas só vale se couber no seu bolso.',
  mapa: 'Olhe pra onde a cidade vai: no Eixo Platina, moradia, trabalho e lazer ficam ao lado do metrô. Em volta, são catorze empreendimentos: lançamentos, obras e prédios prontos. E o metrô está chegando à Anália Franco. Governo passa. O tijolo fica.',
  cta: 'Você ainda é do time do aluguel? Ou acha que, com o resultado da eleição, comprar ficará mais fácil? Comenta TIME ALUGUEL ou TIME COMPRA e marca quem está nessa dúvida.',
};
// governos: palavras 18.. da fala nova = palavras 0..28 da fala antiga; a animação antiga para antes da troca Jair → Flávio
const GOVA = [['P', 0]]; for (let k = 0; k <= 28; k++) GOVA.push(['w' + (k + 18), 'w' + k]); GOVA.push(['e', ['w28', 0.55]]);
// src: 'new' = cena nova; 'v9' = main.js; 'o6' = old6.js · intro: nº de palavras do cartão de conselho · hold: tempo mínimo após a última palavra
const V13 = [
  { name: 'gancho', src: 'new', hold: 0.35 },
  { name: 'governos', src: 'v9', hold: 0.45, intro: 18, anchors: GOVA },
  { name: 'entrevistas', src: 'v9', hold: 0.6, anchors: [[0, 0], ['w3', ['w4', -0.3]], ['w4', 'w4'], ['w6', 'w7'], ['w12', 'w13'], [['w17', 0.3], ['w18', 0.1]], ['w18', 'w19'], ['w20', 'w22'], ['w24', 'w26'],
    [['w29', 0.3], 'w31'], [['w35', -0.25], ['e', -0.6]], [['e', -0.45], ['e', -0.6]], ['e', 'e']] },
  { name: 'mercado', src: 'v9', hold: 1.4, anchors: [[0, ['w9', -0.02]], ['w0', ['w9', 0.06]], ['w4', 'w9'], ['w5', 'w10'], ['w6', 'w11'], ['w7', 'w12'], ['w8', 'w14'], ['w9', 'w17'],
    ['w10', 'w18'], ['w12', 'w19'], ['w13', 'w20'], ['w14', 'w21'], ['w15', 'w22'], ['w16', 'w23'], ['w17', ['w24', 0.4]], ['w18', 'w28'], ['w19', 'w29'], ['w20', 'w30'], ['w21', 'w31'], ['w23', 'w32'],
    ['w25', 'w33'], ['w26', 'w34'], [['w27', -0.2], ['w36', 0]], ['e', 'e']] },
  { name: 'virada', src: 'new', hold: 0.35 },
  { name: 'm2', src: 'v9', hold: 0.5, anchors: [[0, 0.6], [0.75, 1.0], [1.15, 2.0], ['w4', 3.55], ['w5', 4.3], ['w20', 'w12'], ['w21', 'w14'], ['w22', 'w16'], ['w23', 'w18'], ['w24', 'w19'],
    ['w25', 'w20'], ['w26', 'w21'], ['w27', 'w22'], ['w28', 'w23'], [['w39', 0.3], ['w24', -0.08]], ['w40', 'w24'], ['w41', 'w26'], ['w42', 'w27'], ['w43', 'w28'],
    ['w44', 'w29'], ['w45', 'w30'], ['w46', 'w31'], ['w47', 'w32'], ['w48', 'w33'], ['w49', 'w34'], ['w50', 'w35'], ['e', 'e']] },
  { name: 'corrida', src: 'o6', hold: 0.6, intro: 5, anchors: [['P', 0.3], ['w5', 0.8], ['w9', 2.0], ['w11', 2.9], ['w12', 3.15], ['w16', 3.36], ['w17', 3.42], ['e', 'e']] },
  { name: 'conta', src: 'o6', hold: 0.5, tail: 'Financiar' },
  { name: 'estoque', src: 'new', hold: 1.2, intro: 11 },
  { name: 'parcela', src: 'o6', hold: 0.6, intro: 6, tail: 'E', tailHold: 5.05 },
  { name: 'mapa', src: 'v9', hold: 1.4, intro: 6, anchors: [['P', 6.62], ['w7', 'w14'], ['w9', 'w19'], ['w10', 'w20'], ['w11', ['w21', 0.2]], ['w12', 'w22'], ['w13', 10.52], [['w17', 0.3], 10.58],
    ['J', ['w17', 0.35], 19.4], ['w21', 20.3], ['w23', 'w47'], ['w24', 'w48'], ['w26', 'w50'], ['w27', 'w51'], [['w28', -0.3], 23.7], ['w28', 'w54'], ['w30', 'w56'], ['w31', 'w57'], ['w32', 'w58'],
    ['w34', 'w60'], ['w35', 'w61'], ['w36', 'w62'], ['w37', 'w63'], ['w38', 'w64'], ['w40', 'w66'], ['e', 'e']] },
  { name: 'cta', src: 'new', hold: 3.4 },
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
// ---- cenas no relógio da voz
const SEQ = []; {
  const VZ = VOZ.w; let iw = 0; const segs = V13.map(e => { const n = TX[e.name].split(' ').length, r = [iw, iw + n - 1]; iw += n; return r; });
  if (iw !== VZ.length) throw new Error(`o texto tem ${iw} palavras e a voz tem ${VZ.length}`);
  const cut = segs.map(([i0], k) => k === 0 ? 0 : (VZ[i0 - 1][2] + VZ[i0][1]) / 2); cut.push(VOZ.dur);
  let a = 0;
  V13.forEach((e, k) => { const text = TX[e.name], nw = text.split(' '), [i0, i1] = segs[k];
    nw.forEach((q, j) => { if (nrm(q) !== nrm(VZ[i0 + j][0])) throw new Error(`${e.name}, palavra ${j}: "${q}" no texto, "${VZ[i0 + j][0]}" na voz`); });
    const c0 = cut[k], c1 = cut[k + 1], o = VZ.slice(i0, i1 + 1).map(x => x[1] - c0), oe = VZ.slice(i0, i1 + 1).map(x => x[2] - c0), end = oe[oe.length - 1];
    const extra = Math.max(0, e.hold - (c1 - c0 - end)), d = c1 - c0 + extra, P = e.intro ? o[e.intro] - 0.35 : 0;
    let old = null, pts = null, jumps = [];
    if (e.src !== 'new') {
      old = e.src === 'o6' ? { d: OLD6.PLAN[e.name][0], wt: OLD6.wtimes(OLD6.PLAN[e.name][1], OLD6.PLAN[e.name][2]), text: OLD6.PLAN[e.name][2] } : OLD[e.name];
      if (e.anchors) { pts = []; e.anchors.forEach(p => { if (p[0] === 'J') { const tn = refT(p[1], o, d, P), from = pw(pts, tn, 0, 1); jumps.push({ tn, to: p[2], from }); pts.push([tn - 1e-4, from], [tn, p[2]]); }
        else pts.push([refT(p[0], o, d, P), refT(p[1], old.wt, old.d, P)]); }); }
      else { const ow = old.text.split(' '), k0 = e.intro || 0, ti = e.tail ? nw.indexOf(e.tail, k0) : nw.length;
        pts = [[P, 0]]; lcs(nw.slice(k0, ti), ow).forEach(([i, j]) => pts.push([o[i + k0], old.wt[j]]));
        if (e.tail) { const lastOld = Math.max(...pts.map(q => q[1])), hv = typeof e.tailHold === 'number' ? Math.max(lastOld, e.tailHold) : old.d - 0.6; pts.push([o[ti] - 0.25, hv], [d - 0.45, hv]); }
        pts.push([d, old.d]); }
      pts.sort((x, y) => x[0] - y[0]);
      const cl = []; pts.forEach(p => { if (!cl.length || (p[0] > cl[cl.length - 1][0] && (p[1] >= cl[cl.length - 1][1] || jumps.some(J => Math.abs(p[0] - J.tn) < 1e-3)))) cl.push(p); }); pts = cl;
    }
    SEQ.push({ name: e.name, src: e.src, a, b: a + d, d, text, wt: o, we: oe, P, intro: e.intro || 0, pts, old, jumps, voz: [c0, c1], extra }); a += d; }); }
DUR = Math.round(SEQ[SEQ.length - 1].b * 100) / 100;
const SQ = Object.fromEntries(SEQ.map(s => [s.name, s]));
const DARK = { mercado: 1, corrida: 1, conta: 1 };
const HOFF = { m2: 1, mapa: 1, mercado: 1 };
window.MAPLITE = 1;
// índice da palavra (n-ésima ocorrência) numa cena
const WI = (sc, w, nth = 0) => { const ws = SQ[sc].text.split(' ').map(nrm); let c = -1; for (let i = 0; i < ws.length; i++) if (ws[i] === nrm(w) && ++c === nth) return i; throw new Error(`palavra "${w}" não está em ${sc}`); };


// ---------- utilidades ----------
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


// ---------- vídeos gravados pelo Pedro (quadros 1080×1920 a 30 fps em clips/<nome>/0001.jpg) ----------
// Highline (Tatuapé): hl_trem, hl_obras, hl_arco, hl_torre · Hectare (Anália Franco): hect_pan, hect_walk
const CLIPN = { hect_pan: 150, hect_walk: 156, hl_trem: 182, hl_obras: 165, hl_arco: 151, hl_torre: 226 };
const CLIPC = new Map(), CLIPWANT = new Set(); let CLIPON = 0, CLIPDRYMODE = false;
function clipKey(name, ct) { const f = clamp(Math.round(ct * 30), 0, CLIPN[name] - 1) + 1; return `clips/${name}/${String(f).padStart(4, '0')}.jpg`; }
function clipImg(name, ct) { const k = clipKey(name, ct); CLIPWANT.add(k); return CLIPC.get(k) || null; }
// desenha um quadro do vídeo cobrindo o retângulo (z: zoom; fx/fy: ponto de foco); marca CLIPON se cobre a faixa da legenda
function clipDraw(ctx, name, ct, x = 0, y = 0, w = W, h = H, r = 0, z = 1, fx = 0.5, fy = 0.5, sh = 0) {
  if (ctx.globalAlpha <= 0) return; if (sh) soft(ctx, x, y, w, h, r, sh, 70, 28);
  const im = clipImg(name, ct); ctx.save(); if (r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.clip(); }
  if (im) { const s = Math.max(w / im.width, h / im.height) * z, iw = im.width * s, ih = im.height * s, dx = clamp(x + w / 2 - fx * iw, x + w - iw, x), dy = clamp(y + h / 2 - fy * ih, y + h - ih, y); ctx.drawImage(im, dx, dy, iw, ih); }
  else { ctx.fillStyle = '#8D99AB'; ctx.fillRect(x, y, w, h); }
  ctx.restore(); if (y < 1500 && y + h > 1600) CLIPON = Math.max(CLIPON, ctx.globalAlpha); }
// escurece topo/base para o texto branco ficar legível sobre o vídeo
function clipShade(ctx, top = 0.62, bot = 0.45) { ctx.save(); let g = ctx.createLinearGradient(0, 0, 0, 760); g.addColorStop(0, `rgba(6,16,32,${top})`); g.addColorStop(1, 'rgba(6,16,32,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, 760);
  g = ctx.createLinearGradient(0, 1250, 0, H); g.addColorStop(0, 'rgba(6,16,32,0)'); g.addColorStop(1, `rgba(6,16,32,${bot})`); ctx.fillStyle = g; ctx.fillRect(0, 1250, W, H - 1250); ctx.restore(); }
function credit(ctx, s, a = 1) { T(ctx, s, 80, 1478, F.med(22), 'rgba(255,255,255,0.78)', 'left', a, 22, 900); }
// pré-carga: renderiza "a seco" (sem mapa) para saber quais quadros de vídeo o quadro t usa, e carrega antes
const CLIPDRY = document.createElement('canvas'); CLIPDRY.width = W; CLIPDRY.height = H; const BLANKC = document.createElement('canvas'); BLANKC.width = W; BLANKC.height = H;
function loadClip(k) { return new Promise(res => { const im = new Image(); im.onload = () => { CLIPC.set(k, im); res(); }; im.onerror = () => res(); im.src = k; }); }
window.clipPrep = async (t) => { CLIPWANT.clear(); const r0 = (typeof MAP !== 'undefined' && MAP) ? MAP.render : null; if (r0) MAP.render = () => ({ canvas: BLANKC, labels: [] });
  CLIPDRYMODE = true; try { render(CLIPDRY, t); } catch (e) { } CLIPDRYMODE = false; if (r0) MAP.render = r0;
  const need = [...CLIPWANT], pre = []; need.forEach(k => { const m = k.match(/clips\/(\w+)\/(\d+)\.jpg/); for (let j = 1; j <= 3; j++) { const f = Math.min(CLIPN[m[1]], +m[2] + j); pre.push(`clips/${m[1]}/${String(f).padStart(4, '0')}.jpg`); } });
  await Promise.all([...need, ...pre].filter(k => !CLIPC.has(k)).map(loadClip));
  while (CLIPC.size > 60) CLIPC.delete(CLIPC.keys().next().value); };
// "soco" de câmera: leve zoom nas palavras de impacto
const PUNCH = [['gancho', 'dobro', 0.04], ['governos', 'não', 0.03], ['governos', 'chutando.', 0.045], ['governos', 'dígitos.', 0.03], ['entrevistas', 'onze', 0.03], ['entrevistas', 'Quem', 0.025],
  ['mercado', 'dezesseis', 0.03], ['virada', 'gráfico.', 0.035], ['corrida', 'dobro', 0.035], ['estoque', 'dezoito', 0.03], ['estoque', 'treze', 0.03], ['parcela', 'oitavo', 0.03], ['mapa', 'fica.', 0.045],
  ['cta', 'TIME', 0.025, 1], ['cta', 'COMPRA', 0.02]].map(([sc, w, a, n]) => [SQ[sc].a + SQ[sc].wt[WI(sc, w, n || 0)], a]);
function punchAt(t) { let z = 0; PUNCH.forEach(([tw_, a]) => { const k = t - tw_ + 0.03; if (k > 0 && k < 0.9) z += a * (k < 0.08 ? k / 0.08 : Math.exp(-(k - 0.08) / 0.22)); }); return z; }

// ---------- cenas novas ----------
const NEW = {}, INTRO = {}, OVER = {};
// GANCHO: vídeo real (Anália Franco) + mensagem do amigo → "esperar também tem preço": aluguel × inflação
NEW.gancho = (ctx, u, s) => { const w = s.wt, d = s.d, tB = w[9] - 0.22;
  const A_ = () => { ctx.save(); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    clipDraw(ctx, 'hect_pan', u * 0.95, 0, 0, W, H, 0, lerp(1.02, 1.1, prog(u, 0, tB + 0.3)), 0.5, 0.5); clipShade(ctx, 0.7, 0.5);
    aw(ctx, 'Tem gente esperando', 540, 350, F.semi(66), '#FFFFFF', u, w[0] - 0.05, 66);
    aw(ctx, 'a eleição passar…', 540, 462, F.it(112), '#F3DDA8', u, w[3] - 0.05, 112, 'center', WD, 960);
    const tn = w[5] - 0.1, kn = SPR(u - tn, 1.4, 0.65); if (kn > 0) notif(ctx, 540, lerp(1980, 1160, clamp(kn, 0, 1.06)), 940, 'Rafael', 'Pedro, vou esperar a eleição passar\npra comprar o apê.', 'agora', 1, 1, 'R');
    credit(ctx, 'Imagens: Anália Franco, out/2026', prog(u, 0.4, 0.9)); ctx.restore(); };
  const B_ = () => { ctx.save(); OLD6.bgLight(ctx);
    head(ctx, u, 'Só que esperar', w[9], 'também tem preço.', w[12], w[15] - 0.3, 330, 112);
    head(ctx, u, 'Em 12 meses, o aluguel', w[15], 'subiu quase o dobro.', w[18], 99, 330, 104);
    const X = 110, Y = 620, Wc = 860, Hc = 640, kc = SPR(u - (w[9] + 0.1), 1.5, 0.6);
    if (kc > 0) { ctx.save(); const sc = lerp(0.9, 1, clamp(kc, 0, 1.05)); ctx.globalAlpha *= clamp(kc * 3); ctx.translate(540, Y + Hc / 2); ctx.scale(sc, sc); ctx.translate(-540, -(Y + Hc / 2));
      soft(ctx, X, Y, Wc, Hc, 40, 0.14, 60, 22); T(ctx, 'QUANTO SUBIU EM 12 MESES', X + 50, Y + 84, F.mono(24), MUTE, 'left', 1, 24, 700, 2);
      [['INFLAÇÃO (IPCA)', 4.58, '#9AA3B2', w[14] - 0.1], ['ALUGUEL', 9.13, GOLDA, w[16] - 0.1]].forEach(([l, v, c, t0], i) => { const y = Y + 230 + i * 200, k = easeOut(prog(u, t0, t0 + 0.7));
        T(ctx, l, X + 50, y - 30, F.semi(36), INK, 'left', prog(u, t0 - 0.2, t0 + 0.1), 36, 500);
        ctx.fillStyle = '#ECECF1'; ctx.beginPath(); ctx.roundRect(X + 50, y, 760, 48, 24); ctx.fill();
        if (k > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(X + 50, y, Math.max(48, 760 * v / 10 * k), 48, 24); ctx.fill(); }
        T(ctx, '+' + (v * k).toFixed(2).replace('.', ',') + '%', X + Wc - 50, y - 30, F.black(54), i ? GOLDA : INK, 'right', clamp(k * 4), 54, 260); });
      slamT(ctx, '≈ 2×', 760, Y + Hc - 64, F.black(96), '#D62828', prog(u, w[20] - 0.08, w[20] + 0.35), 96);
      ctx.restore(); }
    fonte(ctx, 'Fontes: FipeZAP (aluguel, Brasil) e IBGE (IPCA) — 12 meses até set/2026', prog(u, w[14], w[14] + 0.4), 1478);
    ctx.restore(); };
  if (u < tB - 0.12) A_(); else if (u > tB + 0.16) B_(); else xfadeWhip(ctx, prog(u, tB - 0.12, tB + 0.16), A_, B_);
};
// VIRADA: vídeo real do Tatuapé com as manchetes da política → desfoca → "este gráfico"
const HEADL = ['DEBATE NA TV', 'PESQUISA: EMPATE TÉCNICO', '2º TURNO · 25/10', 'BOLSA SOBE', 'DÓLAR CAI', 'JUROS FUTUROS SOBEM', 'NOVA PESQUISA', 'QUEM VAI GANHAR?', 'MERCADO NERVOSO', 'DEBATE NA BAND'];
function miniChart(ctx, x, y, w, h, k, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; soft(ctx, x, y, w, h, 34, 0.2, 50, 20);
  T(ctx, 'PREÇO DO M² · SÃO PAULO', x + 36, y + 56, F.mono(20), MUTE, 'left', 1, 20, w - 60, 2); const n = FIPE.length, bw = (w - 90) / n;
  FIPE.forEach(([yr, v], i) => { const kk = clamp(k * (n + 4) / n - i / n * 1.0), hh = (h - 130) * v / 13000 * easeOut(clamp(kk)); const g = yr < 2016 ? '#E7B3B0' : yr < 2019 ? '#C9DCC2' : yr < 2023 ? '#B7C6EA' : '#E7B3B0';
    ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(x + 45 + i * bw, y + h - 40 - hh, bw - 5, hh, [5, 5, 1, 1]); ctx.fill(); });
  ctx.restore(); }
NEW.virada = (ctx, u, s) => { const w = s.wt, d = s.d, tS = w[6] - 0.25, dim = easeInOut(prog(u, tS, tS + 0.5));
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.save(); if (dim > 0.02) ctx.filter = `blur(${(dim * 10).toFixed(1)}px)`; clipDraw(ctx, 'hl_trem', 0.3 + u, 0, 0, W, H, 0, lerp(1.04, 1.12, prog(u, 0, d)), 0.5, 0.55); ctx.restore();
  ctx.fillStyle = `rgba(8,20,40,${0.18 + 0.5 * dim})`; ctx.fillRect(0, 0, W, H); clipShade(ctx, 0.6 * (1 - dim) + 0.1, 0.4);
  const noise = 1 - dim, r = rng(11);
  HEADL.forEach((h_, i) => { const row = i % 5, dir = row % 2 ? -1 : 1, sp = 120 + r() * 120, y = 660 + row * 150 + r() * 40, x0 = r() * 1400 - 200; let x = x0 + dir * sp * u; x = ((x + 400) % 1700 + 1700) % 1700 - 400;
    const dep = 0.55 + 0.45 * ((i * 7) % 5) / 4, a = noise * 0.92 * clamp(u * 3 - i * 0.12) * dep; if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const b = (1 - dep) * 8 + (1 - noise) * 14; if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`;
    ctx.font = F.semi(34 * dep + 6); const tw_ = ctx.measureText(h_).width; ctx.fillStyle = 'rgba(11,31,58,0.92)'; ctx.beginPath(); ctx.roundRect(x - 26, y - 42 * dep, tw_ + 52, 64 * dep + 8, 14); ctx.fill(); ctx.fillStyle = '#F3DDA8'; ctx.textBaseline = 'middle'; ctx.fillText(h_, x, y - 6 * dep + 6); ctx.restore(); });
  const k1 = 1 - prog(u, tS, tS + 0.3);
  if (k1 > 0) { ctx.save(); ctx.globalAlpha *= k1; aw(ctx, 'Enquanto todo mundo', 540, 350, F.it(96), '#FFFFFF', u, w[0], 96); aw(ctx, 'briga por POLÍTICA,', 540, 482, F.black(108), '#FFFFFF', u, w[3], 108, 'center', WD, 960); ctx.restore(); }
  aw(ctx, 'quase ninguém olha', 540, 350, F.it(96), '#FFFFFF', u, w[6], 96); aw(ctx, 'ESTE GRÁFICO.', 540, 482, F.black(118), '#F3DDA8', u, w[10] - 0.05, 118, 'center', WD, 960);
  const kc = SPR(u - (w[8] - 0.1), 1.5, 0.6); if (kc > 0) { const sc = lerp(0.6, 1, clamp(kc, 0, 1.08)); ctx.save(); ctx.translate(540, 1130); ctx.scale(sc, sc); ctx.translate(-540, -1130); miniChart(ctx, 240, 900, 600, 460, prog(u, w[8], w[11] + 0.3), clamp(kc * 3)); ctx.restore(); }
  const ka = easeOut(prog(u, w[10] - 0.1, w[10] + 0.35)); if (ka > 0) { ctx.save(); ctx.globalAlpha *= ka; ctx.strokeStyle = '#F3DDA8'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(870, 620); ctx.quadraticCurveTo(960, 760, 860 - 20 * (1 - ka), 880); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(838, 852); ctx.lineTo(860, 884); ctx.lineTo(896, 866); ctx.stroke(); ctx.restore(); }
  sparkle(ctx, 540, 1130, u, w[11] - 0.1, 1.2); credit(ctx, 'Imagens: Tatuapé, out/2026', (1 - dim) * prog(u, 0.2, 0.6));
};
// CTA: time do aluguel × time da compra → comentário com o time + marcar alguém → cartão final com Seguir
function heartP(ctx, x, y, s) { ctx.beginPath(); ctx.moveTo(x, y + 16 * s); ctx.bezierCurveTo(x - 36 * s, y - 8 * s, x - 22 * s, y - 34 * s, x, y - 18 * s); ctx.bezierCurveTo(x + 22 * s, y - 34 * s, x + 36 * s, y - 8 * s, x, y + 16 * s); ctx.closePath(); }
function iconRow(ctx, x0, y, st, sc = 1, saveAt = 7.1) {
  ctx.save(); ctx.lineWidth = 5 * sc; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; const gap = 104 * sc;
  const lk = st.like || 0, ls = 1 + 0.35 * Math.sin(Math.PI * clamp(lk * 1.6)) * (lk < 0.62 ? 1 : 0); ctx.save(); ctx.translate(x0, y); ctx.scale(ls * sc * 1.15, ls * sc * 1.15); heartP(ctx, 0, 0, 1);
  if (lk > 0.05) { ctx.fillStyle = '#FF3040'; ctx.fill(); } else { ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke(); } ctx.restore();
  ctx.save(); ctx.translate(x0 + gap, y); ctx.scale(sc, sc); ctx.strokeStyle = st.com ? IGB : INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(0, 0, 24, 0.75, 6.0); ctx.lineTo(-20, 22); ctx.closePath(); ctx.stroke(); ctx.restore();
  ctx.save(); ctx.translate(x0 + gap * 2, y); ctx.scale(sc, sc); ctx.strokeStyle = st.sent ? IGB : INK; ctx.lineWidth = 4.5; ctx.beginPath(); ctx.moveTo(-24, -20); ctx.lineTo(26, -22); ctx.lineTo(4, 24); ctx.lineTo(0, 0); ctx.closePath(); ctx.moveTo(0, 0); ctx.lineTo(26, -22); ctx.stroke(); ctx.restore();
  const sv = st.save || 0; ctx.save(); ctx.translate(x0 + gap * saveAt, y); ctx.scale(sc * (1 + 0.25 * Math.sin(Math.PI * clamp(sv * 1.8)) * (sv < 0.56 ? 1 : 0)), sc); ctx.beginPath(); ctx.moveTo(-18, -26); ctx.lineTo(18, -26); ctx.lineTo(18, 26); ctx.lineTo(0, 12); ctx.lineTo(-18, 26); ctx.closePath();
  if (sv > 0.05) { ctx.fillStyle = INK; ctx.fill(); } else { ctx.strokeStyle = INK; ctx.lineWidth = 4.5; ctx.stroke(); } ctx.restore();
  ctx.restore(); }
function keyIcon(ctx, x, y, s, rot, col = '#E2C27F') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 16; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(-70, 0, 42, 0, 6.283); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-28, 0); ctx.lineTo(96, 0); ctx.stroke(); ctx.fillRect(56, 0, 14, 34); ctx.fillRect(82, 0, 14, 46); ctx.restore(); }
function teamCard(ctx, kind, cx, cy, sc, a, on, u, tKey) { if (a <= 0) return; const Wc = 420, Hc = 560; ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(sc, sc);
  if (kind === 'aluguel') { ctx.rotate(0.03 * Math.sin(u * 2.4) * (1 - on * 0.5));
    shadowed(ctx, () => { ctx.fillStyle = '#F4C430'; ctx.beginPath(); ctx.roundRect(-Wc / 2, -Hc / 2, Wc, Hc, 36); ctx.fill(); }, 0.25 + 0.1 * on, 40, 18);
    ctx.strokeStyle = '#1A1A1E'; ctx.lineWidth = 8; ctx.beginPath(); ctx.roundRect(-Wc / 2 + 22, -Hc / 2 + 22, Wc - 44, Hc - 44, 22); ctx.stroke();
    T(ctx, 'TIME', 0, -150, F.mono(34), '#1A1A1E', 'center', 1, 34, 300, 8); T(ctx, 'ALUGUEL', 0, -60, F.black(78), '#1A1A1E', 'center', 1, 78, 360);
    // calendário: um boleto por mês
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = -132 + c * 72, y = 10 + r * 62, lit = (r * 4 + c) <= Math.floor((u * 4) % 12); ctx.fillStyle = lit ? '#1A1A1E' : 'rgba(26,26,30,0.18)'; ctx.beginPath(); ctx.roundRect(x, y, 52, 44, 8); ctx.fill();
      if (lit) T(ctx, 'R$', x + 26, y + 30, F.semi(20), '#F4C430', 'center', 1, 20); }
    T(ctx, 'todo mês', 0, 236, F.it(40), '#1A1A1E', 'center', 1, 40); }
  else { shadowed(ctx, () => { const g = ctx.createLinearGradient(0, -Hc / 2, 0, Hc / 2); g.addColorStop(0, '#14305A'); g.addColorStop(1, '#0B1F3A'); ctx.fillStyle = g; ctx.beginPath(); ctx.roundRect(-Wc / 2, -Hc / 2, Wc, Hc, 36); ctx.fill(); }, 0.28 + 0.1 * on, 40, 18);
    ctx.strokeStyle = 'rgba(226,194,127,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-Wc / 2 + 22, -Hc / 2 + 22, Wc - 44, Hc - 44, 22); ctx.stroke();
    T(ctx, 'TIME', 0, -150, F.mono(34), '#E2C27F', 'center', 1, 34, 300, 8); T(ctx, 'COMPRA', 0, -60, F.black(78), '#FFFFFF', 'center', 1, 78, 360);
    const kr = easeInOut(prog(u, tKey, tKey + 0.6)); keyIcon(ctx, 0, 110, 0.95, -0.5 + kr * 0.5 - Math.sin(Math.PI * kr) * 0.4);
    T(ctx, 'a chave é sua', 0, 236, F.it(40), '#E2C27F', 'center', 1, 40); if (u > tKey + 0.3) sparkle(ctx, 0, 110, u, tKey + 0.3, 0.9); }
  ctx.restore(); }
NEW.cta = (ctx, u, s) => { const w = s.wt, d = s.d; BGS.cta(ctx);
  const tA = w[4] - 0.12, tV = w[7] - 0.12, tC = w[15] - 0.1, tSheet = w[19] - 0.25, tP1 = w[20] - 0.05, tP2 = w[23] - 0.05, tM = w[26] - 0.05, tSend = w[30] + 0.2, tFinal = d - 3.3, tFollow = tFinal + 1.1;
  head(ctx, u, 'Você ainda é do', w[0], 'time do aluguel?', w[3], w[7] - 0.3, 300, 112);
  head(ctx, u, 'Ou acha que, com a eleição,', w[7], 'comprar ficará mais fácil?', w[15], tSheet, 300, 92);
  head(ctx, u, 'Comenta o seu time', w[19], 'e marca quem está na dúvida.', w[25], tFinal - 0.3, 300, 86);
  const outAll = easeInOut(prog(u, tFinal - 0.3, tFinal + 0.3));
  if (outAll < 1) { ctx.save(); ctx.globalAlpha *= 1 - outAll; ctx.translate(0, -outAll * 160);
    const ksh = easeInOut(prog(u, tSheet, tSheet + 0.6)), cyT = lerp(960, 620, ksh), scT = lerp(1, 0.52, ksh);
    const kL = SPR(u - tA, 1.6, 0.6), kR = SPR(u - tV - 0.15, 1.6, 0.6), onL = 1 - prog(u, tV, tV + 0.3), onR = prog(u, tC - 0.1, tC + 0.3);
    const xL = lerp(300, 330, ksh), xR = lerp(780, 750, ksh);
    teamCard(ctx, 'aluguel', xL - (1 - clamp(kL)) * 120, cyT, scT * lerp(0.85, 1, clamp(kL, 0, 1.05)) * (1 + 0.04 * onL * (1 - ksh)), clamp(kL * 3) * (1 - 0.45 * onR * (1 - ksh)), onL, u, 0);
    teamCard(ctx, 'compra', xR + (1 - clamp(kR)) * 120, cyT, scT * lerp(0.85, 1, clamp(kR, 0, 1.05)) * (1 + 0.04 * onR * (1 - ksh)), clamp(kR * 3), onR, u, tC);
    const kv = clamp(SPR(u - tV, 2, 0.5), 0, 1.15) * (1 - ksh); if (kv > 0) { ctx.save(); ctx.translate(540, cyT); ctx.scale(kv, kv); shadowed(ctx, () => { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.arc(0, 0, 64, 0, 6.283); ctx.fill(); }, 0.25, 26, 10);
      ctx.strokeStyle = GOLDA; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(0, 0, 56, 0, 6.283); ctx.stroke(); T(ctx, 'VS', 0, 18, F.black(52), NAVY, 'center', 1, 52); ctx.restore(); }
    // folha de comentários
    const kc = SPR(u - tSheet - 0.1, 1.4, 0.7); let cy = 1950;
    if (kc > 0.001) { cy = lerp(1950, 860, clamp(kc, 0, 1.04)); soft(ctx, 40, cy, 1000, 1200, 52, 0.22, 70, -10); ctx.fillStyle = '#D9DADF'; ctx.beginPath(); ctx.roundRect(500, cy + 20, 80, 8, 4); ctx.fill();
      T(ctx, 'Comentários', 540, cy + 86, F.semi(34), INK, 'center', 1, 34); ctx.fillStyle = LINE; ctx.fillRect(40, cy + 118, 1000, 2);
      T(ctx, 'Qual é o seu time?', 540, cy + 196, F.semi(44), INK, 'center', 1, 44);
      [['TIME ALUGUEL', 300, tP1, '#F4C430', '#1A1A1E'], ['TIME COMPRA', 780, tP2, NAVY, '#F3DDA8']].forEach(([l, x, t0, bgc, fg]) => { const on = prog(u, t0 - 0.05, t0 + 0.2) * (1 - prog(u, t0 + 0.9, t0 + 1.2)), sc = 1 + 0.08 * on; ctx.save(); ctx.translate(x, cy + 300); ctx.scale(sc, sc);
        ctx.fillStyle = on > 0.5 ? bgc : '#FFFFFF'; shadowed(ctx, () => { ctx.beginPath(); ctx.roundRect(-210, -50, 420, 100, 50); ctx.fill(); }, 0.12 + 0.12 * on, 14, 6);
        ctx.strokeStyle = bgc === NAVY ? NAVY : '#C9A22B'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(-210, -50, 420, 100, 50); ctx.stroke(); T(ctx, l, 0, 15, F.black(40), on > 0.5 ? fg : NAVY, 'center', 1, 40, 380); ctx.restore(); });
      // campo do comentário: "@" e sugestões de quem marcar
      const fy = cy + 430, nTy = Math.floor(clamp((u - tM) / 0.12, 0, 3)), picked = u > tM + 0.95, typed = picked ? '@rafael ' : '@ra'.slice(0, nTy), sent = u > tSend;
      ctx.fillStyle = '#F2F2F5'; ctx.beginPath(); ctx.roundRect(90, fy, 790, 88, 44); ctx.fill();
      T(ctx, sent ? 'Comentário publicado ✓' : (typed || 'Adicione um comentário…'), 130, fy + 57, F.med(34), typed && !sent ? IGB : MUTE, 'left', 1, 34, 700);
      if (typed && !picked && !sent && Math.floor(u * 3) % 2 === 0) { ctx.font = F.med(34); ctx.fillStyle = IGB; ctx.fillRect(130 + ctx.measureText(typed).width + 4, fy + 22, 4, 44); }
      ctx.fillStyle = picked && !sent ? IGB : '#B9C3D0'; ctx.beginPath(); ctx.arc(935, fy + 44, 40, 0, 6.283); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(935, fy + 62); ctx.lineTo(935, fy + 26); ctx.moveTo(920, fy + 40); ctx.lineTo(935, fy + 26); ctx.lineTo(950, fy + 40); ctx.stroke();
      const ks = prog(u, tM + 0.3, tM + 0.55) * (1 - prog(u, tM + 1.0, tM + 1.25)); if (ks > 0) { ctx.save(); ctx.globalAlpha *= ks; [['rafael', 'R', '#C9D3E2'], ['ana.c', 'A', '#D7C6E6'], ['marcos', 'M', '#C9D8C2']].forEach(([n, l, c], i) => { const y = fy + 160 + i * 110;
        ctx.fillStyle = i === 0 && u > tM + 0.85 ? '#EEF2FA' : '#FFFFFF'; ctx.fillRect(60, y - 50, 960, 100); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(140, y, 40, 0, 6.283); ctx.fill(); T(ctx, l, 140, y + 14, F.semi(38), '#fff', 'center', 1, 38); T(ctx, n, 210, y + 12, F.semi(34), INK, 'left', 1, 34); }); ctx.restore(); }
    }
    const tp = cursorPath(u, [[tP1 - 0.4, 300, cy + 300], [tP1 + 0.1, 300, cy + 300], [tP2 - 0.3, 780, cy + 300], [tP2 + 0.15, 780, cy + 300], [tM + 0.5, 300, cy + 590], [tM + 0.95, 300, cy + 590], [tSend - 0.3, 935, cy + 474], [tSend + 0.2, 935, cy + 474]]);
    touch(ctx, tp.x, tp.y, u, [tP1, tP2, tM + 0.85, tSend], clamp((u - tP1 + 0.4) * 5) * (1 - clamp((u - tSend - 0.4) * 4)));
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


// ESTOQUE (conselho 4): vendas em 12 meses (barras rotuladas) → meses pra vender o estoque: hoje 13, há dois anos 7
function monthRow(ctx, x0, y, n, k, col, lit) { for (let i = 0; i < n; i++) { const ki = clamp(k * n - i); if (ki <= 0) continue; const x = x0 + i * 62, sc = lerp(0.6, 1, easeOut(ki));
    ctx.save(); ctx.globalAlpha *= clamp(ki * 2); ctx.translate(x + 26, y + 32); ctx.scale(sc, sc); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-26, -32, 52, 64, 10); ctx.fill();
    ctx.fillStyle = lit; ctx.fillRect(-26, -32, 52, 14); ctx.restore(); } }
NEW.estoque = (ctx, u, s) => { const w = s.wt, d = s.d; OLD6.bgLight(ctx);
  const iSP = WI('estoque', 'São'), iM = WI('estoque', 'médio'), iV = WI('estoque', 'venderam'), i18 = WI('estoque', 'dezoito'), iMen = WI('estoque', 'menos'), iNo = WI('estoque', 'No'), i13 = WI('estoque', 'treze'),
    iVen = WI('estoque', 'vender'), iHa = WI('estoque', 'Há'), i7 = WI('estoque', 'sete');
  T(ctx, 'CONSELHO 4 · NEGOCIE', 80, 290, F.mono(24), NAVY, 'left', prog(u, s.P + 0.1, s.P + 0.5), 24, 900, 2);
  const tB = w[iNo] - 0.3, kB = easeInOut(prog(u, tB, tB + 0.5));
  // parte A: vendas
  if (kB < 1) { ctx.save(); ctx.globalAlpha *= 1 - kB; ctx.translate(0, -60 * kB);
    head(ctx, u, 'Médio e alto padrão', w[iM], 'vendeu 18% menos.', w[i18], 99, 372, 100);
    const kc = SPR(u - (w[iSP] - 0.15), 1.5, 0.6); if (kc > 0) pop(ctx, clamp(kc, 0, 1.05), 540, 600, () => { ctx.font = F.mono(24); const t_ = 'CIDADE DE SÃO PAULO · IMÓVEIS VENDIDOS EM 12 MESES', tw_ = ctx.measureText(t_).width + 56;
      shadowed(ctx, () => { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(540 - tw_ / 2, 572, tw_, 58, 29); ctx.fill(); }, 0.12, 16, 6); T(ctx, t_, 540, 610, F.mono(24), NAVY, 'center', 1, 24, 940, 1); });
    const X = 110, Y = 668, Wc = 860, Hc = 560; if (kc > 0) { ctx.save(); ctx.globalAlpha *= clamp(kc * 3); soft(ctx, X, Y, Wc, Hc, 40, 0.14, 60, 22);
      [['12 meses até jul/2025', '≈ 44,5 mil', 1, '#B9C0CC', w[iV] - 0.1], ['12 meses até jul/2026', '36,5 mil', 36.5 / 44.5, NAVY, w[i18] - 0.15]].forEach(([l, v, f, c, t0], i) => {
        const y = Y + 140 + i * 190, k = easeOut(prog(u, t0, t0 + 0.8)); T(ctx, l, X + 50, y - 26, F.semi(34), INK, 'left', prog(u, t0 - 0.25, t0), 34, 480);
        T(ctx, v, X + Wc - 50, y - 26, F.black(48), i ? NAVY : '#7D8594', 'right', prog(u, t0 + 0.2, t0 + 0.5), 48, 300);
        ctx.fillStyle = '#ECECF1'; ctx.beginPath(); ctx.roundRect(X + 50, y, 760, 54, 14); ctx.fill(); if (k > 0) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(X + 50, y, Math.max(20, 760 * f * k), 54, 14); ctx.fill(); }
        if (i === 1 && k > 0.95) { const kg = easeOut(prog(u, t0 + 0.75, t0 + 1.2)); ctx.save(); ctx.globalAlpha *= kg; ctx.setLineDash([10, 8]); ctx.strokeStyle = '#D62828'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(X + 50 + 760 * f, y, 760 * (1 - f), 54, 14); ctx.stroke(); ctx.restore(); } });
      slamT(ctx, '−18%', 540, Y + 500, F.black(110), '#D62828', prog(u, w[i18] + 0.2, w[i18] + 0.6), 110);
      ctx.restore(); }
    T(ctx, '≈ 8 mil imóveis a menos vendidos em um ano', 540, 1300, F.it(46), GOLDA, 'center', prog(u, w[iMen], w[iMen] + 0.4), 46, 900);
    ctx.restore(); }
  // parte B: tempo pra vender o estoque
  if (kB > 0) { ctx.save(); ctx.globalAlpha *= kB; ctx.translate(0, 60 * (1 - kB));
    head(ctx, u, 'No ritmo atual,', w[iNo], '13 meses pra vender tudo.', w[i13], 99, 372, 96);
    const X = 110, Y = 630, Wc = 860, Hc = 640; soft(ctx, X, Y, Wc, Hc, 40, 0.14, 60, 22);
    T(ctx, 'MESES PRA VENDER TUDO QUE ESTÁ À VENDA', X + 50, Y + 74, F.mono(23), MUTE, 'left', 1, 23, 760, 1.5);
    const k1 = easeInOut(prog(u, w[i13] - 0.1, w[iVen] + 0.3)), k2 = easeInOut(prog(u, w[iHa] + 0.1, w[i7] + 0.1));
    T(ctx, 'Hoje (ago/2026)', X + 50, Y + 160, F.semi(36), INK, 'left', 1, 36, 480); T(ctx, Math.round(13 * k1) + ' meses', X + Wc - 50, Y + 160, F.black(50), GOLDA, 'right', clamp(k1 * 4), 50, 300);
    monthRow(ctx, X + 50, Y + 190, 13, k1, NAVY, '#E2C27F');
    T(ctx, 'Há dois anos (2024)', X + 50, Y + 380, F.semi(36), INK, 'left', prog(u, w[iHa] - 0.1, w[iHa] + 0.2), 36, 480); T(ctx, Math.round(7 * k2) + ' meses', X + Wc - 50, Y + 380, F.black(50), '#7D8594', 'right', clamp(k2 * 4), 50, 300);
    monthRow(ctx, X + 50, Y + 410, 7, k2, '#B9C0CC', '#DDE1E8');
    const kq = SPR(u - (w[i7] + 0.35), 1.5, 0.6); if (kq > 0) pop(ctx, clamp(kq, 0, 1.05), 540, Y + 560, () => { shadowed(ctx, () => { ctx.fillStyle = NAVY; ctx.beginPath(); ctx.roundRect(170, Y + 514, 740, 92, 46); ctx.fill(); }, 0.22, 22, 8);
      T(ctx, 'Mais estoque = mais espaço pra negociar', 540, Y + 574, F.semi(36), '#F3DDA8', 'center', 1, 36, 680); });
    ctx.restore(); }
  T(ctx, 'Fonte: Secovi-SP, cidade de SP — médio e alto padrão: vendas em 12 meses até jul/2026 (2025 calculado pela queda de 18%);', 540, 1462, F.med(21), '#5B6577', 'center', prog(u, s.P + 0.4, s.P + 0.8), 21, 960);
  T(ctx, 'estoque em meses de venda: ago/2026 e 2024', 540, 1490, F.med(21), '#5B6577', 'center', prog(u, s.P + 0.4, s.P + 0.8), 21, 960);
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
  const tS = 0.25, tL = w[6] + 0.15, kk = prog(u, tS, tL), ph = 8 * Math.PI * easeOut(kk), R = lerp(62, 200, easeOut(prog(u, 0, 0.55))), idx = Math.floor((ph + Math.PI / 2) / Math.PI);
  const face = idx === 0 ? 'x' : idx >= 8 ? '?' : idx % 2 ? 'lula' : 'flavio', y = 980 - 280 * Math.sin(Math.PI * kk), sx = Math.abs(Math.cos(ph));
  const sh = 1 - 0.5 * Math.sin(Math.PI * kk); ctx.save(); ctx.globalAlpha *= 0.25 * prog(u, 0.1, 0.4); ctx.fillStyle = '#0B1F3A'; ctx.filter = 'blur(14px)'; ctx.beginPath(); ctx.ellipse(540, 1215, 170 * sh, 28 * sh, 0, 0, 6.283); ctx.fill(); ctx.restore();
  coinFace(ctx, 540, y, R * (1 + 0.06 * Math.sin(Math.PI * kk)), sx, face); if (u > tL) sparkle(ctx, 540, 980, u, tL, 1.3);
  T(ctx, 'cara ou coroa?', 540, 1330, F.it(54), NAVY, 'center', prog(u, w[2], w[2] + 0.3) * (1 - prog(u, w[7] - 0.1, w[7] + 0.2)), 54);
  // palpites de quem "sabe" o que vem depois
  const tC = w[17] - 0.08, kC = prog(u, tC, tC + 0.4);
  [['Vai disparar!', 110, 540, false, w[8]], ['Vai despencar!', 970, 650, true, w[10] + 0.05], ['Melhor esperar…', 110, 1215, false, w[13]]].forEach(([t_, x, y, out, t0]) => {
    const k = prog(u, t0 - 0.05, t0 + 0.3); if (k <= 0) return; ctx.save(); ctx.globalAlpha *= 1 - 0.6 * kC; bubble(ctx, t_, x, y, out, F.semi(40), k); ctx.restore(); });
  if (kC > 0) { ctx.save(); ctx.translate(540, 990); ctx.rotate(-0.12); const sc = lerp(1.6, 1, easeOut(clamp(kC * 1.6))); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(kC * 4);
    shadowed(ctx, () => { ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.beginPath(); ctx.roundRect(-310, -100, 620, 200, 24); ctx.fill(); }, 0.2, 30, 10);
    ctx.strokeStyle = '#D62828'; ctx.lineWidth = 12; ctx.beginPath(); ctx.roundRect(-292, -82, 584, 164, 18); ctx.stroke(); T(ctx, 'É CHUTE.', 0, 42, F.black(118), '#D62828', 'center', 1, 118, 540); ctx.restore(); }
};
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
  label(ctx, 'CONSELHO 4 DE 5', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Com estoque alto,', 540, 350, F.semi(66), INK, u, w[1], 66); aw(ctx, 'quem negocia é você.', 540, 462, F.it(104), GOLDA, u, w[4], 104, 'center', WD, 960);
  const m = imgCard(ctx, 'aperto', 110, 560, 860, 860, 44, lerp(1.02, 1.2, easeInOut(prog(u, 0, s.P + 0.4))), 0.5, 0.53); if (m) { const [hx, hy] = m(470, 720); sparkle(ctx, hx, hy, u, w[8] + 0.1, 1.1); } };
INTRO.mapa = (ctx, u, s) => { const w = s.wt, P = s.P; base_(ctx, '#F5F5F7'); glow(ctx, 540, 1000, 900, 'rgba(184,149,90,0.12)');
  label(ctx, 'E POR ÚLTIMO', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Olhe pra onde', 540, 350, F.semi(66), INK, u, w[0], 66); aw(ctx, 'a cidade vai.', 540, 462, F.it(112), GOLDA, u, w[3], 112, 'center', WD, 960);
  const t1 = w[2] - 0.15, t2 = w[4] - 0.15;
  const A_ = () => clipDraw(ctx, 'hl_arco', 0.2 + u * 0.9, 110, 560, 860, 860, 44, lerp(1.0, 1.1, prog(u, 0, t1 + 0.2)), 0.5, 0.55, 0.18), B_ = () => imgCard(ctx, 'capacete', 110, 560, 860, 860, 44, lerp(1.04, 1.14, prog(u, t1, P + 0.4)), 0.42, 0.6);
  if (u < t1 + 0.2) xfadeWhip(ctx, prog(u, t1 - 0.12, t1 + 0.16), A_, B_); else B_();
  T(ctx, 'Imagens: Tatuapé, out/2026', 540, 1462, F.med(22), MUTE, 'center', 1 - prog(u, t1 - 0.1, t1 + 0.1), 22);
  const ke = SPR(u - t2, 1.6, 0.6); if (ke > 0) { ctx.save(); ctx.globalAlpha *= clamp(ke * 3); ctx.translate(640, 1000); ctx.rotate(0.06 - 0.02 * clamp(ke)); ctx.scale(lerp(0.8, 1, clamp(ke, 0, 1.05)), lerp(0.8, 1, clamp(ke, 0, 1.05)));
    ctx.fillStyle = '#fff'; shadowed(ctx, () => { ctx.beginPath(); ctx.roundRect(-250, -380, 500, 760, 26); ctx.fill(); }, 0.3, 40, 18); imgCard(ctx, 'equipe', -232, -362, 464, 724, 16, 1.02, 0.5, 0.5, 0); ctx.restore(); } };

INTRO.parcela = (ctx, u, s) => { const w = s.wt; OLD6.bgLight(ctx);
  label(ctx, 'CONSELHO 5 DE 5', 250, GOLDA, prog(u, 0.1, 0.5)); aw(ctx, 'Faça a conta', 540, 350, F.semi(66), INK, u, w[1], 66); aw(ctx, 'da parcela.', 540, 462, F.it(112), GOLDA, u, w[4], 112, 'center', WD, 960);
  const m = imgCard(ctx, 'calc', 110, 560, 860, 860, 44, lerp(1.0, 1.16, easeInOut(prog(u, 0, s.P + 0.4))), 0.5, 0.5); if (m) { const [x0, y0] = m(168, 648), [x1, y1] = m(574, 708);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip(); const hh = y1 - y0, on = Math.floor(u * 2.6) % 2 === 0; T(ctx, '= ?', x1 - 22, y1 - hh * 0.16, F.mono(hh * 0.86), 'rgba(28,32,24,0.85)', 'right', prog(u, w[3] - 0.1, w[3] + 0.2), hh * 0.86, 600);
      if (on && u > w[3]) { ctx.fillStyle = 'rgba(28,32,24,0.8)'; ctx.fillRect(x1 - 16, y0 + hh * 0.18, 6, hh * 0.64); } ctx.restore(); } };
// ---------- camadas por cima das cenas reaproveitadas ----------
OVER.entrevistas = (ctx, u, s) => { const nw = s.text.split(' '), ti = nw.indexOf('Quem'), t0 = s.wt[ti] - 0.15, k = prog(u, t0, t0 + 0.35) * (1 - easeIn(prog(u, s.d - 0.5, s.d - 0.25))); if (k <= 0) return;
  const Y = 1408; pop(ctx, k, 540, Y, () => { soft(ctx, 170, Y - 56, 740, 112, 56, 0.2, 40, 14); ctx.strokeStyle = IGB; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(255, Y, 24, 0.75, 6.0); ctx.lineTo(236, Y + 20); ctx.closePath(); ctx.stroke();
    T(ctx, 'Quem te convence mais?', 580, Y + 17, F.black(46), INK, 'center', 1, 46, 600); }); };
// governos: "Com os dois, os juros chegaram a dois dígitos" — destaca os dois juros e fecha com a faixa
OVER.governos = (ctx, u, s) => { const w = s.wt, i0 = WI('governos', 'Com', 2), t0 = w[i0] - 0.1, k = clamp(SPR(u - t0, 1.6, 0.6), 0, 1.08); if (k <= 0) return;
  [290, 790].forEach((x, j) => { const kk = easeOut(prog(u, t0 + 0.1 + j * 0.15, t0 + 0.5 + j * 0.15)); if (kk <= 0) return; ctx.save(); ctx.globalAlpha *= kk; ctx.strokeStyle = GOLDA; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.roundRect(x - 10, 990, 216, 66, 18); ctx.stroke(); ctx.restore(); });
  pop(ctx, k, 540, 1390, () => { shadowed(ctx, () => { ctx.fillStyle = NAVY; ctx.beginPath(); ctx.roundRect(150, 1342, 780, 96, 48); ctx.fill(); }, 0.25, 26, 10);
    T(ctx, 'NOS DOIS: JUROS DE DOIS DÍGITOS', 540, 1402, F.black(36), '#F3DDA8', 'center', 1, 36, 720); }); };
OVER.m2 = (ctx, u, s) => { const w = s.wt, iS = WI('m2', 'sem'), iSub = WI('m2', 'subiu'), iEm = WI('m2', 'Em', 1), iNo = WI('m2', 'No'), iQ = WI('m2', 'quinze');
  const tT = w[iNo] - 0.3, kT = easeInOut(prog(u, tT, tT + 0.5));
  if (kT < 1) {
    head(ctx, u, 'Segundo conselho:', w[0], 'olhe o histórico.', w[2], w[iSub] - 0.3);
    head(ctx, u, 'subiu em todos', w[iSub], 'os governos.', w[iSub + 2], w[iEm] - 0.3);
    head(ctx, u, 'Em qualquer governo,', w[iEm], 'quem comprou não ficou refém.', w[iEm + 3], tT + 0.3, 330, 88);
    const kn = prog(u, w[iS] - 0.1, w[iS] + 0.3) * (1 - prog(u, tT - 0.2, tT)); if (kn > 0) pop(ctx, kn, 540, 596, () => { ctx.font = F.mono(24); const t_ = 'VALORES NOMINAIS · SEM DESCONTAR A INFLAÇÃO', tw_ = ctx.measureText(t_).width + 60;
      shadowed(ctx, () => { ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.roundRect(540 - tw_ / 2, 566, tw_, 60, 30); ctx.fill(); }, 0.14, 18, 6); T(ctx, t_, 540, 604, F.mono(24), NAVY, 'center', 1, 24, 900, 1); });
    T(ctx, 'Preços nominais, sem descontar a inflação. Histórico não garante valorização futura.', 540, 1508, F.med(22), MUTE, 'center', prog(u, w[iS], w[iS] + 0.5), 22, 960); }
  if (kT > 0) { ctx.save(); ctx.translate(0, H * (1 - kT)); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
    clipDraw(ctx, 'hl_obras', 0.2 + Math.max(0, u - tT) * 0.85, 0, 0, W, H, 0, lerp(1.08, 1.0, prog(u, tT, s.d)), 0.5, 0.45); clipShade(ctx, 0.72, 0.5);
    aw(ctx, 'Na planta, no Tatuapé:', 540, 350, F.semi(64), '#FFFFFF', u, w[iNo] + 0.05, 64); aw(ctx, 'mais de R$ 15 mil/m²', 540, 472, F.it(104), '#F3DDA8', u, w[iQ] - 0.1, 104, 'center', WD, 960);
    credit(ctx, 'Imagens: Tatuapé, out/2026 · Preço: tabelas de lançamentos, out/2026 (Vista Broker)', prog(u, tT + 0.3, tT + 0.7)); ctx.restore(); } };
OVER.mapa = (ctx, u, s, uo) => { const w = s.old.wt, nw = s.wt, d = s.d, tE = w[13];
  const fo = easeIn(prog(uo, s.old.d - 0.45, s.old.d)); ctx.save(); ctx.globalAlpha *= 1 - fo;
  head(ctx, uo, 'Eixo Platina:', tE, 'morar, trabalhar, viver.', w[19], 10.6, 290, 100);
  head(ctx, uo, 'E o metrô', tL2, 'está chegando.', w[57], tEnd - 0.3, 290, 104);
  head(ctx, uo, 'Governo passa.', tEnd, 'O tijolo fica.', w[64], 99, 290, 124); ctx.restore();
  // fechamento: a torre vista do Highline (vídeo real), câmera subindo
  const iG = WI('mapa', 'Governo'), tB = nw[iG] - 0.3, kb = easeInOut(prog(u, tB, tB + 0.45)); if (kb <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(kb * 1.5); zoomAt(ctx, 1 - kb, 540, 960, 1.15); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  clipDraw(ctx, 'hl_torre', 0.4 + Math.max(0, u - tB) * 1.45, 0, 0, W, H, 0, 1.02, 0.5, 0.5); clipShade(ctx, 0.72, 0.4);
  aw(ctx, 'Governo passa.', 540, 300, F.semi(64), '#FFFFFF', u, nw[iG], 64); aw(ctx, 'O tijolo fica.', 540, 422, F.it(124), '#F3DDA8', u, nw[iG + 2] - 0.05, 124, 'center', WD, 960);
  if (u > nw[iG + 4]) sparkle(ctx, 640, 700, u, nw[iG + 4], 1.3); credit(ctx, 'Imagens: Tatuapé, out/2026', prog(u, tB + 0.3, tB + 0.7)); ctx.restore(); };
// parcela: "E no fim, o patrimônio é seu" sobre a caminhada até a sala vazia (Hectare)
OVER.parcela = (ctx, u, s) => { const w = s.wt, iE = WI('parcela', 'E', 1), iM = WI('parcela', 'Mas'), t0 = w[iE] - 0.3, k = easeInOut(prog(u, t0, t0 + 0.5)); if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k * 1.6); zoomAt(ctx, 1 - k, 540, 960, 1.12); ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  clipDraw(ctx, 'hect_walk', Math.max(0, u - t0) * 0.9, 0, 0, W, H, 0, 1.0, 0.5, 0.5); clipShade(ctx, 0.72, 0.45);
  const kM = prog(u, w[iM] - 0.25, w[iM] + 0.05);
  ctx.save(); ctx.globalAlpha *= 1 - kM; aw(ctx, 'E no fim,', 540, 350, F.semi(66), '#FFFFFF', u, w[iE], 66); aw(ctx, 'o patrimônio é seu.', 540, 462, F.it(112), '#F3DDA8', u, w[iE + 3], 112, 'center', WD, 960); ctx.restore();
  aw(ctx, 'Mas só vale', 540, 350, F.semi(66), '#FFFFFF', u, w[iM], 66); aw(ctx, 'se couber no seu bolso.', 540, 462, F.it(96), '#F3DDA8', u, w[iM + 3], 96, 'center', WD, 960);
  credit(ctx, 'Imagens: Anália Franco, out/2026', prog(u, t0 + 0.3, t0 + 0.7)); ctx.restore(); };
// conta: o outro lado da comparação
OVER.conta = (ctx, u, s) => { const i = WI('conta', 'Financiar'), t0 = s.wt[i] - 0.05, k = clamp(SPR(u - t0, 1.5, 0.65), 0, 1.06); if (k <= 0) return;
  pop(ctx, k, 540, 1320, () => { soft(ctx, 120, 1250, 840, 150, 40, 0.3, 50, 18, '#FFFFFF'); T(ctx, 'Financiar também tem custo.', 540, 1308, F.semi(42), INK, 'center', 1, 42, 760);
    T(ctx, 'Compare as duas contas.', 540, 1368, F.it(48), GOLDA, 'center', prog(u, s.wt[i + 4] - 0.1, s.wt[i + 4] + 0.3), 48, 760); }); };
window.NUP_MIN = 14;

// MERCADO: títulos no tempo antigo + quadro "depois do debate" (letreiro de aeroporto, split-flap)
const POSDEB = { quando: 'parcial de segunda (19/10), até 13h40', rows: [['DÓLAR', 'R$ 5,06', '▼ 0,3%'], ['IBOVESPA', '204,5 MIL', '▼ 0,5%']], polls: [['ATLASINTEL', '49,8 × 47,6'], ['BTG/NEXUS', '46,5 × 45,9']],
  fonte: 'Fontes: InfoMoney (B3 e câmbio) · Reuters (pesquisas AtlasIntel/Bloomberg e BTG/Nexus, 19/10)' };
const FLAPCH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function flapStr(ctx, s, x, y, cw, ch, u, t0, col = '#F3DDA8') { for (let i = 0; i < s.length; i++) { const c = s[i], tx = x + i * (cw + 5), ts = t0 + i * 0.05, k = clamp((u - ts) / 0.45);
    ctx.fillStyle = '#18233A'; ctx.beginPath(); ctx.roundRect(tx, y - ch, cw, ch, 6); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(tx, y - ch, cw, ch / 2);
    let sh = c; if (u < ts) sh = ''; else if (k < 1 && c !== ' ') sh = FLAPCH[Math.floor(u * 24 + i * 7) % FLAPCH.length];
    const fl = (k < 1 && u >= ts) ? Math.max(0.15, Math.abs(Math.cos((u - ts) * 26))) : 1;
    if (sh) { ctx.save(); ctx.translate(tx + cw / 2, y - ch / 2); ctx.scale(1, fl); T(ctx, sh, 0, ch * 0.29, F.mono(ch * 0.74), col, 'center', 1, ch * 0.74, cw * 1.6); ctx.restore(); }
    ctx.fillStyle = '#0A1220'; ctx.fillRect(tx, y - ch / 2 - 1.5, cw, 3); } }
OVER.mercado = (ctx, u, s, uo) => { const w = s.old.wt, tFlip = w[19], nw = s.text.split(' '), ti = nw.lastIndexOf('Depois'), W_ = s.wt, tB = W_[ti] - 0.25, uB = pw(s.pts, tB, 0, 1);
  head(ctx, uo, null, 0, 'R$ 16 bi de fora', w[10], tFlip - 0.2, 290, 100);
  head(ctx, uo, null, 0, 'juros longos caíram…', tFlip + 0.2, w[27] - 0.3, 290, 96);
  head(ctx, uo, null, 0, '…e voltaram a subir.', w[27], uB - 0.15, 290, 96);
  const kB = easeInOut(prog(u, tB, tB + 0.45)); if (kB <= 0) return;
  ctx.save(); ctx.globalAlpha *= kB; BGS.mercado(ctx); ctx.translate(0, (1 - kB) * 70);
  label(ctx, 'SEGUNDA · 19 DE OUTUBRO', 250, '#E2C27F', 1);
  aw(ctx, 'Depois do debate,', 540, 345, F.semi(64), '#FFFFFF', u, W_[ti] + 0.05, 64); aw(ctx, 'dólar caiu, Bolsa oscilou.', 540, 452, F.it(92), '#E2C27F', u, W_[ti + 3] - 0.05, 92, 'center', WD, 960);
  const X = 110, Y = 560, Wb = 860, Hb = 760; shadowed(ctx, () => { ctx.fillStyle = '#0A1220'; ctx.beginPath(); ctx.roundRect(X, Y, Wb, Hb, 36); ctx.fill(); }, 0.35, 60, 24);
  ctx.save(); ctx.beginPath(); ctx.roundRect(X, Y, Wb, Hb, 36); ctx.clip(); ctx.fillStyle = 'rgba(255,255,255,0.03)'; for (let yy = Y; yy < Y + Hb; yy += 8) for (let xx = X; xx < X + Wb; xx += 8) ctx.fillRect(xx, yy, 3, 3); ctx.restore();
  T(ctx, 'DEPOIS DO DEBATE DA BAND (18/10)', X + 40, Y + 64, F.mono(22), '#8FA3BF', 'left', 1, 22, Wb - 80, 2);
  const tRow = [W_[ti + 4] - 0.15, W_[ti + 8] - 0.15];
  POSDEB.rows.forEach(([l, v, ch], i) => { const y = Y + 190 + i * 130, t0 = tRow[i]; T(ctx, l, X + 40, y - 18, F.mono(30), '#E9EEF5', 'left', prog(u, t0 - 0.3, t0), 30, 260);
    flapStr(ctx, v, X + 290, y, 38, 66, u, t0); T(ctx, ch, X + Wb - 40, y - 18, F.mono(36), '#FF6161', 'right', prog(u, t0 + 0.4, t0 + 0.7), 36, 200); });
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(X + 40, Y + 400, Wb - 80, 2);
  const tP = W_[ti + 6]; T(ctx, 'PESQUISAS DE HOJE · FLÁVIO × LULA (% DOS VOTOS)', X + 40, Y + 460, F.mono(22), '#8FA3BF', 'left', prog(u, tP - 0.3, tP), 22, Wb - 80, 2);
  POSDEB.polls.forEach(([l, v], i) => { const y = Y + 560 + i * 100, t0 = tP + i * 0.25; T(ctx, l, X + 40, y - 16, F.mono(28), '#E9EEF5', 'left', prog(u, t0 - 0.2, t0), 28, 240); flapStr(ctx, v, X + 330, y, 34, 58, u, t0, '#E9EEF5'); });
  T(ctx, POSDEB.quando, X + Wb - 40, Y + Hb - 30, F.med(22), '#8FA3BF', 'right', prog(u, tP, tP + 0.4), 22, Wb - 80);
  T(ctx, POSDEB.fonte, 540, 1478, F.med(23), '#A9B6CA', 'center', 1, 23, 940);
  ctx.restore(); };
const CHIP = { corrida: 'CONSELHO 3 · ALUGUEL NÃO É NEUTRO', conta: 'CONSELHO 3 · SIMULAÇÃO', estoque: 'CONSELHO 4 · NEGOCIE', parcela: 'CONSELHO 5 · SIMULAÇÃO DA PARCELA' };
const SRC11 = { corrida: 'Fontes: FipeZAP (aluguel e venda, Brasil) · IBGE (IPCA) — 12 meses até set/2026', estoque: 'Fonte: Secovi-SP — médio e alto padrão: vendas 12 meses até jul/2026; estoque em ago/2026',
  conta: 'Simulação: R$ 800 mil, aluguel inicial de R$ 4.287 com reajuste de 6,22% a.a.', parcela: 'Simulação: R$ 800 mil, 20% de entrada, SAC 30 anos, TR + 11,49% a.a., valorização 5% a.a.' };

// ---------- composição ----------
function sceneAt(t) { let i = SEQ.findIndex(s => t < s.b); if (i < 0) i = SEQ.length - 1; return i; }
// deriva de câmera nas cenas antigas: conta abre espaço para o "financiar também tem custo"; parcela aproxima devagar no fim do gráfico
const DRIFT = { parcela: (u, s) => { const k = easeInOut(prog(u, s.wt[WI('parcela', 'oitavo')] - 0.3, s.wt[WI('parcela', 'E', 1)])); return [540, 900, 1 + 0.06 * k, 0]; } };
function drawScene(ctx, t, i) {
  const s = SEQ[i], u = t - s.a; DK = DARK[s.name] ? 1 : 0;
  if (s.src === 'new' && !s.intro) { ctx.save(); NEW[s.name](ctx, u, s); ctx.restore(); return; }
  const P = s.P, draw = (uo) => { ctx.save(); if (s.src === 'new') { NEW[s.name](ctx, u, s); ctx.restore(); return; } if (BGS[s.name]) BGS[s.name](ctx); HEADOFF = HOFF[s.name] ? 1 : 0;
    if (DRIFT[s.name]) { const [cx, cy, z, dy] = DRIFT[s.name](u, s);  ctx.translate(cx, cy + dy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
    if (s.src === 'o6') OLD6.SC[s.name](ctx, uo, s.old.d, t, s.old.wt); else if (s.name === 'mapa') drawMap(ctx, uo, s.old.d, s.old.wt); else SC[s.name](ctx, uo, s.old.d, s.old.wt); HEADOFF = 0; ctx.restore(); };
  if (!s.intro || u > P - 0.25) {
    const uo = s.src === 'new' ? u : clamp(pw(s.pts, u, 0, 1), 0, s.old.d - 1e-3), kin = s.intro ? easeOut(prog(u, P - 0.2, P + 0.45)) : 1;
    ctx.save(); if (kin < 1) zoomAt(ctx, 1 - kin, 540, 960, 0.86);
    const J = (s.jumps || []).find(J => Math.abs(u - J.tn) < 0.25);
    if (J) { const k = easeInOut(clamp((u - J.tn + 0.25) / 0.5)); draw(u < J.tn ? uo : J.from + (u - J.tn));
      ctx.save(); ctx.globalAlpha = k; draw(u < J.tn ? J.to + (u - J.tn) : uo); ctx.restore(); }
    else if (CLIPDRYMODE) { try { draw(uo); } catch (e) { } } else draw(uo);
    if (s.src === 'o6') { const fg = DK ? '#A9B6CA' : '#5B6577'; if (CHIP[s.name]) T(ctx, CHIP[s.name], 80, 290, F.mono(24), DK ? '#E2C27F' : NAVY, 'left', prog(u, P + 0.1, P + 0.5), 24, 900, 2);
      if (SRC11[s.name]) T(ctx, SRC11[s.name], 540, 1478, F.med(23), fg, 'center', prog(u, P + 0.4, P + 0.8), 23, 940); }
    if (OVER[s.name]) OVER[s.name](ctx, u, s, uo);
    ctx.restore(); }
  if (s.intro && u < P + 0.45) { const ko = easeIn(prog(u, P - 0.2, P + 0.45)); ctx.save(); ctx.globalAlpha = 1 - ko; if (ko > 0) { zoomAt(ctx, ko, 540, 980, 1.55); if (ko > 0.05) ctx.filter = `blur(${(ko * 10).toFixed(1)}px)`; } INTRO[s.name](ctx, u, s); ctx.restore(); }
}
window.MAPPREV = (g) => { g.fillStyle = BG; g.fillRect(0, 0, W, H); };
// transições: variar o tipo a cada corte (ponto, zoom, chicote, flash e empurrão vertical)
const TR13 = { governos: ['whip', 0.45], entrevistas: ['dot', 0.55], mercado: ['slide', 0.5], virada: ['flash', 0.3], m2: ['zoom', 0.6], corrida: ['whip', 0.45], conta: ['flash', 0.3],
  estoque: ['slide', 0.5], parcela: ['dot', 0.55], mapa: ['zoom', 0.6], cta: ['slide', 0.5] };
const EX11 = { governos: () => ({ x: 290, y: 720 }), mercado: () => ({ x: 540, y: 1255 }), virada: () => ({ x: 540, y: 1130 }), m2: () => ({ x: 540, y: 960 }), corrida: () => OLD6.EXIT.corrida(), conta: (c) => OLD6.EXIT.conta(c),
  estoque: () => ({ x: 745, y: 1440 }), parcela: () => ({ x: 540, y: 990 }), mapa: () => ({ x: 540, y: 990 }) };
const expoK = (k) => k >= 1 ? 1 : 1 - Math.pow(2, -10 * k);
const LAY = [0, 1].map(() => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; });
function layer(i, t, L) { const g = L.getContext('2d'); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.clearRect(0, 0, W, H); drawScene(g, t, i); return L; }
function blitAt(ctx, L, px, py, s, a, dx = 0, blur = 0) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(px + dx, py); ctx.scale(s, s); ctx.translate(-px, -py);
  if (blur > 1) { ctx.globalAlpha = a * 0.5; ctx.drawImage(L, 0, 0); for (let k = 1; k <= 4; k++) { ctx.globalAlpha = a * 0.12; ctx.drawImage(L, -blur * k / 4, 0); ctx.drawImage(L, blur * k / 4, 0); } } else ctx.drawImage(L, 0, 0); ctx.restore(); }
function render(cv, t) {
  const ctx = cv.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.filter = 'none'; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); CLIPON = 0;
  const i = sceneAt(t), s = SEQ[i], u = t - s.a, tr = i > 0 ? TR13[s.name] : null, p = tr ? clamp(u / tr[1]) : 1, kind = tr ? tr[0] : 'cut', pn = i > 0 ? SEQ[i - 1].name : null;
  const ex = () => (EX11[pn] || (() => ({ x: 540, y: 960 })))(ctx);
  const pz = punchAt(t); ctx.save(); if (pz > 0.001) { ctx.translate(540, 960); ctx.scale(1 + pz, 1 + pz); ctx.translate(-540, -960); }
  if (p < 1 && kind === 'dot') { drawScene(ctx, t, i - 1); const e = ex(); ctx.save(); ctx.beginPath(); ctx.arc(e.x, e.y, lerp(22, 2300, easeIn(p) * 0.35 + easeInOut(p) * 0.65), 0, 6.283); ctx.clip(); drawScene(ctx, t, i); ctx.restore(); }
  else if (p < 1 && kind === 'zoom') { const e = ex(); blitAt(ctx, layer(i, t, LAY[0]), 540, 960, lerp(1.18, 1, expoK(p)), easeOut(prog(p, 0.25, 0.8))); blitAt(ctx, layer(i - 1, t, LAY[1]), e.x, e.y, 1 + 9 * easeIn(p), 1 - easeIn(prog(p, 0.35, 0.85))); }
  else if (p < 1 && kind === 'whip') { const e = easeInOut(p), v = Math.sin(Math.PI * p) * 40; blitAt(ctx, layer(i - 1, t, LAY[1]), 540, 960, 1, 1, -W * e, v); blitAt(ctx, layer(i, t, LAY[0]), 540, 960, 1, 1, W * (1 - e), v); }
  else if (p < 1 && kind === 'slide') { const e = easeInOut(p), A_ = layer(i - 1, t, LAY[1]), B_ = layer(i, t, LAY[0]);
    ctx.save(); ctx.translate(0, -H * 0.28 * e); ctx.drawImage(A_, 0, 0); ctx.fillStyle = `rgba(0,0,0,${0.45 * e})`; ctx.fillRect(0, 0, W, H); ctx.restore();
    ctx.save(); ctx.translate(0, H * (1 - e)); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = -20; ctx.drawImage(B_, 0, 0); ctx.restore(); }
  else drawScene(ctx, t, i);
  ctx.restore();
  if (kind === 'flash' && p < 1) { ctx.fillStyle = `rgba(255,252,245,${0.9 * Math.pow(1 - p, 2)})`; ctx.fillRect(0, 0, W, H); }
  if (i + 1 < SEQ.length && (TR13[SEQ[i + 1].name] || [])[0] === 'flash' && SEQ[i + 1].a - t < 0.06) { ctx.fillStyle = `rgba(255,252,245,${0.9 * (1 - (SEQ[i + 1].a - t) / 0.06)})`; ctx.fillRect(0, 0, W, H); }
  captions(ctx, t, i);
}

// ---------- legenda dinâmica: 2–3 palavras no tempo real da voz; posição pela zona livre; faixa escura sobre vídeo ----------
const CAPZ = { gancho: () => 1560, governos: () => 1550, entrevistas: () => 1560, mercado: () => 1560, virada: () => 1560, m2: () => 1580, corrida: () => 1560, conta: () => 1560, estoque: () => 1560,
  parcela: () => 1560, mapa: () => 1600, cta: (u, s) => u < s.wt[19] - 0.25 ? 1560 : null };
const CHUNKS = []; SEQ.forEach(s => { if (!CAPZ[s.name]) return; const ws = s.text.split(' '); let cur = [];
  ws.forEach((w, i) => { cur.push([w, s.a + s.wt[i], s.a + s.we[i]]); const brk = /[.?!:,]$/.test(w) || cur.length >= 3;
    if (brk || i === ws.length - 1) { CHUNKS.push({ ws: cur, t0: cur[0][1], last: s.b, sc: s.name, s }); cur = []; } }); });
CHUNKS.forEach((c, i) => { const n = CHUNKS[i + 1], le = c.ws[c.ws.length - 1][2]; c.t1 = Math.min(n ? n.t0 - 0.02 : 1e9, le + 0.35, c.last); });
const capAt = (t) => CHUNKS.find(c => t >= c.t0 - 0.05 && t < c.t1);
function capBox(t) { const c = capAt(t); if (!c) return null; const y = CAPZ[c.sc](t - c.s.a, c.s); if (y == null) return null; const g = document.createElement('canvas').getContext('2d'); g.font = F.black(46);
  const tw_ = c.ws.reduce((a, [w]) => a + g.measureText(w).width, 0) + g.measureText(' ').width * (c.ws.length - 1); return { c, y, x0: 540 - tw_ / 2 - 12, x1: 540 + tw_ / 2 + 12, y0: y - 36, y1: y + 30, text: c.ws.map(q => q[0]).join(' ') }; }
function captions(ctx, t, i) { if (window.NOCAP) return; const c = capAt(t); if (!c) return; const y0 = CAPZ[c.sc](t - c.s.a, c.s); if (y0 == null) return;
  const onClip = CLIPON > 0.4, dk = !!DARK[c.sc] || onClip;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = 'none'; ctx.font = F.black(46); const sp = ctx.measureText(' ').width, ws = c.ws.map(([w]) => ctx.measureText(w).width), tw_ = ws.reduce((a, b) => a + b, 0) + sp * (ws.length - 1);
  const k = clamp((t - c.t0 + 0.05) / 0.14); ctx.globalAlpha = k * (1 - clamp((t - c.t1 + 0.1) / 0.1)); let cur = -1; c.ws.forEach(([, a_], j) => { if (t >= a_ - 0.04) cur = j; });
  if (c.sc === 'mapa' && !onClip) { const g = ctx.createLinearGradient(0, y0 - 70, 0, y0 + 60); g.addColorStop(0, 'rgba(245,245,247,0)'); g.addColorStop(0.5, 'rgba(245,245,247,0.92)'); g.addColorStop(1, 'rgba(245,245,247,0)'); ctx.fillStyle = g; ctx.fillRect(0, y0 - 70, W, 130); }
  if (onClip) { ctx.save(); ctx.fillStyle = `rgba(6,16,32,${0.58 * Math.min(1, CLIPON)})`; ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 24; ctx.beginPath(); ctx.roundRect(540 - tw_ / 2 - 30, y0 - 44, tw_ + 60, 88, 44); ctx.fill(); ctx.restore(); }
  let x = 540 - tw_ / 2; const y = y0 + (1 - easeOut(k)) * 16; ctx.textBaseline = 'middle'; ctx.textAlign = 'left'; ctx.lineJoin = 'round';
  const halo = dk ? 'rgba(8,22,48,0.9)' : 'rgba(255,255,255,0.95)', on = dk ? '#FFFFFF' : INK, hi = dk ? '#E2C27F' : GOLDA, off = dk ? 'rgba(255,255,255,0.45)' : 'rgba(29,29,31,0.32)';
  c.ws.forEach(([w], j) => { const wk = j === cur ? 1 + 0.12 * Math.max(0, 1 - (t - c.ws[j][1]) / 0.25) : 1, num = /\d|mil|bilh|trilh|cento|quinze|dezesseis|dezoito|treze|oitocentos|seiscentos|nove|doze|oitavo|dobro|dígitos/i.test(w);
    ctx.save(); ctx.translate(x + ws[j] / 2, y); ctx.scale(wk, wk); ctx.translate(-(x + ws[j] / 2), -y);
    ctx.strokeStyle = halo; ctx.lineWidth = 10; ctx.strokeText(w, x, y); ctx.fillStyle = j === cur ? hi : j < cur ? (num ? hi : on) : off; ctx.fillText(w, x, y); ctx.restore(); x += ws[j] + sp; });
  ctx.restore(); }
// verificação: densidade de bordas atrás da legenda (renderiza sem legenda e mede a área que ela ocuparia)
const CV2 = document.createElement('canvas'); CV2.width = W; CV2.height = H;
window.capBusy = async (t) => { const b = capBox(t); if (!b) return null; await window.clipPrep(t); window.NOCAP = 1; render(CV2, t); window.NOCAP = 0; const clip = CLIPON > 0.4;
  const x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.floor(b.y0), w_ = Math.min(W, Math.ceil(b.x1)) - x0, h_ = Math.ceil(b.y1 - b.y0), D_ = CV2.getContext('2d').getImageData(x0, y0, w_, h_).data;
  const L = (i) => 0.3 * D_[i] + 0.59 * D_[i + 1] + 0.11 * D_[i + 2]; let n = 0; for (let y = 0; y < h_ - 1; y++) for (let x = 0; x < w_ - 1; x++) { const i = (y * w_ + x) * 4; if (Math.abs(L(i) - L(i + 4)) + Math.abs(L(i) - L(i + w_ * 4)) > 36) n++; }
  return { t, sc: b.c.sc, text: b.text, y: b.y, clip, dens: Math.round(n / (w_ * h_) * 1000) / 1000, box: [x0, y0, w_, h_] }; };
window.capTimes = () => CHUNKS.filter(c => CAPZ[c.sc]((c.t0 + c.t1) / 2 - c.s.a, c.s) != null).map(c => ({ t: Math.round(((c.t0 + c.t1) / 2) * 100) / 100, t0: c.t0, t1: c.t1, sc: c.sc }));
const r2 = (x) => Math.round(x * 100) / 100, r3 = (x) => Math.round(x * 1000) / 1000;
window.TIMING = SEQ.map(s => { const base = { cena: s.name, inicio: r3(s.a), fim: r3(s.b), fala: s.text, palavras: s.wt.map(x => r3(x + s.a)), fins: s.we.map(x => r3(x + s.a)), voz: s.voz.map(r3), extra: r3(s.extra) };
  if (s.src === 'new') return { ...base, antigas: base.palavras, warp: [[0, 0], [r2(s.d), r2(s.d)]], intro: r2(s.P) };
  const lo = Math.min(...s.pts.map(p => p[1])) - 1e-6, hi = Math.max(...s.pts.map(p => p[1])) + 1e-6;
  return { ...base, antigas: s.old.wt.map(x => (x < lo || x > hi || s.jumps.some(J => x > J.from && x < J.to)) ? null : r2(pw(s.pts, x, 1, 0) + s.a)), warp: s.pts.map(p => p.map(r2)), intro: r2(s.P) }; });
const TIMING = window.TIMING;
