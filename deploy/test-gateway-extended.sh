#!/bin/bash
# OPAYS ACADEMY — Test des endpoints étendus (Gmail/Calendar/Forms) — lecture seule
set -uo pipefail

ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
AUTH="admin:${ADMIN_PASS}"

echo "=== 1. gmail/profile (lecture) ==="
curl -s -u "$AUTH" https://course.opays.io/api/gmail/profile | head -c 250
echo ""
echo "=== 2. calendar/upcoming (lecture) ==="
curl -s -u "$AUTH" 'https://course.opays.io/api/calendar/upcoming' | head -c 350
echo ""
echo "=== 3. forms/list (lecture) ==="
curl -s -u "$AUTH" https://course.opays.io/api/forms/list | head -c 250
echo ""
echo "=== 4. gmail/send POST (403 attendu — écriture désactivée) ==="
curl -s -u "$AUTH" -X POST https://course.opays.io/api/gmail/send | head -c 120
echo ""
echo "=== 5. calendar/create POST (403 attendu) ==="
curl -s -u "$AUTH" -X POST https://course.opays.io/api/calendar/create | head -c 120
echo ""
echo "=== 6. classroom/status (toujours OK) ==="
curl -s -u "$AUTH" https://course.opays.io/api/classroom/status | head -c 200
echo ""
