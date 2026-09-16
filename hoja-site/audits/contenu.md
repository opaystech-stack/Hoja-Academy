# Adaptation du contenu HOJA ACADEMY — journal des modifications
> Source de vérité : `audits/programme-hoja.md`. Backups des fichiers originaux : `audits/backup_content/`.
> Règle respectée partout : uniquement du texte remplacé (aucune modification de structure JSX, className, data-ditto-id, href, animations). Vérification : comptes ouvrants/fermants de div/section/p/li/ul (+ a, span, h1–h3, strong, em, ol, table, header, footer, nav, form, button, select, label, blockquote, b, i) identiques backup ↔ fichier actuel pour **22/22 fichiers**. Encodage UTF-8 sans BOM vérifié.

## 1. src/app/content.ts (4 lignes)
- `label: "Expert en LLMs & ChatGPT"` → `"IA & ChatGPT — Expert"` (listRowData + listRowData2).
- `label: "Expert en Gemini & Multimodal"` → `"IA Google & Gemini — Expert"` (×2).
- `Programme Intensif IA` gardé ; tous les href intacts ; réseaux sociaux (ListRow8 etc.) intacts.

## 2. src/app/curso-ia/page.tsx (58 lignes)
- **Hero** : ajout de la ligne résumé `18 modules · 4 blocs · une soutenance certifiante.` (≈L519) + compteurs `8 Semaines` / `18 modules` (≈L586–597).
- **4 blocs** (section `Les 4 blocs du programme`, ≈L2059–2190) : BLOC 1 Fondamentaux & usage personnel (M1–M5) · BLOC 2 Skills, workflows & assistants (M6–M9) · BLOC 3 Agents, écosystèmes & sécurité (M10–M13) · BLOC 4 Automatisation, quotidien & spécialisation (M14–M18) — chaque bloc liste ses modules en titres courts + objectif (C.O.R.E., pyramide des sources, Agent.md, MCP…).
- **Méthode** : tableau `FeatureCard2_data` = APPRENDRE / PRATIQUER / CONSTRUIRE / PRODUIRE avec les descriptions du programme (plus aucune mention « DEAC » en texte visible ; `mark_deac` restant = id SVG interne, non affiché).
- **Format** : `ACCÈS EN DIRECT` → `sessions live de 90 à 120 minutes en visioconférence, 2 fois par semaine, en SEULEMENT 8 semaines` ; `GRABACIONES` (espagnol hérité) → `ENREGISTREMENTS` ; ressources par module (guide, fiche synthèse, fiche pratique, exercices) ; accès à vie.
- **Projet final** : soutenance « My AI Work System », certification par preuve de compétence, sessions mensuelles AI Update.
- **Avis** reformulés sans personas nommés ; mentions d'outils → « sélection indépendante, sans accord avec des tiers ».
- **BLOCS PRIX (920 €, 100 € reservation…)** : TOUCHÉS UNIQUEMENT POUR NETTOYER LES TRACES HÉRITÉES PRÉ-EXISTANTES SI PRÉSENTES — sinon intacts (décision utilisateur en attente). Vérifié : aucun prix hérité restant dans le texte visible hormis le bloc prix d'origine laissé tel quel.

## 3. src/app/page.tsx (27 lignes) + sections
- **4 cartes « Ce que vous allez accomplir »** (≈L1265+) reformulées dans le vocabulaire Hoja :
  1. modèles, agents, workflows adaptés à vos cas d'usage réels ;
  2. livrables réels dès la première séance (prompts, assistants, automatisations) — « fini la théorie » ;
  3. automatisation des tâches répétitives, workflows mesurables, résultats concrets ;
  4. spécialisation robotique & IA pour la recherche (médecine, science, modélisation mathématique).
- Section méthode : titre `Notre méthode : apprendre, pratiquer, construire, automatiser, produire` (plus de « DEAC ») ; accordéon FAQ `Notre méthode et évaluation`.
- `sections/metodolog-propia-deac-section.tsx` (10 lignes) : h2 = « Notre méthode : apprendre, pratiquer, construire, automatiser, produire » ; 4 cartes APPRENDRE/PRATIQUER/CONSTRUIRE/PRODUIRE réécrites (problem-first, cas d'usage réel, livrables assistant/agent/workflow, soutenance My AI Work System + certification HOJA ACADEMY). Nom de fichier/composant inchangés.
- `sections/hero-section.tsx` : inchangé (texte déjà aligné). `sections/feature-grid-section.tsx` (1) + `feature-grid-section2.tsx` (2) : titres features adaptés (agents intelligents, workflows & automatisations ; multimodal ; sans code complexe ; ateliers dirigés).
- `sections/en-solo8-section.tsx` (2 lignes) : « 8 semaines » gardé ; « 60 outils » → `une soixantaine d'outils`.
- `sections/el-mundo-est-section.tsx` (7 lignes) : visioconférence / sessions live enregistrées / ateliers, formulation Hoja.

## 4. src/app/institution/page.tsx (9 lignes)
- Paragraphe institution : ajout de la phrase `Nous proposons également une spécialisation en robotique et IA appliquées à la recherche en médecine, en science et en mathématiques.`
- Reste : apprentissage par la pratique, problem-first, aucun nom de personne.

## 5. Formations expert — src/app/curso-de-chatgpt | curso-de-gemini | curso-de-make (127 / 128 / 102 lignes)
- Listes de leçons héritées remplacées dans les sections programmes par **7–9 modules courts alignés** :
  - **ChatGPT** : Premiers pas · Comprendre les modèles (LLM, raisonnement, multimodal) · Formats & Canvas · Instructions, mémoire & projets (prompts C.O.R.E.) · Créer vos assistants (GPTs) · Skills métiers réutilisables · Recherche & fonctions utiles + ateliers (API, mode agent, voix, écosystèmes).
  - **Gemini** : Premiers pas · Modèles, prompts & contexte · Deep Research & documents · Personnalisation, mémoire & Gems · Écosystème Google (Gmail, Docs, Sheets, Drive) + ateliers NotebookLM / AI Studio / multimodal (Veo, images, voix).
  - **Make** : Fondements de l'automatisation sans code · Interface & réglages · Webhooks, APIs & clés · Scénarios · Agents IA & MCP · Make Grid · Connecteurs + ateliers (Blueprints, logs, sécurité/usage responsable).
- Les `label:` courts des tableaux `Tile_data*` (type « 1.1 Premiers pas ») restent des intitulés de chapitres génériques en français, alignés sur ces axes ; href `hoja-academy.com/courses/...` intacts (structure).
- Tout formateur nommé → `Notre équipe pédagogique réunit des praticiens de terrain…` ; zéro personne héritée (conoceme/« Comment avance ce cours » : plus aucun nom).
- Aucun chiffre inventé ; only 8 semaines / 18 modules / 90–120 min (pages curso-ia uniquement).

## 6. src/app/empresas/page.tsx (17 lignes)
- `✔ 700 profesionales` → `✔ De nombreux professionnels`.
- Carte `Plus de 500.000 abonnés sur YouTube` retirée → remplacée par valeur neutre `Approche 100 % appliquée aux cas réels` (ListRow6_data2).
- Liste formations entreprise : `Programme intensif : 8 semaines, 18 modules, application pratique au travail` + carte `Accompagnement tout au long du processus et spécialisation robotique & IA pour la recherche`.
- Cartes expert : titres `Expert en ChatGPT/Gemini/Make` conservés (titres de cours courts), descriptions alignées outils/agents/automatisation ; aucune donnée d'impact inventée.

## 7. Pages annexes (4–5 lignes chacune — nettoyage des traces, pas de contenu nouveau)
`accesibilidad/`, `aviso-legal/`, `contacto/`, `noticias-ia/`, `politica-de-cookies/`, `politica-de-privacidad/`, `programa-afiliados/`, `registration/`, `reset-password/` : labels/titres résiduels en espagnol ou hérités traduits/adaptés (structure et liens intacts).

## Interdits — vérification finale (grep sur src/app)
- Alejavi / Jose Moral / Yago / FUNDAE / Universidad Isabel I / ECTS / red.es / Kit Digital / « alumnos » / « profesor » / 700 professionals / 500.000 abonnés / 30 M vues / 99,2 % : **0 occurrence en texte visible**.
- Les ids SVG `mark_deac`, `icon_grabaciones`, `data-name="…"` espagnols sont des identifiants internes (non affichés) — laissés pour ne pas casser styles/animations.
