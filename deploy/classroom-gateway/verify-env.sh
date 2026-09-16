#!/bin/bash
# Vérification que le .env du gateway est présent et complet (sans afficher les secrets)
set -uo pipefail

ENV_FILE="/opt/opays-classroom-gateway/.env"
echo "=== Vérification /opt/opays-classroom-gateway/.env ==="

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env ABSENT — créez-le :"
  echo "   cp /opt/opays-classroom-gateway/.env.example /opt/opays-classroom-gateway/.env"
  echo "   nano /opt/opays-classroom-gateway/.env   (remplir les 5 valeurs)"
  exit 1
fi

echo "✅ .env présent — clés :"
grep -oE '^[A-Z_]+=' "$ENV_FILE" || echo "   ⚠️  aucune variable"

# Placeholder détecté ?
if grep -q "PLACEHOLDER" "$ENV_FILE"; then
  echo "❌ ENCORE DES PLACEHOLDERS — remplacez-les par les vraies valeurs !"
  exit 1
fi

# Chaque clé requise est-elle remplie (non vide) ?
for key in GOOGLE_CLIENT_ID GOOGLE_CLIENT_SECRET ADMIN_USER ADMIN_PASS; do
  val=$(grep -E "^$key=" "$ENV_FILE" | head -1 | cut -d= -f2-)
  if [ -z "$val" ]; then
    echo "❌ $key est VIDE"
    exit 1
  fi
done
echo "✅ 4 clés obligatoires remplies (valeurs non affichées)"

# Le conteneur utilise-t-il ces valeurs ?
echo ""
echo "=== Conteneur actuel ==="
docker exec opays-classroom-gateway sh -c 'echo "ID conteneur : $(echo $GOOGLE_CLIENT_ID | cut -c1-15)..."' 2>/dev/null
echo "⚠️  Si 'PLACEHOLDER' apparaît → relancez le déploiement :"
echo "   bash /opt/opays-classroom-gateway/deploy-gateway.sh"
