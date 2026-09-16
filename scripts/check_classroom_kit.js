/**
 * OPAYS ACADEMY — Validation du kit de lancement Google Classroom
 * Vérifie qu'un kit généré couvre les 18 modules (liens vers les présentations
 * existantes), les 8 semaines, les 8 devoirs, et les thèmes permanents.
 *
 * Usage : node scripts/check_classroom_kit.js [chemin-du-kit.md]
 *        (défaut : le kit le plus récent de docs/classroom/posts/)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

function findLatestKit() {
  const postsDir = path.join(DIRS.docs, 'classroom', 'posts');
  if (!fs.existsSync(postsDir)) return null;
  const kits = [];
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.startsWith('kit-lancement') && entry.name.endsWith('.md')) kits.push(full);
    }
  };
  walk(postsDir);
  kits.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return kits[0] || null;
}

const kitPath = process.argv[2] || findLatestKit();
if (!kitPath) {
  console.error('❌ Aucun kit trouvé. Générez-en un d\u2019abord : npm run classroom:kit -- <date> --out docs/classroom/posts/cohorte-XX');
  process.exit(1);
}

const kit = fs.readFileSync(kitPath, 'utf8');
const issues = [];
let checks = 0;

function check(name, pass, detail) {
  checks++;
  if (!pass) issues.push(detail || name);
  return pass;
}

console.log(`\n📋 VALIDATION DU KIT : ${path.relative(DIRS.root, kitPath)}`);

// 1. Couverture des 18 modules (liens vers les présentations — relatifs OU absolus avec --base-url)
const covered = modules.filter(m =>
  kit.includes(`modules/${String(m.num).padStart(2, '0')}/`) ||
  kit.includes(`${m.code}/presentation.html`) // tolérance ancien format
);
check('Les 18 modules sont référencés', covered.length === 18, `${18 - covered.length} module(s) manquant(s) : ${modules.filter(m => !covered.includes(m)).map(m => m.code).join(', ')}`);

// 2. Les liens relatifs pointent vers des fichiers existants (si présents dans le kit)
const relativeLinks = [...kit.matchAll(/\]\((modules\/[^)]+\.html)\)/g)].map(m => m[1]);
const missingFiles = relativeLinks
  .map(rel => rel.replace(/^modules\//, ''))
  .filter(rel => rel.endsWith('presentation.html'))
  .filter(rel => !fs.existsSync(path.join(DIRS.modules, rel)));
check('Tous les liens relatifs ciblent une présentation existante', missingFiles.length === 0, `Fichiers manquants : ${missingFiles.join(', ')}`);

// 3. Les 8 semaines sont présentes
let weeksOk = true;
for (let w = 1; w <= 8; w++) {
  if (!kit.includes(`SEMAINE ${w}`)) { weeksOk = false; issues.push(`Semaine ${w} absente du kit`); }
}
check('Les 8 semaines sont couvertes', weeksOk);

// 4. Les 8 devoirs sont présents
let devoirsOk = true;
for (let d = 1; d <= 8; d++) {
  if (!kit.includes(`Devoir ${d}`)) { devoirsOk = false; issues.push(`Devoir ${d} absent du kit`); }
}
check('Les 8 devoirs sont présents', devoirsOk);

// 5. Thèmes permanents
check('Thème 00 COMMENCER ICI présent', kit.includes('COMMENCER ICI'), 'Thème 00 manquant');
check('Thème BOÎTE À OUTILS présent', kit.includes('BOÎTE À OUTILS') || kit.includes('Boîte à outils'), 'Thème Boîte à outils manquant');
check('Thème ACCOMPAGNEMENT présent', kit.includes('ACCOMPAGNEMENT'), 'Thème Accompagnement manquant');
check('Thème FORMATEUR SEULEMENT présent', kit.includes('FORMATEUR SEULEMENT'), 'Thème Formateur manquant');

// 6. AI Work Kit mentionné dans chaque semaine
let wkOk = true;
for (let w = 1; w <= 8; w++) {
  const marker = `## 🗓️ SEMAINE ${w} `;
  const nextMarker = `## 🗓️ SEMAINE ${w + 1} `;
  const fromIdx = kit.indexOf(marker);
  const toIdx = w < 8 ? kit.indexOf(nextMarker) : kit.length;
  const weekBlock = fromIdx >= 0 ? kit.slice(fromIdx, toIdx >= 0 ? toIdx : undefined) : '';
  if (!weekBlock.includes('AI Work Kit')) { wkOk = false; issues.push(`Semaine ${w} : AI Work Kit non mentionné`); }
}
check('AI Work Kit mentionné chaque semaine', wkOk);

// ─── Rapport ─────────────────────────────────────────────────────────
console.log(`\n  Vérifications : ${checks}`);
console.log(`  Issues : ${issues.length}`);
if (issues.length > 0) {
  issues.forEach(i => console.log(`   ❌ ${i}`));
  process.exitCode = 1;
} else {
  console.log('  ✅ Kit Classroom VALIDE — prêt à copier dans Google Classroom');
}
