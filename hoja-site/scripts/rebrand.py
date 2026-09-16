# -*- coding: utf-8 -*-
"""Rebranding AcademIArtificial -> HOJA ACADEMY (context-aware, UTF-8 safe)."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src")

# (pattern, replacement, case_sensitive) — appliquees dans cet ordre
RULES = [
    # URLs sociales -> profils HOJA
    (r"linkedin\.com/company/academiartificial", "linkedin.com/company/hoja-academy", False),
    (r"instagram\.com/academiartificial", "instagram.com/hojaacademy", False),
    (r"youtube\.com/@academ[a-zA-Z]*rtificial", "youtube.com/@HojaAcademy", False),
    (r"tiktok\.com/@academiartificial", "tiktok.com/@hojaacademy", False),
    (r"meet\.brevo\.com/academiartificial", "meet.brevo.com/hoja-academy", False),
    # route interne : /institution remplace laancienne page opiniones
    (r"/opiniones-de-academiartificial/", "/institution/", False),
    # domaine
    (r"academiartificial\.com", "hoja-academy.com", False),
    # NoticIArtificial dans les query-string encodees des boutons de partage
    (r"NoticIArtificial%3A", "HOJA%20ACADEMY%20Actualit%C3%A9s%3A", False),
    (r"text=NoticIArtificial", "text=HOJA%20ACADEMY%20Actualit%C3%A9s", False),
    # texte affiche
    (r"NoticIArtificial", "HOJA ACADEMY Actualités", True),
    (r"AcademIArtificial", "HOJA ACADEMY", True),
    (r"ACADEMIARTIFICIAL", "HOJA ACADEMY", True),
    (r"academiartificial", "HOJA ACADEMY", False),  # catch-all residuel
]

# slugs de pages WP externes (pas des routes de ce build) a preserver intacts
SLUG_GUARDS = [
    ("descuentos-verano-HOJA ACADEMY-ia80", "descuentos-verano-academiartificial-ia80"),
    ("rebajas-verano-formaciones-ia-HOJA ACADEMY", "rebajas-verano-formaciones-ia-academiartificial"),
]

changed = []
for p in sorted(ROOT.rglob("*.tsx")) + sorted(ROOT.rglob("*.ts")):
    raw = p.read_text(encoding="utf-8")
    new = raw
    for pat, rep, cs in RULES:
        flags = 0 if cs else re.IGNORECASE
        new = re.sub(pat, rep, new, flags=flags)
    for bad, good in SLUG_GUARDS:
        new = new.replace(bad, good)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))

print(f"{len(changed)} fichiers modifies")
for c in changed:
    print("  " + c)
