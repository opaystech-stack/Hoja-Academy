import type { ListRow10Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow10Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow10({ d, styles }: { d: ListRow10Data; styles: ListRow10Styles }) {
  return (
    <li className="flex relative min-w-0">
      <a className={cn("flex relative min-w-0 py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.6875rem]", styles.className)} href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
