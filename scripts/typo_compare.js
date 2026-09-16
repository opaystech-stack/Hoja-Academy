#!/usr/bin/env node
/**
 * typo_compare.js — génère la planche de comparaison avant/après du lot typographique.
 * Lecture seule : produit un HTML autonome pointant vers les captures.
 *
 * Usage : node scripts/typo_compare.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BEFORE = path.join(ROOT, 'screenshots', 'typo-before');
const AFTER = path.join(ROOT, 'screenshots', 'typo-after');
const OUT = path.join(ROOT, 'screenshots', 'typo-comparaison.html');

const WIDTHS = [360, 390, 430, 820, 1366];
const PAGES = [
  ['accueil', 'Accueil'],
  ['entreprises', 'Entreprises'],
  ['formations', 'Formations'],
  ['programme-intensif', 'Programme Intensif'],
  ['contact', 'Contact'],
];

const dim = (p) => {
  const b = fs.readFileSync(p);
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
};
const rel = (p) => path.relative(path.dirname(OUT), p).replace(/\\/g, '/');

let rows = '';
for (const [slug, label] of PAGES) {
  let cells = '';
  for (const w of WIDTHS) {
    const b = dim(path.join(BEFORE, `${slug}-${w}.png`));
    const a = dim(path.join(AFTER, `${slug}-${w}.png`));
    const d = ((a.h - b.h) / b.h) * 100;
    const cls = Math.abs(d) < 1 ? 'flat' : d < 0 ? 'down' : 'up';
    cells += `
      <td>
        <div class="head">
          <span class="w">${w} px</span>
          <span class="delta ${cls}">${d >= 0 ? '+' : ''}${d.toFixed(1)} % de hauteur</span>
        </div>
        <div class="pair">
          <figure>
            <figcaption>Avant · ${b.h} px</figcaption>
            <a href="${rel(path.join(BEFORE, `${slug}-${w}.png`))}" target="_blank">
              <img src="${rel(path.join(BEFORE, `${slug}-${w}.png`))}" alt="Avant ${label} ${w}">
            </a>
          </figure>
          <figure>
            <figcaption>Après · ${a.h} px</figcaption>
            <a href="${rel(path.join(AFTER, `${slug}-${w}.png`))}" target="_blank">
              <img src="${rel(path.join(AFTER, `${slug}-${w}.png`))}" alt="Après ${label} ${w}">
            </a>
          </figure>
        </div>
      </td>`;
  }
  rows += `
    <section>
      <h2>${label}</h2>
      <div class="scroll"><table><tbody><tr>${cells}</tr></tbody></table></div>
    </section>`;
}

const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Normalisation typographique — avant / après</title>
<style>
  :root{--bg:#0b1220;--card:#111a2b;--line:#22304a;--txt:#e6edf7;--dim:#93a4bd;--teal:#10b981;--amber:#f59e0b;--blue:#38bdf8}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--txt);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
  header{padding:28px 24px 16px;border-bottom:1px solid var(--line)}
  h1{margin:0 0 6px;font-size:20px;letter-spacing:-.01em}
  header p{margin:0;color:var(--dim);max-width:70ch}
  section{padding:20px 24px 8px}
  section h2{margin:0 0 12px;font-size:15px;font-weight:600;color:var(--blue);letter-spacing:.02em;text-transform:uppercase}
  .scroll{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--card)}
  table{border-collapse:separate;border-spacing:0;width:max-content}
  td{vertical-align:top;padding:12px;border-right:1px solid var(--line);width:300px}
  td:last-child{border-right:0}
  .head{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:8px}
  .w{font-weight:600;font-size:12px;letter-spacing:.04em;color:var(--dim);text-transform:uppercase}
  .delta{font-size:11px;padding:2px 6px;border-radius:999px;border:1px solid}
  .delta.down{color:var(--teal);border-color:#10b98155;background:#10b98112}
  .delta.up{color:var(--amber);border-color:#f59e0b55;background:#f59e0b12}
  .delta.flat{color:var(--dim);border-color:#93a4bd55}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}
  figure{margin:0}
  figcaption{font-size:10px;color:var(--dim);margin-bottom:4px;letter-spacing:.03em}
  img{width:100%;display:block;border:1px solid var(--line);border-radius:6px;background:#fff}
  footer{padding:16px 24px 40px;color:var(--dim);font-size:12px;border-top:1px solid var(--line);margin-top:20px}
  code{background:#0f1829;border:1px solid var(--line);padding:1px 5px;border-radius:4px}
</style></head><body>
<header>
  <h1>Normalisation typographique du site public — avant / après</h1>
  <p>45 tailles déclarées ramenées à une échelle de 8 pas (12 / 14 / 16 / 18 / 22 / 28 / 36 / 48)
     plus un palier d'affichage (60 / 84). Remappage par fonction, pas mécanique.
     Contrôle aux 5 largeurs de référence. Cliquez une vignette pour l'ouvrir en pleine résolution.</p>
</header>
${rows}
<footer>
  Généré par <code>scripts/typo_compare.js</code>. Les hauteurs sont celles des captures pleine page,
  neutralisation des animations appliquée. Un écart négatif signifie une page plus courte
  (corps de texte ramené de 20 px à 16 px) ; un écart positif, quelques lignes supplémentaires
  après passage des labels de 15 px à 16 px.
</footer>
</body></html>`;

fs.writeFileSync(OUT, html);
console.log(`Planche écrite : ${OUT}`);
