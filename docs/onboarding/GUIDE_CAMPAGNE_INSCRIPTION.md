# 📣 Guide de Campagne & Inscription — Académie OPAYS

> **Le flux complet : campagne → inscription → accès Classroom → Jour 1.**
> *Simple, robuste, sans usine à gaz : un formulaire, un email, une classe.*

---

## 1. Le flux en 6 étapes

```
1. CAMPAGNE        → posts réseaux sociaux + page vitrine (offre, dates, prix, lien)
2. INSCRIPTION     → formulaire (Google Forms) : nom, email, métier, organisation, motivation
3. CONFIRMATION    → email auto (Google Forms → notification) + paiement/accord
4. BIENVENUE J-5   → email manuel : lien Classroom + code + calendrier + checklist (docs/onboarding/EMAIL_BIENVENUE.md)
5. ONBOARDING      → checklist J-10→J0 (docs/onboarding/CHECKLIST_ONBOARDING.md)
6. JOUR 1 (lundi)  → ressources S1 visibles (programmées) → Séance 01 mardi 18h30 sur Meet
```

## 2. Les supports de campagne (à créer par l'équipe com')

| Support | Contenu minimum | Format |
|---|---|---|
| Visuel principal | « L'IA pour les Professionnels » • 8 semaines • 16 séances live • certificat | Image (voir skills Virunga pour le pipeline visuel) |
| Publication réseau | Offre, dates de la cohorte, lien formulaire | Texte + visuel |
| Page d'atterrissage | Programme (4 blocs), format, prix, FAQ, bouton « Je m'inscris » | HTML statique (modèle possible à partir du design OPAYS) |
| Formulaire d'inscription | Nom • Email • Métier • Organisation • Motivation • Attentes | Google Forms |
| Email de confirmation | Merci + ce qui se passe ensuite + date de début | Email |

## 3. Le formulaire d'inscription (Google Forms — 5 champs)

1. **Nom complet** (réponse courte)
2. **Email** (réponse courte — doit être exact, c'est lui qui reçoit l'invitation)
3. **Métier / Fonction** (réponse courte)
4. **Organisation** (réponse courte)
5. **Pourquoi cette formation ?** (paragraphe — 3 lignes max)

> **Réglage Forms** : collecter les emails → « Réponse automatique » envoyée à chaque inscription
> (message de confirmation + mention « Vous recevrez votre invitation Classroom à J-5 »).

## 4. Le texte de confirmation automatique (à coller dans Forms)

> ✅ **Inscription confirmée — Académie OPAYS !**
>
> Merci `[Prénom]` ! Votre place pour la cohorte est réservée.
>
> **Ce qui se passe maintenant** :
> - **J-5** : vous recevez votre invitation à Google Classroom + le guide de bienvenue
> - **J-2** : pensez à remplir votre Diagnostic Initial (5 min)
> - **J0** : vérification technique (micro, caméra, Meet)
> - **Lundi de la semaine 1** : la formation commence — vos ressources seront déjà prêtes
>
> En attendant, assurez-vous d'avoir accès à au moins un outil IA (ChatGPT, Claude ou Gemini).
>
> Questions ? Répondez à cet email.

## 5. FAQ express (pour la page d'atterrissage)

| Question | Réponse |
|---|---|
| À qui s'adresse la formation ? | Professionnels en activité : cadres, dirigeants de PME, RH, chefs de projet, directeurs financiers. **Zéro prérequis technique.** |
| Combien de temps ? | 8 semaines, 2 séances live/semaine (mardi & jeudi 18h30-20h30) + permanence samedi 10h. |
| C'est pratique ou théorique ? | 100 % pratique : chaque séance s'applique à VOTRE travail. Vous repartez avec votre système IA personnel. |
| Que faut-il comme matériel ? | Un ordinateur, une connexion internet, un micro. Les outils IA gratuits suffisent. |
| Comment valider ? | Soutenance pratique finale (10 min) + AI Work Kit complet → **Certificat Pratique OPAYS**. |
| Combien coûte ? | [À définir par l'équipe — tarif unique ou entreprise] |

## 6. Checklist avant le lancement de campagne

- [ ] Date de cohorte fixée (lundi de début) + kit Classroom généré (`npm run classroom:kit`)
- [ ] Formulaire d'inscription créé et testé (5 champs + réponse auto)
- [ ] Email de bienvenue personnalisé (`docs/onboarding/EMAIL_BIENVENUE.md`)
- [ ] Visuels + textes de campagne validés (positionnement : *« l'IA pour les professionnels »*)
- [ ] Classe Classroom créée + 13 thèmes + posts programmés (blueprint)
- [ ] Work Kits dupliqués pour le nombre de places (10-15)
- [ ] Crédit Meet / compte Google du formateur vérifié
- [ ] `npm run release` vert (release gate complet)
- [ ] ✅ CAMPAGNE PRÊTE À PUBLIER

## 7. Règle d'or

**Une inscription = un email de confirmation + une invitation Classroom à J-5.**
Pas de plateforme supplémentaire, pas de compte à créer ailleurs : Google Forms + Gmail + Classroom.
L'apprenant n'a qu'UNE chose à retenir : **tout est dans Classroom, Thème 00.**
