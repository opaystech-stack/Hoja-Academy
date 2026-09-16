import type { ListRow5Styles } from "../_styles";
import { cn } from "../../lib/utils";
export type ListRow5Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow5({ d, styles }: { d: ListRow5Data; styles: ListRow5Styles }) {
  return (
    <li className="flex relative">
      <a className={cn("flex relative py-4 items-center grow text-background [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap cursor-pointer max-md:text-[0.8125rem] 2xl:text-[0.9375rem]", styles.className)} data-component="link" href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
