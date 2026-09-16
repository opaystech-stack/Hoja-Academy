"""Aligne les menus inline des pages clonees sur la structure cible :
   ul desktop : [Formations(dropdown)] + map[Entreprises, Actualités, Contact]
   ul mobile  :idem ; dropdown data = 4 domaines ; supprime li 'Actualités' tete (doublon)."""
import pathlib, re

APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
FOUR = '''    { href: "/formations/expert-ia", label: "Expert IA" },
    { href: "/formations/automatisation-n8n", label: "Automatisation & n8n" },
    { href: "/formations/robotique", label: "Robotique" },
    { href: "/formations/ia-recherche-sciences", label: "IA, Recherche & Sciences" }'''
SEC = '''    { href: "/entreprises", label: "Entreprises" },
    { href: "/actualites", label: "Actualités" },
    { href: "/contact", label: "Contact" }'''

PAGES = ["page.tsx", "entreprises/page.tsx", "contact/page.tsx", "actualites/page.tsx",
         "formations/programme-intensif/page.tsx", "mentions-legales/page.tsx",
         "confidentialite/page.tsx", "cookies/page.tsx", "accessibilite/page.tsx"]

for page in PAGES:
    p = APP / page
    t = p.read_text(encoding="utf-8")
    o = t
    # 1) tableaux data dropdown (ListRow_data / listRowData variantes) et secondaires
    t = re.sub(r'(const ListRow_data\b[^=]*=\s*)\[[^\]]*\];', lambda m: m.group(1) + '[\n' + FOUR + '\n];', t)
    t = re.sub(r'(const listRowData\b[^=]*=\s*)\[[^\]]*\];', lambda m: m.group(1) + '[\n' + FOUR + '\n];', t)
    t = re.sub(r'(const ListRow_data2\b[^=]*=\s*)\[[^\]]*\];', lambda m: m.group(1) + '[\n' + FOUR + '\n];', t)
    for name in ["ListRow2_data", "ListRow3_data", "ListRow4_data", "listRow2Data", "listRow3Data", "listRow4Data"]:
        t = re.sub(r'(const ' + name + r'\b[^=]*=\s*)\[[^\]]*\];', lambda m: m.group(1) + '[\n' + SEC + '\n];', t)
    # 2) li "Actualités" en tete des ul desktop/mobile (avant le dropdown Formations) a retirer
    def drop_first_actus(src):
        out = src
        while True:
            m = re.search(r'<li\b[^>]*>(?:(?!</li>).)*?href="(/actualites|/actualites/|/noticias-ia|/noticias-ia/)"(?:(?!</li>).)*?>\s*(?:\{")?\s*Actualités', out, re.S)
            if not m:
                break
            li = m.start()
            endli = out.find('</li>', m.end())
            if endli == -1: break
            # ne retirer que si c'est AVANT l'ancre Formations du meme ul (tete de menu)
            if out.find('aria-haspopup', li, li + 20000) != -1 and out.find('aria-haspopup', li, endli) == -1:
                out = out[:li] + out[endli + 5:]
            else:
                break
        return out
    t = drop_first_actus(t)
    # 3) CTA Postuler inline -> /postuler (les pages clonees pointaient /contacto->/contact)
    #    on cible les spans 'Postuler' dont l'ancre parente est /contact
    for mm in reversed(list(re.finditer(r'>\s*Postuler\s*<', t))):
        k = t.rfind('href="/contact"', max(0, mm.start() - 2200), mm.start())
        if k != -1 and '</a>' not in t[k:mm.start()]:
            t = t[:k] + 'href="/postuler"' + t[k + len('href="/contact"'):]
    # 4) liens menu drop : '/formations/' -> '/formations' etc. (doublons slash)
    t = re.sub(r'href="(/[a-z0-9\-/_]+?)/"', r'href="\1"', t)
    if t != o:
        p.write_text(t, encoding="utf-8")
        print("maj:", page)
    else:
        print("inch:", page)
