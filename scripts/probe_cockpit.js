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
  // Espace formateur — surface autonome (/ui/suivi/), pas une vue du cockpit.
  suivi: '/ui/suivi/index.html',
  // Onglets du workspace module : chacun a sa propre structure de titres.
  'module-fiche': '/ui/cockpit/index.html#programme/m/01?t=fiche',
  'module-exercices': '/ui/cockpit/index.html#programme/m/01?t=exercices',
  'module-phases': '/ui/cockpit/index.html#programme/m/01?t=phases',
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

  /* Hiérarchie réelle des titres. Deux critères explicites, MESURÉS au lieu
     d'être supposés :
       - un saut de niveau (H1 → H4) rend le plan illisible pour un lecteur
         d'écran : la vue module sautait de H1 à H4 sur ses six sections ;
       - un titre sous 12 px passe sous le plancher typographique tenu partout
         ailleurs — un <h6> sans règle dédiée retombait à 9 px (0,67 em de 14).
     Le contrôle est indépendant de la largeur : il porte sur le DOM construit. */
  const jumps = [];
  for (let i = 1; i < headings.length; i++) {
    const a = +headings[i - 1].tag[1], b = +headings[i].tag[1];
    if (b > a + 1) jumps.push(`H${a}"${headings[i - 1].text.slice(0, 24)}" → H${b}"${headings[i].text.slice(0, 24)}"`);
  }
  const tiny = headings.filter((h) => h.size < 12).map((h) => `${h.tag}(${h.size}px)"${h.text.slice(0, 30)}"`);

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
  // `main > section` pour le cockpit, `.wrap` pour les surfaces autonomes
  // (/ui/suivi/), qui n'ont pas de <main>.
  const view = [...document.querySelectorAll('main > section,.wrap')].find(vis);
  const blocks = view
    ? [...view.children].filter(vis).map((el) => ({
        tag: el.tagName.toLowerCase(),
        cls: el.className.toString().slice(0, 40),
        h: Math.round(el.getBoundingClientRect().height),
      }))
    : [];

  /* MOT COUPÉ — mesuré, et non plus déduit.
     L'heuristique précédente (« dernière ligne < 62 % de la première ») ne
     distinguait pas un simple repli de phrase d'une vraie coupure : elle
     signalait « tous les apprenants sont présents » comme un mot cassé, alors
     que la ligne 2 porte le mot entier « présents ». Un détecteur qui crie au
     loup ne sert plus à rien.
     On mesure la chose elle-même : le rect de CHAQUE caractère, groupé par
     ligne. Une coupure existe si deux caractères VISIBLES se suivent dans le
     texte sans espace entre eux ET se retrouvent sur deux lignes différentes. */
  const wrapped = [];
  const cible = [...document.querySelectorAll('.k,.zone,.st,.seg button,th,.toc button,.cell-id b,.stat span,.lcard h3')].filter(vis);
  cible.forEach((el) => {
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight);
    if (!lh || !isFinite(lh) || lh <= 0) return;
    const h = el.getBoundingClientRect().height;
    const lines = Math.round(h / lh);
    if (lines < 2) return;
    const tn = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).pop();
    if (!tn) return;
    const txt = tn.textContent;
    const rng = document.createRange();
    const tops = [];
    for (let i = 0; i < txt.length; i++) {
      rng.setStart(tn, i); rng.setEnd(tn, i + 1);
      tops.push(Math.round(rng.getBoundingClientRect().top));
    }
    for (let i = 1; i < txt.length; i++) {
      const coupe = tops[i] !== tops[i - 1] && txt[i].trim() && txt[i - 1].trim();
      if (!coupe) continue;
      wrapped.push({ text: label(el), lines, avant: txt.slice(Math.max(0, i - 10), i), apres: txt.slice(i, i + 10) });
      break;
    }
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
  const kpis = [...document.querySelectorAll('.statgrid .stat,.stats .stat')].filter(vis).map((c) => {
    const k = c.querySelector('.k') || c.querySelector('span');
    let lines = null, rects = null;
    if (k) {
      const rng = document.createRange();
      rng.selectNodeContents(k);
      rects = [...rng.getClientRects()].map((x) => Math.round(x.width));
      lines = rects.length;
    }
    return { w: Math.round(c.getBoundingClientRect().width), h: Math.round(c.getBoundingClientRect().height), k: k ? label(k) : null, lines, rects };
  });

  /* Élément portant l'attribut `hidden` mais TOUJOURS VISIBLE.
     Cause : une règle d'auteur `display:flex|grid|block` écrase le
     `[hidden]{display:none}` de la feuille du navigateur — les styles d'auteur
     priment sur les styles utilisateur, quelle que soit la spécificité.
     Cas réel : `#skel` et `#mobile` portent `.cards{display:flex}` sur
     /ui/suivi/ ; le squelette de chargement restait donc affiché après le
     rendu, et les cartes mobiles revenaient sous le tableau après un
     redimensionnement. Invisible à toute autre mesure. */
  const hiddenVisible = [];
  document.querySelectorAll('[hidden]').forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none') return;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 && r.height <= 0) return;
    hiddenVisible.push({
      tag: el.tagName.toLowerCase(),
      id: el.id || null,
      cls: el.className.toString().slice(0, 30),
      display: cs.display,
      h: Math.round(r.height),
    });
  });

  return {
    docH: Math.round(document.documentElement.scrollHeight),
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    headings,
    jumps,
    tiny,
    tables,
    blocks,
    wrapped: wrapped.slice(0, 12),
    truncated: truncated.slice(0, 12),
    overflow: overflow.slice(0, 12),
    hiddenVisible,
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
      // Rôle réel de la surface : l'espace formateur est ouvert au rôle
      // `formateur` (pas `admin`), et l'en-tête affiche ce rôle.
      await page.setCookie({ name: 'mockrole', value: name === 'suivi' ? 'formateur' : 'admin', domain: '127.0.0.1', path: '/' });
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
      if (r.wrapped.length) console.log(`         ⚠ MOT COUPÉ (césure en plein mot) : ${r.wrapped.map((x) => `"…${x.avant}|${x.apres}…" dans "${x.text}"`).join(' · ')}`);
      if (r.overflow.length) console.log(`         ⚠ débordement interne : ${r.overflow.map((x) => `${x.tag}.${x.cls}(+${x.over}px)`).join(' · ')}`);
      if (r.truncated.length) console.log(`         ⚠ texte tronqué (ellipsis) : ${r.truncated.map((x) => `${x.tag}.${x.cls}"${x.text}" −${x.hiddenPx}px`).join(' · ')}`);
      if (r.hiddenVisible.length) console.log(`         ⚠ \`hidden\` mais affiché : ${r.hiddenVisible.map((x) => `${x.tag}${x.id ? '#' + x.id : ''}.${x.cls} display=${x.display} h=${x.h}px`).join(' · ')}`);
      if (r.jumps.length) console.log(`         ⚠ saut de niveau de titre : ${r.jumps.join(' · ')}`);
      if (r.tiny.length) console.log(`         ⚠ titre sous 12 px : ${r.tiny.join(' · ')}`);
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
