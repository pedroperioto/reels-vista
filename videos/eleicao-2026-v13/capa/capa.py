# Capas do Reels v13 (1080x1920). O que importa fica dentro do recorte 3:4 do perfil (y 240–1680).
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
F='/home/claude/reels-vista/lib/fonts/'
f=lambda n,s: ImageFont.truetype(F+n, s)
W,H=1080,1920; NAVY=(11,31,58); GOLD=(226,199,143); GOLDA=(184,149,90)
def grad(im, y0, y1, a0, a1, col=(6,16,32)):
    ov=Image.new('RGBA',im.size,(0,0,0,0)); d=ImageDraw.Draw(ov)
    for y in range(y0,y1): a=int(255*(a0+(a1-a0)*(y-y0)/(y1-y0))); d.line([(0,y),(W,y)],fill=col+(a,))
    return Image.alpha_composite(im,ov)
def ctext(d,y,s,font,fill,stroke=0,sc=None):
    w=d.textlength(s,font=font); d.text(((W-w)/2,y),s,font=font,fill=fill,stroke_width=stroke,stroke_fill=sc)
def pill(d,y,s,font,bg,fg,padx=44,h=96):
    w=d.textlength(s,font=font)+2*padx; x=(W-w)/2; d.rounded_rectangle([x,y,x+w,y+h],radius=h//2,fill=bg); d.text((x+padx,y+h/2),s,font=font,fill=fg,anchor='lm')
# ---- A: foto real (torre vista do Highline)
im=Image.open('../clips/hl_torre/0150.jpg').convert('RGBA').resize((W,H))
im=grad(im,0,1120,0.93,0.0); im=grad(im,1150,H,0.0,0.88)
d=ImageDraw.Draw(im)
ctext(d,300,'ELEIÇÃO 2026  ·  5 CONSELHOS',f('Mono.ttf',34),GOLD)
ctext(d,370,'VAI ESPERAR',f('InterBlack.otf',128),(255,255,255))
ctext(d,505,'A ELEIÇÃO',f('InterBlack.otf',128),(255,255,255))
ctext(d,620,'pra comprar?',f('Instr.ttf',170),GOLD)
pill(d,1330,'Aluguel subiu ≈ 2× a inflação',f('InterSemi.otf',46),NAVY+(235,),(255,255,255))
ctext(d,1470,'Governo passa. O tijolo fica.',f('Instr.ttf',82),(255,255,255))
im.convert('RGB').save('capa_A_foto.jpg',quality=93)
# ---- B: claro, padrão da marca (moeda Lula × Flávio)
bg=Image.new('RGB',(W,H),(244,244,246)); a=np.array(bg).astype(float)
yy,xx=np.mgrid[0:H,0:W]
for cx,cy,r,c in ((80,560,700,(212,55,63)),(1000,1360,700,(47,91,211)),(540,1000,800,(184,149,90))):
    k=np.clip(1-np.hypot(xx-cx,yy-cy)/r,0,1)[...,None]*0.13; a=a*(1-k)+np.array(c)*k
im=Image.fromarray(a.astype('uint8')).convert('RGBA'); d=ImageDraw.Draw(im)
ctext(d,290,'ELEIÇÃO 2026  ·  5 CONSELHOS',f('Mono.ttf',34),GOLDA)
ctext(d,360,'Vai esperar a eleição',f('InterSemi.otf',84),NAVY)
ctext(d,450,'pra comprar?',f('Instr.ttf',178),GOLDA)
def coin(key,cx,cy,R):
    sh=Image.new('RGBA',(W,H),(0,0,0,0)); ds=ImageDraw.Draw(sh); ds.ellipse([cx-R+10,cy-R+30,cx+R+10,cy+R+30],fill=(11,31,58,90)); sh=sh.filter(ImageFilter.GaussianBlur(26))
    global im; im=Image.alpha_composite(im,sh); dd=ImageDraw.Draw(im)
    dd.ellipse([cx-R,cy-R,cx+R,cy+R],fill=(201,168,106)); r=int(R*0.86)
    ph=Image.open(f'../fotos/{key}.jpg').convert('RGB'); s=min(ph.size); ph=ph.crop(((ph.width-s)//2,0,(ph.width-s)//2+s,s)).resize((2*r,2*r))
    m=Image.new('L',(2*r,2*r),0); ImageDraw.Draw(m).ellipse([0,0,2*r,2*r],fill=255); im.paste(ph,(cx-r,cy-r),m)
coin('lula',300,960,215); coin('flavio',780,960,215)
d=ImageDraw.Draw(im); d.ellipse([540-78,960-78,540+78,960+78],fill=NAVY); ctext(d,960-62,'?',f('InterBlack.otf',112),GOLD)
pill(d,1270,'O aluguel subiu ≈ 2× a inflação',f('InterSemi.otf',46),NAVY,(255,255,255))
ctext(d,1420,'Governo passa.',f('InterSemi.otf',70),NAVY)
ctext(d,1500,'O tijolo fica.',f('Instr.ttf',120),GOLDA)
im.convert('RGB').save('capa_B_claro.jpg',quality=93)
# prévia: como aparece no perfil (recorte 3:4) lado a lado
P=[Image.open(x).crop((0,240,1080,1680)).resize((540,720)) for x in ('capa_A_foto.jpg','capa_B_claro.jpg')]
S=Image.new('RGB',(1100,720),'white'); S.paste(P[0],(0,0)); S.paste(P[1],(560,0)); S.save('previa_perfil.jpg',quality=88)
