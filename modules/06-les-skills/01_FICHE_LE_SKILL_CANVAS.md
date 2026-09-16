# 📄 Fiche Synthèse — Le Skill Canvas & L'Anatomie d'une Capacité
> **Académie OPAYS • Module 06**  
> *Le modèle standard pour concevoir des capacités réutilisables sans coder (1 page).*

---

## 1. 💡 Qu'est-ce qu'un Skill en réalité ?
Un **Skill** n'est pas un simple prompt. C'est une **méthode de travail formalisée** que vous donnez à l'IA pour qu'elle puisse accomplir une tâche spécifique de façon répétable, avec un niveau de qualité constant.

---

## 2. 🏛️ La Structure Maîtresse : Le Skill Canvas

```
┌────────────────────────────────────────────────────────────────────────┐
│  1. NOM DU SKILL   : Intitulé explicite (ex: Synthèse de Rapport)      │
│  2. ENTRÉE REÇUE   : Ce que l'utilisateur doit fournir (notes, PDF...) │
│  3. OBJECTIF VISÉ  : Le but précis et le destinataire final            │
│  4. MÉTHODE (Pas)  : La série d'étapes que l'IA doit suivre            │
│  5. SORTIE FORMAT  : La structure exacte du document produit           │
│  6. RÈGLES & LIMITES : Les interdictions absolues (anti-hallucination) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 📝 Exemple Concret : Le Skill « Compte-Rendu Exécutif »

```text
### SKILL : Générateur de Compte-Rendu de Réunion Exécutif

[ENTRÉE] : Notes brutes ou enregistrement transcrit d'une réunion.
[OBJECTIF] : Produire un compte-rendu clair et orienté action pour la direction.

[MÉTHODE] :
1. Identifier l'ordre du jour et les participants mentionnés.
2. Extraire les 3 à 5 décisions clés actées au cours de la séance.
3. Repérer les points de désaccord ou dossiers reportés.
4. Dresser le tableau des actions immédiates.

[SORTIE ATTENDUE] :
- Titre : Compte-rendu de réunion du [Date]
- 1. Synthèse en 3 phrases
- 2. Décisions actées (Puces claires)
- 3. Tableau des actions : [Action à mener] | [Responsable désigné] | [Échéance]

[RÈGLES IMPÉRATIVES] :
- Ne mentionne aucun responsable si son nom n'est pas explicitement cité dans les notes.
- Si une date limite n'est pas précisée, indique "À déterminer".
- Style formel, concis, zéro remplissage.
```

---

## 4. 🧠 La Passerelle vers `Agent.md`
Dans le monde des agents IA modernes :
* Un **Agent** est un système doté d'une identité et d'un rôle.
* Le fichier **`Agent.md`** est le livret de bord permanent de l'agent : il contient son contexte, ses règles de conduite et l'ensemble des **Skills** qu'il sait mobiliser.
