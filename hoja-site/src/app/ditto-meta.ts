// Ancrage DOM hérité du clone (outil ditto.site).
//
// `data-ditto-id` est un contrat d'ancrage : le CSS cible ces attributs pour les
// états :hover / :focus / :transition (voir les `ditto.css` de chaque route).
// Le composant `DittoWire`, qui les utilisait aussi pour rejouer des interactions
// capturées, a été supprimé au lot B — il n'était jamais rendu.
//
// Ce fichier ne fournit plus que le TYPE. Les tables de données qui vivaient ici
// (`ListRow_meta`, `ListRow2_meta`, `MediaCard_meta`, `ListRow_meta2`) n'étaient
// importées par personne : chaque page déclare localement ses propres tableaux.
// Elles ont été retirées — leurs ancres ne pouvaient donc jamais atteindre le DOM,
// et les règles CSS qui les ciblaient étaient mortes.
export type DittoNodeMeta = { anchor?: string };
export type DittoNodeMetaMap = Record<number, DittoNodeMeta | undefined>;

// Encore référencées par `sections/footer.tsx`. Vides : toutes leurs ancres
// étaient orphelines (aucun CSS ne les ciblait).
export const ListRow6_meta: DittoNodeMetaMap[] = [
    {  },
    {  },
    {  },
    {  }
,
    {  }];
export const ListRow8_meta: DittoNodeMetaMap[] = [
    {  },
    {  },
    {  },
    {  },
    {  }
];
