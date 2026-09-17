# PHASE H — MODULES ET PRÉSENTATIONS : RETRAIT DU SYSTÈME DE MARQUE OPAYS

**Date :** 17 septembre 2026
**Statut :** terminée et vérifiée
**Périmètre :** 1 source + 18 modules + 36 copies générées
**Contrainte :** identité visuelle et UX uniquement — contenu pédagogique, structure des
cours et fonctionnalités intacts.

---

## 1. La chaîne, et pourquoi corriger « à la source »

L'inventaire a établi la chaîne réelle de génération — plus profonde qu'annoncée :

```
scripts/presentation_template.js          ← SOURCE DE VÉRITÉ (fonction generatePresentationHtml)
        │  scripts/build_all_presentations.js
        ▼
modules/XX/presentation.html  (18)        ← « la source » au sens du design system §4
        │                              │
        │ scripts/build_admin.js       │ scripts/build_public.js
        ▼                              ▼
admin/modules/XX/index.html (18)   public/modules/XX/index.html (18)
        └────────────── 36 copies ──────────────┘
```

`modules/XX/presentation.html` est donc **généré** : corriger uniquement ces 18 fichiers
aurait laissé la prochaine exécution de `build:presentations` réintroduire le système OPAYS.
La correction a été appliquée **sur `presentation_template.js`** puis propagée, ce qui rend
la correction durable.

Deux modules sont protégés de la régénération (`PROTECTED_MODULES = [16, 18]`, enrichis à la
main) et le module 01 est déclaré « already generated ». Une simple régénération les aurait
donc **laissés en OPAYS**. Le script de propagation traite les 18 modules sans exception.

---

## 2. Inventaire mesuré avant correction (18 modules)

| Élément | Occurrences |
|---|---|
| `--blue-opays` (jeton) | 255 |
| `--line-blue` / `--line-gold` | 241 |
| `--gold-opays` (jeton) | 94 |
| `--surface` / `--surface2` / `--surface3` | 54 |
| `--blue-hover` / `--blue-glow` / `--gold-glow` | 54 |
| `--navy` | 18 |
| `#0066FF` (bleu OPAYS) | 57 |
| `#001f4d` (navy OPAYS) | 39 |
| `#070b12` (fond OPAYS) | 36 |
| `#0d1522` / `#111b2b` / `#162438` | 90 |
| `#D4AF37` (or OPAYS) | 18 |
| `#F8FAFC` / `#FF6E78` / `#FFB84D` / `#55DCA1` | 72 |
| `#cbd5e1` / `#64748b` (texte non tokenisé) | 128 |
| `#050a11` / `#090f18` / `#0a111a` / `#060a10` | 72 |
| `border-radius: 20px` | 18 |
| `0 34px 90px` (ombre spectaculaire) | 18 |
| `gradient(` (dégradés décoratifs) | 108 |
| `class="ambient` (orbes décoratifs) | 36 |
| `class="grain"` | 18 |
| `font-family: Inter` (jamais chargée) | 18 |
| `gold-border` (classe de carte décorative) | 64 |
| **Emojis** | **671** |

---

## 3. Correspondance appliquée

### 3.1 Jetons — un seul vocabulaire (D-DS-04)

| OPAYS (retiré) | Hoja (adopté) |
|---|---|
| `--bg: #070b12` | `--bg: #090d16` |
| `--surface: #0d1522` | `--card: #111726` |
| `--surface2: #111b2b` | `--card-hover: #151d30` |
| `--surface3: #162438` | `--elevated: #1a2334` |
| `--blue-opays: #0066FF` | `--teal: #10b981` (action) |
| `--blue-light: #38BDF8` | `--blue: #38bdf8` (information) |
| `--gold-opays: #D4AF37` | `--teal-light: #34d399` |
| `--line-blue` / `--line-gold` | `--blue-soft` / `--teal-soft` |
| `--text: #F8FAFC` | `--text: #f1f5f9` |
| `--muted: #94A3B8` | `--muted: #94a3b8` |
| `--danger: #FF6E78` | `--danger: #f43f5e` |
| `--warn: #FFB84D` | `--warn: #f59e0b` |
| `--ok: #55DCA1` | `--ok: #10b981` |
| `--shadow: 0 34px 90px rgba(0,0,0,.5)` | `--shadow-sm` / `--shadow` / `--shadow-lg` |
| `--radius: 20px` | `--radius: 10px` (+ `--radius-sm` 6, `--radius-lg` 14, `--radius-full` 999) |
| — (absent) | `--touch-min: 44px` |

Jetons morts supprimés sans remplacement : `--navy`, `--blue-hover`, `--blue-glow`,
`--gold-glow`.

### 3.2 Rayons — 14 valeurs → 1 échelle

| Avant | Après |
|---|---|
| `4px`, `6px`, `8px` | `var(--radius-sm)` (6 px) |
| `10px`, `11px`, `12px`, `13px`, `var(--radius)` | `var(--radius)` (10 px) |
| `14px`, `16px`, `20px` | `var(--radius-lg)` (14 px) |
| `99px`, `999px` | `var(--radius-full)` (999 px) |
| `50%` | conservé (cercles) |

### 3.3 Typographie — plancher 10 px → 12 px

**Avant (15 tailles déclarées) :** 10 / 11 / 12 / 13 / 14 / 18 / 22 / 24 / 26 / 28 / 32 /
42 px + `clamp(17,1.7vw,24)` + `clamp(34,4.2vw,64)` + `clamp(48,6vw,92)`

**Après (11, toutes sur l'échelle 12/14/16/18/22/28/36/48) :**
12 / 14 / 16 / 18 / 22 / 28 / 36 px + `clamp(16px,1.5vw,22px)` (chapeau)
+ `clamp(22px,3vw,36px)` (h2) + `clamp(28px,4vw,48px)` (h1)

Toutes les bornes de `clamp` sont des pas de l'échelle. Titre de slide : **92 px → 48 px**
au maximum, **36 px sous 650 px**, **28 px sous 430 px** — la règle « jamais plus de 36 px
sur 360 px » est respectée.

### 3.4 Décor sans fonction — supprimé (§5 du design system)

- 2 orbes `position:fixed` de 600 × 500 px floutés à 120 px (`.ambient-blue`, `.ambient-gold`)
- la couche de grain SVG en data-URI (`.grain`)
- 6 dégradés décoratifs (`radial-gradient` du halo de logo, `linear-gradient(145deg)` des
  cartes, cartes de comparaison, encart ROI, barre de progression)
- l'ombre spectaculaire `0 34px 90px rgba(0,0,0,.5)`
- les glows colorés de bouton (`0 10px 28px`, `0 14px 34px`, `0 0 40px`)

Les surfaces se distinguent désormais par **la bordure et l'élévation de couleur**, plus par
l'ombre — conforme au §2.6.

### 3.5 Marque

| Emplacement | Avant | Après |
|---|---|---|
| Barre supérieure | `OPAYS ACADEMY` | `HOJA ACADEMY` |
| Panneau Prompts | `ACADÉMIE OPAYS • BOÎTE À PROMPTS` | `HOJA ACADEMY • BOÎTE À PROMPTS` |
| `<title>` | `OPAYS Academy — Module NN` | `Hoja Academy — Module NN` |
| Meta description | `l'Académie OPAYS` | `l'Académie Hoja` |
| `theme-color` | `#070b12` | `#090d16` |
| Marque vectorielle | arc `#001f4d` + tracé `#0066FF` | arc `#0b1220` + tracé `#10b981` |

La marque reste **vectorielle et inline** : les fichiers demeurent autonomes. C'est
nécessaire — `test_browser_real.js` ouvre les modules en `file:///`, une image pointant vers
`/favicon.ico` (le motif des trois autres surfaces) ne résoudrait pas.

### 3.6 Accessibilité et cibles tactiles

| Correction | Détail |
|---|---|
| `:focus-visible` global | absent de la source avant — ajouté (`outline: 2px solid var(--blue)`) |
| Cibles ≥ 44 px | 9 sélecteurs : rail de chapitres (24 → 44), `.icon-btn` (38 → 44), `.resource-main` (38 → 44), navigation basse (40 → 44), `.close-panel-btn` (36 → 44), `.copy-btn`, `.tab-btn`, `.dock-search`, boutons primaires/secondaires |
| `<label>` manquant | le champ de recherche n'avait qu'un `placeholder` → `<label class="visually-hidden">` associé |
| `aria-label` | bouton de fermeture injecté par `build_public.js` |
| Contrôles masqués sur mobile | `.top-actions .icon-btn:not(#fullscreenBtn) { display: none }` supprimé — les 4 contrôles restent atteignables à 360 px |

### 3.7 Emojis — 671 → 0

- **Chrome fonctionnel** (remplacés par des icônes SVG au trait 1,75 px, `currentColor`) :
  vue d'ensemble, notes, plein écran, précédent, suivant, fermer, copier.
- **Libellés de contenu** (glyphes de tête ou de queue retirés, texte conservé) : pastilles
  de héros, orbites, onglets sectoriels, en-têtes de carte.
- **Flèches** : `➔` → `→` (glyphe typographique).
- **Conservés** : `→` `←` (flèches de prose) et `□` (cases à cocher d'un modèle de prompt) —
  ce ne sont pas des emojis.

---

## 4. Deux garde-fous exigeaient le branding OPAYS

Sans correction, ils auraient fait échouer la chaîne **18/18** — silencieusement ou non.

| Fichier | Ce qu'il affirmait | Correction |
|---|---|---|
| `scripts/verify_all_presentations.js` (l. 61-68) | `hasBlueOpays = html.includes('--blue-opays')` → **échec si absent** | Contrôle de conformité Hoja (marque vectorielle recolorée + jetons `--teal` / `--radius`) + 12 motifs proscrits + scan emoji intégral |
| `scripts/test_coherence.js` (§7) | 8 jetons OPAYS **requis** (`--blue-opays`, `--gold-opays`, `--radius: 20px`, `font-family: Inter`…) | 10 jetons Hoja requis + 12 jetons proscrits = **22 contrôles** |

`scripts/build_public.js` injectait par ailleurs un bouton `✕` en dur dans le panneau
sanitizé, et son index public était resté en OPAYS (`#070b12`, `#0065FF`, `Inter`, `🎓
Académie OPAYS`). Alignés.

---

## 5. Résultat mesuré

| Contrôle | Résultat |
|---|---|
| Bloc CSS des 18 modules | **identique**, md5 `1d9e40882d9c` |
| Résidus OPAYS (or / bleu / navy / rayon 20 / ombre / orbes / dégradés) | **0** |
| Emojis | **0** |
| `npm test` — cohérence transversale | 91 vérifications · **0 issue** |
| `npm test` — QA des 18 présentations | **18/18** |
| `npm run build:admin` | 18/18 présentations, notes formateur 18/18 |
| `npm run build:public` | 18/18 sanitizées, **0 fuite** de contenu formateur |
| Conformité des 36 copies générées | **36/36** |

### Bug d'idempotence trouvé et corrigé

Le premier passage a été exécuté trois fois. La règle d'ajout du `<label>` n'était pas
idempotente : elle s'appliquait à chaque exécution et a produit **3 labels identiques par
fichier** (54 au total). Détecté par contrôle de conformité, corrigé par une garde
d'idempotence dans le script (4ᵉ champ : motif dont la présence annule la règle), puis
réparé sur les 19 fichiers. **Leçon : une transformation de masse doit être idempotente ou
vérifiée après chaque passage — pas seulement après le premier.**

---

## 6. Ce qui n'a PAS été touché — et pourquoi

**70 mentions « OPAYS » restent dans les 18 modules.** Elles ne sont pas du chrome : elles
sont portées par le **contenu pédagogique**.

| Exemple | Nature |
|---|---|
| `LA TRAJECTOIRE OPAYS`, `LE RÉFLEXE OPAYS` | titres de chapitre et de slide |
| `LES 4 RÈGLES D'OR DE L'ACADÉMIE OPAYS` | titre de slide |
| `CERTIFIÉ OPAYS ACADEMY` | intitulé de certification |
| `MÉTHODOLOGIE OPAYS` | catégorie de prompt livrée à l'apprenant |
| `Académie OPAYS • Séance NN` | kicker de séance |
| `La Règle des 5 Questions OPAYS` | nom de méthode enseignée |

Renommer ces libellés modifierait le **contenu du cours**, pas son habillage — hors du
périmètre fixé. C'est le seul arbitrage réel qui reste ouvert sur la Phase H.

**Autres points hors périmètre :**
- `font-family: Inter` a bien été retiré au profit de la pile système, conformément à
  l'arbitrage « garde la pile système dans les applications ». Aucune police n'est chargée :
  la pile est donc celle du système, sans requête réseau.
- La marque vectorielle est un tracé géométrique recoloré, pas le logo circulaire Hoja
  (badge Afrique). Voir l'arbitrage ci-dessous.
- Les 24 couleurs de texte du site public relèvent d'un lot distinct.

---

## 7. Arbitrages ouverts

1. **Marque vectorielle des modules** — le tracé OPAYS a été conservé et recoloré en vert
   Hoja. Il fonctionne partout (fichiers autonomes, `file:///`) mais reste un tracé
   géométrique qui n'est pas le logo Hoja. Le badge circulaire Hoja existe en PNG
   (`hoja-site/public/assets/hoja/logo-hoja-cercle.png` → `/assets/hoja/…` en production) :
   l'adopter casserait l'autonomie des fichiers et le rendu en `file:///`. **Décision
   d'identité — à trancher par Tbag.**
2. **70 mentions « OPAYS » de contenu** — renommage éditorial, à valider.
3. **`/admin/modules/`** — les 18 copies admin portent le même CSS. Le chemin `/admin/` reste
   conditionné au script de déploiement (ligne 57) : non traité ici.

---

## 8. Outillage produit

| Fichier | Rôle |
|---|---|
| `scripts/hoja_modules_identity.js` | Retrait du système OPAYS : jetons, rayons, ombres, décor, marque, chrome. Idempotent, avec rapport de conformité et liste de motifs proscrits. |
| `scripts/hoja_modules_labels.js` | Retrait des emojis de libellé (positions de tête/queue uniquement). Traite les 18 modules **et** les sources de données, pour que la régénération reste propre. |
