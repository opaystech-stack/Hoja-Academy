#!/bin/bash
# OPAYS ACADEMY — Test Forms complet avec le vrai ID du formulaire d'inscription
set -uo pipefail
ADMIN_PASS=$(grep '^ADMIN_PASS=' /opt/opays-classroom-gateway/.env | cut -d= -f2)
FORM_ID="1hQu0kZHsiseNOLG6ocnBt1GqbcDZSSzaQo1bWhqgZ9Q"

echo "=== 1. forms/list (via Drive API — activée) ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/forms/list" | head -c 400
echo ""
echo "=== 2. forms/meta (titre du formulaire) ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/forms/meta?formId=${FORM_ID}" | head -c 300
echo ""
echo "=== 3. forms/responses (réponses du formulaire) ==="
curl -s -u "admin:${ADMIN_PASS}" "https://course.opays.io/api/forms/responses?formId=${FORM_ID}" | head -c 500
echo ""
