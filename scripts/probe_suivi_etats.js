#!/usr/bin/env node
/**
 * probe_suivi_etats.js — sonde d'ÉTATS de l'espace formateur (/ui/suivi/).
 *
 * probe_cockpit.js mesure la composition d'un écran au repos. Il ne dit rien des
 * états qui n'existent qu'après une interaction : filtre actif, filtre sans
 * résultat, cohorte vide, feuille modale ouverte. Ces états-là sont précisément
 * ceux qu'on casse sans le voir — l'écran par défaut reste impeccable.
 *
 * La sonde force chaque état par le DOM (les données sont celles du mock, aucune
 * donnée inventée n'est affichée) et rend, pour chacun : ce qui est visible, ce
 * qui devrait l'être, et ce qui l'est alors qu'il porte `hidden`.
 *
 * Usage : node scripts/probe_suivi_etats.js [--json]
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const MOCK_PORT = Number(process.env.MOCK_PORT || 9098);
const DEST = path.join(ROOT, 'screenshots', 'suivi-etats');
const JSON_OUT = process.argv.includes('--json');
const WIDTHS = [390, 1366];

function findChrome() {
  const c = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return c.find((p) => p && fs.existsSync(p));
}

const MEASURE = () => {
  const vis = (el) => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const rows = [...document.querySelectorAll('#mtx tbody tr.row')].filter(vis).length;
  const cards = [...document.querySelectorAll('#mobile .lcard')].filter(vis).length;
  const kpis = [...document.querySelectorAll('#stats .stat')].map((c) => ({
    k: (c.querySelector('.k') || {}).textContent || '',
    v: (c.querySelector('.v') || {}).textContent || '',
    tone: (c.querySelector('.v') || {}).className.replace('v', '').trim(),
  }));
  const chips = [...document.querySelectorAll('#chips button')].map((b) => ({
    f: b.dataset.f,
    label: b.textContent.replace(/\s+/g, ' ').trim(),
    pressed: b.getAttribute('aria-pressed'),
  }));
  const hiddenVisible = [];
  document.querySelectorAll('[hidden]').forEach((el) => {
    if (getComputedStyle(el).display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 && r.height <= 0) return;
    hiddenVisible.push(el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + '.' + el.className.toString().slice(0, 20));
  });
  const est = document.querySelector('#empty .estate');
  return {
    rows, cards, kpis, chips, hiddenVisible,
    zoneCounter: (document.querySelector('#z-n') || {}).textContent || null,
    emptyVisible: vis(document.querySelector('#empty')),
    emptyTitle: est ? ((est.querySelector('b') || {}).textContent || '') : null,
    emptyAction: est && est.querySelector('.btn') ? est.querySelector('.btn').textContent.trim() : null,
    sheetOpen: document.querySelector('#panel').classList.contains('on'),
    sheetProgress: (document.querySelector('#pProg .sprog .v') || {}).textContent || null,
    sheetMissions: [...document.querySelectorAll('#pMissions .missionline')].filter(vis).length,
    bodyOverflow: document.body.style.overflow || '',
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  };
};

function serve(dir) {
  const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };
  const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.ico': 'image/x-icon' };
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

/* Chaque état : un nom, l'action DOM qui le provoque, et ce qu'on attend. */
const ETATS = [
  { nom: 'peuple', faire: null,
    attendu: (m) => m.rows > 0 || m.cards > 0 },
  { nom: 'filtre-retard', faire: () => setFilter('retard'),
    attendu: (m) => m.chips.some((c) => c.f === 'retard' && c.pressed === 'true') },
  { nom: 'filtre-sans-resultat', faire: () => { DATA.rows.forEach((r) => r.missions.forEach((x) => { x.late = false; })); setFilter('retard'); },
    attendu: (m) => m.emptyVisible && !m.rows && !m.cards },
  { nom: 'cohorte-vide', faire: () => { DATA = { rows: [], learners: 0, coursework: 0, submissions: 0, empty: [] }; setFilter('all'); },
    attendu: (m) => m.emptyVisible && m.emptyTitle && m.emptyTitle.indexOf('cohorte vide') >= 0 },
  { nom: 'feuille-modale', faire: () => openSheet('awa.diallo@example.test'),
    attendu: (m) => m.sheetOpen && m.sheetMissions > 0 && m.bodyOverflow === 'hidden' },
];

(async () => {
  fs.mkdirSync(DEST, { recursive: true });
  const mock = spawn(process.execPath, [path.join(__dirname, 'mock_api_2b.js'), String(MOCK_PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1200));
  const base = `http://127.0.0.1:${MOCK_PORT}`;
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  const out = {};
  let ko = 0;
  for (const w of WIDTHS) {
    for (const e of ETATS) {
      const page = await browser.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (x) => errs.push(String(x)));
      await page.setViewport({ width: w, height: 900 });
      await page.setCookie({ name: 'mockrole', value: 'formateur', domain: '127.0.0.1', path: '/' });
      await page.goto(base + '/ui/suivi/index.html', { waitUntil: 'networkidle0', timeout: 60000 });
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
      if (e.faire) { await page.evaluate(e.faire); await page.evaluate(() => new Promise((r) => setTimeout(r, 250))); }
      const m = await page.evaluate(MEASURE);
      m.errors = errs.slice(0, 3);
      m.attendu = e.attendu(m);
      if (!m.attendu) ko++;
      await page.screenshot({ path: path.join(DEST, `suivi-${e.nom}-${w}.png`) });
      out[e.nom + '@' + w] = m;
      await page.close();
    }
  }
  await browser.close();
  mock.kill();

  if (JSON_OUT) { console.log(JSON.stringify(out, null, 2)); process.exit(ko ? 1 : 0); }

  console.log('\n══ états de l\'espace formateur ═══════════════════════════');
  for (const [k, m] of Object.entries(out)) {
    console.log(`\n  ${k}  ${m.attendu ? '✓' : '✗ ÉTAT NON ATTEINT'}`);
    console.log(`     lignes=${m.rows} cartes=${m.cards} compteur=${m.zoneCounter} vide=${m.emptyVisible ? '"' + m.emptyTitle + '"' : 'non'}${m.emptyAction ? ' action="' + m.emptyAction + '"' : ''}`);
    console.log(`     KPI : ${m.kpis.map((x) => x.k + '=' + x.v + (x.tone ? '(' + x.tone + ')' : '')).join(' · ')}`);
    console.log(`     filtres : ${m.chips.map((c) => '"' + c.label + '"' + (c.pressed === 'true' ? '*' : '')).join(' · ')}`);
    if (m.sheetOpen) console.log(`     feuille : progression=${m.sheetProgress} missions=${m.sheetMissions} body.overflow=${m.bodyOverflow}`);
    if (m.hiddenVisible.length) console.log(`     ⚠ \`hidden\` mais affiché : ${m.hiddenVisible.join(' · ')}`);
    if (m.scrollW > m.clientW) console.log(`     ⚠ débordement de page : ${m.scrollW}/${m.clientW}`);
    if (m.errors.length) console.log(`     ⚠ console : ${m.errors.join(' | ')}`);
  }
  console.log(`\n${ko ? '✗ ' + ko + ' état(s) non atteint(s)' : '✓ tous les états atteints'} — captures dans screenshots/suivi-etats\n`);
  process.exitCode = ko ? 1 : 0;
})();
