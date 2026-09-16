# 👨‍🏫 Module 10 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Construire son Premier Agent IA (Le Grand Atelier d'Assemblage & de Synthèse)  
> **Niveau** : Intermédiaire pratique • **Durée totale** : 2h à 2h30 (Google Meet)  
> **Idée directrice** : *« On ne construit pas un agent pour faire une démonstration technique. On construit un agent parce qu'il résout un vrai problème professionnel en assemblant : Mission, Agent.md, Skills, Mémoire, Outils, Connecteurs, Workflow et Contrôle Humain. »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Expliquer la différence nette entre un **Prompt**, un **Skill**, un **Workflow**, un **Assistant** et un **Agent IA**.
2. Savoir décider quand un problème nécessite un agent et quand un simple prompt suffit.
3. Suivre la méthode de conception en **12 étapes ordonnées** (*Objectif $\rightarrow$ Entrée/Sortie $\rightarrow$ Agent.md $\rightarrow$ Skills $\rightarrow$ Workflow $\rightarrow$ Loop $\rightarrow$ Outils $\rightarrow$ Permissions $\rightarrow$ Mémoire $\rightarrow$ MCP $\rightarrow$ Assemblage $\rightarrow$ Tests*).
4. Soumettre son agent au **Banc d'Essai des 5 Tests Obligatoires** (*Cas normal, Données manquantes, Contradiction, Hors périmètre, Action sensible*).
5. Réaliser une démonstration en direct de 5 minutes de son agent en action sur son vrai dossier.

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de systèmes multi-agents complexes en réseau.
* ❌ Pas de développement de code d'orchestration distribuée.
* ❌ Pas d'abandon du contrôle humain : l'agent doit rester sous supervision explicite.

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 15m │ OUVERTURE : « AI-JE VRAIMENT BESOIN D'UN AGENT ? » (PROMPT VS AGENT)   │
│ 15 - 35m │ L'ARCHITECTURE COMPLÈTE EN 12 ÉTAPES & LA CARTE MENTALE DE L'AGENT     │
│ 35 - 60m │ DÉMONSTRATION EN DIRECT : L'AGENT « GESTIONNAIRE DE DOSSIERS »         │
│ 60 - 105m│ GRAND ATELIER PRATIQUE : ASSEMBLAGE DE SON AGENT & RÉDACTION AGENT.MD  │
│ 105 - 135│ LE BANC D'ESSAI DES 5 TESTS, RESTITUTIONS DE 5 MIN & DEVOIR HEBDO     │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Ai-je Vraiment Besoin d'un Agent ? (15 min)

1. **La question de tri** :
   * Si vous voulez résumer un texte de temps en temps $\rightarrow$ Un simple **Prompt** suffit.
   * Si vous voulez appliquer une méthode récurrente $\rightarrow$ Un **Skill** suffit.
   * Si vous voulez traiter un dossier de bout en bout chaque semaine avec accès à vos documents, contrôle des étapes et production de plusieurs livrables $\rightarrow$ **Vous avez besoin d'un Agent IA**.
2. **L'échelle d'évolution** :
   > **Prompt** *(Action ponctuelle)* $\rightarrow$ **Skill** *(Capacité réutilisable)* $\rightarrow$ **Workflow** *(Suite d'étapes)* $\rightarrow$ **Assistant** *(Spécialiste de contexte)* $\rightarrow$ **Agent IA** *(Système autonome orienté objectif avec outils)*.

---

### 🕒 Phase 2 : L'Architecture Maîtresse en 12 Étapes (20 min)

Présenter le schéma global :
```
                    OBJECTIF
                       ↓
                  ┌─────────┐
                  │  AGENT  │
                  └─────────┘
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Instructions      Skills        Mémoire
   (Agent.md)                      Contexte
        ↓              ↓              ↓
        └──────────────┼──────────────┘
                       ↓
              Outils / Connecteurs / MCP
                       ↓
                    ACTIONS
                       ↓
                  VÉRIFICATION
                       ↓
             Objectif atteint ?
               ↓              ↓
            NON (Loop)     OUI (Validation humaine ➔ FIN)
```

Passer en revue les 12 étapes méthodologiques (de la définition du problème à l'assemblage final).

---

### 🕒 Phase 3 : Démonstration Live du Formateur (25 min)
> **Scénario Formateur** : *« L'Agent de Traitement des Appels d'Offres & Marchés Publics. »*

*Le formateur fait fonctionner l'agent sous les yeux des apprenants :*
1. **Lancement** : L'agent reçoit 2 dossiers de soumissionnaires.
2. **Exécution autonome du workflow** :
   * Extrait les pièces administratives obligatoires (Skill Extraction).
   * Vérifie la conformité légale (Skill Analyse).
   * Identifie une contradiction dans les dates de validité de l'offre (Skill Détection de risques).
   * Rédige le procès-verbal de dépouillement préliminaire (Skill Rédaction).
3. **Point d'arrêt Human-in-the-Loop** : L'agent s'arrête et demande : *« Une anomalie majeure a été détectée sur l'Offre B. Validez-vous son rejet avant que je ne finalise le PV officiel ? »*
4. **Conclusion** : L'agent ne s'est pas contenté de répondre ; il a mené une enquête documentaire complète et s'est arrêté au bon moment.

---

### 🕒 Phase 4 : Grand Atelier d'Assemblage (45 min)

*Tous les participants assemblent leur agent (dans leur Custom GPT, Gem, Claude Project ou espace projet) :*
* **1. Objectif (1 phrase)** : *« Mon agent doit... »*
* **2. Rédiger le fichier `Agent.md`** : Mission, Règles permanentes, Processus, Skills associés, Limites.
* **3. Cadrer les Outils & Permissions** : Quels accès nécessaires ? (Drive, fichiers, web).
* **4. Fixer la Mémoire** : Ce qu'il retient sur les préférences du service.

---

### 🕒 Phase 5 : Le Banc d'Essai des 5 Tests & Démonstrations (30 min)

1. **L'épreuve des 5 tests obligatoires** :
   * *Test 1 : Cas Normal* $\rightarrow$ L'agent accomplit la tâche nominale.
   * *Test 2 : Données Manquantes* $\rightarrow$ L'agent demande les pièces au lieu d'inventer.
   * *Test 3 : Information Contradictoire* $\rightarrow$ L'agent signale le conflit sans trancher seul.
   * *Test 4 : Demande Hors Périmètre* $\rightarrow$ L'agent rappelle poliment sa mission.
   * *Test 5 : Action Sensible* $\rightarrow$ L'agent bloque l'envoi et exige une signature humaine.
2. **Mini-restitutions (5 min par volontaire)** : Partage d'écran et démo du fonctionnement.
3. **Lancement du Devoir Hebdomadaire** : Corriger les faiblesses révélées par les tests et produire la **Version 2 (V2)** de son agent.
