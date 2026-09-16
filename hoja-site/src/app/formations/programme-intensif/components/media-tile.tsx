import type { ReactNode } from "react";
import type { MediaTileStyles } from "../../../_styles";
import { cn } from "../../../../lib/utils";
export type MediaTileData = {
  height: string;
  viewBox: string;
  width: string;
  icon: ReactNode;
  text: string;
  description: string;
};
/** A media tile. */
export default function MediaTile({ d, styles }: { d: MediaTileData; styles: MediaTileStyles }) {
  return (
    <div className="w-full flex relative min-w-0 flex-col items-end gap-5 max-md:flex-wrap">
      <div className="w-full flex relative min-w-0 flex-col gap-5 max-md:flex-wrap">
        <div className="block relative min-w-0 max-w-full gap-5">
          <div className="border-b border-solid border-b-foreground block pb-3">
            <ul className="block [list-style-type:none] list-outside">
              <li className="flex relative items-center">
                <span className="flex relative">
                  {" "}
                  <svg className={cn("w-auto h-[1.5625rem] block mr-[6.3px] overflow-hidden", styles.className)} data-component="icon" height={d.height} viewBox={d.viewBox} width={d.width} xmlns="http://www.w3.org/2000/svg" fill="currentColor">{d.icon}</svg>
                  {" "}
                </span>
                {" "}
                <span className="block pl-[0.3125rem] self-center text-color-001 font-medium 2xl:text-[1.875rem]">
                  {d.text}
                </span>
                {" "}
              </li>
            </ul>
            {" "}
          </div>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
      <div className="block relative min-w-0 max-w-full gap-5 text-color-001 text-base leading-[1.3125rem] 2xl:[font-size:inherit] 2xl:leading-[inherit]">
        <div className="block">
          <p className="block mb-[0.9rem]">
            {d.description}
          </p>
          {" "}
        </div>
        {" "}
      </div>
      {" "}
    </div>
  );
}
