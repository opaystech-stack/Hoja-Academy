import type { DittoNodeMetaMap } from "../ditto-meta";
import type { MediaCardStyles } from "../_styles";
import { cn } from "../../../lib/utils";
export type MediaCardData = {
  alt: string;
  height: string;
  imgSrc: string;
  srcSet: string;
  title: string;
  description: string;
  href: string;
};
/** A card with media + heading. */
export default function MediaCard({ d, meta, styles }: { d: MediaCardData; meta: DittoNodeMetaMap; styles: MediaCardStyles }) {
  return (
    <div data-ditto-id={meta[0]?.anchor} className={cn("h-[469.1px] min-h-25 border border-solid border-surface-4 flex relative min-w-0 mb-2.5 py-[1.5625rem] px-5 rounded-2xl flex-col justify-center shrink-0 gap-5 bg-color-040 shadow-[var(--clr-19)_0px_10px_30px_0px] [animation-name:fadeIn] max-md:flex-wrap md:max-lg:h-[494.1px]", styles.className)}>
      <div data-ditto-id={meta[1]?.anchor} className={cn("block relative min-w-0 max-w-full self-center gap-5 text-center", styles.className2)}>
        <div data-ditto-id={meta[2]?.anchor} className="block">
          <img data-ditto-id={meta[3]?.anchor} className={cn("inline-block max-w-full overflow-clip align-middle", styles.className3)} data-component="image" alt={d.alt} height={d.height} sizes="(max-width: 800px) 100vw, 800px" src={d.imgSrc} srcSet={d.srcSet} width="800" />
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div data-ditto-id={meta[4]?.anchor} className="block relative min-w-0 max-w-full gap-5 text-center">
        <div data-ditto-id={meta[5]?.anchor} className="h-[4.2125rem] block mt-2.5 max-md:h-auto md:max-lg:h-[6.9rem]">
          <div data-ditto-id={meta[6]?.anchor} className="block text-color-016 text-[1.6875rem] font-bold leading-[2.6875rem]" data-component="heading">
            <p data-ditto-id={meta[7]?.anchor} className="block mb-[0.9rem]">
              {d.title}
            </p>
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div data-ditto-id={meta[8]?.anchor} className={cn("block relative min-w-0 max-w-full gap-5 text-color-010 text-[0.9375rem] text-center", styles.className4)}>
        <div data-ditto-id={meta[9]?.anchor} className="block">
          <p data-ditto-id={meta[10]?.anchor} className="block mb-[0.9rem]">
            {d.description}
          </p>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div data-ditto-id={meta[11]?.anchor} className="block relative min-w-0 max-w-full gap-5 text-center">
        <div data-ditto-id={meta[12]?.anchor} className="block">
          <div data-ditto-id={meta[13]?.anchor} className="block">
            <a className="h-[2.9375rem] inline-block p-3.5 rounded-[25px] text-background [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-medium leading-[1.1875rem] bg-color-016 coursr-pointer" data-component="link" href={d.href} target="_blank">
              {" "}
              <span className="flex justify-center gap-[0.3125rem]">
                {" "}
                <span className="block whitespace-nowrap">
                  Voir plus
                </span>
                {" "}
              </span>
              {" "}
            </a>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </div>
  );
}
