# 🧪 Pilote interne — Cohorte 01 (test avec 1-3 utilisateurs)

> **Objectif** : simuler une vraie cohorte avec 1 à 3 « faux apprenants » pour valider le système
> AVANT d'investir dans une campagne marketing. Le pilote suit exactement le Golden Path.

---

## 1. Qui participe

| Rôle | Personne | Actions |
|---|---|---|
| Apprenant A | (membre équipe) | Suit le parcours complet en Semaine 1-2 comme un vrai apprenant |
| Apprenant B | (membre équipe) | Idem, sur mobile de préférence |
| Formateur | (Fénelon / formateur désigné) | Conduit les séances avec le dashboard, collecte, note |
| Observateur | (membre équipe) | Note les frictions, les incompréhensions, les bugs |

## 2. Préparation du pilote (1 journée)

1. [ ] Créer une **classe pilote** « OPAYS Academy — Pilote interne » (code PILOT-00)
2. [ ] Créer les 13 thèmes (copier la structure du blueprint)
3. [ ] Générer le kit : `npm run classroom:kit <date-pilote> --out docs/classroom/posts/pilote` (base URL auto : course.opays.io)
4. [ ] Copier les posts des **semaines 1 et 2 seulement** (programmés comme en réel)
5. [ ] Publier le Thème 00 (bienvenue, Meet, diagnostic, Work Kit)
6. [ ] Dupliquer 3 Work Kits (Apprenant A, B, observateur)
7. [ ] Envoyer les emails de bienvenue (avec les vrais liens pilote + identifiants apprenant : `apprenant` / mot de passe cohorte)

## 3. Déroulement du pilote (2 semaines)

### Semaine pilote 1
- [ ] **Lundi** : vérifier que les ressources S1 sont visibles (programmées)
- [ ] **Mardi** : séance 1 en réel (Meet + présentation M01 + dashboard + timer)
- [ ] **Jeudi** : séance 2 (M02 + M03) → devoir 1 publié à 21h
- [ ] **Samedi** : permanence déblocage (facultatif)
- [ ] **Lundi 23h59** : Apprenants A & B déposent leur devoir 1
- [ ] **Feedback** : formateur note le jalon 1 dans le tableur

### Semaine pilote 2
- [ ] **Lundi** : vérifier que S2 apparaît et que S1 reste consultable
- [ ] **Mardi/Jeudi** : séances 3 et 4
- [ ] **Fin de semaine** : clôture du pilote + debrief

## 4. Critères de validation du pilote

| Critère | Verdict attendu |
|---|---|
| L'apprenant comprend quoi faire en arrivant (Thème 00) | ✅ sans aide |
| Les ressources S1 sont visibles, S2 pas encore | ✅ Just-in-Time |
| La présentation M01 charge sur desktop ET mobile | ✅ |
| Le prompt se copie | ✅ |
| Le Work Kit se complète | ✅ sans confusion |
| La mission se comprend et se dépose | ✅ |
| Le formateur conduit la séance sans chercher ailleurs | ✅ |
| Aucun contenu formateur accessible à l'apprenant | ✅ |

**Si un critère échoue** → corriger, retester, puis relancer le pilote sur la partie concernée.

## 5. Debrief (questions à poser aux pilotes)

1. « En arrivant sur Classroom, savais-tu quoi faire ? »
2. « Qu'est-ce qui t'a semblé compliqué ou inutile ? »
3. « As-tu trouvé les ressources de ta semaine facilement ? »
4. « Le AI Work Kit : as-tu compris quoi remplir et quand ? »
5. « Sur mobile, tout fonctionnait ? »
6. « Qu'aurais-tu aimé avoir en plus ? »

## 6. Après validation du pilote

- [ ] Archiver la classe pilote
- [ ] Mettre à jour ce document avec les leçons apprises
- [ ] Lancer la **vraie** Cohorte 01 (même procédure, classe réelle)
- [ ] La campagne marketing peut commencer

> ⏱️ **Durée estimée du pilote** : 2 semaines (1 semaine de préparation + 2 semaines de test, en parallèle possible)
