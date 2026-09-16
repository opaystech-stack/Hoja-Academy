# Audit PH2 — GOOGLE CLASSROOM — état réel (sans simulation)
**Date** : 2026-09-09 · **Méthode** : audit code (lecture seule) par périmètre + **vérifications LIVE read-only par l'orchestrateur** via le gateway authentifié (les appels live ont été faits par l'orchestrateur uniquement, jamais par le subagent). Rédigé par l'orchestrateur après échec 429 de SA-CLASSROOM à son 5ᵉ appel.

## 1. Ce qui est branché et fonctionne
| Élément | Vérification live | État |
|---|---|---|
| OAuth Google (flux complet) | `/oauth/start` → 302 vs accounts.google.com avec state nonce CSRF | 🟢 |
| Compte connecté | token actif, profil = `opaystech@gmail.com` (compte admin OPAYS Academy) via `/api/gmail/profile` | 🟢 |
| Gateway auth | toutes routes `/api/*` → 401 sans Basic Auth ; realm identique nginx = pas de double popup | 🟢 |
| Classe liée | `875777175545` — « OPAYS Academy — Cohorte 01 » — état ACTIVE, section/room personnalisés | 🟢 connectée |
| Écran admin `admin/classroom.html` | fetch réels `/api/classroom/status|courses|students` (pas de données simulées ; placeholders `—` ; bouton Actualiser **cassé `loadAll()` → corrigé par l'orchestrateur le 09/09, voir fixes admin.md**) | 🟢 |
| Forms | 1 formulaire réel : « Inscription — OPAYS Academy — Cohorte 01 » | 🟢 |
| Gate écritures | `ALLOW_CLASSROOM_WRITE=1` requis + Basic Auth admin (4 routes) ; défaut = écritures désactivées | 🟢 |

## 2. FINDING CENTRAL : la classe est connectée mais VIDÉ
Live (GET via gateway, 09/09) : **0 students, 0 coursework, 0 topics, 0 événements calendar**.
→ Le kit Classroom produit par `scripts/generate_classroom_posts.js` + `docs/classroom/posts/` (posts/topics/devoirs par module, `npm run check:classroom` ✅) **n'a jamais été poussé dans Google Classroom**. La synchronisation existe en code (POST topics/coursework/materials/announcements, invitations) mais aucune exécution UI ne l'a déclenchée ; tout est resté manuel… et en fait non fait.
→ Conséquence produit : aujourd'hui le parcours apprenant réel (inscriptions, devoirs, dépôts) ne peut pas exister dans Classroom : personne n'y est invité et il n'y a aucun devoir à rendre.

### Étapes minimales pour peupler (NE RIEN SIMULER — à valider/exploiter par l'humain)
1. Inviter les apprenants (le gateway n'a PAS d'endpoint d'invitation — l'ajouter ou inviter depuis Classroom UI). ⚠️ trou de capacité documenté, pas inventé.
2. `generate_classroom_posts.js` → les posts existent ; créer un endpoint d'import (POST topics + courseWork + materials en séquence, gate ALLOW_CLASSROOM_WRITE=1) puis l'exécuter une fois la classe peuplée.
3. Reconnexion OAuth nécessaire si les scopes sont réduits (voir sécurité M-4).

## 3. Écarts documentés (code vs réalité)
- `server.js:5-11` promet « **lecture seule** (courses + rosters) » mais SCOPES (`:47-58`) = écriture topics/coursework/announcements/materials + **gmail.send** + **calendar** (écriture) + forms.responses + drive.metadata. Le footer de `admin/classroom.html` répète la promesse fausse (read-only). → cohérence à rétablir (soit réduire les scopes, soit corriger la doc — décision client).
- Nom de classe = **« OPAYS Academy — Cohorte 01 »** (et le form d'inscription). → **DÉCISION RENOMMAGE client** (identique à la décision admin.md §4) ; un PATCH `/api/classroom/update` existe pour le faire proprement, ne pas le faire sans go.
- `/oauth/health` attendu par la doc d'ARCHITECTURE → 404 ; la route réelle est `/health` (publique, `{ok:true}` sans donnée sensible). Mineur.
- `ALLOWED_ADMIN_EMAILS` : le déploiement (`set-allowed-admin-email.sh`) a fixé opaystech@gmail.com ; un re-deploy sans cette variable retomberait en mode « premier compte accepté » (voir sécurité M-2).
- Calendrier : le gateway sait créer/lister les events Meet (routes calendar) — `cohorte.js` contient meetUrl/classroomUrl réels mais **aucun event n'est créé** (live: events=0) : le rituel des sessions 2×/semaine n'est pas encore automatisé.

## 4. Verdict Classroom
🟢 Intégration technique réelle et saine (OAuth, API, auth, gates) — ⚫ **vide opérationnel** : le produit ne s'appuie pas encore sur Classroom ; c'est le prochain chantier prioritaire (peuplement + invitations + suivi dépôts), sans inventer de donnée.
