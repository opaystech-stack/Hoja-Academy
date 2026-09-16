# 🏫 Blueprint Google Classroom — Académie OPAYS

> **Architecture de diffusion d'une cohorte • Version 1.0**
> *Conçu pour l'expérience apprenant la plus simple possible : rejoindre → commencer → suivre la semaine → déposer → progresser.*

---

## 1. Principes de conception

| Principe | Application |
|---|---|
| **Just-in-Time** | L'apprenant ne voit QUE la ressource de la semaine en cours. Rien d'autre. |
| **2 niveaux** | Vue apprenant = semaine courante. Vue formateur = tout (Classroom affiche les brouillons aux profs). |
| **Une seule porte d'entrée** | Thème 00 — COMMENCER ICI : l'apprenant ne peut pas se perdre. |
| **Le fil rouge** | Le AI Work Kit est ouvert en Semaine 0 et complété chaque semaine. |
| **Simplicité maximale** | Pas d'outil tiers : tout vit dans Google Classroom (Topics + programmation native). |
| **Programmation native** | Les ressources et devoirs sont créés en DRAFT/brouillon dès J-5, puis programmés (scheduledTime) — la révélation est automatique. |

---

## 2. Structure des Thèmes (Topics)

### 2.1 Thèmes visibles par l'apprenant

```
📌 THÈME 00 — COMMENCER ICI                (permanent, épinglé en haut)
   ├─ 🎬 Bienvenue à l'Académie OPAYS (vidéo 3 min)
   ├─ 📋 Diagnostic Initial (formulaire 5 min) ← À remplir avant J0
   ├─ 💼 [Prénom_Nom] — Mon AI Work Kit (copie individuelle Google Docs)
   ├─ 🔗 Lien Meet permanent (épinglé — même lien pour les 16 séances)
   ├─ 📅 Calendrier des 8 semaines (1 page)
   └─ ✅ Checklist technique (micro, caméra, comptes IA)

📌 THÈME 01 — SEMAINE 1 : Démystification & C.O.R.E.     ← programmé S1
   ├─ 📚 Module 01 — Comprendre l'IA (lien présentation HTML)
   ├─ 🎯 Objectifs & Fiche de synthèse M01
   ├─ 📚 Module 02 — Écosystème IA (lien présentation HTML)
   ├─ 📚 Module 03 — Méthode C.O.R.E. (lien présentation HTML)
   └─ 🧰 Work Kit — Volet 01

📌 THÈME 02 — SEMAINE 2 : Cartographie & Documents       ← programmé S2
   ├─ 📚 Module 04 — L'IA dans mon travail (lien HTML)
   ├─ 📚 Module 05 — Documents & Données (lien HTML)
   └─ 🧰 Work Kit — Volet 02

... (Thèmes 03 à 08 : SEMAINE 3 à SEMAINE 8, même structure)

📌 THÈME 09 — MISSIONS HEBDOMADAIRES      (devoirs programmés, échéance lundi 23h59)
   ├─ 📤 Devoir 1 : Boîte de 5 prompts C.O.R.E. (S1)
   ├─ 📤 Devoir 2 : Synthèse exécutive sourcée (S2)
   ├─ 📤 Devoir 3 : Workflow métier + 2 Skills (S3)
   ├─ 📤 Devoir 4 : Agent.md + Permissions (S4)
   ├─ 📤 Devoir 5 : Agent IA V2 + rapport (S5)
   ├─ 📤 Devoir 6 : Recherche sourcée + Safety Card (S6)
   ├─ 📤 Devoir 7 : Support de soutenance 5 slides (S7)
   └─ 📤 Devoir 8 : AI Work Kit complet + ROI (S8)

📌 THÈME 10 — LA BOÎTE À OUTILS (permanent)
   ├─ 🧰 Gabarits : Skill Canvas, Agent.md, Automation Canvas, Source Checker, AI Safety Card
   ├─ 🧰 Les 15+ prompts C.O.R.E. de référence
   ├─ 🧰 Template AI Work Kit (version complète)
   └─ 🧰 Raccourcis : présentations HTML des 18 modules

📌 THÈME 11 — ACCOMPAGNEMENT (permanent)
   ├─ 🔗 Permanence Samedi 10h-11h (lien Meet déblocage)
   ├─ 📅 Réservation Coaching 1-on-1 (Calendly)
   └─ 💬 Règles du groupe WhatsApp promo
```

### 2.2 Ce que voit le formateur (en plus)

```
👁️ THÈME 12 — FORMATEUR SEULEMENT (brouillons, jamais publiés)
   ├─ 📂 Tous les guides d'animation (00_GUIDE_*.md × 18)
   ├─ 📂 Toutes les fiches formateur (notes, transitions, prompts)
   ├─ 📂 Corrigés & grilles d'évaluation (Grille soutenance, matrice progression)
   ├─ 📊 Suivi de cohorte (tableur progression par apprenant)
   └─ 🔧 Check-list de lancement de cohorte
```

> ⚠️ **Astuce Classroom** : tout ce qui doit rester invisible à l'apprenant est créé en **DRAFT**
> (brouillon). Les brouillons ne sont visibles que des enseignants. Pour les ressources
> programmées, on crée le matériel avec `scheduledTime` — Classroom le publie tout seul à la date.

---

## 3. Mapping pédagogique → Classroom (16 séances / 8 semaines)

| Sem. | Mardi 18h30 (Séance) | Jeudi 18h30 (Séance) | Devoir (lundi 23h59) | Work Kit |
|---|---|---|---|---|
| **0** | — | — | Diagnostic Initial (avant J0) | Ouverture du Work Kit |
| **1** | S01 — M01 Comprendre l'IA | S02 — M02 + M03 Écosystème & C.O.R.E. | D1 : 5 prompts C.O.R.E. | Volet 01 |
| **2** | S03 — M04 Mon travail & ROI | S04 — M05 Documents & NotebookLM | D2 : Synthèse sourcée | Volet 02 |
| **3** | S05 — M06 Skills Métiers | S06 — M07 Workflows & Loops | D3 : Workflow + 2 Skills | Volet 03 |
| **4** | S07 — M08 Assistant & Agent.md | S08 — M09 Connecteurs & MCP | D4 : Agent.md + Permissions | Volet 04 + 05 |
| **5** | S09 — M10 Premier Agent | S10 — M11 Grands Écosystèmes | D5 : Agent V2 + rapport | Volet 06 |
| **6** | S11 — M12 Recherche & Vérif. | S12 — M13 Sécurité & Confidentialité | D6 : Recherche + Safety Card | Volet 07 |
| **7** | S13 — M14 Automatiser | S14 — M16 IA au Quotidien | D7 : Support soutenance | Volet 08 + 09 |
| **8** | S15 — M17 Spécialisation | S16 — M15 + M18 Soutenances & Landscape | D8 : Work Kit complet + ROI | Volet 10 |

**Suivi post-formation** : J+7 session déblocage • J+21 check-point individuel • J+30 Masterclass Alumni.

---

## 4. Procédure de lancement d'une cohorte (check-list formateur)

### J-10 : Préparation
- [ ] Créer la classe Google Classroom « OPAYS Academy — Cohorte N°XX » (code: `OPAYS-XX`).
- [ ] Créer les 13 thèmes (voir section 2).
- [ ] **Héberger les présentations** (GitHub Pages / Netlify / Drive partagé) et générer le kit avec `--base-url <URL>` pour des liens cliquables.
- [ ] Dupliquer le template Work Kit dans Drive → créer 1 copie par apprenant (à partager en S0).
- [ ] Préparer tous les posts en brouillon (ressources + devoirs).

### J-5 : Programmation
- [ ] **Programmer les ressources de chaque semaine** (matériel + liens HTML + fiches) avec `scheduledTime` :
  - Semaine N → publication le **lundi de la semaine N à 06h00** (l'apprenant trouve sa semaine le lundi matin).
- [ ] **Programmer les devoirs** : publication le **jeudi de la semaine N à 21h00** (après la 2e séance), échéance **lundi 23h59**.
- [ ] Vérifier que les thèmes 00, 10, 11 sont **publiés immédiatement** (permanents).

### J-5 à J0 : Onboarding
- [ ] Envoyer l'email de bienvenue + invitation Classroom (J-5).
- [ ] Vérifier les accès outils IA (J-3).
- [ ] Vérifier la configuration technique (J0).

### Chaque semaine (rituel du formateur — 15 min)
- [ ] **Lundi matin** : les ressources de la semaine sont déjà visibles (programmées). Vérifier.
- [ ] **Mardi** : lancer la séance avec le Dashboard Formateur (timer, notes, prompts).
- [ ] **Jeudi soir 21h00** : le devoir de la semaine se publie automatiquement.
- [ ] **Samedi** : permanence déblocage.
- [ ] **Lundi 23h59** : collecte des remises — noter la progression dans le tableur de cohorte.

---

## 5. Ce que Google Classroom permet réellement (vérifié — docs API)

| Capacité | Support | Source |
|---|---|---|
| Topics (thèmes) | ✅ Oui — API `courses.topics` | API v1 |
| Devoirs programmés (`scheduledTime` + `DRAFT`) | ✅ Oui | API `courses.courseWork` |
| **Matériel/ressources programmés** | ✅ Oui — `scheduledTime` + `DRAFT` sur `courseWorkMaterials` | API `courses.courseWorkMaterials` |
| Brouillons visibles profs uniquement | ✅ Oui — état `DRAFT` | API |
| Pièces jointes (Drive, liens, PDF, YouTube) | ✅ Oui (max 20 par post) | API |
| Échéance avec heure | ✅ Oui (`dueDate` + `dueTime`, UTC) | API |
| Affectation à sous-groupes d'étudiants | ✅ Oui (`assigneeMode`) | API |
| Réutiliser un post d'une autre classe | ✅ Oui — « Reuse Post » (UI) — parfait pour Cohortes 02, 03… | UI |
| Publication différée multi-classes | ✅ Oui (depuis 2022) | Blog Google |
| Lien Meet permanent épinglé | ✅ Oui (créé avec la classe) | UI |

> **Conclusion** : la diffusion Just-in-Time est **100 % réalisable nativement** dans Google
> Classroom. **Aucun outil tiers n'est nécessaire.** Les seules limites : pas d'API d'automatisation
> sans projet Google Cloud (voir section 6), et les brouillons programmés ne sont pas modifiables
> après programmation pour les pièces jointes (bien tout préparer avant).

---

## 6. Automatisation : deux niveaux possibles

### Niveau 1 — Manuel assisté (recommandé pour la Cohorte 01)
Le formateur utilise le **Kit de lancement** (`docs/classroom/kit-lancement/`) : des textes prêts à
copier-coller pour chaque post (ressources, devoirs, annonces), générés par le script
`scripts/generate_classroom_posts.js` à partir du registre central. Zéro configuration, zéro risque.

### Niveau 2 — API Google Classroom (optionnel, Cohortes 02+)
Un script Node (`scripts/classroom_api/`) peut créer toute la structure (thèmes, matériel programmé,
devoirs) via l'API REST Google avec un compte de service. Nécessite :
1. Un projet Google Cloud (gratuit).
2. L'API Classroom activée.
3. Un compte de service ajouté comme enseignant de la classe.
4. `GOOGLE_APPLICATION_CREDENTIALS` (jamais versionné — voir `.env.example`).

> ⚠️ **Décision d'architecture** : on implémente le Niveau 1 maintenant (robuste, sans dépendance).
> Le Niveau 2 est documenté mais non implémenté tant que la Cohorte 01 n'a pas validé le flux.

---

## 7. Expérience apprenant (parcours complet)

```
Campagne marketing (landing OPAYS)
   ↓ « Je m'inscris » → formulaire d'inscription (nom, email, métier, organisation)
   ↓ Email de bienvenue (J-5) : lien Classroom + code OPAYS-XX + calendrier + checklist technique
   ↓ Rejoint Google Classroom → Thème 00 COMMENCER ICI (épinglé)
   ↓ Lundi S1 : les ressources Semaine 1 sont visibles (auto-programmées)
   ↓ Mardi : séance live sur Meet (lien épinglé) → présentation HTML (lien dans le post)
   ↓ Jeudi 21h : Devoir 1 publié (échéance lundi 23h59)
   ↓ Semaine suivante : les ressources S2 apparaissent, S1 reste consultable
   ↓ … (jusqu'à la S8)
   ↓ Soutenance finale (S16) → Certification Pratique OPAYS + Work Kit complet
   ↓ J+7 / J+21 / J+30 : suivi post-formation → Alumni
```

**L'apprenant ne voit jamais plus de 5-6 posts par semaine.** La règle d'or :
*une semaine = un thème = 2-3 ressources + 1 mission.*
