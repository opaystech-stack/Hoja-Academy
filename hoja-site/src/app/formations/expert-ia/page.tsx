import "../../ditto.css";
import Navbar from "../../sections/navbar";
import PageHero from "../../sections/page-hero";
import Footer from "../../sections/footer";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Expert IA — Maîtriser l'IA pour transformer son travail | HOJA ACADEMY",
  description:
    "Programme Expert IA : IA générative, prompting avancé, agents, workflows, MCP et automatisation. 8 semaines, 16 séances live, zéro prérequis technique.",
};

const apprendre = [
  "Comprendre l'IA générative et son écosystème d'outils.",
  "Prompting avancé : structurer des demandes fiables et reproductibles.",
  "Construire et piloter des agents IA sur des tâches réelles.",
  "Concevoir des workflows IA connectés à vos outils.",
  "Mettre en place un système de travail augmenté : mémoire, contexte, routines.",
  "Configurer outils, connecteurs et MCP pour relier l'IA à vos sources.",
  "Automatiser vos tâches documentaires et opérationnelles.",
  "Installer votre environnement IA personnel de bout en bout.",
];

const pouvoirFaire = [
  "Automatiser des tâches répétitives de votre quotidien professionnel.",
  "Construire un assistant et des workflows adaptés à votre métier.",
  "Vérifier et contrôler les sorties de l'IA avant de les utiliser.",
  "Documenter le retour sur investissement de vos usages en heures gagnées.",
];

const exemples = [
  {
    title: "Synthèse de rapports",
    text: "Transformer un ensemble de documents longs en synthèses structurées, vérifiées puis validées par un humain.",
  },
  {
    title: "Traitement documentaire",
    text: "Extraire, classer et préparer des informations issues de fichiers ou de boîtes de réception volumineuses.",
  },
  {
    title: "Tableau de bord d'analyse",
    text: "Alimenter un tableau de bord à partir de données existantes pour suivre vos indicateurs de pilotage.",
  },
  {
    title: "Assistant métier",
    text: "Un assistant connecté à vos sources internes, avec un contrôle humain systématique sur chaque sortie.",
  },
];

function Section({
  id,
  title,
  intro,
  children,
  tone,
}: {
  id?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  tone?: "light" | "dark" | "soft";
}) {
  const bg =
    tone === "dark"
      ? "bg-color-001 text-background"
      : tone === "soft"
        ? "bg-surface-5"
        : "bg-background";
  return (
    <section className={`${bg} py-16 max-md:py-10`} id={id}>
      <div className="max-w-5xl mx-auto px-6">
        <h2
          className={`text-[1.75rem] max-md:text-xl font-bold pb-2 ${
            tone === "dark" ? "text-background" : "text-color-001"
          }`}
        >
          {title}
        </h2>
        {intro ? (
          <p
            className={`text-base leading-7 pb-8 max-w-3xl ${
              tone === "dark" ? "text-color-029" : "text-muted-foreground"
            }`}
          >
            {intro}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}

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
        eyebrow="FORMATION — EXPERT IA"
        eyebrowRest=""
        title="Maîtriser l'IA pour"
        title2="transformer son travail."
        lead="Un parcours intensif et pratique pour passer de la découverte de l'IA générative à la construction de votre propre système de travail augmenté : agents, workflows, automatisation et contrôle humain."
        ctaLabel="Postuler"
        ctaHref="/postuler"
        kicker="8 semaines · 18 modules · 16 séances live"
        kickerLine="Prochaine cohorte : à définir · Tarif : à définir."
      />

        {/* Pour qui */}
        <Section
          title="Pour qui ?"
          intro="Ce parcours s'adresse à des personnes en activité, pas à des développeurs. Aucun prérequis technique : la logique métier et la régularité du travail priment sur le code."
          tone="soft"
        >
          <ul className="grid md:grid-cols-2 gap-4 text-color-001 text-sm leading-6">
            <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
              <strong>Professionnels en activité</strong> — intégrer l&apos;IA
              dans vos tâches quotidiennes, sans quitter votre poste.
            </li>
            <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
              <strong>Entrepreneurs</strong> — construire vos propres
              assistants et automatisations pour votre activité.
            </li>
            <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
              <strong>Cadres et dirigeants</strong> — comprendre les usages,
              évaluer les opportunités, piloter les projets IA.
            </li>
            <li className="rounded-2xl border-2 border-solid border-border bg-background p-5">
              <strong>Équipes</strong> — déployer des façons de travail
              communes autour de l&apos;IA dans votre service.
            </li>
          </ul>
        </Section>

        {/* Ce que vous allez apprendre */}
        <Section
          title="Ce que vous allez apprendre"
          intro="Le programme couvre l'ensemble de la chaîne : de la compréhension de l'IA générative jusqu'au déploiement d'un environnement de travail complet."
        >
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-color-001 text-sm leading-7">
            {apprendre.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="text-primary-text font-bold shrink-0">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Ce que vous pourrez faire */}
        <Section
          title="Ce que vous pourrez faire"
          intro="L'objectif n'est pas le diplôme : c'est le changement observable dans votre façon de travailler."
          tone="soft"
        >
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
        </Section>

        {/* Approche pédagogique */}
        <Section
          title="Approche pédagogique"
          intro="Vous travaillez sur vos propres documents, vos propres projets et des cas réels. La formation est construite comme une production, pas comme un cours magistral."
        >
          <div className="grid md:grid-cols-2 gap-6 text-sm leading-7 text-color-001">
            <div className="flex flex-col gap-3">
              <h3 className="text-accent font-bold text-base">
                Pratique et accompagnement
              </h3>
              <p>
                Exercices appliqués à votre contexte, production continue de
                livrables réels et accompagnement personnalisé tout au long du
                parcours. Vous apprenez en construisant.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-accent font-bold text-base">
                Structure du parcours
              </h3>
              <p>
                8 semaines, 16 séances live le mardi et le jeudi, un AI Work Kit
                pour installer votre environnement, et une soutenance finale
                devant jury pour valider votre système de travail augmenté.
              </p>
            </div>
          </div>
        </Section>

        {/* Exemples de mise en pratique */}
        <Section
          title="Exemples de mise en pratique"
          intro="Quelques réalisations types, à portée de ce que les participants construisent pendant et après la formation."
          tone="soft"
        >
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
        </Section>

        {/* CTA final */}
        <section className="bg-color-001 py-16 max-md:py-10">
          <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-6 text-center">
            <h2 className="text-background text-[1.75rem] max-md:text-xl font-bold">
              Prêt à transformer votre travail avec l&apos;IA ?
            </h2>
            
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
