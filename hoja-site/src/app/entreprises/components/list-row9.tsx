import type { ListRow9Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow9Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow9({ d, styles }: { d: ListRow9Data; styles: ListRow9Styles }) {
  return (
    <li className="flex relative">
      <a className={cn("h-[1.5625rem] flex relative py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer 2xl:text-[0.9375rem]", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
