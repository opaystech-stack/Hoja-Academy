#!/usr/bin/env python3
"""Build JPEG contact sheets of all bitmap assets referenced by src/.

Reads audits/bitmaps_used.json (written by scripts/image_audit.py) and renders
4x4 grids into audits/sheets/sheet_NN.jpg + audits/sheets/mapping.json.
Read-only on assets; writes only into audits/.
"""
import json
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = r"C:/LAPOSTE/Projets/clones/academiartificial/app"
IMG_DIR = os.path.join(ROOT, "public/assets/cloned/images")
SVG_DIR = os.path.join(ROOT, "public/assets/cloned/svg")
SHEETS = os.path.join(ROOT, "audits/sheets")
os.makedirs(SHEETS, exist_ok=True)

LIST_FILE = os.path.join(ROOT, "audits/bitmaps_used.json")
bitmaps = json.load(open(LIST_FILE, encoding="utf-8"))

TILE_W, TILE_H = 320, 260   # white tile
THUMB_MAX = 300             # max thumb box (fits inside tile minus caption)
THUMB_W, THUMB_H = 300, 210
COLS, ROWS = 4, 4
PAD = 10
FONT_SIZE = 10
SEQ_FONT_SIZE = 14
QUALITY = 80

def load_font(size):
    for cand in ("arial.ttf", "segoeui.ttf", "DejaVuSans.ttf", "consola.ttf"):
        try:
            return ImageFont.truetype(cand, size)
        except OSError:
            continue
    return ImageFont.load_default()

font_small = load_font(FONT_SIZE)
font_seq = load_font(SEQ_FONT_SIZE)

def make_tile(img_path, seq, fname):
    tile = Image.new("RGB", (TILE_W, TILE_H), "white")
    d = ImageDraw.Draw(tile)
    try:
        im = Image.open(img_path)
        im.seek(0)  # first frame for gif/webp animated
        im = im.convert("RGBA")
        im.thumbnail((THUMB_W, THUMB_H), Image.LANCZOS)
        bg = Image.new("RGB", im.size, "white")
        bg.paste(im, mask=im.split()[-1])
        x = (TILE_W - im.size[0]) // 2
        y = PAD
        tile.paste(bg, (x, y))
    except Exception:
        d.rectangle([4, 4, TILE_W - 4, TILE_H - 4], fill=(200, 200, 200), outline=(120, 120, 120))
        d.text((TILE_W // 2, TILE_H // 2 - 10), "BROKEN", fill=(60, 60, 60), font=font_seq, anchor="mm")
    # captions: filename hash (10px) + seq number
    short = fname if len(fname) <= 40 else fname[:37] + "..."
    d.text((PAD, TILE_H - 42), f"#{seq:03d}", fill=(0, 0, 0), font=font_seq)
    d.text((PAD + 46, TILE_H - 44), short, fill=(40, 40, 40), font=font_small)
    # risk note if long alt? keep simple: extension
    return tile

mapping = {}
per_sheet = COLS * ROWS
n_sheets = (len(bitmaps) + per_sheet - 1) // per_sheet

for si in range(n_sheets):
    grid = Image.new("RGB", (COLS * TILE_W, ROWS * TILE_H), "white")
    for ti in range(per_sheet):
        gi = si * per_sheet + ti
        if gi >= len(bitmaps):
            break
        rel = bitmaps[gi]  # 'images/xxx.png' or 'svg/...' (svg already filtered upstream)
        fname = rel.split("/", 1)[1]
        base = os.path.basename(fname)
        path = os.path.join(IMG_DIR, base) if rel.startswith("images/") else os.path.join(SVG_DIR, base)
        seq = gi + 1
        mapping[str(seq)] = {"asset": rel, "file": fname}
        tile = make_tile(path, seq, fname) if os.path.isfile(path) else None
        if tile is None:
            t = Image.new("RGB", (TILE_W, TILE_H), (200, 200, 200))
            ImageDraw.Draw(t).text((TILE_W // 2, TILE_H // 2), "MISSING", fill=(60, 60, 60), anchor="mm")
            tile = t
        grid.paste(tile, ((ti % COLS) * TILE_W, (ti // COLS) * TILE_H))
    out = os.path.join(SHEETS, f"sheet_{si + 1:02d}.jpg")
    # sheet is 1280x1040 => already <= 2000 px per side
    grid.save(out, "JPEG", quality=QUALITY, optimize=True)
    print("wrote", out, grid.size)

with open(os.path.join(SHEETS, "mapping.json"), "w", encoding="utf-8") as fh:
    json.dump({"count": len(mapping), "sheets": n_sheets, "items": mapping}, fh, ensure_ascii=False, indent=1)

print("TOTAL bitmaps:", len(bitmaps), "SHEETS:", n_sheets)
