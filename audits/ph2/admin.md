# Audit PH2 — Espace ADMIN (hub formateur, dashboard, classroom, présentations)

**Date** : 2026-09-09 · **Périmètre** : `admin/` du repo `C:/LAPOSTE/Projets/ACCADEMY OPAYS` (fichiers statiques, audit sans navigateur — liens et JS vérifiés par inspection de code + `node` sur le registre).
**Sources de données réelles** : `admin/data/modules.js` (18 modules, validé : `numStr`, phases, notes, missions, promptChips présents et cohérents — somme des durées de phases = durée module pour les 18 ; aucune erreur détectée par `scripts` de validation ad hoc). `admin/data/cohorte.js` (nom, meetUrl, classroomUrl, enrollmentUrl, dateDebut, tarifs).
**Règle appliquée** : aucune métrique simulée/inventée ; le verdict « fonctionne » = le code lit bien des données réelles ou un endpoint réel.

---

## 1. Verdicts par fonction observable

### 1.1 Hub formateur — `admin/index.html`

| Élément | Observation | Etat | Severite | Action proposée |
|---|---|---|---|---|
| Stats bar (Modules / Séances / Semaines / Prompts) | Calculées en JS depuis `OPAYS_MODULES` (18 modules, 16 séances distinctes via `seanceNum`, 8 semaines, somme des prompts). Données réelles, pas de chiffres codés en dur. | ✅ Fonctionne | — | Aucune |
| Compteur footer (`footerCounts`) | Injecté par JS depuis le registre : modules • slides • prompts. Réel. | ✅ Fonctionne | — | Aucune |
| Rendu par semaines (`renderHub`) | Regroupe les 18 modules dans 8 sections `WEEKS` ; tous les liens `modules/NN/index.html` existent (18/18 fichiers présents). | ✅ Fonctionne | — | Aucune |
| Boutons « ✅ Disponibles » / « Tous les modules » (`filterModules`) | JS correct, mais **inutiles en pratique** : les 18 modules ont `status:'ready'`, 0 `current`, 0 `upcoming`. Le filtre cache donc 0 carte ; les styles `.current`/`.locked` et badges « En cours »/« À venir » sont décoratifs (jamais rendus). | ⚠️ Fonctionnel mais inactif | Moyenne | Maintenir le champ `status` du registre (passer le module de la semaine courante en `current`) — `dateDebut` de `cohorte.js` existe pour ça mais **n'est consommé par aucun code** (0 usage hors sa définition) |
| Lien « 📝 Notes formateur » (`modules/NN/index.html#notes`) | L'ancre `#notes` **n'existe pas** dans les présentations (aucun `id="notes"` ; le hash-handler JS ne reconnaît que `#sN` pour les slides ; le panneau s'appelle `notesPanel` et s'ouvre via le bouton `notesBtn`). Le clic ouvre bien la présentation mais retourne slide 1, panneau notes fermé. Deep-link décoratif. | ❌ Casse (fonction annoncée non tenue) | Élevée | Ajouter dans le hash-handler des présentations : si `location.hash === '#notes'`, ouvrir `notesPanel` (une modif dans `scripts/presentation_template.js` + rebuild, ou handler côté build) |
| Logo/brand `href="#"` | Lien vers soi (jump top). | ⚠️ Placeholder | Faible | Remplacer par `href="index.html"` ou supprimer le href |
| Lien « 📋 Classroom » | `classroom.html` existe. | ✅ Fonctionne | — | Aucune |
| Lien « 📊 Dashboard Formateur » | `formateur-dashboard.html` existe. | ✅ Fonctionne | — | Aucune |
| Boutons cohorte (Meet / Classroom externe / badge nom) | `initCohorteButtons()` lit `OPAYS_COHORTE` (meetUrl, classroomUrl, nom = « Cohorte 01 »). URL réelles présentes dans `cohorte.js`. | ✅ Fonctionne | — | Aucune |
| Media queries | Présentes : `@media(max-width:768px)` et `480px`. **Mais** à ≤768px, `.header-actions{display:none}` supprime toute la navigation (Classroom, filtres, Dashboard). Sur mobile, le hub devient une vitrine sans porte de sortie. | ⚠️ Responsive dégradé | Élevée | Rendre `.header-actions` scrollable/wrap au lieu de `display:none` |
| `dateDebut` de la cohorte | `TODO_ADMIN` encore présent dans `cohorte.js` (2026-09-07) et inutilisé par le code : aucune « semaine courante » calculée. | ⚠️ Donnée morte | Moyenne | Soit câbler le calcul semaine courante → statut `current`, soit supprimer le faux champ |

### 1.2 Dashboard formateur — `admin/formateur-dashboard.html`

| Élément | Observation | Etat | Severite | Action proposée |
|---|---|---|---|---|
| **Liens « 🏠 Hub » et logo (×2)** | Pointent vers `course-hub.html`. Ce fichier **n'existe pas dans `admin/`** : `build_admin.js` copie le hub sous `index.html` mais ne réécrit **pas** les liens `course-hub.html` du dashboard (seuls `modules/...` et `work-kit` sont réécrits, l.70-73). En prod, clic → 404. | ❌ Lien mort | **Critique** | Dans `build_admin.js`, ajouter `dash.split('course-hub.html').join('index.html')` avant écriture |
| Sélecteur de module (`moduleSelect`) | Peuplé depuis `OPAYS_MODULES`, `onchange → loadModule()` correct (`m.num == sel.value` loose equality OK). 18 options réelles. | ✅ Fonctionne | — | Aucune |
| Timer séance (play/pause/reset, seuils warning 10 min / danger 5 min, formatage h:m:s) | Logique correcte ; initialisé à la durée du module 1 (110 min) par `resetTimer()` à l'init ; l'affichage codé `01:50:00` concorde. Espace clavier = toggle, avec garde sur input/select/textarea. | ✅ Fonctionne | — | Aucune |
| Progression de séance (barre + « X min écoulées » + phase active auto) | Dérivée du timer réel ; coïncidence cumulée des phases vs durée validée sur les 18 modules. | ✅ Fonctionne | — | Aucune |
| Liste des phases (`phaseList`) | Clic ⇒ change seulement le surlignage et « Phase i/n ». Les notes affichées (`noteGoal/noteTalk/noteTransition`) sont **par module, non par phase** : aucune sélection de phase n'a d'effet sur le contenu. Mi-décoratif. | ⚠️ Semi-décoratif | Moyenne | Étayer `notes` par phase dans le registre (`data/modules.js`), ou retirer l'attente créée |
| Mission à donner | `mod.mission` — remplie pour les 18 modules (vérifié vide = 0). | ✅ Fonctionne | — | Aucune |
| Bouton « ▶ Lancer le cours » | `modules/NN/index.html` — existe pour les 18. | ✅ Fonctionne | — | Aucune |
| Bouton « 📁 Work Kit » | `work-kit/TEMPLATE_MON_AI_WORK_KIT.md` existe (`admin/work-kit/`). Le navigateur télécharge/affiche le .md en texte brut (pas d'UI Markdown) — acceptable mais basique. | ✅ Fonctionne (UX brute) | Faible | Envisager une vue HTML du template au prochain cycle |
| Chips de prompts (« 📋 Cliquer pour copier ») | Le libellé promet une copie ; le `onclick` **n'ouvre que la présentation** dans un nouvel onglet avec toast « trouvez le prompt dans le dock [R] ». `navigator.clipboard` n'est jamais appelé. Libellé trompeur. | ❌ Promesse non tenue | Élevée | Copier réellement le texte du prompt (champ `promptText` à ajouter au registre) ou renommer le libellé « Ouvrir la présentation » |
| Bouton Meet (header) | Affiché conditionnellement depuis `OPAYS_COHORTE.meetUrl` (URL réelle présente). | ✅ Fonctionne | — | Aucune |
| CSS `letter-sping:1px` (l.30) | Typo de propriété → lettre du sous-titre brand non espacée. Trivial. | ⚠️ Bug cosmétique | Faible | Corriger en `letter-spacing` |
| Media queries | Présentes (`@max-width:900px` : grille 1 colonne, timer compact). | ✅ Responsive OK | — | Aucune |

### 1.3 Écran Classroom — `admin/classroom.html`

| Élément | Observation | Etat | Severite | Action proposée |
|---|---|---|---|---|
| Chargement statut OAuth / cours / étudiants | `fetch('/api/classroom/status|courses|students')` — ces endpoints existent réellement côté gateway (`deploy/classroom-gateway/server.js` l.257/268/282) et Traefik route `/api`, `/oauth`, `/health` vers le gateway sur `course.opays.io`. En prod avec gateway actif : **données réelles, rien de simulé** (placeholders `—` affichés tant que non chargé). En local statique (file://) ou gateway arrêté : card OAuth passe en rouge « Erreur » proprement (try/catch OK). | ✅ Fonctionne (dépend du gateway) | — | documenter la dépendance dans le README admin |
| Bouton « ↻ Actualiser » | `onclick="loadAll()"` — **`loadAll` n'est jamais défini** (la fonction s'appelle `load()`). Clic ⇒ `ReferenceError`. | ❌ Casse | Élevée | Renommer en `load()` (ou définir `loadAll = load`) — source : `scripts/templates/classroom-admin.html` (corriger le template puis rebuild) |
| Bouton « ↻ Reconnecter Google » | `href="/oauth/start"` — chemin absolu : fonctionne en prod (gateway), mort en local. | ⚠️ Dépend du contexte | Faible | Accepté ; le signaler dans l'aide |
| Bouton retour « ← Hub formateur » | Présent et correct (`href="index.html"`), **mais classe `back` et non `admin-home-link`** — hors conventions demandées (aucun impact fonctionnel). | ✅ Fonctionne / ⚠️ hors convention | Faible | Aligner la classe dans le template |
| Styles `.stat` (oauthEmail, courseName…) | Le CSS ne définit pas de classe `.stat` (les styles existants sont `.val`/`.sub`) → rendu par défaut, pas cassé, incohérence de naming. | ⚠️ Cosmétique | Faible | Ajouter `.stat` au CSS ou basculer sur `.val` |
| Media queries | **Aucune** (`grep @media` = 0). Les cards utilisent `auto-fit minmax(300px,1fr)` ⇒ le tableau se replie correctement, mais le header et le tableau étudiants ne sont pas pensés pour petits écrans (pas d'overflow-x sur `table`). | ❌ Absentes | Moyenne | Ajouter 1 breakpoint ≤600px (table scrollable, en-tête wrap) |
| Footer | Contient le texte « **Académie OPAYS** — Lecture seule… » → voir §4 (décision renommage). | ⚠️ Marque à renommer | — | Voir §4 |
| Scope affiché | Le footer annonce `courses.readonly + rosters.readonly`, mais le gateway demande en réalité des scopes **écriture** (classroom.topics, coursework.students, materials, announcements, gmail.send, calendar, forms). Le footer sous-déclare les permissions réelles — point de cohérence/consentement. | ⚠️ Incohérence doc/réalité | Moyenne | Corriger le footer pour refléter les scopes actifs du gateway |

### 1.4 Les 18 présentations `admin/modules/01..18/index.html`

| Élément | Observation | Etat | Severite | Action proposée |
|---|---|---|---|---|
| Bouton retour `admin-home-link` | **18/18 présents** (grep : 36 occurrences = 18 CSS + 18 ancres), `href="../../index.html"` → le hub admin existe. Injectés par `build_admin.js` (l'ancienne version `injectBackLink` avec `../index.html` est dead code dans le script, la version active est inline). | ✅ Fonctionne | — | Supprimer la fonction `injectBackLink` inutilisée du script pour éviter la confusion |
| Notes formateur | 18/18 contiennent `notesPanel` + « NOTES FORMATEUR » (garantie du build, re-vérifié). | ✅ Fonctionne | — | Aucune |
| Deep-link `#notes` depuis le hub | Cf. 1.1 — non géré par le hash-handler. | ❌ | Élevée | Idem §1.1 |
| Marque dans les slides | « Académie OPAYS » ×2-4 par module + « OPAYS Academy » dans les `<title>` → §4. | ⚠️ | — | Voir §4 |
| Média queries | Chaque présentation a 3 `@media` dont 1 pour `.admin-home-link` (≤650px). Responsive déjà traité côté template. | ✅ | — | Aucune |

---

## 2. Réponses aux questions du client

**Un administrateur peut-il gérer la cohorte ?** Partiellement. Il peut : publier l'identité de cohorte (`cohorte.js` : nom, liens Meet/Classroom — propagés automatiquement au hub et dashboard ✅) et consulter (via gateway) la liste réelle des étudiants inscrits dans Google Classroom. Il ne peut **pas** : éditer le roster (fichier `cohorte.js` sans liste d'apprenants), voir qui est à jour, marquer une présence, ni suivre qui a rendu quoi — `classroom.html` affiche les inscrits, c'est tout.

**Peut-il voir progression / activité / retards ?** **Non.** Aucune donnée de progression n'existe nulle part : le registre ne contient que du contenu de cours ; `cohorte.js` ne contient aucun apprenant ; le gateway n'expose **aucun endpoint GET de coursework/courtesy submissions** (seuls POST topics/coursework/materials, GET courses/students/status/calendar/forms). Le seul « suivi » visible est la progression **de la séance en cours** (timer) — pas celle de la cohorte. Sans inventer de metric : aujourd'hui l'écran retards n'existe pas et ne peut pas être branché tel quel, il manque la source de données.

**Peut-il préparer les prochaines sessions ?** **Oui, bien.** C'est le point fort : sélecteur 18 modules, déroulé par phases minuté, mission à donner, notes formateur (objectif/arguments/transition), accès direct à la présentation complète et au Work Kit, timer 110 min prêt à l'emploi. Manque seulement le lien profond qui ouvre les notes (§1.1) et la sélection de la session « prochaine » automatique (`dateDebut` non câblé).

**Peut-il suivre les missions ?** **Non.** Les missions sont définies (18/18 dans le registre) et visibles avant/après séance, mais ni leur distribution (les POST `/api/classroom/coursework` existent côté gateway mais **aucune UI admin** ne les appelle — tout reste manuel dans Classroom, comme l'assume le footer de classroom.html), ni leur rendement (0 soumissions consultables) ne sont pilotables depuis l'espace admin.

## 3. Ce qui manque pour un vrai cockpit (sans données simulées)

Par ordre de dépendance — chaque item ne fait qu'exposer des données qui **existent déjà** ou existeront dans une source réelle, rien n'est inventé :

1. **Roster persistant** : un champ `participants[]` (nom, email) dans `admin/data/cohorte.js`, saisi/exporté depuis Google Classroom (le gateway sait déjà les lire) — prérequis à toute vue progression.
2. **Endpoint GET coursework + submissions** dans `deploy/classroom-gateway/server.js` (l'API Google Classroom l'expose ; les scopes `classroom.coursework.students` sont déjà demandés) → alimente : missions distribuées / rendues / en retard.
3. **Écran « Cohorte »** (`admin/cohorte.html`) : table apprenants × 18 missions, états = joints réels du endpoint 2 (jamais de % calculés à partir de rien).
4. **Câbler `dateDebut`** : semaine courante = floor((aujourd'hui − dateDebut)/7)+1 → statut `current` du module, badge « En cours » du hub, et « prochaine séance » en tête du dashboard.
5. **UI de publication des missions** (bouton « Publier la mission M NN dans Classroom » appelant le POST `/api/classroom/coursework` déjà écrit mais jamais exposé).
6. **Fixs préalables** : liens `course-hub.html` du dashboard (404), `loadAll()` de classroom.html, ancre `#notes`, libellé « copier » des chips, nav mobile du hub.

## 4. DECISION CLIENT — renommage « Académie OPAYS » → « HOJA ACADEMY » (documenté, non modifié)

Le site public est HOJA ACADEMY ; **aucune occurrence de « HOJA » n'existe dans le repo** (grep global HTML/JS/MD hors audits). Tout l'espace admin est encore sous marque OPAYS. Inventaire complet dans le périmètre admin :

| Fichier | Occurrences | Endroits types |
|---|---|---|
| `admin/index.html` | 3 | `<title>`, `.brand-text`, footer © |
| `admin/formateur-dashboard.html` | 2 | `<title>`, `.brand-text` |
| `admin/classroom.html` | 2 | `<title>…OPAYS Academy Admin`, footer « Académie OPAYS » |
| `admin/data/cohorte.js`, `admin/data/modules.js` | 2 | commentaires d'en-tête ; + 1 dans une transition pédagogique M18 (« réseau Alumni de l'Académie OPAYS ») |
| `admin/modules/01..18/index.html` | 2–4 chacun | `<title>`, meta description, kicker « Académie OPAYS • Séance NN », « Les 4 Règles d'Or de l'Académie OPAYS » (M01), « CERTIFIÉ OPAYS ACADEMY » (M16) |
| **Hors admin mais visible côté admin** | — | nginx Basic Auth realms : « Academie OPAYS - Espace formateur » / « Académie OPAYS — Espace apprenants » (`deploy/deploy-vps-academy.sh`) et realm 401 du gateway (`server.js` l.135) — popup de mot de passe où l'ancien nom s'affiche |

**Total admin/ : 46 « Académie OPAYS » + 18 « ACADÉMIE OPAYS » + 45 « OPAYS Academy » ≈ 109 occurrences.** ⚠️ La décision client doit préciser : (a) le nom final exact et son accentuation, (b) si « OPAYS » reste comme nom de l'entreprise éditrice (footer légal ©) ou disparaît, (c) si les pops d'authentification (realms) sont inclus. La bascule se fait ensuite aux sources (`course-hub.html`, `formateur-dashboard.html`, templates, `deploy/*.sh`) + `node scripts/build_admin.js && build_public.js` — ne pas éditer `admin/` à la main (détruit au rebuild, `fs.rmSync` l.23).

## 5. Cohérence des comptes

- Google admin OAuth : `opaystech@gmail.com` (`deploy/set-allowed-admin-email.sh` → `ALLOWED_ADMIN_EMAILS`) — **single source** cohérente ; refus 403 explicite côté gateway.
- Le gateway exige un **second** couple Basic Auth (`ADMIN_USER`/`ADMIN_PASS`, env Dokploy) distinct du compte Google ; `deploy/align-gateway-password.sh` existe pour les synchroniser — à vérifier lors du déploiement (les deux mots de passe — admin nginx et gateway — doivent rester alignés ; `rotate-admin-password.sh` ne rotationne qu'un côté).
- `deploy/credentials/htpasswd-admin` est **vide (0 octet)** en local : le hash est régénéré au deploy (attendu, mais l'audit local ne peut pas confirmer que le user nginx admin == user gateway). À vérifier côté prod en lecture seule : `curl -I https://course.opays.io/admin/` → realm et code.
- Cohérence nom de cohorte : « Cohorte 01 » partout (hub + dashboard via `cohorte.js` ✅).
- Incohérence mineure : `classroom.html` mentionne des scopes read-only que le gateway ne demande pas réellement (cf. §1.3).

## 6. Accessibilité clavier

| Élément | Observation | Etat | Severite | Action |
|---|---|---|---|---|
| Raccourci Espace = timer (dashboard) | Le handler ne garde que `input,select,textarea` ; un `preventDefault` sur Espace **casse l'activation clavier de tout lien/bouton focusé** (ex. « 🏠 Hub », `mod-select` adjacent, phase-item) tant que le dashboard est ouvert. | ❌ Régression clavier | Moyenne | Exclure `a,button` du garde ou vérifier `e.target === document.body` |
| Chips prompts & items phases (div onclick) | Non focusables, pas de `role="button"`, pas d'Enter : inutilisables au clavier. | ❌ | Moyenne | `<button class=...>` ou `tabindex=0` + keydown Enter |
| `aria-*` | `notesPanel aria-hidden="true"` géré dans les présentations ✅ ; hub/dashboard : aucun aria-label sur boutons icônes (↺, ▶ — un `title` existe, acceptable). | ⚠️ | Faible | aria-label sur les 2 boutons timer |
| Focus visible | `mod-select:focus` stylé ✅ ; le reste dépend des outlines navigateur (fond sombre → outline par défaut faible). | ⚠️ | Faible | Ajouter `:focus-visible{outline:2px solid var(--blue-light)}` global |
| Liens `<a href="#">` (brand hub) | Piège clavier (tab stop sans destination). | ⚠️ | Faible | Cf. §1.1 |

## 7. Responsive (état par page)

| Page | @media | Verdict |
|---|---|---|
| `admin/index.html` | 768px + 480px | Stats et grille OK, mais **nav entièrement masquée ≤768px** (§1.1) |
| `admin/formateur-dashboard.html` | 900px | OK (1 colonne, timer compact) |
| `admin/classroom.html` | **aucune** | Table sans défilement horizontal sur mobile ; en-tête non wrap |
| `admin/modules/*/index.html` | 3 par page | Déjà couvert par le template public |

## 8. Synthèse des liens morts / décoratifs (récap)

1. **MORT** : `formateur-dashboard.html` → `course-hub.html` ×2 (brand + bouton 🏠) — 404 en prod `/admin/`. (racine : `scripts/build_admin.js` ne réécrit pas ce lien)
2. **CASSE** : `classroom.html` bouton « ↻ Actualiser » → `loadAll()` non défini (ReferenceError).
3. **DÉCORATIF** : hub → `modules/NN/index.html#notes` (ancre inexistante, panneau notes jamais ouvert).
4. **DÉCORATIF** : filtres statut du hub (tous les modules sont `ready`) ; badges « En cours »/« À venir » et styles locked jamais déclenchés.
5. **TROMPEUR** : chips prompts « Cliquer pour copier » → ne copient rien.
6. **MOBILE** : toute la navigation du hub disparaît ≤768px.
7. Sains : tous les liens modules 01–18, work-kit, classroom, dashboard depuis le hub, Meet, retour `admin-home-link` 18/18, stats du hub.
