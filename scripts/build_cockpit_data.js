/**
 * OPAYS ACADEMY — Build des données du cockpit (P1+P2 : Programme unifié)
 * SANS toucher aux sources pédagogiques ni au backend :
 *   ui/cockpit/programme.js          — squelette : 4 blocs officiels + 18 modules (métadonnées)
 *   ui/cockpit/data/MNN.json         — détail par module (déroulé, phases, notes formateur,
 *                                      mission, workKit, promptChips, fiches Markdown embarquées)
 *   ui/cockpit/modules/NN/index.html — présentation admin complète, protégée par la SESSION
 *                                      Google du cockpit (chemin /ui/cockpit/… → auth_request),
 *                                      avec retour « ← Cockpit — Programme ».
 *
 * Usage : node scripts/build_cockpit_data.js   (à ajouter dans npm run release)
 * Découpage officiel (systeme-operationnel/01_PARCOURS_PEDAGOGIQUE_DEFINITIF.md,
 * verrouillé par Fénelon le 14/09) :
 *   BLOC 1 M01-M05 · BLOC 2 M06-M09 · BLOC 3 M10-M13 · BLOC 4 M14-M18
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'ui', 'cockpit');
const MODULES_DIR = path.join(ROOT, 'modules');
const modules = require(path.join(ROOT, 'data', 'modules.js'));

const BLOCKS = [
  { id: 1, title: 'Fondamentaux & manipulation', weeks: 'Semaines 1-2 · Séances 1 à 4', from: 1, to: 5 },
  { id: 2, title: 'Méthodes, Skills & Assistants', weeks: 'Semaines 3-4 · Séances 5 à 8', from: 6, to: 9 },
  { id: 3, title: 'Agents, Écosystèmes & Sécurité', weeks: 'Semaines 5-6 · Séances 9 à 12', from: 10, to: 13 },
  { id: 4, title: 'Impact, Automatisation & Certification', weeks: 'Semaines 7-8 · Séances 13 à 16', from: 14, to: 18 },
];

const byNum = {};
for (const m of modules) byNum[m.num] = m;
const missing = BLOCKS.flatMap(b => Array.from({ length: b.to - b.from + 1 }, (_, i) => b.from + i).filter(n => !byNum[n]));
if (missing.length) { console.error('❌ modules manquants :', missing.join(',')); process.exit(1); }

// ─── squelette programme.js ──────────────────────────────────────────
const programme = {
  blocs: BLOCKS.map(b => ({
    ...b,
    modules: Array.from({ length: b.to - b.from + 1 }, (_, i) => {
      const m = byNum[b.from + i];
      return { num: m.num, numStr: String(m.num).padStart(2, '0'), code: m.code, title: m.title, subtitle: m.subtitle, week: m.week, seance: m.seance, durationLabel: m.durationLabel, status: m.status };
    }),
  })),
  generatedAt: new Date().toISOString().slice(0, 10),
};
fs.mkdirSync(path.join(OUT_DIR, 'data'), { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'programme.js'),
  '/* Généré par scripts/build_cockpit_data.js — ne pas éditer. Source : data/modules.js */\nwindow.HOJA_PROGRAMME=' + JSON.stringify(programme) + ';\n', 'utf8');

// ─── détail par module MNN.json ──────────────────────────────────────
let fichesOk = 0;
for (const m of modules) {
  const dir = path.join(MODULES_DIR, m.code);
  const fiches = [];
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.md')).sort()) {
      fiches.push({ name: f, content: fs.readFileSync(path.join(dir, f), 'utf8') });
    }
  }
  if (fiches.length >= 3) fichesOk++;
  const blocOf = BLOCKS.find(b => m.num >= b.from && m.num <= b.to) || null;
  const detail = {
    num: m.num, numStr: String(m.num).padStart(2, '0'), code: m.code,
    blocId: blocOf ? blocOf.id : null, blocTitle: blocOf ? blocOf.title : null,
    title: m.title, subtitle: m.subtitle, objective: m.objective,
    week: m.week, seance: m.seance, seanceNum: m.seanceNum,
    durationLabel: m.durationLabel, status: m.status,
    phases: m.phases || [], notes: m.notes || null, mission: m.mission || null,
    workKit: m.workKit || null, promptChips: m.promptChips || [],
    slides: m.slides, prompts: m.prompts, fiches,
  };
  fs.writeFileSync(path.join(OUT_DIR, 'data', 'M' + detail.numStr + '.json'), JSON.stringify(detail), 'utf8');
}

// ─── présentations dans l'espace cockpit (session, pas Basic) ────────
for (const m of modules) {
  const src = path.join(MODULES_DIR, m.code, 'presentation.html');
  if (!fs.existsSync(src)) { console.error('❌ présentation absente :', src); process.exit(1); }
  const dest = path.join(OUT_DIR, 'modules', String(m.num).padStart(2, '0'), 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  let html = fs.readFileSync(src, 'utf8');
  const headEnd = html.indexOf('</head>');
  const fav = '<link rel="icon" type="image/png" href="/favicon.ico">';
  html = html.slice(0, headEnd) + fav + html.slice(headEnd);
  const css = '<style>.cockpit-back-link{position:fixed;top:82px;left:14px;z-index:200;display:inline-flex;align-items:center;min-height:var(--touch-min);background:var(--card);border:1px solid var(--line);color:var(--blue);font-size:12px;font-weight:800;letter-spacing:.04em;padding:0 16px;border-radius:var(--radius-full);text-decoration:none;}@media(max-width:650px){.cockpit-back-link{top:80px;left:8px;padding:0 14px;}}</style>';
  html = html.slice(0, headEnd) + css + html.slice(headEnd);
  const bodyStart = html.indexOf('<body');
  const afterBody = html.indexOf('>', bodyStart) + 1;
  html = html.slice(0, afterBody) + '<a href="/ui/cockpit/#programme" class="cockpit-back-link">← Cockpit — Programme</a>' + html.slice(afterBody);
  fs.writeFileSync(dest, html, 'utf8');
}

const nTot = programme.blocs.reduce((a, b) => a + b.modules.length, 0);
console.log(`✅ Cockpit Programme : ${nTot}/18 modules (${programme.blocs.map(b => 'B' + b.id + ':' + b.modules.length).join(' · ')}) — ${fichesOk}/18 avec 3+ fiches Markdown — 18 présentations sous /ui/cockpit/modules/`);
if (nTot !== 18 || fichesOk !== 18) process.exitCode = 1;
