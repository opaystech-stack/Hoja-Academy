# -*- coding: utf-8 -*-
"""Trouve les <div jamais fermes dans un fichier .tsx via parseur a pile (approximation regex, en ignorant commentaires et strings? non: le JSX imbre les {} strings — on compte les balises brutes en sequence)."""
import re, sys, pathlib

f = pathlib.Path(sys.argv[1])
t = f.read_text(encoding="utf-8")
TOKEN = re.compile(r"<(/?)div\b[^>]*?(/?)>|\{[^{}]*\}")
stack = []
pos_line = lambda i: t[:i].count("\n") + 1
for m in TOKEN.finditer(t):
    if m.group(0).startswith("{"):
        continue
    closing, selfclose = m.group(1), m.group(2)
    if selfclose:
        continue
    if closing:
        if stack: stack.pop()
    else:
        stack.append(m.start())
print(f, "divs jamais fermes:", len(stack))
for p in stack:
    ln = pos_line(p)
    ctx = " ".join(t[p:p+90].split())
    print(f"  ligne {ln}: {ctx[:88]}")
