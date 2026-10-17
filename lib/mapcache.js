// Cache da camada 3D do mapa. Na 1ª render a imagem do mapa de cada quadro é salva em out/mapcache/;
// nas próximas, se mapa/câmera/tempos do mapa não mudaram, ela é reaproveitada (render muito mais rápida).
function installMapCache(map, cv, renderFn, base) {
  const real = map.render.bind(map), dry = document.createElement('canvas'); dry.width = cv.width; dry.height = cv.height;
  const copy = document.createElement('canvas'); copy.width = cv.width; copy.height = cv.height;
  let mode = 'real', rec = null, hit = null, miss = null;
  const keyOf = (u, f) => Math.round(u * 1000) + '_' + (Array.isArray(f) ? (f.length ? f.join('-') : 'n') : f);
  map.render = (u, focus = -1) => {
    const k = keyOf(u, focus);
    if (mode === 'dry') { rec = k; throw new Error('__dry'); }
    if (hit && hit.k === k) return { canvas: hit.bmp, labels: hit.labels };
    const r = real(u, focus); copy.getContext('2d').drawImage(r.canvas, 0, 0); miss = { k, labels: r.labels }; return r;
  };
  window.frameCached = async (t, prefix) => {
    rec = hit = miss = null; mode = 'dry'; try { renderFn(dry, t); } catch (e) { } mode = 'real';
    if (rec && prefix) { const n = base + prefix + '_' + rec; try { const [a, b] = await Promise.all([fetch(n + '.jpg'), fetch(n + '.json')]); if (a.ok && b.ok) hit = { k: rec, bmp: await createImageBitmap(await a.blob()), labels: await b.json() }; } catch (e) { } }
    renderFn(cv, t);
    const out = { frame: cv.toDataURL('image/jpeg', 0.93) };
    if (miss && prefix) out.miss = { name: prefix + '_' + miss.k, jpg: copy.toDataURL('image/jpeg', 0.95), labels: miss.labels };
    return out;
  };
}
