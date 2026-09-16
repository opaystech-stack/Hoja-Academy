/**
 * OPAYS ACADEMY — Configuration centralisée des chemins
 * Source unique de vérité pour tous les scripts. Le projet est portable :
 * aucun chemin absolu nulle part, tout est résolu depuis la racine du repo.
 */
'use strict';

const path = require('path');

// Racine du projet = parent du dossier scripts/ (fonctionne quel que soit le CWD)
const PROJECT_ROOT = path.resolve(__dirname, '..');

const DIRS = {
  root: PROJECT_ROOT,
  modules: path.join(PROJECT_ROOT, 'modules'),
  presentations: path.join(PROJECT_ROOT, 'presentations'),
  scripts: path.join(PROJECT_ROOT, 'scripts'),
  data: path.join(PROJECT_ROOT, 'data'),
  systeme: path.join(PROJECT_ROOT, 'systeme-operationnel'),
  logo: path.join(PROJECT_ROOT, 'Logo'),
  screenshots: path.join(PROJECT_ROOT, 'screenshots'),
  docs: path.join(PROJECT_ROOT, 'docs'),
};

const FILES = {
  hub: path.join(PROJECT_ROOT, 'course-hub.html'),
  dashboard: path.join(PROJECT_ROOT, 'formateur-dashboard.html'),
  readme: path.join(PROJECT_ROOT, 'README.md'),
  registry: path.join(DIRS.data, 'modules.js'),
  workKitTemplate: path.join(DIRS.systeme, 'TEMPLATE_MON_AI_WORK_KIT.md'),
};

/** Chemin d'une présentation de module : modules/<code>/presentation.html */
function modulePresentation(moduleCode) {
  return path.join(DIRS.modules, moduleCode, 'presentation.html');
}

/** Chemin de la redirection : presentations/module-XX/index.html */
function moduleRedirect(moduleNum) {
  const pad = String(moduleNum).padStart(2, '0');
  return path.join(DIRS.presentations, `module-${pad}`, 'index.html');
}

module.exports = { PROJECT_ROOT, DIRS, FILES, modulePresentation, moduleRedirect };
