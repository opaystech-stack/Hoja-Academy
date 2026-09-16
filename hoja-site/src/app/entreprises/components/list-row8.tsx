import type { DittoNodeMetaMap } from "../ditto-meta";
export type ListRow8Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow8({ d, meta }: { d: ListRow8Data; meta: DittoNodeMetaMap }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="flex relative mx-3 justify-start items-center [word-break:break-word]">
      <a data-ditto-id={meta[1]?.anchor} className="flex justify-start items-center text-color-001 text-[0.8125rem] leading-[1.1875rem] tracking-[0.9px] uppercase coursr-pointer" data-component="link" href={d.href}>
        {" "}
        <span className="block text-background whitespace-nowrap">
          {d.label}
        </span>
        {" "}
      </a>
      {" "}
    </li>
  );
}
