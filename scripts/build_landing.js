/**
 * OPAYS ACADEMY — LANDING v4 (refonte premium)
 * Direction : institution technologique sobre — thème clair, zéro dégradé, zéro emoji.
 * Références 21st.dev : Floating Header (id 8137, pill centré + drawer mobile),
 * bento grid 01 (id 9594, grille asymétrique animée), accordion FAQ (details natif).
 * Structure : header flottant pill • hero + diagramme système • problème • promesse (bento)
 * • pour qui • méthode 4 étapes (progression scroll) • ce que vous construisez (bento)
 * • format • différenciation • FAQ (5) • CTA final • footer.
 * Contraintes : AUCUN lien /modules/ ni /admin/ ; CTA = cohorte.enrollmentUrl uniquement.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { DIRS } = require('./config');
const cohorte = require('../data/cohorte.js');

const LANDING_DIR = path.join(DIRS.root, 'landing');
const enrollmentUrl = cohorte.enrollmentUrl || '#inscription';
const extAttr = enrollmentUrl.startsWith('http') ? ' target="_blank" rel="noopener"' : '';

// ─── Logo (identité HOJA ACADEMY) ───────────────────────────────────
const faviconB64 = fs.readFileSync(path.join(DIRS.root, 'Logo', 'favicon_hoja_64.png')).toString('base64');
const faviconData = 'data:image/png;base64,' + faviconB64;
const logoNav = `<img src="${faviconData}" alt="HOJA ACADEMY" style="width:30px;height:30px;border-radius:7px">`;
const logoFooter = `<img src="${faviconData}" alt="HOJA ACADEMY" style="width:26px;height:26px;border-radius:6px">`;

// ─── Icônes SVG (stroke 1.5, 24×24 — aucune emoji) ──────────────────
const I = {
  time: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></svg>',
  work: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h10v4H7z"/><path d="M5 7h14v13H5z"/><path d="M9 12h6M9 16h4"/></svg>',
  build: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.2 7.4 10 15.6M16.8 7.4 14 15.6"/></svg>',
  assistant: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v.01M12 12v3.5"/><path d="M8.5 12h7"/></svg>',
  workflow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="6" height="6" rx="1.5"/><rect x="15" y="14" width="6" height="6" rx="1.5"/><path d="M9 7h4a3 3 0 0 1 3 3v4"/></svg>',
  skill: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 4 7l8 4 8-4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 17l8 4 8-4"/></svg>',
  automation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 3v4h-4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  system: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="6" width="13" height="12" rx="3"/><path d="m16 10 5-3v10l-5-3"/></svg>',
  support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-4.5-7.8"/><path d="M21 3v4h-4"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>',
  case: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 12h18"/></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/></svg>',
  group: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.5a5 5 0 0 1 5 4.5"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
};

// ─── Données éditoriales ─────────────────────────────────────────────
const promesses = [
  { icon: I.time, title: 'Gagner du temps', desc: 'Identifiez les tâches qui vous ralentissent et construisez des méthodes pour les traiter plus rapidement.', vis: 'bars' },
  { icon: I.work, title: 'Mieux travailler', desc: 'Utilisez l\u2019IA pour rechercher, analyser, rédiger, synthétiser et décider avec davantage de méthode.', vis: 'doc' },
  { icon: I.build, title: 'Construire vos propres systèmes', desc: 'Passez du simple prompt à des assistants, workflows et automatisations adaptés à votre métier.', vis: 'nodes' },
];

const profils = [
  { title: 'Dirigeants et cadres', desc: 'Pour gagner du temps sur les tâches de pilotage et de décision.' },
  { title: 'Professionnels administratifs', desc: 'Pour transformer les tâches documentaires répétitives.' },
  { title: 'Entrepreneurs', desc: 'Pour produire plus vite et structurer leurs opérations.' },
  { title: 'Organisations, ONG et institutions', desc: 'Pour intégrer l\u2019IA dans les processus réels de travail.' },
];

const etapes = [
  { n: '01', title: 'Comprendre', desc: 'Ce que l\u2019IA sait faire — et ce qu\u2019elle ne sait pas faire.' },
  { n: '02', title: 'Expérimenter', desc: 'Sur vos propres documents, vos propres cas.' },
  { n: '03', title: 'Construire', desc: 'Des assistants et des workflows adaptés à votre métier.' },
  { n: '04', title: 'Automatiser', desc: 'Des tâches entières qui se traitent sans vous.' },
];

const construits = [
  { icon: I.assistant, title: 'Assistant IA', desc: 'Un assistant configuré pour votre métier, avec ses règles et sa mémoire.', wide: true },
  { icon: I.workflow, title: 'Workflows', desc: 'Des enchaînements d\u2019étapes à contrôle humain.', wide: false },
  { icon: I.skill, title: 'Skills', desc: 'Vos procédures métier transformées en capacités réutilisables.', wide: false },
  { icon: I.automation, title: 'Automatisations', desc: 'Des tâches entières qui se traitent sans vous.', wide: true },
  { icon: I.search, title: 'Méthodes de recherche', desc: 'Des synthèses sourcées et vérifiables.', wide: false },
  { icon: I.system, title: 'Système de travail personnel', desc: 'Votre environnement complet, documenté et durable.', wide: true },
];

const formats = [
  { icon: I.calendar, title: '8 semaines', desc: 'Un rythme soutenu, un objectif clair.' },
  { icon: I.video, title: '2 séances live par semaine', desc: 'En visioconférence, en petit groupe.' },
  { icon: I.support, title: 'Accompagnement entre les séances', desc: 'Permanences et suivi individuel.' },
  { icon: I.case, title: 'Travail sur vos propres cas', desc: 'Vos documents, vos tâches, vos outils.' },
  { icon: I.globe, title: 'En ligne + présentiel possible', desc: 'Selon la localisation des participants.' },
  { icon: I.group, title: 'Cohortes limitées', desc: 'Pour garantir la qualité des ateliers.' },
];

const comparaison = [
  ['Apprendre des outils', 'Résoudre des problèmes'],
  ['Accumuler des prompts', 'Construire des systèmes'],
  ['Théorie', 'Pratique'],
  ['Démonstrations génériques', 'Cas réels'],
  ['Certificat de présence', 'Preuve de compétence'],
];

const faqs = [
  { q: 'À qui s\u2019adresse la formation ?', a: 'Aux professionnels en activité : dirigeants, cadres, responsables administratifs, entrepreneurs, équipes d\u2019ONG et d\u2019institutions. Aucun prérequis technique — seulement l\u2019envie de mieux travailler.' },
  { q: 'Faut-il savoir coder ?', a: 'Non. La formation utilise des assistants IA grand public et leurs options avancées. Si vous savez utiliser un navigateur, vous êtes éligible.' },
  { q: 'Comment se déroulent les séances ?', a: 'Deux séances live par semaine, en petit groupe. Chaque séance alterne explication, démonstration sur un cas réel et pratique guidée sur vos propres documents.' },
  { q: 'Est-ce en ligne ou en présentiel ?', a: 'En ligne, en visioconférence. Des sessions en présentiel peuvent être organisées selon la localisation des participants.' },
  { q: 'Comment candidater ?', a: 'Remplissez le formulaire de candidature. Votre dossier est examiné, puis nous vous contactons pour confirmer votre place et les modalités d\u2019inscription.' },
];

// ─── Fragments HTML ──────────────────────────────────────────────────
const cta = (label, cls) =>
  '<a class="btn ' + cls + '" href="' + enrollmentUrl + '"' + extAttr + '>' + label + '<span class="btn-ic">' + I.arrow + '</span></a>';

const promesseHtml = promesses.map((p, i) => {
  const vis = p.vis === 'bars'
    ? '<div class="vis-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>'
    : p.vis === 'doc'
      ? '<div class="vis-doc" aria-hidden="true"><span class="d-line w80"></span><span class="d-line w60"></span><span class="d-line w70"></span><span class="d-check">' + I.work + '</span></div>'
      : '<div class="vis-nodes" aria-hidden="true"><span class="n1"></span><span class="n2"></span><span class="n3"></span><span class="l1"></span><span class="l2"></span></div>';
  return '<div class="bento-cell b' + (i + 1) + ' reveal" data-delay="' + (i * 90) + '">' +
    '<div class="bento-vis">' + vis + '</div>' +
    '<div class="bento-txt"><span class="bento-ic">' + p.icon + '</span><h3>' + p.title + '</h3><p>' + p.desc + '</p></div>' +
    '</div>';
}).join('\n      ');

const profilsHtml = profils.map((p, i) =>
  '<li class="reveal" data-delay="' + (i * 70) + '"><h3>' + p.title + '</h3><p>' + p.desc + '</p></li>'
).join('\n      ');

const etapesHtml = etapes.map((e, i) =>
  '<div class="mstep reveal" data-delay="' + (i * 80) + '"><span class="mnum">' + e.n + '</span><h3>' + e.title + '</h3><p>' + e.desc + '</p></div>'
).join('\n      ');

const construitsHtml = construits.map((c, i) =>
  '<div class="cb-cell' + (c.wide ? ' wide' : '') + ' reveal" data-delay="' + (i * 70) + '">' +
  '<span class="cb-ic">' + c.icon + '</span><h3>' + c.title + '</h3><p>' + c.desc + '</p></div>'
).join('\n      ');

const formatsHtml = formats.map((f, i) =>
  '<div class="fmt reveal" data-delay="' + (i * 60) + '"><span class="fmt-ic">' + f.icon + '</span><h3>' + f.title + '</h3><p>' + f.desc + '</p></div>'
).join('\n      ');

const comparaisonHtml = comparaison.map((row, i) =>
  '<div class="cmp-row reveal" data-delay="' + (i * 60) + '"><span class="cmp-a">' + row[0] + '</span><span class="cmp-b">' + row[1] + '</span></div>'
).join('\n      ');

const faqHtml = faqs.map(f =>
  '<details class="faq-item"><summary><span>' + f.q + '</span><span class="faq-ic" aria-hidden="true"></span></summary><div class="faq-a"><p>' + f.a + '</p></div></details>'
).join('\n      ');

// ─── CSS ─────────────────────────────────────────────────────────────
const CSS = `:root{
  --ink:#0A0F1E; --ink2:#1A2233;
  --bg:#F7F8FA; --surface:#FFFFFF;
  --line:#E4E7EE; --line2:#D3D8E2;
  --txt:#0A0F1E; --muted:#5A6478; --faint:#8A93A6;
  --accent:#1D4ED8; --accent-soft:#E8EEFC;
  --gold:#B8860B;
  --radius:16px;
  --shadow-sm:0 1px 2px rgba(10,15,30,.05),0 2px 8px rgba(10,15,30,.05);
  --shadow-md:0 4px 12px rgba(10,15,30,.07),0 12px 32px rgba(10,15,30,.08);
  --font-d:'Sora',system-ui,sans-serif;
  --font-b:'Inter',system-ui,sans-serif;
  --font-m:'IBM Plex Mono',ui-monospace,monospace;
}
*{margin:0;padding:0;box-sizing:border-box}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);background:var(--bg);color:var(--txt);line-height:1.6;overflow-x:hidden;-webkit-font-smoothing:antialiased;-webkit-tap-highlight-color:transparent}
a{color:inherit;text-decoration:none}
img,svg{display:block}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:6px}
.skip-link{position:absolute;left:16px;top:-60px;z-index:100;background:var(--ink);color:#fff;padding:12px 20px;border-radius:10px;font-weight:600;font-size:14px;transition:top .2s ease}
.skip-link:focus-visible{top:16px}
section[id],main[id]{scroll-margin-top:96px}
h1,h2{text-wrap:balance}
h1,h2,h3{font-family:var(--font-d);line-height:1.12;letter-spacing:-.025em;font-weight:600}
.wrap{max-width:1080px;margin:0 auto;padding:0 24px}
section{position:relative;padding:96px 0}
section.alt{background:var(--surface);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
button,a,summary{touch-action:manipulation}
.kicker{display:inline-flex;align-items:center;gap:8px;font-family:var(--font-m);font-size:11.5px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:var(--accent)}
.kicker::before{content:'';width:7px;height:7px;background:var(--gold);border-radius:2px}
.sec-head{max-width:760px;margin-bottom:56px}
.sec-head.center{margin-left:auto;margin-right:auto;text-align:center}
.sec-head.center .kicker{justify-content:center}
.sec-head h2{font-size:clamp(28px,4.2vw,44px);margin:16px 0 14px}
.sec-head p{color:var(--muted);font-size:17px;max-width:640px}
.sec-head.center p{margin:0 auto}
.reveal{opacity:0;transform:translateY(26px);transition:opacity .7s ease,transform .7s cubic-bezier(.16,.84,.32,1);transition-delay:var(--d,0ms)}
.reveal.in{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none;transition:none}
  *{animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}
}
/* ── Boutons ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;font-family:var(--font-b);font-weight:600;font-size:15.5px;line-height:1;border-radius:12px;padding:16px 28px;min-height:48px;cursor:pointer;border:0;transition:transform .22s ease,box-shadow .22s ease,background .22s ease,border-color .22s ease;will-change:transform}
.btn:active{transform:scale(.98)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.btn-primary{background:var(--ink);color:#fff;box-shadow:var(--shadow-sm)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);background:var(--ink2)}
.btn-primary .btn-ic{width:18px;height:18px;transition:transform .22s ease}
.btn-primary:hover .btn-ic{transform:translateX(3px)}
.btn-ghost{background:transparent;border:1px solid var(--line2);color:var(--txt)}
.btn-ghost:hover{border-color:var(--ink);transform:translateY(-2px)}
.btn-sm{padding:9px 18px;font-size:13.5px;border-radius:10px;min-height:40px}
.btn-sm .btn-ic{width:15px;height:15px}
/* ── Header flottant (réf. 21st Floating Header #8137) ── */
header{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:60;width:min(860px,calc(100% - 24px));transition:box-shadow .3s ease,top .3s ease}
.nav{display:flex;align-items:center;justify-content:space-between;gap:14px;background:rgba(255,255,255,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:999px;padding:8px 10px 8px 18px;box-shadow:var(--shadow-sm)}
header.scrolled{top:8px}
header.scrolled .nav{box-shadow:var(--shadow-md)}
.brand{display:flex;align-items:center;gap:10px;font-family:var(--font-d);font-weight:600;font-size:15.5px;letter-spacing:.01em}
.brand small{display:block;font-family:var(--font-m);font-size:9px;font-weight:500;letter-spacing:.22em;color:var(--faint);text-transform:uppercase;margin-top:1px}
.nav-links{display:flex;gap:4px}
.nav-links a{font-size:14px;font-weight:500;color:var(--muted);padding:8px 14px;border-radius:999px;transition:color .2s ease,background .2s ease}
.nav-links a:hover{color:var(--txt);background:var(--bg)}
.nav-cta{display:flex;align-items:center;gap:8px}
.menu-btn{display:none;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--txt);cursor:pointer;align-items:center;justify-content:center;transition:border-color .2s ease}
.menu-btn:hover{border-color:var(--ink)}
.menu-btn svg{width:20px;height:20px}
.menu-btn .ic-close{display:none}
body.menu-open .menu-btn .ic-open{display:none}
body.menu-open .menu-btn .ic-close{display:block}
.mobile-menu{display:none;position:fixed;top:76px;left:12px;right:12px;z-index:59;background:var(--surface);border:1px solid var(--line);border-radius:20px;box-shadow:var(--shadow-md);padding:10px;opacity:0;transform:translateY(-8px);transition:opacity .25s ease,transform .25s ease;pointer-events:none}
body.menu-open .mobile-menu{opacity:1;transform:none;pointer-events:auto}
.mobile-menu a{display:block;padding:14px 18px;font-size:15.5px;font-weight:500;border-radius:12px;color:var(--txt)}
.mobile-menu a:hover{background:var(--bg)}
.mobile-menu .btn{width:100%;margin-top:8px}
/* ── Hero ── */
.hero{padding:172px 0 88px;text-align:center}
.hero .wrap{max-width:880px}
.hero h1{font-size:clamp(36px,6.4vw,64px);font-weight:600;margin:20px 0 22px;letter-spacing:-.03em}
.hero .lead{font-size:clamp(16.5px,2.2vw,19px);color:var(--muted);max-width:640px;margin:0 auto 36px}
.cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
.hero-meta{margin-top:34px;font-family:var(--font-m);font-size:12px;letter-spacing:.08em;color:var(--faint);text-transform:uppercase}
.hero-meta b{color:var(--muted);font-weight:500}
/* ── Diagramme système (signature) ── */
.sys{position:relative;max-width:760px;margin:64px auto 0;aspect-ratio:2/1}
.sys svg.lines{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.sys path.link{fill:none;stroke:var(--line2);stroke-width:1.5;stroke-dasharray:420;stroke-dashoffset:420;animation:draw 1.6s ease-out forwards}
.sys path.link.l2{animation-delay:.15s}.sys path.link.l3{animation-delay:.3s}.sys path.link.l4{animation-delay:.45s}
@keyframes draw{to{stroke-dashoffset:0}}
.sys .dot{fill:var(--accent);opacity:.85}
.sys .dot.d2{fill:var(--gold)}
.node{position:absolute;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:2px;background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:10px 16px;box-shadow:var(--shadow-sm);white-space:nowrap;transition:border-color .25s ease,box-shadow .25s ease}
.node:hover{border-color:var(--line2);box-shadow:var(--shadow-md)}
.node .n-lbl{font-family:var(--font-m);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--faint)}
.node .n-t{font-family:var(--font-d);font-size:13.5px;font-weight:600}
.node.hub{background:var(--ink);border-color:var(--ink);padding:14px 22px;animation:hubPulse 4s ease-in-out infinite}
.node.hub .n-lbl{color:rgba(255,255,255,.55)}
.node.hub .n-t{color:#fff;font-size:15px}
@keyframes hubPulse{0%,100%{box-shadow:0 0 0 0 rgba(29,78,216,.14)}50%{box-shadow:0 0 0 12px rgba(29,78,216,0)}}
.n-doc{left:14.6%;top:18.9%}
.n-data{left:85.4%;top:18.9%}
.n-hub{left:50%;top:50%}
.n-wf{left:14.6%;top:81.1%}
.n-auto{left:85.4%;top:81.1%}
@media (prefers-reduced-motion:reduce){
  .sys path.link{stroke-dashoffset:0;animation:none}
  .sys .dot{display:none}
  .node.hub{animation:none}
}
/* ── Problème ── */
.prob .sec-head{max-width:820px}
.prob-grid{display:grid;grid-template-columns:1.1fr .9fr;gap:56px;align-items:start}
.prob-txt p{color:var(--muted);font-size:16.5px;margin-bottom:18px}
.prob-txt p strong{color:var(--txt);font-weight:600}
.prob-txt .punch{font-family:var(--font-d);font-size:clamp(19px,2.4vw,23px);color:var(--txt);line-height:1.35;letter-spacing:-.01em;margin-top:28px;padding-top:28px;border-top:1px solid var(--line)}
.tasks{display:flex;flex-wrap:wrap;gap:10px}
.tasks span{font-family:var(--font-m);font-size:12px;letter-spacing:.06em;color:var(--muted);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:9px 16px;transition:border-color .25s ease,color .25s ease}
.tasks span:hover{border-color:var(--accent);color:var(--accent)}
/* ── Promesse (bento, réf. 21st bento grid 01 #9594) ── */
.bento{display:grid;grid-template-columns:repeat(12,1fr);gap:18px}
.bento-cell{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:34px;display:flex;flex-direction:column;gap:26px;transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease;overflow:hidden}
.bento-cell:hover{border-color:var(--line2);box-shadow:var(--shadow-md);transform:translateY(-3px)}
.b1{grid-column:span 7;grid-row:span 2}
.b2,.b3{grid-column:span 5}
.bento-vis{flex:1;display:flex;align-items:center;justify-content:center;min-height:120px;border-radius:12px;background:var(--bg);border:1px solid var(--line)}
.bento-txt .bento-ic{display:inline-flex;width:44px;height:44px;border-radius:12px;background:var(--accent-soft);color:var(--accent);align-items:center;justify-content:center;margin-bottom:16px}
.bento-txt .bento-ic svg{width:22px;height:22px}
.bento-txt h3{font-size:21px;margin-bottom:8px}
.bento-txt p{color:var(--muted);font-size:15px}
.vis-bars{display:flex;align-items:flex-end;gap:10px;height:90px}
.vis-bars i{width:26px;border-radius:6px 6px 2px 2px;background:var(--accent);opacity:.9;transform-origin:bottom;animation:grow 1.1s cubic-bezier(.16,.84,.32,1) forwards;transform:scaleY(0)}
.vis-bars i:nth-child(1){height:38%;animation-delay:.1s}
.vis-bars i:nth-child(2){height:58%;animation-delay:.25s}
.vis-bars i:nth-child(3){height:46%;animation-delay:.4s}
.vis-bars i:nth-child(4){height:78%;animation-delay:.55s}
.vis-bars i:nth-child(5){height:100%;animation-delay:.7s;background:var(--gold)}
@keyframes grow{to{transform:scaleY(1)}}
.vis-doc{position:relative;width:150px;height:110px;background:var(--surface);border:1px solid var(--line2);border-radius:10px;padding:18px 16px;display:flex;flex-direction:column;gap:10px;box-shadow:var(--shadow-sm)}
.vis-doc .d-line{height:7px;border-radius:4px;background:var(--line2)}
.vis-doc .w80{width:80%}.vis-doc .w60{width:60%}.vis-doc .w70{width:70%}
.vis-doc .d-check{position:absolute;right:-14px;bottom:-14px;width:40px;height:40px;border-radius:12px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-md)}
.vis-doc .d-check svg{width:20px;height:20px}
.vis-nodes{position:relative;width:170px;height:110px}
.vis-nodes span{position:absolute;border-radius:50%;background:var(--surface);border:1.5px solid var(--accent)}
.vis-nodes .n1{width:34px;height:34px;left:0;top:38px}
.vis-nodes .n2{width:34px;height:34px;right:0;top:38px}
.vis-nodes .n3{width:44px;height:44px;left:63px;top:33px;background:var(--ink);border-color:var(--ink)}
.vis-nodes .l1,.vis-nodes .l2{position:absolute;height:1.5px;background:var(--line2);top:55px;border:0;border-radius:0}
.vis-nodes .l1{left:34px;width:29px}
.vis-nodes .l2{right:34px;width:29px}
/* ── Pour qui ── */
.profils{list-style:none;display:grid;grid-template-columns:1fr 1fr;gap:0 64px}
.profils li{padding:26px 0;border-top:1px solid var(--line);display:flex;flex-direction:column;gap:6px}
.profils li:last-child{border-bottom:1px solid var(--line)}
.profils h3{font-size:18.5px}
.profils p{color:var(--muted);font-size:15px}
/* ── Méthode ── */
.meth-wrap{position:relative}
.meth-track{position:absolute;top:0;left:0;right:0;height:2px;background:var(--line)}
.meth-bar{position:absolute;top:0;left:0;height:2px;background:var(--accent);width:0;transition:width .15s linear}
.meth{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;padding-top:44px}
.mstep{position:relative}
.mstep::before{content:'';position:absolute;top:-50px;left:0;width:10px;height:10px;border-radius:50%;background:var(--surface);border:2px solid var(--line2);transition:border-color .3s ease,background .3s ease}
.mstep.on::before{border-color:var(--accent);background:var(--accent)}
.mnum{font-family:var(--font-m);font-size:12px;letter-spacing:.14em;color:var(--faint)}
.mstep h3{font-size:19px;margin:10px 0 8px}
.mstep p{color:var(--muted);font-size:14.5px}
/* ── Ce que vous construisez (bento) ── */
.cb{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.cb-cell{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:30px;transition:border-color .3s ease,box-shadow .3s ease,transform .3s ease}
.cb-cell:hover{border-color:var(--line2);box-shadow:var(--shadow-md);transform:translateY(-3px)}
.cb-cell.wide{grid-column:span 2}
.cb-ic{display:inline-flex;width:42px;height:42px;border-radius:11px;background:var(--accent-soft);color:var(--accent);align-items:center;justify-content:center;margin-bottom:18px}
.cb-ic svg{width:21px;height:21px}
.cb-cell h3{font-size:18px;margin-bottom:8px}
.cb-cell p{color:var(--muted);font-size:14.5px}
/* ── Format ── */
.fmt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
.fmt{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:28px;transition:border-color .3s ease,transform .3s ease}
.fmt:hover{border-color:var(--line2);transform:translateY(-3px)}
.fmt-ic{display:inline-flex;width:40px;height:40px;border-radius:10px;background:var(--bg);border:1px solid var(--line);color:var(--ink);align-items:center;justify-content:center;margin-bottom:16px}
.fmt-ic svg{width:20px;height:20px}
.fmt h3{font-size:16.5px;margin-bottom:6px}
.fmt p{color:var(--muted);font-size:13.5px}
/* ── Différenciation ── */
.cmp{max-width:820px;margin:0 auto;border:1px solid var(--line);border-radius:var(--radius);overflow:hidden;background:var(--surface)}
.cmp-head{display:grid;grid-template-columns:1fr 1fr;font-family:var(--font-m);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase}
.cmp-head span{padding:16px 24px;color:var(--faint)}
.cmp-head span:last-child{background:var(--ink);color:#fff;text-align:center}
.cmp-row{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--line)}
.cmp-row span{padding:18px 24px;font-size:15px}
.cmp-row .cmp-a{color:var(--muted)}
.cmp-row .cmp-b{background:var(--ink);color:#fff;font-weight:500;text-align:center}
/* ── FAQ ── */
.faq{max-width:760px;margin:0 auto}
.faq-item{border:1px solid var(--line);border-radius:14px;background:var(--surface);margin-bottom:10px;transition:border-color .25s ease}
.faq-item[open]{border-color:var(--line2)}
.faq-item summary{list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:20px 24px;cursor:pointer;font-family:var(--font-d);font-weight:600;font-size:16px}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary:hover{color:var(--accent)}
.faq-ic{position:relative;width:18px;height:18px;flex-shrink:0}
.faq-ic::before,.faq-ic::after{content:'';position:absolute;background:var(--ink);border-radius:2px;transition:transform .25s ease}
.faq-ic::before{left:0;top:8px;width:18px;height:2px}
.faq-ic::after{left:8px;top:0;width:2px;height:18px}
.faq-item[open] .faq-ic::after{transform:scaleY(0)}
.faq-a{padding:0 24px 22px;color:var(--muted);font-size:15px;max-width:640px}
/* ── CTA final ── */
.final{background:var(--ink);color:#fff;text-align:center;padding:120px 0}
.final .kicker{color:#fff;justify-content:center}
.final .kicker::before{background:var(--gold)}
.final h2{font-size:clamp(30px,4.6vw,50px);margin:18px 0 14px;letter-spacing:-.03em}
.final p{color:rgba(255,255,255,.72);font-size:17.5px;max-width:560px;margin:0 auto 36px}
.final .btn-primary{background:#fff;color:var(--ink)}
.final .btn-primary:hover{background:#fff}
.final .note{margin-top:22px;font-family:var(--font-m);font-size:12px;letter-spacing:.06em;color:rgba(255,255,255,.5)}
/* ── Footer ── */
footer{background:var(--surface);border-top:1px solid var(--line);padding:40px 0}
.foot{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
.foot-brand{display:flex;align-items:center;gap:10px;font-family:var(--font-d);font-weight:600;font-size:14.5px}
.foot-brand small{display:block;font-family:var(--font-m);font-size:9px;letter-spacing:.2em;color:var(--faint);text-transform:uppercase}
.foot-links{display:flex;gap:26px;font-size:14px;color:var(--muted)}
.foot-links a:hover{color:var(--txt)}
.foot-copy{font-size:12.5px;color:var(--faint)}
/* ── Responsive ── */
@media(max-width:900px){
  section{padding:72px 0}
  .hero{padding:150px 0 64px}
  .prob-grid{grid-template-columns:1fr;gap:36px}
  .b1{grid-column:span 12;grid-row:auto}
  .b2,.b3{grid-column:span 12}
  .meth{grid-template-columns:repeat(2,1fr);gap:36px 24px}
  .mstep::before{top:-44px}
  .cb{grid-template-columns:1fr 1fr}
  .cb-cell.wide{grid-column:span 2}
  .fmt-grid{grid-template-columns:1fr 1fr}
  .profils{grid-template-columns:1fr;gap:0}
}
@media(max-width:640px){
  .wrap{padding:0 18px}
  section{padding:60px 0}
  .hero{padding:132px 0 52px}
  .nav-links{display:none}
  .menu-btn{display:inline-flex}
  .mobile-menu{display:block}
  .nav{padding:6px 8px 6px 14px}
  .brand{font-size:14px}
  .brand small{display:none}
  .menu-btn{width:44px;height:44px}
  .btn{padding:14px 22px;font-size:15px;min-height:48px}
  .cta-row{flex-direction:column;align-items:stretch}
  .cta-row .btn{width:100%}
  .hero-meta{line-height:2}
  .sys{margin-top:48px}
  .node{padding:7px 10px;border-radius:10px}
  .node .n-lbl{font-size:8.5px}
  .node .n-t{font-size:11px}
  .node.hub{padding:9px 14px}
  .node.hub .n-t{font-size:12px}
  .bento-cell{padding:24px;gap:18px}
  .bento-vis{min-height:96px}
  .meth{grid-template-columns:1fr;gap:28px}
  .mstep::before{display:none}
  .meth-track,.meth-bar{display:none}
  .cb{grid-template-columns:1fr}
  .cb-cell.wide{grid-column:span 1}
  .fmt-grid{grid-template-columns:1fr}
  .cmp-head span,.cmp-row span{padding:14px 16px;font-size:13.5px}
  .cmp-head{font-size:10px}
  .faq-item summary{padding:17px 18px;font-size:15px}
  .faq-a{padding:0 18px 18px}
  .final{padding:84px 0}
  .foot{flex-direction:column;text-align:center}
}
`;

// ─── JS inline ───────────────────────────────────────────────────────
const JS = `
// Header scroll
var hdr = document.getElementById('hdr');
addEventListener('scroll', function () { hdr.classList.toggle('scrolled', scrollY > 24); }, { passive: true });

// Menu mobile
var menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', function () {
  var open = document.body.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
});
document.querySelectorAll('.mobile-menu a').forEach(function (a) {
  a.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
});

// Reveal au scroll (stagger via data-delay)
var io = new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(function (el) {
  var d = el.getAttribute('data-delay');
  if (d) el.style.setProperty('--d', d + 'ms');
  io.observe(el);
});

// Méthode : progression au scroll (desktop uniquement — la barre est masquée en mobile)
var meth = document.getElementById('methode');
var bar = document.getElementById('methBar');
var steps = document.querySelectorAll('.mstep');
function methTick() {
  var r = meth.getBoundingClientRect();
  var total = r.height - innerHeight;
  if (total <= 0) return;
  var p = Math.min(1, Math.max(0, -r.top / total));
  bar.style.width = (p * 100) + '%';
  steps.forEach(function (s, i) { s.classList.toggle('on', p >= (i + 0.5) / steps.length); });
}
addEventListener('scroll', methTick, { passive: true });
methTick();
`;

// ─── HTML principal ──────────────────────────────────────────────────
const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>HOJA ACADEMY — Formation pratique à l\u2019intelligence artificielle pour les professionnels</title>
<meta name="description" content="Apprenez à intégrer l\u2019intelligence artificielle dans votre travail, construire vos propres assistants et automatiser vos tâches avec HOJA ACADEMY.">
<meta property="og:title" content="HOJA ACADEMY — Formation pratique à l\u2019intelligence artificielle pour les professionnels">
<meta property="og:description" content="Apprenez à intégrer l\u2019intelligence artificielle dans votre travail, construire vos propres assistants et automatiser vos tâches avec HOJA ACADEMY.">
<meta property="og:type" content="website">
<meta name="theme-color" content="#F7F8FA">
<link rel="icon" type="image/png" href="${faviconData}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Sora:wght@600;700&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>
<a class="skip-link" href="#top">Aller au contenu principal</a>
<header id="hdr">
  <div class="nav">
    <a class="brand" href="#top">${logoNav}<span>HOJA<small>Academy</small></span></a>
    <nav class="nav-links" aria-label="Navigation principale">
      <a href="#pourquoi">Pourquoi</a>
      <a href="#pour-qui">Pour qui</a>
      <a href="#methode">Méthode</a>
    </nav>
    <div class="nav-cta">
      <a class="btn btn-primary btn-sm" href="${enrollmentUrl}"${extAttr}>Candidater</a>
      <button class="menu-btn" id="menuBtn" aria-label="Ouvrir le menu" aria-expanded="false">
        <span class="ic-open">${I.menu}</span><span class="ic-close">${I.close}</span>
      </button>
    </div>
  </div>
</header>
<div class="mobile-menu" id="mobileMenu">
  <a href="#pourquoi">Pourquoi</a>
  <a href="#pour-qui">Pour qui</a>
  <a href="#methode">Méthode</a>
  <a class="btn btn-primary" href="${enrollmentUrl}"${extAttr}>Candidater</a>
</div>

<main id="top">
  <!-- HERO -->
  <section class="hero">
    <div class="wrap">
      <span class="kicker">HOJA ACADEMY</span>
      <h1>L\u2019IA ne doit pas seulement répondre. Elle doit travailler pour vous.</h1>
      <p class="lead">Une formation pratique pour apprendre à intégrer l\u2019intelligence artificielle dans votre travail, automatiser vos tâches et construire vos propres systèmes de travail augmentés.</p>
      <div class="cta-row">
        ${cta('Candidater à la prochaine cohorte', 'btn-primary')}
        <a class="btn btn-ghost" href="#methode">Découvrir l\u2019approche</a>
      </div>
      <p class="hero-meta">Formation pratique <b>·</b> Cohortes limitées <b>·</b> En ligne et en présentiel</p>

      <!-- Diagramme : système de travail augmenté -->
      <div class="sys" aria-hidden="true">
        <svg class="lines" viewBox="0 0 720 360" fill="none" preserveAspectRatio="xMidYMid meet">
          <path class="link l1" d="M 360 180 C 250 150, 150 120, 105 68"/>
          <path class="link l2" d="M 360 180 C 470 150, 570 120, 615 68"/>
          <path class="link l3" d="M 360 180 C 250 210, 150 240, 105 292"/>
          <path class="link l4" d="M 360 180 C 470 210, 570 240, 615 292"/>
          <circle class="dot d1" r="4"><animateMotion dur="7s" repeatCount="indefinite" path="M 360 180 C 250 150, 150 120, 105 68"/></circle>
          <circle class="dot d2" r="4"><animateMotion dur="9s" repeatCount="indefinite" path="M 360 180 C 470 150, 570 120, 615 68"/></circle>
          <circle class="dot d1" r="4"><animateMotion dur="8s" repeatCount="indefinite" path="M 360 180 C 250 210, 150 240, 105 292"/></circle>
          <circle class="dot d2" r="4"><animateMotion dur="10s" repeatCount="indefinite" path="M 360 180 C 470 210, 570 240, 615 292"/></circle>
        </svg>
        <div class="node n-doc"><span class="n-lbl">Documents</span><span class="n-t">PDF · Rapports</span></div>
        <div class="node n-data"><span class="n-lbl">Données</span><span class="n-t">Tableaux · Analyses</span></div>
        <div class="node hub n-hub"><span class="n-lbl">Votre système</span><span class="n-t">Assistant IA</span></div>
        <div class="node n-wf"><span class="n-lbl">Workflows</span><span class="n-t">Étapes · Contrôle</span></div>
        <div class="node n-auto"><span class="n-lbl">Automatisations</span><span class="n-t">Tâches · Boucles</span></div>
      </div>
    </div>
  </section>

  <!-- PROBLÈME -->
  <section class="alt prob" id="pourquoi">
    <div class="wrap">
      <div class="sec-head">
        <span class="kicker">Le constat</span>
        <h2>L\u2019IA est partout. Mais elle n\u2019est pas encore dans votre travail.</h2>
      </div>
      <div class="prob-grid">
        <div class="prob-txt">
          <p>Beaucoup de professionnels utilisent déjà ChatGPT ou d\u2019autres assistants IA. Pourtant, ils continuent à perdre du temps sur les mêmes tâches : rédiger, rechercher, analyser, organiser, produire des rapports ou répéter les mêmes opérations chaque semaine.</p>
          <p class="punch">Le vrai problème n\u2019est pas d\u2019avoir accès à l\u2019IA. C\u2019est de savoir quoi lui confier, comment la cadrer et comment l\u2019intégrer à son travail.</p>
        </div>
        <div class="tasks reveal" aria-label="Tâches répétitives">
          <span>Rédiger</span><span>Rechercher</span><span>Analyser</span><span>Organiser</span><span>Produire des rapports</span><span>Répéter les mêmes opérations</span>
        </div>
      </div>
    </div>
  </section>

  <!-- PROMESSE -->
  <section id="promesse">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">La promesse</span>
        <h2>Transformez l\u2019IA en véritable levier de travail.</h2>
      </div>
      <div class="bento">
        ${promesseHtml}
      </div>
    </div>
  </section>

  <!-- POUR QUI -->
  <section class="alt" id="pour-qui">
    <div class="wrap">
      <div class="sec-head">
        <span class="kicker">Pour qui</span>
        <h2>Pour les professionnels qui veulent passer à l\u2019étape suivante.</h2>
        <p>Vous utilisez déjà l\u2019IA de temps en temps. Vous savez qu\u2019elle peut faire plus — mais vous ne savez pas par où commencer pour l\u2019intégrer durablement à votre travail.</p>
      </div>
      <ul class="profils">
        ${profilsHtml}
      </ul>
    </div>
  </section>

  <!-- MÉTHODE -->
  <section id="methode">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">La méthode</span>
        <h2>On ne vous apprend pas simplement à utiliser l\u2019IA.</h2>
        <p class="punch-line">On vous apprend à l\u2019intégrer à votre travail.</p>
      </div>
      <div class="meth-wrap">
        <div class="meth-track" aria-hidden="true"><div class="meth-bar" id="methBar"></div></div>
        <div class="meth">
          ${etapesHtml}
        </div>
      </div>
    </div>
  </section>

  <!-- CE QUE VOUS CONSTRUISEZ -->
  <section class="alt" id="construire">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">Le résultat</span>
        <h2>Vous repartez avec quelque chose que vous pouvez réellement utiliser.</h2>
        <p>La formation ne se termine pas avec quelques prompts sauvegardés dans un document. Vous construisez progressivement votre propre environnement de travail augmenté par l\u2019IA.</p>
      </div>
      <div class="cb">
        ${construitsHtml}
      </div>
    </div>
  </section>

  <!-- FORMAT -->
  <section id="format">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">Le format</span>
        <h2>Une formation conçue pour les professionnels actifs.</h2>
      </div>
      <div class="fmt-grid">
        ${formatsHtml}
      </div>
    </div>
  </section>

  <!-- DIFFÉRENCIATION -->
  <section class="alt" id="difference">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">La différence</span>
        <h2>Pas une formation de plus sur ChatGPT.</h2>
        <p>HOJA ACADEMY part de votre travail réel. L\u2019objectif n\u2019est pas de vous faire mémoriser une liste d\u2019outils, mais de vous apprendre à construire une méthode durable pour travailler avec l\u2019IA.</p>
      </div>
      <div class="cmp">
        <div class="cmp-head"><span>Formation classique</span><span>HOJA ACADEMY</span></div>
        ${comparaisonHtml}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section id="faq">
    <div class="wrap">
      <div class="sec-head center">
        <span class="kicker">Questions</span>
        <h2>Ce qu\u2019il faut savoir avant de candidater.</h2>
      </div>
      <div class="faq">
        ${faqHtml}
      </div>
    </div>
  </section>

  <!-- CTA FINAL -->
  <section class="final">
    <div class="wrap">
      <span class="kicker">Prochaine cohorte</span>
      <h2>Votre travail peut déjà être augmenté par l\u2019IA.</h2>
      <p>Commencez par apprendre à l\u2019utiliser correctement.</p>
      ${cta('Candidater à la prochaine cohorte', 'btn-primary')}
      <p class="note">Les candidatures sont examinées avant validation de l\u2019inscription.</p>
    </div>
  </section>
</main>

<footer>
  <div class="wrap foot">
    <div class="foot-brand">${logoFooter}<span>HOJA<small>Academy</small></span></div>
    <nav class="foot-links" aria-label="Liens de pied de page">
      <a href="#top">Académie</a>
      <a href="mailto:contact@opays.io">Contact</a>
      <a href="${enrollmentUrl}"${extAttr}>Candidater</a>
    </nav>
    <span class="foot-copy">© 2026 HOJA ACADEMY — un projet Opays Tech. Tous droits réservés.</span>
  </div>
</footer>

<script>
${JS}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(LANDING_DIR, 'index.html'), html, 'utf8');
console.log('✅ Landing v4 générée :', path.join(LANDING_DIR, 'index.html'));
console.log('   CTA →', enrollmentUrl);
