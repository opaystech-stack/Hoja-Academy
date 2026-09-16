#!/usr/bin/env node
/**
 * typo_capture.js — captures avant/après pour le lot typographique.
 *
 * Charge les pages demandées aux 5 largeurs de contrôle (360 / 390 / 430 / 820 / 1366)
 * et écrit une capture pleine hauteur par page × largeur dans le dossier cible.
 *
 * Usage : node scripts/typo_capture.js <dossier-sortie> [pages…]
 *   ex.  node scripts/typo_capture.js screenshots/typo-after accueil entreprises
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const WIDTHS = [360, 390, 430, 820, 1366];
const DEST = path.join(__dirname, '..', process.argv[2] || 'screenshots/typo-after');
const PAGES = process.argv.slice(3);

const ROUTES = {
  accueil: '/',
  entreprises: '/entreprises',
  formations: '/formations',
  'programme-intensif': '/formations/programme-intensif',
  contact: '/contact',
  postuler: '/postuler',
  'expert-ia': '/formations/expert-ia',
  robotique: '/formations/robotique',
  'n8n': '/formations/automatisation-n8n',
  'ia-recherche': '/formations/ia-recherche-sciences',
  accessibilite: '/accessibilite',
  cookies: '/cookies',
  confidentialite: '/confidentialite',
  'mentions-legales': '/mentions-legales',
  '404': '/404',
};

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml', '.eot': 'application/vnd.ms-fontobject',
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
    let p = decodeURIComponent(req.url.split('?')[0]);
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
  const names = PAGES.length ? PAGES : Object.keys(ROUTES);
  fs.mkdirSync(DEST, { recursive: true });
  const server = await serve(OUT);
  const base = `http://127.0.0.1:${server.address().port}`;
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  let n = 0;
  for (const name of names) {
    const route = ROUTES[name];
    if (!route) { console.log(`  ⚠ page inconnue : ${name}`); continue; }
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
      // neutralise les animations pour une comparaison stable
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 350)));
      await page.screenshot({ path: path.join(DEST, `${name}-${w}.png`), fullPage: true });
      await page.close();
      n++;
      process.stdout.write('.');
    }
  }
  await browser.close();
  server.close();
  console.log(`\n${n} captures écrites dans ${DEST}`);
})();
