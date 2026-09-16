# AUDIT DESIGN/UX — SITE PUBLIC HOJA

**Date :** 16 septembre 2026
**Méthode :** mesure réelle — 15 pages chargées dans Chrome aux largeurs
**360 / 390 / 430 / 820 / 1366 px** (75 mesures). Script : `scripts/audit_design_site.js`
**Captures :** `screenshots/audit-design/` · **Données :** `screenshots/audit-design/audit.json`

---

## 1. Ce que l'audit mesure

| Contrôle | Méthode |
|---|---|
| Débordement horizontal | `scrollWidth > clientWidth` + détection des éléments hors viewport |
| **Zone d'appui réelle** | échantillonnage `elementFromPoint` sur une grille de 44×44 (après défilement) — et non `getBoundingClientRect`, qui ne voit ni les pseudo-éléments ni les enfants |
| Contraste | couleur du texte vs fond **réel** remonté dans l'arbre ; les fonds en image et les médias superposés (vidéo de héros) sont exclus car non mesurables |
| Typographie | familles et tailles réellement appliquées, élément par élément |
| Hiérarchie | tailles/graisses effectives des `h1`–`h4` |
| Accessibilité | `<img>` sans `alt`, `aria-*`, focus visible |

> **Note de méthode :** les premières versions du détecteur produisaient des faux
> positifs (texte blanc sur vidéo signalé comme « blanc sur blanc », `alpha: 0`
> pris pour un fond opaque). Le détecteur a été corrigé avant de conclure — les
> chiffres ci-dessous sont ceux du détecteur corrigé.

---

## 2. Problèmes UX trouvés

### 2.1 Bloquants — corrigés

| # | Problème | Ampleur | Gravité |
|---|---|---|---|
| P1 | **Cibles tactiles sous 44 px** | **843 cas** sur 75 mesures. Navigation 32 px, pied de page 19 px, boutons CTA 43 px, points de carrousel 12 px, flèches de galerie 25 px | Élevée |
| P2 | **Contraste insuffisant** | **227 cas** : vert de marque en texte (3,02:1), orange sur blanc (3,59:1), bleu foncé sur vert (3,54:1), gris secondaire sur fond sombre (3,69:1), texte blanc sur vert (3,02:1) | Élevée |
| P3 | **Hiérarchie des titres inversée** | Le `h1` était l'accroche de **19 px / graisse 300**, tandis que le vrai titre était un `h2` de **50 px**. Sur l'accueil, un `h2` mesurait 16 px — plus petit qu'un `h3` de 19 px | Élevée (SEO + lecteurs d'écran) |
| P4 | **Focus clavier invisible** | Aucune règle `:focus-visible` globale. Deux liens portaient `outline-none` sans indicateur de remplacement | Élevée |
| P5 | **Police de clone résiduelle** | `Noto_Color_Emoji` appliquée à 25 éléments (`entreprises/page.tsx:918`) | Moyenne |

### 2.2 Non bloquants — relevés, non corrigés

| # | Problème | Détail |
|---|---|---|
| P6 | **30 tailles de police distinctes** | Dont de quasi-doublons : 13/14/15/16/17 px, 23/24/25/26/27/28 px. Aucune échelle typographique |
| P7 | **26 couleurs de texte distinctes** | Dont 6 quasi-noirs différents : `#333`, `#000`, `#4A4A4A`, `#1F2124`, `#1B1B1B`, `#10242F`, `#0C1B24` |
| P8 | **8 fichiers `ditto.css` quasi identiques** | Résidus du générateur de site du clone |
| P9 | **Résidus `data-ditto-id` / `ditto-meta.ts`** | Empreintes LearnDash, WordPress, espagnol |
| P10 | **Largeurs fixes** | `w-[34.45rem]` (551 px), `w-[38.6875rem]` (619 px) — patchées par des sélecteurs fragiles |
| P11 | **`overflow-x: clip` global** | Masque les débordements au lieu de les corriger |

---

## 3. Corrections proposées

| Problème | Correction | Risque |
|---|---|---|
| P1 | `min-height: 44px` sur nav/pied de page ; boutons CTA à 44 px ; pastille visuelle 12 px dans un bouton de 44 px pour les carrousels ; flèches 25 → 44 px | Faible |
| P2 | Token `--primary-text` (vert texte, 4,83:1) ; `--primary-text-dark` (vert sur fond sombre, 9,08:1) ; `--muted-on-dark` (6,85:1) ; orange → `--accent` | Faible |
| P3 | Échanger les balises `h1`/`h2` du héros (rendu identique) | Nul |
| P4 | Règle `:focus-visible` globale + retrait des `outline-none` | Nul |
| P5 | Remplacer par Montserrat | Nul |
| P6 | Échelle typographique de 8 pas (12/13/15/16/18/22/28/36/48) et remappage | **Élevé** — reflow sur une mise en page calibrée |
| P7 | Palette de texte de 6 valeurs sémantiques | Moyen |
| P8 | Fusionner les `ditto.css` en une feuille partagée | Moyen |
| P9 | Nettoyer les `data-ditto-id` et `ditto-meta.ts` | Moyen — `DittoWire` en dépend sur 9 routes |
| P10 | Migrer les sélecteurs fragiles vers des utilitaires de composant, puis supprimer les largeurs fixes | **Élevé** |

---

## 4. Corrections réellement appliquées

### 4.1 Cibles tactiles : 843 → **0**

| Zone | Avant | Après |
|---|---|---|
| Navigation | 32 px | `min-height: 44px` |
| Pied de page | 19 px | `min-height: 44px` |
| Boutons CTA (`h-[2.6875rem]`) | 43 px | 44 px (`h-11`) |
| Boutons CTA (`py-3 px-6`) | 43 px | 44 px (`min-h-11`) — 11 boutons / 5 fichiers |
| Points de carrousel | 12 px | Bouton 44 px avec pastille visuelle de 12 px centrée — **apparence inchangée** |
| Flèches de galerie | 25 px | 44 px |

### 4.2 Contraste : 227 → **0**

| Cas | Avant | Après |
|---|---|---|
| Vert de marque en texte | 3,02:1 | `--primary-text` `#17805F` → **4,83:1** (38 occurrences) |
| Vert sur fond sombre | 3,58:1 | `--primary-text-dark` `#34D399` → **9,08:1** |
| Gris secondaire sur fond sombre | 3,69:1 | `--muted-on-dark` `#94A3B8` → **6,85:1** (4 pages) |
| Bleu foncé sur vert | 3,54:1 | `text-color-001` → **5,81:1** (4 pages) |
| Lien orange sur blanc | 3,59:1 | `--accent` → **8,80:1** |
| Blanc sur vert (pied de page) | 3,02:1 | `text-color-001` → **5,81:1** |

Les 15 grands titres verts (≥ 24 px) conservent le vert de marque `#21A87D`,
conforme au grand texte. **L'identité visuelle est préservée.**

### 4.3 Hiérarchie des titres

Balises échangées dans `page-hero.tsx` : l'accroche devient `<p>`, le titre
principal devient `<h1>`. **Rendu strictement identique**, sémantique corrigée.

### 4.4 Focus clavier

Règle `:focus-visible` globale (anneau 2 px, offset 2 px) + variante vert clair
sur fonds sombres. Deux `outline-none` retirés.

### 4.5 Police

`Noto_Color_Emoji` → Montserrat. **Le site n'utilise plus qu'une seule famille.**

### 4.6 Résultat mesuré

| Indicateur | Avant | Après |
|---|---|---|
| Débordement horizontal | 0 | **0** |
| Cibles < 44 px | **843** | **0** |
| Contraste insuffisant | **227** | **0** |
| Familles de police | 2 | **1** (Montserrat) |
| Tailles de police | 30 | 30 *(à traiter)* |
| Couleurs de texte | 26 | 26 *(à traiter)* |

---

## 5. Tests et build

| Suite | Résultat |
|---|---|
| `npm run build:site` | **OK** — 21 routes, 15 pages, 150 fichiers |
| `npm run test:site` | **18/18** |
| `npm test` | **PASS** — 18/18 modules |
| `npm run audit:design` | **0 / 0 / 0** (débordement, cibles, contraste) |

---

## 6. Commits

| Commit | Contenu |
|---|---|
| `36557b0` | Focus visible global |
| `0193ce9` | Déduplication `list-row` (34 copies → re-exports) |
| `3928888` | 11 icônes SVG mortes supprimées |
| `2a32925` | Vert texte accessible (WCAG AA) + garde-fou contraste |
| `c895542` | Audit mesuré + cibles tactiles 44 px + hiérarchie des titres |

---

## 7. Points nécessitant un arbitrage

Aucun blocage. Deux sujets méritent une décision, car ils touchent à
l'identité ou à la mise en page validée :

1. **Normalisation typographique (P6)** — ramener 30 tailles à une échelle de 8.
   Bénéfice : cohérence, rendu « premium ». Risque : reflow sur une mise en page
   calibrée pour 1920 px et mobile. **À faire dans un lot dédié avec contrôle
   visuel.** Je le recommande, mais il ne doit pas être mélangé à d'autres
   changements.

2. **Largeurs fixes (P10)** — `w-[34.45rem]` (551 px) et `w-[38.6875rem]` (619 px)
   sont aujourd'hui neutralisées par des sélecteurs qui ciblent des **sous-chaînes
   de classes Tailwind** (`globals.css`). Elles fonctionnent, mais toute
   modification des classes concernées casse silencieusement la mise en page
   1366 px. **À migrer vers des utilitaires de composant** avant tout autre
   changement sur ces zones.

---

## 8. Suite

| Phase | Contenu |
|---|---|
| **D (suite)** | Normalisation typographique + palette de texte (lot dédié, contrôle visuel) |
| **D (suite)** | Résidus du clone : `ditto.css`, `data-ditto-id`, `ditto-meta.ts` |
| **E** | Refonte du cockpit (tokens, statuts `.st-*`, modales, états de chargement) |
| **F** | Campus apprenant |
| **G** | Espace formateur |
| **H** | Modules / présentations (retrait du système OPAYS **à la source**) |
| **I** | QA responsive globale |
| **J** | Tests complets, build de production, rapport final |
