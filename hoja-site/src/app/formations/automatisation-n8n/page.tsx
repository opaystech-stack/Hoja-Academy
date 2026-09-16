import "../../ditto.css";
import Navbar from "../../sections/navbar";
import PageHero from "../../sections/page-hero";
import Footer from "../../sections/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automatisation & n8n — Construire des systèmes qui travaillent pour vous | HOJA ACADEMY",
  description:
    "Formation Automatisation & n8n : workflows, APIs, intégrations, déclencheurs, traitement de données et agents pour automatiser vos processus professionnels.",
};

const apprendre = [
  "Concevoir des workflows d'automatisation avec n8n.",
  "Connecter vos outils entre eux via les APIs et les intégrations.",
  "Déclencher des actions sur des événements : e-mails, formulaires, horaires.",
  "Traiter, transformer et consolider des données entre plusieurs sources.",
  "Intégrer des agents IA dans des chaînes d'automatisation.",
  "Automatiser des processus professionnels de bout en bout.",
  "Documenter, tester et maintenir vos workflows dans la durée.",
];

const pouvoirFaire = [
  "Identifier les tâches répétitives qui méritent d'être automatisées.",
  "Construire un workflow complet, du déclencheur à l'action finale.",
  "Relier vos applications métier sans écrire de code.",
  "Surveiller et corriger vos automatisations en toute autonomie.",
];

const exemples = [
  {
    title: "Notifications pilotées par événements",
    text: "Recevoir une alerte ciblée quand une condition précise se produit dans un de vos outils ou fichiers.",
  },
  {
    title: "Collecte et consolidation de données",
    text: "Rassembler automatiquement des informations dispersées dans plusieurs sources dans un même support de suivi.",
  },
  {
    title: "Réponses e-mail triées",
    text: "Classer les messages entrants et préparer des éléments de réponse, validés par un humain avant envoi.",
  },
  {
    title: "Rapports récurrents",
    text: "Générer et diffuser à échéance régulière un rapport construit à partir de vos données à jour.",
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <main
        className="block [font-family:Montserrat,_sans-serif]"
        id="content"
      >
        {/* Hero */}
        <PageHero
        eyebrow="FORMATION — AUTOMATISATION"
        eyebrowRest=" & n8n"
        title="D'une tâche répétitive"
        title2="à un système qui travaille pour vous."
        lead="Automatisation des processus professionnels avec n8n : workflows, APIs, intégrations, déclencheurs, traitement de données et agents au service de vos opérations."
        ctaLabel="Postuler"
        ctaHref="/postuler"
        kicker="Workflows, APIs, agents"
        kickerLine="Prochaine session : à définir · Tarif : à définir."
      />

        {/* Pour qui */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Pour qui ?
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Pour toute personne confrontée à des tâches répétitives dans son
              travail. Aucune expérience du développement n&apos;est requise :
              la rigueur et la connaissance de son métier comptent plus que le
              code.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-color-001 text-sm leading-6">
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Professionnels opérationnels</strong> — supprimer les
                copier-coller et les saisies manuelles récurrentes.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Équipes Ops &amp; support</strong> — fiabiliser les
                processus et les enchaînements de tâches entre outils.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Finance &amp; RH</strong> — automatiser collecte,
                consolidation et reporting sans perdre la trace des données.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>ONG et structures à ressources limitées</strong> —
                étendre la capacité de traitement sans étendre les effectifs.
              </li>
            </ul>
          </div>
        </section>

        {/* Ce que vous allez apprendre */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Ce que vous allez apprendre
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Les fondamentaux de l&apos;automatisation appliqués avec n8n, de
              la conception du workflow jusqu&apos;à sa maintenance.
            </p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-color-001 text-sm leading-7">
              {apprendre.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary-text font-bold shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ce que vous pourrez faire */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Ce que vous pourrez faire
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              À l&apos;issue du parcours, vous êtes capable de concevoir et faire
              vivre des automatisations dans votre environnement de travail.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-color-001 text-sm leading-6">
              {pouvoirFaire.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border-4 border-solid border-primary bg-background p-6"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Approche pratique */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Approche pédagogique
            </h2>
            <p className="text-muted-foreground text-base leading-7 max-w-3xl">
              La formation suit la même logique que le programme Expert IA :
              pratique sur vos propres cas, exercices progressifs, production de
              workflows réels et accompagnement. Vous travaillez à partir de vos
              processus existants, pas de scénarios artificiels, et vous apprenez
              à documenter et tester chaque automatisation avant de la laisser
              tourner.
            </p>
          </div>
        </section>

        {/* Exemples */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Exemples de mise en pratique
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Des réalisations types, sobres et vérifiables — sans promesse de
              gains chiffrés, qui dépendent de chaque contexte.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {exemples.map((ex) => (
                <div
                  key={ex.title}
                  className="rounded-2xl border-2 border-solid border-border bg-background p-6"
                >
                  <h3 className="text-color-001 font-bold leading-6 pb-2">
                    {ex.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-6">
                    {ex.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-color-001 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
            <h2 className="text-background text-[1.75rem] max-md:text-xl font-bold">
              Automatiser votre travail, concrètement ?
            </h2>
            <p className="text-color-029 text-base leading-7 max-w-2xl">
              Postulez à la prochaine cohorte ou contactez-nous pour cartographier
              avec vous les processus à automatiser en priorité.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                className="inline-block py-4 px-9 rounded-[60px] bg-primary text-color-001 text-[0.9375rem] font-semibold capitalize cursor-pointer"
                href="/postuler"
              >
                Postuler
              </a>
              <a
                className="inline-block py-4 px-9 rounded-[60px] border-2 border-solid border-background text-background text-[0.9375rem] font-semibold capitalize cursor-pointer"
                href="/contact"
              >
                Nous contacter
              </a>
            </div>
            <p className="text-muted-on-dark text-sm">
              Prochaine cohorte : à définir · Tarif : à définir
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
