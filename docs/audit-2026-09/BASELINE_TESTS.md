# BASELINE DES TESTS — ÉTAPE 3

> Date : 2026-09-16 · avant toute modification
> But : figer l'état de référence pour détecter toute régression future.

## Résultats mesurés

| Suite | Commande | Résultat | Statut |
|---|---|---|---|
| Cohérence transversale | `npm test` (partie 1) | **91 / 91 checks · 0 issue** | ✅ PASS |
| QA structurelle présentations | `npm test` (partie 2) | **18 / 18 modules PASS** | ✅ PASS |
| Tests navigateur réels (Chrome) | `npm run test:browser` | **430 / 431** | ⚠️ 1 échec pré-existant |
| Version publique (apprenants) | `npm run test:public` | **72 / 72 · 0 trace formateur** | ✅ PASS |
| E2E rôles / API / Classroom | `node scripts/test_e2e_2b.js` | 63/63 (dernier run `e2e_result.txt`) | ✅ PASS |

## Échec pré-existant à noter

```
Module 09 :
  - Dock ressources: s'ouvre
```

**1 test échoue déjà AVANT toute modification** (Module 09 — ouverture du dock ressources).
Ce n'est **pas** une régression de notre fait : c'est l'état de départ.
À traiter pendant la phase UI (Étape 6/8), pas à masquer.

## Environnement

- Node : `C:\Users\lamsa\.workbuddy-ai\binaries\node\versions\22.22.2-1\node.exe`
- Chrome : `C:\Program Files\Google\Chrome\Application\chrome.exe`
- `puppeteer-core` installé (`node_modules/puppeteer-core`)
- Les suites navigateur sont longues (> 5 min) → lancer en arrière-plan.

## Suites non branchées dans `npm run release`

`audit_landing_v4.js` · `fix_typography.js` · `check_hub_dashboard.js` · `test_landing_visual.js` ·
`build_landing.js` · `build-bundle.js` — scripts historiques/one-shot, pas dans le gate.

## Règle de non-régression

Après chaque unité de travail, re-jouer : `npm test` puis `npm run test:browser` + `test:public`.
**Aucun PASS ne doit être obtenu en désactivant un test.**
