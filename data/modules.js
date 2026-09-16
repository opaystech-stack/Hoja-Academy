/**
 * OPAYS ACADEMY — Registre central des 18 modules
 * SOURCE DE VÉRITÉ UNIQUE. Normalisé par scripts/build_registry.js — ne pas éditer à la main.
 * Consommé par : course-hub.html, formateur-dashboard.html, scripts de test.
 * Ordre pédagogique : systeme-operationnel/01_PARCOURS_PEDAGOGIQUE_DEFINITIF.md (séances).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OPAYS_MODULES = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return [
  {
    "num": 1,
    "code": "01-comprendre-ia",
    "title": "Comprendre l'IA",
    "subtitle": "LLM, Hallucinations & Démystification",
    "objective": "Comprendre l'IA, démystifier les LLM et identifier les hallucinations. Grille des 5 tests comparatifs.",
    "week": 1,
    "seanceNum": 1,
    "seance": "Séance 01",
    "duration": 110,
    "slides": 22,
    "prompts": 7,
    "status": "ready",
    "phases": [
      {
        "name": "Ouverture & Icebreaker",
        "time": "0-10 min",
        "duration": 10
      },
      {
        "name": "Qu'est-ce que l'IA ? LLM & Moteurs",
        "time": "10-35 min",
        "duration": 25
      },
      {
        "name": "Démonstration Live (5 Expériences)",
        "time": "35-65 min",
        "duration": 30
      },
      {
        "name": "Atelier Pratique en Binôme",
        "time": "65-95 min",
        "duration": 30
      },
      {
        "name": "Work Kit, Mission & Clôture",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Poser le climat de bienveillance et démystifier l'IA dès la première minute. Dire au groupe : aujourd'hui, zéro jargon mathématique.",
      "talk": "Rassurer les participants non-techniques. Montrer que l'IA est un assistant, pas un remplaçant. Analogie du moteur de voiture.",
      "transition": "Passons à la découverte de l'écosystème complet lors de la prochaine séance."
    },
    "mission": "Tester 3 tâches professionnelles sur 2 modèles IA différents. Déposer le comparatif sur Classroom avant lundi 23h59.",
    "workKit": "Volet 01 — Mes Premières Expériences IA",
    "promptChips": [
      {
        "cat": "DÉMONSTRATION",
        "title": "5 Prompts d'Expérience Live",
        "key": "demo1"
      },
      {
        "cat": "ATELIER",
        "title": "Expériences Sectorielles",
        "key": "exp1"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "01"
  },
  {
    "num": 2,
    "code": "02-ecosysteme-ia",
    "title": "Écosystème IA",
    "subtitle": "Les 5 Familles d'Outils",
    "objective": "Cartographier l'écosystème IA, choisir le bon outil par famille et maîtriser la formule C.O.R.E.",
    "week": 1,
    "seanceNum": 2,
    "seance": "Séance 02 (+ M03)",
    "duration": 110,
    "slides": 7,
    "prompts": 2,
    "status": "ready",
    "phases": [
      {
        "name": "Les 5 Familles d'Outils IA",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Démo Comparative Multi-Modèles",
        "time": "25-45 min",
        "duration": 20
      },
      {
        "name": "Méthode C.O.R.E.",
        "time": "45-75 min",
        "duration": 30
      },
      {
        "name": "Atelier Prompts & Audit",
        "time": "75-100 min",
        "duration": 25
      },
      {
        "name": "Work Kit & Mission",
        "time": "100-110 min",
        "duration": 10
      }
    ],
    "notes": {
      "goal": "Cartographier l'écosystème IA. 90% des outils utilisent les 3 mêmes moteurs.",
      "talk": "Démontrer ChatGPT vs Claude vs Gemini côte à côte. Introduire la Règle des 5 Questions.",
      "transition": "La prochaine séance sera dédiée à votre propre poste de travail."
    },
    "mission": "Le test comparatif de 2 outils sur une tâche réelle : noter les écarts de style et de précision. Dépôt Classroom (Thème 02).",
    "workKit": "Volet 02 — Ma Pile d'Outils + Volet 03 — Mes Prompts C.O.R.E.",
    "promptChips": [
      {
        "cat": "DÉMO COMPARATIVE",
        "title": "Prompt Test Multi-Modèles",
        "key": "compPrompt"
      },
      {
        "cat": "ATELIER",
        "title": "Audit d'un Outil IA",
        "key": "q5Prompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "02"
  },
  {
    "num": 3,
    "code": "03-bien-utiliser-ia",
    "title": "Bien Utiliser l'IA",
    "subtitle": "Méthode C.O.R.E. — Formulation & Cadrage Pro",
    "objective": "Passer du prompt flou au cadrage professionnel. Techniques d'affinage en cascade.",
    "week": 1,
    "seanceNum": 2,
    "seance": "Séance 02 (+ M02)",
    "duration": 90,
    "slides": 6,
    "prompts": 2,
    "status": "ready",
    "phases": [
      {
        "name": "Départ Choc : « Fais-moi un rapport »",
        "time": "0-10 min",
        "duration": 10
      },
      {
        "name": "La Méthode en 5 Étapes",
        "time": "10-30 min",
        "duration": 20
      },
      {
        "name": "Démonstration en Cascade",
        "time": "30-50 min",
        "duration": 20
      },
      {
        "name": "Atelier : Améliorer sa Demande",
        "time": "50-80 min",
        "duration": 30
      },
      {
        "name": "Les 10 Techniques & Devoir",
        "time": "80-90 min",
        "duration": 10
      }
    ],
    "notes": {
      "goal": "Passer du prompt flou au cadrage professionnel : Contexte → Objectif → Tâche → Contraintes → Résultat attendu.",
      "talk": "L'IA ne lit pas dans notre tête. Le contexte précis vaut 10 fois le rôle. L'itération en cascade bat le prompt parfait.",
      "transition": "Prochaine séance : cartographier votre propre travail avec le microscope métier."
    },
    "mission": "Créer sa boîte de 5 prompts C.O.R.E. appliqués à son travail. Dépôt Classroom.",
    "workKit": "Volet 03 — Mes Prompts C.O.R.E.",
    "promptChips": [
      {
        "cat": "MÉTHODE",
        "title": "Template Prompt C.O.R.E.",
        "key": "coreTemplate"
      },
      {
        "cat": "ATELIER",
        "title": "Affinage en Cascade",
        "key": "cascadePrompt"
      }
    ],
    "durationLabel": "90 min",
    "numStr": "03"
  },
  {
    "num": 4,
    "code": "04-ia-dans-mon-travail",
    "title": "L'IA dans Mon Travail",
    "subtitle": "Audit de Poste & Matrice ROI",
    "objective": "Cartographier son travail et identifier ses 3 cas d'usage ROI. Microscope métier.",
    "week": 2,
    "seanceNum": 3,
    "seance": "Séance 03",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Le Microscope Métier",
        "time": "0-20 min",
        "duration": 20
      },
      {
        "name": "Matrice Fréquence × Pénibilité",
        "time": "20-40 min",
        "duration": 20
      },
      {
        "name": "Prompt Audit de Poste",
        "time": "40-60 min",
        "duration": 20
      },
      {
        "name": "Plan de Délégation à l'IA",
        "time": "60-95 min",
        "duration": 35
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Module pivot : passer de l'expérimentation générale à l'ancrage sur son propre bureau.",
      "talk": "Expliquer le microscope métier. Fréquence x Pénibilité = corvées répétitives prioritaires.",
      "transition": "Les 3 tâches identifiées vont maintenant être traitées par l'IA documentaire."
    },
    "mission": "Tableau d'audit des 10 tâches hebdomadaires. Dépôt Classroom.",
    "workKit": "Volet 04 — Mon Audit de Poste",
    "promptChips": [
      {
        "cat": "DIAGNOSTIC",
        "title": "Prompt Microscope Métier",
        "key": "auditPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "04"
  },
  {
    "num": 5,
    "code": "05-documents-et-donnees",
    "title": "Documents & Données",
    "subtitle": "PDF, Tableaux & NotebookLM",
    "objective": "Traiter des PDF, rapports et tableaux sans hallucination. Citations sourcées.",
    "week": 2,
    "seanceNum": 4,
    "seance": "Séance 04",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Les 6 Opérations Documentaires",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Démo NotebookLM",
        "time": "25-50 min",
        "duration": 25
      },
      {
        "name": "Extraction & Tableaux",
        "time": "50-75 min",
        "duration": 25
      },
      {
        "name": "Atelier sur Document Réel",
        "time": "75-100 min",
        "duration": 25
      },
      {
        "name": "Work Kit & Mission",
        "time": "100-110 min",
        "duration": 10
      }
    ],
    "notes": {
      "goal": "Entrée dans le bloc documentaire : transformer des PDF de 100 pages en alliés quotidiens.",
      "talk": "Démontrer NotebookLM : zéro hallucination car ancré sur vos sources. 6 super-pouvoirs.",
      "transition": "Prochain niveau : industrialiser vos prompts sous forme de Skills."
    },
    "mission": "Produire 1 synthèse exécutive sourcée à partir d'un document réel. Dépôt Classroom.",
    "workKit": "Volet 05 — Traitement Documentaire",
    "promptChips": [
      {
        "cat": "SOURCING",
        "title": "Consigne NotebookLM",
        "key": "notebookLmPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "05"
  },
  {
    "num": 6,
    "code": "06-les-skills",
    "title": "Les Skills Métiers",
    "subtitle": "Skill Canvas en 6 Piliers",
    "objective": "Transformer une tâche répétitive en Skill documenté et réutilisable à l'infini.",
    "week": 3,
    "seanceNum": 5,
    "seance": "Séance 05",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Du Prompt au Skill",
        "time": "0-15 min",
        "duration": 15
      },
      {
        "name": "Le Skill Canvas en 6 Piliers",
        "time": "15-40 min",
        "duration": 25
      },
      {
        "name": "Démo Skill en Live",
        "time": "40-55 min",
        "duration": 15
      },
      {
        "name": "Création de Skills",
        "time": "55-95 min",
        "duration": 40
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Industrialiser ses prompts sous forme de Skills pérennes. Un Skill = une procédure réutilisable à l'infini.",
      "talk": "Différence : prompt = question ponctuelle. Skill = recette industrielle enregistrée.",
      "transition": "Les Skills vont maintenant être enchaînés dans des Workflows multi-étapes."
    },
    "mission": "Documenter et tester 2 Skills métiers réels. Dépôt Classroom.",
    "workKit": "Volet 06 — Mes Skills Métiers",
    "promptChips": [
      {
        "cat": "SKILL CANVAS",
        "title": "Structure d'un Skill Métier",
        "key": "skillCanvasTemplate"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "06"
  },
  {
    "num": 7,
    "code": "07-workflows-et-loops",
    "title": "Workflows & Loops",
    "subtitle": "Boucles & Human-in-the-Loop",
    "objective": "Décomposer une mission en étapes et boucles d'auto-critique avec contrôle humain.",
    "week": 3,
    "seanceNum": 6,
    "seance": "Séance 06",
    "duration": 110,
    "slides": 5,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Qu'est-ce qu'un Workflow ?",
        "time": "0-20 min",
        "duration": 20
      },
      {
        "name": "Les Boucles d'Auto-Critique",
        "time": "20-40 min",
        "duration": 20
      },
      {
        "name": "Human-in-the-Loop",
        "time": "40-60 min",
        "duration": 20
      },
      {
        "name": "Atelier Workflow",
        "time": "60-95 min",
        "duration": 35
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Décomposer une mission en étapes avec points de contrôle humain.",
      "talk": "Un workflow sans HITL est un workflow dangereux. Le point d'arrêt humain est obligatoire.",
      "transition": "Prochaine séance : créer votre Assistant personnalisé avec Agent.md."
    },
    "mission": "Schématiser 1 workflow métier complet avec ses Skills. Dépôt Classroom.",
    "workKit": "Volet 07 — Mon Workflow",
    "promptChips": [
      {
        "cat": "WORKFLOW",
        "title": "Template Workflow Multi-Étapes",
        "key": "workflowTemplate"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "07"
  },
  {
    "num": 8,
    "code": "08-construire-son-assistant",
    "title": "Construire son Assistant",
    "subtitle": "Agent.md, Rôle & Mémoire",
    "objective": "Créer son Assistant personnalisé avec fichier Agent.md. Rédiger son premier Agent opérationnel.",
    "week": 4,
    "seanceNum": 7,
    "seance": "Séance 07",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Pourquoi un Assistant ?",
        "time": "0-15 min",
        "duration": 15
      },
      {
        "name": "Le Fichier Agent.md",
        "time": "15-40 min",
        "duration": 25
      },
      {
        "name": "Démo Config",
        "time": "40-55 min",
        "duration": 15
      },
      {
        "name": "Atelier Agent.md",
        "time": "55-95 min",
        "duration": 40
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Créer son Assistant personnalisé avec fichier Agent.md. Rédiger son premier Agent opérationnel.",
      "talk": "L'Agent.md est la carte d'identité de votre assistant : rôle, ton, compétences, limites.",
      "transition": "Prochaine étape : connecter cet assistant à des outils externes via MCP."
    },
    "mission": "Fichier Agent.md configuré + tester l'Assistant. Dépôt Classroom.",
    "workKit": "Volet 08 — Mon Agent.md",
    "promptChips": [
      {
        "cat": "ASSISTANT",
        "title": "Template Agent.md",
        "key": "agentMdTemplate"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "08"
  },
  {
    "num": 9,
    "code": "09-connecteurs-outils-mcp",
    "title": "Connecteurs & MCP",
    "subtitle": "Outils, Permissions & Moindre Privilège",
    "objective": "Comprendre les Outils, Connecteurs et le standard MCP. Politique de permissions.",
    "week": 4,
    "seanceNum": 8,
    "seance": "Séance 08",
    "duration": 110,
    "slides": 5,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Les Outils d'un Agent",
        "time": "0-20 min",
        "duration": 20
      },
      {
        "name": "Le Standard MCP",
        "time": "20-45 min",
        "duration": 25
      },
      {
        "name": "Politique de Permissions",
        "time": "45-65 min",
        "duration": 20
      },
      {
        "name": "Atelier MCP",
        "time": "65-95 min",
        "duration": 30
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Comprendre les outils et connecteurs MCP. Moindre privilège = ne donner que le minimum nécessaire.",
      "talk": "Un agent avec toutes les permissions est un agent dangereux. Principe du moindre privilège.",
      "transition": "Semaine prochaine : assembler le tout pour construire votre premier Agent IA."
    },
    "mission": "Fiche de permissions d'outils définie. Dépôt Classroom.",
    "workKit": "Volet 09 — Mes Connecteurs MCP",
    "promptChips": [
      {
        "cat": "MCP",
        "title": "Audit de Connecteur MCP",
        "key": "mcpAuditPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "09"
  },
  {
    "num": 10,
    "code": "10-construire-son-agent",
    "title": "Construire son Agent IA",
    "subtitle": "Assemblage & Banc d'Essai 5 Tests",
    "objective": "Grand Atelier : bâtir son premier Agent IA et le passer au banc d'essai des 5 tests.",
    "week": 5,
    "seanceNum": 9,
    "seance": "Séance 09",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Assemblage de l'Agent",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Le Banc d'Essai des 5 Tests",
        "time": "25-50 min",
        "duration": 25
      },
      {
        "name": "Correction en Direct",
        "time": "50-75 min",
        "duration": 25
      },
      {
        "name": "Validation V1",
        "time": "75-100 min",
        "duration": 25
      },
      {
        "name": "Work Kit & Mission",
        "time": "100-110 min",
        "duration": 10
      }
    ],
    "notes": {
      "goal": "Grand Atelier d'assemblage : bâtir son Agent IA et le passer au banc d'essai des 5 tests.",
      "talk": "Les 5 tests : Pertinence, Ton, Limites, Sécurité, ROI. Chaque test doit être réussi.",
      "transition": "Prochain module : comparer les écosystèmes sans fanatisme."
    },
    "mission": "Livrer son Agent IA en Version 2 avec rapport de correction. Dépôt Classroom.",
    "workKit": "Volet 10 — Mon Agent IA V2",
    "promptChips": [
      {
        "cat": "AGENT",
        "title": "Banc d'Essai des 5 Tests",
        "key": "benchTestPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "10"
  },
  {
    "num": 11,
    "code": "11-ecosystemes-ia",
    "title": "Grands Écosystèmes IA",
    "subtitle": "OpenAI, Claude, Google & Anti-Hype",
    "objective": "Comparer les écosystèmes IA sans fanatisme. Résoudre les 5 arbitrages métiers.",
    "week": 5,
    "seanceNum": 10,
    "seance": "Séance 10",
    "duration": 110,
    "slides": 5,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Vue d'Ensemble du Marché",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Les 5 Arbitrages Métier",
        "time": "25-50 min",
        "duration": 25
      },
      {
        "name": "Démo Comparative",
        "time": "50-70 min",
        "duration": 20
      },
      {
        "name": "Règle Anti-Hype",
        "time": "70-95 min",
        "duration": 25
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Comparer les écosystèmes IA sans fanatisme ni marketing. Résoudre les 5 arbitrages métier.",
      "talk": "Aucun écosystème n'est universellement meilleur. Tout dépend du contexte métier.",
      "transition": "Prochaine séance : devenir rigoureux sur la recherche et la vérification des sources."
    },
    "mission": "Tester la même tâche sur 3 écosystèmes. Dépôt Classroom.",
    "workKit": "Volet 11 — Mes Écosystèmes",
    "promptChips": [
      {
        "cat": "ÉCOSYSTÈME",
        "title": "Grille de Décision",
        "key": "decisionGridPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "11"
  },
  {
    "num": 12,
    "code": "12-recherche-et-verification",
    "title": "Recherche & Vérification",
    "subtitle": "Source Checker & Pyramide de Fiabilité",
    "objective": "Rechercher avec l'IA, citer les sources et traquer les biais. Pyramide de fiabilité.",
    "week": 6,
    "seanceNum": 11,
    "seance": "Séance 11",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Les 5 Pièges d'une Réponse IA",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Pyramide de Fiabilité",
        "time": "25-45 min",
        "duration": 20
      },
      {
        "name": "Source Checker Live",
        "time": "45-65 min",
        "duration": 20
      },
      {
        "name": "Atelier Détection",
        "time": "65-95 min",
        "duration": 30
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Rechercher avec l'IA, citer les sources et traquer les biais. Pyramide de fiabilité.",
      "talk": "Une réponse sans source est une opinion. Le Source Checker est votre outil de confiance.",
      "transition": "Prochaine séance : protéger vos données et votre organisation."
    },
    "mission": "Recherche sourcée avec grille Source Checker. Dépôt Classroom.",
    "workKit": "Volet 12 — Ma Recherche Sourcée",
    "promptChips": [
      {
        "cat": "VÉRIFICATION",
        "title": "Prompt Fact-Checking",
        "key": "factCheckPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "12"
  },
  {
    "num": 13,
    "code": "13-securite-et-confidentialite",
    "title": "Sécurité & Confidentialité",
    "subtitle": "Anonymisation & AI Safety Card",
    "objective": "Protéger les données, anonymiser et parer le Prompt Injection. AI Safety Card.",
    "week": 6,
    "seanceNum": 12,
    "seance": "Séance 12",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Les 4 Niveaux de Données",
        "time": "0-20 min",
        "duration": 20
      },
      {
        "name": "Protocole d'Anonymisation",
        "time": "20-45 min",
        "duration": 25
      },
      {
        "name": "Prompt Injection",
        "time": "45-60 min",
        "duration": 15
      },
      {
        "name": "Jeu des 10 Cas",
        "time": "60-95 min",
        "duration": 35
      },
      {
        "name": "AI Safety Card & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Protéger les données. 4 niveaux : Public, Interne, Confidentiel, Strictement Interdit.",
      "talk": "Toute donnée de niveau 3+ doit être anonymisée AVANT envoi vers un LLM cloud.",
      "transition": "Prochaine séance : automatiser votre travail avec l'Automation Canvas."
    },
    "mission": "Rédiger et signer son AI Safety Card. Dépôt Classroom.",
    "workKit": "Volet 13 — AI Safety Card",
    "promptChips": [
      {
        "cat": "SÉCURITÉ",
        "title": "Anonymisation Automatisée",
        "key": "anonymizePrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "13"
  },
  {
    "num": 14,
    "code": "14-automatiser-son-travail",
    "title": "Automatiser son Travail",
    "subtitle": "Automation Canvas & ROI",
    "objective": "Automatiser son travail avec l'Automation Canvas. Décomposer en flux semi-automatisé.",
    "week": 7,
    "seanceNum": 13,
    "seance": "Séance 13",
    "duration": 110,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Quand Automatiser ?",
        "time": "0-20 min",
        "duration": 20
      },
      {
        "name": "L'Automation Canvas",
        "time": "20-45 min",
        "duration": 25
      },
      {
        "name": "Démo Flux Semi-Auto",
        "time": "45-65 min",
        "duration": 20
      },
      {
        "name": "Atelier Automatisation",
        "time": "65-95 min",
        "duration": 30
      },
      {
        "name": "Work Kit & Mission",
        "time": "95-110 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Automatiser les tâches répétitives. Automation Canvas : Déclencheur, Données, Étapes, Validation, ROI.",
      "talk": "N'automatisez que ce qui est vraiment répétitif et à faible risque. ROI minimum 3h/semaine.",
      "transition": "Prochaine séance : ancrer l'IA dans votre quotidien avec la routine des 15 minutes."
    },
    "mission": "Déployer son Automatisation V1 et calculer le ROI. Dépôt Classroom.",
    "workKit": "Volet 14 — Mon Automation Canvas",
    "promptChips": [
      {
        "cat": "AUTOMATISATION",
        "title": "Automation Canvas",
        "key": "automationCanvasPrompt"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "14"
  },
  {
    "num": 16,
    "code": "16-ia-au-quotidien",
    "title": "L'IA au Quotidien",
    "subtitle": "Routine 15 Min & AI Operating Plan",
    "objective": "Ancrer l'IA au quotidien. Routine des 15 minutes du matin et AI Operating Plan.",
    "week": 7,
    "seanceNum": 14,
    "seance": "Séance 14",
    "duration": 110,
    "slides": 6,
    "prompts": 2,
    "status": "ready",
    "phases": [
      {
        "name": "Pourquoi une Routine ?",
        "time": "0-15 min",
        "duration": 15
      },
      {
        "name": "La Routine des 15 Minutes",
        "time": "15-40 min",
        "duration": 25
      },
      {
        "name": "Démo Briefing Matinal",
        "time": "40-60 min",
        "duration": 20
      },
      {
        "name": "AI Operating Plan",
        "time": "60-85 min",
        "duration": 25
      },
      {
        "name": "Clôture & Work Kit",
        "time": "85-110 min",
        "duration": 25
      }
    ],
    "notes": {
      "goal": "Ancrer l'IA au quotidien. 21 jours pour créer une habitude.",
      "talk": "15 minutes chaque matin : tri, brouillons, validation. L'AI Operating Plan assure le suivi mensuel.",
      "transition": "Semaine prochaine : spécialisation métier et soutenances finales."
    },
    "mission": "Compléter son AI Operating Plan mensuel. Dépôt Classroom.",
    "workKit": "Volet 16 — AI Operating Plan",
    "promptChips": [
      {
        "cat": "ROUTINE",
        "title": "Briefing Matinal 15 Min",
        "key": "morningRoutinePrompt"
      },
      {
        "cat": "PLAN",
        "title": "AI Operating Plan",
        "key": "aopTemplate"
      }
    ],
    "durationLabel": "110 min",
    "numStr": "16"
  },
  {
    "num": 17,
    "code": "17-specialisation-professionnelle",
    "title": "Spécialisation Pro",
    "subtitle": "6 Parcours Sectoriels",
    "objective": "Atelier de spécialisation métier et coaching en direct sur un dossier réel.",
    "week": 8,
    "seanceNum": 15,
    "seance": "Séance 15",
    "duration": 150,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Cadrage par Secteur",
        "time": "0-25 min",
        "duration": 25
      },
      {
        "name": "Les 6 Parcours Métiers",
        "time": "25-50 min",
        "duration": 25
      },
      {
        "name": "Coaching en Direct",
        "time": "50-100 min",
        "duration": 50
      },
      {
        "name": "Adaptation Workflows",
        "time": "100-135 min",
        "duration": 35
      },
      {
        "name": "Work Kit & Mission",
        "time": "135-150 min",
        "duration": 15
      }
    ],
    "notes": {
      "goal": "Spécialisation approfondie par secteur. Adapter les Skills au vocabulaire et aux contraintes de chaque métier.",
      "talk": "6 filières : Admin, Finance, Santé, Commerce, ONG, Éducation. Chaque métier a ses contraintes.",
      "transition": "Dernière séance : soutenances finales et certification."
    },
    "mission": "Finaliser la fiche officielle de son Cas d'Usage Métier. Dépôt Classroom.",
    "workKit": "Volet 17 — Mon Cas d'Usage Sectoriel",
    "promptChips": [
      {
        "cat": "SECTEUR",
        "title": "Cadrage Métier Sur-Mesure",
        "key": "sectorSpecializationPrompt"
      }
    ],
    "durationLabel": "150 min",
    "numStr": "17"
  },
  {
    "num": 15,
    "code": "15-projet-final-systeme-ia",
    "title": "Projet Final & Soutenance",
    "subtitle": "Portfolio, Démo Live & Certification",
    "objective": "Soutenances finales (10 min/personne), démo live et remise des certifications.",
    "week": 8,
    "seanceNum": 16,
    "seance": "Séance 16 (+ M18)",
    "duration": 180,
    "slides": 4,
    "prompts": 1,
    "status": "ready",
    "phases": [
      {
        "name": "Rappel des Critères",
        "time": "0-15 min",
        "duration": 15
      },
      {
        "name": "Soutenances (10 min/personne)",
        "time": "15-135 min",
        "duration": 120
      },
      {
        "name": "AI Landscape 2026 (M18)",
        "time": "135-160 min",
        "duration": 25
      },
      {
        "name": "Remise des Certifications",
        "time": "160-175 min",
        "duration": 15
      },
      {
        "name": "Clôture & Alumni",
        "time": "175-180 min",
        "duration": 5
      }
    ],
    "notes": {
      "goal": "Soutenances finales. Chaque apprenant présente son système IA complet en 10 minutes avec démo live.",
      "talk": "Évaluation : Pertinence métier, Qualité technique, Démo fonctionnelle, ROI documenté.",
      "transition": "Bienvenue dans le réseau Alumni de l'Académie OPAYS !"
    },
    "mission": "Feuille de route à 30 jours. Intégration Alumni.",
    "workKit": "Volet 15 + 18 — Mon AI Work System Complet",
    "promptChips": [
      {
        "cat": "SOUTENANCE",
        "title": "Pitch de Présentation",
        "key": "pitchPrompt"
      }
    ],
    "durationLabel": "180 min",
    "numStr": "15"
  },
  {
    "num": 18,
    "code": "18-grands-ecosystemes-ia",
    "title": "AI Landscape 2026",
    "subtitle": "SLM, Veille & Feuille de Route",
    "objective": "Anticiper les ruptures. Small Language Models, veille stratégique et feuille de route 12 mois.",
    "week": 8,
    "seanceNum": 16,
    "seance": "Séance 16 (+ M15)",
    "duration": 95,
    "slides": 5,
    "prompts": 2,
    "status": "ready",
    "phases": [
      {
        "name": "La Bascule de Posture",
        "time": "0-15 min",
        "duration": 15
      },
      {
        "name": "Visite Guidée des 4 Géants",
        "time": "15-45 min",
        "duration": 30
      },
      {
        "name": "Open Source vs Propriétaire",
        "time": "45-65 min",
        "duration": 20
      },
      {
        "name": "Atelier d'Appariement",
        "time": "65-85 min",
        "duration": 20
      },
      {
        "name": "Fiche AI Landscape & Défi",
        "time": "85-95 min",
        "duration": 10
      }
    ],
    "notes": {
      "goal": "Se repérer parmi les 4 blocs majeurs (OpenAI, Anthropic, Google, Modèles chinois/open source) et développer une immunité anti-hype.",
      "talk": "« Quel est le meilleur modèle ? » n'a pas de sens professionnel : c'est l'outil le plus adapté à chaque tâche. Modèles ouverts = souveraineté des données.",
      "transition": "Félicitations : vous repartez avec votre système IA complet et votre feuille de route 12 mois."
    },
    "mission": "Compléter sa fiche AI Landscape et sa feuille de route 12 mois. Dépôt Classroom.",
    "workKit": "Volet 18 — Ma Veille & Feuille de Route",
    "promptChips": [
      {
        "cat": "VEILLE",
        "title": "Synthèse Veille Hebdo",
        "key": "watchRoutinePrompt"
      },
      {
        "cat": "ROADMAP",
        "title": "Feuille de Route 12 Mois",
        "key": "roadmapTemplate"
      }
    ],
    "durationLabel": "95 min",
    "numStr": "18"
  }
];
});
