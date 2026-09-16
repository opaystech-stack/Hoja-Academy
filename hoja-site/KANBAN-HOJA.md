# KANBAN — Chantier d'identité HOJA ACADEMY — CLÔTURÉ 08/09/2026
> Site : `hoja-site/` (repo ACCADEMY OPAYS) — Next.js 15, export statique
> Objectif : garder squelette/UX/animations — éliminer 100 % de l'identité AcademIArtificial, reconstruire l'identité Hoja Academy.
> Clôture : build ✅ 23/23 · gate traces ✅ 0 src + 0 out · QA ✅ 48/48 · revue visuelle desktop/mobile ✅

## DONE (exécuté + VÉRIFIÉ par l'orchestrateur)
| Carte | Qui (429 → reprise) | Fichiers | Résultat obtenu |
|---|---|---|---|
| Audit global des traces | SA1 **429** → orchestrateur | src/**, out/** | `audits/traces.md` : 249 traces recensées → 0 après nettoyage. Rejeux multiples ✅ |
| Audit des images | SA2 (partial 429 en fin de run — livrables sur disque exploités) | audits/images.csv, sheets/×11, critique_list.txt | 183 assets référencés, 34 CRITIQUE, 11 A-CHECK, orphelins listés |
| Remplacement des images | Orchestrateur | public/assets/hoja/** + ~70 fichiers | 34 refs critiques (photos élèves réels, portraits Alejavi/Jose Moral, miniatures vidéo) → 12 visuels abstraits Hoja générés ; badges certificat AI VENTURE → certificat-hoja.png ; macaron FUNDAE → badge-entreprises.png ; icône home suspecte (0a61ce2d) → hoja-emblem.png. Vidéo héro auditée frame par frame = abstraite, conservée (identique à la référence) |
| Audit logos/partenaires | Orchestrateur (vision + histogramme) | favicons, header, footer | favicons/icon/apple-icon = emblème HOJA officiel vérifié pixel ; logo header/footer = HOJA ✅ |
| Suppression anciennes identités | SA-Nettoyage **429** → orchestrateur (`hoja_identity_clean.py` + patches) | 24 fichiers | red.es/Kit Digital/UE (bandeau 8912c83b → « LEARN AI », 27×), AI VENTURE S.L./NIF/Grenade, Ley 34/RD 1112/AEPD/sedeagpd, FUNDAE/Isabel I/ECTS, Alejavi/Jose Moral/Yago/Yahir/Alexis/Pablo (anonymisés), widget avis (Error getting reviews → sobre), iframe YouTube ZEEQA. grep final src+out = 0 |
| Application branding Hoja | Orchestrateur (`hoja_recolor_css/tsx.py`) | globals.css + 16 ditto.css + ~180 tsx | Palette logo (marine #112779 / bleu roi #2b48ce / émeraude / lime jaune) remappée en LAB en préservant luminance ; structure CSS intacte ; build ✅ |
| Audit programme existant | Orchestrateur | audits/programme-hoja.md | Source de vérité AGENT.md v3.0 + data/cohorte.js → 18 modules/4 blocs, philosophie A→P→C→A→P, My AI Work System, AI Update, robotique & recherche |
| Adaptation programme Hoja | SA-Contenu (crash réseau **après** livraison complète sur disque — 157 appels, 6163 s, rapport reçu) | curso-ia, page.tsx, institution, empresas, curso-de-chatgpt/gemini/make, content.ts, sections/* | Hero « 18 modules · 4 blocs · soutenance certifiante », section 4 BLOCS (M1-M18), APPRENDRE/PRATIQUER/CONSTRUIRE/PRODUIRE, sessions live 90-120 min, C.O.R.E./MCP/Agent.md/pyramide des sources/NotebookLM, cours experts reformulés (aucun nom), entreprises sans FUNDAE, robotique & recherche partout. Comptes de balises backup↔fichier identiques 21/21 fichiers. Complété par orchestrateur : « immunité technologique » institution, metadata 16 pages |
| Réécriture contenus | SA-Contenu + orchestrateur | ~30 fichiers | Ton institutionnel Hoja ; résidus ES tués au passage (« appliquée aplicada », « Edición », 3 alt ES) ; 0 contenu inventé (chiffres = uniquement ceux d'AGENT.md) |
| Audit SEO et métadonnées | SA3 **429** → orchestrateur | out/*.html, audits/seo.md | 17 pages auditées ; title unique par page (16 metadata insérées), canonical `https://hoja-academy.com` (site.ts), robots/sitemap absolus, 404 Hoja personnalisée, og:locale es absent, lang=fr partout, alt ES=0 |
| QA desktop | Orchestrateur (qa_hoja.js + vision) | 16 pages × 1440 | 0 issue ; revue visuelle home/curso-ia/institution/empresas : branding cohérent, 0 trace, propres |
| QA tablette | Orchestrateur | 16 pages × 820 | 0 issue |
| QA mobile | Orchestrateur | 16 pages × 375 + revue visuelle | scrollX réel = 0 partout ; **correction structurelle minimale héritée du clone** : `html,body{overflow-x:clip}` (comportement strictement identique au site de référence, testé avant/après : 746→375, sticky/animation inchangés) |
| QA animations | Orchestrateur | curso-ia + toutes pages | elements `[animation-*]` : 11/11 visibles après scroll ; keyframes intactes ; structure JSX jamais modifiée (garde-fous backup/snapshot + comptage balises) |
| Recherche finale des traces | Orchestrateur (`hoja_final_gate.py`) | src/** + out/** | SRC 0 trace · OUT 0 trace · marqueurs programme Hoja tous présents · VERDICT PASS ✅ (2 passes : pré et post-build final) |
| Build final | Orchestrateur | out/ | `npm run build` ✅ Compiled + 23/23 pages + Export 2/2 (3× confirmé) |
| Validation finale | Orchestrateur | — | Test de réussite passé (voir rapport). Faux positifs documentés : route `/noticias-ia`, « aspects/indirects »⊃ects, chunks JS `_server` |

## BACKLOG (hors périmètre, décisions utilisateur)
| Carte | Pourquoi pas fait |
|---|---|
| Vrais tarifs Hoja sur les cartes prix | Décision Fénelon (prix actuels hérités 920 € retirés du programme ? à trancher) |
| Vrais témoignages clients | Interdiction d'inventer — blocs sobres en place |
| Entité juridique mentions légales | Nom légal/adresse/NIF Hoja à fournir |
| Réseaux sociaux & email définitifs | placeholders @HojaAcademy / info@hoja-academy.com |
| Libellé nav « Candidater » | Choix initial du cahier des charges ; suggestion QA : « Postuler » |
| Sélecteur EN/FR | Décoratif comme sur la référence — vrai i18n = chantier séparé |
| Route `llms.txt` (dump WP ancien) | Conservée volontairement (donnée externe) ; à supprimer si tu le souhaites |

## BLOCKED
Aucune.

## Notes de reprise
- `python scripts/hoja_final_gate.py` = garde-fou réutilisable après toute édition.
- `python scripts/hoja_relock_visuals.py` = re-verrouillage idempotent des visuels critiques.
- Backups : `audits/snapshot_src/` (pré-nettoyage), `audits/backup_clean/`, `audits/backup_content/`.
- QA : `workspace/qa_hoja.js` (48 checks), captures dans `workspace/qa/`.


---


## CLOTURE DES 6 RESIDUS PHASE 1 (valides par Fénelon, traites 08/09 ~23h30) ✅
| # | Point | Traite | Etat |
|---|---|---|---|
| 1 | Tarifs 920 €/100 € | Les seuls chiffres restants etaient la promesse « licence Make Core / ChatGPT Plus valeur 600 € » (engagement herite AI VENTURE) remplacee par une formulation neutre (« outils et licences detailles avec chaque promotion », « acces fourni et accompagne ») ; bloc ES « por 6 meses · 150k al mes / Obtener Make Core » neutralise. 0 prix rendu dans out/. **PRIX_A_DEFINIR** — ne rien publier avant les vrais tarifs. | ✅ DONE |
| 2 | Mentions légales | Aucune info juridique inventee. En attente : entite juridique, pays, RCCM, NIF, hebergeur, adresse, responsable legal — DECISIONS METIER documentees. | ⏸ BLOCKED (documente) |
| 3 | Email/reseaux | info@hoja-academy.com + @HojaAcademy = PLACEHOLDERS non confirmes — ne pas presenter comme officiels ; a changer des confirmation. | ⏸ PENDING |
| 4 | Temoignages | 8 cartes neutralisees (« Temoinage d'apprenant — bientot disponible. »), intros harmonisees (« Les premiers temoignages de la promotion HOJA ACADEMY arrivent bientot. »), registration deja sobre. 0 citation heritee. | ✅ DONE |
| 5 | Candidater → Postuler | 50 occurrences harmonisees (CTA → /contacto, vrai parcours de contact/candidature). | ✅ DONE |
| 6 | llms.txt | Verifie : la route a deja ete SUPPRIMEE en fin de Phase 1 (absente de src/, out/, refs). Decision : non conserve. | ✅ DONE |
Re-jeu apres ces changements : build ✅ 23/23, gate ✅ 0 trace, QA ✅ 48/48.

---

# PHASE 2 — ADMIN & PRODUIT (ouverte 08/09/2026)
> Cible : `course.opays.io` (VPS 76.13.58.5, Dokploy/Traefik, nginx `opays-academy` + `opays-classroom-gateway`).
> Source : `C:\LAPOSTE\Projets\ACCADEMY OPAYS` — builds `node scripts/build_admin.js` / `build_public.js` / `build-bundle.js` ; release `npm run release`.
> Règles : ne rien casser d'existant ; ne simuler aucune donnée ; ne pas réinventer le programme (source AGENT.md + audits/programme-hoja.md) ; l'espace formateur invisible côté apprenant.

## DIAGNOSTIC INITIAL (orchestrateur, vérifié live)
| Élément | État | Action |
|---|---|---|
| Landing publique `/` (200, zéro lien privé) | 🟢 | Conserver |
| `/modules/*` Basic Auth apprenant ; contenu sanitizé (0 data-note vs 22 en admin) | 🟢 | Conserver |
| `/admin/*` Basic Auth admin (hub + dashboard + 18 présentations complètes) | 🟢 | Conserver |
| Séparation des rôles aux routes (admin 401 /modules ; apprenant 401 /admin) | 🟢 | Conserver |
| Prod == local (md5 index.html + cohorte.js identiques) | 🟢 | — |
| Gateway `/oauth/start` 302, `/api/*` 401 sans auth | 🟢 | Conserver |
| `https://course.opays.io/oauth/health` → 404 alors que la route réelle du gateway est `/health` (le site ne mappe que /oauth/* et /api/* vers le gateway, sinon le 404 viendrait de nginx pour /health racine) — à confirmer par lecture du routage Traefik (P2-2) ; un health-check public ou mal routé est un point technique mineur, PAS une exposition de donnée sensible. | 🟡 | Confirmer via P2-2 |
| Rôle FORMATEUR distinct d'ADMIN | 🔵 Manquant (2 niveaux seulement aujourd'hui) | Construire |
| Parcours apprenant individuel (progression, dépôt, règle des 5 min) | 🔵 Manquant (compte partagé + statique) | Construire — périmité à valider |
| `admin/classroom.html` (6,6 Ko) — état inconnu | 🟡 | Auditer P2-2 |
| Mobile admin/modules | 🟡 non testé | QA P2-7 |
| `index.html.bak-v3` résiduel serveur | ⚫ Héritage | **FAIT 08/09** : sauvegarde publique de l'ancienne landing « OPAYS Academy » exposée sans auth → retirée du VPS, reverifiee 404, landing intacte 200 ✅ |



### AUDITS PHASE 2 — BILAN (tous DONE, vérifiés par l'orchestrateur)
| Carte | Agent prévu | Exécuté par | Rapport | Verdict clé |
|---|---|---|---|---|
| P2-1 Admin | SA-ADMIN ✅ | agent (completed) | audits/ph2/admin.md | 7 bugs réels confirmés par sondes, TOUS corrigés (cf. fixes) |
| P2-2 Classroom | SA-CLASSROOM ❌ 429 | **orchestrateur** (code + LIVE lecture via gateway) | audits/ph2/classroom.md | Intégration saine mais **classe VID** (0 student/devoir/topic) — le kit n'a jamais été poussé. Invitations = endpoint absent (trou documenté) |
| P2-3 Modules | SA-MODULES ❌ 429 | **orchestrateur** (scan programmatique) | audits/ph2/modules.md | 18/18 conformes structurellement ; 1 vrai bug : mission M02 dupliquée de M03 dans le registre → **CORRIGÉE** ; 1 question d'ordre S14-S16 (M15 en dernier = probablement délibéré) |
| P2-4 Apprenant | SA-APPRENANT ❌ 429 | **orchestrateur** | audits/ph2/apprenant.md | 7 questions : 3 OK / 2 partielles / 2 manquantes (dépôt, progression) — dépendent du peuplement Classroom + décision comptes |
| P2-5 Formateur | SA-FORMATEUR ⚠️ (429 fin de run, rapport complet reçu) | agent + **re-vérifié orchestrateur** | audits/ph2/formateur.md | Préparation/conduite de séance RÉELLES et data-driven ; le triptyque dépôt→évaluation→progression est hors plateforme (gap produit n°1) |
| P2-6 Sécurité | SA-SECURITY ❌ 429 | **orchestrateur** | audits/ph2/securite.md | C-1 secret apprenant en dur **CORRIGÉ** (+ rotation à faire humain) ; pas de rôle formateur distinct ; token.json 644 ; bootstrap emails |

### FIXES TECHNIQUES SUPPLEMENTAIRES (orchestrateur, vérifiés par rebuild+tests)
- `data/modules.js` : mission M02 corrigée (test comparatif 2 outils) — build:registry 18/18 ✅, npm test ✅, test:public 72/72 ✅.
- `scripts/test_parcours_apprenant.js` : **chemin de sécurité buggué** (`public/modules/01-comprendre-ia/` → `public/modules/01/`) — le crash final masquait le verdict ; 13/13 ✅ désormais.
- Nouveau `scripts/test_parcours_formateur_admin.js` (16 checks sur le VRAI build admin/) + intégré à `npm run release` → comble le faux sentiment de couverture signalé par formateur.md gap 4.
- Hub mobile 820px : `html{overflow-x:clip}` + actions scrollables ≤900px — QA admin 15/15 checks 0 issue (sticky vérifié intact).
- **Builds admin/+public/ actuels = à déployer** (contiennent les 9 fixes) via build-bundle + deploy-vps-academy.sh — NON FAIT : le déploiement prod reste une action explicite (règle : vérifier la prod d'abord, jamais de déploiement non validé).

## TODO PHASE 2 (produits — après tes GO)
| # | Carte | Dépend de |
|---|---|---|
| P2-T1 | **Déployer les fixes admin** (bundle + scp + script, 401/200 revérifiés) | GO déploiement |
| P2-T2 | **Peupler Classroom** : endpoint invitations (manquant) + import topics/devoirs depuis le kit + lien classe dans hub apprenant | GO Classroom + décision invitation (emails apprenants = les vrais, fournis par toi) |
| P2-T3 | **Rôle FORMATEUR distinct** (htpasswd multi-users ou équivalent) | Décision modèle de comptes |
| P2-T4 | **Comptes apprenants individuels** ou progression via Classroom (choix d'architecture) | Décision |
| P2-T5 | **Suivi des dépôts/évaluations** dans l'admin (endpoint GET submissions + écran) — le chaînon qui manque au cockpit | P2-T2 |
| P2-T6 | Câblage `dateDebut` (confirmer la date réelle TODO_ADMIN) → statut « En cours » + semaine courante | date réelle |
| P2-T7 | **RENOMMAGE MARQUE ESPACE PRIVÉ** (~109 occurrences Académie OPAYS/OPAYS Academy + classe Classroom + realms auth) | TA DECISION : nom exact, OPAYS éditeur légal ?, realms inclus ? |
| P2-T8 | Durcissements sécurité résiduels (rotation LEARN_PASS, ALLOWED_ADMIN_EMAILS obligatoire, chmod 600 token, scopes) | GO |

### ETAT LIVE VERIFIE (orchestrateur, lecture seule — 08/09 ~23h50)
- `index.html.bak-v3` (ancienne landing OPAYS Academy exposée sans auth) → **SUPPRIMÉ du VPS**, revérifié 404, landing 200 ✅
- Classroom connecté (compte opaystech@gmail.com) mais **classe VIDE** : 0 students, 0 coursework, 0 topics, 0 events ; 1 form d'inscription (ancien nom « OPAYS Academy »). Classe nommée « OPAYS Academy — Cohorte 01 » → **décision client** : renommer en « HOJA ACADEMY — Cohorte 01 » (PATCH gateway dispo) et peupler via le kit de posts existant.
- Scopes du token autorisent l'ÉCRITURE (classroom.topics, coursework.students, gmail.send, calendar) alors que le commentaire d'en-tête du gateway promet « lecture seule » → finding sécurité (P2-6).
- Conteneur suspect `kiveclair-3n3pks-academy-1` (autre app Dokploy « academy ») → à identifier (P2-6/SA-SECURITY, live check nécessaire côté orchestrateur plus tard).


### REVIEW orchestrateur (vérification croisée par sondes indep. sur le code) ✅
- **P2-1 ADMIN.md** → DONE. Les 5 findings clés sont CONFIRMES par l'orchestrateur : (1) dashboard admin → 2 liens `course-hub.html` MORTS (racine: build_admin.js ne reecrit pas ces liens) ; (2) classroom.html `loadAll()` appelee, seule `load()` definie = bouton Actualiser casse ; (3) ancre `#notes` inexistante dans les presentations (1 lien deco) ; (4) 0 `navigator.clipboard` — les chips « cliquer pour copier » ne copient rien ; (5) `@media 768px .header-actions{display:none}` = toute la nav du hub disparait sur mobile. Constat majeur documente : **~109 occurrences « Academie OPAYS / OPAYS Academy » dans l'espace admin** = DECISION CLIENT (renommage total ? OPAYS conserve comme editeur ? realms d'auth inclus ?) — bascule a faire AUX SOURCES (course-hub.html, formateur-dashboard.html, templates, deploy/*.sh) puis build_admin/build_public.
- **P2-5 FORMATEUR.md** → DONE. Confirme : missions/ressources/cohorte/outils seance REELS et data-driven ; MAIS progression apprenants/criteres eval/suivi livrables = ABSENTS de l'UI (le maillon depot→evaluation→progression est 100% manuel hors plateforme — template CSV jamais connecte, gateway sans GET submissions — verifie par l'orchestrateur : /api/classroom/coursework existe en POST seulement). Cloisonnement apprenant CONFIRME (0 data-note dans les 18 modules publics). Grille 15 criteres M15 visible cote apprenant = choix pedagogique a ASSUMER (liste blanche build_public).
- Prochaine etape Ph2 : fixes admin (liens morts, loadAll, ancre notes, clipboard, nav mobile, dateDebut->semaine courante) aux SOURCES puis rebuild — en attente de la DECISION NOMMARK (OPAYS vs HOJA) pour ne pas tout reconstruire deux fois.


### FIXES ADMIN APPLIQUES par l'orchestrateur (aux SOURCES puis rebuild — 09/09 ~13h30) ✅ REVIEW OK
| Fix | Source editee | Verifie dans le build |
|---|---|---|
| DASHBOARD 404 : course-hub.html -> index.html | scripts/build_admin.js | 0 occurrence 'course-hub' dans admin/formateur-dashboard.html ✅ |
| loadAll() casse -> load() | scripts/templates/classroom-admin.html | admin/classroom.html appelle load() defini ✅ |
| Ancre #notes (hub -> panneau notes presentation) | scripts/presentation_template.js + patch identique sur les 3 modules 'proteges' (01,16,18) | 18/18 admin + 18/18 public ✅ (handler inoffensif cote public, panneau masque) |
| Chips trompeuses 'cliquer pour copier' -> 'ouvrir dans la presentation' + role=button/tabindex/Enter | formateur-dashboard.html | build admin ✅ |
| Phase-items focusables + Espace global exclut a/button/[role=button] + letter-sping->letter-spacing | formateur-dashboard.html | ✅ |
| Nav mobile hub: display:none -> scrollable | course-hub.html | overflow-x:auto a <=768px ✅ |
| Brand hub href='#' -> index.html | course-hub.html | ✅ |
Regressions controlees : build_admin OK 18/18 ; build_public OK « aucune trace formateur » ; check_hub_dashboard 72/72 ; npm test 18/18 ; data-note dans public = 0.
BACKUP pre-fix : audits/ph2/backup_fix/ (sources modifiees).
NON FAITS VOLONTAIREMENT (en attente decision marque) : renommage Academie OPAYS -> HOJA dans admin/, realms auth, classe Classroom ; NON FAITS (choix) : status dynamique via dateDebut (TODO_ADMIN non confirme), endpoint GET submissions (chantier produit, pas un fix).
- **C-1 SECURITE (secret apprenant en dur)** : LEARN_PASS fallback 'Opay…' RETIRE de scripts/test_production_remote.js (node --check OK) ; dorenavant `LEARN_PASS requis en env` sinon exit propre. Scan : 0 occurrence du secret nulle part dans le repo. **ROTATION du mot de passe apprenant = DECISION/ACTION HUMAINE** (le secret a vecu dans un fichier ; a changer au prochain deploy — le htpasswd-learn est regenere a chaque run de deploy-vps-academy.sh, donc fournir un nouveau LEARN_PASS suffira). 🟡 REVIEW DONE, reste rotation cote humain.
- **P2-6 SECURITE.md** → DONE (reprise par l'orchestrateur apres 429 de SA-SECURITY). CRITIQUE : secret apprenant en dur dans scripts/test_production_remote.js (a retirer + rotater) ; roles = 2 niveaux seulement, pas de FORMATEUR distinct. MAJEUR : token.json 644 ; ALLOWED_ADMIN_EMAILS vide = bootstrap ; scopes ecriture > besoin reel + doc trompeuse ; (bak-v3 public → corrige plus tot ✅). Cloisonnement routes verifie live bidirectionnel ✅.

## IN PROGRESS — PHASE 2 (audits read-only parallèles, rapports dans ACCADEMY OPAYS/audits/ph2/)
| Carte | Subagent | Fichiers | Résultat attendu |
|---|---|---|---|
| P2-1 Audit admin (UX/fonctions hub+dashboard) | SA-ADMIN | admin/index.html, formateur-dashboard.html, scripts/build_admin.js | audits/ph2/admin.md |
| P2-2 Audit Classroom (OAuth/gateway/courses/rosters LIVE read-only) | SA-CLASSROOM | deploy/classroom-gateway/server.js, admin/classroom.html, docs/classroom | audits/ph2/classroom.md |
| P2-3 Audit 18 modules vs programme officiel | SA-MODULES | data/modules.js, modules/*/presentation.html, systeme-operationnel/ | audits/ph2/modules.md |
| P2-4 Audit parcours apprenant | SA-APPRENANT | public/, landing, docs/onboarding | audits/ph2/apprenant.md |
| P2-5 Audit parcours formateur | SA-FORMATEUR | admin/, docs/operations, systeme-operationnel/03,06,07 | audits/ph2/formateur.md |
| P2-6 Audit sécurité/permissions | SA-SECURITY | deploy/*.sh, nginx conf, gateway, scripts/test_*.js | audits/ph2/securite.md |

---

# PHASE 2B — OPERATIONAL ACADEMY (ouverte 09/09)
> Objectif : passer du cockpit de préparation au produit pilotable : Classroom → apprenants → missions → dépôts → évaluation → progression → formateur/admin. Règles : aucune donnée simulée ; empty state + TODO explicites ; TEST DATA ≠ PRODUCTION DATA ; ne pas toucher aux LOCKED (identité Phase 1, programme, animations) ; gate à chaque lot.

## DÉCISIONS RÉSOLUES PAR PREUVES (pas arbitraires)
| Question | Preuve | Décision |
|---|---|---|
| Ordre M14-M18 | 01_PARCOURS + 02_CALENDRIER : S14=M16, S15=M17, S16=Soutenances (M15+M18) — le registre est conforme | ✅ DELIBERE — aucun changement |
| dateDebut faux | consommé par 0 code, marqué TODO_ADMIN | ✅ `null` + UI « Date de début : À définir » (champ admin prêt) |
| Rôles/permissions | gateway Node natif zéro-déps existant + tokens Google déjà en main | ✅ Architecture retenue : **identite+etats operationnels dans le gateway (sessions+roles+roster), contenu reste statique, Classroom = source de verite des inscriptions/devoirs/depots/notes** (analyse complete A/B dans audits/ph2/contrat-api.md §0) |
| Tarifs landing | data/cohorte.js : 50 $ standard / 100 $ premium (donnees Academy reelles) | ✅ la landing (course.opays.io) est deja alignee ; le site vitrine hoja-academy.com reste PRIX_A_DEFINIR (separe) |

## TODO → IN PROGRESS (cette salve)
| # | Carte | Resp. | Fichiers | Dep. | Tests | Etat |
|---|---|---|---|---|---|---|
**P2B-1 DONE** | Architecture roles+permissions | Orchestrateur | identity-api.js (nouveau, 478 l.) + hook server.js (additif) + contrat-api.md + Dockerfile/deploy-gateway.sh + nginx auth_request /ui/suivi+/ui/cockpit + test_identity_2b.js | — | **29/29 tests verts** (scrypt, roles, brute-force 429, authz 401/403, legacy non-regression) | DONE ✅ |
| P2B-2 | Classroom opérationnel backend | Orchestrateur | identity-api.js — GET coursework (courseWork.list), GET submissions (studentSubmissions `courseWork/-` + email map roster, conformes doc officielle vérifiée par web_search/web_extract), POST invitations (409 honnête sans scope rosters), import roster, feedback (studentSubmissions:return + patch assignedGrade), mapping Mission M0N / Devoir N / Semaine N <-> modules | P2B-1 | test 29/29 + mock 9099 ✅ | DONE ✅ |
| P2B-3 | Dashboard apprenant `ui/campus/` | SA-LEARNER ✅ + orchestrateur (banniere mustChange -> VRAI form /api/password) | ui/campus/index.html | contrat+mock | 21/21 + 7/7 UI + identity 34/34 | DONE ✅ |
| P2B-4 | Missions+depots (endpoints + etats reels + empty states) | gateway + ui/suivi | identity-api + suivi | P2B-2 | DONE |
| P2B-5 | Cockpit formateur `ui/suivi/` | SA-FORMATEUR 429 -> REPRIS 100% orchestrateur | ui/suivi/index.html (21 Ko) | contrat | UI suite desktop+mobile, sheet+select correction | DONE ✅ |
| P2B-6 | Progression reelle (NEW/CLAIMED/RETURNED/DRAFT -> vocab UI ; % = graded uniquement, jamais estime) | gateway + UI | /api/progress + campus/suivi | P2B-2 | DONE |
| P2B-7 | Cockpit admin `ui/cockpit/` | SA-ADMIN (429 fin, livraison recue) + orchestrateur : EXPECTED_SCOPES corrige | ui/cockpit/index.html (28 Ko) | contrat | UI suite + vision | DONE ✅ |
| P2B-8 | Securite : ALLOWED_ADMIN_EMAILS+BOOTSTRAP, token/users 0600, sessions+logout, /api/password, brute-force, auth_request nginx | Orchestrateur | server/identity/deploy | P2B-1 | DONE (rotation mdp apprenant prod = GO humain) |
| P2B-9 | QA mobile 375px : 4 surfaces (login/campus/suivi/cockpit) + tap sheet | Orchestrateur (qa_mobile_2b.js) | workspace/qa_mobile_2b.js | P2B-3..7 | **5/5 ✅** (cibles >=44px, 0 overflow, modale fermable, brand small 8-9px->10px corrige) | **DONE ✅** |
| P2B-10 | E2E apprenant/formateur/admin/security + release complete | SA-QA | tests | tous | BACKLOG |

## BLOCKED — DECISIONS HUMAINES (reelles, minimales)
| Carte | Attend | Peut avancer sans ? |
|---|---|---|
| Peuplement Classroom production | vrais emails des apprenants de la Cohorte 01 | OUI : pipeline + interface import + validation + etats, mocks de TEST uniquement |
| Renommage classe Classroom + form inscription (live) | GO humain (mutation prod) | OUI : script prepare (personalize-classroom.sh existe) |
| Deploiement prod VPS | GO humain (redeploy) | OUI : tout build/tests locaux |
| Entite legale editeur (mentions legales site vitrine) | info juridique | OUI : espaces autres sans mention legale |

## BRANDING ESPACE PRIVE — MATRICE (P2B-11, avant toute modification)
| Categorie | Exemples | Regle |
|---|---|---|
| Marque produit visible | titles, brand, kickers « Académie OPAYS », « OPAYS Academy », footer © marque, « CERTIFIÉ OPAYS ACADEMY », « réseau Alumni de l'Académie OPAYS », realms auth (ASCII !), landing publique course.opays.io | → **HOJA ACADEMY** |
| Identifiants techniques | `OPAYS_MODULES`, `OPAYS_COHORTE`, classes/CSS, noms de fichiers, commentaires de code | **CONSERVER** (invisibles, risque vs stabilite) |
| Editeur/legal | entite juridique, mentions legales, © legal | **NE PAS INVENTER** — hors périmètre (bloque humain) ; © de marque devient « © HOJA ACADEMY » |
| Infra/contacts | course.opays.io, opaystech@gmail.com, VPS, git | **CONSERVER** (domaines reels, non decoratifs) |
Regle d'or : modifications AUX SOURCES (data/, scripts/templates/, modules/, course-hub, formateur-dashboard, build_landing) puis rebuild — jamais les builds admin//public/ a la main. Realms nginx ET gateway doivent rester STRICTEMENT IDENTIES et ASCII (partage des credentials).

### CLOTURE DU LOT P2B-1→9 (09/16h50) — commit git 2e... (academy)
- Revues DONE : campus (agent, 21/21 + banniere mot de passe branchee par l'orchestrateur), suivi (429 -> repris orchestrateur), cockpit (agent 429-fin, EXPECTED_SCOPES corrige : l'agent citait 2 scopes Google INEXISTANTS -> fausses alertes ; retest 0 erreur console).
- Release pipeline verte (18/18, 72/72, 13/13, 21/21, 16/16, 34/34, kit 9/9). Gate branding site vitrine PASS + relock propre. QA mobile 2B 5/5.
- RESTE P2B-10 : E2E sur gateway REEL (deploiement) + suite E2E scenarises = BLOQUE GO DEPLOIEMENT (voir decisions).

## P2B-10 — E2E + PRODUCTION READINESS (lot final 09/09 ~21h15)
| Sous-carte | Resp. | Livrable | Verif | Etat |
|---|---|---|---|---|
| P2B-10.1 E2E learner (login→me→mission→depot→note→progression) | Orchestrateur | scripts/test_e2e_2b.js (63 checks) | PASS — done=0->1->2, states submitted/returned/graded exacts, next chain correct | DONE ✅ |
| P2B-10.2 E2E formateur (UI matrice→sheet→correction→retour apprenant) | Orchestrateur | idem (puppeteer) | PASS — correction UI -> graded cote apprenant, cloisonnement OK | DONE ✅ |
| P2B-10.3 E2E admin (cockpit UI + whoami redirect) | Orchestrateur | idem | PASS — 0 erreur console apres phase anonyme attendue | DONE ✅ |
| P2B-10.4 Permission penetration (codes HTTP exacts) | Orchestrateur | lignes 5-14 du rapport e2e | PASS — 403/401 partout, /authz suivi/cockpit OK | DONE ✅ |
| P2B-10.5 Progression integrity | Orchestrateur | lignes 21-37 | PASS — depose!=valide, a-refaire!=valide, hors-bareme 400 (garde serveur AJOUTEE), next=module quand tout graded | DONE ✅ |
| P2B-10.6 Classroom etats A-G | Orchestrateur | modes fixtures du VRAI gateway (GATEWAY_FIXTURES — transport simule, code metier reel, ecritures reelles dans fixture tmp) | PASS A/F/G (vide, token, scope-insuffisant 409) ; B/C/D/E couvertes par chaine 10.1/10.2 | DONE ✅ |
| P2B-10.7 Production audit | Orchestrateur | audits/ph2/runbook-production.md | bundle 149 entrees (ui/ inclus, zero fixture, Dockerfile verifie), env SET/MISSING, volumes, rollback, ordre gateway->site | DONE ✅ |
| P2B-10.8 Backup/rollback | Orchestrateur | VPS /opt/opays-academy/backups/ tag 20260909-1858 (site+gw-server+gw-env 600+bundle) + token 600 applique | procede documente, rien supprime | DONE ✅ |
| P2B-10.9 Smoke QA mobile | Orchestrateur | qa_mobile_2b.js | 5/5 ✅ (post-fige des fixtures : meme suite repassee) | DONE ✅ |
| P2B-10.10 Release gate | Orchestrateur | npm run release (avec test:e2e integre) | EXIT=0 ; E2E 63/63 ; identity 34/34 ; 18/18/72/13/21/16/9 ; gate branding vitrine PASS src+out | DONE ✅ |
| P2B-17 Matrice renommage | Orchestrateur | audits/ph2/renommage-matrice.md | ~10 visibles + 4 realms + classe/form Google = vrais choix ; variables tech = garder ; domaine = garder (consigne) | REVIEW → DECISION GO |
Corrections de bugs trouves pendant P2B-10 (tous testes) : parseMissionNum ne reconnaissait pas « Mission M01 »/« Devoir 3 » (mapping missions->modules) ; MIME texte brut pour les chemins /ui/x/ (Chrome telechargeait -> ERR_ABORTED) ; garde de note hors bareme cote serveur ; waitUntil 'commit' invalide en puppeteer 25 ; Logo/favicon+logo-opays restaures depuis git (build_landing les exigeait).


---

# PRODUCTION ONBOARDING (section de pilotage — pas un chantier dev)
> Mode : DEPLOY / ONBOARD / OBSERVE. Développement du cycle CLOSED (P2B-1→10 = DONE, validés par Fénelon).
> Commit cible prod = `5ad318b` (academy). Bundle prêt : `deploy/academy-bundle.tar.gz` (sha256 05c3713c…, 4 pages ui/, zéro fixture — seuls « test » présents = fiches pédagogiques légitimes M06/M10).
> Backup/rollback VPS prêt : tag `20260909-1858`. Runbook : audits/ph2/runbook-production.md. Matrice renommage : audits/ph2/renommage-matrice.md.
> Pré-vol final 09/09 ~21h20 : syntaxes gateway/tests OK · dateDebut=null (2026-09-07 jamais réintroduite) · Dockerfile ne copie que server/identity/registry · prod actuelle saine (/, /health 200, /admin 401).

| Carte | Attend | Statut |
|---|---|---|
| DEPLOYMENT | ✅ **EXÉCUTÉ 10/09** (GO reçu) : gateway→site, smoke 22/22 PASS, mobile 8/8 PASS, rollback go-20260910-1009, commit e5f279f. Rotation LEARN_PASS faite sur le VPS (nouvelle valeur 600 dans .secrets/learn-pass, jamais affichée) | DONE ✅ |
| REAL ROSTER | Vrais noms+emails Cohorte 01 (Fénelon) | TODO |
| CLASSROOM INVITATIONS | Roster réel + GO (re-consentement scope rosters d'abord) | TODO (dépend REAL ROSTER) |
| CLASSROOM COURSEWORK | GO publication kit (gate écriture temporaire, puis retrait) | TODO |
| COHORT START DATE | dateDebut réelle (Fénelon) → env COHORT_START + data/cohorte.js | TODO — UI « À définir » en attendant |
| BRANDING PRIVATE SPACE | GO forme exacte (HOJA ACADEMY visibles + realms ; technique/variable/domaine conservés) | TODO — passe unique après deploy |
| FRONTEND PUBLIC NEXT.JS | ✅ 10/09 14h20 : FORENSIC — le vrai frontend Hoja = projet Next.js C:\LAPOSTE\Projets\clones\academiartificial\app (output export out/, gate PASS, QA 48/48 rejouee sur le build frais avec NEXT_PUBLIC_SITE_ORIGIN=course.opays.io). La landing academy build_landing.js = LEGACY (rebrand 10/09 ne sert plus ; documente legacy, non supprime). Deploie via overlay /tmp/hoja-public.tar.gz dans deploy-vps-academy.sh (modules/admin/ui NON ecrases, verifie) + nginx $uri.html + cache (_next immutable, HTML no-cache). Backup pre-deploy pre-hoja-next-20260910-1216. Verifie de l'exterieur : 20 pages 200, 404 strict OK, smoke Next.js Hoja ✅, vision desktop+mobile = site Next reel (pill nav, hero, particules). 2 assets decoratifs 404 PREEXISTANTS (ditto.css, identiques en local). | DONE ✅ |
| BRAND RACINE PUBLIQUE | ✅ 10/09 post-go : la racine servait la landing 'OPAYS Academy' (build du repo academy, pas l'ancien hub). Rebrand cible HOJA ACADEMY (12 remplacements localises dans build_landing.js, PAS de global) + favicon Hoja ; verifie de l'exterieur + vision mobile. L'ancien 'Académie OPAYS — Ressources' n'etait en fait servi nulle part (cache navigateur du signalement). | DONE ✅ |
| PRODUCTION OBSERVATION | Après GO : logs [academy], cookies, erreurs Classroom, questions réelles des premiers apprenants (règle des 5 min en conditions réelles) | BACKLOG |


## PHASE CONTENU & POSITIONNEMENT (10/09 soir — terminee, deployee)
| Carte | Travail | Etat |
|---|---|---|
| NAV FR + menu cible | Pourquoi Hoja (ancre #pourquoi-hoja), Formations dropdown 5 entrees, A propos, Entreprises, Actualites, Contact, CTA Postuler->/postuler unique; pill elargie 740px (fix wrap 1366); 2 inline menus home alignes | DONE ✅ |
| POLE FORMATIONS | hub /formations + expert-ia + automatisation-n8n + robotique (strictement descriptif, 0 labo invente) + ia-recherche-sciences (cadre « l'IA assiste, ne remplace pas ») + /formations/programme-intensif (ex-curso-ia). Agent vague1 (429 final mais livraison complete verifiee) | DONE ✅ |
| A PROPOS | /institution -> /a-propos : « Hoja Academy = branche academique IA de Hoja Network » + fait verifie HOJA=Discussion (swahili) ; 14 refs Hoja Network ; logo rond vectorise Academia Artificial remplace par logo Hoja ; faux reseaux -> WhatsApp/Email/Hoja Network | DONE ✅ (429 agents x2 -> orchestrateur) |
| ENTREPRISES | decideurs : hero « L'IA ne doit pas rester une experimentation », 5 cibles (privees/publiques/cabinets/recherche/sante), 5 offres, demarche Diagnostic->Accompagnement, CTA « Parler de votre organisation », tarif « sur demande », references = empty state sobre | DONE ✅ (agent vague2) |
| CONTACT + POSTULER | wa.me/243792369704 bouton + +243 792 369 704 + 0792369704 ; formulaires mailto COMPOSES honnetes (message explicite « aucune donnee stockee ») ; postuler : pourquoi/pour qui/etapes (candidature->echange->validation, « ne garantit pas une place »), champs dont domaine, cohorte/tarif « a definir » | DONE ✅ (agent vague2) |
| ROUTES & SEO | dossiers renommes FR (a-propos/entreprises/actualites/contact/mentions-legales/confidentialite/cookies/accessibilite) ; routes mortes ES supprimees (cursos hors programme-intensif, afiliados, registration WP mort, reset-password) ; 14 redirections 301 legacy->FR dans nginx ; sitemap 15 URLs FR ; metadata/OG/JSON-LD Hoja Network ; alt FR | DONE ✅ |
| NETTOYAGE IDENTITE | Brevo retire 10 fichiers (dont 5 reparres apres decoupe imparfaite ; erreur JSX button orphelin reparee) ; faux profils sociaux 0 (verifie 404 avant retrait) ; « formacion » visibles -> FR ; logo navbar = deja Hoja (md5=logo officiel) ; asset f6f5a0c5ba99.webp (404 absent site source) regle CSS mobile neutralisee | DONE ✅ |
| QA FINALE | build 23/23 gate PASS src+out relock propre ; QA locale 48/48 (16 pages x 3 viewports : 0 overflow/alt/console/lien-mort) ; QA prod mobile 11/11 ; smoke prod 23/23 ; redirections 301 verifiees depuis l'exterieur ; vision desktop+mobile home/entreprises/postuler | DONE ✅ |
| NOTES VISUELLES | 2 nuances heritees du squelette reference (non bloquees) : hero entreprises mobile = main decorative chevauchant legerement le sous-titre ; marges verticales hero irregulieres. Squelette conserve par consigne — a traiter uniquement sur demande explicite. | DOCUMENTE |
| BACKUP | pre-hoja-fr-20260910-1822 verifie ; rollback = deploy-vps avec ancien paquet ou cp -a backups | PRET |


## POLISH UX FINAL (10/09 ~19h30) — LOCKED 🔒
- Hero Entreprises MOBILE uniquement (max-md) : calque mains repositionne en bas du bloc (background-position 50% 100%) + gap CTA serre (gap-3). Desktop/tablete = design du squelette d'origine INCHANGE. Vision confirme : sous-titre degage, CTA lisibles et grouples, hierarchy identique.
- Emojis herites du CLONE retires (non ajoutes par nous) : alt « 📩 » x2 (page + el-futuro-section), « ✔ » entreprises.
- Tablet 768 : la composition mains/texte reste celle du template source (non signalee comme defaut dans le polish demande ; retouche = toucher le squelette -> documente, non modifie).
- Gates finaux : build 23/23 ✅ · hoja_final_gate PASS src+out ✅ · relock propre ✅ · qa_hoja 48/48 ✅ · audit prod externe 15/15 ✅ · mobile prod 11/11 ✅ · smoke 23/23 ✅ · redirections 301 ✅ · wa.me 302 ✅.
- Deploye (frontend seul, overlay hoja-public.tar.gz) ; backup pre-deploiement : pre-hoja-polish-20260910-1925 (+ pre-hoja-fr-20260910-1822 + go-20260910-1009 + 20260909-1858) ; commit academy 1762282. Backend Phase 2B non touche. dateDebut=null intact.
- PHASE LOCKEE : aucune nouvelle phase sans directive explicite de Fénelon.


## CORRECTION FRONTEND COMPLETE (11/09 — apres feedback Fénelon) — VERROUILLEE
- Cause reelle des 404 : liens avec SLASH FINAL (/formations/ etc.) — nginx ne connaissait que formations.html. Double correction : src sans slash + filet nginx rewrite « /x/$ -> /x » 301. Vérifié externe : 15 routes 200, slash 301, ancêtres 301.
- « Pourquoi Hoja » SUPPRIME (nav composant + 2 navs inline home + ancre) ; « À propos » SUPPRIME (dossier route + toutes refs + menu + sitemap ; /institution et /a-propos -> 301 racine). Aucune route morte introduite.
- Menu cible partout : Formations▾(4 domaines) · Entreprises · Actualités · Contact · CTA Postuler — aligne sur les 9 pages inline clones + composant navbar (script scripts/align_menus.py) + pad meta/styles.
- DESIGN SYSTEM : composant PageHero (sections/page-hero.tsx) = meme langage que le hero d'accueil (video mesh, kicker primary, gros titre background, bouton bord, bandeau emblème) ; branchées sur /formations hub + 4 domaines + /postuler (script scripts/wire_page_hero.py). Vision production confirme 6/6 points identiques accueil<->formations<->postuler.
- Footer : resaisi sociaux reels (WhatsApp/Email/Hoja Network, liens 404 prouves retires), « Programme Partenaires » -> Entreprises.
- Gates : build 22/22 PASS · hoja_final_gate PASS src+out · relock propre · qa_hoja 45/45 · qa_hoja_fr 45/45 · audit liens/assets internes 0 lien cassé · audit prod externe 14/14 · mobile prod 11/11 · smoke VPS 25/25 (controles anti-slash + 301 inclus).
- Deploy : backup pre-hoja-system-20260911-0920 verifie ; overlay hoja-public 258 fichiers ; backend Phase 2B NON TOUCHÉ ; commit academy ead4852.


## PASSE EDITORIALE + DROPDOWN (11/09 soir — feedback Feneelon)
- Dropdown Formations : DittoWire reecrit (hover + clic sticky + zone morte couverte + Enter/Espace/Echape + mobile burger). Test reel 19 cas x3 pages + mobile : PASS, verifie AUSSI en production.
- Contraste : libelle 'Formations' ouvert etait gris pale (rgb 198,197,201) sur pill blanche -> rgb(20,15,33) (3 pages touchees). Vision confirme.
- Edito home : slogans template reecrits sobrement ('L'IA ne vaut que si vous l'appliquez', 'Ce qui est inclus', 'Certification par la preuve', mission Hoja Network concrete) ; bloc newsletter Brevo mort (form EMAIL/J'accepte) SUPPRIME + conteneur sib-form-container retire ; 'Avisos' a11y -> 'Menu'.
- programme-intensif : fausse note 4,8/5 + etoiles + lien Trustpilot SUPPRIMES ; form sib-form 'Dossier de formation' SUPPRIME ; slogan 'NE LAISSEZ PAS LA REVOLUTION...' reecrit ; 'Groupes reduits - promotion limitee' (sans faux chiffres).
- accessibilite : 51 ko de declaration legale ESPAGNOLE fausse (organismes ES, widget inexistant, dates inventees 11/2024) -> remplacee par 3 paragraphes honnetes (WCAG 2.1, contact email/WhatsApp). ListRow5_* morts supprimes. 'No obstante' -> 'Toutefois'.
- actualites : bouton sibforms 'S'inscrire gratuitement' -> lien /contact honnete. entreprises/contact/postuler : formulations reecrites concretes.
- Regle appliqusee : rien d'invente ; suppression > remplissage ; 0 faux temoignage/partenaire/chiffre/date.
- QA : build 22/22, gate PASS, qa_hoja 45/45, qa_hoja_fr 45/45, audit prod 14/14 (0 '4,8'/'trustpilot'/'El sitio' en prod), smoke ALL PASS, mobile 11/11, dropdown prod PASS. Commit academy 99c0cea. Backup VPS pre-hoja-editorial (155 Mo). Backend intact (overlay seul deverse, htpasswd/nginx/ui non touches).


## MOBILE-FIRST + DROPDOWN DEFINITIF + ACTUALITES SUPPRIMEE + LOGIN GOOGLE (11/09 soir — feedback Feneelon)
- DROPDOWN : cause racine trouvee = DEUX systemes de menu divergents (pages clonees via DittoWire inline ; pages formations/postuler via <Navbar/> statique SANS JS -> panneau jamais ouvert, etat actif lave par les specs capturees). Fix : sections/navbar.tsx reecrit en composant client unique (hover-intent 250ms sans zone morte, clic sticky, Enter/Espace/Echap, Escape, clic exterieur, accordéon tactile mobile). Entrées : texte color-001 sur fond blanc TOUJOURS, actif = puce verte + gras (jamais de texte clair). Test reel 71 cas (7 pages desktop x 8 scenarios + 4 scenarios mobile) : PASS local ET production.
- MOBILE FIRST : audit reel par page (390px, scroll complet, captures) : 0 overflow, 0 element coupe, 0 carte ecrasee (grilles -> 1 colonne), 0 cible <44px (burger corrige), 0 texte clippe, footer blanc. 14/14 pages PASS. Header : fond navy opaque au scroll (corrige le logo fantome sur texte), CTA Postuler masque sur mobile (deja present dans le panneau), burger sans boite fantome.
- ACTUALITES : supprimee completement (page, menu, sitemap, liens, CTA, chunk). /actualites -> 404 ; /noticias-ia -> 301 / ; anti-slash retire.
- FOOTER : les 8 pages inline (16 ko chacune, avec 2e dropdown MORT jamais cable) remplacees par <Footer /> partage. Tout le texte blanc (tokens existants) ; dropdown mort du footer -> 4 liens Formations directs ; selecteur EN/FR mort retire ; description vague -> phrase Hoja reelle ; CTA Postuler texte blanc.
- EDITORIAL (fin de passe) : 4 fausses cartes « Temoinage d'apprenant — bientot disponible » -> 1 phrase honnete ; « Avisos » -> supprimes ; 51 ko de declaration legale ESPAGNOLE fausse (accessibilite) -> 3 paragraphes honnêtes ; form Brevo mort, 4,8/5 + Trustpilot inventes -> supprimes. Residu generique prod audite : 0.
- ADMIN GOOGLE (demande Feneelon) : gateway additif /oauth/login -> 302 Google (scopes openid email profile, prompt select_account) -> callback cree session cookie admin SI email dans ALLOWED_ADMIN_EMAILS ; ne touche PAS au token Classroom (writeToken jamais atteint en mode login) ; non-listes -> 403. ui/login : bouton « Continuer avec Google » sous separateur ADMINISTRATION. Teste : 302 prod OK, googleSession unitaire VPS OK (admin OK / autre refuse / cookie Secure+HttpOnly), identity 34/34, smoke ALL PASS. Le clic de consentement reel = a faire une fois par Feneelon (opaystech@gmail.com autorise).
- QA : build 22 pages, gate PASS, qa_hoja 42/42, qa_hoja_fr 42/42, audit prod 13/13, mobile prod 10/10, dropdown prod 71/71. Commit academy 2d9ecd4. Backup VPS pre-hoja-mobile (155 Mo). Backend : seul additif /oauth/login + googleSession + bouton login ; auth/roles/sessions/Classroom/roster/progression/dateDebut=null intacts.
