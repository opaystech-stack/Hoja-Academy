"use client";

import { useRef, useState, useEffect } from "react";
import MediaCard, { MediaCardData } from "./media-card";
import type { DittoNodeMetaMap } from "../ditto-meta";
import type { MediaCardStyles } from "../_styles";

interface WhyHojaCarouselProps {
  cards: MediaCardData[];
  metas: DittoNodeMetaMap[];
  styles: MediaCardStyles[];
}

export default function WhyHojaCarousel({ cards, metas, styles }: WhyHojaCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -420 : 420;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll <= 0) {
        setActiveIndex(0);
        return;
      }
      const itemWidth = maxScroll / (cards.length - 1);
      const index = Math.round(scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(0, index), cards.length - 1));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const itemWidth = maxScroll / (cards.length - 1);
      scrollRef.current.scrollTo({ left: index * itemWidth, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll, { passive: true });
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, [cards.length]);

  return (
    <div className="w-full relative max-w-7xl mx-auto px-4">
      {/* Navigation Arrows */}
      <div className="flex justify-end gap-3 mb-6 px-2">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="w-12 h-12 rounded-full bg-color-001/80 hover:bg-color-001 text-background flex items-center justify-center transition-all cursor-pointer border border-primary/40 hover:scale-105 active:scale-95 shadow-md"
          aria-label="Diapositive précédente"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 1000 1000">
            <path d="M646 125C629 125 613 133 604 142L308 442C296 454 292 471 292 487 292 504 296 521 308 533L604 854C617 867 629 875 646 875 663 875 679 871 692 858 704 846 713 829 713 812 713 796 708 779 692 767L438 487 692 225C700 217 708 204 708 187 708 171 704 154 692 142 675 129 663 125 646 125Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("right")}
          className="w-12 h-12 rounded-full bg-color-001/80 hover:bg-color-001 text-background flex items-center justify-center transition-all cursor-pointer border border-primary/40 hover:scale-105 active:scale-95 shadow-md"
          aria-label="Diapositive suivante"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 1000 1000">
            <path d="M696 533C708 521 713 504 713 487 713 471 708 454 696 446L400 146C388 133 375 125 354 125 338 125 325 129 313 142 300 154 292 171 292 187 292 204 296 221 308 233L563 492 304 771C292 783 288 800 288 817 288 833 296 850 308 863 321 871 338 875 354 875 371 875 388 867 400 854L696 533Z" />
          </svg>
        </button>
      </div>

      {/* Cards Scroll Track */}
      <div
        ref={scrollRef}
        className="w-full flex overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((d, i) => (
          <div key={i} className="snap-start shrink-0">
            <MediaCard d={d} meta={metas[i] || []} styles={styles[i] || styles[0]} />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {cards.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToIndex(i)}
            aria-label={`Aller à la diapositive ${i + 1}`}
            className={`h-3 rounded-full transition-all cursor-pointer ${
              activeIndex === i ? "bg-primary w-8" : "bg-color-001/40 w-3 hover:bg-color-001/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
