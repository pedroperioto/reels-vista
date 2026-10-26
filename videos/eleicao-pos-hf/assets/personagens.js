// Personagens originais (fictícios) do vídeo pós-eleição: Rafa (time 13) e Dona Célia (time 22).
// Cada função devolve um <g> SVG desenhado num viewBox 0 0 320 640 (pés em y≈625).
// Partes animáveis têm classes: .armL .armR (braços soltos, pivô no ombro), .armsX (braços cruzados),
// .m-smile .m-open .m-frown .m-smug (bocas), .b-neutral .b-angry .b-up (sobrancelhas), .eyes (olhos).
(function () {
  const ARMS = { L: [106, 252], R: [214, 252] };
  function base(o) {
    const s = o.skin, sh = o.shade;
    return `
    <ellipse cx="160" cy="628" rx="96" ry="11" fill="rgba(0,0,0,0.22)"/>
    <rect x="116" y="420" width="40" height="186" rx="15" fill="${o.legs}"/>
    <rect x="164" y="420" width="40" height="186" rx="15" fill="${o.legs}"/>
    <path d="M 160 430 L 160 600" stroke="rgba(0,0,0,0.12)" stroke-width="4"/>
    <rect x="102" y="592" width="58" height="32" rx="14" fill="${o.shoe}"/><rect x="160" y="592" width="58" height="32" rx="14" fill="${o.shoe}"/>
    <rect x="102" y="614" width="58" height="10" rx="5" fill="${o.sole}"/><rect x="160" y="614" width="58" height="10" rx="5" fill="${o.sole}"/>
    <g class="armR">
      <rect x="200" y="244" width="36" height="84" rx="18" fill="${o.shirt}"/>
      <rect x="204" y="306" width="28" height="104" rx="14" fill="${s}"/>
      <circle cx="218" cy="410" r="17" fill="${s}"/>
    </g>
    <path d="M 102 270 Q 102 238 134 233 L 186 233 Q 218 238 218 270 L 224 432 Q 160 446 96 432 Z" fill="${o.shirt}"/>
    <path d="M 186 233 Q 218 238 218 270 L 224 432 Q 205 438 190 440 Q 206 330 186 233 Z" fill="rgba(0,0,0,0.10)"/>
    ${o.collar || ''}
    <text x="160" y="318" text-anchor="middle" font-family="Oswald700, Oswald, sans-serif" font-size="66" fill="${o.numColor}">${o.num}</text>
    <g class="armL">
      <rect x="84" y="244" width="36" height="84" rx="18" fill="${o.shirt}"/>
      <rect x="88" y="306" width="28" height="104" rx="14" fill="${s}"/>
      <circle cx="102" cy="410" r="17" fill="${s}"/>
    </g>
    <g class="armsX" opacity="0">
      <rect x="82" y="244" width="38" height="104" rx="19" fill="${o.shirt}"/>
      <rect x="200" y="244" width="38" height="104" rx="19" fill="${o.shirt}"/>
      <rect x="92" y="318" width="136" height="36" rx="18" fill="${sh}"/>
      <rect x="96" y="342" width="128" height="34" rx="17" fill="${s}"/>
      <circle cx="226" cy="336" r="16" fill="${sh}"/><circle cx="94" cy="359" r="16" fill="${s}"/>
    </g>
    <rect x="143" y="206" width="34" height="34" rx="10" fill="${sh}"/>
    <circle cx="86" cy="148" r="15" fill="${sh}"/><circle cx="234" cy="148" r="15" fill="${sh}"/>
    <ellipse cx="160" cy="140" rx="74" ry="80" fill="${s}"/>
    <ellipse cx="118" cy="176" rx="14" ry="8" fill="rgba(220,80,80,0.18)"/><ellipse cx="202" cy="176" rx="14" ry="8" fill="rgba(220,80,80,0.18)"/>
    ${o.under || ''}
    <g class="eyes"><ellipse cx="132" cy="148" rx="7.5" ry="9.5" fill="#1D1A1A"/><ellipse cx="188" cy="148" rx="7.5" ry="9.5" fill="#1D1A1A"/>
      <circle cx="134.5" cy="144.5" r="2.6" fill="#fff"/><circle cx="190.5" cy="144.5" r="2.6" fill="#fff"/></g>
    <g fill="none" stroke="${o.brow}" stroke-width="6" stroke-linecap="round">
      <g class="b-neutral"><path d="M 118 126 Q 132 120 145 125"/><path d="M 175 125 Q 188 120 202 126"/></g>
      <g class="b-angry" opacity="0"><path d="M 118 120 L 146 130"/><path d="M 174 130 L 202 120"/></g>
      <g class="b-up" opacity="0"><path d="M 118 118 Q 132 108 145 116"/><path d="M 175 116 Q 188 108 202 118"/></g>
    </g>
    <path d="M 158 158 Q 152 172 160 175 Q 166 176 168 172" fill="none" stroke="${sh}" stroke-width="4" stroke-linecap="round"/>
    <g fill="none" stroke="${o.lip}" stroke-width="5.5" stroke-linecap="round">
      <path class="m-smile" d="M 140 190 Q 160 206 180 190"/>
      <path class="m-frown" opacity="0" d="M 142 200 Q 160 186 178 200"/>
      <path class="m-smug" opacity="0" d="M 144 194 Q 166 202 182 188"/>
    </g>
    <g class="m-open" opacity="0"><ellipse cx="160" cy="194" rx="17" ry="14" fill="#5A2026"/><ellipse cx="160" cy="202" rx="10" ry="5" fill="#E07A7A"/></g>
    ${o.over || ''}`;
  }
  window.rafa = function (id) {
    const o = { skin: '#B97A52', shade: '#A0643F', shirt: '#E5484D', legs: '#2D4470', shoe: '#F4F4F4', sole: '#C9CCD3', brow: '#1E1A19', lip: '#5A2B22', num: '13', numColor: '#FFFFFF',
      under: `<path d="M 92 150 Q 96 214 160 222 Q 224 214 228 150 Q 220 200 160 206 Q 100 200 92 150 Z" fill="rgba(30,20,18,0.28)"/>`,
      over: `<g fill="#1E1A19">
        <path d="M 84 150 Q 78 70 160 56 Q 242 70 236 150 Q 226 118 214 110 Q 160 96 106 110 Q 94 118 84 150 Z"/>
        ${[[100, 92, 22], [126, 74, 24], [156, 66, 25], [186, 70, 24], [212, 86, 22], [228, 110, 16], [92, 114, 16], [140, 84, 18], [172, 82, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}
      </g>
      <path d="M 120 76 Q 150 62 176 70" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="6" stroke-linecap="round"/>` };
    return `<g id="${id}" class="person rafa">${base(o)}</g>`;
  };
  window.celia = function (id) {
    const o = { skin: '#F1C6A3', shade: '#DCA884', shirt: '#2E9E68', legs: '#B9A684', shoe: '#6B4A35', sole: '#4A3324', brow: '#8C7A5E', lip: '#B5485A', num: '22', numColor: '#FFD24A',
      collar: `<path d="M 138 233 L 160 266 L 182 233 Z" fill="${'#F1C6A3'}"/><path d="M 132 233 L 160 272 L 188 233" fill="none" stroke="#24805A" stroke-width="6" stroke-linejoin="round"/>`,
      over: `<path d="M 76 210 Q 64 120 92 84 Q 124 50 172 54 Q 232 60 246 120 Q 254 170 244 212 Q 230 224 214 214 Q 220 160 206 124 Q 176 104 132 112 Q 112 120 106 140 Q 100 180 106 214 Q 90 224 76 210 Z" fill="#D9CAAE"/>
        <path d="M 106 140 Q 120 96 186 92 Q 214 96 224 120 Q 190 102 150 112 Q 122 120 106 140 Z" fill="#C4B293"/>
        <path d="M 96 110 Q 130 70 190 74" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="6" stroke-linecap="round"/>
        <g fill="none" stroke="#3B2F2A" stroke-width="4.5"><circle cx="132" cy="148" r="19" fill="rgba(255,255,255,0.12)"/><circle cx="188" cy="148" r="19" fill="rgba(255,255,255,0.12)"/><path d="M 151 146 Q 160 140 169 146"/></g>
        <circle cx="86" cy="178" r="6" fill="#E2C27F"/><circle cx="234" cy="178" r="6" fill="#E2C27F"/>` };
    return `<g id="${id}" class="person celia">${base(o)}</g>`;
  };
  window.ARMS = ARMS;
})();
