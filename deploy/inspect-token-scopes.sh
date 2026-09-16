#!/bin/bash
# OPAYS ACADEMY — Introspection des scopes RÉELS de l'access token (vérité Google)
set -uo pipefail
timeout 30 ssh -i ~/.ssh/kiveclair_hostinger_ed25519 -o ConnectTimeout=10 root@76.13.58.5 '
docker exec opays-classroom-gateway node -e "
const t=JSON.parse(require(\"fs\").readFileSync(\"/data/token.json\",\"utf8\"));
const https=require(\"https\");
https.get(\"https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=\"+encodeURIComponent(t.access_token),r=>{
  let d=\"\";r.on(\"data\",c=>d+=c);r.on(\"end\",()=>{const j=JSON.parse(d);console.log(\"=== Scopes RÉELS de l\\'access token ===\");(j.scope||\"\").split(\" \").forEach(s=>console.log(\" -\",s));console.log(\"email:\",j.email||\"?\");});
});
"
' 2>&1 | head -14