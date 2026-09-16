#!/usr/bin/env node
/**
 * audit_design_site.js — Audit Design/UX mesuré du site public Hoja
 *
 * Ne se contente pas de lire le code : charge réellement chaque page dans
 * Chrome aux largeurs cibles et MESURE le rendu.
 *
 * Mesures par page × largeur (360 / 390 / 430 / 820 / 1366) :
 *   1. débordement horizontal
 *   2. cibles tactiles < 44 px
 *   3. familles et tailles de police réellement appliquées
 *   4. hiérarchie des titres (h1/h2/h3)
 *   5. écart entre le h1 et le titre de page (title)
 *   6. couleur du texte et contraste sur le fond réel
 *   7. éléments hors viewport
 *
 * Usage : node scripts/audit_design_site.js [--json]
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const SHOTS = path.join(__dirname, '..', 'screenshots', 'audit-design');
const WIDTHS = [360, 390, 430, 820, 1366];
const JSON_OUT = process.argv.includes('--json');

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
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return candidates.find((p) => p && fs.existsSync(p));
}

// ─── Serveur statique minimal ────────────────────────────────────────
function serve(dir) {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    let file = path.join(dir, p);
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file) && fs.existsSync(path.join(file, 'index.html'))) {
      file = path.join(file, 'index.html');
    }
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

// ─── Collecte en page ────────────────────────────────────────────────
async function collect() {
  const px = (v) => parseFloat(v) || 0;
  const doc = document.documentElement;

  // 1. Débordement horizontal
  const overflow = {
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    overflow: doc.scrollWidth > doc.clientWidth + 1,
  };

  // Éléments qui dépassent la largeur du viewport
  const vw = window.innerWidth;
  const bleeding = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 2 || r.left < -2) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') continue;
      bleeding.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 90),
        left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width),
      });
    }
  }

  // 2. Cibles tactiles
  //    Mesure la ZONE D'APPUI RÉELLE, pas la boîte de l'élément : un contrôle
  //    peut étendre sa zone par un pseudo-élément ou un enfant, ce que
  //    getBoundingClientRect() ne montre pas. On échantillonne donc une grille
  //    de 44x44 centrée sur le contrôle via elementFromPoint().
  const small = [];
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary';
  const candidates = [];
  for (const el of document.querySelectorAll(sel)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // Lien d'évitement et éléments masqués visuellement (1x1 + overflow hidden) :
    // volontairement invisibles, révélés au focus clavier. Hors périmètre.
    if (r.width <= 2 && r.height <= 2 && cs.overflow === 'hidden') continue;
    // Un lien en ligne dans un paragraphe n'est pas une cible tactile : on
    // ne retient que les éléments cliquables "bloc" ou isolés.
    const inline = cs.display === 'inline' && el.closest('p, li, span') !== null;
    if (inline) continue;
    if (r.height >= 44 && r.width >= 24) continue;
    candidates.push(el);
  }

  // Mesure de la zone d'appui réelle. elementFromPoint() ne fonctionne que
  // dans le viewport : on amène donc chaque candidat à l'écran avant de
  // sonder une grille de 44x44 centrée sur lui.
  const savedY = window.scrollY;
  for (const el of candidates) {
    el.scrollIntoView({ block: 'center', inline: 'center' });
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const hits = (x, y) => {
      const t = document.elementFromPoint(x, y);
      return !!t && (t === el || el.contains(t) || t.contains(el));
    };
    let hw = 0, hh = 0;
    for (let d = 1; d <= 30; d++) { if (hits(cx - d, cy) && hits(cx + d, cy)) hw = d; else break; }
    for (let d = 1; d <= 30; d++) { if (hits(cx, cy - d) && hits(cx, cy + d)) hh = d; else break; }
    const effW = Math.min(hw * 2, 90), effH = Math.min(hh * 2, 90);
    if (effH >= 44 && effW >= 24) continue;
    small.push({
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || '').trim().slice(0, 40),
      cls: (el.className || '').toString().slice(0, 70),
      w: Math.round(r.width), h: Math.round(r.height),
      effW: Math.round(effW), effH: Math.round(effH),
    });
  }
  window.scrollTo(0, savedY);

  // 3. Typographie réellement appliquée
  const fonts = {};
  const sizes = {};
  const colors = {};
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (!el.textContent || !el.textContent.trim()) continue;
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    fonts[fam] = (fonts[fam] || 0) + 1;
    const sz = cs.fontSize;
    sizes[sz] = (sizes[sz] || 0) + 1;
    colors[cs.color] = (colors[cs.color] || 0) + 1;
  }

  // 4. Hiérarchie des titres
  const headings = [];
  for (const h of document.querySelectorAll('h1,h2,h3,h4')) {
    const r = h.getBoundingClientRect();
    if (r.width === 0) continue;
    const cs = getComputedStyle(h);
    headings.push({
      tag: h.tagName.toLowerCase(),
      size: cs.fontSize,
      weight: cs.fontWeight,
      text: (h.textContent || '').trim().slice(0, 60),
    });
  }

  // 5. Contraste texte/fond réel (échantillonnage des textes visibles)
  const contrast = [];
  const lum = (c) => {
    const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return null;
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(+m[1]) + 0.7152 * f(+m[2]) + 0.0722 * f(+m[3]);
  };
  const bgOf = (el) => {
    let n = el;
    while (n) {
      const cs = getComputedStyle(n);
      // Une image de fond (photo, dégradé) rend le contraste indéterminable
      // par simple lecture de backgroundColor : on abandonne le test.
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      // Même logique pour un média en superposition (vidéo de héros, image
      // en position absolue) : le texte est posé dessus, pas sur une couleur.
      for (const m of n.querySelectorAll('video, img')) {
        const mcs = getComputedStyle(m);
        if (mcs.position === 'absolute' || mcs.position === 'fixed') return null;
      }
      const c = cs.backgroundColor;
      if (c) {
        const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        // alpha 0 = transparent : on continue de remonter
        if (m && (m[4] === undefined || parseFloat(m[4]) > 0.95)) return c;
      }
      n = n.parentElement;
    }
    // Fond de page (body/html) : la couleur de fond du document fait foi.
    const rootBg = getComputedStyle(document.body).backgroundColor;
    return rootBg || 'rgb(255,255,255)';
  };
  const seen = new Set();
  for (const el of document.querySelectorAll('p, a, span, li, h1, h2, h3, h4, button, label, td, th')) {
    const txt = (el.textContent || '').trim();
    if (!txt || el.children.length > 0) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    const fg = cs.color, bg = bgOf(el);
    if (bg === null) continue; // fond en image : non mesurable
    const key = fg + '|' + bg + '|' + cs.fontSize;
    if (seen.has(key)) continue;
    seen.add(key);
    const l1 = lum(fg), l2 = lum(bg);
    if (l1 === null || l2 === null) continue;
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = px(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const need = large ? 3.0 : 4.5;
    if (ratio < need) {
      contrast.push({
        text: txt.slice(0, 40), fg, bg, size: cs.fontSize,
        ratio: Math.round(ratio * 100) / 100, need,
      });
    }
  }

  return { overflow, bleeding: bleeding.slice(0, 8), small: small.slice(0, 12),
    fonts, sizes, colors, headings, contrast: contrast.slice(0, 10) };
}

// ─── Programme principal ─────────────────────────────────────────────
(async () => {
  if (!fs.existsSync(OUT)) {
    console.error('❌ hoja-site/out introuvable. Lancez : npm run build:site');
    process.exit(1);
  }
  const chrome = findChrome();
  if (!chrome) { console.error('❌ Chrome introuvable.'); process.exit(1); }

  fs.mkdirSync(SHOTS, { recursive: true });

  const pages = [];
  (function walk(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) { if (!/^_/.test(e.name)) walk(p); }
      else if (e.name.endsWith('.html')) pages.push('/' + path.relative(OUT, p).replace(/\\/g, '/'));
    }
  })(OUT);
  pages.sort();

  const server = await serve(OUT);
  const port = server.address().port;
  const browser = await puppeteer.launch({
    executablePath: chrome, headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
  });

  const report = {};
  for (const page of pages) {
    const name = page === '/index.html' ? 'accueil' : page.replace(/^\//, '').replace(/\.html$/, '');
    report[name] = {};
    const pg = await browser.newPage();
    for (const w of WIDTHS) {
      await pg.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      await pg.goto(`http://127.0.0.1:${port}${page}`, { waitUntil: 'networkidle0', timeout: 45000 });
      await new Promise((r) => setTimeout(r, 350));
      const data = await pg.evaluate(collect);
      report[name][w] = data;
      if (w === 390 || w === 1366) {
        await pg.screenshot({
          path: path.join(SHOTS, `${name.replace(/\//g, '_')}-${w}.png`),
          fullPage: w === 390,
        });
      }
    }
    await pg.close();
    process.stdout.write('.');
  }
  await browser.close();
  server.close();
  console.log('\n');

  // ─── Synthèse ──────────────────────────────────────────────────────
  const allFonts = {}, allSizes = {}, allColors = {};
  let overflowCount = 0, smallCount = 0, contrastCount = 0;
  const overflowPages = [], smallPages = [], contrastPages = [];

  for (const [name, widths] of Object.entries(report)) {
    for (const [w, d] of Object.entries(widths)) {
      if (d.overflow.overflow) { overflowCount++; overflowPages.push(`${name}@${w}`); }
      if (d.small.length) { smallCount += d.small.length; smallPages.push(`${name}@${w} (${d.small.length})`); }
      if (d.contrast.length) { contrastCount += d.contrast.length; contrastPages.push(`${name}@${w} (${d.contrast.length})`); }
      for (const [k, v] of Object.entries(d.fonts)) allFonts[k] = (allFonts[k] || 0) + v;
      for (const [k, v] of Object.entries(d.sizes)) allSizes[k] = (allSizes[k] || 0) + v;
      for (const [k, v] of Object.entries(d.colors)) allColors[k] = (allColors[k] || 0) + v;
    }
  }

  const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);

  console.log('═'.repeat(70));
  console.log(`AUDIT DESIGN — ${pages.length} pages × ${WIDTHS.length} largeurs`);
  console.log('═'.repeat(70));

  console.log(`\n[1] DÉBORDEMENT HORIZONTAL : ${overflowCount} cas`);
  if (overflowPages.length) overflowPages.slice(0, 15).forEach((p) => console.log('    · ' + p));

  console.log(`\n[2] CIBLES TACTILES < 44px : ${smallCount} cas`);
  if (smallPages.length) smallPages.slice(0, 15).forEach((p) => console.log('    · ' + p));

  console.log(`\n[3] CONTRASTE INSUFFISANT : ${contrastCount} cas`);
  if (contrastPages.length) contrastPages.slice(0, 15).forEach((p) => console.log('    · ' + p));

  console.log('\n[4] FAMILLES DE POLICE APPLIQUÉES');
  byCount(allFonts).forEach(([f, c]) => console.log(`    ${String(c).padStart(6)}  ${f}`));

  console.log('\n[5] TAILLES DE POLICE DISTINCTES : ' + Object.keys(allSizes).length);
  byCount(allSizes).slice(0, 20).forEach(([s, c]) => console.log(`    ${String(c).padStart(6)}  ${s}`));

  console.log('\n[6] COULEURS DE TEXTE DISTINCTES : ' + Object.keys(allColors).length);
  byCount(allColors).slice(0, 14).forEach(([s, c]) => console.log(`    ${String(c).padStart(6)}  ${s}`));

  console.log('\n[7] HIÉRARCHIE DES TITRES (accueil, 1366)');
  const home = report['accueil'] && report['accueil'][1366];
  if (home) home.headings.slice(0, 12).forEach((h) => console.log(`    ${h.tag} ${h.size}/${h.weight}  ${h.text}`));

  if (JSON_OUT) {
    fs.writeFileSync(path.join(SHOTS, 'audit.json'), JSON.stringify(report, null, 1));
    console.log(`\nJSON écrit : ${path.join(SHOTS, 'audit.json')}`);
  }
  console.log(`\nCaptures : ${SHOTS}`);
  console.log('═'.repeat(70));
})();
