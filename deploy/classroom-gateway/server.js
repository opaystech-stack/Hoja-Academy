/**
 * OPAYS ACADEMY — Passerelle Google Classroom (OAuth + API)
 *
 * Serveur Node NATIF (zéro dépendance) exposé derrière Traefik :
 *   GET  /health                       → vérification de vie
 *   GET  /oauth/start                  → initie le flux OAuth Google (Basic Auth admin requis)
 *   GET  /oauth/callback               → échange le code → stocke le refresh token
 *   GET  /api/classroom/status         → statut de connexion + info du compte
 *   GET  /api/classroom/courses        → liste des cours ACTIVE
 *   GET  /api/classroom/students?courseId=X → liste des inscrits d'un cours
 *
 * Sécurité :
 *   - Client ID / Secret : variables d'environnement UNIQUEMENT (Dokploy) — jamais dans le code
 *   - Toutes les routes (sauf /health) exigent l'authentification Basic Admin
 *   - Le refresh token est stocké hors conteneur (volume) — jamais dans Git
 *   - Scopes : lecture Classroom + ecriture topics/coursework (gates ALLOW_*_WRITE)
 *     + gmail.send + calendar — PAS « lecture seule » ; reduire via GOOGLE_SCOPES si besoin.
 *
 * Variables d'environnement requises :
 *   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, ADMIN_USER, ADMIN_PASS,
 *   REDIRECT_BASE (ex. https://course.opays.io), TOKEN_FILE (défaut /data/token.json)
 */
'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');

// ─── Configuration ───────────────────────────────────────────────────
const PORT = process.env.PORT || 9001;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const ADMIN_USER = process.env.ADMIN_USER || '';
const ADMIN_PASS = process.env.ADMIN_PASS || '';
// Emails Google autorisés à s'authentifier (séparés par des virgules).
// ALLOW_BOOTSTRAP=1 uniquement pour le TOUT PREMIER consentement (mode explicite) ;
// sinon vide = REFUS (le 1er compte connecté ne peut plus devenir admin par accident).
const ALLOWED_ADMIN_EMAILS = (process.env.ALLOWED_ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
const ALLOW_BOOTSTRAP = process.env.ALLOW_BOOTSTRAP === '1';
const REDIRECT_BASE = (process.env.REDIRECT_BASE || 'https://course.opays.io').replace(/\/+$/, '');
const TOKEN_FILE = process.env.TOKEN_FILE || '/data/token.json';

// REDIRECT URI EXACTE (à déclarer dans Google Cloud Console — OAuth Web Client) :
const REDIRECT_URI = `${REDIRECT_BASE}/oauth/callback`;
// Scopes : Classroom (lecture/écriture pour personnalisation) + Gmail (envoi)
// + Calendar (événements Meet) + Forms (lecture réponses)
const SCOPES = [
  'https://www.googleapis.com/auth/classroom.courses',
  'https://www.googleapis.com/auth/classroom.rosters.readonly',
  'https://www.googleapis.com/auth/classroom.topics',
  'https://www.googleapis.com/auth/classroom.coursework.students',
  'https://www.googleapis.com/auth/classroom.courseworkmaterials',
  'https://www.googleapis.com/auth/classroom.announcements',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/forms.responses.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'openid',
].join(' ');

const AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const CLASSROOM_API = 'https://classroom.googleapis.com/v1';
const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1';
const CALENDAR_API = 'https://www.googleapis.com/calendar/v3';
const FORMS_API = 'https://forms.googleapis.com/v1';

// ─── MODE FIXTURES (TEST ONLY — JAMAIS en production) ────────────────
// GATEWAY_FIXTURES=1 : le TRANSPORT Google est remplace par des fixtures, mais tout le
// code metier reel tourne (identity-api, parsing, mapping, progression, feedback ecrit).
// Sert aussi les fichiers ui/* en statique pour les tests E2E navigateur.
const FIXTURES = process.env.GATEWAY_FIXTURES === '1';
const FIXTURE_FILE = process.env.GATEWAY_FIXTURE_FILE || path.join(__dirname, 'fixtures.test.json');
const FIXTURE_ROSTERS = process.env.FIXTURE_ROSTERS !== '0'; // simulation re-consentement rosters
const SITE_ROOT = path.resolve(__dirname, '..', '..');
function fixLoad() {
  try { return JSON.parse(fs.readFileSync(FIXTURE_FILE, 'utf8')); }
  catch (_) { return { students: [], courseWork: [], studentSubmissions: [], invitations: [] }; }
}
function fixSave(d) { fs.writeFileSync(FIXTURE_FILE, JSON.stringify(d, null, 2), 'utf8'); }
function fixtureGet(pn) {
  const d = fixLoad();
  const cid = process.env.CLASSROOM_COURSE_ID || 'fixture-course';
  let m;
  if (/^\/courses\?/.test(pn)) return { courses: [{ id: cid, name: 'HOJA ACADEMY — Cohorte 01 (ENVIRONNEMENT DE TEST)', section: 'TEST', room: 'TEST', courseState: 'ACTIVE' }] };
  if (/^\/courses\/[^/]+\/students\?/.test(pn)) return { students: d.students || [] };
  if (/^\/invitations\?/.test(pn)) return { invitations: (d.invitations || []).map(v => ({ id: v.id, courseId: v.courseId, recipientEmail: v.inviteeEmail || (v.profile && v.profile.emailAddress) || '', role: v.role, acceptanceState: v.acceptanceState || 'PENDING' })) };
  if (/^\/courses\/[^/]+\/courseWork\?/.test(pn)) return { courseWork: d.courseWork || [] };
  if ((m = pn.match(/^\/courses\/[^/]+\/courseWork\/(-|[^/?]+)\/(students|studentSubmissions)\?/))) {
    const id = m[1];
    return { studentSubmissions: (d.studentSubmissions || []).filter(s => id === '-' || s.courseWorkId === id) };
  }
  throw new Error('fixture GET non couvert: ' + pn);
}
async function fixtureHttpJson(u, options = {}) {
  if (!u.startsWith(CLASSROOM_API)) return httpJson(u, options); // non-Classroom : reel (hormis calendrier/forms hors scope E2E)
  const pn = u.slice(CLASSROOM_API.length);
  const method = options.method || 'GET';
  if (method === 'GET') return fixtureGet(pn);
  const d = fixLoad();
  let m;
  if (method === 'POST' && /^\/courses\/[^/]+\/invitations$/.test(pn)) {
    const body = JSON.parse(options.body || '{}');
    d.invitations = d.invitations || [];
    const inv = { id: 'inv-' + (d.invitations.length + 1), inviteeEmail: body.inviteeEmail, courseId: body.courseId, role: body.role || 'STUDENT', time: new Date().toISOString() };
    d.invitations.push(inv); fixSave(d);
    return inv;
  }
  if (method === 'POST' && (m = pn.match(/^\/courses\/[^/]+\/courseWork\/[^/]+\/studentSubmissions\/([^/?]+):return$/))) {
    const s = (d.studentSubmissions || []).find(x => x.id === m[1]);
    if (!s) throw new Error('fixture: soumission inconnue ' + m[1]);
    s.state = 'RETURNED'; s.updateTime = new Date().toISOString(); fixSave(d);
    return s;
  }
  if (method === 'PATCH' && (m = pn.match(/^\/courses\/[^/]+\/courseWork\/[^/]+\/studentSubmissions\/([^/?]+)/))) {
    const s = (d.studentSubmissions || []).find(x => x.id === m[1]);
    if (!s) throw new Error('fixture: soumission inconnue ' + m[1]);
    const b = JSON.parse(options.body || '{}');
    if (typeof b.assignedGrade === 'number') s.assignedGrade = b.assignedGrade;
    if (typeof b.draftGrade === 'number') s.draftGrade = b.draftGrade;
    s.updateTime = new Date().toISOString(); fixSave(d);
    return s;
  }
  throw new Error('fixture: operation non couverte ' + method + ' ' + pn);
}
const FIXTURE_SCOPES = SCOPES + (FIXTURE_ROSTERS ? ' https://www.googleapis.com/auth/classroom.rosters' : '');
function fixtureToken() {
  return { access_token: 'fixture', refresh_token: 'fixture', expires_at: Date.now() + 86400000, scope: FIXTURE_SCOPES, admin_email: 'fixture-admin@example.test' };
}
function serveStatic(req, res, pathname) {
  if (!FIXTURES || req.method !== 'GET') return false;
  if (pathname.includes('..')) { res.writeHead(400); res.end('bad path'); return true; }
  const ext = path.extname(pathname);
  let file = null;
  if (pathname === '/') file = path.join(SITE_ROOT, 'ui', 'login', 'index.html');
  else if (!ext) file = path.join(SITE_ROOT, decodeURIComponent(pathname), 'index.html');
  else if (/\.(html|css|js|json|svg|png|ico|txt)$/.test(ext)) file = path.join(SITE_ROOT, decodeURIComponent(pathname));
  if (file && fs.existsSync(file) && fs.statSync(file).isFile()) {
    const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain' };
    // MIME selon l'extension du FICHIER RESOLU (le pathname '/ui/x/' n'a pas d'extension :
    // sinon Chrome telecharge au lieu de rendre -> ERR_ABORTED).
    const fext = path.extname(file).toLowerCase();
    res.writeHead(200, { 'Content-Type': types[fext] || types[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(fs.readFileSync(file));
    return true;
  }
  return false;
}


// ─── État OAuth : state AUTO-VÉRIFIÉ (signature HMAC) ───────────────────
// Historique: un state en Map mémoire consommait le state à la 1re requête
// callback. Tout rejeu (rechargement Chrome, retour arrière, double clic,
// préchargement Google) retombait sur « État invalide » et masquait la vraie
// erreur du premier passage. Le state est désormais un jeton signé (nonce.t.m
// + HMAC tronqué), vérifiable sans état : robuste au multi-processus, aux
// restarts et aux rejets intermédiaires. La FRAÎCHEUR (10 min) reste bornée,
// et l'anti-replay (consumed set, persisté dans /data) garantit qu'un state
// ne sert qu'une fois — la vérification d'état n'est JAMAIS désactivée.

const DATA_DIR = path.dirname(process.env.TOKEN_FILE || '/data/token.json');
const STATE_KEY_FILE = path.join(DATA_DIR, 'oauth-state.key');
const STATE_SPENT_FILE = path.join(DATA_DIR, 'oauth-state.spent.json');
const STATE_TTL_MS = 10 * 60 * 1000;

function stateKey() {
  // Cle de signature privee, persistee dans le volume /data (jamais en Git).
  try {
    const k = fs.readFileSync(STATE_KEY_FILE, 'utf8').trim();
    if (k.length >= 48) return k;
  } catch (_) {}
  const k = crypto.randomBytes(32).toString('hex');
  try { fs.mkdirSync(DATA_DIR, { recursive: true }); fs.writeFileSync(STATE_KEY_FILE, k, { mode: 0o600 }); }
  catch (e) { console.log('[oauth] avertissement: cle state non persistee (' + (e && e.code) + ')'); }
  return k;
}
function stateSig(body) {
  return crypto.createHmac('sha256', stateKey()).update(body).digest('base64url').slice(0, 10);
}
function makeState(mode) {
  const body = `${b64url(crypto.randomBytes(12))}.${Date.now().toString(36)}.${mode === 'login' ? 'l' : 'c'}`;
  return `${body}.${stateSig(body)}`;
}
function checkState(state) {
  // -> { ok:true, mode } | { ok:false, reason }  (VERIFIE sans consommer)
  if (!state || typeof state !== 'string') return { ok: false, reason: 'absent' };
  const parts = state.split('.');
  if (parts.length !== 4) return { ok: false, reason: 'format' };
  const [nonce, ts36, m, sig] = parts;
  if (!/^[A-Za-z0-9_-]{8,32}$/.test(nonce) || !/^[0-9a-z]{6,10}$/.test(ts36) || !/^[cl]$/.test(m)) return { ok: false, reason: 'format' };
  const want = stateSig(nonce + '.' + ts36 + '.' + m);
  let okSig = false;
  try { okSig = sig.length === want.length && crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(want)); } catch (_) { okSig = false; }
  if (!okSig) return { ok: false, reason: 'signature' };
  const t = parseInt(ts36, 36);
  if (!Number.isFinite(t) || Math.abs(Date.now() - t) > STATE_TTL_MS) return { ok: false, reason: 'expire' };
  return { ok: true, mode: m === 'l' ? 'login' : 'connect' };
}
let SPENT = null;
function loadSpent() {
  if (SPENT) return SPENT;
  try { SPENT = new Set(JSON.parse(fs.readFileSync(STATE_SPENT_FILE, 'utf8'))); } catch (_) { SPENT = new Set(); }
  return SPENT;
}
function consumeState(state) {
  // anti-replay : un nonce ne sert qu'une fois (persiste, survit aux restarts)
  const s = loadSpent();
  const nonce = String(state).split('.')[0];
  if (s.has(nonce)) return false;
  s.add(nonce);
  if (s.size > 300) { const arr = [...s].slice(-200); s.clear(); arr.forEach(x => s.add(x)); }
  try { fs.writeFileSync(STATE_SPENT_FILE, JSON.stringify([...s].slice(-300)), { mode: 0o600 }); } catch (_) {}
  return true;
}

// ─── Utilitaires ─────────────────────────────────────────────────────
function b64url(buf) {
  return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function httpJson(url, options = {}) {
  if (FIXTURES && String(url).startsWith(CLASSROOM_API)) return fixtureHttpJson(url, options);
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const mod = u.protocol === 'https:' ? https : http;
    const req = mod.request({
      hostname: u.hostname,
      port: u.port || 443,
      path: u.pathname + u.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      servername: u.hostname,
    }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        let body = data;
        try { body = JSON.parse(data); } catch (_) {}
        if (res.statusCode >= 400) reject(new Error(`HTTP ${res.statusCode}: ${typeof body === 'string' ? body : JSON.stringify(body)}`));
        else resolve(body);
      });
    });
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function readToken() {
  if (FIXTURES) return fixtureToken();
  try { return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8')); } catch (_) { return null; }
}
function writeToken(tok) {
  fs.mkdirSync(path.dirname(TOKEN_FILE), { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tok, null, 2), { encoding: 'utf8', mode: 0o600 });
}

// ─── Auth Basic admin ────────────────────────────────────────────────
function checkAuth(req) {
  const h = req.headers.authorization || '';
  if (!h.startsWith('Basic ')) return false;
  const [u, p] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
  return u === ADMIN_USER && p === ADMIN_PASS;
}

// ─── Réponses ────────────────────────────────────────────────────────
function send(res, code, body, headers = {}) {
  const payload = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(code, {
    'Content-Type': typeof body === 'string' ? 'text/html; charset=utf-8' : 'application/json',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(payload);
}
function authRequired(res) {
  // Realm ASCII IDENTIQUE à nginx (auth_basic "Academie OPAYS - Espace formateur") :
  // le navigateur réutilise les credentials admin sans popup supplémentaire.
  // NB : caractères ASCII uniquement — Node rejette les headers non-latin1 (ERR_INVALID_CHAR → 500).
  res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Academie OPAYS - Espace formateur"' });
  res.end('Authentification requise');
}

// Lecture du corps d'une requête (JSON)
function readBody(req) {
  return new Promise((resolve, reject) => {
    let d = '';
    req.on('data', c => d += c);
    req.on('end', () => resolve(d));
    req.on('error', reject);
  });
}

// ─── Refresh token Google ────────────────────────────────────────────
async function refreshAccessToken(token) {
  if (!token || !token.refresh_token) throw new Error('Aucun refresh token — reconnecter via /oauth/start');
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  }).toString();
  const r = await httpJson(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  token.access_token = r.access_token;
  token.expires_at = Date.now() + (r.expires_in || 3600) * 1000;
  writeToken(token);
  return token;
}

async function getAccessToken() {
  if (FIXTURES) return 'fixture-token';
  const t = readToken();
  if (!t) throw new Error('Non connecté');
  if (!t.access_token || Date.now() >= (t.expires_at || 0)) return (await refreshAccessToken(t)).access_token;
  return t.access_token;
}

async function classroomGet(pathname) {
  const at = await getAccessToken();
  return httpJson(CLASSROOM_API + pathname, { headers: { Authorization: 'Bearer ' + at } });
}

// ─── Registre des modules (progression apprenant — dérivé réel) ──────
let getModules = () => [];
try {
  const reg = require('./modules.registry.json');
  getModules = () => (Array.isArray(reg) ? reg : []).map(m => ({
    num: m.num, title: m.title, week: m.week, seanceNum: m.seanceNum, status: m.status,
  }));
} catch (_) { /* pas de registre : UI apprenant en mode dégradé honest */ }

// ─── Phase 2B : identité, rôles, sessions, progression (additif) ─────
const identity = require('./identity-api').create({
  httpJson, classroomGet, getAccessToken, send, readBody, readToken,
  ADMIN_USER, ADMIN_PASS, CLASSROOM_API, FORMS_API, ENV: process.env, getModules,
});
identity.bootstrap(); // users.json au 1er démarrage (sinon: 0 compte = login impossible)

// ─── Serveur HTTP ────────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_BASE);

  try {
    // Mode TEST : servir les coquilles ui/* depuis le repo (le gateway devient
    // serveur complet pour l'E2E navigateur). N'intercepte ni /api ni /oauth ni /health.
    if (FIXTURES && !url.pathname.startsWith('/api') && !url.pathname.startsWith('/oauth') && !url.pathname.startsWith('/health')) {
      if (serveStatic(req, res, url.pathname)) return;
    }
    // Health check (public)
    if (url.pathname === '/health') return send(res, 200, { ok: true });

    // Routes Phase 2B (sessions/roles/progression) — leur propre auth interne.
    if (identity.handles(url.pathname, req.method)) return await identity.handleApi(req, res, url);

    // ── Routes OAuth : PUBLIQUES (sans Basic Auth) ──
    // /oauth/start et /oauth/callback doivent être accessibles au navigateur
    // et à Google (callback) SANS popup Basic Auth.

    // ── Démarrage OAuth ──
    if (url.pathname === '/oauth/start' || url.pathname === '/oauth/login') {
      if (!CLIENT_ID || !CLIENT_SECRET) {
        return send(res, 503, 'Client Google OAuth non configuré — renseigner GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET dans Dokploy.');
      }
      const loginMode = url.pathname === '/oauth/login';
      const state = makeState(loginMode ? 'login' : 'connect');
      const params = new URLSearchParams({
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: loginMode ? 'openid email profile' : SCOPES,
        access_type: loginMode ? 'online' : 'offline',
        prompt: loginMode ? 'select_account' : 'consent',
        state,
      });
      const loc = `${AUTH_URL}?${params.toString()}`;
      return send(res, 302, '', { Location: loc });
    }

    // ── Callback OAuth ──
    if (url.pathname === '/oauth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      if (error) return send(res, 400, `<h2>❌ OAuth refusé : ${error}</h2><p>Fermez cet onglet et réessayez depuis l'admin.</p>`);
      const chk = checkState(state);
      if (!code || !chk.ok) {
        const why = !code ? 'code absent' : chk.reason;
        console.log('[oauth] callback refuse: ' + why);
        const msg = !code ? 'Réponse Google incomplète (code absent).'
          : chk.reason === 'expire' ? 'Le lien de connexion a expiré (plus de 10 minutes). Recommencez depuis la page de connexion.'
          : chk.reason === 'signature' || chk.reason === 'format' ? 'État OAuth invalide. Recommencez depuis la page de connexion.'
          : 'État OAuth manquant. Recommencez depuis la page de connexion.';
        return send(res, 400, `<h2>❌ Connexion interrompue</h2><p>${msg}</p><p><a href="/ui/login/">→ Retour à la connexion</a></p>`);
      }
      // NOTE : on ne consomme PAS le state ici. Un navigateur réel peut émettre
      // plusieurs hits sur /oauth/callback avant l'échange (préchargement, reload,
      // retour arrière) : brûler le state ici reproduisait exactement le « État
      // invalide » du premier écran. La sécurité anti-replay repose sur le CODE
      // Google (usage unique, côté Google) + la fraîcheur du state (10 min).
      // Le nonce n'est marqué dépensé qu'après un échange RÉUSSI (plus bas).
      const loginMode = chk.mode === 'login';
      try {
        const body = new URLSearchParams({
          code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
          grant_type: 'authorization_code',
        }).toString();
        const tok = await httpJson(TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body,
        });
        // Vérifier l'email du compte autorisé (userinfo) AVANT de stocker
        const ui = await httpJson('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: 'Bearer ' + tok.access_token },
        });
        const email = (ui.email || '').toLowerCase();
        consumeState(state); // echange reussi -> le state ne sert plus (anti-replay)
        if (loginMode) {
          // Connexion admin via Google : session cookie, PAS de token Classroom.
          const secure = (req.headers['x-forwarded-proto'] || '') === 'https';
          const cookie = identity.googleSession(email, ui.name, secure);
          if (!cookie) {
            return send(res, 403, `<h2>❌ Accès refusé</h2><p>Le compte <b>${email}</b> n'est pas administrateur de l'académie.</p>`);
          }
          return send(res, 302, '', { 'Set-Cookie': cookie, Location: '/ui/cockpit/' });
        }
        if (ALLOWED_ADMIN_EMAILS.length === 0 && !ALLOW_BOOTSTRAP) {
          return send(res, 403, `<h2>❌ Configuration incomplète</h2><p>Aucun email autorisé (<code>ALLOWED_ADMIN_EMAILS</code> vide). Re-déployez avec la liste, ou <code>ALLOW_BOOTSTRAP=1</code> pour le tout premier consentement.</p>`);
        }
        if (ALLOWED_ADMIN_EMAILS.length > 0 && !ALLOWED_ADMIN_EMAILS.includes(email)) {
          return send(res, 403, `<h2>❌ Accès refusé</h2><p>Le compte <b>${email}</b> n'est pas autorisé à administrer l'académie.</p><p>Contactez l'administrateur pour ajouter votre email à <code>ALLOWED_ADMIN_EMAILS</code>.</p>`);
        }
        writeToken({ access_token: tok.access_token, refresh_token: tok.refresh_token, expires_at: Date.now() + (tok.expires_in || 3600) * 1000, scope: tok.scope, admin_email: email });
        return send(res, 200, `<h2>✅ Connexion Google Classroom réussie</h2><p>Compte : <b>${email}</b></p><p>Vous pouvez fermer cet onglet et revenir à l'admin.</p><p><a href="/admin/">→ Revenir à l'admin</a></p>`);
      } catch (e) {
        return send(res, 500, `<h2>❌ Erreur d'échange du code OAuth</h2><pre>${e.message}</pre>`);
      }
    }

    // ── Routes API : ADMIN REQUIS (Basic Auth) ──
    if (url.pathname.startsWith('/api/')) {
      if (!checkAuth(req)) {
        // Phase 2B: une session admin (cookie) equivaut au Basic admin pour les
        // routes legacy (ex: /api/classroom/status consomme par le cockpit UI).
        // Roles apprenant/formateur restent refuses ici (routees par identity-api).
        if (identity.roleFromReq(req) !== 'admin') return authRequired(res);
      }
    } else {
      return send(res, 404, { error: 'Not Found' });
    }

    // ── Statut connexion ──
    if (url.pathname === '/api/classroom/status') {
      const t = readToken();
      return send(res, 200, {
        connected: !!t && !!t.refresh_token,
        account: t && t.admin_email ? t.admin_email : null,
        scopes: t && t.scope ? t.scope.split(' ') : [],
        redirectUri: REDIRECT_URI,
        clientConfigured: !!(CLIENT_ID && CLIENT_SECRET),
      });
    }

    // ── Liste des cours ──
    if (url.pathname === '/api/classroom/courses') {
      try {
        const data = await classroomGet('/courses?courseStates=ACTIVE&pageSize=20');
        const courses = (data.courses || []).map(c => ({
          id: c.id, name: c.name, section: c.section || '',
          room: c.room || '', state: c.courseState,
        }));
        return send(res, 200, { courses });
      } catch (e) {
        return send(res, 502, { error: e.message });
      }
    }

    // ── Étudiants d'un cours ──
    if (url.pathname === '/api/classroom/students') {
      const courseId = url.searchParams.get('courseId');
      if (!courseId) return send(res, 400, { error: 'courseId requis' });
      try {
        const data = await classroomGet(`/courses/${encodeURIComponent(courseId)}/students?pageSize=50`);
        const students = (data.students || []).map(s => ({
          id: s.userId,
          name: s.profile.name ? `${s.profile.name.givenName || ''} ${s.profile.name.familyName || ''}`.trim() : '—',
          email: s.profile.emailAddress || '',
        }));
        return send(res, 200, { students });
      } catch (e) {
        return send(res, 502, { error: e.message });
      }
    }

    // ── Gmail : profil (email du token — pas d'appel API requis) ──
    if (url.pathname === '/api/gmail/profile') {
      const t = readToken();
      return send(res, 200, { email: t && t.admin_email ? t.admin_email : '—', scope: 'gmail.send (envoi uniquement)' });
    }

    // ── Gmail : envoyer un email (ÉCRITURE — nécessite confirmation) ──
    if (url.pathname === '/api/gmail/send' && req.method === 'POST') {
      return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
    }

    // ── Calendar : prochains événements (LECTURE SEULE — test) ──
    if (url.pathname === '/api/calendar/upcoming') {
      try {
        const at = await getAccessToken();
        const now = new Date().toISOString();
        const data = await httpJson(`${CALENDAR_API}/calendars/primary/events?timeMin=${encodeURIComponent(now)}&maxResults=5&orderBy=startTime&singleEvents=true`, { headers: { Authorization: 'Bearer ' + at } });
        const events = (data.items || []).map(e => ({
          id: e.id, summary: e.summary || '(sans titre)',
          start: e.start && e.start.dateTime ? e.start.dateTime : e.start && e.start.date ? e.start.date : null,
          hangout: e.hangoutLink || null,
        }));
        return send(res, 200, { events });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Calendar : créer un événement Meet (ÉCRITURE — activée par ALLOW_CALENDAR_WRITE=1) ──
    if (url.pathname === '/api/calendar/create' && req.method === 'POST') {
      if (process.env.ALLOW_CALENDAR_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      try {
        const raw = await readBody(req);
        let payload = {};
        try { payload = JSON.parse(raw); } catch (_) { return send(res, 400, { error: 'Body JSON invalide' }); }
        const summary = payload.summary || 'Événement OPAYS Academy';
        const start = payload.start ? new Date(payload.start) : new Date();
        const end = payload.end ? new Date(payload.end) : new Date(start.getTime() + 60 * 60 * 1000);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return send(res, 400, { error: 'Dates invalides (ISO 8601 requis)' });
        if (end <= start) return send(res, 400, { error: 'end doit être après start' });
        const at = await getAccessToken();
        const body = {
          summary,
          description: payload.description || '',
          start: { dateTime: start.toISOString(), timeZone: 'Africa/Lubumbashi' },
          end: { dateTime: end.toISOString(), timeZone: 'Africa/Lubumbashi' },
          conferenceData: payload.meet !== false ? {
            createRequest: {
              requestId: 'opays-' + Date.now(),
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          } : undefined,
        };
        // conferenceDataVersion=1 est OBLIGATOIRE pour que Google attache une conférence Meet
        const data = await httpJson(CALENDAR_API + '/calendars/primary/events?conferenceDataVersion=1', {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return send(res, 200, { id: data.id, htmlLink: data.htmlLink, hangoutLink: data.hangoutLink || null, summary: data.summary });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Calendar : supprimer un événement (ÉCRITURE — même garde) ──
    if (url.pathname === '/api/calendar/delete' && req.method === 'DELETE') {
      if (process.env.ALLOW_CALENDAR_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      const eventId = url.searchParams.get('eventId');
      if (!eventId) return send(res, 400, { error: 'eventId requis' });
      try {
        const at = await getAccessToken();
        await httpJson(`${CALENDAR_API}/calendars/primary/events/${encodeURIComponent(eventId)}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer ' + at },
        });
        return send(res, 200, { deleted: true, eventId });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Forms : lister les formulaires Google (via Drive API — lecture seule) ──
    if (url.pathname === '/api/forms/list') {
      try {
        const at = await getAccessToken();
        const q = encodeURIComponent("mimeType='application/vnd.google-apps.form' and trashed=false");
        const data = await httpJson(`https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=10&fields=files(id,name)`, { headers: { Authorization: 'Bearer ' + at } });
        return send(res, 200, { forms: (data.files || []).map(f => ({ id: f.id, title: f.name })) });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Forms : méta d'un formulaire (titre — diagnostic) ──
    if (url.pathname === '/api/forms/meta') {
      const formId = url.searchParams.get('formId');
      if (!formId) return send(res, 400, { error: 'formId requis' });
      try {
        const at = await getAccessToken();
        const data = await httpJson(`${FORMS_API}/forms/${encodeURIComponent(formId)}`, { headers: { Authorization: 'Bearer ' + at } });
        return send(res, 200, { id: data.formId, title: data.info && data.info.title ? data.info.title : '(sans titre)' });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Forms : réponses d'un formulaire (LECTURE SEULE) ──
    if (url.pathname === '/api/forms/responses') {
      const formId = url.searchParams.get('formId');
      if (!formId) return send(res, 400, { error: 'formId requis' });
      try {
        const at = await getAccessToken();
        const data = await httpJson(`${FORMS_API}/forms/${encodeURIComponent(formId)}/responses?pageSize=50`, { headers: { Authorization: 'Bearer ' + at } });
        return send(res, 200, { total: (data.responses || []).length, responses: (data.responses || []).slice(0, 20) });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Classroom : créer un topic (ÉCRITURE — garde ALLOW_CLASSROOM_WRITE) ──
    if (url.pathname === '/api/classroom/topics' && req.method === 'POST') {
      if (process.env.ALLOW_CLASSROOM_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      try {
        const raw = await readBody(req);
        let payload = {};
        try { payload = JSON.parse(raw); } catch (_) { return send(res, 400, { error: 'Body JSON invalide' }); }
        const courseId = payload.courseId;
        const name = payload.name;
        if (!courseId || !name) return send(res, 400, { error: 'courseId et name requis' });
        const at = await getAccessToken();
        const data = await httpJson(`${CLASSROOM_API}/courses/${encodeURIComponent(courseId)}/topics`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        });
        return send(res, 200, { topicId: data.topicId, name: data.name });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Classroom : créer un devoir (ÉCRITURE — même garde) ──
    if (url.pathname === '/api/classroom/coursework' && req.method === 'POST') {
      if (process.env.ALLOW_CLASSROOM_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      try {
        const raw = await readBody(req);
        let payload = {};
        try { payload = JSON.parse(raw); } catch (_) { return send(res, 400, { error: 'Body JSON invalide' }); }
        const courseId = payload.courseId;
        if (!courseId) return send(res, 400, { error: 'courseId requis' });
        const at = await getAccessToken();
        const body = {
          title: payload.title || 'Devoir OPAYS',
          description: payload.description || '',
          workType: 'ASSIGNMENT',
          state: payload.scheduledTime ? 'DRAFT' : (payload.state || 'PUBLISHED'),
          topicId: payload.topicId,
          dueDate: payload.dueDate || undefined,
          dueTime: payload.dueTime || undefined,
          scheduledTime: payload.scheduledTime || undefined,
          maxPoints: payload.maxPoints || 100,
        };
        Object.keys(body).forEach(k => { if (body[k] === undefined) delete body[k]; });
        const data = await httpJson(`${CLASSROOM_API}/courses/${encodeURIComponent(courseId)}/courseWork`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return send(res, 200, { id: data.id, title: data.title, state: data.state });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Classroom : créer du matériel (ÉCRITURE — même garde) ──
    if (url.pathname === '/api/classroom/materials' && req.method === 'POST') {
      if (process.env.ALLOW_CLASSROOM_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      try {
        const raw = await readBody(req);
        let payload = {};
        try { payload = JSON.parse(raw); } catch (_) { return send(res, 400, { error: 'Body JSON invalide' }); }
        const courseId = payload.courseId;
        if (!courseId) return send(res, 400, { error: 'courseId requis' });
        const at = await getAccessToken();
        const body = {
          title: payload.title || 'Matériel OPAYS',
          description: payload.description || '',
          state: payload.scheduledTime ? 'DRAFT' : (payload.state || 'PUBLISHED'),
          topicId: payload.topicId,
          scheduledTime: payload.scheduledTime || undefined,
          materials: payload.link ? [{ link: { url: payload.link } }] : undefined,
        };
        Object.keys(body).forEach(k => { if (body[k] === undefined) delete body[k]; });
        const data = await httpJson(`${CLASSROOM_API}/courses/${encodeURIComponent(courseId)}/courseWorkMaterials`, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        return send(res, 200, { id: data.id, title: data.title, state: data.state });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    // ── Classroom : mettre à jour la classe (nom, section, salle) — ÉCRITURE ──
    if (url.pathname === '/api/classroom/update' && req.method === 'PATCH') {
      if (process.env.ALLOW_CLASSROOM_WRITE !== '1') {
        return send(res, 403, { error: 'Écriture désactivée — action à confirmer manuellement avant activation.' });
      }
      try {
        const raw = await readBody(req);
        let payload = {};
        try { payload = JSON.parse(raw); } catch (_) { return send(res, 400, { error: 'Body JSON invalide' }); }
        const courseId = payload.courseId;
        if (!courseId) return send(res, 400, { error: 'courseId requis' });
        const at = await getAccessToken();
        // updateMask est OBLIGATOIRE pour courses.patch (sinon 400 INVALID_ARGUMENT)
        const data = await httpJson(`${CLASSROOM_API}/courses/${encodeURIComponent(courseId)}?updateMask=name,section,room`, {
          method: 'PATCH',
          headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: payload.name, section: payload.section, room: payload.room }),
        });
        return send(res, 200, { id: data.id, name: data.name, section: data.section, room: data.room });
      } catch (e) { return send(res, 502, { error: e.message }); }
    }

    return send(res, 404, { error: 'Not Found' });
  } catch (e) {
    return send(res, 500, { error: e.message });
  }
});

server.listen(PORT, () => {
  console.log(`🌍 OPAYS Classroom Gateway — http://0.0.0.0:${PORT}`);
  console.log(`   Redirect URI : ${REDIRECT_URI}`);
  console.log(`   Client configuré : ${CLIENT_ID ? 'oui' : 'NON (renseigner les env dans Dokploy)'}`);
  console.log(`   Scopes : ${SCOPES}`);
});
