# CARTOGRAPHIE DÉFINITIVE DES SOURCES DE VÉRITÉ — HOJA ACADEMY

> Date : 2026-09-16 · ÉTAPE 1 (GitHub + sources) + ÉTAPE 2 (Cartographie)
> **Aucun fichier supprimé. Aucun code modifié. Production non touchée.**

---

## PARTIE A — ÉTAPE 1 : GitHub + sources

### A.1 — Repository GitHub

**Verdict : il n'y a AUCUN repository GitHub.**

Vérifications effectuées :

| Contrôle | Résultat |
|---|---|
| `git remote -v` dans `ACCADEMY OPAYS` | **vide** (aucun remote) |
| `.git/config` | pas de section `[remote]` — seule `[core]` + `[user] Opays Tech <academy@opays.tech>` |
| Dernier commit local | `e5ac29d` — 2026-09-15 23:12 |
| Branche | `main` uniquement |
| Working tree | propre (hors `.workbuddy-ai/` et `docs/audit-2026-09/` non suivis) |
| `.git` dans `clones/academiartificial` | **absent** (seul `.clone/` — artefacts de l'outil de clonage) |

→ **Étape 1 : impossible de cloner/comparer un repo GitHub qui n'existe pas.**
Le projet est versionné **en local uniquement** et déployé **directement sur le VPS**.
L'URL GitHub reste à fournir si tu veux que je connecte le repo (`git remote add` + `push`).

### A.2 — La source du frontend Next.js : TROUVÉE

**La source existe et est complète.**

Emplacement : `C:\LAPOSTE\Projets\clones\academiartificial\app`

C'est bien un projet **Next.js 15.5.19 / React 19.2.7 / Tailwind 4**, en **export statique** :

```
next.config.mjs  →  output: "export"  (génère out/)
tsconfig.json · package.json · postcss.config.mjs
src/
  app/            → page.tsx, layout.tsx, not-found.tsx, robots.ts, sitemap.ts, content.ts
    ├─ entreprises/  formations/  contact/  postuler/
    ├─ mentions-legales/ confidentialite/ cookies/ accessibilite/
    ├─ components/  sections/  svgs/  ditto/
  lib/            → site.ts (SITE_ORIGIN)
public/assets/hoja/   → visuels Hoja
out/               → BUILD (sortie de `npm run build`)
```

Racine du projet : `NAME = "cloned-app"` (nom technique hérité, à renommer).

### A.3 — CHAÎNE SOURCE → BUILD → DEPLOY → PRODUCTION (démontrée)

```
C:\LAPOSTE\Projets\clones\academiartificial\app\src\**    ← SOURCE (Next.js)
                    │
                    │  npm run build   (next build, output:export)
                    ▼
C:\LAPOSTE\Projets\clones\academiartificial\app\out\       ← BUILD local (15/09 21:25)
                    │
                    │  tar -czf  hoja-public.tar.gz out/. → copié dans le repo
                    ▼
ACCADEMY OPAYS\deploy\hoja-public.tar.gz                   ← ARTEFACT DE DÉPLOIEMENT
                    │
                    │  deploy-vps-academy.sh : tar -xzf → SITE_DIR (overlay sur /)
                    ▼
VPS 76.13.58.5 · /opt/opays-academy/site/  (nginx, conteneur opays-academy, Traefik)
                    ▼
https://course.opays.io/                                   ← PRODUCTION
```

**Preuve de correspondance source ↔ production :**

| Test | Résultat |
|---|---|
| Les 16 pages de `out/` = les 16 pages du tarball | ✅ identiques (404, accessibilite, confidentialite, contact, cookies, entreprises, formations/*4, formations, index, mentions-legales, postuler) |
| Marqueur structurel « empty Roboto div » présent dans les 2 | ✅ 2/2 |
| `index.html` : taille | 270 996 (local) vs 271 121 (prod) |
| `index.html` : md5 identique | ❌ (normal : hash de build + noms de chunks CSS différents) |
| Diff HTML après **normalisation du domaine** | **4 lignes seulement** → même révision de contenu |

**Conclusion : le tarball de production est un BUILD d'une révision quasi identique de cette même source.**

### A.4 — L'UNIQUE écart sémantique : le DOMAINE

| | Domaine |
|---|---|
| **Source** (`src/lib/site.ts`) | `https://hoja-academy.com` (défaut, surchargeable par `NEXT_PUBLIC_SITE_ORIGIN`) |
| **Production actuelle** | `https://course.opays.io` |
| **Cible annoncée** (KANBAN + source) | `hoja-academy.com` |

→ Le code source est déjà prêt pour **hoja-academy.com**. La prod tourne encore sur l'ancien domaine opays.
C'est une décision de bascule de domaine, pas un bug de code. **À trancher par toi.**

### A.5 — Preuve documentaire : le KANBAN de la source

`clones/academiartificial/app/KANBAN-HOJA.md` (43 Ko) titre :

> « CHANTIER D'IDENTITÉ HOJA ACADEMY — **CLÔTURÉ 08/09/2026** »
> Site : `C:\LAPOSTE\Projets\clones\academiartificial\app` (Next.js 15, export statique)
> « garder squelette/UX/animations — éliminer 100 % de l'identité AcademIArtificial, reconstruire l'identité Hoja Academy »
> Clôture : build ✅ 23/23 · gate traces ✅ 0 src + 0 out · QA ✅ 48/48

Ce document **confirme la généalogie complète** : source clonée d'origine → ré-identité Hoja complète.
Il liste aussi le **BACKLOG** (tarifs, témoignages, entité légale, réseaux sociaux, libellé nav « Candidater » vs « Postuler », i18n EN/FR, `llms.txt`).

**Nuance importante** : la **généalogie est reconnue mais le nom de dossier reste `academiartificial`**.
Le code est 100 % Hoja (0 trace selon le gate), seul l'**emplacement** porte encore l'ancien nom.

---

## PARTIE B — ÉTAPE 2 : Cartographie définitive des sources de vérité

### B.1 — Tableau demandé

| Domaine | Source de vérité | Build | Production | Peut être supprimé ? |
|---|---|---|---|---|
| **Site public** | `C:\LAPOSTE\Projets\clones\academiartificial\app\src\**` ⚠️ **HORS de ce repo** | `npm run build` → `app/out/` | `deploy/hoja-public.tar.gz` → VPS `course.opays.io` | ❌ **NON** — source unique. À **intégrer** dans le repo |
| **Cockpit** | `ui/cockpit/` (`index.html`, `programme.js`, `md.js`, `data/M01-18.json`) | `npm run build:cockpit` (`build_cockpit_data.js`) | VPS `/ui/cockpit/` (cookie + `authz` nginx) | ❌ NON — source active |
| **Admin (legacy)** | `scripts/build_admin.js` (générateur) + `admin/data/*.js` | `npm run build:admin` → `admin/` | VPS `/admin/` (Basic Auth) | ⚠️ **Généré** — `admin/` lui-même supprimable/régénérable. Le **générateur** reste. Statut métier à confirmer (voir D) |
| **Campus** | `ui/campus/index.html` (coquille + `/api/*`) | aucun (statique) | VPS `/ui/campus/` | ❌ NON — source active |
| **Formateur (suivi)** | `ui/suivi/index.html` (coquille + `/api/*`) | aucun (statique) | VPS `/ui/suivi/` | ❌ NON — source active |
| **Formateur (hub/dashboard)** | `course-hub.html` + `formateur-dashboard.html` + `data/modules.js` | `build_admin.js` en fait `admin/index.html` + `admin/formateur-dashboard.html` | VPS `/admin/` | ⚠️ Source utilisée — statut à confirmer (voir D) |
| **Modules (contenu)** | `modules/XX-nom/*.md` (72 fiches) | non généré (contenu source) | VPS `/modules/` (sanitizé via `build_public.js`) | ❌ NON — **contenu pédagogique source** |
| **Modules (présentations)** | `scripts/data_modules_*.js` + `presentation_template.js` | `npm run build:presentations` → `modules/XX/presentation.html` | VPS `/modules/` | ⚠️ `presentation.html` = généré ; les data restent |
| **Classroom Gateway** | `deploy/classroom-gateway/*` (`server.js`, `identity-api.js`) | Docker (`Dockerfile`) | Conteneur `opays-classroom-gateway:9001` | ❌ NON — **backend actif** (OAuth, rôles, Classroom) |
| **Données** | `data/modules.js` (registre 18 modules) + `data/cohorte.js` | `npm run build:registry` | consommé par hub/dashboard/cockpit/classroom | ❌ NON — source unique |

### B.2 — Sources de vérité NON listées (découvertes, importantes)

| Élément | Rôle réel | Sort |
|---|---|---|
| `systeme-operationnel/` (9 md) | Curriculum officiel (calendrier, matrice, évaluation) | ✅ Garder |
| `AGENT.md` | Document maître pédagogique v3.0 | ✅ Garder |
| `docs/` (classroom, cohortes, onboarding, operations, work-kit, hermes) | Runbooks opérationnels | ✅ Garder |
| `scripts/templates/classroom-admin.html` | Template de l'écran Classroom admin | ✅ Garder (source) |
| `deploy/deploy-vps-academy.sh` | **Le** script de déploiement (nginx + conteneurs) | ✅ Garder — document d'architecture réel |
| `deploy/classroom-gateway/.env.example` | Contrat de configuration | ✅ Garder |
| `Logo/` | Assets de marque (9 fichiers) | ⚠️ Partiellement obsolète (voir D) |

### B.3 — Généré vs Source (règle de tri)

**GÉNÉRÉ (ne jamais éditer à la main, régénérable) :**
`admin/` · `public/` · `presentations/` · `deploy/bundle-tmp/` · `modules/XX/presentation.html` · `ui/cockpit/data/*.json` · `scripts/*_results.json` · `deploy/*.tar.gz`

**SOURCE (éditer ici, jamais ailleurs) :**
`ui/**` · `scripts/**` · `data/**` · `modules/**/*.md` · `deploy/classroom-gateway/**` · `deploy/*.sh` · `docs/**` · `AGENT.md` · `systeme-operationnel/**`
**+ (à intégrer)** : `clones/academiartificial/app/src/**`

---

## PARTIE C — Incohérences structurelles confirmées

1. **Le repo ne contient pas la source du site public** → la brique la plus visible du produit est orpheline ici.
2. **Deux frontends publics différents coexistent** :
   - le vrai (Next.js Hoja, servi en prod)
   - un legacy (landing générée par `scripts/build_landing.js` → `landing/index.html`)
3. **Deux back-offices coexistent** :
   - `/admin/` legacy (Basic Auth, thème doré « OPAYS ACADEMY »)
   - `/ui/{cockpit,suivi,campus}` moderne (session Google, « HOJA ACADEMY »)
4. **Trois systèmes visuels** : Next.js/Tailwind (public) · cockpit clair dense · admin sombre doré.
5. **Marque mixte en prod** : homepage 34× « ACADEMY » + 32× « opays » + 17× « Hoja ».
6. **`assets/cloned/`** (109 images) toujours servi en prod — nom de dossier = trace du clonage.
7. **Nom du dossier source** = `academiartificial` (identité historique).

---

## PARTIE D — Points nécessitant TA décision (avant tout nettoyage)

| # | Question | Enjeu |
|---|---|---|
| **D1** | Je **copie la source Next.js** dans le repo (`C:\LAPOSTE\Projets\ACCADEMY OPAYS\site-public\` ou `frontend/`) ? | Sans ça, aucune refonte du site public possible |
| **D2** | Domaine cible définitif : `hoja-academy.com` (source) ou `course.opays.io` (prod) ? | Détermine canonical/SEO/og |
| **D3** | `/admin/` legacy (Basic Auth) est-il **encore utilisé** ou remplacé par `/ui/cockpit/` ? | Décide si `admin/`, `course-hub.html`, `formateur-dashboard.html` restent |
| **D4** | Le nom du dossier `academiartificial` doit-il être renommé (ex. `hoja-public-site`) ? | Propreté, mais casse les chemins/scripts |
| **D5** | GitHub : tu crées le repo et me donnes l'URL, ou on reste en local ? | Sauvegarde & collaboration |
| **D6** | `llms.txt` (backlog KANBAN) : à supprimer ? | Décision listée comme tienne |

---

## PARTIE E — Ce qui reste dans le repository final (principe)

**RESTE (source) :** `ui/` · `scripts/` (générateurs + tests) · `data/` · `modules/**/*.md` · `systeme-operationnel/` · `docs/` · `AGENT.md` · `README.md` · `deploy/classroom-gateway/` · `deploy/*.sh` · `deploy/.env.example` · `Logo/` (après tri) **+ la source Next.js intégrée**

**PART À DÉCIDER :** `admin/` · `public/` · `presentations/` · `course-hub.html` · `formateur-dashboard.html` · `landing/`

**DÉCHETS PROBABLES (à confirmer en Étape 4) :** `nul` · `e2e_result.txt` · `deploy/bundle-tmp/` · `audits/ph2/backup_fix/` · `deploy/academy-bundle.tar.gz` · `deploy/cockpit-*.tar.gz` · scripts one-shot (`audit_landing_v4.js`, `fix_typography.js`)

**À CONSERVER IMPÉRATIVEMENT :** `deploy/hoja-public.tar.gz` (trace du build prod actuel)

---

*Fin ÉTAPE 1 + ÉTAPE 2 — aucune modification effectuée.*
