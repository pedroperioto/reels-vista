// globo.js — globo 3D (projeção ortográfica, d3-geo) desenhado em SVG, estilo painel de dados noturno.
// const g = Globo(svgEl, {cx, cy, r}); g.draw({lon, lat, k, pins:[...], arcs:[...]}) — determinístico, chamado em onUpdate do GSAP.
(function () {
  const land = topojson.feature(window.LAND, window.LAND.objects.land);
  const borders = topojson.mesh(window.COUNTRIES, window.COUNTRIES.objects.countries, (a, b) => a !== b);
  const brasil = topojson.feature(window.COUNTRIES, window.COUNTRIES.objects.countries).features.find((f) => f.id === '076');
  const grat = d3.geoGraticule10();
  window.CIDADES = { brasilia: [-47.88, -15.79, 'BRASÍLIA'], sp: [-46.63, -23.55, 'SÃO PAULO · B3'], toquio: [139.69, 35.69, 'TÓQUIO'], ny: [-74.0, 40.71, 'NOVA YORK'], chicago: [-87.63, 41.88, 'CHICAGO'] };
  window.Globo = function (svg, o) {
    const ns = 'http://www.w3.org/2000/svg', id = svg.id || 'g';
    svg.innerHTML = `<defs>
      <radialGradient id="${id}-sea" cx="0.38" cy="0.32" r="0.75"><stop offset="0" stop-color="#1D3D74"/><stop offset="0.65" stop-color="#11274E"/><stop offset="1" stop-color="#081631"/></radialGradient>
      <radialGradient id="${id}-glow" cx="0.5" cy="0.5" r="0.5"><stop offset="0.82" stop-color="rgba(90,140,255,0.0)"/><stop offset="0.9" stop-color="rgba(90,140,255,0.22)"/><stop offset="1" stop-color="rgba(90,140,255,0)"/></radialGradient>
      <radialGradient id="${id}-shade" cx="0.35" cy="0.3" r="0.8"><stop offset="0.55" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,10,0.55)"/></radialGradient></defs>
      <circle class="glow" fill="url(#${id}-glow)"/><path class="sphere" fill="url(#${id}-sea)"/><path class="grat" fill="none" stroke="rgba(150,180,255,0.10)" stroke-width="1.5"/>
      <path class="land" fill="#2A4C86" stroke="#3E66A8" stroke-width="1.2"/><path class="bord" fill="none" stroke="rgba(170,200,255,0.18)" stroke-width="1"/>
      <path class="br" fill="rgba(255,210,74,0.16)" stroke="rgba(255,210,74,0.55)" stroke-width="2"/>
      <path class="shade" fill="url(#${id}-shade)"/><g class="arcs"></g><g class="pins"></g>`;
    const q = (s) => svg.querySelector(s);
    const P = d3.geoOrthographic().clipAngle(90).precision(0.4), path = d3.geoPath(P);
    return {
      proj: P,
      draw(st) {
        const r = o.r * (st.k || 1);
        P.scale(r).translate([o.cx + (st.dx || 0), o.cy + (st.dy || 0)]).rotate([-st.lon, -st.lat, 0]);
        q('.glow').setAttribute('cx', o.cx + (st.dx || 0)); q('.glow').setAttribute('cy', o.cy + (st.dy || 0)); q('.glow').setAttribute('r', r * 1.12);
        q('.sphere').setAttribute('d', path({ type: 'Sphere' })); q('.shade').setAttribute('d', path({ type: 'Sphere' }));
        q('.grat').setAttribute('d', path(grat)); q('.land').setAttribute('d', path(land)); q('.bord').setAttribute('d', path(borders));
        q('.br').setAttribute('d', path(brasil) || ''); q('.br').style.opacity = st.br == null ? 1 : st.br;
        // arcos tracejados (rota da câmera) com progresso 0..1
        let ah = '';
        (st.arcs || []).forEach(([a, b, p]) => { if (p <= 0) return; const I = d3.geoInterpolate(CIDADES[a].slice(0, 2), CIDADES[b].slice(0, 2)); const pts = d3.range(0, p + 1e-6, 0.02).map(I);
          const d = path({ type: 'LineString', coordinates: pts }); if (d) ah += `<path d="${d}" fill="none" stroke="#FFD24A" stroke-width="5" stroke-dasharray="2 12" stroke-linecap="round"/>`; });
        q('.arcs').innerHTML = ah;
        let ph = '';
        (st.pins || []).forEach(([c, a]) => { if (a <= 0) return; const [lo, la, nm] = CIDADES[c]; const dist = d3.geoDistance([lo, la], [st.lon, st.lat]); if (dist > 1.5) return;
          const [x, y] = P([lo, la]); const s = Math.min(1, a);
          ph += `<g opacity="${s}"><circle cx="${x}" cy="${y}" r="${30 * s}" fill="rgba(255,210,74,0.22)"/><circle cx="${x}" cy="${y}" r="13" fill="#FFD24A" stroke="#0A1428" stroke-width="4"/>
            <text x="${x}" y="${y + 52}" text-anchor="middle" font-family="Oswald700" font-size="34" fill="#FFD24A" letter-spacing="1" style="paint-order:stroke" stroke="#0A1428" stroke-width="8">${nm}</text></g>`; });
        q('.pins').innerHTML = ph;
      },
    };
  };
})();
