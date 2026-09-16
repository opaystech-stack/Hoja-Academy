#!/usr/bin/env node
/**
 * Inventaire typographique du site public Hoja.
 * Recense TOUTES les tailles de police appliquées, par source (classe Tailwind,
 * valeur arbitraire, CSS) et par usage (contexte du composant).
 * Lecture seule — n'écrit rien.
 *
 * Usage : node scripts/typo_inventory.js [--json]
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "hoja-site", "src");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const toPx = (v) => {
  const s = String(v).trim();
  if (s.endsWith("rem")) return +(parseFloat(s) * 16).toFixed(4);
  if (s.endsWith("px")) return parseFloat(s);
  return parseFloat(s);
};

// --- 1. Classes Tailwind nommées (échelle par défaut de Tailwind 4) ---
const TW_SCALE = {
  "text-xs": 12, "text-sm": 14, "text-base": 16, "text-lg": 18, "text-xl": 20,
  "text-2xl": 24, "text-3xl": 30, "text-4xl": 36, "text-5xl": 48, "text-6xl": 60,
  "text-7xl": 72, "text-8xl": 96, "text-9xl": 128,
};

const files = walk(ROOT);
const bySize = new Map(); // px -> { sources: Map<file,count>, classes:Set }
const cssRules = [];
const arbitraryFiles = new Map();

function add(px, file, cls) {
  if (!bySize.has(px)) bySize.set(px, { files: new Map(), classes: new Set() });
  const e = bySize.get(px);
  e.files.set(file, (e.files.get(file) || 0) + 1);
  if (cls) e.classes.add(cls);
}

for (const f of files) {
  const rel = path.relative(ROOT, f).replace(/\\/g, "/");
  const t = fs.readFileSync(f, "utf8");

  if (f.endsWith(".css")) {
    for (const m of t.matchAll(/font-size\s*:\s*([^;}\n]+)/g)) {
      const raw = m[1].trim();
      cssRules.push({ file: rel, value: raw, px: toPx(raw) });
      add(toPx(raw), rel, `font-size:${raw}`);
    }
    continue;
  }

  // valeurs arbitraires text-[1.0625rem] / text-[17px]
  for (const m of t.matchAll(/text-\[([0-9.]+)(rem|px)\]/g)) {
    const px = toPx(m[1] + m[2]);
    add(px, rel, m[0]);
    if (!arbitraryFiles.has(rel)) arbitraryFiles.set(rel, new Set());
    arbitraryFiles.get(rel).add(m[0]);
  }
  // classes nommées
  for (const m of t.matchAll(/\btext-(xs|sm|base|lg|xl|[2-9]xl)\b/g)) {
    const px = TW_SCALE[m[0]];
    if (px) add(px, rel, m[0]);
  }
}

// --- 2. Le rôle fonctionnel déduit du nom de fichier / du contexte ---
function roleOf(rel) {
  const b = path.basename(rel);
  if (/page-hero|hero/.test(b)) return "hero";
  if (/navbar|footer|nav/.test(b)) return "navigation / pied";
  if (/^page\.tsx$/.test(b)) return "page (corps)";
  if (/list-row|media-card|media-tile|why-hoja/.test(b)) return "liste / carte";
  if (/mailto|form/.test(b)) return "formulaire";
  if (/globals\.css$/.test(b)) return "global";
  if (/ditto\.css$/.test(b)) return "états d'interaction";
  return "composant";
}

const rows = [...bySize.entries()].sort((a, b) => a[0] - b[0]);
const total = rows.reduce((s, [, v]) => s + [...v.files.values()].reduce((a, b) => a + b, 0), 0);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify({
    distinctSizes: rows.length,
    totalDeclarations: total,
    sizes: rows.map(([px, v]) => ({
      px,
      count: [...v.files.values()].reduce((a, b) => a + b, 0),
      classes: [...v.classes],
      files: Object.fromEntries(v.files),
    })),
    cssRules,
  }, null, 1));
  process.exit(0);
}

console.log(`\nINVENTAIRE TYPOGRAPHIQUE — site public Hoja`);
console.log(`Fichiers analysés : ${files.length}  |  tailles distinctes : ${rows.length}  |  déclarations : ${total}\n`);
console.log("px     n°   classes appliquées");
console.log("-".repeat(78));
for (const [px, v] of rows) {
  const n = [...v.files.values()].reduce((a, b) => a + b, 0);
  const cls = [...v.classes].slice(0, 4).join(", ");
  console.log(`${String(px).padStart(6)} ${String(n).padStart(4)}   ${cls}`);
}
console.log("\n--- répartition par fichier (top 20) ---");
const byFile = new Map();
for (const [px, v] of rows) for (const [f, n] of v.files) byFile.set(f, (byFile.get(f) || 0) + n);
[...byFile.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20)
  .forEach(([f, n]) => console.log(`${String(n).padStart(5)}  ${f}`));
