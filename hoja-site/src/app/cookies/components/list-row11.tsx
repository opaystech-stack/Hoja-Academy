import type { ListRow11Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow11Data = {
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow11({ d, styles }: { d: ListRow11Data; styles: ListRow11Styles }) {
  return (
    <li className="flex relative min-w-0">
      <a className={cn("flex relative min-w-0 py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.6875rem]", styles.className)} href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
