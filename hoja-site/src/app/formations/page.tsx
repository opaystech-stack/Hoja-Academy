import "../ditto.css";
import Navbar from "../sections/navbar";
import PageHero from "../sections/page-hero";
import Footer from "../sections/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos domaines de formation — Expert IA, Automatisation, Robotique, Recherche | HOJA ACADEMY",
  description:
    "Hoja Academy, branche académique IA de Hoja Network : quatre domaines de formation pratiques — Expert IA, Automatisation & n8n, Robotique, et IA, Recherche & Sciences.",
};

const domaines = [
  {
    href: "/formations/expert-ia",
    title: "Expert IA",
    tagline: "Maîtriser l'IA pour transformer son travail.",
    description:
      "Le programme fondateur : IA générative, prompting avancé, agents IA, workflows, mémoire, MCP et automatisation — 8 semaines, 18 modules, zéro prérequis technique.",
  },
  {
    href: "/formations/automatisation-n8n",
    title: "Automatisation & n8n",
    tagline: "D'une tâche répétitive à un système qui travaille pour vous.",
    description:
      "Automatisation des processus professionnels avec n8n : workflows, APIs, intégrations, déclencheurs, traitement de données et agents au service de vos opérations.",
  },
  {
    href: "/formations/robotique",
    title: "Robotique",
    tagline: "Comprendre et utiliser les technologies robotiques et l'IA embarquée.",
    description:
      "Une orientation descriptive et appliquée : robotique, IA embarquée, perception, automatisation physique et interaction humain-machine, pour étudiants, ingénieurs et chercheurs.",
  },
  {
    href: "/formations/ia-recherche-sciences",
    title: "IA, Recherche & Sciences",
    tagline: "L'IA comme assistante de la rigueur scientifique.",
    description:
      "Recherche assistée par IA : analyse documentaire, synthèse de sources, analyse de données, vérification et reproductibilité — l'IA assiste, elle ne remplace jamais le chercheur.",
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
        eyebrow="FORMATION EN LIGNE"
        eyebrowRest=" en Intelligence Artificielle"
        title="Nos domaines de"
        title2="formation."
        lead="Quatre domaines pour un même objectif : utiliser l'IA pour travailler, automatiser, rechercher, créer et résoudre de vrais problèmes."
        ctaLabel="Découvrir Expert IA"
        ctaHref="/formations/expert-ia"
        kicker="Hoja Academy — branche académique IA de Hoja Network"
        kickerLine="Programme pratique, cas réels, production."
      />

        {/* Cartes des domaines */}
        <section className="bg-background py-20 max-md:py-12">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-color-001 text-[2.1875rem] max-md:text-2xl font-bold text-center pb-3">
              Quatre domaines, une même approche pratique
            </h2>
            <p className="text-muted-foreground text-base leading-7 text-center max-w-2xl mx-auto pb-10">
              Chaque domaine correspond à un usage concret de l&apos;IA en
              situation professionnelle ou scientifique. Choisissez le parcours
              qui correspond à votre travail, vos projets ou votre organisation.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {domaines.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  className="flex flex-col gap-4 rounded-[38px] border-4 border-solid border-primary p-8 max-md:p-6 cursor-pointer hover:bg-color-038"
                >
                  <div className="text-primary text-xs font-semibold tracking-[0.18em] uppercase">
                    Domaine de formation
                  </div>
                  <div>
                    <h3 className="text-color-001 text-2xl font-bold leading-8">
                      {d.title}
                    </h3>
                    <p className="text-accent font-medium leading-6 pt-1">
                      {d.tagline}
                    </p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-6 grow">
                    {d.description}
                  </p>
                  <span className="text-color-001 text-sm font-semibold">
                    Découvrir la formation →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Rappel programme */}
        <section className="bg-surface-5 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col gap-6 text-center">
            <h2 className="text-color-001 text-[1.75rem] max-md:text-xl font-bold">
              Le socle : le programme Expert IA
            </h2>
            <p className="text-muted-foreground text-base leading-8">
              Le parcours Expert IA est structuré en 8 semaines et 18 modules,
              du fondement à la production d&apos;un système de travail augmenté.
              Les autres domaines déclinent cette approche pratique : cas réels,
              production et accompagnement, appliqués à l&apos;automatisation,
              à la robotique ou à la recherche.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <a
                className="inline-block py-4 px-9 rounded-[60px] bg-primary text-color-001 text-[0.9375rem] font-semibold capitalize cursor-pointer"
                href="/postuler"
              >
                Postuler
              </a>
              <a
                className="inline-block py-4 px-9 rounded-[60px] border-2 border-solid border-accent text-accent text-[0.9375rem] font-semibold capitalize cursor-pointer"
                href="/contact"
              >
                Parler à un conseiller
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
