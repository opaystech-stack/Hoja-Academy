'use strict';
// Résout le SHA du commit Git courant depuis les métadonnées .git
// strictement whitelistées (HEAD, refs/, packed-refs) — jamais config,
// hooks ni base d'objets. Échec systématique (fail-closed) si la
// référence est absente ou si le SHA est malformé.
// Usage :
//   node resolve-git-sha.js --git-dir <dir> [--expect <sha>] [--out <fichier>]
// Sortie : le SHA sur stdout ; --out écrit {"revision":"<sha>"}\n
const fs = require('fs');
const path = require('path');

const SHA_RE = /^[0-9a-f]{40}$/;

function fail(msg) {
  process.stderr.write('resolve-git-sha: ' + msg + '\n');
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { gitDir: null, expect: null, out: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--git-dir') opts.gitDir = argv[++i];
    else if (a === '--expect') opts.expect = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--help') {
      process.stdout.write('usage: node resolve-git-sha.js --git-dir <dir> [--expect <sha>] [--out <fichier>]\n');
      process.exit(0);
    } else fail('argument inconnu: ' + a);
  }
  if (!opts.gitDir) fail('--git-dir requis');
  return opts;
}

function readTrim(p) {
  return fs.readFileSync(p, 'utf8').trim();
}

function resolveSha(gitDir) {
  let head;
  try {
    head = readTrim(path.join(gitDir, 'HEAD'));
  } catch (_) {
    fail('.git/HEAD illisible (checkout Git requis)');
  }
  // État détaché : HEAD contient directement le SHA.
  if (SHA_RE.test(head)) return head;
  // État branché : résoudre la référence, loose puis packed.
  const m = /^ref: (.+)$/.exec(head);
  if (!m) fail('HEAD malformé');
  const ref = m[1];
  const loose = path.join(gitDir, ref);
  if (fs.existsSync(loose)) {
    const sha = readTrim(loose);
    if (!SHA_RE.test(sha)) fail('SHA malformé dans ' + ref);
    return sha;
  }
  const packed = path.join(gitDir, 'packed-refs');
  if (fs.existsSync(packed)) {
    for (const line of fs.readFileSync(packed, 'utf8').split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#') || t.startsWith('^')) continue;
      const sp = t.indexOf(' ');
      if (sp < 0) continue;
      const sha = t.slice(0, sp);
      const name = t.slice(sp + 1).trim();
      if (name === ref) {
        if (!SHA_RE.test(sha)) fail('SHA malformé dans packed-refs pour ' + ref);
        return sha;
      }
    }
  }
  fail('référence introuvable (loose et packed-refs): ' + ref);
}

const opts = parseArgs(process.argv.slice(2));
const sha = resolveSha(opts.gitDir);
if (opts.expect !== null && opts.expect !== undefined) {
  if (!SHA_RE.test(opts.expect)) fail('--expect malformé');
  if (opts.expect !== sha) fail('divergence: checkout=' + sha + ' attendu=' + opts.expect);
}
if (opts.out) {
  const dir = path.dirname(opts.out);
  if (dir && dir !== '.') fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(opts.out, JSON.stringify({ revision: sha }) + '\n');
}
process.stdout.write(sha + '\n');
