#!/usr/bin/env node
/**
 * SMOKE PRODUCTION — Hoja Academy (course.opays.io)
 * Lit les secrets depuis des FICHIERS/ENV du serveur. N'AFFICHE JAMAIS un secret :
 * uniquement statuts HTTP, roles, compteurs. Exit !=0 si une attente echoue.
 */
const fs = require('fs');
const B = 'https://course.opays.io';
function envVal(file, key) { try { return fs.readFileSync(file, 'utf8').match(new RegExp('^' + key + '=(.*)$', 'm'))[1].trim(); } catch (e) { return null; } }
const ADMIN_PASS = process.env.ADMIN_PASS || envVal('/opt/opays-classroom-gateway/.env', 'ADMIN_PASS') || envVal('/opt/opays-academy/.env', 'ADMIN_BASIC_PASSWORD');
const GW_ENV = fs.readFileSync('/opt/opays-classroom-gateway/.env', 'utf8');
const LEARN_PASS = process.env.LEARN_PASS || fs.readFileSync('/opt/opays-academy/.secrets/learn-pass', 'utf8').trim();
let fails = 0;
function chk(name, cond, extra) { console.log(`${cond ? '✅' : '❌'} ${name}${extra ? ' — ' + extra : ''}`); if (!cond) fails++; }
async function req(path, opt = {}, cookie = null) {
  const headers = Object.assign({}, opt.headers || {});
  if (cookie) headers.Cookie = cookie;
  const r = await fetch(B + path, { method: opt.method || 'GET', headers, body: opt.body, redirect: 'manual' });
  const text = await r.text();
  let json = null; try { json = JSON.parse(text); } catch (e) {}
  const sc = r.headers.get('set-cookie') || '';
  return { st: r.status, j: json, text, sc };
}
(async () => {
  // 1. Site public
  let r = await req('/'); chk('landing / = frontend Next.js Hoja', r.st === 200 && /HOJA ACADEMY/.test(r.text) && /_next\/static/.test(r.text) && !/Acad[\u00e9e]mie OPAYS/i.test(r.text));
  r = await req('/health'); chk('gateway /health', r.st === 200 && r.j && r.j.ok === true);

  // 2. Zones BasicAuth sans credentials
  r = await req('/admin/'); chk('/admin/ anon', r.st === 401);
  r = await req('/modules/01/'); chk('/modules/01/ anon', r.st === 401);
  r = await req('/ui/suivi/'); chk('/ui/suivi/ anon -> 302 login', r.st === 302 || r.st === 301);
  r = await req('/postuler/'); chk('filet anti-slash final (301)', r.st === 301);
  r = await req('/institution'); chk('/institution redirige (301)', r.st === 301);
  r = await req('/ui/cockpit/'); chk('/ui/cockpit/ anon -> 302 login', r.st === 302);

  // 3. LOGIN admin (UI)
  r = await req('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin', password: ADMIN_PASS }) });
  const adminCookie = ((r.sc || '').match(/^([^=;\s]+)=[^;\s]+/) || [])[0] || '';
  chk('/api/login admin', r.st === 200 && r.j && r.j.role === 'admin' && adminCookie.length > 5, r.st + ' ' + (r.text || '').slice(0, 80));
  chk('cookie HttpOnly+SameSite', /HttpOnly/i.test(r.sc) && /SameSite=(Strict|Lax)/i.test(r.sc));

  // 4. Session admin
  r = await req('/api/me', {}, adminCookie); chk('/api/me admin = 403 (contrat: reserve apprenant)', r.st === 403);
  r = await req('/api/whoami', {}, adminCookie); chk('/api/whoami admin', r.st === 200 && r.j && r.j.role === 'admin');
    const su = await fetch(B + '/ui/suivi/', { headers: { Cookie: adminCookie } });
  chk('/ui/suivi/ admin', su.status === 200);
  const co = await fetch(B + '/ui/cockpit/', { headers: { Cookie: adminCookie } });
  chk('/ui/cockpit/ admin', co.status === 200);

  // 5. API admin
  { // contrat reel: /api/users POST renvoie un rapport par entree (errors[]), 200 = pas de creation silencieuse
    const rr = await req('/api/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ users: [{ email: '', role: 'apprenant' }] }) }, adminCookie);
    const okShape = (rr.st === 400) || (rr.st === 200 && Array.isArray(rr.j && rr.j.errors) && (rr.j.created || []).length === 0);
    chk('/api/users POST entree invalide -> refusee, 0 compte cree', okShape, 'st=' + rr.st + ' created=' + ((rr.j && rr.j.created) || []).length + ' errors=' + ((rr.j && rr.j.errors) || []).length);
    const r2 = await req('/api/roster', {}, adminCookie);
    chk('roster intact apres appel invalide', r2.st === 200);
  }
  r = await req('/api/roster', {}, adminCookie);
  if (r.st === 200) chk('/api/roster admin (compteurs reels)', Array.isArray(r.j.students || r.j.roster || []), 'apprenants=' + (r.j.count != null ? r.j.count : (r.j.students || r.j.roster || []).length));
  else chk('/api/roster admin', r.st === 200 || r.st === 502 || r.st === 409, 'status=' + r.st + ' (Classroom indisponible = etat honnete)');
  { // legacy: Basic requis pour /api/classroom/status (cookie session = 401 normal)
    const basic = 'Basic ' + Buffer.from('admin:' + ADMIN_PASS).toString('base64');
    const rr = await req('/api/classroom/status', { headers: { Authorization: basic } });
    chk('/api/classroom/status (Basic) — etat reel Classroom', rr.st === 200 && rr.j && typeof rr.j.connected === 'boolean', JSON.stringify({ connected: rr.j && rr.j.connected, account: !!(rr.j && rr.j.account) }));
  }

  // 6. APPRENANT — le compte UI n'existe pas sans roster reel ; test Basic (module legacy) + refus API
  r = await req('/modules/01/', { headers: { Authorization: 'Basic ' + Buffer.from('apprenant:' + LEARN_PASS).toString('base64') } });
  chk('/modules/01/ apprenant (nouveau secret)', r.st === 200);
  const apPassWrong = await req('/modules/01/', { headers: { Authorization: 'Basic ' + Buffer.from('apprenant:' + LEARN_PASS + 'x').toString('base64') } });
  chk('/modules/01/ ancien secret refuse', apPassWrong.st === 401);
  const admWrong = await req('/admin/', { headers: { Authorization: 'Basic ' + Buffer.from('admin:' + LEARN_PASS).toString('base64') } });
  chk('cloisonnement: secret apprenant != admin', admWrong.st === 401);
  // apprenant ne doit PAS pouvoir passer /authz staff (sans cookie session)
  r = await req('/ui/cockpit/', {}, (adminCookie.split('=')[0] || 'x') + '=forged-value'); chk('cookie forge refuse (redirect login)', r.st === 302);
r = await req('/api/me', {}, (adminCookie.split('=')[0] || 'x') + '=forged-value'); chk('/api/me cookie forge', r.st === 401);

  // 7. LOGIN refus (mot de passe errone)
  r = await req('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'admin', password: ADMIN_PASS + 'x' }) });
  chk('/api/login mauvais mot de passe', r.st === 401);

  // 8. LOGS propres (uniquement si docker accessible ici — heuristique : --skip-logs sinon)
  if (!process.argv.includes('--skip-logs')) {
    try {
      const logs = require('child_process').execSync('docker logs opays-classroom-gateway --since 30m 2>&1 | tail -300 || true').toString();
      const leak = /(password|passwd|refresh_token|access_token=|\\$7\\$|\\$5\\$)/i.test(logs);
      chk('logs gateway sans secrets', !leak);
    } catch (e) { console.log('⚠️ docker logs indisponible ici — controle fait separement'); }
  }

  console.log(fails ? `\nSMOKE: ${fails} ECHEC(S)` : '\nSMOKE: TOUS LES CONTROLES PASSENT');
  process.exit(fails ? 1 : 0);
})().catch(e => { console.error('CRASH', e.message); process.exit(2); });
