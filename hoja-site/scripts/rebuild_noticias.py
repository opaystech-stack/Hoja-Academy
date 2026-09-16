# -*- coding: utf-8 -*-
"""Reconstruit noticias-ia/page.tsx : plus d'articles internes, une liste de liens URL editables."""
from pathlib import Path

SRC = Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app/noticias-ia/page.tsx")
lines = SRC.read_text(encoding="utf-8").split("\n")  # lignes[0] = ligne 1

def seg(a, b):  # inclusif, numerotation 1-based
    return lines[a-1:b]

# ---- 1. imports : drop FeatureCard*, garder le reste
imports = seg(1, 6) + seg(10, 13)

# ---- 2. tableau editable ACTUALITES
actualites_block = '''
// ============================================================
// ACTUALITES — liste de liens externes, a mettre a jour ici.
// Chaque entree : date (affichage), source (badge), title, url, description.
// Exemples : annonce/X d'un labo, article de blog, depot GitHub, video...
// Laisser le tableau vide [] pour afficher l'etat vide.
// ============================================================
const ACTUALITES: { date: string; source: string; title: string; url: string; description: string }[] = [
    // {
    //     date: "8 septembre 2026",
    //     source: "OpenAI",
    //     title: "Lancement de GPT-6 Astra dans ChatGPT et l'API",
    //     url: "https://openai.com/index/...",
    //     description: "Raisonnement, programmation et usage de l'ordinateur en nette progresse.",
    // },
];'''

# ---- 3. data arrays nav (ListRow*)
arrays = seg(14, 32) + seg(104, 154)  # ListRow_data..ListRow4_data, data2, 5-8, meta 134-154

# ---- 4. metas restants (sans FeatureCard*) : 226-256
metas = seg(226, 256)

# ---- 5. styles restants (sans FeatureCard*) : 257-277 et 343-368
styles = seg(257, 277) + seg(343, 368)

# ---- 6. Page(): header + hero jusqu'au </main> interne : 369-650
head_main = seg(369, 650)

# ---- 7. NOUVELLE section liens (remplace les zones 24h/72h/edition/archives)
news_section = '''        <section className="block pb-16 px-[3.2rem] text-color-002 [font-family:Inter,_ui-sans-serif,_system-ui,_-apple-system,_BlinkMacSystemFont,_'Segoe_UI',_sans-serif] bg-color-023 max-md:px-5 md:max-lg:px-[30.7px] 2xl:px-16">
          <div className="block max-w-295 mx-auto">
            <div className="block mb-8.5 max-md:mb-6">
              <p className="block mb-4.5 text-color-004 text-[0.8125rem] font-extrabold tracking-[1.82px] uppercase">
                S\u00e9lection du moment
              </p>
              <h2 className="block text-background [font-family:Montserrat,_sans-serif] text-[3.625rem] leading-[3.625rem] max-md:text-[1.625rem] max-md:leading-[1.8125rem] md:max-lg:text-[2.1875rem] md:max-lg:leading-[2.1875rem] 2xl:text-[3.875rem] 2xl:leading-15.5">
                Derni\u00e8res actualit\u00e9s
              </h2>
            </div>
            {ACTUALITES.length === 0 ? (
              <p className="block text-color-008 text-[1.0625rem] leading-[1.6875rem]">
                Bientot ici : les liens vers les annonces, articles, depots et videos que nous suivons.
              </p>
            ) : (
              <ul className="grid gap-4 grid-cols-1 [list-style-type:none] list-outside">
                {ACTUALITES.map((a, i) => (
                  <li key={i} className="border border-solid border-surface block p-6 rounded-[20px] bg-surface-8 max-md:px-4">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="inline-block py-1 px-3 rounded-[999px] text-color-004 text-[0.75rem] font-extrabold tracking-[1.2px] uppercase">
                        {a.source}
                      </span>
                      <span className="text-color-008 text-[0.875rem]">{a.date}</span>
                    </div>
                    <a className="block text-background [font-family:Montserrat,_sans-serif] text-[1.4375rem] font-medium leading-[1.875rem] hover:text-primary max-md:text-[1.125rem]" href={a.url} target="_blank" rel="noopener noreferrer">
                      {a.title}
                    </a>
                    <p className="block mt-2 text-color-036 text-[0.9375rem] leading-[1.4375rem]">
                      {a.description}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
'''

# ---- 8. newsletter 678-695 + fermeture main externe (ligne 766) + footer jusqu'a la fin
newsletter = seg(678, 695)
closing = [lines[765]] + ["      {\" \"}"] + seg(768, 1013)

out = "\n".join(imports) + "\n" + actualites_block + "\n\n" + "\n".join(arrays) + "\n" + "\n".join(metas) + "\n" + "\n".join(styles) + "\n\n" + "\n".join(head_main) + "\n" + news_section + "\n".join(newsletter) + "\n" + "\n".join(closing)

# le dernier </main> interne etait ferme a 650 ; la section liens est placee juste apres -> ok.
SRC.write_text(out, encoding="utf-8", newline="\n")
print("nouveau fichier:", len(out.splitlines()), "lignes,", len(out), "octets")
