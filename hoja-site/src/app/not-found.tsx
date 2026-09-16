export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-color-023 px-6 text-center"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <img src="/assets/hoja/hoja-emblem.png" alt="HOJA ACADEMY" width={96} height={96} style={{ maxWidth: 96 }} />
      <h1 className="text-background text-[3.5rem] font-semibold leading-none max-md:text-4xl">404</h1>
      <p className="text-color-008 text-[1.125rem] leading-[1.75rem] max-w-130">
        Cette page n'existe pas ou a été déplacée. Revenez au campus HOJA ACADEMY et poursuivez votre apprentissage.
      </p>
      <div className="flex gap-4 max-md:flex-col">
        <a
          href="/"
          className="rounded-[60px] bg-primary px-7 py-3 text-[0.9375rem] font-semibold text-color-001"
        >
          Retour à l'accueil
        </a>
        <a
          href="/formations"
          className="rounded-[60px] border border-solid border-surface px-7 py-3 text-[0.9375rem] font-semibold text-background"
        >
          Voir les formations
        </a>
      </div>
    </main>
  );
}
