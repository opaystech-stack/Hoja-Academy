import type { DittoNodeMetaMap } from "../ditto-meta";
export type ListRow6Data = {
  text: string;
  text2: string;
  text3: string;
};
/** A list row. */
export default function ListRow6({ d, meta }: { d: ListRow6Data; meta: DittoNodeMetaMap }) {
  return (
    <li data-ditto-id={meta[0]?.anchor} className="list-item">
      <b data-ditto-id={meta[1]?.anchor} className="inline font-bold">
        {d.text}
      </b>
      {d.text2}
      <b data-ditto-id={meta[2]?.anchor} className="inline font-bold">
        {d.text3}
      </b>
      .
    </li>
  );
}
