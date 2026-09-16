import type { DittoNodeMetaMap } from "../../../ditto-meta";
import type { ListRowStyles } from "../../../_styles";
import { cn } from "../../../../lib/utils";
export type ListRowData = {
  ariacurrent?: string;
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow({ d, meta, styles }: { d: ListRowData; meta: DittoNodeMetaMap; styles: ListRowStyles }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="block relative">
      <a className={cn("border-l-8 border-solid border-l-clr-0 flex relative py-[0.8125rem] px-5 items-center grow [font-family:Montserrat,_sans-serif] text-[1rem] font-medium leading-5 whitespace-nowrap text-nowrap cursor-pointer", styles.className)} aria-current={d.ariacurrent} href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
