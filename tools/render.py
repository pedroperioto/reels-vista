"""Renderiza o vídeo mudo em paralelo. Uso: render.py <video> <fps> <processos> <saida.mp4> [inicio fim]"""
import sys, subprocess, time, os
from multiprocessing import Process
from playwright.sync_api import sync_playwright
from common import ensure_server, video_dir, open_page, grab

def worker(vdir, fps, a, b, seg, k):
    with sync_playwright() as p:
        br, pg, errs = open_page(p, vdir)
        ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', str(fps), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', seg], stdin=subprocess.PIPE)
        t0 = time.time()
        for i in range(a, b):
            ff.stdin.write(grab(pg, i / fps, vdir))
            if (i - a) % 150 == 0: print(f'  [proc {k}] {i - a}/{b - a} quadros, {time.time() - t0:.0f}s', flush=True)
        ff.stdin.close(); ff.wait(); br.close()
        if errs: print(f'  [proc {k}] avisos:', errs[:3])

if __name__ == '__main__':
    import multiprocessing as mp; mp.set_start_method('spawn')
    vdir = video_dir(sys.argv[1]); fps, nw, outp = int(sys.argv[2]), int(sys.argv[3]), sys.argv[4]
    ensure_server()
    with sync_playwright() as p: br, pg, _ = open_page(p, vdir); dur = pg.evaluate('window.DUR'); br.close()
    s0, s1 = (float(sys.argv[5]), float(sys.argv[6])) if len(sys.argv) > 6 else (0, dur)
    f0, f1 = int(round(s0 * fps)), int(round(s1 * fps)); n = f1 - f0
    tmp = vdir / 'out' / 'tmp'; tmp.mkdir(parents=True, exist_ok=True)
    cuts = [f0 + n * k // nw for k in range(nw + 1)]; segs = [str(tmp / f'seg{k}.mp4') for k in range(nw)]
    t0 = time.time(); print(f'renderizando {n} quadros ({s1 - s0:.1f}s a {fps} fps) em {nw} processos…', flush=True)
    ps = [Process(target=worker, args=(vdir, fps, cuts[k], cuts[k + 1], segs[k], k)) for k in range(nw)]
    [x.start() for x in ps]; [x.join() for x in ps]
    if any(x.exitcode for x in ps): raise SystemExit('um processo de render falhou')
    lst = tmp / 'lista.txt'; lst.write_text(''.join(f"file '{s}'\n" for s in segs))
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', '-movflags', '+faststart', outp], check=True)
    for s in segs: os.remove(s)
    print(f'vídeo mudo pronto em {time.time() - t0:.0f}s → {outp}')
