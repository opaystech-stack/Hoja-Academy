#!/bin/bash
# OPAYS ACADEMY — Exécution personnalisation avec capture COMPLÈTE des erreurs Google
set -uo pipefail
cd /opt/opays-classroom-gateway

# 1. Activer l'écriture (temporaire)
ALLOW_CLASSROOM_WRITE=1 bash deploy-gateway.sh >/dev/null 2>&1
sleep 2

ADMIN_PASS=$(grep '^ADMIN_PASS=' .env | cut -d= -f2)
AUTH="admin:${ADMIN_PASS}"
COURSE_ID="875777175545"

echo "=== 1. PATCH classe (updateMask) ==="
curl -s -u "$AUTH" -X PATCH "https://course.opays.io/api/classroom/update" \
  -H "Content-Type: application/json" \
  -d "{\"courseId\":\"${COURSE_ID}\",\"name\":\"OPAYS Academy — Cohorte 01\",\"section\":\"Professionnels — RDC & Afrique francophone\",\"room\":\"Cohorte 01\"}"
echo ""

echo "=== 2. POST topic (réponse COMPLÈTE) ==="
curl -s -u "$AUTH" -X POST "https://course.opays.io/api/classroom/topics" \
  -H "Content-Type: application/json" \
  -d "{\"courseId\":\"${COURSE_ID}\",\"name\":\"00 — COMMENCER ICI\"}"
echo ""

# 3. Re-désactiver
ALLOW_CLASSROOM_WRITE=0 bash deploy-gateway.sh >/dev/null 2>&1
echo "garde réactivée (0)"
