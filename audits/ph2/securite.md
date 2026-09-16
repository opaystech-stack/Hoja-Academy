# Audit PH2 — SÉCURITÉ & PERMISSIONS — Hoja Academy
**Date** : 2026-09-09 · **Méthode** : lecture seule du code (deploy/, scripts/, gateway) + sondes HTTP live read-only par l'orchestrateur. Aucun secret reproduit (masqués ***). Ce rapport a été rédigé par l'orchestrateur après échec 429 du subagent SA-SECURITY.

## Modèle d'accès réel (vérifié live)
| Zone | Contrôle | Vérification |
|---|---|---|
| `/` landing | public | 200 sans auth ✅ (aucun lien vers zones privées) |
| `/modules/*` (apprenant) | Basic Auth nginx `htpasswd-learn` | 401 sans auth ; 200 avec compte apprenant ; **401 avec le compte admin** (cloisonnement bidirectionnel OK) |
| `/admin/*` (formateur) | Basic Auth nginx `htpasswd-admin` | 401 sans auth ; 200 avec admin ; **401 avec le compte apprenant** ✅ |
| `/api/*` gateway | Basic Auth admin (même realm que nginx → creds réutilisés, `server.js:131-134`) | 401 sans auth ✅ ; toutes les routes `/api/` derrière `checkAuth` (`:250-253`) ; tout le reste → 404 strict (`:254`) |
| `/oauth/start`, `/oauth/callback` | publiques **by design** (flux navigateur + callback Google), state CSRF nonce (`:195-200`) | 302 vs Google OK |
| `/health` gateway | publique `{ok:true}` | sans fuite de donnée ✅ |
| Écritures Classroom/Gmail/Calendar | double gate : Basic Auth admin + `ALLOW_CLASSROOM_WRITE=1` (4 routes gateées `:433…`) | défaut = désactivées ✅ |
| Compte Google autorisé à se connecter | `ALLOWED_ADMIN_EMAILS` (refus 403 explicite `:240`) | set via deploy/set-allowed-admin-email.sh — **à revérifier en prod** (voir M-2) |
| 404 strict nginx (`try_files $uri =404`) | pas de fallback landing | ✅ (les fichiers inexistants ne se déguisent pas en 200) |

## Findings par sévérité

### 🔴 CRITIQUE
- **C-1 · Secret apprenant en dur dans un script versionné** — `scripts/test_production_remote.js:28` : `LEARN_PASS = process.env.LEARN_PASS || 'Opays…'` (mot de passe complet du compte apprenant de prod en fallback). Tout détenteur du repo accès à l'espace apprenant. **Recommandation** : passer le mot de passe en paramètre obligatoire (comme ADMIN_PASS qui est lu via env), purger l'historique si le repo est partagé ailleurs, et **rotater LEARN_PASS** à la prochaine release. (ADMIN_PASS, lui, est bien lu via SSH/env, pas en dur.)
- **C-2 · Rôles = 2 niveaux seulement (admin / apprenant), pas de rôle FORMATEUR distinct** — l'espace `/admin/` contient les notes formateur ET les fonctions d'administration de cohorte derrière le MÊME couple de credentials, partagé donc entre tous les formateurs. Un formateur ≠ admin mais accède à tout. **Recommandation** (sans réarchitecture) : générer un `htpasswd-formateurs` multi-utilisateurs pour `/admin/` (nginx `auth_basic_user_file` supporte N lignes), l'admin gardant un compte séparé ; à plus long terme, comptes individuels (voir apprenant.md).

### 🟠 MAJEUR
- **M-1 · `index.html.bak-v3` exposé publiquement** — sauvegarde de l'ancienne landing « OPAYS Academy » servie à `/index.html.bak-v3` (200, 40 Ko, titre visible). Trace identitaire + habitude de backup dans le docroot. **→ DÉJÀ CORRIGÉ par l'orchestrateur le 08/09 (supprimé du VPS, revérifié 404, landing 200).** Reste à : ne plus jamais copier de `.bak` dans `site/` (le `rm -rf $SITE_DIR` du script de deploy le fait déjà ; le fichier venait d'un scp manuel).
- **M-2 · Bootstrap `ALLOWED_ADMIN_EMAILS` vide** — commentaire `server.js:39` : vide = premier compte connecté accepté. Si la variable est retirée/vidée lors d'un re-déploiement, n'importe quel compte Google qui complète le flux OAuth devient le compte « connecté » du gateway. **Recommandation** : rendre `ALLOWED_ADMIN_EMAILS` obligatoire au boot du gateway (exit si vide en PROD), comme CLIENT_ID.
- **M-3 · token.json world-readable dans le volume** — `-rw-r--r-- /data/token.json` (refresh token Google = accès Gmail/Calendar/Classroom en écriture selon scopes). Un autre conteneur du réseau dokploy ou tout process lisant le volume le lit. **Recommandation** : `chmod 600` via umask au writeToken ou chmod dans l'image/entrypoint.
- **M-4 · Scopes Google plus larges que les besoins actuels + doc trompeuse** — l'en-tête de `server.js` promet « lecture seule » alors que le token couvre `gmail.send`, `calendar` (écriture), `classroom.*` (écriture), `drive.metadata`. La classe connectée est vide : ces droits ne servent à rien aujourd'hui mais sont activés. **Recommandation** : réduire les scopes au strict besoin de la semaine courante (courses+rosters+topics), les ré-élargir le moment venu avec re-consentement ; corriger les commentaires + le footer de `admin/classroom.html` qui sous-déclare les permissions réelles.

### 🟡 MINEUR
- **m-1 · Realms d'authentification = ancienne marque** — popups Basic Auth : « Academie OPAYS - Espace formateur » / « Académie OPAYS — Espace apprenants » (nginx + gateway `:132`, l'un des deux doit rester identique entre nginx et gateway pour le partage de creds). Inclus dans la DÉCISION RENOMMAGE client (§ admin.md).
- **m-2 · `dateDebut` cohorte marqué `// TODO_ADMIN`** — donnée morte non câblée (cf. admin.md) ; pas un risque sécurité mais un risque opérationnel au lancement réel.
- **m-3 · Un 3ᵉ conteneur « academy » tourne sur le VPS** (`kiveclair-3n3pks-academy-1`, image Dokploy d'un AUTRE projet, port interne 4321, non exposé) — hors périmètre Hoja, ne rien toucher ; noté pour éviter toute confusion future d'administration.

## Verdict permissions (questions du client)
- Contrôles backend réels ? **OUI** — l'isolation est faite par nginx (routes) et le gateway (Basic Auth par requête), pas par masquage frontend ; le contenu apprenant est physiquement différent (sanitizé au build, 0 data-note vérifié).
- Accès directs URLs/endpoints testés ? admin→/modules 401 ; apprenant→/admin 401 ; /api sans auth 401 ; inconnu 404 strict ✅.
- Ce qui reste à construire : 3ᵉ rôle formateur (C-2), comptes apprenants individuels (périmètre apprenant.md), durcissements C-1/M-2/M-3/M-4.
- **Aucune fonctionnalité existante ne doit être cassée par ces fixes** : C-1/M-2/M-3 sont sans impact UI ; M-4 change les scopes → re-consentement OAuth à planifier (1 reconnexion admin).
