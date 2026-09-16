import type { DittoNodeMetaMap } from "../../../ditto-meta";
import type { ReactNode } from "react";
import type { MediaCardStyles } from "../../../_styles";
import { cn } from "../../../../lib/utils";
export type MediaCardData = {
  ariaLabel: string;
  height?: string;
  viewBox: string;
  width?: string;
  icon: ReactNode;
  title: string;
  description: string;
  ariahidden?: string;
};
/** A card with media + heading. */
export default function MediaCard({ d, meta, styles }: { d: MediaCardData; meta: DittoNodeMetaMap; styles: MediaCardStyles }) {
  return (
    <div data-ditto-id={meta[0]?.anchor} className="w-114 block relative mr-[2.8125rem] shrink-0 max-md:w-[18.4375rem] max-lg:mr-[1.0625rem] md:max-lg:w-167 2xl:w-[576.7px]" aria-label={d.ariaLabel} aria-roledescription="slide" role="group">
      <div data-ditto-id={meta[1]?.anchor} className={cn("h-full min-h-42 flex relative max-w-full rounded-[44px] flex-col 2xl:min-h-87.5 2xl:px-[4.0625rem] before:content-[''] before:block before:absolute before:inset-0 before:rounded-tl-[44px]", styles.className)}>
        <div data-ditto-id={meta[2]?.anchor} className={cn("w-full h-full flex max-w-151 flex-col justify-center grow gap-5 max-md:max-w-[min(100%,_767px)] max-md:flex-wrap", styles.className2)}>
          <div data-ditto-id={meta[3]?.anchor} className={cn("w-full block relative min-w-0 max-w-full gap-5", styles.className3)}>
            <div data-ditto-id={meta[4]?.anchor} className="block">
              <div data-ditto-id={meta[5]?.anchor} className={cn("flex flex-col", styles.className4)}>
                <div data-ditto-id={meta[6]?.anchor} className="block shrink-0 leading-0">
                  <span data-ditto-id={meta[7]?.anchor} className={cn("inline-block text-[4rem] leading-16 text-center max-md:text-[2.875rem] max-md:leading-11.5 2xl:text-[5.125rem] 2xl:leading-20.5", styles.className5)}>
                    {" "}
                    <svg data-ditto-id={meta[8]?.anchor} className={cn("h-16 block relative overflow-hidden max-md:h-11.5 2xl:h-20.5", styles.className6)} data-component="image" height={d.height} viewBox={d.viewBox} width={d.width} xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden={d.ariahidden}>{d.icon}</svg>
                    {" "}
                  </span>
                  {" "}
                </div>
                {" "}
                <div data-ditto-id={meta[9]?.anchor} className="block grow">
                  <h3 data-ditto-id={meta[10]?.anchor} className={cn("block mt-2 [font-family:Montserrat,_sans-serif] text-[1.5625rem] leading-10 max-md:[font-size:inherit] 2xl:text-[2.1875rem] 2xl:leading-[3.5625rem]", styles.className7)} data-component="heading">
                    <span data-ditto-id={meta[11]?.anchor} className="inline">
                      {d.title}
                    </span>
                    {" "}
                  </h3>
                  {" "}
                  <p data-ditto-id={meta[12]?.anchor} className={cn("block text-lg leading-6.5 max-md:text-base 2xl:[font-size:inherit] 2xl:leading-[inherit]", styles.className8)}>
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
