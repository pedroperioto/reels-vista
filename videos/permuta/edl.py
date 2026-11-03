# edl.py — lista de planos do vídeo da permuta e montagem da base de imagens (1080x1920, 30 fps)
# Tempos globais: a narração entra depois da fala do Poderoso Chefão (OFF1) e abre espaço para o Gandalf (GAND).
import json, subprocess, sys
from pathlib import Path
H = Path(__file__).parent; B = H / 'brutos'; P = H.parent / 'sair-pais-v2' / 'brutos'
OFF1, GAND, SPLIT = 3.8, 2.8, 33.9            # narração começa em 3,8 s; Gandalf entra depois de "quase vinte mil por mês"
def G(t): return round(t + OFF1 + (GAND if t >= SPLIT else 0), 3)
W = json.load(open(H / 'voz' / 'palavras.json'))
VEND = G(W[-1][2])                            # fim da narração
PIV0 = round(VEND + 0.6, 3); PIV1 = round(PIV0 + 2.1, 3); END = round(PIV1 + 2.8, 3)
GAND0 = round(SPLIT + OFF1, 3); GAND1 = round(GAND0 + GAND, 3)
CR = {'chefao': '1716:1022:0:0', 'rec33': '1920:1080:210:0', 'rec32': '1920:1080:210:0', 'rec2': '1920:800:210:140',
      'v72': '640:272:0:44', 'matrix': '582:264:58:48', 'v11': '640:360:0:0', 'v102': '640:360:0:0', 'matilda': '1160:652:0:62'}
SRC = {'chefao': B / 'n_chefao.mp4', 'rec33': B / 'n_rec33.mp4', 'rec32': B / 'n_rec32.mp4', 'rec2': B / 'rec2.mp4', 'v72': B / 'n_v72.mp4',
       'matrix': B / 'matrix.mp4', 'v11': B / 'n_v11.mp4', 'v102': B / 'n_v102.mp4', 'matilda': B / 'matilda.mp4',
       'px1': B / 'n_px1.mp4', 'px3': B / 'n_px3.mp4', 'px2': B / 'n_px2.mp4'}
# (início global, fonte, início na fonte, modo, velocidade, foco horizontal 0..1)
SH = [
    (0.0, 'chefao', 6.6, 'band', 1.0, 0.5),
    (OFF1, 'rec33', 78.6, 'tall', 1.0, 0.42),          # Friends: os meninos ganham o apê
    (G(3.45), 'dark', 0, 'dark', 1, 0),                 # PERMUTA
    (G(5.75), 'px3', 1.0, 'vert', 1.0, 0.5),            # juros 15%
    (G(8.75), 'px1', 4.0, 'vert', 1.0, 0.5),            # aéreo · Zona Leste
    (G(13.6), 'dark', 0, 'dark', 1, 0),                 # vender pra comprar
    (G(16.2), 'matrix', 269.5, 'tall', 1.3, 0.5),       # pílulas
    (G(19.55), 'rec2', 58.4, 'band', 1.0, 0.5),         # Homem-Aranha no laboratório
    (G(22.15), 'dark', 0, 'dark', 1, 0),                # bancos
    (G(27.0), 'dark', 0, 'dark', 1, 0),                 # conta da parcela
    (GAND0, 'v72', 2.5, 'tall', 1.0, 0.5),              # Gandalf
    (GAND1, 'rec32', 17.2, 'tall', 1.0, 0.55),          # Divertida Mente: porta
    (G(36.5), 'rec32', 19.8, 'band', 1.0, 0.5),         # Divertida Mente: casa vazia
    (G(38.3), 'matilda', 30.2, 'band', 1.0, 0.5),       # Matilda: revenda
    (G(40.0), 'matilda', 52.3, 'tall', 1.0, 0.5),       # Matilda: o pai vendendo
    (G(41.35), 'white', 0, 'white', 1, 0),              # estilo Apple: exemplo e 50%
    (G(53.7), 'v11', 108.2, 'tall', 1.0, 0.62),         # Friends: as meninas pegam o apê de volta
    (G(55.85), 'white', 0, 'white', 1, 0),              # checklist
    (G(59.65), 'px1', 16.0, 'vert', 1.0, 0.5),          # aéreo + cartão do Pedro
    (G(64.35), 'dark', 0, 'dark', 1, 0),                # direct
    (PIV0, 'v102', 7.9, 'tall', 1.0, 0.6),              # PIVOT!
    (PIV1, 'dark', 0, 'dark', 1, 0),                    # cartão final
]
FPS = 30
GR = "eq=contrast=1.06:saturation=0.92:brightness=-0.01,vignette=PI/5"
def shot(i, nxt):
    t0, src, ss, mode, sp, fx = SH[i]; dur = round(nxt - t0, 3); out = H / 'planos' / f'p{i:02d}.mp4'
    zoom = f"scale=w='1080*(1+0.05*t/{dur})':h=-2:eval=frame"
    if mode in ('dark', 'white'):
        col = '0x0B0D12' if mode == 'dark' else '0xF5F5F7'
        cmd = ['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c={col}:s=1080x1920:r={FPS}:d={dur}']
        vf = 'format=yuv420p'
    else:
        cmd = ['ffmpeg', '-v', 'error', '-y', '-ss', str(ss), '-t', str(round(dur * sp + 0.2, 3)), '-i', str(SRC[src])]
        pre = (f"crop={CR[src]}," if src in CR else '') + (f"setpts=PTS/{sp}," if sp != 1 else '') + f"fps={FPS}"
        if mode == 'vert':
            vf = f"{pre},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,{zoom},crop=1080:1920,{GR},format=yuv420p"
        elif mode == 'band':
            vf = (f"[0:v]{pre},split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:3,eq=brightness=-0.28[bg];"
                  f"[b]scale=1080:-2,{zoom},crop=1080:ih[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2-60,{GR},format=yuv420p")
        else:  # tall: recorte vertical 3:4 centrado no foco, com fundo desfocado em cima e embaixo
            vf = (f"[0:v]{pre},split[a][b];[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:3,eq=brightness=-0.3[bg];"
                  f"[b]crop=ih*0.75:ih:(iw-ih*0.75)*{fx}:0,scale=1080:1440,{zoom},crop=1080:1440[fg];"
                  f"[bg][fg]overlay=0:(H-h)/2-60,{GR},format=yuv420p")
        if vf.startswith('[0:v]'): cmd += ['-filter_complex', vf + '[v]', '-map', '[v]']
        else: cmd += ['-vf', vf]
        cmd += ['-frames:v', str(round(dur * FPS))]
        subprocess.run(cmd + ['-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p', str(out)], check=True); return out
    subprocess.run(cmd + ['-vf', vf, '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', str(out)], check=True); return out
if __name__ == '__main__':
    (H / 'planos').mkdir(exist_ok=True)
    cuts = [s[0] for s in SH] + [END]
    files = [shot(i, cuts[i + 1]) for i in range(len(SH))]
    open(H / 'planos' / 'lista.txt', 'w').write(''.join(f"file '{f.name}'\n" for f in files))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(H / 'planos' / 'lista.txt'), '-c', 'copy', str(H / 'base.mp4')], check=True)
    json.dump({'cuts': cuts, 'shots': [[s[0], s[1], s[3]] for s in SH], 'OFF1': OFF1, 'GAND': GAND, 'SPLIT': SPLIT,
               'GAND0': GAND0, 'GAND1': GAND1, 'VEND': VEND, 'PIV0': PIV0, 'PIV1': PIV1, 'END': END}, open(H / 'voz' / 'planos.json', 'w'), indent=1)
    print('base ok', END)
