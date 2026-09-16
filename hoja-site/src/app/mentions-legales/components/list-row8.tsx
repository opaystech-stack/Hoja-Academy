import type { DittoNodeMetaMap } from "../ditto-meta";
import type { ListRow8Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow8Data = {
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow8({ d, meta, styles }: { d: ListRow8Data; meta: DittoNodeMetaMap; styles: ListRow8Styles }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="flex relative min-w-0">
      <a data-ditto-id={meta[1]?.anchor} className={cn("flex relative min-w-0 py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.6875rem]", styles.className)} href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
