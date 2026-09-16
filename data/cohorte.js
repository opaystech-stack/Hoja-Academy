/**
 * OPAYS ACADEMY — Configuration de la cohorte en cours
 * À remplir à chaque cohorte (les liens Meet/Classroom changent à chaque fois).
 * Les boutons du hub et du dashboard n'apparaissent que si l'URL est renseignée.
 *
 * TODO_ADMIN = informations administratives à fournir avant le lancement réel.
 * Ce fichier est PRIVÉ (jamais déployé) — seule source de vérité des paramètres de cohorte.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OPAYS_COHORTE = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  return {
    /** Nom de la cohorte affiché dans les interfaces */
    nom: "Cohorte 01",
    /** URL de base de la version publique (VPS Dokploy — LIVE) */
    baseUrl: "https://course.opays.io",
    /** Lien Google Meet permanent (épinglé dans Classroom) */
    meetUrl: "https://meet.google.com/bta-hznv-wqp",
    /** Lien de la classe Google Classroom (invitation) */
    classroomUrl: "https://classroom.google.com/c/ODc1Nzc3MTc1NTQ1?cjc=wjrdl5d4",
    /** Lien du formulaire d'inscription (campagne) */
    enrollmentUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfGQL_eANGDh2AKWJpnKbvKHuXR9rKlGcKxwOJeVBma3vcleA/viewform?usp=sharing&ouid=110842743704567712489",
    /** Date de début (lundi) — utilisée pour la semaine courante */
    dateDebut: null, // À CONFIRMER par l’admin (2026-09-07 était un brouillon TODO_ADMIN — ne jamais l’afficher comme réelle). UI : « Date de début : À définir ».
    /** Tarifs (affichés sur la landing) */
    tarif: "50", // USD — parcours standard
    tarifPremium: "100", // USD — parcours personnalisé
    tarifNote: "Selon vos disponibilités : suivi collectif (50 $) ou accompagnement personnalisé (100 $)."
  };
});
