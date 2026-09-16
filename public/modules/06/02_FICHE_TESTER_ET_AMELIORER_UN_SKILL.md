# 🧪 Fiche Pratique — Tester et Améliorer un Skill
> **Académie OPAYS • Module 06**  
> *La boucle d'ingénierie continue pour fiabiliser vos compétences IA.*

---

## 1. 🔄 La Boucle d'Amélioration en 5 Temps

Un Skill n'est jamais parfait du premier coup. Il se perfectionne en suivant ce cycle rigoureux :

```
    ┌──────────┐       ┌──────────┐       ┌────────────┐
    │  CRÉER   │ ───>  │  TESTER  │ ───>  │  OBSERVER  │
    └──────────┘       └──────────┘       └────────────┘
         ▲                                      │
         │             ┌──────────┐             │
         └──────────── │ AMÉLIORER│ <───────────┘
                       └──────────┘
```

1. **Créer** : Poser la première version de son Skill Canvas.
2. **Tester** : Soumettre 3 cas réels différents.
3. **Observer** : Noter précisément où l'IA a hésité, inventé ou manqué de rigueur.
4. **Améliorer** : Ajuster la *Méthode* ou durcir les *Règles & Limites*.
5. **Re-tester** : Valider que la correction fonctionne sans créer de nouvel effet de bord.

---

## 2. 🛡️ L'Épreuve du Feu : Les 3 Tests Obligatoires

Pour qu'un Skill soit certifié « prêt pour la production », vous devez le soumettre à 3 cas d'épreuve :

| Test d'épreuve | Description du cas | Ce que l'on vérifie |
| :--- | :--- | :--- |
| **Cas 1 : Le Cas Standard** | Un document ordinaire, bien structuré et complet. | Le Skill produit-il la structure demandée avec le bon ton ? |
| **Cas 2 : Le Cas Complexe** | Un document très long, désorganisé ou avec un jargon lourd. | Le Skill sait-il trier le signal du bruit sans se perdre ? |
| **Cas 3 : Le Cas Incomplet** *(Test piège)* | Un document où il manque des informations capitales (ex: aucun montant, aucun nom). | **Le Skill sait-il dire qu'il manque des données sans inventer d'informations ?** |

---

## 3. 🎯 Grille de Diagnostic : Comment Corriger son Skill ?

* **Si l'IA est trop bavarde** $\rightarrow$ Ajoutez dans *Contraintes* : *« Maximum 250 mots. Zéro formule de transition inutile. »*
* **Si l'IA invente des faits dans le Cas incomplet** $\rightarrow$ Ajoutez dans *Règles* : *« Si une donnée n'est pas explicitement écrite, indique impérativement [Information non fournie]. »*
* **Si l'IA oublie une section de sortie** $\rightarrow$ Numérotez strictement le format de sortie : *1. Synthèse, 2. Tableau, 3. Recommandations*.
