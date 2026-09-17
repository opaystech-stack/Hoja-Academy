// Data definitions for Modules 02 to 06 with Comprehensive Multi-Slide Decks

const modules_02_to_06 = [
  // ==================== MODULE 02 : ÉCOSYSTÈME IA ====================
  {
    moduleNumber: 2,
    moduleCode: "02-ecosysteme-ia",
    moduleTitle: "Découvrir l'Écosystème de l'IA",
    moduleSubtitle: "Comprendre les Familles & Savoir Choisir",
    chapterNames: [
      "OUVERTURE & LE FLUX DES OUTILS",
      "LES 5 GRANDES FAMILLES D'IA",
      "DÉMONSTRATION COMPARATIVE",
      "LA RÈGLE DES 5 QUESTIONS",
      "ATELIER MÉTIER & MISSION"
    ],
    resources: {
      compPrompt: {
        category: "DÉMONSTRATION",
        title: "Prompt Test Comparatif Multi-Modèles",
        objective: "Tester la même consigne sur ChatGPT, Claude et Gemini pour comparer le style et la rigueur.",
        description: "Envoyez exactement ce prompt dans 3 fenêtres différentes.",
        prompt: `Agis en tant que conseiller d'orientation pour cadres d'entreprise.
Donne-moi 3 recommandations stratégiques pour moderniser la communication interne d'un ministère de 500 agents avec des solutions concrètes et adaptées au contexte africain.`
      },
      q5Prompt: {
        category: "ATELIER PRATIQUE",
        title: "Prompt Audit d'un Nouvel Outil IA",
        objective: "Faire analyser une nouvelle application par l'IA pour savoir quel moteur elle utilise.",
        description: "Remplacez le nom de l'application par celle que vous venez de voir en ligne.",
        prompt: `Agis en tant qu'auditeur de solutions logicielles IA.
Voici un outil que je viens de découvrir : [NOM DE L'OUTIL OU DU SITE].
Réponds précisément à ces 3 questions :
1. Quel modèle / LLM utilise-t-il sous le capot (OpenAI, Anthropic, Open Source) ?
2. À quelle famille d'outils appartient-il (Assistant, Recherche, Médias, Automatisation) ?
3. Quels sont ses 2 cas d'usage majeurs en entreprise et ses limites de confidentialité ?`
      },
      searchPrompt: {
        category: "ATELIER PRATIQUE",
        title: "Prompt Recherche Factuelle & Sources",
        objective: "Utiliser Perplexity / Genspark / Gemini pour sourcer des données précises.",
        description: "À tester dans un moteur de recherche IA pour obtenir des liens vérifiables.",
        prompt: `Quels sont les 3 principaux décrets ou réglementations récentes régissant les marchés publics en RDC ? Donne pour chacun le titre officiel, la date et un lien vers le Journal Officiel.`
      }
    },
    notes: {
      cover: ["Accueillir les participants et rappeler le fil : après la démystification, place à la cartographie.", "Rassurer : pas besoin de connaître 500 outils, juste les 5 familles clés.", "Transition vers la jungle des outils."],
      flux: ["Montrer l'avalanche de logos sur LinkedIn et Twitter.", "Poser la question : 'Avez-vous le vertige face à toutes ces annonces ?'", "Annoncer le soulagement : 90% des outils utilisent les 3 mêmes moteurs."],
      ecosystemChain: ["Détailler l'enchaînement Entreprise -> Moteur -> Application -> Outils -> Agents.", "Montrer que ChatGPT est juste une vitrine commerciale."],
      families: ["Présenter les 5 familles : Assistants, Recherche, Génération Médias, Code, Automatisation.", "Expliquer que chaque famille résout un problème précis.", "Regardons la démonstration comparative."],
      familyDetails: ["Détailler les forces de chaque famille et quand basculer de l'une à l'autre."],
      demoComp: ["Partager l'écran avec ChatGPT, Claude et Gemini côte à côte.", "Lancer le même prompt en direct.", "Faire remarquer les nuances : Claude plus structuré et formel, ChatGPT plus polyvalent, Gemini plus rapide et connecté."],
      rules5Q: ["Présenter la Règle des 5 Questions OPAYS pour auditer n'importe quel nouvel outil.", "Détailler : Moteur ?, Famille ?, Données sécurisées ?, ROI réel ?, Compétence humaine ?", "Passons à l'atelier pratique."],
      workshop: ["Faire tester la grille comparative par chaque participant sur un outil de son choix.", "Inviter à noter les résultats dans le Volet 02 du Work Kit.", "Lancement du devoir."],
      workKit: ["Vérifier que chaque apprenant renseigne sa pile d'outils personnelle dans le Volet 02."],
      mission: ["Expliquer la mission : Choisir 2 outils hors ChatGPT et tester leur pertinence sur une tâche pro.", "Dépôt sur Classroom avant lundi soir.", "Clôture de la séance."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 02 — Découvrir l'Écosystème">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 02</span>
            <h1>Découvrir <em>l'Écosystème</em> de l'IA.</h1>
            <p class="hero-lead">Comprendre les 5 grandes familles, décoder les annonces sans panique et <strong>choisir le bon outil pour chaque tâche</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Explorer l'écosystème</button>
              <button class="secondary" id="openPromptsHero">Boîte à outils</button>
            </div>
            <div class="hero-meta">
              <span>CARTOGRAPHIE CLAIRE</span>
              <span>5 FAMILLES D'OUTILS</span>
              <span>RÈGLE DES 5 QUESTIONS</span>
            </div>
          </div>
          <div class="hero-stage">
            <div class="logo-halo">
              <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
                <g fill="#0066FF">
                  <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                  <rect x="850" y="340" width="100" height="100" rx="16"/>
                  <rect x="960" y="440" width="80" height="80" rx="14"/>
                </g>
              </svg>
            </div>
            <div class="orbit orbit-1">OpenAI & ChatGPT</div>
            <div class="orbit orbit-2">Claude & Anthropic</div>
            <div class="orbit orbit-3">Perplexity & Recherche</div>
            <div class="orbit orbit-4">DeepSeek & Open Source</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="0" data-note="flux" data-title="La Jungle des Outils">
        <div class="scene-inner center">
          <span class="kicker">Démystification</span>
          <h2>Trop d'Outils ? <strong>Une Illusion d'Optique.</strong></h2>
          <p class="lead">Chaque semaine, 50 nouveaux sites "IA" apparaissent. 90 % d'entre eux ne sont que des habillages branchés sur les 3 mêmes moteurs.</p>
          <div class="card reveal" style="border-color:var(--line-blue); background:rgba(0,102,255,0.04); margin-top:16px;">
            <span>L'ENCHAÎNEMENT RÉEL DE L'ÉCOSYSTÈME</span>
            <b style="font-size:22px; color:#fff; margin:12px 0;">Entreprise Créatrice → Moteur (LLM) → Application → Connecteurs → Agent</b>
            <p style="font-size:12px; color:var(--muted);">Ne cherchez pas à tout tester. Maîtrisez les moteurs fondamentaux et vous saurez tout piloter.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="families" data-title="Les 5 Grandes Familles">
        <div class="scene-inner">
          <span class="kicker">Typologie Professionnelle</span>
          <h2>Les 5 Familles d'Outils <strong>selon vos Besoins</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>FAMILLE 1</span>
              <b>Assistants Généralistes</b>
              <p>ChatGPT, Claude, Gemini. Rédiger, résumer, raisonner et analyser des documents.</p>
            </div>
            <div class="card">
              <span>FAMILLE 2</span>
              <b>Moteurs de Recherche IA</b>
              <p>Perplexity, Genspark, Felo. Recherche factuelle en temps réel avec liens et citations vérifiables.</p>
            </div>
            <div class="card">
              <span>FAMILLE 3</span>
              <b>Génération & Présentation</b>
              <p>Gamma, Napkin, Midjourney. Création de diapositives, schémas, infographies et visuels.</p>
            </div>
            <div class="card">
              <span>FAMILLE 4</span>
              <b>Code & Données</b>
              <p>Cursor, GitHub Copilot. Automatisation de scripts, formules Excel avancées et requêtes SQL.</p>
            </div>
            <div class="card gold-border">
              <span>FAMILLE 5</span>
              <b>Automatisation & Agents</b>
              <p>Make, n8n, Zapier + LLM. Exécution de flux multi-étapes sans intervention manuelle.</p>
            </div>
            <div class="card" style="border-style:dashed;">
              <span style="color:var(--ok)">RÈGLE OPAYS</span>
              <b>1 Outil Maître par Famille</b>
              <p>Inutile d'avoir 10 abonnements. 2 à 3 outils bien maîtrisés suffisent pour 95% de votre travail.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoComp" data-title="Démo Comparative Live">
        <div class="scene-inner">
          <span class="kicker">Démonstration du Formateur</span>
          <h2>1 Même Consigne • <strong>3 Résultats Différents</strong></h2>
          <p class="lead">Pourquoi Claude n'écrit pas comme ChatGPT ? Démonstration en direct :</p>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT COMPARATIF MULTI-MODÈLES</span>
              <button class="copy-btn" data-copy="compPrompt">Copier le prompt test</button>
            </div>
            <p class="prompt-text" id="compPromptText">Agis en tant que conseiller d'orientation pour cadres d'entreprise.
Donne-moi 3 recommandations stratégiques pour moderniser la communication interne d'un ministère de 500 agents avec des solutions concrètes et adaptées au contexte africain.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="rules5Q" data-title="La Règle des 5 Questions">
        <div class="scene-inner">
          <span class="kicker">Méthodologie d'Arbitrage OPAYS</span>
          <h2>La Règle des 5 Questions pour <strong>Évaluer un Outil</strong></h2>
          <div class="grid-2 reveal" style="margin-top:12px;">
            <div class="card">
              <span>QUESTION 1 & 2</span>
              <b>Moteur & Famille</b>
              <p>1. Quel moteur tourne sous le capot ? (GPT-4o, Claude, open source ?)<br/>2. À quelle famille appartient-il ?</p>
            </div>
            <div class="card">
              <span>QUESTION 3 & 4</span>
              <b>Sécurité & ROI</b>
              <p>3. Mes données professionnelles sont-elles confidentielles ?<br/>4. Quel est le temps réel économisé par semaine ?</p>
            </div>
            <div class="card gold-border" style="grid-column: span 2;">
              <span>QUESTION 5 (LA PLUS IMPORTANTE)</span>
              <b>La Compétence Humaine</b>
              <p>5. Suis-je capable d'auditer et de corriger le résultat produit par cet outil sans me faire piéger ?</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="workshop" data-title="Atelier & AI Work Kit">
        <div class="scene-inner">
          <span class="kicker">Atelier Pratique & Alignement</span>
          <h2>Complétez le <strong>Volet 02 de votre AI Work Kit</strong></h2>
          <div class="grid-2 reveal">
            <div class="prompt-card">
              <div class="prompt-header">
                <span>AUDIT D'UN NOUVEL OUTIL</span>
                <button class="copy-btn" data-copy="q5Prompt">Copier</button>
              </div>
              <p class="prompt-text" id="q5PromptText">Agis en tant qu'auditeur de solutions logicielles IA.
Voici un outil que je viens de découvrir : [NOM DE L'OUTIL].
1. Quel modèle utilise-t-il ?
2. À quelle famille appartient-il ?
3. Quels sont ses cas d'usage et limites de sécurité ?</p>
            </div>
            <div class="card gold-border">
              <span>WORK KIT • VOLET 02</span>
              <b>Ma Pile d'Outils Personnelle</b>
              <p style="font-size:12px; line-height:1.7; color:#cbd5e1; margin-top:8px;">
                Mon Assistant principal (ChatGPT ou Claude)<br/>
                Mon Moteur de recherche sourcé (Perplexity)<br/>
                Mon Générateur documentaire (Gamma / Office Copilot)
              </p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission Hebdomadaire">
        <div class="scene-inner center">
          <span class="kicker">Mission n°2 • Google Classroom</span>
          <h2>Votre Mission : <strong>Le Test Comparatif de 2 Outils</strong></h2>
          <p class="lead">Prenez une vraie tâche professionnelle et soumettez-la à 2 outils différents. Notez les écarts de style et de précision.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>⏱️ 25 MINUTES DE TEST</span>
            <span>DÉPÔT SUR CLASSROOM (THÈME 02)</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 03 : BIEN UTILISER L'IA (MÉTHODE C.O.R.E.) ====================
  {
    moduleNumber: 3,
    moduleCode: "03-bien-utiliser-ia",
    moduleTitle: "Bien Utiliser l'IA : La Méthode C.O.R.E.",
    moduleSubtitle: "Formulation, Précision & Cadrage Professionnel",
    chapterNames: [
      "LE PIÈGE DU PROMPT PAUVRE",
      "LE FRAMEWORK C.O.R.E.",
      "DÉMONSTRATION AVANT / APRÈS",
      "TECHNIQUES D'AFFINAGE AVANCÉES",
      "ATELIER C.O.R.E. & DEVOIR"
    ],
    resources: {
      coreTemplate: {
        category: "MÉTHODOLOGIE OPAYS",
        title: "Structure Fondamentale C.O.R.E.",
        objective: "La formule officielle de l'Académie pour cadrer n'importe quelle demande professionnelle.",
        description: "Remplissez les 4 sections entre crochets avant d'envoyer votre consigne.",
        prompt: `CONTEXTE :
Tu es [MON RÔLE / TITRE PROFESSIONNEL]. Je travaille actuellement sur [MON PROJET / CONTEXTE DU DOSSIER].

OBJECTIF :
Rédige [LIVRABLE EXACT ATTENDU] destiné à [PUBLIC CIBLE DU DOCUMENT].

RÈGLES ET CONTRAINTES :
- Longueur : [EX: 400 MOTS STRICTS / 5 PUCES MAX].
- Ton : [EX: FORMEL, DIPLOMATIQUE, PERCUTANT].
- Éléments obligatoires : Inclure obligatoirement [POINT 1], [POINT 2].
- Interdictions : Ne fais aucune supposition sans preuve et n'utilise pas de jargon creux.

EXEMPLE ET FORMAT ATTENDU :
Présente le résultat sous la forme :
1. Diagnostic sommaire
2. Recommandations prioritaires
3. Prochaine étape immédiate.`
      },
      cascadePrompt: {
        category: "TECHNIQUE D'AFFINAGE",
        title: "Prompt d'Auto-Audit en Cascade",
        objective: "Obliger le modèle à critiquer et bonifier son premier jet avant finalisation.",
        description: "À envoyer directement après la première réponse du modèle.",
        prompt: `Relis attentivement le document que tu viens de produire avec l'œil d'un directeur exigeant.
1. Quels sont les 2 points faibles ou imprécisions de ton texte ?
2. Réécris une version bonifiée en corrigeant ces 2 faiblesses.`
      }
    },
    notes: {
      cover: ["Module fondamental : le passage du prompt amateur au prompt d'ingénierie professionnelle.", "Expliquer que 95% des déceptions avec l'IA viennent d'un manque de contexte."],
      poorPrompt: ["Montrer l'exemple du prompt pauvre : 'Fais-moi un rapport sur le budget'.", "Résultat : texte générique, creux, inutile.", "Introduire la méthode C.O.R.E."],
      coreFramework: ["Détailler les 4 lettres : Contexte, Objectif, Règles, Exemples/Format.", "Insister : le contexte élimine 90% des hallucinations."],
      demoCore: ["Démonstration live : soumettre le prompt pauvre puis le prompt C.O.R.E.", "Faire constater la différence spectaculaire de qualité."],
      refineTech: ["Présenter les 3 techniques d'affinage : prompts en cascade, assignation de persona et contrainte de format."],
      workshop: ["Faire rédiger à chaque apprenant son premier prompt C.O.R.E. sur un vrai cas de son bureau."],
      mission: ["Devoir n°3 : Rédiger 3 prompts C.O.R.E. calibrés et archiver dans le Volet 03 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 03 — Méthode C.O.R.E.">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 03</span>
            <h1>Bien Utiliser l'IA : <em>La Méthode C.O.R.E.</em></h1>
            <p class="hero-lead">Passez du prompt flou au cadrage professionnel d'élite. <strong>Obtenez des résultats impeccables du premier coup</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Maîtriser C.O.R.E.</button>
              <button class="secondary" id="openPromptsHero">Modèles de Prompts</button>
            </div>
            <div class="hero-meta">
              <span>CADRAGE CHIRURGICAL</span>
              <span>FORMULE EN 4 PILIERS</span>
              <span>ZÉRO TEXTE GÉNÉRIQUE</span>
            </div>
          </div>
          <div class="hero-stage">
            <div class="logo-halo">
              <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
                <g fill="#0066FF">
                  <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                  <rect x="850" y="340" width="100" height="100" rx="16"/>
                  <rect x="960" y="440" width="80" height="80" rx="14"/>
                </g>
              </svg>
            </div>
            <div class="orbit orbit-1">C : Contexte</div>
            <div class="orbit orbit-2">O : Objectif</div>
            <div class="orbit orbit-3">R : Règles</div>
            <div class="orbit orbit-4">E : Exemples</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="0" data-note="poorPrompt" data-title="Le Piège du Prompt Pauvre">
        <div class="scene-inner">
          <span class="kicker">Analyse d'Erreur Courante</span>
          <h2>Pourquoi l'IA vous donne-t-elle des <strong>réponses décevantes ?</strong></h2>
          <div class="versus reveal" style="margin-top:12px;">
            <div class="vs-card" style="border-color:var(--danger);">
              <small style="color:var(--danger)">LE PROMPT PAUVRE (AMATEUR)</small>
              <h3>« Rédige un rapport sur le budget »</h3>
              <p>Résultat : Texte plat, généraliste, verbeux, sans chiffres précis et inutilisable en réunion.</p>
            </div>
            <div class="vs-mark"></div>
            <div class="vs-card active-blue">
              <small style="color:var(--blue-light)">LE PROMPT CADRÉ C.O.R.E. (OPAYS)</small>
              <h3>Rôle + Document + Contraintes + Format</h3>
              <p>Résultat : Note de cadrage de 350 mots, chiffres clés surlignés, format exécutif prêt à être signé.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="coreFramework" data-title="Le Framework C.O.R.E.">
        <div class="scene-inner">
          <span class="kicker">La Formule Signature OPAYS</span>
          <h2>Les 4 Piliers de la <strong>Méthode C.O.R.E.</strong></h2>
          <div class="grid-4 reveal" style="margin-top:14px;">
            <div class="card">
              <span>C • CONTEXTE</span>
              <b>Qui êtes-vous ?</b>
              <p>Votre rôle, votre organisation, le sujet du dossier et le public cible.</p>
            </div>
            <div class="card">
              <span>O • OBJECTIF</span>
              <b>Quel livrable net ?</b>
              <p>Ce que l'IA doit accomplir très précisément (verbe d'action clair).</p>
            </div>
            <div class="card">
              <span>R • RÈGLES</span>
              <b>Quelles limites ?</b>
              <p>Longueur exacte, ton, obligations et interdictions strictes.</p>
            </div>
            <div class="card gold-border">
              <span>E • EXEMPLES / FORMAT</span>
              <b>Quelle structure ?</b>
              <p>Tableau, plan numéroté, puces ou modèle de document type.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoCore" data-title="Démonstration C.O.R.E.">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Template <strong>C.O.R.E. Prêt à l'Emploi</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>TEMPLATE OFFICIEL C.O.R.E.</span>
              <button class="copy-btn" data-copy="coreTemplate">Copier le template</button>
            </div>
            <p class="prompt-text" id="coreTemplateText">CONTEXTE :
Tu es <span class="prompt-var">[MON RÔLE]</span>. Je travaille sur <span class="prompt-var">[MON CONTEXTE]</span>.

OBJECTIF :
Rédige <span class="prompt-var">[LIVRABLE EXACT]</span> pour <span class="prompt-var">[DESTINATAIRE]</span>.

RÈGLES ET CONTRAINTES :
- Longueur : 350 mots stricts.
- Ton : formel, précis et sans jargon creux.
- Éléments obligatoires : [POINT 1], [POINT 2].

FORMAT ATTENDU :
1. Synthèse du problème
2. Recommandations chiffrées
3. Décision à valider.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="refineTech" data-title="Techniques d'Affinage">
        <div class="scene-inner">
          <span class="kicker">Techniques Avancées</span>
          <h2>L'Auto-Audit & <strong>Les Prompts en Cascade</strong></h2>
          <p class="lead">Ne vous contentez jamais du premier jet. Forcez le modèle à s'auto-critiquer :</p>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT D'AUTO-AUDIT EN CASCADE</span>
              <button class="copy-btn" data-copy="cascadePrompt">Copier</button>
            </div>
            <p class="prompt-text" id="cascadePromptText">Relis attentivement le texte que tu viens de produire avec le regard d'un directeur général exigeant.
1. Quels sont les 2 points faibles ou imprécisions de ton document ?
2. Réécris immédiatement une version bonifiée corrigeant ces 2 points.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="workshop" data-title="Atelier & Mission">
        <div class="scene-inner center">
          <span class="kicker">Mise en Pratique • AI Work Kit</span>
          <h2>Intégrez vos 3 Meilleurs Prompts dans votre <strong>Work Kit</strong></h2>
          <p class="lead">Remplissez le <strong>Volet 03 — Ma Bibliothèque de Prompts C.O.R.E.</strong> avec vos requêtes types de service.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>ARCHIVAGE DU VOLET 03</span>
            <span>MISSION 03 SUR CLASSROOM</span>
            <span>DATE LIMITE : LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 04 : L'IA DANS MON TRAVAIL ====================
  {
    moduleNumber: 4,
    moduleCode: "04-ia-dans-mon-travail",
    moduleTitle: "L'IA dans Mon Travail",
    moduleSubtitle: "Audit de Poste, Microscope Métier & ROI",
    chapterNames: [
      "LE DIAGNOSTIC DE POSTE",
      "LA MATRICE FRÉQUENCE / PÉNIBILITÉ",
      "LES 3 TÂCHES CIBLES À FORT ROI",
      "PLAN DE DÉLÉGATION À L'IA",
      "MISSION HEBDOMADAIRE"
    ],
    resources: {
      auditPrompt: {
        category: "DIAGNOSTIC DE POSTE",
        title: "Prompt Microscope Métier",
        objective: "Faire décomposer une journée de travail pour identifier les gisements d'automatisation.",
        description: "Collez la liste brute de vos tâches quotidiennes.",
        prompt: `Agis en tant qu'expert en organisation du travail et productivité par l'IA.
Voici mes responsabilités et mes tâches hebdomadaires :
[LISTER 5 À 10 TÂCHES RÉELLES DE VOTRE POSTE]

1. Classe ces tâches selon la matrice Fréquence / Pénibilité.
2. Identifie les 3 tâches prioritaires à déléguer à l'IA avec le plus fort gain de temps.
3. Pour chaque tâche cible, précise la part exacte à confier à l'IA et la part à conserver sous contrôle humain.`
      }
    },
    notes: {
      cover: ["Module pivot : passer de l'expérimentation générale à l'ancrage sur son propre bureau.", "Objectif : identifier concrètement où gagner 3 à 5 heures par semaine."],
      diagnostic: ["Expliquer le principe du microscope métier : décomposer son activité tâche par tâche."],
      matrix: ["Présenter la matrice Fréquence x Pénibilité (les corvées répétitives prioritaires)."],
      plan: ["Construire le plan de délégation : l'IA prépare le brouillon, l'humain valide."],
      mission: ["Devoir n°4 : Remplir le Volet 04 du Work Kit (Audit des 10 tâches) et déposer sur Classroom."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 04 — L'IA dans Mon Travail">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 04</span>
            <h1>L'IA dans <em>Mon Travail</em>.</h1>
            <p class="hero-lead">Passez votre quotidien professionnel au microscope. <strong>Identifiez les tâches à fort ROI et libérez 5h chaque semaine</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Auditer mon poste</button>
              <button class="secondary" id="openPromptsHero">Outil d'audit</button>
            </div>
            <div class="hero-meta">
              <span>MICROSCOPE MÉTIER</span>
              <span>MATRICE ROI</span>
              <span>⏳ 5H LIBÉRÉES / SEMAINE</span>
            </div>
          </div>
          <div class="hero-stage">
            <div class="logo-halo">
              <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
                <g fill="#0066FF">
                  <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                  <rect x="850" y="340" width="100" height="100" rx="16"/>
                  <rect x="960" y="440" width="80" height="80" rx="14"/>
                </g>
              </svg>
            </div>
            <div class="orbit orbit-1">10 Tâches Clés</div>
            <div class="orbit orbit-2">Fréquence & Temps</div>
            <div class="orbit orbit-3">Top 3 Cibles</div>
            <div class="orbit orbit-4">AI Work Kit</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="matrix" data-title="La Matrice d'Arbitrage">
        <div class="scene-inner">
          <span class="kicker">Priorisation Stratégique</span>
          <h2>La Matrice <strong>Fréquence × Pénibilité</strong></h2>
          <div class="grid-2 reveal" style="margin-top:14px;">
            <div class="card gold-border">
              <span>ZONE 1 • PRIORITÉ ABSOLUE (FORT ROI)</span>
              <b>Tâches Fréquentes & Répétitives</b>
              <p>Réponses aux emails courants, comptes-rendus de réunion, synthèses de pièces jointes, tableaux de reporting.</p>
            </div>
            <div class="card">
              <span>ZONE 2 • ASSISTANCE PONCTUELLE</span>
              <b>Tâches Complexes & Stratégiques</b>
              <p>Relecture critique d'une convention, brainstorming d'offres commerciales, cadrage d'un projet.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="plan" data-title="Audit de Poste Live">
        <div class="scene-inner">
          <span class="kicker">Démonstration & Prompt d'Audit</span>
          <h2>Le Prompt <strong>Microscope Métier</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT AUDIT DE POSTE</span>
              <button class="copy-btn" data-copy="auditPrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="auditPromptText">Agis en tant qu'expert en organisation du travail et productivité par l'IA.
Voici mes responsabilités et mes tâches hebdomadaires :
<span class="prompt-var">[LISTER 5 À 10 TÂCHES DE VOTRE POSTE]</span>

1. Classe ces tâches selon la matrice Fréquence / Pénibilité.
2. Identifie les 3 tâches prioritaires à déléguer à l'IA avec le plus fort gain de temps.
3. Pour chaque tâche cible, précise la part exacte à confier à l'IA et la part à conserver sous contrôle humain.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°4 • Google Classroom</span>
          <h2>Validez vos 3 Tâches Prioritaires dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 04 — Mon Audit de Poste & Mes 3 Tâches Cibles</strong> pour préparer la construction de vos Skills.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 04</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 05 : DOCUMENTS ET DONNÉES ====================
  {
    moduleNumber: 5,
    moduleCode: "05-documents-et-donnees",
    moduleTitle: "Documents et Données",
    moduleSubtitle: "PDF, Tableaux & NotebookLM sans Hallucination",
    chapterNames: [
      "LES 6 OPÉRATIONS DOCUMENTAIRES",
      "ANALYSES DE PDF & TABLEAUX EXCEL",
      "NOTEBOOKLM & CITATIONS EXACTES",
      "DÉMONSTRATION EN DIRECT",
      "ATELIER DOCUMENTS & DEVOIR"
    ],
    resources: {
      pdfPrompt: {
        category: "ANALYSE DOCUMENTAIRE",
        title: "Prompt Extraction & Tableaux de Synthèse",
        objective: "Extraire des données chiffrées d'un PDF lourd et les restituer sous forme de tableau Excel.",
        description: "Chargez votre fichier PDF ou collez le texte brut.",
        prompt: `Analyse le document ci-joint en tant qu'auditeur financier.
1. Extrais dans un tableau récapitulatif toutes les dépenses supérieures à 1 000 $ avec : Date | Bénéficiaire | Montant | Libellé.
2. Signale les 2 postes budgétaires qui ont le plus augmenté par rapport à la période précédente.
3. Indique pour chaque chiffre le numéro de page où il se trouve.`
      },
      notebookLmPrompt: {
        category: "SOURCING GARANTI",
        title: "Consigne de Vérification NotebookLM",
        objective: "Interroger une base de 10 documents sans risque d'invention externe.",
        description: "À utiliser dans Google NotebookLM sur vos sources chargées.",
        prompt: `À partir exclusivement des documents sources déposés dans ce carnet :
Rédige une note de 300 mots résumant les conditions d'octroi des congés spéciaux, en insérant pour chaque affirmation la citation exacte et le document source correspondant.`
      }
    },
    notes: {
      cover: ["Entrée dans le bloc documentaire : comment transformer des PDF de 100 pages en alliés quotidiens."],
      ops: ["Présenter les 6 opérations : Synthétiser, Extraire, Comparer, Vérifier, Reformuler, Transformer."],
      notebooklm: ["Démontrer la puissance de NotebookLM : zéro hallucination car ancré à 100% sur vos sources chargées."],
      demo: ["Démonstration live d'extraction de tableau depuis un rapport administratif."],
      mission: ["Devoir n°5 : Charger un document de son poste, faire 3 analyses et remplir le Volet 05 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 05 — Documents et Données">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 05</span>
            <h1>Documents & <em>Données</em>.</h1>
            <p class="hero-lead">Maîtrisez les PDF, classeurs Excel et rapports volumineux. <strong>Citations exactes et zéro hallucination avec NotebookLM</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Dompter mes documents</button>
              <button class="secondary" id="openPromptsHero">Boîte documentaire</button>
            </div>
            <div class="hero-meta">
              <span>6 OPÉRATIONS CLÉS</span>
              <span>CITATIONS À LA PAGE PRÈS</span>
              <span>EXTRACTION TABLEAUX</span>
            </div>
          </div>
          <div class="hero-stage">
            <div class="logo-halo">
              <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
                <g fill="#0066FF">
                  <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                  <rect x="850" y="340" width="100" height="100" rx="16"/>
                  <rect x="960" y="440" width="80" height="80" rx="14"/>
                </g>
              </svg>
            </div>
            <div class="orbit orbit-1">Analyse de PDF</div>
            <div class="orbit orbit-2">Tableaux Excel</div>
            <div class="orbit orbit-3">NotebookLM</div>
            <div class="orbit orbit-4">Zéro Hallucination</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="ops" data-title="Les 6 Opérations Documentaires">
        <div class="scene-inner">
          <span class="kicker">Savoir-Faire Fondamental</span>
          <h2>Les 6 Super-Pouvoirs <strong>sur vos Documents</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>01. SYNTHÉTISER</span>
              <b>Résumer en 1 Page</b>
              <p>Condenser un document de 80 pages en 5 points clés exécutifs.</p>
            </div>
            <div class="card">
              <span>02. EXTRAIRE</span>
              <b>Isoler les Chiffres</b>
              <p>Transformer des paragraphes de texte en tableaux Excel propres.</p>
            </div>
            <div class="card">
              <span>03. COMPARER</span>
              <b>Détecter les Écarts</b>
              <p>Mettre en miroir deux versions d'un contrat ou décret pour voir les changements.</p>
            </div>
            <div class="card">
              <span>04. VÉRIFIER</span>
              <b>Auditer la Cohérence</b>
              <p>Rechercher les contradictions et les erreurs de calcul internes.</p>
            </div>
            <div class="card">
              <span>05. REFORMULER</span>
              <b>Adapter la Cible</b>
              <p>Transformer un texte juridique en note accessible aux usagers.</p>
            </div>
            <div class="card gold-border">
              <span>06. TRANSFORMER</span>
              <b>Changer de Format</b>
              <p>Convertir un rapport en plan d'action ou en foire aux questions (FAQ).</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="notebooklm" data-title="NotebookLM & Citations">
        <div class="scene-inner">
          <span class="kicker">Ancrage Source Souverain</span>
          <h2>Google NotebookLM : <strong>La Fin des Hallucinations</strong></h2>
          <p class="lead">Le modèle est enfermé dans vos propres fichiers. Il ne répond qu'avec des <strong>citations exactes vérifiables d'un clic</strong>.</p>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT DE CONTRÔLE SOURCÉ</span>
              <button class="copy-btn" data-copy="notebookLmPrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="notebookLmPromptText">À partir exclusivement des documents sources déposés dans ce carnet :
Rédige une note de 300 mots résumant les conditions d'octroi des congés spéciaux, en insérant pour chaque affirmation la citation exacte et le document source correspondant.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°5 • Google Classroom</span>
          <h2>Créez votre Premier Carnet de Sources dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 05 — Traitement Documentaire & NotebookLM</strong> avec vos procédures officielles.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 05</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 06 : LES SKILLS MÉTIERS ====================
  {
    moduleNumber: 6,
    moduleCode: "06-les-skills",
    moduleTitle: "Les Skills Métiers",
    moduleSubtitle: "Le Skill Canvas en 6 Piliers & Fiches Réflexes",
    chapterNames: [
      "DU PROMPT PONCTUEL AU SKILL",
      "LE SKILL CANVAS EN 6 PILIERS",
      "ANATOMIE D'UNE FICHE RÉFLEXE",
      "DÉMONSTRATION D'UN SKILL MÉTIER",
      "ATELIER DE CRÉATION & MISSION"
    ],
    resources: {
      skillCanvasTemplate: {
        category: "SKILL CANVAS OPAYS",
        title: "Structure Standard d'un Skill Métier",
        objective: "La fiche recette officielle pour encapsuler un savoir-faire réutilisable à l'infini.",
        description: "Enregistrez ce format dans vos notes pour le déclencher en 1 clic.",
        prompt: `SKILL MÉTIER : [NOM DU SKILL - EX: RÉDACTEUR DE NOTE DE SERVICE]

1. DÉCLENCHEUR :
Quand utiliser ce skill ? Dès que l'utilisateur écrit "NOTE:" suivi du sujet.

2. DONNÉES EN ENTRÉE :
- Destinataire (Service ou Direction)
- Objet précis
- 2 à 3 points clés à transmettre

3. PROCÉDURE DE TRAVAIL :
Étape 1 : Formuler un objet administratif conforme aux normes officielles.
Étape 2 : Rédiger le corps en 3 paragraphes stricts (Contexte, Décision, Modalités).
Étape 3 : Insérer la formule de politesse hiérarchique adaptée.

4. RÈGLES STRICTES :
- Ne jamais dépasser 250 mots.
- Ton neutre, clair et ferme.

5. FORMAT DU LIVRABLE :
Présenter la note prête à imprimer avec mentions d'en-tête officielles.`
      }
    },
    notes: {
      cover: ["Entrée dans le niveau supérieur : industrialiser ses prompts sous forme de 'Skills' pérennes."],
      concept: ["Différence : Un prompt est une question ponctuelle. Un Skill est une procédure industrielle enregistrée."],
      canvas: ["Présenter les 6 piliers : Nom, Déclencheur, Données d'entrée, Étapes, Règles, Livrable final."],
      demo: ["Montrer l'exécution d'un Skill en live : l'apprenant donne juste 3 mots et l'IA applique toute la recette."],
      mission: ["Devoir n°6 : Rédiger son premier Skill Métier officiel dans le Volet 06 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 06 — Les Skills Métiers">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 06</span>
            <h1>Les <em>Skills</em> Métiers.</h1>
            <p class="hero-lead">Ne réécrivez plus vos prompts chaque matin. <strong>Créez vos recettes professionnelles réutilisables à l'infini</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Construire mes Skills</button>
              <button class="secondary" id="openPromptsHero">Modèle de Skill</button>
            </div>
            <div class="hero-meta">
              <span>LE SKILL CANVAS</span>
              <span>EXÉCUTION EN 1 CLIC</span>
              <span>GAIN DE TEMPS QUOTIDIEN</span>
            </div>
          </div>
          <div class="hero-stage">
            <div class="logo-halo">
              <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
                <g fill="#0066FF">
                  <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                  <rect x="850" y="340" width="100" height="100" rx="16"/>
                  <rect x="960" y="440" width="80" height="80" rx="14"/>
                </g>
              </svg>
            </div>
            <div class="orbit orbit-1">6 Piliers Canvas</div>
            <div class="orbit orbit-2">Déclencheurs</div>
            <div class="orbit orbit-3">Règles Strictes</div>
            <div class="orbit orbit-4">AI Work Kit</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="canvas" data-title="Le Skill Canvas">
        <div class="scene-inner">
          <span class="kicker">Standard Industriel OPAYS</span>
          <h2>Le <strong>Skill Canvas en 6 Piliers</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>01. NOM & RÔLE</span>
              <b>L'Identité du Skill</b>
              <p>Qui est-il et quelle est sa mission précise dans votre service ?</p>
            </div>
            <div class="card">
              <span>02. DÉCLENCHEUR</span>
              <b>Quand s'active-t-il ?</b>
              <p>Le mot-clé ou la situation qui déclenche l'exécution du Skill.</p>
            </div>
            <div class="card">
              <span>03. ENTRÉES</span>
              <b>Que lui donnez-vous ?</b>
              <p>Les 2 ou 3 informations brutes indispensables pour travailler.</p>
            </div>
            <div class="card">
              <span>04. ÉTAPES</span>
              <b>Quelle méthode ?</b>
              <p>La séquence ordonnée des calculs et rédactions à exécuter.</p>
            </div>
            <div class="card">
              <span>05. RÈGLES</span>
              <b>Quelles limites ?</b>
              <p>Longueur, ton, interdictions et critères d'exactitude.</p>
            </div>
            <div class="card gold-border">
              <span>06. LIVRABLE</span>
              <b>Quel résultat net ?</b>
              <p>Le gabarit exact du document final produit.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demo" data-title="Démonstration d'un Skill">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Exemple : <strong>Le Skill Rédaction Administrative</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>CANVAS COMPLET PRÊT À L'EMPLOI</span>
              <button class="copy-btn" data-copy="skillCanvasTemplate">Copier le Skill Canvas</button>
            </div>
            <p class="prompt-text" id="skillCanvasTemplateText">SKILL MÉTIER : [RÉDACTEUR DE NOTE DE SERVICE]

1. DÉCLENCHEUR : Dès que l'utilisateur écrit "NOTE:" suivi du sujet.
2. ENTRÉES : Destinataire + Objet + 3 points clés.
3. ÉTAPES :
- Étape 1 : Formuler un objet administratif conforme.
- Étape 2 : Rédiger le corps en 3 paragraphes stricts.
- Étape 3 : Formule de politesse hiérarchique.
4. RÈGLES : Ne jamais dépasser 250 mots. Ton neutre et formel.
5. LIVRABLE : Note de service prête à imprimer.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°6 • Google Classroom</span>
          <h2>Enregistrez votre Premier Skill dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 06 — Mes Fiches Skills Métiers</strong> et testez-le sur 3 cas réels.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 06</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  }
];

module.exports = { modules_02_to_06 };
