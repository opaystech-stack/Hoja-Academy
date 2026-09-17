# PHASES F & G — CAMPUS APPRENANT ET ESPACE FORMATEUR

**Date :** 17 septembre 2026
**Statut :** terminées et vérifiées
**Périmètre :** `ui/campus/index.html` (475 lignes) · `ui/suivi/index.html` (329 lignes)
**Contrainte :** identité visuelle et UX uniquement — fonctionnalités, structure et contenu
intacts.

---

## 1. Audit initial — ce que l'instrument ne voyait pas

`npm run audit:ui` (9 surfaces × 5 largeurs) donnait déjà, avant intervention :

| Contrôle | Baseline |
|---|---|
| Débordement horizontal | **0** |
| Cibles tactiles < 44 px | **0** |
| Contraste insuffisant | **0** |
| Erreurs console | **0** |
| **Tailles de police distinctes** | **11** — dont 871 × 11 px et 149 × 10 px |
| **Couleurs de texte distinctes** | **19** |

Les trois premiers sont les acquis de la Phase E. La dette restante était donc
**typographique et chromatique**, et l'instrument la mesure sans la qualifier : il compte les
valeurs, il ne dit pas lesquelles sont hors système.

**Le plancher de 12 px était le défaut principal** : 1 020 occurrences de texte à 10 ou 11 px
sur ces deux surfaces. Lot A avait établi ce plancher sur le site public ; les applications
ne l'appliquaient pas.

---

## 2. Phase F — Campus apprenant

### 2.1 Jetons — 10 → 26

Le `:root` déclarait 10 jetons (`--bg --card --card-hover --line --text --muted --teal
--teal-light --blue --amber --red --radius`) et **deux noms non canoniques** : `--amber` et
`--red` là où le système définit `--warn` et `--danger`.

Il porte désormais le jeu applicatif complet : surfaces (`--card-2`, `--elevated`), bordures
(`--line-strong`, `--line-soft`), accents (`--teal-soft`, `--blue-soft`), les huit états
(`--danger/--warn/--ok/--info` + leurs `-soft`, `--neutral-soft`), `--input-bg`,
`--on-accent`, l'échelle d'ombres, l'échelle de rayons et `--touch-min: 44px`.

### 2.2 Statuts — vocabulaire unifié (§3.2)

Les 8 classes `b-*` sont remplacées par les 8 classes canoniques `st-*` :

| État campus | Avant | Après | Couleur |
|---|---|---|---|
| Mission à faire | `b-assigned` | `st-assigned` | info |
| Brouillon | `b-draft` | `st-progress` | warn |
| Déposé | `b-submitted` | `st-submitted` | blue |
| En correction | `b-returned` | `st-returned` | danger |
| Validé | `b-graded` | `st-graded` | ok |
| Retard | `b-late` | `st-blocked` | danger |
| À venir / non configuré | `b-pending` | `st-todo` | neutral |
| En cours / votre semaine | `b-cur` | `st-progress` | warn |

Le violet `rgba(167,139,250,…)` de l'ancien état « en correction » — **absent de la palette
Hoja** — disparaît au profit du rouge d'état.

### 2.3 Couleurs hors palette → jetons

`rgba(34,197,94,…)` (green-500) → `--teal` · `rgba(239,68,68,…)` (red-500) → `--danger` ·
`#bae6fd` `#7dd3fc` → `--info`/`--blue` · `#fcd34d` → `--warn` · `#86efac` → `--ok` ·
`#fca5a5` `#fda4a4` → `--danger` · `#cbd5e1` → `--muted` · `#d8b4fe` → supprimé ·
`#04140a` `#04121c` → `--on-accent` · `#0a101c` → `--input-bg` ·
`rgba(255,255,255,.02/.07/.2)` → `--card-2`/`--neutral-soft`/`--line-strong`.

**2 dégradés décoratifs supprimés** : la barre de progression (`linear-gradient(90deg,…)`) et
la carte d'action principale (`linear-gradient(180deg,…)`). Le dégradé du squelette de
chargement est **conservé** : il est fonctionnel (§3.7), pas décoratif.

### 2.4 Typographie et hiérarchie

- **Plancher porté de 10 à 12 px** ; toutes les tailles ramenées sur l'échelle
  12/14/16/18/22/28.
- **Hiérarchie réelle rétablie** : `h1` 22 → **28 px** ; les titres de section passaient par
  un `h2` à **11 px en majuscules** (un libellé, pas un titre) → **18 px** ; les titres de
  mission étaient des `<div>` → **`<h3>` à 16 px**. Résultat : **28 > 18 > 16**, aucune
  inversion.

### 2.5 Défauts corrigés au passage

| Défaut | Correction |
|---|---|
| Le bouton « Mettre à jour » utilisait `class="btn"` — **classe jamais définie** | `.btn` canonique ajouté (§3.1) |
| 2 champs de mot de passe sans `<label>` (§3.4) | `<label class="vh">` associés |
| Glyphe `▶` en guise de chevron d'accordéon | chevron **SVG** au trait |
| Emojis `✅` / `❌` dans les retours utilisateur | texte seul |
| `style="justify-content:center"` sur un `h2` non-flex — sans effet | supprimé |
| `:focus-visible` sur 3 sélecteurs seulement | règle globale (§2.8) |

---

## 3. Phase G — Espace formateur

### 3.1 Deux violations directes du design system

| Violation | Détail | Correction |
|---|---|---|
| **Rayon 20 px OPAYS** | `.sheet{border-radius:20px 20px 0 0}` et `{border-radius:20px}` | `--radius-lg` (14 px) |
| **Débordement horizontal proscrit** (§3.5) | `table{min-width:640px}` | **supprimé** ; la vue empilée remplace le tableau |

Le `min-width: 640px` était nommément cité dans le design system comme dette à retirer. Il
produisait un défilement horizontal entre 640 et 700 px de large.

La bascule tableau ↔ cartes passe de 700 à **768 px** (`--bp-md`), alignée sur le point de
rupture canonique.

### 3.2 Accessibilité — le manque le plus lourd

`:focus-visible` était **totalement absent** de cette surface. L'audit du design system
l'avait relevé (« login et suivi n'ont aucune règle `:focus-visible` »). Ajouté, identique
aux autres surfaces.

Les onglets de filtre portaient `role="tablist"` **sans** `role="tab"` ni `aria-selected` :
sémantique ARIA incomplète. Les 4 onglets sont complétés et l'état est synchronisé en JS.

### 3.3 Reste

5 classes `c-*` → `st-*` · `--amber`/`--red` → `--warn`/`--danger` ·
`rgba(34,197,94,…)`/`rgba(239,68,68,…)` → jetons · 8 couleurs hors palette → jetons ·
plancher 10 → **12 px** · `h1` 22 → **28 px**, `h2` 17 → **18 px**, `h3` 15 → **16 px** ·
emojis `✅`/`❌` → texte · style en ligne dupliqué du `<select>` → classe canonique
`.input/.select/.textarea` (§3.4) · `.matrixwrap` conservé comme containment, mais il n'a
plus rien à contenir.

---

## 4. Résultat mesuré

| Contrôle (audit:ui, 9 surfaces × 5 largeurs) | Avant | Après |
|---|---|---|
| Débordement horizontal | 0 | **0** |
| Cibles tactiles < 44 px | 0 | **0** |
| Contraste insuffisant | 0 | **0** |
| Erreurs console | 0 | **0** |
| **Couleurs de texte distinctes** | 19 | **16** |
| Occurrences à 11 px | 871 | **425** |
| Occurrences à 10 px | 149 | **134** |

Les occurrences restantes à 10 et 11 px **ne sont plus dans le campus ni dans le suivi** :
elles sont toutes dans le **cockpit**, traité en Phase E.

---

## 5. Dette restante identifiée

**Le cockpit concentre désormais la dette typographique et chromatique :**

- **425 occurrences à 11 px et 134 à 10 px** — sous le plancher de 12 px établi par le Lot A.
- 5 couleurs hors palette : `#fbbf24` (20), `#04140a` (20), `#fda4af` (5), `#fde68a` (5),
  `#1f2937` (5).
- La Phase E a traité le cockpit sur l'accessibilité mesurable (contraste, cibles, hiérarchie)
  mais pas sur le plancher typographique ni sur la palette — ces contrôles n'étaient pas dans
  son périmètre.

C'est le **prochain lot naturel**, avant ou avec les 24 couleurs de texte du site public.
