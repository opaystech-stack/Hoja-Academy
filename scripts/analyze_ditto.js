#!/usr/bin/env node
/**
 * analyze_ditto.js — cartographie du système d'ancrage hérité du clone.
 *
 * Le clone (ditto.site) a posé des ancres `data-ditto-id` sur les nœuds du DOM.
 * Ces ancres servent :
 *   - au CSS : états :hover / :focus / :transition, et révélation du mega-menu
 *     de l'en-tête ([data-ditto-id="style-header"]:hover [data-ditto-id="…"]) ;
 *   - au composant DittoWire (supprimé au lot B — il n'était jamais rendu).
 *
 * Ce script compare :
 *   DOM  = ancres littérales dans le .tsx  +  ancres déclarées dans ditto-meta.ts
 *   CSS  = sélecteurs [data-ditto-id="…"] dans tous les .css
 * et signale :
 *   - ancres orphelines  (présentes dans le DOM, ciblées par rien)
 *   - sélecteurs morts   (ciblant une ancre absente du DOM)
 *
 * Lecture seule.
 *
 * Usage : node scripts/analyze_ditto.js [--json]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', 'hoja-site', 'src');
const BUILT = path.join(__dirname, '..', 'hoja-site', 'out');
const JSON_OUT = process.argv.includes('--json');

// ─── Ancres RÉELLEMENT émises : on lit le HTML construit quand il existe ────
// L'analyse par source surestime : un `anchor:` déclaré dans `ditto-meta.ts`
// peut n'être importé par personne, et une entrée de tableau `string[][]`
// locale à une page peut ne jamais atteindre le DOM. Le build, lui, ne ment pas.
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
        const t = fs.readFileSync(p, 'utf8');
        for (const m of t.matchAll(/data-ditto-id="([^"]+)"/g)) set.add(m[1]);
      }
    }
  }
  return set;
}
const BUILT_SET = builtAnchors();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const dom = new Map(); // ancre -> Set(fichiers)
const css = new Map(); // ancre -> Set(fichiers)
const origin = new Map(); // ancre -> 'literal' | 'meta'
const cssRuleCount = new Map();

const add = (map, key, file) => {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(file);
};

for (const abs of walk(ROOT)) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, '/');
  const t = fs.readFileSync(abs, 'utf8');

  if (abs.endsWith('.css')) {
    for (const m of t.matchAll(/\[data-ditto-id="([^"]+)"\]/g)) {
      add(css, m[1], rel);
      cssRuleCount.set(m[1], (cssRuleCount.get(m[1]) || 0) + 1);
    }
    continue;
  }

  // ancres littérales dans le JSX
  for (const m of t.matchAll(/data-ditto-id="([^"]+)"/g)) {
    add(dom, m[1], rel);
    if (!origin.has(m[1])) origin.set(m[1], 'literal');
  }
  // ancres dynamiques : `anchor: "…"` est déclaré dans ditto-meta.ts ET dans les
  // tableaux locaux de chaque page (MediaCard_meta, ListRow2_meta, …).
  for (const m of t.matchAll(/anchor:\s*"([^"]+)"/g)) {
    add(dom, m[1], rel);
    origin.set(m[1], /ditto-meta\.ts$/.test(rel) ? 'meta' : 'page');
  }
}

const orphans = [...dom.keys()].filter((k) => !css.has(k));
const deadCss = [...css.keys()].filter((k) => !dom.has(k));
const shared = [...dom.keys()].filter((k) => css.has(k));

// Contrôle de réalité : ce que le build contient vraiment.
const builtOrphans = BUILT_SET ? [...BUILT_SET].filter((k) => !css.has(k)) : [];
const builtDeadCss = BUILT_SET ? [...css.keys()].filter((k) => !BUILT_SET.has(k)) : [];

const report = {
  domAnchors: dom.size,
  cssAnchors: css.size,
  shared: shared.length,
  orphanAnchors: orphans.length,
  deadCssSelectors: deadCss.length,
  builtAnchors: BUILT_SET ? BUILT_SET.size : null,
  builtOrphanAnchors: BUILT_SET ? builtOrphans.length : null,
  builtDeadCssSelectors: BUILT_SET ? builtDeadCss.length : null,
  builtDeadCss,
  orphans: orphans.sort(),
  deadCss: deadCss.sort(),
};

if (JSON_OUT) {
  console.log(JSON.stringify(report, null, 1));
  process.exit(0);
}

console.log('\nCARTOGRAPHIE DU SYSTÈME D\'ANCRAGE (data-ditto-id)\n');
console.log(`Ancres présentes dans le DOM      : ${dom.size}`);
console.log(`Ancres ciblées par du CSS         : ${css.size}`);
console.log(`  · les deux (utiles)             : ${shared.length}`);
console.log(`  · orphelines (DOM seul)         : ${orphans.length}`);
console.log(`  · sélecteurs morts (CSS seul)   : ${deadCss.length}`);

const split = (list) => ({
  literal: list.filter((k) => origin.get(k) === 'literal').length,
  meta: list.filter((k) => origin.get(k) === 'meta').length,
});
console.log('\nOrigine des ancres du DOM :');
console.log(`  littérales dans le JSX   : ${[...dom.keys()].filter((k) => origin.get(k) === 'literal').length}`);
console.log(`  via ditto-meta.ts        : ${[...dom.keys()].filter((k) => origin.get(k) === 'meta').length}`);
const os = split(orphans);
console.log(`  → orphelines : ${os.literal} littérales, ${os.meta} via meta`);

const byFile = new Map();
for (const [k, v] of css) if (!dom.has(k)) for (const f of v) byFile.set(f, (byFile.get(f) || 0) + 1);
if (byFile.size) {
  console.log('\nSélecteurs morts par fichier CSS :');
  [...byFile.entries()].sort((a, b) => b[1] - a[1]).forEach(([f, n]) => console.log(`  ${String(n).padStart(3)}  ${f}`));
}

if (BUILT_SET) {
  console.log('\n— CONTRÔLE DE RÉALITÉ (HTML construit) —');
  console.log(`Ancres réellement émises dans le build : ${BUILT_SET.size}`);
  console.log(`  · ciblées par du CSS                 : ${BUILT_SET.size - builtOrphans.length}`);
  console.log(`  · inertes (aucun CSS)                : ${builtOrphans.length}`);
  console.log(`Sélecteurs CSS morts dans le build     : ${builtDeadCss.length}`);
  if (builtDeadCss.length) console.log('  -> ' + builtDeadCss.join(', '));
}
