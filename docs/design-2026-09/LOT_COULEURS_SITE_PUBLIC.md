# LOT DÉDIÉ — LES COULEURS DE TEXTE DU SITE PUBLIC

**Date :** 17 septembre 2026
**Périmètre :** `hoja-site/src/` (Next.js 15) — 15 pages, 1 127 nœuds de texte
**Statut :** terminé et vérifié
**Consigne appliquée :** « ne change pas les couleurs simplement pour uniformiser : vérifie
leur fonction, leur contraste et leur contexte avant chaque remplacement. »

---

## 1. L'instrument d'abord

Le contrôle P7 annonçait « 26 couleurs de texte distinctes ». Un compteur ne suffit pas : il
ne dit pas si une valeur est un **doublon** d'une autre ou une **couleur porteuse de sens**.
J'ai donc écrit `scripts/inventory_site_text_colors.js` (`npm run inventaire:couleurs`) qui,
pour chaque couleur réellement rendue, associe :

- sa **fonction** (tag, classes, extrait de texte),
- son **contexte** (fond perçu),
- le **contraste WCAG mesuré**, seuil ajusté selon la taille (grand texte ou non).

### Deux pièges de mesure, tous deux rencontrés

| Piège | Conséquence | Traitement |
|---|---|---|
| **Fonds semi-transparents** | Un texte sur `rgba(...)` comparé au fond opaque sous-jacent produit un faux contraste | Composition alpha de toute la pile d'ancêtres |
| **Fond porté par une image ou un dégradé** | La couleur n'est pas mesurable depuis `backgroundColor` → faux « blanc sur blanc » | Détection de `background-image` **sur les ancêtres ET sur leurs `::before`/`::after`** ; le nœud est marqué « non mesurable », jamais « en échec » |

**32 faux « blanc sur blanc » ont été produits avant correction de l'instrument.** Vérification
par capture du héros de l'accueil : le fond est un **dégradé sombre posé en calque frère**
(un élément positionné, pas un ancêtre). Le texte blanc est parfaitement lisible.

> **Leçon : un instrument qui ne sait pas dire « je ne peux pas mesurer » fabrique des
> défauts. Les 32 cas signalés étaient tous des faux positifs — les « corriger » aurait
> dégradé un site conforme.**

---

## 2. Inventaire : 17 couleurs, classées par fonction

| Couleur | Occ. | Contraste min | Fonction identifiée | Verdict |
|---|---|---|---|---|
| `#0C1B24` `--color-001` | 530 | 5,81:1 | Texte principal sur fond clair + texte sur bouton vert | Canonique |
| `#FFFFFF` | 423 | — | Texte sur fond sombre ou image | Canonique |
| `#17805F` `--primary-text` | 36 | 4,90:1 | Vert de marque en texte sur fond clair | Canonique |
| `#495255` `--muted-foreground` | 34 | 7,42:1 | Texte secondaire sur fond clair | Canonique |
| `#333333` `--foreground` | 19 | 12,63:1 | Corps de texte | Canonique |
| `#4A4A4A` `--color-010` | 16 | 8,35:1 | Texte courant secondaire | **Doublon** |
| `#21A87D` `--primary` | 15 | 3,02:1 | Titres — mais aussi du texte à 18 px | **Violation de règle** |
| `#000000` `--color-007` | 14 | 6,96:1 | Emphase + texte sur bouton vert | **Doublon** |
| `#C0BDBD` `--color-012` | 10 | n/a | Texte clair sur fond image | Non mesurable |
| `#124F72` `--accent` | 8 | 8,15:1 | Titres d'accent | Canonique |
| `#10242F` `--color-016` | 6 | 15,03:1 | Quasi-noir bleuté sur clair | **Doublon** |
| `#1F2124` `--color-003` | 6 | 11,79:1 | Quasi-noir (intitulés d'accordéon) | **Doublon** |
| `#94A3B8` `--muted-on-dark` | 4 | 6,84:1 | Texte atténué sur fond sombre | Canonique |
| `#BCD2DE` `--color-029` | 3 | 11,20:1 | Texte clair sur fond sombre | Non mesurable |
| `#C8DAE4` `--color-008` | 1 | 13,82:1 | Page 404 | Non mesurable |
| **`#959595` `--color-045`** | 1 | **2,86:1** | Ligne descriptive sur `#f8fafc` | **ÉCHEC AA** |
| `#D9D9D9` `--color-013` | 1 | n/a | Texte clair sur fond image | Non mesurable |

---

## 3. Corrections appliquées — 30 remplacements, 7 fichiers

### 3.1 L'échec AA (obligatoire)

`text-color-045` (`#959595`) sur `#f8fafc` = **2,86:1**. Seuil AA : 4,5:1.
Contexte : `entreprises/page.tsx:858`, ligne descriptive centrée en `text-[1rem]`.
→ **`text-muted`** (`#617175`, **5,09:1**). Fonction : texte secondaire. ✅

### 3.2 Le vert de marque en texte sous le seuil « grand texte »

`#21A87D` ne donne que **3,02:1** sur blanc et **3,58:1** sur fond sombre. Le design system
(§2.2.1) le réserve aux **fonds de boutons et aux grands titres** (≥ 24 px, ou ≥ 19 px gras).

**6 éléments à 18 px l'utilisaient en texte** :

| Emplacement | Élément | Fond |
|---|---|---|
| `app/page.tsx` (× 4) | `h2` 18 px **gras** — « CRÉER AVEC L'IA », « DÉPLOYER SUR DES PROJETS RÉELS », « DOMINER +60 OUTILS & MÉTHODES », « ROBOTIQUE & IA POUR LA RECHERCHE » | `#0C1B24` (sombre) |
| `app/contact/page.tsx` | `h3` 18 px — « Vous avez une question ? » | image sombre |
| `app/formations/programme-intensif/page.tsx` | `p` 18 px — « PROGRAMME INTENSIF d'IA GÉNÉRATIVE » | image sombre |

18 px gras reste **sous** le seuil WCAG du grand texte (18,66 px). Les six cas échouaient donc.
→ **`text-primary-text-dark`** (`#34D399`, **9,12:1**). Les six sont sur fond sombre, la
correction est donc valable à tous les points de rupture.

Les **9 occurrences restantes** de `text-primary` sont des titres de 28 ou 48 px → conformes,
inchangées.

### 3.3 Consolidation des quasi-noirs — 5 jetons → 1

Le site portait **six valeurs de « texte sombre sur fond clair »** :

| Jeton | Valeur | Contraste sur blanc | Remplacement | Contraste obtenu |
|---|---|---|---|---|
| `--color-001` | `#0C1B24` | 15,9:1 | *(référence, conservé)* | — |
| `--color-003` | `#1F2124` | 11,79:1 | `text-color-001` | 15,9:1 |
| `--color-006` | `#1B1B1B` | 12,5:1 | `text-color-001` | 15,9:1 |
| `--color-007` | `#000000` | 21:1 | `text-color-001` | 15,9:1 · **5,81:1 sur bouton vert** (AA ✅) |
| `--color-016` | `#10242F` | 15,03:1 | `text-color-001` | 15,9:1 |

**Le contraste est conservé ou amélioré dans les cinq cas**, y compris sur le bouton vert où
`#0C1B24` donne 5,81:1 (documenté au §2.2.1) contre 7,7:1 pour le noir pur — AA dans les deux cas.

### 3.4 Le gris secondaire

`--color-010` (`#4A4A4A`, 8,35:1) servait de « texte courant secondaire » sur 7 emplacements
(`li`, `p`, `text-[0.875rem]`). Fonction identique à `--muted-foreground`, valeur quasi
identique (écart imperceptible).
→ **`text-muted-foreground`** (`#495255`, **7,42:1**). AA ✅

---

## 4. Ce qui n'a PAS été touché — et pourquoi

**5 valeurs claires sur fond sombre** : `#C0BDBD` (10), `#BCD2DE` (3), `#C8DAE4` (1),
`#D9D9D9` (1) et `rgba(255,255,255,.65)` (85).

Elles sont posées sur des **fonds image ou dégradé**. L'instrument ne peut pas mesurer leur
contraste, et la vérification visuelle montre des textes lisibles sur les héros sombres.

**Décision : ne pas y toucher.** Remplacer une couleur sans pouvoir mesurer l'effet serait
exactement l'uniformisation à l'aveugle que la consigne interdit. Elles restent documentées
comme dette de finition, avec la méthode pour les traiter (échantillonnage des pixels de
capture, hors styles calculés).

---

## 5. Résultat mesuré

| Contrôle | Avant | Après |
|---|---|---|
| **Couleurs de texte distinctes** | **17** | **14** |
| **Échecs AA mesurables** | **1** (`#959595`) | **0** |
| Vert de marque en texte sous le seuil | 6 éléments | **0** |
| Jetons de texte sombre quasi identiques | 6 | **1** |
| `npm run test:site` | 18/18 | **20/20** |

**Répartition finale des 14 couleurs :**

- **9 couleurs sémantiques** : `--color-001`, blanc, `--muted-foreground`, `--primary-text`,
  `--foreground`, `--primary`, `--accent`, `--primary-text-dark`, `--muted-on-dark`.
- **5 valeurs legacy** claires sur fond sombre, non mesurables (16 occurrences au total).

---

## 6. Garde-fous ajoutés

`npm run test:site` passe de 18 à **20 contrôles** :

| Contrôle | Ce qu'il empêche |
|---|---|
| `aucun text-primary sous le seuil grand texte (< 24 px)` | La réapparition du vert de marque en petit texte (3,02:1) |
| `jetons de texte legacy consolidés (palette sémantique)` | Le retour de `text-color-003/006/007/010/016/045` |

Ils complètent `aucun texte blanc sur fond bg-primary`, déjà présent.

---

## 7. Outillage produit

| Commande | Rôle |
|---|---|
| `node scripts/inventory_site_text_colors.js` | Inventaire couleur par couleur : fonction, contexte, contraste, seuil adapté à la taille. `--width` pour un autre point de rupture, `--json` pour la sortie machine. |

**Limite connue, documentée dans le code** : un fond porté par un **calque frère** (élément
positionné, `<video>`, `<canvas>`) n'est pas visible depuis la chaîne d'ancêtres. Les cas
correspondants sont marqués « à vérifier visuellement », jamais « en échec ».
