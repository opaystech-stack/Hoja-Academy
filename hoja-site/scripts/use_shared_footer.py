import pathlib, re
APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
report = []
# 1) remplacer le footer inline (dupliqué, avec dropdown mort + texte 003) par <Footer /> partout
pages = ["page.tsx","entreprises/page.tsx","contact/page.tsx","accessibilite/page.tsx",
         "confidentialite/page.tsx","cookies/page.tsx","mentions-legales/page.tsx",
         "formations/programme-intensif/page.tsx"]
for f in pages:
    p = APP/f
    t = p.read_text(encoding="utf-8")
    s = t.find('<footer className="block before:content-')
    if s < 0:
        report.append((f, "pas de footer inline")); continue
    e = t.find("</footer>", t.find("</footer>", s)+9)  # ferme le footer interne PUIS l'externe
    # le footer externe ferme juste apres le second </footer>
    if e < 0:
        report.append((f, "fermeture introuvable")); continue
    blob = t[s:e]
    if "menu-1-516d334" not in blob:
        report.append((f, "footer inline sans dropdown (garde)")); continue
    t2 = t[:s] + "<Footer />" + t[e+len("</footer>"):]
    if "from \"./sections/footer\"" not in t2 and "sections/footer" not in t2:
        t2 = re.sub(r'(import ".*?/ditto\.css";\n)', r'\1import Footer from "./sections/footer";\n', t2, count=1)
    p.write_text(t2, encoding="utf-8")
    report.append((f, "footer inline -> <Footer />", len(blob)))
for r in report: print(r)
