// engine.js — peças reutilizáveis (render determinístico: tudo depende só de t)
const W = 1080, H = 1920;
const C = {
  navy: '#0B1F3A', navy2: '#132A4D', ink: '#071328', gold: '#C9A86A', gold2: '#E2C78F',
  cream: '#F5F2EC', mute: '#8C97AB', line: 'rgba(245,242,236,0.14)'
};
const F = {
  black: (s) => `${s}px InterBlack`, semi: (s) => `${s}px InterSemi`,
  med: (s) => `${s}px InterMed`, serif: (s) => `${s}px SerifIt`
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const easeIn = (k) => k * k * k;
const easeInOut = (k) => (k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const back = (k) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
// trilha: [[t, v], ...] com easing entre pontos
function track(t, keys, ease = easeInOut) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}
// aleatório com semente fixa
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

// janela de cena: alpha e deslocamento de entrada/saída (títulos sobem e esmaecem em ~0,45 s)
function win(t, a, b, fin = 0.35, fout = 0.45) {
  const i = easeOut(prog(t, a, a + fin)), o = easeIn(prog(t, b - fout, b));
  return { on: t >= a && t <= b, a: i * (1 - o), y: (1 - i) * 40 - o * 60, k: i, o };
}

function txt(ctx, s, x, y, font, color, align = 'left', alpha = 1, track = 0) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if (track) { try { ctx.letterSpacing = track + 'px'; } catch (e) { } }
  ctx.fillText(s, x, y); ctx.restore();
}
// texto que "bate": escala de 1.35 → 1 com corte seco
function slam(ctx, s, x, y, font, color, k, align = 'center') {
  const sc = lerp(1.35, 1, easeOut(clamp(k * 1.6)));
  ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(k * 4);
  txt(ctx, s, 0, 0, font, color, align); ctx.restore();
}
// texto revelado por máscara de baixo para cima
function reveal(ctx, s, x, y, font, color, k, align = 'left', size = 100) {
  ctx.save(); ctx.font = font;
  const w = ctx.measureText(s).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  ctx.beginPath(); ctx.rect(x0 - 20, y - size * 1.05, w + 40, size * 1.35); ctx.clip();
  txt(ctx, s, x, y + (1 - easeOut(k)) * size * 1.2, font, color, align); ctx.restore();
}
function pill(ctx, s, x, y, font, fg, stroke, alpha = 1, fill = null) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.font = font; const w = ctx.measureText(s).width;
  const h = 64, r = 32; ctx.beginPath(); ctx.roundRect(x - w / 2 - 36, y - h / 2, w + 72, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  ctx.strokeStyle = stroke; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(s, x, y + 2); ctx.restore();
}
// pino dourado (símbolo)
function pin(ctx, x, y, s, rot = 0, alpha = 1, glow = 0) {
  ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (glow > 0) { ctx.shadowColor = C.gold2; ctx.shadowBlur = 60 * glow; }
  ctx.beginPath(); ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-14, -26, -46, -52, -46, -86); ctx.arc(0, -86, 46, Math.PI, 0); ctx.bezierCurveTo(46, -52, 14, -26, 0, 0);
  const g = ctx.createLinearGradient(-46, -132, 46, 0); g.addColorStop(0, C.gold2); g.addColorStop(1, C.gold);
  ctx.fillStyle = g; ctx.fill(); ctx.shadowBlur = 0;
  ctx.beginPath(); ctx.arc(0, -86, 17, 0, Math.PI * 2); ctx.fillStyle = C.navy; ctx.fill(); ctx.restore();
}
// textura granulada fixa (como nas ilustrações de referência)
let GRAIN = null;
function grain(ctx, alpha = 0.07) {
  if (!GRAIN) {
    GRAIN = document.createElement('canvas'); GRAIN.width = 540; GRAIN.height = 960;
    const g = GRAIN.getContext('2d'), id = g.createImageData(540, 960), r = rng(7);
    for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
    g.putImageData(id, 0, 0);
  }
  ctx.save(); ctx.globalAlpha = alpha; ctx.globalCompositeOperation = 'overlay'; ctx.drawImage(GRAIN, 0, 0, W, H); ctx.restore();
}
function vignette(ctx, a = 0.55) {
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 200, W / 2, H * 0.5, 1250);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}
// troca de fundo com círculo crescendo a partir de um ponto
function circleWipe(ctx, color, cx, cy, k) {
  if (k <= 0) return; ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, easeInOut(k) * 2300, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}
// número que se monta dígito a dígito
function rollNumber(ctx, s, x, y, font, color, k, size) {
  ctx.save(); ctx.font = font; const total = ctx.measureText(s).width; let cx = x - total / 2;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i], w = ctx.measureText(ch).width, kk = clamp(k * (s.length + 3) / 1 - i * 0.9, 0, 1);
    ctx.save(); ctx.beginPath(); ctx.rect(cx - 4, y - size, w + 8, size * 1.25); ctx.clip();
    let shown = ch;
    if (/[0-9]/.test(ch) && kk < 1) shown = String(Math.floor((kk * 37 + i * 3)) % 10);
    txt(ctx, shown, cx, y + (1 - easeOut(kk)) * size * 0.9, font, color, 'left', clamp(kk * 3));
    ctx.restore(); cx += w;
  }
  ctx.restore();
}
