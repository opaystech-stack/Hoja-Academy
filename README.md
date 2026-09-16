# 🧠 Académie OPAYS — Système de Formation à l'IA pour Professionnels

> **« L'IA pour les Professionnels : De la Découverte aux Systèmes Autonomes »**
> Formation intensive de 8 semaines (16 séances live) pour rendre les professionnels autonomes, critiques et outillés avec l'IA dans leur travail quotidien — **RDC & Afrique francophone**.

---

## 🎯 Vue d'ensemble

| Composant | Description | Accès |
|---|---|---|
| **Site public** | Frontend Next.js (export statique) — accueil, formations, entreprises, postuler | `hoja-site/` |
| **18 modules pédagogiques** | Présentations interactives HTML + 4 fiches officielles par module | `modules/` |
| **Cockpit** | Back-office officiel (inscriptions, apprenants, programme, Classroom, formateurs) | `ui/cockpit/` |
| **Campus apprenant** | Espace apprenant (progression, missions) | `ui/campus/` |
| **Suivi formateur** | Suivi de cohorte | `ui/suivi/` |
| **Passerelle Classroom** | API, OAuth Google, rôles, sessions | `deploy/classroom-gateway/` |
| **Registre** | Métadonnées des 18 modules (source de vérité) | `data/modules.js` |
| **Système opérationnel** | 9 documents : parcours, calendrier, matrice de progression, évaluation | `systeme-operationnel/` |
| **Kit de lancement** | Posts Classroom prêts à copier-coller, dates calculées | `docs/classroom/posts/` |
| **Onboarding** | Email de bienvenue + checklist J-10→J0 | `docs/onboarding/` |
| **Multi-cohortes** | Procédure Cohorte 02+ en 30 minutes | `docs/cohortes/ARCHITECTURE_MULTI_COHORTES.md` |
| **AI Work Kit** | Le fil rouge : 10 volets progressifs → soutenance | `docs/work-kit/GUIDE_FIL_ROUGE.md` |

> **Sources de vérité & audits** : `docs/audit-2026-09/` (audit global, cartographie des sources,
> plan de nettoyage, baseline des tests).

## 🚀 Démarrage rapide (formateur)

```bash
npm install          # une seule fois (puppeteer-core pour les tests navigateur)
npm run release      # audit complet : registre + cohérence + 432 tests Chrome
```

Puis ouvrir :
- **`course-hub.html`** — vue d'ensemble des 18 modules par semaine
- **`formateur-dashboard.html`** — conduire une séance (timer 110 min, notes, prompts)

## 🏫 Lancer une cohorte (résumé — 30 min)

1. `npm run release` — vérifier que tout est vert.
2. Renseigner `data/cohorte.js` (nom de la cohorte, lien Meet, lien Classroom, date de début, tarif) — **source unique** : les boutons 📹 Meet / 🏫 Classroom apparaissent dans le hub et le dashboard, et le kit est généré avec ces valeurs.
3. `npm run classroom:kit 2026-09-07 --out docs/classroom/posts/cohorte-01` — générer le kit (base URL automatique depuis `data/cohorte.js` → liens absolus `course.opays.io`).
4. Créer la classe Classroom + les 13 thèmes + copier les posts du kit (voir blueprint).
5. Suivre `docs/onboarding/CHECKLIST_ONBOARDING.md` (J-10 → J0).
6. Envoyer l'email de bienvenue (`docs/onboarding/EMAIL_BIENVENUE.md`).

**Guide complet (12 étapes, non-technique)** : `docs/operations/GUIDE_LANCER_COHORTE.md`

**Détails** : `docs/classroom/BLUEPRINT_CLASSROOM.md` • `docs/cohortes/ARCHITECTURE_MULTI_COHORTES.md`

## 🌐 Espaces en production (Phase 5/6)

| Espace | URL | Accès |
|---|---|---|
| **Public** (landing) | `https://course.opays.io/` | Tout le monde |
| **Apprenant** (supports) | `https://course.opays.io/modules/01/` … `/18/` | Mot de passe cohorte (`apprenant` / …) |
| **Formateur** (admin) | `https://course.opays.io/admin/` | Mot de passe admin |

- Landing v4 : page commerciale premium (thème clair institutionnel, header flottant pill, hero « L'IA ne doit pas seulement répondre », diagramme système animé, bento bénéfices, méthode 4 étapes, FAQ 5 questions) — CTA → formulaire de candidature, page `merci.html` après soumission
- Modules apprenants : versions **sanitizées** (aucune note formateur), protégées par Basic Auth
- Admin : hub + dashboard + **18 présentations complètes avec notes formateur**
- Redéploiement : `node scripts/build-bundle.js` → `scp deploy/academy-bundle.tar.gz deploy/deploy-vps-academy.sh root@76.13.58.5:/tmp/` → `ssh … 'ADMIN_USER=… ADMIN_PASS=… LEARN_USER=… LEARN_PASS=… bash /tmp/deploy-vps-academy.sh'`

## 🛠️ Scripts

| Commande | Rôle |
|---|---|
| `npm run test` | Cohérence transversale (91 checks) + QA structurelle (18/18) |
| `npm run test:browser` | 432 tests Chrome réels (navigation, notes, prompts, responsive) |
| `npm run build:public` | Génère `public/` — version apprenants sanitizée (sans contenu formateur) |
| `npm run test:public` | 72 tests version publique (chargement, navigation, aucune trace formateur) |
| `npm run test:parcours` | 13 tests parcours apprenant bout-en-bout (J0 → S1 → prompts → mobile) |
| `npm run test:formateur` | 21 tests parcours formateur (hub, dashboard, timer, notes, prompts, liens) |
| `npm run test:all` | Tout |
| `npm run release` | **Release gate** : registre → cohérence → Chrome → public → parcours → formateur → Classroom (bloque si échec) |
| `npm run build:registry` | Normaliser le registre central `data/modules.js` |
| `npm run build:presentations` | Régénérer les présentations depuis les data (M16/M18 protégés) |
| `node scripts/generate_classroom_posts.js <DATE> --out <dossier>` | Kit de lancement Classroom — **base URL auto depuis `data/cohorte.js`** (liens absolus course.opays.io) |
| `node scripts/generate_classroom_posts.js <DATE> --out <dossier> --base-url <URL>` | Kit avec base URL explicite (override) |
| `node scripts/check_hub_dashboard.js` | Test navigateur du hub + dashboard |

## 🏗️ Architecture (source de vérité unique)

```
AGENT.md + systeme-operationnel/     ← curriculum officiel (ne pas modifier pour la technique)
        │
        ▼
data/modules.js                      ← registre central (métadonnées des 18 modules)
        │  ▲
        │  └─ généré par scripts/build_registry.js
        ▼
course-hub.html ──┐
formateur-dashboard.html ──┼── consomment le registre (jamais de données en dur)
scripts/*.js ─────┘
        │
        ▼
modules/XX/presentation.html        ← générés depuis scripts/data_modules_*.js
                                     + presentation_template.js (M01, M16, M18 manuels)
```

**Règles d'or** :
- Les métadonnées des modules vivent UNIQUEMENT dans `data/modules.js` (jamais recopiées).
- Les compteurs du hub sont calculés depuis le registre (jamais en dur).
- Les chemins sont relatifs via `scripts/config.js` (projet portable).
- Ne jamais régénérer M16/M18 (enrichis manuellement — protégés dans le build).

## 📦 Contenu pédagogique

- **18 modules** × (présentation interactive + 4 fiches : guide d'animation, synthèse, pratique, exercices)
- **16 séances live** sur 8 semaines (mardi/jeudi 18h30-20h30)
- **8 missions** hebdomadaires (dépôt Classroom lundi 23h59)
- **AI Work Kit** : 10 volets progressifs → soutenance finale + certification
- **4 blocs** : Fondamentaux → Skills & Assistants → Agents & Sécurité → Automatisation & Impact

## 🔒 Sécurité & bonnes pratiques

- Aucun secret dans le repo (`.gitignore` protège `.env`, tokens, résultats de tests).
- `node_modules/` et `screenshots/` jamais versionnés.
- Le HTML est 100 % statique : hébergeable sur GitHub Pages / Netlify / Drive partagé.
- Testé sur Chrome/Edge (Windows) via Puppeteer.

## 📚 Documentation

| Sujet | Fichier |
|---|---|
| Diffusion Google Classroom | `docs/classroom/BLUEPRINT_CLASSROOM.md` |
| Onboarding | `docs/onboarding/` |
| Multi-cohortes | `docs/cohortes/ARCHITECTURE_MULTI_COHORTES.md` |
| AI Work Kit (fil rouge) | `docs/work-kit/GUIDE_FIL_ROUGE.md` |
| Architecture Hermes (bots) | `docs/hermes/ARCHITECTURE_BOTS.md` |
| Curriculum maître | `AGENT.md` |

---

© OPAYS ACADEMY 2026 — Opays Tech. Tous droits réservés.
