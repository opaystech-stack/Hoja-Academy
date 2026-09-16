# -*- coding: utf-8 -*-
"""RE-JEU IDEMPOTENT apres toute passe de contenu: certificats AI VENTURE -> HOJA,
macaron FUNDAE -> badge HOJA, temoignages Alexis/Pablo -> anonymes, 10.3 Edicion -> FR,
alt Captura/Formacion -> FR. A relancer apres l'agent contenu si ses writes ont
restaure des refs heritees."""
import re, pathlib
ROOT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
CERT = {"e34dbaa8f713.png","cdb9c3c57c7a.png","d84b972b2df3.png","6899ae65c220.png","063481405e7e.png","49bfa8135472.png"}
BADGE = {"c6dab932b168.png","5e41487e08e8.png","5f23638a750d.png","b6863b551f02.png","c0b2ff282886.png"}
changed = []
for p in sorted(ROOT.rglob("*.tsx")):
    t = p.read_text(encoding="utf-8"); o = t
    def fix_img(m):
        s = m.group(0)
        if any(h in s for h in CERT):
            dest = "/assets/hoja/certificat-hoja-2.png" if p.parent.name == "curso-de-gemini" else "/assets/hoja/certificat-hoja.png"
            s = re.sub(r'src="[^"]*"', f'src="{dest}"', s)
            s = re.sub(r'srcSet="[^"]*"', f'srcSet="{dest}"', s)
            s = re.sub(r'alt="[^"]*"', 'alt="Certificat HOJA ACADEMY"', s)
        elif any(h in s for h in BADGE):
            s = re.sub(r'src="[^"]*"', 'src="/assets/hoja/badge-entreprises.png"', s)
            s = re.sub(r'srcSet="[^"]*"', 'srcSet="/assets/hoja/badge-entreprises.png"', s)
            s = re.sub(r'alt="[^"]*"', 'alt="Formation IA pour equipes"', s)
        return s
    t = re.sub(r"<img\b[^>]*/>", fix_img, t)
    t = t.replace('{"Alexis \u2014 Sector "}', '{"Apprenant \u2014 secteur "}')
    t = t.replace('{"Pablo \u2014 "}', '{"Apprenant \u2014 "}')
    t = t.replace("10.3 Edición de imágenes", "10.3 Édition d'images")
    t = re.sub(r'alt="(Imagen de[^"]*|Captura de pantalla[^"]*|Formaci[oó]n[^"]*|Alumnos[^"]*)"', 'alt="Visuel HOJA ACADEMY"', t)
    if t != o:
        p.write_text(t, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))
print("re-jeu applique:", changed or "rien a faire (deja propre)")
