"""Passe editoriale HOJA — remplacements localises (contenu template -> contenu Hoja reel).
Chaine exacte recherchee ; rapport OK/MANQUE ; pas de regex destructrice."""
import pathlib, re

APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
report = []

def edit(fname, pairs):
    p = APP / fname
    t = p.read_text(encoding="utf-8")
    o = t
    for a, b in pairs:
        if a not in t:
            report.append((fname, "MANQUE", a[:70]))
            continue
        n = t.count(a)
        t = t.replace(a, b)
        report.append((fname, "OK x%d" % n, a[:55] + " => " + b[:55]))
    if t != o:
        p.write_text(t, encoding="utf-8")

# ================= HOME =================
edit("page.tsx", [
    ('{"Ne subissez pas la révolution. "}', '{"L\'IA ne vaut que si vous l\'appliquez. "}'),
    ("Prenez les commandes.", "À votre travail. Dès la première séance."),
    ("FORMATION D'ÉLITE", "FORMATION PRATIQUE"),
    ('title: "\\n\\t\\t\\t\\t\\t\\t\\tUne académie ", title2: "d\'excellence\\t\\t\\t\\t\\t\\t"',
     'title: "\\n\\t\\t\\t\\t\\t\\t\\tUn suivi ", title2: "rapproché\\t\\t\\t\\t\\t\\t"'),
    ("Des promotions à taille humaine pour un apprentissage intensif accéléré, guidé par des praticiens du terrain.",
     "Vous travaillez sur vos propres dossiers, encadré par le formateur pendant les séances."),
    ("Apprenez par la pratique en direct : ateliers immersifs, coaching interactif et résolution de cas réels en séance.",
     "Chaque séance : un concept, une démonstration sur un cas réel, puis vous pratiquez sur votre propre contexte."),
    ("Séances en direct retransmises et enregistrées en HD, accessibles 24h/24 et 7j/7 pour progresser sans contrainte.",
     "Les séances live sont enregistrées et publiées en replay dans la classe : vous rattrapez sans prendre de retard."),
    ("Un cursus intensif de 8 semaines et 18 modules : apprendre, pratiquer, construire, automatiser, produire.",
     "8 semaines, 18 modules, une méthode : apprendre, pratiquer, construire, automatiser, produire."),
    ('title: "\\n\\t\\t\\t\\t\\t\\t\\tL\'avenir ", title2: "se crée maintenant\\t\\t\\t\\t\\t\\t"',
     'title: "\\n\\t\\t\\t\\t\\t\\t\\tCertification ", title2: "par la preuve\\t\\t\\t\\t\\t\\t"'),
    ("Certification HOJA ACADEMY par preuve de compétence et suivi post-formation : les sessions mensuelles AI Update.",
     "Vous soutenez votre système devant un jury, démonstration en direct à l'appui, et vous repartez avec votre AI Work Kit."),
    ('{"Passez à la vitesse supérieure. Dominez l\'IA à votre avantage. "}',
     '{"Ce que vous faites avec l\'IA compte plus que ce que vous savez en dire. "}'),
    ("Pratiquez sur des architectures réelles et apprenez à les intégrer concrètement dans vos métiers, vos workflows et vos entreprises.",
     "Vous reliez l'IA à vos outils réels : documents, tableaux, boîtes mail, process — pas à des exercices génériques."),
    ("Orienté vers des résultats concrets, loin des théories abstraites.",
     "Un livrable par semaine, appliqué à votre métier."),
    ('{"COMMENCEZ AUJOURD\'HUI. "}', '{"Ça commence par une tâche. "}'),
    ('{"DIRIGEZ DEMAIN. "}', '{"Ça se termine par un système qui tourne."}'),
    ("Ici, vous accédez à une méthode structurée et exigeante, directement connectée à vos défis métiers et stratégiques.",
     "Ici, vous suivez une méthode structurée, appliquée à vos situations de travail réelles."),
    ("Le monde accélère. Êtes-vous prêt ?", "Le travail change. Vous restez aux commandes."),
    ('{"MAÎTRISEZ LES TECHNOLOGIES QUI "}', '{"LES OUTILS DU MARCHÉ, "}'),
    ('{"ont déjà révolutionné le monde du travail. "}', '{"utilisés sur vos cas réels. "}'),
    (">L'avenir est entre vos mains<", ">On commence par votre travail réel<"),
    ("Comprendre l'intelligence artificielle n'est pas une question d'accumulation théorique, mais de clarté opérationnelle pour déployer les bons outils à ",
     "Comprendre l'IA ne suffit pas : il faut savoir la placer dans votre travail, au bon endroit, avec un contrôle humain. "),
])

# ================= NEWSLETTER MORTE =================
p = APP / "page.tsx"
t = p.read_text(encoding="utf-8")
i = t.find('id="sib-container"')
if i > 0:
    # on retire uniquement le bloc <div ...id="sib-container"> ... </div> (appariement de divs)
    d = 0
    k = t.rfind("<div", 0, i)
    end = k
    while end < len(t):
        if t.startswith("<div", end): d += 1
        elif t.startswith("</div>", end):
            d -= 1
            if d == 0:
                end += 6
                break
        end += 1
    if 0 < k and end > i and (end - k) < 8000 and "</form>" in t[k:end]:
        t = t[:k] + t[end:]
        p.write_text(t, encoding="utf-8")
        report.append(("page.tsx", "COUPE newsletter morte", str(end - k) + " o"))
    else:
        report.append(("page.tsx", "SKIP newsletter (garde)", str(end - k if k else -1)))
else:
    report.append(("page.tsx", "pas de sib-container", ""))

# ================= ACTUALITES =================
edit("actualites/page.tsx", [
    ("Sélection d'actualités sur les outils, modèles et fonctionnalités de l'IA générative en pratique.",
     "Nous publions ici les annonces, articles et dépôts que nous suivons pour la cohorte — sélection manuelle, en lien avec le programme."),
    ("Bientôt ici : les liens vers les annonces, articles, dépôts et vidéos que nous suivons.",
     "Rien n'est publié pour l'instant : la veille démarre avec la première cohorte."),
    ("Filtrage éditorial pour éviter le clickbait, les rumeurs et les actualités corporatives sans intérêt concret.",
     "Nous écartons le clickbait et les annonces sans intérêt pratique pour votre travail."),
    ("Nouveautés pratiques sur l'IA générative, l'automatisation, la créativité, la productivité et les agents.",
     "Uniquement ce qui change quelque chose en pratique : outils, modèles, fonctionnalités utiles."),
])
p = APP / "actualites/page.tsx"
t = p.read_text(encoding="utf-8")
m = re.search(r'<a[^>]*sibforms\.com[^>]*>\s*\n?\s*(?:\{")?[^<]*S\'inscrire[^<]*(?:")?\s*</a>', t)
if m:
    t = t[:m.start()] + '<a href="/contact">Nous écrire</a>' + t[m.end():]
    p.write_text(t, encoding="utf-8")
    report.append(("actualites", "bouton sibforms -> /contact", ""))
else:
    report.append(("actualites", "pattern sib absent (a verif manuelle)", ""))

# ================= CONTACT =================
edit("contact/page.tsx", [
    ("Nous sommes là pour vous aider", "Réponse directe"),
])

# ================= POSTULER =================
edit("postuler/page.tsx", [
    ("Hoja Network — la maison mère", "Hoja Network — l'organisation dont est issue Hoja Academy"),
])

# ================= ENTREPRISES =================
edit("entreprises/page.tsx", [
    ("Automatisation des tâches, analyse et productivité quotidienne de vos équipes, avec un usage gouverné.",
     "Vos équipes apprennent à déléguer à l'IA les tâches répétitives, avec un usage contrôlé et vérifié."),
    ("Intégrez l'IA de Google à vos workflows documentaires et fiabilisez la prise de décision.",
     "L'écosystème Google (Gemini, Workspace, NotebookLM) appliqué à vos documents et à vos décisions."),
    ("Connectez vos outils et éliminez les tâches répétitives sans développement lourd.",
     "Relier vos outils entre eux et supprimer les répétitions manuelles, sans gros développement."),
])

for r in report:
    print(r)
