#!/bin/bash
# OPAYS ACADEMY — Aligner le mot de passe du gateway API sur le nouveau secret admin
# (un SEUL jeu de credentials admin pour /admin/ (nginx) et /api/ (gateway))
set -euo pipefail

# 1. Lire le nouveau secret admin (jamais affiché)
ADMIN_PASS=$(grep '^ADMIN_BASIC_PASSWORD=' /opt/opays-academy/.env | cut -d= -f2)
[ -n "$ADMIN_PASS" ] || { echo "ERREUR: secret admin introuvable"; exit 1; }

# 2. Nettoyer la ligne vide du htpasswd-admin
sed -i '/^$/d' /opt/opays-academy/htpasswd-admin
echo "htpasswd lignes: $(wc -l < /opt/opays-academy/htpasswd-admin)"

# 3. Mettre à jour ADMIN_PASS du gateway (dans son .env)
ENV_GW=/opt/opays-classroom-gateway/.env
touch "$ENV_GW"
if grep -q '^ADMIN_PASS=' "$ENV_GW"; then
  sed -i "s|^ADMIN_PASS=.*|ADMIN_PASS=${ADMIN_PASS}|" "$ENV_GW"
else
  echo "ADMIN_PASS=${ADMIN_PASS}" >> "$ENV_GW"
fi
chmod 600 "$ENV_GW"
echo "gateway .env mis à jour (clés: $(cut -d= -f1 "$ENV_GW" | tr '\n' ' '))"

# 4. Redéployer le gateway avec le nouveau mot de passe
cd /opt/opays-classroom-gateway && bash deploy-gateway.sh >/dev/null 2>&1
echo "gateway redéployé"

# 5. Preuve runtime : /api/classroom/status avec le NOUVEAU mot de passe (sans l'afficher)
sleep 3
STATUS=$(curl -s -u "admin:${ADMIN_PASS}" -o /dev/null -w "%{http_code}" https://course.opays.io/api/classroom/status)
echo "api/classroom/status avec nouveau secret: HTTP $STATUS"

# 6. Vérifier que l'ANCIEN mot de passe gateway ne fonctionne plus
STATUS_OLD=$(curl -s -u "admin:OpaysGateway2026!" -o /dev/null -w "%{http_code}" https://course.opays.io/api/classroom/status)
echo "api/classroom/status avec ancien secret: HTTP $STATUS_OLD (401 attendu)"
