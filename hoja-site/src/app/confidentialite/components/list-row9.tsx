import type { ListRow9Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow9Data = {
  ariacurrent?: string;
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow9({ d, styles }: { d: ListRow9Data; styles: ListRow9Styles }) {
  return (
    <li className="flex relative min-w-0">
      <a className={cn("flex relative min-w-0 py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.6875rem]", styles.className)} aria-current={d.ariacurrent} href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
