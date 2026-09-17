#!/usr/bin/env node
/**
 * audit_modules_18.js — balayage des 18 pages de modules GÉNÉRÉES.
 *
 * `audit_ui.js` couvre 9 surfaces, dont AUCUNE page de module. Une modification
 * faite dans `scripts/presentation_template.js` se propage pourtant à 18 fichiers
 * (× 4 copies : modules/, ui/cockpit/modules/, admin/, public/) sans qu'aucun
 * contrôle ne regarde le résultat rendu. C'est ce trou que ce script ferme.
 *
 * Cibles : ui/cockpit/modules/NN/index.html — la copie que voit l'apprenant
 * depuis le cockpit, produite par build_cockpit_data.js.
 *
 * Contrôles par module et par largeur (360 / 390 / 820 / 1366) :
 *   - débordement horizontal de la page
 *   - erreurs console et ressources en échec (nommées par leur URL)
 *   - saut de niveau de titre (H1 → H4) et titre sous 12 px
 *   - cibles tactiles interactives sous 44 px
 *   - texte tronqué par `text-overflow:ellipsis`
 *
 * Usage : node scripts/audit_modules_18.js [--json] [num…]
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ROOT = path.join(__dirname, '..');
const WIDTHS = [360, 390, 820, 1366];
const JSON_OUT = process.argv.includes('--json');
const MODS = fs.readdirSync(path.join(ROOT, 'ui', 'cockpit', 'modules'))
  .filter((d) => /^\d\d$/.test(d)).sort();
const WANT = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const LISTE = WANT.length ? MODS.filter((m) => WANT.includes(m)) : MODS;

function findChrome() {
  const c = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ];
  return c.find((p) => p && fs.existsSync(p));
}

const MESURE = () => {
  const vis = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const label = (el) => (el.textContent || el.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim();

  const hs = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(vis).map((h) => ({
    tag: h.tagName,
    size: Math.round(parseFloat(getComputedStyle(h).fontSize)),
    text: label(h).slice(0, 40),
  }));
  const jumps = [];
  for (let i = 1; i < hs.length; i++) {
    const a = +hs[i - 1].tag[1], b = +hs[i].tag[1];
    if (b > a + 1) jumps.push(`H${a}"${hs[i - 1].text.slice(0, 20)}" → H${b}"${hs[i].text.slice(0, 20)}"`);
  }
  const tiny = hs.filter((h) => h.size < 12).map((h) => `${h.tag}(${h.size}px)"${h.text.slice(0, 24)}"`);

  const small = [];
  [...document.querySelectorAll('button,a[href],[role="button"],input,select,summary')].filter(vis).forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 44 || r.height < 44) {
      const t = label(el).slice(0, 26) || el.className.toString().slice(0, 22);
      if (t) small.push(`${el.tagName.toLowerCase()} ${Math.round(r.width)}×${Math.round(r.height)} "${t}"`);
    }
  });

  const truncated = [];
  document.querySelectorAll('*').forEach((el) => {
    if (!vis(el)) return;
    const cs = getComputedStyle(el);
    if (cs.textOverflow !== 'ellipsis') return;
    if (cs.overflowX !== 'hidden' && cs.overflowX !== 'clip') return;
    if (el.scrollWidth <= el.clientWidth + 2) return;
    const t = (el.textContent || '').trim();
    if (!t || el.getBoundingClientRect().width < 20) return;
    truncated.push(`${el.tagName.toLowerCase()} "${t.slice(0, 30)}" −${el.scrollWidth - el.clientWidth}px`);
  });

  /* Hiérarchie INTERNE à chaque diapositive. Mesurer la seule slide affichée ne
     dit rien des 43 autres : chaque mise en page (comparatif, trajectoire,
     étapes…) a ses propres niveaux de titre. On lit donc les 44 scènes du DOM,
     pas seulement celle qui est visible. */
  const scenes = [...document.querySelectorAll('.scene')];
  const slides = [];
  scenes.forEach((sc, i) => {
    const lv = [...sc.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => +h.tagName[1]);
    for (let k = 1; k < lv.length; k++) {
      if (lv[k] > lv[k - 1] + 1) { slides.push(`slide ${i + 1} H${lv[k - 1]}→H${lv[k]}`); break; }
    }
  });

  return {
    docH: Math.round(document.documentElement.scrollHeight),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    nTitres: hs.length,
    nSlides: scenes.length,
    slides: slides.slice(0, 6),
    nSlidesKo: slides.length,
    jumps: jumps.slice(0, 4),
    tiny: tiny.slice(0, 4),
    small: small.slice(0, 6),
    nSmall: small.length,
    truncated: truncated.slice(0, 4),
  };
};

(async () => {
  /* Les pages sont chargées en HTTP et non en `file://` : sous `file://`, le
     `<link rel="icon" href="/favicon.ico">` ajouté par build_cockpit_data.js
     échoue en ERR_FILE_NOT_FOUND et l'on compte 18 faux défauts console.
     Un serveur de mesure ne doit pas fabriquer ses propres défauts. */
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
    if (p === '/') p = '/index.html';
    let f = path.join(ROOT, p);
    if (!fs.existsSync(f) || !fs.statSync(f).isFile()) { res.writeHead(404); res.end('404'); return; }
    const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
    res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const base = 'http://127.0.0.1:' + server.address().port;

  const browser = await puppeteer.launch({ executablePath: findChrome(), headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const out = {};
  let ko = 0;

  for (const m of LISTE) {
    out[m] = {};
    for (const w of WIDTHS) {
      const page = await browser.newPage();
      const errs = [];
      page.on('console', (x) => { if (x.type() === 'error') errs.push(x.text().slice(0, 90)); });
      page.on('pageerror', (x) => errs.push(String(x).slice(0, 90)));
      page.on('response', (r) => { if (r.status() >= 400) errs.push(r.status() + ' ' + r.url().replace(/^https?:\/\/[^/]+/, '')); });
      await page.setViewport({ width: w, height: 900 });
      try {
        await page.goto(`${base}/ui/cockpit/modules/${m}/index.html`, { waitUntil: 'networkidle0', timeout: 45000 });
      } catch (e) {
        out[m][w] = { erreurChargement: e.message.slice(0, 90) };
        ko++;
        await page.close();
        continue;
      }
      await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
      await page.evaluate(() => new Promise((r) => setTimeout(r, 500)));
      const res = await page.evaluate(MESURE);
      res.errors = errs.slice(0, 4);
      const defauts =
        (res.scrollW > res.clientW ? 1 : 0) + res.jumps.length + res.tiny.length + res.nSmall + res.truncated.length + res.errors.length + res.nSlidesKo;
      res.defauts = defauts;
      if (defauts) ko++;
      out[m][w] = res;
      await page.close();
    }
  }
  await browser.close();
  server.close();

  if (JSON_OUT) { console.log(JSON.stringify(out, null, 2)); process.exit(ko ? 1 : 0); }

  console.log('\n══ Balayage des 18 modules (pages générées) ═══════════════════');
  for (const [m, byW] of Object.entries(out)) {
    const pbs = [];
    for (const [w, r] of Object.entries(byW)) {
      if (r.erreurChargement) { pbs.push(`@${w} CHARGEMENT: ${r.erreurChargement}`); continue; }
      if (r.scrollW > r.clientW) pbs.push(`@${w} débordement ${r.scrollW}/${r.clientW}`);
      if (r.jumps.length) pbs.push(`@${w} saut de titre: ${r.jumps.join(' | ')}`);
      if (r.nSlidesKo) pbs.push(`@${w} ${r.nSlidesKo}/${r.nSlides} diapositives avec saut de niveau: ${r.slides.join(' | ')}`);
      if (r.tiny.length) pbs.push(`@${w} titre < 12px: ${r.tiny.join(' | ')}`);
      if (r.nSmall) pbs.push(`@${w} ${r.nSmall} cible(s) < 44px: ${r.small.join(' | ')}`);
      if (r.truncated.length) pbs.push(`@${w} tronqué: ${r.truncated.join(' | ')}`);
      if (r.errors.length) pbs.push(`@${w} console: ${r.errors.join(' | ')}`);
    }
    if (pbs.length) { console.log(`\n  M${m} — ${pbs.length} défaut(s)`); pbs.forEach((x) => console.log('    ' + x)); }
    else console.log(`  M${m} ✅  (${Object.keys(byW).length} largeurs, titres hiérarchisés, aucune cible < 44px, aucune troncature)`);
  }
  console.log(`\n${ko ? '✗ ' + ko + ' mesure(s) en défaut' : '✅ 18 modules sans défaut mesurable'}\n`);
  process.exitCode = ko ? 1 : 0;
})();
