#!/bin/bash
# OPAYS ACADEMY — Vérification finale sécurité admin (sans afficher les secrets)
set -uo pipefail

echo "=== .env gateway : clés (noms seulement) ==="
grep -E '^[A-Z_]+=' /opt/opays-classroom-gateway/.env | cut -d= -f1

echo "=== doublons dans .env gateway ? ==="
DUP=$(grep -E '^[A-Z_]+=' /opt/opays-classroom-gateway/.env | cut -d= -f1 | sort | uniq -d | wc -l)
echo "doublons: $DUP"

echo "=== /admin/ avec nouveau secret (depuis VPS) ==="
ADMIN_PASS=$(grep '^ADMIN_BASIC_PASSWORD=' /opt/opays-academy/.env | cut -d= -f2)
curl -s -u "admin:${ADMIN_PASS}" -o /dev/null -w 'HTTP %{http_code}\n' https://course.opays.io/admin/

echo "=== .env permissions ==="
stat -c '%a %n' /opt/opays-classroom-gateway/.env /opt/opays-academy/.env

echo "=== OAuth status avec nouveau secret ==="
curl -s -u "admin:${ADMIN_PASS}" https://course.opays.io/api/classroom/status | head -c 160
echo ""
