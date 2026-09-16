# -*- coding: utf-8 -*-
"""Remplace les assets CRITIQUE (photos eleves reels, portraits, captures heritees)
par les visuels abstraits HOJA + retire iframes/video embeds de l'ancien projet."""
import re, pathlib
APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app")
SRC = APP/"src/app"

EDITION = {1:"hoja-promo-1.jpg", 2:"hoja-promo-2.jpg", 3:"hoja-promo-3.jpg",
           4:"hoja-promo-4.jpg", 5:"hoja-promo-5.jpg"}
# hash -> numero d'edition (selon alt text relevé dans l'audit)
BY_ED = {
 "027064cfa81b.jpg":1, "44ff4277a669.jpg":1, "59748a15b9ec.jpg":1, "aa589c4c569a.jpg":1, "d91bbe528cd7.jpg":1,
 "06c64cffc9dd.png":2, "081b9bd99eaa.png":2, "0f23e139c391.png":2, "32476298cfab.png":2, "874795be0693.png":2,
 "18b783dffdb9.png":3, "9470b406091e.png":3, "cf21e800176b.png":3, "dcea3cfe0cb3.png":3, "e853281d170b.png":3, "f033dfba39b9.png":3,
 "075d4d6a430e.png":4, "89dd3dac41c1.png":4, "8d1544118b55.png":4, "a5b5e8504da2.png":4, "a68d49a3ce64.png":4, "f8bf71f6840c.png":4,
 "0c07842406dd.png":5, "63b1ab385780.png":5, "66cca504e7e1.png":5, "7341b2ddddf4.png":5, "734d92c11395.png":5, "ff52ab84d186.png":5,
}
ALL_HASH = set(BY_ED)
ALL_HASH |= {"2f90436459cc.jpg", "31f11f656d9f.jpg", "b3f4d804c887.webp"}   # miniatures video
ALL_HASH |= {"715aa8527076.png"}   # portrait Alejavi
ALL_HASH |= {"9dd92c8d35ca.jpg"}   # portrait Jose Moral
ALL_HASH |= {"b97f813e2591.png"}   # capture outil herite

def url_for(h):
    if h in BY_ED: return "/assets/hoja/" + EDITION[BY_ED[h]]
    if h == "715aa8527076.png": return "/assets/hoja/hoja-team-tile.jpg"
    if h == "9dd92c8d35ca.jpg": return "/assets/hoja/hoja-workflow.jpg"
    if h == "b97f813e2591.png": return "/assets/hoja/hoja-workflow.jpg"
    return None  # miniatures video -> bloc supprime ailleurs

changed = []
for p in sorted(SRC.rglob("*.tsx")):
    t = p.read_text(encoding="utf-8"); o = t
    for h in ALL_HASH:
        new = url_for(h)
        # src
        t = t.replace(f"/assets/cloned/images/{h}", new or "/assets/hoja/hoja-promo-1.jpg")
    # srcSet: retire les entres orphelines -> remplacer les variantes par la nouvelle url
    def fix_srcset(m):
        val = m.group(2)
        if not any(h in val for h in ALL_HASH): return m.group(0)
        # deviner la destination depuis le src deja remplace sur la meme balise?
        return m.group(0)
    # srcSet restant contenant hash crit -> on remplace tout le srcset par la src courante
    def repl_srcset(m):
        full = m.group(0)
        for h in ALL_HASH:
            if h in full:
                s = re.search(r'src="([^"]+)"', full)
                if s:
                    src = s.group(1)
                    full = re.sub(r'srcSet="[^"]*"', f'srcSet="{src}"', full)
                return full
        return full
    t = re.sub(r'<img\b[^>]*/>', repl_srcset, t)
    # alt herites
    t = re.sub(r'alt="(Imagen de [^"]*|Captura de pantalla[^"]*|Formaci[oó]n[^"]*|Alumnos[^"]*|Programa de IA[^"]*|video[^"]*|Video[^"]*)"',
               lambda m: 'alt="Visuel HOJA ACADEMY"' if m.group(1).lower().startswith(("imagen","captura")) else m.group(0), t)
    if t != o:
        p.write_text(t, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(APP)))
print("fichiers modifiés:", len(changed))
for c in changed: print("  ", c)

# verification: plus aucun hash critique dans src
import subprocess
left = []
for p in SRC.rglob("*.tsx"):
    t = p.read_text(encoding="utf-8")
    for h in ALL_HASH:
        if h in t: left.append((str(p.name), h))
print("refs restantes:", left or "AUCUNE")
