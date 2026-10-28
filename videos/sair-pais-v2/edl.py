# edl.py — monta a trilha de imagens (filmes + Pexels) presa à narração → planos/*.mp4 + base.mp4 (sem som)
# Cada plano: começa num marcador da fala, termina no começo do próximo. Cor de cinema, zoom lento e "soco" de zoom no corte.
# Uso: python3 edl.py [n1 n2 ...]   (sem argumentos = todos)
import json, subprocess, sys
from pathlib import Path
HERE = Path(__file__).parent; B = HERE / 'brutos'; P = HERE / 'planos'; P.mkdir(exist_ok=True)
J = json.load(open(HERE / 'voz' / 'tempos.json')); T, M = J['T'], J['M']
FPS = 30
# fonte: arquivo, fps de entrada ('n30' = cada quadro vira 1 quadro a 30 fps; 'fps' = reamostra), recorte da área útil, pular duplicados
SRC = {
 'tropa': ('film_tropa.mp4', 'fps', 'crop=1080:1080:880:0', False), 'forrest': ('film_forrest.mp4', 'n30', 'crop=810:810:760:135', True),
 'up': ('film_up.mp4', 'n30', 'crop=1072:596:0:94', True), 'leao': ('film_leao.mp4', 'n30', 'crop=1068:596:0:94', True),
 'esq': ('film_esqueceram.mp4', 'n30', 'crop=640:344:0:0', False), 'lobo': ('film_lobo.mp4', 'fps', 'crop=640:264:0:48', False),
 'harry': ('film_harry.mp4', 'n30', 'crop=640:264:0:48', False), 'naz': ('film_nazare.mp4', 'fps', 'crop=640:360:0:0', False),
 'painel': ('px_painel.mp4', 'n30', None, False), 'celular': ('31460d6f-6586070-uhd_2160_3840_30fps.mp4', 'fps', None, False),
 'corredor': ('px_corredor.mp4', 'fps', None, False), 'aviao': ('d554bfb9-11130977-hd_1920_1080_30fps.mp4', 'fps', None, False),
 'torres': ('2228f157-pexels-media-17955817.mp4', 'fps', None, False), 'cidade': ('px_cidade.mp4', 'x4', None, False),
 'predio': ('c5afd1da-6016323-uhd_2160_3840_30fps.mp4', 'fps', None, False), 'dolar': ('e3eec7b6-6266251-uhd_2160_3840_25fps.mp4', 'n30', None, False),
 'notas': ('102dc9c1-pexels-media-6326861.mp4', 'n30', None, False), 'assina': ('a6fa0f08-8471105-hd_1920_1080_25fps.mp4', 'n30', None, False),
 'calcdin': ('a004ff03-pexels-media-6266261.mp4', 'n30', None, False), 'chaves': ('2a177f3a-7817154-hd_1080_1920_25fps.mp4', 'n30', None, False),
 'calcmulher': ('86f57e35-7710747-uhd_2160_4096_25fps.mp4', 'n30', None, False), 'envelopes': ('9815255a-6335709-uhd_2160_3840_24fps.mp4', 'n30', None, False),
 'macaneta': ('601d9206-11409779-hd_1080_1920_30fps.mp4', 'fps', None, False), 'tranca': ('e7f890cd-pexels-media-7646797.mp4', 'mb', None, False),
 'caixas': ('4ebee7e4-4553290-uhd_2160_4096_25fps.mp4', 'n30', None, False),
}
# (início, fonte, segundo de entrada, modo, movimento, ajustes)  · modo: full (tela cheia) | band (faixa 16:9 sobre fundo desfocado) | sq (quadrado)
# movimento: in (zoom lento para dentro), out (para fora), punch (soco de zoom no corte + zoom lento)
SHOTS = [
 (0.0, 'tropa', 7.95, 'sq', 'in', {'bright': 0.08}),
 (T['TA'], 'esq', 163.0, 'band', 'punch', {}),                    # "Desde domingo, tem muito brasileiro…"  Esqueceram de Mim (aeroporto)
 (M['pedindo'] - 0.05, 'painel', 1.0, 'full', 'in', {}),           # "…pedindo pra sair."  painel de partidas (câmera lenta)
 (M['busca'] - 0.1, 'celular', 2.0, 'full', 'punch', {}),          # "A busca por 'como morar no Paraguai'…"
 (M['mil7'] - 0.08, 'celular', 6.5, 'full', 'punch', {'dark': 0.35}),  # "+1.700%"
 (T['AB'], 'corredor', 0.0, 'full', 'in', {}),                     # "Depois do 1º turno…"
 (M['subido'] - 0.1, 'corredor', 3.2, 'full', 'punch', {}),          # "…já tinha subido."
 (M['indep'] - 0.1, 'aviao', 4.0, 'full', 'punch', {}),            # "Independente de quem ganhou…"
 (M['malas'] - 0.15, 'esq', 32.6, 'band', 'punch', {}),            # "…tem gente fazendo as malas."  Esqueceram de Mim (escada)
 (T['BS'], 'torres', 1.0, 'full', 'in', {}),                       # "Mas o apartamento…"
 (M['naocabe'] - 0.05, 'up', 45.0, 'band', 'punch', {}),           # "…não cabe na mala."  Up
 (20.15, 'cidade', 20.0, 'full', 'in', {'dark': 0.45}),            # "Segue o perfil…"
 (T['CD'] + 0.35, 'predio', 0.0, 'full', 'in', {'bright': 0.05, 'cont': 1}),         # "Duas vizinhas do mesmo prédio…"
 (M['correndo'] - 0.35, 'forrest', 76.35, 'sq', 'punch', {}),      # "A Ana vendeu correndo."  Forrest Gump
 (M['bia1'] - 0.05, 'naz', 15.4, 'band', 'in', {}),                # "A Bia fez a conta."  Nazaré
 (T['DE'], 'dolar', 0.5, 'full', 'punch', {}),                     # "A Ana vendeu na semana em que…"
 (M['disparou'] - 0.15, 'lobo', 97.05, 'band', 'punch', {}),       # "…o dólar disparou."  O Lobo de Wall Street
 (M['segunda'] - 0.05, 'notas', 2.0, 'full', 'in', {'dark': 0.4}), # "Só na segunda… perdeu 9 mil dólares."
 (M['pagou'] - 0.1, 'assina', 3.0, 'full', 'punch', {'dark': 0.25}),  # "Ela pagou corretagem, 15% de imposto…"
 (M['trocou'] - 0.1, 'calcdin', 0.5, 'full', 'punch', {'dark': 0.25}),  # "…e trocou tudo por menos dólar."
 (T['EF'], 'chaves', 2.0, 'full', 'punch', {}),                    # "A Bia alugou."
 (M['sp'] - 0.1, 'calcmulher', 3.0, 'full', 'in', {'dark': 0.3}),  # "Em São Paulo… 6,5% ao ano."
 (M['tres'] - 0.1, 'envelopes', 0.5, 'full', 'punch', {'dark': 0.3}),  # "Uns 3.200 por mês. Mesmo pagando os 15%…"
 (M['sobra'] - 0.1, 'lobo', 123.1, 'band', 'punch', {}),           # "…sobra renda todo mês."  Lobo (escritório comemorando)
 (M['voltar'] - 0.1, 'leao', 21.0, 'band', 'in', {'leao': True}),  # "E se a Bia quiser voltar? O apê tá lá."  O Rei Leão
 (T['FG'], 'tranca', 0.0, 'full', 'in', {'dark': 0.1}),           # "Tem um terceiro caminho, o pior: deixar fechado."  chave trancando a porta
 (M['condo'] - 0.1, 'harry', 102.65, 'band', 'punch', {}),         # "Condomínio e IPTU todo mês…"  Harry Potter (cartas)
 (M['semrenda'] - 0.1, 'caixas', 1.0, 'full', 'in', {'dark': 0.2}),   # "…sem renda nenhuma."
 (T['GH'], 'assina', 12.0, 'full', 'in', {'dark': 0.3}),           # "Vender pode fazer sentido."
 (M['correndo2'] - 0.1, 'forrest', 69.0, 'sq', 'punch', {}),       # "Vender correndo, quase nunca."  Forrest
 (M['certo'] - 0.1, 'calcdin', 4.0, 'full', 'in', {'dark': 0.45}), # "Não tem certo ou errado. Tem a conta."
 (T['HI'], 'cidade', 60.0, 'full', 'in', {'dark': 0.6}),           # "Comenta CONTA…" (fundo para a animação)
 (T['END'], None, 0, 'black', '', {}),                             # cartão final (fundo)
]
GRADE = 'eq=contrast=1.07:saturation=0.9:gamma=0.97,colorbalance=rs=-0.05:gs=-0.01:bs=0.05:rh=0.05:gh=0.01:bh=-0.05'
def zexpr(kind, dur):
    kb = f'(1+0.06*min(t/{dur:.3f},1))' if kind != 'out' else f'(1.06-0.06*min(t/{dur:.3f},1))'
    if kind == 'punch': return f'({kb}*(1+0.12*pow(1-min(t/0.28,1),3)))'
    return kb
def shot(i):
    t0 = SHOTS[i][0]; t1 = SHOTS[i + 1][0] if i + 1 < len(SHOTS) else T['DUR']
    _, key, sin, mode, mov, opt = SHOTS[i]
    n = round(t1 * FPS) - round(t0 * FPS); dur = n / FPS; out = P / f'{i:02d}.mp4'
    if mode == 'black':
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x05070C:s=1080x1920:r={FPS}', '-frames:v', str(n), '-c:v', 'libx264', '-crf', '16', '-pix_fmt', 'yuv420p', str(out)], check=True); return
    f, fm, crop, dec = SRC[key]
    pre = []
    if crop: pre.append(crop)
    if dec: pre.append('mpdecimate=hi=64*6:lo=64*3:frac=0.2')
    pre.append({'n30': f'setpts=N/({FPS}*TB)', 'fps': f'fps={FPS}', 'x4': f"select='not(mod(n\\,4))',setpts=N/({FPS}*TB)", 'mb': f'minterpolate=fps={FPS}:mi_mode=blend'}[fm])
    Z = zexpr(mov, dur); adj = GRADE
    if opt.get('dark'): adj += f",eq=brightness=-{opt['dark'] * 0.35:.3f}:saturation={1 - opt['dark'] * 0.4:.2f}"
    if opt.get('bright'): adj += f",eq=brightness={opt['bright']}:gamma={1.3 if opt.get('cont') else 1.25}" + (',eq=contrast=1.25:saturation=1.2' if opt.get('cont') else '')
    if mode == 'full':
        g = f"[0:v]{','.join(pre)},scale=1242:2208:force_original_aspect_ratio=increase,crop=1242:2208,{adj},scale=w='trunc(1242*{Z}/1.145/2)*2+2':h='trunc(2208*{Z}/1.145/2)*2+2':eval=frame,crop=1080:1920,setsar=1[v]"
    else:
        W, H, Y = (1080, 1080, 340) if mode == 'sq' else (1080, 608, 560)
        g = (f"[0:v]{','.join(pre)},split[a][b];"
             f"[a]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,gblur=sigma=38,eq=brightness=-0.2:saturation=0.75,{GRADE}[bg];"
             f"[b]scale={round(W * 1.15)}:{round(H * 1.15)}:force_original_aspect_ratio=increase,crop={round(W * 1.15)}:{round(H * 1.15)},{adj},"
             f"scale=w='trunc({round(W * 1.15)}*{Z}/1.145/2)*2+2':h='trunc({round(H * 1.15)}*{Z}/1.145/2)*2+2':eval=frame,crop={W}:{H}[fg];"
             f"[bg][fg]overlay=0:{Y},setsar=1[v]")
    if opt.get('leao'):   # Rei Leão: Simba andando (21,0 s) + Pedra do Rei (33,6 s) — vem de dois trechos
        n1 = round(1.3 * FPS)
        a = str(P / f'{i:02d}a.mp4'); b = str(P / f'{i:02d}b.mp4')
        for src_in, nn, o in ((21.0, n1, a), (33.6, n - n1, b)):
            gg = g.replace(f'{Z}', zexpr('in', nn / FPS))
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(src_in), '-i', str(B / f), '-filter_complex', gg, '-map', '[v]', '-frames:v', str(nn), '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', str(FPS), o], check=True)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', a, '-i', b, '-filter_complex', '[0:v][1:v]concat=n=2:v=1[v]', '-map', '[v]', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(out)], check=True); return
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(sin), '-i', str(B / f), '-filter_complex', g, '-map', '[v]', '-frames:v', str(n), '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p', '-r', str(FPS), str(out)], check=True)
    got = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', str(out)], capture_output=True, text=True).stdout.strip() or 0)
    if got < n: print(f'  ! plano {i} ({key}) só tem {got}/{n} quadros — fonte curta')
if __name__ == '__main__':
    idx = [int(a) for a in sys.argv[1:]] or range(len(SHOTS))
    for i in idx: shot(i); print('plano', i, SHOTS[i][1], 'ok', flush=True)
    if not sys.argv[1:]:
        lst = HERE / 'planos' / 'lista.txt'; lst.write_text(''.join(f"file '{i:02d}.mp4'\n" for i in range(len(SHOTS))))
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(HERE / 'base.mp4')], check=True)
        json.dump([[s[0], s[1], s[3]] for s in SHOTS], open(HERE / 'voz' / 'planos.json', 'w'))
        print('base.mp4 ok')
