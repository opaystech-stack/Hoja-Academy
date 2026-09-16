import "../ditto.css";
import Navbar from "../sections/navbar";
import PageHero from "../sections/page-hero";
import Footer from "../sections/footer";
import { CandidatureForm } from "../components/mailto-forms";

export const metadata = {
  title: "Postuler à HOJA ACADEMY — Candidature",
  description:
    "Postulez à HOJA ACADEMY, la branche académique IA de Hoja Network : candidature, échange de validation, puis inscription.",
};

const cardCls =
  "w-full rounded-[38px] p-8 max-md:p-5 bg-color-001/5 border border-solid border-color-001/15";

export default function PostulerPage() {
  return (
    <>
      <Navbar />
      <main
        className="block [font-family:Montserrat,_sans-serif]"
        id="content"
      >
        {/* Hero */}
        <PageHero
        eyebrow="HOJA ACADEMY"
        eyebrowRest=" — CANDIDATURE"
        title="Postuler à"
        title2="Hoja Academy."
        lead="Chaque candidature ouvre un échange avec l'équipe pédagogique. C'est avec vous que nous décidons si une formation correspond à votre projet."
        ctaLabel="Formulaire de candidature"
        ctaHref="#formulaire-candidature"
        kicker="Expert IA · Automatisation & n8n · Robotique · IA, Recherche & Sciences"
        kickerLine="Prochaine cohorte : date à définir."
      />
        {/* Pourquoi postuler */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[2.25rem] max-md:text-[1.375rem] font-bold mb-6">
              Pourquoi postuler
            </h2>
            <ul className="list-disc pl-6 flex flex-col gap-3 text-foreground text-[1.125rem] max-md:text-[1rem] leading-7">
              <li>
                Des formations en IA appliquées à de vrais problèmes
                professionnels et scientifiques.
              </li>
              <li>Un accompagnement personnalisé, dispensé en temps réel.</li>
              <li>
                Un parcours adapté à votre contexte : individuel, équipe,
                entreprise, institution ou recherche.
              </li>
              <li>
                Une passerelle directe vers l&apos;équipe pédagogique pour
                cadrer votre projet avant toute inscription.
              </li>
            </ul>
          </div>
        </section>
        {/* Pour qui */}
        <section className="py-16 max-md:py-10 bg-background/60">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[2.25rem] max-md:text-[1.375rem] font-bold mb-6">
              Pour qui
            </h2>
            <ul className="list-disc pl-6 flex flex-col gap-3 text-foreground text-[1.125rem] max-md:text-[1rem] leading-7">
              <li>
                Professionnels qui veulent intégrer l&apos;IA à leur travail
                quotidien.
              </li>
              <li>
                Équipes et entreprises qui souhaitent automatiser des
                processus.
              </li>
              <li>
                Institutions et organisations qui préparent un projet de
                formation.
              </li>
              <li>
                Chercheurs et scientifiques qui veulent utiliser l&apos;IA dans
                leurs travaux.
              </li>
            </ul>
          </div>
        </section>
        {/* Comment fonctionne la candidature */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-color-001 text-[2.25rem] max-md:text-[1.375rem] font-bold mb-6">
              Comment fonctionne la candidature
            </h2>
            <ol className="list-decimal pl-6 flex flex-col gap-4 text-foreground text-[1.125rem] max-md:text-[1rem] leading-7">
              <li>
                <strong className="font-semibold">Candidature</strong> — vous
                remplissez le formulaire ci-dessous (ou nous écrivez
                directement) : votre messagerie s&apos;ouvre avec un e-mail
                prérempli.
              </li>
              <li>
                <strong className="font-semibold">Échange de validation</strong>{" "}
                — l&apos;équipe vous contacte pour comprendre votre projet et
                vérifier qu&apos;une formation ouverte lui correspond.
              </li>
              <li>
                <strong className="font-semibold">Inscription</strong> — si
                l&apos;échange est concluant, votre inscription est finalisée
                avec l&apos;équipe pédagogique.
              </li>
            </ol>
            <p className="mt-6 text-foreground/80 text-[1rem] leading-7">
              Aucune condition d&apos;admission n&apos;est imposée à ce stade :
              la candidature ouvre un échange, elle ne garantit pas une place.
            </p>
          </div>
        </section>
        {/* Formulaire de candidature */}
        <section className="py-16 max-md:py-10 bg-background/60">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-color-001 text-[2.25rem] max-md:text-[1.375rem] font-bold mb-4">
              Formulaire de candidature
            </h2>
            <p className="mb-8 text-foreground/80 text-[1rem] leading-7">
              Ce site ne dispose d&apos;aucun serveur : le formulaire ne
              transmet rien tout seul. À la validation, votre messagerie
              s&apos;ouvre avec un e-mail prérempli — aucune donnée
              n&apos;est stockée sur ce site.
            </p>
            <div className={cardCls}>
              <CandidatureForm />
            </div>
          </div>
        </section>
        {/* Cohorte, tarif, liens */}
        <section className="py-16 max-md:py-10">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap gap-8 max-md:flex-col">
              <div className="flex-1 min-w-[260px]">
                <h3 className="text-color-001 text-[1.375rem] font-bold mb-2 uppercase">
                  Prochaine cohorte
                </h3>
                <p className="text-foreground text-[1.125rem] max-md:text-[1rem] leading-7">
                  Date à définir — écrivez-nous pour être tenu informé.
                </p>
              </div>
              <div className="flex-1 min-w-[260px]">
                <h3 className="text-color-001 text-[1.375rem] font-bold mb-2 uppercase">
                  Tarif
                </h3>
                <p className="text-foreground text-[1.125rem] max-md:text-[1rem] leading-7">
                  À définir — communiqué lors de l&apos;échange de validation.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-12 max-md:flex-col max-md:items-start">
              <a
                className="inline-block py-[0.9375rem] px-7.5 rounded-[60px] text-color-001 text-[1rem] font-semibold text-center bg-primary cursor-pointer"
                href="/contact"
              >
                Une question ? Contactez-nous
              </a>
              <a
                className="inline-block py-[0.9375rem] px-7.5 rounded-[60px] text-color-001 text-[1rem] font-semibold text-center border border-solid border-color-001/30 cursor-pointer"
                href="https://hojanetwork.org"
                target="_blank"
                rel="noopener"
              >
                Hoja Network — l'organisation dont est issue Hoja Academy
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
