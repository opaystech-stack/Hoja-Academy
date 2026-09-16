# 🔍 Fiche Pratique — Les 8 Prompts de Vérification et de Traçabilité
> **Académie OPAYS • Module 12**  
> *Les instructions incontournables pour forcer l'IA à prouver ses affirmations et pointer ses doutes.*

---

### 1. 📌 Le Prompt d'Exigence de la Source Primaire
```text
Pour chaque affirmation factuelle de ta réponse :
1. Indique l'organisation ou l'institution d'origine.
2. Précise le document ou l'étude originale (titre, date, section).
3. Ne cite aucun chiffre sans préciser sa source primaire.
```

---

### 2. ⚖️ Le Prompt de Séparation Faits / Interprétations
```text
Structure ta synthèse en 3 rubriques strictement séparées :
- [FAITS VÉRIFIÉS] : Ce qui est explicitement établi par les sources.
- [INTERPRÉTATIONS] : Ce que les analystes en déduisent.
- [POINTS D'INCERTITUDE] : Ce qui reste à confirmer ou ce sur quoi les sources divergent.
```

---

### 3. 🛡️ Le Prompt de Détection des Contradictions
```text
Compare les sources disponibles sur ce sujet. Y a-t-il des chiffres contradictoires ou des désaccords d'analyse entre les experts ? Explique pourquoi leurs conclusions diffèrent (méthode, période, périmètre).
```

---

### 4. ❓ Le Prompt d'Aveu d'Ignorance (Anti-Hallucination)
```text
Si tu n'as pas accès au texte officiel exact ou à une donnée vérifiée récente pour répondre à cette question, dis explicitement : "Je ne dispose pas de la source vérifiée pour confirmer cette information" au lieu de formuler une estimation.
```

---

### 5. 🎯 Le Prompt de Formulation de Requête Ciblée
```text
Je veux faire une recherche approfondie sur : [Sujet général].
Aide-moi à transformer cette question vague en 3 requêtes de recherche ultra-précises en précisant le sujet, la zone géographique (RDC / Afrique), la période temporelle et les mots-clés techniques à cibler.
```

---

### 6. 📊 Le Prompt de Vérification Méthodologique
```text
Tu mentionnes le chiffre suivant : [Coller le chiffre ou pourcentage].
Quelle est la méthodologie exacte utilisée pour obtenir ce chiffre ? Quelle est la taille de l'échantillon et quelle année a été étudiée ?
```

---

### 7. 🕵️ Le Prompt d'Audit Critique d'un Document
```text
Agis comme un auditeur exigeant. Relis ce rapport ci-dessous et dresse la liste des 5 affirmations les plus fragiles qui méritent d'être vérifiées avant que nous ne présentions ce document à la direction.
```

---

### 8. 📝 Le Prompt de Note de Synthèse avec Degré de Confiance
```text
Rédige une note de synthèse pour mon Directeur Général sur [Sujet].
Pour chaque point clé abordé, ajoute une mention entre crochets indiquant le niveau de certitude : [Certitude Haute - Source Officielle] / [Certitude Moyenne - Source Secondaire] / [À Vérifier].
```
