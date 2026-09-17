/**
 * HOJA ACADEMY — TEST DE COHÉRENCE TRANSVERSALE
 * Vérifie : unicité du contenu, progression, Work Kit, missions, notes, prompts.
 * Consomme le registre central (data/modules.js) et la config (scripts/config.js).
 * Usage : node scripts/test_coherence.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const OPAYS_MODULES = require('../data/modules.js');

const modulesDir = DIRS.modules;
const issues = [];
let checks = 0;

function check(name, pass, detail) {
  checks++;
  if (!pass) issues.push(detail || name);
  return pass;
}

// ─── Extraction des données de chaque présentation ───────────────────
const allData = {};
OPAYS_MODULES.forEach(mod => {
  const filePath = path.join(modulesDir, mod.code, 'presentation.html');
  if (!fs.existsSync(filePath)) {
    issues.push(`Module ${mod.num} : presentation.html MANQUANT`);
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const si = html.indexOf('<script>') + 8;
  const se = html.indexOf('</script>');
  const js = html.substring(si, se);

  const slideTitles = [...html.matchAll(/data-title="([^"]+)"/g)].map(m => m[1]);
  const promptKeys = [...html.matchAll(/data-copy="([^"]+)"/g)].map(m => m[1]);
  const chapterMatch = js.match(/const chapterNames = (\[[\s\S]*?\]);/);
  let chapters = [];
  if (chapterMatch) { try { chapters = JSON.parse(chapterMatch[1]); } catch (e) {} }

  const lowerHtml = html.toLowerCase();
  allData[mod.num] = {
    num: mod.num, code: mod.code, modNum: String(mod.num).padStart(2, '0'),
    slideTitles, promptKeys, chapters,
    sizeKb: (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1),
    hasWorkKit: lowerHtml.includes('work kit'),
    hasMission: lowerHtml.includes('mission') || lowerHtml.includes('classroom'),
    hasPromptCard: html.includes('prompt-card'),
    slideCount: slideTitles.length,
  };
});

console.log('\n' + '═'.repeat(70));
console.log('  🔗 TEST DE COHÉRENCE TRANSVERSALE — 18 MODULES HOJA');
console.log('═'.repeat(70));

// ─── 1. UNICITÉ DU CONTENU ────────────────────────────────────────────
console.log('\n📋 1. UNICITÉ DU CONTENU PÉDAGOGIQUE');
console.log('─'.repeat(50));

const allTitles = {};
Object.values(allData).forEach(d => d.slideTitles.forEach(t => (allTitles[t] = allTitles[t] || []).push(d.modNum)));
const duplicateTitles = Object.entries(allTitles).filter(([t, mods]) => mods.length > 1 && !t.includes('Mission') && !t.includes('Work Kit'));
duplicateTitles.forEach(([t, mods]) => { console.log(`  ⚠️  Titre dupliqué: "${t}" → Modules ${mods.join(', ')}`); issues.push(`Titre dupliqué: "${t}" dans modules ${mods.join(', ')}`); });
console.log(duplicateTitles.length === 0 ? '  ✅ Tous les titres de slides sont uniques entre modules' : `  ⚠️  ${duplicateTitles.length} titre(s) dupliqué(s)`);

const allPromptKeys = {};
Object.values(allData).forEach(d => d.promptKeys.forEach(k => (allPromptKeys[k] = allPromptKeys[k] || []).push(d.modNum)));
const duplicatePrompts = Object.entries(allPromptKeys).filter(([k, mods]) => mods.length > 1);
duplicatePrompts.forEach(([k, mods]) => { console.log(`  ⚠️  Clé de prompt dupliquée: "${k}" → Modules ${mods.join(', ')}`); issues.push(`Clé prompt dupliquée: "${k}" dans modules ${mods.join(', ')}`); });
console.log(duplicatePrompts.length === 0 ? '  ✅ Toutes les clés de prompts sont uniques entre modules' : `  ⚠️  ${duplicatePrompts.length} clé(s) dupliquée(s)`);

const allChapterNames = {};
Object.values(allData).forEach(d => d.chapters.forEach(c => (allChapterNames[c] = allChapterNames[c] || []).push(d.modNum)));
const duplicateChapters = Object.entries(allChapterNames).filter(([c, mods]) => mods.length > 1);
duplicateChapters.forEach(([c, mods]) => { console.log(`  ⚠️  Nom de chapitre dupliqué: "${c}" → Modules ${mods.join(', ')}`); issues.push(`Chapitre dupliqué: "${c}" dans modules ${mods.join(', ')}`); });
console.log(duplicateChapters.length === 0 ? '  ✅ Tous les noms de chapitres sont uniques entre modules' : `  ⚠️  ${duplicateChapters.length} chapitre(s) dupliqué(s)`);

// ─── 2. WORK KIT COVERAGE ─────────────────────────────────────────────
console.log('\n📁 2. COUVERTURE AI WORK KIT');
console.log('─'.repeat(50));
Object.values(allData).forEach(d => {
  const ok = check(`Module ${d.modNum} : Work Kit mentionné`, d.hasWorkKit, `Module ${d.modNum} n'a pas de mention Work Kit`);
  console.log(`  ${ok ? '✅' : '❌'} Module ${d.modNum} : ${d.hasWorkKit ? 'Work Kit mentionné' : 'AUCUNE MENTION Work Kit'}`);
});

// ─── 3. MISSIONS & CLASSROOM ──────────────────────────────────────────
console.log('\n📝 3. MISSIONS & CLASSROOM');
console.log('─'.repeat(50));
Object.values(allData).forEach(d => {
  console.log(`  ${d.hasMission ? '✅' : '⚠️ '} Module ${d.modNum} : ${d.hasMission ? 'Mission/Classroom mentionné' : 'Pas de mission explicite'}`);
});

// ─── 4. PROMPTS PAR MODULE ───────────────────────────────────────────
console.log('\n🧰 4. PROMPTS & BOUTONS DE COPIE');
console.log('─'.repeat(50));
Object.values(allData).forEach(d => {
  const count = d.promptKeys.length;
  const ok = check(`Module ${d.modNum} : au moins 1 prompt copiable`, count >= 1, `Module ${d.modNum} n'a aucun prompt copiable`);
  console.log(`  ${ok ? '✅' : '⚠️ '} Module ${d.modNum} : ${count} prompt(s) copiable(s) → [${d.promptKeys.join(', ')}]`);
});

// ─── 5. VOLUME & ÉQUILIBRE ───────────────────────────────────────────
console.log('\n📏 5. VOLUME & ÉQUILIBRE DES MODULES');
console.log('─'.repeat(50));
const sizes = Object.values(allData).map(d => parseFloat(d.sizeKb));
const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
const slides = Object.values(allData).map(d => d.slideCount);
const avgSlides = slides.reduce((a, b) => a + b, 0) / slides.length;

Object.values(allData).forEach(d => {
  const sizeRatio = parseFloat(d.sizeKb) / avgSize;
  let sizeFlag = '✅';
  if (sizeRatio < 0.5) sizeFlag = '⚠️  TROP PETIT';
  if (sizeRatio > 2.0) sizeFlag = '⚠️  TROP GROS';
  console.log(`  ${sizeFlag} Module ${d.modNum} : ${d.sizeKb} KB, ${d.slideCount} slides, ${d.chapters.length} chapitres`);
});
console.log(`  📊 Moyenne : ${avgSize.toFixed(1)} KB, ${avgSlides.toFixed(1)} slides`);

// ─── 6. PROGRESSION PÉDAGOGIQUE ──────────────────────────────────────
console.log('\n🎯 6. PROGRESSION PÉDAGOGIQUE');
console.log('─'.repeat(50));

const expectedConcepts = {
  1:  { teaches: ['IA', 'LLM', 'hallucination'], requires: [] },
  2:  { teaches: ['écosystème', 'familles', 'outils'], requires: ['IA'] },
  3:  { teaches: ['C.O.R.E.', 'prompt', 'cadrage'], requires: ['outils'] },
  4:  { teaches: ['audit', 'ROI', 'tâches'], requires: ['prompt'] },
  5:  { teaches: ['PDF', 'NotebookLM', 'documents'], requires: ['prompt'] },
  6:  { teaches: ['Skill', 'Canvas', 'réflexe'], requires: ['prompt', 'audit'] },
  7:  { teaches: ['workflow', 'loop', 'HITL'], requires: ['Skill'] },
  8:  { teaches: ['Agent.md', 'mémoire', 'assistant'], requires: ['Skill'] },
  9:  { teaches: ['MCP', 'connecteur', 'moindre privilège'], requires: ['Agent.md'] },
  10: { teaches: ['agent IA', 'homologation', '5 tests'], requires: ['Agent.md', 'connecteur'] },
  11: { teaches: ['OpenAI', 'Claude', 'anti-hype'], requires: ['agent IA'] },
  12: { teaches: ['fact-checking', 'Source Checker', 'pyramide'], requires: ['prompt'] },
  13: { teaches: ['anonymisation', 'sécurité', 'Safety Card'], requires: ['documents'] },
  14: { teaches: ['automatisation', 'Automation Canvas', 'ROI'], requires: ['workflow'] },
  15: { teaches: ['soutenance', 'certification', 'portfolio'], requires: ['agent IA'] },
  16: { teaches: ['routine', 'AI Operating Plan', 'alumni'], requires: ['soutenance'] },
  17: { teaches: ['spécialisation', 'sectoriel', 'déontologie'], requires: ['Skill'] },
  18: { teaches: ['SLM', 'veille', 'feuille de route'], requires: ['agent IA'] },
};

Object.entries(expectedConcepts).forEach(([num, { teaches }]) => {
  const d = allData[parseInt(num)];
  if (!d) return;
  const html = fs.readFileSync(path.join(modulesDir, d.code, 'presentation.html'), 'utf8');
  const lower = html.toLowerCase();
  const missing = teaches.filter(concept => !lower.includes(concept.toLowerCase()));
  const ok = check(`Module ${d.modNum} : concepts attendus présents`, missing.length === 0, `Module ${d.modNum} manque les concepts: ${missing.join(', ')}`);
  console.log(`  ${ok ? '✅' : '⚠️ '} Module ${d.modNum} : ${missing.length === 0 ? 'Tous les concepts attendus sont présents' : 'Concepts manquants: ' + missing.join(', ')}`);
});

// ─── 7. COHÉRENCE VISUELLE ───────────────────────────────────────────
console.log('\n🎨 7. COHÉRENCE VISUELLE ENTRE MODULES');
console.log('─'.repeat(50));

// Jetons Hoja attendus dans les 18 modules (DESIGN_SYSTEM_HOJA.md §2)
const designTokens = [
  { name: 'Fond Hoja', pattern: '--bg: #090d16' },
  { name: 'Vert Hoja (marque)', pattern: '--teal: #10b981' },
  { name: 'Sky Hoja (info)', pattern: '--blue: #38bdf8' },
  { name: 'Surface carte', pattern: '--card: #111726' },
  { name: 'Marque vectorielle inline', pattern: 'M 680 200 A 380 380' },
  { name: 'Rayon standard', pattern: '--radius: 10px' },
  { name: 'Palier de rayons', pattern: '--radius-lg: 14px' },
  { name: 'Ombre standard', pattern: '--shadow:' },
  { name: 'Cible tactile 44 px', pattern: '--touch-min: 44px' },
  { name: 'Focus visible global', pattern: ':focus-visible' },
];

// Système de marque OPAYS proscrit (Phase H) — ne doit plus apparaître nulle part
const forbiddenTokens = [
  { name: 'Jeton OPAYS bleu', pattern: '--blue-opays' },
  { name: 'Jeton OPAYS or', pattern: '--gold-opays' },
  { name: 'Jeton OPAYS navy', pattern: '--navy' },
  { name: 'Or OPAYS', pattern: '#D4AF37' },
  { name: 'Bleu OPAYS', pattern: '#0066FF' },
  { name: 'Navy OPAYS', pattern: '#001f4d' },
  { name: 'Rayon 20 px', pattern: 'border-radius: 20px' },
  { name: 'Ombre spectaculaire', pattern: '34px 90px' },
  { name: 'Orbes décoratifs', pattern: 'class="ambient' },
  { name: 'Grain décoratif', pattern: 'class="grain"' },
  { name: 'Dégradé décoratif', pattern: 'gradient(' },
  { name: 'Police Inter non chargée', pattern: 'font-family: Inter' },
];

const moduleHtml = {};
Object.values(allData).forEach(d => {
  moduleHtml[d.modNum] = fs.readFileSync(path.join(modulesDir, d.code, 'presentation.html'), 'utf8');
});

let allDesignConsistent = true;
designTokens.forEach(token => {
  const missingIn = Object.entries(moduleHtml).filter(([, html]) => !html.includes(token.pattern)).map(([n]) => n);
  if (missingIn.length > 0) allDesignConsistent = false;
  console.log(`  ${missingIn.length === 0 ? '✅' : '⚠️ '} ${token.name} : ${missingIn.length === 0 ? '18/18' : 'manquant dans ' + missingIn.join(', ')}`);
});
forbiddenTokens.forEach(token => {
  const presentIn = Object.entries(moduleHtml).filter(([, html]) => html.includes(token.pattern)).map(([n]) => n);
  if (presentIn.length > 0) allDesignConsistent = false;
  console.log(`  ${presentIn.length === 0 ? '✅' : '⚠️ '} ${token.name} retiré : ${presentIn.length === 0 ? '18/18' : 'ENCORE PRÉSENT dans ' + presentIn.join(', ')}`);
});
check('Design system cohérent sur les 18 modules', allDesignConsistent, 'Design system incohérent');
console.log(allDesignConsistent ? '  🏆 Design system 100% cohérent sur les 18 modules' : '  ⚠️ Design system incohérent');

// ─── 8. REGISTRE vs PRÉSENTATIONS ────────────────────────────────────
console.log('\n📦 8. REGISTRE CENTRAL vs PRÉSENTATIONS');
console.log('─'.repeat(50));
Object.values(allData).forEach(d => {
  const reg = OPAYS_MODULES.find(m => m.num === d.num);
  const okSlides = check(`Module ${d.modNum} : compteur slides registre=${reg.slides} réel=${d.slideCount}`, reg.slides === d.slideCount, `Module ${d.modNum} : registre annonce ${reg.slides} slides, réel ${d.slideCount}`);
  const okPrompts = check(`Module ${d.modNum} : compteur prompts registre=${reg.prompts} réel=${d.promptKeys.length}`, reg.prompts === d.promptKeys.length, `Module ${d.modNum} : registre annonce ${reg.prompts} prompts, réel ${d.promptKeys.length}`);
  console.log(`  ${okSlides && okPrompts ? '✅' : '⚠️ '} Module ${d.modNum} : registre ${reg.slides} slides/${reg.prompts} prompts — réel ${d.slideCount} slides/${d.promptKeys.length} prompts`);
});

// ─── RAPPORT ─────────────────────────────────────────────────────────
console.log('\n' + '═'.repeat(70));
console.log('  📊 RAPPORT DE COHÉRENCE TRANSVERSALE');
console.log('═'.repeat(70));
console.log(`  Modules analysés : ${Object.keys(allData).length}`);
console.log(`  Vérifications : ${checks}`);
console.log(`  Issues détectées : ${issues.length}`);
if (issues.length > 0) {
  console.log('\n  Détail des issues :');
  issues.forEach(i => console.log(`   ❌ ${i}`));
  process.exitCode = 1;
} else {
  console.log('  ✅ AUCUNE ISSUE DE COHÉRENCE DÉTECTÉE');
}
console.log('═'.repeat(70));
