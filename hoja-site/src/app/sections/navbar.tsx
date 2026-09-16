"use client";
import { useEffect, useRef, useState } from "react";

/**
 * HOJA ACADEMY — barre de navigation unifiée (desktop + mobile),
 * même design que le header cloné (pill blanche, tokens du projet).
 * Dropdown Formations : survol desktop avec fermeture différée, clic = verrou,
 * clavier Entrée/Espace/Echap, tactile mobile (accordéon). Les 4 entrées restent
 * toujours lisibles (texte foncé sur fond blanc, actif = souligné vert).
 */
const FORMATIONS = [
  { href: "/formations/expert-ia", label: "Expert IA" },
  { href: "/formations/automatisation-n8n", label: "Automatisation & n8n" },
  { href: "/formations/robotique", label: "Robotique" },
  { href: "/formations/ia-recherche-sciences", label: "IA, Recherche & Sciences" },
];
const NAV = [
  { href: "/entreprises", label: "Entreprises" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [openF, setOpenF] = useState(false); // dropdown desktop
  const [locked, setLocked] = useState(false); // ouvert au clic
  const [mobileOpen, setMobileOpen] = useState(false); // hamburger
  const [mobileF, setMobileF] = useState(false); // accordéon Formations mobile
  const [path, setPath] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const liRef = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPath(window.location.pathname.replace(/\/+$/, "") || "/");
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenF(false); setLocked(false); }
    };
    const onDown = (e: MouseEvent) => {
      if (liRef.current && !liRef.current.contains(e.target as Node)) { setOpenF(false); setLocked(false); }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, []);

  // Desktop : survol avec délai de fermeture (pas de zone morte, le panneau est
  // collé sous le bouton dans le même <li>).
  const hoverIn = () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    if (window.matchMedia("(min-width: 1024px)").matches) setOpenF(true);
  };
  const hoverOut = () => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    if (locked) return;
    timer.current = setTimeout(() => setOpenF(false), 250);
  };
  const toggle = () => {
    // Si le survol a deja ouvert le panneau, le clic ne doit pas le fermer :
    // il le verrouille. Un clic sur un panneau verrouille le referme.
    if (!openF) { setOpenF(true); setLocked(true); }
    else if (locked) { setOpenF(false); setLocked(false); }
    else { setLocked(true); }
  };
  const isF = (href: string) => path === href || path === href + "/";

  return (
    <header className="block before:content-[''] before:table before:w-0 before:h-0" data-ditto-id="style-header">
      <header className={`h-28 min-h-28 flex fixed inset-x-0 z-9999 max-w-full px-[1.6rem] justify-around items-center gap-x-5 max-md:h-17.5 max-md:min-h-17.5 max-md:pt-[1.175rem] max-md:pr-[11.3px] max-md:pl-[1.175rem] max-md:flex-wrap max-lg:justify-center max-lg:items-start max-md:self-start max-md:gap-x-[initial] md:max-lg:pt-[30.7px] md:max-lg:px-[0.9625rem] 2xl:px-[2.4rem] 2xl:justify-between 2xl:gap-x-[initial] transition-colors duration-300 ${scrolled ? "bg-[rgba(9,19,26,0.96)] backdrop-blur-[6px]" : ""}`}>
        {/* Logo */}
        <div className="w-[23.5%] flex relative min-w-0 flex-col justify-center items-start max-md:w-[52%] max-md:z-999 max-md:flex-wrap md:max-lg:w-[47%] 2xl:w-[21%]">
          <a className="inline-block text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] font-medium leading-[1.1875rem] cursor-pointer" href="/" aria-label="Hoja Academy — accueil">
            <img className="w-auto h-11 max-md:h-8 2xl:h-14 inline-block max-w-full overflow-clip object-contain align-middle" alt="" height="81" src="/assets/cloned/images/fa64729e9a88.png" width="800" />
          </a>
        </div>

        {/* Pill desktop */}
        <div className="min-h-[3.5625rem] flex relative rounded-[72px] justify-center items-center gap-1 shrink-0 bg-background max-lg:hidden px-2 2xl:w-187.5">
          <nav aria-label="Menu principal" className="flex">
            <ul className="flex relative z-2 items-center justify-center leading-6 [list-style-type:none] list-outside">
              <li ref={liRef} className="h-12.5 flex relative" onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={openF}
                  onClick={toggle}
                  onKeyDown={(e) => { if (e.key === "ArrowDown") { setOpenF(true); setLocked(true); } }}
                  className="h-12.5 flex relative mx-[0.5px] px-4 items-center text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] leading-12.5 whitespace-nowrap cursor-pointer hover:text-primary-text focus-visible:text-primary-text"
                >
                  Formations
                  <span className={`flex py-2.5 pl-2 items-center transition-transform duration-200 ${openF ? "rotate-180" : ""}`}>
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {openF && (
                  <ul
                    role="group"
                    aria-label="Formations"
                    className="absolute top-full left-1/2 -translate-x-1/2 w-64 rounded-[25px] bg-background py-3 shadow-[0_20px_50px_rgba(12,27,36,0.18)] [list-style-type:none]"
                  >
                    {FORMATIONS.map((f) => (
                      <li key={f.href} className="block relative">
                        <a
                          href={f.href}
                          aria-current={isF(f.href) ? "page" : undefined}
                          className={`flex relative py-[0.8125rem] px-5 items-center text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] font-medium leading-5 whitespace-nowrap cursor-pointer hover:text-primary-text focus-visible:text-primary-text ${isF(f.href) ? "font-bold" : ""}`}
                        >
                          {isF(f.href) && <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-2.5" aria-hidden="true" />}
                          {f.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {NAV.map((n) => (
                <li key={n.href} className="h-12.5 flex relative">
                  <a
                    href={n.href}
                    aria-current={path === n.href ? "page" : undefined}
                    className={`h-12.5 flex relative mx-[0.5px] px-4 items-center text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] leading-12.5 whitespace-nowrap cursor-pointer hover:text-primary-text focus-visible:text-primary-text ${path === n.href ? "font-bold underline decoration-primary underline-offset-8" : ""}`}
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* CTA desktop */}
        <div className="w-[19.925rem] flex relative min-w-0 flex-col items-end gap-5 max-md:hidden md:max-lg:w-[17.8rem] 2xl:w-[313.3px]">
          <a className="inline-block py-[0.9375rem] px-7.5 rounded-[60px] text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] font-semibold leading-[0.9375rem] tracking-[-0.2px] text-center capitalize bg-primary cursor-pointer hover:bg-[#1c8f6a] md:max-lg:text-[0.875rem] 2xl:text-[1.125rem]" href="/postuler">
            Postuler
          </a>
        </div>

        {/* Burger mobile */}
        <div className="hidden max-lg:block relative z-999" >
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex relative min-w-0 min-h-[44px] min-w-[44px] p-[6.5px] rounded-[8px] justify-center items-center text-background bg-[rgba(255,255,255,0.10)] cursor-pointer"
          >
            <span className="block min-w-0 leading-6.5" aria-hidden="true">
              {mobileOpen ? (
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              ) : (
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 2h20M1 8h20M1 14h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              )}
            </span>
          </button>
        </div>

        {/* Panneau mobile plein largeur */}
        {mobileOpen && (
          <nav aria-label="Menu mobile" className="fixed left-0 right-0 top-17.5 z-9998 bg-background px-4 py-4 max-lg:block lg:hidden shadow-[0_24px_48px_rgba(12,27,36,0.25)]">
            <ul className="block [list-style-type:none]">
              <li className="block border-b border-solid border-surface-4">
                <button
                  type="button"
                  aria-expanded={mobileF}
                  onClick={() => setMobileF((o) => !o)}
                  className="w-full flex items-center justify-between py-3.5 text-color-001 [font-family:Montserrat,_sans-serif] text-[1rem] font-medium cursor-pointer"
                >
                  Formations
                  <span className={`inline-flex transition-transform duration-200 ${mobileF ? "rotate-180" : ""}`} aria-hidden="true">
                    <svg width="12" height="7" viewBox="0 0 10 6" fill="none"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </button>
                {mobileF && (
                  <ul className="pb-2 [list-style-type:none]">
                    {FORMATIONS.map((f) => (
                      <li key={f.href}>
                        <a href={f.href} aria-current={isF(f.href) ? "page" : undefined} className={`block py-3 pl-4 text-color-001 text-[0.875rem] ${isF(f.href) ? "font-bold" : ""}`}>
                          {f.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
              {NAV.map((n) => (
                <li key={n.href} className="block border-b border-solid border-surface-4">
                  <a href={n.href} className="block py-3.5 text-color-001 [font-family:Montserrat,_sans-serif] text-[1rem] font-medium">
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="block pt-4">
                <a href="/postuler" className="block py-3.5 rounded-[60px] text-center text-color-001 font-semibold bg-primary">
                  Postuler
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>
      <header className="h-28 min-h-28 flex relative z-9999 invisible max-w-full px-[1.6rem] justify-around items-center gap-x-5 max-md:h-17.5 max-md:min-h-17.5" aria-hidden="true">
        <div className="w-72 h-[34.1px] flex relative min-w-0 flex-col justify-center items-start max-md:w-[11.2125rem]" />
      </header>
    </header>
  );
}
