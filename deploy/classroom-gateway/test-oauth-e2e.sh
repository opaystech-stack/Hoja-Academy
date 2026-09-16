#!/bin/bash
# OPAYS ACADEMY — Test OAuth Google Classroom complet (E2E)
#
# Étapes :
#   1. Vérifie que le .env est présent et sans placeholder
#   2. Redéploie le gateway avec les vraies valeurs
#   3. Teste /oauth/start → vérifie la redirection Google avec le vrai client_id
#   4. Affiche l'URL à ouvrir dans le navigateur pour l'authentification Google
#   5. (après le callback) teste /api/classroom/status, /courses, /students
#   6. Vérifie le refresh token conservé dans le volume Docker
#
# Usage : bash test-oauth-e2e.sh
set -uo pipefail

APP_DIR="/opt/opays-classroom-gateway"
ENV_FILE="$APP_DIR/.env"
BASE="https://course.opays.io"

echo "═══════════════════════════════════════════════"
echo "  TEST OAuth GOOGLE CLASSROOM — E2E"
echo "═══════════════════════════════════════════════"

# ── 1. Vérification du .env ──────────────────────────────────────────
echo ""
echo "==> [1/6] Vérification .env"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env ABSENT — exécutez :"
  echo "   cp $APP_DIR/.env.example $ENV_FILE"
  echo "   nano $ENV_FILE   # remplir GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_PASS"
  exit 1
fi
if grep -q "PLACEHOLDER" "$ENV_FILE" 2>/dev/null; then
  echo "❌ Placeholders encore présents dans .env"
  exit 1
fi
echo "✅ .env présent et sans placeholder"

# ── 2. Redéploiement avec les vraies valeurs ─────────────────────────
echo ""
echo "==> [2/6] Redéploiement du gateway"
set -a; source "$ENV_FILE"; set +a
bash "$APP_DIR/deploy-gateway.sh" >/tmp/gw-deploy.log 2>&1 || { echo "❌ Déploiement échoué"; tail -5 /tmp/gw-deploy.log; exit 1; }
echo "✅ Gateway redéployé"

# ── 3. Vérification du client_id dans le conteneur ───────────────────
echo ""
echo "==> [3/6] Client ID actif"
CID=$(docker exec opays-classroom-gateway sh -c 'echo "$GOOGLE_CLIENT_ID"' 2>/dev/null)
echo "   Client ID : ${CID:0:20}…"
if [[ "$CID" == *PLACEHOLDER* ]] || [ -z "$CID" ]; then
  echo "❌ Client ID encore placeholder — vérifiez .env"
  exit 1
fi
echo "✅ Client ID réel en place"

# ── 4. Test /oauth/start → redirection Google ────────────────────────
echo ""
echo "==> [4/6] Démarrage du flux OAuth"
ADMIN_USER_VAL=$(grep -E '^ADMIN_USER=' "$ENV_FILE" | cut -d= -f2-)
ADMIN_PASS_VAL=$(grep -E '^ADMIN_PASS=' "$ENV_FILE" | cut -d= -f2-)
LOCATION=$(curl -s -u "$ADMIN_USER_VAL:$ADMIN_PASS_VAL" -o /dev/null -w "%{redirect_url}" "$BASE/oauth/start")
if [[ "$LOCATION" != https://accounts.google.com/* ]]; then
  echo "❌ Pas de redirection Google : $LOCATION"
  exit 1
fi
echo "✅ Redirection Google générée"
echo ""
echo "   ➡️  OUVREZ CETTE URL DANS VOTRE NAVIGATEUR (session Google) :"
echo ""
echo "   $LOCATION"
echo ""
echo "   Après l'authentification, Google redirigera vers /oauth/callback."
echo "   Le refresh token sera alors conservé côté serveur (volume Docker)."
echo ""
echo "   ⏳ Une fois le callback fait (message ✅ dans le navigateur),"
echo "   relancez ce script avec : bash test-oauth-e2e.sh --verify"

# ── Mode vérification post-callback ──────────────────────────────────
if [ "${1:-}" = "--verify" ]; then
  echo ""
  echo "═══════════════════════════════════════════════"
  echo "  VÉRIFICATION POST-AUTHENTIFICATION"
  echo "═══════════════════════════════════════════════"

  # ── 5. Token conservé ? ────────────────────────────────────────────
  echo ""
  echo "==> [5/6] Refresh token conservé (volume Docker)"
  TOK=$(docker exec opays-classroom-gateway sh -c 'cat /data/token.json 2>/dev/null' 2>/dev/null)
  if [ -z "$TOK" ]; then
    echo "❌ Aucun token.json dans le volume — l'authentification n'a pas abouti"
    exit 1
  fi
  HAS_REFRESH=$(echo "$TOK" | grep -c '"refresh_token"' || true)
  HAS_ACCESS=$(echo "$TOK" | grep -c '"access_token"' || true)
  echo "   refresh_token présent : $([ "$HAS_REFRESH" -ge 1 ] && echo '✅ OUI' || echo '❌ NON')"
  echo "   access_token présent  : $([ "$HAS_ACCESS" -ge 1 ] && echo '✅ OUI' || echo '❌ NON')"
  echo "   (contenu masqué — fichier : /data/token.json dans le volume opays-classroom-token)"
  if [ "$HAS_REFRESH" -lt 1 ]; then exit 1; fi

  # ── 6. Statut + cours + étudiants ──────────────────────────────────
  echo ""
  echo "==> [6/6] API Classroom"
  STATUS=$(curl -s -u "$ADMIN_USER_VAL:$ADMIN_PASS_VAL" "$BASE/api/classroom/status")
  echo "   Statut : $STATUS"

  COURSES=$(curl -s -u "$ADMIN_USER_VAL:$ADMIN_PASS_VAL" "$BASE/api/classroom/courses")
  echo "   Cours  : $(echo "$COURSES" | grep -o '"name"' | wc -l) trouvés"
  echo "$COURSES" | head -c 600
  echo ""

  # Récupérer le premier courseId pour tester les étudiants
  FIRST_ID=$(echo "$COURSES" | grep -oE '"id": "[0-9]+"' | head -1 | grep -oE '[0-9]+')
  if [ -n "$FIRST_ID" ]; then
    STUDENTS=$(curl -s -u "$ADMIN_USER_VAL:$ADMIN_PASS_VAL" "$BASE/api/classroom/students?courseId=$FIRST_ID")
    echo "   Étudiants (cours $FIRST_ID) : $(echo "$STUDENTS" | grep -o '"name"' | wc -l)"
    echo "$STUDENTS" | head -c 600
    echo ""
  else
    echo "   ⚠️  Aucun cours trouvé — pas de test étudiants"
  fi

  echo ""
  echo "═══════════════════════════════════════════════"
  echo "  ✅ TEST OAuth E2E TERMINÉ"
  echo "═══════════════════════════════════════════════"
fi
