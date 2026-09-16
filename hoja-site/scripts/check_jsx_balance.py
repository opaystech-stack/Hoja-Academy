# -*- coding: utf-8 -*-
"""Verifie l'equilibre JSX div/section/span/main de chaque .tsx (comptage simple)."""
import re, pathlib, sys
ROOT = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/src/app")
SNAP = pathlib.Path(r"C:/LAPOSTE/Projets/clones/academiartificial/app/audits/snapshot_src/app")

def counts(t):
    out = {}
    for tag in ["div","section","main","span","p","a","ul","li","h1","h2","h3","h4","h5","h6","b","em","strong","form","label","button","article","aside","header","footer","svg","iframe","video","img"]:
        o = len(re.findall(r"<%s(?=[\s>/])" % tag, t)) - len(re.findall(r"<%s\s*/>" % tag, t))
        c = len(re.findall(r"</%s>" % tag, t))
        out[tag] = o - c
    return out

bad = []
for p in sorted(ROOT.rglob("*.tsx")):
    t = p.read_text(encoding="utf-8")
    d = counts(t)
    nz = {k:v for k,v in d.items() if v != 0}
    # img:0 attendu, mais les <img ... /> ont ete comptes self-closing -> ok
    # comparer avec le snapshot si existant
    sp = SNAP / str(p.relative_to(ROOT))
    base = counts(sp.read_text(encoding="utf-8")) if sp.exists() else {k:0 for k in d}
    diff = {k: d[k]-base.get(k,0) for k in d if d[k] != base.get(k,0)}
    if diff:
        bad.append((str(p.relative_to(ROOT)), nz, diff))
for f, nz, diff in bad:
    print(f"{f}\n   dsb={diff}   abs={nz}")
print("FICHIERS AVEC DESBILAN NOUVEAU:", len(bad))
sys.exit(0)
