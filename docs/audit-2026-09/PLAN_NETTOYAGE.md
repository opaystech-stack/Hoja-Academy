# PLAN DE NETTOYAGE SÉCURISÉ — ÉTAPE 4

> Date : 2026-09-16 · **Aucune suppression exécutée** — ce document est un plan à valider.
> Méthode imposée : `fichier → rôle historique → usage actuel → dépendances → risque → décision`

---

## RÈGLE DE DÉCISION APPLIQUÉE

Un élément n'est déclaré supprimable **que** si :
1. son rôle est identifié,
2. **aucune** dépendance active ne le référence (vérifié par grep sur scripts/, deploy/, ui/, admin/, docs/, package.json),
3. son impact est nul sur une fonctionnalité métier,
4. il est régénérable **ou** il n'est plus produit par aucun pipeline.

Sinon → catégorie **CONSERVER** ou **À DÉCIDER**.

---

## CATÉGORIE 1 — SUPPRESSION SÛRE (déchets prouvés, 0 dépendance)

| Fichier | Rôle historique | Usage actuel | Dépendances | Risque | Décision |
|---|---|---|---|---|---|
| `nul` (racine, 889 o) | Artefact Windows d'une redirection `2>nul` mal échappée | Aucun | **0** (déjà dans `.gitignore`) | Nul | ✅ **SUPPRIMER** |
| `e2e_result.txt` (racine, 3,3 Ko) | Sortie capturée d'un run E2E le 14/09 | Aucun (résultat périmé) | **0** (déjà dans `.gitignore`) | Nul — le test se relance | ✅ **SUPPRIMER** |
| `audits/ph2/backup_fix/` (5 fichiers) | Sauvegardes pré-correction du 09/09 | Aucun — les fichiers live ont divergé (md5 différents) | **0** | Nul — historique git suffit | ✅ **SUPPRIMER** |
| `scripts/browser_real_results.json` (45 Ko) | Résultat de run browser | Aucun | 0 (gitignoré par `*results*.json`) | Nul | ✅ **SUPPRIMER** |
| `scripts/audit_landing_v4.js` | Audit one-shot de la landing legacy | Non branché dans `npm run release` | 0 | Faible — script d'analyse, pas de prod | ⚠️ **À DÉCIDER** (D-7) |
| `scripts/fix_typography.js` | Patch typographique one-shot (25/08) | Non branché | 0 | Faible — déjà appliqué | ⚠️ **À DÉCIDER** (D-7) |
| `scripts/test_landing_visual.js` | Test visuel landing legacy | Non branché | 0 | Faible | ⚠️ **À DÉCIDER** (D-7) |
| `scripts/check_hub_dashboard.js` | Test navigateur hub+dashboard | Non branché (mais cible des fichiers actifs) | 0 | Faible | ⚠️ **À DÉCIDER** (D-7) — **utile**, à rebrancher plutôt que supprimer |

---

## CATÉGORIE 2 — ARTEFACTS RÉGÉNÉRABLES (l'humain croit « déchet », le pipeline dit « sortie »)

⚠️ **PIÈGE IDENTIFIÉ** — ces éléments ont l'air de déchets mais sont des **sorties de build actives**.

| Fichier | Rôle historique | Usage actuel | Dépendances | Risque | Décision |
|---|---|---|---|---|---|
| `deploy/bundle-tmp/` (~90 fichiers) | Dossier de staging du bundle | **Produit par `scripts/build-bundle.js`** et documenté dans `README.md` comme étape de déploiement | `build-bundle.js`, `README.md` | **ÉLEVÉ si supprimé hors contexte** — régénérable par `node scripts/build-bundle.js` | 🔒 **CONSERVER le dossier** (ou supprimer en sachant qu'il se régénère) — gitignoré |
| `deploy/academy-bundle.tar.gz` | Archive de déploiement | **Étape 1 du redeploy documentée** (`scp … deploy/academy-bundle.tar.gz`) | `README.md`, `deploy-vps-academy.sh` | **ÉLEVÉ** — mais régénérable | 🔒 **CONSERVER** — gitignoré |
| `deploy/hoja-public.tar.gz` | **Build du site public actuel** | **Servi en production** | `deploy-vps-academy.sh`, `README.md` | **CRITIQUE** — seule trace du build prod | 🔒 **CONSERVER ABSOLUMENT** |
| `deploy/cockpit-p1p2.tar.gz` | Snapshot intermédiaire du cockpit (étape P1+P2) | Aucun — jamais référencé par un script de déploiement | **0** | Faible — `ui/` est désormais la source | ⚠️ **À DÉCIDER** (D-8) |
| `deploy/cockpit-modpolish.tar.gz` | Snapshot intermédiaire (polish module) | Aucun — jamais référencé | **0** | Faible — `ui/` est la source | ⚠️ **À DÉCIDER** (D-8) |
| `admin/` (24 fichiers) | Espace formateur legacy (Basic Auth) | **Généré par `build_admin.js`**, servi sur `/admin/`, **testé** (`test_parcours_formateur_admin.js`, `test_production_remote.js`) | `build_admin.js`, 2 tests, `build-bundle.js` | **ÉLEVÉ** — suppression = perte de l'espace formateur si encore utilisé | 🔒 **CONSERVER** tant que D3 non tranché |
| `public/` (73 fichiers) | Version apprenants sanitizée | **Généré par `build_public.js`**, testé par `test_public.js` (72/72) | `build_public.js`, `test_public.js` | Moyen — régénérable, mais 2 tests en dépendent | 🔒 **CONSERVER** (régénérable) |
| `presentations/` (18 html) | Redirections `module-XX/index.html` | **Produit par `build_all_presentations.js`** (miroir de redirection) | `config.js` (`moduleRedirect`), `build_all_presentations.js` | Faible — mais **c'est une sortie de build référencée par config.js** | 🔒 **CONSERVER** (ou retirer proprement du build — décision D-9) |
| `modules/XX/presentation.html` (18) | Présentations apprenants | **Servi** sur `/modules/XX/` | `config.js`, builds, tests | **CRITIQUE** | 🔒 **CONSERVER** |
| `ui/cockpit/data/M01-18.json` | Données cockpit | Produit par `build_cockpit_data.js`, **servi** | `build_cockpit_data.js`, `programme.js` | **CRITIQUE** | 🔒 **CONSERVER** |

---

## CATÉGORIE 3 — SOURCES ACTIVES (ne jamais supprimer)

| Élément | Pourquoi |
|---|---|
| `ui/{login,cockpit,campus,suivi}/` | Source du back-office actuel |
| `ui/cockpit/{programme.js,md.js}` | Logique du cockpit |
| `scripts/**` (générateurs + tests) | Pipeline de build et de test |
| `data/{modules,cohorte}.js` | **Registre unique** (⚠️ recopié à l'identique dans `admin/data/` — c'est le build, normal) |
| `modules/**/*.md` (72 fiches) | **Contenu pédagogique source** |
| `systeme-operationnel/**` (9 md) | Curriculum officiel |
| `docs/**` (hors `audit-2026-09`) | Runbooks (classroom, cohortes, onboarding, operations, work-kit, hermes, deploiement) |
| `AGENT.md` | Document maître pédagogique v3.0 |
| `deploy/classroom-gateway/**` | Backend actif (OAuth, rôles, Classroom) |
| `deploy/*.sh` | Scripts d'exploitation |
| `course-hub.html`, `formateur-dashboard.html` | **Sources** consommées par `build_admin.js` et testées |
| `scripts/templates/classroom-admin.html` | Template source de l'écran Classroom |
| `favicon.ico` | **Emblème live** (md5 identique à `Logo/favicon_hoja_64.png`), référencé par 20+ pages `ui/` |
| `package.json`, `package-lock.json`, `.gitignore` | Configuration |
| `screenshots/` | Captures QA (gitignoré) |

---

## CATÉGORIE 4 — ASSETS AU TRI (aucun script ne les référence)

| Fichier | Taille | Usage | Décision |
|---|---|---|---|
| `Logo/favicon_hoja_64.png` | 5,8 Ko | **Identique à `favicon.ico` live** | ✅ CONSERVER (master du favicon) |
| `Logo/favicon_hoja_32.png` | 2,2 Ko | Variante 32 px | ✅ CONSERVER (master) |
| `Logo/favicon.svg` | 708 o | SVG source | ✅ CONSERVER |
| `Logo/logo_hoja_nav.png` | 36 Ko | Logo nav | ✅ CONSERVER |
| `Logo/logo_hoja_horizontal.png` | 221 Ko | Logo horizontal | ✅ CONSERVER |
| `Logo/logo_hoja_ac.png` | 936 Ko | Logo (version lourde) | ⚠️ À DÉCIDER (D-10) |
| `Logo/favicon_hoja.png` | 763 Ko | Favicon pleine résolution (763 Ko pour un favicon = surdimensionné) | ⚠️ À DÉCIDER (D-10) |
| `Logo/favicon.png` | 244 Ko | Historique | ⚠️ À DÉCIDER (D-10) |
| **`Logo/logo-opays.png`** | **1,3 Mo** | **Logo de l'ANCIENNE marque OPAYS** | ✅ **SUPPRIMER** (identité abandonnée) — sous réserve D-3 |

⚠️ **Aucun script ne référence `Logo/`** → ce dossier est une **collection de masters**, pas un asset servi.
Le site public utilise `public/assets/hoja/` (dans la source Next.js), pas `Logo/`.

---

## CATÉGORIE 5 — HORS PÉRIMÈTRE / EXTERNES

| Élément | Statut |
|---|---|
| `node_modules/` (1904 fichiers) | Dépendances — gitignoré, ne pas toucher |
| `screenshots/` (81 png) | Régénérable — gitignoré |
| `C:\LAPOSTE\Projets\clones\academiartificial\app\` | **SOURCE DU SITE PUBLIC — à intégrer, jamais supprimer** |

---

## RÉCAPITULATIF

| Catégorie | Nombre | Action |
|---|---|---|
| 1 — Suppression sûre immédiate | **4 éléments** | ✅ prêt (attente de ton GO global) |
| 1 — Scripts à décider | **4** | ⚠️ D-7 |
| 2 — Artefacts régénérables à conserver | **10** | 🔒 ne pas supprimer |
| 3 — Sources actives | **~16** | 🔒 intouchables |
| 4 — Assets au tri | **9** (dont 1 suppression sûre) | ⚠️ D-10 |
| 5 — Hors périmètre | 3 | — |

**Déchets réellement certains : 5 fichiers** (`nul`, `e2e_result.txt`, `audits/ph2/backup_fix/` ×5,
`browser_real_results.json`, `Logo/logo-opays.png`). **Le reste n'est pas du déchet.**

---

## DÉCISIONS REQUISES

| # | Question |
|---|---|
| **D-7** | Les 4 scripts non branchés (`audit_landing_v4`, `fix_typography`, `test_landing_visual`, `check_hub_dashboard`) : supprimer ou rebrancher au gate ? |
| **D-8** | Les 2 snapshots intermédiaires `deploy/cockpit-*.tar.gz` : supprimer (l'historique git suffit) ? |
| **D-9** | `presentations/` : conserver (sortie de build) ou retirer proprement du pipeline ? |
| **D-10** | `Logo/` : supprimer les variantes lourdes (`favicon_hoja.png` 763 Ko, `favicon.png`, `logo_hoja_ac.png`, `logo-opays.png`) ? |
| **D-11** | `landing/index.html` : la landing legacy est-elle encore servie ? (la prod Next.js la remplace) |

---

*Fin ÉTAPE 4 — plan seulement. Aucune suppression sans ton accord explicite.*
