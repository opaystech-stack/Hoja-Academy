# -*- coding: utf-8 -*-
"""Prepares Hoja hero/section graphics: netbg (strip white-ish logo text from
the globe-on-dark banner), hojacircle (globe emblem with alpha)."""
from PIL import Image
import pathlib

SRC = Image.open(r"C:/LAPOSTE/Projets/ACCADEMY OPAYS/Logo/logo_hoja_ac.png").convert("RGBA")
OUT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/public/assets/hoja")
OUT.mkdir(exist_ok=True)
W, H = SRC.size

# --- 1) hojacircle: emblem = left ~34% of the canvas, keep non-white pixels as alpha
left = SRC.crop((0, 0, int(W*0.36), H))
px = left.load()
for y in range(left.height):
    for x in range(left.width):
        r, g, b, a = px[x, y]
        if a > 0 and min(r, g, b) > 235:           # near-white background
            px[x, y] = (0, 0, 0, 0)
# trim
bbox = left.getbbox()
circle = left.crop(bbox)
circle.save(OUT/"hoja-emblem.png")
print("emblem:", circle.size)

# --- 2) netbg: logo horizontal decoupe, fond blanc -> transparent, puis version
#         sur fond marine Hoja pour hero sombre
H2 = Image.open(r"C:/LAPOSTE/Projets/ACCADEMY OPAYS/Logo/logo_hoja_horizontal.png").convert("RGBA")
px = H2.load()
for y in range(H2.height):
    for x in range(H2.width):
        r, g, b, a = px[x, y]
        if a > 0 and min(r, g, b) > 238:
            px[x, y] = (0, 0, 0, 0)
bbox = H2.getbbox()
H2 = H2.crop(bbox)
H2.save(OUT/"logo-hoja-transparent.png")
print("horizontal alpha:", H2.size)
# variante 'couleurs' : re-remplir texte blanc par marine + conserver LEARN AI vert
# (pour usages sur fond clair). On produit aussi une version blanche integrale
# (pour heros sombres): tout pixel colore -> blanc, alpha preserve.
white = H2.copy()
pw = white.load()
for y in range(white.height):
    for x in range(white.width):
        r, g, b, a = pw[x, y]
        if a > 0:
            pw[x, y] = (255, 255, 255, a)
white.save(OUT/"logo-hoja-white.png")
print("white ok")
