const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const modulesDir = DIRS.modules;

console.log(`\n======================================================`);
console.log(`🔍 OPAYS ACADEMY — DEEP PRESENTATION QA BENCH (18/18)`);
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

  // 4. Check OPAYS Branding
  const hasOpaysLogo = html.includes('M 680 200 A 380 380');
  const hasBlueOpays = html.includes('--blue-opays');

  if (!hasOpaysLogo || !hasBlueOpays) {
    console.error(`❌ Module ${modNum} [${modCode}] : BRANDING ASSETS MISSING`);
    totalFailed++;
    return;
  }

  console.log(`✅ Module ${modNum} [${modCode}] : PASS (${sizeKb} KB, ${sceneMatches.length} slides, ${copyMatches.length} prompts, JS OK, Brand OK)`);
  totalPassed++;
});

console.log(`\n======================================================`);
console.log(`🏆 FINAL QA REPORT : ${totalPassed} / 18 MODULES VALIDATED (Failures: ${totalFailed})`);
console.log(`======================================================\n`);
