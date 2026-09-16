# 👨‍🏫 Module 06 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Les Skills : Transformer une Tâche en Capacité Réutilisable  
> **Niveau** : Débutant $\rightarrow$ Intermédiaire • **Durée totale** : 1h30 à 2h (Google Meet)  
> **Idée directrice** : *« Arrêtez de réécrire les mêmes instructions chaque matin. Si vous faites souvent la même tâche, transformez votre méthode en une capacité permanente et réutilisable : un Skill. »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Expliquer la différence essentielle entre un **prompt ponctuel** et un **Skill pérenne**.
2. Maîtriser les 6 piliers du **Skill Canvas** (*Nom, Entrée, Objectif, Méthode, Sortie, Règles d'exclusion*).
3. Concevoir son premier Skill professionnel et le tester sur 3 cas réels (*Cas simple, Cas complexe, Cas incomplet*).
4. Appliquer la boucle d'amélioration continue : **Créer $\rightarrow$ Tester $\rightarrow$ Observer $\rightarrow$ Améliorer $\rightarrow$ Valider**.
5. Comprendre comment plusieurs Skills s'enchaînent pour former un **Workflow** (*Skill 1 + Skill 2 = Processus*).
6. Avoir une première intuition de ce qu'est un fichier d'instructions persistantes (**`Agent.md`**).

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de programmation de fonctions, de fichiers YAML ou JSON complexes.
* ❌ Pas de configuration technique d'APIs ou de plugins développeurs.
* ❌ Pas de théorie abstraite sur les systèmes multi-agents (réservé aux modules 8 et 9).

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 15m │ PROMPT PONCTUEL VS SKILL & LA PRÉSENTATION DU SKILL CANVAS             │
│ 15 - 35m │ DÉMONSTRATION EN DIRECT : CRÉER ET ÉPROUVER LE SKILL « SYNTHÈSE PRO »  │
│ 35 - 45m │ SKILL + SKILL = WORKFLOW & INTRODUCTION LÉGÈRE À AGENT.MD              │
│ 45 - 75m │ ATELIER PRATIQUE : CRÉATION DE SON 1ER SKILL & TEST SUR 3 CAS RÉELS    │
│ 75 - 90m │ LA BOUCLE D'AMÉLIORATION CONTINUE & LANCEMENT DU DEVOIR (3 SKILLS)     │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Prompt Ponctuel vs Skill (15 min)

1. **La question brise-glace** :
   > *« Quelle tâche réalisez-vous au moins 2 ou 3 fois par semaine avec l'IA et pour laquelle vous vous retrouvez à taper à peu près les mêmes explications à chaque fois ? »*
2. **Poser la différence fondamentale** :
   * **Prompt ponctuel** : *« Résume ce texte en 10 points. »* (Une commande jetable pour l'instant T).
   * **Skill Métier** : *« Chaque fois que je te transmets des notes de réunion, applique scrupuleusement ma méthode en 5 étapes pour produire un compte-rendu normalisé avec décisions, responsables et échéances. »* (Une **capacité réutilisable**).
3. **Présenter le Skill Canvas (Les 6 Piliers)** :
   * 1. **Nom** : Intitulé clair de la capacité.
   * 2. **Entrée** : Ce que le Skill reçoit (texte brut, notes vocales, PDF).
   * 3. **Objectif** : Ce qu'il doit accomplir.
   * 4. **Méthode** : La recette pas-à-pas suivie par l'IA.
   * 5. **Sortie** : La structure exacte du livrable final.
   * 6. **Règles & Limites** : Ce qu'il a l'interdiction stricte de faire.

---

### 🕒 Phase 2 : Démonstration Live du Formateur (20 min)
> **Scénario Formateur** : *« Création du Skill : Préparateur de Notes de Réunion Administratives. »*

*Montrer la différence en direct sur ChatGPT ou Claude :*

1. **Test sans Skill (Prompt basique)** : On colle des notes brutes et on demande *« Fais un compte-rendu »*. Le résultat est correct mais souvent trop bavard et désorganisé.
2. **Activation du Skill formalisé** : On injecte le Skill Canvas complet.
3. **Application sur un 2ème jeu de notes différentes** : On injecte simplement de nouvelles notes dans le Skill.
4. **Observation collective** : Le résultat a exactement la même structure rigoureuse, le même niveau de détail et la même qualité professionnelle.
5. **Conclusion formateur** : *« Vous venez de doter votre IA d'un savoir-faire permanent. »*

---

### 🕒 Phase 3 : De la Chaîne de Skills au concept `Agent.md` (10 min)

1. **Skill + Skill = Workflow** :
   * Montrer que les compétences s'assemblent :  
     *Skill 1 (Extraire les chiffres)* $\rightarrow$ *Skill 2 (Détecter les anomalies)* $\rightarrow$ *Skill 3 (Rédiger la note d'alerte)*.
2. **Introduction légère à `Agent.md`** :
   * Expliquer simplement : *« Dans les systèmes IA avancés, un fichier comme `Agent.md` est le document maître qui regroupe la description de l'agent, ses règles permanentes et la liste des Skills qu'il sait exécuter. »*

---

### 🕒 Phase 4 : Atelier Pratique Apprenants (30 min)

*Chaque participant ouvre la fiche `01_FICHE_LE_SKILL_CANVAS.md`.*

#### 1. Rédaction de son premier Skill (15 min)
Chaque apprenant remplit son Canvas sur une tâche récurrente de son travail (ex: *Skill Rédaction d'Offre Commerciale*, *Skill Analyse de PV de Réunion*, *Skill Filtrage de Candidatures*).

#### 2. L'Épreuve du Feu : Tester le Skill sur 3 Cas (15 min)
L'apprenant teste son Skill avec :
* **Cas 1 (Cas standard)** : Un document normal.
* **Cas 2 (Cas complexe)** : Un document long ou désordonné.
* **Cas 3 (Cas incomplet)** : Un document où il manque des informations cruciales (*Le Skill sait-il dire qu'il manque des données sans inventer ?*).

---

### 🕒 Phase 5 : Amélioration Continue & Devoir (15 min)

1. **La boucle d'affinement** :
   * *« Que s'est-il passé lors du Cas incomplet ? L'IA a-t-elle inventé ? Si oui, renforcez la section Règles du Skill ! »*
2. **Lancement du Devoir Hebdomadaire** :
   * Finaliser **3 Skills professionnels complets** et les consigner dans sa Bibliothèque de Skills personnelle.
