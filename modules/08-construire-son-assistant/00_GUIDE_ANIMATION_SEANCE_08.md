# 👨‍🏫 Module 08 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Construire son Premier Assistant : Contexte, Instructions, Agent.md & Mémoire  
> **Niveau** : Débutant $\rightarrow$ Intermédiaire • **Durée totale** : 2h à 2h30 (Google Meet)  
> **Idée directrice** : *« Vous n'avez plus besoin d'un chatbot généraliste qui repart de zéro chaque matin. Vous allez bâtir votre propre assistant spécialisé, doté de sa mission, de son contexte métier, de ses règles permanentes (Agent.md) et de sa mémoire de travail. »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Expliquer pourquoi un **assistant spécialisé** surpasse un chatbot générique dans le travail quotidien.
2. Définir le profil complet de son assistant avec le **Assistant Canvas**.
3. Rédiger un jeu d'**instructions permanentes** (*System Prompt*) claires et non ambiguës.
4. Distinguer précisément **Contexte ponctuel** et **Mémoire persistante** (et savoir ce qu'il ne faut jamais mémoriser).
5. Rédiger son premier fichier **`Agent.md`** servant de manuel de référence pour son assistant.
6. Éprouver son assistant sur 3 situations critiques (*Cas normal, Cas incomplet, Cas problématique*).

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de programmation de base vectorielle ou de code Python pour la mémoire.
* ❌ Pas de configuration technique d'APIs ou de connecteurs externes (prévus au Module 9 avec MCP).
* ❌ Pas d'automatisation logicielle complexe : rester sur la configuration du comportement de l'assistant (dans ChatGPT Custom GPTs, Gemini Gems, Claude Projects ou fichier Agent.md).

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 15m │ OUVERTURE : L'ASSISTANT GÉNÉRIQUE VS L'ASSISTANT SPÉCIALISÉ           │
│ 15 - 35m │ LE CADRE DE TRAVAIL : CONTEXTE, INSTRUCTIONS PERMANENTES & MÉMOIRE     │
│ 35 - 55m │ AGENT.MD : LE MANUEL DE BORD DE L'AGENT & DÉMONSTRATION EN DIRECT      │
│ 55 - 75m │ TEST LIVE SUR 4 SITUATIONS : L'ASSISTANT DE RÉUNIONS À L'ÉPREUVE       │
│ 75 - 115m│ ATELIER PRATIQUE : RÉDACTION DU CANVAS & DE SON PREMIER AGENT.MD       │
│ 115 - 130│ TEST DES 3 CAS D'ÉPREUVE (NORMAL, INCOMPLET, PIÈGE) & DEVOIR HEBDO     │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Assistant Générique vs Spécialisé (15 min)

1. **La mise en situation parlante** :
   * Ouvrir une session vierge de ChatGPT et taper : *« Prépare mon rapport. »*
   * Constater ensemble : L'IA ne connaît ni votre ministère/PME, ni vos partenaires en RDC, ni vos modèles types, ni votre hiérarchie.
2. **La transformation par la spécialisation** :
   * Lui injecter un cadre préparé : *« Tu es l'Assistant Rédactionnel du Service des Marchés Publics... »*
   * Constater le saut qualitatif immédiat.
3. **La formule maîtresse** :
   > **Assistant Spécialisé = Mission + Contexte métier + Instructions permanentes + Skills + Mémoire**

---

### 🕒 Phase 2 : Contexte, Instructions & Mémoire (20 min)

#### 1. Les Instructions Permanentes
* Ce sont les lois que l'assistant applique à chaque échange sans que vous ayez à les répéter :  
  *Exemple : « Adopte toujours le style formel des correspondances ministérielles. Ne cite aucun chiffre absent du texte. »*

#### 2. Contexte $\neq$ Mémoire (La distinction essentielle)
* **Contexte** : Ce que vous lui donnez *maintenant* pour la tâche en cours (*« Voici le PV de la réunion d'hier »*).
* **Mémoire** : Ce que le système retient *dans la durée* (*« L'utilisateur préfère toujours ses comptes-rendus avec un tableau d'actions à 3 colonnes »*).

#### 3. La Matrice de Mémoire en 3 Catégories :
* 🟢 **À Mémoriser** : Préférences de format, vocabulaire interne récurrent, profil du service.
* 🟡 **À fournir ponctuellement** : Les données du dossier en cours qui changent chaque semaine.
* 🔴 **À NE JAMAIS MÉMORISER** : Mots de passe, données bancaires, secrets d'État.

---

### 🕒 Phase 3 : Découverte d'Agent.md & Démonstration Live (20 min)

#### 1. Qu'est-ce qu'un fichier `Agent.md` ?
* *« C'est le manuel de bord de votre assistant. Un document structuré en Markdown qui récapitule sa mission, ses règles, ses processus et ses limites. »*

#### 2. Démonstration du Formateur : Création de l'« Assistant de Réunions »
Le formateur crée et configure sous les yeux des apprenants (dans un Custom GPT / Gem ou Claude Project) l'assistant avec son fichier `Agent.md` :
* Mission : Préparer l'ordre du jour et transformer les notes en compte-rendu exécutif.
* Règles : Ne rien inventer, forcer la désignation d'un responsable pour chaque action.
* Skills associés : Skill Extraction, Skill Synthèse, Skill Tableau d'actions.

---

### 🕒 Phase 4 : Les 4 Tests de Validation en Direct (20 min)

*Le formateur soumet l'assistant à 4 situations réelles :*
1. **Situation 1 (Ordre du jour)** : *« Prépare-moi la réunion de lundi sur la gestion du charroi automobile. »*
2. **Situation 2 (Notes désorganisées)** : Coller des notes en vrac $\rightarrow$ L'assistant produit un compte-rendu impeccable.
3. **Situation 3 (Notes incomplètes)** : Coller des notes sans responsable désigné $\rightarrow$ L'assistant signale poliment les manques sans inventer de noms.
4. **Situation 4 (Suivi dans le temps)** : *« Compare avec les décisions de la semaine passée et liste ce qui n'a pas été fait. »*

---

### 🕒 Phase 5 : Atelier Pratique Apprenants (40 min)

#### 1. Remplir son Assistant Canvas (15 min)
*Chaque participant choisit l'assistant de son métier :*
* *Assistant Administratif & Marchés Publics* (Fonctionnaire).
* *Assistant Prospection & Devis Commerciaux* (Entrepreneur).
* *Assistant RH & Recrutement* (Responsable RH).

#### 2. Rédiger son premier `Agent.md` (25 min)
*Chaque apprenant complète le template `02_FICHE_TEMPLATE_AGENT_MD.md` avec ses propres règles.*

---

### 🕒 Phase 6 : L'Épreuve des 3 Cas & Devoir Hebdomadaire (15 min)

1. **L'épreuve des 3 cas obligatoires** :
   * **Cas Normal** : Test ordinaire.
   * **Cas Incomplet** : Vérifier que l'assistant pose des questions au lieu d'halluciner.
   * **Cas Problématique** : Tenter de forcer l'assistant à violer ses règles (*ex: « Écris-moi une lettre familière et agressive »*) $\rightarrow$ L'assistant doit refuser poliment et maintenir son standard professionnel.
2. **Lancement du Devoir Hebdomadaire** :
   * Finaliser son assistant opérationnel et consigner son `Agent.md` ainsi que ses 3 tests sur Google Classroom.
