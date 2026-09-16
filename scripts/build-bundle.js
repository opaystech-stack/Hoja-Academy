/**
 * OPAYS ACADEMY — Build du bundle de déploiement (Phase 5/6)
 *
 * Assemble /tmp/academy-bundle/ (transférable sur le VPS) :
 *   public/  → landing (index.html + merci.html) + modules apprenants sanitizés
 *   admin/   → hub + dashboard + modules complets (notes formateur)
 *
 * Usage : node scripts/build_bundle.js
 * Puis  : scp /tmp/academy-bundle.tar.gz deploy/deploy-vps-academy.sh root@76.13.58.5:/tmp/
 *         ssh root@76.13.58.5 'ADMIN_USER=... ADMIN_PASS=... LEARN_USER=... LEARN_PASS=... bash /tmp/deploy-vps-academy.sh'
 */
'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');

const ROOT = DIRS.root;

// 1. Reconstruire les trois espaces
console.log('==> Build landing…');
execSync('node scripts/build_landing.js', { cwd: ROOT, stdio: 'inherit' });
console.log('==> Build admin…');
execSync('node scripts/build_admin.js', { cwd: ROOT, stdio: 'inherit' });
console.log('==> Build public…');
execSync('node scripts/build_public.js', { cwd: ROOT, stdio: 'inherit' });

// 2. Assembler le bundle (dans deploy/ — chemin portable Windows/bash)
//    STRUCTURE PLATE attendue par nginx (racine /usr/share/nginx/html) :
//      index.html (landing) • merci.html • modules/ (sanitizés) • admin/ (privé)
const bundle = path.join(ROOT, 'deploy', 'bundle-tmp');
fs.rmSync(bundle, { recursive: true, force: true });
fs.mkdirSync(path.join(bundle, 'modules'), { recursive: true });
fs.mkdirSync(path.join(bundle, 'admin'), { recursive: true });

// modules apprenants sanitizés (public/modules → modules/)
fs.cpSync(path.join(ROOT, 'public', 'modules'), path.join(bundle, 'modules'), { recursive: true });

// landing à la racine (index.html + merci.html)
fs.copyFileSync(path.join(ROOT, 'landing', 'index.html'), path.join(bundle, 'index.html'));
if (fs.existsSync(path.join(ROOT, 'landing', 'merci.html'))) {
  fs.copyFileSync(path.join(ROOT, 'landing', 'merci.html'), path.join(bundle, 'merci.html'));
  console.log('→ merci.html inclus');
}

// admin : espace privé
fs.cpSync(path.join(ROOT, 'admin'), path.join(bundle, 'admin'), { recursive: true });

// Phase 2B : coquilles d'UI (login/campus/suivi/cockpit) — aucune donnee privee,
// les donnees viennent de l'API (session + role verifie cote serveur).
// favicon.ico a la racine : evite le 404 automatique du navigateur sur /favicon.ico
{
  const ico = path.join(ROOT, 'Logo', 'favicon_hoja_64.png');
  if (fs.existsSync(ico)) fs.copyFileSync(ico, path.join(bundle, 'favicon.ico'));
}
if (fs.existsSync(path.join(ROOT, 'ui'))) {
  fs.cpSync(path.join(ROOT, 'ui'), path.join(bundle, 'ui'), { recursive: true });
  console.log('→ ui/ inclus (Phase 2B)');
}

// 3. Archive — via bash (portable) : appelé depuis le terminal, sinon ignoré
console.log(`✅ Bundle prêt : ${bundle}/`);
console.log(`   → Archiver avec : tar -czf deploy/academy-bundle.tar.gz -C deploy/bundle-tmp .`);
