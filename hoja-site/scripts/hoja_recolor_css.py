# -*- coding: utf-8 -*-
"""Branding HOJA ACADEMY par remappage de teintes des fichiers CSS.

Principe: preserver luminance/saturation/roles (structure CSS intacte, aucun
selecteur/modificateur touche), remplacer UNIQUEMENT les valeurs de couleurs:
 - violets/ magentas (identite AI VENTURE: #471887, #6358DE, #4F46B2, #140f21, rgb(139,92,246))
     -> famille HOJA marine/bleu roi (teinte 222-230) desaturee
 - menthe neon / turquoise (accents herites #41ffc1, rgb(0,255,200), #10b981...)
     -> emeraude HOJA (teinte 158-165)
 - bleus clairs -> bleu ciel HOJA (teinte ~197)
 - verts deja HOJA-like: alignes sur teinte feuille/emeraude
 - rouges/jaunes/ oranges: conserves (accents du logo)
 - neutres (s<0.14): conserves (fonds, textes, ombres)
Ecrit les sauvegardes dans audits/backup_css/.
"""
import colorsys, re, shutil, pathlib

APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app")
BACKUP = APP/"audits/backup_css"
BACKUP.mkdir(parents=True, exist_ok=True)

RGB = re.compile(r"rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*(?:0|0?\.\d+)\s*)?\)")
HEX = re.compile(r"#([0-9a-fA-F]{6})\b")

def hsl(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    return h*360, s, l

def rgb(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360, min(1, max(0, l)), min(1, max(0, s)))
    return int(round(r*255)), int(round(g*255)), int(round(b*255))

def remap(r, g, b):
    h, s, l = hsl(r, g, b)
    if s < 0.14:
        return None                                   # neutre: garder
    if 250 <= h < 335:                                # violet/magenta -> marine HOJA
        nh = 224 + (l*18 - 9)                         # leger etagement
        ns = max(0.35, min(0.75, s*0.62))
        return rgb(nh, ns, l)
    if 186 <= h < 250:                                # cyan/azur -> bleu ciel HOJA
        nh = 202
        ns = max(0.35, min(0.80, s*0.85))
        return rgb(nh, ns, l)
    if 140 <= h < 186:                                # turquoise/menthe neon -> emeraude
        nh = 161
        ns = min(0.85, max(0.45, s*0.8))
        return rgb(nh, ns, l)
    if 80 <= h < 140:                                 # verts feuille -> vert HOJA
        nh = 122
        return rgb(nh, min(0.60, s), l)
    return None                                        # rouge/jaune/orange/rose: garder

def sub_rgb(m):
    r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
    out = remap(r, g, b)
    if not out:
        return m.group(0)
    alpha = m.group(4) or ""
    base = m.group(0).strip().split("(")[0]
    return f"{base}({out[0]}, {out[1]}, {out[2]}{alpha})"

def sub_hex(m):
    r = int(m.group(1)[0:2], 16); g = int(m.group(1)[2:4], 16); b = int(m.group(1)[4:6], 16)
    out = remap(r, g, b)
    if not out:
        return m.group(0)
    return "#%02x%02x%02x" % out

targets = [APP/"src/app/globals.css"] + sorted((APP/"src/app").rglob("ditto.css"))
total = 0
for f in targets:
    if not f.exists(): continue
    bak = BACKUP/f.relative_to(APP).as_posix().replace("/", "__")
    if not bak.exists():
        shutil.copy2(f, bak)
    t = f.read_text(encoding="utf-8")
    n0 = t
    t = RGB.sub(sub_rgb, t)
    t = HEX.sub(sub_hex, t)
    if t != n0:
        f.write_text(t, encoding="utf-8", newline="\n")
        c = sum(1 for a, b in zip(n0.split("\n"), t.split("\n")) if a != b)
        total += c
        print(f"recolore: {f.relative_to(APP)} ({c} lignes)")
print("total lignes recolorees:", total)
