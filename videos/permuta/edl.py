# edl.py — lista de planos do vídeo da permuta (v2) e montagem da base de imagens (1080x1920, 30 fps)
# Tempos globais: a narração entra logo depois da fala do Poderoso Chefão (OFF1) e abre espaço para o Gandalf (GAND).
# v2: sem zoom lento (era o que tremia), escala lanczos + nitidez, cor mais viva, fundos claros, sem PIVOT.
import json, subprocess
from pathlib import Path
H = Path(__file__).parent; B = H / 'brutos'
OFF1, GAND, SPLIT = 2.7, 4.9, 33.9            # "irrecusável" termina em 2,55 s; Gandalf (até o fim do grito, antes do clarão em 5,1 s) entra depois de "quase vinte mil por mês"
def G(t): return round(t + OFF1 + (GAND if t >= SPLIT else 0), 3)
W = json.load(open(H / 'voz' / 'palavras.json'))
VEND = G(W[-1][2])                            # fim da narração
END0 = round(VEND + 0.35, 3); END = round(END0 + 2.9, 3)   # cartão final
GAND0 = round(SPLIT + OFF1, 3); GAND1 = round(GAND0 + GAND, 3)
CR = {'chefao': '1716:1022:0:0', 'rec33': '1920:1080:210:0', 'rec32b': '1920:1080:210:0'}
SRC = {'chefao': B / 'x_chefao.mp4', 'rec33': B / 'n_rec33.mp4', 'rec32b': B / 'x_rec32b.mp4', 'matrix': B / 'x_matrix.mp4',
       'gandalf': B / 'x_gandalf.mp4', 'keys': B / 'x_px8293.mp4', 'phone': B / 'x_px7279.mp4', 'city': B / 'x_px2661.mp4'}
# luz por fonte (as escuras sobem um pouco)
LUZ = {'chefao': 'eq=gamma=1.12', 'phone': 'eq=gamma=1.45:brightness=0.02', 'matrix': 'eq=gamma=1.22', 'gandalf': 'eq=gamma=1.05',
       'rec32b': 'eq=gamma=1.04', 'city': 'eq=gamma=1.02'}
def sh(t0, src, ss=0, mode='vert', sp=1.0, fx=0.5, frz=None): return dict(t0=t0, src=src, ss=ss, mode=mode, sp=sp, fx=fx, frz=frz)
SH = [
    sh(0.0, 'chefao', 0.0, 'band'),                       # "Vou fazer uma proposta irrecusável"
    sh(G(0.15), 'rec33', 78.6, 'tall', fx=0.42),          # Friends: os meninos ganham o apê
    sh(G(3.45), 'keys', 0.3),                             # Dá. Chama PERMUTA (chaves)
    sh(G(5.75), 'phone', 2.0),                            # juro chegando a 15%
    sh(G(8.75), 'city', 0.0),                             # aéreo · São Paulo
    sh(G(11.6), 'city', 38.0),                            # Fica que eu te mostro como funciona
    sh(G(13.85), 'city', 20.0, 'blur'),                   # VENDER ↓ COMPRAR
    sh(G(16.2), 'matrix', 18.5),                          # Morfeu: vende primeiro?
    sh(G(17.75), 'matrix', 7.4, sp=0.77),                 # pílula vermelha: ou compra primeiro?
    sh(G(19.65), 'city', 12.0, 'blur'),                   # VOCÊ → COMPRADOR → BANCO (cadeado)
    sh(G(22.25), 'city', 26.0, 'blur'),                   # bancos
    sh(G(27.0), 'city', 32.0, 'blur'),                    # conta da parcela
    sh(GAND0, 'gandalf', 0.0),                            # "Você não vai passar!"
    sh(GAND1, 'rec32b', 16.4, 'tall', fx=0.5),            # Divertida Mente: a porta
    sh(G(35.15), 'rec32b', 20.0, 'tall', fx=0.78),        # a casa vazia
    sh(G(36.6), 'rec32b', 31.8, 'tall', fx=0.45, frz=G(37.39) - 0.02 - G(36.6)),  # a Riley, congela no "trava"
    sh(G(38.35), 'white', 0, 'white'),                    # estilo Apple: carro → apê, cartões, 50%, vale tentar
    sh(G(55.9), 'keys', 4.2),                             # não é só trocar a chave
    sh(G(57.45), 'keys', 5.8, 'blur'),                    # checklist
    sh(G(59.8), 'city', 28.0),                            # cartão do Pedro
    sh(G(64.45), 'city', 8.0, 'blur'),                    # direct + compartilhar + cartão final
]
FPS = 30
GR = "eq=contrast=1.05:saturation=1.16,vignette=PI/7"
SHARP = "unsharp=5:5:0.55:5:5:0"
def shot(i, nxt):
    s = SH[i]; dur = round(nxt - s['t0'], 3); out = H / 'planos' / f'p{i:02d}.mp4'; src, mode = s['src'], s['mode']
    base = ['ffmpeg', '-v', 'error', '-y']
    if mode == 'white':
        cmd = base + ['-f', 'lavfi', '-i', f'color=c=0xF5F5F7:s=1080x1920:r={FPS}:d={dur}', '-vf', 'format=yuv420p']
    else:
        take = dur if s['frz'] is None else s['frz']
        cmd = base + ['-ss', str(s['ss']), '-t', str(round(take * s['sp'] + 0.25, 3)), '-i', str(SRC[src])]
        pre = (f"crop={CR[src]}," if src in CR else '') + (f"setpts=PTS/{s['sp']}," if s['sp'] != 1 else '') + f"fps={FPS}," + LUZ.get(src, 'null')
        frz = f",trim=duration={s['frz']},setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration={round(dur - s['frz'] + 0.1, 3)}" if s['frz'] else ''
        cover = "scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920"
        if mode == 'vert':
            vf = f"{pre}{frz},{cover},{SHARP},{GR},format=yuv420p"
        elif mode == 'blur':   # vidro: a cidade desfocada e clara, com um véu azul-marinho leve
            vf = f"{pre},scale=540:960:force_original_aspect_ratio=increase,crop=540:960,gblur=sigma=14,scale=1080:1920,eq=brightness=-0.06:saturation=1.25,drawbox=c=0x0A1630@0.42:t=fill,format=yuv420p"
        elif mode == 'band':
            vf = (f"[0:v]{pre}{frz},split[a][b];[a]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,gblur=sigma=12,scale=1080:1920,eq=brightness=-0.22[bg];"
                  f"[b]scale=1080:-2:flags=lanczos,{SHARP}[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2-60,{GR},format=yuv420p")
        else:  # tall: recorte vertical 3:4 no foco, fundo desfocado em cima e embaixo
            vf = (f"[0:v]{pre}{frz},split[a][b];[a]scale=540:960:force_original_aspect_ratio=increase,crop=540:960,gblur=sigma=12,scale=1080:1920,eq=brightness=-0.22[bg];"
                  f"[b]crop=ih*0.75:ih:(iw-ih*0.75)*{s['fx']}:0,scale=1080:1440:flags=lanczos,{SHARP}[fg];"
                  f"[bg][fg]overlay=0:(H-h)/2-60,{GR},format=yuv420p")
        cmd += (['-filter_complex', vf + '[v]', '-map', '[v]'] if vf.startswith('[0:v]') else ['-vf', vf])
    cmd += ['-frames:v', str(round(dur * FPS)), '-an', '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(out)]
    subprocess.run(cmd, check=True); return out
if __name__ == '__main__':
    (H / 'planos').mkdir(exist_ok=True)
    cuts = [s['t0'] for s in SH] + [END]
    files = [shot(i, cuts[i + 1]) for i in range(len(SH))]
    open(H / 'planos' / 'lista.txt', 'w').write(''.join(f"file '{f.name}'\n" for f in files))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(H / 'planos' / 'lista.txt'), '-c', 'copy', str(H / 'base.mp4')], check=True)
    json.dump({'cuts': cuts, 'shots': [[s['t0'], s['src'], s['mode']] for s in SH], 'OFF1': OFF1, 'GAND': GAND, 'SPLIT': SPLIT,
               'GAND0': GAND0, 'GAND1': GAND1, 'VEND': VEND, 'END0': END0, 'END': END}, open(H / 'voz' / 'planos.json', 'w'), indent=1)
    print('base ok', END)
