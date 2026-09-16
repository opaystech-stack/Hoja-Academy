"use client";
import { useEffect } from "react";

type CapStyle = Record<string, string>;
type RTTab = { trigger: string; panel: string; triggerOn: CapStyle; triggerOff: CapStyle; panelShown: CapStyle; panelHidden: CapStyle; descendants?: Record<string, CapStyle> };
type RTAcc = { trigger: string; region: string; expanded: boolean; triggerOn: CapStyle; triggerOff: CapStyle; regionShown: CapStyle; regionHidden: CapStyle };
type RTDisc = { trigger: string; panel: string; isDialog: boolean; hoverOpen: boolean; backdropClose: boolean; closes: string[]; triggerOn: CapStyle; triggerOff: CapStyle; panelShown: CapStyle; panelHidden: CapStyle; shownBox?: unknown; descendants?: Record<string, CapStyle> };
export type Spec =
  | { kind: "tabs"; active: number; tabs: RTTab[] }
  | { kind: "accordion"; items: RTAcc[] }
  | { kind: "carousel"; track: string; next: string | null; prev: string | null; bullets: string[]; base: number; transforms: string[]; bulletOn: CapStyle; bulletOff: CapStyle }
  | { kind: "disclosure"; items: RTDisc[] };

const kebab = (p: string) => p.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
const byDittoId = (id: string): HTMLElement | null => document.querySelector('[data-ditto-id="' + id + '"]');
function applyStyle(el: HTMLElement | null, s: CapStyle) {
  if (!el) return;
  for (const k in s) el.style.setProperty(kebab(k), s[k]);
}
// Apply a panel's open-state descendant overrides (anchor → style). Reveals content whose
// visibility is gated by a JS-toggled class the clone doesn't carry (e.g. Elementor
// e-active). Applied only when the panel is shown; the panel's own hide masks it.
function applyDesc(d?: Record<string, CapStyle>) {
  if (!d) return;
  for (const anchor in d) applyStyle(byDittoId(anchor), d[anchor]);
}

/** Reproduces a captured interactive pattern by toggling captured inline styles on
 *  the existing DOM nodes (found by data-ditto-id). Renders nothing, and applies NOTHING
 *  on mount: the server-rendered markup + per-node CSS already reproduce the captured
 *  base state exactly, so state styles are applied only on user interaction. */
export default function DittoWire({ spec }: { spec: Spec }) {
  useEffect(() => {
    const ac = new AbortController();
    const { signal } = ac;
    if (spec.kind === "tabs") {
      let active = spec.active;
      const render = () => spec.tabs.forEach((t, i) => {
        const on = i === active;
        const trig = byDittoId(t.trigger), panel = byDittoId(t.panel);
        applyStyle(trig, on ? t.triggerOn : t.triggerOff);
        trig?.setAttribute("aria-selected", on ? "true" : "false");
        if (trig) (trig as HTMLElement).tabIndex = on ? 0 : -1;
        applyStyle(panel, on ? t.panelShown : t.panelHidden);
        if (on) applyDesc(t.descendants);
        if (panel) { if (on) { panel.removeAttribute("hidden"); } else { panel.setAttribute("hidden", ""); } }
      });
      spec.tabs.forEach((t, i) => {
        const trig = byDittoId(t.trigger);
        if (!trig) return;
        trig.addEventListener("click", (e) => { e.preventDefault(); active = i; render(); }, { signal });
        trig.addEventListener("keydown", (e) => {
          const k = (e as KeyboardEvent).key;
          if (k === "ArrowRight" || k === "ArrowLeft") {
            e.preventDefault();
            active = (active + (k === "ArrowRight" ? 1 : spec.tabs.length - 1)) % spec.tabs.length;
            render();
            byDittoId(spec.tabs[active].trigger)?.focus();
          }
        }, { signal });
      });
      // No initial render() — the static base state is already correct.
    } else if (spec.kind === "accordion") {
      const state = spec.items.map((it) => it.expanded);
      const renderItem = (i: number) => {
        const it = spec.items[i], on = state[i];
        const trig = byDittoId(it.trigger), region = byDittoId(it.region);
        applyStyle(trig, on ? it.triggerOn : it.triggerOff);
        trig?.setAttribute("aria-expanded", on ? "true" : "false");
        applyStyle(region, on ? it.regionShown : it.regionHidden);
        if (region) { if (on) { region.removeAttribute("hidden"); } else { region.setAttribute("hidden", ""); } }
      };
      spec.items.forEach((it, i) => {
        const trig = byDittoId(it.trigger);
        if (trig) trig.addEventListener("click", (e) => { e.preventDefault(); state[i] = !state[i]; renderItem(i); }, { signal });
      });
      // No initial renderItem — the static base state is already correct.
    } else if (spec.kind === "carousel") {
      // Carousel: move the track's transform between captured per-index positions.
      const n = spec.transforms.length;
      let index = spec.base;
      const track = byDittoId(spec.track);
      const go = (k: number) => {
        index = Math.max(0, Math.min(n - 1, k));
        if (track) track.style.transform = spec.transforms[index];
        spec.bullets.forEach((b, bi) => applyStyle(byDittoId(b), bi === index ? spec.bulletOn : spec.bulletOff));
      };
      const nextEl = spec.next ? byDittoId(spec.next) : null;
      const prevEl = spec.prev ? byDittoId(spec.prev) : null;
      nextEl?.addEventListener("click", (e) => { e.preventDefault(); go(index + 1); }, { signal });
      prevEl?.addEventListener("click", (e) => { e.preventDefault(); go(index - 1); }, { signal });
      spec.bullets.forEach((b, bi) => byDittoId(b)?.addEventListener("click", (e) => { e.preventDefault(); go(bi); }, { signal }));
      // No initial go() — the static base state is already correct.
    } else {
      // Disclosure: dropdown / mega-menu / modal — a trigger reveals a hidden overlay.
      spec.items.forEach((it) => {
        const trig = byDittoId(it.trigger), panel = byDittoId(it.panel);
        if (!trig || !panel) return;
        let open = false;
        let source: "hover" | "click" | null = null;
        const set = (o: boolean, from: "hover" | "click" | null = null) => {
          open = o;
          source = o ? (from ?? source) : null;
          applyStyle(trig, o ? it.triggerOn : it.triggerOff);
          trig.setAttribute("aria-expanded", o ? "true" : "false");
          applyStyle(panel, o ? it.panelShown : it.panelHidden);
          if (o) applyDesc(it.descendants);
          if (o) panel.removeAttribute("hidden"); else panel.setAttribute("hidden", "");
        };
        // Clic = "sticky" : un clic ouvre (et verrouille, meme si la souris quitte) ;
        // un second clic referme. Le survol simple ne verrouille pas.
        trig.addEventListener("click", (e) => {
          e.preventDefault();
          if (it.isDialog) { set(true, "click"); return; }
          if (open && source === "click") { set(false); }
          else { set(true, "click"); }
        }, { signal });
        // Zone englobante = le <li> parent : inclut declencheur ET panneau, donc le trajet
        // souris bouton->menu ne traverse aucune zone morte.
        const host = trig.closest("li") || trig.parentElement || trig;
        const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;
        let closeTimer: ReturnType<typeof setTimeout> | null = null;
        const holdOpen = () => { if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; } };
        if (it.hoverOpen || !it.isDialog) {
          // Hover-intent desktop : ouverture immediate, fermeture retardee de 250ms
          // (tolere le deplacement du curseur vers le panneau).
          host.addEventListener("mouseenter", () => { if (isDesktop()) { holdOpen(); if (!open) set(true, "hover"); } }, { signal });
          host.addEventListener("mouseleave", () => { if (isDesktop() && source === "hover") { holdOpen(); closeTimer = setTimeout(() => set(false), 250); } }, { signal });
        }
        // Fermeture au clic exterieur (sauf modale backdrop) et a la sortie de focus clavier.
        if (!it.isDialog) {
          document.addEventListener("mousedown", (e) => { if (open && host && !host.contains(e.target as Node)) { holdOpen(); set(false); } }, { signal });
          host.addEventListener("focusout", (e) => { if (!isDesktop()) return; const to = e.relatedTarget as Node | null; if (to && host && host.contains(to)) { holdOpen(); } else { holdOpen(); closeTimer = setTimeout(() => set(false), 250); } }, { signal });
        }
        it.closes.forEach((c) => byDittoId(c)?.addEventListener("click", (e) => { e.preventDefault(); set(false); }, { signal }));
        if (it.backdropClose) panel.addEventListener("click", (e) => { if (e.target === panel) set(false); }, { signal });
        document.addEventListener("keydown", (e) => { if ((e as KeyboardEvent).key === "Escape" && open) { set(false); (trig as HTMLElement).focus(); } }, { signal });
      });
      // No initial set() — the static base state is already correct.
    }
    return () => ac.abort();
  }, [spec]);
  return null;
}
