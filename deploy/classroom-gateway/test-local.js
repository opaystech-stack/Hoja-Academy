/**
 * Test local du gateway OAuth — spawn le serveur, teste les endpoints, kill.
 */
'use strict';
const { spawn } = require('child_process');
const path = require('path');

const SRV = path.join(__dirname, 'server.js');
const PORT = 9901;

const child = spawn(process.execPath, [SRV], {
  cwd: __dirname,
  env: {
    ...process.env,
    GOOGLE_CLIENT_ID: 'test-client-id',
    GOOGLE_CLIENT_SECRET: 'test-secret',
    ADMIN_USER: 'admin',
    ADMIN_PASS: 'test',
    PORT: String(PORT),
    TOKEN_FILE: path.join(require('os').tmpdir(), 'token-test.json'),
    REDIRECT_BASE: 'https://course.opays.io',
  },
});

// Capturer les logs du serveur pour diagnostic
child.stdout.on('data', d => console.log('[srv]', d.toString().trim()));
child.stderr.on('data', d => console.log('[srv-err]', d.toString().trim()));
child.on('exit', (code, sig) => console.log(`[srv] exited code=${code} sig=${sig}`));

const results = [];
function check(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? ' → ' + detail : ''}`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  await sleep(1200);
  try {
    // 1. health (public)
    const h = await fetch(`http://127.0.0.1:${PORT}/health`);
    const hb = await h.json();
    check('health', h.status === 200 && hb.ok === true, `HTTP ${h.status}`);

    // 2. status sans auth → 401
    const s1 = await fetch(`http://127.0.0.1:${PORT}/api/classroom/status`);
    check('status sans auth → 401', s1.status === 401, `HTTP ${s1.status}`);

    // 3. status avec auth
    const auth = 'Basic ' + Buffer.from('admin:test').toString('base64');
    const s2 = await fetch(`http://127.0.0.1:${PORT}/api/classroom/status`, { headers: { Authorization: auth } });
    const s2b = await s2.json();
    check('status avec auth', s2.status === 200 && s2b.connected === false && s2b.redirectUri === 'https://course.opays.io/oauth/callback',
      JSON.stringify(s2b));

    // 4. oauth/start SANS auth → 302 Google (public, plus de Basic Auth)
    const r = await fetch(`http://127.0.0.1:${PORT}/oauth/start`, { redirect: 'manual' });
    check('oauth/start sans auth → 302 Google', r.status === 302 && (r.headers.get('location') || '').startsWith('https://accounts.google.com/'),
      `HTTP ${r.status} → ${(r.headers.get('location') || '').slice(0, 80)}...`);

    // 5. callback SANS auth → 400 état invalide (public, pas de 401)
    const c = await fetch(`http://127.0.0.1:${PORT}/oauth/callback?code=bad&state=bad`);
    check('callback sans auth → 400 (état invalide)', c.status === 400, `HTTP ${c.status}`);

    // 6. cours sans connexion → 502 propre
    const cr = await fetch(`http://127.0.0.1:${PORT}/api/classroom/courses`, { headers: { Authorization: auth } });
    const crb = await cr.json();
    check('courses sans connexion → 502', cr.status === 502 && !!crb.error, `HTTP ${cr.status}`);

    // 7. route inconnue → 404
    const nf = await fetch(`http://127.0.0.1:${PORT}/inconnue`, { headers: { Authorization: auth } });
    check('route inconnue → 404', nf.status === 404, `HTTP ${nf.status}`);
  } catch (e) {
    console.log('❌ ERREUR TEST:', e.message);
    if (e.cause) console.log('   cause:', e.cause.message);
  } finally {
    child.kill();
    const failed = results.filter(r => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} tests OK`);
    process.exit(failed ? 1 : 0);
  }
})();
