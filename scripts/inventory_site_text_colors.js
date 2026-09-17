#!/usr/bin/env node
/**
 * INVENTAIRE DES COULEURS DE TEXTE DU SITE PUBLIC
 * ===============================================
 * Ne remplace rien : MESURE. Pour chaque couleur de texte réellement rendue,
 * il associe la fonction (rôle de l'élément), le contexte (sélecteur, fond
 * composé) et le contraste WCAG mesuré.
 *
 * C'est l'instrument qui manquait pour traiter P7 (« 26 couleurs de texte
 * distinctes ») : un compteur de couleurs ne dit pas si une valeur est un
 * doublon d'une autre ou une couleur porteuse de sens.
 *
 * Règle de mesure : les fonds semi-transparents sont COMPOSÉS avant calcul
 * du contraste (sinon on fabrique des faux positifs — leçon de la Phase E).
 *
 * Usage : node scripts/inventory_site_text_colors.js [--width 1366] [--json]
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const OUT = path.join(__dirname, '..', 'hoja-site', 'out');
const JSON_OUT = process.argv.includes('--json');
const wIdx = process.argv.indexOf('--width');
const WIDTH = wIdx > -1 ? Number(process.argv[wIdx + 1]) : 1366;

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
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p === '/') p = '/index.html';
    let file = path.join(dir, p);
    if (!fs.existsSync(file) && fs.existsSync(file + '.html')) file += '.html';
    if (!fs.existsSync(file) && fs.existsSync(path.join(file, 'index.html'))) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}

// Routes : pages du build (index.html de dossier ET *.html de premier niveau,
// qui est la forme produite par Next.js quand trailingSlash est désactivé).
function routes(dir, base = '') {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...routes(full, base + '/' + e.name));
    else if (e.name.endsWith('.html')) {
      out.push(e.name === 'index.html' ? (base || '/') : base + '/' + e.name);
    }
  }
  return out;
}

const IN_PAGE = function () {
  const parse = (s) => {
    const m = String(s).match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  };
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  });
  // Fond réellement perçu : on remonte les ancêtres en composant les couches.
  // ⚠️ Une couleur de fond n'est PAS mesurable si un ancêtre porte une image, un
  // dégradé — OU SI CE DÉGRADÉ EST POSÉ EN PSEUDO-ÉLÉMENT (::before / ::after),
  // ce que `getComputedStyle(el)` ne renvoie jamais. C'est ce cas qui produisait
  // 32 faux « blanc sur blanc » sur le héros de l'accueil (vérifié par capture).
  const bgOf = (el) => {
    let node = el;
    const layers = [];
    let image = null;
    while (node && node !== document.documentElement.parentNode) {
      const cs2 = getComputedStyle(node);
      const owner = node.tagName.toLowerCase() + (node.className ? '.' + String(node.className).split(/\s+/)[0] : '');
      if (!image && cs2.backgroundImage && cs2.backgroundImage !== 'none') image = owner;
      if (!image) {
        for (const pe of ['::before', '::after']) {
          const pcs = getComputedStyle(node, pe);
          if (pcs && pcs.content && pcs.content !== 'none' && pcs.backgroundImage && pcs.backgroundImage !== 'none') {
            image = owner + pe;
            break;
          }
        }
      }
      const c = parse(cs2.backgroundColor);
      if (c && c.a > 0) layers.push(c);
      if (c && c.a === 1) break;
      node = node.parentElement;
    }
    let acc = layers.pop() || { r: 255, g: 255, b: 255, a: 1 };
    while (layers.length) acc = over(layers.pop(), acc);
    return { bg: acc, image };
  };
  const lum = (c) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const rows = [];
  for (const el of document.querySelectorAll('body *')) {
    // Nœuds de texte uniquement
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own.length) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue;

    const fg = parse(cs.color);
    if (!fg) continue;
    const { bg, image } = bgOf(el);
    const fgc = fg.a < 1 ? over(fg, bg) : fg;
    const text = own.map((n) => n.textContent.trim()).join(' ').replace(/\s+/g, ' ').slice(0, 70);
    const size = parseFloat(cs.fontSize) || 0;
    const bold = Number(cs.fontWeight) >= 700;
    const large = size >= 24 || (size >= 19 && bold);

    rows.push({
      color: `rgb(${Math.round(fgc.r)}, ${Math.round(fgc.g)}, ${Math.round(fgc.b)})`,
      raw: cs.color,
      alpha: fg.a,
      bg: image ? 'image/dégradé' : `rgb(${Math.round(bg.r)}, ${Math.round(bg.g)}, ${Math.round(bg.b)})`,
      onImage: !!image,
      imageOwner: image,
      ratio: image ? null : Math.round(ratio(fgc, bg) * 100) / 100,
      // ⚠️ LIMITE CONNUE DE L'INSTRUMENT : un fond peut être porté par un CALQUE
      // FRÈRE (élément positionné, <video>, <canvas>) et non par un ancêtre. Les
      // styles calculés ne le voient pas. Un texte très clair sur un fond mesuré
      // très clair est donc « suspect », pas « en échec » — vérification visuelle
      // requise. (Vérifié sur le héros de l'accueil : dégradé sombre en calque frère.)
      suspect: !image && lum(bg) > 0.7 && lum(fgc) > 0.7,
      need: large ? 3 : 4.5,
      size: Math.round(size),
      bold,
      tag: el.tagName.toLowerCase(),
      cls: String(el.className || '').slice(0, 80),
      text,
    });
  }
  return rows;
};

(async () => {
  if (!fs.existsSync(OUT)) { console.error('❌ Build absent : ' + OUT); process.exit(1); }
  const chrome = findChrome();
  if (!chrome) { console.error('❌ Chrome introuvable'); process.exit(1); }

  const server = await serve(OUT);
  const base = 'http://127.0.0.1:' + server.address().port;
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage();
  await page.setViewport({ width: WIDTH, height: 900, deviceScaleFactor: 1 });

  const list = routes(OUT).sort();
  const all = [];
  for (const route of list) {
    await page.goto(base + route, { waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {});
    await new Promise((r) => setTimeout(r, 250));
    const rows = await page.evaluate(IN_PAGE);
    rows.forEach((r) => all.push(Object.assign({ route }, r)));
  }

  // Agrégation par couleur
  const byColor = new Map();
  for (const r of all) {
    if (!byColor.has(r.color)) byColor.set(r.color, { color: r.color, n: 0, ctx: new Map(), bgs: new Set(), min: 99, fails: 0, unknown: 0, suspect: 0, samples: new Set() });
    const c = byColor.get(r.color);
    c.n++;
    const key = r.tag + (r.cls ? '.' + r.cls.split(/\s+/).slice(0, 2).join('.') : '');
    c.ctx.set(key, (c.ctx.get(key) || 0) + 1);
    c.bgs.add(r.bg);
    if (r.ratio === null) c.unknown++;
    else if (r.suspect) c.suspect++;
    else {
      c.min = Math.min(c.min, r.ratio);
      if (r.ratio < r.need) c.fails++;
    }
    if (c.samples.size < 3) c.samples.add(r.text);
  }

  const report = [...byColor.values()]
    .map((c) => ({
      color: c.color,
      n: c.n,
      min: c.min === 99 ? null : c.min,
      fails: c.fails,
      unknown: c.unknown,
      suspect: c.suspect,
      contexts: [...c.ctx.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4),
      bgs: [...c.bgs].slice(0, 3),
      samples: [...c.samples],
    }))
    .sort((a, b) => b.n - a.n);

  if (JSON_OUT) {
    fs.writeFileSync(path.join(__dirname, '..', 'screenshots', 'site-text-colors.json'), JSON.stringify(report, null, 2), 'utf8');
    console.log('JSON écrit : screenshots/site-text-colors.json');
  } else {
    console.log('\n' + '═'.repeat(78));
    console.log('  INVENTAIRE DES COULEURS DE TEXTE — SITE PUBLIC @' + WIDTH + 'px');
    console.log('  ' + list.length + ' pages · ' + all.length + ' nœuds de texte · ' + report.length + ' couleurs distinctes');
    console.log('  ' + all.filter((r) => r.onImage).length + ' nœuds sur fond image/dégradé (contraste non mesurable)');
    console.log('═'.repeat(78) + '\n');
    for (const c of report) {
      const flag = c.fails ? `❌ ${c.fails} sous le seuil` : (c.suspect ? `⚠️  ${c.suspect} à vérifier visuellement` : '✅');
      console.log(`${c.color.padEnd(22)} ${String(c.n).padStart(5)} occ.  min ${c.min === null ? '  n/a' : String(c.min).padStart(5)}:1  ${flag}${c.unknown ? `  (${c.unknown} sur fond image)` : ''}`);
      console.log('   fond(s) : ' + c.bgs.join(' · '));
      console.log('   contexte: ' + c.contexts.map(([k, v]) => `${k} (${v})`).join(', '));
      console.log('   ex.     : ' + c.samples.map((s) => JSON.stringify(s.slice(0, 46))).join(' / '));
      console.log('');
    }
  }

  await browser.close();
  server.close();
})();
