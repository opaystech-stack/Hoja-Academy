# Audit PH2 — PARCOURS FORMATEUR (Hoja / Académie OPAYS)

> Périmètre : `admin/` (hub, dashboard, classroom, data), `scripts/build_admin.js`,
> `scripts/build_public.js`, `scripts/test_parcours_formateur.js`, `public/` (contrôle
> de cloisonnement), `docs/operations/`, `systeme-operationnel/03/06/07`.
> Méthode : lecture seule des fichiers du dépôt. Aucune donnée inventée ; chaque
> constat cite le fichier source. Vérifications live (Basic Auth, versions
> complète/sanitisée) faites par l'orchestrateur et rappelées en §6.

---

## 1. Verdict en une phrase

Le parcours formateur est **réellement fonctionnel pour PRÉPARER ET CONDUIRE une
séance** (8 rubriques sur 8 auditées, dont 5 alimentées par de vraies données
centralisées), mais il est **aveugle sur l'après-séance** : la progression des
apprenants, le suivi des livrables et l'évaluation n'existent dans **aucun fichier
admin** — ce sont des process documentés (markdown + CSV template + Classroom) que
le dashboard ne lit ni n'écrit nulle part.

---

## 2. Les 8 rubriques, auditées une par une

| # | Rubrique | Existe ? | Source réelle des données | Détail |
|---|---|---|---|---|
| 1 | **Progression des apprenants** | ❌ **Nulle part dans admin/** | — | Le dashboard affiche une « Progression de la séance » (`admin/formateur-dashboard.html:157-164`) qui est un **timer de session** (elapsed/durée du module), pas une progression d'apprenants. Zéro occurrence de « apprenant », « étudiant », « jalon », « livrable soumis », « dépôt » dans `admin/index.html` et `admin/formateur-dashboard.html`. `admin/classroom.html` liste uniquement **noms+emails** des inscrits (via `/api/classroom/students`), sans état d'avancement. Aucun `localStorage`/état persisté dans les pages admin. |
| 2 | **Missions** | ✅ **Réelles, data-driven** | `admin/data/modules.js` → champ `mission` (18/18 modules, vérifié par script node sur le registre) | Affichées dans le panneau « 📝 Mission à donner » (`formateur-dashboard.html:172-175`, `loadModule()` l.329). Ex. M01 : « Tester 3 tâches professionnelles sur 2 modèles IA différents. Déposer le comparatif sur Classroom avant lundi 23h59. ». **Pas hardcodé dans le HTML** — hub et dashboard consomment `OPAYS_MODULES` (via `data/modules.js` que `build_admin.js:68` copie depuis `data/`). |
| 3 | **Livrables** | ⚠️ **Uniquement du texte** | Même champ `mission` + `workKit` (18/18), plus `systeme-operationnel/03` (matrice des 8 jalons) et `07` (7 missions, livrables exigés) | Le livrable attendu est décrit dans la phrase de mission et le volet Work Kit (`workKitBtn` → `admin/work-kit/TEMPLATE_MON_AI_WORK_KIT.md`). **Aucun objet « livrable/soumission » nulle part** : pas de liste de dépôts, pas de statut reçu/relu/noté, pas d'échéance structurée (le « lundi 23h59 » est du texte libre). |
| 4 | **Suivi** | ❌ **Manuel, hors admin** | `docs/cohortes/SUIVI_COHORTE_TEMPLATE.csv` (2 lignes : en-tête + « Exemple Apprenant », i.e. **template vide de vraies données**) | Le flux de suivi est documenté : `GUIDE_LANCER_COHORTE.md` §11 « Corriger dans Classroom… Noter le jalon dans le tableur de suivi », `PILOTE_INTERNE.md` §3 « formateur note le jalon 1 dans le tableur », `06_SYSTEME_ACCOMPAGNEMENT_COACHING.md` §11.5 « un seul fichier Google Sheets partagé ». **Mais** : le CSV n'est référencé par **aucune page admin** (grep : uniquement docs/), et le gateway (`deploy/classroom-gateway/server.js`) n'expose **aucun endpoint GET coursework/studentSubmissions** (routes : status, courses, students, topics POST, coursework POST, gmail, calendar, forms). Le maillon « relevé automatique des dépôts » n'existe pas. |
| 5 | **Ressources** | ✅ **Réelles** | Présentations complètes buildées (`build_admin.js:36-50`), fiches `data/modules.js` (slides, prompts, durationLabel) | Hub = entrée admin (`admin/index.html`, buildé depuis `course-hub.html`), cartes par module avec objectif/durée/slides/prompts, boutons « ▶ Lancer le cours » et « 📝 Notes formateur », accès Classroom (`admin/classroom.html`), Meet/Classroom conditionnels via `OPAYS_COHORTE`. **Sous-défaut** : le lien hub « 📝 Notes formateur » pointe vers `modules/NN/index.html#notes` (`admin/index.html:275`) or **l'ancre `id="notes"` n'existe dans aucune présentation admin** (grep `id="notes"` = 0 sur modules 01/03/18) — le panneau s'ouvre au clavier `[N]`, l'ancre est morte. |
| 6 | **Critères d'évaluation** | ⚠️ **Dans les docs et le public apprenant, PAS dans admin** | `systeme-operationnel/07` (grille binaire M1-M7, 5 compétences, 15 critères/13 requis, mentions jury, J+30) ; barème généré dans le kit Classroom (`generate_classroom_posts.js:144` → « Rendu complet (3 pts)… », visible dans `docs/classroom/posts/cohorte-01/kit-lancement-2026-09-07.md`) | Grep `criter|evaluat` dans `admin/index.html`, `admin/formateur-dashboard.html`, `admin/data/modules.js` : **0 résultat**. Le formateur qui conduit une séance depuis `/admin/` n'a **jamais** la grille « Validé / À réajuster » ni les critères d'acceptation sous les yeux — il doit ouvrir les markdown du dépôt ou Classroom. Le registre modules.js ne contient aucun champ critères. |
| 7 | **Infos de cohorte** | ✅ **Réelles (fichier privé)** | `admin/data/cohorte.js` : `nom` « Cohorte 01 », `baseUrl`, `meetUrl`, `classroomUrl` (avec code d'invitation), `enrollmentUrl` Forms, `dateDebut` 2026-09-07, tarifs 50/100 USD | Le hub affiche badge cohorte + boutons Meet/Classroom **uniquement si URLs renseignées** (`initCohorteButtons`, l.203-233) — pas de valeur inventée. **Limites** : `dateDebut` n'est consommé par **aucune page** (grep 0 hors fichier lui-même) → pas de « semaine courante » calculée ; les 8 `WEEKS` du hub sont un tableau statique (l.176-185) ; `status` des 18 modules est figé à `"ready"` dans le registre → les badges « En cours / À venir » ne bougent jamais. Pas d'effectif, pas de liste de participants hors du robinet Classroom live. |
| 8 | **Outils pédagogiques** | ✅ **Réels** | `formateur-dashboard.html` + `admin/modules/NN/index.html` | Timer 110 min play/pause/reset + raccourci Espace, déroulé par phases cliquables synchronisé au timer (l.260-267), notes formateur (goal/talk/transition — 18/18 modules peuplés), chips de prompts avec deep-link vers le dock [R] de la présentation, Work Kit, lien Meet. Côté présentation admin : **22 `data-note`/module** (confirmé par l'orchestrateur + grep 22 sur `admin/modules/01`). Outils **de séance**, pas d'évaluation ni de suivi. |

**Bilan 8 rubriques** : présentes et data-driven → missions, ressources, infos de cohorte, outils de séance, (et progression de *la séance*). Présentées comme données réelles là où elles n'existent pas → **progression des apprenants, suivi, livrables (côté « déposé/évalué »), critères d'évaluation dans l'UI admin**.

## 3. Le dashboard affiche-t-il de vraies données ou du hardcodé ?

`admin/formateur-dashboard.html` et `admin/index.html` **ne contiennent aucune donnée
dure de contenu pédagogique** : tout vient de `data/modules.js` (18 modules, normalisé
par `scripts/build_registry.js`, source de vérité) et `data/cohorte.js` — `build_admin.js`
copie `data/` dans `admin/data/` (l.68) et `diff data/ admin/data/` confirme des fichiers
identiques. Seuls sont hardcodés dans le hub : le tableau `WEEKS` (l.176-185) et les
textes de statut. Les textes du dashboard « Choisissez un module… », chips vides par
défaut sont des placeholders d'état, pas des données fabriquées. ✅ Rien de simulé côté
contenu — mais **rien non plus côté suivi apprenant** : le dashboard ne prétend pas en
afficher, le trou est structurel, pas cosmétique.

## 4. Ce que `test_parcours_formateur.js` vérifie vraiment

21 checks (l.67-142), tous sur **les fichiers racine en `file://`** (`course-hub.html`,
`formateur-dashboard.html` à la racine du dépôt — **jamais le dossier `admin/` buildé**) :
cartes/semaines/stats du hub, filtre « Disponibles », 18 options du select, timer
01:50:00 / M18 01:35:00, play/pause, 5 phases, mission non vide, notes non vides, lien
Work Kit, liens de lancement vers `modules/<code>/presentation.html`, absence d'erreurs JS.

**Ce qu'il ne vérifie PAS** : l'existence/correctness de `admin/` après build (hors
compteur interne de `build_admin.js:89-97` : 18/18 avec `notesPanel`+« NOTES FORMATEUR »),
les cloisonnements (aucun test public ici — c'est `test_public.js` qui le fait), la
moindre donnée de cohorte réelle, le suivi des livrables, les critères d'évaluation.
⚠️ Décalage de liens : il attend `presentation.html` (racine) alors que le build admin
réécrit en `modules/NN/index.html` — le test valide donc **le prototype racine**, pas le
livrable servi sur `/admin/`. Il annonce « LE FORMATEUR PEUT PRÉPARER ET CONDUIRE UNE
SÉANCE COMPLÈTE » — affirmation vraie **uniquement pour la séance**, pas pour le parcours.

## 5. Cloisonnement formateur / apprenant (fichiers `public/`)

Vérifié fichier par fichier (18/18 présentations `public/modules/NN/index.html`) :

| Règle (`build_public.js` `sanitizePresentation`) | Contrôle sur `public/` | Verdict |
|---|---|---|
| Suppression des attributs `data-note="…"` (l.75) | `grep -c data-note` = **0 partout** (admin : 22/M01, 5/M18) ; variante single-quote aussi absente | ✅ |
| Objet notes vidé → `const notes = {};` (l.56-59) + vérifié à chaque build (l.167-169) | Présent vide dans public/01 | ✅ |
| Panneau `#notesPanel` réduit à un `<aside>` sans contenu + CSS `display:none` + bouton `#notesBtn` masqué (l.32-50) | Confirmé (public/01, public/05) | ✅ |
| Fonctions `toggleNotes/updateNotes` redéclarées no-op (l.65-71) | OK ; `test_public.js` vérifie absence d'erreurs JS runtime | ✅ |
| Nettoyage des textes « NOTES FORMATEUR • AIDE-MÉMOIRE », commentaires (l.88-92) | Reste uniquement 2 **commentaires de code** inoffensifs (`// Notes Formateur` l.1490, ligne de neutralisation) — pas de contenu | ✅ (cosmétique) |
| `00_GUIDE_ANIMATION_*` (guides formateur) exclus du build (l.113-115) | `find public -name '00_GUIDE*'` = vide | ✅ |

**Chasse aux autres fuites (« correction », « grille d'éval », données de cohorte) :**
- « CORRECTION » (public/01:572) = carte pédagogique « 02. CORRECTION — Clavier & Word »
  (fonction IA grand public), et l.1065 = consigne apprenant de retour d'expérience.
  **Ce ne sont pas des corrigés formateur.** ✅
- Les mots « formateur » restants (4-7/public file) = texte de slide destinés à
  l'apprenant (« Le formateur manipule sous vos yeux… »). ✅
- **Grille d'évaluation** : `public/modules/15/02_FICHE_GRILLE_EVALUATION_SOUTENANCE.md`
  et les chapitres M15 « LA GRILLE D'ÉVALUATION DES 15 CRITÈRES » sont visibles du
  public. **Analyse : choix pédagogique délibéré** — la fiche M15 est une fiche
  *apprenante* (le candidat doit connaître les 15 critères qu'on lui applique) ; elle
  duplique `systeme-operationnel/07`. Pas une fuite de contenu confidentiel (aucun
  corrigé de mission, aucune note de cohorte). À documenter comme **intentionnel**, pas à corriger.
- Aucune URL Meet/Classroom/Forms dans `public/` (grep 0) ; aucune référence `/admin` ;
  `cohorte.js` n'est jamais copié dans `public/` ; les réponses d'apprenants (Forms) ne
  transitent que par le gateway sous auth admin.

**Verdict cloisonnement : ✅ OK aux deux niveaux — fichiers ET routes** (build_sanitization
robuste et auto-vérifié par `build_public.js` + `test_public.js` ; côté prod, orchestrateur :
`/admin/` → 200 Basic Auth admin, 401 avec compte apprenant).

## 6. Où le maillon casse aujourd'hui (le scénario client)

Scénario voulu : *admin gère la cohorte → formateur accompagne → apprenant suit une
mission → dépose un livrable → est évalué → progression MESURABLE.*

| Maillon | État | Preuve |
|---|---|---|
| Admin gère la cohorte | 🟡 Partiel | `data/cohorte.js` (config privée) + kit Classroom généré + route nginx `/admin/` protégée. Pas de gestion d'effectif/dates dynamique (`dateDebut` et `status` inexploités). |
| Formateur accompagne | 🟢 Séance / 🔴 Après-séance | Dashboard complet pour la séance. Pour l'accompagnement (permanences, 1-on-1, feux tricolores de `06`) : **process papier**, aucun outil dans l'espace admin. |
| Apprenant suit une mission | 🟢 | Mission dans Classroom (post programmé, kit) + texte de mission + Work Kit sanitisé public. |
| Dépose un livrable | 🟡 Hors plateforme | Dépôt = Google Classroom (manuel). Le gateway sait **créer** du coursework (POST) mais **ne lit ni dépôts ni notes** (aucun GET studentSubmissions). |
| Est évalué | 🟡 | Grilles réelles existent (docs 07, barème du kit) mais **évaluation = notes manuelles dans Classroom + case à cocher dans un Google Sheets** ; rien dans `/admin/`. |
| Progression mesurable | 🔴 **CASSÉ** | L'unique support structuré est `SUIVI_COHORTE_TEMPLATE.csv` — template avec une ligne d'exemple, jamais mis à jour par un outil, jamais lu par l'admin. `03_MATRICE_DE_PROGRESSION` = matrice documentaire de 8 jalons avec cases `[ ]`, pas un suivi réel. |

**Le chaînon manquant précis : il n'existe aucune surface logicielle (fichier admin, page,
endpoint gateway) qui relie les dépôts Classroom/Sheets à l'espace formateur.** Tout ce
que l'orchestrateur a vérifié live le confirme : l'admin voit des **données de cours**
(18 modules, notes, timer), jamais des **données d'apprenants**.

## 7. Gaps & sévérité + options de comblement (sans rien inventer)

1. **[MAJEUR] Pas de suivi de progression des apprenants dans l'espace admin.**
   Le dashboard n'affiche aucun apprenant, jalon, ni statut de dépôt.
   *Comblement* : endpoint gateway `GET /api/classroom/coursework` + `studentSubmissions`
   (scopes `classroom.coursework.students` **déjà demandés** dans `server.js:51`) → écran
   admin « Suivi des dépôts » (module × apprenant × reçu/relu/noté), nourri par les données
   Classroom existantes — aucune donnée inventée, c'est la lecture de ce qui existe déjà.
2. **[MAJEUR] Évaluation/critères absents de l'UI formateur.** Les critères d'acceptation
   (docs 07, barème du kit) ne sont ni dans `modules.js` ni affichés.
   *Comblement* : ajouter un champ `evaluation` (critères + barème) par module dans le
   registre (`build_registry.js`/`data_modules_*.js`) et le panneau « ✅ Critères
   d'évaluation » sur le dashboard — reformatage de textes qui existent déjà dans `07_*`
   et le kit, pas de création pédagogique.
3. **[MODÉRÉ] Suivi = CSV template manuel, jamais connecté.** `SUIVI_COHORTE_TEMPLATE.csv`
   contient une ligne « Exemple Apprenant » et n'est référencé par aucune page.
   *Comblement* : soit lien direct `cohorte.js → suiviUrl` (Sheets) affiché au hub +
   bouton, soit import/export CSV depuis l'écran du gap 1 ; documenter explicitement dans
   GOLDEN_PATH que le tableur reste la source de vérité tant que le gap 1 n'est pas fait.
4. **[MODÉRÉ] `test_parcours_formateur.js` teste les fichiers racines, pas `admin/` buildé,
   et attend des liens `presentation.html` divergents du build.** Faux sentiment de
   couverture du parcours formateur.
   *Comblement* : faire pointer le test sur `admin/` (chemins `modules/NN/index.html`)
   ou dupliquer un `test_parcours_formateur_admin.js` ; ajouter des assertions sur
   `admin/data/*` et l'ancre des notes.
5. **[MINEUR] Ancre morte `#notes`** : le bouton hub « 📝 Notes formateur » cible une id
   inexistante dans les présentations → tombe en haut de page.
   *Comblement* : donner l'id `notes` au panneau/au bouton `#notesBtn` dans le template
   de présentation, ou cibler `#notesBtn` + dispatch de la touche N.
6. **[MINEUR] `dateDebut` et `status: ready` statiques** : le hub ne sait pas dire « où en
   est la cohorte cette semaine » ; tous les modules semblent disponibles dès J0.
   *Comblement* : calculer la semaine courante depuis `dateDebut` pour styler les cartes
   (données déjà présentes, zéro invention).
7. **[MINEUR] Cohorte : `dateDebut` reste marqué `// TODO_ADMIN`** dans `cohorte.js` —
   prêt à vérifier avant lancement réel ; la config tarif/urls est sinon complète.
8. **[INFO/À ASSUMER] La grille des 15 critères est exposée aux apprenants (M15).**
   Cohérent avec l'évaluation par la preuve, mais doit être un choix acté : le marquer
   « publique par design » dans `build_public.js` (liste blanche) pour que les futures
   passes d'audit ne le signalent plus comme fuite.

## 8. Réponse à la question posée

**Oui, le parcours formateur dispose réellement — dans les fichiers admin — de : missions
(18/18), ressources (18 présentations complètes avec notes), infos de cohorte
(config privée réelle), outils pédagogiques de séance, et livrables en tant que consignes
textuelles.** **Non, il ne dispose pas de : progression des apprenants, suivi des dépôts,
évaluation outillée** — ces trois rubriques n'existent que comme process documentaires
(markdown, CSV template, Classroom) hors de la plateforme ; rien n'est simulé à leur place
dans l'UI (avantage : pas de faux dashboard ; inconvénient : pas de mesure). Le
cloisonnement formateur/apprenant est **vérifié conforme dans `public/` (0 fuite de
data-note, notes, guides 00_, liens de cohorte) et aux routes (401 apprenant sur /admin/)**.
Le maillon cassé : **dépose → évaluation → progression mesurable reste 100 % manuel**,
avec une porte de sortie déjà prête (scopes coursework côté gateway) pour le combler.
