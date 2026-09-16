#!/bin/bash
# OPAYS ACADEMY — Lister les thèmes existants de la classe (lecture seule)
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
COURSE_ID="875777175545"
echo "=== Thèmes existants ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/classroom/topics?courseId=${COURSE_ID}" 2>/dev/null | head -c 300 || echo "(endpoint liste non implémenté — lecture directe)"
echo ""
echo "=== Via API directe (lecture) ==="
# Utiliser le token du gateway pour lister les topics
TOKEN=$(docker exec opays-classroom-gateway node -e "const t=JSON.parse(require('fs').readFileSync('/data/token.json','utf8'));console.log(t.access_token)" 2>/dev/null)
if [ -n "$TOKEN" ]; then
  curl -s -H "Authorization: Bearer ${TOKEN}" "https://classroom.googleapis.com/v1/courses/${COURSE_ID}/topics?pageSize=100" | python3 -c "
import sys,json
d=json.load(sys.stdin)
topics=d.get('topic',[])
if not topics: print('Aucun thème existant')
for t in topics: print(' -', t.get('topicId'), t.get('name'))
" 2>/dev/null || echo "Erreur lecture"
fi
