# 👨‍🏫 Module 02 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Découvrir l'Écosystème de l'IA (Comprendre les Familles & Savoir Choisir)  
> **Niveau** : Débutant • **Durée totale** : 1h30 à 2h (Google Meet)  
> **Idée directrice** : *« Je n'ai pas besoin de connaître toutes les IA. Je dois savoir reconnaître les principales familles, comprendre leurs différences et savoir laquelle regarder selon mon besoin. »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Citer les grands acteurs et écosystèmes mondiaux (OpenAI, Anthropic, Google, acteurs chinois, open source).
2. Distinguer les **5 grandes familles d'outils IA** (Assistants, Recherche, Création, Code, Automatisation/Agents).
3. Comprendre pourquoi deux modèles différents produisent des réponses différentes sur une même consigne.
4. Savoir qu'il n'existe pas de « meilleur modèle absolu », mais un modèle adapté à chaque besoin.
5. Appliquer la **Règle des 5 Questions** pour évaluer n'importe quel nouvel outil sans panique.

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de benchmarks techniques de scores mathématiques (MMLU, HumanEval, etc.).
* ❌ Pas d'installation de modèles en local ni de lignes de commande (Ollama, Hugging Face en pratique).
* ❌ Pas de code d'API, de tarification par jetons (*token pricing*) complexe.
* ❌ Pas de débat idéologique ou géopolitique stérile : rester concentré sur l'usage professionnel.

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 10m │ ACCUEIL & LA QUESTION DU FLUX : « POURQUOI AUTANT D'IA ? »             │
│ 10 - 30m │ PANORAMA SIMPLE : LES 5 FAMILLES & LES GRANDS ÉCOSYSTÈMES              │
│ 30 - 50m │ DÉMONSTRATION COMPARATIVE LIVE (MÊME CONSIGNE SUR 3 MODÈLES)           │
│ 50 - 80m │ ATELIER PRATIQUE : COMPARER & RÉSOUDRE 5 SITUATIONS MÉTIERS            │
│ 80 - 90m │ LA RÈGLE DES 5 QUESTIONS, DÉCODER LES ANNONCES & DEVOIR                │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Accueil & La Question du Flux (10 min)

1. **Question au groupe dans le chat Meet** :
   > *« Quand vous ouvrez LinkedIn, Twitter ou les actus, combien de nouveaux noms d'outils IA voyez-vous passer chaque semaine ? Avez-vous l'impression d'être dépassé ? »*
2. **Afficher à l'écran un nuage de noms** :
   *ChatGPT, Claude, Gemini, Grok, DeepSeek, Qwen, Kimi, Mistral, Perplexity, Gamma, Cursor...*
3. **Le soulagement pédagogique** :
   > *« Devez-vous tous les apprendre ? Absolument PAS. 90 % de ces outils utilisent les mêmes moteurs sous le capot. Aujourd'hui, nous allons vous donner la carte pour ne plus jamais être perdu. »*

---

### 🕒 Phase 2 : Panorama Simple (20 min)

#### 1. La Structure de l'Écosystème
Rappeler l'enchaînement :
**Entreprise $\rightarrow$ Modèle (Moteur) $\rightarrow$ Application (Interface) $\rightarrow$ Outils $\rightarrow$ Agents**

#### 2. Les 5 Grandes Familles d'Outils IA
1. **Assistants Généralistes** (*ChatGPT, Claude, Gemini, Grok*) : Dialoguer, rédiger, résumer, analyser des fichiers.
2. **Recherche Augmentée** (*Perplexity, Copilot*) : **Search $\rightarrow$ Sources $\rightarrow$ Synthèse**. Différent d'un modèle qui ne répond qu'avec sa mémoire interne.
3. **Création & Multimodal** (*Midjourney, Gamma, Suno, Runway*) : Images, présentations, voix, vidéo. *L'IA ne se limite pas au texte*.
4. **Coding & Développement** (*Cursor, GitHub Copilot, Claude Code*) : Des outils capables de lire et modifier du code sur un projet entier.
5. **Automatisation & Agents** (*Make, Zapier, Agents autonomes*) : Chaînes d'actions (*Email $\rightarrow$ Analyse $\rightarrow$ Enregistrement $\rightarrow$ Réponse*).

#### 3. Les Grands Écosystèmes Mondiaux
* **OpenAI** : Le pionnier grand public (ChatGPT, GPT-4o, génération d'images, outils intégrés).
* **Anthropic** : Le spécialiste de la nuance rédactionnelle, du raisonnement et du code (Claude 3.5 Sonnet).
* **Google** : La force de frappe connectée à votre quotidien (Gemini, Google Workspace, Drive, Docs, YouTube).
* **Écosystème Chinois** (*DeepSeek, Qwen, Kimi, GLM*) : Des modèles extrêmement performants, accessibles et souvent très économiques.
* **Open Source & Modèles Locaux** (*Mistral, Llama, Ollama*) : Des modèles que l'on peut faire tourner sur ses propres serveurs pour une confidentialité absolue.

---

### 🕒 Phase 3 : Démonstration Comparative Live (20 min)

*Partager son écran avec 3 fenêtres ouvertes côte à côte : ChatGPT, Claude et Gemini.*

* **L'Expérience** : Coller exactement le même texte brut (ex: extrait d'une note administrative ou commerciale) et le même prompt :
  > *« À partir de ce texte, rédige une synthèse professionnelle de 150 mots destinée à un Directeur Général avec 3 recommandations d'action. »*
* **Observer ensemble les différences** :
  * Lequel a le style le plus naturel et élégant ? (Souvent Claude).
  * Lequel est le plus synthétique et direct ? (Souvent ChatGPT).
  * Lequel propose des points de liaison ou des intégrations ? (Souvent Gemini).
* **Conclusion du formateur** :
  > *« Vous voyez ? Aucun n'est "nul", aucun n'est "parfait". Ils ont des personnalités et des points forts différents. C'est pourquoi tester vaut toujours mieux que croire les classements en ligne. »*

---

### 🕒 Phase 4 : Atelier Pratique Apprenants (30 min)

#### Exercice 1 : Le Test Comparatif (15 min)
* Chaque apprenant ouvre au moins **deux outils différents** (ex: ChatGPT et Claude, ou ChatGPT et Gemini).
* Il leur soumet une même tâche de son travail (ex: rédiger une invitation officielle ou analyser un problème).
* Il note les différences de style et choisit son favori pour cette tâche précise.

#### Exercice 2 : Le Jeu des Situations Métiers (15 min)
*Projeter 5 situations et demander aux apprenants d'indiquer la famille d'outils adaptée :*
1. *Situation A* : « Je dois analyser un rapport PDF de 120 pages sans qu'aucune information ne soit inventée. » $\rightarrow$ **Assistant avec grand contexte (Claude / NotebookLM)**.
2. *Situation B* : « Je veux trouver les chiffres officiels de l'inflation en RDC publiés hier. » $\rightarrow$ **Recherche augmentée (Perplexity / Gemini avec Google Search)**.
3. *Situation C* : « Je dois transformer une note de 2 pages en une présentation de 8 slides pour demain matin. » $\rightarrow$ **Création / Présentations (Gamma App)**.
4. *Situation D* : « Je veux que chaque email contenant le mot "Facture" soit classé dans un dossier Drive. » $\rightarrow$ **Automatisation**.
5. *Situation E* : « Je dois préparer un courrier administratif très diplomatique et élégant. » $\rightarrow$ **Assistant rédactionnel (Claude)**.

---

### 🕒 Phase 5 : La Règle des 5 Questions & Devoir (10 min)

1. **Transmettre la boussole d'évaluation (Les 5 Questions)** :
   * 1. Que fait cet outil précisément ?
   * 2. Pour qui est-il conçu ?
   * 3. Qu'apporte-t-il de mieux que ce que j'ai déjà ?
   * 4. Quelles sont ses limites / son coût ?
   * 5. En ai-je réellement besoin dans mon travail ?
2. **Comment lire les annonces de nouveaux modèles** : Ne pas paniquer aux annonces marketing (« Le modèle révolutionnaire X ») $\rightarrow$ toujours chercher : *Quelle tâche précise ce modèle améliore-t-il pour moi ?*
3. **Explication du Devoir** : Découvrir un outil inconnu et remplir la fiche d'évaluation en 1 page.
