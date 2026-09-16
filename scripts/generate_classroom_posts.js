/**
 * OPAYS ACADEMY — Générateur des posts Google Classroom (Kit de lancement)
 * Produit les textes prêts à copier-coller pour chaque semaine d'une cohorte :
 * ressources programmées + devoirs, calculés depuis le registre central et le calendrier.
 *
 * Usage :
 *   node scripts/generate_classroom_posts.js                    → cohorte avec dates génériques
 *   node scripts/generate_classroom_posts.js 2026-09-07         → cohorte démarrant le lundi 07/09/2026
 *   node scripts/generate_classroom_posts.js 2026-09-07 --out docs/classroom/posts/cohorte-01
 *   node scripts/generate_classroom_posts.js 2026-09-07 --base-url https://academy.opays.tech
 *     → liens absolus prêts à coller dans Classroom (après hébergement des présentations)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const modules = require('../data/modules.js');
const cohorte = require('../data/cohorte.js');

// ─── Calendrier officiel (systeme-operationnel/02_CALENDRIER_COHORTE_8_SEMAINES.md) ──
const DEVOIRS = {
  1: 'D1 : Boîte de 5 prompts C.O.R.E. appliqués à son travail — dépôt sur Classroom (capture ou doc).',
  2: 'D2 : 1 synthèse exécutive + 1 tableau comparatif extraits de documents réels (avec citations).',
  3: 'D3 : Schéma d\u2019un workflow métier complet avec ses 2 Skills documentés.',
  4: 'D4 : Fichier Agent.md configuré + fiche de permissions d\u2019outils.',
  5: 'D5 : Livrer son Agent IA en Version 2 (V2) avec rapport de correction.',
  6: 'D6 : Recherche sourcée avec grille Source Checker + AI Safety Card signée.',
  7: 'D7 : Dépôt du support de soutenance finale (5 slides max).',
  8: 'D8 : AI Work Kit complet + preuve de ROI mesuré.',
};

const WORKKIT_VOLETS = {
  1: 'Volet 01 — Mon Profil & Mes Tâches Cibles',
  2: 'Volet 02 — Ma Boîte de Prompts C.O.R.E.',
  3: 'Volet 03 — Mes Procédures d\u2019Extraction & Analyse Documentaire',
  4: 'Volet 04 — Mes Skills Métiers Formalisés',
  5: 'Volet 05 — Mon Assistant Spécialisé & Fichier Agent.md',
  6: 'Volet 06 — Mes Outils, Connecteurs & MCP (Permissions)',
  7: 'Volet 07 — Mon Agent IA Homologué & Sécurité (Safety Card)',
  8: 'Volet 08 — Mes Workflows Semi-Automatisés (Contrôle Humain)',
  9: 'Volet 09 — Mon Système IA Quotidien (Routine des 15 min)',
  10: 'Volet 10 — Mon Bilan de Soutenance & Mesure du ROI Réel',
};

// ─── Utilitaires de date ─────────────────────────────────────────────
function parseDateArg(arg) {
  if (!arg) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(arg);
  if (!m) { console.error('❌ Date invalide (attendu YYYY-MM-DD) :', arg); process.exit(1); }
  return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
}

function fmt(d) {
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

function addDays(d, n) {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

// ─── Génération ──────────────────────────────────────────────────────
const startArg = process.argv[2];
const outArgIndex = process.argv.indexOf('--out');
const outDir = outArgIndex >= 0 ? process.argv[outArgIndex + 1] : null;
const baseUrlIndex = process.argv.indexOf('--base-url');
// Base URL : explicite (--base-url) OU config centralisée data/cohorte.js
const baseUrl = baseUrlIndex >= 0 ? process.argv[baseUrlIndex + 1] : (cohorte.baseUrl || null);
const start = parseDateArg(startArg);

/** URL d'une présentation : absolue si --base-url fourni, sinon chemin relatif.
 *  URLs STABLES : /modules/01/ … /modules/18/ (indépendantes du code du module) */
function moduleUrl(code, num) {
  const rel = `modules/${String(num).padStart(2, '0')}/`;
  return baseUrl ? `${baseUrl.replace(/\/+$/, '')}/${rel}` : rel;
}

if (start) {
  // Vérifier que la date de début est un lundi
  if (start.getUTCDay() !== 1) {
    console.error(`❌ La date de début doit être un LUNDI (${startArg} est un ${start.toLocaleDateString('fr-FR', { weekday: 'long' })})`);
    process.exit(1);
  }
  console.log(`📅 Cohorte démarrant le lundi ${fmt(start)}\n`);
}

const lines = [];
lines.push('# 🏫 OPAYS ACADEMY — Kit de Lancement Google Classroom');
lines.push('');
lines.push(start ? `> **Cohorte démarrant le lundi ${fmt(start)}** — dates de programmation calculées.` : '> **Cohorte à dates génériques** — remplacer {SEMAINE-N} et les dates avant copie.');
lines.push('');
lines.push('## 📌 Thèmes à créer (13)');
lines.push('');
lines.push('| # | Thème | Visibilité |');
lines.push('|---|-------|------------|');
lines.push('| 00 | COMMENCER ICI | Publier immédiatement |');
lines.push('| 01-08 | SEMAINE 1 à SEMAINE 8 | Programmer (lundi de la semaine, 06h00) |');
lines.push('| 09 | MISSIONS HEBDOMADAIRES | Devoirs programmés (jeudi 21h00) |');
lines.push('| 10 | LA BOÎTE À OUTILS | Publier immédiatement |');
lines.push('| 11 | ACCOMPAGNEMENT | Publier immédiatement |');
lines.push('| 12 | FORMATEUR SEULEMENT | DRAFT (jamais publié) |');
lines.push('');

// ─── Posts par semaine ───────────────────────────────────────────────
for (let week = 1; week <= 8; week++) {
  const weekModules = modules.filter(m => m.week === week);
  const lundi = start ? addDays(start, (week - 1) * 7) : null;
  const mardi = lundi ? addDays(lundi, 1) : null;
  const jeudi = lundi ? addDays(lundi, 3) : null;
  const deadline = lundi ? addDays(lundi, 6) : null; // lundi suivant

  lines.push(`## 🗓️ SEMAINE ${week}${lundi ? ` — du ${fmt(lundi)} au ${fmt(deadline)}` : ''}`);
  lines.push('');

  // Ressource hebdo (matériel programmé le lundi 06h00)
  lines.push(`### 📚 Ressources de la semaine (matériel — programmer ${lundi ? `lundi ${fmt(lundi)} à 06h00` : '{DATE LUNDI SEMAINE-N} 06h00'})`);
  lines.push('');
  lines.push(`**Titre du post** : 📚 Semaine ${week} — Vos ressources`);
  lines.push('');
  lines.push('**Description** :');
  lines.push('');
  for (const mod of weekModules) {
    lines.push(`### 🎓 ${mod.title} — ${mod.subtitle}`);
    lines.push('');
    lines.push(`- **Présentation interactive** : [Lancer le module ${mod.num}](${moduleUrl(mod.code, mod.num)})`);
    lines.push(`- **Objectif** : ${mod.objective}`);
    lines.push(`- **Séance** : ${mod.seance} • **Durée** : ${mod.durationLabel}`);
    lines.push(`- **Prompts disponibles** : ${mod.prompts}`);
    lines.push(`- **Fiches** : fiche de synthèse + exercices du module (jointes)`);
    lines.push('');
  }
  lines.push(`- **🧰 AI Work Kit** : compléter le **${WORKKIT_VOLETS[week] || 'volet de la semaine'}`);
  lines.push('');

  // Devoir hebdo (programmé jeudi 21h00, échéance lundi 23h59)
  lines.push(`### 📤 Devoir ${week} (devoir — programmer ${jeudi ? `jeudi ${fmt(jeudi)} à 21h00` : '{DATE JEUDI SEMAINE-N} 21h00'} — échéance ${deadline ? `lundi ${fmt(deadline)} à 23h59` : '{DATE LUNDI SUIVANT} 23h59'})`);
  lines.push('');
  lines.push(`**Titre** : 📤 ${DEVOIRS[week].split(' : ')[0]} — ${DEVOIRS[week].split(' : ').slice(1).join(' : ').split(' — dépôt')[0]}`);
  lines.push('');
  lines.push(`**Consigne** : ${DEVOIRS[week].split(' : ').slice(1).join(' : ')}`);
  lines.push('');
  lines.push('**Barème** : Rendu complet (3 pts) • Application au travail réel (3 pts) • Soin & clarté (2 pts) • Dépôt avant échéance (2 pts)');
  lines.push('');
  lines.push('---');
  lines.push('');
}

// ─── Thème 00 — COMMENCER ICI ────────────────────────────────────────
lines.push('## 🚀 THÈME 00 — COMMENCER ICI (posts permanents à publier immédiatement)');
lines.push('');
lines.push('### 🎬 Bienvenue à l\u2019Académie OPAYS');
lines.push(`> Bienvenue dans votre formation « L\u2019IA pour les Professionnels » ! Pendant 8 semaines, vous allez transformer votre façon de travailler. Commencez par le Thème 00, puis suivez simplement la semaine en cours. **Une semaine = un thème = 2-3 ressources + 1 mission.**`);
lines.push('');
lines.push('### 🔗 Lien de la classe');
lines.push(`> ${cohorte.classroomUrl || '[CLASSROOM_URL — renseigner data/cohorte.js]'}`);
lines.push('');
lines.push('### 📋 Diagnostic Initial (formulaire — 5 min)');
lines.push('> Remplissez votre diagnostic avant le premier jour : votre métier, vos tâches chronophages, votre niveau de départ. C\u2019est la base de votre parcours personnalisé.');
lines.push('');
lines.push('### 💼 Mon AI Work Kit (document personnel)');
lines.push('> Ouvrez votre document **« [Prénom_Nom] — Mon AI Work Kit »** (copie individuelle partagée avec vous). Vous le complétez un volet par semaine. À la fin, il est votre preuve de compétence pour la soutenance.');
lines.push('');
lines.push('### 🔗 Salle Meet permanente + 📅 Calendrier');
lines.push(`> **Lien Meet** : ${cohorte.meetUrl || '[MEET_URL — renseigner dans data/cohorte.js]'} — même lien pour les 16 séances (mardi & jeudi 18h30-20h30). **Permanence déblocage** : samedi 10h-11h. Règles : caméra recommandée, participation active, zéro jargon.`);
lines.push('');

// ─── Notes d'implémentation ──────────────────────────────────────────
lines.push('## ⚙️ Notes d\u2019implémentation');
lines.push('');
lines.push('- **Programmer un post** (UI Classroom) : créer le post → flèche ▾ → « Programmer » → date/heure.');
lines.push('- **Brouillon** : créer le post → flèche ▾ → « Brouillon ». Visible uniquement des enseignants.');
lines.push('- **Lier un fichier Drive** : les fiches et présentations doivent être dans un dossier Drive partagé (ou le HTML hébergé, voir README §Hébergement).');
lines.push('- **Pour la Cohorte 02+** : utiliser « Réutiliser le post » depuis la classe Cohorte 01, puis ajuster les dates.');
lines.push('- **API optionnelle** : voir docs/classroom/BLUEPRINT_CLASSROOM.md §6 (Niveau 2).');
lines.push('');
lines.push('## 🔐 Accès aux présentations (mot de passe apprenants)');
lines.push('');
lines.push('> Les liens des modules sont protégés par un mot de passe (Basic Auth).');
lines.push('> **À communiquer aux apprenants dans le Thème 00** (ou via l\u2019email de bienvenue) :');
lines.push('');
lines.push('```');
lines.push('URL       : https://course.opays.io/modules/01/ … /modules/18/');
lines.push('Identifiant : apprenant');
lines.push('Mot de passe : [renseigner dans deploy/deploy-vps-academy.sh — LEARN_PASS]');
lines.push('```');
lines.push('');
lines.push('> ⚠️ Un seul identifiant pour toute la cohorte. À changer entre deux cohortes (voir deploy.sh).');

const output = lines.join('\n');

if (outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  const suffix = start ? '-' + startArg : '';
  const file = path.join(outDir, `kit-lancement${suffix}.md`);
  fs.writeFileSync(file, output, 'utf8');
  console.log(`✅ Kit écrit : ${file}`);
  if (baseUrl) console.log(`   🔗 Liens absolus : ${baseUrl}/modules/...`);
  else console.log('   ⚠️  Liens relatifs — relancez avec --base-url <URL> pour des liens cliquables dans Classroom');
} else {
  console.log(output);
}
