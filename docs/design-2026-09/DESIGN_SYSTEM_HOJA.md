# DESIGN SYSTEM HOJA — Spécification canonique

**Version :** 1.0 — 16 septembre 2026
**Statut :** fondation de référence pour les Phases C → I
**Périmètre :** site public, cockpit, campus, espace formateur, modules / présentations

---

## 0. Principe directeur

> **Une seule marque, deux expressions.**

Le **public** et le **back-office** partagent les mêmes fondations (tokens, typographie,
espacements, rayons, états, comportements) mais ont des **expressions** différentes :

| | Public | Applications (cockpit / campus / suivi) |
|---|---|---|
| Thème | Clair | Sombre |
| Densité | Aérée, éditoriale | Dense, opérationnelle |
| Accent | Vert Hoja `#21A87D` | Vert Hoja `#10B981` + Sky `#38BDF8` |
| Usage | Découverte, conviction | Travail quotidien |

C'est une contrainte assumée : un apprenant lit le site public au grand jour, puis
travaille plusieurs heures dans le cockpit. Le contraste clair/sombre est un choix
fonctionnel, pas une incohérence. **Ce qui doit être identique : la marque, les
proportions, le vocabulaire visuel.**

---

## 1. La palette Hoja — problème à résoudre

### 1.1 Constat de l'audit

L'audit a relevé **4 systèmes de tokens incompatibles** :

| Système | Où | Signature |
|---|---|---|
| **A — Hoja public** | `hoja-site/src/app/globals.css` | `--primary:#21A87D` · `--accent:#124F72` · thème **clair** · 145 tokens `--color-0NN` + 71 tokens `--clr-NN` |
| **B — Hoja SaaS** | `ui/campus`, `ui/suivi` | `--bg:#090d16` `--card:#111726` `--teal:#10b981` `--blue:#38bdf8` `--radius:10px` |
| **C — Hoja cockpit** | `ui/cockpit/index.html` | **Sur-ensemble de B** (mêmes valeurs) + `--card2 --line2 --teal-soft --blue-soft --sb --radius-sm/lg` |
| **D — OPAYS legacy** | `modules/XX/presentation.html` → propagé dans `ui/cockpit/modules/*` et `admin/*` | `--bg:#070b12` `--blue-opays:#0066FF` **`--gold-opays:#D4AF37`** `--navy:#001F4D` `--radius:20px` |
| **E — login** | `ui/login/index.html` | Dérivé divergent : `--bg:#070b12` `--teal:#22c55e` `--text:#e2e8f0` `--line:rgba(255,255,255,.09)` |

### 1.2 Décisions fondatrices

**D-DS-01 — Le système D (OPAYS) est ABANDONNÉ.** Le doré `#D4AF37`, le navy `#001F4D`,
le bleu `#0066FF` et le rayon 20 px ne font pas partie de l'identité Hoja. Ils seront
retirés de la source `modules/XX/presentation.html` (qui alimente les 18 modules du
cockpit via `build_cockpit_data.js`).

**D-DS-02 — La famille B/C devient la référence applicative.** Elle est déjà cohérente
sur 3 surfaces sur 4 et correctement orthogonale (teal = action, sky = information).
On l'étend officiellement et on y aligne `login`.

**D-DS-03 — Le système A (public, clair) est conservé mais PURGÉ.** Ses 216 tokens
inutilisés sont supprimés ; seuls ~25 tokens sémantiques sont conservés. La teinte
`#21A87D` est **harmonisée** avec le `#10B981` applicatif (même famille, écart de
luminance justifié par le fond clair vs sombre).

**D-DS-04 — Un seul vocabulaire de tokens.** Un fichier de tokens partagé est la
source unique. Il n'existe plus de `--clr-NN`, plus de `--gold-opays`, plus de
`--blue-opays`.

---

## 2. Tokens canoniques

### 2.1 Couleurs — thème sombre (applications)

```css
/* ── Surfaces ───────────────────────────────── */
--bg:            #090d16;   /* fond de page */
--card:          #111726;   /* surface élevée (cartes, panneaux) */
--card-hover:    #151d30;   /* état survol */
--card-2:        #0d1322;   /* surface en retrait (zones imbriquées) */
--elevated:      #1a2334;   /* surface flottante (modales, popovers) */

/* ── Bordures ───────────────────────────────── */
--line:          #1e293b;   /* bordure standard */
--line-strong:   rgba(255,255,255,.12);  /* bordure appuyée */
--line-soft:     rgba(255,255,255,.06);  /* séparateur discret */

/* ── Texte ──────────────────────────────────── */
--text:          #f1f5f9;   /* texte principal */
--text-bright:   #ffffff;   /* titre / emphase maximale */
--muted:         #94a3b8;   /* texte secondaire */
--muted-dark:    #64748b;   /* texte tertiaire / placeholders */

/* ── Marque & accents ───────────────────────── */
--teal:          #10b981;   /* ACCENT PRIMAIRE — actions, succès, marque */
--teal-light:    #34d399;   /* variante claire (survol, texte sur sombre) */
--teal-soft:     rgba(16,185,129,.12);   /* fonds d'accent */

--blue:          #38bdf8;   /* ACCENT SECONDAIRE — information, liens, focus */
--blue-soft:     rgba(56,189,248,.12);

/* ── États ──────────────────────────────────── */
--danger:        #f43f5e;   /* erreur, destructif */
--danger-soft:   rgba(244,63,94,.12);
--warn:          #f59e0b;   /* avertissement, en attente */
--warn-soft:     rgba(245,158,11,.12);
--ok:            #10b981;   /* succès (= teal) */
--ok-soft:       rgba(16,185,129,.12);
--info:          #38bdf8;   /* information (= blue) */
--info-soft:     rgba(56,189,248,.12);
--neutral-soft:  rgba(148,163,184,.12);  /* état neutre / non applicable */
```

### 2.2 Couleurs — thème clair (site public)

```css
--background:     #ffffff;
--surface:        #f8fafc;   /* section alternée */
--surface-2:      #f1f5f9;
--border:         #dfeaf0;   /* conservé — déjà utilisé et cohérent */
--foreground:     #333333;   /* texte principal */
--primary:        #21a87d;   /* vert Hoja — aligné sur --teal */
--primary-hover:  #1c9269;
--accent:         #124f72;   /* bleu profond — titres, blocs sombres */
--muted-foreground: #495255;
--muted:          #617175;
```

### 2.3 Typographie

**Famille unique : `Montserrat`.**

```css
--font-display: "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-body:    "Montserrat", system-ui, -apple-system, "Segoe UI", sans-serif;
--font-mono:    ui-monospace, "SFMono-Regular", "Cascadia Code", Consolas, monospace;
```

**Suppression :** Exo 2 (clone), Orbitron, Noto Color Emoji, dashicons, fcicons,
ld-icons, swiper-icons, WooCommerce, star, Futura, Helvetica.
Inter (modules) est également retiré au profit de Montserrat.

**Échelle typographique :**

| Token | Taille | Interligne | Graisse | Usage |
|---|---|---|---|---|
| `--text-xs` | 12px | 1.4 | 500 | Métadonnées, badges |
| `--text-sm` | 13px | 1.5 | 500 | Texte dense (tableaux, listes) |
| `--text-base` | 15px | 1.6 | 400 | Corps de texte |
| `--text-md` | 16px | 1.6 | 400 | Corps éditorial (public) |
| `--text-lg` | 18px | 1.5 | 600 | Sous-titres |
| `--text-xl` | 22px | 1.35 | 600 | Titres de section |
| `--text-2xl` | 28px | 1.25 | 700 | Titres de page |
| `--text-3xl` | 36px | 1.15 | 700 | Héros section (public) |
| `--text-4xl` | 48px | 1.1 | 700 | Héros principal (public) |

**Règle mobile :** `--text-4xl` et `--text-3xl` sont réduits d'un cran sous 480 px
(36 px et 28 px). Jamais de titre > 36 px sur 360 px de large.

### 2.4 Espacements

Échelle par pas de 4 px, alignée sur Tailwind :

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px; --space-20: 80px; --space-24: 96px;
```

**Règles d'usage :**
- Padding interne de carte : `--space-5` (applications) / `--space-6` (public).
- Padding de page (mobile) : `--space-4`. Desktop : `--space-8`.
- Espace entre sections publiques : `--space-16` mobile → `--space-24` desktop.
- Gouttière de grille : `--space-4` mobile → `--space-6` desktop.

### 2.5 Rayons

```css
--radius-sm:  6px;    /* badges, chips, petits contrôles */
--radius:     10px;   /* cartes, champs, boutons — VALEUR DE RÉFÉRENCE */
--radius-lg:  14px;   /* panneaux, modales, grands conteneurs */
--radius-full: 999px; /* pilules, avatars */
```

> **Le rayon 20 px hérité d'OPAYS est supprimé.** 10 px est la valeur de référence ;
> 14 px maximum pour les grands contenants. Au-delà, l'interface paraît « gonflée »
> et perd sa crédibilité professionnelle.

### 2.6 Ombres

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,.24);
--shadow:    0 4px 12px rgba(0,0,0,.28);
--shadow-lg: 0 12px 32px rgba(0,0,0,.36);
```

**Règle :** en thème sombre, les surfaces se distinguent d'abord par **la bordure et
l'élévation de couleur**, pas par l'ombre. L'ombre est un appoint pour les éléments
flottants (modales, menus), jamais pour les cartes statiques.

**Interdit :** `--shadow: 0 34px 90px rgba(0,0,0,.5)` (OPAYS) — ombre spectaculaire
sans fonction, à retirer.

### 2.7 Points de rupture

```css
--bp-xs:  360px;   /* petits mobiles — cible minimale supportée */
--bp-sm:  480px;   /* mobiles */
--bp-md:  768px;   /* tablettes portrait */
--bp-lg:  1024px;  /* tablettes paysage / petits laptops */
--bp-xl:  1366px;  /* desktop de référence */
```

**Cibles de test obligatoires :** 360 · 390 · 430 · 820 · 1366 px.

### 2.8 Cibles tactiles & focus

```css
--touch-min: 44px;   /* toute cible interactive, sur tout écran */
```

```css
/* Focus visible — GLOBAL, identique partout */
:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

> L'audit a montré que `login` et `suivi` n'ont **aucune** règle `:focus-visible`.
> C'est un défaut d'accessibilité à corriger sur toutes les surfaces.

---

## 3. Composants canoniques

Chaque composant a **une seule définition**, partagée. L'audit a relevé 4 noms de
boutons, 3 vocabulaires de statuts, 3 idiomes de modales : tout est unifié ci-dessous.

### 3.1 Boutons

| Variante | Usage | Apparence |
|---|---|---|
| `.btn` (défaut) | Action principale | Fond `--teal`, texte `#06231a`, rayon `--radius`, hauteur 40 px (44 sur mobile) |
| `.btn.btn-secondary` | Action secondaire | Fond `--card`, bordure `--line`, texte `--text` |
| `.btn.btn-ghost` | Action tertiaire | Transparent, texte `--muted`, survol `--card-hover` |
| `.btn.btn-danger` | Action destructrice | Fond `--danger-soft`, texte `--danger` |
| `.btn.btn-sm` | Action dense (tableaux) | Hauteur 32 px, `--text-sm` |

**Règles :**
- Hauteur minimale **44 px sur mobile**, 40 px autorisé au desktop.
- Un seul bouton primaire visible par écran / par zone d'action.
- Le libellé décrit l'action en français (« Enregistrer », pas « OK »).
- **Aucun emoji** dans un libellé.

### 3.2 Statuts (badges) — vocabulaire unique

L'audit a relevé **3 vocabulaires concurrents** pour les mêmes 5 états :
`.c-assigned/.c-draft/.c-submitted/.c-returned/.c-graded` (suivi),
`b-assigned/…` (campus), `done/todo/wait/blocked/na/warn` (cockpit).

**Vocabulaire canonique unique :**

| État | Classe | Couleur | Libellé FR |
|---|---|---|---|
| Non commencé | `.st.st-todo` | `--neutral-soft` / `--muted` | Non commencé |
| Assigné | `.st.st-assigned` | `--info-soft` / `--info` | Assigné |
| En cours | `.st.st-progress` | `--warn-soft` / `--warn` | En cours |
| Soumis | `.st.st-submitted` | `--blue-soft` / `--blue` | Soumis |
| Renvoyé | `.st.st-returned` | `--danger-soft` / `--danger` | À corriger |
| Évalué | `.st.st-graded` | `--ok-soft` / `--ok` | Évalué |
| Bloqué | `.st.st-blocked` | `--danger-soft` / `--danger` | Bloqué |
| Non applicable | `.st.st-na` | `--neutral-soft` / `--muted-dark` | — |

> Les classes existantes `.c-*` et `b-*` sont **remplacées** par `.st-*`.
> Une fonction utilitaire unique `statusClass(state)` est partagée.

### 3.3 Cartes

```css
.card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: var(--space-5);
}
```

**Interdit :** `.card.gold-border`, bordures décoratives colorées sans signification
d'état. La bordure colorée est **réservée** à l'expression d'un état.

### 3.4 Formulaires

**Tout champ doit avoir un `<label for>` associé.** L'audit a trouvé des champs
identifiés uniquement par `placeholder` dans `suivi`, `cockpit`, `campus` et les
modules — c'est non conforme.

```css
.input, .select, .textarea {
  width: 100%;
  min-height: var(--touch-min);
  background: #0a101c;          /* tokenisé : --input-bg */
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text);
  padding: var(--space-3) var(--space-4);
  font: inherit;
}
```

État d'erreur : bordure `--danger` + message relié par `aria-describedby`.

### 3.5 Tableaux

- Desktop : `<table>` classique, en-tête collant.
- **Mobile (< 768 px) : deux stratégies, une seule retenue** — la carte empilée.
  Le `min-width: 640px` de `suivi` et le `min-width: 420px` de cockpit sont
  supprimés ; le débordement horizontal est proscrit.
- Chaque cellule porte un `data-label` pour l'affichage empilé.

### 3.6 Modales

Un seul idiome : `<div role="dialog" aria-modal="true" aria-labelledby="…">`.

**Exigences :**
- Piège de focus (le focus ne sort pas de la modale).
- Retour du focus à l'élément déclencheur à la fermeture.
- Fermeture par `Échap` **et** par bouton visible.
- Arrière-plan inerte.

**À supprimer :** les `prompt()` et `confirm()` natifs du cockpit
(`ui/cockpit/index.html:904,1169,1180`) — ils cassent le clavier, le lecteur
d'écran et l'identité visuelle.

### 3.7 États : chargement / vide / erreur / succès

| État | Composant | Règle |
|---|---|---|
| **Chargement** | `.skeleton` (blocs gris pulsants) | Jamais un simple « Chargement… » en texte — c'est le cas actuel du cockpit (~12 occurrences) |
| **Vide** | `.empty-state` : titre + phrase explicative + action | Jamais un espace blanc |
| **Erreur** | `.error-state` : message + bouton « Réessayer » | Toujours actionnable |
| **Succès** | `.toast` (coin haut-droit, auto-dismiss) | **Aucun système de notification n'existe aujourd'hui** — à créer |

### 3.8 Navigation

| Contexte | Pattern |
|---|---|
| Public | Barre horizontale + menu mobile plein écran |
| Cockpit | Sidebar 240 px (`--sb`) repliable en tiroir < 1024 px + barre inférieure < 640 px |
| Campus / Suivi | En-tête collant + navigation par onglets |

L'élément actif est marqué par `aria-current="page"`.

### 3.9 Icônes

- **22 fichiers `svg-icon*.tsx`** dont **11 inutilisés** → consolidation en **un seul
  composant `<Icon name="…"/>`** alimenté par une table de chemins (`d`) et `viewBox`.
- Style : trait `currentColor`, épaisseur 1.5–2 px, grille 24×24.
- **Aucun emoji dans l'interface** (règle utilisateur explicite). L'audit relève du
  code qui « strip les emojis » à l'affichage dans `ui/cockpit/md.js` — le nettoyage
  doit se faire **à la source** (contenu Markdown), pas à l'affichage.

---

## 4. Contrat de non-régression

Ces éléments sont **load-bearing** : les modifier casse la production.

| Élément | Raison | Règle |
|---|---|---|
| `globals.css` lignes 2350‑2369 | Seul correctif tenant la mise en page 1366 px et mobile, via des sélecteurs sur **sous-chaînes de classes Tailwind** (`[class*="w-[34.45rem]"]`) | **Migrer vers des utilitaires de composant AVANT** de toucher aux classes Tailwind concernées |
| Chemins d'API | `ui/cockpit/index.html:585` appelle `/api/mock/login-as` — endpoint de test en HTML de production | Vérifier le verrouillage serveur avant tout retrait |
| `data/modules.js` | Source des 18 modules du cockpit | Ne jamais éditer `ui/cockpit/programme.js` ou `data/M*.json` à la main |
| `modules/XX/presentation.html` | **Source** des 18 présentations cockpit **et** admin | Toute correction d'identité se fait ICI, puis rebuild — jamais dans les copies générées |
| Contrat d'API partagé | `/api/whoami`, `/api/progress`, `/api/roster` appelés par suivi **et** cockpit avec du code de parsing distinct | Toute évolution d'API doit être répercutée sur les deux |

---

## 5. Règles de style — ce qui est interdit

Conformément à la consigne utilisateur :

| Interdit | Exemple relevé dans l'audit |
|---|---|
| Gradients décoratifs | `login` : `linear-gradient(160deg,#070b12,#0a1230 60%,#070b12)` — sans fonction |
| Emojis dans l'interface | à purger à la source |
| Ombres spectaculaires | `--shadow: 0 34px 90px rgba(0,0,0,.5)` |
| Faux contenus | aucun témoignage / chiffre inventé |
| Composants décoratifs sans fonction | orbes `width:600px` en `position:fixed` dans les modules |
| `!important` | 1 seule occurrence légitime (`whitespace-nowrap` mobile) — ne pas généraliser |
| Débordement horizontal | `min-width:420px` (cockpit), `min-width:640px` (suivi) |
| Cibles tactiles < 44 px | points de carrousel `h-3` (12 px) |

---

## 6. Dette à traiter — récapitulatif chiffré

| Dette | Volume mesuré | Phase |
|---|---|---|
| Sections jamais importées | **7 fichiers** | C |
| Icônes SVG inutilisées | **11 fichiers** | C |
| Règles `@font-face` mortes | **212 règles / ~30 fichiers de police** | C |
| Variantes `list-row*` dupliquées | **11 fichiers × ~8 copies par route ≈ 60 fichiers** | C |
| Texte espagnol en production | **2 passages** (`confidentialite:437,776`) | C |
| CSS dupliqué dans les 18 modules | **~398 Ko** (22,1 Ko × 18, md5 identiques) | H |
| Tokens OPAYS (or/navy) à retirer | **1 source** + 18 copies générées | H |
| Systèmes de tokens à unifier | **4 → 1** | D→G |
| Vocabulaires de statuts | **3 → 1** | E |
| Champs sans `<label>` | **~8** | E/F/G |
| `prompt()` / `confirm()` natifs | **3** | E |
| Balayage 44 px absent | campus, cockpit 640–768 px | G |
| `:focus-visible` absent | login, suivi | D |
| Résidus `data-ditto-id` / `ditto.css` | 8 fichiers CSS + `ditto-meta.ts` | C |
| Polices de police d'icônes WordPress/LearnDash/Swiper | 5 familles | C |

---

## 7. Ordre d'application

| Phase | Surface | Ce qui change |
|---|---|---|
| **C** | Public | Suppression du code mort, des polices et des résidus de clone |
| **D** | Public | Application du système : tokens purgés, composants, responsive |
| **E** | Cockpit | Tokens unifiés, statuts `.st-*`, modales, états, labels |
| **F** | Campus | Alignement complet sur le système applicatif |
| **G** | Suivi | Alignement + tableaux mobiles + balayage 44 px |
| **H** | Modules | **Retrait du système OPAYS à la source** (`modules/XX/presentation.html`), rebuild des 18 |
| **I** | Global | QA responsive 360/390/430/820/1366 |

Le nettoyage (C) précède la refonte (D) — conformément à la consigne :
« Ne commence PAS la refonte visuelle avant que le nettoyage soit terminé. »
