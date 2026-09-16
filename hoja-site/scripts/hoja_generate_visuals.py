# -*- coding: utf-8 -*-
"""Genere les visuels abstraits HOJA (remplacent photos reelles / logos institutionnels)."""
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import math, pathlib

OUT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/public/assets/hoja")
OUT.mkdir(exist_ok=True)

NAVY = (17, 39, 121)      # #112779
DEEP = (8, 14, 40)
SKY  = (124, 196, 213)
LEAF = (70, 150, 65)
EMER = (39, 176, 107)
YEL  = (240, 208, 0)
RED  = (216, 0, 26)

def lerp(a, b, t): return tuple(int(a[i] + (b[i]-a[i])*t) for i in range(3))

def base(w, h, c1, c2, seed_shift=0.0):
    im = Image.new("RGB", (w, h))
    d = ImageDraw.Draw(im)
    for y in range(h):
        t = y / max(1, h-1)
        d.line([(0, y), (w, y)], fill=lerp(c1, c2, t))
    return im

def wave(im, color, amp, phase, width, alpha=90):
    w, h = im.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = [(x, int(h*0.55 + amp*math.sin(x/w*3.14159*2 + phase))) for x in range(0, w, 6)]
    d.line(pts, fill=color + (alpha,), width=width, joint="curve")
    im.paste(layer, (0, 0), layer)

def dots(im, color, n, seed):
    import random
    rnd = random.Random(seed)
    w, h = im.size
    layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for _ in range(n):
        x, y = rnd.randrange(w), rnd.randrange(h)
        r = rnd.randrange(1, 4)
        d.ellipse([x-r, y-r, x+r, y+r], fill=color + (rnd.randrange(40, 120),))
    im.paste(layer, (0, 0), layer)

# --- 5 visuels 'promotion' (800x574) remplaces les photos d'eleves reels
palettes = [(DEEP, NAVY), (NAVY, (28, 97, 121)), ((13, 42, 90), (39, 176, 107)),
            (DEEP, (70, 150, 65)), ((10, 30, 70), (124, 196, 213))]
for i in range(1, 6):
    w, h = 800, 574
    c1, c2 = palettes[i-1]
    im = base(w, h, c1, c2, i)
    wave(im, EMER, 40 + i*7, i*0.9, 3, 120)
    wave(im, SKY, 25 + i*5, i*1.7 + 1.2, 2, 90)
    dots(im, (255, 255, 255), 260, i*17)
    # petit globe stylise (rappel emblème, sans visage)
    lay = Image.new("RGBA", (w, h), (0, 0, 0, 0)); dl = ImageDraw.Draw(lay)
    cx, cy, r = int(w*0.72), int(h*0.34), int(min(w, h)*0.16)
    dl.ellipse([cx-r, cy-r, cx+r, cy+r], outline=EMER+(200,), width=4)
    dl.arc([cx-r, cy-r, cx+r, cy+r], 200, 340, fill=SKY+(170,), width=3)
    dl.ellipse([cx-int(r*0.35), cy-int(r*0.5), cx+int(r*0.5), cy+int(r*0.4)], outline=LEAF+(190,), width=3)
    im.paste(lay, (0, 0), lay)
    im.save(OUT / f"hoja-promo-{i}.jpg", quality=82)

# --- carré 242x242 (remplace portraits equipe)
sq = base(242, 242, DEEP, NAVY)
dots(sq, (255,255,255), 90, 5)
wave(sq, EMER, 30, 0.6, 3, 110)
lay = Image.new("RGBA", sq.size, (0,0,0,0)); dl = ImageDraw.Draw(lay)
dl.ellipse([71,71,171,171], outline=EMER+(210,), width=4)
dl.ellipse([101,91,141,131], outline=YEL+(200,), width=3)
sq.paste(lay, (0,0), lay)
sq.save(OUT/"hoja-team-tile.jpg", quality=85)

# --- banniere footer 800x92 (remplace logos institutionnels espagnols)
ban = Image.new("RGB", (800, 92), (255, 255, 255))
d = ImageDraw.Draw(ban)
try:
    font = ImageFont.truetype(r"C:\Windows\Fonts\georgia.ttf", 34)
    f2 = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 13)
except Exception:
    font = f2 = ImageFont.load_default()
d.text((400, 40), "HOJA ACADEMY", font=font, fill=NAVY, anchor="mm")
d.text((400, 74), "LEARN AI", font=f2, fill=EMER, anchor="mm")
for x in range(0, 800, 160):
    d.line([(x, 88), (x+80, 92)], fill=EMER, width=2)
ban.save(OUT/"hoja-footer-brand.png")

# --- grand hero 800x534 (remplace capture 'Programme IA entreprises en direct')
hero = base(800, 534, (13,42,90), (28,97,121))
wave(hero, EMER, 60, 0.4, 4, 130); wave(hero, YEL, 30, 2.2, 2, 70)
dots(hero, (255,255,255), 300, 99)
hero.save(OUT/"hoja-hero-live.jpg", quality=82)

# --- 400x300 'interface' generique (remplace capture d'outil herite b97f813e2591)
ui = Image.new("RGB", (400, 300), (11, 17, 42)); du = ImageDraw.Draw(ui)
du.rounded_rectangle([20, 20, 380, 280], radius=14, outline=EMER+(255) if False else EMER, width=2)
du.line([20, 60, 380, 60], fill=(255,255,255), width=1)
for yy in (90, 130, 170, 210):
    du.rounded_rectangle([40, yy, 40+int(280*(0.4+((yy//40)%4)*0.2)), yy+18], radius=9, outline=SKY, width=1)
du.ellipse([300, 200, 350, 250], outline=YEL, width=2)
du.ellipse([260, 225, 300, 265], outline=RED, width=2)
ui.save(OUT/"hoja-workflow.jpg", quality=85)
print("visuels generes:", sorted(p.name for p in OUT.iterdir()))
