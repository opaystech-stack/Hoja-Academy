# 🏛️ Architecture Multi-Cohortes — Académie OPAYS

> **Comment lancer Cohorte 02, 03… sans reconstruire l'Academy.**
> *Le système est conçu pour être réutilisable : une cohorte = une classe Classroom + un kit généré + un tableur de suivi. Rien d'autre.*

---

## 1. Ce qui est partagé (une seule fois, jamais dupliqué)

| Ressource | Emplacement | Pourquoi |
|---|---|---|
| Les 18 modules + présentations HTML | `modules/` | Le contenu pédagogique est **universel** (toutes cohortes) |
| Les 72 fiches | `modules/XX/*.md` | Idem |
| Le registre central | `data/modules.js` | Source unique des métadonnées |
| Course Hub + Dashboard Formateur | racine | Outils du formateur, toutes cohortes |
| Le template AI Work Kit | `systeme-operationnel/TEMPLATE_MON_AI_WORK_KIT.md` | Dupliqué par apprenant à chaque cohorte |
| Le blueprint Classroom | `docs/classroom/BLUEPRINT_CLASSROOM.md` | Architecture de diffusion |
| Le pipeline de tests | `scripts/` + `npm test` | Contrôle qualité avant chaque cohorte |

## 2. Ce qui est créé par cohorte (léger, reproductible)

```
docs/cohortes/cohorte-XX/
├── kit-lancement-<date>.md      ← généré (node scripts/generate_classroom_posts.js <date>)
├── email-bienvenue.md           ← personnalisé depuis docs/onboarding/EMAIL_BIENVENUE.md
├── suivi-cohorte.csv            ← copie du template SUIVI_COHORTE_TEMPLATE.csv
└── notes-formateur.md           ← journal de bord de la cohorte (optionnel)
```

**En plus, dans Google Classroom** :
- 1 classe « OPAYS Academy — Cohorte N°XX » (code OPAYS-XX)
- 13 thèmes (structure identique — voir blueprint)
- 1 copie du Work Kit par apprenant

## 3. La procédure de lancement (Cohorte N+1 — 30 minutes)

1. **Vérifier l'intégrité du contenu** : `npm run release` (build registre + cohérence + tests navigateur).
2. **Générer le kit** : `node scripts/generate_classroom_posts.js <lundi-début> --out docs/cohortes/cohorte-XX`
3. **Créer la classe** : Classroom → « OPAYS Academy — Cohorte N°XX » → code OPAYS-XX.
4. **Créer les 13 thèmes** (structure du blueprint).
5. **Copier les posts** du kit dans Classroom (ressources programmées lundi 06h00, devoirs jeudi 21h00).
6. **Réutiliser les posts de la cohorte précédente** (option « Réutiliser » de Classroom) puis ajuster les dates.
7. **Dupliquer le Work Kit** : 1 copie par apprenant dans Drive.
8. **Suivre la checklist d'onboarding** : `docs/onboarding/CHECKLIST_ONBOARDING.md`.

> 💡 **Astuce** : la classe de la Cohorte 01 devient le **modèle** (Archive → Réutiliser) pour la Cohorte 02. Classroom conserve toute la structure ; il suffit d'ajuster les dates de programmation.

## 4. Le rythme de maintenance du contenu (entre cohortes)

| Quand | Action | Script |
|---|---|---|
| Avant chaque cohorte | Audit complet | `npm run release` |
| Modification d'un module | Régénérer (sauf M16/M18 protégés) | `npm run build:presentations` |
| Nouveau module / changement de métadonnées | Mettre à jour le registre | `node scripts/build_registry.js` |
| Nouvelle version d'une fiche | Remplacer le fichier MD | — (git track) |

## 5. Règles d'or

- **Ne jamais modifier le curriculum pour une cohorte** : les 18 modules sont le socle.
- **Ne jamais dupliquer de contenu dans une classe** : tout lien pointe vers `modules/` (ou Drive partagé).
- **Une cohorte ne touche jamais au code** : elle consomme le système.
- **Chaque cohorte est archivée** à J+30 (post-formation) pour garder Classroom lisible.
