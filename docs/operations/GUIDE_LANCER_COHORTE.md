# 🚀 Comment lancer une nouvelle cohorte OPAYS — Guide Admin

> **Pour un administrateur qui n'a pas développé le projet.**
> Chaque nouvelle cohorte suit EXACTEMENT cette procédure (≈ 2 h de préparation, réparties sur 2 semaines).

---

## 📋 Vue d'ensemble

```
1. Créer Classroom    → 2. Créer Meet → 3. Créer Google Form → 4. Renseigner les URLs
→ 5. Choisir la date → 6. Générer le kit → 7. Préparer Classroom → 8. Inviter
→ 9. Semaine 1 → 10. Diffusion progressive → 11. Missions → 12. Clôture
```

**Les 3 espaces (définitifs) :**

| Espace | URL | Accès |
|---|---|---|
| Public (landing) | `https://course.opays.io/` | Tout le monde |
| Apprenant (supports) | `https://course.opays.io/modules/01/` … `/18/` | Mot de passe cohorte (`apprenant` / …) |
| Formateur (admin) | `https://course.opays.io/admin/` | Mot de passe admin |

---

## 1️⃣ Créer la classe Google Classroom

1. Aller sur [classroom.google.com](https://classroom.google.com) → **+** → **Créer un cours**
2. Nom : **« OPAYS Academy — Cohorte N°XX »** (ex. Cohorte 01)
3. Rubrique : **Formation professionnelle** → Créer
4. Copier le **code de la classe** (ex. `wjrdl5d4`) et le **lien d'invitation** (`https://classroom.google.com/c/...`)
5. **Créer les 13 thèmes** (dans l'onglet « Travaux » → « Créer » → « Thème ») :

| Thème | Contenu | Visibilité |
|-------|---------|------------|
| 00 — COMMENCER ICI | Bienvenue, Meet, diagnostic, Work Kit | Publier immédiatement |
| 01 → 08 — SEMAINE 1 à 8 | Ressources de la semaine | Programmer (lundi 06h00) |
| 09 — MISSIONS HEBDOMADAIRES | Devoirs | Programmer (jeudi 21h00) |
| 10 — LA BOÎTE À OUTILS | Ressources permanentes | Publier immédiatement |
| 11 — ACCOMPAGNEMENT | Permanence, coaching | Publier immédiatement |
| 12 — FORMATEUR SEULEMENT | Brouillons internes | **DRAFT** (jamais publié) |

## 2️⃣ Créer le lien Google Meet

1. Dans Classroom → onglet « Travaux & classe » → section Meet → **« Générer le lien »**
2. Copier le lien (permanent, même lien pour les 16 séances)

## 3️⃣ Créer le formulaire d'inscription (Google Forms)

1. [forms.google.com](https://forms.google.com) → nouveau formulaire
2. Champs : Nom complet • Email • Téléphone/WhatsApp • Organisation • Poste • Objectif (1 phrase) • Comment avez-vous entendu parler de nous ?
3. Réponses → **Notifier par email** à chaque soumission
4. Dans « Paramètres » → « Message de confirmation » → cocher « Afficher le lien » → URL : `https://course.opays.io/merci.html`
5. Publier → copier le lien (mode « Envoyer »)

## 4️⃣ Renseigner les URLs (fichier `data/cohorte.js`)

```js
nom: "Cohorte 01",
classroomUrl: "https://classroom.google.com/c/…?cjc=…",  // étape 1
meetUrl: "https://meet.google.com/…",                    // étape 2
enrollmentUrl: "https://forms.gle/…",                    // étape 3
dateDebut: "2026-09-07",                                 // lundi (voir étape 5)
```

## 5️⃣ Choisir la date de début

- La date doit être un **LUNDI** (le générateur le vérifie)
- Vérifier qu'aucun jour férié ne tombe en semaine

## 6️⃣ Générer le kit Classroom

Sur la machine de développement :

```bash
npm run classroom:kit 2026-09-07 --out docs/classroom/posts/cohorte-01
```

→ produit `kit-lancement-2026-09-07.md` avec tous les posts, dates et liens.
→ Vérifier : `npm run check:classroom` (9 vérifications, 0 issue).

## 7️⃣ Préparer Classroom (copier les posts)

Depuis le kit, **créer chaque post dans la classe** :

| Post | Thème | Quand |
|--------|---------|-------|
| « Bienvenue » + « Lien Meet » + « Diagnostic » + « AI Work Kit » | 00 | **Immédiatement** |
| Ressources Semaine 1..8 | 01..08 | **Programmer** (lundi 06h00) |
| Devoirs 1..8 | 09 | **Programmer** (jeudi 21h00, échéance lundi 23h59) |
| Boîte à outils, accompagnement | 10, 11 | Immédiatement |

> 💡 Astuce : après une cohorte, utiliser **« Réutiliser le post »** depuis l'ancienne classe pour gagner du temps, puis ajuster les dates.

## 8️⃣ Inviter les apprenants

1. **Valider les candidatures** (formulaire → email) : appeler/écrire le candidat, valider le profil
2. Envoyer l'**email de bienvenue** (voir `docs/onboarding/EMAIL_BIENVENUE.md`) avec :
   - le lien Classroom (code `cjc`)
   - le lien Meet
   - les identifiants d'accès aux présentations (`apprenant` / mot de passe cohorte)
3. Vérifier que les **3-4 premiers inscrits rejoignent** avant le lancement

## 9. Lancer la semaine 1

1. Vérifier que les ressources S1 sont **visibles** (programmées lundi 06h00)
2. Ouvrir le **Meet** + le **Dashboard** (`/admin/`) + le **Module 01**
3. Annoncer dans Classroom (thème 00) : « La semaine 1 est ouverte ! »

## 10. Diffusion progressive des ressources

- **Automatique** grâce aux posts programmés (Semaine N visible seulement le lundi de la semaine N)
- Vérifier chaque lundi que les nouvelles ressources apparaissent, et que les précédentes restent consultables

## 11. Gérer les missions

- Les **devoirs sont programmés** (jeudi 21h00, échéance lundi 23h59)
- **Corriger** dans Classroom (commentaires + barème du kit)
- Noter le **jalon** dans le tableur de suivi (`docs/cohortes/SUIVI_COHORTE_TEMPLATE.csv`)

## 12. Clôturer la cohorte

1. **Soutenances finales** (semaine 8) : planifier les 10 min/apprenant
2. **Certificats** : délivrer après soutenance (template OPAYS)
3. **Debrief** : collecter les retours, corriger les bugs, archiver la classe
4. **Cohorte suivante** : répéter les étapes 1-11 (le système est conçu pour)

---

## 🧪 Pilote interne (avant la cohorte réelle)

Avant de lancer une cohorte commerciale, faire un **pilote avec 1-3 personnes** :
voir `docs/operations/PILOTE_INTERNE.md` (scénario complet, critères de validation).

## ❓ FAQ rapide

- **« Combien de temps ? »** : 8 semaines, 2 séances/semaine (mardi & jeudi 18h30-20h30), +1 mission/semaine.
- **« Où sont les ressources ? »** : Classroom (Thème semaine) + présentations sur `course.opays.io/modules/…` (identifiants apprenant).
- **« Comment changer le mot de passe apprenant ? »** : sur le serveur VPS, relancer le script de déploiement avec `LEARN_PASS=…` (voir `deploy/deploy-vps-academy.sh`).
- **« Comment corriger une ressource ? »** : modifier le module dans les sources → `npm run build:public` → `npm run build-bundle` → relancer le script de déploiement. Les URLs des modules ne changent jamais.
