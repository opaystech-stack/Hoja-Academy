import type { DittoNodeMetaMap } from "../ditto-meta";
export type ListRow6Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow6({ d, meta }: { d: ListRow6Data; meta: DittoNodeMetaMap }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="flex relative mx-3 justify-start items-center [word-break:break-word]">
      <a data-ditto-id={meta[1]?.anchor} className="flex justify-start items-center text-color-001 text-[0.875rem] leading-[1.1875rem] tracking-[0.9px] uppercase cursor-pointer" data-component="link" href={d.href}>
        {" "}
        <span data-ditto-id={meta[2]?.anchor} className="block text-background whitespace-nowrap">
          {d.label}
        </span>
        {" "}
      </a>
      {" "}
    </li>
  );
}
