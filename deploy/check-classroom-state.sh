#!/bin/bash
# OPAYS ACADEMY — État actuel de la classe Google Classroom (lecture seule)
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
echo "=== Classe actuelle ==="
curl -s -u "admin:${ADMIN_PASS}" https://course.opays.io/api/classroom/courses | python3 -m json.tool 2>/dev/null || curl -s -u "admin:${ADMIN_PASS}" https://course.opays.io/api/classroom/courses | head -c 500
echo ""
echo "=== Scopes disponibles (ce que le token peut faire) ==="
curl -s -u "admin:${ADMIN_PASS}" https://course.opays.io/api/classroom/status | python3 -c "
import sys,json
d=json.load(sys.stdin)
print('connected:', d.get('connected'))
for s in d.get('scopes',[]): print(' -', s)
" 2>/dev/null | head -12
