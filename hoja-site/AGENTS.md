# AGENTS.md — hoja-site (site public Next.js)

Site public **HOJA ACADEMY** — Next.js 15 (App Router), export statique (`output: "export"`).
Ce dossier est la **source officielle du site public**, intégrée au repo ACCADEMY OPAYS.

## Run

- `npm install`
- `npm run dev`
- `npm run build`   → produit `out/` (export statique)
- `npm run serve`   → sert `out/` en local (port 3000)

## Déploiement

`npm run build` génère `out/`. Le contenu de `out/` est archivé et déployé sur le VPS
(voir `../deploy/deploy-vps-academy.sh`, overlay `hoja-public.tar.gz` sur la racine nginx).

- Domaine de production actuel : `https://course.opays.io`
- Origine configurable : `NEXT_PUBLIC_SITE_ORIGIN` (défaut dans `src/lib/site.ts`)

## Zones d'édition

- `src/app/content.ts` — contenu structuré (textes, liens, listes)
- `src/app/components/` — composants JSX réutilisables
- `src/app/sections/` — sections de page
- `src/app/svgs/` — SVG inline
- `src/app/_styles.ts`, `globals.css` — styles, tokens, fontes
- `src/app/robots.ts`, `sitemap.ts` — SEO

## Zones sensibles (ne pas réécrire à la légère)

- `src/app/ditto/` — runtime d'interactions/motion (plomberie du template d'origine)
- `src/app/ditto-meta.ts` — métadonnées d'ancrages
- `src/app/layout.tsx` — coquille globale, metadata, JSON-LD

## Routes (source de vérité réelle)

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

## Notes

- `audits/` contient les rapports du chantier d'identité (traces, images, SEO, contenu).
- `KANBAN-HOJA.md` = journal du chantier d'identité Hoja (clôturé 08/09/2026).
- Le squelette/UX/animations proviennent du template d'origine ; l'identité est 100 % Hoja.
