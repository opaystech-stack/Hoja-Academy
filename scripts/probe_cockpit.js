#!/usr/bin/env node
/**
 * probe_cockpit.js — sonde de MESURE du cockpit (DOM construit, jamais la source).
 *
 * Ne juge pas : rend des nombres. Sert à vérifier une composition d'écran sans
 * se fier à une capture d'écran (le HTML/DOM construit fait foi).
 *
 * Mesure par vue et par largeur :
 *   - hiérarchie réelle des titres (h1..h6, texte, taille calculée)
 *   - hauteur de chaque ligne de tableau (densité)
 *   - hauteur de chaque bloc de premier niveau (répartition verticale)
 *   - libellés de KPI qui se replient sur plusieurs lignes (mot coupé)
 *   - débordement interne d'un élément (scrollWidth > clientWidth)
 *   - éléments en `position:sticky` et leur offset
 *
 * Usage : node scripts/probe_cockpit.js [--json] [vue…]
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const WIDTHS = [390, 430, 820, 1366];
const MOCK_PORT = Number(process.env.MOCK_PORT || 9097);
const JSON_OUT = process.argv.includes('--json');

const VIEWS = {
  accueil: '/ui/cockpit/index.html#accueil',
  inscriptions: '/ui/cockpit/index.html#inscriptions',
  apprenants: '/ui/cockpit/index.html#apprenants',
  fiche: '/ui/cockpit/index.html#apprenants/p/awa.diallo%40example.test',
  programme: '/ui/cockpit/index.html#programme',
  module: '/ui/cockpit/index.html#programme/m/01',
  classroom: '/ui/cockpit/index.html#classroom',
  formateurs: '/ui/cockpit/index.html#formateurs',
};

function findChrome() {
  const c = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return c.find((p) => p && fs.existsSync(p));
}

const PROBE = () => {
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden';
  };
  const label = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);

  const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
    .filter(vis)
    .map((h) => ({
      tag: h.tagName,
      text: label(h),
      size: Math.round(parseFloat(getComputedStyle(h).fontSize)),
      weight: getComputedStyle(h).fontWeight,
    }));

  // Hauteur réelle de chaque ligne de tableau = densité de l'écran de travail.
  const tables = [...document.querySelectorAll('table')].filter(vis).map((t) => {
    const rows = [...t.querySelectorAll('tbody tr')].filter(vis);
    const hs = rows.map((r) => Math.round(r.getBoundingClientRect().height));
    return {
      rows: rows.length,
      min: hs.length ? Math.min(...hs) : null,
      max: hs.length ? Math.max(...hs) : null,
      head: t.tHead ? Math.round(t.tHead.getBoundingClientRect().height) : null,
    };
  });

  // Répartition verticale : hauteur des blocs de premier niveau de la vue.
  const view = [...document.querySelectorAll('main > section')].find(vis);
  const blocks = view
    ? [...view.children].filter(vis).map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: el.className.toString().slice(0, 40),
        h: Math.round(el.getBoundingClientRect().height),
      }))
    : [];

  // Libellés qui se replient : un texte sur 2 lignes dont la 2e fait < 60 % de la 1re
  // est presque toujours un mot coupé.
  const wrapped = [];
  const range = document.createRange();
  [...document.querySelectorAll('.k,.zone,.st,.seg button,th,.toc button,.cell-id b')].filter(vis).forEach((el) => {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    const h = el.getBoundingClientRect().height;
    if (!lh || !isFinite(lh) || lh <= 0) return;
    const lines = Math.round(h / lh);
    if (lines < 2) return;
    // Détecte une coupure À L'INTÉRIEUR d'un mot : on mesure la largeur de la
    // dernière ligne via un range sur le dernier nœud texte.
    const tn = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).pop();
    if (!tn) return;
    range.selectNodeContents(tn);
    const rects = [...range.getClientRects()];
    if (rects.length < 2) return;
    const last = rects[rects.length - 1].width;
    const first = rects[0].width;
    if (last < first * 0.62) wrapped.push({ text: label(el), lines, firstW: Math.round(first), lastW: Math.round(last) });
  });

  // Texte TRONQUÉ par `text-overflow:ellipsis` : le contenu est plus large que
  // la boîte et se termine par « … ». Distinct du débordement ci-dessus, qui
  // exige `overflow-x:visible` et ne voit donc jamais une ellipse. Sans ce
  // contrôle, un libellé réduit à une lettre (« Cockpit / A » à 390 px) passait
  // inaperçu.
  const truncated = [];
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    if (el.closest('.sidebar,.bottombar')) return;
    const cs = getComputedStyle(el);
    if (cs.textOverflow !== 'ellipsis') return;
    if (cs.overflowX !== 'hidden' && cs.overflowX !== 'clip') return;
    if (el.scrollWidth <= el.clientWidth + 2) return;
    const txt = (el.textContent || '').trim();
    if (!txt) return;
    const r = el.getBoundingClientRect();
    if (r.width < 20) return;
    truncated.push({
      tag: el.tagName.toLowerCase(),
      cls: el.className.toString().slice(0, 30),
      text: txt.slice(0, 46),
      hiddenPx: el.scrollWidth - el.clientWidth,
      shownPx: Math.round(r.width),
    });
  });

  // Débordement interne : le contenu dépasse son conteneur (troncature absente).
  const overflow = [];
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    if (el.closest('.tablewrap,pre,.md pre,.seg,.mod-tabs,.sidebar,.bottombar')) return;
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflowX === 'visible') {
      const r = el.getBoundingClientRect();
      if (r.width < 20) return;
      overflow.push({ tag: el.tagName.toLowerCase(), cls: el.className.toString().slice(0, 40), over: el.scrollWidth - el.clientWidth });
    }
  });

  const sticky = [...document.querySelectorAll('*')]
    .filter((el) => vis(el) && getComputedStyle(el).position === 'sticky')
    .map((el) => ({ cls: el.className.toString().slice(0, 40), top: getComputedStyle(el).top }));

  /* Libellés de KPI : un libellé sur 2 lignes dans une carte de ~150 px est
     presque toujours un mot coupé (« DANS CLASSRO / OM »). On rend le détail
     ligne par ligne, sans juger. */
  const kpis = [...document.querySelectorAll('.statgrid .stat')].filter(vis).map((c) => {
    const k = c.querySelector('.k');
    let lines = null, rects = null;
    if (k) {
      const rng = document.createRange();
      rng.selectNodeContents(k);
      rects = [...rng.getClientRects()].map((x) => Math.round(x.width));
      lines = rects.length;
    }
    return { w: Math.round(c.getBoundingClientRect().width), h: Math.round(c.getBoundingClientRect().height), k: k ? label(k) : null, lines, rects };
  });

  return {
    docH: Math.round(document.documentElement.scrollHeight),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    headings,
    tables,
    blocks,
    wrapped: wrapped.slice(0, 12),
    truncated: truncated.slice(0, 12),
    overflow: overflow.slice(0, 12),
    sticky,
    kpis,
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

(async () => {
  const mock = spawn(process.execPath, [path.join(__dirname, 'mock_api_2b.js'), String(MOCK_PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1200));
  const base = `http://127.0.0.1:${MOCK_PORT}`;
  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });

  const want = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const names = want.length ? want : Object.keys(VIEWS);
  const out = {};

  for (const name of names) {
    const route = VIEWS[name];
    if (!route) { console.log(`  ⚠ vue inconnue : ${name}`); continue; }
    out[name] = {};
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      const errs = [];
      page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
      page.on('pageerror', (e) => errs.push(String(e)));
      await page.setViewport({ width: w, height: 900 });
      await page.setCookie({ name: 'mockrole', value: 'admin', domain: '127.0.0.1', path: '/' });
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 600)));
      const res = await page.evaluate(PROBE);
      res.errors = errs.slice(0, 3);
      out[name][w] = res;
      await page.close();
    }
  }
  await browser.close();
  mock.kill();

  if (JSON_OUT) { console.log(JSON.stringify(out, null, 2)); process.exit(0); }

  for (const [name, byW] of Object.entries(out)) {
    console.log('\n══ ' + name + ' ' + '═'.repeat(Math.max(0, 56 - name.length)));
    for (const [w, r] of Object.entries(byW)) {
      const t = r.tables.map((x) => `table ${x.rows}r h=${x.min}→${x.max} th=${x.head}`).join(' | ') || 'aucune table';
      console.log(`  @${w}  doc=${r.docH}px  scrollW=${r.scrollW}/${r.clientW}  ${t}`);
      if (r.wrapped.length) console.log(`         ⚠ libellés coupés : ${r.wrapped.map((x) => `"${x.text}" ${x.lines}l ${x.firstW}/${x.lastW}px`).join(' · ')}`);
      if (r.overflow.length) console.log(`         ⚠ débordement interne : ${r.overflow.map((x) => `${x.tag}.${x.cls}(+${x.over}px)`).join(' · ')}`);
      if (r.truncated.length) console.log(`         ⚠ texte tronqué (ellipsis) : ${r.truncated.map((x) => `${x.tag}.${x.cls}"${x.text}" −${x.hiddenPx}px`).join(' · ')}`);
      if (r.errors.length) console.log(`         ⚠ console : ${r.errors.join(' | ')}`);
      const bad = r.kpis.filter((k) => k.lines && k.lines > 1);
      if (bad.length) console.log(`         KPI repliés : ${bad.map((k) => `"${k.k}" ${k.lines}l w=${k.w} [${k.rects}]`).join(' · ')}`);
      else if (r.kpis.length) console.log(`         KPI : ${r.kpis.length} cartes, libellés sur 1 ligne`);
      if (w === '1366') {
        console.log('         titres : ' + r.headings.map((h) => `${h.tag}(${h.size}/${h.weight})"${h.text.slice(0, 40)}"`).join(' · '));
        console.log('         blocs  : ' + r.blocks.map((b) => `${b.tag}.${b.cls.slice(0, 18)}=${b.h}px`).join(' · '));
      }
    }
  }
  console.log('');
})();
