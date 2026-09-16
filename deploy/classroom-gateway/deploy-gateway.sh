#!/bin/bash
# OPAYS ACADEMY — Déploiement du Gateway Google Classroom (OAuth + API)
#
# Construit et lance le conteneur opays-classroom-gateway derrière Traefik :
#   /oauth/*  → gateway (connexion Google)
#   /api/*    → gateway (courses, étudiants)
#   /health   → gateway (health check)
# Le reste (statique) continue vers opays-academy (nginx).
#
# Variables (NE JAMAIS dans Git — fichier .env sur le serveur ou env Docker) :
#   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_USER, ADMIN_PASS, REDIRECT_BASE
#
# Usage :
#   scp -r deploy/classroom-gateway root@76.13.58.5:/opt/opays-classroom-gateway
#   ssh root@76.13.58.5 'GOOGLE_CLIENT_ID=... GOOGLE_CLIENT_SECRET=... ADMIN_USER=... ADMIN_PASS=... bash /opt/opays-classroom-gateway/deploy-gateway.sh'
set -euo pipefail

APP_DIR="/opt/opays-classroom-gateway"
CONTAINER="opays-classroom-gateway"
NETWORK="dokploy-network"
HOSTNAME="course.opays.io"

# Env requis (sinon .env présent sur le serveur)
if [ -f "$APP_DIR/.env" ]; then
  set -a; source "$APP_DIR/.env"; set +a
fi
GOOGLE_CLIENT_ID="${GOOGLE_CLIENT_ID:?GOOGLE_CLIENT_ID requis (Dokploy env ou .env)}"
GOOGLE_CLIENT_SECRET="${GOOGLE_CLIENT_SECRET:?GOOGLE_CLIENT_SECRET requis}"
ADMIN_USER="${ADMIN_USER:-admin}"
ADMIN_PASS="${ADMIN_PASS:?ADMIN_PASS requis}"
REDIRECT_BASE="${REDIRECT_BASE:-https://course.opays.io}"
ALLOWED_ADMIN_EMAILS="${ALLOWED_ADMIN_EMAILS:-}"
ALLOW_CALENDAR_WRITE="${ALLOW_CALENDAR_WRITE:-0}"
ALLOW_CLASSROOM_WRITE="${ALLOW_CLASSROOM_WRITE:-0}"
# Phase 2B — identite/roles/progression (NON SECRET : que des identifiants/URL publics)
CLASSROOM_COURSE_ID="${CLASSROOM_COURSE_ID:-875777175545}"
CLASSROOM_URL="${CLASSROOM_URL:-}"
COHORT_START="${COHORT_START:-}"          # ISO ou vide (= "a definir") — jamais invente
ALLOW_BOOTSTRAP="${ALLOW_BOOTSTRAP:-0}"   # 1 uniquement pour le TOUT PREMIER consentement OAuth

echo "==> [1/4] Build image"
docker build -t "$CONTAINER" "$APP_DIR"

echo "==> [2/4] Conteneur"
docker rm -f "$CONTAINER" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER" \
  --restart unless-stopped \
  --network "$NETWORK" \
  -v opays-classroom-token:/data \
  -e GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID" \
  -e GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET" \
  -e ADMIN_USER="$ADMIN_USER" \
  -e ADMIN_PASS="$ADMIN_PASS" \
  -e REDIRECT_BASE="$REDIRECT_BASE" \
  -e ALLOWED_ADMIN_EMAILS="$ALLOWED_ADMIN_EMAILS" \
  -e ALLOW_CALENDAR_WRITE="$ALLOW_CALENDAR_WRITE" \
  -e ALLOW_CLASSROOM_WRITE="$ALLOW_CLASSROOM_WRITE" \
  -e CLASSROOM_COURSE_ID="$CLASSROOM_COURSE_ID" \
  -e CLASSROOM_URL="$CLASSROOM_URL" \
  -e COHORT_START="$COHORT_START" \
  -e FORM_ID="$FORM_ID" \
  -e CANDIDATES_FILE=/data/candidates.json \
  -e SETTINGS_FILE=/data/settings.json \
  -e ALLOW_BOOTSTRAP="$ALLOW_BOOTSTRAP" \
  -e USERS_FILE=/data/users.json \
  -e PORT=9001 \
  -l traefik.enable=true \
  -l "traefik.http.routers.opays-gateway.entrypoints=websecure" \
  -l "traefik.http.routers.opays-gateway.rule=Host(\`$HOSTNAME\`) && (PathPrefix(\`/oauth\`) || PathPrefix(\`/api\`) || PathPrefix(\`/health\`))" \
  -l "traefik.http.routers.opays-gateway.tls.certresolver=letsencrypt" \
  -l "traefik.http.services.opays-gateway.loadbalancer.server.port=9001" \
  "$CONTAINER":latest >/dev/null

echo "==> [3/4] Vérification"
sleep 4
docker ps --filter "name=$CONTAINER" --format "    $CONTAINER: {{.Status}}"
echo "    /health :"
curl -fsS -o /dev/null -w "      → %{http_code}\n" "https://$HOSTNAME/health" || true
echo "    /api/classroom/status sans auth (401 attendu) :"
curl -s -o /dev/null -w "      → %{http_code}\n" "https://$HOSTNAME/api/classroom/status" || true

echo ""
echo "✅ Gateway déployé :"
echo "   Redirect URI : https://$HOSTNAME/oauth/callback  ← À déclarer dans Google Cloud Console"
echo "   JavaScript origins : https://$HOSTNAME"
