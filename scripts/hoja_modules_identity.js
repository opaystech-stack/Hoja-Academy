#!/usr/bin/env node
/**
 * PHASE H — IDENTITÉ VISUELLE HOJA DES 18 MODULES
 * ================================================
 * Retire le système de marque OPAYS (or #D4AF37, bleu #0066FF, navy #001F4D,
 * rayon 20 px, ombre spectaculaire, orbes décoratifs, dégradés décoratifs)
 * et le remplace par le langage visuel Hoja établi (docs/design-2026-09/
 * DESIGN_SYSTEM_HOJA.md).
 *
 * Chaîne corrigée À LA SOURCE :
 *   scripts/presentation_template.js  →  modules/XX/presentation.html (18)
 *                                     →  admin/modules/XX/index.html (18, build_admin.js)
 *                                     →  public/modules/XX/index.html (18, build_public.js)
 *
 * NE TOUCHE PAS : contenu pédagogique, structure des cours, fonctionnalités.
 * Les mentions « OPAYS » portées par le CONTENU pédagogique (noms de méthodes,
 * chapitres, certificat) sont VOLONTAIREMENT laissées intactes : elles relèvent
 * d'une décision éditoriale, pas d'une correction d'identité visuelle.
 *
 * Usage :
 *   node scripts/hoja_modules_identity.js [--dry] [--css <chemin.css>]
 */

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');

const ROOT = path.join(__dirname, '..');
const TEMPLATE = path.join(__dirname, 'presentation_template.js');
const DRY = process.argv.includes('--dry');
const cssArgIdx = process.argv.indexOf('--css');
const CSS_FILE = cssArgIdx > -1 ? process.argv[cssArgIdx + 1] : null;

const modules = require('../data/modules.js');

/* ────────────────────────────────────────────────────────────────────────
 * 1. Bloc CSS canonique Hoja
 * ──────────────────────────────────────────────────────────────────────── */

function loadCanonicalCss() {
  const templateSrc = fs.readFileSync(TEMPLATE, 'utf8');
  if (templateSrc.includes('--teal: #10b981;')) {
    // Déjà migré : la source de vérité est le template lui-même.
    const m = templateSrc.match(/<style>\n([\s\S]*?)\n\$\{customHeadExtra\}\n<\/style>/);
    if (!m) throw new Error('Bloc <style> du template introuvable ou inattendu.');
    return m[1];
  }
  if (!CSS_FILE || !fs.existsSync(CSS_FILE)) {
    throw new Error(
      'Le template porte encore le système OPAYS. Fournir le CSS canonique :\n' +
      '  node scripts/hoja_modules_identity.js --css <chemin.css>'
    );
  }
  return fs.readFileSync(CSS_FILE, 'utf8').replace(/\s+$/, '');
}

/* ────────────────────────────────────────────────────────────────────────
 * 2. Icônes SVG de la barre d'outils (remplacent les emojis du chrome)
 * ──────────────────────────────────────────────────────────────────────── */

const svg = (d, extra = '') =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" ` +
  `stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${d}</svg>`;

const ICON = {
  overview: svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>'),
  notes: svg('<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v5h5"/><path d="M8.5 13h7M8.5 17h4.5"/>'),
  expand: svg('<path d="M4 9V4h5M20 15v5h-5M20 9V4h-5M4 15v5h5"/>'),
  close: svg('<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>'),
  prev: svg('<path d="M14.5 5l-7 7 7 7"/>'),
  next: svg('<path d="M9.5 5l7 7-7 7"/>'),
};

/* ────────────────────────────────────────────────────────────────────────
 * 3. Remplacements — chrome & identité uniquement (jamais le contenu)
 * ──────────────────────────────────────────────────────────────────────── */

const REPLACEMENTS = [
  // ── Emojis / glyphes du chrome fonctionnel → icônes SVG ou texte
  ['title="Vue d\'ensemble [O]">⊞<', `title="Vue d'ensemble [O]">${ICON.overview}<`, 'bouton Vue d\'ensemble'],
  ['🧰 Prompts <kbd>R</kbd>', 'Prompts <kbd>R</kbd>', 'bouton Prompts'],
  ['title="Notes Formateur [N]">📝<', `title="Notes Formateur [N]">${ICON.notes}<`, 'bouton Notes'],
  ['title="Plein écran [F]">⛶<', `title="Plein écran [F]">${ICON.expand}<`, 'bouton Plein écran'],
  ['title="Slide précédente [⬅️]">◀<', `title="Slide précédente [Flèche gauche]">${ICON.prev}<`, 'bouton Précédent'],
  ['title="Slide suivante [➔]">▶<', `title="Slide suivante [Flèche droite]">${ICON.next}<`, 'bouton Suivant'],
  ['✕</button>', `${ICON.close}</button>`, 'boutons Fermer'],
  ['[Espace / ➔] Avancer', '[Espace / Flèche droite] Avancer', 'aide clavier'],
  ['📋 Copier le prompt', 'Copier le prompt', 'bouton Copier'],
  ['🎯 OBJECTIF PÉDAGOGIQUE', 'OBJECTIF PÉDAGOGIQUE', 'libellé panneau Notes'],
  ["🗣️ ARGUMENTS À L'ORAL & EXEMPLES", "ARGUMENTS À L'ORAL & EXEMPLES", 'libellé panneau Notes'],
  ['🔗 PHRASE DE TRANSITION', 'PHRASE DE TRANSITION', 'libellé panneau Notes'],
  ["'✓ Copié !'", "'Copié'", 'retour Copier'],
  ["'✓ Prompt copié dans votre presse-papier.'", "'Prompt copié dans votre presse-papier.'", 'retour Copier'],

  // ── Marque : chrome uniquement (le contenu pédagogique n'est pas touché)
  ['<b>OPAYS ACADEMY</b>', '<b>HOJA ACADEMY</b>', 'marque topbar'],
  ['<small>ACADÉMIE OPAYS • BOÎTE À PROMPTS</small>', '<small>HOJA ACADEMY • BOÎTE À PROMPTS</small>', 'marque panneau Prompts'],
  ['<title>OPAYS Academy — Module', '<title>Hoja Academy — Module', 'titre de page'],
  ["Présentation interactive officielle de l'Académie OPAYS : Module", "Présentation interactive officielle de l'Académie Hoja : Module", 'meta description'],
  ["l'Académie OPAYS :", "l'Académie Hoja :", 'meta description (variante)'],
  ['<!-- OPAYS Logo SVG Embedded -->', '<!-- Marque Hoja — vectorielle, autonome (aucun asset externe) -->', 'commentaire du logo'],
  ['content="#070b12" name="theme-color"', 'content="#090d16" name="theme-color"', 'theme-color'],

  // ── Marque vectorielle : recoloration Hoja (le fichier reste autonome)
  ['stroke="#001f4d"', 'stroke="#0b1220"', 'logo — arc'],
  ['fill="#0066FF"', 'fill="#10b981"', 'logo — tracé'],

  // ── Décor sans fonction (§5 du design system)
  [/<div class="ambient ambient-blue"><\/div>\s*<div class="ambient ambient-gold"><\/div>\s*<div class="grain"><\/div>\s*/, '', 'orbes + grain décoratifs'],

  // ── Vocabulaire de classe : or → accent
  ['gold-border', 'accent-border', 'carte accentuée'],

  // ── Couleurs résiduelles codées en dur (corps de scène)
  ['background:#050911', 'background:var(--card-2)', 'fond de carte'],
  ['var(--blue-opays)', 'var(--teal)', 'jeton OPAYS bleu (corps de scene)'],
  ['var(--gold-opays)', 'var(--teal-light)', 'jeton OPAYS or (corps de scene)'],
  ['var(--blue-light)', 'var(--blue)', 'accent info'],
  ['var(--line-blue)', 'var(--blue-soft)', 'bordure info'],
  ['var(--line-gold)', 'var(--teal-soft)', 'bordure accent'],
  ['var(--gold-light)', 'var(--teal-light)', 'accent marque'],
  ['#cbd5e1', 'var(--text)', 'texte secondaire'],
  ['rgba(0,102,255,0.25)', 'rgba(16,185,129,0.25)', 'surbrillance'],
  ['rgba(0,102,255,0.04)', 'rgba(16,185,129,0.04)', 'fond accentué'],
  ['rgba(212,175,55,0.04)', 'rgba(16,185,129,0.04)', 'fond accentué'],
  ['rgba(212,175,55,0.03)', 'rgba(16,185,129,0.03)', 'fond accentué'],
  ['rgba(255,110,120,0.3)', 'rgba(244,63,94,0.3)', 'bordure alerte'],
  ['rgba(255,110,120,0.04)', 'rgba(244,63,94,0.04)', 'fond alerte'],

  // ── Hiérarchie des titres des panneaux.
  //    Sous le <h1> du titre de slide, ces titres étaient des <h3> : le document
  //    sautait un niveau (H1 → H3) et son plan devenait illisible pour un lecteur
  //    d'écran. Le panneau « Vue d'ensemble » était déjà en H2.
  //    Les modules 01, 16 et 18 échappent à build_all_presentations.js (01 =
  //    référence validée, 16/18 = PROTECTED_MODULES) : le template corrigé ne les
  //    atteint pas, il faut donc les reprendre ici.
  [
    /<h3>(Ressources du Module[^<]*)<\/h3>/,
    '<h2>$1</h2>',
    'titre du panneau ressources en H2',
    '<h2>Ressources du Module',
  ],
  [
    /<h3 id="notesTitle">([^<]*)<\/h3>/,
    '<h2 id="notesTitle">$1</h2>',
    'titre du panneau notes en H2',
    '<h2 id="notesTitle"',
  ],
  [
    /<h3 id="modalTitle">([^<]*)<\/h3>/,
    '<h2 id="modalTitle">$1</h2>',
    'titre de la modale en H2',
    '<h2 id="modalTitle"',
  ],

  // ── Accessibilité : le champ de recherche n'avait aucun <label>
  //    (4ᵉ élément = garde d'idempotence : motif dont la PRÉSENCE fait sauter la règle)
  [
    '<input class="dock-search" id="resourceSearch"',
    '<label class="visually-hidden" for="resourceSearch">Rechercher dans les ressources du module</label>\n  <input class="dock-search" id="resourceSearch"',
    'label du champ de recherche',
    'for="resourceSearch"',
  ],
];

/* ────────────────────────────────────────────────────────────────────────
 * 4. Application
 * ──────────────────────────────────────────────────────────────────────── */

const css = loadCanonicalCss();

function spliceCss(html, isTemplate) {
  const re = /<style>[\s\S]*?<\/style>/;
  if (!re.test(html)) throw new Error('Aucun bloc <style> trouvé.');
  const body = isTemplate ? `${css}\n\${customHeadExtra}` : css;
  return html.replace(re, `<style>\n${body}\n</style>`);
}

function applyReplacements(html) {
  const counts = [];
  for (const [find, replace, label, alreadyPresent] of REPLACEMENTS) {
    // Garde d'idempotence : si le motif produit est déjà là, la règle est un no-op.
    if (alreadyPresent && html.includes(alreadyPresent)) continue;
    if (typeof find === 'string') {
      if (!html.includes(find)) continue;
      html = html.split(find).join(replace);
    } else {
      if (!find.test(html)) continue;
      html = html.replace(find, replace);
    }
    counts.push(label);
  }
  return { html, counts };
}

const targets = [
  { file: TEMPLATE, isTemplate: true, label: 'SOURCE scripts/presentation_template.js' },
  ...modules.map((m) => ({
    file: path.join(DIRS.modules, m.code, 'presentation.html'),
    isTemplate: false,
    label: `Module ${String(m.num).padStart(2, '0')} [${m.code}]`,
  })),
];

const FORBIDDEN = [
  ['--blue-opays', 'jeton OPAYS bleu'],
  ['--gold-opays', 'jeton OPAYS or'],
  ['--navy', 'jeton OPAYS navy'],
  ['#D4AF37', 'or OPAYS'],
  ['#0066FF', 'bleu OPAYS'],
  ['#001f4d', 'navy OPAYS'],
  ['--radius: 20px', 'rayon 20 px'],
  ['0 34px 90px', 'ombre spectaculaire'],
  ['class="ambient', 'orbes décoratifs'],
  ['class="grain"', 'grain décoratif'],
  ['linear-gradient(145deg', 'dégradé décoratif'],
  ['radial-gradient(circle', 'dégradé décoratif'],
];

console.log('\n======================================================');
console.log('  PHASE H — IDENTITÉ VISUELLE HOJA DES MODULES');
console.log('======================================================');
console.log(`  Mode : ${DRY ? 'SIMULATION (--dry)' : 'APPLICATION'}`);
console.log(`  Bloc CSS canonique : ${css.split('\n').length} lignes\n`);

let ok = 0, ko = 0;
const report = [];

for (const t of targets) {
  if (!fs.existsSync(t.file)) {
    console.error(`❌ ${t.label} : fichier introuvable — ${t.file}`);
    ko++;
    continue;
  }
  const original = fs.readFileSync(t.file, 'utf8');
  let out = spliceCss(original, t.isTemplate);
  const { html, counts } = applyReplacements(out);
  out = html;

  const residual = FORBIDDEN.filter(([needle]) => out.includes(needle)).map(([, name]) => name);

  if (!DRY) fs.writeFileSync(t.file, out, 'utf8');

  const delta = Buffer.byteLength(out, 'utf8') - Buffer.byteLength(original, 'utf8');
  if (residual.length) {
    console.error(`❌ ${t.label} : résidus → ${residual.join(', ')}`);
    ko++;
  } else {
    console.log(`✔ ${t.label} : CSS remplacé, ${counts.length} règles appliquées (${delta >= 0 ? '+' : ''}${delta} o)`);
    ok++;
  }
  report.push({ label: t.label, residual, counts: counts.length });
}

console.log('\n======================================================');
console.log(`  ${ok} / ${targets.length} cibles conformes${ko ? ` — ${ko} en échec` : ''}`);
console.log('======================================================\n');

if (ko) process.exit(1);
