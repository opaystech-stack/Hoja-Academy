#!/usr/bin/env node
/**
 * PHASE H — LOT 2 : RETRAIT DES EMOJIS DES LIBELLÉS
 * =================================================
 * Le chrome fonctionnel a été traité au lot 1. Restent les emojis portés par les
 * LIBELLÉS du contenu (pastilles de héros, orbites, onglets, boutons de copie,
 * en-têtes de carte). Ils sont décoratifs : le texte du libellé porte seul le sens.
 *
 * Règle appliquée : suppression des emojis en POSITION DE GLYPHE DE TÊTE ou DE QUEUE
 * d'un nœud de texte. Un emoji au milieu d'une phrase n'est jamais touché.
 * Les flèches `➔` sont remplacées par `→` (glyphe typographique, pas un emoji).
 *
 * Cibles : les 18 modules + les sources de données qui les régénèrent.
 * Le contenu pédagogique (textes, prompts, notes) n'est pas modifié.
 *
 * Usage : node scripts/hoja_modules_labels.js [--dry]
 */

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const DRY = process.argv.includes('--dry');

// Ranges réellement emoji. Sont EXCLUS :
//   U+2190–U+21FF (flèches typographiques → ← ↕, utilisées en prose)
//   U+25A0–U+25FF (formes géométriques □ ■, utilisées comme cases à cocher)
const EMOJI_CLASS = '\\u{1F300}-\\u{1FAFF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}\\u{2B00}-\\u{2BFF}';
const EMOJI = `[${EMOJI_CLASS}]`;
const MODS = '[\\u{FE0F}\\u{200D}\\u{20E3}]';

// Emoji de tête, juste après une balise ouvrante (ou en début de valeur d'attribut)
// NB : les sources sont en CRLF → le \r fait partie de la classe d'espaces.
const WS = '[ \\t\\r\\n]';
const LEADING = new RegExp(`(>|")((?:${WS})*)((?:${EMOJI}${MODS}*(?:${WS})+)+|(?:${EMOJI}${MODS}*)+)`, 'gu');
// Emoji de queue, juste avant une balise fermante
const TRAILING = new RegExp(`((?:${WS})*(?:${EMOJI}${MODS}*)+)(<)`, 'gu');

const targets = [
  ...modules.map((m) => path.join(DIRS.modules, m.code, 'presentation.html')),
  path.join(__dirname, 'data_modules_02_to_06.js'),
  path.join(__dirname, 'data_modules_07_to_12.js'),
  path.join(__dirname, 'data_modules_13_to_18.js'),
  path.join(__dirname, 'fix_modules_16_18.js'),
];

const scan = (s) => (s.match(new RegExp(EMOJI, 'gu')) || []).length;

console.log('\n======================================================');
console.log('  PHASE H — LOT 2 : EMOJIS DES LIBELLÉS');
console.log('======================================================');
console.log(`  Mode : ${DRY ? 'SIMULATION (--dry)' : 'APPLICATION'}\n`);

let totalBefore = 0, totalAfter = 0, files = 0;

for (const file of targets) {
  if (!fs.existsSync(file)) {
    console.log(`· ${path.relative(process.cwd(), file)} : absent — ignoré`);
    continue;
  }
  const src = fs.readFileSync(file, 'utf8');
  const before = scan(src);
  let out = src
    .replace(LEADING, '$1$2')
    .replace(TRAILING, '$2')
    .replace(/\u2794/g, '\u2192'); // ➔ → →
  // Les espaces multiples laissés par les suppressions sont normalisés
  out = out.replace(/([>"])([ \t]{2,})(?=[^\s<])/g, '$1 ');

  const after = scan(out);
  if (!DRY && out !== src) fs.writeFileSync(file, out, 'utf8');

  totalBefore += before;
  totalAfter += after;
  files++;
  console.log(`  ${before === after ? '·' : '✔'} ${path.relative(process.cwd(), file).padEnd(58)} ${before} → ${after}`);
}

console.log('\n======================================================');
console.log(`  ${files} fichiers · emojis de libellé : ${totalBefore} → ${totalAfter}`);
console.log('======================================================\n');

if (totalAfter > 0) {
  console.log(`  Reste ${totalAfter} emoji(s) hors position de libellé (prose/prompts) — à arbitrer séparément.\n`);
}
