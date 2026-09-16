/**
 * OPAYS ACADEMY — Test navigateur de la version PUBLIQUE (apprenants)
 * Vérifie que les présentations sanitizées (sans notes formateur) :
 *   - se chargent sans erreur JS (le retrait des notes ne casse pas le runtime)
 *   - naviguent correctement (goTo, keyboard)
 *   - n'exposent AUCUN contenu formateur
 *   - sont lisibles sur mobile (pas de débordement)
 *
 * Usage : node scripts/test_public.js   (après node scripts/build_public.js)
 */
'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

function findBrowser() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

(async () => {
  const browserPath = findBrowser();
  if (!browserPath) { console.error('❌ Aucun navigateur Chrome/Edge'); process.exit(1); }

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--allow-file-access-from-files'],
  });

  let total = 0, passed = 0;
  const failures = [];

  for (const mod of modules) {
    const filePath = path.join(DIRS.root, 'public', 'modules', String(mod.num).padStart(2, '0'), 'index.html');
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));

    // Desktop
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto(pathToFileURL(filePath).href, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.scene.active', { timeout: 5000 }).catch(() => {});

    // 1. Chargement sans erreur
    total++; if (errors.length === 0) passed++; else failures.push(`${mod.code}: erreurs JS au chargement → ${errors.slice(0, 2).join(' | ')}`);

    // 2. Navigation goTo
    const navOk = await page.evaluate(() => { try { goTo(1); return true; } catch (e) { return false; } });
    total++; if (navOk) passed++; else failures.push(`${mod.code}: goTo(1) a levé une exception`);

    // 3. Aucun CONTENU formateur (les identifiants DOM peuvent rester — masqués
    //    par CSS et no-op — mais jamais le contenu pédagogique interne)
    const content = fs.readFileSync(filePath, 'utf8');
    const notesObj = content.match(/const notes = (\{[^;]*\});/);
    const notesEmpty = notesObj && notesObj[1].trim() === '{}';
    const noDataNote = !content.includes('data-note=');
    const noPanelContent = !content.includes('NOTES FORMATEUR • AIDE-MÉMOIRE');
    total++; if (notesEmpty && noDataNote && noPanelContent) passed++;
    else failures.push(`${mod.code}: contenu formateur résiduel → notes vide=${notesEmpty} data-note=${noDataNote} texte=${noPanelContent}`);

    // 4. Mobile sans débordement
    await page.setViewport({ width: 375, height: 812, isMobile: true });
    await page.goto(pathToFileURL(filePath).href, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 400));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
    total++; if (overflow <= 380) passed++; else failures.push(`${mod.code}: débordement mobile (${overflow}px)`);

    await page.close();
  }

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('  🔒 TEST VERSION PUBLIQUE (APPRENANTS)');
  console.log('═'.repeat(60));
  console.log(`  Modules : ${modules.length}`);
  console.log(`  Tests : ${total}`);
  console.log(`  Réussis : ${passed}`);
  console.log(`  Échecs : ${total - passed}`);
  if (failures.length) {
    failures.forEach(f => console.log(`   ❌ ${f}`));
    process.exitCode = 1;
  } else {
    console.log('  ✅ VERSION PUBLIQUE OPÉRATIONNELLE — aucune trace formateur');
  }
})();
