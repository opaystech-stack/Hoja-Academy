# 👨‍🏫 Module 09 — Guide d'Animation de la Séance (Conducteur Formateur)
> **Titre** : Connecteurs, Outils et MCP : Donner des Bras et des Yeux à l'IA  
> **Niveau** : Débutant $\rightarrow$ Intermédiaire • **Durée totale** : 1h30 à 2h (Google Meet)  
> **Idée directrice** : *« Un modèle de langage sait réfléchir et rédiger, mais il est enfermé dans sa boîte. Les Outils, les Connecteurs et le standard MCP sont les bras et les yeux qui lui permettent d'accéder à vos vraies données de travail et d'agir sous votre contrôle. »*

---

## 🎯 Objectifs Pédagogiques Clés
À la fin de la séance, chaque apprenant doit être capable de :
1. Distinguer précisément un **Modèle** (le cerveau), un **Outil** (la capacité d'action), un **Connecteur** (le pont) et **MCP** (le protocole standardisé).
2. Comprendre l'analogie universelle de MCP (*Le "port USB universel" de l'écosystème IA*).
3. Concevoir la chaîne complète de son assistant : **Assistant $\rightarrow$ Skill $\rightarrow$ Tool $\rightarrow$ Connecteur/MCP $\rightarrow$ Source $\rightarrow$ Résultat**.
4. Définir une politique de **Permissions et de Sécurité** stricte (*Lire vs Modifier vs Envoyer vs Décider*).
5. Ne plus être intimidé lorsqu'il entend parler de MCP dans l'actualité technologique.

---

## 🚫 Ce qu'on ne doit STRICTEMENT PAS faire aujourd'hui
* ❌ Pas de programmation de serveurs MCP en TypeScript ou Python.
* ❌ Pas de configuration de jetons d'authentification OAuth, clés API ou JSON-RPC.
* ❌ Pas d'installation de bases de données locales SQL.

---

## ⏱️ Déroulé Pédagogique Chronométré

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ Timing   │ Phase & Activité                                                       │
├──────────┼────────────────────────────────────────────────────────────────────────┤
│ 00 - 15m │ OUVERTURE : « VA CHERCHER MON RAPPORT DANS GOOGLE DRIVE » (LE BLOCAGE) │
│ 15 - 35m │ LE TRIO FONDAMENTAL : OUTIL vs CONNECTEUR vs MCP                       │
│ 35 - 55m │ DÉMONSTRATION EN DIRECT : L'ASSISTANT COMMERCIAL AUGMENTÉ DE SES OUTILS│
│ 55 - 80m │ ATELIER PRATIQUE : L'AGENT TOOL MAP & DESSINER SA CHAÎNE DE CONNEXION  │
│ 80 - 90m │ LA MATRICE DES PERMISSIONS (SÉCURITÉ STRICTE) & DEVOIR HEBDOMADAIRE    │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```

---

### 🕒 Phase 1 : Le Blocage du Modèle Isolé (15 min)

1. **La mise en situation** :
   * Demander à un assistant dans ChatGPT ou Claude : *« Va chercher le contrat du partenaire X dans notre Google Drive et dis-moi s'il expire ce mois-ci. »*
   * L'IA répond : *« Je n'ai pas accès à vos fichiers externes ni à Internet/votre Drive. »*
2. **La question au groupe** :
   > *« Que manque-t-il à notre assistant pour faire ce travail ? »*
   * Il lui manque une connexion, des droits d'accès et la capacité de lire une base de données externe.
3. **Le message clé** :
   * Le modèle apporte le **raisonnement**. L'outil apporte l'**accès** et l'**action**.

---

### 🕒 Phase 2 : Le Trio Explicatif — Outil, Connecteur & MCP (20 min)

#### 1. L'Outil (*Tool*) = La Capacité d'Action
* Ce que l'IA sait utiliser pour agir : *Rechercher sur le web, exécuter une formule de calcul, lire un PDF, envoyer un SMS, interroger un calendrier*.

#### 2. Le Connecteur (*Connector*) = Le Pont vers un Service
* Le lien direct entre l'IA et un logiciel métier : *IA $\leftrightarrow$ Google Drive, IA $\leftrightarrow$ Gmail, IA $\leftrightarrow$ Notion, IA $\leftrightarrow$ WhatsApp, IA $\leftrightarrow$ Logiciel de facturation*.
* *Sans connecteur* : Télécharger manuellement le fichier $\rightarrow$ le glisser dans le chat.
* *Avec connecteur* : L'IA consulte directement le bon dossier autorisé.

#### 3. MCP (*Model Context Protocol*) = Le Standard Universel
* **L'analogie du câble de smartphone** :
  * *Avant* : Chaque marque avait son propre chargeur propriétaire (incompatible et complexe à maintenir).
  * *Avec MCP* : C'est comme la prise **USB-C universelle** $\rightarrow$ N'importe quel modèle d'IA peut se brancher sur n'importe quelle source de données ou outil sans réécrire tout le système.

---

### 🕒 Phase 3 : Démonstration Live du Formateur (20 min)
> **Scénario Formateur** : *« Préparation d'un rendez-vous stratégique par l'Assistant Commercial. »*

*Montrer le contraste entre les deux mondes :*

1. **Monde 1 (Modèle seul sans outils)** : L'IA donne des conseils généraux de vente (*« Soyez souriant, posez des questions ouvertes »*).
2. **Monde 2 (Modèle connecté à 3 outils)** :
   * *Outil 1 (Recherche Web)* $\rightarrow$ Trouve les dernières actualités du prospect.
   * *Outil 2 (Connecteur Documentaire / Drive)* $\rightarrow$ Lit le compte-rendu du précédent échange.
   * *Outil 3 (Calendrier)* $\rightarrow$ Vérifie la durée et les participants de la réunion de demain.
3. **Résultat** : Un briefing exécutif sur-mesure prêt en 1 minute.
4. **Schéma du flux MCP** : Montrer sur un schéma simple comment l'assistant dialogue avec le serveur MCP sans entrer dans le code.

---

### 🕒 Phase 4 : Atelier Pratique « Agent Tool Map » (25 min)

*Chaque participant ouvre la fiche `03_FICHE_EXERCICES_ET_DEVOIR.md`.*

#### 1. Cartographier les besoins de son assistant (15 min)
* De quelles informations réelles a-t-il besoin ? (Fiches de paie, PV de réunions, stock, catalogue produits).
* Où se trouvent ces informations ? (Dossier Drive, logiciel de caisse, boîte Gmail, site web).
* Quel outil/connecteur lui permettrait d'y accéder ?

#### 2. Dessiner sa Chaîne de Connexion (10 min)
*Compléter la chaîne logique :*  
**Mon Assistant $\rightarrow$ Skill Mobilisé $\rightarrow$ Tool Nécessaire $\rightarrow$ Connecteur/MCP $\rightarrow$ Source Réelle $\rightarrow$ Livrable Produit**

---

### 🕒 Phase 5 : Sécurité, Permissions & Devoir Hebdo (10 min)

1. **La règle de sécurité des 4 Feux** :
   * *Lire un document* $\rightarrow$ 🟢 Accès direct autorisé.
   * *Modifier des données* $\rightarrow$ 🟡 Validation humaine conseillée.
   * *Envoyer un email / Message officiel* $\rightarrow$ 🟠 Confirmation humaine obligatoire.
   * *Supprimer un fichier / Transaction bancaire* $\rightarrow$ 🔴 Contrôle humain strict et inviolable.
2. **Lancement du Devoir Hebdomadaire** :
   * Identifier les 3 outils et le connecteur prioritaire de son assistant + Définir la politique de permissions associée.
