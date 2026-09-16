# Audit PH2 — PARCOURS APPRENANT — Hoja Academy (course.opays.io/modules/)
**Date** : 2026-09-09 · **Méthode** : lecture seule `public/` + `landing/` + docs + tests live HTTP read-only de l'orchestrateur (401/200 vérifiés). Rédigé par l'orchestrateur (SA-APPRENANT tué par 429 dès son 5ᵉ appel, 0 livrable).

## Ce que l'apprenant a aujourd'hui
- **Un hub apprenant** (`/` authentifié compte partagé `apprenant`) : « Ces ressources accompagnent votre parcours Google Classroom. Suivez le Thème 00 — COMMENCER ICI pour démarrer, puis la semaine en cours. » + 18 cartes modules avec liens directs `modules/NN/`.
- **18 présentations sanitizées** (0 data-note, 0 consigne formateur — vérifié 0/18 et `test_public.js` 72/72 « aucune trace formateur ») avec navigation interne (dock, précédent/suivant, sommaire).
- La **mission par module** est dans la présentation (« Tester 3 tâches… **Déposer le comparatif sur Classroom avant lundi 23h59** »).

## Les 7 questions du client, réponse honnête
| Question | Réponse | Note |
|---|---|---|
| 1. Où suis-je ? | **PARTIEL** — le hub liste les 18 modules avec « semaine en cours » en CONSIGNE TEXTUELLE, aucun état visuel (pas de badge « où j'en suis », pas de suivi individuel — compte partagé). | 🔵 |
| 2. Que dois-je apprendre ? | **OUI** — carte module + titre + sous-titre (ex. « M03 — Méthode C.O.R.E. ») + plan de séance dans la présentation. | 🟢 |
| 3. Que faire maintenant ? | **PARTIEL** — la mission est affichée en fin de présentation ; rien sur le hub ne dit « ta tâche en cours ». | 🟡 |
| 4. Quelle mission ? | **OUI** (18/18 missions dans le registre, déposées dans les présentations). | 🟢 |
| 5. Où déposer mon travail ? | **NON PAS CLEAR** — « Déposer sur Classroom » est du texte sans LIEN vers la classe ; l'espace public ne contient AUCUN lien classroomUrl (volontaire pour le cloisonnement formateur, mais l'apprenant a besoin de SON lien). Et la classe Classroom est Vide (voir classroom.md) → aujourd'hui un apprenant ne peut PAS déposer. | 🔴 |
| 6. Ma progression ? | **NON** — aucune progression individuelle nulle part (site statique + Basic Auth partagé ; aucun localStorage de suivi ; la « progression » des présentations = avancement des slides). | 🔵 |
| 7. Étape suivante ? | **PARTIEL** — navigation suivante/précédente entre slides OUI, entre modules NON (aucun lien `../02/` — il repasse par le hub). | 🟡 |

## Règle des 5 minutes (critère client)
- Retrouver un cours : ✅ (hub → 1 clic).
- Trouver sa mission : ⚠️ (il faut ouvrir la présentation et aller à la fin).
- Déposer son travail : ❌ **> 5 minutes aujourd'hui — de fait impossible** (classe Classroom vide, pas de lien, pas d'invitation envoyée : 0 students live).

## Gaps classés (sans rien inventer)
1. **CRITIQUE (produit)** : le chaînon Classroom est vide (0 apprenants invités, 0 devoirs créés) — tout le « où déposer / progression » dépend de son peuplement (voir classroom.md étapes).
2. **MAJEUR** : pas de lien apprenant → classe Classroom dans l'espace public (le cloisonnement caché trop : la classe elle-même EST l'interface apprenant légitime). Fix trivial après peuplement : lien unique dans le hub public.
3. **MAJEUR** : pas de comptes apprenants individuels (compte Basic Auth partagé = pas de « où JE suis » possible en statique ; options : Classroom comme source de progression — déjà prévu — ou comptes nginx multiples par apprenant ; **décision d'architecture client**).
4. **MODERE** : aucun lien inter-modules (précédent/suivant au niveau module) ; le « Thème 00 COMMENCER ICI » mentionné sur le hub n'existe pas dans l'espace public (il vit dans Classroom — vide).
5. **MODERE** : le hub ne reflète pas la semaine courante (statiques ; `dateDebut` non câblé — même lacune que admin.md).
6. **MINEUR** : marque « Académie OPAYS » dans le hub/titres apprenants (incluse dans la DÉCISION RENOMMAGE).

## Ce qui marche déjà (à conserver tel quel)
Cloisonnement total formateur→apprenant (build sanitize + 401 routes) ✅ ; missions réelles par module ✅ ; supports consultables hors connexion une fois chargés ✅ ; test automatisé `test_parcours_apprenant.js` qui vérifie le parcours de base ✅.
