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
      <a data-ditto-id={meta[1]?.anchor} className={cn("flex relative py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:text-[0.8125rem] 2xl:text-[0.9375rem]", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
