# 🧪 Fiche d'Activités — Exercices & Devoir : Outils, Connecteurs & MCP
> **Académie OPAYS • Module 09**  
> *Cartographie des outils de votre assistant, modélisation de la chaîne de connexion et devoir hebdomadaire.*

---

## 🎯 PARTIE 1 : Les Exercices en Séance (30 min)

### 🧪 Exercice 1 — L'Agent Tool Map (15 min)
*Pour l'assistant que vous avez conçu au Module 8, complétez ce tableau de besoins en outils :*

| Question d'architecture | Vos réponses pour votre assistant |
| :--- | :--- |
| **1. De quelles informations a-t-il besoin ?** | *(ex: Rapports d'activité mensuels, grille tarifaire, PV de réunions)* _________________________________________ |
| **2. Où sont stockées ces informations ?** | *(ex: Dossier Google Drive "Marchés 2025", boîte Gmail)* _________________________________________ |
| **3. Quelle action doit-il pouvoir exécuter ?** | *(ex: Extraire les montants, rédiger un brouillon d'email)* _________________________________________ |
| **4. Quel outil technique est nécessaire ?** | *(ex: Outil de lecture PDF, outil de calcul, recherche web)* _________________________________________ |
| **5. Quel connecteur direct serait idéal ?** | *(ex: Connecteur Google Drive / Google Docs)* _________________________________________ |

---

### 🧪 Exercice 2 — Dessiner sa Chaîne Opérationnelle (15 min)
*Tracez la chaîne logique de votre assistant pour une tâche réelle :*

```text
[Mon Assistant] : ___________________________________________________________
        │
        ▼ (Appelle le Skill)
[Skill Mobilisé] : __________________________________________________________
        │
        ▼ (Utilise l'Outil)
[Outil / Tool] : ____________________________________________________________
        │
        ▼ (Via le Connecteur / MCP)
[Connecteur / Pont] : _______________________________________________________
        │
        ▼ (Accède à la source)
[Source Réelle] : ___________________________________________________________
        │
        ▼ (Restitue le résultat)
[Livrable Final] : __________________________________________________________
```

---

## 🏆 PARTIE 2 : Le Devoir Hebdomadaire (Architecture d'Outillage & Sécurité)

*Définissez l'outillage et les garde-fous de votre assistant. Déposez ce document sur Google Classroom :*

```markdown
### 📋 Fiche d'Outillage & Permissions de Mon Assistant — Module 09

1. Nom de l'assistant : ____________________________________________________

2. Les 3 Outils indispensables :
   * 🛠️ Outil 1 : [Nom de l'outil] ➔ Rôle : _________________________________
     Niveau de permission : [ ] Vert (Lecture)  [ ] Jaune (Brouillon)  [ ] Rouge (Validation obligatoire)
   * 🛠️ Outil 2 : [Nom de l'outil] ➔ Rôle : _________________________________
     Niveau de permission : [ ] Vert (Lecture)  [ ] Jaune (Brouillon)  [ ] Rouge (Validation obligatoire)
   * 🛠️ Outil 3 : [Nom de l'outil] ➔ Rôle : _________________________________
     Niveau de permission : [ ] Vert (Lecture)  [ ] Jaune (Brouillon)  [ ] Rouge (Validation obligatoire)

3. Le Connecteur Prioritaire :
   * Quel service externe souhaitez-vous relier en priorité ? (ex: Google Drive / Gmail / Notion / WhatsApp) :
     ________________________________________________________________________
   * Pourquoi ce connecteur fera gagner un temps précieux ? :
     ________________________________________________________________________

4. Cas d'Usage Pertinent pour le Standard MCP :
   * Dans quel cas futur un serveur MCP standardisé permettrait-il à tous les agents de votre service d'accéder aux données sans tout recoder ? :
     ________________________________________________________________________
```
