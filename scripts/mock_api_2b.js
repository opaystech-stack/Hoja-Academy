/**
 * HOJA ACADEMY — Mock API Phase 2B (TEST ONLY — jamais en production).
 * Sert des fixtures conformes a audits/ph2/contrat-api.md pour developper/tester
 * les UI ui/campus, ui/suivi, ui/cockpit sans gateway ni Classroom reel.
 *
 * Usage :  node scripts/mock_api_2b.js [port]     (defaut 9099)
 *          puis servir ui/ + mock : les pages font fetch('/api/...') — servir le mock
 *          comme proxy : node scripts/mock_api_2b.js sert aussi les fichiers ui/ et landing.
 * Roles simules via cookie : GET /api/mock/login-as?role=apprenant|formateur|admin
 * Scenarios : ?scenario=vide (classe non peuplee) | peuple (missions depots notes)
 */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');

const ROOT = DIRS.root;
const PORT = Number(process.argv[2] || 9099);

const modules = require('../data/modules.js').map(m => ({
  num: m.num, title: m.title, subtitle: m.subtitle || '', objective: String(m.objective || ''),
  week: m.week, seanceNum: m.seanceNum, durationLabel: m.durationLabel || '', status: m.status || 'ready', mission: String(m.mission || ''),
}));

function dayOffset(d, y) { return { year: y || 2026, month: 9, day: d }; }
const CW = [
  { id: 'cw-01', title: 'Mission M01 — Comparatif 2 modèles', description: 'Tester 3 tâches sur 2 modèles IA. Déposer le comparatif.', state: 'PUBLISHED', topicId: null, dueDate: dayOffset(14), maxPoints: 100, alternateLink: 'https://classroom.google.com/c/mock/a/cw-01/details' },
  { id: 'cw-02', title: 'Mission M02 — Grille de sélection d’outil', description: 'Choisir un outil par famille.', state: 'PUBLISHED', topicId: null, dueDate: dayOffset(21), maxPoints: 100, alternateLink: 'https://classroom.google.com/c/mock/a/cw-02/details' },
  { id: 'cw-07', title: 'Devoir 3 — Workflow multi-étapes', description: 'Un workflow testé.', state: 'PUBLISHED', topicId: null, dueDate: dayOffset(28), maxPoints: 100, alternateLink: null },
];
const LEARNERS = [
  { email: 'awa.diallo@example.test', name: 'Awa Diallo' },
  { email: 'jean.mokoko@example.test', name: 'Jean Mokoko' },
  { email: 'fatou.ndiaye@example.test', name: 'Fatou Ndiaye' },
];
const SUBS_PEUPLE = [
  { id: 's1', courseWorkId: 'cw-01', userId: 'u1', email: 'awa.diallo@example.test', state: 'RETURNED', late: false, submitted: true, returned: true, grade: 92, draftGrade: null, url: 'https://classroom.google.com/c/mock/a/cw-01/sub/s1', createTime: '2026-09-10T10:00:00Z', updateTime: '2026-09-12T09:00:00Z' },
  { id: 's2', courseWorkId: 'cw-01', userId: 'u2', email: 'jean.mokoko@example.test', state: 'CLAIMED', late: true, submitted: true, returned: false, grade: null, draftGrade: null, url: null, createTime: '2026-09-13T20:00:00Z', updateTime: '2026-09-13T20:00:00Z' },
  { id: 's3', courseWorkId: 'cw-02', userId: 'awa', email: 'awa.diallo@example.test', state: 'UNCLAIMED', late: false, submitted: false, returned: false, grade: null, draftGrade: null, url: null, createTime: null, updateTime: null },
];

function mePayload(role, scenario, subs, headers) {
  const email = role === 'apprenant' ? 'awa.diallo@example.test' : null;
  const mySubs = subs.filter(s => s.email === email);
  const missions = CW.map(c => {
    const mine = mySubs.find(x => x.courseWorkId === c.id);
    let state = 'assigned';
    if (mine && mine.returned) state = typeof mine.grade === 'number' ? 'graded' : 'returned';
    else if (mine && mine.submitted) state = 'submitted';
    else if (mine && mine.state === 'DRAFT') state = 'draft';
    const m = c.title.match(/M(0[1-9]|1[0-8])/);
    return { courseWorkId: c.id, title: c.title, modules: m ? [parseInt(m[1], 10)] : [], dueDate: c.dueDate, state, feedback: !!(mine && mine.returned), url: (mine && mine.url) || c.alternateLink, submissionId: mine ? mine.id : null, late: !!(mine && mine.late) };
  });
  const graded = new Set();
  missions.forEach(x => { if (x.state === 'graded') x.modules.forEach(n => graded.add(n)); });
  const pend = missions.filter(x => x.state === 'assigned' || x.state === 'returned');
  return {
    identity: { name: 'Awa Diallo', email, mustChange: false },
    cohort: { nom: 'Cohorte 01', start: scenario === 'vide' ? null : '2026-09-07' },
    classroom: { configured: true, joined: true, url: 'https://classroom.google.com/c/mock' },
    done: graded.size, total: modules.length,
    modules: modules.map(mm => ({ num: mm.num, title: mm.title, week: mm.week, seance: mm.seanceNum, done: graded.has(mm.num), mission: missions.find(x => x.modules.includes(mm.num)) || null })),
    missions, next: pend[0] ? { type: 'mission', label: pend[0].title, url: pend[0].url, due: pend[0].dueDate, state: pend[0].state } : null,
    empty: scenario === 'vide' ? ['Aucun devoir publié — cohorte non peuplée.'] : [],
  };
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  const p = u.pathname;
  const scenario = u.searchParams.get('scenario') || 'peuple';
  const json = (code, obj) => { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(obj)); };
  const sessionRole = (req.headers.cookie || '').match(/mockrole=([a-z]+)/);
  const role = sessionRole ? sessionRole[1] : null;
  const require = (roles) => role && roles.includes(role);

  if (p === '/api/mock/login-as') {
    res.writeHead(200, { 'Set-Cookie': `mockrole=${u.searchParams.get('role') || 'apprenant'}; Path=/` });
    return res.end('ok — mock login ' + (u.searchParams.get('role') || 'apprenant'));
  }
  if (p === '/api/whoami') return json(role ? 200 : 401, role ? { role, name: role, email: role + '@mock.test' } : { error: 'Non connecté' });
  if (p === '/api/me') return require(['apprenant']) ? json(200, mePayload('apprenant', scenario, scenario === 'vide' ? [] : SUBS_PEUPLE)) : json(403, { error: 'Réservé apprenant' });
  if (p === '/api/roster') return require(['formateur', 'admin']) ? json(200, { learners: scenario === 'vide' ? [] : LEARNERS.map(l => ({ ...l, status: 'actif', joinedClassroom: true })), classroomCount: scenario === 'vide' ? 0 : 3, empty: scenario === 'vide' ? ['Aucun apprenant importé.'] : [] }) : json(403, { error: 'Accès refusé' });
  if (p === '/api/progress') return require(['formateur', 'admin']) ? json(200, {
    learners: scenario === 'vide' ? 0 : LEARNERS.length, coursework: scenario === 'vide' ? 0 : CW.length, submissions: scenario === 'vide' ? 0 : SUBS_PEUPLE.length,
    rows: scenario === 'vide' ? [] : LEARNERS.map(l => {
      const mine = SUBS_PEUPLE.filter(s => s.email === l.email);
      const cwModule = { 'cw-01': 1, 'cw-02': 2, 'cw-07': 7 };
      return { email: l.email, name: l.name, missions: CW.map(c => {
        const s = mine.find(x => x.courseWorkId === c.id) || {};
        const state = s.returned ? (s.grade != null ? 'graded' : 'returned') : s.submitted ? 'submitted' : 'assigned';
        return { id: c.id, title: c.title, modules: [cwModule[c.id]], due: c.dueDate, state, late: !!s.late, submissionId: (s.submitted && !s.returned) ? s.id : null };
      }), done: mine.filter(s => s.returned && s.grade != null).length, submitted: mine.filter(s => s.submitted).length, late: mine.filter(s => s.late).length, total: CW.length };
    }),
    empty: scenario === 'vide' ? ['0 devoir publié — pipeline Classroom non peuplé.'] : [],
  }) : json(403, { error: 'Accès refusé' });
  if (p === '/api/classroom/coursework') return require(['formateur', 'admin']) ? json(200, { coursework: scenario === 'vide' ? [] : CW }) : json(403, { error: 'Accès refusé' });
  if (p === '/api/classroom/submissions') return require(['formateur', 'admin']) ? json(200, { courseworkCount: scenario === 'vide' ? 0 : CW.length, coursework: scenario === 'vide' ? [] : CW.map(c => ({ id: c.id, title: c.title, dueDate: c.dueDate })), submissions: scenario === 'vide' ? [] : SUBS_PEUPLE }) : json(403, { error: 'Accès refusé' });
  if (p === '/api/classroom/status') return require(['formateur', 'admin']) ? json(200, { connected: true, account: 'mock@google.test', scopes: ['classroom.coursework.students'] }) : json(403, { error: 'Accès refusé' });
  if (p === '/api/password' && req.method === 'POST') { if (!role) return json(401, { error: 'Non connecté' }); return json(200, { ok: true }); }
  if (p === '/api/feedback' && req.method === 'POST') { if (!require(['formateur', 'admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { ok: true, returned: true, graded: true, note: 'mock : renvoi effectue' }); }
  if (p === '/api/candidates' && req.method === 'GET') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { total: 1, counts: { total: 1, nouveaux: 1, nouveauxJour: 1, aVerifier: 1, payeNonAdmis: 0, payeCount: 0, attendu: 1, admis: 0 }, sync: { ok: true, fetched: 1, note: 'mock' }, candidates: [{ responseId: 'MOCK1', name: 'Jean Testeur', email: 'jean.testeur@exemple.test', phone: '+243 000 000 000', profile: 'Entrepreneur', level: 'Débutant', goal: 'objectifs de test', extra: [], submittedAt: new Date().toISOString(), status: 'nouveau', payment: { state: 'non_verifie' }, learnerEmail: null, events: [{ ts: new Date().toISOString(), kind: 'inscription', label: 'Candidature reçue du formulaire (mock)' }] }] }); }
  if (/^\/api\/candidates\/[A-Za-z0-9_-]+\/admit$/.test(p) && req.method === 'POST') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(409, { error: 'Paiement non marqué PAYÉ (mock).' }); }
  if (/^\/api\/candidates\/[A-Za-z0-9_-]+$/.test(p) && req.method === 'PATCH') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { ok: true, candidate: {} }); }
  if (p === '/api/classroom/invitations' && req.method === 'GET') { if (!require(['formateur', 'admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { invitations: [], empty: [] }); }
  if (p === '/api/settings/billing') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { billing: {} }); }
  if (p === '/api/users/reset-password' && req.method === 'POST') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { ok: true, email: 'awa@e2e.test', name: 'Awa', initialPassword: 'MOCK-PW' }); }
  if (p === '/api/roster/import' && req.method === 'POST') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(200, { imported: [], importedCount: 0, skipped: [], note: 'mock — non persisté (test uniquement)' }); }
  if (p === '/api/roster/invite' && req.method === 'POST') { if (!require(['admin'])) return json(403, { error: 'Accès refusé' }); return json(409, { error: 'Re-consentement OAuth requis (mock).' }); }

  // fichiers statiques : /ui/... sert depuis ROOT/ui/... ; autres depuis ROOT
  if (p.includes('..')) { json(400, { error: 'chemin invalide' }); return; }
  let file;
  const uiDir = path.join(ROOT, decodeURIComponent(p), 'index.html');
  const uiFile = path.join(ROOT, decodeURIComponent(p));
  const rootFile = path.join(ROOT, decodeURIComponent(p));
  if (p === '/') file = path.join(ROOT, 'ui', 'login', 'index.html');
  else if (fs.existsSync(uiDir) && fs.statSync(uiDir).isFile()) file = uiDir;
  else if (fs.existsSync(uiFile) && fs.statSync(uiFile).isFile()) file = uiFile;
  else file = rootFile;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    const ext = path.extname(file);
    res.writeHead(200, { 'Content-Type': ext === '.html' ? 'text/html; charset=utf-8' : 'text/plain' });
    return res.end(fs.readFileSync(file));
  }
  json(404, { error: 'mock 404 ' + p });
});
server.listen(PORT, () => console.log(`🧪 MOCK 2B (TEST ONLY) http://localhost:${PORT}  scenarios: ?scenario=vide|peuple`));
