# P2B-17 — Matrice de renommage espace privé OPAYS → HOJA
Générée par scan des SOURCES (les builds admin//public/ sont exclus : régénérés). Le **domaine ne change pas** : `course.opays.io` reste l'hébergeur (hosting Opays Tech), seul le **nom de marque visible** devient HOJA ACADEMY.

## Règle de classification
| Catégorie | Occurrences | Fichiers | Action | Statut |
|---|---|---|---|---|
| **Marque visible (UI)** | `<title>` ×6, `brand-text` ×2, footer © ×2 | course-hub.html, formateur-dashboard.html, build_landing.js, build_public.js, classroom-admin template | → **HOJA ACADEMY** | **À valider par toi** (remplacement trivial + rebuild) |
| **Realms d'authentification** | 4 | deploy-vps-academy.sh (nginx `auth_basic "…"`), gateway server.js (`realm=`) | Popup de login. ⚠️ doivent rester ASCII et nginx/gateway IDENTIQUES. → « HOJA ACADEMY - Espace formateur » / « … apprenants » | **À valider** (impact : le navigateur redemande le mot de passe aux sessions existantes) |
| **Nom de classe Classroom + form** | 1 classe (`OPAYS Academy — Cohorte 01`), 1 Google Form | via gateway `/api/classroom/update` (PATCH, gate écriture) | Renommage Google = opération LIVE | **Action humaine GO** (écrit dans le vrai Classroom) |
| **Éditeur légal** | aucune (AI VENTURE/ES déjà retirés Phase 1) | mentions légales site vitrine | NE PAS INVENTER — « HOJA ACADEMY, info@hoja-academy.com, législation applicable » déjà en place | ✅ rien à faire (blocage juridique séparé, hors produit) |
| **Variables techniques** | 9 (`OPAYS_MODULES`, `OPAYS_COHORTE`) | hub, dashboard, data/*.js | **CONSERVER** — identifiants JS internes invisibles ; les renommer = risque de casser 4 consumers pour zéro gain utilisateur | ⚫ garder |
| **Commentaires de code** | 9 | partout | **CONSERVER** (interne) ou renommage cosmétique optionnel plus tard | ⚫ garder |
| **Domaine / contacts techniques** | 5 (`course.opays.io`, `opaystech@…`) | deploy, gateway, cohorte.js | **CONSERVER explicitement** (contrainte : le domaine admin ne change pas) | ✅ garder |

## Verdict
Vraies décisions de renommage = **3 groupes seulement** : (1) textes visibles UI (~10), (2) realms auth (~4, avec effet « redemande le mot de passe »), (3) classe Classroom + form (1+1, écriture Google live). Le reste = technique à conserver.
**Recommandation** : groupe 1+2 = remplacement ciblé aux sources + `build_admin`/`build_public`/redeploy (1 session), déclenché sur ton GO groupe 3 en même temps (évite deux redéploiements). Aucune occurrence « Académie OPAYS » ne doit subsister dans le HTML rendu des espaces privés après passe.

> Je n'ai RIEN renommé pour l'instant (consigne §17 : matrice d'abord). En attente de ton GO et de la forme exacte (HOJA ACADEMY partout ? le « / LEARN AI » baseline conservé ?).
