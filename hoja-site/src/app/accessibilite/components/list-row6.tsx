import type { DittoNodeMetaMap } from "../ditto-meta";
import type { ListRow6Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow6Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow6({ d, meta, styles }: { d: ListRow6Data; meta: DittoNodeMetaMap; styles: ListRow6Styles }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="flex relative">
      <a data-ditto-id={meta[1]?.anchor} className={cn("flex relative py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-[0.875rem] leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.875rem] 2xl:text-[1rem]", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
