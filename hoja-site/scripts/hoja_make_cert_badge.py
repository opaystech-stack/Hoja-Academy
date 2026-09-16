# -*- coding: utf-8 -*-
"""Certificat + badge entreprise aux couleurs HOJA (remplacent visuels AI VENTURE)."""
from PIL import Image, ImageDraw, ImageFont
import pathlib

OUT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/public/assets/hoja")
NAVY=(17,39,121); DEEP=(8,14,40); EMER=(39,176,107); SKY=(124,196,213); LEAF=(70,150,65)

def font(size, bold=False):
    p = r"C:\Windows\Fonts\georgia.ttf" if not bold else r"C:\Windows\Fonts\georgiab.ttf"
    try: return ImageFont.truetype(p, size)
    except Exception: return ImageFont.load_default()

def lerp(a,b,t): return tuple(int(a[i]+(b[i]-a[i])*t) for i in range(3))

# ---- certificat 800x566
W,H=800,566
im=Image.new("RGB",(W,H))
d=ImageDraw.Draw(im)
for y in range(H):
    d.line([(0,y),(W,y)], fill=lerp(DEEP,NAVY,y/H))
# cadre double
d.rectangle([24,24,W-24,H-24], outline=EMER, width=3)
d.rectangle([34,34,W-34,H-34], outline=SKY, width=1)
# sceau central (rappel du logo: cercle + continents simplifies)
d.ellipse([W/2-58,H/2-190,W/2+58,H/2-74], outline=EMER, width=4)
d.ellipse([W/2-40,H/2-172,W/2+28,H/2-96], outline=LEAF, width=3)
d.line([W/2-20,H/2-140,W/2+16,H/2-110], fill=(240,208,0), width=4)
d.text((W/2, 96), "HOJA ACADEMY", font=font(30,True), fill=(255,255,255), anchor="mm")
d.text((W/2, 132), "L E A R   A I", font=font(13), fill=EMER, anchor="mm")
d.text((W/2, 210), "HOJA ACADEMY certifie que", font=font(17), fill=SKY, anchor="mm")
d.text((W/2, 262), "Nom de l'apprenant", font=font(40,True), fill=(255,255,255), anchor="mm")
d.text((W/2, 320), "a suivi avec succes et par la pratique le", font=font(16), fill=SKY, anchor="mm")
d.text((W/2, 366), "Programme Intensif d'IA Generative", font=font(27,True), fill=(255,255,255), anchor="mm")
d.line([160, 470, 340, 470], fill=(255,255,255), width=1)
d.text((250, 486), "Date", font=font(13), fill=SKY, anchor="mm")
d.line([460, 470, 640, 470], fill=(255,255,255), width=1)
d.text((550, 486), "Direction pedagogique", font=font(13), fill=SKY, anchor="mm")
d.text((W/2, 534), "Certification par la preuve - My AI Work System", font=font(12), fill=EMER, anchor="mm")
im.save(OUT/"certificat-hoja.png")

# second rendu legerement different pour eviter le look 'duplicate' sur 3 pages
im2 = im.copy()
d2 = ImageDraw.Draw(im2)
d2.text((W/2, 366), "Cours Expert en IA appliquee", font=font(27,True), fill=(255,255,255), anchor="mm")
im2.save(OUT/"certificat-hoja-2.png")

# ---- badge entreprise (remplace le macaron FUNDAE) 800x534
w2,h2=800,534
b=Image.new("RGB",(w2,h2))
d=ImageDraw.Draw(b)
for y in range(h2):
    d.line([(0,y),(w2,y)], fill=lerp((13,42,90),NAVY,y/h2))
d.ellipse([w2/2-110,h2/2-150,w2/2+110,h2/2+70], outline=EMER, width=5)
d.text((w2/2, h2/2-100), "FORMEZ VOTRE EQUIPE", font=font(26,True), fill=(255,255,255), anchor="mm")
d.text((w2/2, h2/2-40), "A L'IA APPLIQUEE", font=font(26,True), fill=EMER, anchor="mm")
d.text((w2/2, h2/2+16), "Facturation entreprise", font=font(17), fill=SKY, anchor="mm")
d.text((w2/2, h2/2+44), "Paiement echelonne", font=font(17), fill=SKY, anchor="mm")
d.text((w2/2, h2-40), "HOJA ACADEMY  ·  LEARN AI", font=font(15,True), fill=(255,255,255), anchor="mm")
b.save(OUT/"badge-entreprises.png")
print("visuels generes")
