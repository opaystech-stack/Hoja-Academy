#!/bin/bash
# OPAYS ACADEMY — Restreindre l'accès admin OAuth au compte Google autorisé
# Ajoute/met à jour ALLOWED_ADMIN_EMAILS dans le .env du gateway (jamais affiché)
set -euo pipefail

ENV_GW=/opt/opays-classroom-gateway/.env
ADMIN_EMAIL="opaystech@gmail.com"

[ -f "$ENV_GW" ] || { echo "ERREUR: .env gateway absent"; exit 1; }

# 1. Mettre à jour ou ajouter ALLOWED_ADMIN_EMAILS
if grep -q '^ALLOWED_ADMIN_EMAILS=' "$ENV_GW"; then
  sed -i "s|^ALLOWED_ADMIN_EMAILS=.*|ALLOWED_ADMIN_EMAILS=${ADMIN_EMAIL}|" "$ENV_GW"
else
  echo "ALLOWED_ADMIN_EMAILS=${ADMIN_EMAIL}" >> "$ENV_GW"
fi
chmod 600 "$ENV_GW"

# 2. Preuve sans révéler le secret (juste la valeur de la variable admin, publique)
echo "ALLOWED_ADMIN_EMAILS=$(grep '^ALLOWED_ADMIN_EMAILS=' "$ENV_GW" | cut -d= -f2)"

# 3. Redéployer le gateway
cd /opt/opays-classroom-gateway && bash deploy-gateway.sh >/dev/null 2>&1
echo "gateway redéployé"

# 4. Vérifier que la variable est DANS le conteneur
sleep 4
docker inspect opays-classroom-gateway --format '{{range .Config.Env}}{{println .}}{{end}}' | grep '^ALLOWED_ADMIN_EMAILS=' || echo "ERREUR: variable absente du conteneur"

# 5. OAuth toujours fonctionnel (le token existant reste valide)
ADMIN_PASS=$(grep '^ADMIN_PASS=' "$ENV_GW" | cut -d= -f2)
STATUS=$(curl -s -u "admin:${ADMIN_PASS}" -o /dev/null -w "%{http_code}" https://course.opays.io/api/classroom/status)
echo "api status: HTTP $STATUS (200 attendu)"
