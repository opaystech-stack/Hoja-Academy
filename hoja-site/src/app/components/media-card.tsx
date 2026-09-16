import type { DittoNodeMetaMap } from "../ditto-meta";
import type { ReactNode } from "react";
import type { MediaCardStyles } from "../_styles";
import { cn } from "../../lib/utils";
export type MediaCardData = {
  ariaLabel: string;
  style: string;
  kind?: string;
  height: string;
  viewBox: string;
  width: string;
  icon: ReactNode;
  kind2?: string;
  title: string;
  title2: string;
  description: string;
  ariahidden?: string;
};
/** A card with media + heading. */
export default function MediaCard({ d, meta, styles }: { d: MediaCardData; meta: DittoNodeMetaMap; styles: MediaCardStyles }) {
  return (
    <div data-ditto-id={meta[0]?.anchor} className="w-[379.3px] block relative mr-[2.8125rem] shrink-0 max-md:w-94 md:max-lg:w-[335.5px] 2xl:w-[630.7px]" aria-label={d.ariaLabel} aria-roledescription="slide" role="group" aria-hidden={d.ariahidden}>
      <div data-ditto-id={meta[1]?.anchor} className={cn("h-full flex relative max-w-full px-[4.0625rem] rounded-[44px] flex-col bg-cover [background-position:50%_50%] bg-no-repeat max-md:min-h-87.5 before:content-[''] before:block before:absolute before:inset-0 before:bg-color-001 before:rounded-tl-[44px]", styles.className)} style={d.style}>
        <div data-ditto-id={meta[2]?.anchor} className={cn("w-full flex max-w-151 flex-col justify-start grow gap-5 max-md:max-w-[min(100%,_767px)] max-md:flex-wrap 2xl:justify-center", styles.className2)}>
          <div data-ditto-id={meta[3]?.anchor} className={cn("block relative min-w-0 max-w-full gap-5", styles.className3)}>
            <div data-ditto-id={meta[4]?.anchor} className="block">
              <div data-ditto-id={meta[5]?.anchor} className={cn("flex flex-col max-md:gap-[2.4375rem] 2xl:gap-[2.6875rem]", styles.className4)}>
                <div data-ditto-id={meta[6]?.anchor} className="block shrink-0 leading-0">
                  <span data-ditto-id={meta[7]?.anchor} className={cn("inline-block text-color-001 text-center 2xl:text-[5.25rem] 2xl:leading-21", styles.className5)}>
                    {" "}
                    <svg data-ditto-id={meta[8]?.anchor} className={cn("block relative overflow-hidden 2xl:h-20.5", styles.className6)} data-component={d.kind} height={d.height} viewBox={d.viewBox} width={d.width} xmlns="http://www.w3.org/2000/svg" fill="currentColor">{d.icon}</svg>
                    {" "}
                  </span>
                  {" "}
                </div>
                {" "}
                <div data-ditto-id={meta[9]?.anchor} className="block grow">
                  <h3 data-ditto-id={meta[10]?.anchor} className="block mt-2 mb-4 text-background [font-family:Montserrat,_sans-serif] text-[1.75rem] leading-10 2xl:text-[3rem] 2xl:leading-[3.5625rem]" data-component={d.kind2}>
                    <span data-ditto-id={meta[11]?.anchor} className="inline">
                      {d.title}
                      <br data-ditto-id={meta[12]?.anchor} className="inline" />
                      {d.title2}
                    </span>
                    {" "}
                  </h3>
                  {" "}
                  <p data-ditto-id={meta[13]?.anchor} className="block text-background">
                    {d.description}
                  </p>
                  {" "}
                </div>
                {" "}
              </div>
              {" "}
            </div>
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
