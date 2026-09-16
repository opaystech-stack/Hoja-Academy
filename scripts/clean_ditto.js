#!/usr/bin/env node
/**
 * clean_ditto.js — lot B : nettoyage du système d'ancrage hérité du clone.
 *
 * Ce qui est SUPPRIMÉ (avec preuve) :
 *   1. `ditto/DittoWire.tsx` — jamais rendu (importé sur 9 routes, jamais utilisé
 *      en JSX ; absent du bundle de production). Ses 9 imports sont morts.
 *   2. Les sélecteurs CSS ciblant des ancres absentes du DOM (dont la totalité
 *      du bloc de révélation du mega-menu de l'en-tête, désormais géré par
 *      `sections/navbar.tsx`).
 *   3. Les attributs `data-ditto-id` littéraux que rien ne cible.
 *   4. Les entrées `anchor:` de `ditto-meta.ts` que rien ne cible.
 *   5. L'import mort `ListRow_meta2` de `sections/footer.tsx`.
 *
 * Ce qui est CONSERVÉ et FACTORISÉ :
 *   - le contrat `data-ditto-id` (78 ancres réellement ciblées par le CSS) ;
 *   - la règle `.cn0`, dupliquée à l'identique dans les 8 `ditto.css` → déplacée
 *     une seule fois dans `globals.css`.
 *
 * Usage : node scripts/clean_ditto.js [--dry]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'hoja-site', 'src');
const DRY = process.argv.includes('--dry');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

// ─── 1. Cartographie : ancres du DOM vs ancres ciblées par le CSS ───────────
// Le HTML CONSTRUIT fait foi : une ancre déclarée dans le code peut ne jamais
// atteindre le DOM (tableau de méta non importé, entrée jamais indexée). Se fier
// au build évite de supprimer une règle CSS qui, elle, s'applique réellement.
const BUILT = path.join(__dirname, '..', 'hoja-site', 'out');
function builtAnchors() {
  const set = new Set();
  if (!fs.existsSync(BUILT)) return null;
  const stack = [BUILT];
  while (stack.length) {
    const d = stack.pop();
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (e.name !== '_next') stack.push(p); }
      else if (/\.html$/.test(e.name)) {
        for (const m of fs.readFileSync(p, 'utf8').matchAll(/data-ditto-id="([^"]+)"/g)) set.add(m[1]);
      }
    }
  }
  return set;
}
const BUILT_SET = builtAnchors();

const dom = new Set();
const cssAnchors = new Set();
for (const abs of walk(ROOT)) {
  const t = fs.readFileSync(abs, 'utf8');
  if (abs.endsWith('.css')) {
    for (const m of t.matchAll(/\[data-ditto-id="([^"]+)"\]/g)) cssAnchors.add(m[1]);
    continue;
  }
  for (const m of t.matchAll(/data-ditto-id="([^"]+)"/g)) dom.add(m[1]);
  for (const m of t.matchAll(/anchor:\s*"([^"]+)"/g)) dom.add(m[1]);
}
// Fusion avec le build quand il est disponible.
if (BUILT_SET) for (const a of BUILT_SET) dom.add(a);
const orphan = (a) => !cssAnchors.has(a);
const deadAnchors = new Set([...cssAnchors].filter((a) => !dom.has(a)));

const log = [];
const bump = (label, n) => { if (n) log.push([label, n]); };

// ─── 2. CSS : retirer les règles mortes + dédupliquer .cn0 ─────────────────
const CN0_RE = /^\.cn0\{[^}]*\}\s*$/;
let cn0Removed = 0;
let cssRulesRemoved = 0;
const dittoCssFiles = [];

for (const abs of walk(ROOT)) {
  if (!abs.endsWith('.css')) continue;
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  if (!/ditto\.css$/.test(rel)) continue;
  dittoCssFiles.push(rel);

  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const kept = [];
  for (const line of lines) {
    if (CN0_RE.test(line.trim())) { cn0Removed++; continue; }

    // Une règle est morte si CHAQUE groupe de sélecteurs l'est. Un groupe
    // (sélecteur descendant) est mort dès qu'UNE de ses ancres est absente du DOM :
    // `[data-ditto-id="style-header"]:hover [data-ditto-id="style-nav"]` ne peut
    // jamais correspondre si `style-nav` n'existe pas.
    // ATTENTION : ne découper que la PARTIE SÉLECTEUR (avant `{`). Les déclarations
    // contiennent des virgules (`rgb(172, 170, 176)`) qui ne sont pas des séparateurs.
    const hasAnchors = /\[data-ditto-id="/.test(line);
    if (hasAnchors) {
      const selectorPart = line.split('{')[0];
      const groups = selectorPart.split(',');
      const allDead = groups.every((g) => {
        const a = [...g.matchAll(/\[data-ditto-id="([^"]+)"\]/g)].map((m) => m[1]);
        return a.length > 0 && a.some((x) => deadAnchors.has(x));
      });
      if (allDead) { cssRulesRemoved++; continue; }
    }
    kept.push(line);
  }
  // supprime les @media devenus vides
  let text = kept.join('\n');
  text = text.replace(/@media[^{]+\{\s*\}/g, '');
  text = text.replace(/\n{3,}/g, '\n\n').replace(/\n+\s*$/, '\n');
  if (!DRY) fs.writeFileSync(abs, text);
}
bump('.cn0 retiré des ditto.css', cn0Removed);
bump('règles CSS mortes retirées', cssRulesRemoved);

// ─── 3. globals.css : réintroduire .cn0 une seule fois ─────────────────────
const GLOBALS = path.join(ROOT, 'app', 'globals.css');
if (cn0Removed) {
  const g = fs.readFileSync(GLOBALS, 'utf8');
  if (!/\.cn0\b/.test(g)) {
    const block = `
/* Base du document — hérité du clone, sorti des 8 \`ditto.css\` où il était dupliqué.
   Porté par <body> (layout.tsx). Corps éditorial du design system Hoja : 16 px / 26 px. */
.cn0 {
  display: block;
  top: 0;
  overflow-x: clip;
  color: var(--foreground);
  background-color: var(--background);
  font-family: "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 16px;
  font-weight: 400;
  font-style: normal;
  line-height: 26px;
  letter-spacing: normal;
  word-spacing: 0;
  text-align: start;
  text-transform: none;
  white-space: normal;
  word-break: normal;
  overflow-wrap: normal;
  text-indent: 0;
  text-shadow: none;
  font-variant-caps: normal;
  font-feature-settings: normal;
  list-style-position: outside;
  writing-mode: horizontal-tb;
  direction: ltr;
}
`;
    if (!DRY) fs.writeFileSync(GLOBALS, g.replace(/\s*$/, '\n') + block);
    bump('.cn0 réintroduit dans globals.css', 1);
  }
}

// ─── 4. JSX : retirer les attributs data-ditto-id orphelins ────────────────
let attrsRemoved = 0;
for (const abs of walk(ROOT)) {
  if (!/\.tsx$/.test(abs)) continue;
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  if (/ditto[\\/]DittoWire\.tsx$/.test(rel)) continue;
  let t = fs.readFileSync(abs, 'utf8');
  const before = t;
  t = t.replace(/ data-ditto-id="([^"]+)"/g, (m, a) => {
    if (!orphan(a)) return m;
    attrsRemoved++;
    return '';
  });
  if (t !== before && !DRY) fs.writeFileSync(abs, t);
}
bump('attributs data-ditto-id orphelins retirés', attrsRemoved);

// ─── 5. ditto-meta.ts : retirer les entrées d'ancrage orphelines ───────────
const META = path.join(ROOT, 'app', 'ditto-meta.ts');
{
  const lines = fs.readFileSync(META, 'utf8').split('\n');
  let metaRemoved = 0;
  const out = lines.map((line) => {
    if (!/anchor:/.test(line)) return line;
    // lignes du type :  { 0: { anchor: "a" }, 1: { anchor: "b" } },
    const indent = line.match(/^\s*/)[0];
    const trailing = line.trimEnd().endsWith(',') ? ',' : '';
    const entries = [...line.matchAll(/(\d+):\s*\{\s*anchor:\s*"([^"]+)"\s*\}/g)];
    if (!entries.length) return line;
    const keptEntries = entries.filter((e) => !orphan(e[2]));
    metaRemoved += entries.length - keptEntries.length;
    const body = keptEntries.map((e) => `${e[1]}: { anchor: "${e[2]}" }`).join(', ');
    return body ? `${indent}{ ${body} }${trailing}` : `${indent}{  }${trailing}`;
  });
  if (metaRemoved && !DRY) fs.writeFileSync(META, out.join('\n'));
  bump('entrées d\'ancrage orphelines retirées de ditto-meta.ts', metaRemoved);
}

// ─── 6. DittoWire : suppression + imports morts ────────────────────────────
const WIRE = path.join(ROOT, 'app', 'ditto', 'DittoWire.tsx');
let importsRemoved = 0;
for (const abs of walk(ROOT)) {
  if (!/\.tsx$/.test(abs)) continue;
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  if (/ditto[\\/]DittoWire\.tsx$/.test(rel)) continue;
  let t = fs.readFileSync(abs, 'utf8');
  const before = t;
  t = t.replace(/^import DittoWire from "[^"]+";\r?\n/m, () => { importsRemoved++; return ''; });
  if (t !== before && !DRY) fs.writeFileSync(abs, t);
}
if (fs.existsSync(WIRE)) {
  if (!DRY) {
    fs.unlinkSync(WIRE);
    const dir = path.dirname(WIRE);
    if (fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
  bump('DittoWire.tsx supprimé', 1);
}
bump('imports morts de DittoWire retirés', importsRemoved);

// ─── 7. footer.tsx : import mort ListRow_meta2 ─────────────────────────────
const FOOTER = path.join(ROOT, 'app', 'sections', 'footer.tsx');
{
  let t = fs.readFileSync(FOOTER, 'utf8');
  const before = t;
  t = t.replace(
    /import \{ ListRow_meta2, ListRow6_meta, ListRow8_meta \} from "\.\.\/ditto-meta";/,
    'import { ListRow6_meta, ListRow8_meta } from "../ditto-meta";'
  );
  if (t !== before) {
    if (!DRY) fs.writeFileSync(FOOTER, t);
    bump('import mort ListRow_meta2 retiré', 1);
  }
}

// ─── Rapport ───────────────────────────────────────────────────────────────
console.log(`\n${DRY ? '[DRY-RUN] ' : ''}NETTOYAGE DU SYSTÈME D'ANCRAGE\n`);
console.log(`Ancres du DOM : ${dom.size}   |   ciblées par le CSS : ${cssAnchors.size}`);
console.log(`  · conservées (utiles) : ${[...dom].filter((a) => !orphan(a)).length}`);
console.log(`  · orphelines retirées : ${[...dom].filter(orphan).length}`);
console.log(`  · sélecteurs CSS morts : ${deadAnchors.size}\n`);
for (const [label, n] of log) console.log(`  ${String(n).padStart(4)}  ${label}`);
if (DRY) console.log('\nAucune écriture (--dry).');
