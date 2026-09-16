# Audit SEO / technique — HOJA ACADEMY
Audit réalisé par l'orchestrateur (l'agent SA-SEO ayant échoué sur 429), sur le build `out/` du 08/09 (~19h50).

## Constat par page (17 HTML)
| Critère | Résultat |
|---|---|
| `<html lang>` | **fr sur 100 % des pages** ✅ (aucune trace es/es_ES) |
| `og:locale` | absent ✅ (pas de locale espagnole résiduelle) |
| JSON-LD `inLanguage` | `fr` partout ✅ (layout.tsx) |
| og:title / og:image / twitter | présents sur toutes les pages ✅ (image = fa64729e9a88.png, logo HOJA) |
| h1 | présent sur home, curso-ia, curso-de-*, institution?, noticias, legales… — **absence de h1 sur : contacto, empresas, institution, programa-afiliados, registration, reset-password** (hero codé en `<div>`/`<p>` par le clone). ⚠️ Ne pas « réparer » par changement de balise : risquerait de casser style/animations (règle d'or). Signalé comme dette structurelle optionnelle. |
| Favicon / apple-icon | emblème HOJA vérifié (empreinte identique à `ACCADEMY OPAYS/Logo/favicon_hoja.png`) ✅ |
| robots.txt | correct, mais `Sitemap: /sitemap.xml` RELATIF → lié à SITE_ORIGIN vide (corrigé ci-dessous) |
| sitemap.xml | 16 URLs = pages réelles, aucune `/actualidad` ✅ |
| Liens morts internes | 0 (vérif out/ complète) ✅ |
| `href="#"` | présents mais légitimes (dropdowns nav, sélecteur de langue, ancres widget chat) — non bloquants |

## Anomalies majeures trouvées + corrections
1. **Tous les `<title>` identiques** (« HOJA ACADEMY — Institution de Référence... | Learn AI » sur 16/17 pages, même le 404) et **mêmes meta descriptions** → duplication SEO.
   → Corrigé : `export const metadata` par page injecté par `scripts/hoja_seo_pages.py` (16 pages, descriptions spécifiques FR). Le suffixe « | Learn AI » de la metadata globale est retiré (baseline, pas un suffixe de titre).
2. **`SITE_ORIGIN` vide** → canonical `http://localhost:3000/...` et robots/sitemap relatifs dans le build.
   → Corrigé : `src/lib/site.ts` default = `https://hoja-academy.com` (env `NEXT_PUBLIC_SITE_ORIGIN` garde la priorité pour les tests locaux).
3. **OG image referenced via relative join(SITE_ORIGIN)** : avec la correction #2, l'URL OG devient absolue `https://hoja-academy.com/assets/...` ✅.
4. Alt text restants vides sur images décoratives : conformes (aria-hidden/role=presentation sur la plupart) — non bloquants.

## Vérifications faites sur le build (à rejouer après chaque phase)
- `grep -rniE "academiartificial|ai venture|alejavi|jose moral|yago|isabel|ects|fundae|red\.es|kit digital|granada|sedeagpd|real decreto|ley 34|rd 1112|nextgeneration|imágenes|imagen de|captura"` sur `out/` → cible : **0**.
- canonical == https://hoja-academy.com/<route> sur chaque page.
- og:image == https://hoja-academy.com/assets/cloned/images/fa64729e9a88.png.

## Restitution à l'utilisateur (décisions)
- Titres FR retenus par défaut (peuvent être ajustés) ; aucune donnée inventée.
- H1 manquants sur 6 pages : touchés uniquement si tu autorises un changement de balise (faible risque, hors règle « squelette intact » ? à trancher).
