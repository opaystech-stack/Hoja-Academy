import "../../ditto.css";
import Navbar from "../../sections/navbar";
import PageHero from "../../sections/page-hero";
import Footer from "../../sections/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robotique — Technologies robotiques et IA embarquée | HOJA ACADEMY",
  description:
    "Formation Robotique : comprendre et utiliser la robotique, l'IA embarquée, la perception, l'automatisation physique et l'interaction humain-machine.",
};

const apprendre = [
  "Comprendre les fondements de la robotique : capteurs, actionneurs, contrôle.",
  "Cerner ce qu'est l'IA embarquée et où elle s'applique.",
  "Approcher la perception machine : vision, lidar, traitement du signal.",
  "Analyser les logiques d'automatisation physique de tâches.",
  "Étudier les formes d'interaction humain-machine et leurs enjeux.",
  "Repérer les applications professionnelles et scientifiques de la robotique.",
];

const pouvoirFaire = [
  "Comprendre le vocabulaire et les principes d'un projet robotique.",
  "Évaluer la pertinence d'une solution robotique ou embarquée pour un usage donné.",
  "Dialoguer efficacement avec des équipes techniques ou des fournisseurs.",
  "Situer l'apport de l'IA dans une chaîne robotique : perception, décision, action.",
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
        eyebrow="FORMATION — ROBOTIQUE"
        eyebrowRest=""
        title="Comprendre et utiliser"
        title2="la robotique et l'IA embarquée."
        lead="Une orientation descriptive et appliquée : robotique, IA embarquée, perception, automatisation physique et interaction humain-machine, pour étudiants, ingénieurs et chercheurs."
        ctaLabel="Postuler"
        ctaHref="/postuler"
        kicker="Applications professionnelles et scientifiques"
        kickerLine="Prochaine session : à définir · Tarif : à définir."
      />

        {/* Cadre de la formation */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Le cadre de cette formation
            </h2>
            <p className="text-muted-foreground text-base leading-8">
              Ce parcours est une formation de compréhension et
              d&apos;application. Il vise à vous donner les bases solides pour
              lire un projet robotique, en discuter les choix techniques et
              identifier les usages pertinents de l&apos;IA embarquée. Il ne
              constitue pas un accès à un parc de machines ni un cursus
              d&apos;ingénierie robotique : l&apos;accent est mis sur
              l&apos;orientation, la lecture critique des technologies et la
              pratique concepts et cas d&apos;usage.
            </p>
          </div>
        </section>

        {/* Pour qui */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Pour qui ?
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Un public curieux des systèmes physiques intelligents, avec un
              projet académique, technique ou scientifique en tête.
            </p>
            <ul className="grid md:grid-cols-2 gap-4 text-color-001 text-sm leading-6">
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Étudiants</strong> — construire une culture solide de la
                robotique et de ses liens avec l&apos;IA.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Ingénieurs</strong> — élargir votre champ aux systèmes
                embarqués et à la perception machine.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Chercheurs</strong> — intégrer les apports de la
                robotique dans vos protocoles et dispositifs expérimentaux.
              </li>
              <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
                <strong>Structures scientifiques</strong> — former vos équipes à
                la lecture de projets et de solutions robotiques.
              </li>
            </ul>
          </div>
        </section>

        {/* Ce que vous allez apprendre */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Ce que vous allez apprendre
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Les grands domaines de la robotique contemporaine et la place de
              l&apos;IA embarquée dans chacun d&apos;eux.
            </p>
            <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-color-001 text-sm leading-7">
              {apprendre.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="text-primary font-bold shrink-0">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ce que vous pourrez faire */}
        <section className="bg-background py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Ce que vous pourrez faire
            </h2>
            <p className="text-muted-foreground text-base leading-7 pb-8 max-w-3xl">
              Des capacités intellectuelles et professionnelles directement
              mobilisables dans vos études, vos projets ou vos décisions.
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

        {/* Approche */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold pb-2">
              Approche pédagogique
            </h2>
            <p className="text-muted-foreground text-base leading-8 max-w-3xl">
              Cours structurés, études de cas professionnels et scientifiques,
              démonstrations et travaux dirigés sur des problèmes concrets. Les
              modalités pratiques sont précisées lors de l&apos;inscription, en
              fonction du rythme de chaque cohorte.
            </p>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-color-001 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
            <h2 className="text-background text-[1.75rem] max-md:text-xl font-bold">
              Un intérêt pour la robotique ou l&apos;IA embarquée ?
            </h2>
            <p className="text-color-029 text-base leading-7 max-w-2xl">
              Postulez à la prochaine cohorte ou contactez-nous pour vérifier
              l&apos;adéquation de ce parcours avec votre projet.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                className="inline-block py-4 px-9 rounded-[60px] bg-primary text-color-001 text-[0.9375rem] font-semibold capitalize coursr-pointer"
                href="/postuler"
              >
                Postuler
              </a>
              <a
                className="inline-block py-4 px-9 rounded-[60px] border-2 border-solid border-background text-background text-[0.9375rem] font-semibold capitalize coursr-pointer"
                href="/contact"
              >
                Nous contacter
              </a>
            </div>
            <p className="text-color-028 text-sm">
              Prochaine cohorte : à définir · Tarif : à définir
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
