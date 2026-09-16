# 🤖 Architecture Hermes — Évaluation Multi-Bots pour l'Académie OPAYS

> **Décision d'architecture : MONO-AGENT + automatisation par scripts.**
> *Analyse complète de l'hypothèse « 3 bots » (Pédagogique, Contenu, QA) et de ce qui apporte réellement de la valeur.*

---

## 1. L'hypothèse initiale : 3 bots spécialisés

| Bot | Responsabilités proposées | Réalité du projet |
|---|---|---|
| 🧠 Pédagogical Agent | Vérifier cohérence pédagogique, objectifs, exercices, missions | Le test `test_coherence.js` vérifie DÉJÀ 91 points (concepts, Work Kit, missions, progression, unicité) en 1 seconde |
| 🎨 Content Agent | Générer/mettre à jour les HTML, design system, prompts | Le pipeline `data → presentation_template.js → build_all_presentations.js` est DÉJÀ automatisé et déterministe (0 IA nécessaire) |
| 🧪 QA/Release Agent | Lancer les tests Chrome, liens, boutons, comparer versions, bloquer la release | `test_browser_real.js` (432 tests Chrome) + `npm run release` font DÉJÀ tout ça, avec blocage réel (exit code ≠ 0) |

## 2. Ce que les scripts font déjà (et que les bots ne feraient pas mieux)

- **Vérification de cohérence** : 91 checks déterministes — un LLM serait MOINS fiable (hallucinations, non-déterminisme).
- **QA navigateur** : 432 tests réels dans Chrome — un agent ne peut pas faire mieux qu'un script déterministe.
- **Génération HTML** : le template est un générateur déterministe — un LLM introduirait des variations incontrôlées et casserait le design system.
- **Blocage de release** : `npm run release` sort un code d'erreur ≠ 0 si un test échoue (chaîne `&&`).

## 3. Où un agent Hermes apporterait RÉELLEMENT de la valeur

| Tâche | Gain réel | Outil recommandé |
|---|---|---|
| **Génération de NOUVEAU contenu pédagogique** (nouveau module, nouvelle fiche) | Élevé — c'est une tâche de rédaction LLM | Un agent Hermes à la demande (pas un bot permanent) |
| **Revue pédagogique sémantique** (les objectifs des guides sont-ils réellement couverts par les slides ?) | Moyen — les mots-clés ne suffisent pas toujours | Un agent à la demande avant chaque cohorte |
| **Audit pré-cohorte complet** (release + liens + contenu) | Moyen — déjà 95 % automatisé | Un **cron Hermes** hebdomadaire (optionnel) |
| **Maintenance continue entre cohortes** | Faible — le contenu est stable, les scripts suffisent | Rien |

## 4. Conclusion : MONO-AGENT, pour 4 raisons

1. **La valeur n'est pas dans l'orchestration** : les étapes critiques (QA, build, cohérence) sont déterministes. Un bot qui « lance les tests » ne fait que wrapper une commande déjà écrite.
2. **Le coût d'un bot permanent** : maintenance, contexte, erreurs d'interprétation — pour zéro gain sur des scripts fiables.
3. **La règle du projet** (consigne utilisateur) : « pas de bots décoratifs », « architecture simple et robuste ».
4. **Le vrai besoin** (génération de contenu) est **ponctuel et créatif** : on fait appel à l'agent Hermes principal (cette session) quand un nouveau module est demandé — pas à un bot résident.

## 5. Ce qui est implémenté à la place (simple, robuste)

```
┌────────────────────────────────────────────────────────────────┐
│  npm run release  (une commande = un release gate complet)     │
│                                                                │
│  1. build:registry   → normalise data/modules.js               │
│  2. npm test         → test_coherence (91 checks)              │
│                      + verify_all_presentations (18/18)        │
│  3. test:browser     → 432 tests Chrome réels                  │
│  ─── Si un échec → exit code ≠ 0 → release BLOQUÉE ───        │
└────────────────────────────────────────────────────────────────┘
```

**Les 3 rôles de l'hypothèse existent donc — mais sous forme de scripts déterministes, pas de bots.**

## 6. Évolution possible (documentée, non implémentée)

- **Cron hebdomadaire Hermes** (optionnel, Cohortes 02+) : un job qui lance `npm run release` chaque lundi 06h00 et alerte le formateur sur Telegram/WhatsApp si la release échoue. → *À activer quand une cohorte est en cours.*
- **Agent de génération de module** : quand un Module 19+ sera demandé, l'agent principal rédigera les données (data_modules), régénérera via le pipeline, puis passera le release gate. Le pipeline garantit la conformité (design system, structure, tests).

## 7. Rôles & responsabilités (version finale — pas de bot décoratif)

| Rôle | Titulaire | Quand |
|---|---|---|
| Pédagogie & curriculum | AGENT.md + docs `systeme-operationnel/` | En continu (source de vérité) |
| Production HTML | `build_all_presentations.js` (déterministe) | À la demande (`npm run build:presentations`) |
| QA & Release | `npm test` + `test_browser_real.js` | Avant chaque cohorte / chaque modification |
| Génération de contenu nouveau | Agent Hermes principal (cette session) | À la demande (rédaction LLM) |
| Diffusion Classroom | Kit généré + formateur (copier-coller) | J-5 avant chaque cohorte |
| Suivi apprenants | Tableur de cohorte (docs/cohortes) | Hebdomadaire |
