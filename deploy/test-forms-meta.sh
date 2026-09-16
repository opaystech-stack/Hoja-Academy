#!/bin/bash
# OPAYS ACADEMY — Test Forms réel (meta + réponses du formulaire d'inscription)
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
FORM_ID="1FAIpQLSfGQL_eANGDh2AKWJpnKbvKHuXR9rKlGcKxwOJeVBma3vcleA"

echo "=== 1. forms/meta (titre du formulaire) ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/forms/meta?formId=${FORM_ID}" | head -c 300
echo ""
echo "=== 2. forms/responses (réponses du formulaire) ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/forms/responses?formId=${FORM_ID}" | head -c 400
echo ""
