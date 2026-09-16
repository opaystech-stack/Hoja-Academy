# AUDIT DESIGN — DIAGNOSTIC CONSOLIDÉ

**Date :** 16 septembre 2026
**Méthode :** inspection directe des sources + 2 audits parallèles (site public, couche applicative)
**Périmètre :** `hoja-site/src/**`, `ui/{login,cockpit,campus,suivi}`, `modules/`, `presentations/`, `admin/`

---

## Synthèse exécutive

Le produit n'a **pas un problème de goût, il a un problème de structure**. Quatre
systèmes de design coexistent, une grande partie du code visuel est dupliquée ou
morte, et une identité abandonnée (OPAYS : or + navy) est **toujours servie en
production** dans les 18 présentations de modules.

**Les 5 constats les plus coûteux :**

1. **Les 18 modules pédagogiques affichent encore « OPAYS Academy » en or.** Un
   apprenant qui ouvre un module depuis le cockpit teal tombe sur une page dorée
   portant l'ancienne marque. C'est la fuite de marque la plus visible du produit.
2. **4 systèmes de tokens incompatibles**, dont deux définissent `--radius` à 10 px
   et 20 px. `--bg` a deux valeurs différentes selon la page. Aucune unification
   n'est possible sans trancher d'abord (fait — voir `DESIGN_SYSTEM_HOJA.md`).
3. **~398 Ko de CSS strictement identique** répété dans les 18 modules
   (22 102 octets × 18, md5 vérifiés identiques pour les modules 09 et 18).
4. **~60 fichiers de composants quasi identiques** : 11 variantes `list-row*`
   dupliquées dans ~7 dossiers de route, plus 22 icônes SVG mortes sur 26.
5. **212 règles `@font-face`** pour ~34 fichiers, dont la quasi-totalité est morte
   (Exo 2 du clone appliqué au corps de texte, Orbitron, polices d'icônes
   WordPress / LearnDash / WooCommerce / Swiper).

---

## 1. Inventaire des surfaces

| Surface | Nature | Volume | Thème | Accent |
|---|---|---|---|---|
| Site public | Next.js 15 / React 19 / Tailwind 4 | `src/` (154 fichiers), `globals.css` 2 369 l. | **Clair** | Vert `#21A87D` + bleu profond `#124F72` |
| Login | HTML statique autonome | 73 l., 1 995 o CSS | Sombre | Vert `#22c55e` (**divergent**) |
| Cockpit | HTML SPA, routage par hash | 1 548 l., 30 832 o CSS | Sombre | Teal `#10b981` + sky `#38bdf8` |
| Campus | HTML statique | 469 l., 8 664 o CSS | Sombre | Idem cockpit |
| Suivi | HTML statique | 327 l., 6 724 o CSS | Sombre | Idem cockpit |
| Modules (×18) | HTML généré | 993–1 677 l., **22,1 Ko CSS chacun** | Sombre | **Or `#D4AF37` + navy `#001F4D`** |
| `presentations/` | 18 stubs de redirection | 348–457 o chacun | — | — |
| `admin/` | Legacy, généré | 21 HTML + 2 JS | Sombre | **Or `#D4AF37`** |

---

## 2. Cartographie de la marque — où Hoja est présente, où elle ne l'est pas

| Zone | Marque affichée | Statut |
|---|---|---|
| Site public | Hoja | ✅ Correct (structure héritée du clone) |
| Login | Hoja (`favicon.ico`) | ✅ Correct |
| Cockpit (shell) | Hoja | ✅ Correct |
| Campus | Hoja | ✅ Correct |
| Suivi | Hoja | ✅ Correct |
| **Cockpit — modules 01→18** | **OPAYS Academy** | ❌ **Ancienne marque servie** |
| `admin/*` | OPAYS Academy | ⚠️ Legacy assumé (retrait planifié) |
| `modules/XX/presentation.html` | **OPAYS Academy** | ❌ **Source du problème** |

### 2.1 Trace exacte de la fuite

`modules/01-comprendre-ia/presentation.html` contient :

```html
<title>OPAYS Academy — Module 01 : Comprendre l'IA</title>
```

et déclare dans `:root` :
```css
--blue-opays: #0066FF;
--gold-opays: #D4AF37;
--navy:       #001F4D;
--radius:     20px;
```

`scripts/build_cockpit_data.js` (lignes 79–95) copie **tel quel** ce fichier vers
`ui/cockpit/modules/NN/index.html`, en n'ajoutant qu'un bouton retour et un favicon.
`scripts/build_admin.js` fait de même vers `admin/modules/NN/index.html`.

**Conséquence :** corriger `modules/XX/presentation.html` puis relancer les builds
corrige **les 36 copies** (18 cockpit + 18 admin) d'un seul coup. C'est le levier
le plus rentable du chantier.

`diff admin/modules/01/index.html ui/cockpit/modules/01/index.html` → **4 lignes**
de différence (le bouton retour). Les deux sorties sont des clones.

---

## 3. Problème n°1 — les tokens

### 3.1 Les 4 systèmes

| Token | login | campus / suivi | cockpit | modules (OPAYS) |
|---|---|---|---|---|
| `--bg` | `#070b12` | `#090d16` | `#090d16` | `#070b12` |
| `--text` | `#e2e8f0` | `#f1f5f9` | `#f1f5f9` | `#F8FAFC` |
| `--teal` | `#22c55e` | `#10b981` | `#10b981` | *(absent)* |
| `--blue` | `#38BDF8` | `#38bdf8` | `#38bdf8` | `--blue-opays:#0066FF` |
| `--line` | `rgba(255,255,255,.09)` | `#1e293b` | `#1e293b` | `rgba(255,255,255,.08)` |
| `--radius` | *(absent)* | `10px` | `10px` | **`20px`** |
| `--card` | `#0e1626` | `#111726` | `#111726` | *(utilise `--surface`)* |
| `--danger` | — | `#f43f5e` | `#f43f5e` | `#FF6E78` |
| `--warn` | — | `#f59e0b` | `#f59e0b` | `#FFB84D` |

**Trois familles :** campus ≈ suivi ≈ cockpit-shell. `login` diverge. Les **modules
sont un système étranger** (OPAYS).

### 3.2 Le problème du site public

`globals.css` déclare **~216 tokens jamais référencés** :
- `--font-001` → `--font-005`, `--font-body` : **6/6 inutilisés**
- `--font-size-001` → `--font-size-018` : **18/18 inutilisés**
- `--space-001` → `--space-032` : **32/32 inutilisés**
- `--radius-001` → `--radius-005` : **5/5 inutilisés**
- `--line-height-*`, `--z-*`, `--bp-*` : inutilisés
- `--clr-0` → `--clr-70` : palette du clone, quasi entièrement morte

Doublons de sens : `--color-034`, `--color-056`, `--primary`, `--color-021` sont
tous des verts de la même famille (`rgb(33,168,125)`) ; `--color-018` et
`--color-046` sont tous deux `rgba(33,168,125,0.22)`.

---

## 4. Problème n°2 — duplication

### 4.1 `list-row*.tsx` — 11 variantes

Les 8 variantes partagées (`components/list-row.tsx` → `list-row8.tsx`) sont
**structurellement identiques** : `<li><a>` + une chaîne de classes Tailwind
codée en dur + `styles.className`. Seule la chaîne de classes diffère.

- `list-row4.tsx` = `list-row2.tsx` + `max-lg:hidden` (2 classes).
- `list-row8.tsx` = `list-row7.tsx` + `min-w-0` + `max-md:text-[0.6875rem]`.

**Et surtout :** chaque dossier de route possède **sa propre copie** de ces
fichiers. `accessibilite/`, `confidentialite/`, `contact/`, `cookies/`,
`entreprises/`, `mentions-legales/`, `formations/programme-intensif/` — soit
**~60 fichiers** pour 8 composants réels. `cookies/` ajoute même `list-row9/10/11`.

→ Fusion en **un composant `<ListRow variant="…"/>`**, les copies de route supprimées.

### 4.2 `svg-icon*.tsx` — 26 fichiers, 22 morts au total

La plupart sont des formes 7 lignes à chemin unique ne différant que par `viewBox`
et `d`.

**CORRECTION (constatée en Phase C/D) :** l'audit initial supposait que les icônes
`8` à `18` et les illustrations `1` à `4` étaient vivantes. La vérification
exhaustive (importateurs **et** toute référence textuelle) a montré que **seuls 4
fichiers sont réellement utilisés** :

| Fichier | Utilisé par |
|---|---|
| `svg-icon8.tsx` | `sections/page-hero.tsx` |
| `svg-icon13.tsx` | `sections/footer.tsx` |
| `svg-icon18.tsx` | `sections/footer.tsx` |
| `svg-illustration.tsx` | `sections/page-hero.tsx` |

**Morts (22 au total)** : `svg-icon`, `2`, `3`, `4`, `5`, `6`, `7`, `9`, `10`, `11`,
`12`, `14`, `15`, `16`, `17`, `19`, `20` (104 l.), `21` (47 l.), `22` — plus
`svg-illustration2`, `3`, `4`.

→ `svgs/` : **26 → 4 fichiers**. Les 4 restants sont des composants React distincts
(chemins SVG différents, pas de paramétrage utile) : pas de fusion pertinente.

### 4.3 CSS des modules — ~398 Ko

Bloc CSS de 22 102 octets, **md5 identique** pour les modules 09 et 18
(`7082a98e43b4`), 19 octets d'écart pour le module 01 (`3c51678dbe3c`).

→ Extraction en **une feuille partagée** `modules/_shared/presentation.css`.

### 4.4 JavaScript dupliqué

- Échappeur HTML réimplémenté **3 fois** sous 3 noms : `escapeHtml()` (suivi),
  `esc()` (campus), `esc` flèche (cockpit).
- Wrapper `fetch` : 3 conventions différentes.
- Logique du lecteur de module dupliquée **18 fois** (~700 lignes chacune).

---

## 5. Problème n°3 — les polices

`globals.css` contient **212 règles `@font-face`** pour ~34 fichiers.

| Famille | Règles | Réellement utilisée ? |
|---|---|---|
| Exo 2 | **180** | Appliquée au corps via `.cn0{font-family:"Exo 2"}` (clone) — **à retirer** |
| Orbitron | 12 | Jamais référencée |
| Noto Color Emoji | 11 | Jamais référencée |
| Roboto | 3 | 7 références marginales |
| dashicons, fcicons, ld-icons, swiper-icons, WooCommerce, star | 1 chacune | **0 référence** — WordPress / LearnDash / Woo / Swiper |
| **Montserrat** | 0 (`@font-face`) | Chargée depuis Google Fonts — **174 occurrences, la vraie police Hoja** |

**Anomalie :** la police d'affichage Hoja (Montserrat) n'a aucune déclaration
locale, tandis que 180 déclarations servent une police de clone (Exo 2).
`globals.css` compte 1 627 lignes de `@font-face` sur 2 369 — **69 % du fichier.**

---

## 6. Problème n°4 — responsive

| Problème | Emplacement | Détail |
|---|---|---|
| Largeurs fixes ≥ 551 px | `page.tsx:416,760,1260` (`w-[34.45rem]`), `:542` (`w-[38.6875rem]` = 619 px) | Patchées uniquement dans la bande 768–1535 px |
| Hauteurs fixes | `page.tsx` — 30+ `min-h-[…]`, dont `min-h-[880px]` | Contenu plus grand que la boîte → rognage |
| Sélecteurs sur sous-chaînes Tailwind | `globals.css:2354-2362` `[class*="w-[34.45rem]"]` | **Extrêmement fragile** — tout refactor casse la mise en page 1366 px |
| Débordement forcé | `ui/cockpit/index.html:168` `min-width:420px` | Overflow horizontal à 360–390 px |
| Table non responsive | `ui/suivi/index.html:43` `min-width:640px` | Si JS échoue, table brute = scroll horizontal |
| `overflow-x:clip` global | `globals.css:422-423` | **Masque les bugs** au lieu de les corriger |
| 44 px absent | campus (0 balayage), cockpit 640–768 px (36 px) | Cibles tactiles sous le minimum |
| Points de carrousel | `why-hoja-carousel.tsx:103` `h-3` | 12 px — inutilisable au doigt |
| `position:fixed` | navbar mobile, `[background-attachment:fixed]` `page.tsx:472` | Jank iOS, contenu potentiellement piégé |

---

## 7. Problème n°5 — accessibilité

| Défaut | Emplacement |
|---|---|
| Champs sans `<label>` | `suivi:136,138,140` · `cockpit:512,574-576,936` (`#bill-price` sans label) · `campus:163-164` · modules `#resourceSearch` (×18) |
| `:focus-visible` absent | **login** et **suivi** n'ont aucune règle ; cockpit et campus en ont |
| Piège de focus absent | modales des modules ; tiroir du cockpit |
| `prompt()` / `confirm()` natifs | `cockpit:904,1169,1180` — cassent clavier et lecteur d'écran |
| Contraste insuffisant | `text-background` (#fff) sur `--primary` (`rgb(33,168,125)`) ≈ **2,6:1** — échec WCAG AA (4,5:1 requis). Touche **tous les CTA du site public** |
| Pas de toast/snackbar | 0 occurrence dans toute la couche UI |
| `role`/`aria-modal` incomplets | modales des modules ; overlay du tiroir cockpit |

**Points positifs :** pas de `<div onclick>` (0 occurrence), tous les `<img>` ont un
`alt`, `aria-hidden` utilisé 221 fois, lien d'évitement présent dans le cockpit.

---

## 8. Problème n°6 — résidus du clone (site public)

| Élément | Emplacement |
|---|---|
| Texte espagnol **en production** | `confidentialite/page.tsx:437` (« En caso de que lo hagamos… »), `:776` (espagnol mêlé au français) |
| Marque du clone « deac » | `contact/page.tsx:257`, `page.tsx:424,621,768,1268` — `<g id="mark_deac">` |
| Identifiants Ditto | 8 fichiers `ditto.css` + `ditto-meta.ts` — `style-english`, `style-spanish`, `style-chatea-con-nosotros-estamos-online` |
| Empreintes LearnDash | `ditto-meta.ts:35,37,44` — `style-ld-lesson-row-tooltip`, `interaction-ld-expand` |
| Empreintes WordPress | `ditto-meta.ts:8` `style-wp-submit`, `globals.css:450` `dashicons` |
| Faute héritée | `coursr-pointer` (au lieu de `cursor-pointer`) — **155 occurrences dans 43 fichiers** |
| Assets du clone servis | `page.tsx:252` vidéo hero, `page.tsx:414,481` images, `layout.tsx:66` logo JSON-LD (`/assets/cloned/images/fa64729e9a88.png`) |

`cloned/` contient ~130 images, 41 polices, 13 SVG, 1 vidéo — dont la majorité
n'est référencée que par les `@font-face` morts.

---

## 9. Ce qui est bien fait — à préserver

Il serait faux de présenter ce produit comme intégralement à refaire. Points solides :

- **Cockpit** : sidebar repliable (tiroir < 1024 px + barre basse < 640 px), lien
  d'évitement, `:focus-visible` couvert, tables à conversion mobile via
  `data-label`, `aria-current`, `aria-live`.
- **Suivi** : squelettes de chargement (`.skel`), état vide (`.empty`), retours
  d'API (`resp.ok` / `resp.err`) — **le seul endroit du produit avec de vrais
  états de chargement.**
- **Formulaires publics** : `mailto-forms.tsx` est exemplaire — chaque `<input>` a
  un `<label htmlFor>` associé.
- **Site public** : `alt` présent sur 44/44 images, `theme-color`, métadonnées SEO,
  `robots`/`sitemap` corrects, JSON-LD.
- **Campus / Suivi / Login** : jetons déjà harmonisés entre eux, viewport correct
  sur les 22 fichiers HTML.

---

## 10. Plan d'attaque — priorisation

| Priorité | Action | Phase | Impact |
|---|---|---|---|
| **P0** | Retirer le système OPAYS de `modules/XX/presentation.html` (source), rebuild 36 copies | **H** | Fuite de marque la plus visible |
| **P0** | Trancher les tokens (fait → `DESIGN_SYSTEM_HOJA.md`) | **B** | Débloque tout le reste |
| **P1** | Supprimer le code mort du site public (7 sections, 11 icônes, `media-card`) | **C** | Réduit la surface de refonte |
| **P1** | Retirer les 212 `@font-face` morts + polices `cloned/` | **C** | −69 % de `globals.css`, −30 fichiers au build |
| **P1** | Fusionner `list-row*` (11→1) et `svg-icon*` (22→1) | **C** | −50 fichiers |
| **P1** | Remplacer les `prompt()`/`confirm()` du cockpit | **E** | UX + accessibilité |
| **P2** | Corriger le contraste des CTA publics (2,6:1 → ≥ 4,5:1) | **D** | Conformité WCAG AA |
| **P2** | Unifier les 3 vocabulaires de statuts en `.st-*` | **E** | Cohérence inter-écrans |
| **P2** | Ajouter les `<label>` manquants (~8) | **E/F/G** | Accessibilité |
| **P2** | Corriger les débordements 360–390 px | **I** | Mobile-first |
| **P2** | Extraire le CSS partagé des modules (~398 Ko) | **H** | Poids |
| **P3** | Supprimer `presentations/` (18 stubs morts) | **C** | Propreté |
| **P3** | Remplacer `coursr-pointer` (155 occ.) | **C** | Propreté |
| **P3** | Consolider les 3 échappeurs HTML et le wrapper `fetch` | **E/F/G** | Maintenabilité |

---

## 11. Contraintes de sécurité du chantier

| Élément | Risque | Règle |
|---|---|---|
| `globals.css:2350-2369` | Sélecteurs sur sous-chaînes Tailwind — **seul correctif 1366 px / mobile** | Migrer vers des utilitaires de composant **avant** de toucher aux classes concernées |
| `modules/XX/presentation.html` | Source de 36 fichiers générés | Corriger ICI, jamais dans les copies |
| `deploy/deploy-vps-academy.sh:57` | `[ -d "$SITE_DIR/admin" ] \|\| exit 1` | Ne pas retirer `admin/` sans adapter ce script |
| `/api/mock/login-as` | Appelé depuis `cockpit:585` en HTML de production | Vérifier le verrouillage serveur avant tout retrait |
| `data/modules.js` | Source du registre des 18 modules | Ne jamais éditer `programme.js` / `data/M*.json` |
| API `/api/whoami`, `/api/progress`, `/api/roster` | Appelées par suivi **et** cockpit, parsing distinct | Toute évolution d'API à répercuter sur les deux |
