/**
 * OPAYS ACADEMY — Test du parcours formateur de bout en bout
 *
 * Simule l'expérience du formateur :
 *   PRÉPARATION : ouvre le Course Hub → voit les 18 modules → filtre → ouvre le dashboard
 *   SÉANCE      : sélectionne un module → timer 110 min → phases → notes → prompts → mission
 *   Work Kit    : lien fonctionnel
 *   Cohortes    : configuration data/cohorte.js (boutons Meet/Classroom si renseignés)
 *
 * Usage : node scripts/test_parcours_formateur.js
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

  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // ═══ PRÉPARATION — Course Hub ═══
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(pathToFileURL(path.join(DIRS.root, 'course-hub.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  const hub = await page.evaluate(() => ({
    cards: document.querySelectorAll('.module-card').length,
    weeks: document.querySelectorAll('.week-section').length,
    stats: document.getElementById('statModules').textContent,
    promts: document.getElementById('statPrompts').textContent,
    dashboardLink: !!document.querySelector('a[href="formateur-dashboard.html"]'),
  }));
  check('HUB : 18 modules affichés', hub.cards === 18, `${hub.cards} cartes`);
  check('HUB : 8 semaines affichées', hub.weeks === 8, `${hub.weeks} semaines`);
  check('HUB : stats calculées', hub.stats === '18' && hub.promts === '28', `modules=${hub.stats} prompts=${hub.promts}`);
  check('HUB : lien dashboard présent', hub.dashboardLink);

  // Filtre "Disponibles"
  const filtered = await page.evaluate(() => {
    filterModules('ready');
    return [...document.querySelectorAll('.module-card')].filter(c => c.style.display !== 'none').length;
  });
  check('HUB : filtre Disponibles fonctionne', filtered === 18, `${filtered} visibles`);

  // ═══ SÉANCE — Formateur Dashboard ═══
  await page.goto(pathToFileURL(path.join(DIRS.root, 'formateur-dashboard.html')).href, { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));

  const dash = await page.evaluate(() => ({
    options: document.querySelectorAll('#moduleSelect option').length,
    timer: document.getElementById('timerDisplay').textContent,
    phases: document.querySelectorAll('.phase-item').length,
    mission: document.getElementById('missionText').textContent.length,
    goal: document.getElementById('noteGoal').textContent.length,
    talk: document.getElementById('noteTalk').textContent.length,
    transition: document.getElementById('noteTransition').textContent.length,
    workKitHref: document.getElementById('workKitBtn').href,
    launchHref: document.getElementById('launchBtn').href,
  }));
  check('DASH : 18 modules sélectionnables', dash.options === 18, `${dash.options}`);
  check('DASH : timer initialisé', dash.timer === '01:50:00', dash.timer);
  check('DASH : 5 phases affichées', dash.phases === 5, `${dash.phases}`);
  check('DASH : mission non vide', dash.mission > 10);
  check('DASH : notes formateur (objectif/arguments/transition)', dash.goal > 5 && dash.talk > 5 && dash.transition > 5, `goal=${dash.goal} talk=${dash.talk} trans=${dash.transition}`);
  check('DASH : bouton Work Kit lié au template', dash.workKitHref.includes('TEMPLATE_MON_AI_WORK_KIT.md'), dash.workKitHref);
  check('DASH : bouton Lancer lié à la présentation', dash.launchHref.includes('01-comprendre-ia/presentation.html'), dash.launchHref);

  // Timer : démarrage / pause
  const timerStarted = await page.evaluate(() => { toggleTimer(); return document.getElementById('timerToggle').textContent; });
  check('DASH : timer démarre', timerStarted === '⏸', timerStarted);
  const timerStopped = await page.evaluate(() => { toggleTimer(); return document.getElementById('timerToggle').textContent; });
  check('DASH : timer se met en pause', timerStopped === '▶', timerStopped);

  // Sélection d'un autre module (M18 — durée 95 min)
  await page.select('#moduleSelect', '18');
  await new Promise(r => setTimeout(r, 400));
  const m18 = await page.evaluate(() => ({
    timer: document.getElementById('timerDisplay').textContent,
    title: document.getElementById('slideTitle').textContent,
    chips: document.querySelectorAll('.prompt-chip').length,
    phases: document.querySelectorAll('.phase-item').length,
  }));
  check('DASH : M18 charge (titre)', m18.title.includes('AI Landscape'), m18.title);
  check('DASH : M18 timer ajusté (95 min)', m18.timer === '01:35:00', m18.timer);
  check('DASH : M18 prompts affichés (2)', m18.chips === 2, `${m18.chips}`);
  check('DASH : M18 5 phases', m18.phases === 5, `${m18.phases}`);

  // Clavier : espace = pause/play
  const spaceOk = await page.evaluate(() => {
    const before = document.getElementById('timerToggle').textContent;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    return document.getElementById('timerToggle').textContent !== before;
  });
  check('DASH : raccourci espace (timer)', spaceOk);

  check('DASH : aucune erreur JS', errors.length === 0, errors.slice(0, 2).join(' | '));

  // ═══ Vérification des liens de lancement pour TOUS les modules ═══
  let linksOk = true;
  for (const mod of modules) {
    const href = await page.evaluate((num) => {
      const opt = [...document.querySelectorAll('#moduleSelect option')].find(o => o.value === String(num));
      if (opt) { document.querySelector('#moduleSelect').value = opt.value; document.querySelector('#moduleSelect').dispatchEvent(new Event('change')); }
      return document.getElementById('launchBtn').href;
    }, mod.num);
    if (!href.includes(`modules/${mod.code}/presentation.html`)) { linksOk = false; failures.push(`lien module ${mod.num} invalide → ${href}`); }
  }
  check('DASH : liens de lancement valides pour les 18 modules', linksOk);

  await page.close();
  await browser.close();

  console.log('\n' + '═'.repeat(60));
  console.log('  👨‍🏫 TEST PARCOURS FORMATEUR (BOUT EN BOUT)');
  console.log('═'.repeat(60));
  console.log(`  Tests : ${total}`);
  console.log(`  Réussis : ${passed}`);
  console.log(`  Échecs : ${total - passed}`);
  if (failures.length) {
    failures.forEach(f => console.log(`   ❌ ${f}`));
    process.exitCode = 1;
  } else {
    console.log('  ✅ LE FORMATEUR PEUT PRÉPARER ET CONDUIRE UNE SÉANCE COMPLÈTE');
  }
})();
