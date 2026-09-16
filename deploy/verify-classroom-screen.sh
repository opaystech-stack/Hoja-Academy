#!/bin/bash
# OPAYS ACADEMY — Vérification finale écran Classroom + sécurité (sans afficher secrets)
set -uo pipefail

ADMIN_PASS=$(grep '^ADMIN_BASIC_PASSWORD=' /opt/opays-academy/.env | cut -d= -f2)

echo "=== 1. mauvais mdp → 401 attendu ==="
curl -s -u "admin:mauvais" -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/api/classroom/status

echo "=== 2. bon mdp → 200 attendu ==="
curl -s -u "admin:${ADMIN_PASS}" -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/api/classroom/status

echo "=== 3. status JSON (cours) ==="
curl -s -u "admin:${ADMIN_PASS}" https://course.opays.io/api/classroom/courses | head -c 250
echo ""

echo "=== 4. écran classroom.html accessible avec auth ==="
curl -s -u "admin:${ADMIN_PASS}" -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/admin/classroom.html

echo "=== 5. classroom.html SANS auth → 401 attendu ==="
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/admin/classroom.html

echo "=== 6. oauth/start reste public → 302 attendu ==="
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/oauth/start

echo "=== 7. /admin/ sans auth → 401 attendu ==="
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/admin/
