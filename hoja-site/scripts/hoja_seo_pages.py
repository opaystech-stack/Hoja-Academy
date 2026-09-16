# -*- coding: utf-8 -*-
"""Insere 'export const metadata' par page (SEO) apres passage de l'agent contenu.
Ne touche pas au JSX: insertion au niveau module avant 'export default function Page'."""
import re, pathlib

ROOT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
M = {
 "page.tsx": ("HOJA ACADEMY — L'académie de l'IA pour les professionnels | Learn AI",
   "Académie internationale de formation à l'intelligence artificielle : programme intensif 8 semaines, 18 modules, agents IA, automatisation, robotique & IA pour la recherche. Apprendre, pratiquer, construire, automatiser, produire."),
 "curso-ia/page.tsx": ("Programme Intensif d'IA Générative — 8 semaines, 18 modules | HOJA ACADEMY",
   "Le parcours fondateur HOJA ACADEMY : 18 modules en 4 blocs, sessions live de 90 à 120 minutes, projet final 'My AI Work System' et certification par la pratique."),
 "curso-de-chatgpt/page.tsx": ("Expert ChatGPT & Prompts — formation pratique | HOJA ACADEMY",
   "Maîtrisez ChatGPT et les grands modèles de langage : prompts C.O.R.E., assistants personnalisés, automatisations et cas d'usage professionnels réels."),
 "curso-de-gemini/page.tsx": ("Expert Gemini & IA multimodale — formation pratique | HOJA ACADEMY",
   "Exploitez l'écosystème Google IA : Gemini, Workspace, NotebookLM et la génération multimodale au service de votre productivité professionnelle."),
 "curso-de-make/page.tsx": ("Automatisation Make & n8n — agents et workflows | HOJA ACADEMY",
   "Automatisez vos processus sans code : scénarios Make, connecteurs, workflows et agents IA appliqués à votre quotidien professionnel."),
 "institution/page.tsx": ("L'Institution HOJA ACADEMY | Learn AI",
   "HOJA ACADEMY est une institution de formation à l'intelligence artificielle pour les professionnels d'Afrique francophone et de la diaspora : pratique intensive, accompagnement expert, résultats réels."),
 "empresas/page.tsx": ("Formations IA pour entreprises | HOJA ACADEMY",
   "Formations en intelligence artificielle pour équipes et organisations : en direct, à votre rythme ou sur mesure, avec application à des processus réels."),
 "noticias-ia/page.tsx": ("HOJA ACADEMY Actualités IA | Learn AI",
   "Sélection d'actualités sur les outils, modèles et fonctionnalités de l'IA générative : liens éditorialisés, sans bruit, mis à jour régulièrement."),
 "contacto/page.tsx": ("Contact | HOJA ACADEMY",
   "Contactez l'équipe HOJA ACADEMY par e-mail ou chat — réponse en moins de 48 heures."),
 "programa-afiliados/page.tsx": ("Programme Partenaires & Affiliation | HOJA ACADEMY",
   "Partagez les formations HOJA ACADEMY et percevez une commission sur chaque vente attribuée à votre lien."),
 "registration/page.tsx": ("Inscription | HOJA ACADEMY",
   "Créez votre accès au campus HOJA ACADEMY."),
 "reset-password/page.tsx": ("Mot de passe oublié | HOJA ACADEMY",
   "Demandez un nouveau mot de passe pour votre compte HOJA ACADEMY."),
 "accesibilidad/page.tsx": ("Accessibilité | HOJA ACADEMY",
   "Déclaration d'accessibilité du site hoja-academy.com."),
 "aviso-legal/page.tsx": ("Mentions légales | HOJA ACADEMY",
   "Informations légales relatives au site hoja-academy.com."),
 "politica-de-cookies/page.tsx": ("Politique des cookies | HOJA ACADEMY",
   "Gestion des cookies sur hoja-academy.com : types, finalités et configuration."),
 "politica-de-privacidad/page.tsx": ("Politique de confidentialité & conditions | HOJA ACADEMY",
   "Traitement des données personnelles, conditions générales, garanties et politiques de remboursement HOJA ACADEMY."),
}

done = []
only = None
import sys
if len(sys.argv) > 1:
    only = set(a.lower() for a in sys.argv[1:])
for rel, (title, desc) in M.items():
    if only and rel.lower() not in only:
        continue
    p = ROOT/rel
    t = p.read_text(encoding="utf-8")
    if re.search(r"export const metadata\b", t):
        continue
    block = (f"\nexport const metadata = {{\n"
             f"  title: {title!r},\n"
             f"  description: {desc!r},\n"
             f"}};\n")
    i = t.find("export default function Page()")
    assert i != -1, rel
    t = t[:i] + block.lstrip("\n") + t[i:]
    p.write_text(t, encoding="utf-8", newline="\n")
    done.append(rel)
print("metadata inserees:", len(done))
for d in done: print("  ", d)
