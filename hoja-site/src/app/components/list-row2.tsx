import type { DittoNodeMetaMap } from "../ditto-meta";
import type { ListRow2Styles } from "../_styles";
import { cn } from "../../lib/utils";
export type ListRow2Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow2({ d, meta, styles }: { d: ListRow2Data; meta: DittoNodeMetaMap; styles: ListRow2Styles }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="flex relative">
      <a data-ditto-id={meta[1]?.anchor} className={cn("h-12.5 flex relative px-4 items-center grow text-color-001 [font-family:Montserrat,_sans-serif] text-[0.875rem] leading-12.5 whitespace-nowrap text-nowrap cursor-pointer 2xl:px-5 2xl:text-[1rem] before:content-[''] before:block before:absolute before:inset-0 before:-z-1 before:h-12.5 before:bg-color-001 before:opacity-0 before:rounded-tl-4xl max-lg:before:h-auto 2xl:before:rounded-tl-[43px] after:content-[''] after:block after:absolute after:inset-y-[1.5625rem] after:left-4 after:w-0 after:h-0 after:bg-color-001 after:opacity-0 max-lg:after:inset-auto max-lg:after:w-auto max-lg:after:h-auto 2xl:after:left-5", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
