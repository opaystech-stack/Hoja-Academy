#!/bin/bash
# OPAYS ACADEMY — Rotation du mot de passe admin Basic Auth (nginx)
# Le secret est généré, stocké dans .env (mode 600) et JAMAIS affiché.
set -euo pipefail
cd /opt/opays-academy

# 1. Utilisateur actuel du htpasswd admin
USER=$(cut -d: -f1 htpasswd-admin | head -1)
echo "USER_ADMIN=${USER}"

# 2. Générer un nouveau secret aléatoire (ne jamais l'afficher)
NEW_SECRET=$(openssl rand -base64 30 | tr -d '/+=' | head -c 30)

# 3. Stocker dans .env (mode 600, jamais commité)
umask 077
touch .env
if grep -q '^ADMIN_BASIC_PASSWORD=' .env; then
  sed -i "s|^ADMIN_BASIC_PASSWORD=.*|ADMIN_BASIC_PASSWORD=${NEW_SECRET}|" .env
else
  echo "ADMIN_BASIC_PASSWORD=${NEW_SECRET}" >> .env
fi

# 4. Régénérer htpasswd-admin (bcrypt) avec le nouveau secret
#    (la sortie du conteneur est capturée côté hôte — pas de montage nécessaire)
docker run --rm httpd:2.4-alpine htpasswd -nbB "${USER}" "${NEW_SECRET}" > htpasswd-admin
chmod 644 htpasswd-admin

# 5. Preuves SANS révéler le secret
echo "PREUVES:"
echo "  .env: $(grep -c '^ADMIN_BASIC_PASSWORD=' .env) clé présente"
echo "  longueur_secret=$(grep '^ADMIN_BASIC_PASSWORD=' .env | cut -d= -f2 | wc -c)"
echo "  htpasswd: $(wc -l < htpasswd-admin) ligne, hash $(cut -d: -f2 htpasswd-admin | head -c 4)... (bcrypt)"
echo "  permissions .env: $(stat -c %a .env)"

# 6. Recharger nginx pour prendre en compte le nouveau htpasswd
docker exec opays-academy nginx -s reload 2>&1 || docker exec opays-academy nginx -t && docker exec opays-academy nginx -s reload
echo "nginx reloaded"
