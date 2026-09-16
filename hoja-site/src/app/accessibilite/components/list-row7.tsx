export type ListRow7Data = {
  href: string;
  label: string;
};
/** A list row. */
export default function ListRow7({ d }: { d: ListRow7Data }) {
  return (
    <li className="flex relative mx-3 justify-start items-center [word-break:break-word]">
      <a className="flex justify-start items-center text-color-001 text-[0.8125rem] leading-[1.1875rem] tracking-[0.9px] uppercase cursor-pointer" data-component="link" href={d.href}>
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
