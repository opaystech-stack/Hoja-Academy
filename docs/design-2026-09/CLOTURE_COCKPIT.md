# CLÔTURE DU CHANTIER COCKPIT

**Date** : 17 septembre 2026 · **Commit de clôture** : `06f26a1` · **Méthode** : mesure du DOM
construit, jamais la lecture de la source.

Ce document clôt le chantier ouvert par la refonte du cockpit. Il traite **uniquement** les points
restants identifiés dans `AUDIT_FINAL_COCKPIT.md`, et rien d'autre.

---

## 1. Commits

| Commit | Objet |
|---|---|
| `010b141` | Refonte cockpit — lots 0 à 3 (fondations, Accueil, Inscriptions, Apprenants) |
| `9843aa5` | Lot 4 — fiche apprenant 360° |
| `bc4a3cd` | Lot 5 — écran Classroom |
| `a83434d` | Lot 6 — espace formateur |
| `c8af032` | Harmonisation de palette — une seule charte sur 94 fichiers |
| `5a58139` | Audit final (document) |
| **`06f26a1`** | **Clôture — hiérarchie des titres et cibles tactiles des modules** |

Tous poussés sur `origin/main`, refs vérifiées (`git branch -vv` sans `: gone`),
`git status` **vide** après le push.

---

## 2. Changements réellement visibles

### 2.1 `#formateurs` — composition
Avant : `doc = 906 px` pour un formulaire de **350 px** occupant seul la page, sans titre de zone,
puis un état vide de 203 px. Aucun repère sur ce que la page contenait.

Après : **deux zones nommées** (`h2.zone` « Comptes formateurs », « Comptes existants ») dans la
grille dashboard à 2 colonnes déjà utilisée ailleurs dans le cockpit. Le formulaire est borné à
640 px — deux champs étirés sur 830 px paraissaient vides. La colonne de droite porte l'état
réel de la liste, inchangé.

**Aucune donnée n'a été inventée.** L'état vide reste un état vide : « L'API n'expose pas encore
la lecture des comptes formateurs… un total inventé serait pire qu'une absence. »

### 2.2 `#programme` — hiérarchie H1/H2
La vue n'avait **aucun niveau intermédiaire** entre son `<h1>` et ses 18 modules : les en-têtes
de bloc étaient des `<div class="bloc-h">`. Ce sont désormais de vrais **`<h2>`** — mesuré :
`H1(22/700)"Programme" · H2(14/600)"BLOC 1" · H2"BLOC 2" · H2"BLOC 3" · H2"BLOC 4"`.

**Style inchangé** (14 px, pastille « BLOC n » teal) : seule la sémantique a bougé.

### 2.3 Workspace module — hiérarchie H1/H2/H3/H4
Le Markdown des fiches porte ses sections en `####`. Rendues telles quelles sous le `<h1>` du
module, les vues sautaient un niveau :

| Onglet | Avant | Après |
|---|---|---|
| Fiche | H1 → **H4** ×6 | H1 → **H2** ×6 |
| Exercices | H1 → **H3** | H1 → H2 → H3 → H4 |
| Déroulé | H1 → H3 → H4 → H5 → **H6 (9 px)** | H1 → H2 → H3 → H4 → H5 (14 px) |

`normalizeModHeadings()` recale le bloc sur H2 : la section la plus haute présente devient H2, les
suivantes descendent d'autant. **Le Markdown n'est pas touché** — seuls les rangs rendus changent.
Les attributs sont recopiés, donc les ancres du sommaire continuent de fonctionner.

Effet visible : les 6 sections de la fiche passent de 14 px à 18 px et deviennent de vrais
repères de lecture au lieu d'un texte noyé dans le corps.

### 2.4 Les 18 modules — deux défauts réels
`audit_ui.js` couvrait 9 surfaces, **dont aucune page de module** : une modification du template se
propageait à 18 fichiers sans qu'aucun contrôle ne regarde le résultat rendu. Ce trou est fermé par
`scripts/audit_modules_18.js` (4 largeurs × **44 diapositives par module**).

**Défaut 1 — un titre rendu à 9 px.** Aucune règle `.md h6` n'existait : le navigateur appliquait
0,67 em de 14 px ≈ **9 px**, sous le plancher de 12 px tenu partout ailleurs. Mesuré : 5 titres à
9 px dans l'onglet Déroulé. Corrigé par une règle `.md h6` à 12 px.

**Défaut 2 — une cible tactile de 44 px comprimée à 34 px.** Le bouton de fermeture des panneaux
(`.close-panel-btn`) déclarait bien `width: var(--touch-min)`, mais son conteneur flex le
**comprimait** (`flex-shrink` par défaut). Mesuré à 34, 35, 37, 38 et 41 px selon la largeur, sur
les 18 modules. Corrigé par `flex: none` — une cible tactile ne doit jamais dépendre de la place
restante.

**Modules 01, 16 et 18** échappent à `build_all_presentations.js` (01 = référence validée,
16/18 = `PROTECTED_MODULES`) : le template corrigé ne les atteint pas. Leurs titres de panneau ont
été repris dans `hoja_modules_identity.js`, qui traite déjà ces trois fichiers — substitutions
**idempotentes**, un second passage n'applique rien.

---

## 3. Tests

| Suite | Résultat |
|---|---|
| `audit:ui` — 9 surfaces × **360 / 390 / 430 / 820 / 1366** | **0** cible < 44 px · **0** échec de contraste · **0** débordement · **0** erreur console |
| `probe_cockpit.js` — **12 vues** × 4 largeurs | aucun débordement · aucune troncature · **aucun saut de niveau de titre** · **aucun titre < 12 px** · aucun élément `hidden` encore affiché |
| `audit_modules_18.js` — **18 modules** × 4 largeurs × 44 diapositives | **18/18 sans défaut mesurable** |
| `npm test` | **92 vérifications, 0 issue** · **18/18 modules** validés |
| `test:hub` | erreurs console : aucune |
| `test:public` | **72 / 0** — aucune trace formateur |
| `test:identity` | OK (rôles, sessions, brute-force, authz, gates) |
| `test:formateur` | **21 / 0** |
| `test:admin` | **16 / 0** |
| `test:parcours` | **13 / 0** |
| `test:e2e` | **63 / 63** |
| `test:site` | **21 / 21** |

### Un instrument corrigé, pas un défaut corrigé
La sonde signalait « libellés coupés » sur Accueil et Classroom. Vérification faite, c'étaient des
**faux positifs** : l'heuristique (« dernière ligne < 62 % de la première ») ne distingue pas un
repli de phrase d'une vraie césure — elle signalait « tous les apprenants sont présents » alors que
la ligne 2 porte le mot entier « présents ». Le détecteur mesure maintenant la chose elle-même :
le rect de **chaque caractère**, groupé par ligne, et une coupure n'est retenue que si deux
caractères visibles se suivent sans espace **et** tombent sur deux lignes. **Résultat : zéro mot
coupé dans le cockpit.** Le problème était l'instrument, pas l'interface.

---

## 4. Écrans contrôlés

`accueil` · `inscriptions` · `apprenants` · `fiche apprenant 360°` · `fiche candidat` ·
`programme` · `workspace module` (4 onglets) · `classroom` · `formateurs` · `espace formateur`
(`/ui/suivi/`) · `campus` · `login` · **les 18 pages de modules générées**.

---

## 5. Dettes restantes

### Arbitrage — appartient à Tbag, aucune solution technique
1. **67 mentions « OPAYS »** dans le contenu pédagogique des 18 modules. Les corriger **change le
   cours**.
2. **Marque vectorielle des modules** : tracé OPAYS recoloré, pas le logo Hoja. Les fichiers sont
   autonomes (`file:///`) → une image externe casserait le rendu.
3. **5 valeurs de texte legacy** sur fonds image ou dégradé — non mesurables automatiquement.
   Méthode prête : `scripts/measure_contrast_on_image.js`.

### Technique
4. `prompt()` / `confirm()` natifs du cockpit (montant du paiement, motif de refus) — pas de
   système de modale. Signalé depuis le premier audit, **non résolu**.
5. `--muted-dark` (#6f7f95) donne **4,26:1** sur `--card`, sous AA. Le jeton n'est utilisé nulle
   part dans le template et seulement par `.st-na`, une règle **jamais appliquée**. Aucun texte
   réel n'est concerné — mais le jeton est piégé pour un usage futur.

---

## 6. Ce qui n'a volontairement PAS été modifié

- **Le contenu pédagogique** : textes, titres, consignes, prompts, fiches Markdown — intacts.
  `normalizeModHeadings()` change des **rangs de balise**, jamais un mot.
- **Les mentions « OPAYS » du contenu** : décision éditoriale, pas une correction d'identité.
- **Toute fonctionnalité métier** : `POST /api/feedback`, `/api/progress`, `/api/roster`,
  `/api/classroom/*`, filtres, routage, sessions, rôles. Vérifié par diff sur le Lot 6 —
  `api()`, `fillSubmissionSelect()`, le gestionnaire de correction, `LABEL`/`CLS`/`fmtDate`,
  `short()` sont identiques au caractère près.
- **Aucune donnée n'a été inventée** : les états vides sont restés des états vides, les KPI
  n'affichent que des valeurs issues de l'API, et là où la donnée manque, l'écran le dit.
- **`prompt()` / `confirm()`** : leur remplacement changerait le parcours de paiement et de refus.
  Hors périmètre d'une passe de clôture.
- **Les 4 blocs et 18 modules du programme** : structure, ordre, durées, statuts — inchangés.
- **Le palier typographique 84 px**, la pile système, les points de rupture 360/480/768/1024/1366 :
  arbitrages antérieurs, non rouverts.
- **Le site public (`hoja-site/`)** et l'`admin/` hors modules : hors périmètre.

---

## 7. Deux pièges rencontrés, à retenir

1. **Dans `presentation_template.js`, le CSS vit dans un littéral de gabarit.** Un backtick dans un
   commentaire CSS **termine la chaîne** et casse le module JS — le build échoue avec une erreur
   qui pointe la ligne 3 du fichier appelant, pas la vraie cause.
2. **Une régénération partielle ne suffit jamais.** Rejouer `build:presentations` sans
   `hoja_modules_identity.js` réintroduit la marque OPAYS ; et trois modules (01, 16, 18) échappent
   à la régénération quel que soit l'ordre. **Chaîne complète obligatoire :**
   `build:presentations` → `hoja_modules_identity.js` → `build:cockpit` → `build:admin` →
   `build:public`.
