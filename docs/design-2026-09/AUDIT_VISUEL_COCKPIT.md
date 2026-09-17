# Audit visuel & UX — Cockpit Hoja Academy

**Date :** 17/09/2026 · **Méthode :** capture Chrome réelle (puppeteer-core) des 11 surfaces
aux largeurs **360 / 390 / 430 / 820 / 1366**, lecture du **DOM construit**, jamais du code source.

**Captures de référence (avant) :** `screenshots/audit-before/` — 40 PNG
(surfaces : accueil, inscriptions, apprenants, fiche 360°, programme, workspace module,
classroom, formateurs) · `screenshots/audit-ui/` (audit mesuré).

**Constat de cadrage.** Les garde-fous techniques sont verts (0 débordement, 0 cible < 44 px,
0 contraste insuffisant, 0 erreur console). Cela ne dit **rien** de la qualité perçue : les
écrans sont conformes mais composés comme un template d'administration générique, pas comme
un back-office SaaS de 2026. Le problème n'est pas la couleur, c'est **la composition, la
hiérarchie et la densité**.

---

## 1. Diagnostic par écran

### 1.1 Accueil / Dashboard — le plus faible

| # | Problème observé | Preuve |
|---|---|---|
| A1 | **L'« À faire » (6 lignes, ~350 px) passe avant les KPI.** Le plus gros bloc de l'écran est une liste, pas l'état de l'academy. | `accueil-1366` : le bloc À faire occupe 130→390 px, les KPI commencent à 425 px |
| A2 | **2 lignes sur 6 sont « Fait »** (import, invitation) → du bruit dans un centre d'action. | `accueil-1366` lignes 2 et 3 |
| A3 | **3 KPI morts** : « Tarif formation = non configuré », « Encaissé = — », « 0 paiement(s) confirmé(s) ». Une ligne entière de cartes vides. | `accueil-1366` bloc FACTURATION |
| A4 | **Colonne de contenu plafonnée à 1040 px** → ~330 px de vide à droite en 1366. Densité faible. | `accueil-1366` : contenu 208→1040, vide 1040→1366 |
| A5 | **6 titres de section** (`.zone`) empilés, chacun avec un filet pleine largeur → lecture « document », pas « dashboard ». | « À FAIRE / ÉTAT DE L'ACADEMY / FACTURATION / PROCHAINE COHORTE / ACTIVITÉ RÉCENTE / PROGRAMME » |
| A6 | **Section entière « Prochaine cohorte »** pour une seule phrase. | `accueil-1366` y=670→715 |
| A7 | **Badge « BLOC 1 » coupé sur deux lignes** dans les mini-cartes programme. | `accueil-1366` mini-cartes, « BLOC » / « 1 » |
| A8 | **Icônes décoratives encadrées** dans les KPI (4 boîtes 26 px) + un `.dot` vert dans le libellé « Passerelle » → deux langages visuels pour la même information. | `renderHome()` |
| A9 | **Chip « Cohorte 01 » vert permanent dans le topbar**, alors que la date de cohorte est « à définir » → information fausse. | `accueil-1366` haut-droite |
| A10 | **Aucune action primaire dans l'en-tête** (pas de recherche, pas de rafraîchir, pas de « + »). | topbar, toutes captures |
| A11 | **Mobile 390 : la grille KPI 2×2 laisse « Programme 18/18 » seul** sur une ligne, avec un trou. | `accueil-390` |

### 1.2 Inscriptions — la table est inutilisable à l'échelle

| # | Problème observé | Preuve |
|---|---|---|
| I1 | **Pile verticale de 4 boutons** dans la cellule Actions → **une ligne = ~150 px**. Avec 20 candidats : illisible. | `inscriptions-1366` ligne unique 290→430 px |
| I2 | **`<details>` « Objectif » à l'intérieur d'une cellule** → chevron flottant détaché du texte, casse la grille du tableau. | `inscriptions-1366` colonne PROFIL |
| I3 | **Aucune hiérarchie d'action** : « Marquer payé », « Marquer vérifié », « Refuser » au même poids visuel. | `inscriptions-1366` |
| I4 | **KPI « Admis 0 » avec icône coche verte** — un zéro en vert se lit comme une bonne nouvelle. | `inscriptions-1366` carte 3 |
| I5 | **Pas de filtre par statut**, pas de tri, pas de compteur cliquable. | toolbar absente |
| I6 | **Ordre des blocs incohérent** : tableau → configuration tarif → note explicative. La note est loin de ce qu'elle explique. | `inscriptions-1366` |
| I7 | **Mobile : boutons alignés à droite en escalier** (`align-items:flex-end`) → bord droit en dents de scie. | `inscriptions-390` |
| I8 | **État vide inexistant** : juste un paragraphe de texte, pas de porte de sortie visuelle. | `renderInscriptions()` |

### 1.3 Apprenants — une liste, pas une table

| # | Problème observé | Preuve |
|---|---|---|
| L1 | **Aucun en-tête de colonne** : la colonne « Import » n'est pas identifiable. | `apprenants-1366` |
| L2 | **Colonne « Import / Admis » quasi vide** (118 px pour un mot) + colonne chevron → 2 colonnes sur 4 sans valeur. | `.lrow .w{width:118px}` |
| L3 | **Aucune donnée de progression en ligne** alors que `/api/progress` est déjà chargé. | `renderLearners()` n'utilise pas `PROGRESS` |
| L4 | **Le bloc « Importer » (ouvert, ~280 px) domine la liste (3 lignes, ~150 px).** Priorité inversée. | `apprenants-1366` |
| L5 | **Recherche + filtres dans la même carte que la liste** → ils défilent avec elle. | `apprenants-390` |
| L6 | **La liste n'a pas de pied** : dernière ligne puis padding, sans total ni action de masse. | `apprenants-390` |
| L7 | **Deux niveaux d'imbrication inutiles** : `section.card > details.tool` (deux bordures, deux fonds). | `apprenants-1366` |

### 1.4 Fiche apprenant 360° — bon squelette, exécution à reprendre

| # | Problème observé | Preuve |
|---|---|---|
| F1 | **Étapes « n/a » affichées à 55 % d'opacité** → se lit comme cassé, pas comme « non applicable ». | `fiche-1366` « 1 Candidature n/a », « 2 Paiement n/a » |
| F2 | **Numérotation incohérente** du bandeau d'étapes : 1, 2, 3 numérotés, 4 et 5 en coche, 6 numéroté. | `.pstrip .ps::before` + `.st-graded::before{content:"✓"}` |
| F3 | **4 lignes de tirets cadratins** (`—`) pour un compte importé, au lieu d'un état vide explicite. | `fiche-1366` carte Inscription |
| F4 | **Valeur longue « non suivi (import sans candidature) » en gras, alignée à droite** → déborde visuellement de la carte. | `fiche-1366` Facturation |
| F5 | **Ordre de lecture du suivi inversé** : `M01 · [Validé] · Mission M01 — …` (état avant le titre). | `personProgress()` |
| F6 | **Aucune identité visuelle** (pas d'avatar/initiales), aucune action de suivi en tête. | `.phead` |

### 1.5 Workspace module — deux vrais bugs de composition

| # | Problème observé | Preuve |
|---|---|---|
| M1 | **Le `h1` et le `lead` « Programme » restent affichés au-dessus du module.** `#programme-body` est masqué, mais le titre ne l'est pas. | `module-1366` : « Programme / 4 blocs · 18 modules… » puis « ← Programme » puis « M01 » |
| M2 | **H1 dupliqué** : « Comprendre l'IA » (en-tête module) **et** « Académie OPAYS – Module 01 » (fiche). | `module-1366` |
| M3 | **Les listes markdown indentées sont rendues en blocs `<pre>` monospace** → le contenu pédagogique paraît cassé. | `module-1366` « L'APPLICATION / ASSISTANT (la voiture) » |
| M4 | **Colonne de lecture plafonnée à 820 px** dans une zone de 1040 → ~220 px de vide, lignes trop courtes/longues selon la fenêtre. | `.mod-wrap{max-width:820px}` |
| M5 | **Aucune table des matières** pour une fiche de 2 000+ mots. | onglet Fiche |

### 1.6 Programme — débordement réel

| # | Problème observé | Preuve |
|---|---|---|
| P1 | **La cellule « séance » déborde sur la pastille « Prêt ».** `.mrow .w{width:124px}` + `white-space:nowrap` sans troncature. | `programme-1366` M02 « Séance 02 (+ M03) · 110 min » → collision, idem M15 |
| P2 | **Métadonnées de bloc en une seule ligne run-on** : « M01→M05 · Semaines 1-2 · Séances 1 à 4 · 5 modules ». | `.bloc-h small` |

### 1.7 Classroom

| # | Problème observé | Preuve |
|---|---|---|
| C1 | **`<details>` imbriqué dans une cellule de `ul.facts`** → boîte flottante détachée au milieu de la ligne. | `classroom-1366` « Détail des devoirs » |
| C2 | **Valeurs longues alignées à droite en gras** (« 0 invitation(s) en cours (0 en attente, 0 acceptées) ») → scan difficile. | `.facts .v{text-align:right}` |

### 1.8 Formateurs

| # | Problème observé | Preuve |
|---|---|---|
| T1 | **Une carte et 90 % de page vide.** Aucune explication du périmètre du rôle, aucune liste, aucun état. | `formateurs-1366` |

### 1.9 Défauts techniques mesurés (indépendants du design)

| # | Défaut | Preuve |
|---|---|---|
| B1 | `--input-bg:var(--input-bg)` — **variable auto-référente** → invalide. `.pres-frame iframe` n'a donc pas de fond. | `index.html:28` |
| B2 | `--line-soft:var(--card-hover)` — un jeton de bordure qui pointe sur une couleur de survol. | `index.html:15` |
| B3 | `$('#cand-list') === null;` et `$('#learners-list') \|\| null;` — **expressions mortes** laissées comme « garde-fous ». | `index.html:901, 1010` |
| B4 | `prompt()` natif pour le montant et le motif de refus, `confirm()` pour le mot de passe. | `index.html:916, 1181, 1192` |
| B5 | `alert0()` crée un bandeau **dans le tableau** puis le supprime en 6 s → pas de retour d'action persistant. | `index.html:895` |

---

## 2. Les 18 problèmes retenus, par impact décroissant

| Rang | Problème | Écran | Impact |
|---|---|---|---|
| 1 | Pile de 4 boutons par ligne (I1) | Inscriptions | 🔴 bloquant à l'échelle |
| 2 | À faire avant les KPI + 2 lignes « Fait » (A1, A2) | Accueil | 🔴 hiérarchie inversée |
| 3 | 3 KPI morts (A3) | Accueil | 🔴 crédibilité |
| 4 | Débordement séance/pastille (P1) | Programme | 🔴 bug visuel |
| 5 | H1 « Programme » résiduel + H1 dupliqué (M1, M2) | Module | 🔴 bug de composition |
| 6 | Markdown indenté rendu en `<pre>` (M3) | Module | 🔴 contenu pédagogique |
| 7 | Liste apprenants sans en-têtes ni progression (L1, L3) | Apprenants | 🟠 |
| 8 | Import (ouvert) plus gros que la liste (L4) | Apprenants | 🟠 |
| 9 | Colonne plafonnée à 1040 px (A4, M4) | Tous | 🟠 densité |
| 10 | 6 sections `.zone` empilées (A5) | Accueil | 🟠 |
| 11 | Étapes « n/a » à 55 % + numérotation incohérente (F1, F2) | Fiche 360° | 🟠 |
| 12 | `<details>` dans une cellule de tableau (I2) / de `ul.facts` (C1) | Inscriptions, Classroom | 🟠 |
| 13 | Aucun filtre/tri/compteur sur les candidatures et le roster (I5) | Inscriptions, Apprenants | 🟠 |
| 14 | Aucune action primaire en en-tête (A10) | Tous | 🟡 |
| 15 | Badge « BLOC 1 » coupé + métadonnées run-on (A7, P2) | Accueil, Programme | 🟡 |
| 16 | Chip « Cohorte 01 » vert permanent (A9) | Tous | 🟡 exactitude |
| 17 | `prompt()`/`confirm()` natifs (B4) | Inscriptions, Fiche | 🟡 |
| 18 | États vides = paragraphes de texte (I8, T1) | Inscriptions, Formateurs | 🟡 |

---

## 3. Direction retenue — « langage Hoja »

> sobre · premium · professionnel · dense mais lisible · orienté action

**Ce qu'on garde :** le thème sombre (cockpit opérationnel), la pile système, l'échelle
typographique 12/14/16/18/22/28/36/48, les points de rupture 360/480/768/1024/1366, les
cibles ≥ 44 px, les jetons `.st-*`.

**Ce qu'on change :**

1. **Quatre niveaux de surface lisibles** au lieu de deux qui se confondent :
   `--bg` (page) → `--panel` (carte) → `--panel-2` (en-tête de tableau, zone interne)
   → `--raised` (survol, sélection). Profondeur = filet + liseré interne, **pas d'ombre portée**
   sur les cartes. L'ombre est réservée aux superpositions (tiroir, barres collantes).
2. **Grille de dashboard à deux colonnes dès 1200 px** : colonne principale (état + actions)
   + colonne latérale (cohorte, système, programme). Fini la colonne unique de 1040 px.
3. **Les KPI en héros** : premier bloc de l'écran, 4 indicateurs, sans icône encadrée,
   avec une ligne de contexte réelle. **Un KPI sans donnée n'est pas affiché** — il devient
   une action (« Configurer le tarif »).
4. **Centre d'action qui ne montre que l'ouvert** : les tâches « Fait » se replient dans un
   dépliant « n tâches faites ». Tri par urgence : bloqué → à faire → à vérifier.
5. **Une table est une table** : en-têtes de colonnes réels, tri, filtre à compteurs,
   barre d'outils collante, hauteur de ligne ≤ 72 px, **une action primaire par ligne** +
   un menu secondaire. Aucun `<details>` dans une cellule.
6. **États explicites** plutôt que des tirets : squelette au chargement, état vide avec une
   porte de sortie, état d'erreur avec le motif réel, retour d'action par toast.
7. **Zéro gradient, zéro emoji, zéro décoration.** Aucune donnée inventée : si l'API ne
   renvoie pas la valeur, l'écran le dit.

**Inspiration assumée** (Linear / Vercel / Stripe) : densité, hiérarchie par la typographie et
le filet plutôt que par la couleur, barres d'outils collantes, états vides soignés.
**Aucun de ces designs n'est copié** : la palette, l'échelle et les composants restent Hoja.

---

## 4. Plan d'exécution par lots

| Lot | Périmètre | Fichier |
|---|---|---|
| **0 — Fondations** | jetons de surface, profondeur, largeur de contenu, grille dashboard, typographie, `.st-*` complété, squelette, toast, barre d'outils collante, en-tête avec action primaire | `ui/cockpit/index.html` (CSS) |
| **1 — Accueil** | KPI en héros, KPI sans donnée → action, centre d'action trié et repliable, grille 2 colonnes, mini-cartes programme, chip de cohorte exact | `renderHome()`, `renderTodo()`, `renderProgramme()` |
| **2 — Inscriptions** | barre d'outils (recherche + filtres à compteurs), table redessinée, 1 action primaire + menu de ligne, état vide, note replacée | `renderInscriptions()` |
| **3 — Apprenants** | vraie table (en-têtes, progression), barre collante, outils repliés en zone secondaire, pied de liste, état vide | `renderLearners()`, structure HTML |

Lots 4+ (fiche 360°, module, classroom, formateurs) traités **après validation visuelle** des
lots 0→3, conformément à la consigne « ne refais pas toute l'application en une fois ».

**Correction à la source** : tout est fait dans `ui/cockpit/index.html`, qui est le fichier
source maintenu à la main. `programme.js` et `data/*.json` sont générés → non touchés.

**Vérification après chaque lot** : `capture_ui.js` (390 / 430 / 820 / 1366) + `audit_ui.js`
(débordement, cibles, contraste, erreurs console) + `npm test` + `npm run test:hub`.

---

## 5. Résultats mesurés après exécution des lots 0 → 3

### Garde-fous

| Contrôle | Avant | Après |
|---|---|---|
| Débordement horizontal (`audit_ui`) | 0 | **0** |
| Cibles tactiles < 44 px | 0 | **0** |
| Contraste insuffisant | 0 | **0** |
| Erreurs console | 0 | **0** |
| `npm test` (cohérence + 18 présentations) | 91 vérif. / 0 issue | **91 / 0** |
| `npm run test:hub` | OK | **OK, 0 erreur console** |
| Sonde DOM : débordement interne, libellés coupés, texte tronqué | non outillé | **0 sur 8 vues × 4 largeurs** |

### Hiérarchie des titres — un seul `h1` par vue (mesuré au DOM)

| Vue | `h1` | suite |
|---|---|---|
| Accueil | Vue d'ensemble | `h2` de zone (État de l'Academy, À traiter, Facturation, Prochaine cohorte, Activité récente) |
| Inscriptions | Inscriptions | — |
| Apprenants | Apprenants | `h2` Outils — import & invitations |
| Fiche 360° | Awa Diallo | `h2` Inscription, Compte Hoja, Facturation, Google Classroom, Formation & progression, Historique |
| Programme | Programme | — |
| Module | M01 Comprendre l'IA | `h4` des 6 sections |
| Classroom | Google Classroom | `h2` État de la passerelle |
| Formateurs | Formateurs | `h2` Comptes existants |

### Densité des tableaux

- Desktop : ligne à **69 px** (en-tête 43 px) — Inscriptions et Apprenants.
- Mobile ≤ 639 px : bascule en cartes, **248–267 px** par apprenant, libellés repris par `td::before`.

### Défauts réels corrigés au passage (trouvés par la mesure, pas par lecture du code)

1. `Invalid Date` dans la fiche 360° — l'API renvoie `{year,month,day}`, `new Date(objet)` ne lève
   pas mais produit une date invalide.
2. `$\rightarrow$` affiché littéralement dans le cours (LaTeX non résolu).
3. Schéma ASCII du module détruit par `white-space:pre-wrap` + `overflow-wrap:anywhere`.
4. `a.stat` : le token `--input-bg` était **auto-référent** (`var(--input-bg)`) → invalide.
5. `--line-2` (token de **bordure**) utilisé comme couleur de **texte** sur le séparateur du fil
   d'Ariane → 1,6:1, 30 cas relevés par l'audit.
6. Lien de nom d'apprenant à **33 px** de haut ; la cible devient la cellule d'identité entière
   (avatar + nom + email) à ≥ 44 px.
7. Fil d'Ariane écrasé à une lettre (« Cockpit / **A** ») à 390 px.
8. Sommaire de fiche à 2 colonnes : chaque entrée tombait à ~263 px et les titres français
   passaient sur 3 lignes → une colonne + gouttière de numérotation.

### Incident d'outillage — à retenir

`capture_ui.js` n'activait le mock que sur `USE_MOCK=1`. Sans ce drapeau il ne servait que des
fichiers statiques : `/api/me` renvoyait 404, le cockpit **redirigeait vers `/ui/login/`**, et les
45 captures produites montraient l'écran de connexion. Elles ont été prises pour le cockpit.

Correctifs apportés à l'outil :
- le mock est **actif par défaut** (`USE_MOCK=0` pour le désactiver) ;
- toute capture dont la page servie n'est pas la vue demandée est **refusée** (code de sortie 1)
  au lieu d'être écrite ;
- l'URL exacte des ressources en erreur est affichée (Chrome ne la met pas dans le message) ;
- le filtre de surfaces est un filtre par **préfixe** (`… cockpit` capture tout le cockpit).

Deux autres garde-fous rencontrés : `rm -rf` sur un dossier de plus de 50 fichiers est bloqué
(`SAFE_DELETE_BULK_CONFIRM_REQUIRED`) → écraser en place ; et **deux `Edit` parallèles sur un même
fichier se perdent** (le dernier écrivain écrase l'autre) → une édition à la fois, puis vérifier.

### Dette identifiée, hors périmètre de ce chantier

- `ui/campus/index.html` et `ui/cockpit/modules/NN/index.html` (18 fichiers) utilisent une palette
  légèrement différente (`--text:#f1f5f9`, `--muted:#94a3b8`) de celle du cockpit
  (`#e8eef7`, `#93a2b8`). D'où 14 couleurs de texte distinctes au niveau du dépôt au lieu de 12.
  **Non touché volontairement** : « ne refais pas toute l'application en une fois ».
- `prompt()` / `confirm()` natifs subsistent pour le montant et le motif de refus (pas de système
  de modale) — signalé, non résolu.

