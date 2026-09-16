#!/usr/bin/env node
/**
 * audit_ui.js — audit Design/UX MESURÉ des surfaces applicatives Hoja.
 *
 * Même exigence que `audit_design_site.js` pour le site public : on charge
 * réellement les pages dans Chrome et on mesure le rendu, on ne lit pas le code.
 *
 * Surfaces : cockpit (6 vues), campus, suivi, login.
 * Largeurs : 360 / 390 / 430 / 820 / 1366.
 *
 * Mesures :
 *   1. débordement horizontal + éléments hors viewport
 *   2. cibles tactiles < 44 px (zone d'appui réelle, échantillonnée)
 *   3. contraste texte/fond réel (fonds en image et médias superposés exclus)
 *   4. familles et tailles de police appliquées
 *   5. hiérarchie des titres h1→h6
 *   6. images sans alt, erreurs console
 *
 * Le cockpit redirige vers /ui/login/ sans session : le mock API 2B est lancé
 * automatiquement (jamais en production).
 *
 * Usage : node scripts/audit_ui.js [--json]
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const SHOTS = path.join(ROOT, 'screenshots', 'audit-ui');
const WIDTHS = [360, 390, 430, 820, 1366];
const MOCK_PORT = Number(process.env.MOCK_PORT || 9098);
const JSON_OUT = process.argv.includes('--json');

const PAGES = [
  ['cockpit · accueil', '/ui/cockpit/index.html#accueil'],
  ['cockpit · inscriptions', '/ui/cockpit/index.html#inscriptions'],
  ['cockpit · apprenants', '/ui/cockpit/index.html#apprenants'],
  ['cockpit · programme', '/ui/cockpit/index.html#programme'],
  ['cockpit · classroom', '/ui/cockpit/index.html#classroom'],
  ['cockpit · formateurs', '/ui/cockpit/index.html#formateurs'],
  ['campus apprenant', '/ui/campus/index.html'],
  ['espace formateur', '/ui/suivi/index.html'],
  ['login', '/ui/login/index.html'],
];

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

// ─── Collecte en page ───────────────────────────────────────────────
function collect() {
  const px = (v) => parseFloat(v) || 0;
  const doc = document.documentElement;
  const vw = window.innerWidth;

  const overflow = {
    scrollWidth: doc.scrollWidth, clientWidth: doc.clientWidth,
    overflow: doc.scrollWidth > doc.clientWidth + 1,
  };

  const bleeding = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right > vw + 2 || r.left < -2) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' || cs.visibility === 'hidden' || cs.display === 'none') continue;
      bleeding.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className || '').toString().slice(0, 70),
        left: Math.round(r.left), right: Math.round(r.right),
      });
    }
  }

  const fonts = {}, sizes = {}, colors = {};
  const imgsNoAlt = [];
  const headings = [];

  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      fonts[cs.fontFamily.split(',')[0].replace(/["']/g, '')] =
        (fonts[cs.fontFamily.split(',')[0].replace(/["']/g, '')] || 0) + 1;
      sizes[Math.round(px(cs.fontSize)) + 'px'] = (sizes[Math.round(px(cs.fontSize)) + 'px'] || 0) + 1;
      const c = cs.color;
      if (!/rgba?\([^)]*,\s*0\)/.test(c)) colors[c] = (colors[c] || 0) + 1;
    }
    if (/^h[1-6]$/.test(el.tagName.toLowerCase())) {
      headings.push({
        tag: el.tagName.toLowerCase(), size: Math.round(px(cs.fontSize)) + 'px',
        weight: cs.fontWeight, text: (el.textContent || '').trim().slice(0, 60),
      });
    }
    if (el.tagName.toLowerCase() === 'img' && !el.hasAttribute('alt')) {
      imgsNoAlt.push((el.getAttribute('src') || '').slice(0, 60));
    }
  }

  return { overflow, bleeding: bleeding.slice(0, 10), fonts, sizes, colors, headings, imgsNoAlt };
}

// ─── Cibles tactiles + contraste (mesures actives) ──────────────────
async function measureTargets() {
  const sel = 'a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary';
  const small = [];
  const savedY = window.scrollY;
  for (const el of document.querySelectorAll(sel)) {
    const r0 = el.getBoundingClientRect();
    if (r0.width === 0 && r0.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (r0.width <= 2 && r0.height <= 2 && cs.overflow === 'hidden') continue;
    if (r0.height >= 44 && r0.width >= 24) continue;
    const inline = cs.display === 'inline' && el.closest('p, li, span') !== null;
    if (inline) continue;

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
      text: (el.textContent || '').trim().slice(0, 36),
      cls: (el.className || '').toString().slice(0, 60),
      h: Math.round(r.height), effH: Math.round(effH),
    });
  }
  window.scrollTo(0, savedY);
  return small.slice(0, 20);
}

function contrastScan() {
  const lum = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (c) => {
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map((x) => parseFloat(x));
    return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 };
  };
  const ratio = (f, b) => {
    const l1 = lum(f), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const txt = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
    if (!txt.length) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const fg = parse(cs.color);
    if (!fg || fg.a === 0) continue;

    // Remontée du fond réel. Deux pièges à éviter :
    //  - un fond en image ou un média superposé n'est pas mesurable → on abandonne ;
    //  - un fond SEMI-TRANSPARENT doit être composé sur ses ancêtres, sinon on
    //    compare du texte à un fond fantôme (faux positifs « 1:1 »).
    let node = el, chain = [], bailed = false, opaque = null;
    while (node && node !== document.documentElement) {
      const s = getComputedStyle(node);
      if (s.backgroundImage && s.backgroundImage !== 'none') { bailed = true; break; }
      if (node.querySelector && node.querySelector('video, img[style*="absolute"]')) { bailed = true; break; }
      const b = parse(s.backgroundColor);
      if (b && b.a >= 0.999) { opaque = b; break; }
      if (b && b.a > 0) chain.push(b);
      node = node.parentElement;
    }
    if (bailed) continue;
    if (!opaque) {
      const rootBg = parse(getComputedStyle(document.documentElement).backgroundColor);
      opaque = rootBg && rootBg.a >= 0.999 ? rootBg : { rgb: [255, 255, 255], a: 1 };
    }
    // Composition : du fond opaque vers l'élément (la dernière couche est au-dessus).
    let bg = opaque.rgb.slice();
    for (let i = chain.length - 1; i >= 0; i--) {
      const c = chain[i];
      bg = [0, 1, 2].map((k) => c.rgb[k] * c.a + bg[k] * (1 - c.a));
    }
    const bgNode = node || document.documentElement;
    const cr = ratio(fg.rgb, bg);
    const size = parseFloat(cs.fontSize);
    const bold = parseInt(cs.fontWeight, 10) >= 700;
    const large = size >= 24 || (size >= 18.66 && bold);
    const need = large ? 3 : 4.5;
    if (cr < need) {
      const hex = (v) => '#' + v.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('');
      out.push({
        text: (el.textContent || '').trim().slice(0, 40),
        fg: cs.color, bg: hex(bg),
        ratio: Math.round(cr * 100) / 100, need, size: Math.round(size),
        tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 50),
        bgNode: bgNode === document.documentElement ? 'html' : (bgNode.className || bgNode.tagName).toString().slice(0, 40),
      });
    }
  }
  return out.slice(0, 30);
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const mock = spawn(process.execPath, [path.join(__dirname, 'mock_api_2b.js'), String(MOCK_PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise((r) => setTimeout(r, 1400));
  const base = `http://127.0.0.1:${MOCK_PORT}`;

  const browser = await puppeteer.launch({
    executablePath: findChrome(), headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  const report = {};
  const consoleErrors = [];
  for (const [name, route] of PAGES) {
    report[name] = {};
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      page.on('pageerror', (e) => consoleErrors.push(`${name}@${w} : ${e.message}`));
      page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${name}@${w} : ${m.text().slice(0, 120)}`); });
      await page.setViewport({ width: w, height: 900, deviceScaleFactor: 1 });
      await page.setCookie({ name: 'mockrole', value: 'admin', domain: '127.0.0.1', path: '/' });
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
      const d = await page.evaluate(collect);
      d.small = await page.evaluate(measureTargets);
      d.contrast = await page.evaluate(contrastScan);
      report[name][w] = d;
      await page.screenshot({ path: path.join(SHOTS, `${name.replace(/[^\w]+/g, '_')}-${w}.png`), fullPage: true });
      await page.close();
      process.stdout.write('.');
    }
  }
  await browser.close();
  mock.kill();
  console.log('\n');

  const byCount = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]);
  let overflowCount = 0, smallCount = 0, contrastCount = 0;
  const smallPages = [], contrastPages = [], overflowPages = [];
  const allFonts = {}, allSizes = {}, allColors = {};
  const noAlt = new Set();

  for (const [name, widths] of Object.entries(report)) {
    for (const [w, d] of Object.entries(widths)) {
      if (d.overflow.overflow) { overflowCount++; overflowPages.push(`${name}@${w}`); }
      if (d.small.length) { smallCount += d.small.length; smallPages.push(`${name}@${w} (${d.small.length})`); }
      if (d.contrast.length) { contrastCount += d.contrast.length; contrastPages.push(`${name}@${w} (${d.contrast.length})`); }
      for (const [k, v] of Object.entries(d.fonts)) allFonts[k] = (allFonts[k] || 0) + v;
      for (const [k, v] of Object.entries(d.sizes)) allSizes[k] = (allSizes[k] || 0) + v;
      for (const [k, v] of Object.entries(d.colors)) allColors[k] = (allColors[k] || 0) + v;
      d.imgsNoAlt.forEach((s) => noAlt.add(s));
    }
  }

  console.log('═'.repeat(70));
  console.log(`AUDIT UI — ${PAGES.length} surfaces × ${WIDTHS.length} largeurs`);
  console.log('═'.repeat(70));
  console.log(`\n[1] DÉBORDEMENT HORIZONTAL : ${overflowCount} cas`);
  overflowPages.slice(0, 12).forEach((p) => console.log('    · ' + p));
  console.log(`\n[2] CIBLES TACTILES < 44px : ${smallCount} cas`);
  smallPages.slice(0, 14).forEach((p) => console.log('    · ' + p));
  console.log(`\n[3] CONTRASTE INSUFFISANT : ${contrastCount} cas`);
  contrastPages.slice(0, 14).forEach((p) => console.log('    · ' + p));
  console.log('\n[4] FAMILLES DE POLICE');
  byCount(allFonts).slice(0, 8).forEach(([f, c]) => console.log(`    ${String(c).padStart(6)}  ${f}`));
  console.log(`\n[5] TAILLES DE POLICE DISTINCTES : ${Object.keys(allSizes).length}`);
  byCount(allSizes).slice(0, 24).forEach(([s, c]) => console.log(`    ${String(c).padStart(6)}  ${s}`));
  console.log(`\n[6] COULEURS DE TEXTE DISTINCTES : ${Object.keys(allColors).length}`);
  byCount(allColors).slice(0, 16).forEach(([s, c]) => console.log(`    ${String(c).padStart(6)}  ${s}`));
  console.log(`\n[7] IMAGES SANS ALT : ${noAlt.size}`);
  [...noAlt].slice(0, 8).forEach((s) => console.log('    · ' + s));
  console.log(`\n[8] ERREURS CONSOLE : ${consoleErrors.length}`);
  [...new Set(consoleErrors)].slice(0, 10).forEach((s) => console.log('    · ' + s));

  console.log('\n[9] HIÉRARCHIE (cockpit · accueil @1366)');
  const home = report['cockpit · accueil'] && report['cockpit · accueil'][1366];
  if (home) home.headings.slice(0, 12).forEach((h) => console.log(`    ${h.tag} ${h.size}/${h.weight}  ${h.text}`));

  if (JSON_OUT) {
    fs.writeFileSync(path.join(SHOTS, 'audit-ui.json'), JSON.stringify(report, null, 1));
    console.log(`\nJSON écrit : ${path.join(SHOTS, 'audit-ui.json')}`);
  }
  console.log(`\nCaptures : ${SHOTS}`);
  console.log('═'.repeat(70));
})();
