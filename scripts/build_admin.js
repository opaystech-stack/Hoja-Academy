/**
 * OPAYS ACADEMY — Build de l'espace ADMIN / FORMATEUR
 * Produit admin/ — ESPACE PRIVÉ (protégé par Basic Auth côté nginx) :
 *   - 18 présentations COMPLÈTES (avec notes formateur, prompts, data-note)
 *   - course-hub.html (renommé index.html — le hub devient l'entrée admin)
 *   - formateur-dashboard.html
 *   - bouton « ← Hub formateur » ajouté aux présentations
 *
 * Usage : node scripts/build_admin.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const ADMIN_DIR = path.join(DIRS.root, 'admin');
const ADMIN_MODULES = path.join(ADMIN_DIR, 'modules');

fs.rmSync(ADMIN_DIR, { recursive: true, force: true });
fs.mkdirSync(ADMIN_MODULES, { recursive: true });

// ─── Injecter le bouton retour vers le hub dans une présentation ─────
function injectBackLink(html) {
  const backBtn = '<a href="../index.html" class="admin-home-link" title="Retour au Hub formateur">← Hub formateur</a>\n';
  const bodyStart = html.indexOf('<body');
  if (bodyStart < 0) return html;
  const afterBody = html.indexOf('>', bodyStart) + 1;
  const css = '\n.admin-home-link{position:fixed;top:82px;left:14px;z-index:200;background:rgba(13,21,34,.9);border:1px solid var(--line);color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.06em;padding:7px 14px;border-radius:999px;text-decoration:none;backdrop-filter:blur(8px);transition:.2s;}\n.admin-home-link:hover{color:#fff;border-color:rgba(212,175,55,.5);}\n@media(max-width:650px){.admin-home-link{top:80px;left:8px;font-size:10px;padding:6px 10px;}}\n';
  return html.slice(0, afterBody) + css + html.slice(afterBody)
    + '\n' + backBtn + html.slice(afterBody + 0);
}

// ─── Copie des présentations complètes ───────────────────────────────
modules.forEach(mod => {
  const src = path.join(DIRS.modules, mod.code, 'presentation.html');
  const dest = path.join(ADMIN_MODULES, String(mod.num).padStart(2, '0'), 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const html = fs.readFileSync(src, 'utf8');
  // Bouton retour après <body> (réinjecter proprement — position recalculée APRÈS l'insertion du CSS)
  const headEnd = html.indexOf('</head>');
  const css = '<style>.admin-home-link{position:fixed;top:82px;left:14px;z-index:200;background:rgba(13,21,34,.92);border:1px solid rgba(212,175,55,.4);color:var(--gold);font-size:11px;font-weight:800;letter-spacing:.06em;padding:7px 14px;border-radius:999px;text-decoration:none;z-index:300;box-shadow:0 4px 20px rgba(0,0,0,.4);} .admin-home-link:hover{color:#fff;border-color:var(--gold);} @media(max-width:650px){.admin-home-link{top:80px;left:8px;font-size:10px;padding:6px 10px;}}</style>';
  const withCss = html.slice(0, headEnd) + css + html.slice(headEnd);
  const bodyStart = withCss.indexOf('<body');
  const afterBody = withCss.indexOf('>', bodyStart) + 1;
  const backBtn = '<a href="../../index.html" class="admin-home-link" title="Revenir au Hub formateur">← Hub formateur</a>';
  const withBtn = withCss.slice(0, afterBody) + backBtn + withCss.slice(afterBody);
  fs.writeFileSync(dest, withBtn, 'utf8');
});

// ─── Hub formateur → index.html (entrée de l'espace admin) ───────────
// Adapter les liens (template literals JS) : modules/${mod.code}/presentation.html
// → modules/${mod.numStr}/index.html  (numStr = "01"…"18" présent dans le registre)
let hub = fs.readFileSync(path.join(DIRS.root, 'course-hub.html'), 'utf8');
hub = hub.split('modules/${mod.code}/presentation.html').join('modules/${mod.numStr}/index.html');
fs.writeFileSync(path.join(ADMIN_DIR, 'index.html'), hub, 'utf8');

// ─── Dashboard (liens adaptés + work kit + hub) ──────────────────────
let dash = fs.readFileSync(path.join(DIRS.root, 'formateur-dashboard.html'), 'utf8');
dash = dash.split('modules/${mod.code}/presentation.html').join('modules/${mod.numStr}/index.html');
// Le hub est copié sous index.html : les liens 'course-hub.html' du dashboard
// doivent pointer vers index.html dans admin/ (sinon 404 en prod /admin/).
dash = dash.split('course-hub.html').join('index.html');
// Work Kit : pointer vers la copie locale admin/work-kit/
dash = dash.split('docs/work-kit/TEMPLATE_MON_AI_WORK_KIT.md')
  .join('work-kit/TEMPLATE_MON_AI_WORK_KIT.md');
fs.writeFileSync(path.join(ADMIN_DIR, 'formateur-dashboard.html'), dash, 'utf8');

// ─── Données (registre + cohorte pour le hub/dashboard) ───────────────
fs.cpSync(path.join(DIRS.root, 'data'), path.join(ADMIN_DIR, 'data'), { recursive: true });

// ─── Écran Google Classroom (admin) ──────────────────────────────────
// Page qui interroge le gateway (/api/classroom/*) avec les credentials
// Basic du navigateur (même realm que nginx → pas de popup supplémentaire).
const classroomTemplate = path.join(DIRS.scripts, 'templates', 'classroom-admin.html');
if (fs.existsSync(classroomTemplate)) {
  fs.copyFileSync(classroomTemplate, path.join(ADMIN_DIR, 'classroom.html'));
  console.log('   Écran Classroom : admin/classroom.html');
}

// ─── Work Kit template (accessible au formateur) ──────────────────────
fs.mkdirSync(path.join(ADMIN_DIR, 'work-kit'), { recursive: true });
fs.copyFileSync(
  path.join(DIRS.systeme, 'TEMPLATE_MON_AI_WORK_KIT.md'),
  path.join(ADMIN_DIR, 'work-kit', 'TEMPLATE_MON_AI_WORK_KIT.md')
);

console.log('✅ Espace admin :', ADMIN_DIR);
console.log(`   18 présentations complètes + hub + dashboard + données`);

// Vérification : les notes formateur sont bien présentes (contraste avec public)
let withNotes = 0;
modules.forEach(mod => {
  const p = path.join(ADMIN_MODULES, String(mod.num).padStart(2, '0'), 'index.html');
  const h = fs.readFileSync(p, 'utf8');
  if (h.includes('notesPanel') && h.includes('NOTES FORMATEUR')) withNotes++;
});
console.log(`   ${withNotes}/18 présentations avec notes formateur (attendu : 18)`);
if (withNotes !== 18) process.exitCode = 1;
