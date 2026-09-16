#!/bin/bash
# OPAYS ACADEMY — Personnalisation de la classe Google Classroom
#  1. Mettre à jour les métadonnées de la classe (nom/section/room)
#  2. Créer les 13 thèmes de la cohorte (blueprint)
# Usage : bash personalize-classroom.sh   (nécessite ALLOW_CLASSROOM_WRITE=1 au déploiement)
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
AUTH="admin:${ADMIN_PASS}"
COURSE_ID="875777175545"

echo "=== Vérifier le scope d'écriture (lecture seule d'abord) ==="
SCOPES_RAW=$(curl -s -u "$AUTH" https://course.opays.io/api/classroom/status)
SCOPES=$(echo "$SCOPES_RAW" | grep -o 'classroom\.courses' | head -1)
if [ "$SCOPES" = "classroom.courses" ]; then
  echo "OK : scope d'écriture classroom.courses présent"
else
  echo "BLOQUÉ : le token n'a pas le scope d'écriture (classroom.courses)."
  echo "  → Re-consentement requis : https://course.opays.io/oauth/start"
  exit 1
fi

echo ""
echo "=== 1. Métadonnées de la classe === (valeurs par défaut du blueprint)"
NAME="OPAYS Academy — Cohorte 01"
SECTION="Professionnels — RDC & Afrique francophone"
ROOM="Cohorte 01"

echo "Récapitulatif :"
echo "  nom     : $NAME"
echo "  section : $SECTION"
echo "  room    : $ROOM"

RESP=$(curl -s -u "$AUTH" -X PATCH https://course.opays.io/api/classroom/update \
  -H "Content-Type: application/json" \
  -d "$(python3 -c "import json,sys; print(json.dumps({'courseId':'${COURSE_ID}','name':'${NAME}','section':'${SECTION}','room':'${ROOM}'}))")")
echo "Réponse API : $RESP" | head -c 400
echo ""

echo ""
echo "=== 2. Création des 13 thèmes ==="
TOPICS=(
  "00 — COMMENCER ICI"
  "01 — SEMAINE 1 : Démystification & C.O.R.E."
  "02 — SEMAINE 2 : Cartographie & Documents"
  "03 — SEMAINE 3 : Skills & Workflows"
  "04 — SEMAINE 4 : Assistants & MCP"
  "05 — SEMAINE 5 : Assemblage & Écosystèmes"
  "06 — SEMAINE 6 : Rigueur & Sécurité"
  "07 — SEMAINE 7 : Automatisation & Quotidien"
  "08 — SEMAINE 8 : Spécialisation & Soutenance"
  "09 — MISSIONS HEBDOMADAIRES"
  "10 — LA BOÎTE À OUTILS"
  "11 — ACCOMPAGNEMENT"
  "12 — FORMATEUR SEULEMENT"
)
CREATED=0
for t in "${TOPICS[@]}"; do
  RESP=$(curl -s -u "$AUTH" -X POST https://course.opays.io/api/classroom/topics \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "import json; print(json.dumps({'courseId':'${COURSE_ID}','name':'${t}'}))")")
  TID=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin).get('topicId',''))" 2>/dev/null)
  if [ -n "$TID" ]; then
    echo "  ✅ $t → $TID"
    CREATED=$((CREATED+1))
  else
    echo "  ❌ $t → $RESP" | head -c 200
    echo ""
  fi
done
echo "Thèmes créés : $CREATED/13"
echo ""
echo "=== 3. Vérification finale ==="
curl -s -u "$AUTH" https://course.opays.io/api/classroom/courses | head -c 400
echo ""
