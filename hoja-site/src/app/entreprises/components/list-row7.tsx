import type { ListRow7Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow7Data = {
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow7({ d, styles }: { d: ListRow7Data; styles: ListRow7Styles }) {
  return (
    <li className="flex relative">
      <a className={cn("flex relative py-4 items-center grow [font-family:Montserrat,_sans-serif] text-sm leading-0 whitespace-nowrap text-nowrap coursr-pointer max-md:text-[0.8125rem] 2xl:text-[0.9375rem]", styles.className)} data-component="link" href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
