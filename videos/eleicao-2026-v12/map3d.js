// Mapa 3D "maquete branca" (v5): distritos (Geosampa) em placas, metrô/trem, Eixo Platina, pin e prédios com sombra suave + oclusão de ambiente.
import * as THREE from 'three';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, k) => a + (b - a) * k;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eio = k => k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eout = k => 1 - Math.pow(1 - k, 3);
const SPR = (x, f = 1.8, z = 0.5) => { if (x <= 0) return 0; const om = 2 * Math.PI * f, wd = om * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * om * x) * (Math.cos(wd * x) + z * om / wd * Math.sin(wd * x)); };
function track(t, keys) { if (t <= keys[0][0]) return keys[0][1]; for (let i = 1; i < keys.length; i++) if (t <= keys[i][0]) { const [t0, v0] = keys[i - 1], [t1, v1] = keys[i]; return lerp(v0, v1, eio((t - t0) / (t1 - t0))); } return keys[keys.length - 1][1]; }
function partial(pts, k) { if (k >= 1) return pts; const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let rem = tot * k; const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { if (rem >= L[i - 1]) { out.push(pts[i]); rem -= L[i - 1]; } else { const f = rem / L[i - 1]; out.push([lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]); break; } } return out; }

export const MAP_POI = {
  TAT: [2.42, 2.162], CAR: [3.658, 2.448],
  BAIRROS: [['Belém', 0.55, 2.35, 0.95], ['Mooca', 0.35, -0.2, 1.15], ['Tatuapé', 2.95, 1.75, 1.05], ['Anália Franco', 4.05, -0.15, 0.85], ['Vila Formosa', 5.55, -0.85, 0.95]],
  // [nome, x, y, altura (km, exagerada), construtora]
  PREDIOS: [
    ['Geon 652', 3.37, 2.20, 0.55, 'porte'], ['Crona 665', 3.50, 2.15, 0.6, 'porte'], ['Almagah 227', 3.228, 2.105, 0.62, 'porte'], ['Metria 624', 3.43, 2.26, 0.62, 'porte'], ['Platina 220', 2.341, 1.918, 1.25, 'porte'],
    ['Urman São Paulo', 1.704, 1.896, 0.95, 'porte'],
    ['Alameda Tatuapé', 3.623, 2.614, 0.6, 'dialogo'], ['Linea Home Resort', 3.58, 2.47, 0.5, 'dialogo'], ['Praça Tatuapé', 2.56, 2.30, 0.55, 'dialogo'], ['Auge Resort', 2.56, 1.84, 0.6, 'dialogo'],
    ['Living Villaggio', 4.859, 1.898, 0.55, 'living'], ['Living Hectare', 3.663, -0.442, 0.6, 'living'],
    ['Universo Tatuapé', 3.703, 2.959, 0.6, 'tegra'], ['East Blue', 4.418, 2.049, 0.55, 'eztec']],
};

export async function createMap(W, H, base = '', TMo = {}) {
  const D = await (await fetch(base + 'distritos.json')).json();
  const TR = await (await fetch(base + 'transporte.json')).json();
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1); renderer.setSize(W, H); renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.0;
  const scene = new THREE.Scene(); scene.background = new THREE.Color(0xF5F5F7); scene.fog = new THREE.Fog(0xF5F5F7, 60, 230);
  const cam = new THREE.PerspectiveCamera(30, W / H, 0.1, 600);
  const res = new THREE.Vector2(W, H); const P3 = (x, y, h = 0) => new THREE.Vector3(x, h, -y);
  function fat(pts, color, width, h, opacity = 0) { const g = new LineGeometry(); g.setPositions(pts.flatMap(([x, y]) => [x, h, -y]));
    const m = new LineMaterial({ color, linewidth: width, transparent: true, opacity, resolution: res, depthWrite: false }); const l = new Line2(g, m); l.renderOrder = 2; scene.add(l); l.userData = { pts, h, k: 1 }; return l; }
  function setPartial(l, k) { k = clamp(k); if (Math.abs(k - l.userData.k) < 1e-4) { l.visible = k > 0.0005; return; } l.userData.k = k; if (k < 0.0005) { l.visible = false; return; }
    const p = partial(l.userData.pts, k); if (p.length < 2) { l.visible = false; return; } l.visible = true; l.geometry.dispose(); const g = new LineGeometry(); g.setPositions(p.flatMap(([x, y]) => [x, l.userData.h, -y])); l.geometry = g; }

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.MeshStandardMaterial({ color: 0xEDEDF0, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9dde5, 1.15));
  const sun = new THREE.DirectionalLight(0xffffff, 2.9); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.radius = 7; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.02;
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 9, bottom: -9, near: 1, far: 80 }); scene.add(sun, sun.target);

  const dist = D.map(d => {
    const shapes = d.r.map(r => new THREE.Shape(r.map(([x, y]) => new THREE.Vector2(x, y))));
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false }); geo.rotateX(-Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: d.zl ? 0xFFFFFF : 0xF4F4F6, roughness: 0.85 });
    const mesh = new THREE.Mesh(geo, mat); mesh.castShadow = true; mesh.receiveShadow = true; mesh.scale.y = 0.03; scene.add(mesh);
    const outl = d.r.map(r => fat(r, d.zl ? 0xB9A27A : 0xC5C8CF, d.zl ? 1.6 : 1.2, 0.035));
    return { d, mesh, mat, outl, cd: Math.hypot(d.c[0] - 0.5, d.c[1] + 13), tat: d.n === 'TATUAPE' };
  });
  const LC = { VERMELHA: 0xE03A3E, VERDE: 0x2E9E5B, PRATA: 0x8E98A6, AZUL: 0x1F5AA6, AMARELA: 0xF2C230, LILAS: 0x8A4FA3, '11-CORAL': 0xF07A5A, '12-SAFIRA': 0x2B4C9B, '13-JADE': 0x1FA58A, '10-TURQUESA': 0x2CA6B8 };
  const lines = TR.lines.filter(l => LC[l.n] !== undefined).map(l => ({ l, obj: fat(l.p, LC[l.n], l.n === 'VERMELHA' ? 4.5 : 3, 0.11) }));
  const rio = fat(TR.rio, 0x8DBCE8, 6, 0.1);
  const l2p = TR.l2proj ? TR.l2proj.lines[1] : null; let l2 = null, l2st = [];
  if (l2p) { const g = new LineGeometry(); g.setPositions(l2p.flatMap(([x, y]) => [x, 0.12, -y])); const mm = new LineMaterial({ color: 0x2E9E5B, linewidth: 5, transparent: true, opacity: 0, resolution: res, dashed: true, dashSize: 0.18, gapSize: 0.12, depthWrite: false });
    l2 = new Line2(g, mm); l2.computeLineDistances(); l2.renderOrder = 3; scene.add(l2);
    l2st = TR.l2proj.stations.filter(s => s[1][0] > 0 && s[1][0] < 7 && s[1][1] < 3.5).map(([n, p]) => { const d = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.05, 24), new THREE.MeshBasicMaterial({ color: 0x2E9E5B, transparent: true, opacity: 0 })); d.position.copy(P3(p[0], p[1], 0.14)); scene.add(d); return { n, p, d }; }); }
  const stations = TR.stations.filter(s => ['VERMELHA', 'VERDE', 'PRATA'].includes(s.l) && s.p[0] > -3.5 && s.p[0] < 9.5 && s.p[1] > -5.5 && s.p[1] < 5.5);
  const stG = new THREE.CylinderGeometry(0.075, 0.075, 0.05, 24), stM = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0 }), stR = new THREE.MeshBasicMaterial({ color: 0x1D1D1F, transparent: true, opacity: 0 });
  stations.forEach(s => { const a = new THREE.Mesh(stG, stM); a.position.copy(P3(s.p[0], s.p[1], 0.13)); const b = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.018, 8, 24), stR); b.rotation.x = Math.PI / 2; b.position.copy(P3(s.p[0], s.p[1], 0.16)); scene.add(a, b); });
  const { TAT, CAR, BAIRROS, PREDIOS } = MAP_POI; const nx = -(CAR[1] - TAT[1]), ny = CAR[0] - TAT[0], nl = Math.hypot(nx, ny), off = 0.17;
  const ePts = [[TAT[0] - nx / nl * off, TAT[1] - ny / nl * off], [CAR[0] - nx / nl * off, CAR[1] - ny / nl * off]];
  const eixo = fat(ePts, 0xC9A86A, 9, 0.12);
  const circ = (cx, cy, r, n = 96) => [...Array(n + 1)].map((_, i) => [cx + Math.cos(i / n * 6.283 + 1.9) * r, cy + Math.sin(i / n * 6.283 + 1.9) * r]);
  const bCirc = BAIRROS.map(([n, x, y, r]) => fat(circ(x, y, r), 0x0B1F3A, 2.4, 0.14));
  const pin = new THREE.Group(); const navy = new THREE.MeshPhysicalMaterial({ color: 0x0B1F3A, roughness: 0.3, clearcoat: 1 });
  const ph = new THREE.Mesh(new THREE.SphereGeometry(0.16, 32, 20), navy); ph.position.y = 0.55; const pt = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.42, 32), navy); pt.rotation.x = Math.PI; pt.position.y = 0.31;
  const pg = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 10), new THREE.MeshStandardMaterial({ color: 0xE2C78F, metalness: 0.5, roughness: 0.3 })); pg.position.set(0, 0.55, 0.13);
  [ph, pt].forEach(m => { m.castShadow = true; }); pin.add(ph, pt, pg); scene.add(pin);
  const GOLDM = new THREE.Color(0xE3CFA6), WHITE = new THREE.Color(0xFFFFFF);
  const BLD = PREDIOS.map(([nome, x, y, h, kind], i) => { const w = nome.startsWith('Urman') ? 0.34 : nome.startsWith('Platina') ? 0.2 : 0.16;
    const mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.55, metalness: 0.0 });
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, 1, w, 2, 0.015), mat); body.position.y = 0.5; body.castShadow = true; body.receiveShadow = true;
    const g = new THREE.Group(); g.add(body); g.position.copy(P3(x, y, 0.06)); g.visible = false; scene.add(g); g.userData = { h, mat, t: (TMo.bldT || [])[i] ?? 99 }; return g; });

  const composer = new EffectComposer(renderer); composer.setPixelRatio(1); composer.setSize(W, H);
  composer.addPass(new RenderPass(scene, cam));
  let gtao = null; if (TMo.ao) { try { gtao = new GTAOPass(scene, cam, W / 2, H / 2); gtao.blendIntensity = 0.9; gtao.updateGtaoMaterial({ radius: 0.6, distanceExponent: 1, thickness: 1, scale: 1, samples: 12 }); composer.addPass(gtao); } catch (e) { gtao = null; } }
  composer.addPass(new OutputPass());

  const TM = Object.assign({ city: 0, zl: 0.5, zoom: 1.1, lines: 1.5, bairros: 2.3, pin: 3.3, eixo: 3.5 }, TMo);
  function render(u, focus = -1) {
    const CK = [[0, 0.5, -13, 175, 89.5, 0], [TM.zoom, 3.5, 0, 72, 80, 0], [TM.lines + 1.2, 2.2, 0.9, 30, 58, -6]].concat(TM.cam || []);
    const kk = (j) => CK.map(c => [c[0], c[j]]);
    const look = [track(u, kk(1)), 0, -track(u, kk(2))], dd = track(u, kk(3)), tilt = track(u, kk(4)) * Math.PI / 180, az = track(u, kk(5)) * Math.PI / 180;
    cam.position.set(look[0] + Math.sin(az) * Math.cos(tilt) * dd, Math.sin(tilt) * dd, look[2] + Math.cos(az) * Math.cos(tilt) * dd);
    if (tilt > 1.55) cam.up.set(0, 0, -1); else cam.up.set(0, 1, 0); cam.lookAt(look[0], 0, look[2]);
    sun.target.position.set(look[0], 0, look[2]); sun.position.set(look[0] - 14, 26, look[2] + 10); const sc = clamp(dd / 3, 4, 60); Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc }); sun.shadow.camera.updateProjectionMatrix();
    const kZL = eout(prog(u, TM.zl, TM.zl + 0.7));
    dist.forEach(o => { const kk_ = eout(prog(u, TM.city + o.cd * 0.008, TM.city + 0.4 + o.cd * 0.008)); o.mesh.scale.y = Math.max(0.001, (o.d.zl ? lerp(0.03, 0.07, kZL) : 0.03) * kk_);
      if (o.tat) o.mat.color.copy(WHITE).lerp(new THREE.Color(0xF2E7D2), prog(u, TM.pin - 0.3, TM.pin + 0.3));
      o.outl.forEach(l => { l.material.opacity = kk_ * (o.d.zl ? 0.95 : 0.7); l.position.y = (o.mesh.scale.y - 0.035); }); });
    lines.forEach(({ l, obj }) => { const d_ = l.k === 'trem' ? 0.25 : 0; obj.material.opacity = 0.95; setPartial(obj, eout(prog(u, TM.lines + d_, TM.lines + 1.2 + d_))); });
    rio.material.opacity = 0.9; setPartial(rio, eout(prog(u, TM.lines + 0.1, TM.lines + 1.3)));
    const ks = prog(u, TM.lines + 0.9, TM.lines + 1.3); stM.opacity = ks; stR.opacity = ks;
    bCirc.forEach((c, i) => { const t0 = TM.bairros + i * 0.25; c.material.opacity = 1 - prog(u, TM.eixo + 0.3, TM.eixo + 0.8); setPartial(c, eout(prog(u, t0, t0 + 0.4))); });
    eixo.material.opacity = 1; setPartial(eixo, eout(prog(u, TM.eixo, TM.eixo + 0.5))); eixo.material.linewidth = 9 + 5 * prog(u, TM.eixo, TM.eixo + 0.5) * (1 - prog(u, (TM.eixoOff || 99), (TM.eixoOff || 99) + 0.6));
    if (l2) { const k2 = prog(u, TM.l2 || 99, (TM.l2 || 99) + 0.8); l2.material.opacity = 0.9 * k2; l2.material.linewidth = 5 + 3 * prog(u, TM.l2hi || 99, (TM.l2hi || 99) + 0.4); l2st.forEach(s => { s.d.material.opacity = k2; }); }
    const kp = u < TM.pin ? 0 : SPR(u - TM.pin, 1.6, 0.45); pin.visible = u > TM.pin; pin.position.copy(P3(TAT[0], TAT[1], lerp(6, 0.06, clamp(kp, 0, 1.12)))); pin.rotation.y = (1 - clamp(kp)) * 4 - 0.4;
    pin.scale.setScalar(lerp(1.6, 1.0, prog(u, TM.pin + 0.6, TM.pin + 1.2)));
    BLD.forEach((b, i) => { const { h, mat, t } = b.userData; const k = clamp(SPR(u - t, 1.0, 0.65), 0, 1.04); b.visible = u > t; b.scale.y = Math.max(0.001, h * k);
      mat.color.copy(WHITE).lerp(GOLDM, (Array.isArray(focus) ? focus.includes(i) : focus === i) ? 0.9 : 0); });
    composer.render();
    const scr = (x, y, h = 0) => { const p = P3(x, y, h).project(cam); return [(p.x + 1) / 2 * W, (1 - p.y) / 2 * H]; };
    return { canvas: renderer.domElement, labels: {
      zl: scr(9.5, 0.5, 0.1), sp: scr(0.5, 13), rio: scr(0.9, 4.25, 0.1), eixo: scr(CAR[0] + 1.25, CAR[1] + 0.05, 0.1), l3: scr(5.6, 3.55, 0.1), l15: scr(4.4, -3.75, 0.1),
      bairros: BAIRROS.map(([n, x, y, r]) => [n, ...scr(x, y - r - 0.05, 0.1)]), l2st: l2st.map(s => [s.n, ...scr(s.p[0], s.p[1], 0.15)]), eixoC: scr((TAT[0] + CAR[0]) / 2, (TAT[1] + CAR[1]) / 2 - 0.15, 0.1),
      predios: BLD.map((b, i) => [PREDIOS[i][0], PREDIOS[i][4], ...scr(PREDIOS[i][1], PREDIOS[i][2], 0.06 + b.scale.y + 0.05)]) } };
  }
  return { render, TM };
}
