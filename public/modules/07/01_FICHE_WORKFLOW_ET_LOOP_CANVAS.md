# 📄 Fiche Synthèse — Workflow & Loop Canvas
> **Académie OPAYS • Module 07**  
> *Les gabarits visuels pour structurer des processus professionnels multi-étapes (1 page).*

---

## 1. 🏛️ Le Workflow Canvas (La Chaîne d'Étapes)

Un **Workflow** est l'enchaînement ordonné de plusieurs actions pour parvenir à un livrable complexe :

```
[ DOCUMENT / DONNÉES BRUTES EN ENTRÉE ]
                  │
                  ▼
        ┌───────────────────┐
        │  ÉTAPE 1 (IA)     │ ➔ Skill d'Extraction (Faits, dates, montants)
        └───────────────────┘
                  │
                  ▼
        ┌───────────────────┐
        │  ÉTAPE 2 (IA)     │ ➔ Skill d'Analyse (Comparaison, risques, options)
        └───────────────────┘
                  │
                  ▼
   🛑 [ POINT DE CONTRÔLE HUMAIN : Décision de l'orientation ]
                  │
                  ▼
        ┌───────────────────┐
        │  ÉTAPE 3 (IA)     │ ➔ Skill de Rédaction (Mise en forme du livrable)
        └───────────────────┘
                  │
                  ▼
   ✅ [ LIVRABLE FINAL VALIDÉ PAR L'HUMAIN ]
```

---

## 2. 🔄 Le Loop Canvas (La Boucle de Révision Contrôlée)

Une **Loop** est une séquence d'amélioration continue qui s'exécute jusqu'à une **condition d'arrêt** précise :

```
             ┌──────────────────────────────────────────────┐
             │               1. PRODUIRE                    │
             │     L'IA génère une première version         │
             └──────────────────────────────────────────────┘
                                    │
                                    ▼
             ┌──────────────────────────────────────────────┐
             │               2. VÉRIFIER                    │
             │   L'IA relit et cherche les erreurs/manques  │
             └──────────────────────────────────────────────┘
                                    │
                 ┌──────────────────┴──────────────────┐
                 ▼                                     ▼
        [ Y A-T-IL DES ERREURS ? ]             [ AUCUNE ERREUR / PRÊT ]
                 │                                     │
                 ▼ OUI                                 ▼ NON
        ┌───────────────────┐                 ┌───────────────────┐
        │   3. CORRIGER     │                 │   4. LIVRABLE OK  │
        │ L'IA améliore     │                 │  Validation       │
        └───────────────────┘                 │  Humaine Finale   │
                 │                            └───────────────────┘
                 └───────────────┐
                                 ▼
                     (Retour à l'étape 2)
```

### 🛑 Les 3 Conditions d'Arrêt Types :
1. **Condition de Qualité** : *Arrêter dès qu'il n'y a plus aucune contradiction avec le document source.*
2. **Condition de Complétude** : *Arrêter dès que les 4 sections obligatoires sont remplies.*
3. **Condition de Sécurité** : *Arrêter après 3 boucles maximum pour éviter les boucles infinies.*
