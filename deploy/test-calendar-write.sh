#!/bin/bash
# OPAYS ACADEMY — Test écriture Calendar : création + vérification + suppression d'un événement Meet
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)

# Événement de TEST dans le futur (dans 3 jours, 1h)
START=$(date -u -d "+3 days 18:30" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+3d -v18H -v30M +"%Y-%m-%dT%H:%M:%SZ")
END=$(date -u -d "+3 days 19:30" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || date -u -v+3d -v19H -v30M +"%Y-%m-%dT%H:%M:%SZ")
echo "Création événement : $START → $END"

echo "=== 1. CREATE (événement Meet de test) ==="
RESP=$(curl -s -u "admin:${ADMIN_PASS}" -X POST https://course.opays.io/api/calendar/create \
  -H "Content-Type: application/json" \
  -d "{\"summary\":\"TEST OPAYS — Validation écriture Calendar\",\"description\":\"Événement créé par le gateway pour valider l'intégration Calendar+Meet. À supprimer après test.\",\"start\":\"${START}\",\"end\":\"${END}\"}")
echo "$RESP"
EVENT_ID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('id',''))" 2>/dev/null || echo "$RESP" | grep -oE '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo "EVENT_ID=${EVENT_ID}"

if [ -n "$EVENT_ID" ]; then
  echo ""
  echo "=== 2. VÉRIFICATION : l'événement apparaît dans calendar/upcoming ? ==="
  curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/calendar/upcoming" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for e in d.get('events',[]):
    if e.get('id') == '$EVENT_ID':
        print('FOUND:', e.get('summary'), '| hangout:', e.get('hangout'))
" 2>/dev/null || curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/calendar/upcoming" | head -c 500

  echo ""
  echo "=== 3. DELETE (nettoyage du test) ==="
  curl -s -u "admin:${ADMIN_PASS}" -X DELETE "https://course.opays.io/api/calendar/delete?eventId=${EVENT_ID}" | head -c 200
  echo ""
else
  echo "ERREUR: pas d'EVENT_ID extrait"
fi
