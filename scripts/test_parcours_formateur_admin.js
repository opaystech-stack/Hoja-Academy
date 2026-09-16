#!/usr/bin/env node
/**
 * OPAYS ACADEMY — Test PARCOURS FORMATEUR sur le BUILD ADMIN (admin/)
 * Complément de test_parcours_formateur.js qui, lui, valide les fichiers RACINE.
 * Celui-ci vérifie ce qui est réellement servi dans /admin/ après build_admin.js :
 *   - hub : 18 cartes, liens modules/NN/index.html existants, aucune référence morte 'course-hub.html'
 *   - dashboard : options 18, liens lancer -> modules/NN/index.html existants, hub 'index.html',
 *                 aucun 'course-hub.html', timer/mission/chips rendus sans erreur console
 *   - classroom.html : load() défini (pas de loadAll fantôme), fetch endpoints /api/* présents
 * Usage : node scripts/test_parcours_formateur_admin.js   (après node scripts/build_admin.js)
 */
'use strict';
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const ADMIN = path.join(DIRS.root, 'admin');
let total = 0, passed = 0; const failures = [];
function check(name, ok, detail) {
  total++; if (ok) passed++; else failures.push(name + (detail ? ` → ${detail}` : ''));
  console.log(`  ${ok ? '✅' : '❌'} ${name}${detail && !ok ? ` [${detail}]` : ''}`);
}

function findBrowser() {
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA + '/Google/Chrome/Application/chrome.exe',
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  throw new Error('Chrome introuvable');
}

(async () => {
  // ═══ Vérifications statiques (sans navigateur) ═══
  const hub = fs.readFileSync(path.join(ADMIN, 'index.html'), 'utf8');
  check('HUB admin existe', fs.existsSync(path.join(ADMIN, 'index.html')));
  check('HUB : plus aucune référence morte vers course-hub.html', !hub.includes('course-hub.html'));
  const dash = fs.readFileSync(path.join(ADMIN, 'formateur-dashboard.html'), 'utf8');
  check('DASH admin : plus aucun lien course-hub.html (corrigé par build)', !dash.includes('course-hub.html'));
  check('DASH admin : liens vers index.html (hub local)', dash.includes('href="index.html"') || dash.includes("'index.html'"));
  const classroom = fs.readFileSync(path.join(ADMIN, 'classroom.html'), 'utf8');
  check('CLASSROOM admin : loadAll() résolu (aucun appel fantôme)', !classroom.includes('loadAll()'));
  check('CLASSROOM admin : fetch des endpoints réels du gateway', /\/api\/classroom\/(status|courses|students)/.test(classroom));

  let missing = 0;
  for (let i = 1; i <= 18; i++) {
    const p = path.join(ADMIN, 'modules', String(i).padStart(2, '0'), 'index.html');
    if (!fs.existsSync(p)) missing++;
    else {
      const t = fs.readFileSync(p, 'utf8');
      if (!t.includes('notesPanel')) missing++;
    }
  }
  check('18/18 présentations admin présentes avec panneau notes', missing === 0, `${missing} manquantes`);

  // ═══ Vérifications navigateur (dashboard admin chargé en file://) ═══
  const browser = await puppeteer.launch({ executablePath: findBrowser(), headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message).slice(0, 80)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 80)); });

  await page.goto(pathToFileURL(path.join(ADMIN, 'formateur-dashboard.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 800));
  const opts = await page.$$eval('#moduleSelect option', (o) => o.length).catch(() => 0);
  check('DASH : 18 options de module', opts === 18, `${opts}`);
  const timer = await page.$eval('.timer-display', (el) => el.textContent.trim()).catch(() => '');
  check('DASH : timer rendu', /\d/.test(timer), timer);
  const mission = await page.$eval('#missionText, [id*=mission]', (el) => el.textContent.trim()).catch(() => '');
  check('DASH : mission du module 1 affichée', mission.length > 10, mission.slice(0, 50));
  const chips = await page.$$eval('.prompt-chip', (c) => c.length).catch(() => 0);
  check('DASH : chips prompts rendus', chips >= 1, `${chips}`);
  const chipLabel = await page.$eval('.prompt-chip', (el) => el.textContent).catch(() => '');
  check('DASH : libellé chip honnête (ne promet plus de copier)', !/cliquer pour copier/i.test(chipLabel));

  let linksOk = true; let badHref = '';
  for (const mod of modules) {
    const href = await page.evaluate((num) => {
      const sel = document.querySelector('#moduleSelect');
      const opt = [...sel.options].find((o) => o.value === String(num));
      if (opt) { sel.value = opt.value; sel.dispatchEvent(new Event('change')); }
      return document.getElementById('launchBtn').href;
    }, mod.num);
    const expect = `admin/modules/${String(mod.num).padStart(2, '0')}/index.html`;
    if (!href.replace(/\\/g, '/').endsWith(expect)) { linksOk = false; badHref = `M${mod.num} → ${href}`; break; }
  }
  check('DASH : les 18 boutons Lancer pointent vers modules/NN/index.html du build', linksOk, badHref);

  await page.goto(pathToFileURL(path.join(ADMIN, 'index.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise((r) => setTimeout(r, 600));
  const cards = await page.$$eval('.module-card', (c) => c.length).catch(() => 0);
  check('HUB : 18 cartes modules rendues', cards === 18, `${cards}`);
  const notesAnchors = await page.$$eval('a[href$="#notes"]', (a) => a.length).catch(() => 0);
  check('HUB : liens Notes formateur présents (#notes géré par le template)', notesAnchors === 18, `${notesAnchors}`);

  check('ADMIN : aucune erreur JS console sur hub/dashboard', errors.length === 0, errors.slice(0, 2).join(' | '));

  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('  👨‍🏫 TEST PARCOURS FORMATEUR — BUILD ADMIN');
  console.log('═'.repeat(60));
  console.log(`  Tests : ${total}`);
  console.log(`  Réussis : ${passed}`);
  console.log(`  Échecs : ${total - passed}`);
  if (failures.length) { failures.forEach((f) => console.log(`   ❌ ${f}`)); process.exitCode = 1; }
  else console.log('  ✅ L\u2019ESPACE ADMIN BUILDÉ EST OPÉRATIONNEL (hubs, dashboard, classroom, 18 modules)');
})().catch((e) => { console.error(e); process.exitCode = 1; });
