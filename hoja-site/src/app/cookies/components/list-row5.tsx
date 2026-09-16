export type ListRow5Data = {
  text: string;
  text2: string;
};
/** A list row. */
export default function ListRow5({ d }: { d: ListRow5Data }) {
  return (
    <li className="list-item">
      <b className="inline font-bold">
        {d.text}
      </b>
      {d.text2}
    </li>
  );
}
