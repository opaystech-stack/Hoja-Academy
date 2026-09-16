#!/usr/bin/env python3
"""HOJA ACADEMY image audit (read-only on assets; writes only into audits/).

TASK 1: inventory of referenced assets -> audits/images.csv
TASK 2: orphans -> audits/images_orphans.txt
TASK 3: risk flags (legacy ES alts, logo usage, video-testimonial thumbnails,
        screenshots, real-person/student photos) -> audits/images.csv + image_stats.json
"""
import csv
import json
import os
import re
from collections import defaultdict

ROOT = r"C:/LAPOSTE/Projets/clones/academiartificial/app"
SRC = os.path.join(ROOT, "src")
IMG_DIR = os.path.join(ROOT, "public/assets/cloned/images")
SVG_DIR = os.path.join(ROOT, "public/assets/cloned/svg")
AUDITS = os.path.join(ROOT, "audits")
os.makedirs(AUDITS, exist_ok=True)

# ---------- source files ----------
contents = {}
for dirpath, dirnames, filenames in os.walk(SRC):
    dirnames[:] = [d for d in dirnames if d not in ("node_modules", ".next")]
    for fn in filenames:
        if fn.endswith((".tsx", ".ts", ".css")):
            p = os.path.join(dirpath, fn)
            try:
                contents[p] = open(p, encoding="utf-8", errors="replace").read()
            except OSError:
                pass

# ---------- asset universe ----------
assets = {}
for fn in os.listdir(IMG_DIR):
    assets["images/" + fn] = os.path.join(IMG_DIR, fn)
for fn in os.listdir(SVG_DIR):
    assets["svg/" + fn] = os.path.join(SVG_DIR, fn)

ASSET_RE = r"/assets/cloned/(images|svg)/([A-Za-z0-9._\-]+?\.(?:png|webp|jpg|jpeg|gif|svg|avif))"
ref_pat = re.compile(ASSET_RE)
refs = defaultdict(list)  # rel -> [(file, lineno, line)]
for f, txt in contents.items():
    for m in ref_pat.finditer(txt):
        rel = m.group(1) + "/" + m.group(2)
        lineno = txt.count("\n", 0, m.start()) + 1
        refs[rel].append((f, lineno, txt.splitlines()[lineno - 1].strip()))

# ---------- per-asset attribute + context extraction ----------
ATTR_PAT = re.compile(r'(alt|title|aria-label)\s*=\s*(?:"([^"]{1,200})"|\{"([^"]{1,200})"\}|\{`([^`]{1,200})`\}|\{([A-Za-z_][\w.]*)\})')

def attrs_for_asset(rel):
    """alt/title/aria-label found on the tag(s) that consume this asset,
    plus srcSet sibling assets and JSX label fields nearby."""
    base = rel.rsplit("/", 1)[1]
    out_attrs, out_srcset, out_labels = [], [], []
    for f, txt in contents.items():
        lines = txt.splitlines()
        for i, l in enumerate(lines):
            if base not in l:
                continue
            window = "\n".join(lines[max(0, i - 6): i + 4])
            # attrs on this window only if the attr is on a tag mentioning the asset
            for m in ATTR_PAT.finditer(window):
                val = m.group(2) or m.group(3) or m.group(4) or ("{" + (m.group(5) or "") + "}")
                if val.strip():
                    out_attrs.append(f"{m.group(1)}={val.strip()}")
            for sm in re.finditer(r"srcSet[^\"']*?\"([^\"]+)\"", window):
                for _, b in re.findall(ASSET_RE, sm.group(1)):
                    out_srcset.append(b)
            for lm in re.finditer(r'(label|title|title2|siteName|name)\s*[:=]\s*"([^"]{2,80})"', window):
                out_labels.append(f"{lm.group(1)}={lm.group(2)}")
    def dedupe(lst):
        seen, o = set(), []
        for x in lst:
            if x.lower()[:90] not in seen:
                seen.add(x.lower()[:90]); o.append(x)
        return o
    return dedupe(out_attrs)[:8], dedupe(out_srcset), dedupe(out_labels)[:4]

# ---------- risk rules ----------
ES_ALT = re.compile(r'\b(Imagen|Alumnos?|Escuela|Academia|Curso|Formaci[oó]n|Captura|pantallazo|profesor[ao]?|Clase|Edici[oó]n|Equipo|Retrato|Foto|Testimonio|Estudiante|Presentaci[oó]n|Taller|Conferencia|Campa[ñn]a)\b', re.I)
PERSON_ALT = re.compile(r'(Imagen de|Photo de|Portrait de|avatar)', re.I)
EDITION_ALT = re.compile(r'(premi[eè]re|deuxi[eè]me|troisi[eè]me|quatri[eè]me|cinqui[eè]me|sixi[eè]me|premi|primera|segunda|edici[oó]n|édition)', re.I)
STUDENT_WORDS = re.compile(r'(apprenant|[eé]tudiant|alumno|student|promotion|cohort)', re.I)
CAPTURE_ALT = re.compile(r'(Captura|pantallazo|screenshot)', re.I)
BRAND_WORDS = re.compile(r'(HOJA|Academy|logo|brand)', re.I)
# --- priority identity-risk keywords (orchestrator directive 2026-09-08) ---
REAL_PERSON_KEYWORDS = re.compile(r'(Yago|Yahir|Alumnos|edici[oó]n|[eé]dition|Imagen de|Captura|apprenant|temoin|t[eé]moign)', re.I)
TECH_ICON_OK = re.compile(r'(ChatGPT|Gemini|Make|OpenAI|Claude|Perplexity|N8N|Zapier|Expert en)', re.I)
INST_KEYWORDS = re.compile(r'(FUNDAE|Fundae|Certificat|certifica|Agente|Uni[oó]n Red|Kit|Union)', re.I)
# Logo lockups visually VERIFIED via vision review as already the new HOJA ACADEMY
# "LEARN AI" logo (fa64729e9a88.png + ca7c98260b3d.png and their srcSet width
# variants 177827e265b2/3a97aacea952/40c7c81b1b80/acc45f66e07e). NOT old brand.
LOGO_VERIFIED_NUEVO = {
    "images/fa64729e9a88.png", "images/ca7c98260b3d.png",
    "images/177827e265b2.png", "images/3a97aacea952.png",
    "images/40c7c81b1b80.png", "images/acc45f66e07e.png",
}

# logo detection: any asset consumed inside a tag block anchored on href="/" (navbar/footer)
logo_files = {}
for f, txt in contents.items():
    for m in re.finditer(r'<a\b[^>]*href="[^"]*"[^>]*>(.{0,1200}?)</a>', txt, re.S):
        tag_open, inner = m.group(0)[:m.start(1) - m.start(0)], m.group(1)
        href = re.search(r'href="([^"]*)"', tag_open)
        if not href or href.group(1) not in ("/", "/index", ""):
            continue
        if not re.search(r'<img\b', inner):
            continue
        for kind, b in re.findall(ASSET_RE, inner):
            logo_files.setdefault(kind + "/" + b, os.path.relpath(f, SRC))

bitmaps_used = sorted(
    rel for rel in refs
    if rel.rsplit(".", 1)[1].lower() in ("png", "webp", "jpg", "jpeg", "gif", "avif")
)

# srcSet sibling map: variant -> main src
variant_of = defaultdict(set)
for rel in bitmaps_used:
    _, ss, _ = attrs_for_asset(rel)
    for s in ss:
        variant_of["images/" + s].add(rel)

rows = []
risk_index = defaultdict(list)
for rel in sorted(refs):
    fpath = assets.get(rel)
    size = os.path.getsize(fpath) if fpath and os.path.isfile(fpath) else -1
    ext = rel.rsplit(".", 1)[1].lower()
    typ = "svg" if ext == "svg" else ("gif" if ext == "gif" else "bitmap")
    attrs, srcset, labels = attrs_for_asset(rel)
    alt_texts = [a.split("=", 1)[1] for a in attrs if a.startswith(("alt=", "title=", "aria-label="))]
    joined_files = sorted({os.path.relpath(f, SRC) for f, _, _ in refs[rel]})

    risks = []
    if any(ES_ALT.search(t) for t in alt_texts):
        risks.append("ALT_ES_HERITE")
    if rel in logo_files:
        risks.append("USAGE_LOGO_ANCIEN")
    for s in variant_of.get(rel, []):
        if s in logo_files:
            risks.append("VARIANTE_SRCSET_LOGO")
            break
    if any(PERSON_ALT.search(t) or (STUDENT_WORDS.search(t) and EDITION_ALT.search(t)) for t in alt_texts):
        risks.append("PHOTO_PERSONNE_REELLE")
    if any(CAPTURE_ALT.search(t) for t in alt_texts):
        risks.append("CAPTURE_INTERFACE")
    # video testimonial thumbnail: asset near a play button / video aria-label
    for f, _, _ in refs[rel]:
        idx = contents[f].find("images/" + rel.split("/")[1])
        win = contents[f][max(0, idx - 600): idx + 600]
        if re.search(r"(Lire la vid[ée]o|watch video|play.?button|btn.?play|youtu\.?be)", win, re.I) and 'data-component="button"' in win:
            risks.append("Miniature_temoignage_video")
            break
    risks = sorted(set(risks))
    # ---------- classification CRITIQUE / A-CHECK / NEUTRE ----------
    blob = " | ".join(alt_texts + labels)
    if rel in LOGO_VERIFIED_NUEVO:
        risks = [r for r in risks if r not in ("USAGE_LOGO_ANCIEN", "VARIANTE_SRCSET_LOGO")]
        risks.append("LOGO_VERIFIE_NOUVEAU")
    cls = "NEUTRE"
    if ({"PHOTO_PERSONNE_REELLE", "Miniature_temoignage_video", "CAPTURE_INTERFACE"} & set(risks)) \
            or re.search(r"\b(Yago|Yahir)\b", blob):
        cls = "CRITIQUE"   # photos de personnes reelles / miniatures video / captures outil herite
    elif "ALT_ES_HERITE" in risks or "USAGE_LOGO_ANCIEN" in risks \
            or "VARIANTE_SRCSET_LOGO" in risks or INST_KEYWORDS.search(blob):
        cls = "A-CHECK"    # logos institutionnels (FUNDAE/certificats) ou alt herites
    elif TECH_ICON_OK.search(blob):
        cls = "NEUTRE"     # icones marques tech = a garder
    for r in risks:
        risk_index[r].append(rel)
    risk_index["CLASS_" + cls].append(rel)
    rows.append([rel, typ, size, len(refs[rel]), "; ".join(joined_files[:5]),
                 " | ".join((attrs + labels)[:10]), f"{cls}|{','.join(risks) if risks else '-'}"])

csv_path = os.path.join(AUDITS, "images.csv")
with open(csv_path, "w", newline="", encoding="utf-8") as fh:
    w = csv.writer(fh)
    w.writerow(["asset", "type", "taille_octets", "refs", "pages_usages", "alt_contextes", "risque_nouveau"])
    w.writerows(rows)

# ---------- orphans ----------
orphans = sorted(rel for rel in assets if rel not in refs)
with open(os.path.join(AUDITS, "images_orphans.txt"), "w", encoding="utf-8") as fh:
    fh.write("# %d assets presents dans public/assets/cloned/ et NON references dans src/\n" % len(orphans))
    for o in orphans:
        p = assets[o]
        fh.write("%s\t%d octets\n" % (o, os.path.getsize(p) if os.path.isfile(p) else -1))

# ---------- stats ----------
def uniq(lst): return sorted(set(lst))
stats = {
    "assets_on_disk": len(assets),
    "assets_referenced_in_src": len(refs),
    "bitmaps_referenced": len(bitmaps_used),
    "svg_referenced": sum(1 for r in refs if r.endswith(".svg")),
    "orphans": len(orphans),
    "legacy_es_alt_assets": len(risk_index.get("ALT_ES_HERITE", [])),
    "logo_assets": len(uniq(risk_index.get("USAGE_LOGO_ANCIEN", []) + risk_index.get("VARIANTE_SRCSET_LOGO", []))),
    "real_person_photos": len(risk_index.get("PHOTO_PERSONNE_REELLE", [])),
    "screenshots": len(risk_index.get("CAPTURE_INTERFACE", [])),
    "video_testimonial_thumbs": len(risk_index.get("Miniature_temoignage_video", [])),
    "classified_CRITIQUE": len(risk_index.get("CLASS_CRITIQUE", [])),
    "classified_A_CHECK": len(risk_index.get("CLASS_A-CHECK", [])),
    "classified_NEUTRE": len(risk_index.get("CLASS_NEUTRE", [])),
    "risk_index": {k: uniq(v) for k, v in risk_index.items()},
}
with open(os.path.join(AUDITS, "image_stats.json"), "w", encoding="utf-8") as fh:
    json.dump(stats, fh, ensure_ascii=False, indent=2)

with open(os.path.join(AUDITS, "bitmaps_used.json"), "w", encoding="utf-8") as fh:
    json.dump(bitmaps_used, fh, indent=1)

print(json.dumps({k: v for k, v in stats.items() if k != "risk_index"}, ensure_ascii=False, indent=2))
for k, v in stats["risk_index"].items():
    print(k, "->", v[:20])
