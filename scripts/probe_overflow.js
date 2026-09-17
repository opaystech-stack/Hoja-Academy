#!/usr/bin/env node
/**
 * SONDE DE DÉBORDEMENT LOCAL — programme-intensif
 * ===============================================
 * `audit:ui` ne couvre pas le site public page par page. Cette sonde isole les
 * nœuds dont la boîte dépasse réellement la fenêtre (scrollWidth > clientWidth),
 * pour distinguer un débordement RÉEL d'un simple rendu serré.
 *
 * Usage : node scripts/probe_overflow.js [chemin.html] [largeurs...]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const PORT = 8412;
const target = process.argv[2] || '/formations/programme-intensif.html';
const widths = process.argv.slice(3).map(Number).filter(Boolean);
const WIDTHS = widths.length ? widths : [360, 390, 430, 480, 572, 768, 820, 1024, 1366, 1601];

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
        if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
        if (!fs.existsSync(f)) { res.writeHead(404); return res.end('404'); }
        res.writeHead(200, { 'Content-Type': MIME[path.extname(f).toLowerCase()] || 'application/octet-stream' });
        fs.createReadStream(f).pipe(res);
      } catch (e) { res.writeHead(500); res.end('err'); }
    });
    server.listen(PORT, '127.0.0.1', () => resolve(server));
  });
}

function findChrome() {
  const cands = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  ].filter(Boolean);
  for (const c of cands) if (fs.existsSync(c)) return c;
  throw new Error('Aucun navigateur');
}

(async () => {
  const server = await serve();
  const browser = await puppeteer.launch({
    executablePath: findChrome(), headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
  });

  for (const w of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: 1000, deviceScaleFactor: 1 });
    await page.goto(`http://127.0.0.1:${PORT}${target}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await new Promise((r) => setTimeout(r, 500));

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const docScroll = document.documentElement.scrollWidth;
      const offenders = [];
      document.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        // dépassement réel : la boîte sort de la fenêtre
        if (r.right > vw + 1 || r.left < -1) {
          // on ne retient que les nœuds porteurs de texte (les wrappers héritent)
          const ownText = Array.from(el.childNodes)
            .filter((n) => n.nodeType === 3)
            .map((n) => n.textContent.trim())
            .join(' ')
            .trim();
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className || '').toString().slice(0, 90),
            left: Math.round(r.left),
            right: Math.round(r.right),
            over: Math.round(r.right - vw),
            text: ownText.slice(0, 70),
            hasOwnText: !!ownText,
          });
        }
      });
      // on privilégie ceux qui portent leur propre texte
      const withText = offenders.filter((o) => o.hasOwnText);
      return { vw, docScroll, docOverflow: docScroll > vw + 1, offenders: withText.slice(0, 12), total: offenders.length };
    });

    console.log(`\n[${w}px] doc ${report.docScroll}px / vw ${report.vw}px → ${report.docOverflow ? 'DÉBORDEMENT DOCUMENT' : 'ok'} · ${report.total} boîtes hors cadre, ${report.offenders.length} porteuses de texte`);
    report.offenders.forEach((o) => {
      console.log(`   <${o.tag}> depasse de ${o.over}px (l=${o.left} r=${o.right}) "${o.text}"  .${o.cls}`);
    });
    await page.close();
  }

  await browser.close();
  server.close();
})().catch((e) => { console.error(e); process.exit(1); });
