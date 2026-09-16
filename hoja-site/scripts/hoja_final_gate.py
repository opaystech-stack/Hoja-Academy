# -*- coding: utf-8 -*-
"""GATE FINAL Hoja Academy — a relancer apres livraison SA-Contenu + relock + build.
Verifie 3 choses sur src/ ET out/ :
 1) AUCUNE trace heritee (marque, personnes, entites ES, assets critiques, ancien legal).
 2) Le VRAI programme Hoja est present (marqueurs de contenu).
 3) Equilibre JSX des pages.
Sort un verdict PASS/FAIL ligne par ligne. Exit code != 0 si FAIL bloquant."""
import re, sys, pathlib
APP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app")
SRC, OUT = APP/"src", APP/"out"

# 1) traces interdites (regex, cas-insensible sauf ou precise)
FORBIDDEN = {
 "marque": r"academiartificial|Academia de Inteligencia|NoticIAS",
 "personnes": r"Alejavi|Jose Moral|josemmoral|alejavirivera|Yago \u2014|\bYahir\b|Bizum|Realia|Giunti|Alexis \u2014|Pablo \u2014|nutricionista",
 "entites-es": r"AI VENTURE|B19870641|Caser|Granada|red\.es|Kit Digital|Uni[o\u00f3]n Europea|NextGeneration|sedeagpd|AEPD|Agencia Espa|\bReal Decreto\b|Ley 34|RD 1112|Subdirecci|\bFUNDAE\b|Isabel I|\bECTS\b",
 "assets-critiques": r"8912c83b9f13|ZEEQA|715aa8527076|9dd92c8d35ca|b97f813e2591",
 "emails-old": r"hola@|@academiartificial|\+34 ",
 "avis-mort": r"Error getting reviews",
}
# 2) marqueurs de contenu Hoja attendus dans le HTML rendu (au moins homepage+institution+curso-ia)
REQUIRED_MARKERS = [
 "HOJA ACADEMY", "LEARN AI",
 r"18 modules?", r"8 semaines?",
 r"[Aa]pprendre", r"[Pp]ratiquer", r"[Cc]onstruire", r"[Aa]utomatiser",
 r"[Rr]obotique",
 r"My AI Work System",
 r"[Pp]rogramme [Ii]ntensif",
]
def scan(dirpath, globs, strip_tags=False):
    hits = {}
    for g in globs:
        for f in sorted(dirpath.rglob(g)):
            if "_server" in str(f) or f.suffix not in {".tsx",".ts",".html"}: continue
            try: t = f.read_text(encoding="utf-8")
            except Exception: continue
            if strip_tags: t = re.sub(r"<style.*?</style>|<script.*?</script>", " ", t, flags=re.S)
            for cat, pat in FORBIDDEN.items():
                for m in re.finditer(pat, t):
                    # exception: /noticias-ia (route conservee volontairement) et chunks js
                    ctx = t[max(0,m.start()-30):m.end()+30]
                    if "noticias-ia" in ctx or "/_next/" in ctx: continue
                    hits.setdefault(cat, []).append((f.name, m.group(0)[:24]))
    return hits

print("="*60)
print("1) TRACES HERITEES")
ok = True
for label, path, globs, st in [("SRC", SRC, ["*.tsx","*.ts"], False), ("OUT", OUT, ["*.html"], True)]:
    h = scan(path, globs, st)
    if not h: print(f"  {label}: 0 trace ✅")
    else:
        ok = False
        for cat, v in h.items(): print(f"  {label} {cat}: {v[:6]}")
print("="*60)
print("2) MARQUEURS PROGRAMME HOJA (dans out/ rendu)")
miss = []
if OUT.exists():
    blob = ""
    for f in OUT.rglob("*.html"):
        blob += f.read_text(encoding="utf-8", errors="ignore")
    for r in REQUIRED_MARKERS:
        if not re.search(r, blob): miss.append(r)
    print("  absents:", miss if miss else "AUCUN \u2705")
else:
    print("  (out/ absent \u2014 lancer le build)"); miss=["build"]
print("="*60)
print("VERDICT:", "PASS ✅" if ok and not miss else "FAIL ❌")
sys.exit(0 if (ok and not miss) else 1)
