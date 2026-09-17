# LOT COCKPIT & LOGIN — PLANCHER TYPOGRAPHIQUE ET PALETTE

**Date :** 17 septembre 2026
**Périmètre :** `ui/cockpit/index.html` (1 559 lignes) · `ui/login/index.html` (76 lignes)
**Statut :** terminé et vérifié

---

## 1. Pourquoi ce lot

Les Phases F et G ont nettoyé le campus et l'espace formateur. À l'issue de ce nettoyage,
l'audit `audit:ui` (9 surfaces × 5 largeurs) montrait que **toute la dette restante s'était
concentrée sur le cockpit** :

| Contrôle | Avant ce lot |
|---|---|
| Tailles de police distinctes | **11** — dont 425 × 11 px et 134 × 10 px |
| Couleurs de texte distinctes | **16** — dont 5 hors palette |

La Phase E avait traité le cockpit sur l'**accessibilité mesurable** (contraste, cibles
tactiles, hiérarchie, libellés). Elle n'avait pas traité le **plancher typographique** ni la
**palette** — ces contrôles n'étaient pas dans son périmètre.

---

## 2. Cockpit

### 2.1 Jetons — `--card2`, `--line2`, `--red`, `--amber` disparaissent

Le `:root` déclarait 23 jetons avec **quatre noms non canoniques** et **deux valeurs
fausses** :

| Avant | Après |
|---|---|
| `--card2: #0d1322` | `--card-2` |
| `--line2: rgba(255,255,255,.12)` | `--line-strong` |
| `--red` / `--red-soft` | `--danger` / `--danger-soft` |
| `--amber` / `--amber-soft` | `--warn` / `--warn-soft` |
| `--radius-lg: 12px` | `--radius-lg: **14px**` |

Manquaient également : `--elevated`, `--line-soft`, `--ok`/`--ok-soft`,
`--info`/`--info-soft`, `--neutral-soft`, `--input-bg`, `--on-accent`, `--overlay`,
l'échelle d'ombres, `--radius-full` et `--touch-min`. Le jeu applicatif est désormais complet.

### 2.2 Statuts — une 4ᵉ famille de vocabulaire

Le design system prescrit **8 classes canoniques** `.st.st-*` et « une fonction utilitaire
unique `statusClass(state)` ». Le cockpit en avait **une quatrième variante** :

| Avant | Après |
|---|---|
| `.st.todo` | `.st.st-todo` |
| `.st.done` | `.st.st-graded` |
| `.st.blocked` | `.st.st-blocked` |
| `.st.wait` | `.st.st-progress` |

Les quatre états canoniques non utilisés (`st-assigned`, `st-submitted`, `st-returned`,
`st-na`) sont désormais **définis**, et la classe `.st-na` — produite par le code mais
**jamais définie en CSS** — est désormais stylée.

**Piège rencontré** : `x.cls` alimentait **à la fois** `class="ps …"` (l'étape de la frise) et
`class="st …"` (le badge). Renommer `done` en `st-graded` cassait silencieusement le marqueur
✓ de l'étape. La règle `.pstrip .ps.done::before` a donc été renommée en `.ps.st-graded::before`
dans le même mouvement. **Un même identifiant partagé par deux composants est un piège à
renommage.**

### 2.3 Couleurs hors palette → jetons

`#fda4af` `#fecdd3` `#fb7185` → `--danger` · `#fde68a` `#fbbf24` → `--warn` ·
`#bae6fd` → `--info` · `#04140a` → `--on-accent` · `#059669` → `--teal-light` ·
`#0c111e` → `--card-2` · `#162033` → `--elevated` · `rgba(34,197,94,…)` → `--teal-soft` ·
`rgba(0,0,0,.5)` → `--overlay`.

**Ombres** : `0 1px 3px rgba(0,0,0,.15)`, `0 1px 2px rgba(0,0,0,.2)` et trois `box-shadow`
de halo coloré (`0 0 6px`) → échelle canonique ou suppression. Les halos colorés sur les
pastilles d'état étaient décoratifs.

### 2.4 Rayons

`12px` → `--radius-lg` (14) · `10px` → `--radius` · `8px`/`6px`/`4px` → `--radius-sm` ·
`999px` → `--radius-full`. Les `3px`, `1px` et `50%` (barres de progression, indicateur
d'onglet, pastilles rondes) sont conservés : ce sont des formes, pas des rayons de surface.

### 2.5 Typographie — le vrai gain

`9,5 / 10 / 10,5 / 11 / 11,5 / 12 / 12,5 / 13 / 13,5 / 14 / 20 / 24 px` →
**12 / 14 / 18 / 22 / 28 px**. Le plancher passe de 9,5 px à **12 px**.

Traitement particulier : `a.stat .v` (l'indicateur chiffré du tableau de bord) passe de
24 à **28 px** — un KPI mérite le palier `--text-2xl` ; `.phead h2` (nom de l'apprenant,
titre de vue) de 20 à **22 px**.

### 2.6 Débordement horizontal proscrit (§3.5)

`table{min-width:420px}` et `.md table{min-width:320px}` — les deux valeurs étaient
**nommément citées** dans le design system comme dette à retirer — sont supprimés.
`.tablewrap` garde `overflow-x:auto` comme containment, mais il n'a plus rien à contenir.

### 2.7 Focus

`:focus-visible` portait `outline: 2px solid var(--teal)`. Le §2.8 prescrit
`var(--blue)` — c'est l'accent d'information, distinct de l'accent d'action. Aligné.

---

## 3. Login

Surface de 76 lignes, alignée en Phase E lot 1 sur les jetons et le rayon, mais restée hors
échelle typographique et avec `--radius-lg: 12px`.

- Jetons : jeu canonique complet ajouté.
- `--radius-lg` 12 → **14 px** ; `border-radius:999px` du bouton → `--radius`.
- Ombres : `0 20px 60px rgba(0,0,0,.5)` → `--shadow-lg`.
- Couleurs : `#04140a` → `--on-accent` ; `#fda4af` et `rgba(244,63,94,…)` → jetons `--danger`.
- `input:focus` : `outline: var(--teal)` → `var(--blue)`.
- Fonds de champ : `var(--bg)` → `var(--input-bg)`.
- Typographie : 10 / 11,5 / 13 / 15 px → **12 / 14 / 16 / 22 px**.
  **Les champs de saisie passent à 16 px** : en dessous, iOS Safari zoome automatiquement
  au focus.
- Exception documentée : le bouton « Continuer avec Google » conserve `#fff` / `#1f2937` —
  ce sont les couleurs imposées par la charte de marque Google.

---

## 4. Trois sources de dette cachées dans la chaîne de build

L'audit ne voit que le **rendu**. Trois injections de build échappaient donc au contrôle
statique — et une seule d'entre elles était visible :

| Source | Problème | Correction |
|---|---|---|
| `scripts/build_cockpit_data.js` | `.cockpit-back-link` injecté : 11 px / 10 px, `rgba(13,21,34,.92)`, `rgba(34,197,94,.4)`, `#22c55e`, `border-radius:999px`, `padding:7px 14px` (**cible < 44 px**) | Aligné sur le motif canonique : jetons Hoja, 12 px, `min-height: var(--touch-min)` |
| `scripts/build_admin.js` (2 chemins) | `.admin-home-link` injecté : 11 px / 10 px, `rgba(212,175,55,…)` (**or OPAYS**), `border-radius:999px`, cible < 44 px | Aligné |
| `scripts/build_public.js` | Déjà aligné en Phase H | — |

### Bug antérieur trouvé : `var(--gold)` n'a jamais existé

Les deux styles injectés par `build_admin.js` référençaient **`var(--gold)`**. Or le thème
n'a jamais défini `--gold` : le jeton s'appelait `--gold-opays`. Le lien de retour de l'espace
admin **n'avait donc aucune couleur de texte propre** — il héritait de la couleur du parent.
Vérifié dans l'historique : le défaut est **antérieur à la Phase H**.

*(Le `var(--gold)` de `scripts/build_landing.js` est en revanche légitime : le landing legacy
définit sa propre palette, avec `--gold:#B8860B`.)*

---

## 5. Correction de la spécification elle-même

`DESIGN_SYSTEM_HOJA.md` §2.3 portait **deux erreurs** qui entretenaient la confusion :

1. **« Famille unique : Montserrat »** — l'arbitrage de Tbag est « garde la pile système dans
   les applications ». Le document distingue désormais les deux piles : Montserrat pour le
   site public, pile système pour les applications, avec la justification.
2. **Une échelle à 12 / 13 / 15 / 16 / 18 / 22 / 28 / 36 / 48 px** — alors que le Lot A a
   établi **12 / 14 / 16 / 18 / 22 / 28 / 36 / 48** et que les Phases E → H ont aligné les
   applications dessus. Le document porte maintenant l'échelle réellement appliquée, la règle
   du plancher à 12 px et la règle des champs à 16 px.

> Un design system qui contredit le code ne documente rien : il fabrique la prochaine
> incohérence.

---

## 6. Résultat mesuré

| Contrôle (audit:ui, 9 surfaces × 5 largeurs) | Avant le lot | Après |
|---|---|---|
| Débordement horizontal | 0 | **0** |
| Cibles tactiles < 44 px | 0 | **0** |
| Contraste insuffisant | 0 | **0** |
| Erreurs console | 0 | **0** |
| **Tailles de police distinctes** | **11** | **6** |
| **Couleurs de texte distinctes** | **16** | **12** |

**Contrôle statique sur l'ensemble du projet applicatif** (4 surfaces + 18 modules + leurs
54 copies, soit 76 fichiers) :

```
déclarations de taille examinées : 3 931
hors échelle                     : 0
```

L'échelle rendue est exactement : **12 / 14 / 16 / 18 / 22 / 28 px**.

**Couleur restante hors palette : `rgb(31,41,55)`** — 5 occurrences, le texte du bouton
« Continuer avec Google ». Imposé par la charte Google, conservé volontairement.

---

## 7. Reste

- **24 couleurs de texte du site public** — lot dédié, conformément à la priorité fixée.
  À traiter par fonction et par contraste, pas par uniformisation.
- `docs/design-2026-09/DESIGN_SYSTEM_HOJA.md` §6 (récapitulatif chiffré de la dette) est
  antérieur aux Phases F → H et mériterait une mise à jour.
- Les mentions « OPAYS » du **contenu pédagogique** des modules (70 occurrences) restent en
  attente d'un arbitrage éditorial.
