export type ListRow7Data = {
  text: string;
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow7({ d }: { d: ListRow7Data }) {
  return (
    <li className="list-item">
      <span className="inline">
        {d.text}
        <a className="inline [font-family:Montserrat,_sans-serif] text-[1rem] font-medium leading-[1.1875rem] cursor-pointer" data-component="link" href={d.href}>
          <span className="inline">
            {d.label}
          </span>
        </a>
        {" "}
      </span>
    </li>
  );
}
