import type { ListRow10Styles } from "../_styles";
import { cn } from "../../../lib/utils";
export type ListRow10Data = {
  href: string;
  label: string;
  ariacurrent?: string;
};
/** A list row. */
export default function ListRow10({ d, styles }: { d: ListRow10Data; styles: ListRow10Styles }) {
  return (
    <li className="flex relative">
      <a className={cn("h-[1.5625rem] flex relative py-3 items-center grow text-background text-[0.8125rem] leading-px tracking-[0.1px] whitespace-nowrap text-nowrap coursr-pointer 2xl:text-[0.9375rem]", styles.className)} data-component="link" href={d.href} aria-current={d.ariacurrent}>
        {d.label}
      </a>
    </li>
  );
}
