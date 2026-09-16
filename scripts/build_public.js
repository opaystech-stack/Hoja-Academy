/**
 * OPAYS ACADEMY — Build de la version publique (apprenants)
 *
 * Produit public/ — la version HÉBERGEABLE (GitHub Pages / Netlify / etc.) :
 *   - Présentations SANITISÉES : contenu des notes formateur vidé, panneau vidé,
 *     fonctions notes neutralisées par redéclaration no-op (aucun parsing fragile),
 *     bouton 📝 masqué par CSS
 *   - Fiches apprenantes (01_/02_/03_) copiées ; guides formateur (00_GUIDE) EXCLUS
 *   - index.html minimal de redirection
 *
 * Les URLs restent stables : https://<hote>/modules/<code>/index.html
 * → régénérer après chaque release, les liens Classroom ne changent pas.
 *
 * Usage : node scripts/build_public.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');

const PUBLIC_DIR = path.join(DIRS.root, 'public');
const PUBLIC_MODULES = path.join(PUBLIC_DIR, 'modules');

// ─── Sanitisation d'une présentation ────────────────────────────────
function sanitizePresentation(html) {
  let out = html;

  // 1. Vider l'intérieur du panneau des notes mais CONSERVER #closeNotes
  //    (le JS y accroche un onclick — le supprimer casserait le runtime)
  const panelStart = out.indexOf('id="notesPanel"');
  if (panelStart >= 0) {
    const asideStart = out.lastIndexOf('<aside', panelStart);
    const asideEnd = out.indexOf('</aside>', panelStart);
    if (asideStart >= 0 && asideEnd >= 0) {
      out = out.slice(0, asideStart)
        + '<aside class="notes-panel" id="notesPanel" aria-hidden="true">'
        + '<div class="notes-head"><button class="close-panel-btn" id="closeNotes">✕</button></div>'
        + '</aside>'
        + out.slice(asideEnd + '</aside>'.length);
    }
  }

  // 1bis. Masquer par CSS : le panneau (désormais vide) et le bouton 📝
  const cssTag = '</style>';
  const hideCss = '\n/* ==== [Version publique] Zones formateur masquées ==== */\n'
    + '.notes-panel { display: none !important; }\n'
    + '#notesBtn { display: none !important; }\n';
  out = out.replace(cssTag, hideCss + cssTag);

  // 2. Vider l'objet notes (le contenu formateur ne doit pas être embarqué)
  //    On remplace tout l'objet par {} : recherche de "const notes = {" jusqu'au
  //    ";" de fin. Le contenu est du JSON généré (pas de ; dans les chaînes JSON
  //    échappées — safe pour les fichiers générés et manuels).
  const notesStart = out.indexOf('const notes = {');
  if (notesStart >= 0) {
    const semi = out.indexOf(';', notesStart);
    if (semi >= 0) out = out.slice(0, notesStart) + 'const notes = {};' + out.slice(semi + 1);
  }

  // 3. Neutraliser les fonctions notes par REDÉCLARATION en fin de script :
  //    en JS, une déclaration function tardive écrase la précédente — aucun
  //    parsing d'accolades nécessaire, la syntaxe d'origine reste intacte.
  const scriptEnd = out.lastIndexOf('</script>');
  if (scriptEnd >= 0) {
    const neutralizer = '\n// ==== [Version publique] Fonctions formateur neutralisées ====\n'
      + 'function toggleNotes() {}\n'
      + 'function updateNotes() {}\n'
      + "try { document.getElementById('notesBtn').style.display = 'none'; } catch (e) {}\n";
    out = out.slice(0, scriptEnd) + neutralizer + out.slice(scriptEnd);
  }

  // 4. Retirer les attributs data-note (clés internes formateur)
  out = out.replace(/ data-note="[^"]*"/g, '');

  // 4bis. Bouton retour « ← Académie OPAYS » vers l'accueil public
  const backBtn = '<a href="/" class="academy-home-link" title="Retour à l\u2019accueil Académie OPAYS">← Académie OPAYS</a>\n';
  const bodyStart = out.indexOf('<body');
  if (bodyStart >= 0) {
    const afterBody = out.indexOf('>', bodyStart) + 1;
    const css = '\n.academy-home-link{position:fixed;top:82px;left:14px;z-index:200;background:rgba(13,21,34,.9);border:1px solid var(--line);color:var(--blue-light);font-size:11px;font-weight:800;letter-spacing:.06em;padding:7px 14px;border-radius:999px;text-decoration:none;backdrop-filter:blur(8px);transition:.2s;}\n.academy-home-link:hover{color:#fff;border-color:rgba(56,189,248,.5);}\n@media(max-width:650px){.academy-home-link{top:80px;left:8px;font-size:10px;padding:6px 10px;}}\n';
    out = out.slice(0, afterBody) + css + out.slice(afterBody);
    out = out.slice(0, afterBody) + backBtn + out.slice(afterBody);
  }

  // 5. Nettoyer les textes formateur visibles ET les commentaires JS formateur
  out = out.replace(/NOTES FORMATEUR • AIDE-MÉMOIRE/g, 'AIDE-MÉMOIRE');
  out = out.replace(/Notes Formateur Panel/g, 'Panels');
  out = out.replace(/<!-- Slide-out Facilitator Notes Drawer -->/g, '');
  out = out.replace(/title="Notes Formateur \[N\]"/g, 'style="display:none"');
  out = out.replace(/\/\/ =+ NOTES FORMATEUR[^\n]*/g, '// ==== (contenu formateur retiré en version publique) ====');

  return out;
}

// ─── Build ───────────────────────────────────────────────────────────
fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
fs.mkdirSync(PUBLIC_MODULES, { recursive: true });

let count = 0;
modules.forEach(mod => {
  const srcPresentation = path.join(DIRS.modules, mod.code, 'presentation.html');
  // Dossier NUMÉRIQUE : URLs stables /modules/01/ … /modules/18/ (indépendantes du code)
  const destDir = path.join(PUBLIC_MODULES, String(mod.num).padStart(2, '0'));
  fs.mkdirSync(destDir, { recursive: true });

  // Présentation sanitizée → index.html (URL stable)
  const html = fs.readFileSync(srcPresentation, 'utf8');
  const sanitized = sanitizePresentation(html);
  fs.writeFileSync(path.join(destDir, 'index.html'), sanitized, 'utf8');

  // Fiches apprenantes : 01_*, 02_*, 03_* (les 00_GUIDE formateur sont EXCLUS)
  const fiches = fs.readdirSync(path.join(DIRS.modules, mod.code))
    .filter(f => /\.md$/i.test(f) && !/^00_/.test(f));
  fiches.forEach(f => fs.copyFileSync(
    path.join(DIRS.modules, mod.code, f),
    path.join(destDir, f)
  ));

  count++;
});

// Index minimal de redirection
const indexHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Académie OPAYS — Ressources de formation</title>
<style>
body{background:#070b12;color:#e2e8f0;font-family:Inter,system-ui,sans-serif;margin:0;padding:40px 20px;}
main{max-width:800px;margin:0 auto;}
h1{font-size:24px;color:#38BDF8;}
p{color:#94a3b8;line-height:1.7;}
a{color:#0066FF;text-decoration:none;font-weight:600;}
a:hover{text-decoration:underline;}
ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;}
li{background:#0d1522;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:12px 16px;}
li small{display:block;color:#64748b;font-size:12px;margin-top:4px;}
</style>
</head>
<body>
<main>
<h1>🎓 Académie OPAYS — Ressources de formation</h1>
<p>Ces ressources accompagnent votre parcours Google Classroom.
Suivez le <strong>Thème 00 — COMMENCER ICI</strong> pour démarrer, puis la <strong>semaine en cours</strong>.</p>
<ul>
${modules.map(m => `<li><a href="modules/${String(m.num).padStart(2, '0')}/">Module ${String(m.num).padStart(2, '0')} — ${m.title}</a><small>${m.subtitle}</small></li>`).join('\n')}
</ul>
</main>
</body>
</html>
`;
fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), indexHtml, 'utf8');

// ─── Vérification de sécurité ────────────────────────────────────────
console.log('✅ Build public :', PUBLIC_DIR);
console.log(`   ${count} présentations sanitizées + fiches apprenantes`);

let leaked = 0;
modules.forEach(mod => {
  const p = path.join(PUBLIC_MODULES, String(mod.num).padStart(2, '0'), 'index.html');
  const h = fs.readFileSync(p, 'utf8');

  // 1. L'objet notes doit être VIDE
  const notesObj = h.match(/const notes = (\{[^;]*\});/);
  const notesEmpty = notesObj && notesObj[1].trim() === '{}';
  if (!notesEmpty) { console.log(`   ⚠️  ${mod.code} : objet notes non vidé`); leaked++; }

  // 2. Le panneau ne doit pas contenir de contenu formateur
  const panelContent = h.match(/id="notesPanel"[\s\S]*?<\/aside>/);
  const panelEmpty = !panelContent || panelContent[0].includes('</aside></aside>') || panelContent[0].length < 90;
  if (!panelEmpty && panelContent[0].includes('<small>')) { console.log(`   ⚠️  ${mod.code} : contenu dans le panneau notes`); leaked++; }

  // 3. Pas de data-note
  if (h.includes('data-note=')) { console.log(`   ⚠️  ${mod.code} : data-note résiduel`); leaked++; }
});

// Vérification finale globale
if (leaked === 0) console.log('   🔒 Aucun contenu formateur dans la version publique');
else { console.error(`   ❌ ${leaked} fichier(s) avec traces formateur`); process.exitCode = 1; }
