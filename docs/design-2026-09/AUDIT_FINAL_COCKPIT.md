# AUDIT FINAL — COCKPIT, CLASSROOM, ESPACE FORMATEUR

**Date** : 17 septembre 2026 · **Périmètre** : `ui/cockpit/`, `ui/suivi/`, `ui/campus/`, `ui/login/`,
18 modules générés · **Méthode** : mesure du DOM construit, jamais la lecture de la source.

---

## 1. Ce qui a réellement changé à l'écran

### 1.1 Fondations, Accueil, Inscriptions, Apprenants — `010b141`

Déjà livré et validé. Pour mémoire : jetons de surface à 4 niveaux avec profondeur par **filet
interne** au lieu d'ombres portées · contenu élargi de 1040 à 1320 px · grille de tableau de bord
à 2 colonnes découplées au-delà de 1200 px · KPI traités comme des données principales, sans
icône décorative · centre d'action limité aux tâches réellement ouvertes · vraies tables avec
filtres à compteurs et **une** action primaire par ligne · un seul `h1` par vue.

### 1.2 Fiche apprenant 360° — `9843aa5`

| Avant | Après |
|---|---|
| Grille `1fr 1fr` : « Inscription » (une phrase) **étirée** à côté de « Compte Hoja », grand vide sous la carte courte | Deux colonnes **flex découplées** : la substance à gauche, l'état administratif à droite |
| Progression noyée dans une ligne de tableau clé/valeur | Progression en **donnée principale** : `n / 18 modules validés`, pourcentage, barre de progression |
| Téléphone d'un apprenant importé **invisible** dans la fiche, alors qu'il s'affiche dans la liste | Carte **Coordonnées** (e-mail, téléphone, origine du compte) |
| « Tarif non configuré » répété deux fois de suite | Énoncé **une seule fois** ; « Montant attendu » n'apparaît que si un prix existe |
| Fiche candidat : moitié gauche vide | Carte d'admission placée **selon l'acteur** (candidat → colonne principale, apprenant → rail) |

État nouveau ajouté à la couverture de test : **fiche candidat** (`#apprenants/p/MOCK1`), qui n'est
pas un cas de bord mais un état à part entière.

### 1.3 Classroom — `bc4a3cd`

L'écran était une **liste de paires clé/valeur** où « 0 invitation en cours » pesait autant que
« passerelle non connectée », et où le détail des devoirs vivait dans un `<details>` **imbriqué
dans une cellule de tableau**.

Désormais : 4 KPI (Passerelle · Dans la classe · Invitations · Devoirs publiés) · table des devoirs
avec **taux de rendu réels** agrégés depuis `/api/progress` · table des rendus par apprenant ·
carte **Connexion** en rail (état, compte Google, autorisations, erreur).

Deux bugs de fond corrigés au passage :
- `PROGRESS` **est** le tableau de lignes (`r.data.rows`), pas l'enveloppe → les agrégations
  lisaient `undefined` ;
- `loadProgress()` n'était appelé que pour l'onglet Apprenants : la table « Rendus par apprenant »
  restait **éternellement sur son squelette**.

### 1.4 Espace formateur — `a83434d`

**Défaut mesuré, invisible à la lecture de la source.** `#skel` et `#mobile` portent
`class="cards"`, et `.cards{display:flex}` **écrase** le `[hidden]{display:none}` de la feuille du
navigateur — les styles d'auteur priment sur les styles utilisateur. Conséquences réelles,
constatées en capture :

- le **squelette de chargement** (68 px) restait affiché **après** le rendu, aux 4 largeurs ;
- la carte mobile d'Awa Diallo s'affichait **sous** la matrice à 1366 px — **le même apprenant
  rendu deux fois** sur le même écran.

| Avant | Après |
|---|---|
| Aucune action hors de la feuille modale : impossible de rafraîchir sans ouvrir un apprenant | En-tête de page avec **Rafraîchir** et **Cockpit** |
| Rangée de `<b>` teal sans hiérarchie, carte « En retard » qui apparaît/disparaît | **KPI en cartes** : libellé capitalisé + valeur tabulaire, couleur sémantique seulement quand elle signifie quelque chose |
| Filtres sans volume | Filtres portant le **nombre** de chaque filtre, calculé par les **mêmes prédicats** que le filtre |
| `<h1>` 28 px, **aucun** `h2` dans le corps | `h1` 22 px + `h2.zone` « Cohorte » avec compteur |
| État vide en texte centré, sans action | `.estate` avec icône SVG et **action réelle** (« Voir toute la cohorte », « Ouvrir le cockpit ») |
| Feuille modale : liste plate de missions | **Progression réelle** de l'apprenant (`1 / 3 validés · 33 %` + barre) |
| `tr.row` cliquable — **inatteignable au clavier** | Bouton de nom natif + piège de focus, `aria-labelledby`, verrouillage du défilement |
| Palette divergente | Jetons du cockpit |

**Logique métier vérifiée intacte par diff** : `api()`, `fillSubmissionSelect()`, le gestionnaire
`POST /api/feedback` (validation du barème, messages d'erreur), `LABEL`/`CLS`/`fmtDate`, `short()`
— tous identiques au caractère près. Le seul écart : le bouton « Réessayer » n'est plus un
`onclick` inline.

### 1.5 Palette — une seule charte — `c8af032`

Deux chartes coexistaient : `--text #e8eef7` / `--card #131a29` côté cockpit, `#f1f5f9` / `#111726`
côté campus, modules et login. **Le produit changeait de couleur d'un écran à l'autre.**

**94 fichiers alignés**, source corrigée (`scripts/presentation_template.js` pour les 18 modules,
+ `ui/campus`, `ui/login`, `ui/suivi`). Contrastes mesurés avant/après :

| Paire | Avant | Après | Verdict |
|---|---|---|---|
| `--text` sur `--card` | 16,32 | 14,91 | AA ok |
| `--text` sur `--card-2` | 16,91 | 15,92 | AA ok |
| `--muted` sur `--bg` | 7,58 | 7,50 | AA ok |
| `--muted` sur `--card` | 6,97 | 6,71 | AA ok |
| `--muted-dark` sur `--card` | 5,16 | **4,26** | sous AA — mais **jamais appliqué** |

`--muted-dark` n'est utilisé nulle part dans le template et seulement par `.st-na`, une règle
**jamais appliquée** dans le campus. Aucun texte réel n'est concerné.

---

## 2. Écrans restant à améliorer

Mesuré, pas supposé.

### 2.1 `#formateurs` du cockpit — encore mince
À 1366 px : `doc = 906 px` pour une carte de **350 px** et un état vide de **203 px**. L'écran a
gagné un en-tête de page et un état vide propre (passe précédente) mais reste **une liste de
comptes**. La vraie surface formateur est `/ui/suivi/`, refondue au Lot 6 ; `#formateurs` n'est
qu'un renvoi. **À arbitrer** : soit l'assumer comme renvoi et l'alléger encore, soit y rapatrier
des données de charge (formateurs, cohortes assignées, volumes).

### 2.2 `#programme` — aucun `h2`
À 1366 px : `h1` seul, puis un bloc anonyme de **1086 px**. Aucune structure de titre
intermédiaire. La vue fonctionne, mais un lecteur d'écran n'a aucune carte du plan.

### 2.3 Workspace module — saut `h1` → `h4`
À 1366 px : `H1(20) "M01 Comprendre l'IA"` puis directement `H4(14)` × 6. **Aucun `H2` ni `H3`.**
La hiérarchie vient du Markdown pédagogique (`####`), que le cockpit ne remonte pas. Critère Tbag
« H1/H2/H3 réel » **non satisfait** sur cette vue.

### 2.4 Les 18 pages de modules — palette seule
L'harmonisation a aligné leurs **jetons**. Leur **composition** n'a pas été refondue : la marque
vectorielle reste un tracé OPAYS recolorié, et la densité des diapositives n'a pas été revue.

### 2.5 Cockpit — modales natives
`prompt()` / `confirm()` du navigateur pour le montant du paiement et le motif de refus. Signalé
depuis le premier audit, toujours en place.

---

## 3. Tests

Tous exécutés le 17/09 après le dernier commit.

| Suite | Résultat |
|---|---|
| `audit:ui` (9 surfaces × 5 largeurs) | **0** cible < 44 px · **0** échec de contraste · **0** débordement · **0** erreur console |
| `npm test` (`test_coherence` + `verify_all_presentations`) | **92 vérifications, 0 issue** · **18/18 modules** validés |
| `test:hub` | erreurs console : **aucune** |
| `test:public` | **72 / 0** — « version publique opérationnelle, aucune trace formateur » |
| `test:identity` | **OK** (rôles, sessions, brute-force, authz, gates) |
| `test:formateur` | **21 / 0** |
| `test:admin` | **16 / 0** — « espace admin buildé opérationnel » |
| `test:parcours` | **13 / 0** |
| `test:e2e` | **63 / 63** |
| `test:site` | **21 / 21** |

**Sondes de composition** — `probe_cockpit.js`, 9 vues × 4 largeurs (390/430/820/1366) :
aucun débordement, aucun libellé coupé, aucun texte tronqué par ellipse, **aucun élément `hidden`
encore affiché**.
**Sonde d'états** — `probe_suivi_etats.js`, 5 états × 2 largeurs : **10/10** atteints (filtre
actif, filtre sans résultat, cohorte vide, feuille modale, écran au repos).

### Outillage ajouté pendant ces lots
- `probe_cockpit.js` : vue `suivi`, sélecteurs tolérants, rôle par surface, et le contrôle
  **`hiddenVisible`** — c'est lui qui a trouvé le défaut du §1.4.
- **`probe_suivi_etats.js`** (nouveau) : une sonde qui mesure l'écran au repos ne dit rien des
  états qui n'existent qu'après une interaction — précisément ceux qu'on casse sans le voir.
- `capture_ui.js` : surface `module-presente` (page de module générée).
- `test_coherence.js` : section **7 bis — palette transversale entre surfaces**, qui compare les
  valeurs réelles des jetons d'une surface à l'autre.

---

## 4. Commits

| Commit | Objet |
|---|---|
| `010b141` | Refonte cockpit — lots 0 à 3 (fondations, Accueil, Inscriptions, Apprenants) |
| `9843aa5` | **Lot 4** — fiche apprenant 360° |
| `bc4a3cd` | **Lot 5** — écran Classroom |
| `a83434d` | **Lot 6** — espace formateur |
| `c8af032` | **Harmonisation de palette** — une seule charte sur les 94 fichiers |

Tous poussés sur `origin/main`, refs vérifiées (`git branch -vv` sans `: gone`).

---

## 5. Dettes restantes

### Dette d'arbitrage — appartient à Tbag, aucune solution technique
1. **67 mentions « OPAYS »** dans le contenu pédagogique des 18 modules. Les corriger **change le
   cours** : décision éditoriale.
2. **Marque vectorielle des modules** : c'est un tracé OPAYS recoloré, pas le logo Hoja. Les
   fichiers sont autonomes (`file:///`) → une image externe casserait le rendu.
3. **5 valeurs de texte legacy** posées sur des fonds image ou dégradé — non mesurables
   automatiquement. Méthode prête : `scripts/measure_contrast_on_image.js`.

### Dette technique résiduelle
4. `prompt()` / `confirm()` natifs du cockpit (§2.5).
5. `#programme` sans `h2` et workspace module sans `H2`/`H3` (§2.2, §2.3).
6. `#formateurs` toujours mince (§2.1) — nécessite un arbitrage de périmètre avant d'agir.

### Points de méthode à retenir
7. **`hidden` est neutralisé par une règle d'auteur `display:flex`.** Aucun autre contrôle ne le
   voit. Corrigé par `[hidden]{display:none!important}` + contrôle permanent dans la sonde.
8. **Un test peut encoder une ancienne valeur de charte.** `test_coherence.js` assertait
   `--card: #111726` : après harmonisation, 18 modules déclarés « incohérents ». Un test qui fige
   une valeur de design doit être changé **dans le même commit** que la charte.
9. **Une transformation de masse se rejoue sur la chaîne complète.** Rejouer
   `build:presentations` seul a **réintroduit la marque OPAYS** (`fill="#0066FF"`, portée par les
   données sources) dans 15 modules — c'est `hoja_modules_identity.js` qui la remplace.
   **Ordre réel :** `build:presentations` → **`hoja_modules_identity.js`** → `build:cockpit` →
   `build:admin` → `build:public`. Les modules **01, 16 et 18** échappent à la régénération
   (01 = référence validée, 16/18 = `PROTECTED_MODULES`) ; c'est le nettoyeur, qui injecte le CSS
   **du template** dans les 18, qui les aligne.
10. **Un outil de capture exige son dossier de sortie en 1ᵉʳ argument.** L'omettre crée un dossier
    parasite à la racine du dépôt.
