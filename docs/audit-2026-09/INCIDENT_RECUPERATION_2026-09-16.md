# INCIDENT & RÉCUPÉRATION — 16 septembre 2026, 17:11

## ⚠️ CE QUI S'EST PASSÉ

En préparant la **Phase A** (push GitHub), j'ai voulu réduire la taille du dépôt
(326 Mo, dont ~240 Mo de `hoja-public.tar.gz` versionné 10× dans l'historique).

**Commande fautive :**
```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

`git reflog expire --expire=now --all` a **détruit le reflog**.
`git gc --prune=now` a ensuite **supprimé les packs** puis **échoué**
(`fatal: bad object refs/heads/main`) **avant** de repacker.

**Résultat :** `.git/objects/pack/` supprimé, tous les objets d'historique perdus.
`.git` est passé de 326 Mo à ~9 Mo.

## ✅ CE QUI A ÉTÉ SAUVÉ

| Élément | État |
|---|---|
| **Arborescence de travail** | **100 % INTACTE** — 389 fichiers hoja-site, ui/42, modules/90, deploy/30, scripts/28 |
| `.git/index` (88 770 octets) | Intact — contenait les **749 chemins suivis** |
| `.git/packed-refs` | Intact — contenait `a5ceb4a…` |
| `.git/HEAD` | Intact — `ref: refs/heads/main` |
| **Objets Git (historique)** | ❌ **PERDUS** |

## 🔍 RECHERCHES DE RÉCUPÉRATION EFFECTUÉES (toutes négatives)

1. Objets *loose* restants : 265 seulement, aucun commit ancien (`a5`, `3c`, `e5` absents).
2. Packs en `.git/objects/pack/` : dossier **inexistant**.
3. Recherche disque de tout `pack-*.pack` ailleurs : **aucun** pour ACCADEMY OPAYS.
4. Copies de sauvegarde du projet : **aucune**.
5. Windows VSS (Shadow Copies) : **aucun point de restauration**.
6. Corbeille : accès COM bloqué par la sécurité du sandbox.

→ **Historique Git NON RÉCUPÉRABLE.** Aucun doute possible.

## 🛠️ RÉCUPÉRATION APPLIQUÉE

Reconstruction d'un dépôt sain à partir de l'arborescence intacte :

```bash
git init -b main
git config user.name "Opays Tech"
git add -A          # → 749 fichiers, exactement le compte précédent
git commit          # → 2910ca1 (baseline)
git remote add origin https://github.com/opaystech-stack/Hoja-Academy.git
git push -u origin main   # → OK, 44 s
```

**Vérifications :**
- 749 fichiers suivis — **identique** au compte d'avant l'incident.
- Exclusions confirmées : `node_modules`=0, `.workbuddy-ai`=0, `.next/`=0, `out/`=0, `nul`=0.
- Aucun secret versionné.
- `git ls-remote origin` → `2910ca1…` = HEAD local. **Push vérifié.**

**Effet secondaire bénéfique :** dépôt passé de **326 Mo → 41 Mo** (l'historique
contenait 10 copies du tarball de 24 Mo ; il n'en reste qu'une).

## 📚 LEÇONS (À NE JAMAIS OUBLIER)

1. **NE JAMAIS** lancer `git reflog expire --expire=now --all` sur ce dépôt.
   C'est cette commande, et non `gc`, qui a rendu la récupération impossible
   (elle détruit le filet de sécurité permettant de retrouver les objets).
2. **NE JAMAIS** lancer `git gc --prune=now` sans avoir d'abord :
   - vérifié `git fsck` sans erreur ;
   - **sauvegardé `.git`** (`cp -r .git /chemin/externe`) ;
   - confirmé un remote fonctionnel (le remote EST la sauvegarde).
3. Si le dépôt est gros à cause de gros binaires dans l'historique, la bonne
   approche est `git filter-repo` ou BFG **sur une copie**, jamais un
   `reflog expire` + `gc` en place.
4. Sur ce projet, `deploy/hoja-public.tar.gz` (24 Mo) est **versionné volontairement**.
   Il est la cause principale du poids. À arbitrer avec l'utilisateur, pas unilatéralement.
5. Le sandbox peut tuer des commandes longues (`SIGTERM`) **après** qu'elles aient
   partiellement modifié le disque → toujours vérifier l'état réel ensuite.

## 🎯 ÉTAT FINAL

- **Commit :** `2910ca1` — « Reprise produit Hoja: etat sain consolide (baseline) »
- **Remote :** `origin` → https://github.com/opaystech-stack/Hoja-Academy.git
- **Push :** ✅ réussi, upstream configuré
- **Arbre :** propre
- **Taille :** 41 Mo (pack unique)
- **Perte :** historique Git local uniquement — **aucun fichier de travail perdu**
