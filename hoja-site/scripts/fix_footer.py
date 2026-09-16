import pathlib, re
APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
p = APP/"sections/footer.tsx"; t = p.read_text(encoding="utf-8")
n = 0
def rep(a, b):
    global t, n
    assert a in t, "manque: " + a[:60]
    t = t.replace(a, b); n += 1

# 1) le dropdown Formations mort du footer -> liens Formations directs, toujours visibles
i = t.find('<li className="flex relative">\n                      <a className="flex relative mx-[17.5px]')
j = t.find("</li>", t.find("</ul>", i)) + len("</li>")
assert 0 < i < j and "menu-1-516d334" in t and "role=\"group\"" in t[i:j]
new_rows = (
'''<li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/expert-ia">Expert IA</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/automatisation-n8n">Automatisation &amp; n8n</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/robotique">Robotique</a>
                    </li>
                    <li className="flex relative">
                      <a className="flex relative mx-[17.5px] py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:mx-[0.5625rem] max-md:text-[0.8125rem] 2xl:mx-[21.5px] 2xl:text-[0.9375rem] hover:underline" href="/formations/ia-recherche-sciences">IA, Recherche &amp; Sciences</a>
                    </li>'''
)
t = t[:i] + new_rows + t[j:]
n += 1

# 2) selecteur EN/FR mort (href="#") -> retire
k = t.find('<div className="block" id="gt-wrapper-68137678">')
if k > 0:
    end = t.find("</div>", t.find("FR", k)) # le wrapper ferme apres le dernier </a>
    # find matching closing of gt-wrapper div: next 3 </div>
    seg_end = t.find("}", t.find("</a>", t.find("FR", k)))
    # plus sur: retirer jusqu'a la fermeture du <div ...gt-wrapper> inclusive
    d = 0; x = k
    while x < len(t):
        if t.startswith("<div", x): d += 1
        elif t.startswith("</div>", x):
            d -= 1
            if d == 0: x += 6; break
        x += 1
    t = t[:k].rstrip() + "\n                    " + t[x:]
    n += 1

# 3) description marketing vague -> texte Hoja reel (couleur forcee blanc)
rep('{" est une académie en ligne qui propose des formations personnalisées en intelligence artificielle, dispensées en temps réel. L\'académie s\'engage à offrir une expérience éducative de haut niveau pour garantir à chaque apprenant les meilleurs résultats en un minimum de temps."}',
    '{", branche académique de Hoja Network, forme professionnels, entreprises et chercheurs à utiliser l\'IA concrètement : séances en direct, cas réels, automatisations et un système de travail à construire."}')
rep('text-color-003 text-sm font-light leading-[1.1875rem] text-end', 'text-background text-sm font-light leading-[1.1875rem] text-end')
rep('text-color-003 text-base font-light leading-[1.1875rem] text-end', 'text-background text-base font-light leading-[1.1875rem] text-end')
rep('<p className="block text-clr-10 text-[0.875rem]">', '<p className="block text-background text-[0.875rem]">')
rep('<h3 className="block mt-2 mb-1.5 text-clr-9', '<h3 className="block mt-2 mb-1.5 text-background')
# lien WhatsApp/Email column parents: add text-background on wrapper ul
rep('<ul className="flex -mx-3 flex-wrap justify-start [list-style-type:none] list-outside">',
    '<ul className="flex -mx-3 flex-wrap justify-start text-background [list-style-type:none] list-outside">')
# logo footer + LEARN AI + copyright: deja text-background; heritage global:
rep('<footer className="min-h-123.5 flex relative', '<footer className="min-h-123.5 text-background flex relative')
# Postuler CTA footer: text-color-001 sur bg-primary = OK (noir sur vert) -> garder
p.write_text(t, encoding="utf-8")
print("footer edits:", n)
# list-row6 (WhatsApp/Email/Hoja Network) herite text-background via ul -> ok
# list-row5 (Entreprises/Contact) deja text-background
