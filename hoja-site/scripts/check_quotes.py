# -*- coding: utf-8 -*-
"""Detecte les lignes avec guillemets doubles non echappes en nombre impair."""
import sys, pathlib, re

target = sys.argv[1] if len(sys.argv) > 1 else "src/app/politica-de-cookies/page.tsx"
lines = pathlib.Path(target).read_text(encoding="utf-8").split("\n")
for i, l in enumerate(lines, 1):
    q = len(re.findall(r'(?<!\\)"', l))
    if q % 2 == 1:
        print(f"IMPAIR {i}: {l[:160]!r}")
