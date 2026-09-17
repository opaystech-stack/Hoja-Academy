'use strict';
// TDD — Provenance du checkout Git pour les builds Dokploy (fail-closed).
// Le script scripts/resolve-git-sha.js doit résoudre le SHA depuis les
// métadonnées .git whitelistées (HEAD + refs + packed-refs) et refuser
// toute ambiguïté. Test local, zéro dépendance, fixtures jetables.
const { execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const assert = require('node:assert/strict');

const script = path.join(__dirname, 'resolve-git-sha.js');
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'prov-'));
const SHA_A = 'a'.repeat(40);
const SHA_B = 'b'.repeat(40);
const results = [];

function fixture(name, files) {
  const dir = path.join(root, name);
  for (const [rel, content] of Object.entries(files)) {
    const p = path.join(dir, rel);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
  }
  return path.join(dir, '.git');
}

function run(args) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [script, ...args], { encoding: 'utf8' }).trim(), err: '' };
  } catch (e) {
    return { code: e.status == null ? -1 : e.status, out: (e.stdout || '').trim(), err: (e.stderr || '').trim() };
  }
}

function check(label, fn) {
  try { fn(); results.push('PASS ' + label); }
  catch (e) { results.push('FAIL ' + label + ' :: ' + e.message); }
}

// 1. HEAD détaché (SHA brut)
const g1 = fixture('detached', { '.git/HEAD': SHA_A + '\n' });
check('HEAD détaché -> SHA', () => {
  const r = run(['--git-dir', g1]);
  assert.equal(r.code, 0, 'exit: ' + r.err);
  assert.equal(r.out, SHA_A);
});

// 2. ref symbolique -> ref loose
const g2 = fixture('loose', { '.git/HEAD': 'ref: refs/heads/main\n', '.git/refs/heads/main': SHA_A + '\n' });
check('ref loose -> SHA', () => {
  const r = run(['--git-dir', g2]);
  assert.equal(r.code, 0, 'exit: ' + r.err);
  assert.equal(r.out, SHA_A);
});

// 3. ref symbolique -> packed-refs (clone Dokploy typique)
const g3 = fixture('packed', {
  '.git/HEAD': 'ref: refs/heads/main\n',
  '.git/packed-refs': '# pack-refs with: peeled fully-peeled sorted \n' + SHA_B + ' refs/heads/autre\n' + SHA_B + ' refs/heads/main\n',
});
check('packed-refs -> SHA', () => {
  const r = run(['--git-dir', g3]);
  assert.equal(r.code, 0, 'exit: ' + r.err);
  assert.equal(r.out, SHA_B);
});

// 4. FAIL-CLOSED : ref absente (loose et packed)
const g4 = fixture('missing-ref', { '.git/HEAD': 'ref: refs/heads/inconnue\n' });
check('ref absente -> échec', () => {
  const r = run(['--git-dir', g4]);
  assert.notEqual(r.code, 0);
});

// 5. FAIL-CLOSED : SHA malformé dans packed-refs
const g5 = fixture('malformed', { '.git/HEAD': 'ref: refs/heads/main\n', '.git/packed-refs': 'zz1234 refs/heads/main\n' });
check('SHA malformé -> échec', () => {
  const r = run(['--git-dir', g5]);
  assert.notEqual(r.code, 0);
});

// 6. FAIL-CLOSED : .git absent
check('.git absent -> échec', () => {
  const r = run(['--git-dir', path.join(root, 'inexistant', '.git')]);
  assert.notEqual(r.code, 0);
});

// 7. Détection de divergence : --expect différent du checkout = échec
check('divergence détectée (--expect != checkout)', () => {
  const r = run(['--git-dir', g1, '--expect', SHA_B]);
  assert.notEqual(r.code, 0, 'un SHA affiché différent du checkout doit être refusé');
});

// 8. --expect identique -> succès
check('--expect conforme -> succès', () => {
  const r = run(['--git-dir', g1, '--expect', SHA_A]);
  assert.equal(r.code, 0, 'exit: ' + r.err);
});

// 9. --out écrit exactement {"revision":"<sha>"}\n
const out9 = path.join(root, 'rev9.json');
check('--out écrit build-revision.json exact', () => {
  const r = run(['--git-dir', g1, '--out', out9]);
  assert.equal(r.code, 0, 'exit: ' + r.err);
  assert.equal(fs.readFileSync(out9, 'utf8'), JSON.stringify({ revision: SHA_A }) + '\n');
});

// 10. .dockerignore : whitelist métadonnées Git (jamais bare .git)
check('.dockerignore whitelist .git minimal', () => {
  const d = fs.readFileSync(path.join(__dirname, '..', '.dockerignore'), 'utf8');
  assert.ok(!/^\.git$/m.test(d), 'une exclusion bare .git empêche la provenance');
  for (const line of ['.git/*', '!.git/HEAD', '!.git/refs', '!.git/packed-refs'])
    assert.ok(d.split(/\r?\n/).includes(line), 'ligne manquante: ' + line);
});

// 11. Dockerfile public : étape provenance, plus de SHA manuel, JSON servi
check('Dockerfile public: provenance intégrée, ARG GIT_SHA retiré', () => {
  const d = fs.readFileSync(path.join(__dirname, '..', 'deploy/dokploy/Dockerfile.public'), 'utf8');
  assert.ok(d.includes('resolve-git-sha.js'), 'étape provenance requise');
  assert.ok(d.includes('COPY --from=provenance /provenance/build-revision.json'), 'JSON provenance copié au webroot');
  assert.ok(!d.includes('ARG GIT_SHA'), 'ARG GIT_SHA manuel interdit');
  assert.ok(!d.includes('org.opencontainers.image.revision'), 'label SHA manuel interdit');
  assert.ok(!d.includes('printf'), 'printf revision manuel interdit');
});

console.log(results.join('\n'));
const failed = results.filter((r) => r.startsWith('FAIL'));
console.log(`PROVENANCE: ${results.length - failed.length}/${results.length}`);
process.exit(failed.length ? 1 : 0);
