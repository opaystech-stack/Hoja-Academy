# 🧑‍💼 Parcours Candidat → Validation humaine → Invitation Classroom

> **Le flux officiel d'inscription de l'Académie OPAYS.**
> Chaque candidat passe par une **validation humaine** — jamais d'acceptation automatique.

## 1. Le parcours complet (vue d'ensemble)

```
LANDING (course.opays.io)
   ↓  Clic « S'inscrire à la Cohorte » → ENROLLMENT_URL (Google Form)
FORMULAIRE D'INSCRIPTION
   ↓  Soumission → email de notification à l'admin (réponse Google Forms)
NOTIFICATION ADMIN
   ↓  L'admin lit la candidature (profil, motivation, attentes)
CONTACT & ENTRETIEN (WhatsApp / email / appel)
   ↓  L'admin évalue : profil, motivation, prérequis (navigateur + traitement de texte)
VALIDATION ou REFUS
   ↓  Si accepté : envoi de l'email de bienvenue + lien d'invitation Classroom
INVITATION CLASSROOM (lien https://classroom.google.com/c/...?cjc=...)
   ↓  Le candidat accepte l'invitation → devient étudiant de la classe
ONBOARDING (Thème 00 — COMMENCER ICI)
   ↓  Semaine 1 → Semaine 2 → … → Semaine 8
CERTIFICATION (soutenance finale)
```

## 2. Rôles et responsabilités

| Acteur | Responsabilités |
|---|---|
| **Candidat** | Remplit le formulaire, attend la validation, rejoint Classroom, suit le parcours |
| **Admin (formateur)** | Reçoit la notification, contacte, valide/refuse, invite dans Classroom, suit la progression |
| **Système (automatisé)** | Landing, formulaire, notification email, lien Classroom, kit de cohorte, supports hébergés |

## 3. Les 3 décisions de validation (critères)

L'admin doit vérifier, lors du contact candidat :

1. **Profil professionnel** : en activité (cadre, RH, finance, projet, ONG…) — c'est la cible de la formation
2. **Motivation** : pourquoi l'IA maintenant ? Quelles tâches répétitives veut-il automatiser ?
3. **Prérequis techniques** : sait-il utiliser un navigateur + un traitement de texte ? (aucune compétence technique requise)

**Rejet possible** : candidature hors cible (ex. développeur cherchant un cours de code, étudiant sans activité pro) — refus courtois avec explication.

## 3. Ce qui est automatisé vs manuel

| Étape | Automatisé ? | Commentaire |
|---|---|---|
| Landing + programme | ✅ | `course.opays.io` |
| Formulaire d'inscription | ✅ | Google Forms (lien dans `data/cohorte.js`) |
| Notification admin | ✅ | Google Forms → notification email (paramétrer dans Forms) |
| Contact candidat | ❌ **Manuel** | WhatsApp/email par l'admin |
| Validation | ❌ **Manuel** | Décision humaine (critères ci-dessus) |
| Invitation Classroom | ❌ **Manuel** | Copier le lien d'invitation dans l'email de bienvenue |
| Suivi de cohorte | ✅ (tableau) | `docs/cohortes/SUIVI_COHORTE_TEMPLATE.csv` |

## 4. Checklist admin — à chaque candidature

1. [ ] Recevoir la notification (email Forms)
2. [ ] Lire la réponse (profil, motifs, attentes)
3. [ ] Contacter le candidat (WhatsApp/email — délai 48 h max)
4. [ ] Vérifier les 3 critères (profil, motif, prérequis)
5. [ ] **Valider** → envoyer email de bienvenue + lien d'invitation
6. [ ] **Refuser** → réponse courtoise + redirection vers ressources gratuites (landing)
7. [ ] Ajouter au suivi de cohorte (tableau CSV)

## 4. Modèle d'email de bienvenue (J-5)

> Voir `docs/onboarding/EMAIL_BIENVENUE.md` — à adapter avec le lien d'invitation réel.

## 5. Test du parcours (avant la vraie cohorte)

**Pilote interne** (`docs/operations/PILOTE_INTERNE.md`) :
1. Créer un Google Form de test (ou réutiliser le vrai)
2. Soumettre une candidature fictive (compte test)
3. Vérifier la notification admin
4. Accepter le candidat test
5. Envoyer l'email de bienvenue + invitation Classroom
6. Faire suivre le parcours Semaine 1 au testeur
7. Débriefer (points bloquants, clarté, temps de chaque étape)
