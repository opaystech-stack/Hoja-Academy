#!/usr/bin/env node
/**
 * capture_ui.js — captures des surfaces applicatives (cockpit, campus, suivi, login).
 *
 * Sert la racine du dépôt et capture chaque surface aux largeurs de référence.
 * Le cockpit charge ses données en `fetch()` : il faut donc un vrai serveur HTTP.
 *
 * Usage : node scripts/capture_ui.js <dossier-sortie> [surfaces…]
 *   ex.  node scripts/capture_ui.js screenshots/cockpit-after cockpit
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const WIDTHS = [360, 390, 430, 820, 1366];
const DEST = path.join(ROOT, process.argv[2] || 'screenshots/ui-after');
const WANT = process.argv.slice(3);
// Le cockpit redirige vers /ui/login/ si /api/me n'est pas un admin : il faut le
// mock API 2B (`scripts/mock_api_2b.js`), qui sert AUSSI les fichiers ui/.
const MOCK_PORT = Number(process.env.MOCK_PORT || 9099);
// Le mock est ACTIVÉ PAR DÉFAUT. Sans lui, le cockpit renvoie 404 sur `/api/me`
// et redirige vers `/ui/login/` : on croyait capturer le cockpit, on capturait
// l'écran de connexion (piège rencontré — 45 captures inexploitables). Pour
// servir les seuls fichiers statiques, il faut le demander explicitement :
// `USE_MOCK=0`.
const USE_MOCK = process.env.USE_MOCK !== '0';
const MOCK_ROLE = process.env.MOCK_ROLE || 'admin';

const SURFACES = {
  cockpit: '/ui/cockpit/index.html',
  'cockpit-accueil': '/ui/cockpit/index.html#accueil',
  'cockpit-inscriptions': '/ui/cockpit/index.html#inscriptions',
  'cockpit-apprenants': '/ui/cockpit/index.html#apprenants',
  'cockpit-programme': '/ui/cockpit/index.html#programme',
  'cockpit-classroom': '/ui/cockpit/index.html#classroom',
  'cockpit-formateurs': '/ui/cockpit/index.html#formateurs',
  // Fiche apprenant 360° : route #apprenants/p/<email>. L'email est celui du
  // premier apprenant du roster mock — sur la passerelle réelle, la route est
  // la même, seule la valeur change.
  'cockpit-fiche': '/ui/cockpit/index.html#apprenants/p/awa.diallo%40example.test',
  // Workspace module : route #programme/m/NN
  'cockpit-module': '/ui/cockpit/index.html#programme/m/01',
  campus: '/ui/campus/index.html',
  suivi: '/ui/suivi/index.html',
  login: '/ui/login/index.html',
};

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
};

function findChrome() {
  const c = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return c.find((p) => p && fs.existsSync(p));
}

function serve(dir) {
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (p === '/') p = '/index.html';
    let file = path.join(dir, p);
    if (!isFile(file) && isFile(file + '.html')) file += '.html';
    if (!isFile(file) && isFile(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    if (!isFile(file)) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  let mock = null;
  if (USE_MOCK) {
    // Le mock est lancé par ce script : plus fiable qu'un processus externe.
    mock = spawn(process.execPath, [path.join(__dirname, 'mock_api_2b.js'), String(MOCK_PORT)], {
      cwd: ROOT, stdio: 'ignore',
    });
    await new Promise((r) => setTimeout(r, 1200));
  }
  const server = USE_MOCK ? null : await serve(ROOT);
  const base = USE_MOCK ? `http://127.0.0.1:${MOCK_PORT}` : `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  // `WANT` est une liste de PRÉFIXES, pas de noms exacts : `capture_ui.js out cockpit`
  // doit capturer toutes les surfaces du cockpit. Une correspondance exacte faisait
  // silencieusement produire un seul écran (et un jeu de captures incomplet qu'on
  // croyait complet — piège rencontré).
  const names = WANT.length
    ? Object.keys(SURFACES).filter((n) => WANT.some((p) => n === p || n.startsWith(p + '-')))
    : Object.keys(SURFACES);
  if (!names.length) { console.log('  ⚠ aucune surface ne correspond à : ' + WANT.join(', ')); process.exit(1); }
  let n = 0, refused = 0;
  for (const name of names) {
    const route = SURFACES[name];
    if (!route) { console.log(`  ⚠ surface inconnue : ${name}`); continue; }
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(String(e)));
      // Un « 404 » sans URL ne dit rien : Chrome ne met pas l'adresse dans le
      // texte du message console. On écoute aussi les réponses pour nommer la
      // ressource fautive.
      page.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url()); });
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      if (USE_MOCK) {
        // Le cookie de rôle doit être posé AVANT le chargement de la page,
        // sinon /api/whoami échoue et le cockpit redirige vers /ui/login/.
        await page.setCookie({ name: 'mockrole', value: MOCK_ROLE, domain: '127.0.0.1', path: '/' });
      }
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
      // Un écran de connexion n'est JAMAIS la vue demandée. Si le cockpit a
      // redirigé (mock absent, rôle non posé), la capture est REFUSÉE au lieu
      // d'être écrite : une capture fausse coûte plus cher qu'une capture
      // absente, parce qu'on la croit.
      if (/\/ui\/login\//.test(page.url()) && !/\/ui\/login\//.test(route)) {
        console.log(`\n  ✗ ${name}@${w} : redirigé vers ${page.url()} — capture refusée (mock non lancé ?)`);
        refused++;
        await page.close();
        continue;
      }
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
      await page.screenshot({ path: path.join(DEST, `${name}-${w}.png`), fullPage: true });
      if (errs.length) console.log(`\n  ⚠ ${name}@${w} : ${errs.slice(0, 2).join(' | ')}`);
      await page.close();
      n++;
      process.stdout.write('.');
    }
  }
  await browser.close();
  if (server) server.close();
  if (mock) mock.kill();
  console.log(`\n${n} captures écrites dans ${DEST}`);
  if (refused) {
    console.log(`✗ ${refused} capture(s) REFUSÉE(S) — la page servie n'était pas la vue demandée.`);
    process.exitCode = 1;
  }
  console.log(`source servie : ${base}${USE_MOCK ? ' (mock API 2B)' : ' (fichiers statiques — AUCUNE route /api)'}`);
})();
