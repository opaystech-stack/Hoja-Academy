# 🛡️ Fiche Pratique — Permissions, Accès & Sécurité des Outils
> **Académie OPAYS • Module 09**  
> *Plus vous donnez d'outils à votre IA, plus vous devez verrouiller ses droits d'accès.*

---

## 1. 💡 La Règle du Moindre Privilège
> **« Ne donnez jamais à un assistant IA plus de droits d'accès qu'il n'en a strictement besoin pour accomplir sa mission. »**

---

## 2. 🚦 La Matrice des 4 Niveaux de Permissions

```
┌───────────┬──────────────────────────────────┬─────────────────────────────────────┐
│ NIVEAU    │ TYPE D'ACTION AUTORISÉE          │ RÈGLE D'EXÉCUTION                   │
├───────────┼──────────────────────────────────┼─────────────────────────────────────┤
│ 🟢 NIVEAU 1│ LECTURE SEULE                    │ Exécution automatique sans blocage. │
│           │ (Lire un PDF, consulter l'agenda)│ L'IA consulte l'information.        │
├───────────┼──────────────────────────────────┼─────────────────────────────────────┤
│ 🟡 NIVEAU 2│ CRÉATION DE BROUILLON            │ L'IA prépare le brouillon (email,   │
│           │ (Rédiger un email, créer un doc) │ note), mais NE L'ENVOIE PAS.        │
├───────────┼──────────────────────────────────┼─────────────────────────────────────┤
│ 🟠 NIVEAU 3│ MODIFICATION DE DONNÉES          │ VALIDATION HUMAINE EXPLICITE.       │
│           │ (Mettre à jour un statut CRM)    │ L'IA affiche ce qu'elle va changer. │
├───────────┼──────────────────────────────────┼─────────────────────────────────────┤
│ 🔴 NIVEAU 4│ ACTIONS CRITIQUES & IRREVERSIBLES│ CONTRÔLE STRICT & TRACE AUDITABLE.  │
│           │ (Supprimer un fichier, paiement) │ Interdiction d'autonomie complète.  │
└───────────┴──────────────────────────────────┴─────────────────────────────────────┘
```

---

## 3. 🔍 Les 4 Questions de Sécurité Avant d'Activer un Connecteur

1. **Périmètre des données** : *« Ce connecteur donne-t-il accès uniquement au dossier nécessaire ou à toute l'entreprise ? »*
2. **Sensibilité des informations** : *« Les données accessibles contiennent-elles des secrets de fabrication, des informations de sécurité nationale ou des données bancaires ? »*
3. **Traçabilité des actions** : *« Si l'IA effectue une action, pouvons-nous savoir précisément qui a lancé la commande et quand ? »*
4. **Bouton d'arrêt d'urgence** : *« Puis-je révoquer l'accès du connecteur en 1 clic si l'assistant commence à dysfonctionner ? »*
