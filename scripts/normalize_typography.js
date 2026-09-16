#!/usr/bin/env node
/**
 * Normalisation typographique du site public Hoja — Lot A.
 *
 * Ramène les 45 tailles déclarées à une échelle de 8 pas + 1 palier d'affichage,
 * avec un remappage PAR FONCTION et non mécanique :
 *
 *   12px  caption, métadonnée, badge, mention
 *   14px  label, navigation, texte dense (listes, pied de page)
 *   16px  corps de texte
 *   18px  sous-titre, accroche, chapô
 *   22px  titre de section (mobile → md)
 *   28px  titre de page (mobile → md)
 *   36px  titre de section (desktop)
 *   48px  titre de héros (base → lg)
 *   60 / 84px  palier d'affichage : grands nombres et titres de héros ≥ 1536 px
 *
 * Règles :
 *  - Les préfixes `max-md:` / `max-lg:` (mobile) descendent d'un cran dans l'échelle.
 *  - Un interligne n'est ajusté QUE s'il valait exactement la taille de police
 *    (ratio 1.0) — il suit alors la nouvelle taille pour rester à 1.0.
 *    Tous les autres interlignes sont laissés intacts (rythme vertical préservé).
 *  - `.cn0` (base du <body>) : 20px/33px → 16px/26px (corps éditorial du design system).
 *
 * Usage : node scripts/normalize_typography.js [--dry]
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "hoja-site", "src");
const DRY = process.argv.includes("--dry");

const px2rem = (px) => {
  const v = (px / 16).toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
  return v + "rem";
};

// --- Échelle cible (8 pas + palier d'affichage) ------------------------------
const S = { 12: 12, 14: 14, 16: 16, 18: 18, 22: 22, 28: 28, 36: 36, 48: 48, 60: 60, 84: 84 };

// --- Remappage des tailles arbitraires (px source → px cible) ----------------
const MAP = {
  10: S[12], 11: S[12], 12: S[12],                        // caption / métadonnée
  13: S[14], 14: S[14],                                   // label / texte dense
  15: S[16], 16: S[16], 17: S[16],                        // corps de texte
  18: S[18], 19: S[18],                                   // sous-titre / accroche
  20: S[22], 21: S[22], 22: S[22], 23: S[22],             // titre de section
  24: S[28], 25: S[28], 26: S[28], 27: S[28], 28: S[28],  // titre de page
  30: S[28], 32: S[36], 33: S[36], 35: S[36], 36: S[36],  // héros de section
  37: S[36], 41: S[36],
  42: S[48], 44: S[48], 45: S[48], 46: S[48], 47: S[48],
  49: S[48], 50: S[48], 52: S[48], 55: S[48], 56: S[48],  // héros principal (base → lg)
  60: S[60], 64: S[60], 76: S[60],                        // grands nombres
  80: S[84], 82: S[84], 85: S[84],                        // titre de héros (≥ 1536 px)
};

// --- Classes Tailwind nommées : desktop / mobile -----------------------------
const NAMED = {
  "text-xs":   { desktop: S[12], mobile: S[12] },
  "text-sm":   { desktop: S[14], mobile: S[14] },
  "text-base": { desktop: S[16], mobile: S[16] },
  "text-lg":   { desktop: S[18], mobile: S[18] },
  "text-xl":   { desktop: S[22], mobile: S[22] },
  "text-2xl":  { desktop: S[28], mobile: S[22] },
  "text-3xl":  { desktop: S[36], mobile: S[28] },
  "text-4xl":  { desktop: S[48], mobile: S[28] },
  "text-5xl":  { desktop: S[48], mobile: S[28] },
  "text-6xl":  { desktop: S[60], mobile: S[36] },
  "text-7xl":  { desktop: S[84], mobile: S[36] },
};

// --- Exceptions fonctionnelles, appliquées AVANT le remappage général --------
// La navigation et le pied de page sont du texte dense (labels), pas du corps
// éditorial : ils restent au pas 14 même là où la source disait 15.
const FILE_EXCEPTIONS = [
  { file: /sections[\\/](navbar|footer)\.tsx$/, from: "text-[0.9375rem]", to: "text-[0.875rem]" },
];

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(tsx|ts|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

const report = [];
let changedFiles = 0;
let totalSubs = 0;

for (const abs of walk(ROOT)) {
  const rel = path.relative(ROOT, abs).replace(/\\/g, "/");
  let text = fs.readFileSync(abs, "utf8");
  const before = text;
  const subs = new Map();
  const bump = (from, to) => {
    subs.set(from + " → " + to, (subs.get(from + " → " + to) || 0) + 1);
    totalSubs++;
  };

  // --- 0. Exceptions fonctionnelles (avant tout remappage) ---
  for (const ex of FILE_EXCEPTIONS) {
    if (!ex.file.test(rel)) continue;
    const parts = text.split(ex.from);
    if (parts.length > 1) {
      bump(ex.from, ex.to);
      text = parts.join(ex.to);
    }
  }

  // --- 1+2. Police ET interligne solidaire, calculés sur les valeurs d'origine ---
  // Motif : text-[Nrem]  …(≤40 car.)…  (leading-N | leading-[Nrem])
  // L'interligne n'est remplacé que s'il valait exactement la taille de police.
  const PAIR =
    /text-\[([0-9.]+)rem\]([^"'`\n]{0,40}?)(leading-(?:\[([0-9.]+)rem\]|([0-9.]+)))(?![.\d])/g;

  text = text.replace(PAIR, (m, tRem, mid, leadCls, leadRem, leadScale) => {
    const fontPx0 = parseFloat(tRem) * 16;
    const leadPx0 = leadRem !== undefined ? parseFloat(leadRem) * 16 : parseFloat(leadScale) * 4;
    const fontPx1 = MAP[Math.round(fontPx0)];
    if (!fontPx1) return m; // taille source hors barème (ex. text-[0rem]) → intouchée

    let newLead = leadCls;
    if (Math.abs(fontPx0 - leadPx0) <= 0.6 && fontPx0 > 0) {
      // ratio 1.0 → l'interligne suit la nouvelle taille
      const same = Math.abs(fontPx1 - fontPx0) <= 0.01;
      if (!same) {
        newLead = leadRem !== undefined ? `leading-[${px2rem(fontPx1)}]` : `leading-${fontPx1 / 4}`;
        bump(leadCls, newLead);
      }
    }
    bump(`text-[${px2rem(fontPx0)}]`, `text-[${px2rem(fontPx1)}]`);
    return `text-[${px2rem(fontPx1)}]${mid}${newLead}`;
  });

  // --- 3. Tailles arbitraires restantes (sans interligne solidaire) ---
  text = text.replace(/text-\[([0-9.]+)(rem|px)\]/g, (m, n, unit) => {
    const px = Math.round(unit === "rem" ? parseFloat(n) * 16 : parseFloat(n));
    const target = MAP[px];
    if (!target) return m;
    const rep = `text-[${px2rem(target)}]`;
    if (rep !== m) bump(m, rep);
    return rep;
  });

  // --- 4. Classes nommées (avec conscience du préfixe responsive) ---
  text = text.replace(
    /(?<![\w-])((?:max-(?:md|lg|xl|2xl):)*)(text-(?:xs|sm|base|lg|xl|[2-7]xl))\b/g,
    (m, prefix, cls) => {
      const spec = NAMED[cls];
      if (!spec) return m;
      const target = /max-/.test(prefix) ? spec.mobile : spec.desktop;
      const rep = `${prefix}text-[${px2rem(target)}]`;
      bump(m, rep);
      return rep;
    }
  );

  // --- 5. .cn0 — base du <body> : 20px/33px → 16px/26px ---
  if (/ditto\.css$/.test(rel)) {
    text = text.replace(
      /font-size:20px;font-weight:400;font-style:normal;line-height:33px/g,
      () => {
        bump("corps .cn0 20px/33px", "corps .cn0 16px/26px");
        return "font-size:16px;font-weight:400;font-style:normal;line-height:26px";
      }
    );
  }

  if (text !== before) {
    changedFiles++;
    report.push({ rel, subs: [...subs.entries()] });
    if (!DRY) fs.writeFileSync(abs, text);
  }
}

console.log(
  `\n${DRY ? "[DRY-RUN] " : ""}NORMALISATION TYPOGRAPHIQUE — ${changedFiles} fichiers, ${totalSubs} remplacements\n`
);
report.sort((a, b) => b.subs.reduce((s, [, n]) => s + n, 0) - a.subs.reduce((s, [, n]) => s + n, 0));
for (const r of report) {
  const n = r.subs.reduce((s, [, c]) => s + c, 0);
  console.log(`${String(n).padStart(4)}  ${r.rel}`);
  for (const [k, c] of r.subs) console.log(`        ${String(c).padStart(3)}×  ${k}`);
}
if (DRY) console.log("\nAucune écriture (--dry).");
