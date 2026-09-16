# AUDIT GLOBAL — ACCADEMY OPAYS / HOJA ACADEMY

> Date : 2026-09-16 · Phase 0 (audit seul — aucune modification de code)
> Périmètre : 557 fichiers hors `node_modules/` et `.git/`

---

## 0. RÉSUMÉ EXÉCUTIF — LE POINT CRITIQUE

**Le dépôt ne contient pas le code source du site public.**

Le site public en production (`https://course.opays.io/`) est un **frontend Next.js (Hoja Academy)**,
poussé en production via `deploy/hoja-public.tar.gz` (sortie `next build` = dossier `out/`).
Ce dossier contient :

- `index.html`, `entreprises.html`, `formations.html`, `formations/*.html`, `postuler.html`,
  `contact.html`, pages légales, `404.html`, `sitemap.xml`, `robots.txt`
- `_next/static/...` (bundles JS + 9 fichiers CSS)
- `assets/hoja/*` (logos, visuels) **et `assets/cloned/*`** (109 images + fonts + svg + videos)

Or **il n'existe nulle part sur le disque** le projet Next.js source de ce frontend :
- aucun `next.config.*`, aucun `tsconfig.json`, aucun dossier `app/` ou `pages/` dans le repo ;
- recherche étendue sur `C:\LAPOSTE` : aucun projet contenant ce frontend.

### Conséquence directe

Toutes les exigences de la mission portant sur **le site public** (§5, §10, §14, §15 « build Next.js »)
sont **impossibles à exécuter dans ce dépôt** tant que la source Next.js n'est pas fournie :

| Exigence | État |
|---|---|
| Refonte UI/UX Homepage, Entreprises, Formations, Postuler | ❌ bloqué (pas de source) |
| Design tokens Next.js, CSS du site public | ❌ bloqué |
| Nettoyage `assets/cloned/` (109 images) en production | ❌ bloqué (pas de source) |
| Réparer le mélange de marque « opays » (32×) / « Hoja » dans le HTML public | ❌ bloqué |
| `npm run build` du frontend public | ❌ bloqué |

**Ce qui EST auditable et réparable dans ce dépôt** : le back-office/cockpit statique
(`ui/`), l'espace admin/formateur (`admin/`), le contenu pédagogique (`modules/`),
les données (`data/`), les scripts/builds/tests Node, la passerelle Classroom
(`deploy/classroom-gateway/`), et tout le nettoyage « déchets historiques » (§3).

---

## 1. ARCHITECTURE RÉELLE (3 générations superposées)

Le projet est la superposition de **trois générations** architecturales distinctes :

### Génération 1 — « Académie OPAYS » statique (js/nginx + Basic Auth)
- `modules/` : 18 dossiers, contenu pédagogique Markdown (72 `.md`) + `presentation.html` généré
- `course-hub.html`, `formateur-dashboard.html` : vue formateur statique
- `admin/` : **généré** par `scripts/build_admin.js` (hub + dashboard + 18 présentations complètes)
- `public/` : **généré** par `scripts/build_public.js` (18 présentations sanitizées)
- `data/modules.js` + `data/cohorte.js` : registre central
- Servi via nginx + `htpasswd` (Basic Auth) → **l'ancienne prod**

### Génération 2 — « Frontend Next.js Hoja » (hors dépôt)
- `deploy/hoja-public.tar.gz` = `out/` d'un Next.js absent du repo
- **C'est le site public réellement servi aujourd'hui** (`/` → `_next/static` confirmé par le script de deploy)
- Contient des traces de clone : `assets/cloned/{images,fonts,svg,videos}`
- Noms de routes historiques en espagnol (`/curso-ia`, `/empresas`, `/contacto`, `/aviso-legal`,
  `/politica-de-privacidad`, `/noticias-ia`, `/programa-afiliados`…) — redirigées en 301 vers le FR

### Génération 3 — « Cockpit 2B » (gateway + UI statique + OAuth)
- `deploy/classroom-gateway/` : Node/Express, `server.js` (737 l.) + `identity-api.js` (773 l.)
- `ui/{login,cockpit,campus,suivi}/` : coquilles HTML **sans données**, hydratées par `/api/*`
- Auth : session cookie + OAuth Google, rôles, `authz` nginx (`auth_request`)
- **C'est le back-office/cockpit actuel** — la partie la plus moderne

### Dépendance source du clone
`C:\LAPOSTE\Projets\clones\academiartificial` = le site cloné d'origine (espagnol, `app/`, `.clone/`).
C'est de là que dérivent les routes ES et le dossier `assets/cloned/` du site live.

---

## 2. CARTOGRAPHIE : UTILISÉ vs OBSOLÈTE vs DUPLIQUÉ

### 2.1 Utilisé en production aujourd'hui
| Élément | Rôle |
|---|---|
| `deploy/hoja-public.tar.gz` | Site public Next.js (source absente) |
| `ui/cockpit/`, `ui/login/`, `ui/campus/`, `ui/suivi/` | Back-office 2B (source de vérité) |
| `deploy/classroom-gateway/*` | API, OAuth, rôles, Classroom |
| `modules/**/*.md` | Contenu pédagogique (curriculum) |
| `data/modules.js` | Registre 18 modules |
| `deploy/deploy-vps-academy.sh` | Déploiement |
| `admin/` + `public/` | Générés, servis (`/admin/`, `/modules/`) |

### 2.2 Obsolète / mort (à confirmer par usage avant suppression)
| Élément | Constat |
|---|---|
| `nul` (racine) | Fichier artefact Windows — **déchet confirmé**, déjà dans `.gitignore` |
| `e2e_result.txt` (racine) | Sortie de test — **déchet confirmé**, déjà dans `.gitignore` |
| `deploy/bundle-tmp/` | Sortie de build — régénérable, déjà dans `.gitignore` |
| `audits/ph2/backup_fix/` | Sauvegardes d'anciens fichiers (md5 différents des live) — **historique mort** |
| `deploy/*.tar.gz` (academy-bundle, cockpit-p1p2, cockpit-modpolish, hoja-public) | Certains sont des **snapshots d'étapes intermédiaires** ; `hoja-public` est nécessaire (source !), les 2 `cockpit-*` sont probablement redondants avec `ui/` |
| `scripts/audit_landing_v4.js` | Audit one-shot de la landing legacy |
| `scripts/fix_typography.js` | Script one-shot historique |
| `scripts/browser_real_results.json`, `check_hub_dashboard.js`, `test_landing_visual.js` | Scripts non branchés dans `npm run release` |
| `Logo/logo-opays.png`, `Logo/favicon.png`, `Logo/favicon_hoja.png` (763 Ko) | Assets historiques non servis |
| `public/`, `admin/`, `deploy/bundle-tmp/`, `presentations/` | **Générés** — doublons de contenu par construction |

### 2.3 Duplication de contenu (structurelle)
- Les 72 `.md` de `modules/` existent en **3 exemplaires** : `modules/`, `public/modules/`, `deploy/bundle-tmp/modules/`
- Les 18 `presentation.html` : `modules/`, `admin/modules/`, `public/modules/`, `presentations/`
- `admin/*` est **généré** → ne doit jamais être édité en main
- `presentations/` (18 html) : rôle ambigu, possiblement redondant avec `admin/modules/`

### 2.4 Incohérences de marque (traces héritées)
| Emplacement | Constat |
|---|---|
| **Site public live** (`index.html`) | 34× « ACADEMY » + 32× « opays » + 17× « Hoja » — **mélange dans la même page** |
| Site public live | `https://course.opays.io` en canonical/og:url (ancien domaine) |
| `admin/*` (23 fichiers) | Titre `OPAYS ACADEMY`, `--gold` (doré) — **ancienne direction visuelle** |
| `root` (`course-hub.html`, `formateur-dashboard.html`) | Ancienne identité OPAYS |
| `README.md`, `AGENT.md`, `package.json` | « Académie OPAYS », « accademy-opays » |
| `data/cohorte.js` | Référence opays |
| `assets/cloned/` (live) | Nom de dossier évoquant explicitement le clonage |

---

## 3. INCOHÉRENCES DE DESIGN IDENTIFIÉES

Plusieurs **systèmes visuels coexistent** :

1. **Admin/legacy** : thème sombre, accent **doré** (`--gold`, `#d4af37`), cartes arrondies, `admin-home-link`
2. **Cockpit 2B / `ui/`** : thème clair, densité 13 px, radius 12, boutons 36 px, `tabular-nums` — **moderne, direction Linear/Vercel**
3. **Site public Next.js** : design distinct (9 feuilles CSS), `assets/hoja/*` premium
4. **Site cloné d'origine** : `assets/cloned/*` (109 images) toujours présentes

→ **Pas un système Hoja, mais au moins 3–4 systèmes superposés.** C'est le chantier §4 de la mission.

---

## 4. BACKEND / API / SÉCURITÉ (état vérifié)

- `deploy/classroom-gateway/server.js` : Express, routes `/api/*`, `/authz`, OAuth Google, sessions
- Rôles : admin / formateur / apprenant, cloisonnement vérifié par `e2e_result.txt` (63/63 OK)
- Sécurité : aucune fuite de secret dans les logs (scan passé), `.env` ignoré, `htpasswd` généré au déploiement
- **Attention** : `deploy/credentials/htpasswd-admin` est **versionné et vide** (0 octet) — à surveiller
- `e2e_result.txt` confirme le bon cloisonnement des rôles, y compris 401/403 anonymes

---

## 5. TESTS EXISTANTS (baseline)

`npm run release` enchaîne : registry → cockpit → test → browser → public → parcours → formateur →
admin → identity → e2e → classroom. Baseline à **figer avant toute modification** pour détecter
les régressions. Scripts non branchés dans le gate : `audit_landing_v4`, `fix_typography`,
`check_hub_dashboard`, `test_landing_visual`, `build_landing`, `build-bundle`.

---

## 6. RECOMMANDATIONS — PLAN PROPOSÉ

### ❗ Blocage préalable n° 1 — la source du site public
Avant tout travail sur le site public, **il faut la source Next.js**. Options :
- **(A)** Vous fournissez le dossier source du frontend Next.js Hoja → je peux tout traiter.
- **(B)** Sinon je traite uniquement `ui/` + `admin/` + `modules/` + backend + nettoyage, et le site
  public reste hors périmètre (je ne peux pas modifier un `out/` compilé proprement).

### Ce que je peux faire immédiatement, sans risque (avec votre accord)

**PHASE 2 — Nettoyage sécurisé** (déchets prouvés, aucun impact fonctionnel) :
1. Supprimer `nul` (`nul` vide, déjà gitignoré) — artefact Windows
2. Supprimer `e2e_result.txt` (racine, régime d'être gitignoré) — sortie de test
3. Supprimer `deploy/bundle-tmp/` (régénérable) — sortie de build
4. Supprimer `audits/ph2/backup_fix/` — sauvegardes mortes (md5 divergents)
5. Supprimer `deploy/academy-bundle.tar.gz` + `deploy/cockpit-*.tar.gz` — snapshots obsolètes
   (⚠️ **garder** `deploy/hoja-public.tar.gz`, c'est la seule trace du site public)
6. Supprimer les scripts one-shot non branchés (`audit_landing_v4.js`, `fix_typography.js`)
7. Nettoyer `Logo/` des assets historiques non servis

**PHASE 3 — Normalisation design** : aligner `admin/` (doré/dark legacy) sur le système `ui/`
(existant, moderne) → un seul langage visuel pour le back-office.

**PHASE 5 — Cockpit UI/UX** : audits + finitions sur `ui/cockpit`, login, campus, suivi.

**PHASE 8 — Cohérence de marque** : purger « OPAYS »/« Académie OPAYS » du back-office,
aligner sur Hoja Academy.

### Ce qui reste **bloqué** sans la source Next.js
Refonte Homepage / Entreprises / Formations / Postuler, design tokens du site public,
`assets/cloned/`, CSS public, favicon public, SEO public, build public.

---

## 7. QUESTION OUVERTE (nécessite votre décision)

**Où est le code source du frontend Next.js Hoja Academy ?**
Sans lui, je ne peux pas honorer les §5, §10, §14 concernant le site public.
Dites-moi :
- soit vous me donnez le chemin / le dossier / le dépôt de la source Next.js ;
- soit je commence par les phases réalisables (nettoyage + cockpit/admin + cohérence de marque)
  et le site public est traité dans un second temps.

---

*Fin de l'audit Phase 0 — aucune modification de code effectuée.*
