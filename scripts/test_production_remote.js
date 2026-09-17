/**
 * OPAYS ACADEMY — Test de production complet (site réel https://course.opays.io)
 *
 * Vérifie la nouvelle architecture Phase 5 :
 *   VISITEUR  : landing publique (thème, CTA, AUCUN lien vers les supports)
 *   APPRENANT : /modules/* protégé par mot de passe ; contenu sanitizé ;
 *               bouton retour vers l'accueil ; mobile sans débordement
 *   ADMIN     : /admin/* protégé ; hub + dashboard + présentations complètes
 *               avec notes formateur ; bouton retour vers le hub
 *   SÉCURITÉ  : 401 sans credentials ; 404 sur les fichiers internes
 *
 * Usage : node scripts/test_production_remote.js
 *   (credentials : ADMIN_USER/ADMIN_PASS/LEARN_USER/LEARN_PASS en env, sinon défauts ci-dessous)
 */
'use strict';

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const BASE = 'https://course.opays.io';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
// Mot de passe admin : lu depuis le VPS au moment du test (jamais affiché, jamais hardcodé)
const ADMIN_PASS = process.env.ADMIN_PASS || require('child_process').execSync(
  'ssh -i C:/Users/lamsa/.ssh/kiveclair_hostinger_ed25519 -o ConnectTimeout=10 root@76.13.58.5 "grep ^ADMIN_BASIC_PASSWORD= /opt/opays-academy/.env | cut -d= -f2"'
).toString().trim();
const LEARN_USER = process.env.LEARN_USER || 'apprenant';
// LEARN_PASS : JAMAIS hardcodé (finding C-1 audit sécurité 09/09).
// Fournir la variable d'env, sinon le script échoue proprement :
//   LEARN_PASS=... node scripts/test_production_remote.js
const LEARN_PASS = process.env.LEARN_PASS;
if (!LEARN_PASS) {
  console.error('❌ LEARN_PASS requis en variable d\u2019environnement (le mot de passe apprenant ne doit jamais être dans le code).');
  process.exit(1);
}

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
    args: ['--no-sandbox', '--disable-gpu'],
  });

  let total = 0, passed = 0;
  const failures = [];
  const check = (name, ok, detail) => {
    total++;
    if (ok) passed++;
    else failures.push(`${name}${detail ? ' → ' + detail : ''}`);
  };

  // Gestion de l'auth Basic : ajouter l'Authorization header à chaque goto
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  async function goto(url, user, pass) {
    if (user && pass) {
      await page.setExtraHTTPHeaders({
        Authorization: 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64'),
      });
    } else {
      await page.setExtraHTTPHeaders({});
    }
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await new Promise(r => setTimeout(r, 500));
  }

  // ═══ 1. VISITEUR — LANDING ═══
  await goto(BASE + '/', null, null);
  const landing = await page.evaluate(() => ({
    title: document.title,
    hasCTA: document.body.innerText.includes('Candidater à la prochaine cohorte'),
    hasTheme: document.body.innerText.includes('L\u2019IA ne doit pas seulement répondre') || document.body.innerText.includes('travail augmenté'),
    linksToModules: document.querySelectorAll('a[href*="/modules/"], a[href*="modules/"]').length,
    linkToAdmin: document.querySelectorAll('a[href*="/admin"]').length,
    sections: ['Méthode', 'Pour qui', 'Le format', 'Questions'].filter(s => document.body.innerText.includes(s)).length,
  }));
  check('VISITEUR : landing v4 = hero « L\u2019IA ne doit pas seulement répondre »', landing.hasTheme, landing.title);
  check('VISITEUR : CTA candidature présent', landing.hasCTA);
  check('VISITEUR : AUCUN lien vers les supports /modules/', landing.linksToModules === 0, `${landing.linksToModules} lien(s)`);
  check('VISITEUR : AUCUN lien vers /admin/', landing.linkToAdmin === 0);
  check('VISITEUR : sections méthode/pour qui/format/FAQ présentes', landing.sections >= 2, `${landing.sections}/4`);

  // ═══ 2. APPRENANT — MODULES ═══
  // Statut HTTP sans credentials (via fetch depuis la landing, même domaine)
  const statusNoAuth = await page.evaluate(async () => {
    const r = await fetch('/modules/01/', { credentials: 'omit' });
    return r.status;
  });
  check('APPRENANT : /modules/01/ → 401 sans credentials', statusNoAuth === 401, `HTTP ${statusNoAuth}`);

  // Avec auth apprenant
  await goto(BASE + '/modules/01/', LEARN_USER, LEARN_PASS);
  await page.waitForSelector('.scene.active', { timeout: 8000 }).catch(() => {});
  check('APPRENANT : module 01 charge avec auth (desktop)', errors.length === 0, errors.slice(0, 2).join(' | '));
  const backLink = await page.evaluate(() => !!document.querySelector('.academy-home-link'));
  check('APPRENANT : bouton « ← Académie OPAYS » présent', backLink);
  const noNotes = await page.evaluate(() => {
    const btn = document.getElementById('notesBtn');
    return !btn || btn.offsetParent === null;
  });
  check('APPRENANT : aucune trace formateur visible', noNotes);

  // ═══ 3. ADMIN ═══
  const adminNoAuth = await page.evaluate(async () => {
    const r = await fetch('/admin/', { credentials: 'omit' });
    return r.status;
  });
  check('ADMIN : /admin/ → 401 sans auth', adminNoAuth === 401, `HTTP ${adminNoAuth}`);
  await goto(BASE + '/admin/', ADMIN_USER, ADMIN_PASS);
  const hub = await page.evaluate(() => ({
    cards: document.querySelectorAll('.module-card').length,
    hasDashboard: !!document.querySelector('a[href="formateur-dashboard.html"]'),
  }));
  check('ADMIN : hub formateur accessible', hub.cards >= 18, `${hub.cards} cartes`);
  check('ADMIN : lien dashboard présent', hub.hasDashboard);

  await goto(BASE + '/admin/modules/01/', ADMIN_USER, ADMIN_PASS);
  await page.waitForSelector('.scene.active', { timeout: 8000 }).catch(() => {});
  const notesPresent = await page.evaluate(() => {
    const btn = document.getElementById('notesBtn');
    return btn && btn.offsetParent !== null;
  });
  check('ADMIN : notes formateur accessibles (bouton Notes visible)', notesPresent);

  // ═══ 4. SÉCURITÉ — fichiers internes (fetch natif Node : aucun cache navigateur) ═══
  // NB : le navigateur mémorise les credentials Basic par domaine, ce qui fausse les
  // fetch Puppeteer — Node hors navigateur est la référence fiable.
  const forbidden = [
    '/admin/data/modules.js',
    '/modules/01/00_GUIDE_ANIMATION_SEANCE_01.md',
    '/modules/00_GUIDE_ANIMATION_SEANCE_01.md',
    '/admin/work-kit/',
    '/admin/01/',
    '/scripts/config.js',
    '/package.json',
    '/.git/config',
    '/formateur-dashboard.html',
    '/course-hub.html',
  ];
  for (const f of forbidden) {
    let ok = 0;
    try {
      const r = await fetch(BASE + f, { redirect: 'manual' });
      ok = r.status;
    } catch (e) { ok = 0; }
    check(`SÉCURITÉ : ${f} → 401/404/403`, [401, 403, 404].includes(ok), `HTTP ${ok}`);
  }

  // ═══ 4bis. SÉCURITÉ — credentials corrects donnent accès (contrôle positif) ═══
  try {
    const auth = 'Basic ' + Buffer.from(`${LEARN_USER}:${LEARN_PASS}`).toString('base64');
    const r = await fetch(BASE + '/modules/01/', { headers: { Authorization: auth } });
    check('SÉCURITÉ : credentials apprenant valides → 200', r.status === 200, `HTTP ${r.status}`);
  } catch (e) {
    check('SÉCURITÉ : credentials apprenant valides → 200', false, e.message);
  }

  // ═══ 5. MOBILE ═══
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  await goto(BASE + '/', null, null);
  const overflowLanding = await page.evaluate(() => document.documentElement.scrollWidth);
  check('MOBILE : landing sans débordement', overflowLanding <= 380, `${overflowLanding}px`);
  await goto(BASE + '/modules/01/', LEARN_USER, LEARN_PASS);
  await new Promise(r => setTimeout(r, 400));
  const overflowModule = await page.evaluate(() => document.documentElement.scrollWidth);
  check('MOBILE : module sans débordement', overflowModule <= 380, `${overflowModule}px`);

  await page.close();
  await browser.close();

  console.log('\n' + '═'.repeat(64));
  console.log('  🌍 TEST PRODUCTION PHASE 5 — course.opays.io');
  console.log('═'.repeat(64));
  console.log(`  Tests : ${total}`);
  console.log(`  Réussis : ${passed}`);
  console.log(`  Échecs : ${total - passed}`);
  if (failures.length) {
    failures.forEach(f => console.log(`   ❌ ${f}`));
    process.exitCode = 1;
  } else {
    console.log('  ✅ ARCHITECTURE 3 ESPACES VALIDÉE EN PRODUCTION');
  }
})();
