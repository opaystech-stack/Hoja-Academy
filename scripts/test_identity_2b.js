/**
 * HOJA ACADEMY — Test backend identity-api (P2B-1) — MOCK/TEST ONLY.
 * Lance le VRAI gateway server.js (env fake, users.json temp) et vérifie:
 *  - login scrypt (admin bootstrap depuis ADMIN_PASS), 401 mauvais mot de passe, anti brute-force 429
 *  - roles: apprenant -> /api/me 200, /api/progress 403 ; formateur -> progress 200 (Classroom mocke), me 403
 *  - session cookie HttpOnly ; logout invalide
 *  - /authz subrequest (campus exige apprenant+)
 * Classroom: on mock classroomGet via TOKEN absent -> les endpoints progress/roster doivent repondre
 *  proprement (empty/partial) SANS crash. On verifie aussi la reponse 403 ecrite (ALLOW_CLASSROOM_WRITE off).
 * Usage: node scripts/test_identity_2b.js   (exit 0 = OK)
 */
'use strict';
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const PORT = 9123;
const tmpUsers = path.join(os.tmpdir(), 'hoja-test-users-' + Date.now() + '.json');
const tmpToken = path.join(os.tmpdir(), 'hoja-test-token-' + Date.now() + '.json');
const GW = path.join(__dirname, '..', 'deploy', 'classroom-gateway', 'server.js');

let total = 0, passed = 0; const failures = [];
const check = (name, ok, d) => { total++; if (ok) passed++; else failures.push(name + (d ? ' :: ' + d : '')); console.log(`  ${ok ? '✅' : '❌'} ${name}${!ok && d ? ' [' + d + ']' : ''}`); };

async function req(method, p, { body, cookie, ip } = {}) {
  const res = await fetch(`http://127.0.0.1:${PORT}${p}`, {
    method, headers: Object.assign(
      body ? { 'Content-Type': 'application/json' } : {},
      cookie ? { Cookie: cookie } : {},
      { 'X-Forwarded-For': ip || 'test-ip-clean' }
    ),
    body: body ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  let j = null; const txt = await res.text();
  try { j = JSON.parse(txt); } catch (_) {}
  return { status: res.status, j, txt, setCookie: res.headers.get('set-cookie') || '' };
}
const basic = Buffer.from('admin:test-admin-pass-2b').toString('base64');

(async () => {
  if (fs.existsSync(tmpUsers)) fs.rmSync(tmpUsers);
  if (fs.existsSync(tmpToken)) fs.rmSync(tmpToken);
  const env = Object.assign({}, process.env, {
    PORT: String(PORT),
    GOOGLE_CLIENT_ID: '', GOOGLE_CLIENT_SECRET: '',
    ADMIN_USER: 'admin', ADMIN_PASS: 'test-admin-pass-2b',
    ALLOWED_ADMIN_EMAILS: 'tester@example.test', ALLOW_BOOTSTRAP: '0',
    ALLOW_CLASSROOM_WRITE: '0', ALLOW_CALENDAR_WRITE: '0',
    REDIRECT_BASE: 'http://127.0.0.1:' + PORT,
    TOKEN_FILE: tmpToken, USERS_FILE: tmpUsers,
    CANDIDATES_FILE: path.join(os.tmpdir(), 'hoja-test-cand-' + Date.now() + '.json'),
    SETTINGS_FILE: path.join(os.tmpdir(), 'hoja-test-set-' + Date.now() + '.json'),
    CLASSROOM_COURSE_ID: '', CLASSROOM_URL: '', COHORT_START: '',
  });
  const child = spawn(process.execPath, [GW], { env, stdio: ['ignore', 'pipe', 'pipe'] });
  child.stdout.on('data', () => {});
  child.stderr.on('data', d => { /* gateway logs */ });
  await new Promise(r => setTimeout(r, 1200));
  try {
    // 1) bootstrap admin
    let r = await req('POST', '/api/login', { body: { email: 'admin', password: 'test-admin-pass-2b' } });
    check('login admin bootstrap (scrypt) -> 200 role admin', r.status === 200 && r.j && r.j.role === 'admin', JSON.stringify(r.j));
    check('cookie HttpOnly+SameSite', /HttpOnly/i.test(r.setCookie) && /SameSite=Lax/i.test(r.setCookie), r.setCookie.slice(0, 80));
    const adminCookie = r.setCookie.split(';')[0];
    fs.writeFileSync(tmpUsers + '.probe', 'x'); // noop probe fs ok
    check('users.json cree (bootstrap)', fs.existsSync(tmpUsers));

    // 2) mauvais mot de passe + brute force (IP isolee pour ne pas polluer le reste des tests)
    r = await req('POST', '/api/login', { body: { email: 'admin', password: 'WRONGpass123' }, ip: '10.9.9.9' });
    check('mauvais mot de passe -> 401', r.status === 401);
    for (let i = 0; i < 5; i++) r = await req('POST', '/api/login', { body: { email: 'admin', password: 'WRONGpass123' }, ip: '10.9.9.9' });
    check('anti brute-force -> 429', r.status === 429, 'status ' + r.status);
    r = await req('POST', '/api/login', { body: { email: 'admin', password: 'WRONGpass123' }, ip: '10.9.9.8' });
    check('IP differente non bloquee (401 et pas 429)', r.status === 401);

    // 3) legacy Basic admin toujours OK sur /api/classroom/status (non regression)
    r = await fetch(`http://127.0.0.1:${PORT}/api/classroom/status`, { headers: { Authorization: 'Basic ' + basic } });
    const st = await r.json().catch(() => ({}));
    check('legacy Basic admin -> /api/classroom/status 200 (non-régression)', r.status === 200 && st.connected === false, 'status ' + r.status);

    // 4) routes sans auth -> 401
    r = await req('GET', '/api/progress');
    check('/api/progress sans auth -> 401', r.status === 401);
    r = await req('GET', '/api/me');
    check('/api/me sans auth -> 403 (session requise)', r.status === 403 || r.status === 401);

    // 5) creer formateur + apprenant via /api/users (admin)
    r = await req('POST', '/api/users', { cookie: adminCookie, body: { users: [
      { email: 'FORM@exemple.test', name: 'Form Test', role: 'formateur', password: 'Passform!2bTest' },
      { email: 'apprenant1@exemple.test', name: 'Apprenant Un', role: 'apprenant' },
    ] } });
    check('POST /api/users (admin) -> 2 crees', r.status === 200 && r.j && r.j.created && r.j.created.length === 2, JSON.stringify(r.j && r.j.errors));
    r = await req('POST', '/api/users', { cookie: adminCookie, body: { users: [{ email: 'x@y.test', name: 'X', role: 'admin' }] } });
    check('creation role admin refusee', r.status === 200 && r.j.errors && r.j.errors.length === 1);

    // 6) login formateur
    r = await req('POST', '/api/login', { body: { email: 'form@exemple.test', password: 'Passform!2bTest' } });
    check('login formateur (email casse insensible) -> role formateur', r.status === 200 && r.j.role === 'formateur', JSON.stringify(r.j));
    const formCookie = r.setCookie.split(';')[0];
    r = await req('GET', '/api/progress', { cookie: formCookie });
    check('formateur -> /api/progress 200 (classe non configuree = empty honest)', r.status === 200 && r.j && (r.j.empty || r.j.rows), 'status ' + r.status);
    r = await req('GET', '/api/me', { cookie: formCookie });
    check('formateur -> /api/me 403 (reserve apprenant)', r.status === 403);
    r = await req('POST', '/api/users', { cookie: formCookie, body: { users: [{ email: 'z@y.test', name: 'Z', role: 'apprenant' }] } });
    check('formateur -> /api/users 403', r.status === 403);

    // 7) apprenant via import (mot de passe initial)
    r = await req('POST', '/api/roster/import', { cookie: adminCookie, body: { learners: [{ name: 'Awa Test', email: 'awa@test.example' }] } });
    const imp = r.j && r.j.imported ? r.j.imported[0] : null;
    check('import roster -> 1 compte avec mot de passe initial', !!imp && !!imp.initialPassword, JSON.stringify(r.j && r.j.skipped));
    r = await req('POST', '/api/login', { body: { email: 'awa@test.example', password: imp.initialPassword } });
    check('login apprenant importe -> role apprenant', r.status === 200 && r.j.role === 'apprenant', JSON.stringify(r.j));
    const learnCookie = r.setCookie.split(';')[0];
    r = await req('GET', '/api/me', { cookie: learnCookie });
    check('apprenant -> /api/me 200 (empty honest sans classe)', r.status === 200 && r.j && Array.isArray(r.j.modules) && r.j.modules.length === 18 && r.j.empty && r.j.empty.length > 0, JSON.stringify(r.j && r.j.empty));
    r = await req('GET', '/api/progress', { cookie: learnCookie });
    check('apprenant -> /api/progress 403', r.status === 403);
    r = await req('POST', '/api/feedback', { cookie: learnCookie, body: { courseWorkId: 'a', submissionId: 'b' } });
    check('apprenant -> /api/feedback 403', r.status === 403);

    // 7b) changement de mot de passe par l'apprenant
    r = await req('POST', '/api/password', { cookie: learnCookie, body: { currentPassword: 'FAKE', newPassword: 'NouveauPass!2b' } });
    check('password: mauvais courant -> 401', r.status === 401);
    r = await req('POST', '/api/password', { cookie: learnCookie, body: { currentPassword: imp.initialPassword, newPassword: 'court' } });
    check('password: trop court -> 400', r.status === 400);
    r = await req('POST', '/api/password', { cookie: learnCookie, body: { currentPassword: imp.initialPassword, newPassword: 'NouveauPass!2bX' } });
    check('password: changement OK', r.status === 200 && r.j && r.j.ok, JSON.stringify(r.j));
    r = await req('POST', '/api/login', { body: { email: 'awa@test.example', password: 'NouveauPass!2bX' } });
    check('re-login avec nouveau mot de passe', r.status === 200 && r.j.role === 'apprenant');
    r = await req('GET', '/api/me', { cookie: r.setCookie.split(';')[0] });
    check('mustChange efface apres changement', r.status === 200 && r.j && r.j.identity && r.j.identity.mustChange === false, JSON.stringify(r.j && r.j.identity));

    // 8) authz subrequest nginx
    r = await fetch(`http://127.0.0.1:${PORT}/authz`, { headers: { Cookie: learnCookie, 'X-Original-Uri': '/ui/campus/' }, redirect: 'manual' });
    check('/authz apprenant -> /ui/campus/ = 200', r.status === 200);
    r = await fetch(`http://127.0.0.1:${PORT}/authz`, { headers: { 'X-Original-Uri': '/ui/campus/' }, redirect: 'manual' });
    check('/authz anonyme -> 401', r.status === 401);
    r = await fetch(`http://127.0.0.1:${PORT}/authz`, { headers: { Cookie: learnCookie, 'X-Original-Uri': '/ui/suivi/' }, redirect: 'manual' });
    check('/authz apprenant -> /ui/suivi/ = 403', r.status === 403);

    // 9) logout invalide la session
    r = await req('POST', '/api/logout', { cookie: learnCookie });
    check('logout -> 204', r.status === 204);
    r = await req('GET', '/api/me', { cookie: learnCookie });
    check('apres logout /api/me refuse', r.status === 403 || r.status === 401);

    // 10) ecriture Classroom refusee honnetement (gate + classe absente)
    r = await req('POST', '/api/roster/invite', { cookie: adminCookie, body: { emails: ['a@b.c'] } });
    check('invite sans scope rosters -> 409 explicite (jamais simule)', r.status === 409 && /consentement|scope/i.test(JSON.stringify(r.j)), JSON.stringify(r.j));
    r = await req('POST', '/api/feedback', { cookie: adminCookie, body: { courseWorkId: '1', submissionId: '2' } });
    check('feedback sans ALLOW_CLASSROOM_WRITE -> 403', r.status === 403);

    // 10b) candidatures & facturation — garde admin + honnetete (FORM_ID non configure = sync désactivée, jamais simulée)
    r = await req('GET', '/api/candidates', { cookie: adminCookie });
    check('GET /api/candidates admin -> 200 total=0 + sync note sans FORM_ID', r.status === 200 && r.j.total === 0 && /FORM_ID/.test(JSON.stringify(r.j.sync)), JSON.stringify(r.j).slice(0, 90));
    r = await req('GET', '/api/candidates', { cookie: 'hojad=nonsense' });
    check('GET /api/candidates sans session valide -> 401', r.status === 401);
    r = await req('PATCH', '/api/candidates/INCONNU', { cookie: adminCookie, body: { status: 'admis' } });
    check('PATCH candidature inconnue -> 404', r.status === 404);
    r = await req('POST', '/api/candidates/INCONNU/admit', { cookie: adminCookie });
    check('admit candidature inconnue -> 404', r.status === 404);
    r = await req('POST', '/api/users/reset-password', { cookie: learnCookie || '', body: { email: 'awa@test.example' } });
    check('reset mdp par apprenant -> 401/403', r.status === 401 || r.status === 403);
    r = await req('POST', '/api/users/reset-password', { cookie: adminCookie, body: { email: 'inexistant@x.io' } });
    check('reset mdp compte inconnu -> 404', r.status === 404);
    r = await req('POST', '/api/users/reset-password', { cookie: adminCookie, body: { email: 'admin' } });
    check('reset mdp du compte admin -> refuse 400', r.status === 400);
    r = await req('GET', '/api/progress', { cookie: learnCookie || '' });
    check('progress par apprenant -> 403 (ne voit pas les autres)', r.status === 403 || r.status === 401);
    r = await req('GET', '/api/settings/billing', { cookie: adminCookie });
    check('GET billing -> 200 (vide)', r.status === 200 && r.j && typeof r.j.billing === 'object');
    r = await req('POST', '/api/settings/billing', { cookie: adminCookie, body: { price: -5 } });
    check('billing prix negatif -> 400', r.status === 400);
    r = await req('POST', '/api/settings/billing', { cookie: adminCookie, body: { price: 250000, currency: 'USD' } });
    check('billing enregistre (interne)', r.status === 200 && r.j.billing.price === 250000);
    r = await req('POST', '/api/settings/billing', { cookie: learnCookie || '', body: { price: 1 } });
    check('billing par apprenant -> 403', r.status === 403 || r.status === 401);

    // 11) no-crash: status/whoami
    r = await req('GET', '/api/whoami', { cookie: adminCookie });
    check('whoami session admin', r.status === 200 && r.j.role === 'admin');
    r = await req('GET', '/health');
    check('/health public ok', r.status === 200);
  } catch (e) {
    check('execution sans exception', false, e.message);
  } finally {
    child.kill();
    try { fs.rmSync(tmpUsers, { force: true }); fs.rmSync(tmpToken, { force: true }); fs.rmSync(tmpUsers + '.probe', { force: true }); } catch (_) {}
    console.log('\n  Tests : ' + total + ' | Reussis : ' + passed + ' | Echecs : ' + (total - passed));
    if (failures.length) { failures.forEach(f => console.log('   ❌ ' + f)); process.exitCode = 1; }
    else console.log('  ✅ IDENTITY-API 2B : roles, sessions, brute-force, authz, gates — OK');
  }
})();
