# LOT B — Résidus du clone : `ditto.css`, `data-ditto-id`, `ditto-meta.ts`, `DittoWire`

**Date :** 16 septembre 2026
**Consigne appliquée :** *« ne supprime rien simplement parce que le nom semble être un
résidu »* — chaque élément a été cartographié avant décision, et `DittoWire`, annoncé
comme porteur sur 9 routes, s'est révélé **mort**.

---

## 1. Ce qu'est le système « ditto »

Le site public est issu d'un clone (outil *ditto.site*) d'un site espagnol. Le clone a
laissé **un système cohérent**, pas des déchets épars :

```
data-ditto-id="X"          ancrage DOM stable, posé sur 186 nœuds
        │
        ├── ditto.css (8)   états :hover / :focus / :transition par route
        │                   + la base typographique .cn0 portée par <body>
        │
        ├── ditto-meta.ts   noms d'ancres fournis aux composants
        │                   (data-ditto-id={meta[0]?.anchor})
        │
        └── DittoWire.tsx   rejouait les interactions capturées en appliquant
                            des styles inline sur les nœuds trouvés par ancre
```

---

## 2. `DittoWire` — annoncé porteur, en réalité mort

**Rôle déclaré :** reproduire les interactions capturées (onglets, accordéon, carrousel,
menu déroulant) en togglant des styles inline sur les nœuds `data-ditto-id`.

**Ce que la vérification a montré :**

| Contrôle | Résultat |
|---|---|
| Occurrences de `DittoWire` par fichier | **1** — uniquement la ligne `import` |
| Rendu JSX (`<DittoWire … />`) | **aucun**, sur aucune des 9 routes |
| Présence dans le bundle de production | `applyDesc`, marqueur unique du composant, est absent de **tous** les chunks JS (`0` chunk sur `out/_next/static/chunks/`) |

Le composant n'était donc **jamais instancié** : le *tree-shaking* l'éliminait
intégralement. Les 9 imports étaient des imports morts.

**Pourquoi ce n'était pas visible :** les interactions réelles sont assurées par de
**vrais composants clients React**, écrits après coup — `sections/navbar.tsx`
(mega-menu, `role="tab"`), `components/why-hoja-carousel.tsx` (carrousel à état),
`formations/programme-intensif/components/media-tile2.tsx` (accordéon `<details>`),
`components/mailto-forms.tsx` (formulaires). `DittoWire` était la première tentative,
restée branchée sur rien.

**Action : suppression** de `DittoWire.tsx` (144 lignes) et de ses **8 imports morts**.

---

## 3. `data-ditto-id` — porteur, conservé

**Rôle réel :** contrat d'ancrage consommé par le **CSS** — états `:hover`, `:focus`,
`:transition`. C'est ce qui donne au site son retour visuel au survol.

**Décision : conservé, non renommé.** Arguments :

- l'attribut est référencé **1 400+ fois** (source + CSS) ; un renommage serait un
  changement mécanique massif pour **zéro gain fonctionnel** ;
- il est ciblé par des sélecteurs dont certains sont fragiles (révélation du mega-menu) ;
- le préfixe `ditto` porte une **information utile** : il signale une provenance
  (généré par l'outil de clone) et non un token de design écrit à la main. Le renommer
  effacerait cette traçabilité.

**Ce qui a été nettoyé à la place :**

| Mesure | Avant | Après |
|---|---|---|
| Occurrences de `data-ditto-id` dans la source | 1 147 | **361** (−69 %) |
| Ancres ciblées par du CSS mais **absentes du DOM** | 48 | **0** |
| Ancres présentes dans le DOM mais **ciblées par rien** | 115 inertes | **115 inertes** (inchangé — voir §6) |

---

## 4. `ditto.css` — porteur, conservé et dédupliqué

**Rôle réel :** deux choses, dont une seule est légitime.

1. **États d'interaction par route** — légitime et porteur.
2. **`.cn0`** — la base typographique du `<body>` (`font-family`, `font-size`,
   `line-height`, couleurs). **Dupliquée à l'identique dans les 8 fichiers.**
   C'était un vrai défaut de maintenance : toute évolution du corps de texte devait
   être répercutée 8 fois.

**Actions :**

- `.cn0` **sorti des 8 `ditto.css`** et déclaré **une seule fois** dans `globals.css`,
  avec un commentaire expliquant sa provenance.
- **Tous les sélecteurs morts supprimés** — dont la **totalité du bloc de révélation du
  mega-menu de l'en-tête** (`[data-ditto-id="style-header"]:hover [data-ditto-id="…"]`,
  31 règles), qui ciblait des ancres n'existant plus : le menu est désormais géré par
  `sections/navbar.tsx`.

| Mesure | Avant | Après |
|---|---|---|
| Lignes totales des 8 `ditto.css` | ~396 | **145** (−63 %) |
| Fichiers déclarant `.cn0` | 8 | **1** (`globals.css`) |
| Sélecteurs morts dans le CSS construit | 48 | **0** |

---

## 5. `ditto-meta.ts` — porteur, réduit au type

**Rôle réel :** fournir les **noms** d'ancres aux composants.
`data-ditto-id={meta[0]?.anchor}`.

**Dépendances cartographiées :**

- **20 imports de type** (`import type { DittoNodeMetaMap }`) → effacés à la compilation ;
- **1 seul import de valeur** : `sections/footer.tsx`.

**Découverte :** sur les 6 tables exportées, **4 ne sont importées par personne**
(`ListRow_meta`, `ListRow2_meta`, `MediaCard_meta`, `ListRow_meta2`). Chaque page déclare
localement ses propres tableaux. Ces 4 exports étaient donc des données mortes, et leurs
ancres ne pouvaient **jamais** atteindre le DOM — ce qui rendait mortes les règles CSS
qui les ciblaient.

**Actions :**
- suppression des 4 exports morts ;
- suppression de l'import mort `ListRow_meta2` dans `footer.tsx` ;
- en-tête explicatif ajouté (rôle du contrat d'ancrage, raison de la suppression des
  tables) ;
- `47 → 31 lignes`.

---

## 6. Point d'honnêteté — ce qui reste

**115 ancres `data-ditto-id` sont présentes dans le DOM mais ciblées par aucun CSS.**
Elles proviennent des tableaux de méta locaux aux pages (transmis en `meta` aux
composants), pas des attributs littéraux — les retirer demande de toucher à la
signature des composants et à leurs appelants.

Elles sont **inertes** : aucun CSS ne les référence, `DittoWire` n'existe plus. Elles
n'ont **aucun effet sur le rendu**. Les supprimer est un travail de finition, pas un
correctif. **Non fait, volontairement** : le rapport bénéfice/risque ne le justifie pas
à ce stade, et la consigne était de ne pas supprimer pour supprimer.

---

## 7. Preuve de non-régression

La comparaison porte sur le **HTML réellement construit**, pas sur le code source —
c'est la seule mesure fiable, car une ancre déclarée dans le code peut ne jamais
atteindre le DOM.

| Contrôle | Résultat |
|---|---|
| **DOM rendu, 15 pages** (payload RSC neutralisé) | **15 / 15 identiques** |
| **Hauteurs de page, 5 pages × 5 largeurs** | **25 / 25 identiques** (au pixel) |
| `npm run build:site` | **OK** — 150 fichiers |
| `npm run test:site` | **18/18** |
| `npm test` | **PASS** |
| `npm run audit:design` | **0 / 0 / 0** — 9 tailles, 1 famille |

> Note de méthode : la comparaison par **md5 des captures PNG n'est pas valable** sur ce
> site — les héros vidéo produisent des images différentes d'une capture à l'autre
> (8 écarts sur 25 entre deux captures du *même* build). La comparaison porte donc sur le
> **DOM** (déterministe) et sur les **hauteurs** de page.

---

## 8. Outillage créé

| Script | Rôle |
|---|---|
| `scripts/analyze_ditto.js` | Cartographie ancres DOM ↔ CSS + **contrôle de réalité sur le HTML construit** |
| `scripts/clean_ditto.js` | Suppression des règles mortes, ancres orphelines, `.cn0` dupliqué (`--dry`) |

`npm run ditto:analyze` · `ditto:clean`

**Deux pièges rencontrés, documentés dans le code :**
1. Ne jamais découper une règle CSS sur les virgules : `rgb(172, 170, 170)` en contient.
   Seule la **partie sélecteur** (avant `{`) se découpe.
2. Ne pas déduire le DOM du **code source** : `anchor:` déclaré mais jamais importé ⇒
   l'ancre n'existe pas. Le build fait foi.
