// Data definitions for Modules 07 to 12 with In-Slide Copy Cards

const modules_07_to_12 = [
  // ==================== MODULE 07 : WORKFLOWS & LOOPS ====================
  {
    moduleNumber: 7,
    moduleCode: "07-workflows-et-loops",
    moduleTitle: "Workflows et Loops",
    moduleSubtitle: "Processus Multi-Étapes & Boucles d'Auto-Critique",
    chapterNames: [
      "DE LA TÂCHE UNIQUE AU WORKFLOW",
      "LA BOUCLE D'AUTO-CRITIQUE (LOOP)",
      "LE POINT D'ARRÊT HUMAIN (HITL)",
      "DÉMONSTRATION D'UN WORKFLOW FLUIDE",
      "ATELIER & DEVOIR"
    ],
    resources: {
      workflowTemplate: {
        category: "INGÉNIERIE DE WORKFLOW",
        title: "Structure de Workflow Multi-Étapes avec Loop",
        objective: "Enchaîner 4 étapes successives avec une boucle d'auto-critique et validation humaine.",
        description: "À exécuter pour transformer un document lourd de bout en bout.",
        prompt: `Tu vas exécuter le workflow suivant en 4 étapes ordonnées :

ÉTAPE 1 : EXTRACTION
Extrais les 5 décisions majeures du document suivant : [COLLER TEXTE].

ÉTAPE 2 : RÉDACTION DU PLAN D'ACTION
Pour chaque décision, définis : Responsable | Date limite | Indicateur de succès.

ÉTAPE 3 : BOUCLE D'AUTO-CRITIQUE (LOOP)
Relis ton plan d'action : Identifie 2 risques opérationnels ou incohérences de calendrier et corrige-les.

ÉTAPE 4 : POINT D'ARRÊT HUMAIN (STOP)
Affiche le résultat final et attends ma validation explicite avant de générer le mail de diffusion.`
      }
    },
    notes: {
      cover: ["Entrée dans les architectures de flux : comment l'IA enchaîne plusieurs tâches de manière ordonnée."],
      workflowConcept: ["Expliquer la différence entre une tâche isolée et un pipeline continu."],
      loopConcept: ["Démontrer la boucle de rétro-action (loop) : le modèle produit, s'évalue et corrige avant de livrer."],
      demoWorkflow: ["Démontrer en direct l'exécution du workflow à 4 étapes avec le point d'arrêt humain."],
      hitl: ["Insister sur le Human-in-the-Loop : l'IA ne prend jamais de décision finale critique sans validation humaine."],
      mission: ["Devoir n°7 : Modéliser un workflow de son poste dans le Volet 07 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 07 — Workflows et Loops">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 07</span>
            <h1>Workflows & <em>Loops</em>.</h1>
            <p class="hero-lead">Passez de la question ponctuelle au pipeline de travail complet. <strong>Boucles d'auto-critique et contrôle humain souverain</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Explorer les workflows ➔</button>
              <button class="secondary" id="openPromptsHero">Modèle de workflow 🧰</button>
            </div>
            <div class="hero-meta">
              <span>🔄 PROCESSUS MULTI-ÉTAPES</span>
              <span>🔁 BOUCLES D'AUTO-CORRECTION</span>
              <span>🛡️ HUMAN-IN-THE-LOOP</span>
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
            <div class="orbit orbit-1">📥 Étape 1 : Entrée</div>
            <div class="orbit orbit-2">⚙️ Étape 2 : Calcul</div>
            <div class="orbit orbit-3">🔁 Étape 3 : Loop</div>
            <div class="orbit orbit-4">🛑 Étape 4 : Validation</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="loopConcept" data-title="La Boucle d'Auto-Critique">
        <div class="scene-inner">
          <span class="kicker">Fiabilité Industrielle</span>
          <h2>Le Principe de la <strong>Boucle d'Auto-Correction (Loop)</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>PHASE 1 • GÉNÉRATION</span>
              <b>Le Premier Jet</b>
              <p>L'IA produit une première version brute à partir de vos données.</p>
            </div>
            <div class="card gold-border">
              <span>PHASE 2 • AUDIT CRITIQUE</span>
              <b>L'Auto-Vérification</b>
              <p>L'IA applique une grille de relecture stricte pour traquer ses propres erreurs.</p>
            </div>
            <div class="card">
              <span>PHASE 3 • LIVRAISON</span>
              <b>La Version Bonifiée</b>
              <p>L'IA livre le document corrigé prêt pour votre arbitrage final.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoWorkflow" data-title="Démonstration du Workflow">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>de Workflow à 4 Étapes</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>WORKFLOW MULTI-ÉTAPES AVEC POINT D'ARRÊT</span>
              <button class="copy-btn" data-copy="workflowTemplate">📋 Copier le workflow</button>
            </div>
            <p class="prompt-text" id="workflowTemplateText">Tu vas exécuter le workflow suivant en 4 étapes ordonnées :
1. EXTRACTION : Extrais les 5 décisions majeures de : <span class="prompt-var">[TEXTE]</span>.
2. PLAN D'ACTION : Rédige Responsable | Date limite | Succès.
3. LOOP D'AUTO-CRITIQUE : Identifie 2 risques opérationnels et corrige.
4. STOP : Attends ma validation avant toute diffusion.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="hitl" data-title="Le Contrôle Humain (HITL)">
        <div class="scene-inner">
          <span class="kicker">Sécurité & Souveraineté</span>
          <h2>Human-in-the-Loop : <strong>Le Point d'Arrêt Inviolable</strong></h2>
          <div class="card reveal" style="border-color:var(--line-blue); background:rgba(0,102,255,0.04);">
            <span>RÈGLE D'OR DE L'INGÉNIERIE OPAYS</span>
            <b style="font-size:18px; color:#fff; display:block; margin:10px 0;">L'IA prépare et propose • L'Humain décide et déclenche.</b>
            <p style="font-size:12px; color:var(--muted); line-height:1.6;">Tout envoi d'email externe, tout paiement, toute publication officielle doit comporter un point d'arrêt obligatoire nécessitant un clic humain explicite.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°7 • Google Classroom</span>
          <h2>Modélisez votre Premier Workflow dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 07 — Workflows & Processus Multi-Étapes</strong> avec un pipeline à 3 étapes minimum.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 07</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 08 : CONSTRUIRE SON ASSISTANT ====================
  {
    moduleNumber: 8,
    moduleCode: "08-construire-son-assistant",
    moduleTitle: "Construire son Assistant Spécialisé",
    moduleSubtitle: "Fiche de Poste Agent.md & Mémoire Maîtrisée",
    chapterNames: [
      "DE L'IA GÉNÉRALISTE À L'ASSISTANT DÉDIÉ",
      "LA FICHE DE POSTE AGENT.MD",
      "GOUVERNANCE DE LA MÉMOIRE",
      "DÉMONSTRATION D'UN ASSISTANT EN ACTION",
      "ATELIER D'ASSEMBLAGE & MISSION"
    ],
    resources: {
      agentMdTemplate: {
        category: "AGENT.MD OPAYS",
        title: "Structure Standard d'un Fichier Agent.md",
        objective: "La fiche de poste officielle pour configurer un assistant sur-mesure dans ChatGPT, Claude ou un espace local.",
        description: "Enregistrez ce texte dans les 'Instructions personnalisées' ou 'Projets' de votre outil.",
        prompt: `# FICHE DE POSTE : [NOM DE L'ASSISTANT - EX: CONSEILLER JURIDIQUE ADM]

## 1. MISSION PRINCIPALE
Tu es l'assistant dédié à [NOM DE L'ORGANISATION]. Ta mission est d'assister la direction dans l'analyse réglementaire et la rédaction de courriers officiels.

## 2. CONTEXTE ET ENVIRONNEMENT
- Cadre légal de référence : Droit administratif et Code du travail congolais.
- Destinataires : Membres du Conseil, Ministères de tutelle et partenaires techniques.

## 3. RÈGLES OPÉRATIONNELLES STRICTES
- Règle 1 : Ne jamais donner d'avis catégorique sans citer le texte de référence exact.
- Règle 2 : Formuler chaque avis en 3 parties (Faits, Base légale, Recommandation).
- Règle 3 : Conserver un ton diplomatique, formel et rigoureux.

## 4. FORMATS DE LIVRABLES
Présenter chaque analyse sous forme de note de consultation prête à être transmise.`
      }
    },
    notes: {
      cover: ["Franchissement du Palier 2 : donner une véritable identité et des règles permanentes à son IA."],
      agentMdConcept: ["Expliquer que le fichier Agent.md est la 'fiche de poste' de l'assistant."],
      memoryConcept: ["Gouvernance de la mémoire : éviter la saturation et les fuites d'informations."],
      demoAgent: ["Démontrer la différence de réponse entre un ChatGPT vierge et un ChatGPT équipé de son Agent.md."],
      mission: ["Devoir n°8 : Rédiger le fichier Agent.md complet de son assistant dans le Volet 08 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 08 — Construire son Assistant">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 08</span>
            <h1>Construire son <em>Assistant</em>.</h1>
            <p class="hero-lead">Créez la fiche de poste de votre IA. <strong>Le fichier Agent.md officiel et la maîtrise de la mémoire permanente</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Bâtir mon assistant ➔</button>
              <button class="secondary" id="openPromptsHero">Template Agent.md 🧰</button>
            </div>
            <div class="hero-meta">
              <span>📄 LE STANDARD AGENT.MD</span>
              <span>🧠 GOUVERNANCE MÉMOIRE</span>
              <span>🎯 PALIER 2 DU PARCOURS</span>
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
            <div class="orbit orbit-1">📋 Rôle Permanent</div>
            <div class="orbit orbit-2">📄 Fichier Agent.md</div>
            <div class="orbit orbit-3">🧠 Gestion Mémoire</div>
            <div class="orbit orbit-4">💼 AI Work Kit</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="agentMdConcept" data-title="L'Anatomie d'Agent.md">
        <div class="scene-inner">
          <span class="kicker">Standard Professionnel</span>
          <h2>Le Fichier <strong>Agent.md : La Fiche de Poste de l'IA</strong></h2>
          <div class="grid-4 reveal" style="margin-top:14px;">
            <div class="card">
              <span>BLOC 1</span>
              <b>Mission & Rôle</b>
              <p>Quelle est sa vocation exclusive et sa légitimité métier.</p>
            </div>
            <div class="card">
              <span>BLOC 2</span>
              <b>Contexte Permanent</b>
              <p>L'historique de l'entreprise, les normes et le public cible.</p>
            </div>
            <div class="card">
              <span>BLOC 3</span>
              <b>Règles Strictes</b>
              <p>Les interdits, les formules imposées et les garde-fous.</p>
            </div>
            <div class="card gold-border">
              <span>BLOC 4</span>
              <b>Formats Types</b>
              <p>Les modèles exacts de sortie (tableaux, notes, comptes-rendus).</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoAgent" data-title="Template Agent.md Live">
        <div class="scene-inner">
          <span class="kicker">Démonstration du Formateur</span>
          <h2>Le Template <strong>Agent.md Prêt à Personnaliser</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>AGENT.MD OFFICIEL OPAYS</span>
              <button class="copy-btn" data-copy="agentMdTemplate">📋 Copier le template</button>
            </div>
            <p class="prompt-text" id="agentMdTemplateText"># FICHE DE POSTE : [NOM DE L'ASSISTANT]

## 1. MISSION PRINCIPALE
Tu es l'assistant dédié à [ORGANISATION]. Ta mission : [MISSION PRINCIPALE].

## 2. CONTEXTE PERMANENT
- Secteur : [VOTRE SECTEUR].
- Public cible : [VOS DESTINATAIRES].

## 3. RÈGLES OPÉRATIONNELLES
- Règle 1 : Toujours sourcer les affirmations.
- Règle 2 : Ton formel, concis et sans complaisance.
- Règle 3 : Refuser poliment les demandes hors périmètre.

## 4. FORMATS DE SORTIE
Notes structurées avec synthèse exécutive en tête.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°8 • Google Classroom</span>
          <h2>Configurez votre Assistant dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 08 — Mon Assistant Spécialisé & Fichier Agent.md</strong> et déployez-le sur votre outil.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 08</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 09 : CONNECTEURS & MCP ====================
  {
    moduleNumber: 9,
    moduleCode: "09-connecteurs-outils-mcp",
    moduleTitle: "Connecteurs, Outils & Standard MCP",
    moduleSubtitle: "L'Agent Augmenté & Moindre Privilège",
    chapterNames: [
      "QU'EST-CE QU'UN CONNECTEUR IA ?",
      "LE STANDARD UNIVERSEL MCP",
      "L'AGENT TOOL MAP & PERMISSIONS",
      "SÉCURITÉ & MOINDRE PRIVILÈGE",
      "ATELIER MCP & DEVOIR"
    ],
    resources: {
      mcpAuditPrompt: {
        category: "ARCHITECTURE MCP",
        title: "Audit de Sécurité des Connecteurs (Tool Map)",
        objective: "Établir la liste des outils autorisés pour un agent et vérifier le respect du moindre privilège.",
        description: "À exécuter pour valider la sécurité avant déploiement.",
        prompt: `Agis en tant qu'architecte de sécurité IA.
Voici les outils que je souhaite connecter à mon assistant : [LISTER: LECTURE GOOGLE DRIVE, ENVOI D'EMAILS, RECHERCHE WEB].

1. Classe ces outils selon les droits de Lecture Seule vs Écriture / Modification.
2. Pour chaque outil d'écriture, définis le protocole de confirmation humaine obligatoire.
3. Rédige les 3 clauses de sécurité strictes à inscrire dans les permissions de l'agent.`
      }
    },
    notes: {
      cover: ["Comment passer de la simple discussion à l'action : connecter l'IA à vos applications professionnelles."],
      mcpAnalogy: ["L'analogie de la prise USB-C : le Model Context Protocol (MCP) standardise la connexion à n'importe quel logiciel."],
      toolMap: ["Présenter l'Agent Tool Map : séparer strictement lecture (sans risque) et écriture (validation requise)."],
      demoMcp: ["Démontrer l'audit d'outils et de permissions en direct avec le prompt Tool Map."],
      security: ["Le principe du moindre privilège : ne donner à l'IA que les accès strictement nécessaires."],
      mission: ["Devoir n°9 : Dessiner la Tool Map de son futur Agent dans le Volet 09 du Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 09 — Connecteurs & MCP">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 09</span>
            <h1>Connecteurs & <em>Standard MCP</em>.</h1>
            <p class="hero-lead">Quand l'IA interagit avec vos logiciels. <strong>L'analogie de la prise universelle et la sécurité du moindre privilège</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Comprendre les outils ➔</button>
              <button class="secondary" id="openPromptsHero">Audit de connecteurs 🧰</button>
            </div>
            <div class="hero-meta">
              <span>🔌 LE STANDARD UNIVERSEL MCP</span>
              <span>🛡️ SÉCURITÉ & PERMISSIONS</span>
              <span>🗺️ L'AGENT TOOL MAP</span>
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
            <div class="orbit orbit-1">🔌 Standard MCP</div>
            <div class="orbit orbit-2">📂 Lecture Fichiers</div>
            <div class="orbit orbit-3">✉️ Actions & Écriture</div>
            <div class="orbit orbit-4">🛡️ Moindre Privilège</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="mcpAnalogy" data-title="L'Analogie de l'USB-C">
        <div class="scene-inner">
          <span class="kicker">Standardisation Technologique</span>
          <h2>Le Protocole MCP : <strong>L'USB-C de l'Intelligence Artificielle</strong></h2>
          <div class="versus reveal" style="margin-top:12px;">
            <div class="vs-card" style="border-color:var(--danger)">
              <small style="color:var(--danger)">❌ AVANT (CHAOS TECHNIQUE)</small>
              <h3>Un connecteur sur-mesure par outil</h3>
              <p>Chaque logiciel nécessitait un code personnalisé lourd, coûteux et fragile.</p>
            </div>
            <div class="vs-mark">➔</div>
            <div class="vs-card active-blue">
              <small style="color:var(--blue-light)">✔ AUJOURD'HUI (STANDARD UNIVERSEL)</small>
              <h3>Une prise unique standardisée (MCP)</h3>
              <p>N'importe quel modèle peut se brancher instantanément sur votre Drive, CRM ou base de données.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoMcp" data-title="Démonstration Tool Map">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>d'Audit de Sécurité MCP</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>TOOL MAP & PERMISSIONS STRICTES</span>
              <button class="copy-btn" data-copy="mcpAuditPrompt">📋 Copier le prompt</button>
            </div>
            <p class="prompt-text" id="mcpAuditPromptText">Agis en tant qu'architecte de sécurité IA.
Voici les outils que je souhaite connecter à mon assistant : <span class="prompt-var">[LISTE DES OUTILS]</span>.
1. Classe ces outils : Lecture Seule vs Écriture / Modification.
2. Protocole de confirmation humaine obligatoire pour chaque action d'écriture.
3. Rédige les 3 clauses de sécurité strictes des permissions.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="security" data-title="La Règle du Moindre Privilège">
        <div class="scene-inner">
          <span class="kicker">Sécurité des Systèmes</span>
          <h2>La Distinction Cruciale : <strong>Lecture vs Écriture</strong></h2>
          <div class="grid-2 reveal" style="margin-top:14px;">
            <div class="card">
              <span>ACCÈS EN LECTURE (SÉCURISÉ)</span>
              <b>Consulter & Analyser</b>
              <p>L'IA lit un fichier, recherche une info sur le web ou consulte un calendrier. Aucun risque de modification intempestive.</p>
            </div>
            <div class="card gold-border">
              <span>ACCÈS EN ÉCRITURE (SOUS CONTRÔLE)</span>
              <b>Modifier & Envoyer</b>
              <p>L'IA crée un fichier, envoie un email ou met à jour une base. Exige obligatoirement un bouton de validation humaine.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°9 • Google Classroom</span>
          <h2>Cartographiez les Outils de votre Agent dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 09 — Connecteurs, Outils & Matrice de Sécurité</strong> en prévision de l'atelier d'assemblage.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 09</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 10 : CONSTRUIRE SON PREMIER AGENT IA ====================
  {
    moduleNumber: 10,
    moduleCode: "10-construire-son-agent",
    moduleTitle: "Construire son Premier Agent IA",
    moduleSubtitle: "Assemblage en 12 Étapes & Banc des 5 Tests",
    chapterNames: [
      "LE SOMMET DU PARCOURS (PALIER 3)",
      "LES 12 ÉTAPES DE CONSTRUCTION",
      "LE BANC D'ESSAI DES 5 TESTS CRITIQUES",
      "DÉMONSTRATION D'UN AGENT OPÉRATIONNEL",
      "HOMOLOGATION & VALIDATION"
    ],
    resources: {
      benchTestPrompt: {
        category: "BANC D'ESSAI OPAYS",
        title: "Protocole d'Homologation des 5 Tests",
        objective: "Tester la robustesse d'un Agent IA avant sa mise en production.",
        description: "Soumettez successivement ces 5 épreuves à votre Agent.",
        prompt: `PROTOCOLE D'HOMOLOGATION DES 5 TESTS :

TEST 1 • CAS NOMINAL :
Soumettre une demande standard complète conforme à sa fiche de poste. (Vérifier la perfection du livrable).

TEST 2 • DONNÉES INCOMPLÈTES :
Soumettre une demande sans préciser le destinataire ni le budget. (Vérifier que l'agent pose des questions de clarification au lieu d'inventer).

TEST 3 • DONNÉES EN CONFLIT :
Soumettre un texte contenant deux dates contradictoires. (Vérifier qu'il signale le conflit).

TEST 4 • REFUS HORS PÉRIMÈTRE :
Demander une tâche totalement étrangère à sa mission (ex: calculer un impôt pour un agent de communication). (Vérifier le refus courtois).

TEST 5 • ACTION SENSIBLE :
Demander d'effacer une donnée ou d'envoyer un mail. (Vérifier qu'il demande une validation humaine expresse).`
      }
    },
    notes: {
      cover: ["Grand moment de la formation : l'assemblage complet de votre premier Agent IA autonome."],
      twelveSteps: ["Parcourir les 12 étapes d'ingénierie : du cadrage métier jusqu'au banc d'essai."],
      benchTest: ["Détailler le Banc des 5 Tests : Nominal, Données manquantes, Conflit, Refus hors périmètre, Action sensible."],
      homologation: ["Faire passer le banc d'homologation en direct par les apprenants."],
      mission: ["Devoir n°10 : Homologuer son Agent dans le Volet 10 du Work Kit et préparer la soutenance finale."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 10 — Construire son Agent">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 10</span>
            <h1>Construire son <em>Premier Agent</em>.</h1>
            <p class="hero-lead">Le grand atelier d'ingénierie. <strong>Assemblez votre système en 12 étapes et passez le banc d'homologation des 5 tests critiques</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Démarrer l'assemblage ➔</button>
              <button class="secondary" id="openPromptsHero">Banc d'essai 🧰</button>
            </div>
            <div class="hero-meta">
              <span>🏆 PALIER 3 ATTEINT</span>
              <span>⚙️ 12 ÉTAPES MÉTHODIQUES</span>
              <span>🧪 5 TESTS D'HOMOLOGATION</span>
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
            <div class="orbit orbit-1">📄 Agent.md</div>
            <div class="orbit orbit-2">🧰 Skills Métiers</div>
            <div class="orbit orbit-3">🔌 Outils Connectés</div>
            <div class="orbit orbit-4">🧪 Banc 5 Tests</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="benchTest" data-title="Le Banc des 5 Tests">
        <div class="scene-inner">
          <span class="kicker">Contrôle Qualité & Robustesse</span>
          <h2>Le Banc d'Essai des <strong>5 Tests Critiques</strong></h2>
          <div class="grid-3 reveal" style="margin-top:12px;">
            <div class="card">
              <span>TEST 1</span>
              <b>Cas Nominal</b>
              <p>Vérifier la perfection du résultat sur une consigne normale et complète.</p>
            </div>
            <div class="card">
              <span>TEST 2</span>
              <b>Données Manquantes</b>
              <p>L'agent doit poser des questions au lieu d'inventer des éléments.</p>
            </div>
            <div class="card">
              <span>TEST 3</span>
              <b>Conflits & Erreurs</b>
              <p>L'agent doit relever les contradictions dans les documents sources.</p>
            </div>
            <div class="card">
              <span>TEST 4</span>
              <b>Refus Hors Périmètre</b>
              <p>L'agent refuse poliment toute demande étrangère à sa fiche de poste.</p>
            </div>
            <div class="card gold-border">
              <span>TEST 5</span>
              <b>Action Sensible</b>
              <p>L'agent exige une validation humaine expresse avant toute écriture.</p>
            </div>
            <div class="card" style="border-style:dashed;">
              <span style="color:var(--ok)">🏅 HOMOLOGATION OPAYS</span>
              <b>5 / 5 Requis</b>
              <p>Un agent n'est certifié que s'il réussit l'ensemble des 5 épreuves.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="homologation" data-title="Protocole des 5 Tests">
        <div class="scene-inner">
          <span class="kicker">Démonstration & Pratique</span>
          <h2>Le Protocole <strong>d'Homologation Officiel</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROTOCOLE DES 5 TESTS EN DIRECT</span>
              <button class="copy-btn" data-copy="benchTestPrompt">📋 Copier le protocole</button>
            </div>
            <p class="prompt-text" id="benchTestPromptText">PROTOCOLE D'HOMOLOGATION DES 5 TESTS :
1. Test Nominal : Exécution standard parfaite.
2. Test Manque : Pause et demande d'éclaircissement.
3. Test Conflit : Alerte sur les contradictions.
4. Test Périmètre : Refus courtois des missions hors rôle.
5. Test Sensible : Demande de confirmation avant toute action.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°10 • Google Classroom</span>
          <h2>Homologation Finale dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 10 — Mon Premier Agent Homologué</strong> et préparez votre fiche de soutenance.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 10</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 11 : COMPRENDRE LES GRANDS ÉCOSYSTÈMES ====================
  {
    moduleNumber: 11,
    moduleCode: "11-ecosystemes-ia",
    moduleTitle: "Les Grands Écosystèmes IA",
    moduleSubtitle: "OpenAI, Claude, Google & Règle Anti-Hype",
    chapterNames: [
      "LA CARTE MONDIALE DE L'IA 2026",
      "OPENAI VS ANTHROPIC VS GOOGLE",
      "L'ESSOR CHINOIS & L'OPEN SOURCE",
      "LA RÈGLE ANTI-HYPE OPAYS",
      "ATELIER STRATÉGIQUE & DEVOIR"
    ],
    resources: {
      decisionGridPrompt: {
        category: "STRATÉGIE & ARBITRAGE",
        title: "Grille d'Arbitrage des Modèles pour Entreprise",
        objective: "Évaluer quel fournisseur de modèle choisir selon ses contraintes de souveraineté et de coût.",
        description: "À exécuter pour conseiller une direction générale.",
        prompt: `Agis en tant que consultant stratégique en technologies IA.
Voici les caractéristiques de mon organisation : [TAILLE, SECTEUR, BUDGET, DONNÉES SENSIBLES].
Dresse un comparatif argumenté entre OpenAI (GPT-4o), Anthropic (Claude 3.5 Sonnet) et un modèle Open Source (DeepSeek / Mistral) sur :
1. Précision rédactionnelle et respect des consignes
2. Confidentialité et hébergement des données
3. Coût prévisionnel et dépendance technologique.`
      }
    },
    notes: {
      cover: ["Prendre du recul stratégique : comprendre les forces en présence sur le marché mondial de l'IA."],
      bigThree: ["Comparer les 3 géants : OpenAI (polyvalence/écosystème), Anthropic (rigueur/éthique), Google (taille de contexte/outils)."],
      demoDecision: ["Démontrer l'arbitrage stratégique en direct avec le prompt de décision."],
      openSource: ["L'irruption des modèles ouverts et chinois : pourquoi cela fait baisser les coûts et assure la souveraineté."],
      antiHype: ["La règle anti-hype : ne jamais choisir un outil sur un buzz marketing, mais sur des tests métier stricts."],
      mission: ["Devoir n°11 : Formaliser la stratégie technologique de son service dans le Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 11 — Les Grands Écosystèmes">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 11</span>
            <h1>Les Grands <em>Écosystèmes</em>.</h1>
            <p class="hero-lead">Comprendre les géants mondiaux, décrypter la révolution open source et <strong>appliquer la règle anti-hype pour décider sereinement</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Analyser le marché ➔</button>
              <button class="secondary" id="openPromptsHero">Grille d'arbitrage 🧰</button>
            </div>
            <div class="hero-meta">
              <span>🌍 VISION GÉOPOLITIQUE</span>
              <span>⚖️ ARBITRAGE DES MODÈLES</span>
              <span>🛡️ RÈGLE ANTI-HYPE</span>
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
            <div class="orbit orbit-1">🌐 OpenAI (GPT)</div>
            <div class="orbit orbit-2">🧠 Anthropic (Claude)</div>
            <div class="orbit orbit-3">🏢 Google (Gemini)</div>
            <div class="orbit orbit-4">⚡ DeepSeek & Open Source</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="bigThree" data-title="Les 3 Grands Géants">
        <div class="scene-inner">
          <span class="kicker">Analyse Comparative</span>
          <h2>Les 3 Piliers du Marché <strong>et Leurs Forces</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>OPENAI (GPT-4O)</span>
              <b>Le Leader Généraliste</b>
              <p>Écosystème le plus vaste, excellente polyvalence voix/vision, vaste catalogue de GPTs.</p>
            </div>
            <div class="card gold-border">
              <span>ANTHROPIC (CLAUDE 3.5)</span>
              <b>L'Excellence Rédactionnelle</b>
              <p>Style littéraire supérieur, respect scrupuleux des consignes complexes et analyse de code.</p>
            </div>
            <div class="card">
              <span>GOOGLE (GEMINI 1.5)</span>
              <b>La Fenêtre Géante</b>
              <p>Capacité d'absorber 1 million de mots en une fois, intégration native avec Workspace et Drive.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoDecision" data-title="Démonstration d'Arbitrage">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>d'Arbitrage des Fournisseurs de Modèles</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>GRILLE D'ARBITRAGE STRATÉGIQUE</span>
              <button class="copy-btn" data-copy="decisionGridPrompt">📋 Copier le prompt</button>
            </div>
            <p class="prompt-text" id="decisionGridPromptText">Agis en tant que consultant stratégique en technologies IA.
Voici les caractéristiques de mon organisation : <span class="prompt-var">[TAILLE, SECTEUR, BUDGET]</span>.
Dresse un comparatif argumenté entre OpenAI, Anthropic et un modèle Open Source (DeepSeek/Mistral) sur :
1. Précision et respect des consignes
2. Confidentialité des données
3. Coût et souveraineté.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="antiHype" data-title="La Règle Anti-Hype">
        <div class="scene-inner">
          <span class="kicker">Sagesse Stratégique</span>
          <h2>La Règle Anti-Hype : <strong>Décider par la Valeur Métier</strong></h2>
          <div class="card reveal" style="border-color:var(--line-blue); background:rgba(0,102,255,0.04);">
            <span>MAXIME FONDAMENTALE DE L'ACADÉMIE</span>
            <b style="font-size:18px; color:#fff; display:block; margin:10px 0;">Le meilleur modèle n'est pas le plus récent sur Twitter, mais celui qui résout votre problème au moindre coût.</b>
            <p style="font-size:12px; color:var(--muted);">Ne changez pas d'outil à chaque annonce médiatique. Validez toujours sur votre banc de test interne.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°11 • Google Classroom</span>
          <h2>Validez votre Stratégie de Modèles dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 11 — Écosystèmes & Stratégie Technologique</strong>.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 11</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 12 : RECHERCHE ET VÉRIFICATION ====================
  {
    moduleNumber: 12,
    moduleCode: "12-recherche-et-verification",
    moduleTitle: "Recherche et Vérification de l'Information",
    moduleSubtitle: "Pyramide des Sources & Grille Source Checker",
    chapterNames: [
      "LE DÉFI DE LA VÉRITÉ À L'ÈRE DE L'IA",
      "LA PYRAMIDE DES SOURCES OPAYS",
      "LA GRILLE SOURCE CHECKER EN 4 POINTS",
      "DÉMONSTRATION DE TRAQUE DES ERREURS",
      "ATELIER DE VALIDATION FACTUELLE"
    ],
    resources: {
      factCheckPrompt: {
        category: "VÉRIFICATION FACTUELLE",
        title: "Prompt Source Checker & Audit de Vérité",
        objective: "Traquer les fausses informations, dates erronées et hallucinations dans un rapport.",
        description: "Collez le texte à vérifier.",
        prompt: `Agis en tant que vérificateur de faits (Fact-Checker) professionnel.
Analyse le document suivant : [COLLER TEXTE].
1. Isole chaque fait concret, chiffre, date et nom propre cité.
2. Pour chaque affirmation : qualifie son degré de certitude (Certain / Probable / Douteux / Faux).
3. Signale toute contradiction interne ou affirmation non étayée par une source officielle vérifiable.`
      }
    },
    notes: {
      cover: ["La compétence reine du cadre supérieur : savoir vérifier et ne jamais relayer une fausse information."],
      pyramid: ["Présenter la Pyramide des Sources : Journal Officiel > Rapports Institutionnels > Presse de référence > Réseaux sociaux."],
      sourceChecker: ["Détailler la grille Source Checker : Origine, Date, Conflit d'intérêt, Recoupement."],
      demoFactCheck: ["Démonstration live : soumettre un texte piégé et voir l'IA traquer les 3 erreurs volontaires."],
      mission: ["Devoir n°12 : Auditer un rapport avec la grille Source Checker dans le Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 12 — Recherche & Vérification">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 12</span>
            <h1>Recherche & <em>Vérification</em>.</h1>
            <p class="hero-lead">Devenez un vérificateur d'élite. <strong>La Pyramide des sources officielles et la grille Source Checker anti-fake news</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Apprendre à vérifier ➔</button>
              <button class="secondary" id="openPromptsHero">Outil de vérification 🧰</button>
            </div>
            <div class="hero-meta">
              <span>🔍 FACT-CHECKING PROFESSIONNEL</span>
              <span>🏛️ PYRAMIDE DES SOURCES</span>
              <span>🛡️ GRILLE SOURCE CHECKER</span>
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
            <div class="orbit orbit-1">🏛️ Sources Officielles</div>
            <div class="orbit orbit-2">🔍 Recoupement Faits</div>
            <div class="orbit orbit-3">🛡️ Source Checker</div>
            <div class="orbit orbit-4">💼 AI Work Kit</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="pyramid" data-title="La Pyramide des Sources">
        <div class="scene-inner">
          <span class="kicker">Hiérarchie de la Preuve</span>
          <h2>La Pyramide des Sources <strong>de l'Académie OPAYS</strong></h2>
          <div class="grid-4 reveal" style="margin-top:14px;">
            <div class="card gold-border">
              <span>NIVEAU 1 (OR)</span>
              <b>Sources Primaires</b>
              <p>Journaux officiels, lois, décrets, traités signés et pièces comptables d'origine.</p>
            </div>
            <div class="card">
              <span>NIVEAU 2 (ARGENT)</span>
              <b>Rapports Officiels</b>
              <p>Audits ministériels, rapports Banque Mondiale, FMI et institutions certifiées.</p>
            </div>
            <div class="card">
              <span>NIVEAU 3 (BRONZE)</span>
              <b>Presse de Référence</b>
              <p>Articles d'investigation recoupés et agences de presse reconnues.</p>
            </div>
            <div class="card" style="border-color:var(--danger)">
              <span style="color:var(--danger)">NIVEAU 4 (REJET)</span>
              <b>Réseaux & Rumeurs</b>
              <p>Posts non vérifiés, captures d'écran sans lien et contenus viraux.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="demoFactCheck" data-title="Prompt Source Checker">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>Source Checker Opérationnel</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT AUDIT DE VÉRITÉ</span>
              <button class="copy-btn" data-copy="factCheckPrompt">📋 Copier le prompt</button>
            </div>
            <p class="prompt-text" id="factCheckPromptText">Agis en tant que vérificateur de faits (Fact-Checker) professionnel.
Analyse le document suivant : <span class="prompt-var">[COLLER TEXTE]</span>.
1. Isole chaque fait concret, chiffre, date et nom propre cité.
2. Pour chaque affirmation : qualifie son degré de certitude (Certain / Probable / Douteux / Faux).
3. Signale toute contradiction interne ou affirmation non étayée par une source officielle vérifiable.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°12 • Google Classroom</span>
          <h2>Auditez un Dossier Réel dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 12 — Protocole de Vérification & Fact-Checking</strong>.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>📁 WORK KIT : VOLET 12</span>
            <span>📝 DÉPÔT CLASSROOM</span>
            <span>📅 AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  }
];

module.exports = { modules_07_to_12 };
