// Introspection des scopes RÉELS de l'access token (vérité Google)
const fs = require('fs');
const https = require('https');
const t = JSON.parse(fs.readFileSync('/data/token.json', 'utf8'));
https.get('https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=' + encodeURIComponent(t.access_token), (r) => {
  let d = '';
  r.on('data', (c) => (d += c));
  r.on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log('=== Scopes RÉELS de l\'access token ===');
      (j.scope || '').split(' ').forEach((s) => console.log(' -', s));
      console.log('email:', j.email || '?');
    } catch (e) { console.log('Réponse non-JSON:', d.slice(0, 200)); }
  });
});
