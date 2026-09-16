# -*- coding: utf-8 -*-
"""Recolore les couleurs inline (rgb()/hex) des .tsx avec la meme table HOJA."""
import colorsys, re, shutil, pathlib
def hsl(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r/255, g/255, b/255)
    return h*360, s, l
def rgb(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h/360, min(1,max(0,l)), min(1,max(0,s)))
    return int(round(r*255)), int(round(g*255)), int(round(b*255))
def remap(r, g, b):
    h, s, l = hsl(r, g, b)
    if s < 0.14: return None
    if 250 <= h < 335: return rgb(224+(l*18-9), max(.35,min(.75,s*.62)), l)
    if 186 <= h < 250: return rgb(202, max(.35,min(.80,s*.85)), l)
    if 140 <= h < 186: return rgb(161, min(.85,max(.45,s*.8)), l)
    if 80 <= h < 140:  return rgb(122, min(.60,s), l)
    return None

APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app")
BACKUP = APP/"audits/backup_clean"
BACKUP.mkdir(parents=True, exist_ok=True)
RGB = re.compile(r"rgba?\(\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\s*(,\s*(?:0|0?\.\d+)\s*)?\)")
HEX = re.compile(r"#([0-9a-fA-F]{6})\b")

def sub_rgb(m):
    out = remap(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    if not out: return m.group(0)
    return f"rgb({out[0]}, {out[1]}, {out[2]})" + (m.group(4) or "")

def sub_hex(m):
    v = m.group(1)
    out = remap(int(v[0:2],16), int(v[2:4],16), int(v[4:6],16))
    if not out: return m.group(0)
    return "#" + ("%02x%02x%02x" % out)

changed = {}
for p in sorted((APP/"src/app").rglob("*.tsx")):
    t = p.read_text(encoding="utf-8"); o = t
    t = RGB.sub(sub_rgb, t)
    t = HEX.sub(sub_hex, t)
    # backslash-escaped dans JSON-LD string
    if t != o:
        bk = BACKUP/("tsx__" + p.parent.name + "__" + p.name)
        if not bk.exists(): shutil.copy2(p, bk)
        p.write_text(t, encoding="utf-8", newline="\n")
        n = sum(1 for a,b in zip(o.split("\n"), t.split("\n")) if a!=b)
        changed[p.parent.name+"/"+p.name] = n
print("fichiers:", len(changed))
for k,v in sorted(changed.items(), key=lambda x:-x[1])[:12]: print(f"  {v:4d} {k}")
