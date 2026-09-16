# P2B-10 — RUNBOOK DE PRODUCTION — Hoja Academy (course.opays.io)
État vérifié le 2026-09-09 (read-only VPS + bundles locaux). **Le domaine ne change pas.**

## 1. Matrice des variables d'environnement (valeurs jamais copiées ici)
### Gateway `/opt/opays-classroom-gateway/.env`
| Variable | Obligatoire | Secret | Prod aujourd'hui | Action au déploiement |
|---|---|---|---|---|
| GOOGLE_CLIENT_ID | Oui | **Oui** | SET | inchangé |
| GOOGLE_CLIENT_SECRET | Oui | **Oui** | SET | inchangé |
| ADMIN_USER / ADMIN_PASS | Oui | **Oui** | SET / SET | inchangés (Basic legacy + bootstrap admin UI) |
| BOOTSTRAP_EMAIL | Non (défaut=ADMIN_USER) | Non | MISSING | optionnel |
| REDIRECT_BASE | Oui | Non | SET | inchangé |
| ALLOWED_ADMIN_EMAILS | Oui | Non | SET | vérifier = opaystech@gmail.com |
| ALLOW_BOOTSTRAP | Non | Non | MISSING | **rester absent/0** (déjà consenti) |
| ALLOW_CLASSROOM_WRITE | Non | Non | MISSING (=0) | **rester 0** tant que le GO peuplement n'est pas donné ; 1 uniquement pendant l'import des devoirs, puis 0 |
| ALLOW_CALENDAR_WRITE | Non | Non | MISSING | idem (sessions Meet) |
| CLASSROOM_COURSE_ID | Phase 2B | Non | MISSING → **mettre 875777175545** | requis pour roster/progress/me |
| CLASSROOM_URL | Phase 2B | Non | MISSING → mettre l'URL de la classe | lien visible apprenant |
| COHORT_START | Non | Non | MISSING | **ne rien mettre tant que la date réelle n'est pas décidée** (UI « À définir ») |
| USERS_FILE | Oui (2B) | Non | MISSING → défaut /data/users.json (OK volume) | — |
| GATEWAY_FIXTURES / GATEWAY_FIXTURE_FILE | **TOUJOURS ABSENTS en prod** | — | absent ✅ | le script E2E refuse de démarrer sans TMP explicite ; le conteneur prod ne définit jamais ces variables |
| TOKEN_FILE / PORT | système | Non | défauts OK | — |

### Site `/opt/opays-academy/.env` : ADMIN_BASIC_PASSWORD SET (inchangé). LEARN_PASS : fourni à chaque `deploy-vps-academy.sh` — **profiter du déploiement pour le ROTATER** (nouvelle valeur choisie par l'humain, jamais dans Git/rapport).

## 2. Persistance
| Fichier | Emplacement | Sauvegarde |
|---|---|---|
| token.json (refresh Google) | volume Docker `opays-classroom-token:/data` (mode 600 ✅ applied) | hors conteneur, survit rebuild |
| users.json (comptes+hashes scrypt) | MÊME volume (USERS_FILE=/data/users.json) | idem ; permission 0600 à l'écriture |
| fixtures.test.json | **repo local uniquement** (jamais dans l'image : Dockerfile ne copie que server.js/identity-api.js/modules.registry.json) ✅ vérifié | — |
| bundle site | /opt/opays-academy/academy-bundle.tar.gz | backup horodaté |

## 3. Rollback — déjà préparé (backups VPS créés, rien supprimé)
Tag : **20260909-1858** dans `/opt/opays-academy/backups/` :
- `site-20260909-1858/` (copie exacte de l'actuel), `gw-server-…js` (md5 1f29d89c… = prod actuel), `gw-env-…` (0600), `bundle-…tar.gz`.
- Rollback site = `rm -rf site && cp -a backups/site-20260909-1858 site && docker restart opays-academy`.
- Rollback gateway = re-scp `gw-server-20260909-1858.js` + `bash deploy-gateway.sh` (l'image se reconstruit) — l'API Phase 2B devient simplement absente, legacy inchangé.
- Rollback code local = git : prod ≈ `1deacac`, cible = HEAD (commits 625828e, 8c94af2, + ce lot).

## 4. Séquence de déploiement (GO humain requis — non exécutée)
```
# local
cd "C:\LAPOSTE\Projets\ACCADEMY OPAYS"
node scripts/build-bundle.js            # landing+admin+public+ui (fait ✅ bundle 574 Ko, ui/ inclus, zéro fixture)
tar -czf deploy/academy-bundle.tar.gz -C deploy/bundle-tmp .   # fait ✅

# site
scp -i ~/.ssh/kiveclair_hostinger_ed25519 deploy/academy-bundle.tar.gz deploy/deploy-vps-academy.sh root@76.13.58.5:/tmp/
ssh root@76.13.58.5 'ADMIN_USER=… ADMIN_PASS=$(<ADMIN_BASIC_PASSWORD du .env>) LEARN_USER=apprenant LEARN_PASS=*** NOUVEAU > bash /tmp/deploy-vps-academy.sh'
#   -> le script recrée htpasswd (rotation apprenant incluse), applique nginx avec location /ui/ + auth_request

# gateway
scp -r -i … deploy/classroom-gateway root@76.13.58.5:/opt/opays-classroom-gateway-new
ssh root@76.13.58.5 'cd /opt; mv classroom-gateway classroom-gateway.prev; mv classroom-gateway-new classroom-gateway;
  # ajouter au .env existant : CLASSROOM_COURSE_ID=875777175545 et CLASSROOM_URL=https://classroom.google.com/c/…
  bash deploy/classroom-gateway/deploy-gateway.sh'   # relit .env ; volumes persistants conservés

# smoke post-deploiement (sans secrets dans la sortie)
curl -s -o /dev/null -w "/=%{http_code} health=%{http_code}\n" https://course.opays.io/ ; curl -s https://course.opays.io/health
curl -s -o /dev/null -w "/ui/login/=%{http_code}\n" https://course.opays.io/ui/login/
curl -s -o /dev/null -w "/ui/suivi/ anon=%{http_code} (attendu 302 login)\n" https://course.opays.io/ui/suivi/
curl -s -o /dev/null -w "/admin/ anon=%{http_code} (attendu 401)\n" https://course.opays.io/admin/
curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"x@x","password":"***"}' -o /dev/null -w "/api/login mauvais=%{http_code} (attendu 401)\n" https://course.opays.io/api/login
curl -s -u "$u:$p" https://course.opays.io/api/whoami   # 200 role admin ; puis -u admin /api/progress -> 200
node scripts/test_production_remote.js                  # suite existante (LEARN_PASS=*** nouveau)
```
Après GO : logs `docker logs opays-classroom-gateway` → les événements `[academy]` (login_ok, perm_denied, feedback_sent…) — vérifiés sans secrets par le scan E2E.

## 5. Ce qui reste bloqué après déploiement (étapes produit, données réelles obligatoires)
1. **PRODUCTION ACTION REQUIRED — REAL ROSTER** : importer les vrais emails (cockpit → Console import). Sans eux : 0 compte, 0 invitation, parcours apprenant en empty state honnête.
2. **Re-consentement OAuth** (une fois, par l'admin via /admin/classroom.html) pour obtenir le scope `classroom.rosters` (écriture) → active enfin les invitations ; l'API répond 409 explicite jusqu'à là (testé).
3. **Publication du kit de devoirs** (topics+coursework) avec ALLOW_CLASSROOM_WRITE=1 temporairement — le kit validé est prêt (`docs/classroom/posts`, check 9/9).
4. **COHORT_START** : la date réelle (laissé « À définir » jusqu'à décision).

## 6. Vérifications d'intégrité déjà passées
- Bundle : 149 entrées, ui/ présent (login/campus/suivi/cockpit), **aucun fichier de test/fixture dedans** (Dockerfile ne copie que 3 fichiers, vérifié).
- nginx : `location /ui/` + `_authz` internal + `auth_request` sur suivi/cockpit ; `error_page → /ui/login/`.
- Gateway prod actuel (vieux binaire) ignore les nouvelles routes (404) → le site neuf avec ui/ AVANT le gateway neuf = pages dégradées mais sans fuite (les /api/* 404 = coquilles vides) : ordre de déploiement recommandé **gateway d'abord, site ensuite**.
- Recalcul progression : déposé ≠ validé ; retourné sans note ≠ validé ; graded → done+1 (E2E lignes 21-36).
