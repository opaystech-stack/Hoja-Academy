#!/usr/bin/env node
/**
 * test_hoja_site.js — Garde-fou du site public Hoja (hoja-site/out/)
 *
 * Vérifie l'artefact de build et les sources du site public. Complète les
 * suites existantes, qui couvrent la chaîne legacy (public/, ui/, modules/)
 * mais pas le site public Next.js.
 *
 * Contrôles :
 *   1. out/ existe et contient les pages attendues
 *   2. toutes les références d'assets locales résolvent vers un fichier présent
 *   3. aucune référence à une police retirée
 *   4. aucune trace de la marque abandonnée OPAYS (or / navy) dans les sources
 *   5. aucun texte espagnol résiduel dans les pages
 *   6. toutes les balises <img> portent un attribut alt
 *   7. aucune faute de classe résiduelle (coursr-pointer)
 *   8. aucun token mort réintroduit dans globals.css
 *
 * Usage : node scripts/test_hoja_site.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'hoja-site');
const SRC = path.join(SITE, 'src');
const OUT = path.join(SITE, 'out');

let pass = 0;
let fail = 0;
const failures = [];

function check(label, ok, detail) {
  if (ok) { pass++; console.log(`  ✅ ${label}`); }
  else {
    fail++;
    failures.push(label + (detail ? ` — ${detail}` : ''));
    console.log(`  ❌ ${label}${detail ? ' — ' + detail : ''}`);
  }
}

// ─── Utilitaires ─────────────────────────────────────────────────────
function walk(dir, filter, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.next' || e.name === '.next-build') continue;
      walk(p, filter, acc);
    } else if (!filter || filter(p)) acc.push(p);
  }
  return acc;
}

const srcFiles = walk(SRC, (p) => /\.(tsx|ts|css|mjs|js)$/.test(p));
const srcText = {};
for (const f of srcFiles) srcText[f] = fs.readFileSync(f, 'utf8');

// ─── 1. Artefact de build ────────────────────────────────────────────
console.log('\n[1] Artefact de build (hoja-site/out/)');
check('out/ existe', fs.existsSync(OUT));

const EXPECTED_PAGES = [
  'index.html', '404.html',
  'entreprises.html', 'formations.html', 'contact.html', 'postuler.html',
  'mentions-legales.html', 'confidentialite.html', 'cookies.html', 'accessibilite.html',
  'formations/programme-intensif.html',
  'formations/expert-ia.html',
  'formations/automatisation-n8n.html',
  'formations/robotique.html',
  'formations/ia-recherche-sciences.html',
];
const missing = EXPECTED_PAGES.filter((p) => !fs.existsSync(path.join(OUT, p)));
check(`${EXPECTED_PAGES.length} pages attendues présentes`, missing.length === 0, missing.join(', '));

const htmlFiles = walk(OUT, (p) => p.endsWith('.html'));
check('pages HTML générées', htmlFiles.length >= 15, `${htmlFiles.length} trouvées`);

// ─── 2. Résolution des assets ────────────────────────────────────────
console.log('\n[2] Résolution des références d\'assets');
const brokenRefs = [];
for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf8');
  const refs = new Set();
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]+)"/g)) refs.add(m[1]);
  for (const r of refs) {
    if (r.startsWith('/_next/') || r.endsWith('/')) continue;
    if (!path.extname(r)) continue;
    if (!fs.existsSync(path.join(OUT, r.slice(1)))) brokenRefs.push(`${path.relative(OUT, f)} → ${r}`);
  }
}
check('aucune référence d\'asset cassée', brokenRefs.length === 0,
  brokenRefs.slice(0, 5).join(' | ') + (brokenRefs.length > 5 ? ` (+${brokenRefs.length - 5})` : ''));

// ─── 3. Polices retirées ─────────────────────────────────────────────
console.log('\n[3] Polices');
const DEAD_FONTS = ['Exo 2', 'Orbitron', 'Noto Color Emoji', 'dashicons', 'fcicons',
  'ld-icons', 'swiper-icons', 'WooCommerce'];
const deadFontHits = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const fam of DEAD_FONTS) {
    if (t.includes(`font-family:"${fam}"`) || t.includes(`font-family: "${fam}"`)) {
      deadFontHits.push(`${path.relative(SITE, f)}: ${fam}`);
    }
  }
}
check('aucune police de clone référencée', deadFontHits.length === 0, deadFontHits.slice(0, 3).join(' | '));

const fontFilesInOut = walk(OUT, (p) => /\.(woff2?|ttf|eot)$/.test(p));
check('fichiers de police expédiés réduits', fontFilesInOut.length <= 8,
  `${fontFilesInOut.length} fichiers`);

// ─── 4. Marque OPAYS ─────────────────────────────────────────────────
console.log('\n[4] Marque abandonnée (OPAYS or / navy)');
const BRAND_HITS = ['gold-opays', 'blue-opays', '#D4AF37', '#d4af37', '#001F4D', '#0066FF'];
const brandHits = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const pat of BRAND_HITS) {
    if (t.includes(pat)) brandHits.push(`${path.relative(SITE, f)}: ${pat}`);
  }
}
check('aucun token de marque OPAYS dans le site public', brandHits.length === 0,
  brandHits.slice(0, 3).join(' | '));

const opaysInOut = [];
for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  if (/OPAYS/i.test(t)) opaysInOut.push(path.relative(OUT, f));
}
check('aucune mention OPAYS dans les pages générées', opaysInOut.length === 0,
  opaysInOut.slice(0, 3).join(', '));

// ─── 5. Texte espagnol ───────────────────────────────────────────────
console.log('\n[5] Résidus de langue');
const SPANISH = [
  'En caso de que', 'te lo notificaremos', 'en la propia web',
  'transacciones fraudulentas', 'Referencias a cuentas',
  'chatea con nosotros', 'sin completar', 'estamos online',
];
const spanishHits = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const s of SPANISH) {
    if (t.toLowerCase().includes(s.toLowerCase())) spanishHits.push(`${path.relative(SITE, f)}: "${s}"`);
  }
}
check('aucun texte espagnol résiduel', spanishHits.length === 0, spanishHits.slice(0, 3).join(' | '));

// ─── 6. Attributs alt ────────────────────────────────────────────────
console.log('\n[6] Accessibilité — attributs alt');
const missingAlt = [];
for (const f of htmlFiles) {
  const t = fs.readFileSync(f, 'utf8');
  for (const m of t.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt\s*=/.test(m[0])) missingAlt.push(path.relative(OUT, f));
  }
}
check('toutes les balises <img> ont un alt', missingAlt.length === 0,
  `${missingAlt.length} manquant(s)`);

// ─── 7. Faute de classe ──────────────────────────────────────────────
console.log('\n[7] Classes CSS');
const typoHits = Object.entries(srcText)
  .filter(([, t]) => t.includes('coursr-pointer'))
  .map(([f]) => path.relative(SITE, f));
check('aucune occurrence de "coursr-pointer"', typoHits.length === 0, typoHits.slice(0, 3).join(', '));

// ─── 8. Tokens morts ─────────────────────────────────────────────────
console.log('\n[8] Tokens de design');
const globals = fs.readFileSync(path.join(SRC, 'app', 'globals.css'), 'utf8');
const globalsLines = globals.split('\n').length;
check('globals.css allégé (< 500 lignes)', globalsLines < 500, `${globalsLines} lignes`);

const deadTokenPatterns = [/--font-size-0\d\d/, /--space-0\d\d/, /--line-height-0\d\d/, /--radius-00\d/];
const deadTokenHits = deadTokenPatterns.filter((re) => re.test(globals));
check('aucun token mort dans globals.css', deadTokenHits.length === 0,
  `${deadTokenHits.length} famille(s) réintroduite(s)`);

const fontFaceCount = (globals.match(/@font-face/g) || []).length;
check('règles @font-face réduites (<= 5)', fontFaceCount <= 5, `${fontFaceCount} règles`);

// ─── 9. Contraste / accessibilité couleur ────────────────────────────
console.log('\n[9] Contraste');
check('token --primary-text défini dans globals.css',
  /--primary-text\s*:/.test(globals), 'absent');
check('token --primary-text exposé à Tailwind',
  /--color-primary-text\s*:/.test(globals), 'absent dans @theme');

const cssOut = walk(OUT, (p) => p.endsWith('.css'));
const cssText = cssOut.map((f) => fs.readFileSync(f, 'utf8')).join('\n');
check('classe .text-primary-text émise au build',
  /\.text-primary-text\s*\{/.test(cssText), 'absente du CSS généré');

// Aucun texte blanc sur le vert de marque (3,02:1 -> échec AA)
const whiteOnGreen = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const m of t.matchAll(/className="([^"]*)"/g)) {
    const c = m[1];
    if (/\bbg-primary\b/.test(c) && /\btext-(background|white)\b/.test(c)) {
      whiteOnGreen.push(path.relative(SITE, f));
    }
  }
}
check('aucun texte blanc sur fond bg-primary', whiteOnGreen.length === 0,
  whiteOnGreen.slice(0, 3).join(', '));

// ─── Jetons de texte : la marque en TEXTE exige le seuil « grand texte » ──
// DESIGN_SYSTEM_HOJA.md §2.2.1 : --primary (#21A87D) ne donne que 3,02:1 sur
// blanc et 3,58:1 sur fond sombre. Il n'est conforme qu'en grand texte
// (>= 24 px, ou >= 19 px gras). En dessous, il faut --primary-text (fond clair)
// ou --primary-text-dark (fond sombre).
const smallPrimary = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const m of t.matchAll(/className="([^"]*)"/g)) {
    const c = m[1];
    // `text-primary` seul — on exclut text-primary-text et text-primary-text-dark
    if (!/(^|\s)text-primary(\s|$)/.test(c)) continue;
    const small = [...c.matchAll(/(?:^|\s|:)text-\[(\d+(?:\.\d+)?)rem\]/g)]
      .map((x) => Number(x[1]))
      .filter((v) => v < 1.5);
    if (small.length) smallPrimary.push(path.relative(SITE, f) + ' (' + small[0] + 'rem)');
  }
}
check('aucun text-primary sous le seuil grand texte (< 24 px)', smallPrimary.length === 0,
  smallPrimary.slice(0, 3).join(', '));

// ─── Jetons de texte legacy : consolidation sur la palette sémantique ──
// Mesure (scripts/inventory_site_text_colors.js) : ces six jetons étaient des
// quasi-doublons, dont text-color-045 qui ÉCHOUAIT AA (2,86:1 sur #f8fafc).
const LEGACY_TEXT_TOKENS = ['text-color-003', 'text-color-006', 'text-color-007',
  'text-color-010', 'text-color-016', 'text-color-045'];
const legacyHits = [];
for (const [f, t] of Object.entries(srcText)) {
  for (const tok of LEGACY_TEXT_TOKENS) {
    if (t.includes(tok)) legacyHits.push(path.relative(SITE, f) + ' → ' + tok);
  }
}
check('jetons de texte legacy consolidés (palette sémantique)', legacyHits.length === 0,
  legacyHits.slice(0, 3).join(', '));

// ─── Bilan ───────────────────────────────────────────────────────────
console.log('\n' + '='.repeat(56));
if (fail === 0) {
  console.log(`🏆 SITE PUBLIC HOJA : ${pass}/${pass} CONTRÔLES PASSÉS`);
  console.log('='.repeat(56));
  process.exit(0);
} else {
  console.log(`❌ SITE PUBLIC HOJA : ${fail} échec(s) sur ${pass + fail}`);
  for (const f of failures) console.log(`   · ${f}`);
  console.log('='.repeat(56));
  process.exit(1);
}
