# 🥇 GOLDEN PATH — Le parcours de référence Académie OPAYS

> **Le chemin qu'un apprenant doit pouvoir suivre sans aide, du clic d'inscription à la certification.**
> Testé automatiquement à chaque release (`npm run test:parcours` + `npm run test:formateur`) et manuellement avant chaque cohorte.

---

## 1. Le parcours apprenant (11 étapes)

```
1. LANDING / INSCRIPTION
   Campagne → formulaire Google Forms (5 champs) → email de confirmation
        ↓
2. BIENVENUE (J-5)
   Email : lien Classroom + code + calendrier + checklist technique
        ↓
3. CLASSROOM (Thème 00 — COMMENCER ICI)
   L'apprenant comprend immédiatement : « commence par le Thème 00 »
   → Diagnostic Initial (5 min) → ouvre son AI Work Kit personnel
        ↓
4. SEMAINE ACTUELLE (lundi, ressources programmées)
   Le thème de la semaine est visible ; les autres semaines ne le sont pas encore
        ↓
5. COURS
   Ouvre le lien de la présentation HTML (URL https stable) → la présentation charge
        ↓
6. PRATIQUE
   Suit la séance live (Meet, lien épinglé) → utilise les prompts du dock [R]
        ↓
7. AI WORK KIT
   Complète le volet de la semaine (rappel dans le post de ressources)
        ↓
8. MISSION (jeudi 21h, devoir programmé)
   Consigne claire → applique sur son travail réel
        ↓
9. DÉPÔT (lundi 23h59)
   Dépose sur Classroom (capture, document ou lien)
        ↓
10. FEEDBACK (mardi suivant)
    Commentaire du formateur + mise à jour du suivi (jalon validé / à revoir)
        ↓
11. SEMAINE SUIVANTE
    Les nouvelles ressources apparaissent ; les précédentes restent consultables
    ... jusqu'à la S8 → Soutenance → Certification → Alumni (J+7/J+21/J+30)
```

## 2. Le parcours formateur (préparation + séance)

```
PRÉPARATION
Course Hub → 18 modules / 8 semaines → stats → Dashboard Formateur
        ↓
SÉANCE (110 min)
Sélection du module → Timer 110 min → ▶ Lancer le cours (présentation)
→ Notes formateur (objectif/arguments/transition) → Prompts du module
→ Mission à donner → Work Kit → Accès Meet / Classroom
        ↓
APRÈS SÉANCE
Collecte des remises (lundi 23h59) → Tableur de cohorte (jalons)
→ Préparation des semaines suivantes (tout est déjà programmé dans Classroom)
```

## 3. Vérification automatique (à chaque release)

| Test | Script | Couvre |
|---|---|---|
| Cohérence transversale | `npm test` | 91 checks (unicité, Work Kit, missions, progression, design) |
| QA structurelle | `npm test` | 18/18 modules (JS valide, branding, slides, prompts) |
| QA navigateur formateur | `npm run test:browser` | 432 tests (navigation, notes, dock, copie, mobile) |
| Version publique apprenants | `npm run build:public` + `test:public` | 72 tests (chargement, navigation, aucune trace formateur) |
| Parcours apprenant | `npm run test:parcours` | 13 checks bout-en-bout (J0 → S1 → prompts → mobile) |
| Parcours formateur | `npm run test:formateur` | 21 checks (hub, dashboard, timer, notes, prompts, liens) |
| Kit Classroom | `npm run check:classroom` | 9 checks (18 modules, 8 semaines, 8 devoirs, thèmes) |

**Total : 553+ checks automatisés.** Un seul échec bloque la release.

## 4. Vérification manuelle avant chaque cohorte (15 min)

- [ ] `npm run release` → tout est vert
- [ ] Ouvrir l'URL hébergée `https://<org>.github.io/<repo>/` → l'index liste les 18 modules
- [ ] Ouvrir un module en mobile → pas de débordement, navigation OK
- [ ] Dans Classroom (brouillon formateur) : vérifier les 8 semaines programmées + 8 devoirs
- [ ] Vérifier que le Thème 00 est publié et épinglé
- [ ] Tester le lien Meet + le formulaire d'inscription
- [ ] Dupliquer les Work Kits pour les apprenants inscrits

## 5. Définitions de done

**Un module est READY quand** :
- [ ] `npm run build:presentations` (ou manuel) → présentation générée
- [ ] `npm test` : le module passe les checks de cohérence
- [ ] `npm run test:browser` : 24/24 tests navigateur
- [ ] `npm run build:public` : la version publique est régénérée
- [ ] Le kit Classroom référence la bonne URL (vérifié par `check:classroom`)

**La cohorte est READY quand** :
- [ ] Release gate vert
- [ ] Public déployé (URLs HTTPS stables)
- [ ] Classroom créée (13 thèmes, posts programmés)
- [ ] Onboarding prêt (email + checklist)
- [ ] Work Kits dupliqués
- [ ] Pilote interne réalisé (1-3 utilisateurs)
