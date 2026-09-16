# 🌐 Hébergement des supports de formation — Académie OPAYS

> **Objectif** : rendre les présentations accessibles via des URLs HTTPS stables, que Google Classroom peut ouvrir dans un iframe / nouvel onglet.

---

## 1. Recommandation : GitHub Pages ✅ (gratuit, HTTPS, stable)

**Pourquoi GitHub Pages est la meilleure option pour ce projet :**

| Critère | GitHub Pages |
|---|---|
| Coût | **Gratuit** (dépôt public) |
| HTTPS | ✅ Automatique (`https://<org>.github.io/<repo>/`) |
| URLs stables | ✅ Les URLs ne changent pas si on ne renomme pas le repo |
| Mise à jour sans casser les liens | ✅ `public/` est régénéré + `git push` → les URLs restent identiques |
| Compatible HTML statique | ✅ Parfait (aucun backend nécessaire) |
| Maintenance | ✅ Un `git push` suffit |

**Structure déployée** (dossier `public/` généré par `npm run build:public`) :

```
https://<org>.github.io/<repo>/
├── index.html                      ← liste des modules (redirection)
└── modules/
    ├── 01-comprendre-ia/index.html ← présentation sanitizée (apprenants)
    ├── 01-comprendre-ia/01_FICHE_*.md
    └── ...
```

## 2. Procédure de déploiement (une fois)

### Option A — GitHub Pages depuis un dossier (recommandé)

1. Créer le dépôt sur GitHub (ex : `opays-academy`) — **public** pour le plan gratuit.
2. Pousser le projet : `git remote add origin https://github.com/<org>/<repo>.git && git push -u origin main`
3. Activer Pages : **Settings → Pages → Source : Deploy from a branch → branche `main` → dossier `/public`** → Save.
4. Vérifier : `https://<org>.github.io/<repo>/` (l'index liste les 18 modules).

### Option B — GitHub Actions (déploiement auto à chaque release)

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy public
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build:public
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

> Avec cette option, Settings → Pages → Source : **GitHub Actions**.

### Option C — Netlify Drop (alternative sans git, pour un test rapide)

1. `npm run build:public`
2. Glisser-déposer le dossier `public/` sur https://app.netlify.com/drop
3. Obtenir une URL `https://<nom>.netlify.app` (HTTPS, stable).
4. ⚠️ Limitation : les mises à jour nécessitent un re-drag (pas de CI).

## 3. Après déploiement

1. **Tester** : ouvrir `https://<org>.github.io/<repo>/modules/01-comprendre-ia/index.html` → la présentation doit fonctionner.
2. **Générer le kit Classroom avec les vraies URLs** :
   ```bash
   npm run classroom:kit <DATE> --out docs/classroom/posts/cohorte-01 \
     --base-url https://<org>.github.io/<repo>
   ```
3. **Renseigner `data/cohorte.js`** avec l'URL de base (pour le hub/dashboard si besoin).
4. Vérifier que les URLs du kit sont cliquables depuis Classroom.

## 4. Mise à jour d'un module (sans casser les liens)

1. Modifier le module (data → `npm run build:presentations`).
2. `npm run release` (régénère `public/` et valide tout).
3. `git push` → GitHub Pages met à jour automatiquement.
4. **Les liens Classroom restent valides** : les URLs ne changent jamais (`/modules/<code>/index.html`).

## 5. Alternatives évaluées (non retenues)

| Option | Verdict |
|---|---|
| Google Drive (hébergement partagé) | ❌ Aperçu HTML limité, URLs instables, pas de vrai HTTPS public fiable |
| Firebase Hosting | ✅ Bien mais nécessite un projet Firebase + CLI (plus lourd que GitHub Pages) |
| Serveur VPS / cPanel | ❌ Coût, maintenance, sécurité à gérer — inutile pour du statique |
| Cloudflare Pages | ✅ Alternative équivalente à GitHub Pages (gratuit, HTTPS) si l'équipe préfère |

> **Décision** : GitHub Pages (Option A ou B) — le plus simple, gratuit, zéro maintenance, URLs stables à vie.

## 6. Ce qui ne doit JAMAIS être déployé publiquement

- ❌ `modules/*/presentation.html` (versions formateur avec notes)
- ❌ `modules/*/00_GUIDE_*.md` (guides formateur)
- ❌ `formateur-dashboard.html`, `course-hub.html` (outils internes — à garder en local ou derrière accès privé)
- ❌ `scripts/`, `data/` (sauf si nécessaire et sans secret)
- ❌ `docs/` (documents internes)

Seul le dossier **`public/`** (généré et sanitizé) est destiné au web public.
