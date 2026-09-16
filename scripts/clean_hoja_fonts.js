#!/usr/bin/env node
/**
 * clean_hoja_fonts.js — Retrait des @font-face morts du site public Hoja
 *
 * CONTEXTE
 * `hoja-site/src/app/globals.css` contient 212 règles @font-face (117 711
 * caractères, soit ~87 % du fichier) dont la quasi-totalité est morte :
 *
 *   - Exo 2 (180 règles)  : police du clone espagnol, appliquée au corps via
 *                           `.cn0{font-family:"Exo 2"}` (ditto.css) — À RETIRER,
 *                           Hoja utilise Montserrat (Google Fonts, layout.tsx)
 *   - Orbitron (12)       : token --font-001, jamais référencé
 *   - Noto Color Emoji(11): token --font-003, jamais référencé
 *   - dashicons, fcicons, ld-icons, swiper-icons, WooCommerce, star :
 *                           polices d'icônes WordPress / LearnForm / Woo / Swiper,
 *                           aucune référence
 *
 * La police Roboto (3 règles) est conservée : elle est référencée dans le corps
 * de page comme police de repli légitime.
 *
 * Ce script est IDEMPOTENT : relancé, il ne fait rien si les règles sont déjà
 * retirées.
 *
 * Usage : node scripts/clean_hoja_fonts.js [--dry]
 */
'use strict';

const fs = require('fs');
const path = require('path');

const CSS = path.join(__dirname, '..', 'hoja-site', 'src', 'app', 'globals.css');
const DRY = process.argv.includes('--dry');

/** Familles à supprimer intégralement. */
const DEAD = new Set([
  'Exo 2', 'Orbitron', 'Noto Color Emoji',
  'dashicons', 'fcicons', 'ld-icons', 'swiper-icons', 'WooCommerce', 'star',
]);

const original = fs.readFileSync(CSS, 'utf8');

// Capturer chaque @font-face avec sa famille
const re = /@font-face\s*\{[^}]*\}/g;
let out = '';
let cursor = 0;
let removed = 0;
let kept = 0;
const removedFamilies = new Map();
const keptFamilies = new Map();

for (const m of original.matchAll(re)) {
  const block = m[0];
  const famMatch = block.match(/font-family\s*:\s*["']?([^;"'\n]+)/);
  const fam = famMatch ? famMatch[1].trim() : '(inconnue)';

  out += original.slice(cursor, m.index);
  cursor = m.index + block.length;

  if (DEAD.has(fam)) {
    removed++;
    removedFamilies.set(fam, (removedFamilies.get(fam) || 0) + 1);
    // Retirer aussi le commentaire d'en-tête éventuel juste avant
    out = out.replace(/\n\s*\/\*[^*]*\*\/\s*$/, '\n');
    // et les lignes vides laissées
    out = out.replace(/\n{3,}$/, '\n\n');
  } else {
    kept++;
    keptFamilies.set(fam, (keptFamilies.get(fam) || 0) + 1);
    out += block;
  }
}
out += original.slice(cursor);
// Compacter les lignes vides résiduelles
out = out.replace(/\n{4,}/g, '\n\n\n');

console.log(`@font-face analysés : ${removed + kept}`);
console.log(`  → supprimés : ${removed}`);
for (const [f, c] of [...removedFamilies].sort((a, b) => b[1] - a[1])) {
  console.log(`      ${String(c).padStart(3)}  ${f}`);
}
console.log(`  → conservés : ${kept}`);
for (const [f, c] of keptFamilies) console.log(`      ${String(c).padStart(3)}  ${f}`);
console.log();
console.log(`Fichier : ${original.length} → ${out.length} caractères` +
  ` (${Math.round((1 - out.length / original.length) * 100)} % de réduction)`);

if (DRY) {
  console.log('\n(--dry : aucune écriture)');
  process.exit(0);
}

if (removed === 0) {
  console.log('\nRien à faire : les règles mortes sont déjà retirées.');
  process.exit(0);
}

fs.writeFileSync(CSS, out, 'utf8');
console.log('\n✅ globals.css nettoyé.');
