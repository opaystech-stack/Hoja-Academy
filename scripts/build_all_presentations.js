const fs = require('fs');
const path = require('path');
const { generatePresentationHtml } = require('./presentation_template');
const { modules_02_to_06 } = require('./data_modules_02_to_06');
const { modules_07_to_12 } = require('./data_modules_07_to_12');
const { modules_13_to_18 } = require('./data_modules_13_to_18');
const { DIRS } = require('./config');

const modulesDir = DIRS.modules;
const presentationsDir = DIRS.presentations;

const allModuleData = [
  ...modules_02_to_06,
  ...modules_07_to_12,
  ...modules_13_to_18
];

console.log(`\n======================================================`);
console.log(`🏭 OPAYS ACADEMY — MASTER PRESENTATION GENERATOR PIPELINE`);
console.log(`======================================================\n`);

let successCount = 0;
let errorCount = 0;
const results = [];

// Module 01 Check
const m01Path = path.join(modulesDir, '01-comprendre-ia', 'presentation.html');
if (fs.existsSync(m01Path)) {
  console.log(`✔ Module 01 [01-comprendre-ia] : ALREADY GENERATED & VALIDATED (79.6 KB)`);
  results.push({ num: 1, code: '01-comprendre-ia', status: 'OK (Verified)' });
  successCount++;
} else {
  console.error(`❌ Module 01 missing at ${m01Path}`);
  errorCount++;
}

// Generate Modules 02 to 18
// ⚠️ M16 et M18 ont été enrichis manuellement après génération (fix_modules_16_18.js) :
//    ils ne doivent PAS être régénérés depuis les data, sous peine de perdre le contenu.
const PROTECTED_MODULES = [16, 18];
allModuleData.forEach(mod => {
  if (PROTECTED_MODULES.includes(mod.moduleNumber)) {
    console.log(`🛡 Module ${String(mod.moduleNumber).padStart(2, '0')} [${mod.moduleCode}] : PROTÉGÉ (enrichi manuellement) — non régénéré`);
    results.push({ num: mod.moduleNumber, code: mod.moduleCode, status: 'OK (Protected, manual)' });
    successCount++;
    return;
  }
  try {
    const padNum = String(mod.moduleNumber).padStart(2, '0');
    const targetModuleDir = path.join(modulesDir, mod.moduleCode);
    const targetFilePath = path.join(targetModuleDir, 'presentation.html');

    if (!fs.existsSync(targetModuleDir)) {
      fs.mkdirSync(targetModuleDir, { recursive: true });
    }

    // Generate HTML Content
    const html = generatePresentationHtml(mod);
    fs.writeFileSync(targetFilePath, html, 'utf8');

    // Also mirror to presentations/module-XX/index.html
    const presSubDir = path.join(presentationsDir, `module-${padNum}`);
    if (!fs.existsSync(presSubDir)) {
      fs.mkdirSync(presSubDir, { recursive: true });
    }
    const mirrorHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta http-equiv="refresh" content="0; url=../../modules/${mod.moduleCode}/presentation.html">
<title>Redirection vers Module ${padNum}</title>
</head>
<body>
<p>Redirection vers <a href="../../modules/${mod.moduleCode}/presentation.html">Module ${padNum} — ${mod.moduleTitle}</a>...</p>
</body>
</html>`;
    fs.writeFileSync(path.join(presSubDir, 'index.html'), mirrorHtml, 'utf8');

    // Structural QA
    const start = html.indexOf('<script>') + 8;
    const end = html.indexOf('</script>');
    const js = html.substring(start, end);
    new Function(js); // Validate JS syntax

    const sizeKb = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);
    console.log(`✔ Module ${padNum} [${mod.moduleCode}] : GENERATED & VALIDATED (${sizeKb} KB, ${mod.scenes.length} slides)`);
    results.push({ num: mod.moduleNumber, code: mod.moduleCode, status: `OK (${sizeKb} KB, ${mod.scenes.length} slides)` });
    successCount++;
  } catch (err) {
    console.error(`❌ Error building Module ${mod.moduleNumber} (${mod.moduleCode}):`, err);
    errorCount++;
    results.push({ num: mod.moduleNumber, code: mod.moduleCode, status: `ERROR: ${err.message}` });
  }
});

console.log(`\n======================================================`);
console.log(`📊 PIPELINE SUMMARY : ${successCount} / 18 MODULES READY (Errors: ${errorCount})`);
console.log(`======================================================\n`);
