# 👨‍🏫 Module 07 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Workflows & Loops : Faire Travailler l'IA en Plusieurs Étapes  
> **Niveau** : Débutant $\rightarrow$ Intermédiaire • **Durée totale** : 1h30 à 2h (Google Meet)  
> **Idée directrice** : *« Une tâche professionnelle complexe n'est jamais un prompt unique. C'est une succession d'étapes ordonnées et de boucles de contrôle. Passer de "Fais-moi X" à "Voici les étapes pour construire X". »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Décomposer une mission complexe en un **Workflow linéaire d'étapes claires**.
2. Comprendre comment enchaîner plusieurs **Skills** (*Skill A + Skill B + Skill C = Processus*).
3. Définir une **Loop** (boucle de révision) avec sa **condition d'arrêt** (*Arrêter quand...*).
4. Intégrer les points d'ancrage **Human-in-the-Loop** (où l'humain valide obligatoirement).
5. Distinguer clairement **Workflow (organisation du travail)** et **Automatisation (exécution automatique)**.
6. Avoir une vision claire de la mécanique d'un **Agent IA** (*Objectif $\rightarrow$ Plan $\rightarrow$ Skills $\rightarrow$ Action $\rightarrow$ Vérif*).

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de configuration technique d'outils d'automatisation (Make/Zapier prévus plus tard).
* ❌ Pas de programmation de boucles `while` ou de code Python.
* ❌ Pas de modélisation BPMN complexe : de simples diagrammes texte et flèches suffisent.

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 15m │ OUVERTURE : POURQUOI UN SEUL PROMPT ÉCHOUE SUR UN RAPPORT MENSUEL ?   │
│ 15 - 35m │ ANATOMIE D'UN WORKFLOW & LE CONCEPT DE LOOP (BOUCLE DE VÉRIFICATION)  │
│ 35 - 55m │ DÉMONSTRATION EN DIRECT : LA RÉPONSE OFFICIELLE EN 7 ÉTAPES           │
│ 55 - 80m │ ATELIER PRATIQUE : CRÉATION DE SON WORKFLOW & LE JEU DES LOOPS        │
│ 80 - 90m │ HUMAN-IN-THE-LOOP, TRANSITION VERS LES AGENTS & DEVOIR HEBDOMADAIRE   │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Pourquoi un seul prompt échoue ? (15 min)

1. **La mise en situation** :
   * Prendre l'exemple classique : *« Prépare mon rapport mensuel d'activité. »*
   * Demander : *« Pourquoi l'IA échoue ou produit du vent si on lui demande tout d'un coup ? »*
2. **Décomposer ensemble les vraies étapes d'un professionnel** :
   * 1. Collecter les données $\rightarrow$ 2. Extraire les faits clés $\rightarrow$ 3. Analyser les écarts $\rightarrow$ 4. Rédiger le projet de rapport $\rightarrow$ 5. Vérifier les chiffres $\rightarrow$ 6. Valider et signer.
3. **Le principe fondateur du module** :
   > *« Ne demandez plus un résultat fini en un bloc. Pilotez une chaîne d'étapes : chaque étape produit une matière première solide pour la suivante. »*

---

### 🕒 Phase 2 : Workflow, Loop & Human-in-the-Loop (20 min)

#### 1. Qu'est-ce qu'un Workflow ?
Une suite logique d'actions organisées pour transformer une entrée brute en livrable final :  
**Document $\rightarrow$ Extraire $\rightarrow$ Analyser $\rightarrow$ Rédiger $\rightarrow$ Vérifier $\rightarrow$ Livrable**

#### 2. Qu'est-ce qu'une Loop (Boucle) ?
* Une répétition d'une étape jusqu'à ce qu'une **condition d'arrêt** soit remplie.
* **La boucle reine** : `Produire ➔ Vérifier ➔ Erreur détectée ? (Oui ➔ Corriger ➔ Re-vérifier / Non ➔ Terminer)`.
* **Les conditions d'arrêt indispensables** :
  * *« Arrête quand toutes les informations obligatoires sont complètes. »*
  * *« Arrête après 3 itérations maximum pour ne pas tourner en rond. »*

#### 3. Human-in-the-Loop (La Validation Humaine)
* Montrer que l'IA ne décide pas seule :
  * *IA Analyse $\rightarrow$ IA Propose $\rightarrow$ **VALIDATION HUMAINE** $\rightarrow$ IA Rédige $\rightarrow$ **CONTRÔLE FINAL HUMAIN** $\rightarrow$ Envoi*.

#### 4. Workflow $\neq$ Automatisation
* **Workflow** = La structure et la méthode de travail (peut être 100% manuelle).
* **Automatisation** = L'outil logiciel qui exécute automatiquement les étapes.

---

### 🕒 Phase 3 : Démonstration Live en 7 Étapes (20 min)
> **Scénario Formateur** : *« Traitement d'un dossier de réclamation complexe d'un usager/partenaire pour produire la réponse officielle de l'institution. »*

*Exécuter le workflow sous les yeux des apprenants dans une seule conversation ordonnée :*

* **Étape 1 (Skill Extraction)** : *« Lis ce dossier et dresse la chronologie exacte des faits et griefs. »*
* **Étape 2 (Skill Analyse)** : *« Analyse la conformité de ces griefs par rapport à notre règlement interne joint. »*
* **Étape 3 (Loop 1 : Proposition)** : *« Propose 2 options de réponse : 1. Rejet motivé, 2. Règlement à l'amiable avec conditions. »*
* **Étape 4 (Human Decision)** : Le formateur choisit l'Option 2 en direct.
* **Étape 5 (Skill Rédaction)** : *« Rédige la lettre officielle formelle selon l'Option 2. »*
* **Étape 6 (Loop 2 : Auto-Vérification)** : *« Relis la lettre : identifie tout engagement juridique risqué ou terme ambigu. »*
* **Étape 7 (Validation finale)** : Ajustement des derniers mots et validation humaine.

---

### 🕒 Phase 4 : Atelier Pratique Apprenants (25 min)

#### Exercice 1 : Concevoir son Workflow Personnel (15 min)
*Chaque participant prend sa Tâche Prioritaire N°1 (du Module 4) et la découpe selon le gabarit :*
* Entrée de départ $\rightarrow$ Étape IA 1 $\rightarrow$ Étape IA 2 $\rightarrow$ Validation Humaine $\rightarrow$ Étape IA 3 $\rightarrow$ Livrable Final.

#### Exercice 2 : Le Jeu « Détecter les Loops » (10 min)
*Projeter 3 processus et demander : Y a-t-il une loop ? Quelle est la condition d'arrêt ?*
1. *Processus A* : Relecture d'un contrat jusqu'à ce qu'il n'y ait plus aucune clause ambiguë $\rightarrow$ **Loop avec arrêt sur zéro ambiguïté**.
2. *Processus B* : Traduire un email du français vers l'anglais et l'envoyer $\rightarrow$ **Workflow linéaire sans loop**.
3. *Processus C* : Évaluer 30 devis reçus un par un selon une grille de conformité $\rightarrow$ **Loop de traitement séquentiel**.

---

### 🕒 Phase 5 : Vers les Agents IA & Devoir Hebdomadaire (10 min)

1. **La Passerelle vers les Agents (Module 8)** :
   * Expliquer : *« Un agent IA n'est rien d'autre qu'un système qui sait exécuter un workflow et des loops de façon autonome sous votre supervision. »*
2. **Lancement du Devoir Hebdomadaire** :
   * Formaliser **1 Workflow métier complet** et **1 Loop avec condition d'arrêt explicite** sur la fiche de devoir.
