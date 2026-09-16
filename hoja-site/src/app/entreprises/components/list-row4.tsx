import type { ListRow4Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow4Data = {
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow4({ d, styles }: { d: ListRow4Data; styles: ListRow4Styles }) {
  return (
    <li className="h-12.5 flex relative max-lg:hidden">
      <a className={cn("h-12.5 flex relative px-4 items-center grow [font-family:Montserrat,_sans-serif] text-sm leading-12.5 whitespace-nowrap text-nowrap coursr-pointer max-lg:hidden 2xl:px-5 2xl:text-[1rem] before:content-[''] before:block before:absolute before:inset-0 before:-z-1 before:h-12.5 before:bg-color-001 before:rounded-tl-4xl max-lg:before:h-auto 2xl:before:rounded-tl-[43px] after:content-[''] after:block after:absolute after:inset-y-[1.5625rem] after:left-4 after:w-0 after:h-0 after:bg-color-001 max-lg:after:inset-auto max-lg:after:w-auto max-lg:after:h-auto 2xl:after:left-5", styles.className)} href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
