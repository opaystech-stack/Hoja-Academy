const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const modulesDir = DIRS.modules;

console.log(`\n======================================================`);
console.log(`🔍 HOJA ACADEMY — DEEP PRESENTATION QA BENCH (18/18)`);
console.log(`======================================================\n`);

// Liste des modules depuis le registre central (source de vérité unique)
const moduleList = modules.map(m => m.code);

let totalPassed = 0;
let totalFailed = 0;

moduleList.forEach((modCode, idx) => {
  const modNum = modules[idx] ? String(modules[idx].num).padStart(2, '0') : String(idx + 1).padStart(2, '0');
  const filePath = path.join(modulesDir, modCode, 'presentation.html');

  if (!fs.existsSync(filePath)) {
    console.error(`❌ Module ${modNum} [${modCode}] : FILE MISSING at ${filePath}`);
    totalFailed++;
    return;
  }

  const html = fs.readFileSync(filePath, 'utf8');
  const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);

  // 1. Script & Syntax
  const scriptStart = html.indexOf('<script>') + 8;
  const scriptEnd = html.indexOf('</script>');
  if (scriptStart === -1 || scriptEnd === -1) {
    console.error(`❌ Module ${modNum} [${modCode}] : SCRIPT TAGS MISSING`);
    totalFailed++;
    return;
  }

  const js = html.substring(scriptStart, scriptEnd);
  try {
    new Function(js);
  } catch (err) {
    console.error(`❌ Module ${modNum} [${modCode}] : JS SYNTAX ERROR:`, err.message);
    totalFailed++;
    return;
  }

  // 2. Check Scenes
  const sceneMatches = [...html.matchAll(/class="scene[^"]*"[^>]*data-note="([^"]+)"[^>]*data-title="([^"]+)"/g)];
  if (sceneMatches.length === 0) {
    console.error(`❌ Module ${modNum} [${modCode}] : NO SCENES FOUND`);
    totalFailed++;
    return;
  }

  // 3. Check Copy Buttons
  const copyMatches = [...html.matchAll(/data-copy="([^"]+)"/g)];

  // 4. Identité Hoja (Phase H) — le système de marque OPAYS est proscrit :
  //    or #D4AF37, bleu #0066FF, navy #001F4D, rayon 20 px, ombre spectaculaire,
  //    orbes/dégradés décoratifs, emojis dans le chrome fonctionnel.
  const HOJA_FORBIDDEN = [
    ['--blue-opays', 'jeton OPAYS bleu'],
    ['--gold-opays', 'jeton OPAYS or'],
    ['--navy', 'jeton OPAYS navy'],
    ['#D4AF37', 'or OPAYS'],
    ['#0066FF', 'bleu OPAYS'],
    ['#001f4d', 'navy OPAYS'],
    ['border-radius: 20px', 'rayon 20 px'],
    ['34px 90px', 'ombre spectaculaire'],
    ['class="ambient', 'orbes décoratifs'],
    ['class="grain"', 'grain décoratif'],
    ['gradient(', 'dégradé décoratif'],
    ['font-family: Inter', 'police Inter non chargée'],
  ];
  // Aucun emoji nulle part (règle utilisateur explicite). Les flèches
  // typographiques (→ ←) et les cases à cocher (□) ne sont pas des emojis.
  const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B00}-\u{2BFF}]/gu;
  const emojiFound = [...new Set(html.match(EMOJI_RE) || [])];

  const hasHojaMark = html.includes('M 680 200 A 380 380') && html.includes('stroke="#0b1220"');
  const hasHojaTokens = html.includes('--teal: #10b981;') && html.includes('--radius: 10px;');

  const violations = [
    ...HOJA_FORBIDDEN.filter(([needle]) => html.includes(needle)).map(([, name]) => name),
    ...emojiFound.map((e) => `emoji « ${e} »`),
  ];

  if (!hasHojaMark || !hasHojaTokens || violations.length) {
    const why = [
      !hasHojaMark ? 'marque vectorielle Hoja absente' : null,
      !hasHojaTokens ? 'jetons Hoja absents' : null,
      violations.length ? violations.join(', ') : null,
    ].filter(Boolean).join(' · ');
    console.error(`❌ Module ${modNum} [${modCode}] : IDENTITÉ HOJA NON CONFORME → ${why}`);
    totalFailed++;
    return;
  }

  console.log(`✅ Module ${modNum} [${modCode}] : PASS (${sizeKb} KB, ${sceneMatches.length} slides, ${copyMatches.length} prompts, JS OK, Brand OK)`);
  totalPassed++;
});

console.log(`\n======================================================`);
console.log(`🏆 FINAL QA REPORT : ${totalPassed} / 18 MODULES VALIDATED (Failures: ${totalFailed})`);
console.log(`======================================================\n`);
