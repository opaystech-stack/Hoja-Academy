# LOT A — Normalisation typographique du site public Hoja

**Date :** 16 septembre 2026
**Périmètre :** `hoja-site/src` (site public Next.js) — lot **séparé**, aucun autre
changement mélangé.
**Contrôle :** 15 pages × 5 largeurs (360 / 390 / 430 / 820 / 1366 px), mesures réelles
dans Chrome + captures pleine page avant/après.

---

## 1. Le problème mesuré

Deux inventaires, tous deux reproductibles :

| Source | Avant | Après |
|---|---|---|
| Tailles **déclarées** dans le code (`scripts/typo_inventory.js`) | **45** | **12** (dont 2 non-tailles : `text-[0rem]` ×3, `font-size:inherit` ×3) |
| Tailles **rendues** (`npm run audit:design`) | **30** | **9** |
| Familles de police | 1 (Montserrat) | 1 (Montserrat) |

Les 30 tailles rendues avant :
`11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 22.4, 23, 24, 25, 26, 27, 28, 30, 32, 33, 35, 36, 42, 45, 50, 55, 56, 85`

Après : `12, 14, 16, 18, 22, 28, 36, 48, 84`

Les grappes de quasi-doublons — la signature d'une absence d'échelle — étaient :
`13/14/15/16/17`, `19/20/21/22/23`, `25/26/27/28`, `32/33/35/36/37`, `42/44/45/46/47/49/50/52`.

---

## 2. L'échelle retenue — 8 pas

| # | Token | Taille | Interligne | Rôle fonctionnel |
|---|---|---|---|---|
| 1 | `--text-2xs` | **12 px** | 1.35 | caption, métadonnée, badge, mention légale |
| 2 | `--text-sm` | **14 px** | 1.45 | label, navigation, texte dense (listes, pied de page) |
| 3 | `--text-base` | **16 px** | 1.60 | corps de texte |
| 4 | `--text-lg` | **18 px** | 1.50 | sous-titre, accroche, chapô |
| 5 | `--text-xl` | **22 px** | 1.35 | titre de section (mobile → md) |
| 6 | `--text-2xl` | **28 px** | 1.25 | titre de page (mobile → md) |
| 7 | `--text-3xl` | **36 px** | 1.20 | titre de section (desktop) |
| 8 | `--text-4xl` | **48 px** | 1.12 | titre de héros (base → lg) |

**Palier d'affichage — 2 valeurs, réservées aux grands nombres et au titre de héros :**

| Token | Taille | Usage |
|---|---|---|
| `--text-display-1` | **60 px** | grands nombres de cartes média |
| `--text-display-2` | **84 px** | titre de héros principal |

> **Pourquoi 2 valeurs au-delà de l'échelle.** Le héros principal utilisait
> `85 px` au breakpoint `2xl` (≥ 1536 px) et les nombres de cartes `76 px`.
> Les ramener à 48 px aurait détruit les proportions du héros sur grand écran —
> exactement ce que la consigne interdit. Ils sont donc regroupés en **deux**
> valeurs cohérentes (84 et 60) au lieu de six (`60, 64, 76, 80, 82, 85`).
> **Point d'arbitrage** : si vous préférez une échelle strictement à 8 valeurs,
> ces deux pas peuvent être ramenés à 48 — cela réduira le titre de héros de 44 %
> au-delà de 1536 px.

---

## 3. Le remappage — par fonction, pas mécanique

Remappage des 45 tailles déclarées, chaque ligne justifiée par sa fonction :

| Avant | Après | Fonction |
|---|---|---|
| 10, 11, 12 | 12 | caption / métadonnée (10 et 11 px étaient sous le plancher lisible) |
| 13, 14 | 14 | label, navigation, texte dense |
| 15, 16, 17 | 16 | corps de texte |
| 18, 19 | 18 | sous-titre, accroche |
| 20, 21, 22, 23 | 22 | titre de section |
| 24, 25, 26, 27, 28 | 28 | titre de page |
| 30, 32, 33, 35, 36, 37, 41 | 36 | titre de section (desktop) |
| 42, 44, 45, 46, 47, 49, 50, 52, 55, 56 | 48 | titre de héros (base → lg) |
| 60, 64, 76 | 60 | grands nombres |
| 80, 82, 85 | 84 | titre de héros principal |

**Deux règles de finesse appliquées :**

1. **Préfixes responsives.** Les classes `max-md:` / `max-lg:` sont traitées comme
   un cran **plus bas** dans l'échelle, pas comme la taille desktop. Un
   `max-md:text-6xl` (60 px mobile, ce qui violait la règle « jamais plus de 36 px
   sur 360 px ») devient 36 px.
2. **Interlignes solidaires.** Un `leading-*` n'a été ajusté **que** s'il valait
   exactement la taille de police (ratio 1.0) — il suit alors la nouvelle taille
   pour rester à 1.0. Tous les autres interlignes sont **intacts** : le rythme
   vertical de la mise en page calibrée est préservé.

**Exception fonctionnelle assumée.** Dans `navbar.tsx` et `footer.tsx`, le texte
n'est pas du corps éditorial mais des **labels denses** : les 15 px y deviennent
14 px (pas 16 px).

**Base du document.** `.cn0` (porté par `<body>`, dupliqué dans les 8 `ditto.css`)
passait `font-size:20px; line-height:33px` → **`16px / 26px`**. C'était la source
principale de l'incohérence : tout texte sans classe explicite héritait de 20 px.

**Volume :** **700 remplacements dans 66 fichiers.**

---

## 4. Hiérarchie des titres — corrigée au passage

L'audit ne signalait que le héros de `page-hero.tsx` comme inversé. En vérifiant
l'ensemble des 15 pages, **quatre autres inversions** ont été trouvées et corrigées :

| Page | Avant | Après |
|---|---|---|
| Accueil | `h1` = l'accroche 19 px / graisse 300 ; le vrai titre était un `h2` de 50 px | `h1` = le titre ; l'accroche devient `<p>` |
| Accueil | `h2` de 16 px (chapô) sous des `h3` de 18 px | `<p>` |
| Accueil | `h2` de 16 px « LES OUTILS DU MARCHÉ » | `<p>` |
| `page-hero.tsx` | `h2` de 16 px (chapô) sous des `h3` | `<p>` |
| `page-hero.tsx` | `h3` de 18 px (kicker décoratif) précédant des `h4` de 28–48 px | `<p>` |
| `entreprises` | `h3` de 18 px (overline) précédant des `h4` de 28 px | `<p>` |
| `entreprises` | **aucun `h1`** — le titre principal était un `h2` | `h1` |
| `contact` | **aucun `h1`** — le titre principal était un `h2` | `h1` |
| `programme-intensif` | `h3` de 16 px (label) précédant un `h4` de 48 px | `<p>` |
| `programme-intensif` | « ÉQUIPE PÉDAGOGIQUE » en `h4` de 48 px, « FORMATEUR » en `h6` de 48 px | `h2` |

Résultat mesuré : **0 inversion** `h1`→`h6` sur les 15 pages, et **chaque page a
désormais un `h1`**. Aucune balise n'a été échangée sans que le rendu reste
identique à l'exception des corrections de taille voulues.

---

## 5. Une régression que j'ai introduite — puis corrigée

La première passe a fait apparaître **7 cibles tactiles sous 44 px** (0 avant),
toutes sur `formations/programme-intensif` à 360/390/430 px.

**Cause :** les en-têtes d'accordéon (`<summary>`) tiraient leur hauteur de
**l'interligne hérité du `body`** — 33 px avant, 26 px après. La conformité 44 px
reposait donc par accident sur une valeur typographique.

**Correction :** `min-h-11` (44 px) explicite sur les deux `<summary>`
(`media-tile2.tsx`). La cible tactile ne dépend plus de la typographie.

**Après correction : 0 cible < 44 px.**

---

## 6. Résultat mesuré — `npm run audit:design`

| Indicateur | Avant | Après |
|---|---|---|
| Débordement horizontal | 0 | **0** |
| Cibles tactiles < 44 px | 0 | **0** |
| Contraste insuffisant | 0 | **0** |
| Familles de police | 1 | **1** (Montserrat) |
| **Tailles de police rendues** | **30** | **9** |
| Inversions de hiérarchie `h1`→`h6` | 4 | **0** |
| Pages sans `h1` | 2 | **0** |

**Effet sur la hauteur des pages** (captures pleine page, animations neutralisées) :

| Page | 360 | 390 | 430 | 820 | 1366 |
|---|---|---|---|---|---|
| Accueil | −2,4 % | −1,7 % | −1,7 % | −1,3 % | −0,6 % |
| Entreprises | −3,2 % | −1,7 % | −1,8 % | −0,9 % | −0,5 % |
| Programme Intensif | −3,9 % | −2,0 % | −2,1 % | −0,9 % | −0,6 % |
| Formations | −1,8 % | +2,9 % | +1,5 % | +0,1 % | +0,4 % |
| Contact | +3,4 % | +5,1 % | +3,1 % | +1,4 % | +3,1 % |

Lecture : les pages dominées par le texte raccourcissent (corps ramené de 20 px à
16 px). Les pages dominées par le héros s'allongent légèrement — quelques lignes
supplémentaires après le passage des labels de 15 px à 16 px. **Aucun débordement,
aucune cible cassée, aucune inversion.** L'amplitude maximale est de 5 %.

---

## 7. Avant / après visuel

Planche de comparaison : **`screenshots/typo-comparaison.html`**
(5 pages × 5 largeurs, vignettes avant/après cliquables).

- Avant : `screenshots/typo-before/` (25 captures)
- Après : `screenshots/typo-after/` (25 captures)
- Audit avant : `screenshots/audit-design-before/`

---

## 8. Tests et build

| Contrôle | Résultat |
|---|---|
| `npm run build:site` | **OK** — 21 routes, 15 pages, 150 fichiers |
| `npm run test:site` | **18/18** |
| `npm test` | **PASS** — 91/91 cohérence + 18/18 modules |
| `npm run audit:design` | **0 / 0 / 0** (débordement, cibles, contraste) |

---

## 9. Outillage créé

| Script | Rôle |
|---|---|
| `scripts/typo_inventory.js` | Inventaire des tailles déclarées, par source et par fichier |
| `scripts/normalize_typography.js` | Remappage (`--dry` disponible), échelle + exceptions + interlignes solidaires |
| `scripts/typo_capture.js` | Captures pleine page aux 5 largeurs |
| `scripts/typo_compare.js` | Planche de comparaison avant/après |

`npm run typo:inventory` · `typo:normalize` · `typo:capture` · `typo:compare`

---

## 10. Reste à faire / arbitrages

1. **Palier d'affichage (60 / 84)** — conservé pour ne pas dégrader les proportions
   du héros au-delà de 1536 px. À ramener à 48 si vous voulez une échelle
   strictement à 8 valeurs.
2. **`programme-intensif`** — son `h1` reste à 84 px dès la largeur de base, quand
   toutes les autres pages sont à 48 px. Choix de mise en avant assumé, mais c'est
   la seule entorse restante à la règle « 84 px = héros ≥ 1536 px ». À trancher.
3. **Couleurs de texte — 24 valeurs distinctes**, dont 6 quasi-noirs. Non traité
   dans ce lot (P7 de l'audit). Candidat à un lot dédié, même méthode.
