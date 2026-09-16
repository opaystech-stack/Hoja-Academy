# ARCHITECTURE.md — hoja-site

## Vue d'ensemble

Site public **HOJA ACADEMY**. Next.js 15 (App Router) en **export statique**
(`next.config.mjs` → `output: "export"`) : 100 % de HTML/CSS/JS pré-générés dans `out/`.
Aucun serveur applicatif — l'authentification et les données vivent dans le cockpit
(`../ui/`) et la passerelle (`../deploy/classroom-gateway/`).

Le squelette/UX/animations proviennent d'un template d'origine (capture DOM/CSS),
mais l'identité, le contenu et le programme sont **entièrement Hoja Academy**
(voir `KANBAN-HOJA.md`).

## Structure

- `src/app/layout.tsx` — layout racine : langue, metadata, viewport, JSON-LD, coquille partagée
- `src/app/page.tsx` + `page.tsx` imbriqués — corps des routes
- `src/app/_styles.ts`, `globals.css` — reset, fontes, design tokens, base globale
- `src/app/content.ts` — couche de données éditable
- `src/app/components/` — composants JSX réutilisables
- `src/app/sections/` — sections de page
- `src/app/svgs/` — SVG inline hissés hors des pages
- `src/app/ditto/` — helpers runtime des recettes d'interaction/motion
- `src/lib/site.ts` — `SITE_ORIGIN` (domaine canonique)
- `public/assets/hoja/` — visuels Hoja
- `public/assets/cloned/` — assets matérialisés du template d'origine

## Styling

Tailwind 4 pour les déclarations représentables en utilitaires stables. Le reste vit dans
`globals.css` / CSS héritées (pseudo-éléments, keyframes, états d'interaction, styles scopés
par route) car non traduisibles sans changer le rendu.

## Ancrages

`data-ditto-id` marque les nœuds DOM ciblés par le CSS/runtime généré. Les identifiants de
validation du template sont retirés de la sortie de production.

## Build & déploiement

```
src/**  →  npm run build  →  out/  →  archive  →  deploy/deploy-vps-academy.sh  →  VPS
```

- Domaine de production actuel : `https://course.opays.io`
- Origine configurable : `NEXT_PUBLIC_SITE_ORIGIN`

## Routes

```
/                                  Accueil
/formations                        Catalogue
/formations/programme-intensif
/formations/expert-ia
/formations/automatisation-n8n
/formations/robotique
/formations/ia-recherche-sciences
/entreprises
/postuler
/contact
/mentions-legales
/confidentialite
/cookies
/accessibilite
```

Redirections historiques (ES → FR) : `redirections.json` + règles nginx du deploy.

## Dette connue (chantier DESIGN/UX)

- `src/app/sections/` : plusieurs sections héritées du template ne sont jamais importées
- `src/app/components/` : nombreuses variantes `list-row*` quasi identiques
- `globals.css` : familles de fontes résiduelles du template d'origine
