# -*- coding: utf-8 -*-
"""Passe finale FR: bandeaux articles, composants cartes, fragments restants."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src")

MOIS = {"enero":"janvier","febrero":"février","marzo":"mars","abril":"avril","mayo":"mai",
        "junio":"juin","julio":"juillet","agosto":"août","septiembre":"septembre",
        "octubre":"octobre","noviembre":"novembre","diciembre":"décembre"}

PAIRS = [
 ("Edición diaria · ", "Édition quotidienne · "),
 ("Edicion diaria con novedades recientes sobre herramientas, modelos y funciones de IA generativa seleccionadas por HOJA ACADEMY.",
  "Édition quotidienne avec les dernières nouveautés sur les outils, modèles et fonctionnalités de l'IA générative, sélectionnées par HOJA ACADEMY."),
 ("Novedades sobre herramientas, modelos y funciones de IA generativa seleccionadas por HOJA ACADEMY.",
  "Nouveautés sur les outils, modèles et fonctionnalités de l'IA générative, sélectionnées par HOJA ACADEMY."),
 ("Abrir edición", "Ouvrir l'édition"),
 ("50 clases", "50 cours"),
 ("+55 clases", "+55 cours"),
 ("El Programme Intensif", "Le Programme Intensif"),
 ("Formación", "Formation"),
]

def fix_dates(t):
    # "1 agosto 2026" -> "1er août 2026" (dans les bandeaux deja en FR autour)
    def rep(m):
        d, mo = m.group(1), m.group(2)
        jour = "1er" if d == "1" else d
        return f"{jour} {MOIS[mo.lower()]} {m.group(3)}"
    return re.sub(r"\b(\d{1,2}) (enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre) (20\d\d)\b", rep, t, flags=re.I)

changed = []
for p in sorted(ROOT.rglob("*.tsx")) + sorted(ROOT.rglob("*.ts")):
    if p.name == "route.ts":  # dump du flux WP externe, ne pas falsifier
        continue
    raw = p.read_text(encoding="utf-8")
    new = raw
    for es, fr in PAIRS:
        new = new.replace(es, fr)
    new = fix_dates(new)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))
print(f"{len(changed)} fichiers modifies")
for c in changed[:25]: print("  " + c)
