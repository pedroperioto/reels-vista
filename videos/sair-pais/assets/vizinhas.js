// Personagens originais (fictícios): Ana e Bia, vizinhas do mesmo prédio (parte 3). Sem número nem cor de partido.
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
  window.ana = function (id) {
    const o = { skin: '#9A6342', shade: '#83513A', shirt: '#7C5CC4', legs: '#2B3A55', shoe: '#E9E4DA', sole: '#BDB5A6', brow: '#1B1513', lip: '#6A2E2A', num: '', numColor: '#fff',
      collar: `<path d="M 136 233 Q 160 262 184 233" fill="none" stroke="#5E43A0" stroke-width="7"/>`,
      over: `<g fill="#1B1513">
        <path d="M 84 160 Q 74 72 160 60 Q 246 72 236 160 Q 230 120 212 108 Q 160 92 108 108 Q 90 120 84 160 Z"/>
        <circle cx="160" cy="38" r="40"/>${[[134, 22, 16], [186, 22, 16], [160, 6, 15], [120, 46, 13], [200, 46, 13]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}
        ${[[96, 112, 18], [222, 112, 18], [88, 140, 14], [232, 140, 14]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>
        <path d="M 124 80 Q 154 66 186 74" fill="none" stroke="rgba(255,255,255,0.14)" stroke-width="6" stroke-linecap="round"/>
        <circle cx="86" cy="182" r="7" fill="#E2C27F"/><circle cx="234" cy="182" r="7" fill="#E2C27F"/>` };
    return `<g id="${id}" class="person ana">${base(o)}</g>`;
  };
  window.bia = function (id) {
    const o = { skin: '#F2CDB0', shade: '#DDB092', shirt: '#2F7FB5', legs: '#C9B79A', shoe: '#3B2C24', sole: '#261C17', brow: '#6B4A33', lip: '#B5485A', num: '', numColor: '#fff',
      collar: `<path d="M 138 233 L 160 262 L 182 233" fill="none" stroke="#256A98" stroke-width="7" stroke-linejoin="round"/>`,
      under: `<path d="M 80 140 Q 70 250 92 300 L 130 300 Q 104 240 108 150 Z M 240 140 Q 250 250 228 300 L 190 300 Q 216 240 212 150 Z" fill="#7A4E2E"/>`,
      over: `<path d="M 82 160 Q 76 70 160 58 Q 244 70 238 160 Q 226 116 196 104 Q 176 122 130 122 Q 106 124 96 112 Q 86 130 82 160 Z" fill="#7A4E2E"/>
        <path d="M 104 92 Q 150 64 214 84" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="6" stroke-linecap="round"/>` };
    return `<g id="${id}" class="person bia">${base(o)}</g>`;
  };
  window.ARMS = ARMS;
})();
