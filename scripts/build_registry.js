/**
 * OPAYS ACADEMY — Normalisation & validation du registre central
 * Le registre (data/modules.js) est la SOURCE DE VÉRITÉ des 18 modules.
 * Ce script le normalise (durationLabel, ordre pédagogique) et le réécrit.
 *
 * Usage : node scripts/build_registry.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { FILES, DIRS } = require('./config');

const registryPath = FILES.registry;
const modules = require(registryPath);

// ─── Normalisation ───────────────────────────────────────────────────
let changed = 0;
modules.forEach(m => {
  // durationLabel dérivé de duration quand absent
  if (!m.durationLabel) {
    m.durationLabel = typeof m.duration === 'number' ? m.duration + ' min' : m.duration;
    changed++;
  }
  // numéro sur 2 chiffres cohérent
  if (!m.numStr) m.numStr = String(m.num).padStart(2, '0');
});

// Ordre pédagogique officiel : semaine, puis séance, puis numéro
modules.sort((a, b) => a.week - b.week || a.seanceNum - b.seanceNum || a.num - b.num);

// ─── Validation ──────────────────────────────────────────────────────
const nums = modules.map(m => m.num).sort((a, b) => a - b);
const expected = Array.from({ length: 18 }, (_, i) => i + 1);
const missing = expected.filter(n => !nums.includes(n));
if (missing.length > 0) throw new Error(`Modules manquants : ${missing.join(', ')}`);

const totalSlides = modules.reduce((s, m) => s + m.slides, 0);
const totalPrompts = modules.reduce((s, m) => s + m.prompts, 0);
const totalSeances = new Set(modules.map(m => m.seanceNum)).size;

// ─── Écriture (wrapper UMD propre) ───────────────────────────────────
const output = `/**
 * OPAYS ACADEMY — Registre central des 18 modules
 * SOURCE DE VÉRITÉ UNIQUE. Normalisé par scripts/build_registry.js — ne pas éditer à la main.
 * Consommé par : course-hub.html, formateur-dashboard.html, scripts de test.
 * Ordre pédagogique : systeme-operationnel/01_PARCOURS_PEDAGOGIQUE_DEFINITIF.md (séances).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OPAYS_MODULES = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return ${JSON.stringify(modules, null, 2)};
});
`;

fs.writeFileSync(registryPath, output, 'utf8');

console.log('✅ Registre normalisé :', registryPath);
console.log(`   ${modules.length} modules • ${totalSeances} séances • ${totalSlides} slides • ${totalPrompts} prompts`);
console.log(`   Champ(s) durationLabel ajouté(s) : ${changed}`);
console.log('   Ordre :', modules.map(m => `M${m.numStr}(S${m.seanceNum})`).join(' '));
