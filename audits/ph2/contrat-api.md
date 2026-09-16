# CONTRAT API — Hoja Academy Phase 2B (gateway `course.opays.io`)
Version 1 — 2026-09-09. Toute page statique (campus apprenant, suivi formateur, cockpit admin) se conforme strictement à ce contrat. Aucune donnée simulée : chaque endpoint renvoie des données réelles Classroom ou des états vides explicites.

## Authentification
- **Hérité (conservé, non cassé)** : Basic Auth admin (même realm que nginx) → rôle `admin`. Scripts existants inchangés.
- **Nouveau** : session cookie `hojad` (HttpOnly, SameSite=Lax) obtenue par `POST /api/login`. Comptes dans `/data/users.json` (scrypt, hors Git). Rôles : `admin` > `formateur` > `apprenant`.

| Endpoint | Auth | Réponse |
|---|---|---|
| `POST /api/login` {email, password} | public | 200 `{ok, role, name}` + Set-Cookie · 401 `{error}` |
| `POST /api/logout` | session | 204 |
| `GET /api/whoami` | session ou Basic | `{role, name, email}` · 401 |
| `GET /authz` (subrequest nginx `X-Original-URL`) | cookie/Basic | 200 / 401 — pour protégé par SESSION nginx (mode `AUTH_MODE=session`, sinon htpasswd inchangé) |

## Données réelles (lecture)
| Endpoint | Rôles | Données (réelles ou vides) |
|---|---|---|
| `GET /api/classroom/status` | form+admin | `{connected, scopes[], account}` (existant, enrichi compte) |
| `GET /api/classroom/coursework?courseId` | form+admin | `{coursework:[{id,title,state,dueDate,maxPoints,topicId}]}` — GET nouveau (le POST existant est inchangé) |
| `GET /api/classroom/submissions?courseId[&courseWorkId]` | form+admin | `{submissions:[{courseWorkId,studentEmail,name,state,draft?,turnedIn?,returned?,graded?,rawGrade?,createTime,updateTime}]}` via `studentsCourses/{cwId}` (scope `classroom.coursework.students` DÉJÀ accordé) |
| `GET /api/roster` | form+admin | `{learners:[{name,email,joinedClassroom:boolean,lastSeen}]}` — union users.json (rôle apprenant) ∩ students Classroom réels |
| `GET /api/progress` | form+admin | `{rows:[{email,name,missions:[{title,state,graded}],done,total,late}]}` matrice mission×apprenant — dérivée 100 % des submissions réelles |
| `GET /api/me` | session apprenant | `{identity, modules:[{num,title,week,seance,done,available}], classroom:{joined,courseId,url}, missions:[{courseWorkId,title,dueDate,state:assigned\|submitted\|returned\|graded,feedback,url}], next:{type:module\|mission\|session, label}, empty:[]}` — dérivé du registre modules.js + Classroom réel |

## Écriture (opérations réelles, jamais simulées)
| Endpoint | Rôles | Garde |
|---|---|---|
| `POST /api/roster/import` {learners:[{name,email}]} | admin | valide emails, crée comptes `apprenant` + mot de passe initial fort renvoyé UNE fois, statut `importé` (pas « invité ») |
| `POST /api/roster/invite` | admin | ⚠️ exige scope `classroom.rosters` (write) NON présent aujourd'hui → renvoie honnêtement `{error:"re-consentement OAuth requis"}` tant que le scope manque. Pipeline prêt, bloqué action humaine. |
| `POST /api/classroom/coursework` (existant) | admin | inchangé (gate ALLOW_CLASSROOM_WRITE) |
| `POST /api/feedback` {courseWorkId, studentEmail, comment, grade} | form+admin | gate écriture ; POST Classroom `studentWork/modifyGrade` + commentaire announcement — seulement si écriture activée, sinon 403 honnête |

## États d'une mission (vocabulary UI, dérivés Classroom, jamais inventés)
`assigned` = « Mission à faire » · `submitted` = « Déposé » · `returned` = « En correction/À refaire » (selon rawGrade) · `graded` = « Validé » · absent = « À venir ».

## Règles UI obligatoires (règle des 5 minutes)
1. Chaque écran apprenant affiche en tête : « Où je suis » (module/semaine), « Ma prochaine action » (mission en cours avec échéance + lien dépôt), « Progression » (n/N valide = nombre de `graded` réels).
2. Données absentes → bloc `EMPTY STATE` (classe vide : « 0 apprenant — aucune cohorte peuplée. Prochaine étape : importer le roster. ») jamais 0%/spinner éternel.
3. Les pages appellent les APIs en `credentials:'include'` (session cookie), jamais Basic manuel.
4. Mobile-first : pas d'overflow horizontal, zones tactiles ≥ 44px, tableaux → cartes empilées ≤ 640px.
5. Aucune requête croisée formateur→contenu apprenant privée ; le formateur ne voit que l'API (pas de data-note).

## Verrouillages sécurité backend
- Chaque handler appelle `requireApi(req, [roles])` (Basic admin legacy OU session au rôle). 403 structuré `{error}`.
- `POST /api/login` : anti-brute-force (5 tentatives/IP/10 min → 429), timing-safe compare, cookie `Secure` si X-Forwarded-Proto=https.
- `users.json`, sessions, hashes : JAMAIS exposés par un endpoint. `whoami` ne renvoie jamais de hash.
- Sessions en mémoire avec TTL 12 h ; `POST /api/logout` invalide.


## DECISION ARCHITECTURE (P2B-1, 09/09) — « coquilles publiques, données verrouillées API »
- Enforcement reel = **cote serveur** : chaque endpoint de donnee appelle roleFromReq() (session cookie 'hojad' scrypt OU Basic admin legacy). Un apprenant qui ouvre /ui/suivi/ par accident ne recoit AUCUNE donnee (403 JSON) : la page est une coquille vide sans information privee.
- `/admin/` (Basic Auth nginx) reste INCHANGE : presentations completes + hub legacy pour le compte admin partage. Les nouvelles pages staff sont hors zone Basic (/ui/...), accessibles via session.
- `ui/login/` = form publique POST /api/login ; redirection par role. `ui/campus/` (apprenant), `ui/suivi/` (formateur), `ui/cockpit/` (admin).
- Anti brute-force login : 5 tentatives/IP/10min -> 429. Cookie HttpOnly+SameSite=Lax(+Secure si https). Sessions memoire TTL 12h ; /api/logout invalide.
- TEST DATA vs PRODUCTION : les comptes users.json reels sont crees UNIQUEMENT via /api/roster/import ou /api/users avec la VRAIE liste fournie par l'humain. Le test automatisé utilise un USERS_FILE temporaire + Classroom mock (fichier tests/, jamais /data).
