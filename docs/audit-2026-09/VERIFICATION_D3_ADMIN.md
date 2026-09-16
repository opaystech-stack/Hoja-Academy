# VÉRIFICATION D3 — SORT DE `/admin/` (LEGACY)

> Date : 2026-09-16 · Vérification exhaustive **avant** toute suppression.

## VERDICT : `/admin/` est bien LEGACY — remplaçable, mais avec adaptations

---

## 1. Ce que `/admin/` fournit réellement

| Contenu | Rôle |
|---|---|
| `admin/index.html` | = `course-hub.html` (hub formateur, 18 modules / 8 semaines) |
| `admin/formateur-dashboard.html` | = `formateur-dashboard.html` (conduite de séance) |
| `admin/classroom.html` | Écran Classroom admin |
| `admin/modules/01-18/index.html` | 18 présentations **complètes** (avec notes formateur) |
| `admin/data/{modules,cohorte}.js` | Copies de `data/` (générées) |
| `admin/work-kit/TEMPLATE_MON_AI_WORK_KIT.md` | Template Work Kit |

Auth : **nginx Basic Auth** (`htpasswd-admin`). Sert sur `/admin/`.

## 2. Ce que `/ui/cockpit/` fournit (le remplaçant)

Vérifié dans `ui/cockpit/index.html` — 6 domaines couvrant exactement le périmètre admin :

```
Cockpit · Inscriptions · Apprenants · Programme · Classroom · Formateurs
```

Et la vue module du cockpit expose déjà : **Fiche · Déroulé minuté · Exercices · Mission ·
Notes formateur · Présentation** (données réelles dans `ui/cockpit/data/M01-18.json`,
phase par phase : « Ouverture & Icebreaker — 0-10 min », etc.).

Auth : **session Google + cookie + `authz` nginx** — plus robuste que Basic Auth.

### Recouvrement
| Fonction | `/admin/` (legacy) | `/ui/cockpit/` (moderne) |
|---|---|---|
| Hub 18 modules | ✅ | ✅ |
| Conduite de séance | ✅ (dashboard) | ✅ (déroulé par phase) |
| Présentations complètes + notes formateur | ✅ | ✅ |
| Classroom | ✅ | ✅ |
| Inscriptions / Apprenants / Formateurs | ❌ | ✅ |

→ **`/ui/cockpit/` est un sur-ensemble fonctionnel de `/admin/`.**

## 3. Dépendances actives sur `/admin/` (à traiter avant suppression)

| Fichier | Nature de la dépendance | Action requise |
|---|---|---|
| `deploy/deploy-vps-academy.sh` | **Bloquant** : `[ -d "$SITE_DIR/admin" ] \|\| { echo "❌ admin/ manquant"; exit 1; }` (l.57) + `location /admin/` (l.119) + copie du bundle (l.34) | Adapter le script |
| `scripts/build_admin.js` | **Générateur** de `admin/` | Retirer du pipeline |
| `scripts/build-bundle.js` | Copie `admin/` dans le bundle (l.48) | Adapter |
| `scripts/test_parcours_formateur_admin.js` | Teste `admin/modules/NN/index.html` | **Réécrire** vers `/ui/cockpit/` |
| `scripts/test_production_remote.js` | Assertions `/admin/` 401 + parcours Basic Auth | **Réécrire** (`test:prod`, hors gate) |
| `scripts/test_e2e_2b.js` | **Son**de `/admin/` sans auth (l.90) — vérifie juste l'absence de 200 | Adapter |
| `package.json` | `build:admin`, `test:admin` | Retirer |
| `README.md` | Documente `/admin/` (user ADMIN_PASS) | Réécrire |
| `scripts/config.js` | `FILES.hub` / `FILES.dashboard` → **`course-hub.html` / `formateur-dashboard.html`** | **Point clé** : les SOURCES restent utiles |
| `docs/deploiement/HERBERGEMENT.md` | Doc obsolète | Mettre à jour |

## 4. Distinction CRITIQUE : rôle vs chemin

Grep massif sur « admin » → **la majorité des occurrences sont le RÔLE** `'admin'`
(`require(['formateur','admin'])` dans `mock_api_2b.js`, `identity-api.js`, tests) :
**c'est du code métier ACTIF, à ne surtout pas toucher.**

Seul le **chemin** `/admin/` est legacy.

## 5. Verdict et plan

**`/admin/` peut être supprimé** — aucune fonction métier unique n'en dépend.
MAIS trois éléments doivent survivre :

1. **`course-hub.html` + `formateur-dashboard.html`** (racine) = **sources**. À conserver.
   ⚠️ Question ouverte : sont-ils encore utiles si le cockpit les remplace ? → **À DÉCIDER (D-12)**.
2. **Le rôle `admin`** dans l'API/gateway = actif. **Intouchable.**
3. **`admin/work-kit/TEMPLATE_*.md`** = contenu pédagogique → doit être préservé ailleurs
   (déjà présent dans `systeme-operationnel/TEMPLATE_MON_AI_WORK_KIT.md` — à vérifier).

### Plan de suppression propre (ordre impératif)

1. Vérifier `admin/work-kit/TEMPLATE_*` == `systeme-operationnel/TEMPLATE_*` (pas de perte)
2. Adapter `deploy-vps-academy.sh` (retirer le `❌ admin/ manquant` + `location /admin/`)
3. Retirer `build:admin` + `test:admin` de `package.json` ; adapter `build-bundle.js`
4. Réécrire `test_parcours_formateur_admin.js` → cible `/ui/cockpit/`
5. Adapter `test_e2e_2b.js` + `test_production_remote.js`
6. Mettre à jour `README.md` + `docs/deploiement/HERBERGEMENT.md`
7. **Alors seulement** : supprimer `admin/` + `scripts/build_admin.js`
8. Re-jouer la suite complète

⚠️ **Contrainte forte** : tant que `deploy-vps-academy.sh` exige `admin/`, la **production
ne peut pas être redéployée** sans `admin/`. La suppression doit donc être **coordonnée
avec un déploiement** — pas faite en local isolé.
