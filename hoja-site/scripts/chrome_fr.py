# -*- coding: utf-8 -*-
"""Passe FR de la chrome (UI) du site + chaines noticias-ia selon le brief."""
import re
from pathlib import Path

ROOT = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src")

PAIRS = [
    # chrome partagee (boutons de partage, navigation)
    ("Volver a HOJA ACADEMY Actualités", "Retour aux Actualités"),
    ("Compartir HOJA ACADEMY Actualités", "Partager HOJA ACADEMY Actualités"),
    ("Compartir en WhatsApp", "Partager sur WhatsApp"),
    ("Compartir en LinkedIn", "Partager sur LinkedIn"),
    ("Compartir en X", "Partager sur X"),
    ("Copiar enlace de HOJA ACADEMY Actualités", "Copier le lien"),
    ("Copiar enlace", "Copier le lien"),
    # noticias-ia (brief point 3)
    ("Últimas 24 horas", "Dernières 24 heures"),
    ("Actualización diaria. Las noticias publicadas tras la última revisión podrán aparecer en la siguiente actualización.",
     "Mise à jour quotidienne. Les actualités publiées après la dernière révision apparaîtront dans la prochaine mise à jour."),
    ("No hay noticias publicadas en las últimas 24 horas.",
     "Aucune actualité publiée dans les dernières 24 heures."),
    ("Edición anterior", "Édition précédente"),
    ("Últimas 72 horas", "Dernières 72 heures"),
    ("Newsletter gratuita", "Newsletter gratuite"),
    ("Recibe la actualidad IA", "Recevez l'actualité IA"),
    ("Una selección de novedades sobre herramientas, modelos y funciones de IA generativa, directamente en tu correo.",
     "Une sélection de nouveautés sur les outils, modèles et fonctionnalités de l'IA générative, directement dans votre boîte mail."),
    ("Suscríbete gratis", "S'inscrire gratuitement"),
    ("Repositorio de noticias", "Archives"),
    ("Ediciones anteriores", "Éditions précédentes"),
    ("Archivo de noticias", "Archive des actualités"),
    (">Archivo<", ">Archive<"),
    # dates UI -> format FR (le jour est preserve par le motif general)
    (" de septiembre de ", " septembre "),
]

changed = []
for p in sorted(ROOT.rglob("*.tsx")) + sorted(ROOT.rglob("*.ts")):
    raw = p.read_text(encoding="utf-8")
    new = raw
    for es, fr in PAIRS:
        new = new.replace(es, fr)
    if new != raw:
        p.write_text(new, encoding="utf-8", newline="\n")
        changed.append(str(p.relative_to(ROOT)))

print(f"{len(changed)} fichiers modifies")
for c in changed:
    print("  " + c)
