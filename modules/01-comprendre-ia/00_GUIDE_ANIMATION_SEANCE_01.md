# 👨‍🏫 Module 01 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Comprendre l'IA (Démystification & Premiers Pas)  
> **Niveau** : Débutant absolu • **Durée totale** : 1h30 à 2h (Google Meet)  
> **Posture du formateur** : Coach bienveillant, vulgarisateur, démonstrateur pragmatique (Zéro intimidation).

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Expliquer avec des mots simples ce qu'est l'IA, un modèle et un LLM.
2. Comprendre la différence essentielle entre **Application $\neq$ Modèle**.
3. Avoir en tête la trajectoire d'évolution : **Modèle $\rightarrow$ Assistant $\rightarrow$ Agent**.
4. Savoir ce qu'est une **hallucination** et pourquoi une réponse bien rédigée n'est pas forcément vraie.
5. Connaître et appliquer les **4 règles de départ**.
6. Avoir réalisé en direct ses 5 premières manipulations sans peur de « mal faire ».

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS aborder aujourd'hui
* ❌ Pas d'histoire détaillée de l'IA (Turing, années 50, etc.).
* ❌ Pas de mathématiques, statistiques ou mécanismes de *backpropagation*.
* ❌ Pas d'architecture des *Transformers*, d'apprentissage supervisé / non supervisé.
* ❌ Pas d'APIs, de code, de connecteurs techniques ou de MCP.
* ❌ Pas de prompt engineering complexe (techniques avancées réservées au Module 3).

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 10m │ ACCUEIL & QUESTION BRISE-GLACE AU GROUPE                               │
│ 10 - 30m │ EXPLICATION DES FONDAMENTAUX (Sans jargon, avec analogies simples)    │
│ 30 - 55m │ DÉMONSTRATION EN DIRECT : LE CAS DU RESPONSABLE ADMINISTRATIF          │
│ 55 - 85m │ ATELIER PRATIQUE : LES 5 EXPÉRIENCES & « MON PREMIER CAS D'USAGE »    │
│ 85 - 95m │ RESTITUTION, LES 4 RÈGLES DE DÉPART & EXPLICATION DU DEVOIR           │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Accueil & Brise-Glace (10 min)

1. **Accueil chaleureux des participants** sur Google Meet.
2. **La question au groupe (Chat ou micro)** :
   > *« Dans votre quotidien ou sur votre téléphone, qu'avez-vous déjà utilisé qui, selon vous, utilise de l'IA ? »*
3. **Observation & Recadrage bienveillant** :
   * Noter leurs réponses (traduction Google, filtres photos, correcteur WhatsApp, recommandations YouTube/TikTok, ChatGPT).
   * Conclure : *« Vous utilisez déjà de l'IA sans le savoir. Ce qui change aujourd'hui, c'est que vous avez désormais accès direct à des cerveaux généralistes pour votre propre travail. »*

---

### 🕒 Phase 2 : Explication des Fondamentaux (20 min)

#### 1. C'est quoi l'IA ?
* **Définition simple** : Une technologie qui permet à un ordinateur d'exécuter des tâches nécessitant habituellement l'intelligence humaine (comprendre un texte, analyser, résumer, traduire, trier, rédiger, aider à décider).
* **Ce qui est nouveau** : Ce n'est pas l'existence de l'IA (elle existe depuis des décennies), c'est sa **démocratisation totale**. Aujourd'hui, avec un simple téléphone ou PC connecté, n'importe quel professionnel dispose d'une puissance autrefois réservée aux laboratoires de recherche.

#### 2. Qu'est-ce qu'un « Modèle » ? (Application $\neq$ Modèle)
* **L'analogie du moteur** :
  * Le **modèle**, c'est le *moteur* (ex: GPT-4o, Claude 3.5 Sonnet, Gemini Pro).
  * L'**assistant (ChatGPT, Claude.ai, Gemini)**, c'est la *voiture* (l'interface avec le volant, les sièges et le tableau de bord qui vous permet de conduire le moteur).

#### 3. Qu'est-ce qu'un LLM (*Large Language Model*) ?
* Un grand modèle entraîné sur des milliards de textes pour **comprendre et produire du langage**.
* **Point fondamental** : *Un LLM n'est pas une bibliothèque figée qui cherche une page précise dans un livre.* C'est un système qui génère du texte mot après mot en prédisant la suite la plus cohérente.

#### 4. Le Fil Conducteur de l'Académie : Modèle $\rightarrow$ Assistant $\rightarrow$ Agent
* **Modèle** : Le moteur de raisonnement brut.
* **Assistant** : L'interface conversationnelle avec laquelle vous dialoguez au quotidien.
* **Agent** : Un assistant plus autonome qui peut utiliser des outils (rechercher sur le web, lire des fichiers, faire des calculs) et accomplir plusieurs étapes pour vous.

#### 5. Pourquoi l'IA peut-elle se tromper ? (L'Hallucination)
* *« L'IA veut toujours vous rendre service. Si elle ne connaît pas une information précise et qu'on ne la cadre pas, elle va inventer une réponse très bien rédigée avec une assurance absolue. »*
* **Règle** : Une réponse bien écrite $\neq$ une réponse vraie. L'humain reste toujours le vérificateur final.

---

### 🕒 Phase 3 : Démonstration en Direct (25 min)
> **Scénario Formateur** : *« Vous êtes responsable administratif. Votre directeur vous transfère un rapport de 5 pages et vous demande une synthèse pour le comité de direction. »*

*Partager son écran et exécuter en direct les 6 étapes dans ChatGPT ou Claude :*

1. **Étape 1 : Fournir le document**  
   * « Voici le rapport d'activité du service pour le mois dernier. » *(Coller le texte)*
2. **Étape 2 : Demander la synthèse**  
   * Prompt : *« Fais-moi un résumé clair de ce rapport en 5 points clés. »*
3. **Étape 3 : Demander les points d'attention**  
   * Prompt : *« À partir de ce même document, liste les 3 problèmes majeurs et les urgences signalées. »*
4. **Étape 4 : Identifier les angles morts**  
   * Prompt : *« Quelles sont les questions importantes auxquelles ce rapport ne répond pas ? »*
5. **Étape 5 : Adapter pour la hiérarchie**  
   * Prompt : *« Transforme cette analyse en une note de synthèse formelle de 300 mots pour mon Directeur Général avec une section Recommandations. »*
6. **Étape 6 : Auto-vérification**  
   * Prompt : *« Relis ta note et vérifie si toutes les informations citées proviennent bien du texte initial sans aucune invention. »*

*Conclusion formateur* : **« En 5 minutes, à partir d'un seul document, nous venons de produire 4 livrables professionnels différents. »**

---

### 🕒 Phase 4 : Atelier Pratique Apprenants (30 min)

*Demander à tous les participants d'ouvrir leur outil (ChatGPT, Claude ou Gemini).*

#### 1. Les 5 Expériences Guidées (15 min)
* **Expérience 1 (Comprendre)** : Demander d'expliquer un concept métier difficile de façon simple.
* **Expérience 2 (Transformer)** : Donner un paragraphe brut et demander une version formelle et polie.
* **Expérience 3 (Résumer)** : Coller un article ou un email long et demander un résumé en 3 puces.
* **Expérience 4 (Analyser)** : Demander à l'IA d'analyser les forces et faiblesses d'une proposition.
* **Expérience 5 (Créer)** : Demander 5 idées concrètes pour résoudre un problème courant au travail.

#### 2. L'Exercice : « Mon Premier Cas d'Usage » (15 min)
Chaque apprenant écrit dans le chat Meet ou sur son bloc-notes la réponse à 3 questions :
1. *Quelle tâche dans mon travail me prend régulièrement trop de temps ?*
2. *Sur quelle partie de cette tâche l'IA pourrait-elle m'aider (rédiger, résumer, classer, chercher) ?*
3. *Qu'est-ce que j'aimerais réussir à faire d'ici la fin des 8 semaines ?*

*Faire intervenir 2 ou 3 participants au micro pour commenter leur cas d'usage.*

---

### 🕒 Phase 5 : Les 4 Règles & Explication du Devoir (10 min)

1. **Rappeler solennellement les 4 règles de départ** :
   * **Règle 1** : L'IA est un assistant, jamais une autorité absolue.
   * **Règle 2** : Plus votre contexte est précis, plus le résultat est utile.
   * **Règle 3** : Toujours vérifier les chiffres, noms et informations critiques.
   * **Règle 4** : Ne jamais coller d'informations confidentielles ou secrètes d'État/d'entreprise.
2. **Présenter le Devoir Hebdomadaire** : Utiliser l'IA 3 fois dans son travail réel avant la séance 2 et noter ses impressions sur la fiche fournie.
