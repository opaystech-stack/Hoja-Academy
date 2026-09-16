# 🛡️ Fiche Pratique — Vérification des Sources & Sécurité des Données
> **Académie OPAYS • Module 05**  
> *Comment forcer l'IA à prouver ses affirmations et protéger les informations sensibles.*

---

## 1. 🔍 Les 4 Prompts de Vérification des Sources (Anti-Hallucination)

Lorsque vous travaillez sur des documents administratifs, juridiques ou financiers importants, imposez ces instructions :

### 1. Le Prompt de Justification par Citation
```text
Pour chacune de tes conclusions, cite entre guillemets la phrase exacte du document qui la justifie et indique la section/page concernée.
```

### 2. Le Prompt de Séparation Faits / Déductions
```text
Sépare clairement ta réponse en deux parties distinctes :
1. Les faits explicitement mentionnés dans le document.
2. Tes propres déductions ou interprétations.
```

### 3. Le Prompt d'Interdiction d'Invention
```text
Base-toi STRICTEMENT et UNIQUEMENT sur le document joint.
Si une information demandée n'y figure pas, écris explicitement : "Information absente du document". Ne fais aucune supposition.
```

### 4. Le Prompt de Détection des Angles Morts
```text
Quels sont les points critiques, les données manquantes ou les ambiguïtés que ce document omet de préciser ?
```

---

## 2. 🔒 La Checklist Sécurité Avant de Charger un Fichier

Avant de téléverser un fichier sur une plateforme grand public, vérifiez toujours ces 5 points :

```markdown
- [ ] 1. Ai-je le droit légal et hiérarchique de partager ce document sur un outil tiers ?
- [ ] 2. Ai-je supprimé les données personnelles identifiables (Noms réels, téléphones, emails, adresses) ?
- [ ] 3. Ai-je masqué les données financières et bancaires ultra-sensibles (RIB, salaires nominatifs, numéros de comptes) ?
- [ ] 4. Le document contient-il des mentions "SECRET DÉFENSE / STRICTEMENT CONFIDENTIEL" ? (Si OUI ➔ NE PAS CHARGER).
- [ ] 5. AI-JE PRIS LE RÉFLEXE D'ANONYMISER ? (Remplacer "M. Untel, Directeur de la société ABC" par "Le Directeur de l'Entreprise X").
```
