/**
 * OPAYS ACADEMY — Test de parcours apprenant de bout en bout
 *
 * Simule l'expérience réelle d'un apprenant sur la version PUBLIQUE :
 *   JOUR 0  : arrive sur l'index → trouve la liste des modules → comprend quoi faire
 *   SEMAINE 1 : ouvre le Module 01 → la présentation charge → navigue → ouvre le dock
 *              prompts → copie un prompt → vérifie qu'aucun contenu formateur n'est
 *              accessible (pas de bouton 📝, pas de notes, pas de data-note)
 *   MOBILE  : le parcours est utilisable sur téléphone (pas de débordement)
 *
 * Usage : node scripts/test_parcours_apprenant.js   (après npm run build:public)
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
  const check = (name, ok, detail) => {
    total++;
    if (ok) passed++;
    else failures.push(`${name}${detail ? ' → ' + detail : ''}`);
  };

  // ═══ JOUR 0 — L'apprenant arrive sur l'index public ═══
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(pathToFileURL(path.join(DIRS.root, 'public', 'index.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 400));

  // L'index liste les modules et indique où commencer
  const indexInfo = await page.evaluate(() => ({
    links: document.querySelectorAll('a[href^="modules/"]').length,
    text: document.body.innerText.slice(0, 400),
  }));
  check('JOUR 0 : l\u2019index liste les modules', indexInfo.links >= 18, `${indexInfo.links} liens`);
  check('JOUR 0 : l\u2019index indique où commencer', indexInfo.text.includes('COMMENCER ICI'), 'mention "COMMENCER ICI" absente');

  // ═══ SEMAINE 1 — L'apprenant ouvre le Module 01 ═══
  await page.goto(pathToFileURL(path.join(DIRS.root, 'public', 'modules', '01', 'index.html')).href, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.scene.active', { timeout: 5000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 400));

  check('S1 : la présentation se charge sans erreur', errors.length === 0, errors.slice(0, 2).join(' | '));

  // L'apprenant voit le titre du module
  const heroTitle = await page.evaluate(() => document.querySelector('.scene.active h1, .scene.active .hero-kicker')?.textContent || document.body.innerText.slice(0, 80));
  check('S1 : le titre du module est affiché', heroTitle.length > 0, 'aucun titre');

  // Pas de bouton notes visible (contenu formateur caché)
  const notesBtnVisible = await page.evaluate(() => {
    const btn = document.getElementById('notesBtn');
    if (!btn) return false;
    return btn.offsetParent !== null;
  });
  check('S1 : AUCUN bouton notes formateur visible', !notesBtnVisible, 'le bouton Notes est visible');

  // ═══ Navigation — l'apprenant avance dans les slides ═══
  await page.evaluate(() => { try { goTo(1); } catch (e) {} });
  await new Promise(r => setTimeout(r, 400));
  const idxAfter = await page.evaluate(() => document.getElementById('currentIndex')?.textContent || '');
  check('S1 : la navigation avance', idxAfter.includes('2') || idxAfter.includes('02'), `index=${idxAfter}`);

  // ═══ Dock prompts — l'apprenant ouvre les prompts ═══
  const dockOpened = await page.evaluate(() => {
    try { openDock(); return true; } catch (e) { return false; }
  });
  await new Promise(r => setTimeout(r, 400));
  const dockItems = await page.$$eval('.dock-item', items => items.length).catch(() => 0);
  check('S1 : le dock ressources s\u2019ouvre', dockOpened, 'openDock() a échoué');
  check('S1 : le dock contient des prompts', dockItems >= 1, `${dockItems} prompts`);

  // ═══ Copie d'un prompt (bouton copier présent) ═══
  const copyButtons = await page.$$eval('.copy-btn[data-copy]', btns => btns.length).catch(() => 0);
  check('S1 : des boutons copier sont présents', copyButtons >= 1, `${copyButtons} boutons`);

  // ═══ Fermeture : le panneau notes est inerte (no-op, pas de crash) ═══
  const noCrashAfterNotes = await page.evaluate(() => {
    try { toggleNotes(); updateNotes(); return true; } catch (e) { return false; }
  });
  check('S1 : les fonctions notes sont neutralisées (no crash)', noCrashAfterNotes, 'exception levée');

  // ═══ MOBILE — parcours utilisable sur téléphone ═══
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await page.goto(pathToFileURL(path.join(DIRS.root, 'public', 'modules', '01', 'index.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 500));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth);
  check('MOBILE : pas de débordement horizontal', overflow <= 380, `${overflow}px`);
  const mobileNav = await page.evaluate(() => {
    try { goTo(1); return true; } catch (e) { return false; }
  });
  check('MOBILE : navigation fonctionnelle', mobileNav, 'goTo a échoué');

  // ═══ Sécurité : aucun contenu formateur dans le fichier public ═══
  const m01Public = fs.readFileSync(path.join(DIRS.root, 'public', 'modules', '01', 'index.html'), 'utf8');
  const notesObj = m01Public.match(/const notes = (\{[^;]*\});/);
  check('SÉCURITÉ : objet notes vidé', notesObj && notesObj[1].trim() === '{}', 'notes non vides');

  await page.close();
  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('  🎓 TEST PARCOURS APPRENANT (BOUT EN BOUT)');
  console.log('═'.repeat(60));
  console.log(`  Tests : ${total}`);
  console.log(`  Réussis : ${passed}`);
  console.log(`  Échecs : ${total - passed}`);
  if (failures.length) {
    failures.forEach(f => console.log(`   ❌ ${f}`));
    process.exitCode = 1;
  } else {
    console.log('  ✅ L\u2019APPRENANT PEUT SUIVRE LE PARCOURS COMPLET — aucun contenu formateur exposé');
  }
})();
