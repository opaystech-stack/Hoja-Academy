# PHASE E — Cockpit et surfaces applicatives

**Date :** 16–17 septembre 2026
**Périmètre :** `ui/cockpit` (6 vues), `ui/campus` (apprenant), `ui/suivi` (formateur),
`ui/login`. Contenu et fonctionnalités conservés — **aucune donnée fictive ajoutée**.

---

## 0. Décision de méthode : mesurer avant de refaire

Le cockpit est un back-office **opérationnel** : il n'était pas question de le
redessiner à l'aveugle. La première action a donc été de construire l'instrument
de mesure, au même niveau d'exigence que `audit:design` pour le site public.

**Nouveau : `npm run audit:ui`** — `scripts/audit_ui.js`

- charge **9 surfaces × 5 largeurs** (360 / 390 / 430 / 820 / 1366) dans Chrome ;
- mesure le rendu réel : débordement, **zone d'appui réelle** (échantillonnage
  `elementFromPoint`, pas `getBoundingClientRect`), contraste sur fond **composé**,
  polices et tailles appliquées, hiérarchie des titres, images sans `alt`,
  erreurs console ;
- le cockpit étant protégé, le **mock API 2B est lancé automatiquement**
  (`scripts/mock_api_2b.js`, jamais en production), avec le **rôle attendu par
  chaque surface** — sans quoi le campus et le cockpit affichent leur écran de
  connexion au lieu de l'application.

**Nouveau : `npm run capture:ui`** — captures pleine page des 4 surfaces.

> **Piège corrigé dans l'instrument lui-même.** La première version comptait
> **529 cas de contraste**, dont la quasi-totalité étaient des faux positifs :
> elle comparait le texte à un fond **semi-transparent** sans le composer sur ses
> ancêtres (`rgb(52,211,153)` sur `rgba(16,185,129,.12)` → « 1,32:1 »). Après
> composition des couches alpha, le chiffre réel était **185**, tous ramenés à
> **une seule cause**. *Mesurer mal coûte plus cher que ne pas mesurer.*

---

## 1. Lot 1 — Accessibilité mesurable

### 1.1 Contraste : 185 → 0

| Mesure | Avant | Après |
|---|---|---|
| Cas de contraste insuffisant | **185** | **0** |

**Une seule cause racine**, sur 5 sélecteurs : le token `--muted-dark`
(`#64748b`, **3,96:1**) employé comme couleur de **texte** pour les groupes de
navigation latérale, le fil d'Ariane, les titres de zone et la ligne de session.

→ `#7c8ba1` (**5,4:1** sur le fond le plus clair du cockpit). Aucune autre
couleur n'a eu besoin d'être touchée.

### 1.2 Cibles tactiles : 181 → 0

Même standard que le site public : **44 px**.

| Contrôle | Avant | Après |
|---|---|---|
| Liens de navigation latérale | 36 px | **44 px** |
| Bouton burger | 38 px | **44 px** |
| Boutons (`.btn`) | 36 px | **44 px** |
| Boutons denses (`.small`) | 32 px | **44 px** |
| Retour (`.back`) | 32 px | **44 px** |
| Onglets de module | 40 px | **44 px** |
| Résumé de guide | 40 px | **44 px** |
| Puces de filtre (`.fchip`) | 28 px | **44 px** |
| Bouton de déconnexion | `min-height:0` | **44 px** |
| Champs de formulaire | 39 px | **44 px** |
| Liens inline isolés | 24–32 px | **44 px** |

`.small` reste une **variante de densité** (padding et corps plus petits) mais sa
hauteur ne descend plus sous 44 px.

### 1.3 Police : 4 familles déclarées → 1 pile assumée

Les 4 surfaces déclaraient **trois piles différentes** — `'Inter'` (cockpit,
campus, suivi), `Inter` sans guillemets (18 modules), `'Segoe UI'` (login) —
et **aucune ne chargeait de police**. Tout retombait silencieusement sur la
police système.

→ **Une pile système unique et documentée** :
`system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`

Choix assumé pour une interface **dense et opérationnelle** : meilleure lisibilité
en 11–13 px qu'une police d'affichage, et **zéro requête réseau**. Les contrôles de
formulaire héritent désormais de la police du document (`font-family:inherit`), ce
qui corrige 4 éléments restés en Arial sur l'espace formateur.

> **Point d'arbitrage :** le design system Hoja prescrit `Montserrat` partout.
> Le site public la charge ; les applications ne chargent rien. J'ai retenu la
> pile système plutôt que d'ajouter une dépendance de police à un outil interne.
> Si vous voulez l'alignement strict sur Montserrat, c'est un ajout de `@font-face`
> + un fichier servi depuis `/ui/`.

### 1.4 Login aligné

`ui/login` était une **cinquième identité** : jetons propres (`--bg:#070b12`,
`--teal:#22c55e`), rayon 20 px, et un **dégradé décoratif**
(`linear-gradient(160deg,…)`), contraire à la contrainte produit.

→ jetons, rayons et focus alignés sur le cockpit ; **dégradé retiré** (fond uni).

---

## 2. Lot 2 — Hiérarchie, sémantique, mise en page

### 2.1 Structure des titres

Le document mélangeait trois niveaux incohérents : des **libellés de zone en `h2`
à 11 px**, des **titres de carte en `h3` à 14 px**, et un `h5` isolé.
Conséquence mesurée : le `h2` était **plus petit** que le `h3` — inversion de
hiérarchie — et le plan du document sautait des niveaux.

| Correction | Détail |
|---|---|
| Les 7 libellés de zone sont des **étiquettes**, pas des titres | `h2.zone` → `<p class="zone">` |
| Les titres de carte et de section deviennent `h2` (14 px) | le plan va `h1` → `h2` sans saut |
| Le `h5` isolé du déroulé de module | → `h3` |
| Sélecteurs CSS | `.zone`, `section.card>h2`, `.psec h2` |

### 2.2 Titres de page manquants

| Surface | Problème | Correction |
|---|---|---|
| **cockpit · vue Programme** | **aucun `h1`** — le document commençait au `h2` | `h1` « Programme » + chapô, comme les 5 autres vues |
| **campus apprenant** | **aucun `h1`**, et **aucun style de `h1` défini** — le titre retombait sur le `2em` par défaut du navigateur | `h1` « Mon parcours » + règle `h1` alignée sur le cockpit (22 px / 700) |

### 2.3 Cibles et grille

- `.chip-mod` du campus apprenant : **25 → 44 px**.
- `.statgrid` : les 5 indicateurs retombaient sur **4 colonnes**, laissant
  « Programme » seule sur une deuxième ligne. `minmax(190px…)` → `minmax(175px…)` :
  **une seule ligne dès 1040 px**, repli mobile inchangé.

---

## 3. Résultat mesuré — `npm run audit:ui`

9 surfaces × 5 largeurs = 45 mesures.

| Indicateur | Avant | Après |
|---|---|---|
| Débordement horizontal | 0 | **0** |
| Cibles tactiles < 44 px | **181** | **0** |
| Contraste insuffisant | **185** | **0** |
| Familles de police rendues | 3 (Inter fantôme, Segoe UI, Arial) | **1 pile assumée** |
| Tailles de police distinctes | 11 | **11** |
| Inversions de hiérarchie | **2** | **0** |
| Surfaces sans `h1` | **2** | **0** |
| Images sans `alt` | 0 | **0** |
| Erreurs console | 5 (campus, rôle inadapté) | **0** |

---

## 4. Tests de non-régression

| Suite | Résultat |
|---|---|
| `npm run test` | **PASS** — 91/91 cohérence + 18/18 modules |
| `npm run test:hub` | **OK** — aucune erreur console |
| `npm run test:parcours` | **13/13** |
| `npm run test:formateur` | **21/21** |
| `npm run test:admin` | **16/16** |
| `npm run test:identity` | **46/46** |

---

## 5. Ce qui n'a pas été fait — et pourquoi

1. **Montserrat dans les applications** — voir le point d'arbitrage §1.3.
2. **Cohérence des 18 modules** (`ui/cockpit/modules/*`) : ils déclarent encore
   `Inter` et portent le système de marque **OPAYS** (or `#D4AF37`, bleu
   `#0066FF`, rayon 20 px). C'est la **Phase H**, dont la source est
   `modules/XX/presentation.html` : corriger la source corrige les 36 copies.
3. **États de chargement / vide / erreur** : ils existent déjà et sont cohérents
   (`.empty`, `.alert.warn/.err/.info`, squelettes sur le campus). Aucun défaut
   mesuré — pas de raison d'y toucher.
4. **Refonte visuelle lourde** : le cockpit était déjà structuré (tokens, cartes,
   tableaux, états, responsive à 3 paliers). L'audit n'a révélé **aucun défaut de
   mise en page** (0 débordement sur 45 mesures). Les problèmes étaient
   d'accessibilité et de sémantique, pas de design.

---

## 6. Commits

| Commit | Contenu |
|---|---|
| `f3f339f` | Phase E lot 1 — accessibilité mesurable (contraste, cibles, police, login) |
| `c00f23c` | Phase E lot 2 — hiérarchie, sémantique, titres manquants, grille |

---

## 7. Outillage

| Script | Rôle |
|---|---|
| `scripts/audit_ui.js` | Audit mesuré des 9 surfaces applicatives (`npm run audit:ui`) |
| `scripts/capture_ui.js` | Captures pleine page aux 5 largeurs (`npm run capture:ui`) |

`npm run audit:ui` · `capture:ui` — le mock API 2B est lancé et arrêté
automatiquement, avec le rôle attendu par chaque surface.
