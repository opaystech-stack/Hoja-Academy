// Data definitions for Modules 13 to 18 with In-Slide Copy Cards

const modules_13_to_18 = [
  // ==================== MODULE 13 : SÉCURITÉ & CONFIDENTIALITÉ ====================
  {
    moduleNumber: 13,
    moduleCode: "13-securite-et-confidentialite",
    moduleTitle: "Sécurité et Confidentialité de l'IA",
    moduleSubtitle: "Anonymisation, Prompt Injection & AI Safety Card",
    chapterNames: [
      "LES 4 NIVEAUX DE SENSIBILITÉ DES DONNÉES",
      "LE PROTOCOLE D'ANONYMISATION PRÉALABLE",
      "PROMPT INJECTION & VULNÉRABILITÉS",
      "LA CHARTE DE SÉCURITÉ OPAYS",
      "ATELIER D'ANONYMISATION & DEVOIR"
    ],
    resources: {
      anonymizePrompt: {
        category: "SÉCURITÉ DES DONNÉES",
        title: "Prompt d'Anonymisation Automatisée",
        objective: "Remplacer tous les noms propres, montants exacts et identifiants par des variables neutres avant traitement.",
        description: "À exécuter localement ou sur un document avant envoi vers un LLM cloud.",
        prompt: `Agis en tant qu'officier de sécurité des données (DPO).
Prends le document suivant et anonymise-le intégralement :
[COLLER TEXTE BRUT].

Règles d'anonymisation :
1. Remplace chaque nom de personne par [AGENT_A], [AGENT_B], etc.
2. Remplace les noms d'entreprises par [ENTREPRISE_X].
3. Remplace les coordonnées bancaires et numéros de téléphone par [CONFIDENTIEL].
4. Livre le document anonymisé prêt à être analysé sans aucun risque de fuite.`
      }
    },
    notes: {
      cover: ["Module fondamental de responsabilité professionnelle : maîtriser les risques juridiques et de sécurité."],
      dataLevels: ["Présenter les 4 niveaux : Public (Vert), Interne (Bleu), Confidentiel (Orange), Secret Défense / Médical (Rouge)."],
      anonymization: ["Démontrer la technique du caviardage / anonymisation par variables [AGENT_X]."],
      demoAnon: ["Démonstration en direct d'anonymisation de dossier administratif."],
      promptInjection: ["Sensibiliser au prompt injection : quand un document externe tente de pirater les consignes de l'IA."],
      mission: ["Devoir n°13 : Signer son AI Safety Card et anonymiser un dossier test dans le Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 13 — Sécurité & Confidentialité">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 13</span>
            <h1>Sécurité & <em>Confidentialité</em>.</h1>
            <p class="hero-lead">Protéger vos données et votre organisation. <strong>Classification en 4 niveaux, anonymisation et parade contre le prompt injection</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Sécuriser mes usages</button>
              <button class="secondary" id="openPromptsHero">Protocole sécurité</button>
            </div>
            <div class="hero-meta">
              <span>4 NIVEAUX DE DONNÉES</span>
              <span>ANONYMISATION SYSTÉMATIQUE</span>
              <span>AI SAFETY CARD</span>
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
            <div class="orbit orbit-1">Niveau 1 : Public</div>
            <div class="orbit orbit-2">Niveau 2 : Interne</div>
            <div class="orbit orbit-3">Niveau 3 : Confidentiel</div>
            <div class="orbit orbit-4">Niveau 4 : Strict Interdit</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="dataLevels" data-title="Les 4 Niveaux de Données">
        <div class="scene-inner">
          <span class="kicker">Classification Officielle</span>
          <h2>Les 4 Niveaux de Sensibilité <strong>des Données</strong></h2>
          <div class="grid-4 reveal" style="margin-top:14px;">
            <div class="card">
              <span style="color:var(--ok)">NIVEAU 1 • PUBLIC (VERT)</span>
              <b>Libre Accès</b>
              <p>Lois publiées, communiqués de presse, articles web. Traitement libre sur tout outil.</p>
            </div>
            <div class="card">
              <span style="color:var(--blue-light)">NIVEAU 2 • INTERNE (BLEU)</span>
              <b>Usage Professionnel</b>
              <p>Notes de cadrage, procédures de service, synthèses de réunions sans données nominatives.</p>
            </div>
            <div class="card">
              <span style="color:var(--warn)">NIVEAU 3 • CONFIDENTIEL</span>
              <b>Anonymisation Obligatoire</b>
              <p>Contrats, chiffres d'affaires, évaluations RH. Anonymiser impérativement avant tout envoi.</p>
            </div>
            <div class="card" style="border-color:var(--danger)">
              <span style="color:var(--danger)">NIVEAU 4 • STRICTEMENT INTERDIT</span>
              <b>Zéro IA Publique</b>
              <p>Mots de passe, secrets d'État, dossiers médicaux nominatifs, codes d'accès bancaires.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="anonymization" data-title="Protocole d'Anonymisation">
        <div class="scene-inner">
          <span class="kicker">Démonstration & Prompt de Sécurité</span>
          <h2>Le Prompt <strong>d'Anonymisation Immédiate</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>PROMPT ANONYMISATION DE DOCUMENT</span>
              <button class="copy-btn" data-copy="anonymizePrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="anonymizePromptText">Agis en tant qu'officier de sécurité des données (DPO).
Prends le document suivant et anonymise-le intégralement :
<span class="prompt-var">[COLLER TEXTE BRUT]</span>.

Règles d'anonymisation :
1. Remplace chaque nom de personne par [AGENT_A], [AGENT_B].
2. Remplace les montants et comptes par [MONTANT_CONFIDENTIEL].
3. Rends le texte prêt pour un traitement IA sécurisé sans aucun risque de fuite.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°13 • Google Classroom</span>
          <h2>Validez votre Charte de Sécurité dans votre <strong>AI Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 13 — Sécurité, Confidentialité & AI Safety Card</strong>.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 13</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 14 : AUTOMATISER SON TRAVAIL ====================
  {
    moduleNumber: 14,
    moduleCode: "14-automatiser-son-travail",
    moduleTitle: "Automatiser son Travail avec l'IA",
    moduleSubtitle: "Automation Canvas, 3 Niveaux & Calcul du ROI",
    chapterNames: [
      "LES 3 NIVEAUX D'AUTOMATISATION",
      "L'AUTOMATION CANVAS EN 5 ÉTAPES",
      "DÉCLENCHEURS & ACTIONS EN CHAÎNE",
      "CALCUL DU ROI & TEMPS ÉCONOMISÉ",
      "ATELIER D'AUTOMATISATION & DEVOIR"
    ],
    resources: {
      automationCanvasPrompt: {
        category: "AUTOMATISATION DES PROCESSUS",
        title: "Prompt Automation Canvas",
        objective: "Découper une procédure administrative lourde pour la transformer en chaîne automatisée.",
        description: "Collez la description de votre procédure manuelle.",
        prompt: `Agis en tant qu'ingénieur en automatisation des processus de travail.
Voici une procédure manuelle de mon service : [DÉCRIRE LA PROCÉDURE].
Construis l'Automation Canvas complet :
1. DÉCLENCHEUR : Quel événement lance le processus (réception d'un mail, ajout d'un fichier) ?
2. TRAITEMENT IA : Quelles sont les 3 opérations d'extraction et de rédaction effectuées ?
3. CONTRÔLE HUMAIN : À quel moment exact l'humain valide-t-il le résultat ?
4. ACTION FINALE : Où le document final est-il déposé ou transmis ?
5. ROI ESTIMÉ : Calculer le temps économisé par semaine.`
      }
    },
    notes: {
      cover: ["Comment passer de la manipulation manuelle à l'automatisation fluide des tâches récurrentes."],
      threeLevels: ["Niveau 1 : Déclenchement manuel (1 clic), Niveau 2 : Semi-automatique (déclencheur + validation), Niveau 3 : Entièrement automatisé (tâches non critiques)."],
      canvas: ["Présenter l'Automation Canvas : Déclencheur, Traitement, Contrôle, Action, ROI."],
      demoRoi: ["Calculer en direct le gain financier et temporel : 10h libérées par mois par agent."],
      mission: ["Devoir n°14 : Compléter le Volet 14 du Work Kit avec un flux automatisé prêt au déploiement."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 14 — Automatiser son Travail">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 14</span>
            <h1>Automatiser <em>son Travail</em>.</h1>
            <p class="hero-lead">Mettre vos flux répétitifs en pilote automatique. <strong>L'Automation Canvas en 5 étapes et le calcul du retour sur investissement</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Automatiser mes flux</button>
              <button class="secondary" id="openPromptsHero">Automation Canvas</button>
            </div>
            <div class="hero-meta">
              <span>3 NIVEAUX D'AUTOMATISATION</span>
              <span>GAIN DE TEMPS MESURABLE</span>
              <span>L'AUTOMATION CANVAS</span>
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
            <div class="orbit orbit-1">Déclencheur</div>
            <div class="orbit orbit-2">Traitement IA</div>
            <div class="orbit orbit-3">Validation Humaine</div>
            <div class="orbit orbit-4">Action Finale</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="threeLevels" data-title="Les 3 Niveaux d'Automatisation">
        <div class="scene-inner">
          <span class="kicker">Maturité Opérationnelle</span>
          <h2>Les 3 Niveaux <strong>d'Automatisation en Entreprise</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>NIVEAU 1 • MANUEL AUGMENTÉ</span>
              <b>Déclenchement à la Demande</b>
              <p>Vous ouvrez l'outil, collez votre fichier et lancez votre Skill en 1 clic.</p>
            </div>
            <div class="card gold-border">
              <span>NIVEAU 2 • SEMI-AUTOMATIQUE</span>
              <b>Déclencheur + Validation Humaine</b>
              <p>Un nouvel email arrive → l'IA prépare la réponse → vous validez d'un clic avant envoi.</p>
            </div>
            <div class="card">
              <span>NIVEAU 3 • AUTONOME SUPERVISÉ</span>
              <b>Exécution en Arrière-Plan</b>
              <p>L'IA extrait les données de 50 factures et génère le tableau de bord automatiquement.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="canvas" data-title="L'Automation Canvas">
        <div class="scene-inner">
          <span class="kicker">Démonstration & Template</span>
          <h2>Le Template <strong>Automation Canvas Prêt à l'Emploi</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>AUTOMATION CANVAS OPAYS</span>
              <button class="copy-btn" data-copy="automationCanvasPrompt">Copier le template</button>
            </div>
            <p class="prompt-text" id="automationCanvasPromptText">Agis en tant qu'ingénieur en automatisation des processus de travail.
Voici une procédure manuelle de mon service : <span class="prompt-var">[DÉCRIRE LA PROCÉDURE]</span>.
Construis l'Automation Canvas complet :
1. Déclencheur → 2. Traitement IA → 3. Contrôle Humain → 4. Action Finale → 5. ROI estimé.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°14 • Google Classroom</span>
          <h2>Formalisez votre Pipeline d'Automatisation dans votre <strong>Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 14 — Automatisation des Tâches & Calcul du ROI</strong>.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 14</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 15 : PROJET FINAL & SOUTENANCE ====================
  {
    moduleNumber: 15,
    moduleCode: "15-projet-final-systeme-ia",
    moduleTitle: "Construire son Système IA Personnel",
    moduleSubtitle: "Assemblage Global, Soutenance & Certification",
    chapterNames: [
      "LE GRAND BILAN DU PARCOURS",
      "L'ASSEMBLAGE DES 10 VOLETS DU WORK KIT",
      "LA GRILLE D'ÉVALUATION DES 15 CRITÈRES",
      "PRÉPARATION DE LA SOUTENANCE (10 MIN)",
      "HOMOLOGATION & CERTIFICAT OFFICIEL"
    ],
    resources: {
      pitchPrompt: {
        category: "SOUTENANCE FINALE",
        title: "Prompt Générateur du Pitch de Soutenance",
        objective: "Structurer son intervention de 10 minutes pour la soutenance devant le jury officiel.",
        description: "Collez le résumé de votre système IA assemblé.",
        prompt: `Agis en tant que coach de soutenance professionnelle.
Voici le système IA que j'ai construit durant les 8 semaines de l'Académie OPAYS :
[RÉSUMER MON MÉTIER, MON ASSISTANT, MES SKILLS ET MON ROI].

Rédige la trame de ma présentation de soutenance en 10 minutes chrono selon la grille officielle :
1. Minute 0-2 : Mon Métier et mon défi initial (Le Problème).
2. Minute 2-5 : Mon Système IA assemblé (Agent.md, Skills, Outils).
3. Minute 5-8 : Démonstration en direct d'un cas concret.
4. Minute 8-10 : Bilan ROI chiffré et perspectives de déploiement.`
      }
    },
    notes: {
      cover: ["L'apothéose de la formation : le moment où chaque participant assemble son système complet."],
      workKitAssembly: ["Passer en revue les 10 volets du AI Work Kit : c'est votre portefeuille professionnel certifié."],
      rubric15: ["Présenter la grille d'évaluation des 15 critères : Cohérence métier, Qualité d'Agent.md, Sécurité, ROI."],
      pitchPrep: ["Entraîner les apprenants à pitcher leur système en 10 minutes chrono."],
      mission: ["Devoir n°15 : Déposer son AI Work Kit finalisé sur Classroom pour passage devant le jury."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 15 — Projet Final & Soutenance">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 15</span>
            <h1>Mon Système IA <em>Personnel</em>.</h1>
            <p class="hero-lead">Le grand assemblage des 10 volets. <strong>Préparez votre soutenance de 10 minutes et décrochez votre Certification Professionnelle</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Finaliser mon système</button>
              <button class="secondary" id="openPromptsHero">Trame de soutenance</button>
            </div>
            <div class="hero-meta">
              <span>PORTFOLIO DE 10 VOLETS</span>
              <span>SOUTENANCE DE 10 MINUTES</span>
              <span>CERTIFICATION OFFICIELLE</span>
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
            <div class="orbit orbit-1">10 Volets Work Kit</div>
            <div class="orbit orbit-2">15 Critères Jury</div>
            <div class="orbit orbit-3">Soutenance 10 min</div>
            <div class="orbit orbit-4">Certificat OPAYS</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="workKitAssembly" data-title="L'Assemblage des 10 Volets">
        <div class="scene-inner">
          <span class="kicker">Votre Actif Professionnel</span>
          <h2>Les 10 Piliers de Votre <strong>AI Work Kit Final</strong></h2>
          <div class="grid-4 reveal" style="margin-top:14px;">
            <div class="card">
              <span>BLOC 1 (SEM. 1-2)</span>
              <b>Fondations & Prompts</b>
              <p>Volets 01 à 04 : Diagnostic de poste, audit des outils et bibliothèque C.O.R.E.</p>
            </div>
            <div class="card">
              <span>BLOC 2 (SEM. 3-4)</span>
              <b>Documents & Skills</b>
              <p>Volets 05 à 07 : NotebookLM, fiches Skills Métiers et Workflows avec loops.</p>
            </div>
            <div class="card">
              <span>BLOC 3 (SEM. 5-6)</span>
              <b>Assistants & Outils</b>
              <p>Volets 08 à 10 : Fiche Agent.md, connecteurs MCP et banc d'homologation.</p>
            </div>
            <div class="card gold-border">
              <span>BLOC 4 (SEM. 7-8)</span>
              <b>Sécurité & Déploiement</b>
              <p>Volets 11 à 15 : Sécurité, automatisation et plan d'exploitation durable.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="pitchPrep" data-title="Trame de Soutenance">
        <div class="scene-inner">
          <span class="kicker">Préparation au Jury</span>
          <h2>La Structure des <strong>10 Minutes de Soutenance</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>TRAME OFFICIELLE DU PITCH</span>
              <button class="copy-btn" data-copy="pitchPrompt">Copier la trame</button>
            </div>
            <p class="prompt-text" id="pitchPromptText">MINUTAGE DE SOUTENANCE OFFICIELLE OPAYS :
- 00 à 02 min : Mon métier, mon organisation et mon gisement de temps perdu.
- 02 à 05 min : Présentation de mon Système IA (Agent.md, Skills intégrés).
- 05 à 08 min : Démonstration en direct sous les yeux du jury.
- 08 à 10 min : Bilan ROI chiffré et plan de déploiement dans mon service.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Homologation Finale">
        <div class="scene-inner center">
          <span class="kicker">Validation Finale • Google Classroom</span>
          <h2>Déposez votre <strong>AI Work Kit Complet</strong></h2>
          <p class="lead">Votre classeur complet est déposé sur Google Classroom pour instruction par le jury d'évaluation.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>DÉPÔT GLOBAL DU WORK KIT</span>
            <span>ÉMISSION DU CERTIFICAT</span>
            <span>PASSAGE DU JURY</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 16 : L'IA AU QUOTIDIEN ====================
  {
    moduleNumber: 16,
    moduleCode: "16-ia-au-quotidien",
    moduleTitle: "L'IA au Quotidien Professionnel",
    moduleSubtitle: "Routine des 15 Min & AI Operating Plan",
    chapterNames: [
      "L'ANCRAGE POST-FORMATION",
      "LA ROUTINE DES 15 MINUTES DU MATIN",
      "L'AI OPERATING PLAN (AOP)",
      "LE CALENDRIER DE SUIVI J+7 / J+30",
      "CLÔTURE OFFICIELLE DE LA PROMOTION"
    ],
    resources: {
      morningRoutinePrompt: {
        category: "ROUTINE QUOTIDIENNE",
        title: "Prompt Briefing Matinal des 15 Minutes",
        objective: "Lancer sa journée avec son assistant en 15 minutes chrono.",
        description: "À exécuter chaque matin à 8h30.",
        prompt: `Agis en tant que chef de cabinet personnel.
Voici mes priorités et mes emails urgents de la journée : [LISTE RAPIDE].
1. Classe ces éléments selon l'ordre d'urgence et d'impact réel.
2. Rédige les 2 brouillons de réponse prioritaires.
3. Fixe-moi 1 seul objectif majeur à avoir achevé avant 12h00.`
      }
    },
    notes: {
      cover: ["Dernière séance live officielle : comment ancrer définitivement l'IA dans votre vie professionnelle."],
      routine15: ["La routine des 15 minutes : tri des priorités, rédaction des réponses urgentes, cadrage de la journée."],
      demoRoutine: ["Démontrer en direct le briefing matinal en 15 minutes avec le prompt chef de cabinet."],
      aop: ["L'AI Operating Plan : le document d'exploitation pour maintenir ses agents à jour."],
      followup: ["Le calendrier de suivi post-formation : Permanence à J+7, Bilan à J+21, Réunion Alumni à J+30."],
      mission: ["Clôture solennelle : bienvenue dans le réseau des Alumni de l'Académie OPAYS !"]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 16 — L'IA au Quotidien">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 16</span>
            <h1>L'IA au <em>Quotidien</em>.</h1>
            <p class="hero-lead">Ancrez vos super-pouvoirs pour toujours. <strong>La routine des 15 minutes du matin, l'AI Operating Plan et le réseau Alumni OPAYS</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Découvrir la routine</button>
              <button class="secondary" id="openPromptsHero">Briefing matinal</button>
            </div>
            <div class="hero-meta">
              <span>ROUTINE DES 15 MINUTES</span>
              <span>AI OPERATING PLAN</span>
              <span>RÉSEAU ALUMNI ACTIF</span>
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
            <div class="orbit orbit-1">15 min Matin</div>
            <div class="orbit orbit-2">Operating Plan</div>
            <div class="orbit orbit-3">Suivi J+30</div>
            <div class="orbit orbit-4">Communauté OPAYS</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="routine15" data-title="La Routine des 15 Min">
        <div class="scene-inner">
          <span class="kicker">Ancrage Quotidien</span>
          <h2>La Routine des <strong>15 Minutes du Matin</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>08H30 - 08H35 (5 MIN)</span>
              <b>Briefing & Priorisation</b>
              <p>Soumettre ses urgences à son assistant et obtenir la liste des 3 priorités nettes.</p>
            </div>
            <div class="card gold-border">
              <span>08H35 - 08H40 (5 MIN)</span>
              <b>Premiers Brouillons</b>
              <p>Générer les 2 courriers ou notes complexes de la matinée grâce à ses Skills.</p>
            </div>
            <div class="card">
              <span>08H40 - 08H45 (5 MIN)</span>
              <b>Validation & Lancement</b>
              <p>Relire, ajuster et signer les livrables avant la première réunion de service.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoRoutine" data-title="Démonstration Briefing">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>du Briefing Matinal Opérationnel</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>BRIEFING MATINAL EN 15 MINUTES</span>
              <button class="copy-btn" data-copy="morningRoutinePrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="morningRoutinePromptText">Agis en tant que chef de cabinet personnel.
Voici mes priorités et urgences du jour : <span class="prompt-var">[LISTE BRUTE DES EMAILS / TÂCHES]</span>.
1. Classe ces éléments par ordre d'urgence et d'impact.
2. Rédige les 2 brouillons de réponse prioritaires.
3. Fixe 1 objectif majeur à achever avant 12h00.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="3" data-note="followup" data-title="Calendrier Post-Formation">
        <div class="scene-inner">
          <span class="kicker">Accompagnement dans la Durée</span>
          <h2>Le Calendrier de Suivi <strong>Post-Formation OPAYS</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>J + 7</span>
              <b>Permanence d'Ancrage</b>
              <p>Session live sur Meet pour débloquer les premières difficultés sur le terrain.</p>
            </div>
            <div class="card">
              <span>J + 21</span>
              <b>Revue de Performance</b>
              <p>Mesure du temps réel économisé et ajustement des fiches Agent.md.</p>
            </div>
            <div class="card gold-border">
              <span>J + 30</span>
              <b>Grande Réunion Alumni</b>
              <p>Partage des meilleurs cas d'usage de la promotion et intégration au cercle des pairs.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Clôture Officielle">
        <div class="scene-inner center">
          <div class="logo-halo" style="width:130px; height:130px; margin-bottom:14px;">
            <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:90px; height:90px;">
              <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
              <g fill="#0066FF">
                <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                <rect x="850" y="340" width="100" height="100" rx="16"/>
                <rect x="960" y="440" width="80" height="80" rx="14"/>
              </g>
            </svg>
          </div>
          <span class="kicker">Félicitations Officielles</span>
          <h2>Vous êtes désormais un <strong>Leader Augmenté par l'IA.</strong></h2>
          <p class="lead">L'Académie OPAYS vous remercie pour votre engagement et votre rigueur d'ingénierie.</p>
          <div class="hero-meta reveal" style="justify-content:center; margin-top:12px;">
            <span>CERTIFIÉ OPAYS ACADEMY</span>
            <span>MEMBRE DU RÉSEAU ALUMNI</span>
            <span>EN ROUTE POUR L'EXCELLENCE</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 17 : SPÉCIALISATION PROFESSIONNELLE ====================
  {
    moduleNumber: 17,
    moduleCode: "17-specialisation-professionnelle",
    moduleTitle: "Atelier de Spécialisation Professionnelle",
    moduleSubtitle: "6 Parcours Sectoriels Sur-Mesure",
    chapterNames: [
      "LE CADRAGE PAR SECTEUR D'ACTIVITÉ",
      "LES 6 PARCOURS MÉTIERS OPAYS",
      "ANALYSE DE CAS SECTORIELS COMPLEXES",
      "ADAPTATION DES WORKFLOWS SUR-MESURE",
      "ATELIER D'APPLICATION SECTORIELLE"
    ],
    resources: {
      sectorSpecializationPrompt: {
        category: "SPÉCIALISATION MÉTIER",
        title: "Prompt Cadrage Métier Sur-Mesure",
        objective: "Adapter un workflow générique aux contraintes juridiques, réglementaires et déontologiques de son secteur.",
        description: "Sélectionnez votre secteur parmi les 6 parcours.",
        prompt: `Agis en tant qu'expert métier senior dans le secteur : [CHOISIR: FONCTION PUBLIQUE / SANTÉ / BANQUE & FINANCE / ÉDUCATION / COMMERCE & PME / ONG & DÉVELOPPEMENT].
Adapte le prompt standard suivant pour respecter scrupuleusement la déontologie, le vocabulaire officiel et les contraintes réglementaires de notre profession :
[COLLER PROMPT STANDARD].`
      }
    },
    notes: {
      cover: ["Module de spécialisation approfondie pour adapter l'IA aux spécificités exactes de votre corps de métier."],
      sixTracks: ["Parcourir les 6 filières : Administration, Finance, Santé/Social, Commerce, ONG, Éducation."],
      demoSector: ["Démonstration en direct d'adaptation sectorielle d'un prompt standard."],
      sectorCases: ["Analyser des cas concrets de haut niveau par secteur."],
      mission: ["Devoir n°17 : Rédiger le classeur de spécialisation sectorielle dans son AI Work Kit."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 17 — Spécialisation Professionnelle">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 17</span>
            <h1>Spécialisation <em>Professionnelle</em>.</h1>
            <p class="hero-lead">Appliquez l'IA aux exigences de votre corporation. <strong>6 parcours sectoriels calibrés pour la Fonction Publique, PME, Finance, ONG et Santé</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Choisir mon parcours</button>
              <button class="secondary" id="openPromptsHero">Cadrage sectoriel</button>
            </div>
            <div class="hero-meta">
              <span>6 PARCOURS DÉDIÉS</span>
              <span>CONFORMITÉ RÉGLEMENTAIRE</span>
              <span>CAS MÉTIERS AVANCÉS</span>
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
            <div class="orbit orbit-1">Fonction Publique</div>
            <div class="orbit orbit-2">PME & Commerce</div>
            <div class="orbit orbit-3">Banque & Finance</div>
            <div class="orbit orbit-4">ONG & Projets</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="sixTracks" data-title="Les 6 Parcours Sectoriels">
        <div class="scene-inner">
          <span class="kicker">Cartographie des Spécialités</span>
          <h2>Les 6 Parcours Métiers <strong>de l'Académie</strong></h2>
          <div class="grid-3 reveal" style="margin-top:14px;">
            <div class="card">
              <span>PARCOURS 1</span>
              <b>Administration & Fonction Publique</b>
              <p>Notes de synthèse ministérielles, circulaires, arrêtés et courriers hiérarchiques.</p>
            </div>
            <div class="card">
              <span>PARCOURS 2</span>
              <b>PME, Commerce & Industrie</b>
              <p>Prospection B2B, devis, réponses aux appels d'offres et gestion de la relation client.</p>
            </div>
            <div class="card">
              <span>PARCOURS 3</span>
              <b>Banque, Finance & Audit</b>
              <p>Analyse de bilans, contrôle de gestion, conformité KYC et détection de fraudes.</p>
            </div>
            <div class="card">
              <span>PARCOURS 4</span>
              <b>ONG & Gestion de Projets</b>
              <p>Rapports de bailleurs, suivi M&E, matrices de cadre logique et plaidoyers.</p>
            </div>
            <div class="card">
              <span>PARCOURS 5</span>
              <b>Ressources Humaines & Juridique</b>
              <p>Fiches de poste, grilles d'entretien, conventions et conciliation sociale.</p>
            </div>
            <div class="card gold-border">
              <span>PARCOURS 6</span>
              <b>Communication & Médias</b>
              <p>Stratégie éditoriale, dossiers de presse, communication de crise et réseaux sociaux.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoSector" data-title="Démonstration Sectorielle">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>d'Adaptation aux Normes Sectorielles</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>CADRAGE DÉONTOLOGIQUE & SECTORIEL</span>
              <button class="copy-btn" data-copy="sectorSpecializationPrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="sectorSpecializationPromptText">Agis en tant qu'expert métier senior dans le secteur : <span class="prompt-var">[VOTRE SECTEUR]</span>.
Adapte le prompt standard suivant pour respecter scrupuleusement la déontologie, le vocabulaire officiel et les contraintes réglementaires de notre profession :
<span class="prompt-var">[COLLER PROMPT STANDARD]</span>.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Mission & Work Kit">
        <div class="scene-inner center">
          <span class="kicker">Mission n°17 • Google Classroom</span>
          <h2>Enregistrez votre Classeur Sectoriel dans votre <strong>Work Kit</strong></h2>
          <p class="lead">Complétez le <strong>Volet 17 — Spécialisation Métier & Référentiel Sectoriel</strong>.</p>
          <div class="hero-meta reveal" style="justify-content:center;">
            <span>WORK KIT : VOLET 17</span>
            <span>DÉPÔT CLASSROOM</span>
            <span>AVANT LUNDI 23H59</span>
          </div>
        </div>
      </section>`
    ]
  },

  // ==================== MODULE 18 : AI LANDSCAPE 2026 & VEILLE ====================
  {
    moduleNumber: 18,
    moduleCode: "18-grands-ecosystemes-ia",
    moduleTitle: "AI Landscape 2026 & Veille Stratégique",
    moduleSubtitle: "Modèles Spécialisés & Feuille de Route Durable",
    chapterNames: [
      "LES GRANDES TENDANCES TECHNOLOGIQUES 2026",
      "PETITS MODÈLES LOCAUX (SLM) VS MODÈLES GÉANTS",
      "ORGANISER SA VEILLE SANS SE LAISSER SUBMERGER",
      "LA FEUILLE DE ROUTE STRATÉGIQUE OPAYS",
      "BILAN FINAL DE L'ACADÉMIE"
    ],
    resources: {
      watchRoutinePrompt: {
        category: "VEILLE STRATÉGIQUE",
        title: "Prompt Synthèse de Veille Technologique",
        objective: "Filtrer les actualités IA de la semaine pour ne retenir que les 3 vraies ruptures professionnelles.",
        description: "À exécuter le vendredi après-midi.",
        prompt: `Agis en tant que directeur de la prospective technologique.
Analyse les 10 actualités IA majeures de la semaine : [COLLER LIENS OU TITRES].
1. Isole les 2 seules innovations qui ont un impact réel sur le monde professionnel.
2. Élimine tout le bruit marketing et les promesses non vérifiées.
3. Rédige un mémo de 200 mots pour ma direction : "Ce qui change concrètement pour nos opérations".`
      }
    },
    notes: {
      cover: ["Module d'ouverture stratégique : anticiper les 2 prochaines années pour rester toujours en avance."],
      slmVsLlm: ["L'essor des Small Language Models (SLM) : des modèles légers qui tournent sur PC local ou smartphone sans connexion."],
      demoWatch: ["Démonstration live du mémo de veille stratégique en 15 minutes le vendredi."],
      watchRoutine: ["Comment organiser sa veille en 15 minutes le vendredi sans être submergé par les réseaux."],
      roadmap: ["La feuille de route d'évolution permanente de l'Académie OPAYS."],
      mission: ["Bilan final : clôture de l'ensemble des 18 modules pédagogiques de l'Académie OPAYS."]
    },
    scenes: [
      `<section class="scene active" data-chapter="0" data-note="cover" data-title="Module 18 — AI Landscape 2026">
        <div class="scene-inner hero-layout">
          <div>
            <span class="kicker">Académie OPAYS • Séance 18</span>
            <h1>AI Landscape <em>2026</em>.</h1>
            <p class="hero-lead">Anticipez les ruptures de demain. <strong>Petits modèles locaux, agents autonomes et organisation de votre veille stratégique sans saturation</strong>.</p>
            <div class="hero-actions">
              <button class="primary" data-next>Découvrir l'avenir</button>
              <button class="secondary" id="openPromptsHero">Mémo de veille</button>
            </div>
            <div class="hero-meta">
              <span>VISION PROSPECTIVE 2026</span>
              <span>SMALL LANGUAGE MODELS</span>
              <span>VEILLE STRATÉGIQUE</span>
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
            <div class="orbit orbit-1">Modèles Locaux (SLM)</div>
            <div class="orbit orbit-2">Essaims d'Agents</div>
            <div class="orbit orbit-3">Souveraineté Données</div>
            <div class="orbit orbit-4">Roadmap 2026</div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="1" data-note="slmVsLlm" data-title="L'Essor des Modèles Locaux">
        <div class="scene-inner">
          <span class="kicker">Révolution Technologique</span>
          <h2>Small Language Models (SLM) : <strong>L'IA sur Votre PC sans Internet</strong></h2>
          <div class="grid-2 reveal" style="margin-top:14px;">
            <div class="card">
              <span>LES MODÈLES GÉANTS CLOUD (LLM)</span>
              <b>Puissance Brute & Polyvalence</b>
              <p>GPT-4o, Claude 3.5. Hébergés sur des supercalculateurs, nécessitent une connexion et des abonnements.</p>
            </div>
            <div class="card gold-border">
              <span>LES PETITS MODÈLES LOCAUX (SLM)</span>
              <b>Confidentialité & Zéro Connexion</b>
              <p>Llama 3, Phi-3, Mistral 7B. Tournent directement sur votre ordinateur portable professionnel sans aucune fuite de données.</p>
            </div>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="2" data-note="demoWatch" data-title="Démonstration Veille">
        <div class="scene-inner">
          <span class="kicker">Démonstration en Direct</span>
          <h2>Le Prompt <strong>de Synthèse de Veille Hebdomadaire</strong></h2>
          <div class="prompt-card reveal">
            <div class="prompt-header">
              <span>MÉMO DE VEILLE STRATÉGIQUE</span>
              <button class="copy-btn" data-copy="watchRoutinePrompt">Copier le prompt</button>
            </div>
            <p class="prompt-text" id="watchRoutinePromptText">Agis en tant que directeur de la prospective technologique.
Analyse les actualités IA de la semaine : <span class="prompt-var">[COLLER LIENS / TITRES]</span>.
1. Isole les 2 seules innovations à impact réel sur les opérations.
2. Élimine tout le bruit marketing et le buzz.
3. Rédige un mémo exécutif de 200 mots pour la direction.</p>
          </div>
        </div>
      </section>`,
      `<section class="scene" data-chapter="4" data-note="mission" data-title="Bilan Final du Programme">
        <div class="scene-inner center">
          <div class="logo-halo" style="width:130px; height:130px; margin-bottom:14px;">
            <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:90px; height:90px;">
              <path d="M 680 200 A 380 380 0 1 0 680 800" fill="none" stroke="#001f4d" stroke-width="120" stroke-linecap="butt"/>
              <g fill="#0066FF">
                <path d="M 280 400 L 780 380 L 820 440 L 740 480 L 560 510 L 420 820 L 320 820 L 460 510 L 280 480 Z" />
                <rect x="850" y="340" width="100" height="100" rx="16"/>
                <rect x="960" y="440" width="80" height="80" rx="14"/>
              </g>
            </svg>
          </div>
          <span class="kicker">Programme Officiel Intégralement Achevé</span>
          <h2>Félicitations ! Les <strong>18 Modules de l'Académie OPAYS sont Déployés.</strong></h2>
          <p class="lead">Le standard d'excellence pédagogique et technologique OPAYS est désormais scellé.</p>
          <div class="hero-meta reveal" style="justify-content:center; margin-top:12px;">
            <span>18 MODULES HTML INTERACTIFS</span>
            <span>STANDARDIZATION COMPLETE</span>
            <span>PRÊT POUR LES COHORTES</span>
          </div>
        </div>
      </section>`
    ]
  }
];

module.exports = { modules_13_to_18 };
