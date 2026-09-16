import type { DittoNodeMetaMap } from "../ditto-meta";
export type ListRow6Data = {
  description: string;
};
/** A list row. */
export default function ListRow6({ d, meta }: { d: ListRow6Data; meta: DittoNodeMetaMap }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="list-item">
      <p data-ditto-id={meta[1]?.anchor} className="block mb-[0.9rem]">
        {d.description}
      </p>
    </li>
  );
}
