#!/usr/bin/env node
/**
 * VÉRIFICATION VISUELLE — héros « programme-intensif » (arbitrage palier 84 px)
 * ============================================================================
 * Tbag a demandé de vérifier visuellement le h1 à 84 px de programme-intensif :
 * est-il disproportionné sur desktop, et problématique en responsive ?
 *
 * Cet outil ne se contente pas d'une capture : il MESURE la composition
 * (hauteur du h1, nombre de lignes, ratio titre / largeur, hauteur du héros)
 * à chacune des 5 largeurs de test canoniques.
 *
 * Usage : node scripts/verify_intensif_hero.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const SHOTS = path.join(__dirname, '..', 'screenshots', 'intensif-hero');
const PORT = 8411;
const WIDTHS = [360, 390, 430, 480, 572, 768, 820, 1024, 1366, 1601];

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml',
};

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      let f = path.join(OUT, p);
      try {
        if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
        // Next.js export : /formations/programme-intensif -> .html (pas de dossier)
        if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
        if (!fs.existsSync(f)) {
          // Ne JAMAIS retomber silencieusement sur l'accueil : cela fausse toute mesure.
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          return res.end('404 ' + p);
        }
        const ext = path.extname(f).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(res);
      } catch (e) {
        res.writeHead(500); res.end('err');
      }
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  throw new Error('Aucun navigateur trouvé');
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const server = await serve();
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  });

  const results = [];
  const url = `http://127.0.0.1:${PORT}/formations/programme-intensif.html`;

  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 1000, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 600));

    const m = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      if (!h1) return null;
      const r = h1.getBoundingClientRect();
      const cs = getComputedStyle(h1);
      // hauteur d'une ligne : on mesure le line-height réel
      const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
      const lines = Math.round(r.height / lh);
      // héros : on remonte jusqu'au conteneur qui porte le fond du premier écran
      let hero = h1, hops = 0;
      while (hero.parentElement && hops < 8) {
        hero = hero.parentElement; hops++;
        const hr = hero.getBoundingClientRect();
        if (hr.height > window.innerHeight * 0.7) break;
      }
      const hr = hero.getBoundingClientRect();
      // débordement : le h1 dépasse-t-il son parent ?
      const parent = h1.parentElement.getBoundingClientRect();
      return {
        fontPx: parseFloat(cs.fontSize),
        lineHeightPx: Math.round(lh),
        h1Width: Math.round(r.width),
        h1Height: Math.round(r.height),
        lines,
        widthRatio: +(r.width / document.documentElement.clientWidth).toFixed(3),
        lineWidthRatio: +(r.width / (r.height / lines || 1)).toFixed(2),
        heroHeight: Math.round(hr.height),
        viewportH: window.innerHeight,
        overflow: r.width > parent.width + 1,
        docOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        text: h1.textContent.trim().slice(0, 60),
      };
    });

    // capture du héros (premier écran)
    await page.screenshot({ path: path.join(SHOTS, `intensif-${w}.png`) });
    results.push({ width: w, ...m });
    await page.close();
    console.log(`[${w}px] ${m ? `h1 ${m.fontPx}px / interlg ${m.lineHeightPx}px · ${m.h1Height}px de haut · ${m.lines} ligne(s) · ${Math.round(m.widthRatio * 100)}% de large · ratio l/h ${m.lineWidthRatio} · héros ${m.heroHeight}px (viewport ${m.viewportH}) · débordement ${m.overflow || m.docOverflow ? 'OUI' : 'non'}` : 'AUCUN H1'}`);
  }

  fs.writeFileSync(path.join(SHOTS, 'mesures.json'), JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
  console.log(`\nCaptures : ${SHOTS}`);
})().catch((e) => { console.error(e); process.exit(1); });
