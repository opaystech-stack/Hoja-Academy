/**
 * HOJA ACADEMY — Phase 2B : identité, rôles, progression (module additionnel du gateway)
 * Zéro dépendance. Reçoit un contexte du server.js hôte (aucun fork de la logique existante).
 *
 * Rôles : admin > formateur > apprenant.
 * Auth : Basic admin legacy (scripts, inchangés) OU session cookie 'hojad' (nouvelles UI).
 * Données : UNIQUEMENT Classroom réel / users.json — jamais de simulation ; états vides explicites.
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');

// ─── Fabrique ────────────────────────────────────────────────────────
function create(ctx) {
  const {
    httpJson, classroomGet, getAccessToken, send, readBody,
    ADMIN_USER, ADMIN_PASS, CLASSROOM_API,
    FORMS_API: CTX_FORMS_API,
    ENV: e, // process.env
  } = ctx;

  const USERS_FILE = e.USERS_FILE || '/data/users.json';
  // ── Candidatures (Google Form -> cockpit) : stockage minimal, meme volume ──
  const CANDIDATES_FILE = e.CANDIDATES_FILE || '/data/candidates.json';
  const FORM_ID = e.FORM_ID || '';
  const FORMS_API = CTX_FORMS_API || 'https://forms.googleapis.com/v1';
  // Mapping questionId -> champ, VERIFIE sur la 1re reponse reelle (2026-09-14 :
  // valeurs sans ambiguite nom/email/telephone/profil/niveau/objectif).
  // Tout questionId inconnu est conserve brut dans 'extra' — jamais jete.
  const FORM_QMAP = {
    '617f1741': 'name',
    '36efc9a6': 'email',
    '27e9116d': 'phone',
    '24fb7b79': 'profile',
    '3e9d769d': 'level',
    '117610ba': 'goal',
  };
  const SESSION_TTL_MS = 12 * 3600 * 1000;
  const COOKIE = '***';
  const COURSE_ID = e.CLASSROOM_COURSE_ID || '';
  const CLASSROOM_URL = e.CLASSROOM_URL || '';
  const COHORT_START = e.COHORT_START || null; // ISO ou null — jamais inventé
  const SCRYPT = { N: 16384, r: 8, p: 1, keylen: 32 };

  // Journalisation operations — memes flux que logs serveur ; AUCUN secret,
  // mot de passe, token ou contenu de copie n'est journalise (email+ip seulement).
  function ev(event, fields) {
    try { console.log('[academy]', JSON.stringify(Object.assign({ ev: event, at: new Date().toISOString() }, fields || {}))); } catch (_) {}
  }

  const sessions = new Map();      // token -> {email, role, name, exp}
  const loginAttempts = new Map(); // ip -> {n, t0}
  let scopeCache = { at: 0, scopes: [] };

  // ─── users.json ────────────────────────────────────────────────────
  function loadUsers() {
    try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); } catch (_) { return { users: [] }; }
  }
  function saveUsers(db) {
    fs.mkdirSync(require('path').dirname(USERS_FILE), { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), { mode: 0o600 });
  }
  function loadCand() {
    try { return JSON.parse(fs.readFileSync(CANDIDATES_FILE, 'utf8')); } catch (_) { return { items: {} }; }
  }
  function saveCand(db) {
    fs.mkdirSync(require('path').dirname(CANDIDATES_FILE), { recursive: true });
    fs.writeFileSync(CANDIDATES_FILE, JSON.stringify(db, null, 2), { mode: 0o600 });
  }
  function candEvent(c, kind, label) {
    c.events = c.events || [];
    c.events.push({ ts: new Date().toISOString(), kind, label });
    if (c.events.length > 40) c.events = c.events.slice(-40);
  }
  function formResponseToCand(r) {
    const fields = { extra: [] };
    const answers = r.answers || {};
    for (const qid of Object.keys(answers)) {
      const a = answers[qid];
      const val = a && a.textAnswers && a.textAnswers.answers && a.textAnswers.answers[0] ? String(a.textAnswers.answers[0].value || '') : '';
      const key = FORM_QMAP[qid];
      if (key) fields[key] = val.trim();
      else if (val) fields.extra.push({ questionId: qid, value: val.trim().slice(0, 400) });
    }
    const email = String(fields.email || '').trim().toLowerCase();
    return {
      responseId: r.responseId,
      name: String(fields.name || '').slice(0, 80) || '—',
      email,
      phone: String(fields.phone || '').slice(0, 24),
      profile: String(fields.profile || '').slice(0, 60),
      level: String(fields.level || '').slice(0, 60),
      goal: String(fields.goal || '').slice(0, 400),
      extra: fields.extra,
      submittedAt: r.createTime || null,
      status: 'nouveau',            // nouveau | verifie | admis | refuse | annule
      payment: { state: 'non_verifie' }, // non_verifie | en_attente | paye | refuse
      learnerEmail: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      events: [],
    };
  }
  function candCounts(db) {
    const list = Object.values(db.items || {});
    const today = new Date().toISOString().slice(0, 10);
    return {
      total: list.length,
      nouveaux: list.filter(c => c.status === 'nouveau').length,
      nouveauxJour: list.filter(c => (c.submittedAt || '').slice(0, 10) === today).length,
      aVerifier: list.filter(c => c.payment.state === 'non_verifie' && !['refuse', 'annule'].includes(c.status)).length,
      payeNonAdmis: list.filter(c => c.payment.state === 'paye' && c.status !== 'admis').length,
      payeCount: list.filter(c => c.payment.state === 'paye').length,
      attendu: list.filter(c => !['refuse', 'annule'].includes(c.status) && c.payment.state !== 'paye').length,
      admis: list.filter(c => c.status === 'admis').length,
    };
  }
  function isEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '')); }

  function hashPw(user, password) {
    return crypto.scryptSync(String(password), String(user.salt), SCRYPT.keylen, SCRYPT).toString('hex');
  }
  function verifyPw(user, password) {
    try {
      const a = Buffer.from(hashPw(user, password), 'hex');
      const b = Buffer.from(user.hash, 'hex');
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch (_) { return false; }
  }
  function findUser(db, email) {
    const k = String(email).trim().toLowerCase();
    return db.users.find(u => u.email === k);
  }
  function bootstrapIfNeeded() {
    const db = loadUsers();
    if (db.users.length === 0 && ADMIN_USER && ADMIN_PASS) {
      const salt = crypto.randomBytes(16).toString('hex');
      db.users.push({
        email: (e.BOOTSTRAP_EMAIL || ADMIN_USER).toLowerCase(),
        name: 'Administrateur',
        role: 'admin',
        salt,
        hash: hashPw({ salt }, ADMIN_PASS),
        createdAt: new Date().toISOString(),
        bootstrap: true,
      });
      saveUsers(db);
      console.log('[identity] Bootstrap : compte admin cr\u00e9\u00e9 depuis ADMIN_USER/ADMIN_PASS (env Dokploy).');
    }
    return db;
  }

  // ─── Sessions & cookies ────────────────────────────────────────────
  function parseCookies(req) {
    const out = {};
    (req.headers.cookie || '').split(';').forEach(p => {
      const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = p.slice(i + 1).trim();
    });
    return out;
  }
  function sessionFromReq(req) {
    const tok = parseCookies(req)[COOKIE];
    if (!tok) return null;
    const s = sessions.get(tok);
    if (!s) return null;
    if (Date.now() > s.exp) { sessions.delete(tok); return null; }
    return Object.assign({ token: tok }, s);
  }
  function newSession(user, secure) {
    const tok = crypto.randomBytes(24).toString('base64url');
    sessions.set(tok, { email: user.email, role: user.role, name: user.name, exp: Date.now() + SESSION_TTL_MS });
    return `${COOKIE}=${tok}; Path=/; HttpOnly; SameSite=Lax${secure ? '; Secure' : ''}`;
  }

  // ─── Session Google — ADMIN UNIQUEMENT (liste ALLOWED_ADMIN_EMAILS) ──
  // Les apprenants/formateurs restent au mot de passe (users.json) : le login
  // Google ne doit pas devenir un contournement du secret partagé.
  function googleSession(email, name, secure) {
    const k = String(email || '').trim().toLowerCase();
    if (!k) return null;
    const allowed = String(e.ALLOWED_ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    if (!allowed.length || !allowed.includes(k)) return null;
    const db = loadUsers();
    const user = findUser(db, k);
    if (user && user.role !== 'admin') return null;
    return newSession(user || { email: k, role: 'admin', name: name || k }, secure);
  }

  // ─── Autorisation ──────────────────────────────────────────────────
  function roleFromReq(req) {
    const h = req.headers.authorization || '';
    if (h.startsWith('Basic ')) {
      const [u, p] = Buffer.from(h.slice(6), 'base64').toString('utf8').split(':');
      if (u === ADMIN_USER && p === ADMIN_PASS) return 'admin';
    }
    const s = sessionFromReq(req);
    return s ? s.role : null;
  }
  function requireRole(req, roles) {
    const r = roleFromReq(req);
    return r && roles.includes(r) ? r : null;
  }

  // ─── Helpers Classroom ─────────────────────────────────────────────
  async function activeScopes() {
    if (Date.now() - scopeCache.at < 600000) return scopeCache.scopes;
    const t = ctx.readToken ? ctx.readToken() : null;
    scopeCache = { at: Date.now(), scopes: t && t.scope ? t.scope.split(' ') : [] };
    return scopeCache.scopes;
  }
  async function listCoursework(courseId) {
    const data = await classroomGet(`/courses/${encodeURIComponent(courseId)}/courseWork?courseWorkStates=PUBLISHED&pageSize=128`);
    return (data.courseWork || []).map(cw => ({
      id: cw.id, title: cw.title, description: cw.description || '',
      state: cw.state, topicId: cw.topicId || null,
      dueDate: cw.dueDate || null, maxPoints: cw.maxPoints, creationTime: cw.creationTime,
      alternateLink: cw.alternateLink || null,
    }));
  }
  async function studentEmailMap(courseId) {
    // userId Google -> email (via roster students) ; les studentSubmissions ne donnent que des userId.
    try {
      const data = await classroomGet(`/courses/${encodeURIComponent(courseId)}/students?pageSize=128`);
      const map = {};
      for (const s of data.students || []) {
        const em = ((s.profile && s.profile.emailAddress) || '').toLowerCase();
        if (s.userId && em) map[s.userId] = em;
      }
      return map;
    } catch (_) { return {}; }
  }
  // GET courses.courseWork.studentSubmissions — courseWorkId '-' = toute la classe (doc officielle)
  async function listSubmissions(courseId, emailMap) {
    const data = await classroomGet(`/courses/${encodeURIComponent(courseId)}/courseWork/-/studentSubmissions?pageSize=128`);
    return (data.studentSubmissions || []).map(s => ({
      id: s.id, courseWorkId: s.courseWorkId, userId: s.userId,
      email: emailMap[s.userId] || null,
      state: s.state,                      // NEW | CLAIMED | UNCLAIMED | RETURNED | DRAFT
      late: !!s.late,
      submitted: s.state === 'CLAIMED' || s.state === 'RETURNED',
      returned: s.state === 'RETURNED',
      grade: typeof s.assignedGrade === 'number' ? s.assignedGrade : null,
      draftGrade: typeof s.draftGrade === 'number' ? s.draftGrade : null,
      url: s.alternateLink || null,
      createTime: s.creationTime, updateTime: s.updateTime,
    }));
  }
  function parseMissionNum(title) {
    // formats reels : 'Mission M01 — …', 'Mission n°2', 'Devoir 3', 'M07', 'Semaine 5 (kit)'
    let m = String(title).match(/(?:Mission|Mise)[^0-9]{0,8}(?:M)?(0?[1-9]|1[0-8])\b/i)
      || String(title).match(/^\s*(?:Devoir|Dossier)\s*(?:n[°o]\s*)?(?:M)?(0?[1-9]|1[0-8])\b/i)
      || String(title).match(/(?:^|[\s(\[|])M(0?[1-9]|1[0-8])\b/);
    if (m) return Math.min(18, parseInt(m[1], 10));
    m = String(title).match(/(?:Semaine|SEMAINE)\s*(?:n[°o]\s*)?([1-8])\b/i);
    return m ? { week: parseInt(m[1], 10) } : null;
  }
  // mission -> modules : numero direct, ou semaine du kit (Devoir N / Semaine N)
  function modulesOfMission(title, mods) {
    const n = parseMissionNum(title);
    if (typeof n === 'number') return mods.filter(x => x.num === n).map(x => x.num);
    if (n && n.week) return mods.filter(x => x.week === n.week).map(x => x.num);
    return [];
  }

  // ─── Handlers API ──────────────────────────────────────────────────
  async function handleApi(req, res, url) {
    const p = url.pathname;
    const secure = (req.headers['x-forwarded-proto'] || '') === 'https';

    // Public : login / logout / whoami
    if (p === '/api/login' && req.method === 'POST') {
      const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?').split(',')[0].trim();
      const at = loginAttempts.get(ip);
      if (at && at.n >= 5 && Date.now() - at.t0 < 600000) {
        ev('login_blocked', { ip });
        return send(res, 429, { error: 'Trop de tentatives — réessayez dans quelques minutes.' });
      }
      let body = {};
      try { body = JSON.parse(await readBody(req) || '{}'); } catch (_) {}
      const email = String(body.email || '').trim().toLowerCase();
      const password = String(body.password || '');
      const db = loadUsers();
      const user = findUser(db, email);
      if (!user || !verifyPw(user, password)) {
        const a = loginAttempts.get(ip) || { n: 0, t0: Date.now() };
        a.n += 1; loginAttempts.set(ip, a);
        return send(res, 401, { error: 'Identifiants invalides.' });
      }
      loginAttempts.delete(ip);
      ev('login_ok', { email: user.email, role: user.role, ip });
      const cookie = newSession(user, secure);
      return send(res, 200, { ok: true, role: user.role, name: user.name, email: user.email }, { 'Set-Cookie': cookie });
    }
    if (p === '/api/logout' && req.method === 'POST') {
      const s = sessionFromReq(req);
      if (s) { sessions.delete(s.token); ev('logout', { email: s.email }); }
      return send(res, 204, '', { 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0` });
    }
    if (p === '/api/whoami') {
      const s = sessionFromReq(req);
      if (s) return send(res, 200, { role: s.role, name: s.name, email: s.email });
      if (roleFromReq(req) === 'admin') return send(res, 200, { role: 'admin', name: 'Administrateur', email: ADMIN_USER });
      return send(res, 401, { error: 'Non connecté' });
    }
    // subrequest nginx (auth_request) : 200 si session valide, 401 sinon
    if (p === '/authz') {
      const orig = req.headers['x-original-uri'] || url.searchParams.get('uri') || '';
      const s = sessionFromReq(req);
      const role = roleFromReq(req);
      if (!role) { res.writeHead(401); return res.end(); }
      const needLearner = /\/ui\/campus\//.test(orig);
      const needStaff = /\/ui\/(suivi|cockpit)\//.test(orig);
      const ok = (needLearner && (role === 'apprenant' || role === 'formateur' || role === 'admin'))
        || (needStaff && (role === 'formateur' || role === 'admin'))
        || (!needLearner && !needStaff);
      res.writeHead(ok ? 200 : 403);
      return res.end();
    }

    // Tout le reste : authentifié (Basic admin legacy OU session)
    const role = roleFromReq(req);
    if (!role) return send(res, 401, { error: 'Authentification requise' });

    // ── Changer SON mot de passe (session) ──
    if (p === '/api/password' && req.method === 'POST') {
      const s = sessionFromReq(req);
      if (!s) return send(res, 401, { error: 'Session expirée' });
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const cur = String(body.currentPassword || '');
      const next = String(body.newPassword || '');
      if (next.length < 10) return send(res, 400, { error: 'Le nouveau mot de passe doit faire au moins 10 caractères.' });
      const db = loadUsers(); const me = findUser(db, s.email);
      if (!me || !verifyPw(me, cur)) return send(res, 401, { error: 'Mot de passe actuel incorrect.' });
      me.salt = crypto.randomBytes(16).toString('hex');
      me.hash = hashPw(me, next);
      delete me.mustChange; delete me.bootstrap;
      saveUsers(db);
      ev('password_changed', { email: me.email });
      return send(res, 200, { ok: true });
    }

    // ── Écriture comptes (admin) ──
    if (p === '/api/users' && req.method === 'POST') {
      if (role !== 'admin') { ev('perm_denied', { path: p, role, need: 'admin' }); return send(res, 403, { error: 'Réservé administrateur' }); }
      let body;
      try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const list = Array.isArray(body.users) ? body.users : [body];
      const db = loadUsers();
      const created = []; const errors = [];
      for (const u of list) {
        const email = String(u.email || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errors.push({ email: u.email, error: 'email invalide' }); continue; }
        if (!['formateur', 'apprenant'].includes(u.role)) { errors.push({ email, error: 'rôle invalide (formateur|apprenant)' }); continue; }
        if (findUser(db, email)) { errors.push({ email, error: 'existe déjà' }); continue; }
        const password = u.password && String(u.password).length >= 10 ? String(u.password) : crypto.randomBytes(9).toString('base64url');
        const salt = crypto.randomBytes(16).toString('hex');
        const user = { email, name: String(u.name || '').slice(0, 80) || '—', role: u.role, salt, hash: hashPw({ salt }, password), cohort: u.cohort || 'Cohorte 01', createdAt: new Date().toISOString(), mustChange: !u.password };
        db.users.push(user);
        created.push({ email, role: user.role, name: user.name, initialPassword: password });
      }
      if (created.length) saveUsers(db);
      created.forEach(c => ev('user_created', { email: c.email, role: c.role }));
      return send(res, 200, { created, errors });
    }
    if (p === '/api/users/reset-password' && req.method === 'POST') {
      if (role !== 'admin') { ev('perm_denied', { path: p, role }); return send(res, 403, { error: 'Réservé administrateur' }); }
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const email = String(body.email || '').trim().toLowerCase();
      const db = loadUsers(); const u = findUser(db, email);
      if (!u) return send(res, 404, { error: 'Compte inconnu' });
      if (u.role === 'admin') return send(res, 400, { error: 'Le compte administrateur se change via « Mon mot de passe », jamais par réinitialisation.' });
      const pw = crypto.randomBytes(9).toString('base64url');
      u.salt = crypto.randomBytes(16).toString('hex');
      u.hash = hashPw({ salt: u.salt }, pw);
      u.mustChange = true;
      saveUsers(db);
      ev('password_reset', { email: u.email, role: u.role, by: role });
      return send(res, 200, { ok: true, email: u.email, name: u.name, initialPassword: pw });
    }
    if (p === '/api/roster/import' && req.method === 'POST') {
      if (role !== 'admin') return send(res, 403, { error: 'Réservé administrateur' });
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const learners = (Array.isArray(body.learners) ? body.learners : []).map(l => ({ email: l.email, name: l.name, role: 'apprenant' }));
      if (learners.length === 0) return send(res, 400, { error: 'Aucun apprenant fourni' });
      const db = loadUsers();
      const created = []; const skipped = [];
      for (const l of learners) {
        const email = String(l.email || '').trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { skipped.push({ email: l.email, why: 'email invalide' }); continue; }
        if (findUser(db, email)) { skipped.push({ email, why: 'existe déjà' }); continue; }
        const pw = crypto.randomBytes(9).toString('base64url');
        const salt = crypto.randomBytes(16).toString('hex');
        db.users.push({ email, name: String(l.name || '').slice(0, 80) || '—', role: 'apprenant', salt, hash: hashPw({ salt }, pw), cohort: 'Cohorte 01', status: 'importé', createdAt: new Date().toISOString(), mustChange: true });
        created.push({ email, initialPassword: pw });
      }
      if (created.length) saveUsers(db);
      ev('roster_import', { n: created.length, skipped: skipped.length, by: role });
      return send(res, 200, { imported: created, importedCount: created.length, skipped, note: 'Comptes importés (statut "importé" — PAS invités : les invitations Classroom sont une étape distincte).' });
    }
    if (p === '/api/roster/invite' && req.method === 'POST') {
      if (role !== 'admin') return send(res, 403, { error: 'Réservé administrateur' });
      const scopes = await activeScopes();
      if (!scopes.some(s => s.endsWith('classroom.rosters'))) {
        ev('invite_blocked_scope', { by: role });
        return send(res, 409, { error: 'Re-consentement OAuth requis : le scope classroom.rosters (écriture) est absent du token. Les invitations ne peuvent PAS être envoyées sans action humaine.' });
      }
      if (!COURSE_ID) return send(res, 400, { error: 'CLASSROOM_COURSE_ID absent de l’environnement' });
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const emails = (Array.isArray(body.emails) ? body.emails : []).map(x => String(x).trim().toLowerCase()).filter(Boolean);
      const at = await getAccessToken();
      const results = [];
      for (const email of emails) {
        try {
          const data = await httpJson(`${CLASSROOM_API}/courses/${encodeURIComponent(COURSE_ID)}/invitations`, {
            method: 'POST', headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
            body: JSON.stringify({ inviteeEmail: email, courseId: COURSE_ID, role: 'STUDENT' }),
          });
          results.push({ email, ok: true, id: data.id });
        } catch (err) { results.push({ email, ok: false, error: String(err.message).slice(0, 140) }); }
      }
      results.forEach(r0 => ev('invite_sent', { email: r0.email, ok: !!r0.ok }));
      return send(res, 200, { results });
    }

    // ── CANDIDATURES (Google Form -> cockpit) — admin uniquement ──
    // Source de verite: candidates.json (persiste sur le volume /data).
    // Sync Forms best-effort a chaque lecture; echec Google = liste locale + flag,
    // JAMAIS de reponse inventee.
    const ADMIN = ['admin'];
    if (p.startsWith('/api/candidates') && req.method === 'GET') {
      if (!requireRole(req, ADMIN)) { ev('perm_denied', { path: p, role }); return send(res, 403, { error: 'Réservé administrateur' }); }
      const db = loadCand();
      let sync = { ok: true, fetched: 0, note: null };
      if (FORM_ID) {
        try {
          const at = await getAccessToken();
          const data = await httpJson(`${FORMS_API}/forms/${encodeURIComponent(FORM_ID)}/responses?pageSize=100`, { headers: { Authorization: 'Bearer ' + at } });
          const resp = data.responses || [];
          sync.fetched = resp.length;
          for (const r0 of resp) {
            const c0 = formResponseToCand(r0);
            const prev = db.items[c0.responseId];
            if (!prev) {
              candEvent(c0, 'inscription', 'Candidature reçue du formulaire');
              db.items[c0.responseId] = c0;
              ev('candidate_new', { id: c0.responseId.slice(0, 12) });
            } else {
              // ne jamais écraser le travail humain: on rafraichit seulement les champs Form bruts
              prev.name = prev.name && prev.name !== '—' ? prev.name : c0.name;
              prev.submittedAt = prev.submittedAt || c0.submittedAt;
            }
          }
          saveCand(db);
        } catch (err) {
          sync = { ok: false, fetched: 0, note: 'Synchronisation Forms indisponible : ' + String(err.message).slice(0, 160) };
        }
      } else sync.note = 'FORM_ID non configuré — seules les candidatures déjà connues sont affichées.';
      const list = Object.values(db.items).sort((a, b) => String(b.submittedAt || b.createdAt).localeCompare(String(a.submittedAt || a.createdAt)));
      const dbu = loadUsers();
      const enriched = list.map(c => ({
        ...c,
        learnerExists: !!c.email && !!findUser(dbu, c.email),
      }));
      return send(res, 200, { total: list.length, counts: candCounts(db), sync, candidates: enriched });
    }
    const candPatch = p.match(/^\/api\/candidates\/([A-Za-z0-9_-]+)$/);
    if (candPatch && req.method === 'PATCH') {
      if (!requireRole(req, ADMIN)) return send(res, 403, { error: 'Réservé administrateur' });
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const db = loadCand(); const c = db.items[candPatch[1]];
      if (!c) return send(res, 404, { error: 'Candidature inconnue' });
      const before = { status: c.status, payment: c.payment.state };
      if (body.note !== undefined) { c.note = String(body.note || '').slice(0, 500); }
      if (body.paymentState !== undefined) {
        const ps = String(body.paymentState);
        if (!['non_verifie', 'en_attente', 'paye', 'refuse'].includes(ps)) return send(res, 400, { error: 'État de paiement invalide' });
        if (ps === 'paye' && (body.amount === undefined || body.amount === null || body.amount === '')) {
          // montant attendu/verifie obligatoire pour marquer paye — sinon erreur claire
          return send(res, 400, { error: 'Indiquez le montant confirmé (amount) avant de marquer PAYÉ.' });
        }
        c.payment = { state: ps, amount: body.amount !== undefined && body.amount !== null && body.amount !== '' ? Number(body.amount) : (c.payment.amount ?? null), method: body.method !== undefined ? String(body.method).slice(0, 40) : (c.payment.method || null), confirmedBy: role, confirmedAt: ps === 'paye' ? new Date().toISOString() : (c.payment.confirmedAt || null), checkedAt: new Date().toISOString() };
      }
      if (body.status !== undefined) {
        const st = String(body.status);
        if (!['nouveau', 'verifie', 'admis', 'refuse', 'annule'].includes(st)) return send(res, 400, { error: 'Statut invalide' });
        if (st === 'admis') return send(res, 400, { error: 'Admission via /admit (crée le compte apprenant), pas via PATCH.' });
        c.status = st;
      }
      if (JSON.stringify(before) !== JSON.stringify({ status: c.status, payment: c.payment.state })) {
        candEvent(c, 'mise_a_jour', `Statut ${before.status}→${c.status} · paiement ${before.payment}→${c.payment.state}` + (body.paymentState ? ` (par ${role})` : ''));
        ev('candidate_updated', { id: c.responseId.slice(0, 12), from: before, to: { status: c.status, payment: c.payment.state } });
      }
      c.updatedAt = new Date().toISOString();
      saveCand(db);
      return send(res, 200, { ok: true, candidate: c });
    }
    const candAdmit = p.match(/^\/api\/candidates\/([A-Za-z0-9_-]+)\/admit$/);
    if (candAdmit && req.method === 'POST') {
      if (!requireRole(req, ADMIN)) return send(res, 403, { error: 'Réservé administrateur' });
      const db = loadCand(); const c = db.items[candAdmit[1]];
      if (!c) return send(res, 404, { error: 'Candidature inconnue' });
      if (c.status === 'refuse' || c.status === 'annule') return send(res, 409, { error: 'Candidature ' + c.status + ' — réouvrir d’abord (PATCH status).' });
      if (!isEmail(c.email)) return send(res, 400, { error: 'Email du candidat manquant/invalide — corrigez avant admission.' });
      if (c.payment.state !== 'paye') return send(res, 409, { error: 'Paiement non marqué PAYÉ (vérification humaine requise). Marquez le paiement d’abord.' });
      const dbu = loadUsers();
      let initialPassword = null;
      let existing = findUser(dbu, c.email);
      if (existing && existing.role !== 'apprenant') return send(res, 409, { error: 'Un compte ' + existing.role + ' existe déjà pour cet email — ne sera pas modifié.' });
      if (!existing) {
        const pw = crypto.randomBytes(9).toString('base64url');
        const salt = crypto.randomBytes(16).toString('hex');
        dbu.users.push({ email: c.email, name: c.name, role: 'apprenant', salt, hash: hashPw({ salt }, pw), cohort: 'Cohorte 01', status: 'importé', via: 'candidature', createdAt: new Date().toISOString(), mustChange: true });
        saveUsers(dbu);
        initialPassword = pw;
        ev('user_created', { email: c.email, role: 'apprenant', via: 'admission' });
      }
      c.status = 'admis'; c.learnerEmail = c.email; c.updatedAt = new Date().toISOString();
      candEvent(c, 'admission', 'Compte apprenant créé' + (initialPassword ? ' (mot de passe initial affiché 1 fois)' : ' (compte existant)') + ' — reste l’invitation Classroom.');
      saveCand(db);
      ev('candidate_admitted', { id: c.responseId.slice(0, 12) });
      return send(res, 200, { ok: true, candidate: c, account: { email: c.email, name: c.name, existing: !!existing, initialPassword } });
    }

    // ── Lecture : cours & devoir réels (formateur + admin) ──
    const STAFF = ['formateur', 'admin'];
    if (p === '/api/classroom/invitations' && req.method === 'GET') {
      if (!requireRole(req, ['formateur', 'admin'])) return send(res, 403, { error: 'Réservé formateur/admin' });
      if (!COURSE_ID) return send(res, 200, { invitations: [], empty: ['CLASSROOM_COURSE_ID non configuré'] });
      const scopes = await activeScopes();
      if (!scopes.some(s => s.endsWith('classroom.rosters.readonly') || s.endsWith('classroom.rosters'))) {
        return send(res, 200, { invitations: [], empty: ['Liste invitations indisponible : scopes Classroom absents du token.'] });
      }
      try {
        const at = await getAccessToken();
        // endpoint reel v1: GET /invitations (global, émis par l'enseignant connecte) — filtre cote client
        const data = await httpJson(`${CLASSROOM_API}/invitations?courseId=${encodeURIComponent(COURSE_ID)}&pageSize=128`, { headers: { Authorization: 'Bearer ' + at } });
        const inv = (data.invitations || [])
          .filter(v => !v.courseId || String(v.courseId) === String(COURSE_ID))
          .map(v => ({ id: v.id, courseId: v.courseId, email: (v.recipientEmail || (v.profile && v.profile.emailAddress) || '').toLowerCase(), role: v.role, state: v.acceptanceState || v.status || null }));
        return send(res, 200, { invitations: inv, empty: [] });
      } catch (err) { return send(res, 200, { invitations: [], empty: ['Liste invitations indisponible : ' + String(err.message).slice(0, 120)] }); }
    }
    if (p === '/api/settings/billing') {
      if (!requireRole(req, ['admin'])) { ev('perm_denied', { path: p, role }); return send(res, 403, { error: 'Réservé administrateur' }); }
      const FILE = e.SETTINGS_FILE || '/data/settings.json';
      let cfg = {};
      try { cfg = JSON.parse(fs.readFileSync(FILE, 'utf8')); } catch (_) { cfg = {}; }
      if (req.method === 'GET') return send(res, 200, { billing: cfg.billing || {} });
      if (req.method === 'POST') {
        let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
        const b = cfg.billing || {};
        if (body.price !== undefined) {
          if (body.price === null || body.price === '') { delete b.price; }
          else { const n = Number(body.price); if (!Number.isFinite(n) || n <= 0) return send(res, 400, { error: 'Tarif invalide (nombre positif attendu).' }); b.price = n; }
        }
        if (body.currency !== undefined) b.currency = String(body.currency).slice(0, 8) || null;
        cfg.billing = b;
        fs.mkdirSync(require('path').dirname(FILE), { recursive: true });
        fs.writeFileSync(FILE, JSON.stringify(cfg, null, 2), { mode: 0o600 });
        ev('billing_updated', { by: role });
        return send(res, 200, { ok: true, billing: cfg.billing });
      }
      return send(res, 405, { error: 'Méthode non permise' });
    }
    if (p === '/api/classroom/coursework' && req.method === 'GET') {
      if (!requireRole(req, STAFF)) { ev('perm_denied', { path: p, role }); return send(res, 403, { error: 'Réservé formateur/admin' }); }
      if (!COURSE_ID) return send(res, 200, { coursework: [], empty: ['CLASSROOM_COURSE_ID non configuré'] });
      try { return send(res, 200, { coursework: await listCoursework(COURSE_ID) }); }
      catch (err) { return send(res, 502, { error: String(err.message).slice(0, 200) }); }
    }
    if (p === '/api/classroom/submissions' && req.method === 'GET') {
      if (!requireRole(req, STAFF)) return send(res, 403, { error: 'Réservé formateur/admin' });
      if (!COURSE_ID) return send(res, 200, { submissions: [], empty: ['CLASSROOM_COURSE_ID non configuré'] });
      try {
        const cwFilter = url.searchParams.get('courseWorkId') || url.searchParams.get('courseworkId');
        let cws = await listCoursework(COURSE_ID);
        if (cwFilter) cws = cws.filter(c => c.id === cwFilter);
        const emailMap = await studentEmailMap(COURSE_ID);
        let subs = await listSubmissions(COURSE_ID, emailMap);
        if (cwFilter) subs = subs.filter(s => s.courseWorkId === cwFilter);
        return send(res, 200, { courseworkCount: cws.length, coursework: cws.map(c => ({ id: c.id, title: c.title, dueDate: c.dueDate, maxPoints: c.maxPoints })), submissions: subs });
      } catch (err) { return send(res, 502, { error: String(err.message).slice(0, 200) }); }
    }
    if (p === '/api/roster' && req.method === 'GET') {
      if (!requireRole(req, STAFF)) return send(res, 403, { error: 'Réservé formateur/admin' });
      const db = loadUsers();
      const learners = db.users.filter(u => u.role === 'apprenant');
      let inClass = new Set(); let empty = [];
      if (COURSE_ID) {
        try {
          const data = await classroomGet(`/courses/${encodeURIComponent(COURSE_ID)}/students?pageSize=128`);
          inClass = new Set((data.students || []).map(s => (s.profile && s.profile.emailAddress || '').toLowerCase()).filter(Boolean));
        } catch (err) { empty.push('liste Classroom indisponible: ' + String(err.message).slice(0, 80)); }
      } else empty.push('CLASSROOM_COURSE_ID non configuré');
      return send(res, 200, {
        learners: learners.map(u => ({ name: u.name, email: u.email, status: u.status || 'actif', joinedClassroom: inClass.has(u.email), mustChange: !!u.mustChange, via: u.via || 'import', createdAt: u.createdAt || null }),),
        classroomCount: inClass.size, empty, cohortStart: COHORT_START || null,
      });
    }
    if (p === '/api/progress' && req.method === 'GET') {
      if (!requireRole(req, STAFF)) return send(res, 403, { error: 'Réservé formateur/admin' });
      if (!COURSE_ID) return send(res, 200, { rows: [], empty: ['Aucune classe configurée — cohorte non peuplée.'] });
      try {
        const db = loadUsers();
        const learners = db.users.filter(u => u.role === 'apprenant');
        const cws = await listCoursework(COURSE_ID);
        const emailMap = await studentEmailMap(COURSE_ID);
        const subs = await listSubmissions(COURSE_ID, emailMap);
        const mods = ctx.getModules ? ctx.getModules() : [];
        const rows = learners.map(u => {
          const mine = subs.filter(s => s.email === u.email);
          const stateOf = c => {
            const s = mine.find(x => x.courseWorkId === c.id);
            if (!s) return 'assigned';
            if (s.returned) return typeof s.grade === 'number' ? 'graded' : 'returned';
            if (s.submitted) return 'submitted';
            return s.state === 'DRAFT' ? 'draft' : 'assigned';
          };
          return {
            email: u.email, name: u.name,
            missions: cws.map(c => {
              const sm = mine.find(x => x.courseWorkId === c.id);
              return { id: c.id, title: c.title, modules: modulesOfMission(c.title, mods), due: c.dueDate, state: stateOf(c), late: !!(sm && sm.late), submissionId: sm && sm.submitted && !sm.returned ? sm.id : null, grade: sm && typeof sm.grade === 'number' ? sm.grade : null, maxPoints: typeof c.maxPoints === 'number' ? c.maxPoints : null, returnedAt: sm && sm.returned && sm.updateTime ? sm.updateTime : null };
            }),
            done: mine.filter(s => s.returned && typeof s.grade === 'number').length,
            submitted: mine.filter(s => s.submitted).length,
            late: mine.filter(s => s.late).length,
            total: cws.length,
          };
        });
        const classEmpty = subs.length === 0 && cws.length === 0;
        return send(res, 200, {
          learners: learners.length, coursework: cws.length, submissions: subs.filter(s => !s.error).length,
          rows, empty: classEmpty ? ['0 devoir publié — pipeline Classroom non peuplé.'] : [],
        });
      } catch (err) { return send(res, 502, { error: String(err.message).slice(0, 200) }); }
    }
    if (p === '/api/feedback' && req.method === 'POST') {
      if (role !== 'admin' && role !== 'formateur') return send(res, 403, { error: 'Réservé formateur/admin' });
      if (e.ALLOW_CLASSROOM_WRITE !== '1') return send(res, 403, { error: 'Écriture désactivée (ALLOW_CLASSROOM_WRITE=1 requis).' });
      let body; try { body = JSON.parse(await readBody(req)); } catch (_) { return send(res, 400, { error: 'JSON invalide' }); }
      const { courseWorkId, submissionId, comment, grade } = body;
      if (!COURSE_ID || !courseWorkId || !submissionId) return send(res, 400, { error: 'courseWorkId + submissionId requis' });
      if (grade != null && grade !== '') {
        const g = Number(grade);
        if (!Number.isFinite(g) || g < 0) return send(res, 400, { error: 'Note invalide (>= 0 requis).' });
        try {
          const cws = await listCoursework(COURSE_ID);
          const cw = cws.find(c => c.id === courseWorkId);
          if (cw && cw.maxPoints && g > Number(cw.maxPoints)) return send(res, 400, { error: 'Note hors bareme (max ' + cw.maxPoints + ').' });
        } catch (_) { /* si le cours est injoignable, on laisse Google trancher */ }
      }
      try {
        const at = await getAccessToken();
        const base = `${CLASSROOM_API}/courses/${encodeURIComponent(COURSE_ID)}/courseWork/${encodeURIComponent(courseWorkId)}/studentSubmissions/${encodeURIComponent(submissionId)}`;
        // 1) Return (le professeur renvoie la copie -> l'eleve voit le commentaire + la note)
        await httpJson(`${base}:return`, {
          method: 'POST', headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        });
        // 2) Patch : assignedGrade + (le commentaire passe par return dans Classroom UI ; on le stocke en draft comment via announcement si besoin)
        const mask = [];
        const patch = {};
        if (grade != null && grade !== '') { patch.assignedGrade = Number(grade); mask.push('assignedGrade'); }
        if (mask.length) {
          await httpJson(`${base}?updateMask=${mask.join(',')}`, {
            method: 'PATCH', headers: { Authorization: 'Bearer ' + at, 'Content-Type': 'application/json' },
            body: JSON.stringify(patch),
          });
        }
        ev('feedback_sent', { by: role, courseWorkId, submissionId, graded: grade != null && grade !== '' });
        return send(res, 200, { ok: true, returned: true, graded: grade != null && grade !== '', note: 'Renvoi effectue' + (grade != null ? ' + note ' + grade : '') + '.' });
      } catch (err) { return send(res, 502, { error: String(err.message).slice(0, 200) }); }
    }

    // ── Apprenant : SON parcours (réel) ──
    if (p === '/api/me') {
      const s = sessionFromReq(req);
      if (!s || s.role !== 'apprenant') { ev('perm_denied', { path: '/api/me', role: s ? s.role : null }); return send(res, 403, { error: 'Réservé apprenant' }); }
      const db = loadUsers(); const me = findUser(db, s.email);
      const modules = ctx.getModules ? ctx.getModules() : [];
      const empty = [];
      let coursework = []; let mySubs = []; let joined = false;
      if (!COURSE_ID) empty.push('Aucune classe configurée (CLASSROOM_COURSE_ID manquant côté serveur).');
      else {
        try {
          const st = await classroomGet(`/courses/${encodeURIComponent(COURSE_ID)}/students?pageSize=128`);
          joined = (st.students || []).some(x => ((x.profile && x.profile.emailAddress) || '').toLowerCase() === me.email);
        } catch (_) { empty.push('Vérification inscription Classroom indisponible.'); }
        try {
          coursework = await listCoursework(COURSE_ID);
          const emailMap = await studentEmailMap(COURSE_ID);
          mySubs = (await listSubmissions(COURSE_ID, emailMap)).filter(x => x.email === me.email || String(x.userId || '').toLowerCase() === me.email);
        } catch (err) { empty.push('Chargement missions impossible pour le moment.'); }
      }
      if (!joined && COURSE_ID && empty.length === 0) empty.push('Vous n’êtes pas encore inscrit dans la classe Classroom — demandez votre invitation.');
      const gradedModules = new Set();
      const missions = coursework.map(c => {
        const mine = mySubs.find(x => x.courseWorkId === c.id);
        let state = 'assigned';
        if (mine && mine.returned) state = (typeof mine.grade === 'number') ? 'graded' : 'returned';
        else if (mine && mine.submitted) state = 'submitted';
        else if (mine && mine.state === 'DRAFT') state = 'draft';
        const nums = modulesOfMission(c.title, modules);
        nums.forEach(n => { if (state === 'graded') gradedModules.add(n); });
        return {
          courseWorkId: c.id, title: c.title, modules: nums, dueDate: c.dueDate, state,
          feedback: !!(mine && mine.returned), url: mine && mine.url ? mine.url : (c.alternateLink || null),
          submissionId: mine ? mine.id || null : null, late: !!(mine && mine.late),
        };
      });
      const modulesView = modules.map(m => ({
        num: m.num, title: m.title, week: m.week, seance: m.seanceNum,
        done: gradedModules.has(m.num),
        mission: missions.find(x => x.modules && x.modules.includes(m.num)) || null,
      }));
      let next = null;
      const pend = missions.filter(x => x.state === 'assigned' || x.state === 'returned').sort((a, b) => ((a.modules[0] || 99) - (b.modules[0] || 99)));
      if (pend[0]) next = { type: 'mission', label: `Mission ${pend[0].modules[0] ? 'M' + String(pend[0].modules[0]).padStart(2, '0') + ' \u2014 ' : ''}${pend[0].title}`, url: pend[0].url, due: pend[0].dueDate, state: pend[0].state };
      else if (!joined) next = { type: 'classroom', label: 'Rejoindre la classe Google Classroom', url: CLASSROOM_URL || null };
      else if (modulesView.length) {
        const m = modulesView.find(x => !x.done);
        if (m) next = { type: 'module', label: `Module ${String(m.num).padStart(2, '0')} — ${m.title}`, url: `/modules/${String(m.num).padStart(2, '0')}/` };
      }
      return send(res, 200, {
        identity: { name: me.name, email: me.email, mustChange: !!me.mustChange },
        cohort: { nom: me.cohort || 'Cohorte 01', start: COHORT_START },
        classroom: { configured: !!COURSE_ID, joined, url: CLASSROOM_URL || null },
        done: gradedModules.size, total: modulesView.length,
        modules: modulesView, missions, next, empty,
      });
    }

    return null; // route non gérée ici
  }

  // Routage : vraies si identity-api gere (pathname, methode)
  function handles(p, method) {
    if (p === '/authz') return true;
    if (p === '/api/login' && method === 'POST') return true;
    if (p === '/api/logout' && method === 'POST') return true;
    if (p === '/api/whoami') return true;
    if (p === '/api/me') return true;
    if (p === '/api/password' && method === 'POST') return true;
    if (p === '/api/users' && method === 'POST') return true;
    if (p === '/api/users/reset-password' && method === 'POST') return true;
    if (p === '/api/roster' && method === 'GET') return true;
    if (p === '/api/roster/import' && method === 'POST') return true;
    if (p === '/api/roster/invite' && method === 'POST') return true;
    if (p === '/api/candidates' && method === 'GET') return true;
    if (p === '/api/classroom/invitations' && method === 'GET') return true;
    if (p === '/api/settings/billing' && (method === 'GET' || method === 'POST')) return true;
    if (/^\/api\/candidates\/[A-Za-z0-9_-]+$/.test(p) && method === 'PATCH') return true;
    if (/^\/api\/candidates\/[A-Za-z0-9_-]+\/admit$/.test(p) && method === 'POST') return true;
    if (p === '/api/progress') return true;
    if (p === '/api/feedback' && method === 'POST') return true;
    if (p === '/api/classroom/coursework' && method === 'GET') return true;
    if (p === '/api/classroom/submissions') return true;
    return false;
  }

  return {
    handleApi,
    roleFromReq,
    googleSession,
    handles,
    bootstrap: bootstrapIfNeeded,
    _internals: { sessions, loadUsers, hashPw, saveUsers },
  };
}

module.exports = { create };
