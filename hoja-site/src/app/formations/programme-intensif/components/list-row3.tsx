import type { ListRow3Styles } from "../../../_styles";
import { cn } from "../../../../lib/utils";
export type ListRow3Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow3({ d, styles }: { d: ListRow3Data; styles: ListRow3Styles }) {
  return (
    <li className="block relative">
      <a className={cn("flex relative py-2.5 px-5 justify-center items-center text-color-001 [font-family:Montserrat,_sans-serif] text-[0.9375rem] font-medium leading-[6.3125rem] coursr-pointer max-md:p-0 md:max-lg:px-7 md:max-lg:py-0", styles.className)} href={d.href}>
        {d.label}
      </a>
    </li>
  );
}
