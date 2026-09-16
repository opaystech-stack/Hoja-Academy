import "../../ditto.css";
import Navbar from "../../sections/navbar";
import PageHero from "../../sections/page-hero";
import Footer from "../../sections/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IA, Recherche & Sciences — L'IA assistante de la rigueur | HOJA ACADEMY",
  description:
    "Formation IA, Recherche & Sciences : recherche assistée par IA, analyse documentaire, synthèse de sources, analyse de données, reproductibilité et vérification humaine.",
};

const apprendre = [
  "Conduire une recherche assistée par IA sans déléguer le jugement scientifique.",
  "Analyser des corpus documentaires : extraire, structurer, comparer.",
  "Synthétiser et croiser des sources en gardant la trace de chaque origine.",
  "Mener une recherche bibliographique efficace et vérifiable.",
  "Explorer et analyser des données avec des outils d'IA.",
  "Automatiser certaines tâches de recherche : veilles, tris, formats, prétraitements.",
  "Concevoir des agents d'assistance à la recherche correctement bornés.",
  "Vérifier les sources et signaler les limites de chaque sortie d'IA.",
  "Documenter protocoles et résultats pour la reproductibilité.",
];

const pouvoirFaire = [
  "Gagner du temps sur les phases documentaires sans perdre la rigueur.",
  "Produire des synthèses sourcées, contrôlées et discutables en équipe.",
  "Mettre en place des routines de veille et d'analyse reproductibles.",
  "Encadrer l'usage de l'IA dans un laboratoire, une clinique ou une institution.",
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
        eyebrow="FORMATION — IA, RECHERCHE & SCIENCES"
        eyebrowRest=""
        title="L'IA au service de la"
        title2="rigueur scientifique."
        lead="Recherche assistée par IA : analyse documentaire, synthèse de sources, analyse de données, vérification et reproductibilité — l'IA assiste, elle ne remplace jamais le chercheur."
        ctaLabel="Postuler"
        ctaHref="/postuler"
        kicker="Chercheurs, laboratoires, médecins, institutions"
        kickerLine="Prochaine session : à définir · Tarif : à définir."
      />

        {/* Cadre honnête */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6">
            <div className="rounded-[38px] border-4 border-solid border-primary p-8 max-md:p-6">
              <h2 className="text-color-001 text-[1.4rem] max-md:text-lg font-bold pb-3">
                Le cadre de cette formation
              </h2>
              <p className="text-muted-foreground text-base leading-8">
                L&apos;IA assiste ; elle ne remplace jamais le chercheur, le
                médecin ou le professionnel. Chaque sortie d&apos;un outil
                d&apos;IA est une hypothèse à vérifier, jamais un résultat à
                publier. La reproductibilité des protocoles et la vérification
                humaine sont au cœur de ce parcours : elles conditionnent tout
                usage responsable de l&apos;IA dans un contexte scientifique.
              </p>
            </div>
          </div>
        </section>

        {/* Pour qui */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Pour qui ?
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Des profils qui produisent ou exploitent de la connaissance et
              veulent gagner en efficacité sans renoncer à la rigueur.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-color-001 text-sm leading-6">
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Chercheurs et étudiants avancés</strong> — docs,
                revues de littérature, analyses de données.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Médecins et professionnels de santé</strong> — veille
                bibliographique et synthèse documentaire, sous contrôle expert.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Laboratoires et institutions</strong> — standardiser des
                usages IA vérifiables dans vos équipes.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Cabinets de recherche et organisations techniques</strong>{" "}
                — fiabiliser l&apos;analyse documentaire et la production de
                rapports.
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
              Les usages de l&apos;IA dans le cycle de la recherche, de la
              collecte documentaire à la rédaction contrôlée.
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
              Des capacités directement mobilables dans vos travaux en cours.
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

        {/* Limites et bonnes pratiques */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Limites et bonnes pratiques
            </h2>
            <p className="text-muted-foreground text-base leading-8 max-w-3xl">
              Une partie du parcours est consacrée aux limites : hallucinations,
              biais des sources, opacité des modèles, confidentialité des données
              de recherche. Vous apprenez à documenter chaque usage — prompts,
              sources, versions — pour que vos résultats restent vérifiables et
              reproductibles par d&apos;autres que vous.
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-color-001 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
            <h2 className="text-background text-[1.75rem] max-md:text-xl font-bold">
              Intégrer l&apos;IA dans vos travaux scientifiques ?
            </h2>
            <p className="text-color-029 text-base leading-7 max-w-2xl">
              Postulez à la prochaine cohorte ou contactez-nous pour évaluer ce
              parcours pour vous, votre laboratoire ou votre institution.
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
