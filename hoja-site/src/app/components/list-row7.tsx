import type { ListRow7Styles } from "../_styles";
import { cn } from "../../lib/utils";
export type ListRow7Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow7({ d, styles }: { d: ListRow7Data; styles: ListRow7Styles }) {
  return (
    <li className="flex relative">
      <a className={cn("h-[1.5625rem] flex relative py-3 items-center grow text-background text-[0.875rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap cursor-pointer 2xl:text-[1rem]", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
