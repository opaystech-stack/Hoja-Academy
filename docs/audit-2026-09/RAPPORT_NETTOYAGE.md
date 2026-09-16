# RAPPORT DE NETTOYAGE ARCHITECTURAL — ACCADEMY OPAYS / HOJA

**Date :** 16 septembre 2026
**Commit :** `3cdbd34` — *Reprise produit Hoja: audit complet, integration source site public, nettoyage securise*
**Branche :** `main`
**État Git :** arbre de travail propre (0 modification non commitée)
**Fichiers suivis :** 748

---

## 1. Fichiers supprimés

| Fichier | Raison | Décision |
|---|---|---|
| `Logo/logo-opays.png` (1,3 Mo) | Ancienne identité OPAYS Tech, non référencée | D10 |
| `Logo/favicon.svg` | Favicon or « Opays Tech », identité abandonnée | D10 |
| `Logo/favicon.png` | Ancien favicon OPAYS, remplacé par `favicon_hoja_64.png` | D10 |
| `deploy/cockpit-p1p2.tar.gz` | Snapshot intermédiaire de chantier, obsolète | D8 |
| `deploy/cockpit-modpolish.tar.gz` | Snapshot intermédiaire de chantier, obsolète | D8 |
| `scripts/audit_landing_v4.js` (137 l.) | Script one-shot d'audit landing, mission terminée | D7 |
| `scripts/fix_typography.js` (59 l.) | Script one-shot de correction typo, mission terminée | D7 |
| `scripts/test_landing_visual.js` (103 l.) | Test visuel one-shot, remplacé par `test_browser_real.js` | D7 |
| `audits/ph2/backup_fix/` (5 fichiers) | Backups d'une phase de correction déjà clôturée | audit |
| `e2e_result.txt` | Sortie de test jetable | audit |
| `scripts/browser_real_results.json` | Résultat de test jetable | audit |

**Total : 14 suppressions Git + 2 fichiers non suivis.**

---

## 2. Fichiers conservés — et pourquoi

| Fichier / dossier | Pourquoi conservé |
|---|---|
| `deploy/hoja-public.tar.gz` (24 Mo) | **Artefact de production actif** — overlay déployé sur le VPS. Ne jamais supprimer (D8). |
| `deploy/bundle-tmp/` + `academy-bundle.tar.gz` | **Piège du faux-débris** : ce sont des sorties de build actives de `build-bundle.js`, documentées dans le README. |
| `landing/` | **Dépendance active** : `build-bundle.js` copie `landing/index.html` dans le bundle, et `deploy-vps-academy.sh` s'en sert en fallback (D11). |
| `presentations/` (18 fichiers) | Les redirections `module-XX` et les parcours apprenants en dépendent encore (D9). |
| `llms.txt` | Conservé le temps de l'analyse SEO/IA (D6). |
| `admin/` | Conservé : sa suppression est conditionnée à l'adaptation du script de déploiement (voir §6). |
| `Logo/favicon_hoja_32.png`, `favicon_hoja_64.png` | Favicons Hoja ; `favicon_hoja_64.png` est identique (md5) à `favicon.ico` racine. |
| `Logo/logo_hoja_horizontal.png`, `logo_hoja_nav.png` | Logos Hoja maîtres, actifs. |
| `scripts/check_hub_dashboard.js` | **Couverture unique** : teste le hub + dashboard, non couverts par `test_browser_real.js` (18 modules seulement). Branché dans le gate (D7). |

**Logo/** : 3,4 Mo → **276 Ko**.

---

## 3. Fichiers déplacés / renommés

| Avant | Après | Type |
|---|---|---|
| `C:\LAPOSTE\Projets\clones\academiartificial\app` (hors repo) | `hoja-site/` (dans le repo) | **Intégration D1** |
| `Logo/favicon_hoja.png` | `hoja-site/public/apple-icon.png` | Rename Git R100 |
| `Logo/logo_hoja_ac.png` | `hoja-site/public/assets/hoja/logo-hoja-cercle.png` | Rename Git R100 |
| `package.json` name `cloned-app` | `hoja-site` | Renommage D4 |

**`hoja-site/`** : 27 Mo sur disque, **389 fichiers suivis** dans Git. Exclus : `node_modules/`, `.next/`, `out/`, `preview.html`, `tsconfig.tsbuildinfo`, `nul`.
**`hoja-site/audits/`** : 10 Mo → **285 Ko** (snapshots `snapshot_src`, `backup_content`, `backup_css`, `sheets` retirés ; rapports `.md/.csv/.json` conservés).

---

## 4. Nouvelles sources de vérité

| Domaine | Source de vérité | Build | Production |
|---|---|---|---|
| **Site public (vitrine)** | `hoja-site/src/` (Next.js 15.5.19 / React 19.2.7 / Tailwind 4) | `npm run build` → `hoja-site/out/` | `deploy/hoja-public.tar.gz` → `https://course.opays.io` |
| **Back-office** | `ui/cockpit/` | `scripts/build_cockpit_data.js` | Cockpit 2B |
| **Campus apprenant** | `ui/campus/` | généré | Cockpit 2B |
| **Suivi formateur** | `ui/suivi/` | généré | Cockpit 2B |
| **Passerelle Classroom** | `deploy/classroom-gateway/` (Node/Express, OAuth Google) | — | service VPS |
| **Registre** | `data/` | `scripts/build_registry.js` | toutes surfaces |
| **Modules pédagogiques** | `modules/*.md` | `build_public.js` | `public/` |
| **Rôles/permissions** | role `admin` = rôle API actif | — | à conserver impérativement |

**Précision critique :** la chaîne `hoja-site/src` → `out/` → `hoja-public.tar.gz` → `course.opays.io` est **prouvée** par diff sémantique : la seule différence avec la production est le domaine (`hoja-academy.com` dans la source vs `course.opays.io` en prod). Après normalisation : **4 lignes de diff**.

---

## 5. Architecture finale

```
ACCADEMY OPAYS/
├── hoja-site/              ← SOURCE OFFICIELLE du site public (Next.js)
│   ├── src/app/, src/lib/, src/components/
│   ├── public/
│   └── AGENTS.md, ARCHITECTURE.md, KANBAN-HOJA.md
├── ui/
│   ├── login/              ← authentification
│   ├── cockpit/            ← BACK-OFFICE OFFICIEL (remplace /admin/)
│   ├── campus/             ← espace apprenant
│   └── suivi/              ← espace formateur
├── modules/                ← contenu pédagogique (source Markdown)
├── systeme-operationnel/   ← documentation opérationnelle
├── data/                   ← registre
├── deploy/
│   ├── classroom-gateway/  ← passerelle Node/Express
│   ├── hoja-public.tar.gz  ← artefact de production (NE PAS SUPPRIMER)
│   └── deploy-vps-academy.sh
├── scripts/                ← pipeline de build + tests
├── presentations/          ← à conserver (parcours en dépendent)
├── landing/                ← à conserver (dépendance build active)
├── admin/                  ← LEGACY (retrait conditionné)
└── docs/audit-2026-09/     ← cette documentation
```

---

## 6. Ce qui reste — legacy documenté

### 6.1 `/admin/` — retrait conditionné (D3)

**Verdict :** `/admin/` est bien du legacy, `/ui/cockpit/` en est un **sur-ensemble fonctionnel** (Cockpit, Inscriptions, Apprenants, Programme, Classroom, Formateurs + vues module : Fiche, Déroulé, Exercices, Mission, Notes formateur, Présentation).

**Blocage :** `deploy/deploy-vps-academy.sh` **ligne 57** contient :
```bash
[ -d "$SITE_DIR/admin" ] || { echo "❌ admin/ manquant"; exit 1; }
```
→ La suppression doit être **coordonnée** avec l'adaptation du script de déploiement, sinon le déploiement casse.

**Sans perte de données :** `admin/work-kit/TEMPLATE_MON_AI_WORK_KIT.md` est identique (md5 `b7cfd01c…`) à `systeme-operationnel/TEMPLATE_MON_AI_WORK_KIT.md`.

**⚠️ Attention :** la chaîne `'admin'` comme **rôle API** est active et ne doit **jamais** être supprimée. Seul le **chemin** `/admin/` est legacy.

### 6.2 `nul` — suppression impossible (contournée)

Fichier de 889 octets au nom réservé Windows. Toutes les méthodes ont échoué : `rm` bash, couche trash du sandbox (0x800704B0), `fs.unlinkSync`, `.NET File.Delete` (accès refusé), robocopy, FSO COM, P/Invoke, `del`.

**Non bloquant :** `nul` est **déjà gitignoré** (`.gitignore` ligne 49), vérifié via `git check-ignore -v` → il **ne peut pas atteindre GitHub**. Reste une commande manuelle pour l'utilisateur si souhaité.

---

## 7. Résultats de tests — TOUT VERT

| Suite | Résultat |
|---|---|
| `npm test` | **91/91** + **18/18** |
| `npm run test:hub` | **PASS** (nouveau gate) |
| `npm run test:browser` | **432/432** ✅ *(baseline : 430/431 — le seul échec pré-existant Module 09 « Dock ressources » est résolu)* |
| `npm run test:public` | **72/72** |
| `test:parcours` | **13/13** |
| `test:formateur` | **21/21** |
| `test:admin` | **16/16** |
| `test:identity` | **46/46** |
| E2E | **63/63** |
| `check:classroom` | **OK** |

**Aucune régression.** Le nettoyage a même **amélioré** `test:browser` de 430/431 à 432/432.

---

## 8. Conformité des exclusions Git

| Motif | Fichiers suivis |
|---|---|
| `node_modules` | **0** ✅ |
| `.workbuddy-ai` | **0** ✅ |
| `.next/` | **0** ✅ |
| `hoja-site/out/` | **0** ✅ |
| `nul` | **0** ✅ |

**Scan secrets (D5) :** propre. Seuls des noms de variables et placeholders de fixtures dans le code de la passerelle. `.env.example` = templates vides. `deploy/credentials/htpasswd-admin` = 0 octet.

---

## 9. Commit réalisé

```
3cdbd348ea7f169353a719d75279e8e4b124a014
Auteur : Opays Tech
Date   : Wed Sep 16 16:54:47 2026 +0200
Sujet  : Reprise produit Hoja: audit complet, integration source site public, nettoyage securise

410 files changed, 22136 insertions(+), 2158 deletions(-)
  ├─ 393 ajouts (dont 389 fichiers hoja-site/)
  ├─ 14 suppressions
  └─ 2 renames R100
```

---

## 10. État Git

- **Branche :** `main` @ `3cdbd34`
- **Arbre de travail :** **propre** (0 fichier modifié/non suivi)
- **Fichiers suivis :** 748
- **Taille `.git` :** 326 Mo
- **Historique :** intact, aucun rewrite, aucun force-push

---

## 11. Remote GitHub — étape restante

`git remote -v` → **vide**. Aucun remote configuré.

**Étape exacte restante (D5) :**
```bash
# 1. Créer le dépôt privé sur GitHub, puis :
git remote add origin git@github.com:<ORGANISATION>/<DEPOT>.git
git push -u origin main
```

**Il me manque uniquement l'URL du dépôt privé.** Dès que vous me la fournissez, j'exécute `remote add` + `push -u origin main`. Le commit est prêt, l'arbre est propre, aucun secret n'est versionné — le push est sûr.

---

## 12. Ce qui reste avant d'attaquer le DESIGN/UX

Le nettoyage architectural est **terminé et vérifié**. Restent 3 points, tous **non bloquants** pour le chantier design :

1. **Remote GitHub** — en attente de l'URL (action utilisateur).
2. **Retrait `/admin/`** — nécessite l'adaptation de `deploy-vps-academy.sh` ligne 57. Travail d'½ journée, à faire dans un commit dédié.
3. **`nul`** — commande manuelle optionnelle.

**Dette design déjà identifiée dans `hoja-site/`** (à traiter au chantier DESIGN/UX, pas avant) :
- `src/app/sections/` : **7 fichiers sur 10 jamais importés** (noms espagnols de clone : `el-futuro-est-section`, `el-mundo-est-section`, `en-solo8-section`, `feature-grid-section`, `feature-grid-section2`, `hero-section`, `metodolog-propia-deac-section`).
- **11 variantes** de `list-row*.tsx`.
- **Polices résiduelles** : Exo 2, Orbitron, WooCommerce, dashicons, fcicons, ld-icons, swiper-icons.

---

## Verdict

**FEU VERT pour le chantier DESIGN/UX.** L'architecture est propre, la source du site public est intégrée et prouvée conforme à la production, les tests sont tous verts (avec une amélioration nette sur `test:browser`), et Git est dans un état sain et commité.

Seule action bloquante externe : **fournir l'URL du dépôt GitHub privé** pour finaliser D5.
