# -*- coding: utf-8 -*-
"""Genere globals-hoja.css : palette Hoja Academy par remappage couleur de globals.css.

Methode: echantillonne les couleurs reelles du logo HOJA, construit un nuancier
(marine, bleu ciel, vert feuille, emeraude, jaune, rouge) puis remplace chaque
valeur hex/rgb de globals.css par sa couleur Hoja la plus proche (espace CIELAB),
en preservant luminance/roles (les neutres restent neutres).
Aucune structure/modificateur touche — uniquement des valeurs de tokens.
"""
import re, colorsys, pathlib

SRC = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app/globals.css")
DST = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app/globals-hoja.css")

# Nuancier reference HOJA (echantillonne logo_hoja_horizontal.png + favicon_hoja.png)
HOJA = {
    "navy":     "#112779",  # marine profond (contour cercle, ombres texte)
    "navy2":    "#003c86",  # bleu roi
    "sky":      "#7cc4d5",  # bleu ciel interieur globe
    "sky2":     "#98d0ea",
    "leaf":     "#469641",  # vert continent africain
    "leaf2":    "#57A757",
    "emerald":  "#10b080",  # 'LEARN AI' / accents vifs (vision)
    "emerald2": "#27B06B",
    "yellow":   "#f0d000",  # capsule jaune
    "red":      "#d8001a",  # capsule rouge
}

def hex2rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb2lab(rgb):
    r, g, b = [c/255 for c in rgb]
    def f(c): return ((c+0.055)/1.055)**2.4 if c > 0.04045 else c/12.92
    r, g, b = f(r), f(g), f(b)
    x = (0.4124*r+0.3576*g+0.1805*b)/0.95047
    y = 0.2126*r+0.7152*g+0.0722*b
    z = (0.0193*r+0.1192*g+0.9505*b)/1.08883
    def g_(t): return t**(1/3) if t > 0.008856 else 7.787*t+16/116
    L = 116*g_(y)-16
    return (L, 500*(g_(x)-g_(y)), 200*(g_(y)-g_(z)))

PALETTE = [(name, rgb2lab(hex2rgb(v)), hex2rgb(v), v) for name, v in HOJA.items()]

def nearest(color):
    """couleur Hoja la plus proche en deltaE simple, avec respect de luminance"""
    L, a, b = rgb2lab(color)
    def d(cl):
        L2, a2, b2 = cl
        return ((L-L2)*0.65)**2 + (a-a2)**2 + (b-b2)**2
    best = min(PALETTE, key=lambda p: d(p[1]))
    return best

def map_color(rgb):
    r, g, b = rgb
    mx, mn = max(rgb), min(rgb)
    sat = (mx-mn)/(mx+1)
    lum = 0.299*r+0.587*g+0.114*b
    # neutres:.preserver (fonds, gris, textes blanc/noir)
    if sat < 0.12:
        return None
    # couleurs pastel tres claires -> version claire de la teinte Hoja
    name, _, rgbref, hx = nearest(rgb2lab(rgb))
    # adjustment de luminance vers la reference preservee :
    # on remplace par la couleur Hoja la plus proche, en mixant avec blanc/noir
    # pour coller a la luminance d'origine (garder les roles clair/sombre)
    L0 = 0.299*r+0.587*g+0.114*b
    L1 = 0.299*rgbref[0]+0.587*rgbref[1]+0.114*rgbref[2]
    out = rgbref
    if L0 > 200:   out = tuple(int(255-(255-c)*0.25) for c in rgbref)  # tres clair -> pastel
    elif L0 > 170: out = tuple(int(255-(255-c)*0.45) for c in rgbref)
    elif L0 < 45:  out = tuple(int(c*0.35) for c in rgbref)            # tres sombre -> deep
    elif L0 < 90:  out = tuple(int(c*0.62) for c in rgbref)
    return "#%02x%02x%02x" % out

def sub_hex(m):
    rgb = hex2rgb(m.group(0))
    out = map_color(rgb)
    return out if out else m.group(0)

HEX = re.compile(r"#[0-9a-fA-F]{6}\b")
RGB = re.compile(r"rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*[\d.]+\s*)?\)")

t = SRC.read_text(encoding="utf-8")
n0 = len(HEX.findall(t))
t = HEX.sub(sub_hex, t)

def sub_rgb(m):
    r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
    out = map_color((r, g, b))
    if not out: return m.group(0)
    rr, gg, bb = hex2rgb(out)
    alpha = m.group(4) or ""
    base = m.group(0).strip().split("(")[0]
    return f"{base}({rr}, {gg}, {bb}{alpha})"

n1 = len(RGB.findall(t))
t = RGB.sub(sub_rgb, t)

# nom de la marque dans les eventuels commentaires
t = t.replace("academiartificial", "hoja-academy").replace("AcademIArtificial", "HOJA ACADEMY")

DST.write_text(t, encoding="utf-8", newline="\n")
print(f"hex remappes: {n0}, rgb remappes: {n1}, sortie: {DST}")
print("taille:", DST.stat().st_size)
