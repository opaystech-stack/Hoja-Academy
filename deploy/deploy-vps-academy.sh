#!/bin/bash
# OPAYS ACADEMY — Déploiement complet Phase 5 sur le VPS OPAYS (Dokploy/Traefik)
#
# Architecture servie par nginx (UNE seule arborescence montée /usr/share/nginx/html) :
#   /index.html    → landing page publique (vitrine, AUCUN accès aux supports)
#   /modules/*     → présentations apprenants SANITIZÉES (mot de passe cohorte)
#   /admin/*       → hub + dashboard + présentations COMPLÈTES (mot de passe admin)
#
# Usage :
#   scp /tmp/academy-bundle.tar.gz deploy/deploy-vps-academy.sh root@76.13.58.5:/tmp/
#   ssh root@76.13.58.5 'ADMIN_USER=... ADMIN_PASS=... LEARN_USER=... LEARN_PASS=... bash /tmp/deploy-vps-academy.sh'
set -euo pipefail

APP_DIR="/opt/opays-academy"
SITE_DIR="$APP_DIR/site"
CONTAINER="opays-academy"
NETWORK="dokploy-network"
HOSTNAME="course.opays.io"

ADMIN_USER="${ADMIN_USER:?ADMIN_USER requis}"
ADMIN_PASS="${ADMIN_PASS:?ADMIN_PASS requis}"
LEARN_USER="${LEARN_USER:-apprenant}"
LEARN_PASS="${LEARN_PASS:?LEARN_PASS requis}"

echo "==> [1/6] Préparation de l'arborescence site/"
rm -rf "$SITE_DIR" /tmp/academy-extract /tmp/hoja-extract
mkdir -p "$SITE_DIR"
if [ -f /tmp/academy-bundle.tar.gz ]; then
  # Le bundle contient admin/ et public/ (public = landing + modules sanitizés)
  tar -xzf /tmp/academy-bundle.tar.gz -C /tmp/academy-extract 2>/dev/null || { mkdir -p /tmp/academy-extract && tar -xzf /tmp/academy-bundle.tar.gz -C /tmp/academy-extract; }
  if [ -d /tmp/academy-extract/public ]; then
    # ancien format du bundle : public/ = site, admin/ separe
    cp -r /tmp/academy-extract/public/. "$SITE_DIR/"
    cp -r /tmp/academy-extract/admin "$SITE_DIR/admin"
  else
    # format Phase 2B : racine = site (index, modules/, ui/, merci) + admin/
    cp -r /tmp/academy-extract/. "$SITE_DIR/"
  fi
  echo "    Fichiers : $(find "$SITE_DIR" -type f | wc -l)"
else
  echo "    ⚠️  Bundle absent"
fi
# [NEW] Frontend public = Next.js Hoja Academy (source de verite du chantier Phase 1).
# Overlay complet de /tmp/hoja-public.tar.gz (sortie `next build` = out/) sur la racine :
# remplace la landing legacy, n'ecrase PAS modules/ admin/ ui/ (absents de out/, verifie).
if [ -f /tmp/hoja-public.tar.gz ]; then
  mkdir -p /tmp/hoja-extract
  tar -xzf /tmp/hoja-public.tar.gz -C /tmp/hoja-extract
  cp -a /tmp/hoja-extract/. "$SITE_DIR/"
  echo "    Frontend public Hoja (Next.js) : $(find /tmp/hoja-extract -type f | wc -l) fichiers"
else
  echo "    ⚠️  hoja-public.tar.gz absent — la landing legacy reste en place"
fi
[ -f "$SITE_DIR/_next/static" ] || [ -d "$SITE_DIR/_next" ] || { echo "❌ _next/ manquant (build Next.js non deploye)"; exit 1; }
[ -f "$SITE_DIR/index.html" ] || { echo "❌ index.html manquant"; exit 1; }
[ -d "$SITE_DIR/modules" ] || { echo "❌ modules/ manquant"; exit 1; }
[ -d "$SITE_DIR/admin" ] || { echo "❌ admin/ manquant"; exit 1; }
[ -d "$SITE_DIR/ui" ] || echo "   ⚠️ ui/ absent du bundle (les nouvelles UI 2B ne seront pas servies)"

echo "==> [2/6] htpasswd (générés via conteneur httpd)"
docker run --rm httpd:2.4-alpine htpasswd -nbB "$ADMIN_USER" "$ADMIN_PASS" > "$APP_DIR/htpasswd-admin" 2>/dev/null
docker run --rm httpd:2.4-alpine htpasswd -nbB "$LEARN_USER" "$LEARN_PASS" > "$APP_DIR/htpasswd-learn" 2>/dev/null
[ -s "$APP_DIR/htpasswd-admin" ] && [ -s "$APP_DIR/htpasswd-learn" ] || { echo "❌ htpasswd non générés"; exit 1; }
echo "    OK ($ADMIN_USER / $LEARN_USER)"

echo "==> [3/6] nginx.conf"
cat > "$APP_DIR/nginx.conf" <<'NGINX'
server {
    listen 80;
    server_name _;
    # IMPORTANT: Traefik (websecure) transmet a ce serveur en HTTP interne.
    # Sans absolute_redirect off, le 301 "sans slash -> avec slash" genere
    # Location: http://... que le navigateur suit sur le port 80 PUBLIC ou
    # Traefik n'a AUCUN routeur http pour course.opays.io -> "404 page not found"
    # (le 404 mobile du cockpit). Redirect relatif = le client garde son https.
    absolute_redirect off;
    # Entrees sans slash final (tapees/main): redirect propre, jamais 404
    location = /admin { return 301 /admin/; }
    location = /modules { return 301 /modules/; }
    # Redirects SEO anciennes routes ES -> FR (frontend Next.js Hoja)
    rewrite ^/accesibilidad$ /accessibilite permanent;
    rewrite ^/aviso-legal$ /mentions-legales permanent;
    rewrite ^/contacto$ /contact permanent;
    rewrite ^/curso-de-chatgpt$ /formations/expert-ia permanent;
    rewrite ^/curso-de-gemini$ /formations/expert-ia permanent;
    rewrite ^/curso-de-make$ /formations/automatisation-n8n permanent;
    rewrite ^/curso-ia$ /formations/programme-intensif permanent;
    rewrite ^/empresas$ /entreprises permanent;
    rewrite ^/institution$ / permanent;
    rewrite ^/a-propos(/.*)?$ / permanent;
    # Filet anti 404 : slash final -> sans slash (les fichiers servent formatures.html)
    rewrite ^/((?:formations|entreprises|contact|postuler|mentions-legales|confidentialite|cookies|accessibilite)(?:/[a-z0-9\-]+)?)/$ /$1 permanent;
    rewrite ^/(curso-ia|noticias-ia|empresas|contacto|registration|aviso-legal|politica-de-privacidad|politica-de-cookies|accesibilidad|programa-afiliados|curso-de-chatgpt|curso-de-gemini|curso-de-make)/$ / permanent;
    rewrite ^/noticias-ia$ / permanent;
    rewrite ^/politica-de-cookies$ /cookies permanent;
    rewrite ^/politica-de-privacidad$ /confidentialite permanent;
    rewrite ^/programa-afiliados$ /entreprises permanent;
    rewrite ^/registration$ /postuler permanent;

    root /usr/share/nginx/html;
    index index.html;

    location = / {
        try_files /index.html =404;
        add_header Cache-Control "no-cache";
    }

    # Frontend Hoja Next.js : assets hashes = cache long ; pages HTML = revalidation
    location /_next/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /modules/ {
        auth_basic "Académie OPAYS — Espace apprenants";
        auth_basic_user_file /etc/nginx/htpasswd-learn;
        try_files $uri $uri/ $uri/index.html =404;
    }

    location /admin/ {
        auth_basic "Academie OPAYS - Espace formateur";
        auth_basic_user_file /etc/nginx/htpasswd-admin;
        try_files $uri $uri/ $uri/index.html =404;
    }

    # Phase 2B — coquilles d'UI : les PAGES ne contiennent AUCUNE donnée ;
    # tout passe par /api/* (session + rôle vérifiés côté gateway).
    location /ui/ {
        try_files $uri $uri/ $uri/index.html =404;
    }
    # Défense en profondeur : les pages staff exigent une session formateur/admin
    # (subrequest auth_request vers le gateway — le cookie est transmis).
    location = /_authz {
        internal;
        # Resolution DNS DYNAMIQUE (Docker embedded DNS) : nginx ne doit pas
        # cacher l'IP du gateway, sinon tout redeploiement du gateway casse
        # l'auth_request (500) jusqu'au prochain restart de nginx.
        resolver 127.0.0.11 valid=10s ipv6=off;
        set $authz_upstream http://opays-classroom-gateway:9001;
        proxy_pass $authz_upstream/authz;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-Uri $request_uri;
        proxy_set_header Cookie $http_cookie;
        proxy_set_header Authorization $http_authorization;
    }
    location /ui/suivi/ {
        auth_request /_authz;
        error_page 401 403 = @login_redirect;
        try_files $uri $uri/ $uri/index.html =404;
    }
    location /ui/cockpit/ {
        auth_request /_authz;
        error_page 401 403 = @login_redirect;
        try_files $uri $uri/ $uri/index.html =404;
    }
    location @login_redirect {
        return 302 /ui/login/;
    }

    # Tout le reste → 404 strict (jamais de fallback vers la landing : les fichiers
    # internes ne doivent PAS être masqués par un 200)
    location / {
        try_files $uri $uri.html =404;
        add_header Cache-Control "no-cache";
    }
}
NGINX

echo "==> [4/6] Conteneur"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network "$NETWORK" \
  -v "$SITE_DIR:/usr/share/nginx/html:ro" \
  -v "$APP_DIR/nginx.conf:/etc/nginx/conf.d/default.conf:ro" \
  -v "$APP_DIR/htpasswd-admin:/etc/nginx/htpasswd-admin:ro" \
  -v "$APP_DIR/htpasswd-learn:/etc/nginx/htpasswd-learn:ro" \
  -l traefik.enable=true \
  -l "traefik.http.routers.opays-academy.entrypoints=websecure" \
  -l "traefik.http.routers.opays-academy.rule=Host(\`$HOSTNAME\`)" \
  -l "traefik.http.routers.opays-academy.tls.certresolver=letsencrypt" \
  -l "traefik.http.services.opays-academy.loadbalancer.server.port=80" \
  nginx:alpine >/dev/null

echo "==> [5/6] Vérifications"
sleep 4
docker ps --filter "name=$CONTAINER" --format "    $CONTAINER: {{.Status}}"
echo "    Landing publique :"
curl -fsS -o /dev/null -w "      / → %{http_code} (attendu 200)\n" "https://$HOSTNAME/" || true
echo "    Zones protégées sans auth (401 attendu) :"
curl -s -o /dev/null -w "      /modules/01/ → %{http_code}\n" "https://$HOSTNAME/modules/01/" || true
curl -s -o /dev/null -w "      /admin/ → %{http_code}\n" "https://$HOSTNAME/admin/" || true
echo "    Frontend Hoja (externes) :"
curl -s -o /dev/null -w "      /a-propos → %{http_code} (attendu 301 vers /)\n" "https://$HOSTNAME/a-propos" || true
for i in 1 2 3 4 5; do sleep 2; H=$(curl -s "https://$HOSTNAME/" || true); echo "$H" | grep -qE "_next/static" && { echo "      / = Next.js Hoja ✓"; break; }; [ $i = 5 ] && echo "      ❌ / ne reference pas _next (mauvais frontend)"; done
echo ""
echo "✅ Déploiement terminé :"
echo "   Landing   : https://$HOSTNAME/"
echo "   Apprenant : https://$HOSTNAME/modules/01/ (user: $LEARN_USER)"
echo "   Formateur : https://$HOSTNAME/admin/ (user: $ADMIN_USER)"
