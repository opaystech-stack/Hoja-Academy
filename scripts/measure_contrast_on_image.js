#!/usr/bin/env node
/**
 * CONTRASTE RÉEL SUR FOND IMAGE — ÉCHANTILLONNAGE DE PIXELS
 * =========================================================
 * Les styles calculés ne peuvent pas mesurer un fond porté par une image, un
 * dégradé ou un calque frère. Cet outil prend la question par l'autre bout :
 * il CAPTURE la zone du texte, puis lit les pixels réellement rendus.
 *
 * Méthode :
 *   1. repérer les nœuds de texte d'une couleur cible (styles calculés) ;
 *   2. capturer le rectangle de chacun ;
 *   3. dans une page vierge, charger la capture dans un <canvas> et lire les
 *      pixels ;
 *   4. le fond = couleur dominante du rectangle (les glyphes sont minoritaires) ;
 *      le pire cas = 10ᵉ centile de luminance, hors pixels de glyphe ;
 *   5. contraste WCAG contre ces deux fonds.
 *
 * Usage :
 *   node scripts/measure_contrast_on_image.js [--width 1366] [--color "rgb(192, 189, 189)"]
 *   Sans --color : mesure toutes les couleurs que l'inventaire classe « non mesurables ».
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const SHOTS = path.join(__dirname, '..', 'screenshots', 'contraste-image');
const JSON_OUT = process.argv.includes('--json');
const wIdx = process.argv.indexOf('--width');
const WIDTH = wIdx > -1 ? Number(process.argv[wIdx + 1]) : 1366;
const cIdx = process.argv.indexOf('--color');
const ONLY = cIdx > -1 ? process.argv[cIdx + 1] : null;

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.eot': 'application/vnd.ms-fontobject' };

function serve(dir) {
  const s = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    let f = path.join(dir, p);
    if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
    if (!fs.existsSync(f) && fs.existsSync(path.join(f, 'index.html'))) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise((r) => s.listen(0, '127.0.0.1', () => r(s)));
}

function routes(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...routes(full, base + '/' + e.name));
    else if (e.name.endsWith('.html')) out.push(e.name === 'index.html' ? (base || '/') : base + '/' + e.name);
  }
  return out;
}

// Repère les nœuds dont le fond N'EST PAS mesurable depuis les styles calculés.
const FIND_TARGETS = function (only) {
  const parse = (s) => { const m = String(s).match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (only && cs.color.replace(/\s/g, '') !== only.replace(/\s/g, '')) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 12 || r.height < 10) continue;
    if (r.bottom < 0 || r.top > window.innerHeight * 6) continue;
    // fond image quelque part au-dessus ?
    let n = el, image = null;
    while (n && n !== document.documentElement.parentNode) {
      const c = getComputedStyle(n);
      if (c.backgroundImage !== 'none') { image = n.tagName.toLowerCase() + (n.className ? '.' + String(n.className).split(/\s+/)[0] : ''); break; }
      for (const pe of ['::before', '::after']) {
        const pcs = getComputedStyle(n, pe);
        if (pcs && pcs.content && pcs.content !== 'none' && pcs.backgroundImage !== 'none') { image = n.tagName.toLowerCase() + pe; break; }
      }
      if (image) break;
      n = n.parentElement;
    }
    if (!image) continue;                     // mesurable normalement → hors périmètre
    out.push({
      color: cs.color, size: Math.round(parseFloat(cs.fontSize)), weight: cs.fontWeight,
      text: own.map((x) => x.textContent.trim()).join(' ').slice(0, 44),
      cls: String(el.className).slice(0, 60), image,
      x: r.x, y: r.y, w: r.width, h: r.height,
    });
    if (out.length >= 40) break;
  }
  return out;
};

// Dans une page vierge : histogramme des couleurs de la capture
const SAMPLE = async function (b64) {
  const img = new Image();
  img.src = 'data:image/png;base64,' + b64;
  await img.decode();
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const ctx = c.getContext('2d');
  ctx.drawImage(img, 0, 0);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  const hist = new Map();
  const lums = [];
  for (let i = 0; i < d.length; i += 4) {
    const key = d[i] + ',' + d[i + 1] + ',' + d[i + 2];
    hist.set(key, (hist.get(key) || 0) + 1);
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    lums.push(0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]));
  }
  const sorted = [...hist.entries()].sort((a, b) => b[1] - a[1]);
  lums.sort((a, b) => a - b);
  return {
    dominant: sorted[0][0].split(',').map(Number),
    dominantShare: Math.round(sorted[0][1] / (d.length / 4) * 100),
    p10: lums[Math.floor(lums.length * 0.1)],
    p90: lums[Math.floor(lums.length * 0.9)],
    px: d.length / 4,
  };
};

(async () => {
  if (!fs.existsSync(OUT)) { console.error('❌ Build absent'); process.exit(1); }
  fs.mkdirSync(SHOTS, { recursive: true });
  const server = await serve(OUT);
  const base = 'http://127.0.0.1:' + server.address().port;
  const chrome = ['C:/Program Files/Google/Chrome/Application/chrome.exe'].find((p) => fs.existsSync(p));
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: 1000 });
  const lab = await browser.newPage();
  await lab.goto('about:blank');

  const relLum = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
  const ratio = (a, b) => { const l1 = relLum(a), l2 = typeof b === 'number' ? b : relLum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };

  const results = [];
  for (const route of routes(OUT).sort()) {
    await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 900));
    const targets = await page.evaluate(FIND_TARGETS, ONLY);
    for (const t of targets) {
      const clip = { x: Math.max(0, Math.round(t.x)), y: Math.max(0, Math.round(t.y)), width: Math.max(8, Math.round(t.w)), height: Math.max(8, Math.round(t.h)) };
      let shot;
      try { shot = await page.screenshot({ clip, encoding: 'base64' }); } catch { continue; }
      const s = await lab.evaluate(SAMPLE, shot);
      const fg = t.color.match(/[\d.]+/g).slice(0, 3).map(Number);
      const need = (t.size >= 24 || (t.size >= 19 && Number(t.weight) >= 700)) ? 3 : 4.5;
      results.push({
        route, ...t, bgDominant: `rgb(${s.dominant.join(', ')})`, dominantShare: s.dominantShare,
        ratioDominant: Math.round(ratio(fg, s.dominant) * 100) / 100,
        ratioWorst: Math.round(ratio(fg, s.p10) * 100) / 100,
        need, pass: ratio(fg, s.p10) >= need,
      });
    }
  }

  const agg = new Map();
  for (const r of results) {
    const k = r.color + '|' + r.route + '|' + r.cls.slice(0, 25);
    if (!agg.has(k)) agg.set(k, r);
  }
  const list = [...agg.values()];

  if (JSON_OUT) {
    fs.writeFileSync(path.join(SHOTS, 'contraste-image.json'), JSON.stringify(list, null, 2), 'utf8');
    console.log('JSON : screenshots/contraste-image/contraste-image.json');
  } else {
    console.log('\n' + '═'.repeat(80));
    console.log('  CONTRASTE RÉEL SUR FOND IMAGE — échantillonnage de pixels @' + WIDTH + 'px');
    console.log('  ' + list.length + ' nœuds mesurés');
    console.log('═'.repeat(80) + '\n');
    for (const r of list) {
      const mark = r.pass ? '✅' : '❌';
      console.log(`${mark} ${r.color}  ${r.size}px/${r.weight}  sur ${r.bgDominant} (${r.dominantShare}% de la zone)`);
      console.log(`   contraste fond dominant ${r.ratioDominant}:1 · pire cas (10e centile) ${r.ratioWorst}:1 · seuil ${r.need}`);
      console.log(`   ${r.route}  ${JSON.stringify(r.text)}`);
      console.log(`   fond porté par : ${r.image}\n`);
    }
    const ko = list.filter((r) => !r.pass);
    console.log(ko.length ? `❌ ${ko.length} nœud(s) sous le seuil` : '✅ tous les nœuds mesurés passent le seuil');
  }

  await browser.close();
  server.close();
})();
