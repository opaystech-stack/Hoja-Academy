"""Remplace les heroes plats des pages formations/postuler par <PageHero> (design system)."""
import pathlib, re

APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
PAGES = {
    "formations/page.tsx": {
        "eyebrow": "FORMATION EN LIGNE", "eyebrowRest": " en Intelligence Artificielle",
        "title": "Nos domaines de", "title2": "formation.",
        "lead": "Quatre domaines pour un même objectif : utiliser l'IA pour travailler, automatiser, rechercher, créer et résoudre de vrais problèmes.",
        "ctaLabel": "Découvrir Expert IA", "ctaHref": "/formations/expert-ia",
        "kicker": "Hoja Academy — branche académique IA de Hoja Network", "kickerLine": "Programme pratique, cas réels, production.",
    },
    "formations/expert-ia/page.tsx": {
        "eyebrow": "FORMATION — EXPERT IA", "eyebrowRest": "",
        "title": "Maîtriser l'IA pour", "title2": "transformer son travail.",
        "lead": "Un parcours intensif et pratique pour passer de la découverte de l'IA générative à la construction de votre propre système de travail augmenté : agents, workflows, automatisation et contrôle humain.",
        "ctaLabel": "Postuler", "ctaHref": "/postuler",
        "kicker": "8 semaines · 18 modules · 16 séances live", "kickerLine": "Prochaine cohorte : à définir · Tarif : à définir.",
    },
    "formations/automatisation-n8n/page.tsx": {
        "eyebrow": "FORMATION — AUTOMATISATION", "eyebrowRest": " & n8n",
        "title": "D'une tâche répétitive", "title2": "à un système qui travaille pour vous.",
        "lead": "Automatisation des processus professionnels avec n8n : workflows, APIs, intégrations, déclencheurs, traitement de données et agents au service de vos opérations.",
        "ctaLabel": "Postuler", "ctaHref": "/postuler",
        "kicker": "Workflows, APIs, agents", "kickerLine": "Prochaine session : à définir · Tarif : à définir.",
    },
    "formations/robotique/page.tsx": {
        "eyebrow": "FORMATION — ROBOTIQUE", "eyebrowRest": "",
        "title": "Comprendre et utiliser", "title2": "la robotique et l'IA embarquée.",
        "lead": "Une orientation descriptive et appliquée : robotique, IA embarquée, perception, automatisation physique et interaction humain-machine, pour étudiants, ingénieurs et chercheurs.",
        "ctaLabel": "Postuler", "ctaHref": "/postuler",
        "kicker": "Applications professionnelles et scientifiques", "kickerLine": "Prochaine session : à définir · Tarif : à définir.",
    },
    "formations/ia-recherche-sciences/page.tsx": {
        "eyebrow": "FORMATION — IA, RECHERCHE & SCIENCES", "eyebrowRest": "",
        "title": "L'IA au service de la", "title2": "rigueur scientifique.",
        "lead": "Recherche assistée par IA : analyse documentaire, synthèse de sources, analyse de données, vérification et reproductibilité — l'IA assiste, elle ne remplace jamais le chercheur.",
        "ctaLabel": "Postuler", "ctaHref": "/postuler",
        "kicker": "Chercheurs, laboratoires, médecins, institutions", "kickerLine": "Prochaine session : à définir · Tarif : à définir.",
    },
    "postuler/page.tsx": {
        "eyebrow": "HOJA ACADEMY", "eyebrowRest": " — CANDIDATURE",
        "title": "Postuler à", "title2": "Hoja Academy.",
        "lead": "Chaque candidature ouvre un échange avec l'équipe pédagogique. C'est avec vous que nous décidons si une formation correspond à votre projet.",
        "ctaLabel": "Formulaire de candidature", "ctaHref": "#formulaire-candidature",
        "kicker": "Expert IA · Automatisation & n8n · Robotique · IA, Recherche & Sciences", "kickerLine": "Prochaine cohorte : date à définir.",
    },
}

def hero_markup(c):
    return ('<PageHero\n        eyebrow="' + c["eyebrow"] + '"\n        eyebrowRest="' + c["eyebrowRest"] + '"\n        title="' + c["title"] + '"\n        title2="' + c["title2"] + '"\n        lead="' + c["lead"] + '"\n        ctaLabel="' + c["ctaLabel"] + '"\n        ctaHref="' + c["ctaHref"] + '"\n        kicker="' + c["kicker"] + '"\n        kickerLine="' + c["kickerLine"] + '"\n      />')

for rel, cfg in PAGES.items():
    p = APP / rel
    t = p.read_text(encoding="utf-8")
    # 1) premiere <section className="bg-color-001 ..."> (le hero) -> PageHero
    hs = t.find('<section className="bg-color-001')
    assert hs != -1, rel + " hero introuvable"
    # fin = </section> apparie (les sections internes imbriquees div pas section)
    he = t.find("</section>", hs) + len("</section>")
    t = t[:hs] + hero_markup(cfg) + t[he:]
    # 2) main pt-32 -> sans padding (hero remonte sous header)
    t = t.replace('className="block pt-32 max-md:pt-20 [font-family:Montserrat,_sans-serif]"', 'className="block [font-family:Montserrat,_sans-serif]"')
    t = t.replace('className="block pt-32 max-md:pt-20"', 'className="block"')
    # 3) import PageHero
    imp = 'import PageHero from "' + "../" * (rel.count("/") + 1) + 'sections/page-hero";\n'
    if "page-hero" not in t:
        anchor = t.find('import Footer')
        t = t[:anchor] + imp + t[anchor:]
    p.write_text(t, encoding="utf-8")
    print("PageHero wires:", rel)
print("done")
